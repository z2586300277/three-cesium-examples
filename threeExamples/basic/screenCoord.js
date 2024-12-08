import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const DOM = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, DOM.clientWidth / DOM.clientHeight, 0.1, 1000)

camera.position.set(10, 10, 10)

const renderer = new THREE.WebGLRenderer()

renderer.setSize(DOM.clientWidth, DOM.clientHeight)

DOM.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

controls.enableDamping = true

scene.add(new THREE.AxesHelper(50))

const R = () => Math.random() * 10 - 5

const list = []

for (let i = 0; i < 30; i++) {

    const div = createDom('D' + i)

    const mesh = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.3), new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff }))

    mesh.position.set(R(), R(), R())

    scene.add(mesh)

    mesh.div = div

    list.push(mesh)

}

function updateCSS2DVisibility() {

    list.forEach(mesh => {

        const worldPosition = mesh.getWorldPosition(new THREE.Vector3())

        worldPosition.project(camera);

        const width = renderer.domElement.clientWidth

        const height = renderer.domElement.clientHeight

        const screenX = (worldPosition.x + 1) / 2 * width

        const screenY = (-worldPosition.y + 1) / 2 * height

        mesh.div.style.left = screenX + 'px'

        mesh.div.style.top = screenY + 'px'
      
    })

}

animate()

function animate() {

    requestAnimationFrame(animate)

    updateCSS2DVisibility()

    controls.update()

    renderer.render(scene, camera)

}

window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)

    camera.aspect = box.clientWidth / box.clientHeight

    camera.updateProjectionMatrix()

}

// 创建dom
function createDom(text) {

    const div = document.createElement('div')

    div.style.position = 'absolute'

    const img = document.createElement('img')

    img.src = HOST + '/files/author/KallkaGo.jpg'

    img.style.width = '50px'

    img.style.height = '50px'

    div.appendChild(img)

    div.innerHTML += text

    div.style.color = 'white'

    document.body.appendChild(div)

    return div

}

