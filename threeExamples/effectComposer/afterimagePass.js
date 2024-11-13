import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js ';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { AfterimagePass } from 'three/examples/jsm/postprocessing/AfterimagePass.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import * as dat from 'dat.gui';

// 初始化场景、相机、渲染器
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(40, 40, 40);

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    logarithmicDepthBuffer: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor('#000');
document.body.appendChild(renderer.domElement);

// 初始化控制器
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
// 添加光源
const directionalLight = new THREE.DirectionalLight('#fff');
directionalLight.position.set(30, 30, 30).normalize();
scene.add(directionalLight);
const ambientLight = new THREE.AmbientLight('#fff', 2);
scene.add(ambientLight);

// 添加性能监控
const stats = new Stats();
document.body.appendChild(stats.dom);


scene.fog = new THREE.Fog(0x000000, 1, 1000);

const geometry = new THREE.BoxGeometry(10, 10, 10);
const material = new THREE.MeshNormalMaterial();
const mesh = new THREE.Mesh(geometry, material);
mesh.position.set(15, 0, 0)
scene.add(mesh);

new GLTFLoader().load(FILE_HOST + "files/model/Fox.glb", (gltf) => {

    scene.add(gltf.scene)

    gltf.scene.scale.multiplyScalar(0.1)

})

// 后期处理
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
const afterimagePass = new AfterimagePass();
composer.addPass(afterimagePass);

// GUI控制
const params = {
    enable: true
};
const gui = new dat.GUI({ name: 'Damp setting' });
gui.add(afterimagePass.uniforms["damp"], 'value', 0, 1).step(0.001);
gui.add(params, 'enable');

// 窗口大小调整
window.addEventListener('resize', onWindowResize, false);

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
}

// 动画渲染
function animate() {
    requestAnimationFrame(animate);
    stats.update();
    controls.update();

    mesh.rotation.x += 0.005;
    mesh.rotation.y += 0.01;

    if (params.enable) {
        composer.render();
    } else {
        renderer.render(scene, camera);
    }
}

animate();