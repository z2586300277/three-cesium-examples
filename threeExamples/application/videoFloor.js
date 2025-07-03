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

scene.add(new THREE.AxesHelper(100), new THREE.GridHelper(100, 10))

const directionalLight = new THREE.DirectionalLight(0xffffff, 3)
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

const ambientLight = new THREE.AmbientLight(0xffffff, 2)
scene.add(ambientLight)

animate()

function animate() {

    controls.update()

    requestAnimationFrame(animate)

    renderer.render(scene, camera)

}

window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)

    camera.aspect = box.clientWidth / box.clientHeight

    camera.updateProjectionMatrix()

}

async function createVideoPlane(url, width, height, positionY) {

    const video = document.createElement('video')
    video.crossOrigin = 'anonymous'
    video.src = url
    video.loop = true
    video.muted = true
    video.play()
    const texture = new THREE.VideoTexture(video)
    const geometry = new THREE.PlaneGeometry(width, height)

    const material = new THREE.MeshStandardMaterial({
        color: 0xffffff * Math.random(), // 随机颜色
        alphaMap: texture,
        opecity: 0.5, // 透明度，可调整
        transparent: true,
        side: THREE.DoubleSide,
    })

    const mesh = new THREE.Mesh(geometry, material)
    mesh.rotation.x = -Math.PI / 2
    mesh.position.set(0, positionY, 0) // 设置位置
    scene.add(mesh)
}

createVideoPlane(FILE_HOST + 'files/video/c1.mp4', 3, 3 , 0.01)
createVideoPlane(FILE_HOST + 'files/video/c2.mp4', 4, 4, 0)
createVideoPlane(FILE_HOST + 'files/video/c3.mp4', 5, 5, -0.01)
