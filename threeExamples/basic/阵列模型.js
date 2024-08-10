
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// 场景
const scene = new THREE.Scene();// 创建场景
const geometry = new THREE.BoxGeometry(5, 5, 5);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 }); //材质 
for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
        for (let k = 0; k < 10; k++) {
            const mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
            mesh.position.set(i * 20, k * 20, j * 20);
            scene.add(mesh); //网格模型添加到场景中  
        }
    }
}

// AxesHelper
const axesHelper = new THREE.AxesHelper(150);
scene.add(axesHelper);

// 相机
const camera = new THREE.PerspectiveCamera();  //相机
camera.position.set(500, 500, 500); //相机位置
camera.lookAt(0, 50, 0);   //相机观察位置

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