
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// 场景
const scene = new THREE.Scene();// 创建场景
//BoxGeometry：长方体
const geometry1 = new THREE.BoxGeometry(10, 10, 10);
// SphereGeometry：球体
const geometry2 = new THREE.SphereGeometry(10);
// CylinderGeometry：圆柱
const geometry3 = new THREE.CylinderGeometry(10, 10, 100);
// PlaneGeometry：矩形平面
const geometry4 = new THREE.PlaneGeometry(10, 50);
// CircleGeometry：圆形平面
const geometry5 = new THREE.CircleGeometry(10);

const material = new THREE.MeshBasicMaterial({ color: 0xff0000 }); //材质 

const mesh1 = new THREE.Mesh(geometry1, material);
mesh1.position.set(0, 0, 0);
const mesh2 = new THREE.Mesh(geometry2, material);
mesh2.position.set(0, 0, 30);
const mesh3 = new THREE.Mesh(geometry3, material);
mesh3.position.set(0, 0, 60);
const mesh4 = new THREE.Mesh(geometry4, material);
mesh4.position.set(0, 0, 90);
const mesh5 = new THREE.Mesh(geometry5, material);
mesh5.position.set(0, 0, 120);

scene.add(mesh1);
scene.add(mesh2);
scene.add(mesh3);
scene.add(mesh4);
scene.add(mesh5);

// AxesHelper
const axesHelper = new THREE.AxesHelper(150);
scene.add(axesHelper);

// 相机
const camera = new THREE.PerspectiveCamera();  //相机
camera.position.set(400, 300, 500); //相机位置
camera.lookAt(0, 50, 40);   //相机观察位置

// 渲染器
const renderer = new THREE.WebGLRenderer(); // 创建渲染器
const box = document.getElementById('box');
renderer.setSize(box.clientWidth, box.clientHeight); //渲染区域
renderer.render(scene, camera); //执行渲染
box.appendChild(renderer.domElement);;


// 设置相机控件轨道控制器OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
// 如果OrbitControls改变了相机参数，重新调用渲染器渲染三维场景
controls.addEventListener('change', function () {
        renderer.render(scene, camera); //执行渲染操作
        console.log(camera.position)
});//监听鼠标、键盘事件