import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import TWEEN from "three/addons/libs/tween.module.js";
import { GUI } from 'dat.gui'

// 获取容器并设置场景、相机和渲染器
const box = document.getElementById('box');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 1000);
camera.position.set(0, 200, 200);
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true });
renderer.setSize(box.clientWidth, box.clientHeight);
box.appendChild(renderer.domElement);

// 控制器
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// 动画循环
function animate() {
    requestAnimationFrame(animate);
    controls.update();
    TWEEN.update();
    renderer.render(scene, camera);
}
animate();

// 颜色配置
const colorArr = [
    { position: 0, color: 'rgba(255,255,255,1)' },
    { position: 0.05, color: 'rgba(255,230,140,0.9)' },
    { position: 0.2, color: 'rgba(255,180,40,0.6)' },
    { position: 1, color: 'rgba(255,100,0,0)' }
];

// 生成纹理
const canvas = document.createElement('canvas');
canvas.width = 256;
canvas.height = 256;
const context = canvas.getContext('2d');
context.clearRect(0, 0, canvas.width, canvas.height);
const gradient = context.createRadialGradient(
    canvas.width / 2, canvas.height / 2, 0,
    canvas.width / 2, canvas.width / 2, canvas.width / 2
);
colorArr.forEach(stop => {
    gradient.addColorStop(stop.position, stop.color);
});
context.fillStyle = gradient;
context.beginPath();
context.arc(canvas.width / 2, canvas.height / 2, canvas.width / 2, 0, Math.PI * 2);
context.fill();

// 内部高光
const innerGradient = context.createRadialGradient(
    canvas.width / 2, canvas.height / 2, 0,
    canvas.width / 2, canvas.height / 2, canvas.width / 4
);

innerGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
innerGradient.addColorStop(0.3, 'rgba(255, 240, 220, 0.5)');
innerGradient.addColorStop(1, 'rgba(255, 240, 200, 0)');

context.fillStyle = innerGradient;
context.beginPath();
context.arc(canvas.width / 2, canvas.height / 2, canvas.width / 4, 0, Math.PI * 2);
context.fill();

const texture = new THREE.CanvasTexture(canvas);

// 创建粒子系统
const sprites = new THREE.Object3D();
const material = new THREE.SpriteMaterial({
    map: texture,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false,
    alphaTest: 0.01
});

const gui = new GUI();

const config = {
    r_p: 20,
    size: 32,
    xx: 200,
    yy: 400,
    zz: 100,
    sl: 0.1,
    time: 1500,
    d: 4
}

gui.add(config, 'r_p', 0, 200).name('粒子范围');
gui.add(config, 'size', 0, 64).name('粒子大小');
gui.add(config, 'xx', 0, 800).name('x轴范围');
gui.add(config, 'yy', 0, 800).name('y轴范围');
gui.add(config, 'zz', 0, 800).name('z轴范围');
gui.add(config, 'sl', 0, 1).name('缩放比例');
gui.add(config, 'time', 0, 3000).name('动画时间');
gui.add(config, 'd', 0, 10).name('粒子间隔');

// 添加粒子
for (let i = 0; i < 300; i++) {
    const particle = new THREE.Sprite(material);
    initParticle(particle, i * config.d, sprites);
    sprites.add(particle);
}

scene.add(sprites);


// 初始化粒子
function initParticle(particle, delay) {

    const r_v = v => Math.random() * v - v / 2;

    // 初始化位置和大小
    particle.position.set(r_v(config.r_p), r_v(config.r_p), r_v(config.r_p));
    particle.scale.x = particle.scale.y = particle.scale.z = Math.random() * config.size;

    const xx = r_v(config.xx)
    const yy = Math.abs(r_v(config.yy))
    const zz = -Math.cos((Math.PI / 10) * xx) * config.zz;

    new TWEEN.Tween(particle.position)
        .delay(delay)
        .to({ x: xx, y: yy, z: zz }, config.time)
        .start()
        .onComplete(() => initParticle(particle, delay))

    new TWEEN.Tween(particle.scale)
        .delay(delay)
        .to({ x: config.sl, y: config.sl }, config.time)
        .start();

}









