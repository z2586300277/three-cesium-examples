import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as CANNON from 'cannon-es';

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(0, 10, 10)

const renderer = new THREE.WebGLRenderer()

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

scene.add(new THREE.AxesHelper(5000), new THREE.AmbientLight(0xffffff, 0.5))

const pointLight = new THREE.PointLight(0xffffff, 3, 0)

pointLight.position.set(0, 2, 0)

scene.add(pointLight)

const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -9.82, 0) })

// 渲染时间略有不同的时间显示物理模拟的状态
world.PhysicsRender = (deltaTime) => {

    world.step(1 / 60, deltaTime, 3)

    world.bodies.forEach(body => body.render?.())

}

// 创建一个立方体
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1)

const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff })

const cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial)

cubeMesh.position.set(0, 5, 0)

createPhysicsBody(world, cubeMesh, 1)

scene.add(cubeMesh)

// 创建一个平面
const planeGeometry = new THREE.PlaneGeometry(10, 10)

const planeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide })

const planeMesh = new THREE.Mesh(planeGeometry, planeMaterial)

planeMesh.rotation.x = Math.PI / 2

createPhysicsBody(world, planeMesh, 0)

scene.add(planeMesh)

animate()

function animate() {

    requestAnimationFrame(animate)

    world.PhysicsRender()

    renderer.render(scene, camera)

}

window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)

    camera.aspect = box.clientWidth / box.clientHeight

    camera.updateProjectionMatrix()

}

function createPhysicsBody(PhysicsWorld, model, mass) {

    const box = new THREE.Box3().setFromObject(model);

    const { max, min } = box

    const center = new THREE.Vector3();

    box.getCenter(center);

    const body = new CANNON.Body({

        mass: mass,

        shape: new CANNON.Box(new CANNON.Vec3((max.x - min.x) / 2, (max.y - min.y) / 2, (max.z - min.z) / 2)),

        position: center,

    })

    body.position.copy(model.position)

    PhysicsWorld.addBody(body)

    body.render = () => model.position.copy(body.position)

}