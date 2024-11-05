import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 100)

camera.position.set(0, 5, 20)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setClearColor(0xffffff, 1)

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

const gird = new THREE.GridHelper(100, 20)

scene.add(gird)

const axes = new THREE.AxesHelper(1000)

scene.add(axes)

new GLTFLoader().load(FILE_HOST + "models/glb/gltfSky/scene.gltf", (gltf) => {

    scene.add(gltf.scene)

    renderer.setAnimationLoop(() => gltf.scene.rotation.y += 0.005)

})