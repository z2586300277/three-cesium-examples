import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { SparkRenderer, SplatMesh } from "@sparkjsdev/spark";

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 100000)

camera.position.set(5, 5, 5)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

scene.add(new THREE.AxesHelper(100))

const spark = new SparkRenderer({ renderer });

scene.add(spark);

const params = { url: FILE_HOST + 'other/deskFlower.ksplat' }

const butterfly = new SplatMesh(params);

butterfly.quaternion.set(0, 0, -1, 0);

butterfly.position.set(2, 2, -3)

scene.add(butterfly)

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

