import {
    CanvasTexture,
    TextureLoader,
    PlaneGeometry,
    ShaderMaterial,
    InstancedMesh,
    Object3D,
    Vector2,
    InstancedBufferAttribute,
    PerspectiveCamera,
    WebGLRenderer,
    PCFSoftShadowMap,
    Scene,
    Color
} from "three";
import Stats from "three/examples/jsm/libs/stats.module.js";
import { GUI } from "dat.gui";

function createRandom(min = 0, max = 1) {
    return Math.random() * (max - min) + min;
}
function resize(render, cameras, callback) {
    cameras = Array.isArray(cameras) ? cameras : [cameras];
    window.addEventListener("resize", () => {
        const [w, h] = [window.innerWidth, window.innerHeight];
        render.setSize(window.innerWidth, window.innerHeight);
        cameras.forEach((camera) => {
            if (camera.type === "OrthographicCamera") {
                camera.top = 15 * (h / w);
                camera.bottom = -15 * (h / w);
            } else if (camera.type === "PerspectiveCamera") {
                camera.aspect = window.innerWidth / window.innerHeight;
            }
            camera.updateProjectionMatrix();
        });
        callback && callback(w, h);
    });
}
function initStats(showPanel = 0) {
    const stats = new Stats();
    stats.showPanel(showPanel);
    const dom = document.querySelector("#box");
    dom.appendChild(stats.dom);
    return stats;
}
function initRenderer(props = {}) {
    const dom = document.getElementById("box");
    dom.style.width = "100vw";
    dom.style.height = "100vh";

    const renderer = new WebGLRenderer({ antialias: true, ...props });
    renderer.shadowMap.enabled = true;
    renderer.shadowMapSoft = true;
    renderer.shadowMap.type = PCFSoftShadowMap;
    renderer.setPixelRatio(devicePixelRatio);

    renderer.setClearColor(new Color(0xffffff));
    renderer.setSize(dom.offsetWidth, dom.offsetHeight);

    dom.appendChild(renderer.domElement);
    window.renderer = renderer;

    return renderer;
}
function initGUI(params) {
    return new GUI(params);
}
function initScene() {
    const scene = new Scene();
    window.scene = scene;
    return scene;
}
window.onload = () => {
    init();
};

const vs = /* glsl */ `
  varying vec2 vUv;
  void main(){
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0);
  }
  `;

const fs = /* glsl */ `
  varying vec2 vUv;
  uniform sampler2D map;
  uniform float fogNear;
  uniform float fogFar;
  uniform vec3 fogColor;
  uniform int enableFog; // 0: false, 1: true
  
  void main(){
    if(enableFog == 1){
      // 计算片源深度 
      float depth = gl_FragCoord.z / gl_FragCoord.w;
      // 计算归一化的深度
      float fogFactor = smoothstep(fogNear, fogFar, depth);
      // 计算雾透明度
      gl_FragColor.w *= pow(gl_FragCoord.z, 20.0);
      // 最终结果
      gl_FragColor = mix(texture2D(map, vUv), vec4(fogColor, gl_FragColor.w), fogFactor);
    }else{
      gl_FragColor = texture2D(map, vUv);
    }
  }
  `

async function init() {
    const dummy = new Object3D();
    const mouse = new Vector2();
    const halfSize = new Vector2(window.innerWidth / 2, window.innerHeight / 2);
    const startTime = Date.now();
    const params = {
        count: 800,
        enableFog: true,
        fogColor: '#4584b4',
        fogNear: -100,
        fogFar: 3000,
    };


    const renderer = initRenderer();
    const camera = new PerspectiveCamera(30, halfSize.x / halfSize.y, 1, params.count * 1.5);
    window.camera = camera;

    const status = initStats();
    const scene = initScene();

    // background
    const backgroundCanvas = document.createElement("canvas");
    const ctx = backgroundCanvas.getContext("2d");
    const gradient = ctx.createLinearGradient(0, 0, 0, backgroundCanvas.height);
    gradient.addColorStop(0, "#1e4877");
    gradient.addColorStop(0.5, "#4584b4");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, backgroundCanvas.width, backgroundCanvas.height);

    const bgTexture = new CanvasTexture(backgroundCanvas);
    scene.background = bgTexture;

    // cloud
    const loader = new TextureLoader();
    const cloudTexture = await loader.loadAsync(
        FILE_HOST + 'images/channels/cloud.png'
    );

    const geometry = new PlaneGeometry(64, 64);
    const material = new ShaderMaterial({
        uniforms: {
            map: {
                value: cloudTexture,
            },
            fogColor: {
                value: new Color(params.fogColor),
            },
            fogNear: {
                value: params.fogNear,
            },
            fogFar: {
                value: params.fogFar,
            },
            enableFog: {
                value: Number(params.enableFog),
            }
        },
        vertexShader: vs,
        fragmentShader: fs,
        depthWrite: false,
        depthTest: false,
        transparent: true,
    });

    const mesh = new InstancedMesh(geometry, material, params.count);
    scene.add(mesh);


    function updateMeshCount() {
        const count = params.count;
        mesh.count = count;
        mesh.dispose();
        mesh.instanceMatrix = new InstancedBufferAttribute(
            new Float32Array(count * 16),
            16
        );

        for (let j = 0, k = count; j < k; j++) {
            dummy.position.x = createRandom(-500, 500);
            dummy.position.y = -Math.random() * Math.random() * 200 - 15;
            dummy.position.z = j;
            dummy.rotation.z = Math.random() * Math.PI;
            dummy.scale.x = dummy.scale.y = Math.random() * Math.random() * 1.5 + 0.5;
            dummy.updateMatrix();
            mesh.setMatrixAt(j, dummy.matrix);
        }

        mesh.instanceMatrix.needsUpdate = true;
        camera.position.z = count;
        camera.far = count * 1.5;
        camera.updateProjectionMatrix();
    }

    updateMeshCount();

    function render() {
        camera.position.x += (mouse.x - camera.position.x) * 0.01;
        camera.position.y += (-mouse.y - camera.position.y) * 0.01;
        camera.position.z = -((Date.now() - startTime) * 0.03) % params.count + params.count;

        renderer.render(scene, camera);
        status.update();
        requestAnimationFrame(render);
    }
    render();


    renderer.domElement.addEventListener("mousemove", ({ clientX, clientY }) => {
        mouse.set(
            (clientX - halfSize.x) * 0.25,
            (clientY - halfSize.y) * 0.15
        );
    })

    resize(renderer, [camera], () => {
        halfSize.set(window.innerWidth / 2, window.innerHeight / 2);
    })

    // gui
    const gui = initGUI();

    gui.add(params, "count", 0, 10000).onChange(updateMeshCount).name("Count");
    const enableFogOption = gui.add(params, "enableFog").name('Enable Fog');

    const fogFolder = gui.addFolder('Fog');
    fogFolder.show(params.enableFog);
    fogFolder.addColor(params, "fogColor").onChange((e) => {
        material.uniforms.fogColor.value.set(e);
        material.needsUpdate = true;
    }).name("Fog Color");
    fogFolder.add(params, "fogNear", -1000, 1000).onChange((e) => {
        material.uniforms.fogNear.value = e;
        material.needsUpdate = true;
    }).name("Fog Near");
    fogFolder.add(params, "fogFar", 0, 5000).onChange((e) => {
        material.uniforms.fogFar.value = e;
        material.needsUpdate = true;
    }).name("Fog Far");

    enableFogOption.onChange((e) => {
        material.uniforms.enableFog.value = e ? 1 : 0;
        material.needsUpdate = true;
        fogFolder.show(e);
    });
}
