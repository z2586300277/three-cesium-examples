import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(0, 0, 10)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

controls.enableDamping = true

animate()

function animate() {

  requestAnimationFrame(animate)

  controls.update()

  renderer.render(scene, camera)

}

window.onresize = () => {

  renderer.setSize(box.clientWidth, box.clientHeight)

  camera.aspect = box.clientWidth / box.clientHeight

  camera.updateProjectionMatrix()

}

// 粒子系统配置
const config = {
    imageUrl: HOST + 'files/author/z2586300277.png',
    targetSize: 2,      // 缩放目标大小
    depth: 0.3,           // 深度范围
    pointSize: 0.001,   // 粒子基础大小
    sizeScale: 0.5,       // 粒子大小缩放系数
    color: 0xff0000,    // 自定义颜色
    useCustomColor: false,
    intensity: 1.1,
    particleGap: 6,     // 粒子间隔(1-10, 值越大粒子越少)
    particleOpacity: 0.8  // 粒子透明度
};


createParticles(config, particles => {
    particles.position.set(-1.5, 1.5, 0);
    scene.add(particles);
});

createParticles({
    ...config,
    imageUrl: HOST + 'files/author/FFMMCC.jpg',
},
particles => {
    particles.position.set(1.5, 1.5, 0);
    scene.add(particles);
});

createParticles({
    ...config,
    imageUrl: HOST + 'files/author/flowers-10.jpg',
},
particles => {
    particles.position.set(-1.5, -1.5, 0);
    scene.add(particles);
});

createParticles({
    ...config,
    imageUrl: HOST + 'files/author/KallkaGo.jpg',
},
particles => {
    particles.position.set(1.5, -1.5, 0);
    scene.add(particles);
});

function createParticles(config, callback) {
    new THREE.TextureLoader().load(config.imageUrl, texture => {
        const { width: w, height: h } = texture.image;
        const scale = w >= h ? config.targetSize/w : config.targetSize/h;
        
        // 获取像素数据
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        [canvas.width, canvas.height] = [w, h];
        ctx.drawImage(texture.image, 0, 0);
        const data = ctx.getImageData(0, 0, w, h).data;

        // 收集顶点和颜色数据，按间隔采样以控制粒子数量
        const [positions, colors] = [[], []];
        for(let i = 0; i < data.length; i += 4 * config.particleGap) {
            if(data[i + 3] > 0) {
                const x = (i/4 % w - w/2) * scale;
                const y = -(Math.floor(i/4/w) - h/2) * scale;
                positions.push(x, y, Math.random() * config.depth);
                colors.push(data[i]/255, data[i+1]/255, data[i+2]/255);
            }
        }

        // 创建几何体和材质
        const geometry = new THREE.BufferGeometry()
            .setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
            .setAttribute('color_list', new THREE.Float32BufferAttribute(colors, 3));

        callback(new THREE.Points(geometry, new THREE.ShaderMaterial({
            uniforms: {
                zPos: { value: 1 },
                useCustomColor: { value: config.useCustomColor },
                customColor: { value: new THREE.Color() },
                opacity: { value: config.particleOpacity },
                intensity: { value: config.intensity }
            },
            vertexShader: `
                attribute vec3 color_list;
                varying vec3 vColor;
                uniform float zPos;
                void main() {
                    vColor = color_list;
                    vec4 mvPosition = modelViewMatrix * vec4(position.xy, position.z * zPos, 1.0);
                    gl_PointSize = ${config.pointSize * config.sizeScale} * (1.0 - mvPosition.z);
                    gl_Position = projectionMatrix * mvPosition;
                }
            `,
            fragmentShader: `
                varying vec3 vColor;
                uniform bool useCustomColor;
                uniform vec3 customColor;
                uniform float opacity;
                void main() {
                    vec3 color = useCustomColor ? customColor : vColor;
                    gl_FragColor = vec4(color * vec3(${config.intensity}), opacity);
                }
            `,
            transparent: true
        })))
    })
}

