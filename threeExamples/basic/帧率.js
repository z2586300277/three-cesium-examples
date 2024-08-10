
import * as THREE from 'three';
//引入性能监视器stats.js
import Stats from 'three/examples/jsm/libs/stats.module.js'; 
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


const stats = new Stats();
document.body.appendChild(stats.domElement);
function render() {
        stats.update();
        renderer.render(scene, camera); //执行渲染操作
        requestAnimationFrame(render); //请求再次执行渲染函数render，渲染下一帧
}
render();
