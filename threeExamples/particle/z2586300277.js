import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js'

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

camera.position.set(0, 80, 200)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })

renderer.setSize(window.innerWidth, window.innerHeight)

document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

controls.autoRotate = true

window.onresize = () => {

    camera.aspect = window.innerWidth / window.innerHeight

    camera.updateProjectionMatrix()

    renderer.setSize(window.innerWidth, window.innerHeight)

}

const vertices = []

const colors = []

const sparklesGeometry = new THREE.BufferGeometry()

const sparklesMaterial = new THREE.PointsMaterial({ size: 6, alphaTest: 0.5, map: new THREE.TextureLoader().load(`https://z2586300277.github.io/three-editor/dist/files/channels/snow.png`), vertexColors: true })

const points = new THREE.Points(sparklesGeometry, sparklesMaterial);

scene.add(points)

let sampler = null

let mesh = null

new OBJLoader().load(

    FILE_HOST + 'files/model/z2586300277.obj',

    obj => {

        mesh = obj.children[0]

        mesh.material = new THREE.MeshBasicMaterial({ wireframe: true, color: 0xa58fb5, transparent: true, opacity: 0.2 })

        scene.add(obj)

        sampler = new MeshSurfaceSampler(mesh).build()

        renderer.setAnimationLoop(render)

    }

)

const tempPosition = new THREE.Vector3()

function render() {

    if (vertices.length < 10000) {

        sampler.sample(tempPosition)

        vertices.push(tempPosition.x, tempPosition.y, tempPosition.z)

        sparklesGeometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3))

        const color = new THREE.Color(0xa58fb5)

        colors.push(color.r, color.g, color.b)

        sparklesGeometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3))

    }

    controls.update()

    renderer.render(scene, camera)

}