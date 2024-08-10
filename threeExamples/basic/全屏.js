
import * as THREE from 'three';

// 场景
const scene = new THREE.Scene();// 创建场景
const geometry = new THREE.BoxGeometry(10, 60, 100); //几何体
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 }); //材质 
const mesh = new THREE.Mesh(geometry, material); //网格模型
mesh.position.set(0, 10, 0); //网格模型位置
scene.add(mesh);  //场景添加网格模型

// AxesHelper
const axesHelper = new THREE.AxesHelper(150);
scene.add(axesHelper);

// 相机
const camera = new THREE.PerspectiveCamera();  //相机
camera.position.set(200, 200, 200); //相机位置
camera.lookAt(0, 10, 0);   //相机观察位置

// 渲染器
const renderer = new THREE.WebGLRenderer(); // 创建渲染器
const box = document.getElementById('box');
renderer.setSize(box.clientWidth, box.clientHeight); //渲染区域
renderer.render(scene, camera); //执行渲染


box.appendChild(renderer.domElement);;

// onresize 事件会在窗口被调整大小时发生
window.onresize = function () {
    // 重置渲染器输出画布canvas尺寸
    const box = document.getElementById('box');
    renderer.setSize(box.clientWidth, box.clientHeight);
    // 全屏情况下：设置观察范围长宽比aspect为窗口宽高比
    camera.aspect = window.innerWidth / window.innerHeight;
    // 渲染器执行render方法的时候会读取相机对象的投影矩阵属性projectionMatrix
    // 但是不会每渲染一帧，就通过相机的属性计算投影矩阵(节约计算资源)
    // 如果相机的一些属性发生了变化，需要执行updateProjectionMatrix ()方法更新相机的投影矩阵
    camera.updateProjectionMatrix();
};

