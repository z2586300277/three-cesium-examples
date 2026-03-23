import * as THREE from "three";
import {GLTFLoader} from "three/examples/jsm/loaders/GLTFLoader.js";
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import {DRACOLoader} from "three/examples/jsm/loaders/DRACOLoader.js";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls.js";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";
import { animate } from "animejs";

let scene, renderer, camera, orbitControls;

let isRoaming = false; // 漫游模式标志

let camera2; // 主要用于动画的相机
const eye1 = new THREE.Object3D();

let pointerlockControls;

// 用于动画的位置/旋转数据对象（animejs 直接修改此对象属性）
const itemData = { px: 0, py: 0, pz: 0, rx: 0, ry: 0, rz: 0 };

window.addEventListener('load', () => {
    init();
    render();
    eventBinding();
});

// 初始化
function init() {
    scene = new THREE.Scene();

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.position.set(100, 100, 100);

    orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.enableDamping = true;

    camera2 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera2.position.set(0, 2, 0);

    const cameraHelper = new THREE.CameraHelper(camera2);
    scene.add(cameraHelper);

    // 将相机放置于 eye1 对象中，通过移动 eye1 驱动相机路径
    eye1.add(camera2);
    scene.add(eye1);

    pointerlockControls = new PointerLockControls(camera2, renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 1));
    scene.add(new THREE.DirectionalLight(0xffffff, 1.5));
    scene.add(new THREE.GridHelper(200, 20));

    const gltfLoader = new GLTFLoader()
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath(FILE_HOST + 'js/three/draco/')
    gltfLoader.setDRACOLoader(dracoLoader)
    gltfLoader.load(FILE_HOST + 'models/modern_city.glb', (gltf) => {
        gltf.scene.scale.set(0.03, 0.03, 0.03);
        scene.add(gltf.scene)
    })

    const gui = new GUI();
    const btns = { startRoam: autoRun, stopAutoRun };
    gui.add(btns, 'startRoam').name('开启漫游/巡检');
    gui.add(btns, 'stopAutoRun').name('结束漫游/巡检');
    gui.add(cameraHelper, 'visible').name('相机辅助线');

    window.addEventListener('resize', onResize);
}

// 窗口尺寸变化响应
function onResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    camera2.aspect = w / h;
    camera2.updateProjectionMatrix();
}

// 开启漫游
function autoRun() {
    isRoaming = true;
    orbitControls.enabled = false;

    // 同步 itemData 为 eye1 当前状态，避免重复调用时跳变
    itemData.px = eye1.position.x;
    itemData.py = eye1.position.y;
    itemData.pz = eye1.position.z;
    itemData.rx = eye1.rotation.x;
    itemData.ry = eye1.rotation.y;
    itemData.rz = eye1.rotation.z;

    const a90 = -Math.PI / 2;
    const time1 = 6000; // 直线段时长
    const time2 = 6000; // 等待转弯时长
    const time3 = 1200; // 转弯时长

    // 巡检路径：沿城市街道绕行一圈（坐标根据城市模型缩放后的街道位置设定）
    animate(itemData, {
        px: [
            { to: 0,   duration: time1 },
            { to: 30,  duration: time1, delay: time3 },
            { to: 30,  duration: time1, delay: time3 },
            { to: 0,   duration: time1, delay: time3 }
        ],
        pz: [
            { to: -30, duration: time1 },
            { to: -30, duration: time1, delay: time3 },
            { to: 0,   duration: time1, delay: time3 },
            { to: 0,   duration: time1, delay: time3 }
        ],
        ry: [
            { to: a90,     duration: time3, delay: time2 },
            { to: a90 * 2, duration: time3, delay: time2 },
            { to: a90 * 3, duration: time3, delay: time2 },
            { to: a90 * 4, duration: time3, delay: time2 }
        ],
        ease: "linear",
        onUpdate: () => {
            const { px, py, pz, rx, ry, rz } = itemData;
            eye1.position.set(px, py, pz);
            eye1.rotation.set(rx, ry, rz);
        },
        onComplete: () => resetEye()
    });
}

// 停止漫游
function stopAutoRun() {
    isRoaming = false;
    resetEye();
}

// 重置 eye1 位置及 itemData 状态
function resetEye() {
    eye1.position.set(0, 0, 0);
    eye1.rotation.set(0, 0, 0);
    itemData.px = 0; itemData.py = 0; itemData.pz = 0;
    itemData.rx = 0; itemData.ry = 0; itemData.rz = 0;
    orbitControls.enabled = true;
}

// 绑定交互事件
function eventBinding() {
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseRelease);
    window.addEventListener("mouseleave", onMouseRelease);
}

function onMouseDown() {
    if (isRoaming) {
        pointerlockControls.isLocked = true;
    }
}

function onMouseRelease() {
    if (isRoaming) {
        pointerlockControls.isLocked = false;
        cameraReturn();
    }
}

/*
 * 关键开发思路
 * 1. 使用 eye1 对象执行路径移动
 * 2. 利用鼠标事件对 camera2 进行方向控制
 * 3. 松开鼠标时，执行相机回归中心方向的动画
 */
function render() {
    requestAnimationFrame(render);
    orbitControls.update();
    renderer.render(scene, isRoaming ? camera2 : camera);
}

// 相机视角回归动画（使用四元数避免 rotation 动画的万向锁问题）
function cameraReturn() {
    animate(camera2.quaternion, {
        x: 0, y: 0, z: 0, w: 1,
        ease: "linear",
        duration: 500
    });
}
