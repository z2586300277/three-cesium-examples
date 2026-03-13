import * as THREE from 'three'
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js'
import Stats from 'three/examples/jsm/libs/stats.module.js'

const box = document.getElementById('box')
box.style.position = 'relative'

const style = document.createElement('style')
style.textContent = `
    .pc-info { position: absolute; top: 20px; left: 20px; background: rgba(0,0,0,0.7); color: #fff; padding: 10px 20px; border-radius: 8px; pointer-events: none; z-index: 100; font-size: 14px; border-left: 4px solid #ffaa00; }
    .pc-status { position: absolute; bottom: 30px; left: 20px; background: rgba(0,0,0,0.6); color: #0ff; padding: 8px 16px; border-radius: 20px; font-size: 14px; pointer-events: none; z-index: 100; backdrop-filter: blur(5px); border: 1px solid #00ccff; }
    .pc-instruction { position: absolute; bottom: 30px; right: 30px; background: rgba(30,30,30,0.85); color: #ccc; padding: 15px 25px; border-radius: 8px; font-size: 14px; line-height: 1.8; border: 1px solid #555; pointer-events: none; z-index: 100; box-shadow: 0 4px 15px rgba(0,0,0,0.5); backdrop-filter: blur(5px); }
    .pc-instruction kbd { background: #333; border-radius: 4px; padding: 2px 8px; color: #ffaa00; border: 1px solid #666; }
    .pc-warning { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: red; font-size: 24px; font-weight: bold; text-shadow: 0 0 20px rgba(255,0,0,0.8); z-index: 200; pointer-events: none; opacity: 0; transition: opacity 0.1s; background: rgba(0,0,0,0.5); padding: 10px 30px; border-radius: 50px; border: 2px solid red; }
    .pc-warning.show { opacity: 1; }
`
document.head.appendChild(style)

const info = document.createElement('div')
info.className = 'pc-info'
info.innerHTML = '⚡ 风力发电机扇叶内部漫游 | 点云数量: <span id="pointCount">加载中...</span>'

const status = document.createElement('div')
status.className = 'pc-status'
status.innerHTML = '🟢 状态: 正常移动 | 最近距离: <span id="nearestDist">-</span> m'

const instruction = document.createElement('div')
instruction.className = 'pc-instruction'
instruction.innerHTML = `
    <div style="color:#fff; margin-bottom:10px; font-weight:bold;">🕹️ 操作说明 (八叉树碰撞优化版)</div>
    <div><kbd>W/A/S/D</kbd> 移动</div>
    <div><kbd>鼠标</kbd> 旋转视角</div>
    <div><kbd>Shift</kbd> 加速</div>
    <div><kbd>空格</kbd> 跳跃 (未实现)</div>
    <div style="margin-top:10px; color:#aaa;">点击画面锁定鼠标<br>按 <kbd>ESC</kbd> 退出锁定</div>
    <div style="margin-top:10px; color:#ffaa00;">⚡ 碰撞阈值: <span style="color:#fff;">0.20 m</span> (基于八叉树最近点)</div>
    <div style="margin-top:6px; color:#66ddff;"><kbd>V</kbd> 切换碰撞: <span id="collisionToggle">开</span></div>
    <div style="margin-top:6px; color:#99ffaa;">圆形墙体仅入口可进出</div>
`

const warning = document.createElement('div')
warning.className = 'pc-warning'
warning.textContent = '⚠️ 碰撞阻挡'

box.append(info, status, instruction, warning)

const pointCountSpan = info.querySelector('#pointCount')
const nearestDistSpan = status.querySelector('#nearestDist')
const warningDiv = warning
const collisionToggleSpan = instruction.querySelector('#collisionToggle')

const scene = new THREE.Scene()
scene.background = new THREE.Color(0x111122)

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000)
camera.position.set(-1.345, 0.2, -11.57)

const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'default' })
renderer.setSize(box.clientWidth, box.clientHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
box.appendChild(renderer.domElement)

const stats = new Stats()
stats.showPanel(0)
stats.dom.style.position = 'absolute'
stats.dom.style.left = '10px'
stats.dom.style.top = '10px'
box.appendChild(stats.dom)

scene.add(new THREE.AmbientLight(0x404060))
const dirLight = new THREE.DirectionalLight(0xffffff, 0.8)
dirLight.position.set(1, 2, 1)
scene.add(dirLight)

const starsGeo = new THREE.BufferGeometry()
const starsCount = 2000
const starPositions = new Float32Array(starsCount * 3)
for (let i = 0; i < starsCount * 3; i += 3) {
    starPositions[i] = (Math.random() - 0.5) * 200
    starPositions[i + 1] = (Math.random() - 0.5) * 200
    starPositions[i + 2] = (Math.random() - 0.5) * 200
}
starsGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))
const starsMat = new THREE.PointsMaterial({ color: 0x88aaff, size: 0.1, transparent: true })
const stars = new THREE.Points(starsGeo, starsMat)
scene.add(stars)

let pointCloud = null
let collisionDetector = null
const clock = new THREE.Clock()
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()
const anchorSprites = []

const moveState = { forward: false, backward: false, left: false, right: false, shift: false }
const speed = 0.5
const collisionThreshold = 0.1
let collisionEnabled = true

let wallRadius = 2.0
let wallEntranceAngle = 0.0
let wallEntranceHalfWidth = Math.PI / 10
let wallEntranceZMin = -1.0
let wallEntranceZMax = 1.0
let wallRing = null
let wallDoor = null

function createAnchorSprite(colorHex) {
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64
    const ctx = canvas.getContext('2d')
    ctx.fillStyle = 'rgba(0,0,0,0)'
    ctx.fillRect(0, 0, 64, 64)
    ctx.beginPath()
    ctx.arc(32, 32, 14, 0, Math.PI * 2)
    ctx.fillStyle = '#ffffff'
    ctx.fill()
    ctx.beginPath()
    ctx.arc(32, 32, 10, 0, Math.PI * 2)
    ctx.fillStyle = `#${colorHex.toString(16).padStart(6, '0')}`
    ctx.fill()

    const texture = new THREE.CanvasTexture(canvas)
    const material = new THREE.SpriteMaterial({ map: texture, transparent: true })
    const sprite = new THREE.Sprite(material)
    sprite.scale.set(0.4, 0.4, 0.4)
    return sprite
}

function addAnchors() {
    anchorSprites.forEach(sprite => scene.remove(sprite))
    anchorSprites.length = 0

    if (!pointCloud || !pointCloud.geometry || !pointCloud.geometry.boundingBox) return

    const bbox = pointCloud.geometry.boundingBox
    const center = new THREE.Vector3()
    bbox.getCenter(center)

    const anchors = [
        { name: '入口附近', offset: new THREE.Vector3(1.0, 0.0, bbox.min.z + 0.8), color: 0x33ff88 },
        { name: '中段外侧', offset: new THREE.Vector3(0.0, 1.2, center.z), color: 0xffaa00 },
        { name: '叶尖区域', offset: new THREE.Vector3(-0.6, 0.2, bbox.max.z - 0.6), color: 0x66ddff }
    ]

    anchors.forEach(anchor => {
        const sprite = createAnchorSprite(anchor.color)
        sprite.position.copy(anchor.offset)
        sprite.userData = { title: anchor.name }
        scene.add(sprite)
        anchorSprites.push(sprite)
    })
}

const controls = new PointerLockControls(camera, renderer.domElement)
renderer.domElement.addEventListener('click', () => controls.lock())
controls.addEventListener('lock', () => {
    camera.position.set(-1.345, 0.2, -11.57)
    camera.lookAt(0, 0, 0)
})

renderer.domElement.addEventListener('click', event => {
    if (controls.isLocked) return
    const rect = renderer.domElement.getBoundingClientRect()
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
    raycaster.setFromCamera(mouse, camera)
    const hits = raycaster.intersectObjects(anchorSprites, false)
    if (hits.length > 0) {
        const title = hits[0].object.userData.title || '锚点'
        alert(`锚点: ${title}`)
    }
})

const keys = new Set(['KeyW', 'KeyS', 'KeyA', 'KeyD', 'ShiftLeft', 'ShiftRight', 'Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyV'])

document.addEventListener('keydown', e => {
    switch (e.code) {
        case 'KeyW': moveState.forward = true; e.preventDefault(); break
        case 'KeyS': moveState.backward = true; e.preventDefault(); break
        case 'KeyA': moveState.left = true; e.preventDefault(); break
        case 'KeyD': moveState.right = true; e.preventDefault(); break
        case 'ShiftLeft':
        case 'ShiftRight': moveState.shift = true; e.preventDefault(); break
        case 'KeyV':
            collisionEnabled = !collisionEnabled
            collisionToggleSpan.innerText = collisionEnabled ? '开' : '关'
            e.preventDefault()
            break
        default: break
    }
})

document.addEventListener('keyup', e => {
    switch (e.code) {
        case 'KeyW': moveState.forward = false; e.preventDefault(); break
        case 'KeyS': moveState.backward = false; e.preventDefault(); break
        case 'KeyA': moveState.left = false; e.preventDefault(); break
        case 'KeyD': moveState.right = false; e.preventDefault(); break
        case 'ShiftLeft':
        case 'ShiftRight': moveState.shift = false; e.preventDefault(); break
        default: break
    }
})

window.addEventListener('keydown', e => {
    if (keys.has(e.code)) e.preventDefault()
}, false)

class OctreeCollisionField {
    constructor(positions, maxDepth = 10, minNodeSize = 0.03) {
        this.positions = positions
        this.maxDepth = maxDepth
        this.minNodeSize = minNodeSize

        this.bounds = new THREE.Box3()
        for (let i = 0; i < positions.length; i += 3) {
            this.bounds.expandByPoint(new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]))
        }
        this.bounds.expandByScalar(0.01)

        const indices = Array.from({ length: positions.length / 3 }, (_, i) => i)
        this.root = this.buildNode(this.bounds.clone(), indices, 0)
        this.lastNearestPoint = null
    }

    buildNode(box, indices, depth) {
        const min = box.min, max = box.max
        const size = max.x - min.x
        const node = { box, indices, children: null }

        if (depth < this.maxDepth && size > this.minNodeSize && indices.length > 50) {
            const center = new THREE.Vector3().copy(min).add(max).multiplyScalar(0.5)
            const childIndices = Array.from({ length: 8 }, () => [])

            for (let idx of indices) {
                const i = idx * 3
                const x = this.positions[i]
                const y = this.positions[i + 1]
                const z = this.positions[i + 2]

                const cx = x < center.x ? 0 : 1
                const cy = y < center.y ? 0 : 1
                const cz = z < center.z ? 0 : 1
                const childIndex = (cx) | (cy << 1) | (cz << 2)
                childIndices[childIndex].push(idx)
            }

            node.children = []
            for (let i = 0; i < 8; i++) {
                if (childIndices[i].length === 0) continue
                const childBox = new THREE.Box3()
                const x0 = (i & 1) ? center.x : min.x
                const x1 = (i & 1) ? max.x : center.x
                const y0 = (i & 2) ? center.y : min.y
                const y1 = (i & 2) ? max.y : center.y
                const z0 = (i & 4) ? center.z : min.z
                const z1 = (i & 4) ? max.z : center.z
                childBox.set(new THREE.Vector3(x0, y0, z0), new THREE.Vector3(x1, y1, z1))

                const childNode = this.buildNode(childBox, childIndices[i], depth + 1)
                node.children.push(childNode)
            }
            if (node.children.length === 0) node.children = null
        }
        return node
    }

    getApproxNearestDistance(point, maxDistance = Infinity) {
        let bestDistSq = maxDistance * maxDistance
        let bestPoint = null

        if (this.lastNearestPoint) {
            const dx = this.lastNearestPoint.x - point.x
            const dy = this.lastNearestPoint.y - point.y
            const dz = this.lastNearestPoint.z - point.z
            const distSq = dx * dx + dy * dy + dz * dz
            if (distSq < bestDistSq) {
                bestDistSq = distSq
                bestPoint = this.lastNearestPoint.clone()
            }
        }

        this.queryNode(this.root, point, bestDistSq, (distSq, px, py, pz) => {
            if (distSq < bestDistSq) {
                bestDistSq = distSq
                bestPoint = new THREE.Vector3(px, py, pz)
            }
        })

        this.lastNearestPoint = bestPoint
        return Math.sqrt(bestDistSq)
    }

    queryNode(node, point, bestDistSq, callback) {
        const boxDistSq = this.distanceSqToBox(point, node.box)
        if (boxDistSq >= bestDistSq) return

        if (node.children) {
            const childrenWithDist = node.children.map(child => ({
                child,
                distSq: this.distanceSqToBox(point, child.box)
            }))
            childrenWithDist.sort((a, b) => a.distSq - b.distSq)

            for (let { child, distSq } of childrenWithDist) {
                if (distSq >= bestDistSq) break
                this.queryNode(child, point, bestDistSq, callback)
            }
        } else {
            for (let idx of node.indices) {
                const i = idx * 3
                const px = this.positions[i]
                const py = this.positions[i + 1]
                const pz = this.positions[i + 2]
                const dx = px - point.x
                const dy = py - point.y
                const dz = pz - point.z
                const distSq = dx * dx + dy * dy + dz * dz
                if (distSq < bestDistSq) {
                    bestDistSq = distSq
                    callback(distSq, px, py, pz)
                }
            }
        }
    }

    distanceSqToBox(point, box) {
        const p = point
        const min = box.min, max = box.max
        let dx = 0, dy = 0, dz = 0
        if (p.x < min.x) dx = min.x - p.x
        else if (p.x > max.x) dx = p.x - max.x
        if (p.y < min.y) dy = min.y - p.y
        else if (p.y > max.y) dy = p.y - max.y
        if (p.z < min.z) dz = min.z - p.z
        else if (p.z > max.z) dz = p.z - max.z
        return dx * dx + dy * dy + dz * dz
    }
}

const normalizeAngle = angle => {
    let a = angle
    while (a > Math.PI) a -= Math.PI * 2
    while (a < -Math.PI) a += Math.PI * 2
    return a
}

const isInWallEntrance = pos => {
    const angle = Math.atan2(pos.y, pos.x)
    const delta = normalizeAngle(angle - wallEntranceAngle)
    const inAngle = Math.abs(delta) <= wallEntranceHalfWidth
    const inZ = pos.z >= wallEntranceZMin && pos.z <= wallEntranceZMax
    return inAngle && inZ
}

const isCrossingWall = (fromPos, toPos) => {
    const r0 = Math.hypot(fromPos.x, fromPos.y)
    const r1 = Math.hypot(toPos.x, toPos.y)
    const outside0 = r0 > wallRadius
    const outside1 = r1 > wallRadius
    return outside0 !== outside1
}

function updateWallVisualization() {
    if (wallRing) scene.remove(wallRing)
    if (wallDoor) scene.remove(wallDoor)

    const zMid = (wallEntranceZMin + wallEntranceZMax) * 0.5
    const ringPoints = []
    const segments = 128
    for (let i = 0; i <= segments; i++) {
        const t = (i / segments) * Math.PI * 2
        ringPoints.push(new THREE.Vector3(Math.cos(t) * wallRadius, Math.sin(t) * wallRadius, zMid))
    }
    const ringGeometry = new THREE.BufferGeometry().setFromPoints(ringPoints)
    const ringMaterial = new THREE.LineBasicMaterial({ color: 0x66ddff, transparent: true, opacity: 0.6 })
    wallRing = new THREE.LineLoop(ringGeometry, ringMaterial)
    scene.add(wallRing)

    const doorWidth = Math.max(0.3, 2 * wallRadius * Math.tan(wallEntranceHalfWidth))
    const doorHeight = Math.max(0.5, wallEntranceZMax - wallEntranceZMin)
    const doorGeometry = new THREE.PlaneGeometry(doorWidth, doorHeight)
    const doorMaterial = new THREE.MeshBasicMaterial({
        color: 0x33ff88,
        transparent: true,
        opacity: 0.25,
        side: THREE.DoubleSide
    })
    wallDoor = new THREE.Mesh(doorGeometry, doorMaterial)
    wallDoor.rotation.x = Math.PI / 2
    wallDoor.rotation.z = wallEntranceAngle + Math.PI / 2
    wallDoor.position.set(
        Math.cos(wallEntranceAngle) * wallRadius,
        Math.sin(wallEntranceAngle) * wallRadius,
        zMid
    )
    scene.add(wallDoor)
}

function generateMockFanBladePoints(count = 5000000) {
    const positions = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)

    const span = 20.0
    const rootZ = -2.5
    const rootChord = 3.4
    const tipChord = 0.85
    const rootThicknessRatio = 0.14
    const tipThicknessRatio = 0.055
    const twistMax = 30 * Math.PI / 180
    const rootRadius = 0.65
    const rootLength = 2.5
    const m0 = 0.02
    const p0 = 0.4

    const smoothstep = (a, b, x) => {
        const t = Math.max(0, Math.min(1, (x - a) / (b - a)))
        return t * t * (3 - 2 * t)
    }

    const nacaAirfoilPoint = (x01, chord, tRatio, upper) => {
        const yt = 5 * tRatio * chord * (
            0.2969 * Math.sqrt(x01) -
            0.1260 * x01 -
            0.3516 * x01 * x01 +
            0.2843 * x01 * x01 * x01 -
            0.1015 * x01 * x01 * x01 * x01
        )

        let yc = 0
        let dyc = 0
        if (x01 < p0) {
            yc = m0 / (p0 * p0) * (2 * p0 * x01 - x01 * x01) * chord
            dyc = 2 * m0 / (p0 * p0) * (p0 - x01)
        } else {
            const oneMinusP = 1 - p0
            yc = m0 / (oneMinusP * oneMinusP) * ((1 - 2 * p0) + 2 * p0 * x01 - x01 * x01) * chord
            dyc = 2 * m0 / (oneMinusP * oneMinusP) * (p0 - x01)
        }

        const theta = Math.atan(dyc)
        const sign = upper ? 1 : -1
        const x = x01 * chord
        const xu = x - sign * yt * Math.sin(theta)
        const yu = yc + sign * yt * Math.cos(theta)
        return { x: xu, y: yu }
    }

    for (let i = 0; i < count; i++) {
        const s = Math.random()
        const z = rootZ + s * span

        const chord = rootChord + (tipChord - rootChord) * s
        const tRatio = rootThicknessRatio + (tipThicknessRatio - rootThicknessRatio) * s

        const sweep = Math.sin(s * Math.PI) * 0.5
        const bend = Math.sin(s * Math.PI * 0.6) * 0.8

        const upper = Math.random() > 0.5
        const x01 = Math.random()

        const air = nacaAirfoilPoint(x01, chord, tRatio, upper)
        const airX = air.x - 0.25 * chord
        const airY = air.y

        const rootBlendStart = rootLength / span * 0.4
        const rootBlendEnd = rootLength / span
        const blend = smoothstep(rootBlendStart, rootBlendEnd, s)

        const angle = Math.random() * Math.PI * 2
        const cylR = rootRadius * (1 - 0.15 * s / rootBlendEnd)
        const cylX = Math.cos(angle) * cylR
        const cylY = Math.sin(angle) * cylR

        let localX = cylX * (1 - blend) + airX * blend
        let localY = cylY * (1 - blend) + airY * blend

        const twist = s * twistMax
        const cosT = Math.cos(twist)
        const sinT = Math.sin(twist)

        const rotX = localX * cosT - localY * sinT
        const rotY = localX * sinT + localY * cosT

        const worldX = rotX + bend + sweep
        const worldY = rotY

        positions[i * 3] = worldX
        positions[i * 3 + 1] = worldY
        positions[i * 3 + 2] = z

        const shade = 0.76 + 0.18 * (1 - s)
        colors[i * 3] = shade
        colors[i * 3 + 1] = shade + 0.02
        colors[i * 3 + 2] = 0.92
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

    const material = new THREE.PointsMaterial({
        size: 0.005,
        vertexColors: true,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending
    })
    const points = new THREE.Points(geometry, material)
    return { points, positions }
}

function centerGeometryPositions(geometry) {
    geometry.computeBoundingBox()
    const bbox = geometry.boundingBox
    const center = new THREE.Vector3()
    bbox.getCenter(center)

    const positions = geometry.attributes.position.array
    for (let i = 0; i < positions.length; i += 3) {
        positions[i] -= center.x
        positions[i + 1] -= center.y
        positions[i + 2] -= center.z
    }
    geometry.attributes.position.needsUpdate = true
    geometry.computeBoundingBox()
    return center
}

function useMockData() {
    const mockPointCount = 5000000
    const { points, positions } = generateMockFanBladePoints(mockPointCount)
    centerGeometryPositions(points.geometry)
    pointCloud = points
    scene.add(pointCloud)
    pointCloud.geometry.computeBoundingBox()
    addAnchors()
    pointCountSpan.innerText = mockPointCount.toLocaleString()

    collisionDetector = new OctreeCollisionField(positions, 10, 0.03)

    const bbox = new THREE.Box3().setFromBufferAttribute(points.geometry.attributes.position)
    const maxXY = Math.max(
        Math.abs(bbox.min.x), Math.abs(bbox.max.x),
        Math.abs(bbox.min.y), Math.abs(bbox.max.y)
    )
    wallRadius = maxXY + 0.25
    wallEntranceAngle = 0.0
    wallEntranceHalfWidth = Math.PI / 8
    wallEntranceZMin = bbox.min.z - 0.2
    wallEntranceZMax = bbox.max.z + 0.2
    updateWallVisualization()

    camera.position.set(-1.345, 0.2, -11.57)
    camera.lookAt(0, 0, 0)
}

useMockData()

function animate() {
    requestAnimationFrame(animate)
    stats.begin()
    const delta = Math.min(clock.getDelta(), 0.1)

    if (collisionDetector && controls.isLocked) {
        const direction = new THREE.Vector3()
        controls.getDirection(direction)
        direction.y = 0
        direction.normalize()

        const right = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), direction).normalize()

        const moveDelta = new THREE.Vector3()
        if (moveState.forward) moveDelta.add(direction)
        if (moveState.backward) moveDelta.sub(direction)
        if (moveState.right) moveDelta.sub(right)
        if (moveState.left) moveDelta.add(right)

        if (moveDelta.lengthSq() > 0) {
            moveDelta.normalize()
            let currentSpeed = speed
            if (moveState.shift) currentSpeed *= 2.5
            moveDelta.multiplyScalar(currentSpeed * delta)

            const newPos = camera.position.clone().add(moveDelta)
            const wallCrossing = collisionEnabled && isCrossingWall(camera.position, newPos)
            const wallAllowed = !wallCrossing || isInWallEntrance(newPos)

            let pointCloudDist = Infinity
            if (collisionEnabled && collisionDetector) {
                pointCloudDist = collisionDetector.getApproxNearestDistance(newPos, collisionThreshold * 2)
            }
            const pointCloudBlocked = pointCloudDist < collisionThreshold

            nearestDistSpan.innerText = pointCloudDist.toFixed(3)

            if (wallAllowed && !pointCloudBlocked) {
                camera.position.copy(newPos)
                warningDiv.classList.remove('show')
            } else {
                warningDiv.classList.add('show')
            }
        } else if (collisionDetector) {
            const dist = collisionDetector.getApproxNearestDistance(camera.position, collisionThreshold * 2)
            nearestDistSpan.innerText = dist.toFixed(3)
            warningDiv.classList.remove('show')
        }
    } else if (collisionDetector) {
        warningDiv.classList.remove('show')
        const dist = collisionDetector.getApproxNearestDistance(camera.position, collisionThreshold * 2)
        nearestDistSpan.innerText = dist.toFixed(3)
    }

    stars.rotation.y += 0.0001
    renderer.render(scene, camera)
    stats.end()
}

animate()

window.onresize = () => {
    renderer.setSize(box.clientWidth, box.clientHeight)
    camera.aspect = box.clientWidth / box.clientHeight
    camera.updateProjectionMatrix()
}
