import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(0, 0, 5)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

controls.enableDamping = true

// 后期处理
const composer = new EffectComposer(renderer);

const renderPass = new RenderPass(scene, camera);

composer.addPass(renderPass);

// 轮廓
const outlinePass = new OutlinePass(new THREE.Vector2(box.clientWidth, box.clientHeight), scene, camera);

outlinePass.visibleEdgeColor.set('red'); // 设置可见边缘颜色

composer.addPass(outlinePass);

const outputPass2 = new OutlinePass(new THREE.Vector2(box.clientWidth, box.clientHeight), scene, camera);

composer.addPass(outputPass2);

const outlinePass3 = new OutlinePass(new THREE.Vector2(box.clientWidth, box.clientHeight), scene, camera);

outlinePass3.visibleEdgeColor.set('blue');

composer.addPass(outlinePass3);

// 色彩校正
const outputPass = new OutputPass();

composer.addPass(outputPass);

const cone = new THREE.Mesh(new THREE.ConeGeometry(1, 2, 32), new THREE.MeshBasicMaterial())

cone.position.set(2, 0, 0)

scene.add(cone);

outlinePass.selectedObjects = [cone]

const cube = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ color: 0x00ff00 }))

scene.add(cube);

outputPass2.selectedObjects = [cube];

const sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), new THREE.MeshBasicMaterial({ color: 'yellow' }))

sphere.position.set(-2, 0, 0)

scene.add(sphere);

outlinePass3.selectedObjects = [sphere];

// 渲染
animate()

function animate() {

    requestAnimationFrame(animate)

    controls.update()

    composer.render()

}

// 适配
window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)

    camera.aspect = box.clientWidth / box.clientHeight

    camera.updateProjectionMatrix()

}
