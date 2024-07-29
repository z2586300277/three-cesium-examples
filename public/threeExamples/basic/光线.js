
import * as THREE from 'three';

// 1、影响哪些材质
//     不影响：MeshBasicMaterial（基础）
//     影像：  MeshLambertMaterial（漫反射）、MeshPhongMaterial（高光）、MeshPhysicalMaterial（物理）、MeshStandardMaterial（物理）

// 2、光源（分类、颜色、强度、衰减、位置）
//     PointLight（点光源）、SpotLight（聚光灯）、DirectionalLight（平行光）、AmbientLight（环境光）

// 场景
const scene = new THREE.Scene();// 创建场景
const geometry = new THREE.BoxGeometry(100, 100, 100); //几何体
const material = new THREE.MeshLambertMaterial(); //材质 
const mesh = new THREE.Mesh(geometry, material); //网格模型
mesh.position.set(0, 10, 0); //网格模型位置
scene.add(mesh);  //场景添加网格模型

// AxesHelper
const axesHelper = new THREE.AxesHelper(150);
scene.add(axesHelper);

// ---------光源-----------
const directionalLight = new THREE.DirectionalLight(0xff00ff, 1.0); //颜色、强度
directionalLight.position.set(100, 0, 200);   //位置
scene.add(directionalLight); //点光源添加到场景中

// -----------光源参考线-----------
const dirLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5, 0xff0000);
scene.add(dirLightHelper);

// 相机
const camera = new THREE.PerspectiveCamera();  //相机
camera.position.set(200, 200, 200); //相机位置
camera.lookAt(0, 10, 0);   //相机观察位置

// 渲染器
const renderer = new THREE.WebGLRenderer(); // 创建渲染器
const box = document.getElementById('box');
renderer.setSize(box.clientWidth, box.clientHeight); //渲染区域
renderer.render(scene, camera); //执行渲染
box.appendChild(renderer.domElement);
