import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { GUI } from 'dat.gui'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 100000)

camera.position.set(10, 10, 10)

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

const stats = new Stats()

stats.dom.style.top = '50px'

document.body.appendChild(stats.dom)

const clock = new THREE.Clock()

let timeS = 0, fps = 60, renderT = 1 / fps

let gui = new GUI()
   
gui.add({ fps }, 'fps', 1, 300).onFinishChange(v => {

    fps = v

    renderT = 1 / fps

})


animate()

function animate() {

    timeS += clock.getDelta()

    if (timeS > renderT) {

        controls.update()

        stats.update()

        renderer.render(scene, camera)

        timeS = 0

    }

    requestAnimationFrame(animate)

}


const loader = new GLTFLoader()

loader.setDRACOLoader(new DRACOLoader().setDecoderPath(FILE_HOST + 'js/three/draco/'))

const urls = [0, 1, 2, 3, 4, 5].map(k => (FILE_HOST + 'files/sky/skyBox0/' + (k + 1) + '.png'));

const textureCube = new THREE.CubeTextureLoader().load(urls);

loader.load(

    FILE_HOST + '/models/glb/build3.glb',

    gltf => {

        gltf.scene.traverse(child => {

            if (child.isMesh) child.material.envMap = textureCube

        })

        scene.add(gltf.scene)

    }

)


