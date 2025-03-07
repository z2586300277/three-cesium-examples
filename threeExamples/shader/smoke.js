import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// 基础场景设置
const DOM = document.querySelector("#box"), width = DOM.clientWidth, height = DOM.clientHeight;
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setClearColor(0xbfe3dd, 1)
renderer.setSize(width, height);
DOM.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, width / height, 0.05, 100000).translateX(5);
new OrbitControls(camera, renderer.domElement).target.set(0, 0.5, 0);

// 核心变量
const clock = new THREE.Clock(), particles = [];
let delta = 0, emitTime = 0;

// 粒子配置
const config = {
    wind: [0.001, 0, 0],
    emit: { pos: [0, 0, 0], r1: 0.1, r2: 0.8, height: 8, rate: 0.05, maxPerFrame: 3 },
    particle: {
        life: [4, 5], rot: [0.2, 0.4], speed: [0.008, 0.012], 
        scale: 0.3, growth: 0.006, fade: 0.006, opacity: 0.8, blend: 0.95,
        color: { start: [0.8, 0.8, 0.8], end: [0.2, 0.2, 0.2], speed: [0.3, 0.4] },
        brightness: [0.8, 1]
    }
};

// 工具函数
const rand = (a, b) => a + Math.random() * (b - a);
const randCircle = (r) => {
    const rad = r * Math.sqrt(Math.random()), ang = Math.PI * 2 * Math.random();
    return [rad * Math.cos(ang), rad * Math.sin(ang)];
};

// 创建几何体
const geo = new THREE.InstancedBufferGeometry();
geo.setAttribute("position", new THREE.Float32BufferAttribute([-0.5,0.5,0, -0.5,-0.5,0, 0.5,0.5,0, 0.5,-0.5,0, 0.5,0.5,0, -0.5,-0.5,0], 3));
geo.setAttribute("uv", new THREE.Float32BufferAttribute([0,1, 0,0, 1,1, 1,0, 1,1, 0,0], 2));

// 创建实例属性
const attrDefs = [["offset",3],["scale",2],["quaternion",3],["rotation",1],["color",4],["blend",1],["texture",1]];
const attrs = {};
attrDefs.forEach(([name, size]) => {
    attrs[name] = new Float32Array(100 * size);
    geo.setAttribute(name, new THREE.InstancedBufferAttribute(attrs[name], size));
});

// 创建材质和网格
const material = new THREE.ShaderMaterial({
    uniforms: { map: { value: new THREE.TextureLoader().load(FILE_HOST + "images/channels/snow.png") }, time: { value: 0 } },
    vertexShader: `
        attribute vec3 offset; attribute vec2 scale; attribute vec3 quaternion; attribute float rotation;
        attribute vec4 color; attribute float blend; uniform float time; varying vec2 vUv;
        varying vec4 vColor; varying float vBlend;
        void main() {
            float a = time * rotation, c = cos(a), s = sin(a);
            vec3 vR = vec3(position.x*scale.x*c - position.y*scale.y*s, position.y*scale.y*c + position.x*scale.x*s, 0.0);
            vec3 vL = offset - cameraPosition, up = vec3(0,1,0);
            vec3 right = normalize(cross(vL, up));
            vec3 vP = vR.x * right + vR.y * up + offset;
            vUv = uv; vColor = color; vBlend = blend;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(vP, 1.0);
        }`,
    fragmentShader: `
        uniform sampler2D map; varying vec2 vUv; varying vec4 vColor; varying float vBlend;
        void main() {
            vec4 c = texture2D(map, vUv) * vColor;
            gl_FragColor = c; gl_FragColor.rgb *= gl_FragColor.a; gl_FragColor.a *= vBlend;
        }`,
    transparent: true, depthWrite: false,
    blending: THREE.CustomBlending, blendSrc: THREE.OneFactor, blendDst: THREE.OneMinusSrcAlphaFactor
});

const mesh = new THREE.Mesh(geo, material);
mesh.frustumCulled = false;
scene.add(mesh);

// 主循环
function animate() {
    requestAnimationFrame(animate);
    delta = clock.getDelta();
    
    // 发射新粒子
    emitTime += delta;
    let emitCount = Math.min(Math.floor(emitTime / config.emit.rate), config.emit.maxPerFrame);
    emitTime -= emitCount * config.emit.rate;
    
    while(emitCount-- > 0) {
        // 计算发射位置和方向
        const [x1, z1] = randCircle(config.emit.r1);
        const [dx, dz] = randCircle(config.emit.r2);
        const dir = [dx, config.emit.height, dz];
        const len = Math.hypot(...dir);
        const speed = rand(...config.particle.speed);
        const bright = rand(...config.particle.brightness);
        
        // 添加粒子
        particles.push({
            p: [x1, 0, z1], // 位置
            v: dir.map(v => v * speed / len), // 速度
            s: config.particle.scale, // 大小
            r: rand(...config.particle.rot), // 旋转
            c: [...config.particle.color.start.map(c => c * bright), config.particle.opacity], // 颜色
            ce: config.particle.color.end.map(c => c * bright), // 目标颜色
            ct: 0, // 颜色过渡
            cs: rand(...config.particle.color.speed), // 颜色速度
            l: rand(...config.particle.life), // 生命周期
            b: config.particle.blend // 混合值
        });
    }
    
    // 更新粒子
    for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        
        // 更新位置
        for (let j = 0; j < 3; j++) p.p[j] += p.v[j] + config.wind[j];
        
        // 更新大小和颜色
        p.s += config.particle.growth;
        
        if (p.ct < 1) {
            p.ct = Math.min(1, p.ct + delta * p.cs);
            for (let j = 0; j < 3; j++) p.c[j] = (1-p.ct) * p.c[j] + p.ct * p.ce[j];
        }
        
        // 更新生命
        p.l -= delta;
        if (p.l <= 0) p.c[3] -= config.particle.fade;
        
        // 移除死亡粒子
        if (p.c[3] <= 0) particles.splice(i, 1);
    }
    
    // 无粒子则只渲染场景
    if (particles.length === 0) {
        renderer.render(scene, camera);
        return;
    }
    
    // 按距离排序
    particles.sort((a, b) => {
        return Math.hypot(camera.position.x - b.p[0], camera.position.y - b.p[1], camera.position.z - b.p[2]) - 
               Math.hypot(camera.position.x - a.p[0], camera.position.y - a.p[1], camera.position.z - a.p[2]);
    });
    
    // 更新缓冲区
    for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        // 单值属性
        attrs.rotation[i] = p.r;
        attrs.blend[i] = p.b;
        attrs.texture[i] = 0;
        
        // 二值属性
        attrs.scale[i*2] = attrs.scale[i*2+1] = p.s;
        
        // 三值属性
        for (let j = 0; j < 3; j++) {
            attrs.offset[i*3+j] = p.p[j];
            attrs.quaternion[i*3+j] = p.v[j];
        }
        
        // 四值属性
        for (let j = 0; j < 4; j++) attrs.color[i*4+j] = p.c[j];
    }
    
    // 更新几何体并渲染
    Object.entries(attrs).forEach(([name, array]) => {
        geo.attributes[name].needsUpdate = true;
    });
    geo.instanceCount = particles.length;
    
    material.uniforms.time.value = clock.elapsedTime;
    renderer.render(scene, camera);
}

animate();