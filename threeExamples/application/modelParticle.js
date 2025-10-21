import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import gsap from 'gsap'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 100000)

camera.position.set(300, 300, 300)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

const loader = new GLTFLoader()

loader.setDRACOLoader(new DRACOLoader().setDecoderPath(FILE_HOST + 'js/three/draco/'))

loader.load(

    FILE_HOST + '/files/model/LittlestTokyo.glb',

    gltf => {

        let count = 0

        gltf.scene.traverse(child => {

            if (child.isMesh) {

                count++

                setTimeout(() => {

                    const particles = createPoints(child)

                    scene.add(particles)

                    gsap.to(particles.material, { opacity: 0.9, duration: 1 })

                }, count * 100)

            }

        })

    }

)

animate()

function animate() {

    requestAnimationFrame(animate)

    renderer.render(scene, camera)

}

function createPoints(mesh) {

    mesh.updateMatrixWorld()

    const positions = []

    const vertex = new THREE.Vector3();

    for (let i = 0; i < mesh.geometry.attributes.position.count; i++) {

        vertex.fromBufferAttribute(mesh.geometry.attributes.position, i)

        vertex.applyMatrix4(mesh.matrixWorld)

        positions.push(vertex.x, vertex.y, vertex.z)

    }

    const geometry = new THREE.BufferGeometry()

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))

    const colors = new Float32Array(positions.map(() => Math.random()))

    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({

        size: 10,

        vertexColors: true,

        opacity: 0,

        map: new THREE.TextureLoader().load(HOST + 'files/images/snow.png'),

        transparent: true

    })

    const particles = new THREE.Points(geometry, material)

    return particles

}