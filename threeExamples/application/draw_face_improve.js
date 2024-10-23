import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(0, 3, 3)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

controls.enableDamping = true

const directionalLight = new THREE.DirectionalLight(0xffffff, 1)

directionalLight.position.set(0, 20, 0)

scene.add(directionalLight, new THREE.AmbientLight(0xffffff, 1))

/* 增加一个面 */
const plane = new THREE.PlaneGeometry(5, 5)

const material = new THREE.MeshStandardMaterial({ color: 0xffffff })

const planeMesh = new THREE.Mesh(plane, material)

planeMesh.rotation.x -= Math.PI / 2

scene.add(planeMesh)

animate()

function animate() {

  requestAnimationFrame(animate)

  controls.update()

  renderer.render(scene, camera)

}

window.onresize = () => {

  renderer.setSize(box.clientWidth, box.clientHeight)

  camera.aspect = box.clientWidth / box.clientHeight

  camera.updateProjectionMatrix()

}

// 事件
const raycaster = new THREE.Raycaster()

const getPoint = event => {

  const mouse = new THREE.Vector2(

    (event.offsetX / event.target.clientWidth) * 2 - 1,

    -(event.offsetY / event.target.clientHeight) * 2 + 1

  )

  raycaster.setFromCamera(mouse, camera)

  const intersects = raycaster.intersectObjects(scene.children)

  if (intersects.length > 0) return intersects[0].point

}

const setPointBox = point => {

  const box = new THREE.BoxGeometry(0.04, 0.04, 0.04)

  const material = new THREE.MeshStandardMaterial({ color: 0xff0000 })

  const boxMesh = new THREE.Mesh(box, material)

  boxMesh.position.copy(point)

  scene.add(boxMesh)

}

/* 开始绘制 */
const pointList = []; let drawMesh = null; let stop = false

box.addEventListener('contextmenu', () => {

  stop = true

  // const { indexGroup, faceGroup, uvGroup } = multShapeGroup(pointList)

  // if (drawMesh) updateMultShapePlaneGeometry(drawMesh.geometry, faceGroup, indexGroup, uvGroup)

})

// 移动
box.addEventListener('mousemove', (event) => {

  if (stop) return

  const point = getPoint(event)
    
  if (!point || !drawMesh || pointList.length < 2) return


    // update_shape(pointList)

})

box.addEventListener('click', (event) => {

  const point = getPoint(event)

  if (!point || stop) return

  setPointBox(point)

  point.y += 0.001

  pointList.push(point)
  if (pointList.length < 4) return

  if (!drawMesh) {
    draw_shape_v2(pointList)
  }else{
    update_shape(pointList)
  }
})

// 此方法也可使用
const draw_shape = (pointList)=>{
    let v2_p = []
    pointList.map(item=>{
        v2_p.push(new THREE.Vector2(item.x,item.z))
    })
    const shape = new THREE.Shape(v2_p)
    const geometry = new THREE.ShapeGeometry(shape);
    const positions = geometry.getAttribute('position')
    for (let i = 0; i < positions.count; i++) {
        let y = positions.array[i*3+1]
        positions.array[i*3+1] = positions.array[i*3+2] + 0.01
        positions.array[i*3+2] = y
    }
    geometry.attributes.position.needsUpdate = true
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide });
     drawMesh = new THREE.Mesh(geometry, material);
    scene.add(drawMesh);
}


const draw_shape_v2 = (pointList)=>{
    let v2_p = []
    const shape = new THREE.Shape()
    shape.autoClose = true
    pointList.map(item=>{
        v2_p.push(new THREE.Vector2(item.x,item.z))
        
    })
    shape.moveTo(v2_p[0].x,v2_p[0].y)
    
    v2_p.map((item,index)=>{
        if (index>0) {
            shape.lineTo(item.x,item.y)
        }
    })
    
    const geometry = new THREE.ShapeGeometry(shape);
    const positions = geometry.getAttribute('position')
    console.log(positions);
    
    for (let i = 0; i < positions.count; i++) {
        let y = positions.array[i*3+1]
        positions.array[i*3+1] = positions.array[i*3+2] + 0.01
        positions.array[i*3+2] = y
    }
    geometry.attributes.position.needsUpdate = true
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide });
     drawMesh = new THREE.Mesh(geometry, material);
    scene.add(drawMesh);
}

const update_shape = (pointList)=>{
    drawMesh.geometry.dispose()
    drawMesh.material = null
    scene.remove(drawMesh)
    draw_shape_v2(pointList)
}
