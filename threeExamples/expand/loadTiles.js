import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { TilesRenderer } from '3d-tiles-renderer'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(0, 30, 30)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

scene.add(new THREE.AxesHelper(1000))

// 加载3d tiles
const tilesRenderer = new TilesRenderer(FILE_HOST + '3dtiles/test/tileset.json')

tilesRenderer.setCamera(camera)

tilesRenderer.setResolutionFromRenderer(camera, renderer)

const model = new THREE.Group().add(tilesRenderer.group)

scene.add(model)

const box3 = new THREE.Box3()

tilesRenderer.addEventListener('load-tile-set', () => {

    if (tilesRenderer.getBoundingBox(box3)) {

        box3.getCenter(tilesRenderer.group.position)

        tilesRenderer.group.position.multiplyScalar(-1)

    }

})

animate()

function animate() {

    requestAnimationFrame(animate)

    tilesRenderer.update()

    renderer.render(scene, camera)

}

