import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js"
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

console.log(THREE.REVISION)

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(0, 10, 10)

const renderer = new THREE.WebGLRenderer({})

renderer.setSize(box.clientWidth, box.clientHeight)

renderer.shadowMap.needsUpdate = true

renderer.shadowMap.enabled = true

box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

controls.enableDamping = true

window.onresize = () => {

  renderer.setSize(box.clientWidth, box.clientHeight)

  camera.aspect = box.clientWidth / box.clientHeight

  camera.updateProjectionMatrix()

}

new GLTFLoader().load(GLOBAL_CONFIG.getFileUrl('files/model/Fox.glb'), (gltf) => {

  const model = gltf.scene

  model.scale.set(0.01, 0.01, 0.01)

  model.traverse((child) => {

    if (child.isMesh) child.castShadow = true

  })

  scene.add(model)

})

const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshStandardMaterial({ color: 0xffffff }))

mesh.castShadow = true

mesh.position.set(3, 1, 1)

scene.add(mesh)

const pointLight = new THREE.DirectionalLight(0xffffff, 1)

pointLight.position.set(0, 400, 0)

pointLight.castShadow = true

scene.add(pointLight)

const plane = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshStandardMaterial({ color: 0xffffff }))

plane.position.y -= 0.5

plane.rotation.x = -Math.PI / 2

plane.receiveShadow = true

scene.add(plane)

const folder = new GUI()

const shadowMapList = {

  Basic: THREE.BasicShadowMap,

  PCF: THREE.PCFShadowMap,

  PCFSoft: THREE.PCFSoftShadowMap,

  VSM: THREE.VSMShadowMap

}

folder.add(renderer.shadowMap, 'enabled').name('shadowEnabled').onChange(() => {

  scene.traverse((object) => {

    if (object.material) object.material.needsUpdate = true;
    
  })

})

folder.add(renderer.shadowMap, 'type', shadowMapList).name('shadowType').onChange(() => {

  scene.traverse((object) => {

    if (object.material) object.material.needsUpdate = true;

  })

})

folder.add(plane, 'receiveShadow').name('planeShadow')

folder.add(mesh, 'castShadow').name('boxShadow')

folder.add(pointLight, 'castShadow').name('lightShadow')

animate()

function animate() {

  mesh.rotation.x += 0.01

  mesh.rotation.y += 0.01

  requestAnimationFrame(animate)

  controls.update()

  renderer.render(scene, camera)

}