import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as tt from 'three-tile'
import * as plugin from "three-tile/plugin"

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 100000)

camera.position.set(0, 10000, 0)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

scene.add(new THREE.AmbientLight(0xffffff, 5))

animate()

function animate() {

    requestAnimationFrame(animate)

    renderer.render(scene, camera)

}

const map = new tt.TileMap({
    imgSource: [new plugin.ArcGisSource(), new plugin.GDSource()],
    minLevel: 2,
    maxLevel: 18,
    lon0: 90
})
map.scale.multiplyScalar(0.001)
map.rotateX(-Math.PI / 2)
scene.add(map)

window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)

    camera.aspect = box.clientWidth / box.clientHeight

    camera.updateProjectionMatrix()

}

