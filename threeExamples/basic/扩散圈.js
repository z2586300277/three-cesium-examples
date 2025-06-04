import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// 初始化场景
const scene = new THREE.Scene();
const box = document.getElementById('box');

// 初始化透视相机（添加lookAt确保朝向场景中心）
const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000);
camera.position.set(5, 5, 5);
camera.lookAt(0, 0, 0); // 确保相机朝向场景中心

// 初始化渲染器
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    logarithmicDepthBuffer: true
});
renderer.setSize(box.clientWidth, box.clientHeight);
renderer.setClearColor(0x808080, 1); // 设置背景颜色（与原代码一致）
box.appendChild(renderer.domElement);

// 调试辅助：添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// 初始化纹理加载（添加错误处理）
const textureLoader = new THREE.TextureLoader();
let texture = textureLoader.load(
    "files/images/circle.png",
    undefined,
    undefined,
    (err) => {
        console.error('纹理加载失败:', err);
        // 加载失败时使用默认材质
        texture = new THREE.TextureLoader().load('https://threejs.org/examples/textures/sprites/disc.png');
    }
);

// 创建精灵材质
let material = new THREE.SpriteMaterial({
    map: texture,
    color: 0xff0000,
    transparent: true,
    opacity: 1,
    depthWrite: false
});

// 创建精灵（添加初始位置调试）
const sprite = new THREE.Sprite(material);
sprite.position.set(0, 0, 0); // 初始位置改为场景中心
sprite.scale.set(1, 1, 1);     // 初始缩放改为1
scene.add(sprite);

// 添加环境光（增强光照）
const ambientLight = new THREE.AmbientLight(0xffffff, 2); // 增强环境光强度
scene.add(ambientLight);

// 添加轨道控制器（方便调试观察）
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// 动画参数
let circle_n = 0;
function animate() {
    requestAnimationFrame(animate);

    // 更新控制器
    controls.update();

    // 精灵动画逻辑
    circle_n = circle_n > 10 ? 0 : circle_n + 0.2;
    const scale = 0.1 * circle_n + 0.1;
    sprite.scale.set(scale, scale, scale);

    // 保持最小透明度防止完全消失
    sprite.material.opacity = Math.max(1 - circle_n * 0.05, 0.2);

    renderer.render(scene, camera);
}

// 窗口大小调整处理
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// 启动动画
animate();

// 调试信息输出
setTimeout(() => {
    console.log('场景内容:', scene.children);
    console.log('相机位置:', camera.position);
    console.log('精灵位置:', sprite.position);
}, 1000);