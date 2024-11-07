import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { GUI } from 'three/addons/libs/lil-gui.module.min.js'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 100000)

camera.position.set(0, 20, 60)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

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

scene.add(new THREE.AmbientLight(0xffffff, 1))

const directionalLight = new THREE.DirectionalLight(0xffffff, 1)

directionalLight.position.set(0, 100, 0)

scene.add(directionalLight)

window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)

    camera.aspect = box.clientWidth / box.clientHeight

    camera.updateProjectionMatrix()

}

new GLTFLoader().load(GLOBAL_CONFIG.getFileUrl('files/model/Fox.glb'), (gltf) => {

    gltf.scene.position.set(0, 0, -500)

    scene.add(gltf.scene)

})

new GLTFLoader().load(GLOBAL_CONFIG.getFileUrl('models/glb/foorGround.glb'), (gltf) => {

    const model = gltf.scene

    model.position.z += 60

    model.position.x -= 200

    model.scale.set(10, 10, 10)

    scene.add(model)

})

function getFog(type, color) {

    renderer.setClearColor(color || 0xffffff)

    if (type === 'linear') return new THREE.Fog(color || 0xffffff, 10, 800)

    else return new THREE.FogExp2(color || 0xffffff, 0.005)

}

const folder = new GUI()

let fogFolder = null

const fogOption = { type: scene.fog instanceof THREE.FogExp2 ? 'exp2' : 'linear', enable: !!scene.fog }

folder.add(fogOption, 'type', ['linear', 'exp2']).name('雾类型').onChange((v) => {

    scene.fog = getFog(v, scene.fog?.color)

    setFogFolder(v)

})

folder.add(fogOption, 'enable').name('启用雾').onChange((v) => {

    if (v) scene.fog = getFog(fogOption.type)

    else scene.fog = null

    setFogFolder(fogOption.type)

})

fogOption.enable && setFogFolder(fogOption.type)

function setFogFolder(type) {

    if (fogFolder) {

        fogFolder.destroy?.()

        fogFolder = null

    }

    if (!scene.fog) return

    fogFolder = folder.addFolder(type + '雾')

    fogFolder.addColor(scene.fog, 'color').name('颜色').onChange((v) => renderer.setClearColor(v))

    if (type === 'linear') {

        fogFolder.add(scene.fog, 'near').name('近点')

        fogFolder.add(scene.fog, 'far').name('远点')

    }

    else fogFolder.add(scene.fog, 'density').name('密度').min(0).max(0.1).step(0.00001)

}