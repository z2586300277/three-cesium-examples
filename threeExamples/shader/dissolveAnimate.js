import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import Stats from "three/examples/jsm/libs/stats.module.js"

var scene, camera, renderer, clock, controller, stats
var dissolveMaterials = []

init();
animate();

function init() {
    scene = new THREE.Scene();
    clock = new THREE.Clock();
    camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(15, 5, 15)
    renderer = new THREE.WebGLRenderer({
        antialias: true, // 开启抗锯齿处理
        alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio)

    let shader_material = new THREE.ShaderMaterial({
        uniforms: {
            dissolveMap: {
                value: new THREE.TextureLoader().load(FILE_HOST + "threeExamples/shader/tex2.png")
            },
            texture2: {
                value: new THREE.TextureLoader().load(FILE_HOST + "threeExamples/shader/earth1.jpg")
            },
            color: {
                value: new THREE.Color(1, 0, 0)
            },
            time: {
                value: 0
            },
            flag: {
                value: true
            }
        },
        vertexShader: `    varying vec2 vUv;
  varying vec3 worldPos;
  void main() {
      vUv = uv;
      worldPos = (modelMatrix * vec4(position, 1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }`,
        fragmentShader: `
  varying vec2 vUv;
 
  uniform sampler2D dissolveMap;
  uniform sampler2D texture2;
  uniform float time;
  varying vec3 worldPos;
  uniform bool flag;
  void main() {
    
    float bottom = -2.0;
    float top = 2.0;
    float yScale = (worldPos.y - bottom)/(top - bottom);
 
    vec4 color = texture2D( texture2, vUv);
    //vec4 color = vec4(1.0, 0.0, 0.0, 0.3);
    
    //float t = 1. - fract(time);
    float t;
    if(flag) {
      t = fract(time);
    }else {
      t = 1. - fract(time);
    }
    
    float h = texture2D( dissolveMap, vUv).r;

    float dissolveWidth = 4.0; // 值越大越窄

    float condition_if_1 = step(h + yScale*dissolveWidth, t*(dissolveWidth + 1.0) + 0.04);
    float condition_if_2 = step(h + yScale*dissolveWidth, t*(dissolveWidth + 1.0));
    color = mix(color, vec4(1.0 ,1.0 , 0.0, 1.0), condition_if_1 );
    color = color * (1. - condition_if_2);
    
    gl_FragColor = color;
  }`,
        transparent: true,
        depthWrite: false
    });
    dissolveMaterials.push(shader_material)

    var axisHelper = new THREE.AxesHelper(10);
    scene.add(axisHelper)
    stats = new Stats()
    document.body.appendChild(stats.dom);

    var geometry = new THREE.BoxGeometry(4, 4, 4);
    var cube = new THREE.Mesh(geometry, shader_material);
    scene.add(cube);

    controller = new OrbitControls(camera, renderer.domElement);
    document.body.appendChild(renderer.domElement);
    window.onresize = onResize;
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    stats.update();
    controller.update(clock.getDelta());
    updateMaterial()
}

function updateMaterial() {
    dissolveMaterials.map(m => {
        m.uniforms.time.value += 0.005
        if (m.uniforms.time.value >= 1) {
            m.uniforms.time.value = 0
            m.uniforms.flag.value = !m.uniforms.flag.value
        }
    })
}

function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}