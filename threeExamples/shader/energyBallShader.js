import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const box = document.getElementById('box')
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 1000)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })
renderer.setSize(box.clientWidth, box.clientHeight)
box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

// 创建城市建筑物
const createBuildings = () => {
  const buildings = new THREE.Group()
  const buildingCount = 50
  
  for(let i = 0; i < buildingCount; i++) {
    const height = Math.random() * 5 + 1
    const geometry = new THREE.BoxGeometry(1, height, 1)
    const material = new THREE.MeshPhongMaterial({ color: Math.random() * 0xffffff })
    
    const building = new THREE.Mesh(geometry, material)
    building.position.set((Math.random() - 0.5) * 20, height / 2, (Math.random() - 0.5) * 20)
    buildings.add(building)
  }
  
  scene.add(buildings)
}

// 创建能量球着色器
const energyBallShader = new THREE.ShaderMaterial({
  uniforms: { time: { value: 0.0 }, color: { value: new THREE.Color(1.0, 0.5, 0.0) } },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform float time;
    uniform vec3 color;
    varying vec2 vUv;
    void main() {
      vec2 center = vec2(0.5, 0.5);
      float dist = length(vUv - center);
      float pulse = sin(time * 2.0) * 0.5 + 0.5;
      float alpha = smoothstep(0.5, 0.0, dist) * pulse;
      vec3 finalColor = mix(color, vec3(1.0), 1.0 - dist);
      gl_FragColor = vec4(finalColor, alpha);
    }
  `,
  transparent: true,
  side: THREE.DoubleSide
})

// 创建能量球
const energyBall = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), energyBallShader)
energyBall.rotation.x = -Math.PI / 2
energyBall.position.y = 0.1
scene.add(energyBall)

// 添加环境光和点光源
scene.add(new THREE.AmbientLight(0x333333))
const pointLight = new THREE.PointLight(0xff9900, 2, 20)
pointLight.position.set(0, 5, 0)
scene.add(pointLight)

// 创建建筑物
createBuildings()

// 调整相机位置
camera.position.set(0, 5, 5)
camera.lookAt(0, 2, 0)

animate()

function animate() {
  requestAnimationFrame(animate)
  controls.update()
  energyBallShader.uniforms.time.value += 0.016
  renderer.render(scene, camera)
}


