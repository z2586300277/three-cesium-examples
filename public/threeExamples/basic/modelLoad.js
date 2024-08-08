import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(5, 5, 5)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)

    camera.aspect = box.clientWidth / box.clientHeight

    camera.updateProjectionMatrix()

}

animate()

function animate() {

    requestAnimationFrame(animate)

    renderer.render(scene, camera)

}

scene.add(new THREE.AmbientLight(0xffffff, 4))

scene.add(new THREE.AxesHelper(1000))

// 加载模型 gltf/ glb  draco解码器
const loader = new GLTFLoader()

loader.setDRACOLoader(new DRACOLoader().setDecoderPath('https://z2586300277.github.io/3d-file-server/js/three/draco/'))

loader.load(

    '/three-cesium-examples/public/files/model/car.glb',

    gltf => {

        scene.add(gltf.scene)

    }

)

// 加载模型 fbx
new FBXLoader().load('/three-cesium-examples/public/files/model/city.FBX', (object3d) => {

    scene.add(object3d)

    object3d.scale.set(0.0005, 0.0005, 0.0005)

})

// 加载模型 obj/ mtl
const objLoader = new OBJLoader()

const mtlLoader = new MTLLoader()

mtlLoader.load('https://z2586300277.github.io/3d-file-server/files/model/house/house.mtl', (mtl) => {

    mtl.preload()

    objLoader.setMaterials(mtl)

    objLoader.load(

        'https://z2586300277.github.io/3d-file-server/files/model/house/house.obj',

        (obj) => {

            scene.add(obj)

            obj.position.x += 3

        }

    )

})
