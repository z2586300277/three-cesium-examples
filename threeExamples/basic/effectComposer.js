import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'
import { GUI } from 'dat.gui'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(40, box.clientWidth / box.clientHeight, 0.1, 100000)
camera.position.set(5, 2, 8);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })
renderer.setSize(box.clientWidth, box.clientHeight)
renderer.setClearColor(0xbfe3dd, 1)
box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

scene.environment = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(), 0.04).texture;

const composer = new EffectComposer(renderer);

const renderPass = new RenderPass(scene, camera)
composer.addPass(renderPass);

const outputPass = new OutputPass()
composer.addPass(outputPass)

const data = { renderType: 'effect' }

const ToneMappingList = {
    No: THREE.NoToneMapping,
    Linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    ACESFilmic: THREE.ACESFilmicToneMapping,
    AgX: THREE.AgXToneMapping,
    Neutral: THREE.NeutralToneMapping,
    Custom: THREE.CustomToneMapping
}

const gui = new GUI()
gui.add(renderer, 'outputColorSpace', [THREE.SRGBColorSpace, THREE.LinearSRGBColorSpace])
gui.add(renderer, 'toneMapping', Object.keys(ToneMappingList)).onChange(value => renderer.toneMapping = ToneMappingList[value])
gui.add(renderer, 'toneMappingExposure', 0, 10)
gui.add(data, 'renderType', ['effect', 'normal', 'both'])
gui.add(outputPass, 'enabled').name('OutputPass_enabled')

animate()

function animate() {

    controls.update()
    if (data.renderType === 'effect') composer.render()
    else if (data.renderType === 'normal') renderer.render(scene, camera)
    else {
        renderer.render(scene, camera)
        composer.render()
    }
    requestAnimationFrame(animate)

}

const loader = new GLTFLoader()
loader.setDRACOLoader(new DRACOLoader().setDecoderPath(FILE_HOST + 'js/three/draco/'))
loader.load(
    FILE_HOST + '/files/model/LittlestTokyo.glb',
    gltf => {
        gltf.scene.position.set(1, 1, 0);
        gltf.scene.scale.set(0.01, 0.01, 0.01);
        scene.add(gltf.scene)
    }
)