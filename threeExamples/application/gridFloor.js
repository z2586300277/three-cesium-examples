import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 100000)

camera.position.set(50, 50, 50)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

scene.add(new THREE.AxesHelper(100))

const map = new THREE.TextureLoader().load(HOST + 'files/images/grid.png')

const material = new THREE.MeshStandardMaterial({
    map,
    side: THREE.DoubleSide,
    transparent: true,
    emissive: 0x309df1, // 自发光颜色
    emissiveIntensity: 1, // 自发光强度
})

const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    material
)

floor.rotation.x = -Math.PI / 2

scene.add(floor)

animate()

function animate() {

    requestAnimationFrame(animate)

    renderer.render(scene, camera)

}

window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)

    camera.aspect = box.clientWidth / box.clientHeight

    camera.updateProjectionMatrix()

}

