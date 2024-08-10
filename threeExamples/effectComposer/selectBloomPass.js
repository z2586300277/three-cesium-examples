import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { BlendFunction, SelectiveBloomEffect, EffectComposer, EffectPass, RenderPass } from "postprocessing";

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(0, 5, 5)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)

    camera.aspect = box.clientWidth / box.clientHeight

    camera.updateProjectionMatrix()

}

// 附加后处理库
const composer = new EffectComposer(renderer);

const bloomEffect = new SelectiveBloomEffect(scene, camera, {

    blendFunction: BlendFunction.ADD,

    mipmapBlur: true,

    luminanceThreshold: 0.4,

    luminanceSmoothing: 0.2,

    intensity: 3.0

})

composer.addPass(new RenderPass(scene, camera))

composer.addPass(new EffectPass(camera, bloomEffect))

// 添加10个立方体
const boxGeometry = new THREE.BoxGeometry(1, 1, 1)

const boxMaterial = new THREE.MeshBasicMaterial({ color: 0xa0dee2 })

const boxMaterial2 = new THREE.MeshBasicMaterial({ color: 'yellow' })

const box1 = new THREE.Mesh(boxGeometry, boxMaterial)

const box2 = new THREE.Mesh(boxGeometry, boxMaterial2)

box1.position.set(-1.5, 0, 0)

scene.add(box1, box2)

bloomEffect.selection.set([box1], true)

// 点击立方体时，高亮立方体
box.addEventListener('click', e => {

    const raycaster = new THREE.Raycaster()

    const mouse = new THREE.Vector2(

        (e.offsetX / e.target.clientWidth) * 2 - 1,

        -(e.offsetY / e.target.clientHeight) * 2 + 1

    )

    raycaster.setFromCamera(mouse, camera)

    const intersects = raycaster.intersectObjects(scene.children)

    if (intersects.length > 0) {

        const object = intersects[0].object

        bloomEffect.selection.toggle(object);

    }

})

// 渲染
function animate() {

    requestAnimationFrame(animate)

    composer.render()

}

animate()

