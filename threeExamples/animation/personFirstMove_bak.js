import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';

// 初始化场景、相机和渲染器
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 加载模型 fbx
new FBXLoader().load(HOST + '/files/model/city.FBX', (object3d) => {
    object3d.scale.multiplyScalar(0.01)
    object3d.position.set(0, -1, 0)
    scene.add(object3d)
})

// 天空盒和网格
scene.background = new THREE.CubeTextureLoader().load(
  [0, 1, 2, 3, 4, 5].map(k => FILE_HOST + 'files/sky/skyBox0/' + (k + 1) + '.png')
);
scene.add(new THREE.GridHelper(100, 40));
scene.add(new THREE.AmbientLight(0xffffff, 0.5))

// 游戏状态
const state = {
  // 输入控制
  keys: { w: false, a: false, s: false, d: false, space: false, shift: false },
  
  // 视角控制
  view: {
    yaw: 0,
    pitch: 0,
    mouseSensitivity: 0.002,
    pitchLimit: Math.PI/3
  },
  
  // 物理参数
  physics: {
    velocity: new THREE.Vector3(),
    speed: 0.1,
    sprintMultiplier: 1.8,
    jumpForce: 0.2,
    gravity: 0.01,
    airborne: false
  },
  
  // 相机参数
  camera: {
    height: 0.7
  }
};

// 加载角色模型
let character;
new GLTFLoader().load(FILE_HOST + "files/model/Fox.glb", (gltf) => {
  character = gltf.scene;
  scene.add(character);
  character.scale.multiplyScalar(0.01);
  character.rotation.y = Math.PI; // 修正朝向
  
  // 设置动画
  const mixer = new THREE.AnimationMixer(character);
  const action = mixer.clipAction(gltf.animations[1]);
  const clock = new THREE.Clock();
  character.mixerUpdate = () => mixer.update(clock.getDelta());
  action.play();
  
  // 初始化GUI控制面板
  setupGUI();
});

// 鼠标锁定和视角控制
document.addEventListener('click', () => document.body.requestPointerLock());

document.addEventListener('mousemove', (event) => {
  if (document.pointerLockElement !== document.body) return;
  
  // 水平和垂直旋转
  state.view.yaw += event.movementX * state.view.mouseSensitivity;
  state.view.pitch += event.movementY * state.view.mouseSensitivity;
  
  // 限制垂直视角
  state.view.pitch = Math.max(-state.view.pitchLimit, Math.min(state.view.pitchLimit, state.view.pitch));
  
  // 更新角色旋转
  if (character) character.rotation.y = state.view.yaw + Math.PI;
});

// 键盘输入处理
document.addEventListener('keydown', ({ key }) => {
  switch(key.toLowerCase()) {
    case 'w': state.keys.w = true; break;
    case 'a': state.keys.a = true; break;
    case 's': state.keys.s = true; break;
    case 'd': state.keys.d = true; break;
    case ' ': 
      state.keys.space = true; 
      if (!state.physics.airborne) {
        state.physics.velocity.y = state.physics.jumpForce;
        state.physics.airborne = true;
      }
      break;
    case 'shift': state.keys.shift = true; break;
  }
});

document.addEventListener('keyup', ({ key }) => {
  const k = key.toLowerCase();
  if (k in state.keys) state.keys[k] = false;
});

// 游戏更新函数
function update() {
  if (!character) return;

  // 计算移动方向和速度
  const moveSpeed = state.keys.shift ? 
    state.physics.speed * state.physics.sprintMultiplier : 
    state.physics.speed;
  
  let [moveX, moveZ] = [0, 0];
  if (state.keys.w) moveZ = -1;
  if (state.keys.s) moveZ = 1;
  if (state.keys.a) moveX = -1;
  if (state.keys.d) moveX = 1;
  
  // 归一化对角线移动
  if (moveX !== 0 && moveZ !== 0) {
    const length = Math.sqrt(2);
    moveX /= length;
    moveZ /= length;
  }
  
  // 转换为世界坐标
  const rotation = state.view.yaw;
  const dx = (moveX * Math.cos(rotation) + moveZ * Math.sin(rotation)) * moveSpeed;
  const dz = (moveZ * Math.cos(rotation) - moveX * Math.sin(rotation)) * moveSpeed;
  
  // 应用重力和垂直运动
  if (state.physics.airborne) {
    state.physics.velocity.y -= state.physics.gravity;
  }
  
  // 应用移动
  character.position.x += dx;
  character.position.z += dz;
  character.position.y += state.physics.velocity.y;
  
  // 检测地面碰撞
  if (character.position.y <= 0) {
    character.position.y = 0;
    state.physics.velocity.y = 0;
    state.physics.airborne = false;
  }
  
  // 更新动画
  character.mixerUpdate();
  
  // 更新相机
  const cameraRotation = new THREE.Quaternion().setFromEuler(
    new THREE.Euler(state.view.pitch, state.view.yaw, 0, 'YXZ')
  );
  
  camera.position.copy(character.position).add(new THREE.Vector3(0, state.camera.height, 0));
  camera.quaternion.copy(cameraRotation);
}

// 动画循环
function animate() {
  requestAnimationFrame(animate);
  update();
  renderer.render(scene, camera);
}
animate();

// 窗口大小调整
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// GUI控制面板
function setupGUI() {
  const gui = new GUI({ width: 250 }).close();
  
  // 相机设置
  const cameraFolder = gui.addFolder('相机设置');
  cameraFolder.add(state.camera, 'height', 0.2, 2.0, 0.05).name('相机高度');
  cameraFolder.add(camera, 'fov', 60, 120, 1).name('视野角度')
    .onChange(() => camera.updateProjectionMatrix());
  
  // 控制设置
  const controlFolder = gui.addFolder('控制设置');
  controlFolder.add(state.view, 'mouseSensitivity', 0.0005, 0.005, 0.0001).name('鼠标灵敏度');
  controlFolder.add(state.view, 'pitchLimit', 0, Math.PI/2, 0.05).name('视角限制');
  
  // 移动设置
  const moveFolder = gui.addFolder('移动设置');
  moveFolder.add(state.physics, 'speed', 0.05, 0.3, 0.01).name('移动速度');
  moveFolder.add(state.physics, 'sprintMultiplier', 1.2, 3.0, 0.1).name('冲刺倍率');
  moveFolder.add(state.physics, 'jumpForce', 0.1, 0.5, 0.01).name('跳跃高度');
  moveFolder.add(state.physics, 'gravity', 0.005, 0.03, 0.001).name('重力');
  
  gui.domElement.style.cssText = 'position:absolute;top:0;right:0;';
  return gui;
}

// 显示操作提示
GLOBAL_CONFIG.ElMessage('WASD移动，鼠标视角，空格跳跃，Shift加速')