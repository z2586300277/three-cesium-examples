import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RenderPass, EffectPass, EffectComposer, GodRaysEffect } from 'postprocessing'
// Max Muselmann https://unsplash.com/photos/oIVvGqqwVJw
const image_url =
  "https://z2586300277.github.io/3d-file-server/images/four/photo-1583766395091-2eb9994ed094.avif";
const image_ratio = 687 / 1031;
const image_tex = new THREE.TextureLoader().load(image_url);
image_tex.repeat.set(1, 1);

// Daniil Silantev https://unsplash.com/photos/dxGTQArsC3M
const alpha_url =
  "https://z2586300277.github.io/3d-file-server/images/four/photo-1510942752400-ebce99a8a2c0.avif";
const alpha_tex = new THREE.TextureLoader().load(alpha_url);
alpha_tex.repeat.set(0.6, 2);
alpha_tex.offset.x = (1 - alpha_tex.repeat.x) / 2;
alpha_tex.wrapT = THREE.RepeatWrapping;

// ----
// main
// ----

const renderer = new THREE.WebGLRenderer();
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 2, 0.1, 100);
const controls = new OrbitControls(camera, renderer.domElement);

camera.position.set(0, 0, 1);
controls.enableDamping = true;

const light = new THREE.DirectionalLight();
light.position.set(0, 0, 1);
scene.add(light);

const geom = new THREE.PlaneGeometry(image_ratio * 2, 2);
const mat = new THREE.MeshLambertMaterial({
  alphaMap: alpha_tex,
  alphaTest: 0.15,
  map: image_tex,
});
const mesh = new THREE.Mesh(geom, mat);
scene.add(mesh);

const wall = new THREE.Mesh(
  geom,
  new THREE.MeshBasicMaterial({
    alphaMap: alpha_tex,
    alphaTest: 0.15,
    map: image_tex,
  })
);
wall.scale.setScalar(1.2);
wall.position.z = -0.1;
scene.add(wall);

// ----
// render
// ----

const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
const effect = new GodRaysEffect(camera, wall, {
  density: 1,
  decay: 0.96,
  weight: 1,
});
const effectPass = new EffectPass(camera, effect);
composer.addPass(renderPass);
composer.addPass(effectPass);

renderer.setAnimationLoop((t) => {
  composer.render();
  controls.update();
  alpha_tex.offset.y = t * -0.001;
});

// ----
// view
// ----

function resize(w, h, dpr = devicePixelRatio) {
  renderer.setPixelRatio(dpr);
  // renderer.setSize(w, h, false)
  composer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
addEventListener("resize", () => resize(innerWidth, innerHeight));
dispatchEvent(new Event("resize"));
document.body.prepend(renderer.domElement);