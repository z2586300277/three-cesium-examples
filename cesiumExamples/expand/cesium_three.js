import * as Cesium from 'cesium'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
// 如果出现地图没加载出地球 可能是多人访问公用token导致的问题,换成你自己的token 就好
Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJjOTVhZGI5Zi0wMTYzLTQ2MWEtYTBjYS02OTc5ZGNkNTY3ZDMiLCJpZCI6NTcwNzEsImlhdCI6MTc2MjQ3OTkyNH0.1bx7V2IFDE_Id5uqrQx-pJvRlzH34NDa2zc8vDY-Y0w"

const cesiumBox = document.getElementById('box')

const CENTER_WGS84 = [115.73, 40.55]
const TERRAIN_FOLLOW = {
    scale: 120,
    offset: 5,
    intervalMs: 1500
}
// Three 默认 Y-up，Cesium ENU 是 Z-up，这里做一次统一轴转换。
const Y_UP_TO_Z_UP = Cesium.Matrix4.fromRotationTranslation(
    Cesium.Matrix3.fromRotationX(Cesium.Math.PI_OVER_TWO)
)

const FUSION_CONFIG = {
    pulse: { speed: 1.8, min: 0.7, max: 1.35 },
    ring: { radius: 14, speed: 0.9 },
    rotate: 0.35,
    fly: { speed: 0.22, radius: 0.22 }
}

bootstrap()

async function bootstrap() {

    const viewer = await initCesium(cesiumBox)
    initThree(viewer)

}

// 初始化Cesium
async function initCesium() {

    const viewer = new Cesium.Viewer(cesiumBox, {
        baseLayerPicker: false,
        imageryProvider: false, // 替换 baseLayer: false
        infoBox: false,
        animation: false,
        timeline: false,
        useDefaultRenderLoop: false
    })

    const url = 'https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer'

    const layer = Cesium.ImageryLayer.fromProviderAsync(

        Cesium.ArcGisMapServerImageryProvider.fromUrl(url)

    )

    viewer.imageryLayers.add(layer)

    viewer.terrainProvider = await Cesium.createWorldTerrainAsync({
        requestWaterMask: true,
        requestVertexNormals: true
    })



    const centerCartesian = Cesium.Cartesian3.fromDegrees(CENTER_WGS84[0], CENTER_WGS84[1], 2500)

    viewer.fusionEntities = {
        anchor: viewer.entities.add({
            id: 'fusion-anchor',
            position: centerCartesian,
            point: {
                pixelSize: 10,
                color: Cesium.Color.fromCssColorString('#58d5ff'),
                outlineColor: Cesium.Color.fromCssColorString('#0a2238'),
                outlineWidth: 2,
                disableDepthTestDistance: Number.POSITIVE_INFINITY
            },
            label: {
                text: 'Fusion Core',
                fillColor: Cesium.Color.fromCssColorString('#7fe7ff'),
                outlineColor: Cesium.Color.BLACK,
                outlineWidth: 2,
                verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                pixelOffset: new Cesium.Cartesian2(0, -18),
                scale: 0.75,
                disableDepthTestDistance: Number.POSITIVE_INFINITY
            }
        }),
        orbit: viewer.entities.add({
            id: 'fusion-orbit',
            position: new Cesium.CallbackProperty((time, result) => {
                const seconds = Cesium.JulianDate.secondsDifference(time, viewer.clock.startTime)
                const angle = seconds * 0.34
                const lon = CENTER_WGS84[0] + Math.cos(angle) * 0.18
                const lat = CENTER_WGS84[1] + Math.sin(angle) * 0.12
                return Cesium.Cartesian3.fromDegrees(lon, lat, 4200, Cesium.Ellipsoid.WGS84, result)
            }, false),
            point: {
                pixelSize: 8,
                color: Cesium.Color.fromCssColorString('#ffbe4d'),
                outlineColor: Cesium.Color.fromCssColorString('#5b2e00'),
                outlineWidth: 2,
                disableDepthTestDistance: Number.POSITIVE_INFINITY
            }
        })
    }

    viewer.scene.globe.depthTestAgainstTerrain = true
    viewer.scene.globe.enableLighting = true
    viewer.scene.highDynamicRange = true
    viewer.scene.fxaa = true
    viewer.scene.postProcessStages.fxaa.enabled = true
    viewer.scene.skyAtmosphere.show = true
    viewer.scene.fog.enabled = true
    viewer.clock.shouldAnimate = true
    viewer.clock.multiplier = 1

    viewer.camera.flyTo({

        destination: Cesium.Cartesian3.fromDegrees(CENTER_WGS84[0], CENTER_WGS84[1] - 0.22, 42000),

        orientation: { heading: Cesium.Math.toRadians(0), pitch: Cesium.Math.toRadians(-60), roll: Cesium.Math.toRadians(0) }

    })

    return viewer

}

function initThree(viewer) {

    const canvas = viewer.scene.canvas

    // 使用 Cesium 的同一个 WebGL context，实现真实深度共享。
    const gl = viewer.scene.context._gl

    const scene = new THREE.Scene()

    const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 1, 100000000)

    const renderer = new THREE.WebGLRenderer({ canvas, context: gl, alpha: true, antialias: true })
    renderer.autoClear = false
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05
    renderer.setPixelRatio(window.devicePixelRatio)
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)

    const clock = new THREE.Clock()

    const raycaster = new THREE.Raycaster()
    const pointerNdc = new THREE.Vector2()
    const pickHandler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas)
    const scratchThreeCartesian = new Cesium.Cartesian3()
    const pickState = {
        activeThree: null,
        activeCesium: null,
        previousCesiumColor: null,
        previousCesiumPixelSize: null
    }

    const worldRoot = new THREE.Group()
    placeObjectOnEarth(worldRoot, CENTER_WGS84[0], CENTER_WGS84[1], 3200, TERRAIN_FOLLOW.scale)
    scene.add(worldRoot)

    startTerrainFollow(viewer, worldRoot, CENTER_WGS84[0], CENTER_WGS84[1], TERRAIN_FOLLOW)

    loadFusionModel(worldRoot)

    const box = new THREE.Mesh(new THREE.BoxGeometry(4, 4, 4), new THREE.MeshStandardMaterial({
        color: 0x66ccff,
        emissive: 0x0f3d55,
        emissiveIntensity: 0.9,
        metalness: 0.2,
        roughness: 0.35
    }))
    box.userData.label = 'three-box-1'
    box.userData.pickable = true
    box.position.y = 2

    worldRoot.add(box)

    const box2 = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 8), new THREE.MeshStandardMaterial({
        color: 0xff4040,
        emissive: 0x801010,
        emissiveIntensity: 1.1,
        metalness: 0.1,
        roughness: 0.4
    }))
    box2.userData.label = 'three-box-2'
    box2.userData.pickable = true
    box2.position.y = 1

    box2.position.x += 6

    worldRoot.add(box2)

    const scanRing = createScanRing(FUSION_CONFIG.ring.radius)
    scanRing.rotation.x = Math.PI / 2
    scanRing.position.y = 0.15
    worldRoot.add(scanRing)

    const lineA = createFlowLine([
        new THREE.Vector3(-14, 0, -4),
        new THREE.Vector3(-7, 7, 2),
        new THREE.Vector3(3, 4, 0),
        new THREE.Vector3(12, 0, 5)
    ], '#5bd6ff', FUSION_CONFIG.fly.radius)
    lineA.userData.label = 'fusion-flow-a'
    lineA.userData.pickable = true
    worldRoot.add(lineA)

    const lineB = createFlowLine([
        new THREE.Vector3(10, 0, -8),
        new THREE.Vector3(4, 5, -2),
        new THREE.Vector3(-4, 5, 4),
        new THREE.Vector3(-11, 0, 9)
    ], '#ffb66e', FUSION_CONFIG.fly.radius * 0.85)
    lineB.userData.label = 'fusion-flow-b'
    lineB.userData.pickable = true
    worldRoot.add(lineB)

    scene.fog = new THREE.Fog(0x112233, 90000, 360000)

    const keyLight = new THREE.DirectionalLight(0xa8d8ff, 1.2)
    keyLight.position.set(1, 2, 1)
    scene.add(keyLight)

    const fillLight = new THREE.AmbientLight(0x7aa4d6, 0.55)
    scene.add(fillLight)

    pickHandler.setInputAction((movement) => {

        const position = movement.position

        const threePick = pickThreeObject(position, renderer, camera, scene, raycaster, pointerNdc)

        const cesiumPick = viewer.scene.pick(position)

        const winner = resolveUnifiedPick(position, threePick, cesiumPick, viewer, scratchThreeCartesian)

        if (winner === 'three' && threePick) {
            setThreeHighlight(threePick.object, pickState)
            setCesiumHighlight(null, pickState)
        } else if (winner === 'cesium') {
            setThreeHighlight(null, pickState)
            setCesiumHighlight(resolvePickedCesiumEntity(cesiumPick), pickState)
        } else {
            setThreeHighlight(null, pickState)
            setCesiumHighlight(null, pickState)
        }

        if (threePick || cesiumPick) {

            const threeName = threePick?.object?.userData?.label || threePick?.object?.name || 'unnamed-three-object'

            const cesiumName = cesiumPick?.id?.id || cesiumPick?.id?.name || cesiumPick?.primitive?.constructor?.name || 'unknown-cesium-target'

            console.log('[UnifiedPick]', {
                three: threePick ? threeName : null,
                cesium: cesiumPick ? cesiumName : null,
                winner
            })

        }

    }, Cesium.ScreenSpaceEventType.LEFT_CLICK)

    viewer.scene.postRender.addEventListener(() => {

        const elapsed = getFusionTimeSeconds(viewer, clock)

        animateFusion(elapsed, box, box2, scanRing, [lineA, lineB])

        syncCesiumThree(camera, viewer)

        // Cesium 渲染完成后，直接在同一缓冲上绘制 Three。
        renderer.resetState()
        renderer.render(scene, camera)

    })

    function render() {

        viewer.render()

        requestAnimationFrame(render)

    }

    window.onresize = () => {

        viewer.resize()

        renderer.setPixelRatio(window.devicePixelRatio)

        renderer.setSize(canvas.clientWidth, canvas.clientHeight, false)

        camera.aspect = canvas.clientWidth / canvas.clientHeight

        camera.updateProjectionMatrix()

    }

    render()

}

function loadFusionModel(worldRoot) {

    const dracoLoader = new DRACOLoader().setDecoderPath(FILE_HOST + 'js/three/draco/')

    new GLTFLoader()
        .setDRACOLoader(dracoLoader)
        .load(
            'https://z2586300277.github.io/3d-file-server/' + 'files/model/LittlestTokyo.glb',
            (gltf) => {

                const model = gltf.scene

                // 控制尺寸与高度，避免模型被地形遮挡或过大。
                model.scale.setScalar(0.015)
                model.position.set(0, 0, 0)
                model.rotation.y = Math.PI * 0.35

                // 自动把模型底面放到本地 y=0，实现贴地。
                model.updateMatrixWorld(true)
                const bounds = new THREE.Box3().setFromObject(model)
                if (Number.isFinite(bounds.min.y)) {
                    model.position.y -= bounds.min.y
                }

                model.traverse((obj) => {
                    if (!obj.isMesh) return
                    obj.userData.pickable = true
                    obj.userData.label = obj.userData.label || obj.name || 'littlest-tokyo'
                    obj.castShadow = false
                    obj.receiveShadow = false
                })

                worldRoot.add(model)

            },
            undefined,
            (error) => {
                console.error('[LittlestTokyoLoadError]', error)
            }
        )

}

function startTerrainFollow(viewer, object3D, lon, lat, options) {

    let syncing = false
    let lastSync = 0

    const sync = async () => {

        if (syncing) return
        syncing = true

        try {
            const samples = [Cesium.Cartographic.fromDegrees(lon, lat)]
            const [cartographic] = await Cesium.sampleTerrainMostDetailed(viewer.terrainProvider, samples)
            const terrainHeight = Number.isFinite(cartographic?.height) ? cartographic.height : 0
            placeObjectOnEarth(object3D, lon, lat, terrainHeight + options.offset, options.scale)
        } catch (error) {
            // 采样失败时保持当前高度，不中断渲染。
            console.warn('[TerrainFollowWarn]', error)
        } finally {
            syncing = false
        }

    }

    sync()

    viewer.scene.postRender.addEventListener(() => {
        const now = Date.now()
        if (now - lastSync < options.intervalMs) return
        lastSync = now
        sync()
    })

}

function createScanRing(radius) {

    const geometry = new THREE.RingGeometry(radius * 0.6, radius, 96)

    const material = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
            uTime: { value: 0 },
            uColor: { value: new THREE.Color('#3fd2ff') }
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            varying vec2 vUv;
            uniform float uTime;
            uniform vec3 uColor;

            void main() {
                vec2 p = vUv - 0.5;
                float d = length(p) * 2.0;
                float wave = abs(sin((d - uTime * ${FUSION_CONFIG.ring.speed.toFixed(1)}) * 18.0));
                float edge = smoothstep(1.0, 0.2, d);
                float alpha = edge * (0.22 + wave * 0.45);
                gl_FragColor = vec4(uColor, alpha);
            }
        `
    })

    return new THREE.Mesh(geometry, material)

}

function createFlowLine(points, color, radius) {

    const curve = new THREE.CatmullRomCurve3(points)
    const geometry = new THREE.TubeGeometry(curve, 140, radius, 12, false)

    const material = new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
            uTime: { value: 0 },
            uSpeed: { value: FUSION_CONFIG.fly.speed },
            uColor: { value: new THREE.Color(color) }
        },
        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
        fragmentShader: `
            varying vec2 vUv;
            uniform float uTime;
            uniform float uSpeed;
            uniform vec3 uColor;

            void main() {
                float head = fract(uTime * uSpeed);
                float distA = abs(vUv.x - head);
                float distB = 1.0 - distA;
                float dist = min(distA, distB);
                float tail = smoothstep(0.26, 0.0, dist);
                float body = 0.12;
                float alpha = max(body, tail) * 0.92;
                gl_FragColor = vec4(uColor, alpha);
            }
        `
    })

    return new THREE.Mesh(geometry, material)

}

function animateFusion(elapsed, box, box2, scanRing, flowLines) {

    box.rotation.y = elapsed * FUSION_CONFIG.rotate
    box2.rotation.z = elapsed * (FUSION_CONFIG.rotate * 1.35)

    const pulse = (Math.sin(elapsed * FUSION_CONFIG.pulse.speed) + 1) * 0.5
    const emissive = THREE.MathUtils.lerp(FUSION_CONFIG.pulse.min, FUSION_CONFIG.pulse.max, pulse)

    if (box.material?.emissiveIntensity !== undefined) box.material.emissiveIntensity = emissive
    if (box2.material?.emissiveIntensity !== undefined) box2.material.emissiveIntensity = emissive * 1.1

    scanRing.scale.setScalar(0.9 + pulse * 0.25)
    scanRing.material.uniforms.uTime.value = elapsed

    flowLines.forEach((line, i) => {
        line.material.uniforms.uTime.value = elapsed + i * 0.8
    })

}

function pickThreeObject(position, renderer, camera, scene, raycaster, pointerNdc) {

    const width = renderer.domElement.clientWidth
    const height = renderer.domElement.clientHeight

    pointerNdc.x = position.x / width * 2 - 1
    pointerNdc.y = -(position.y / height) * 2 + 1

    raycaster.setFromCamera(pointerNdc, camera)

    const intersections = raycaster.intersectObjects(scene.children, true)

    return intersections.find(item => item.object.userData.pickable)

}

function resolveUnifiedPick(position, threePick, cesiumPick, viewer, scratchThreeCartesian) {

    if (!threePick && !cesiumPick) return null
    if (threePick && !cesiumPick) return 'three'
    if (!threePick && cesiumPick) return 'cesium'

    const cameraPos = viewer.camera.positionWC

    scratchThreeCartesian.x = threePick.point.x
    scratchThreeCartesian.y = threePick.point.y
    scratchThreeCartesian.z = threePick.point.z

    const threeDistance = Cesium.Cartesian3.distance(cameraPos, scratchThreeCartesian)

    let cesiumDistance = Number.POSITIVE_INFINITY

    if (viewer.scene.pickPositionSupported) {

        const pickedPosition = viewer.scene.pickPosition(position)

        if (Cesium.defined(pickedPosition)) {

            cesiumDistance = Cesium.Cartesian3.distance(cameraPos, pickedPosition)

        }

    }

    return threeDistance <= cesiumDistance ? 'three' : 'cesium'

}

function resolvePickedCesiumEntity(cesiumPick) {

    if (!cesiumPick?.id) return null
    if (!cesiumPick.id.point) return null

    return cesiumPick.id

}

function setThreeHighlight(object, state) {

    if (state.activeThree?.userData.baseScale) {
        state.activeThree.scale.copy(state.activeThree.userData.baseScale)
    }

    state.activeThree = null

    if (!object) return

    if (!object.userData.baseScale) object.userData.baseScale = object.scale.clone()

    object.scale.copy(object.userData.baseScale).multiplyScalar(1.15)
    state.activeThree = object

}

function setCesiumHighlight(entity, state) {

    if (state.activeCesium?.point && state.previousCesiumColor && state.previousCesiumPixelSize !== null) {
        state.activeCesium.point.color = new Cesium.ConstantProperty(state.previousCesiumColor)
        state.activeCesium.point.pixelSize = new Cesium.ConstantProperty(state.previousCesiumPixelSize)
    }

    state.activeCesium = null
    state.previousCesiumColor = null
    state.previousCesiumPixelSize = null

    if (!entity?.point) return

    const previousColor = entity.point.color?.getValue(Cesium.JulianDate.now()) || Cesium.Color.WHITE
    const previousSize = entity.point.pixelSize?.getValue(Cesium.JulianDate.now()) || 8

    state.previousCesiumColor = Cesium.Color.clone(previousColor)
    state.previousCesiumPixelSize = previousSize
    state.activeCesium = entity

    entity.point.color = new Cesium.ConstantProperty(Cesium.Color.fromCssColorString('#fff173'))
    entity.point.pixelSize = new Cesium.ConstantProperty(previousSize + 4)

}

function getFusionTimeSeconds(viewer, fallbackClock) {

    const now = viewer.clock.currentTime
    const start = viewer.clock.startTime
    const seconds = Cesium.JulianDate.secondsDifference(now, start)

    if (Number.isFinite(seconds) && seconds >= 0) return seconds

    return fallbackClock.getElapsedTime()

}

function placeObjectOnEarth(object3D, lon, lat, height = 0, scale = 1) {

    const origin = Cesium.Cartesian3.fromDegrees(lon, lat, height)
    const enuMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(origin)
    const scaleMatrix = Cesium.Matrix4.fromUniformScale(scale)
    const orientedMatrix = Cesium.Matrix4.multiply(enuMatrix, Y_UP_TO_Z_UP, new Cesium.Matrix4())
    const worldMatrix = Cesium.Matrix4.multiply(orientedMatrix, scaleMatrix, new Cesium.Matrix4())

    object3D.matrixAutoUpdate = false
    object3D.matrix.set(
        worldMatrix[0], worldMatrix[4], worldMatrix[8], worldMatrix[12],
        worldMatrix[1], worldMatrix[5], worldMatrix[9], worldMatrix[13],
        worldMatrix[2], worldMatrix[6], worldMatrix[10], worldMatrix[14],
        worldMatrix[3], worldMatrix[7], worldMatrix[11], worldMatrix[15]
    )

}

/* 相机同步 */
function syncCesiumThree(camera, viewer) {

    // 更新相机位置
    camera.fov = Cesium.Math.toDegrees(viewer.camera.frustum.fovy)

    // 更新相机
    camera.matrixAutoUpdate = false

    // 相机视图矩阵
    const cvm = viewer.camera.viewMatrix

    // 相机逆视图矩阵
    const civm = viewer.camera.inverseViewMatrix

    camera.matrixWorld.set(
        civm[0], civm[4], civm[8], civm[12],
        civm[1], civm[5], civm[9], civm[13],
        civm[2], civm[6], civm[10], civm[14],
        civm[3], civm[7], civm[11], civm[15]
    )

    camera.matrixWorldInverse.set(
        cvm[0], cvm[4], cvm[8], cvm[12],
        cvm[1], cvm[5], cvm[9], cvm[13],
        cvm[2], cvm[6], cvm[10], cvm[14],
        cvm[3], cvm[7], cvm[11], cvm[15]
    )

    camera.updateProjectionMatrix()

}
