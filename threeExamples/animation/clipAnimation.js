import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { GUI } from 'dat.gui'
import gsap from 'gsap'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(5, 2, 0)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

controls.enableDamping = true

const pointLight = new THREE.PointLight(0xffffff, 1.5, 0, 0)

pointLight.position.set(5, 5, 5)

scene.add(pointLight)

scene.add(new THREE.AmbientLight(0xffffff, 1))

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

let group

const loader = new GLTFLoader()

loader.setDRACOLoader(new DRACOLoader().setDecoderPath(FILE_HOST + 'js/three/draco/'))

loader.load(

    HOST + '/files/model/car.glb',

    function (gltf) {

        group = gltf.scene

        scene.add(group)

    }

)

// 裁剪面
const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)

renderer.clippingPlanes = [plane]

renderer.localClippingEnabled = true

const gui = new GUI()

gui.add({ play: () => { gsap.to(plane, { constant: 2, duration: 2 })} }, 'play')

gui.add({ restore: () => { gsap.to(plane, { constant: -2, duration: 2 })} }, 'restore')