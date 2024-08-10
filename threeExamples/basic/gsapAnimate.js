import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import dat from 'dat.gui'
import gsap from 'gsap'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(0, 30, 30)

const renderer = new THREE.WebGLRenderer({ antialias: true , alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

scene.add(new THREE.AxesHelper(1000))

scene.add(new THREE.GridHelper(100, 20))

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

// 环境贴图
const boxGeometry = new THREE.BoxGeometry(10, 10, 10);

const boxMaterial = new THREE.MeshBasicMaterial({ color: 'blue' });

const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);

scene.add(boxMesh);

new dat.GUI().add({fn: () => {

    // 创建一个相机动画
    createGsapAnimation(camera.position, { x: 20, y: 20, z: 20 })

    // 创建一个目标运动动画
    createGsapAnimation(controls.target, { x: -5, y: 2, z: 1 })

}}, 'fn').name('播放');

/* 视角动画 */
function createGsapAnimation(position, position_, gsapQuery = null) {

    //设置动画 x轴运动 持续时间
    return gsap.to(

        position,

        {

            ...position_,

            //间隔时间
            duration: 2,

            //动画参数名
            ease: 'none',

            //重复次数
            repeat: 0,

            //往返移动
            yoyo: false,

            yoyoEase: true,

            ...gsapQuery,

        }

    )

}