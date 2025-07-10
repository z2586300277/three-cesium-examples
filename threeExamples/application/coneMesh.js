import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 100000)

camera.position.set(0, 0, 20)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

const effectComposer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
effectComposer.addPass(renderPass);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(box.clientWidth, box.clientHeight), 0.8, 0.4, 0.0);
effectComposer.addPass(bloomPass);

const geometry = new THREE.ConeGeometry(3.5, 5.5, 4);
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("https://g2657.github.io/examples-server/smartCity/demo/image/gradual_change_y_02.png");
const material = new THREE.MeshBasicMaterial({
    map: texture
})

const cone = new THREE.Mesh(geometry, material);
cone.rotation.x = -Math.PI;
scene.add(cone);

let d = 0.03
animate()

function animate() {

    if (cone.position.y > 3 || cone.position.y < 0) d = -d
    cone.position.y += d;
    cone.rotation.y += Math.PI / 100;

    requestAnimationFrame(animate)
    effectComposer.render()

}

window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)

    camera.aspect = box.clientWidth / box.clientHeight

    camera.updateProjectionMatrix()

}
