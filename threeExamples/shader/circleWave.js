import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'dat.gui'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(1, 1, 1)

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

// 创建平面几何体
const geometry = new THREE.PlaneGeometry(2, 2);

const texture = new THREE.TextureLoader().load(FILE_HOST + 'images/channels/wave.png') 
texture.wrapS = THREE.RepeatWrapping
texture.wrapT = THREE.RepeatWrapping

// 创建材质
const material = new THREE.ShaderMaterial({
    side: THREE.DoubleSide,
    transparent: true,
    blending: THREE.AdditiveBlending, // 添加混合模式让效果更亮
    uniforms: {
        uTime: { value: 0.0 },
        uScanTex: { value:texture },
        uScanColor: { value: new THREE.Color(0x00ffff) },    // 主要扫描颜色
        uScanColorDark: { value: new THREE.Color(0x0088ff) } // 暗部扫描颜色
    },
    vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        void main() {
            vUv = uv;
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        #define uScanOrigin vec3(0.0, 0.0, 0.0)
        #define uScanWaveRatio1 3.2
        #define uScanWaveRatio2 2.8

        uniform float uTime;
        uniform sampler2D uScanTex;
        uniform vec3 uScanColor;
        uniform vec3 uScanColorDark;
        
        varying vec2 vUv;
        varying vec3 vPosition;

        float circleWave(vec3 p, vec3 origin, float distRatio) {
            float t = uTime;
            float dist = distance(p, origin) * distRatio;
            float radialMove = fract(dist - t);
            float fadeOutMask = 1.0 - smoothstep(1.0, 3.0, dist);
            radialMove *= fadeOutMask;
            float cutInitialMask = 1.0 - step(t, dist);
            return radialMove * cutInitialMask;
        }

        vec3 getScanColor(vec3 worldPos, vec2 uv, vec3 col) {
            // 纹理采样
            float scanMask = texture2D(uScanTex, uv).r;
            
            // 波浪效果
            float cw = circleWave(worldPos, uScanOrigin, uScanWaveRatio1);
            float cw2 = circleWave(worldPos, uScanOrigin, uScanWaveRatio2);
            
            // 扫描遮罩
            float mask1 = smoothstep(0.3, 0.0, 1.0 - cw);
            mask1 *= (1.0 + scanMask * 0.7);
            
            float mask2 = smoothstep(0.07, 0.0, 1.0 - cw2) * 0.8;
            mask1 += mask2;
            
            float mask3 = smoothstep(0.09, 0.0, 1.0 - cw) * 1.5;
            mask1 += mask3;

            // 颜色混合
            vec3 scanCol = mix(uScanColorDark, uScanColor, mask1);
            return scanCol * mask1; // 只返回扫描区域的颜色
        }

        void main() {
            vec3 col = vec3(0.0);
            col = getScanColor(vPosition, vUv * 10.0, col);
            
            // 计算alpha通道
            float alpha = length(col);  // 根据颜色强度计算透明度
            
            gl_FragColor = vec4(col, alpha);
        }
    `
});

// 创建网格并添加到场景
const mesh = new THREE.Mesh(geometry, material);
mesh.rotation.x = Math.PI / 2
scene.add(mesh);

// 创建dat.GUI
const gui = new GUI()
const params = {
  uScanColor: '#00ffff',
  uScanColorDark: '#0088ff'
}

gui.addColor(params, 'uScanColor').onChange((value) => {
  material.uniforms.uScanColor.value.set(value)
})

gui.addColor(params, 'uScanColorDark').onChange((value) => {
  material.uniforms.uScanColorDark.value.set(value)
})

animate()

function animate() {

  requestAnimationFrame(animate)

  controls.update()

  renderer.render(scene, camera)

  material.uniforms.uTime.value += 0.005;

}
