import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(7, 7, 7)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

controls.enableDamping = true

const gridHelper = new THREE.GridHelper(10, 10)

scene.add(gridHelper)

// 生成一个管道
const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-5, 0, 0),
    new THREE.Vector3(0, 2.5, 0),
    new THREE.Vector3(5, 0, 0)
])

const map = new THREE.TextureLoader().load(FILE_HOST + '/images/texture/flyLine1.png')

map.wrapS = THREE.RepeatWrapping

map.repeat.set(5, 2)

const tube = new THREE.TubeGeometry(curve, 200, 0.2, 2, false);

const material = new THREE.MeshBasicMaterial({ map, transparent: true })

const mesh = new THREE.Mesh(tube, material)

scene.add(mesh)

// 生成一个飞线
const curve1 = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-3, 0, 3),
    new THREE.Vector3(0, 2, 0),
    new THREE.Vector3(3, 0, -4),
    
])

const map1 = new THREE.TextureLoader().load(FILE_HOST + '/images/texture/flyLine4.png')

map1.wrapS = THREE.RepeatWrapping

map1.wrapT = THREE.RepeatWrapping

map1.repeat.set(3, 1)

const tube1 = new THREE.TubeGeometry(curve1, 200, 0.03, 20, false);

const material1 = new THREE.MeshBasicMaterial({map:map1, transparent: true , side: THREE.DoubleSide})

const mesh1 = new THREE.Mesh(tube1, material1)

scene.add(mesh1)

const mesh2 = mesh.clone()

mesh2.rotation.y = Math.PI / 2

scene.add(mesh2)

animate()

function animate() {

    map.offset.x -= 0.01

    map1.offset.x -= 0.01

    controls.update()

    renderer.render(scene, camera)

    requestAnimationFrame(animate)

}

window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)

    camera.aspect = box.clientWidth / box.clientHeight

    camera.updateProjectionMatrix()

}
