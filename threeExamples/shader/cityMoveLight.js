import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(10, 10, 10)

const renderer = new THREE.WebGLRenderer()

renderer.setSize(box.clientWidth, box.clientHeight)

new OrbitControls(camera, renderer.domElement)

window.onresize = () => {

  renderer.setSize(box.clientWidth, box.clientHeight)

  camera.aspect = box.clientWidth / box.clientHeight

  camera.updateProjectionMatrix()
  
}

box.appendChild(renderer.domElement)

// 坐标轴
scene.add(new THREE.AxesHelper(100000))

// 着色器
const uniforms = {

    innerCircleWidth: { value: 0 },

    circleWidth: { value: 300 },

    diff: { value: new THREE.Color(0.2, 0.2, 0.2) },

    color: { value: new THREE.Color(0.0, 0.0, 1.0) },

    opacity: { value: 0.3 },

    center: { value: new THREE.Vector3(0, 0, 0) }

}

const material = new THREE.ShaderMaterial({

    uniforms,

    vertexShader: `
        varying vec2 vUv;
        varying vec3 v_position;
        void main() {
            vUv = uv;
            v_position = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,

    fragmentShader: `
        varying vec2 vUv;
        varying vec3 v_position;

        uniform float innerCircleWidth;
        uniform float circleWidth;
        uniform float opacity;
        uniform vec3 center;
        
        uniform vec3 color;
        uniform vec3 diff;

        void main() {
            float dis = length(v_position - center);
            if(dis < (innerCircleWidth + circleWidth) && dis > innerCircleWidth) {
                float r = (dis - innerCircleWidth) / circleWidth;
            
                gl_FragColor = mix(vec4(diff, 0.1), vec4(color, opacity), r);
            }else {
                gl_FragColor = vec4(diff, 0.1);
            }
        }
    `

})

// 加载模型
new FBXLoader().load('/three-cesium-examples/public/files/model/city.FBX', (object3d) => {

    scene.add(object3d)

    object3d.scale.set(0.001, 0.001, 0.001)

    object3d.traverse((child) => {

        if (child.isMesh) child.material = material

    })

})

// 渲染
animate()

function animate() {

    if (uniforms.innerCircleWidth.value < 1000) uniforms.innerCircleWidth.value += 3
    
    else uniforms.innerCircleWidth.value = 0

    renderer.render(scene, camera)

    requestAnimationFrame(animate)

}