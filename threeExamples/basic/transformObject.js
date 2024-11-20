import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js'
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(0, 3, 6)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

renderer.shadowMap.needsUpdate = true

renderer.shadowMap.enabled = true

box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

controls.enableDamping = true

const folder = new GUI()

// 变换控制器
const transformControls = new TransformControls(camera, renderer.domElement)

// 模式 'translate' | 'rotate' | 'scale'
folder.add(transformControls, 'mode', ['translate', 'rotate', 'scale']).name('模式')

const transformControlsRoot = transformControls.getHelper()

scene.add(transformControlsRoot)

transformControls.addEventListener('dragging-changed', event => {

    controls.enabled = !event.value

})

window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)

    camera.aspect = box.clientWidth / box.clientHeight

    camera.updateProjectionMatrix()

}

new GLTFLoader().load(GLOBAL_CONFIG.getFileUrl('files/model/Fox.glb'), (gltf) => {

    const model = gltf.scene

    model.scale.set(0.01, 0.01, 0.01)

    model.traverse((child) => {

        if (child.isMesh) child.castShadow = true

    })

    scene.add(model)

    folder.add({ '控制模型': () => transformControls.attach(model) }, '控制模型')

})

const pointLight = new THREE.DirectionalLight(0xffffff, 1)

pointLight.position.set(1, 2, 0)

pointLight.castShadow = true

scene.add(pointLight)

folder.add({ '控制光源': () => transformControls.attach(pointLight) }, '控制光源')

const plane = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshStandardMaterial({ color: 0xffffff }))

plane.position.y -= 0.5

plane.rotation.x = -Math.PI / 2

plane.receiveShadow = true

scene.add(plane)

folder.add({ '控制平面': () => transformControls.attach(plane) }, '控制平面')

animate()

function animate() {

    requestAnimationFrame(animate)

    controls.update()

    renderer.render(scene, camera)

}