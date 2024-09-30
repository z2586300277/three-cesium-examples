import * as THREE from "three";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import Stats from "three/addons/libs/stats.module.js";

var container;
var scene, camera, renderer;
var controls;
var stats;

var cubeMaterial;

init();
update();
createGUI();

function init() {
  container = document.getElementById('box');

  // scene
  scene = new THREE.Scene();

  // camera
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);
  camera.position.set(1, 1, 1);
  camera.target = new THREE.Vector3(0, 0, 0);
  scene.add(camera);

  // renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  container.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.minDistance = 2;
  controls.maxDistance = 10;
  stats = new Stats();
  document.body.appendChild(stats.dom);

  // light
  initLight();

  // model
  initModel();

  // event
  window.addEventListener('resize', onWindowResize, false);
}

function initLight() {
  var light = new THREE.DirectionalLight(0xffffff);
  light.position.set(0, 200, 100);
  scene.add(light);
}

// model
function initModel() {
  const cubeShader = {
    uniforms: {
      tDiffuse: { type: 't', value: new THREE.TextureLoader().load(FILE_HOST + 'threeExamples/shader/dlam.jpg') },
      vScreenSize: { type: "v2", value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      fScale: { type: "float", value: 10 },
    },
    vertexShader: `
    varying vec2 vUv;
    void main(){
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `,
    fragmentShader: `
      varying vec2 vUv;
      uniform sampler2D tDiffuse;
      uniform vec2 vScreenSize;
      uniform float fScale;

      void main() {
        vec4 sum = vec4(0.0);
        float h = fScale/vScreenSize.x;
        float v = fScale/vScreenSize.y;

        //纵向高斯模糊
        sum += texture2D(tDiffuse, vec2(vUv.x, vUv.y - 4.0 * v)) * (0.051/2.0);
        sum += texture2D(tDiffuse, vec2(vUv.x, vUv.y - 3.0 * v)) * (0.0918/2.0);
        sum += texture2D(tDiffuse, vec2(vUv.x, vUv.y - 2.0 * v)) * (0.12245/2.0);
        sum += texture2D(tDiffuse, vec2(vUv.x, vUv.y - 1.0 * v)) * (0.1531/2.0);
        sum += texture2D(tDiffuse, vec2(vUv.x, vUv.y)) * (0.1633/2.0);
        sum += texture2D(tDiffuse, vec2(vUv.x, vUv.y + 1.0 * v)) * (0.1531/2.0);
        sum += texture2D(tDiffuse, vec2(vUv.x, vUv.y + 2.0 * v)) * (0.12245/2.0);
        sum += texture2D(tDiffuse, vec2(vUv.x, vUv.y + 3.0 * v)) * (0.0918/2.0);
        sum += texture2D(tDiffuse, vec2(vUv.x, vUv.y + 4.0 * v)) * (0.051/2.0);

        //横向高斯模糊
        sum += texture2D(tDiffuse, vec2(vUv.x - 4.0 * h, vUv.y)) * (0.051/2.0);
        sum += texture2D(tDiffuse, vec2(vUv.x - 3.0 * h, vUv.y)) * (0.0918/2.0);
        sum += texture2D(tDiffuse, vec2(vUv.x - 2.0 * h, vUv.y)) * (0.12245/2.0);
        sum += texture2D(tDiffuse, vec2(vUv.x - 1.0 * h, vUv.y)) * (0.1531/2.0);
        sum += texture2D(tDiffuse, vec2(vUv.x, vUv.y)) * (0.1633/2.0);
        sum += texture2D(tDiffuse, vec2(vUv.x + 1.0 * h, vUv.y)) * (0.1531/2.0);
        sum += texture2D(tDiffuse, vec2(vUv.x + 2.0 * h, vUv.y)) * (0.12245/2.0);
        sum += texture2D(tDiffuse, vec2(vUv.x + 3.0 * h, vUv.y)) * (0.0918/2.0);
        sum += texture2D(tDiffuse, vec2(vUv.x + 4.0 * h, vUv.y)) * (0.051/2.0);

        gl_FragColor = sum;
      }
    `,
  }

  cubeMaterial = new THREE.ShaderMaterial({
    uniforms: cubeShader.uniforms,
    vertexShader: cubeShader.vertexShader,
    fragmentShader: cubeShader.fragmentShader,
    side: THREE.DoubleSide
  });

  var geometry = new THREE.PlaneGeometry();
  var cube = new THREE.Mesh(geometry, cubeMaterial);
  scene.add(cube);
}

function update() {
  requestAnimationFrame(update);
  renderer.render(scene, camera);

  controls.update();
  stats.update();
}

function onWindowResize() {
  var w = window.innerWidth;
  var h = window.innerHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();

  renderer.setSize(w, h);
}

function createGUI() {
  var gui = new GUI();
  gui.add(cubeMaterial.uniforms['fScale'], 'value', 0.0, 10.0).step(1.0).name('fScale');
}