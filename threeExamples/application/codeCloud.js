import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Stats from 'three/examples/jsm/libs/stats.module.js';

var scene, camera, renderer, clock, controller, stats
var shader_material, cloud, range = 50

init();
animate();

// - Functions -
function init() {
    scene = new THREE.Scene();
    clock = new THREE.Clock();
    camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(10, 10, 10)
    renderer = new THREE.WebGLRenderer({
        antialias: true, // 开启抗锯齿处理
        alpha: true,
    });
    renderer.setClearColor(0x000000)
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio)


    var axisHelper = new THREE.AxesHelper(10);
    scene.add(axisHelper);

    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
    directionalLight.position.set(400, 200, 300);
    // directionalLight.castShadow = true
    scene.add(directionalLight);
    // 方向光2
    var directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.9);
    directionalLight2.position.set(-400, -200, -300);
    scene.add(directionalLight2);
    //环境光
    var ambient = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambient);

    stats = new Stats()
    document.body.appendChild(stats.dom);

    // --------

    cloud = new THREE.Group()
    scene.add(cloud)
    shader_material = initMaterial()

    let width = 128, height = 128

    for (var i = 0; i < 1000; i++) {
        var pos = new THREE.Vector3(
            Math.random() * range - range / 2,
            Math.random() * range - range / 2,
            Math.random() * range - range / 2)

        pos.vX = ((Math.random() - 0.5) / 3) / 10
        pos.vY = (0.05 + Math.random() * 0.1) / 5

        let geometry = new THREE.PlaneGeometry(4, 4);
        let s = Math.floor(Math.random() * 1000) + 1
        geometry.attributes.uv.array = geometry.attributes.uv.array.map(e => e += s)

        var plane = new THREE.Mesh(geometry, shader_material);

        plane.position.copy(pos)
        plane.userData.pos = pos
        cloud.add(plane)
    }
    setInterval(() => {
        if (cloud) {
            cloud.children.map(plane => {
                plane.material.uniforms.random.value = Math.random()
                // let s = Math.floor(Math.random()*1000) + 1
                // plane.geometry.attributes.uv.array = plane.geometry.attributes.uv.array.map(e => e=s)
            })
        }
    }, 100)
    // --------

    controller = new OrbitControls(camera, renderer.domElement);
    document.body.appendChild(renderer.domElement);
    window.onresize = onResize;
}

function initMaterial() {
    let loader = new THREE.TextureLoader()
    return new THREE.ShaderMaterial({
        uniforms: {
            texture1: {
                value: loader.load(FILE_HOST + 'threeExamples/application/codeCloud/1.png')
            },
            texture2: {
                value: loader.load(FILE_HOST + 'threeExamples/application/codeCloud/2.png')
            },
            texture3: {
                value: loader.load(FILE_HOST + 'threeExamples/application/codeCloud/3.png')
            },
            texture4: {
                value: loader.load(FILE_HOST + 'threeExamples/application/codeCloud/4.png')
            },
            texture5: {
                value: loader.load(FILE_HOST + 'threeExamples/application/codeCloud/5.png')
            },
            texture6: {
                value: loader.load(FILE_HOST + 'threeExamples/application/codeCloud/6.png')
            },
            texture7: {
                value: loader.load(FILE_HOST + 'threeExamples/application/codeCloud/7.png')
            },
            texture8: {
                value: loader.load(FILE_HOST + 'threeExamples/application/codeCloud/8.png')
            },
            texture9: {
                value: loader.load(FILE_HOST + 'threeExamples/application/codeCloud/9.png')
            },
            random: {
                value: Math.random()
            }
        },

        vertexShader: ` varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    
}`,
        fragmentShader: `  varying vec2 vUv;
uniform sampler2D texture1;
uniform sampler2D texture2;
uniform sampler2D texture3;
uniform sampler2D texture4;
uniform sampler2D texture5;
uniform sampler2D texture6;
uniform sampler2D texture7;
uniform sampler2D texture8;
uniform sampler2D texture9;

uniform float random;
void main() {

  //if(vUv.y > 0.5) {
  //  gl_FragColor = texture2D( texture0, vec2(fract(vUv.y * 2.0), vUv.x));
  //}else {
  //  gl_FragColor = texture2D( texture1, vec2(fract(vUv.y * 2.0), vUv.x));
  //}
  
  float selfRandom = vUv.y - fract(vUv.y);
  float k = abs(sin(selfRandom * random))*10.0;

  if(k < 1.0) {

    gl_FragColor = texture2D( texture1, vec2(fract(vUv.x), fract(vUv.y)));

  }else if(k < 2.0) {

    gl_FragColor = texture2D( texture2, vec2(fract(vUv.x), fract(vUv.y)));

  }else if(k < 3.0) {

    gl_FragColor = texture2D( texture3, vec2(fract(vUv.x), fract(vUv.y)));

  }else if(k < 4.0) {

    gl_FragColor = texture2D( texture4, vec2(fract(vUv.x), fract(vUv.y)));

  }else if(k < 5.0) {

    gl_FragColor = texture2D( texture5, vec2(fract(vUv.x), fract(vUv.y)));

  }else if(k < 6.0) {

    gl_FragColor = texture2D( texture6, vec2(fract(vUv.x), fract(vUv.y)));

  }else if(k < 7.0) {

    gl_FragColor = texture2D( texture7, vec2(fract(vUv.x), fract(vUv.y)));

  }else if(k < 8.0) {

    gl_FragColor = texture2D( texture8, vec2(fract(vUv.x), fract(vUv.y)));

  }
  else {

    gl_FragColor = texture2D( texture9, vec2(fract(vUv.x), fract(vUv.y)));

  }
  
}`,
        // vertexColors: THREE.VertexColors,   // 以顶点颜色为准进行渲染
        // side:THREE.DoubleSide,              // 双面可见
        depthWrite: false,
        transparent: true
    });
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    stats.update();
    controller.update(clock.getDelta());
    snowanimate()
}

function snowanimate() {
    if (cloud) {
        cloud.children.map(plane => {
            plane.rotation.y = camera.rotation.y
            let pos = plane.userData.pos
            // plane.position.x += pos.vX
            plane.position.y += pos.vY
            // if(plane.position.x <= -range/2 || plane.position.x >= range/2) pos.vX *= -1
            if (plane.position.y >= range / 2) plane.position.y = -range / 2
            // plane.material.uniforms.random.value = Math.random()
        })
    }
}

function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}