import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(0, 0, 5)

const renderer = new THREE.WebGLRenderer()

renderer.setSize(box.clientWidth, box.clientHeight)

const controls = new OrbitControls(camera, renderer.domElement)

box.appendChild(renderer.domElement)

const geometry = new THREE.BoxGeometry()

const material = new THREE.MeshBasicMaterial({ color: 0xffffff })

const cube = new THREE.Mesh(geometry, material)

scene.add(cube)

function animate() {

    requestAnimationFrame(animate)

    cube.rotation.x += 0.01

    cube.rotation.y += 0.01

    renderer.render(scene, camera)

}

animate()