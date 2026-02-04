import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(30, 30, 30)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)

    camera.aspect = box.clientWidth / box.clientHeight

    camera.updateProjectionMatrix()

}

scene.add(new THREE.AmbientLight(0xffffff, 2))

// 创建一个曲线
const curve = new THREE.CatmullRomCurve3([

    new THREE.Vector3(0, 20, 2),

    new THREE.Vector3(0, 0, 0),

    new THREE.Vector3(10, 8, 20),

])

// 创建曲线几何
const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(500))

// 创建曲线材质
const material = new THREE.LineBasicMaterial({ color: 0xffffff })

// 创建曲线
const curveMesh = new THREE.Line(geometry, material)

// 添加曲线到场景
scene.add(curveMesh)

let obj = null

const loader = new GLTFLoader()

loader.load('https://z2586300277.github.io/3d-file-server/models/glb/daodan.glb', g => {

    scene.add(g.scene)

    g.scene.scale.multiplyScalar(0.1)

    obj = g.scene

})

animate()

const speed = 0.001 // 控制物体沿曲线移动的速度

const spin = 0.15 // 控制物体自旋的速度

let t = 0 // 当前物体在曲线上的位置（0~1之间）

let r = 0 // 当前自旋的角度

const baseDir = new THREE.Vector3(0, 0, 1) // 物体默认朝向（z轴正方向）

function animate() {

    requestAnimationFrame(animate)

    if (obj) {

        t = (t + speed) % 1 // 更新位置参数

        r += spin // 更新自旋角度

        obj.position.copy(curve.getPointAt(t)) // 设置物体位置

        const tangent = curve.getTangentAt(t).normalize() // 计算切线方向

        const lookQuat = new THREE.Quaternion().setFromUnitVectors(baseDir, tangent) // 计算朝向四元数

        const spinQuat = new THREE.Quaternion().setFromAxisAngle(tangent, r) // 计算自旋四元数

        obj.quaternion.copy(lookQuat).premultiply(spinQuat) // 应用旋转

    }

    renderer.render(scene, camera)
    
}