import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'dat.gui'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(0, 1, 2)

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
const geometry = new THREE.PlaneGeometry(1, 1);

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
        mapColor: { value: new THREE.Color(0xb6b6b6) }, // 基础颜色
        uScanColor: { value: new THREE.Color(0x00ffff) },    // 主要扫描颜色
        uScanColorDark: { value: new THREE.Color(0x0088ff) }, // 暗部扫描颜色
        uBaseOpacity: { value: 0.2 },  // 添加基础不透明度参数
        uBaseTexture: { value: texture },  // 使用相同的纹理作为基础显示
        uBlackThreshold: { value: 0.27 }  // 黑色阈值，低于此值被视为黑色
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
        uniform sampler2D uBaseTexture;
        uniform vec3 uScanColor;
        uniform vec3 uScanColorDark;
        uniform float uBaseOpacity;
        uniform float uBlackThreshold;
        uniform vec3 mapColor; // 添加对贴图颜色的引用
        
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

        vec3 getScanColor(vec3 worldPos, vec2 uv, vec3 baseColor) {
            // 纹理采样
            float scanMask = texture2D(uScanTex, uv).r;
            
            // 波浪效果
            float cw = circleWave(worldPos, uScanOrigin, uScanWaveRatio1);
            float cw2 = circleWave(worldPos, uScanOrigin, uScanWaveRatio2);
            
            // 扫描遮罩
            float mask1 = smoothstep(0.3, 0.0, 1.1 - cw);
            mask1 *= (1.0 + scanMask * 0.7);

            // 颜色混合 - 扫描颜色与基础颜色混合
            vec3 scanCol = mix(uScanColorDark, uScanColor, mask1);
            
            // 将扫描效果添加到基础颜色上，形成亮度增强
            return baseColor + scanCol * mask1;
        }

        float isBlack(vec3 color) {
            // 计算颜色亮度
            float luminance = 0.299 * color.r + 0.587 * color.g + 0.114 * color.b;
            // 如果亮度低于阈值，则认为是黑色
            return step(luminance, uBlackThreshold);
        }

        void main() {
            // 获取基础纹理颜色
            vec2 baseUV = vUv * 10.0;
            vec3 baseColor = texture2D(uBaseTexture, baseUV).rgb; // 应用mapColor到基础纹理颜色
            
            // 检测是否为黑色区域
            float blackMask = isBlack(baseColor);
            
            // 如果是黑色区域，直接丢弃这个片段
            if(blackMask > 0.5) {
                // 完全透明
                gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
                return;
            }
            
            // 应用扫描效果，在基础纹理上增强亮度
            vec3 finalColor = getScanColor(vPosition, baseUV, baseColor * mapColor);
            
            // 基础不透明度确保非黑色区域都能看到
            float alpha = max(length(finalColor - baseColor), uBaseOpacity);
              #ifdef USE_MAP
                vec3 textureColor = texture2D(map, vUv).rgb;
                if(isDisCard && textureColor.r < 0.1 && textureColor.g < 0.1  && textureColor.b < 0.1 ) discard;
            #endif
            gl_FragColor = vec4(finalColor, alpha + 0.5);
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
  mapColor: '#ffffff', // 添加贴图颜色控制
  uScanColor: '#00ffff',
  uScanColorDark: '#0088ff',
  uBaseOpacity: 0.2  // 添加基础不透明度参数
}

// 添加贴图颜色控制
gui.addColor(params, 'mapColor').onChange((value) => {
  material.uniforms.mapColor.value.set(value)
})

gui.addColor(params, 'uScanColor').onChange((value) => {
  material.uniforms.uScanColor.value.set(value)
})

gui.addColor(params, 'uScanColorDark').onChange((value) => {
  material.uniforms.uScanColorDark.value.set(value)
})

// 添加基础不透明度控制
gui.add(params, 'uBaseOpacity', 0, 1, 0.01).onChange((value) => {
  material.uniforms.uBaseOpacity.value = value
})

gui.add(material.uniforms.uBlackThreshold, 'value', 0, 1, 0.01).name('Black Threshold')

animate()

function animate() {

  requestAnimationFrame(animate)

  controls.update()

  renderer.render(scene, camera)

  material.uniforms.uTime.value += 0.002;

}
