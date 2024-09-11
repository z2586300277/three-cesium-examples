import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const box = document.getElementById('box')
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000)
camera.position.set(0, 10, 10)
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(box.clientWidth, box.clientHeight)
box.appendChild(renderer.domElement)
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.dampingFactor = 0.25

window.onresize = () => {
    renderer.setSize(box.clientWidth, box.clientHeight)
    camera.aspect = box.clientWidth / box.clientHeight
    camera.updateProjectionMatrix()
}

const curve = new THREE.LineCurve3(new THREE.Vector3(), new THREE.Vector3().setY(3))
const geometry = new THREE.TubeGeometry(curve, 20, 5, 300, false);

geometry.computeBoundingBox()
const { max, min } = geometry.boundingBox

// 创建材质
const material = new THREE.ShaderMaterial({
    transparent: true,
    side: THREE.DoubleSide,
    uniforms: {
        uMax: { value: max },
        uMin: { value: min },
        uColor: { value: new THREE.Color('#409eff') }
    },
    vertexShader: `
      varying vec4 vPosition;
      void main() {
        vPosition = modelMatrix * vec4(position,1.0);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uColor; // 半径        
      uniform vec3 uMax; 
      uniform vec3 uMin;
      uniform mat4 modelMatrix; // 世界矩阵
      varying vec4 vPosition; // 接收顶点着色传递进来的位置数据
      void main() {
        vec4 uMax_world = modelMatrix * vec4(uMax,1.0);
        vec4 uMin_world = modelMatrix * vec4(uMin,1.0);
        float opacity =1.0 - (vPosition.y - uMin_world.y) / (uMax_world.y -uMin_world.y); 
        gl_FragColor = vec4( uColor, opacity);
      }
    `
})

const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

let time = 0
animate()

function animate() {
    if (time >= 1) time = 0
    else {
        time += 0.01
        mesh.scale.set(time, 1, time)
    }

    requestAnimationFrame(animate)
    controls.update()
    renderer.render(scene, camera)
}