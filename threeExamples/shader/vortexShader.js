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
      vCenter: { type: "v2", value: new THREE.Vector2(window.innerWidth / 2, window.innerHeight / 2) },
      fRadius: { type: "f", value: window.innerWidth / 2.0 },
      fUzuStrength: { type: "f", value: 2.0 },
    },
    vertexShader: `
    varying vec2 vUv;
    void main(){
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
    `,
    fragmentShader: `
    uniform sampler2D tDiffuse;
    varying vec2 vUv;
    uniform vec2 vScreenSize;
    uniform vec2 vCenter;
    uniform float fRadius;
    uniform float fUzuStrength;

    void main() {
      vec2 pos = (vUv * vScreenSize) - vCenter;
      float len = length(pos);
      if (len >= fRadius) {
        gl_FragColor = texture2D(tDiffuse, vUv);
        return;
      }

      float uzu = min(max(1.0 - (len / fRadius), 0.0), 1.0) * fUzuStrength;
      float x = pos.x * cos(uzu) - pos.y * sin(uzu);
      float y = pos.x * sin(uzu) + pos.y * cos(uzu);
      vec2 retPos = (vec2(x, y) + vCenter) / vScreenSize;
      vec4 color = texture2D(tDiffuse, retPos);
      gl_FragColor = color;
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
  gui.add(cubeMaterial.uniforms['fRadius'], 'value', 1.0, 1000.0).step(1.0).name('radius');
  gui.add(cubeMaterial.uniforms['fUzuStrength'], 'value', -4.0, 4.0).step(0.1).name('uzuStrength');
}