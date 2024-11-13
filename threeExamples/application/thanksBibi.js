import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';
import { CSS3DRenderer, CSS3DObject } from 'three/examples/jsm/renderers/CSS3DRenderer.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';

const DOM = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, DOM.clientWidth / DOM.clientHeight, 0.1, 10000)

camera.position.set(0, 0, 1200)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true , logarithmicDepthBuffer: true})

renderer.setSize(DOM.clientWidth, DOM.clientHeight)

renderer.setPixelRatio( window.devicePixelRatio * 2)

DOM.appendChild(renderer.domElement)

scene.add(new THREE.AmbientLight(0xffffff, 2))

const controls = new OrbitControls(camera, renderer.domElement)

controls.enableDamping = true

const renderPass = new RenderPass(scene, camera);

const bloomPass = new UnrealBloomPass(new THREE.Vector2(DOM.clientWidth, DOM.clientHeight), 1.5, 0.4, 0.1);

const composer = new EffectComposer(renderer);

composer.addPass(renderPass);

composer.addPass(bloomPass);

// Css3DOM
const css3DRender = setCss3DRenderer(DOM)

// 添加内嵌 iframe
const iframeDOM = document.createElement('iframe')

iframeDOM.src = '//player.bilibili.com/player.html?isOutside=true&aid=113457500327757&bvid=BV1HumBYMEa1&cid=26696878993&p=1'

iframeDOM.style.width = '100%'

iframeDOM.style.height = '80%'

iframeDOM.style.border = 'none'

const mesh = new CSS3DObject(iframeDOM)

mesh.scale.multiplyScalar(1.2)

mesh.position.y -= 120

scene.add(mesh)

// 添加文字
const loader = new FontLoader()

loader.load(`https://z2586300277.github.io/3d-file-server/` + 'files/json/font.json', font => createText(font))

animate()

function animate() {

    requestAnimationFrame(animate)

    controls.update()

    renderer.render(scene, camera)

    composer.render()

    css3DRender.render(scene, camera) // Css3D渲染

}

window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)

    camera.aspect = box.clientWidth / box.clientHeight

    camera.updateProjectionMatrix()

    css3DRender.resize()

}

function createText(font) {

    const text =

    `            Three-Cesium-Examples 

                 Thanks Form BiBi







    Stars Collect Forward Comment

`

    const geometry = new TextGeometry(text, {

        font: font,

        size: 80,

        depth: 5,

        curveSegments: 12,

        bevelEnabled: true,

        bevelThickness: 8,

        bevelSize: 3,

        bevelOffset: 0,

        bevelSegments: 5

    })

    geometry.center()

    const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({color:'pink'}))

    scene.add(mesh)

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
