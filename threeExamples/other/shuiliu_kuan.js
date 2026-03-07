import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'dat.gui'

const box = document.getElementById('box')
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x1a1a2e)

const camera = new THREE.PerspectiveCamera(60, box.clientWidth / box.clientHeight, 0.1, 1000)
camera.position.set(0, 5, 12)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(box.clientWidth, box.clientHeight)
box.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)
scene.add(new THREE.AmbientLight(0xffffff, 0.5))

// 可配置参数
const config = {
    count: 3000,
    nozzleX: 0,
    nozzleY: 6,
    nozzleLengthX: 0.5,
    nozzleLengthZ: 0.2,
    velocityX: 1.5,
    velocityY: 2.0,
    spread: 1.5,
    gravity: 10,
    particleSize: 0.15,
    lifeTime: 2.0,
    color: '#c8ebff',
    opacity: 0.75,
    density: 1.0,
    alpTest: 0.0,
    finalOpacity: 1.0,
}

const uniforms = {
    time: { value: 0 },
    nozzlePos: { value: new THREE.Vector3(config.nozzleX, config.nozzleY, 0) },
    velocity: { value: new THREE.Vector2(config.velocityX, config.velocityY) },
    spread: { value: config.spread },
    gravity: { value: config.gravity },
    lifeTime: { value: config.lifeTime },
    nozzleSize: { value: new THREE.Vector2(config.nozzleLengthX, config.nozzleLengthZ) },
    baseColor: { value: new THREE.Color(config.color) },
    opacity: { value: config.opacity },
    density: { value: config.density },
    alpTest: { value: config.alpTest },
    finalOpacity: { value: config.finalOpacity },
}

const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: `
        attribute float size;
        attribute float phase;
        attribute vec3 randomVel;
        uniform float time;
        uniform vec3 nozzlePos;
        uniform vec2 velocity;
        uniform float spread;
        uniform float gravity;
        uniform float lifeTime;
        uniform vec2 nozzleSize;
        varying float vAlpha;
        
        void main() {
            // 粒子生命周期（循环）
            float age = mod(time + phase, lifeTime);
            float ageRatio = age / lifeTime;
            
            // 初始位置：长方形喷口，X方向为长，Z方向为宽
            vec3 pos = nozzlePos;
            pos.x += randomVel.x * nozzleSize.x;
            pos.y += randomVel.y * 0.05;
            pos.z += randomVel.z * nozzleSize.y;
            
            // 初始速度 + 随机扩散
            vec3 vel = vec3(velocity.x, velocity.y, 0.0);
            vel += randomVel * spread;
            
            // 受重力的抛物运动
            pos += vel * age;
            pos.y -= 0.5 * gravity * age * age;
            
            // 透明度：开始淡入，结束淡出
            vAlpha = smoothstep(0.0, 0.05, ageRatio) * (1.0 - smoothstep(0.85, 1.0, ageRatio));
            
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_Position = projectionMatrix * mvPosition;
            gl_PointSize = size * (250.0 / -mvPosition.z);
        }
    `,
    fragmentShader: `
        uniform sampler2D map;
        uniform vec3 baseColor;
        uniform float opacity;
        uniform float density;
        uniform float alpTest;
        uniform float finalOpacity;
        varying float vAlpha;
        
        void main() {
            vec4 texColor = texture2D(map, gl_PointCoord);
            // 用自定义颜色混合纹理
            vec3 finalColor = baseColor * texColor.rgb;
            // density 控制浓度（影响边缘衰减的硬度）
            float alpha = pow(texColor.a, 1.0 / max(density, 0.01)) * vAlpha * opacity;
            if(opacity < 1.0 && alpha < alpTest) discard; // 提前丢弃完全透明的片元
            gl_FragColor = vec4(finalColor, alpha * finalOpacity);
        }
    `,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
})

// 生成纹理
const c = document.createElement('canvas')
c.width = c.height = 32
const ctx = c.getContext('2d')
const g = ctx.createRadialGradient(16, 16, 0, 16, 16, 16)
g.addColorStop(0, 'rgba(200,235,255,1)')
g.addColorStop(1, 'rgba(120,190,255,0)')
ctx.fillStyle = g
ctx.fillRect(0, 0, 32, 32)
uniforms.map = { value: new THREE.CanvasTexture(c) }

function buildGeometry() {
    const geo = new THREE.BufferGeometry()
    const positions = [], sizes = [], phases = [], randomVels = []

    for (let i = 0; i < config.count; i++) {
        positions.push(0, 0, 0)
        sizes.push(config.particleSize * (0.8 + Math.random() * 0.4))
        phases.push(Math.random() * config.lifeTime) // 错开生成时间
        randomVels.push(
            (Math.random() - 0.5),
            (Math.random() - 0.5) * 0.6,
            (Math.random() - 0.5) * 0.8
        )
    }

    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
    geo.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1))
    geo.setAttribute('phase', new THREE.Float32BufferAttribute(phases, 1))
    geo.setAttribute('randomVel', new THREE.Float32BufferAttribute(randomVels, 3))
    return geo
}

const particles = new THREE.Points(buildGeometry(), material)
scene.add(particles)

// GUI
const gui = new GUI()
gui.add(config, 'nozzleX', -5, 5).name('喷嘴X').onChange(v => uniforms.nozzlePos.value.x = v)
gui.add(config, 'nozzleY', 0, 10).name('喷嘴高度').onChange(v => uniforms.nozzlePos.value.y = v)
gui.add(config, 'nozzleLengthX', 0.05, 5.0).name('喷口长(X)').onChange(v => uniforms.nozzleSize.value.x = v)
gui.add(config, 'nozzleLengthZ', 0.05, 5.0).name('喷口宽(Z)').onChange(v => uniforms.nozzleSize.value.y = v)
gui.add(config, 'velocityX', -5, 5).name('水平速度').onChange(v => uniforms.velocity.value.x = v)
gui.add(config, 'velocityY', 0, 5).name('上升速度').onChange(v => uniforms.velocity.value.y = v)
gui.add(config, 'spread', 0, 3).name('扩散').onChange(v => uniforms.spread.value = v)
gui.add(config, 'gravity', 0, 20).name('重力').onChange(v => uniforms.gravity.value = v)
gui.add(config, 'lifeTime', 0.5, 5).name('生命周期').onChange(v => uniforms.lifeTime.value = v)
gui.add(config, 'count', 500, 8000, 500).name('粒子数').onChange(() => {
    particles.geometry.dispose()
    particles.geometry = buildGeometry()
})
gui.add(config, 'particleSize', 0.05, 0.5).name('粒子大小').onChange(() => {
    particles.geometry.dispose()
    particles.geometry = buildGeometry()
})
gui.addColor(config, 'color').name('水花颜色').onChange(v => uniforms.baseColor.value.set(v))
gui.add(config, 'opacity', 0.05, 1.0).name('透明度').onChange(v => uniforms.opacity.value = v)
gui.add(config, 'density', 0.1, 3.0).name('浓度').onChange(v => uniforms.density.value = v)
gui.add(config, 'alpTest', 0.0, 1.0).name('Alpha测试').onChange(v => uniforms.alpTest.value = v)
gui.add(config, 'finalOpacity', 0.0, 1.0).name('最终透明度').onChange(v => uniforms.finalOpacity.value = v)

const clock = new THREE.Clock()

function animate() {
    requestAnimationFrame(animate)
    uniforms.time.value = clock.getElapsedTime()
    renderer.render(scene, camera)
}
animate()

window.onresize = () => {
    renderer.setSize(box.clientWidth, box.clientHeight)
    camera.aspect = box.clientWidth / box.clientHeight
    camera.updateProjectionMatrix()
}
