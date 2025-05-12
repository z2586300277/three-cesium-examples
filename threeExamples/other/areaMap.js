import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js'
import gsap from 'gsap'

const PAEAMS = { DEPTH: 6, coordsMaxCounts: 500 }
const fetchJson = (url) => fetch(url).then((res) => res.json())

export async function setScene(DOM) {

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, DOM.clientWidth / DOM.clientHeight, 0.1, 100000000)
    camera.position.set(0, 600, 200)
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })
    renderer.setSize(DOM.clientWidth, DOM.clientHeight)
    DOM.appendChild(renderer.domElement)
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    const light = new THREE.DirectionalLight(0xffffff, 1)
    light.position.set(100, 100, 100)
    scene.add(new THREE.AmbientLight(0xffffff, 1.5), light)
    const css2DRender = new CSS2DRenderer()
    css2DRender.setSize(DOM.clientWidth, DOM.clientHeight)
    css2DRender.domElement.style.zIndex = 0
    css2DRender.domElement.style.position = 'relative'
    css2DRender.domElement.style.top = -DOM.clientHeight + 'px'
    css2DRender.domElement.style.height = DOM.clientHeight + 'px'
    css2DRender.domElement.style.width = DOM.clientWidth + 'px'
    css2DRender.domElement.style.pointerEvents = 'none'
    DOM.appendChild(css2DRender.domElement)
    animate()
    function animate() {
        controls.update()
        css2DRender.render(scene, camera)
        requestAnimationFrame(animate)
        renderer.render(scene, camera)
    }

    // 根级 
    const rootGeoJson = await fetchJson('https://z2586300277.github.io/3d-file-server/files/json/china.json')
    const rootGroup = createGeo(rootGeoJson)
    rootGroup.rotation.x = -Math.PI / 2
    rootGroup.position.sub(new THREE.Box3().setFromObject(rootGroup).getCenter(new THREE.Vector3())) // 平移到原点
    scene.add(rootGroup)
    clickEvent(camera, controls, DOM, rootGroup) // 点击事件

}

// 点击事件
function clickEvent(camera, controls, DOM, rootGroup) {

    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()
    const getLavelObj = (obj) => {
        if (obj.info) return obj
        if (obj.parent) return getLavelObj(obj.parent)
    }
    DOM.addEventListener('dblclick', async (e) => {

        mouse.x = (e.clientX / DOM.clientWidth) * 2 - 1
        mouse.y = -(e.clientY / DOM.clientHeight) * 2 + 1
        raycaster.setFromCamera(mouse, camera)
        const intersects = raycaster.intersectObjects(rootGroup.children, true)
        if (intersects.length > 0) {

            const item = getLavelObj(intersects[0].object)
            const info = item.info
            const json = await fetchJson(`https://z2586300277.github.io/3d-file-server/geojson/${info.properties.adcode}.json`)
            if (!json.features.length) return
            item.label.visible = false // 隐藏文字

            // 子级组
            const child_geo = createGeo(json)
            gsap.to(child_geo.position, { z: PAEAMS.DEPTH, duration: 1.5, ease: 'power2.out' })
            item.child_geo = child_geo
            item.add(child_geo)
        }
    })
}

// 创建地图
const texture = new THREE.TextureLoader().load('https://z2586300277.github.io/three-editor/dist/files/channels/texture.png')
texture.wrapT = THREE.RepeatWrapping
texture.repeat.y = 0.1
function animateTexture() {
    texture.offset.y += 0.03
    requestAnimationFrame(animateTexture)
}
animateTexture()

function createGeo(geoJson) {

    const group = new THREE.Group()
    group.info = geoJson

    // 材质
    const materials = [
        new THREE.MeshStandardMaterial({ color: Math.random() * 0xffffff, transparent: true, metalness: 0.5, roughness: 0.5 }),
        new THREE.MeshBasicMaterial({ map: texture, color: 0xffffff * Math.random() }),
    ]

    // 遍历添加各个地块
    geoJson.features.forEach((info) => {

        // 省会/中心坐标转换
        if (info?.properties.center) info.properties.centerCoord3 = coordToVector(info.properties.center, 3)
        if (info?.properties?.centroid) info.properties.centroidCoord3 = coordToVector(info.properties.centroid, 3)

        // 行政区块组
        const areaGroup = new THREE.Group()
        areaGroup.info = info
        areaGroup.name = info.properties?.name
        group.add(areaGroup)

        if (info.geometry.type === 'MultiPolygon') info.geometry.coordinates.forEach((j) => j.forEach((z) => areaGroup.add(createShapeWithCoord(z, materials))))
        else if (info.geometry.type === 'Polygon') info.geometry.coordinates.forEach((j) => areaGroup.add(createShapeWithCoord(j, materials)))

        const div = document.createElement('div')
        div.innerHTML = info.properties?.name
        div.style.color = '#dbdbdb'
        div.style.fontSize = '10px'
        const css = new CSS2DObject(div)

        // 判断位置
        if (info?.properties?.centroidCoord3 || info?.properties?.centerCoord3) css.position.copy(info?.properties?.centroidCoord3 || info?.properties?.centerCoord3)
        else {
            const box = new THREE.Box3().setFromObject(areaGroup)
            const center = box.getCenter(new THREE.Vector3())
            css.position.copy(center)
        }

        css.position.z += PAEAMS.DEPTH || 2
        areaGroup.label = css
        areaGroup.attach(css)

    })

    return group
}

// 坐标转换
function coordToVector(coord, type = 2, slace = 10000) {
    const [lng, lat] = coord
    const x = lng * 20037508.34 / 180
    let y = Math.log(Math.tan((90 + lat) * Math.PI / 360)) / (Math.PI / 180)
    y = y * 20037508.34 / 180
    return type === 2 ? new THREE.Vector2(x / slace, y / slace) : new THREE.Vector3(x / slace, y / slace, 0)
}


function createShapeWithCoord(coordinates, materials) {

    while (coordinates.length > PAEAMS.coordsMaxCounts) coordinates = coordinates.filter((_, i) => i % 2 === 0)

    // 参数
    const path = new THREE.Path(coordinates.map((k) => coordToVector(k)))
    const parameters = { bevelThickness: 0, bevelSize: 0, bevelOffset: 0, depth: PAEAMS.DEPTH || 2, bevelEnabled: true }

    // 边缘
    // const emptyShape = new THREE.Shape()
    // emptyShape.holes.push(path)
    // const emptyGeometry = new THREE.ExtrudeGeometry(emptyShape, { depth: 0.0001, bevelEnabled: false })
    // const emptyMaterial = new THREE.MeshBasicMaterial({ color: 0xbbbaba, transparent: true, opacity: 1, wireframe: true })
    // const emptyMesh = new THREE.Mesh(emptyGeometry, emptyMaterial)
    const emptyGeometry = new THREE.BufferGeometry().setFromPoints(path.getPoints(1000))
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        linewidth: 2,
        transparent: true,
        depthTest: false,
    });
    const emptyMesh = new THREE.Line(emptyGeometry, lineMaterial);
    emptyMesh.position.z += parameters.depth + 0.01

    // 地块
    const shape = new THREE.Shape()
    shape.curves.push(path)
    const geometry = new THREE.ExtrudeGeometry(shape, parameters)

    const mesh = new THREE.Mesh(geometry, materials)
    mesh.add(emptyMesh)

    return mesh

}



