import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'dat.gui'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 100000)

camera.position.set(50, 50, 50)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

scene.add(new THREE.AxesHelper(100), new THREE.GridHelper(100, 10))

// 通用网格材质
const gridMaterial = new THREE.ShaderMaterial({
    transparent: true,
    side: THREE.DoubleSide,
    uniforms: {
        color: { value: new THREE.Color(0x00caea) },
        gridX: { value: 40.0 },
        gridY: { value: 20.0 },
        lineWidth: { value: 0.6 }
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
        uniform float gridX;
        uniform float gridY;
        uniform float lineWidth;
        varying vec2 vUv;
        
        void main() {
            vec2 grid = vec2(gridX, gridY);
            vec2 f = fract(vUv * grid);
            vec2 df = fwidth(vUv * grid);
            vec2 line = smoothstep(df * lineWidth, df * lineWidth * 2.0, f) * 
                        smoothstep(df * lineWidth, df * lineWidth * 2.0, 1.0 - f);
            float alpha = 1.0 - min(line.x, line.y);
            if (alpha < 0.1) discard;
            gl_FragColor = vec4(color, alpha);
        }
    `
})

// 几何体列表
const geometries = {
    'TorusKnot': new THREE.TorusKnotGeometry(15, 4, 100, 16),
    'Cylinder': new THREE.CylinderGeometry(15, 15, 40, 64),
    'Sphere': new THREE.SphereGeometry(20, 64, 32),
    'Torus': new THREE.TorusGeometry(15, 5, 32, 64),
    'Box': new THREE.BoxGeometry(30, 30, 30),
    'Cone': new THREE.ConeGeometry(15, 40, 64),
    'Capsule': new THREE.CapsuleGeometry(10, 20, 16, 32)
}

const mesh = new THREE.Mesh(geometries['TorusKnot'], gridMaterial)
scene.add(mesh)

// GUI 控制
const gui = new GUI()
const params = { geometry: 'TorusKnot', color: '#00ffff' }

gui.add(params, 'geometry', Object.keys(geometries)).name('几何体').onChange(v => mesh.geometry = geometries[v])
gui.add(gridMaterial.uniforms.gridX, 'value', 1, 100).name('横向网格')
gui.add(gridMaterial.uniforms.gridY, 'value', 1, 100).name('纵向网格')
gui.add(gridMaterial.uniforms.lineWidth, 'value', 0.1, 5).name('线条粗细')
gui.addColor(params, 'color').name('颜色').onChange(v => gridMaterial.uniforms.color.value.set(v))

function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
}

animate()

window.onresize = () => {
    renderer.setSize(box.clientWidth, box.clientHeight)
    camera.aspect = box.clientWidth / box.clientHeight
    camera.updateProjectionMatrix()
}
