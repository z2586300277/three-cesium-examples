import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'

const box = document.getElementById('box')
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 100000)
camera.position.set(1, 1, 1)
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })
renderer.setSize(box.clientWidth, box.clientHeight)
box.appendChild(renderer.domElement)
new OrbitControls(camera, renderer.domElement)

const params = {
    maxParticles: 8000,
    spawnRate: 12,
    gravity: 10,
    minSize: 0.01,
    maxSize: 0.1,
    minStrength: 1,
    maxStrength: 4,
    spread: 0.3,
    burstProbability: 0.7,
    burstMultiplier: 3,
    color: "#66ccff",
    blendingMode: "Additive"
}

// 设置UI
const gui = new GUI();
const particleFolder = gui.addFolder('粒子系统');
particleFolder.add(params, 'maxParticles').name('最大粒子数').onChange(value => {
    scene.remove(emitter.points);
    emitter = new ParticleSystem(value);
    scene.add(emitter.points);
});
particleFolder.add(params, 'spawnRate').name('生成速率');

const particlePhysicsFolder = gui.addFolder('物理属性');
particlePhysicsFolder.add(params, 'gravity').name('重力');
particlePhysicsFolder.add(params, 'minStrength').name('最小喷射强度');
particlePhysicsFolder.add(params, 'maxStrength').name('最大喷射强度');
particlePhysicsFolder.add(params, 'spread').name('发散程度');

const particleVisualFolder = gui.addFolder('视觉属性');
particleVisualFolder.add(params, 'minSize').name('最小粒子尺寸');
particleVisualFolder.add(params, 'maxSize').name('最大粒子尺寸');
particleVisualFolder.addColor(params, 'color').name('粒子颜色').onChange(value => {
    emitter.material.uniforms.color.value.set(value);
});
particleVisualFolder.add(params, 'burstProbability').name('突发概率');
particleVisualFolder.add(params, 'burstMultiplier').name('突发倍数');
particleVisualFolder.add(params, 'blendingMode', ['Additive', 'Normal']).name('混合模式').onChange(value => {
    emitter.material.blending = value === 'Additive' ? THREE.AdditiveBlending : THREE.NormalBlending;
    emitter.material.needsUpdate = true;
});

particleFolder.open();
particlePhysicsFolder.open();
particleVisualFolder.open();

const clock = new THREE.Clock()

class Particle {
    constructor() {
        this.position = new THREE.Vector3();
        const angle = Math.random() * Math.PI * 2;
        const strength = Math.random() * (params.maxStrength - params.minStrength) + params.minStrength;
        const spread = Math.random() * params.spread;
        this.velocity = new THREE.Vector3(
            Math.cos(angle) * spread * strength,
            Math.random() * strength + 2,
            Math.sin(angle) * spread * strength
        );
        this.life = 0;
        this.maxLife = 1 + Math.random() * 0.5;
        this.size = this.initialSize = Math.random() * (params.maxSize - params.minSize) + params.minSize;
    }
    update(delta) {
        this.velocity.y -= params.gravity * delta * 0.5;
        this.position.addScaledVector(this.velocity, delta);
        this.life += delta;
        const lifeRatio = this.life / this.maxLife;
        this.size = this.initialSize * (1 - lifeRatio * 0.5);
    }
}

class ParticleSystem {
    constructor(maxCount = params.maxParticles) {
        this.maxCount = maxCount;
        this.particles = [];
        this.geometry = new THREE.BufferGeometry();
        this.positions = new Float32Array(this.maxCount * 3);
        this.sizes = new Float32Array(this.maxCount);
        this.opacities = new Float32Array(this.maxCount);
        this.geometry.setAttribute('position', new THREE.BufferAttribute(this.positions, 3));
        this.geometry.setAttribute('size', new THREE.BufferAttribute(this.sizes, 1));
        this.geometry.setAttribute('opacity', new THREE.BufferAttribute(this.opacities, 1));
        this.geometry.setDrawRange(0, 0);
        this.material = new THREE.ShaderMaterial({
            uniforms: {
                pointTexture: { value: new THREE.TextureLoader().load('https://z2586300277.github.io/three-editor/dist/files/channels/snow.png') },
                color: { value: new THREE.Color(params.color) }
            },
            vertexShader: `
                attribute float size;
                attribute float opacity;
                varying float vOpacity;
                void main() {
                    vOpacity = opacity;
                    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                    gl_PointSize = size * (300.0 / -mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                uniform sampler2D pointTexture;
                uniform vec3 color;
                varying float vOpacity;
                void main() {
                    gl_FragColor = texture2D(pointTexture, gl_PointCoord) * vec4(color, 1.0);
                    gl_FragColor.a *= vOpacity;
                }
            `,
            blending: params.blendingMode === 'Additive' ? THREE.AdditiveBlending : THREE.NormalBlending,
            depthTest: false,
            transparent: true
        });
        this.points = new THREE.Points(this.geometry, this.material);
    }
    spawn(count = params.spawnRate) {
        const burst = Math.random() > params.burstProbability ? params.burstMultiplier : 1;
        for (let i = 0, n = count * burst; i < n && this.particles.length < this.maxCount; i++) {
            this.particles.push(new Particle());
        }
    }
    update(delta) {
        let alive = 0;
        for (let i = 0; i < this.particles.length; i++) {
            const p = this.particles[i];
            p.update(delta);
            if (p.life <= p.maxLife) {
                this.positions[alive * 3] = p.position.x;
                this.positions[alive * 3 + 1] = p.position.y;
                this.positions[alive * 3 + 2] = p.position.z;
                this.sizes[alive] = p.size;
                this.opacities[alive] = 1.0 - (p.life / p.maxLife);
                alive++;
            }
        }
        this.particles = this.particles.filter(p => p.life < p.maxLife);
        this.geometry.setDrawRange(0, alive);
        this.geometry.attributes.position.needsUpdate = true;
        this.geometry.attributes.size.needsUpdate = true;
        this.geometry.attributes.opacity.needsUpdate = true;
        this.spawn(params.spawnRate);
    }
}

let emitter = new ParticleSystem(params.maxParticles)
scene.add(emitter.points)

function animate() {
    requestAnimationFrame(animate)
    emitter.update(clock.getDelta())
    renderer.render(scene, camera)
}
animate()

window.onresize = () => {
    renderer.setSize(box.clientWidth, box.clientHeight)
    camera.aspect = box.clientWidth / box.clientHeight
    camera.updateProjectionMatrix()
}

