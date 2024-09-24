import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const box = document.getElementById('box')
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000)
camera.position.set(0, 10, 10)
const renderer = new THREE.WebGLRenderer({ antialias: true , alpha: true, logarithmicDepthBuffer: true})
renderer.setSize(box.clientWidth, box.clientHeight)
box.appendChild(renderer.domElement)
new OrbitControls(camera, renderer.domElement)
window.onresize = () => {
    renderer.setSize(box.clientWidth, box.clientHeight)
    camera.aspect = box.clientWidth / box.clientHeight
    camera.updateProjectionMatrix()
}
scene.background = new THREE.CubeTextureLoader().load([0, 1, 2, 3, 4, 5].map(k => (FILE_HOST + 'files/sky/skyBox0/' + (k + 1) + '.png')));

let grass = null
animate()
function animate(time) {
   if(grass) grass.update(time);
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
}

const BLADE_WIDTH = 0.1
const BLADE_HEIGHT = 0.8
const BLADE_HEIGHT_VARIATION = 0.6
const BLADE_VERTEX_COUNT = 5
const BLADE_TIP_OFFSET = 0.1

function interpolate(val, oldMin, oldMax, newMin, newMax) {
  return ((val - oldMin) * (newMax - newMin)) / (oldMax - oldMin) + newMin
}

class GrassGeometry extends THREE.BufferGeometry {
  constructor(size, count) {
    super()

    const positions = []
    const uvs = []
    const indices = []

    for (let i = 0; i < count; i++) {
      const surfaceMin = (size / 2) * -1
      const surfaceMax = size / 2
      const radius = (size / 2) * Math.random()
      const theta = Math.random() * 2 * Math.PI

      const x = radius * Math.cos(theta)
      const y = radius * Math.sin(theta)

      uvs.push(
        ...Array.from({ length: BLADE_VERTEX_COUNT }).flatMap(() => [
          interpolate(x, surfaceMin, surfaceMax, 0, 1),
          interpolate(y, surfaceMin, surfaceMax, 0, 1)
        ])
      )

      const blade = this.computeBlade([x, 0, y], i)
      positions.push(...blade.positions)
      indices.push(...blade.indices)
    }

    this.setAttribute(
      'position',
      new THREE.BufferAttribute(new Float32Array(positions), 3)
    )
    this.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2))
    this.setIndex(indices)
    this.computeVertexNormals()
  }

  // Grass blade generation, covered in https://smythdesign.com/blog/stylized-grass-webgl
  // TODO: reduce vertex count, optimize & possibly move to GPU
  computeBlade(center, index = 0) {
    const height = BLADE_HEIGHT + Math.random() * BLADE_HEIGHT_VARIATION
    const vIndex = index * BLADE_VERTEX_COUNT

    // Randomize blade orientation and tip angle
    const yaw = Math.random() * Math.PI * 2
    const yawVec = [Math.sin(yaw), 0, -Math.cos(yaw)]
    const bend = Math.random() * Math.PI * 2
    const bendVec = [Math.sin(bend), 0, -Math.cos(bend)]

    // Calc bottom, middle, and tip vertices
    const bl = yawVec.map((n, i) => n * (BLADE_WIDTH / 2) * 1 + center[i])
    const br = yawVec.map((n, i) => n * (BLADE_WIDTH / 2) * -1 + center[i])
    const tl = yawVec.map((n, i) => n * (BLADE_WIDTH / 4) * 1 + center[i])
    const tr = yawVec.map((n, i) => n * (BLADE_WIDTH / 4) * -1 + center[i])
    const tc = bendVec.map((n, i) => n * BLADE_TIP_OFFSET + center[i])

    // Attenuate height
    tl[1] += height / 2
    tr[1] += height / 2
    tc[1] += height

    return {
      positions: [...bl, ...br, ...tr, ...tl, ...tc],
      indices: [
        vIndex,
        vIndex + 1,
        vIndex + 2,
        vIndex + 2,
        vIndex + 4,
        vIndex + 3,
        vIndex + 3,
        vIndex,
        vIndex + 2
      ]
    }
  }
}

const cloudTexture = new THREE.TextureLoader().load(FILE_HOST + 'threeExamples/shader/cloud.jpg')
cloudTexture.wrapS = cloudTexture.wrapT = THREE.RepeatWrapping

class Grass extends THREE.Mesh {
  constructor(size, count) {
    const geometry = new GrassGeometry(size, count)
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uCloud: { value: cloudTexture },
        offsetX: { value: 0.5 },
        offsetY: { value: 0.3 },
        uTime: { value: 0 },
      },
      side: THREE.DoubleSide,
      vertexShader:`  uniform float uTime;
      uniform float offsetX;
      uniform float offsetY;
    
      varying vec3 vPosition;
      varying vec2 vUv;
      varying vec3 vNormal;
    
      float wave(float waveSize, float tipDistance, float centerDistance) {
        // Tip is the fifth vertex drawn per blade
        bool isTip = (gl_VertexID + 1) % 5 == 0;
    
        float waveDistance = isTip ? tipDistance : centerDistance;
        return sin((uTime / 500.0) + waveSize) * waveDistance;
      }
    
      void main() {
        vPosition = position;
        vUv = uv;
        
        // Cloud shadow move
        vUv.x += uTime * 0.0001 * offsetX;
        vUv.y += uTime * 0.0001 * offsetY;
    
        vNormal = normalize(normalMatrix * normal);
        if (vPosition.y < 0.0) {
          vPosition.y = 0.0;
        } else {
          vPosition.x += wave(uv.x * 10.0, 0.3, 0.1);      
        }
        gl_Position = projectionMatrix * modelViewMatrix * vec4(vPosition, 1.0);
      }`,
      fragmentShader:`  uniform sampler2D uCloud;
      uniform float uTime;
      varying vec3 vPosition;
      varying vec2 vUv;
      varying vec3 vNormal;
    
      vec3 green = vec3(0.2, 0.6, 0.3);
    
      void main() {
        vec3 color = mix(green * 0.7, green, vPosition.y);
        color = mix(color, texture2D(uCloud, vUv).rgb, 0.4);
        float lighting = normalize(dot(vNormal, vec3(10)));
        gl_FragColor = vec4(color + lighting * 0.03, 1.0);
      }`,
    })
    super(geometry, material)
    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(size / 2, 8).rotateX(Math.PI / 2),
      material
    )
    floor.position.y = -Number.EPSILON
    this.add(floor)

  }
  update(time) {
    this.material.uniforms.uTime.value = time
  }
}

grass = new Grass(50, 100000);
scene.add(grass);
