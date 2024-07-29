import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000000)

camera.position.set(50, 50, 50)

const renderer = new THREE.WebGLRenderer()

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

animate()

function animate() {

    requestAnimationFrame(animate)

    renderer.render(scene, camera)

}

window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)

    camera.aspect = box.clientWidth / box.clientHeight

    camera.updateProjectionMatrix()

}

scene.add(new THREE.AxesHelper(1000))

// 地图
const group = new THREE.Group()

const geoJson = await fetch('https://z2586300277.github.io/three-editor/dist/files/font/guangdong.json').then(res => res.json())

geoJson.features.forEach((i) => {

    if (i.geometry.type === 'MultiPolygon') i.geometry.coordinates.forEach((j) => j.forEach((z) => createShapeWithCoord(z, group, i)))

    else if (i.geometry.type === 'Polygon') i.geometry.coordinates.forEach((j) => createShapeWithCoord(j, group, i))

})

translationOriginForGroup(group) // 设置中心点

scene.add(group)

/* 设置根据坐标形状 */
function createShapeWithCoord(coordinates, group, info = null) {

    const curvePoints = coordinates.map((k) => coordToVector2(k))

    const path = new THREE.Path(curvePoints)

    const shape = new THREE.Shape()

    shape.path = path

    shape.curves.push(path)

    const parameters = {

        bevelEnabled: false,

        bevelThickness: 0,

        bevelSize: 0,

        bevelOffset: 0,

        depth: 2,

        bevelEnabled: false

    }

    const geometry = new THREE.ExtrudeGeometry(shape, parameters)

    const material = new THREE.MeshBasicMaterial({ color: 0xffffff * Math.random(), transparent: true })

    const mesh = new THREE.Mesh(geometry, material)

    // 重新定义中心
    const boundingBox = new THREE.Box3().setFromObject(mesh)

    boundingBox.getCenter(mesh.position)

    mesh.geometry.center()

    mesh.info = info

    group.attach(mesh)

}

// 经纬度投影转换  我这里边手写了一个投影转换的方法 还可以使用  d3 或者 proj4 这两个库进行转换
function coordToVector2(coord, slace = 10000) {

    const [lng, lat] = coord

    const x = lng * 20037508.34 / 180

    let y = Math.log(Math.tan((90 + lat) * Math.PI / 360)) / (Math.PI / 180)

    y = y * 20037508.34 / 180

    return new THREE.Vector2(x / slace, y / slace)

}

// 设置组中心点
function translationOriginForGroup(group) {

    // 计算模型的包围盒
    const boundingBox = new THREE.Box3().setFromObject(group)

    // 计算模型的中心点
    boundingBox.getCenter(group.position)

    // 变换子模型位置
    group.traverse((c) => {

        c.isMesh && c.position.sub(group.position)

        c.initTranslate = c.position.clone()

    })

    // 重置模型位置
    group.position.set(0, 0, 0)

}