import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import TWEEN from "three/addons/libs/tween.module.js";

const scene = new THREE.Scene(); // 创建场景
const geometry = new THREE.BoxGeometry(10, 60, 100); //几何体
const material = new THREE.MeshLambertMaterial(); //材质
const mesh = new THREE.Mesh(geometry, material); //网格模型
mesh.position.set(0, 10, 0); //网格模型位置
// scene.add(mesh); //场景添加网格模型

// 3d半圆扩散 + 扩散波
let circle3D = scatter3DCircle(50);
circle3D.layers.enable(1);
circle3D.position.set(0, 10, 0);
scene.add(circle3D);

// AxesHelper
const axesHelper = new THREE.AxesHelper(150);
scene.add(axesHelper);

// 光源
const pointLight = new THREE.DirectionalLight(0xff00ff, 1.0); //颜色、强度
pointLight.position.set(200, 300, 400); //位置
scene.add(pointLight); //点光源添加到场景中

// 光源参考线
const dirLightHelper = new THREE.DirectionalLightHelper(
  pointLight,
  5,
  0xff0000
);
scene.add(dirLightHelper);

// 相机
const camera = new THREE.PerspectiveCamera(); //相机
camera.position.set(200, 200, 200); //相机位置
camera.lookAt(0, 10, 0); //相机观察位置

// 渲染器
const renderer = new THREE.WebGLRenderer(); // 创建渲染器

renderer.setSize(window.innerWidth, window.innerHeight); //渲染区域
renderer.render(scene, camera); //执行渲染
document.body.appendChild(renderer.domElement);

// 设置相机控件轨道控制器OrbitControls
new OrbitControls(camera, renderer.domElement);

// 圆扩散
function scatter3DCircle(r) {
  const geometry = new THREE.SphereGeometry(
    r,
    120,
    120,
    0,
    Math.PI * 2,
    0,
    Math.PI / 2
  );

  let circle = new THREE.Mesh(
    geometry,
    new THREE.MeshBasicMaterial({
      // side: THREE.DoubleSide,
      // transparent: true,
      // color:new THREE.Color("#ff0000")
      map: new THREE.TextureLoader().load(
        FILE_HOST + "images/four/gradual_red_01.png"
      ),
    })
  );

  return circle;
}
let s = 0,
  p = 0;
animate();

function animate() {
  requestAnimationFrame(animate);

  // animation
  if (s > 160) {
    (s = 0), (p = 160);
  }
  circle3D.scale.set(1 + s / 60, 1 + s / 80, 1 + s / 60);
  circle3D.material.opacity = p / 160;
  s++;
  p--;

  TWEEN.update();
  renderer.render(scene, camera);
}