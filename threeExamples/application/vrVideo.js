import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 100000)

camera.position.set(2, 2, 2)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setPixelRatio(window.devicePixelRatio * 1.5)

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

const video = document.createElement('video')
video.crossOrigin = 'anonymous'
video.src = FILE_HOST + 'video/vr.mp4'
video.loop = true
video.muted = true
video.play()

const texture = new THREE.VideoTexture(video)
const geometry = new THREE.SphereGeometry(100, 64, 32)

const material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide,
})

const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

animate()

function animate() {

    controls.update()

    mesh.rotation.y += 0.001

    requestAnimationFrame(animate)

    renderer.render(scene, camera)

}

window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)

    camera.aspect = box.clientWidth / box.clientHeight

    camera.updateProjectionMatrix()

}
