import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true });

renderer.setSize(window.innerWidth, window.innerHeight);

document.body.appendChild(renderer.domElement)

const urls = [0, 1, 2, 3, 4, 5].map(k => (FILE_HOST + 'files/sky/skyBox0/' + (k + 1) + '.png'))

const textureCube = new THREE.CubeTextureLoader().load(urls)

scene.background = textureCube

scene.add(new THREE.GridHelper(100, 40))

let character

new GLTFLoader().load(FILE_HOST + "files/model/Fox.glb", (gltf) => {

  character = gltf.scene
  character.traverse(i => i.isMesh && (i.material.envMap = textureCube))

  scene.add(character)
  character.scale.multiplyScalar(0.03)

  const mixer = new THREE.AnimationMixer(character) // 模型动画
  const action = mixer.clipAction(gltf.animations[1])
  const clock = new THREE.Clock()
  character.mixerUpdate = () => mixer.update(clock.getDelta())
  action.play()

})


// 相机参数
const cameraOffset = new THREE.Vector3(0, 5, -5);
const smoothFactor = 0.1;
const moveSpeed = 0.06;
const turnSpeed = 0.03;

// 移动状态
const keys = { w: false, s: false, a: false, d: false };
document.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
document.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

function update() {

  if (!character) return

  if (keys.a) character.rotation.y += turnSpeed;
  if (keys.d) character.rotation.y -= turnSpeed;
  if (keys.w || keys.s) {
    const dir = new THREE.Vector3();
    character.getWorldDirection(dir);
    character.position.add(dir.multiplyScalar(keys.w ? moveSpeed : -moveSpeed));
  }
  character.mixerUpdate()

  const targetPos = character.position.clone().add(cameraOffset.clone().applyQuaternion(character.quaternion));
  camera.position.lerp(targetPos, smoothFactor);
  camera.lookAt(character.position.clone().add(new THREE.Vector3(0, 1, 0)));

}

// 动画循环
animate();
function animate() {

  update()
  requestAnimationFrame(animate)
  renderer.render(scene, camera)

}

// 窗口自适应
window.addEventListener('resize', () => {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);

})

GLOBAL_CONFIG.ElMessage('键盘事件：WASD移动')