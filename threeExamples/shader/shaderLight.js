import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

let scene, camera, renderer, controls
let fakeLights = []
const clock = new THREE.Clock()

init()
animate()

function init() {
    scene = new THREE.Scene()
    scene.background = new THREE.Color('#0a0a1a')

    camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    )
    camera.position.set(0, 15, 30)

    renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    document.body.appendChild(renderer.domElement)

    controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    createFakeLights()
}

function createGlowTexture(color) {
    const canvas = document.createElement('canvas')
    canvas.width = 256
    canvas.height = 256
    const ctx = canvas.getContext('2d')

    const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128)
    gradient.addColorStop(0, color)
    gradient.addColorStop(0.3, color.replace('1)', '0.6)'))
    gradient.addColorStop(0.6, color.replace('1)', '0.2)'))
    gradient.addColorStop(1, color.replace('1)', '0)'))

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 256, 256)

    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true
    return texture
}

function createFakeLight(position, color, size) {
    const group = new THREE.Group()

    const glowTexture = createGlowTexture(color)

    const coreMaterial = new THREE.ShaderMaterial({
        uniforms: {
            uTexture: { value: glowTexture },
            uOpacity: { value: 1.0 },
            uTime: { value: 0 }
        },
        vertexShader: `
                    varying vec2 vUv;
                    void main() {
                        vUv = uv;
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `,
        fragmentShader: `
                    uniform sampler2D uTexture;
                    uniform float uOpacity;
                    uniform float uTime;
                    varying vec2 vUv;

                    void main() {
                        vec4 texColor = texture2D(uTexture, vUv);
                        float pulse = 0.8 + 0.2 * sin(uTime * 2.0);
                        gl_FragColor = vec4(texColor.rgb, texColor.a * uOpacity * pulse);
                    }
                `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide
    })

    const coreGeometry = new THREE.PlaneGeometry(size, size)
    const core = new THREE.Mesh(coreGeometry, coreMaterial)
    core.position.copy(position)
    core.lookAt(camera.position)
    group.add(core)

    for (let i = 1; i <= 3; i++) {
        const layerMaterial = coreMaterial.clone()
        layerMaterial.uniforms.uOpacity.value = 0.3 / i
        const layerGeometry = new THREE.PlaneGeometry(size * (1 + i * 0.5), size * (1 + i * 0.5))
        const layer = new THREE.Mesh(layerGeometry, layerMaterial)
        layer.position.copy(position)
        layer.position.y -= i * 0.1
        layer.lookAt(camera.position)
        group.add(layer)
    }

    return { group, core, material: coreMaterial }
}

function createFakeLights() {
    const lightConfigs = [
        { pos: new THREE.Vector3(-10, 5, -10), color: 'rgba(255, 100, 100, 1)', size: 8 },
        { pos: new THREE.Vector3(10, 5, -10), color: 'rgba(100, 255, 100, 1)', size: 8 },
        { pos: new THREE.Vector3(0, 8, 10), color: 'rgba(100, 100, 255, 1)', size: 10 },
        { pos: new THREE.Vector3(-15, 3, 5), color: 'rgba(255, 200, 100, 1)', size: 6 },
        { pos: new THREE.Vector3(15, 3, 5), color: 'rgba(255, 100, 200, 1)', size: 6 }
    ]

    lightConfigs.forEach(config => {
        const fakeLight = createFakeLight(config.pos, config.color, config.size)
        scene.add(fakeLight.group)
        fakeLights.push(fakeLight)
    })
}

function animate() {
    requestAnimationFrame(animate)

    const elapsed = clock.getElapsedTime()

    fakeLights.forEach(fakeLight => {
        fakeLight.material.uniforms.uTime.value = elapsed
        fakeLight.core.lookAt(camera.position)
    })

    controls.update()
    renderer.render(scene, camera)
}
