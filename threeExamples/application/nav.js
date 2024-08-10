// 模型导航 从0，0，0自动寻路至56，0，0 改变坐标即可重新计算（version：0.1:导航错误等未处理）
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader.js";
const box = document.getElementById("box");

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  box.clientWidth / box.clientHeight,
  0.1,
  1000
);

camera.position.set(20, 50, 0);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
  logarithmicDepthBuffer: true,
});

renderer.setSize(box.clientWidth, box.clientHeight);

scene.add(new THREE.AxesHelper(10))
scene.add(new THREE.GridHelper(100, 100))
box.appendChild(renderer.domElement);

new OrbitControls(camera, renderer.domElement);

window.onresize = () => {
  renderer.setSize(box.clientWidth, box.clientHeight);

  camera.aspect = box.clientWidth / box.clientHeight;
  camera.updateProjectionMatrix();
};

animate();

function animate() {
  requestAnimationFrame(animate);
  TWEEN.update()
  renderer.render(scene, camera);
}

scene.add(new THREE.AmbientLight(0xfff, 4));
// 加载模型 gltf/ glb  draco解码器
const loader = new GLTFLoader();

loader.setDRACOLoader(
  new DRACOLoader().setDecoderPath(
    "https://z2586300277.github.io/3d-file-server/js/three/draco/"
  )
);

import { init } from "@recast-navigation/core";
import * as TRR from "@recast-navigation/three";
let path;
const add_nav_mesh = async () => {
  console.log(init);
  await init();
  loader.load(
    "https://z2586300277.github.io/3d-file-server/files/model/navmesh02.glb",
    (gltf) => {
      scene.add(gltf.scene);
      let navMesh = TRR.threeToSoloNavMesh(gltf.scene.children);
      console.log(navMesh);
      // navmesh helper
      // const helper = new TRR.NavMeshHelper(navMesh);
      // scene.add(helper);
      gltf.scene.traverse((mesh) => {
        if (mesh.isMesh) {
          mesh.material.side = THREE.DoubleSide;
        }
      });
      let pathResult = compute_route(navMesh.navMesh);
      // 实例化路径
      path = pathResult.path
      draw_path(pathResult.path);
    }
  );
};
import { NavMeshQuery } from "@recast-navigation/core";
import { Vector3 } from "three";
const compute_route = (navMesh) => {
  const navMeshQuery = new NavMeshQuery(navMesh);
  const startPosition = new Vector3(0, 0, 0);
  const endPosition = new Vector3(56, 0, 0);
  let route = navMeshQuery.computePath(startPosition, endPosition);
  return route;
};
import * as Path from "three.path";
import { StaticDrawUsage, Mesh, MeshPhongMaterial, DoubleSide } from "three";
const draw_path = (path) => {
  const points = new Path.PathPointList();
  points.set(path, 0.1, 10, new Vector3(0, 1, 0));
  const geo = new Path.PathGeometry(
    {
      pathPointList: points,
      options: {
        width: 0.1, // default is 0.1
        arrow: true, // default is true
        progress: 1, // default is 1
        side: "both", // "left"/"right"/"both", default is "both"
      },
      usage: StaticDrawUsage, // geometry usage
    },
    false
  );
  var material = new MeshPhongMaterial({
    color: 0x58dede,
    depthWrite: true,
    transparent: true,
    opacity: 0.9,
    side: DoubleSide,
  });
  var mesh = new Mesh(geo, material);
  scene.add(mesh);
  through_path(path)
};
const computeDistance = (vec1, vec2) => {
  return Math.sqrt(
    Math.pow(vec1.x - vec2.x, 2) +
    Math.pow(vec1.y - vec2.y, 2) +
    Math.pow(vec1.z - vec2.z, 2)
  );
};
// 运动路径示意
import * as TWEEN from "@tweenjs/tween.js";
const add_box = () => {
  const geometry = new THREE.BoxGeometry(1, 1, 1); //几何体
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 }); //材质
  const mesh = new THREE.Mesh(geometry, material); //网格模型
  // mesh.position.set(0, 10, 0); //网格模型位置
  scene.add(mesh); //场景添加网格模型
  return mesh;
};
let i = 0;
const through_path = () => {
  const distance = computeDistance(path[i], path[i + 1]);
  const tween = new TWEEN.Tween(path[i]);
  let box = add_box();
  const time = Math.round(distance / 2);
  tween
    .to(path[i + 1], time * 1000)
    .onUpdate((item) => {
      box.position.copy(item);
    })
    .onComplete(() => {
      if (i + 2 < path.length) {
        i = i + 1;
        through_path();
      }
    });
  tween.start();
};
await add_nav_mesh();
