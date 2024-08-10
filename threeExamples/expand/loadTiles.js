import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { TilesRenderer } from '3d-tiles-renderer'

// 可选 是否使用
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(0, 30, 30)

const renderer = new THREE.WebGLRenderer({ antialias: true , alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

scene.add(new THREE.AxesHelper(1000))

scene.add(new THREE.GridHelper(100, 20))

window.onresize = () => {

  renderer.setSize(box.clientWidth, box.clientHeight)

  camera.aspect = box.clientWidth / box.clientHeight

  camera.updateProjectionMatrix()
  
}

const tilesRenderer = new TilesRenderer('https://z2586300277.github.io/3d-file-server/3dtiles/test/tileset.json')

// 可选 gltf draco 配置
const loader = new GLTFLoader();

loader.setDRACOLoader(new DRACOLoader().setDecoderPath('https://z2586300277.github.io/3d-file-server/js/three/draco/'));

tilesRenderer.manager.addHandler(/\.gltf$/, loader)

tilesRenderer.progress = (e) => console.log(e)

tilesRenderer.complete = (e) => console.log('complete')

tilesRenderer.setCamera(camera)

tilesRenderer.setResolutionFromRenderer(camera, renderer)

const model = new THREE.Group().add(tilesRenderer.group)

scene.add(model)

//每一个切片加载
tilesRenderer.onLoadModel = function (group, origin) {


}

const box3 = new THREE.Box3();

// 模型加载时
tilesRenderer.onLoadTileSet = (g, k, l) => {

    // 纠正模型位置 根据包围盒子或者包围球使用边界框来定义合理的中心，然后像这样偏移网格的位置来自动进行重新定位
    if (tilesRenderer.getBoundingBox(box3)) {

        box3.getCenter(tilesRenderer.group.position);

        tilesRenderer.group.position.multiplyScalar(- 1);

    }

}

animate()

function animate() {

    requestAnimationFrame(animate)

    controls.update()

    tilesRenderer.update()

    renderer.render(scene, camera)

}