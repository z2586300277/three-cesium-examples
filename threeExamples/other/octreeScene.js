import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { Octree } from 'three/examples/jsm/math/Octree.js';

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 100000)

camera.position.set(3, 3, 3)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

// 创建一个长方体
const geometry = new THREE.CapsuleGeometry(0.5, 1, 10, 10)

const material = new THREE.MeshNormalMaterial()

const cube = new THREE.Mesh(geometry, material)

cube.scale.set(0.1, 0.15, 0.1)

cube.position.set(0, 1, 0)

scene.add(cube)

// 地图
new GLTFLoader().load(FILE_HOST + "models/glb/build3.glb", (gltf) => {

    scene.add(gltf.scene)

    // Octree
    const octree = new Octree()

    octree.fromGraphNode(gltf.scene)

    // 文件地址
    const urls = [0, 1, 2, 3, 4, 5].map(k => (FILE_HOST + 'files/sky/skyBox0/' + (k + 1) + '.png'));

    const textureCube = new THREE.CubeTextureLoader().load(urls);

    gltf.scene.traverse(i => {

        if (i.isMesh) {

            i.material.envMap = textureCube

        }

    })

})

animate()

function animate() {

    requestAnimationFrame(animate)

    renderer.render(scene, camera)

}

window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)

    camera.aspect = box.clientWidth / box.clientHeight

    camera.updateProjectionMatrix()

}

