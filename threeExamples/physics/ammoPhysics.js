import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { AmmoPhysics } from 'three/addons/physics/AmmoPhysics.js'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(60, box.clientWidth / box.clientHeight, 1, 10000)

camera.position.set(15, 15, 15)

const renderer = new THREE.WebGLRenderer({ antialias: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

scene.add(new THREE.DirectionalLight(0xffffff, 3))

// 安装
const physics = await AmmoPhysics()

const floor = new THREE.Mesh(new THREE.BoxGeometry(60, 5, 60), new THREE.MeshLambertMaterial({ color: 0x444444 }))

floor.position.y -= 20

floor.userData.physics = { mass: 0 }

scene.add(floor)

for (let i = 0; i < 100; i++) {

    const geometry = Math.random() > 0.5 ? new THREE.IcosahedronGeometry() : new THREE.SphereGeometry()

    const material = new THREE.MeshLambertMaterial({ color: 0xffffff * Math.random() })

    const mesh = new THREE.Mesh(geometry, material)

    mesh.position.set(Math.random() - 0.5, Math.random() * 2, Math.random() - 0.5)

    mesh.userData.physics = { mass: 1 }

    scene.add(mesh)

}

physics.addScene(scene) // 启动物理引擎

animate()

function animate() {

    renderer.render(scene, camera)

    requestAnimationFrame(animate)
    
}