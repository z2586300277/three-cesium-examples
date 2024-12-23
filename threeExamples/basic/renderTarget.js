import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 100000)

camera.position.set(2, 0, 9)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

const urls = [0, 1, 2, 3, 4, 5].map(k => (FILE_HOST + 'files/sky/skyBox0/' + (k + 1) + '.png'));

const textureCube = new THREE.CubeTextureLoader().load(urls);

scene.background = textureCube;

const renderTarget = new THREE.WebGLRenderTarget(box.clientWidth, box.clientHeight)

new GLTFLoader().load(

    FILE_HOST + 'models/glb/computer.glb',

    gltf => {

        const model = gltf.scene

        model.traverse(child =>  child.layers.set(1))

        scene.add(model)

    }

)

const plane = new THREE.Mesh(new THREE.PlaneGeometry(4, 4), new THREE.MeshBasicMaterial({ map: renderTarget.texture }))

scene.add(plane)

const sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), new THREE.MeshBasicMaterial({ map: renderTarget.texture }))

sphere.position.set(3, 0, 0)

scene.add(sphere)

animate()

function animate() {

    camera.layers.set(1)

    renderer.setRenderTarget(renderTarget)

    renderer.render(scene, camera)

    camera.layers.set(0)

    renderer.setRenderTarget(null)

    renderer.render(scene, camera)

    requestAnimationFrame(animate)

}

