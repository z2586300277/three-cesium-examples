
import * as THREE from 'three';

// 场景 + 相机-- > 渲染器 - >成果

// 场景 = （网格模型(几何体 + 材质) + 位置） + （网格模型(几何体 + 材质) + 位置）
// 相机 = 相机位置 + 相机观察位置

const box = document.getElementById('box')

const scene = new THREE.Scene();// 创建场景
const geometry = new THREE.BoxGeometry(100, 100, 100); //几何体
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 }); //材质 
const mesh = new THREE.Mesh(geometry, material); //网格模型
mesh.position.set(0, 10, 0); //网格模型位置
scene.add(mesh);  //场景添加网格模型

const camera = new THREE.PerspectiveCamera();  //相机
camera.position.set(200, 200, 200); //相机位置
camera.lookAt(0, 10, 0);   //相机观察位置

const renderer = new THREE.WebGLRenderer(); // 创建渲染器
renderer.setSize(box.clientWidth, box.clientHeight)
renderer.render(scene, camera); //执行渲染
box.appendChild(renderer.domElement);
