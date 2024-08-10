import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js'
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js'

const DOM = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, DOM.clientWidth / DOM.clientHeight, 0.1, 1000)

camera.position.set(10, 10, 10)

const renderer = new THREE.WebGLRenderer()

renderer.setSize(DOM.clientWidth, DOM.clientHeight)

DOM.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

scene.add(new THREE.AxesHelper(500))

// Css3DOM
const css3DRender = setCss3DRenderer(DOM)

// Css2DOM
const css2DRender = setCss2DRenderer(DOM)

const setCss2dDOM = (DOM, position) => {

    DOM.style.pointerEvents = 'auto'

    const mesh = new CSS2DObject(DOM)

    mesh.position.copy(position)

    scene.add(mesh)

    return mesh

}


const setCss3dDOM = (DOM, position) => {

    const mesh = new CSS3DObject(DOM)

    mesh.position.copy(position)

    scene.add(mesh)

    return mesh

}

for (let i = 0; i < 5; i++) {

    setCss2dDOM(createDom('2D' + i), { x: 0, y: 0, z: i * 2 }) // 2d dom

    setCss3dDOM(createDom('3D' + i), { x: 0, y: i * 2, z: 0 }).scale.multiplyScalar(0.02) // 3d dom

}

animate()

function animate() {

    requestAnimationFrame(animate)

    renderer.render(scene, camera)

    css3DRender.render(scene, camera) // Css3D渲染

    css2DRender.render(scene, camera) // Css2D渲染

}

window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)

    camera.aspect = box.clientWidth / box.clientHeight

    camera.updateProjectionMatrix()

    css3DRender.resize()

    css2DRender.resize()

}



// 创建dom
function createDom(text) {

    const div = document.createElement('div')

    const img = document.createElement('img')

    img.src = '/three-cesium-examples/public/files/author/z2586300277.png'

    img.style.width = '50px'

    img.style.height = '50px'

    div.appendChild(img)

    div.innerHTML += text

    div.style.color = 'white'

    return div

}

/* css2d渲染 */
function setCss2DRenderer(DOM) {

    const css2DRender = new CSS2DRenderer()

    css2DRender.resize = () => {

        css2DRender.setSize(DOM.clientWidth, DOM.clientHeight)

        css2DRender.domElement.style.zIndex = 0

        css2DRender.domElement.style.position = 'relative'

        css2DRender.domElement.style.top = -DOM.clientHeight * 2 + 'px'

        css2DRender.domElement.style.height = DOM.clientHeight + 'px'

        css2DRender.domElement.style.width = DOM.clientWidth + 'px'

        css2DRender.domElement.style.pointerEvents = 'none'

    }

    css2DRender.resize()

    DOM.appendChild(css2DRender.domElement)

    return css2DRender

}

/* css3d 渲染 */
function setCss3DRenderer(DOM) {

    const css3DRender = new CSS3DRenderer()

    css3DRender.resize = () => {

        css3DRender.setSize(DOM.clientWidth, DOM.clientHeight)

        css3DRender.domElement.style.zIndex = 0

        css3DRender.domElement.style.position = 'relative'

        css3DRender.domElement.style.top = -DOM.clientHeight + 'px'

        css3DRender.domElement.style.height = DOM.clientHeight + 'px'

        css3DRender.domElement.style.width = DOM.clientWidth + 'px'

        css3DRender.domElement.style.pointerEvents = 'none'

    }

    css3DRender.resize()

    DOM.appendChild(css3DRender.domElement)

    return css3DRender

}