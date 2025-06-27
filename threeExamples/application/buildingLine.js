import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { LineSegments2 } from 'three/examples/jsm/lines/LineSegments2.js';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';
import { LineSegmentsGeometry } from 'three/examples/jsm/lines/LineSegmentsGeometry.js';

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 100000)

camera.position.set(1, 1, 1)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

scene.add(new THREE.AxesHelper(100))

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

const urls = [0, 1, 2, 3, 4, 5].map(k => (FILE_HOST + 'files/sky/skyBox0/' + (k + 1) + '.png'));

const textureCube = new THREE.CubeTextureLoader().load(urls);

new GLTFLoader().load(FILE_HOST + 'models/whitebuild.glb', (gltf) => {

    const model = gltf.scene

    model.traverse((child) => {

        if (child.isMesh) {

            child.material.envMap = textureCube

            const { geometry } = child
            const edges = new THREE.EdgesGeometry(geometry)
            let lineGeometry = new LineSegmentsGeometry().fromEdgesGeometry(edges)
            const material = new LineMaterial({
                color: 0xfcde8c,
                linewidth: 2.5,
                envMap: textureCube,
                resolution: new THREE.Vector2(box.clientWidth, box.clientHeight)
            })

            const lines = new LineSegments2(lineGeometry, material)
            lines.computeLineDistances()
            lines.applyMatrix4(child.matrixWorld)

            scene.add(lines)
        }

    })

    scene.add(model)
})