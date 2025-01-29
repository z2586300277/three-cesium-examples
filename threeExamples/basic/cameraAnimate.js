import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { GUI } from 'dat.gui'
import gsap from 'gsap'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(20, 40, 60)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

controls.enableDamping = true

animate()

function animate() {

  requestAnimationFrame(animate)

  controls.update()

  renderer.render(scene, camera)

}

window.onresize = () => {

  renderer.setSize(box.clientWidth, box.clientHeight)

  camera.aspect = box.clientWidth / box.clientHeight

  camera.updateProjectionMatrix()

}

// 文件地址
const urls = [0, 1, 2, 3, 4, 5].map(k => (FILE_HOST + 'files/sky/skyBox0/' + (k + 1) + '.png'));

const textureCube = new THREE.CubeTextureLoader().load(urls);

scene.background = textureCube;

new GLTFLoader().load(FILE_HOST + 'models/glb/daodan.glb', gltf => {

  gltf.scene.traverse(child => {

    if (child.isMesh) {

      child.material.envMap = textureCube

    }

  })

  scene.add(gltf.scene)

})

const gui = new GUI()

let shakeAnimation;

const t = { type: 'camera' }

gui.add(t, 'type', ['camera', 'target']).name('类型');

gui.add({
  fn: () => {

    let c = t.type === 'camera' ? camera.position : controls.target;

    // 镜头无限慢慢抖动
    const shakeIntensity = 6;
    const shakeDuration = 0.3;
    const shake = () => {
      const originalPosition = c.clone();
      shakeAnimation = gsap.timeline({ repeat: -1, yoyo: true });
      shakeAnimation.to(c, {
        x: originalPosition.x + (Math.random() - 0.5) * shakeIntensity,
        y: originalPosition.y + (Math.random() - 0.5) * shakeIntensity,
        z: originalPosition.z + (Math.random() - 0.5) * shakeIntensity,
        duration: shakeDuration,
        ease: 'power1.inOut'
      });
    };

    shake();

  }
}, 'fn').name('目标抖动');

gui.add({
  fn: () => {
    // 停止镜头抖动
    if (shakeAnimation) {
      shakeAnimation.kill();
      shakeAnimation = null;
    }
  }
}, 'fn').name('停止抖动');

// 
gui.add({
  fn: () => {
    const c = camera.position;
    const t = controls.target;
    const jumpHeight = 50;
    const jumpDuration = 0.5;
    const jump = () => {
      // 同时为相机位置和目标点添加跳跃动画
      [c, t].forEach(obj => {
        gsap.to(obj, {
          y: obj.y + jumpHeight,
          duration: jumpDuration,
          ease: 'power2.out',
          yoyo: true,
          repeat: 1,
          onComplete: () => {
    
          }
        });
      });
    };

    jump();
  }
}, 'fn').name('整体跳跃');