import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { ViewHelper } from 'three/examples/jsm/helpers/ViewHelper.js'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(0, 10, 10)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

controls.enableDamping = true

scene.add(new THREE.AxesHelper(5), new THREE.GridHelper(10, 10))

const viewHelper = new ViewHelper(camera, renderer.domElement)

renderer.autoClear = false // 需要将自动清除关闭

animate()

function animate() {

    controls.update()

    // renderer.clear() // 可能需要的清除操作

    renderer.render(scene, camera)

    viewHelper.render(renderer)

    requestAnimationFrame(animate)

}

