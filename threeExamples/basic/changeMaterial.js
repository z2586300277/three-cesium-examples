import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { GUI } from "three/addons/libs/lil-gui.module.min.js"
import gsap from 'gsap'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(1, 2, 2)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

controls.enableDamping = true

window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)

    camera.aspect = box.clientWidth / box.clientHeight

    camera.updateProjectionMatrix()

}

animate()

function animate() {

    requestAnimationFrame(animate)

    controls.update()

    renderer.render(scene, camera)

}

scene.add(new THREE.AmbientLight(0xffffff, 0.2))

const pointLight = new THREE.PointLight(0xffffff, 1.5, 0, 2)

pointLight.position.set(5, 5, 5)

scene.add(pointLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 2)

directionalLight.position.set(-5, 5, -5)

scene.add(directionalLight)

let group

// 加载模型 gltf/ glb  draco解码器
const loader = new GLTFLoader()

loader.setDRACOLoader(new DRACOLoader().setDecoderPath(FILE_HOST + 'js/three/draco/'))

loader.load(

    HOST + '/files/model/car.glb',

    gltf => {

        group = gltf.scene

        scene.add(group)

        changeMaterial()

    }

)

// 文件地址
const urls = [0, 1, 2, 3, 4, 5].map(k => (FILE_HOST + 'files/sky/skyBox0/' + (k + 1) + '.png'));

const textureCube = new THREE.CubeTextureLoader().load(urls);

function changeMaterial() {

    let material

    if (!group) return

    group.traverse(child => {

        if (child.isMesh && child.name === '网格138_3') {

            material = child.material

            material.envMap = textureCube

        }

    })

    const folder = new GUI()

    folder.add(material, 'wireframe').name('线框').listen()

    folder.add(material, 'transparent').name('透明').listen()

    folder.add(material, 'opacity').min(0).max(1).name('透明度').listen()

    folder.addColor({ color: material.color.clone() }, 'color').name('颜色').listen().onChange(c => {

        gsap.to(material.color, { ...c, duration: 1.5 })

    })

    folder.add(material, 'metalness').min(0).max(1).name('金属度').listen()

    folder.add(material, 'roughness').min(0).max(1).name('粗糙度').listen()

}