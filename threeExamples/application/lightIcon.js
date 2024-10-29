import { Mesh, MeshBasicMaterial, PerspectiveCamera, PlaneGeometry, Scene, TextureLoader, WebGLRenderer } from 'three'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'

const size = { width: window.innerWidth, height: window.innerHeight }
const scene = new Scene()

const camera = new PerspectiveCamera(45, size.width / size.height, 0.1, 1000)
camera.position.set(30, 30, 30)

const renderer = new WebGLRenderer({ antialias: true })
renderer.setSize(size.width, size.height)
renderer.setPixelRatio(window.devicePixelRatio)
document.body.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

const circlePlane = new PlaneGeometry(6, 6)
const circleTexture = new TextureLoader().load(FILE_HOST + 'images/channels/label.png')
const circleMaterial = new MeshBasicMaterial({
    color: 0xffffff,
    map: circleTexture,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide
})
const circleMesh = new Mesh(circlePlane, circleMaterial)
circleMesh.rotation.x = -Math.PI / 2
gsap.to(circleMesh.scale, {
    duration: 1 + Math.random() * 0.5,
    x: 1.5,
    y: 1.5,
    repeat: -1
})

const lightPillarTexture = new THREE.TextureLoader().load(FILE_HOST + 'images/channels/light_column.png')
const lightPillarGeometry = new THREE.PlaneGeometry(3, 20)
const lightPillarMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    map: lightPillarTexture,
    alphaMap: lightPillarTexture,
    transparent: true,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    depthWrite: false
})
const lightPillar = new THREE.Mesh(lightPillarGeometry, lightPillarMaterial)
lightPillar.add(lightPillar.clone().rotateY(Math.PI / 2))
circleMesh.position.set(0, -10, 0)

lightPillar.add(circleMesh)
scene.add(lightPillar)

animate()
function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
}
