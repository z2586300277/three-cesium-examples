import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'dat.gui'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 2000)

camera.position.set(10, 10, 10)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

scene.add(new THREE.GridHelper(10, 10))

// uniforms
const uniforms = {
    points: {
        value: [
            new THREE.Vector3(-30, 2.0, 0),
            new THREE.Vector3(0, 5.0, 0),
            new THREE.Vector3(30, 10.0, 0)
        ]
    },
    // 目标点（用于插值过渡）
    targetPoints: {
        value: [
            new THREE.Vector3(-30, 2.0, 0),
            new THREE.Vector3(0, 5.0, 0),
            new THREE.Vector3(30, 10.0, 0)
        ]
    },
    baseInfluenceRadius: { value: 5.0 },
    heightToRadiusRatio: { value: 2.0 },
    falloffPower: { value: 2.0 },
    baseHeight: { value: 0.0 },
    maxHeight: { value: 10.0 },
    color1: { value: new THREE.Color(0x0066ff) },
    color2: { value: new THREE.Color(0xff3300) },
}

// 顶点着色器
const vertexShader = `
uniform vec3 points[3];
uniform float baseInfluenceRadius;
uniform float heightToRadiusRatio;
uniform float falloffPower;
uniform float baseHeight;
uniform float maxHeight;

varying float vHeightRatio;

float calculateInfluence(vec3 point, vec3 vertex) {
    float distance2D = length(point.xz - vertex.xz);
    float dynamicRadius = baseInfluenceRadius + point.y * heightToRadiusRatio;
    dynamicRadius = max(dynamicRadius, baseInfluenceRadius);
    if (distance2D > dynamicRadius) return 0.0;
    float normalizedDistance = distance2D / dynamicRadius;
    float attenuation = pow(1.0 - normalizedDistance, falloffPower);
    return attenuation * point.y;
}

void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    float heightOffset = 0.0;
    heightOffset += calculateInfluence(points[0], worldPosition.xyz);
    heightOffset += calculateInfluence(points[1], worldPosition.xyz);
    heightOffset += calculateInfluence(points[2], worldPosition.xyz);
    vHeightRatio = clamp(heightOffset / maxHeight, 0.0, 1.0);
    vec3 newPosition = position;
    newPosition.y += heightOffset + baseHeight;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
`

// 片段着色器
const fragmentShader = `
uniform vec3 color1;
uniform vec3 color2;
varying float vHeightRatio;

void main() {
    vec3 color = mix(color1, color2, vHeightRatio);
    gl_FragColor = vec4(color, 1.0);
}
`

// 创建网格
const geometry = new THREE.BoxGeometry(200, 10, 1, 200, 1, 1).rotateX(-Math.PI / 2)
const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
    side: THREE.DoubleSide,
    wireframe: true
})
scene.add(new THREE.Mesh(geometry, material))

// GUI 参数
const params = {
    baseInfluenceRadius: 5.0,
    heightToRadiusRatio: 2.0,
    falloffPower: 2.0,
    baseHeight: 0.0,
    maxHeight: 10.0,
    autoUpdate: true,
    interval: 1.0,
    wireframe: true,
    color1: '#0066ff',
    color2: '#ff3300',
}

// GUI 控制
const gui = new GUI()
gui.add(params, 'baseInfluenceRadius', 1, 50).name('影响半径').onChange(v => uniforms.baseInfluenceRadius.value = v)
gui.add(params, 'heightToRadiusRatio', 0, 10).name('高度放大系数').onChange(v => uniforms.heightToRadiusRatio.value = v)
gui.add(params, 'falloffPower', 0.1, 10).name('衰减指数').onChange(v => uniforms.falloffPower.value = v)
gui.add(params, 'baseHeight', -5, 5).name('基础高度').onChange(v => uniforms.baseHeight.value = v)
gui.add(params, 'maxHeight', 1, 30).name('最大高度').onChange(v => uniforms.maxHeight.value = v)
gui.add(params, 'autoUpdate').name('自动更新')
gui.add(params, 'interval', 0.3, 5).name('更新间隔(秒)')
gui.add(params, 'wireframe').name('线框模式').onChange(v => material.wireframe = v)
gui.addColor(params, 'color1').name('低点颜色').onChange(v => uniforms.color1.value.set(v))
gui.addColor(params, 'color2').name('高点颜色').onChange(v => uniforms.color2.value.set(v))

// 随机生成目标点
function randomizeTargets() {
    for (let i = 0; i < 3; i++) {
        uniforms.targetPoints.value[i].set(
            Math.random() * 200 - 100,
            Math.random() * params.maxHeight,
            0
        )
    }
}

// 定时更新目标
let timer = 0
const clock = new THREE.Clock()

function animate() {
    requestAnimationFrame(animate)
    const delta = clock.getDelta()

    // 定时更新目标点
    if (params.autoUpdate) {
        timer += delta
        if (timer >= params.interval) {
            timer = 0
            randomizeTargets()
        }
    }

    // 平滑插值到目标点
    for (let i = 0; i < 3; i++) {
        uniforms.points.value[i].lerp(uniforms.targetPoints.value[i], delta * 3)
    }

    renderer.render(scene, camera)
}
animate()

window.onresize = () => {
    renderer.setSize(box.clientWidth, box.clientHeight)
    camera.aspect = box.clientWidth / box.clientHeight
    camera.updateProjectionMatrix()
}

