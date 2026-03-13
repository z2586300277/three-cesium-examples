import * as THREE from 'three'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import Stats from 'three/addons/libs/stats.module.js'
import { Water } from 'three/addons/objects/Water.js'

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x0a1020)
scene.fog = new THREE.Fog(0x0a1020, 80, 1000)

const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1600)
camera.position.set(48, 125, 210)
camera.lookAt(0, 100, 0)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
document.body.appendChild(renderer.domElement)

const stats = new Stats()
stats.showPanel(0)
stats.dom.style.position = 'absolute'
stats.dom.style.top = '20px'
stats.dom.style.right = '20px'
stats.dom.style.left = 'auto'
stats.dom.style.zIndex = '30'
document.body.appendChild(stats.dom)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.05
controls.target.set(0, 100, 0)
controls.maxPolarAngle = Math.PI / 2.2
controls.enableZoom = true
controls.maxDistance = 900

scene.add(new THREE.AmbientLight(0x40406b))

const dirLight = new THREE.DirectionalLight(0xcceeff, 1.2)
dirLight.position.set(20, 40, 30)
dirLight.castShadow = true
const d = 50
dirLight.shadow.mapSize.width = 1024
dirLight.shadow.mapSize.height = 1024
dirLight.shadow.camera.left = -d
dirLight.shadow.camera.right = d
dirLight.shadow.camera.top = d
dirLight.shadow.camera.bottom = -d
dirLight.shadow.camera.near = 1
dirLight.shadow.camera.far = 80
scene.add(dirLight)

const backLight = new THREE.PointLight(0x446688, 1)
backLight.position.set(-15, 20, -20)
scene.add(backLight)

const nacelleLight = new THREE.PointLight(0x88aadd, 1.0, 400)
nacelleLight.position.set(0, 22, 10)
scene.add(nacelleLight)

const sunDirection = new THREE.Vector3(0.4, 1.0, 0.2).normalize()
const waterNormals = new THREE.TextureLoader().load(
    'https://threejs.org/examples/textures/waternormals.jpg',
    texture => {
        texture.wrapS = THREE.RepeatWrapping
        texture.wrapT = THREE.RepeatWrapping
    }
)
const waterGeometry = new THREE.PlaneGeometry(1400, 1400)
const water = new Water(waterGeometry, {
    textureWidth: 512,
    textureHeight: 512,
    waterNormals,
    sunDirection,
    sunColor: 0xffffff,
    waterColor: 0x0a3b5f,
    distortionScale: 3.2,
    fog: scene.fog !== undefined
})
water.rotation.x = -Math.PI / 2
water.position.y = -1.2
scene.add(water)

const windTurbine = new THREE.Group()
windTurbine.rotation.y = Math.PI
scene.add(windTurbine)

let rotorGroup = null
let rotorPivot = null
let nacelleModel = null
let rotorPivotYOffset = 0
let rotorWakeScale = 1.0

const rotorSweepReference = 30
const towerHeight = 120
const towerBaseRadius = 5.5
const towerTopRadius = 3.2
const nacelleLength = 22
const nacelleHeight = 7
const nacelleWidth = 8
const hubRadius = 2.2
const hubLength = 4
const bladeLength = 26
const bladeWidth = 3.2
const bladeThickness = 0.7
const bladeCount = 3
const nacelleCenterY = towerHeight + nacelleHeight * 0.5 - 1
const hubCenterY = nacelleCenterY
const baseRotorPivotPosition = new THREE.Vector3(0, hubCenterY, nacelleLength * 0.55 + hubRadius * 0.6)

const updateRotorPivotFromNacelle = () => {
    if (!rotorPivot) return
    rotorPivot.position.set(
        baseRotorPivotPosition.x,
        baseRotorPivotPosition.y + rotorPivotYOffset,
        baseRotorPivotPosition.z
    )
}

const updateWakeScaleFromRotor = () => {
    if (!rotorGroup) return
    windTurbine.updateMatrixWorld(true)
    const rotorBox = new THREE.Box3().setFromObject(rotorGroup)
    const rotorSize = new THREE.Vector3()
    rotorBox.getSize(rotorSize)
    const sweepWidth = Math.max(rotorSize.x, rotorSize.y)
    if (sweepWidth > 0.001) {
        rotorWakeScale = THREE.MathUtils.clamp(sweepWidth / rotorSweepReference, 0.8, 2.6)
    }
}

const buildTurbineGeometry = () => {
    const towerMaterial = new THREE.MeshStandardMaterial({ color: 0xd9d9e6, metalness: 0.2, roughness: 0.45 })
    const nacelleMaterial = new THREE.MeshStandardMaterial({ color: 0xf0f2f6, metalness: 0.25, roughness: 0.4 })
    const bladeMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 0.12, roughness: 0.35 })
    const hubMaterial = new THREE.MeshStandardMaterial({ color: 0xcfd7e6, metalness: 0.3, roughness: 0.35 })

    const towerGeometry = new THREE.CylinderGeometry(towerTopRadius, towerBaseRadius, towerHeight, 32, 1)
    const towerMesh = new THREE.Mesh(towerGeometry, towerMaterial)
    towerMesh.position.y = towerHeight * 0.5
    towerMesh.castShadow = true
    towerMesh.receiveShadow = true
    windTurbine.add(towerMesh)

    const baseGeometry = new THREE.CylinderGeometry(towerBaseRadius + 1.2, towerBaseRadius + 1.2, 2, 32)
    const baseMesh = new THREE.Mesh(baseGeometry, towerMaterial)
    baseMesh.position.y = 1
    baseMesh.castShadow = true
    baseMesh.receiveShadow = true
    windTurbine.add(baseMesh)

    const nacelleGroup = new THREE.Group()
    const nacelleBody = new THREE.Mesh(
        new THREE.BoxGeometry(nacelleLength, nacelleHeight, nacelleWidth),
        nacelleMaterial
    )
    nacelleBody.castShadow = true
    nacelleBody.receiveShadow = true
    nacelleGroup.add(nacelleBody)

    const nacelleCap = new THREE.Mesh(
        new THREE.CylinderGeometry(nacelleWidth * 0.45, nacelleWidth * 0.45, nacelleLength * 0.22, 24, 1),
        nacelleMaterial
    )
    nacelleCap.rotation.z = Math.PI
    nacelleCap.position.x = nacelleLength * 0.5 + nacelleLength * 0.11
    nacelleCap.castShadow = true
    nacelleGroup.add(nacelleCap)

    nacelleGroup.position.set(0, nacelleCenterY, 0)
    nacelleGroup.rotation.y = Math.PI * 0.5
    windTurbine.add(nacelleGroup)
    nacelleModel = nacelleGroup

    rotorPivot = new THREE.Group()
    updateRotorPivotFromNacelle()
    windTurbine.add(rotorPivot)

    rotorGroup = new THREE.Group()
    const hubMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(hubRadius, hubRadius, hubLength, 24, 1),
        hubMaterial
    )
    hubMesh.rotation.x = Math.PI * 0.5
    hubMesh.castShadow = true
    hubMesh.receiveShadow = true
    rotorGroup.add(hubMesh)

    for (let i = 0; i < bladeCount; i++) {
        const bladeGroup = new THREE.Group()
        const bladeMesh = new THREE.Mesh(
            new THREE.BoxGeometry(bladeLength, bladeThickness, bladeWidth),
            bladeMaterial
        )
        bladeMesh.position.x = hubRadius + bladeLength * 0.5
        bladeMesh.castShadow = true
        bladeMesh.receiveShadow = true
        bladeGroup.add(bladeMesh)
        bladeGroup.rotation.z = (i / bladeCount) * Math.PI * 2
        rotorGroup.add(bladeGroup)
    }

    rotorGroup.position.z -= 30
    rotorPivot.add(rotorGroup)
    updateWakeScaleFromRotor()
}

buildTurbineGeometry()

const particleCount = 100000
const particleGeometry = new THREE.BufferGeometry()
const positions = new Float32Array(particleCount * 3)
const colors = new Float32Array(particleCount * 3)

const wakeCenterY = hubCenterY
const wakeEllipseYScale = 1.15
const baseWakeLength = 150
const baseWakeRadiusMin = 0
const baseWakeRadiusRange = 12
const velocities = Array.from({ length: particleCount }, () => ({ x: 0, y: 0, z: 0 }))
const lifetimes = new Float32Array(particleCount)

const getBaseWakeLength = () => baseWakeLength * rotorWakeScale
const getWakeRadius = t => {
    const tc = THREE.MathUtils.clamp(t, 0, 1)
    return (baseWakeRadiusMin + baseWakeRadiusRange * Math.pow(1 - tc, 1.35)) * rotorWakeScale
}
const getWakeLengthScale = speedFactor => 0.82 + 0.46 * speedFactor
const getWakeRangeScale = speedFactor => 0.9 + 0.24 * speedFactor

const setColorByXZ = (index, x, z, currentWakeLength = getBaseWakeLength()) => {
    const grid = 0.6
    const qx = Math.round(x / grid)
    const qz = Math.round(z / grid)
    const n = ((qx * 0.1618 + qz * 0.618) % 1 + 1) % 1
    const t = THREE.MathUtils.clamp((-z - 5) / currentWakeLength, 0, 1)
    const wakeR = Math.max(0.001, getWakeRadius(t))
    const radialNorm = THREE.MathUtils.clamp(Math.hypot(x, 0) / wakeR, 0, 1)
    const edgeMixBase = THREE.MathUtils.smoothstep(Math.pow(radialNorm, 2.25), 0.36, 1.0)
    const hash = Math.sin(qx * 12.9898 + qz * 78.233) * 43758.5453
    const noise = hash - Math.floor(hash)
    const middleBand = THREE.MathUtils.clamp(1 - Math.abs(radialNorm - 0.58) / 0.34, 0, 1)
    const wave = Math.sin(x * 0.23 + z * 0.12) * 0.5 + Math.cos(x * 0.17 - z * 0.19) * 0.5
    const livelyJitter = ((noise - 0.5) * 0.28 + wave * 0.10) * middleBand
    const edgeMix = THREE.MathUtils.clamp(edgeMixBase * 0.74 + livelyJitter - 0.05, 0, 1)
    const warmColor = new THREE.Color(0xff7a1a)
    const coolColor = new THREE.Color(0x2f6dff)
    const c = warmColor.clone().lerp(coolColor, edgeMix)
    const brightnessJitter = 0.92 + n * 0.12
    c.multiplyScalar((0.9 + 0.1 * (1 - t)) * brightnessJitter)
    const tailFade = 1 - THREE.MathUtils.smoothstep(t, 0.55, 1.0) * 0.65
    colors[index * 3] = c.r * tailFade
    colors[index * 3 + 1] = c.g * tailFade
    colors[index * 3 + 2] = c.b * tailFade
}

const initialWakeLength = getBaseWakeLength()
for (let i = 0; i < particleCount; i++) {
    const z = -5 - Math.random() * initialWakeLength
    const t = (-z - 5) / initialWakeLength
    const maxR = getWakeRadius(t)
    const angle = Math.random() * Math.PI * 2
    const r = Math.random() * maxR
    const x = Math.cos(angle) * r
    const y = wakeCenterY + Math.sin(angle) * r * wakeEllipseYScale
    positions[i * 3] = x
    positions[i * 3 + 1] = y
    positions[i * 3 + 2] = z
    setColorByXZ(i, x, z)
    lifetimes[i] = Math.random()
}

particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

const createParticleTexture = () => {
    const canvas = document.createElement('canvas')
    canvas.width = 128
    canvas.height = 128
    const ctx = canvas.getContext('2d')
    const gradient = ctx.createRadialGradient(128, 128, 0, 128, 128, 128)
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.38)')
    gradient.addColorStop(0.45, 'rgba(255, 255, 255, 0.22)')
    gradient.addColorStop(0.75, 'rgba(255, 255, 255, 0.10)')
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 128, 128)
    return new THREE.CanvasTexture(canvas)
}

const particleTexture = createParticleTexture()
const particleBrightnessBoost = 2
const particleMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    map: particleTexture,
    size: 1.7,
    transparent: true,
    blending: THREE.NormalBlending,
    depthWrite: false,
    opacity: 0.5,
    alphaTest: 0.02,
    fog: false,
    sizeAttenuation: true,
    vertexColors: true
})

const particles = new THREE.Points(particleGeometry, particleMaterial)
scene.add(particles)

let rotationSpeedFactor = 1.4
const baseRotSpeed = 0.012
const bladeSpinDirection = 1

const overlay = document.createElement('div')
overlay.innerHTML = `
    <div id="info">
        <h1>🌬️ 大型水平轴风机 · 转速相关湍流尾流</h1>
        <p>三个扇叶 | 粒子扩散速度/范围随转速变化 | 拖动滑块体验动态效果</p>
    </div>
    <div id="controls">
        <label>
            <span style="font-size: 1.2rem;">⚙️ 叶片转速因子</span>
            <input type="range" id="speedSlider" min="0.3" max="2.8" step="0.01" value="2.03">
            <span id="speedValue">2.03</span>
        </label>
        <div style="width: 2px; height: 30px; background: #446688; border-radius: 2px;"></div>
        <div style="display: flex; gap: 15px;">
            <div>🌪️ 湍流强度: <span id="intensityLabel">中高</span></div>
            <div>📏 扩散范围: <span id="rangeLabel">宽</span></div>
        </div>
        <div style="width: 2px; height: 30px; background: #446688; border-radius: 2px;"></div>
        <label>
            <span style="font-size: 1rem;">🧭 旋转轴高度偏移</span>
            <input type="number" id="pivotOffsetInput" min="-20" max="20" step="0.1" value="0">
        </label>
    </div>
    <div id="stats">粒子数量: <span id="particleCount">${particleCount}</span> | 实时尾流更新</div>
`

overlay.style.position = 'absolute'
overlay.style.left = '0'
overlay.style.top = '0'
overlay.style.width = '100%'
overlay.style.height = '100%'
overlay.style.pointerEvents = 'none'
document.body.appendChild(overlay)

const uiStyle = document.createElement('style')
uiStyle.textContent = `
    body { margin: 0; overflow: hidden; font-family: 'Microsoft YaHei', sans-serif; }
    #info { position: absolute; top: 20px; left: 20px; color: #fff; background: rgba(0, 0, 0, 0.7); padding: 15px 25px; border-radius: 8px; pointer-events: none; z-index: 10; backdrop-filter: blur(5px); border-left: 4px solid #ffaa33; box-shadow: 0 4px 15px rgba(0,0,0,0.5); }
    #info h1 { margin: 0 0 5px; font-size: 1.5rem; font-weight: 400; color: #ffaa33; }
    #info p { margin: 0; font-size: 0.9rem; opacity: 0.9; }
    #controls { position: absolute; bottom: 30px; left: 30px; background: rgba(20, 20, 30, 0.85); backdrop-filter: blur(8px); color: #fff; padding: 20px 30px; border-radius: 40px; z-index: 20; border: 1px solid #446688; box-shadow: 0 4px 20px rgba(0,0,0,0.6); display: flex; gap: 25px; align-items: center; font-size: 1rem; pointer-events: auto; }
    #controls label { display: flex; align-items: center; gap: 12px; }
    #controls input[type="range"] { width: 300px; cursor: pointer; accent-color: #ffaa33; height: 8px; border-radius: 10px; }
    #controls input[type="number"] { width: 90px; padding: 6px 8px; border-radius: 10px; border: 1px solid #446688; background: rgba(0, 0, 0, 0.35); color: #ffaa33; font-weight: bold; font-size: 0.95rem; outline: none; }
    #controls span { min-width: 45px; text-align: center; font-weight: bold; color: #ffaa33; background: rgba(0,0,0,0.3); padding: 4px 10px; border-radius: 20px; }
    #stats { position: absolute; bottom: 30px; right: 30px; color: #ccc; background: rgba(0,0,0,0.5); padding: 8px 18px; border-radius: 30px; font-size: 0.9rem; z-index: 15; backdrop-filter: blur(4px); border: 1px solid #335577; }
    @media (max-width: 700px) { #controls { flex-direction: column; align-items: flex-start; width: 90%; left: 5%; padding: 15px; } #controls input[type="range"] { width: 100%; } }
`

document.head.appendChild(uiStyle)

const slider = overlay.querySelector('#speedSlider')
const speedSpan = overlay.querySelector('#speedValue')
const intensitySpan = overlay.querySelector('#intensityLabel')
const rangeSpan = overlay.querySelector('#rangeLabel')
const pivotOffsetInput = overlay.querySelector('#pivotOffsetInput')

rotationSpeedFactor = parseFloat(slider.value)

slider.addEventListener('input', e => {
    rotationSpeedFactor = parseFloat(e.target.value)
    speedSpan.textContent = rotationSpeedFactor.toFixed(2)
    if (rotationSpeedFactor < 0.8) {
        intensitySpan.textContent = '低'
        rangeSpan.textContent = '窄'
    } else if (rotationSpeedFactor < 1.5) {
        intensitySpan.textContent = '中'
        rangeSpan.textContent = '中等'
    } else if (rotationSpeedFactor < 2.2) {
        intensitySpan.textContent = '高'
        rangeSpan.textContent = '宽'
    } else {
        intensitySpan.textContent = '狂暴'
        rangeSpan.textContent = '极大'
    }
})

pivotOffsetInput.addEventListener('input', e => {
    const value = parseFloat(e.target.value)
    if (!Number.isFinite(value)) return
    rotorPivotYOffset = value
    updateRotorPivotFromNacelle()
})

const resetParticle = index => {
    const posArray = particleGeometry.attributes.position.array
    const effectiveWakeLength = getBaseWakeLength() * getWakeLengthScale(rotationSpeedFactor)
    const effectiveRangeScale = getWakeRangeScale(rotationSpeedFactor)
    const z = -5 - Math.random() * 12
    const t = (-z - 5) / effectiveWakeLength
    const baseRadius = Math.max(1.8, getWakeRadius(t) * effectiveRangeScale)
    const angle = Math.random() * Math.PI * 2
    const r = Math.random() * baseRadius
    const x = Math.cos(angle) * r
    const y = wakeCenterY + Math.sin(angle) * r * wakeEllipseYScale
    posArray[index * 3] = x
    posArray[index * 3 + 1] = y
    posArray[index * 3 + 2] = z
    setColorByXZ(index, x, z, effectiveWakeLength)
    const vzBase = -0.14 - 0.16 * rotationSpeedFactor
    const vxRange = 0.12 * rotationSpeedFactor
    const vyRange = 0.08 * rotationSpeedFactor
    velocities[index].x = (Math.random() - 0.5) * vxRange
    velocities[index].y = (Math.random() - 0.5) * vyRange
    velocities[index].z = vzBase + (Math.random() * -0.08 * rotationSpeedFactor)
    lifetimes[index] = Math.random()
}

for (let i = 0; i < particleCount; i++) {
    const vzBase = -0.14 - 0.16 * rotationSpeedFactor
    const vxRange = 0.12 * rotationSpeedFactor
    const vyRange = 0.08 * rotationSpeedFactor
    velocities[i].x = (Math.random() - 0.5) * vxRange
    velocities[i].y = (Math.random() - 0.5) * vyRange
    velocities[i].z = vzBase + (Math.random() * -0.08 * rotationSpeedFactor)
}

const clock = new THREE.Clock()

const animate = () => {
    const delta = clock.getDelta()
    water.material.uniforms.time.value += delta * 0.75

    if (rotorPivot) rotorPivot.rotation.z += baseRotSpeed * rotationSpeedFactor * delta * 30
    else if (rotorGroup) rotorGroup.rotation.z += baseRotSpeed * rotationSpeedFactor * delta * 30

    const posAttr = particleGeometry.attributes.position
    const posArray = posAttr.array
    const colorAttr = particleGeometry.attributes.color

    const effectiveWakeLength = getBaseWakeLength() * getWakeLengthScale(rotationSpeedFactor)
    const effectiveRangeScale = getWakeRangeScale(rotationSpeedFactor)
    const cameraDistance = camera.position.distanceTo(controls.target)
    const distanceScale = THREE.MathUtils.clamp(cameraDistance / 240, 0.9, 2.6)
    particleMaterial.size = (0.65 + rotationSpeedFactor * 0.22) * distanceScale
    particleMaterial.opacity = (0.34 + rotationSpeedFactor * 0.10) * particleBrightnessBoost

    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3
        let px = posArray[i3]
        let py = posArray[i3 + 1]
        let pz = posArray[i3 + 2]
        const vel = velocities[i]

        vel.x += (Math.random() - 0.5) * 0.012 * rotationSpeedFactor
        vel.y += (Math.random() - 0.5) * 0.012 * rotationSpeedFactor
        vel.z += (Math.random() - 0.8) * 0.01 * rotationSpeedFactor

        const tWake = THREE.MathUtils.clamp((-pz - 5) / effectiveWakeLength, 0, 1)
        const targetRadius = getWakeRadius(tWake) * effectiveRangeScale
        const radial = Math.hypot(px, py - wakeCenterY)

        if (radial > 0.0001) {
            const tx = -((py - wakeCenterY) / radial)
            const ty = px / radial
            const swirlStrength = (0.006 + 0.022 * (1 - tWake)) * rotationSpeedFactor * bladeSpinDirection
            vel.x += tx * swirlStrength
            vel.y += ty * swirlStrength
        }

        if (radial > 0.0001) {
            const excess = Math.max(0, radial - targetRadius)
            if (excess > 0) {
                const inward = Math.min(0.06, 0.001 + excess * 0.015)
                vel.x -= (px / radial) * inward
                vel.y -= ((py - wakeCenterY) / radial) * inward
            }
        }

        const maxVx = 0.35 * rotationSpeedFactor
        const maxVy = 0.25 * rotationSpeedFactor
        const maxVz = 0.6 * rotationSpeedFactor
        vel.x = Math.max(-maxVx, Math.min(maxVx, vel.x))
        vel.y = Math.max(-maxVy, Math.min(maxVy, vel.y))
        vel.z = Math.max(-maxVz, Math.min(-0.05, vel.z))

        px += vel.x
        py += vel.y
        pz += vel.z

        const minZ = -5 - effectiveWakeLength * (0.85 + 0.2 * rotationSpeedFactor) - lifetimes[i] * 14
        const tEdge = THREE.MathUtils.clamp((-pz - 5) / effectiveWakeLength, 0, 1)
        const edgeJitter = 0.82 + lifetimes[i] * 0.36
        const boundaryRx = (getWakeRadius(tEdge) * effectiveRangeScale + 7.5) * edgeJitter
        const boundaryRy = boundaryRx * wakeEllipseYScale
        const dx = px
        const dy = py - wakeCenterY
        const ellipseNorm = (dx * dx) / (boundaryRx * boundaryRx) + (dy * dy) / (boundaryRy * boundaryRy)
        const hardOut = pz < (minZ - 12) || ellipseNorm > 1.55
        if (hardOut) {
            resetParticle(i)
            continue
        }

        const softOut = pz < minZ || ellipseNorm > 1.0
        if (softOut && radial > 0.0001) {
            const overflow = Math.max(0, ellipseNorm - 1.0) + Math.max(0, (minZ - pz) / 20)
            const edgePull = Math.min(0.08, 0.012 + overflow * 0.025)
            vel.x -= (px / radial) * edgePull
            vel.y -= ((py - wakeCenterY) / radial) * edgePull
            vel.z += Math.min(0.035, 0.01 + overflow * 0.01)
            const resetChance = Math.min(0.35, 0.03 + overflow * 0.18)
            if (Math.random() < resetChance) {
                resetParticle(i)
                continue
            }
        }

        posArray[i3] = px
        posArray[i3 + 1] = py
        posArray[i3 + 2] = pz
        setColorByXZ(i, px, pz, effectiveWakeLength)
    }

    posAttr.needsUpdate = true
    colorAttr.needsUpdate = true

    controls.update()
    renderer.render(scene, camera)
    stats.update()
    requestAnimationFrame(animate)
}

animate()

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
})
