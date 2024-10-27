import {
  Color,
  CylinderGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  WebGLRenderer
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const size = { width: window.innerWidth, height: window.innerHeight }
const scene = new Scene()
scene.background = new Color('#070630')

const camera = new PerspectiveCamera(45, size.width / size.height, 0.1, 1000)
camera.position.set(30, 30, 30)

const renderer = new WebGLRenderer({ antialias: true })
renderer.setSize(size.width, size.height)
renderer.setPixelRatio(window.devicePixelRatio)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

class DeskLamp extends Group {
  constructor() {
    super()
    this.#createWick()
    this.#createLampshade()
  }

  /**灯芯*/
  #createWick() {
    const geometry = new SphereGeometry(1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2)
    const material = new MeshBasicMaterial({ color: 0xffffff })
    const sphere = new Mesh(geometry, material)
    sphere.position.set(0, 3, 0)
    this.#createLight(sphere)
    this.add(sphere)
  }

  /**灯罩*/
  #createLampshade() {
    const cylinderGeometry = new CylinderGeometry(1, 5, 3, 32)
    const cylinderMaterial = new ShaderMaterial({
      transparent: true,
      uniforms: {
        color: { value: new Color('#CB00E3') }
      },
      vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
      fragmentShader: `
      uniform vec3 color;
      varying vec2 vUv;
      void main() {
        gl_FragColor = vec4(color, vUv.y);
      }
    `
    })
    const cylinder = new Mesh(cylinderGeometry, cylinderMaterial)
    cylinder.position.set(0, 1.7, 0)
    this.add(cylinder)
  }

  /**点光源*/
  #createLight(mesh) {
    const pointLight = new PointLight(0xffffff, 1, 100)
    pointLight.power = 1000
    mesh.add(pointLight)
  }
}

const light1 = new DeskLamp()
light1.position.set(0, 10, 0)
scene.add(light1)

const light2 = new DeskLamp()
light2.position.set(10, 10, 0)
scene.add(light2)

const light3 = new DeskLamp()
light3.position.set(0, 10, 10)
scene.add(light3)

/**
 * 创建地面
 * */
const planeGeometry = new PlaneGeometry(100, 100)
const planeMaterial = new MeshStandardMaterial({
  color: 0x999999,
  side: 2
})
const plane = new Mesh(planeGeometry, planeMaterial)
plane.rotation.x = -Math.PI / 2
scene.add(plane)

animate()
function animate() {

  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}
