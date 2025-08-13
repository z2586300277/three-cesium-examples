import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js'
import { GLTFExporter } from 'three/addons/exporters/GLTFExporter.js';

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 100000)

camera.position.set(5, 5, 5)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

controls.enableDamping = true

scene.add(new THREE.AmbientLight(0xffffff, 3))

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

const urls = [0, 1, 2, 3, 4, 5].map(k => (FILE_HOST + 'files/sky/skyBox0/' + (k + 1) + '.png'));

const textureCube = new THREE.CubeTextureLoader().load(urls);

scene.background = textureCube

const objLoader = new OBJLoader()

const mtlLoader = new MTLLoader()

mtlLoader.load(FILE_HOST + 'files/model/house/house.mtl', (mtl) => {

    mtl.preload()

    objLoader.setMaterials(mtl)

    objLoader.load(FILE_HOST + 'files/model/house/house.obj', (obj) => scene.add(obj))

})

const exporter = new GLTFExporter();

const button = document.createElement('button');
button.textContent = '导出模型';
button.style.position = 'absolute';
button.style.top = '10px';
button.style.left = '100px';
box.appendChild(button);

button.onclick = async () => {

    exporter.parse(scene, (result) => {

        const outBlob = result instanceof ArrayBuffer
            ? new Blob([result], { type: 'model/gltf-binary' })
            : new Blob([JSON.stringify(result, null, 2)], { type: 'model/gltf+json' })

        const link = document.createElement('a')
        link.href = URL.createObjectURL(outBlob)
        link.download = result instanceof ArrayBuffer ? 'scene.glb' : 'scene.gltf'
        link.click()
        URL.revokeObjectURL(link.href)

    }, { binary: true, onlyVisible: true, embedImages: true })

}

