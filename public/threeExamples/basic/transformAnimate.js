import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import gsap from 'gsap'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(10, 10, 10)

const renderer = new THREE.WebGLRenderer()

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

animate()

function animate() {

    renderer.render(scene, camera)

    requestAnimationFrame(animate)

}

window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)

    camera.aspect = box.clientWidth / box.clientHeight

    camera.updateProjectionMatrix()

}

scene.add(new THREE.AxesHelper(100000), new THREE.AmbientLight(0xffffff, 6))

// 加载模型
new FBXLoader().load('/three-cesium-examples/public/files/model/city.FBX', (object3d) => {

    scene.add(object3d)

    object3d.scale.set(0.0005, 0.0005, 0.0005)

    setTransformAnimate(object3d)

})

// 变换动画
function setTransformAnimate(mesh) {

    const position = mesh.position.clone()
    
    position.y += 5 // 位置向上移动100

    const rotation = mesh.rotation.clone()

    rotation.y += Math.PI / 4 // 旋转45度

    const scale = mesh.scale.clone()
    
    scale.z *= 2 // 缩放z轴2倍

    scale.x *= 2 // 缩放x轴2倍

    // 组合参数
    const transformInfo_ = { position, rotation, scale } 

    // 执行
    const promises_gsap = ['position', 'rotation', 'scale'].map(i => {

        return new Promise(resolve => {
    
            gsap.to(mesh[i], {
    
                x: transformInfo_[i].x,
    
                y: transformInfo_[i].y,
    
                z: transformInfo_[i].z,
    
                //间隔时间
                duration: 3,
    
                //动画参数名
                ease: 'none',
    
                //重复次数
                repeat: 0,
    
                //往返移动
                yoyo: false,
    
                yoyoEase: true,
    
                onComplete: resolve
    
            })
    
        })
    
    })
    
    Promise.all(promises_gsap).then(() => console.log('动画完成'))

}
