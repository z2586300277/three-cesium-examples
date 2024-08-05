import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

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

scene.add(new THREE.AmbientLight(0xffffff, 4))

scene.add(new THREE.AxesHelper(1000))

// 创建一个曲线
const curve = new THREE.CatmullRomCurve3([

    new THREE.Vector3(0, 0, 0),

    new THREE.Vector3(20, 15, 0),

    new THREE.Vector3(15, 0, 20),

    new THREE.Vector3(5, 15, -5),

    new THREE.Vector3(10, 0, -10)

])

// 创建曲线几何
const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(500))

// 创建曲线材质
const material = new THREE.LineBasicMaterial({ color: 0xffffff })

// 创建曲线
const curveMesh = new THREE.Line(geometry, material)

// 添加曲线到场景
scene.add(curveMesh)

let car = null

const loader = new GLTFLoader()

loader.setDRACOLoader(new DRACOLoader().setDecoderPath('https://z2586300277.github.io/3d-file-server/js/three/draco/'))

loader.load(

    '/three-cesium-examples/public/files/model/car.glb',

    gltf => {

        car = gltf.scene

        scene.add(car)
        // 定义时间
        let t = 0

        car.render = () => {

            t += 0.0004

            const point = curve.getPointAt(t % 1) // 获取当前点

            car.position.set(point.x, point.y, point.z) // 设置位置

            car.lookAt(curve.getPointAt((t + 0.01) % 1)) // 朝向下一个点

        }

    },

    (xhr) => { },

    (e) => { }

)

animate()

function animate() {

    requestAnimationFrame(animate)

    car?.render()

    renderer.render(scene, camera)

}