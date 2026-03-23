import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

const box = document.getElementById('box')
const scene = new THREE.Scene()

const renderer = new THREE.WebGLRenderer()
renderer.setSize(box.clientWidth, box.clientHeight)
box.appendChild(renderer.domElement)

// 视口尺寸计算（主视口占 65%，下方三个子视口各占 35%/3）
const layout = () => {
    const W = box.clientWidth, H = box.clientHeight
    const subH = Math.floor(H * 0.35)
    return { W, H, subH, mainH: H - subH, subW: Math.floor(W / 3) }
}

// composer 工厂
const makeComposer = (cam, w, h) => {
    const c = new EffectComposer(renderer)
    c.addPass(new RenderPass(scene, cam))
    c.addPass(new UnrealBloomPass(new THREE.Vector2(w, h), 0.8, 0, 0))
    c.setSize(w, h)
    return c
}

// 主相机（透视）
const { W: W0, mainH: mainH0, subH: subH0, subW: subW0 } = layout()
const camera = new THREE.PerspectiveCamera(75, W0 / mainH0, 0.1, 1000)
camera.position.set(400, 400, 400)
const mainComposer = makeComposer(camera, W0, mainH0)

// 正交相机工厂（前视图 / 左视图 / 俯视图）
const ORTHO = 500
const makeOrtho = (pos, up) => {
    const aspect = subW0 / subH0
    const cam = new THREE.OrthographicCamera(-ORTHO * aspect, ORTHO * aspect, ORTHO, -ORTHO, 0.1, 5000)
    cam.position.copy(pos); cam.up.copy(up); cam.lookAt(0, 0, 0)
    return cam
}
const subCams = [
    makeOrtho(new THREE.Vector3(0, 0, 2000), new THREE.Vector3(0, 1, 0)),   // 前视图
    makeOrtho(new THREE.Vector3(2000, 0, 0), new THREE.Vector3(0, 1, 0)),   // 左视图
    makeOrtho(new THREE.Vector3(0, 2000, 0), new THREE.Vector3(0, 0, -1)),  // 俯视图
]
const subComposers = subCams.map(cam => makeComposer(cam, subW0, subH0))

// 控制器：点击哪个视口就激活哪个
const mainControls = new OrbitControls(camera, renderer.domElement)
const subControls = subCams.map(cam => {
    const ctrl = new OrbitControls(cam, renderer.domElement)
    ctrl.enabled = false
    return ctrl
})
renderer.domElement.addEventListener('pointerdown', e => {
    const rect = renderer.domElement.getBoundingClientRect()
    const { mainH, subW } = layout()
    const py = e.clientY - rect.top
    const px = e.clientX - rect.left
    mainControls.enabled = false
    subControls.forEach(c => c.enabled = false)
    if (py < mainH) mainControls.enabled = true
    else subControls[Math.min(Math.floor(px / subW), 2)].enabled = true
}, { capture: true })

// 动画循环
const clock = new THREE.Clock()
let mixer = null

function animate() {
    requestAnimationFrame(animate)
    const { W, subH, mainH, subW } = layout()

    renderer.setScissorTest(true)

    renderer.setViewport(0, subH, W, mainH)
    renderer.setScissor(0, subH, W, mainH)
    mainComposer.render()

    subComposers.forEach((c, i) => {
        renderer.setViewport(i * subW, 0, subW, subH)
        renderer.setScissor(i * subW, 0, subW, subH)
        c.render()
    })

    mainControls.update()
    subControls.forEach(c => c.update())
    if (mixer) mixer.update(clock.getDelta())
}
animate()

window.onresize = () => {
    const { W, H, subH, mainH, subW } = layout()
    renderer.setSize(W, H)
    camera.aspect = W / mainH
    camera.updateProjectionMatrix()
    mainComposer.setSize(W, mainH)
    subCams.forEach(cam => {
        cam.left = -ORTHO * subW / subH; cam.right = ORTHO * subW / subH
        cam.updateProjectionMatrix()
    })
    subComposers.forEach(c => c.setSize(subW, subH))
}

// 加载模型
const loader = new GLTFLoader()
loader.setDRACOLoader(new DRACOLoader().setDecoderPath(FILE_HOST + 'js/three/draco/'))

const textureCube = new THREE.CubeTextureLoader().load(
    [1, 2, 3, 4, 5, 6].map(k => FILE_HOST + 'files/sky/skyBox0/' + k + '.png')
)

loader.load(FILE_HOST + '/files/model/LittlestTokyo.glb', gltf => {
    gltf.scene.traverse(child => {
        if (child.isMesh) child.material.envMap = textureCube
    })
    scene.add(gltf.scene)
    mixer = new THREE.AnimationMixer(gltf.scene)
    gltf.animations.forEach(clip => mixer.clipAction(clip).play())
})

