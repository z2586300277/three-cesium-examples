
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const scene = new THREE.Scene();

// 网格模型Mesh其实就一个一个三角形(面)拼接构成
const geometry = new THREE.BufferGeometry();
const vertices = new Float32Array([
    0, 0, 0,
    50, 0, 0,
    50, 0, 50,

    0, 0, 0,
    0, 0, 50,
    50, 0, 50,
]);

geometry.attributes.position = new THREE.BufferAttribute(vertices, 3);

const colors = new Float32Array([
    1, 1, 1, //顶点1颜色
    1, 1, 0, //顶点2颜色
    1, 1, 1, //顶点3颜色
    1, 0, 0, //顶点4颜色
    0, 1, 1, //顶点5颜色
    0, 0, 1, //顶点6颜色
]);
geometry.attributes.color = new THREE.BufferAttribute(colors, 3)

// 点颜色
const material = new THREE.PointsMaterial({
    vertexColors: colors,
    size: 10.0
})
const points = new THREE.Points(geometry, material)
scene.add(points)


// 网格颜色
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)


// AxesHelper
const axesHelper = new THREE.AxesHelper(150);
scene.add(axesHelper);

// 相机
const camera = new THREE.PerspectiveCamera();  //相机
camera.position.set(200, 200, 200); //相机位置
camera.lookAt(0, 0, 0);   //相机观察位置

// 渲染器
const renderer = new THREE.WebGLRenderer(); // 创建渲染器
const box = document.getElementById('box');
renderer.setSize(box.clientWidth, box.clientHeight); //渲染区域
renderer.render(scene, camera); //执行渲染
box.appendChild(renderer.domElement);;

const controls = new OrbitControls(camera, renderer.domElement);
controls.addEventListener('change', function () {
    renderer.render(scene, camera);
});