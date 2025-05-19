import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 10000000)

camera.position.set(10, 10, 10)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

controls.enableDamping = true

scene.add(new THREE.AxesHelper(500), new THREE.AmbientLight(0xffffff, 2))

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

// 文件地址
const urls = [0, 1, 2, 3, 4, 5].map(k => (FILE_HOST + 'files/sky/skyBox0/' + (k + 1) + '.png'));

const textureCube = new THREE.CubeTextureLoader().load(urls);

scene.background = textureCube;

// 创建一个文件上传的输入框
const input = document.createElement('input')
input.type = 'file'
input.accept = '.glb'
Object.assign(input.style, {
  position: 'absolute',
  top: '30px',
  left: '100px',
  zIndex: 9999
})
input.onchange = (e) => {
  const file = e.target.files[0]
  const url = URL.createObjectURL(file)
  new GLTFLoader().setDRACOLoader(new DRACOLoader().setDecoderPath(FILE_HOST + 'js/three/draco/')).load(url, (gltf) => {
    gltf.scene.traverse((child) => {
      if (child?.material) child.material.envMap = textureCube
    })
    scene.add(gltf.scene)

    // 主视图
    const box3 = new THREE.Box3().setFromObject(gltf.scene)
    const center = box3.getCenter(new THREE.Vector3())
    const size = box3.getSize(new THREE.Vector3())
    const maxDim = Math.max(size.x, size.y, size.z)
    const fov = camera.fov * (Math.PI / 180)
    const distance = (maxDim / 2) / Math.tan(fov / 2)
    camera.position.set(center.x, center.y, center.z + distance + size.z / 2)
    camera.lookAt(center)
    controls.target.copy(center)
    controls.update()

  })
  URL.revokeObjectURL(url)
}
document.body.appendChild(input)
