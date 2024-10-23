import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js"
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader.js'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(0, 2, 3)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

controls.enableDamping = true

animate()

function animate() {

    requestAnimationFrame(animate)

    controls.update()

    renderer.render(scene, camera)

}

window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)

    camera.aspect = box.clientWidth / box.clientHeight

    camera.updateProjectionMatrix()

}

// HDR
const pmremGenerator = new THREE.PMREMGenerator(renderer);

const texture = new RGBELoader().load(FILE_HOST + '/files/hdr/1k.hdr', (t) => {

    const map = pmremGenerator.fromEquirectangular(t).texture

    pmremGenerator.dispose()

    return map

})

texture.mapping = THREE.EquirectangularReflectionMapping

// GLTF
const loader = new GLTFLoader()

loader.setMeshoptDecoder(MeshoptDecoder)

loader.load(FILE_HOST + 'models/su7/sm_car.gltf', gltf => {

    scene.add(gltf.scene)

    gltf.scene.traverse(obj => {

        if (obj.isMesh) {

            obj.material.envMap = texture

        }

    })

})



