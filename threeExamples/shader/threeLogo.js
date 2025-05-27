import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from "three/addons/libs/lil-gui.module.min.js"

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(0, 0, 10)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

controls.enableDamping = true

const vertexShader = `
varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

void main() {
  vUv = uv;
  vPosition = position;
  vNormal = normalize(normalMatrix * normal);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const fragmentShader = `
uniform float time;
uniform vec3 color1;
uniform vec3 color2;
uniform vec3 color3;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;

void main() {
  // 创建基于位置和时间的渐变效果
  float noise = sin(vPosition.x * 2.0 + time) * 0.25 +
               cos(vPosition.y * 2.0 + time * 0.5) * 0.25 +
               sin(vPosition.z * 2.0 + time * 0.8) * 0.5;
  
  // 边缘发光效果
  float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
  
  // 混合颜色
  vec3 baseColor = mix(color1, color2, noise + 0.5);
  vec3 glowColor = mix(baseColor, color3, fresnel);
  
  // 添加脉冲效果
  float pulse = (sin(time * 2.0) + 1.0) * 0.15 + 0.85;
  
  gl_FragColor = vec4(glowColor * pulse, 1.0);
}
`

const material = new THREE.ShaderMaterial({
    uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color(0xdbb8ff) },
        color2: { value: new THREE.Color(0x98d0fb) },
        color3: { value: new THREE.Color(0xfdebbf) }
    },
    vertexShader,
    fragmentShader,
    side: THREE.DoubleSide,
    transparent: true
})

const gui = new GUI()
gui.addColor(material.uniforms.color1, 'value').name('Color 1')
gui.addColor(material.uniforms.color2, 'value').name('Color 2')
gui.addColor(material.uniforms.color3, 'value').name('Color 3')

const geometry = createThreeJSLogoGeometry()
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

function createThreeJSLogoGeometry() {
    // 基础变量设置
    const v = new THREE.Vector2(0, 1);
    const c = new THREE.Vector2();
    const s = 0.85; // 缩放比例

    // 创建基本三角形
    const tri = [
        v.clone().multiplyScalar(s).add(new THREE.Vector2(0, -0.25)),
        v.clone().rotateAround(c, (-Math.PI * 2) / 3).multiplyScalar(s).add(new THREE.Vector2(0, -0.25)),
        v.clone().rotateAround(c, (Math.PI * 2) / 3).multiplyScalar(s).add(new THREE.Vector2(0, -0.25))
    ];

    // 创建翻转三角形
    const triFlip = [
        v.clone().rotateAround(c, Math.PI).multiplyScalar(s).sub(new THREE.Vector2(0, -0.25)),
        v.clone().rotateAround(c, Math.PI / 3).multiplyScalar(s).sub(new THREE.Vector2(0, -0.25)),
        v.clone().rotateAround(c, -Math.PI / 3).multiplyScalar(s).sub(new THREE.Vector2(0, -0.25))
    ];

    // 创建三角形孔洞
    const holes = [];
    const hA = 3 / Math.sqrt(3) * 0.5;

    // 生成图案中的三角形孔洞
    for (let row = 0; row < 4; row++) {
        const items = 1 + row * 2;
        const h = 1.5 * (1.5 - row);
        const w = -((items - 1) / 2) * hA;

        for (let i = 0; i < items; i++) {
            const offsetX = w + hA * i;
            const offsetY = h;
            const points = (i % 2 === 0 ? tri : triFlip).map(p => {
                const pt = p.clone();
                pt.x += offsetX;
                pt.y += offsetY;
                return pt;
            });
            holes.push(new THREE.Path(points));
        }
    }

    // 创建外部轮廓
    const contour = [
        v.clone().multiplyScalar(4.1).add(new THREE.Vector2(0, -1)),
        v.clone().rotateAround(c, (Math.PI * 2) / 3).multiplyScalar(4.1).add(new THREE.Vector2(0, -1)),
        v.clone().rotateAround(c, (-Math.PI * 2) / 3).multiplyScalar(4.1).add(new THREE.Vector2(0, -1))
    ];

    // 创建形状并添加孔洞
    const shape = new THREE.Shape(contour);
    shape.holes = holes;

    // 创建挤出几何体
    const geometry = new THREE.ExtrudeGeometry(shape, {
        depth: 0.1,
        bevelEnabled: false
    });

    // 旋转和居中
    geometry.rotateZ(Math.PI * 0.25);
    geometry.center();

    return geometry;
}

animate()

function animate() {

    material.uniforms.time.value += 0.01

    requestAnimationFrame(animate)

    controls.update()

    renderer.render(scene, camera)
}
