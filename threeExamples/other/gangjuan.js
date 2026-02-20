import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'dat.gui'

const box = document.getElementById('box')
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x1a1a2e)

const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 1000)
camera.position.set(0, 12, 20)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

scene.add(new THREE.AmbientLight(0xffffff, 0.8))
const dirLight = new THREE.DirectionalLight(0xffffff, 1.5)
dirLight.position.set(5, 10, 5)
dirLight.castShadow = true
scene.add(dirLight)
scene.add(new THREE.DirectionalLight(0x4488ff, 0.5).position.set(-5, 5, -5))

// 钢带材质
const stripMat = new THREE.MeshStandardMaterial({
    color: 'white',
    metalness: 0.7,
    roughness: 0.15,
    side: THREE.DoubleSide,
    // envMapIntensity: 1.0
})

// 参数
const params = {
    speed: 1.0,
    stripWidth: 4,
    thickness: 0.15,
    coreRadius: 1.5,
    maxTurns: 8,
    feedLength: 12,
    playing: true,
    reset() { totalAngle = 0 }
}

let totalAngle = 0 // 已卷绕的总角度(弧度)
let stripMesh = null

// 构建钢带几何体：直线进料段 + 螺旋卷绕段（长方体截面）
function buildStripGeometry(angle, coreRadius, stripThickness, width, feedLen) {
    const segsPerRad = 10
    const coilSegs = Math.max(Math.floor(angle * segsPerRad), 1)
    const feedSegs = 20
    const totalSegs = feedSegs + coilSegs
    const halfW = width / 2
    const halfT = stripThickness / 2

    const positions = []
    const indices = []

    // 每圈半径增加一个钢带厚度
    const radiusAt = (a) => coreRadius + (a / (Math.PI * 2)) * stripThickness

    for (let i = 0; i <= totalSegs; i++) {
        let cx, cy, nx, ny

        if (i <= coilSegs) {
            const a = angle * (1 - i / coilSegs)
            const r = radiusAt(a)
            cx = Math.cos(a) * r
            cy = Math.sin(a) * r
            // 法线方向（径向）
            nx = Math.cos(a)
            ny = Math.sin(a)
        } else {
            const feedT = (i - coilSegs) / feedSegs
            const startR = radiusAt(0)
            cx = startR + feedT * feedLen
            cy = 0
            // 直线段法线朝上
            nx = 0
            ny = 1
        }

        // 4个顶点：沿法线方向偏移 ±halfT，沿Z方向偏移 ±halfW
        // 0: 外上(+z), 1: 外下(-z), 2: 内上(+z), 3: 内下(-z)
        positions.push(cx + nx * halfT, cy + ny * halfT, halfW)   // 0 外+z
        positions.push(cx + nx * halfT, cy + ny * halfT, -halfW)  // 1 外-z
        positions.push(cx - nx * halfT, cy - ny * halfT, halfW)   // 2 内+z
        positions.push(cx - nx * halfT, cy - ny * halfT, -halfW)  // 3 内-z
    }

    for (let i = 0; i < totalSegs; i++) {
        const base = i * 4
        const next = base + 4
        // 外表面 (0,1)
        indices.push(base, next, base + 1, base + 1, next, next + 1)
        // 内表面 (2,3)
        indices.push(base + 2, base + 3, next + 2, base + 3, next + 3, next + 2)
        // 上面(+z) (0,2)
        indices.push(base, base + 2, next, next, base + 2, next + 2)
        // 下面(-z) (1,3)
        indices.push(base + 1, next + 1, base + 3, base + 3, next + 1, next + 3)
    }

    // 起始端面
    indices.push(0, 1, 2, 1, 3, 2)
    // 末端端面
    const last = totalSegs * 4
    indices.push(last, last + 2, last + 1, last + 1, last + 2, last + 3)

    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geo.setIndex(indices)
    geo.computeVertexNormals()
    return geo
}

// 卷芯
const coreMat = new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 0.9, roughness: 0.2 })
const core = new THREE.Mesh(new THREE.CylinderGeometry(params.coreRadius, params.coreRadius, params.stripWidth + 0.2, 32), coreMat)
core.rotation.x = Math.PI / 2
scene.add(core)

// 支撑辊
const rollerMat = new THREE.MeshStandardMaterial({ color: 0x666666, metalness: 0.7, roughness: 0.4 })
const roller = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, params.stripWidth + 1, 16), rollerMat)
roller.rotation.x = Math.PI / 2
roller.position.set(params.coreRadius + params.feedLength * 0.5, -0.5, 0)
scene.add(roller)

function updateStrip() {
    if (stripMesh) {
        scene.remove(stripMesh)
        stripMesh.geometry.dispose()
    }

    const remainFeed = params.feedLength * Math.max(1 - totalAngle / (params.maxTurns * Math.PI * 2), 0)

    const geo = buildStripGeometry(
        totalAngle,
        params.coreRadius,
        params.thickness,
        params.stripWidth,
        remainFeed
    )

    stripMesh = new THREE.Mesh(geo, stripMat)
    stripMesh.castShadow = true
    stripMesh.receiveShadow = true
    scene.add(stripMesh)

    // 更新卷芯大小
    const outerR = params.coreRadius + (totalAngle / (Math.PI * 2)) * params.thickness
    core.scale.set(1, 1, 1)
}

// GUI
const gui = new GUI()
gui.add(params, 'speed', 0.1, 5).name('速度')
gui.add(params, 'coreRadius', 0.5, 4).name('卷芯半径').onChange(v => {
    core.geometry.dispose()
    core.geometry = new THREE.CylinderGeometry(v, v, params.stripWidth + 0.2, 32)
})
gui.add(params, 'thickness', 0.05, 0.5).name('钢带厚度')
gui.add(params, 'maxTurns', 2, 20, 1).name('最大圈数')
gui.add(params, 'stripWidth', 1, 8).name('钢带宽度').onChange(v => {
    core.geometry.dispose()
    core.geometry = new THREE.CylinderGeometry(params.coreRadius, params.coreRadius, v + 0.2, 32)
})
gui.add(params, 'playing').name('播放')
gui.add(params, 'reset').name('重置')

const clock = new THREE.Clock()

function animate() {
    requestAnimationFrame(animate)
    const delta = clock.getDelta()

    const maxAngle = params.maxTurns * Math.PI * 2
    if (params.playing && totalAngle < maxAngle) {
        totalAngle += delta * params.speed * 2
        totalAngle = Math.min(totalAngle, maxAngle)
        updateStrip()
    }

    renderer.render(scene, camera)
}
animate()

window.onresize = () => {
    renderer.setSize(box.clientWidth, box.clientHeight)
    camera.aspect = box.clientWidth / box.clientHeight
    camera.updateProjectionMatrix()
}

