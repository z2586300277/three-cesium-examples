import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(0, 8, 8)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

controls.enableDamping = true

window.onresize = () => {

  renderer.setSize(box.clientWidth, box.clientHeight)

  camera.aspect = box.clientWidth / box.clientHeight

  camera.updateProjectionMatrix()

}

const earthGeometry = new THREE.SphereGeometry(2.5, 32, 16)

const earthMaterial = new THREE.MeshBasicMaterial({ map: new THREE.TextureLoader().load(FILE_HOST + 'threeExamples/shader/earth1.jpg') })

const earth = new THREE.Mesh(earthGeometry, earthMaterial)

scene.add(earth)

const geometry = new THREE.SphereGeometry(3, 32, 16)

const material = new THREE.ShaderMaterial({

  uniforms: {

    iTime: { value: 0.0 },

    pointNum: { value: new THREE.Vector2(64, 32) },

    uColor: { value: new THREE.Color('#bbd9ec') }

  },

  transparent: true,

  vertexShader: `
    varying vec2 vUv;
    void main(){
    vUv=uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }`,

  fragmentShader: `
    float PI = acos(-1.0);
    uniform vec3 uColor;
    uniform vec2 pointNum;
    uniform float iTime;                        
    varying vec2 vUv;
    void main(){
    vec2 uv = vUv+ vec2(0.0, iTime);
      float current = abs(sin(uv.y * PI) );             
    if(current < 0.99) {      
      current=current*0.5;
    }
    float d = distance(fract(uv * pointNum), vec2(0.5, 0.5));
    if(d > current*0.2 ) {
       discard;
    } else {
       gl_FragColor =vec4(uColor,current);
    }
  }`

})

const folder = new GUI()

folder.addColor(material.uniforms.uColor, 'value')

folder.add(material.uniforms.pointNum.value, 'x', 1, 128).name('pointNumX')

folder.add(material.uniforms.pointNum.value, 'y', 1, 128).name('pointNumY')

const sphere = new THREE.Mesh(geometry, material)

scene.add(sphere)

animate()

function animate() {

  earth.rotation.y += 0.002

  material.uniforms.iTime.value += 0.002

  requestAnimationFrame(animate)

  controls.update()

  renderer.render(scene, camera)

}