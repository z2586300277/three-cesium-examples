import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// 初始化场景
const box = document.getElementById('box')
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 1000)
camera.position.set(0, 10, 6)

// 设置渲染器
const renderer = new THREE.WebGLRenderer({ 
  antialias: true, 
  alpha: true, 
  logarithmicDepthBuffer: true 
})
renderer.setSize(box.clientWidth, box.clientHeight)
box.appendChild(renderer.domElement)

// 轨道控制器
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

/**
 * 创建真实火焰效果
 * @returns {Object} 包含火焰组和火焰材质的对象
 */
function createRealisticFire() {
  // 火焰配置参数
  const fireConfig = {
    particleCount: 1500,    // 粒子数量
    particleSize: 0.5,      // 粒子基础大小
    baseHeight: 5,          // 火焰高度
    baseRadius: 1.2,        // 火焰底部半径
    colors: {
      inner: new THREE.Color(0xffff80),  // 内焰颜色 - 亮黄色
      mid: new THREE.Color(0xff8000),    // 中焰颜色 - 橙色
      outer: new THREE.Color(0xff4400),  // 外焰颜色 - 红色
      smoke: new THREE.Color(0x111111)   // 烟雾颜色 - 深灰色
    },
    velocityFactor: 0.6,    // 上升速度系数
    wiggleFactor: 0.2       // 横向摇摆系数
  };

  // 火焰着色器材质
  const fireMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 },
      baseColor: { value: fireConfig.colors.inner },
      midColor: { value: fireConfig.colors.mid },
      tipColor: { value: fireConfig.colors.outer },
      smokeColor: { value: fireConfig.colors.smoke }
    },
    vertexShader: `
      attribute float size;
      attribute float life;
      attribute float phase;
      attribute vec3 velocity;
      uniform float time;
      varying float vLife;
      varying float vPhase;
      
      void main() {
        vLife = life;
        vPhase = phase;
        
        // 计算粒子当前生命周期
        float age = mod(time + phase, 1.0);
        
        // 位置随时间变化
        vec3 pos = position + velocity * age;
        
        // 添加水平摆动效果，随生命周期衰减
        float wiggle = sin(age * 20.0 + phase * 10.0) * (1.0 - age) * 0.2;
        pos.x += wiggle;
        
        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_Position = projectionMatrix * mvPosition;
        
        // 粒子大小随高度和生命周期变化
        gl_PointSize = size * (1.0 - age) * (300.0 / -mvPosition.z);
      }
    `,
    fragmentShader: `
      uniform vec3 baseColor;
      uniform vec3 midColor;
      uniform vec3 tipColor;
      uniform vec3 smokeColor;
      varying float vLife;
      varying float vPhase;
      
      void main() {
        // 计算到粒子中心的距离，用于圆形粒子效果
        vec2 center = gl_PointCoord - 0.5;
        float dist = length(center) * 2.0;
        
        // 丢弃边缘像素创建圆形粒子
        if (dist > 1.0) discard;
        
        // 基于生命周期混合颜色
        vec3 color;
        float age = vLife;
        
        // 颜色过渡: 亮黄 -> 橙色 -> 红色 -> 烟雾色
        if (age < 0.3) {
          color = mix(baseColor, midColor, age / 0.3);
        } else if (age < 0.8) {
          color = mix(midColor, tipColor, (age - 0.3) / 0.5);
        } else {
          color = mix(tipColor, smokeColor, (age - 0.8) / 0.2);
        }
        
        // 边缘透明度渐变，提高真实感
        float alpha = (1.0 - dist) * (1.0 - age);
        
        gl_FragColor = vec4(color, alpha);
      }
    `,
    blending: THREE.AdditiveBlending,  // 加法混合，增强光照效果
    depthWrite: false,                 // 禁用深度写入
    transparent: true,                 // 启用透明
  });

  // 创建粒子几何体
  const fireGeometry = new THREE.BufferGeometry();
  const positions = [];
  const sizes = [];
  const lives = [];
  const phases = [];
  const velocities = [];
  
  // 生成火焰粒子
  for (let i = 0; i < fireConfig.particleCount; i++) {
    // 在圆形底部随机分布
    const radius = Math.random() * fireConfig.baseRadius;
    const theta = Math.random() * Math.PI * 2;
    const x = radius * Math.cos(theta);
    const z = radius * Math.sin(theta);
    const y = Math.random() * 0.5;  // 略微抬高起始位置
    
    positions.push(x, y, z);
    
    // 随机粒子大小
    sizes.push(fireConfig.particleSize * (0.5 + Math.random() * 0.5));
    
    // 随机生命周期和相位，创造自然效果
    lives.push(Math.random());
    phases.push(Math.random());
    
    // 速度向量 - 主要向上，带随机偏移
    const speed = fireConfig.velocityFactor * (0.8 + Math.random() * 0.4);
    const vx = (Math.random() - 0.5) * fireConfig.wiggleFactor;
    const vy = speed * fireConfig.baseHeight;  // 主要向上运动
    const vz = (Math.random() - 0.5) * fireConfig.wiggleFactor;
    
    velocities.push(vx, vy, vz);
  }
  
  // 为几何体设置属性
  fireGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  fireGeometry.setAttribute('size', new THREE.Float32BufferAttribute(sizes, 1));
  fireGeometry.setAttribute('life', new THREE.Float32BufferAttribute(lives, 1));
  fireGeometry.setAttribute('phase', new THREE.Float32BufferAttribute(phases, 1));
  fireGeometry.setAttribute('velocity', new THREE.Float32BufferAttribute(velocities, 3));
  
  // 创建粒子系统
  const fireParticles = new THREE.Points(fireGeometry, fireMaterial);
  
  // 创建火焰底部的光源
  const fireLight = new THREE.PointLight(0xff5500, 1, 10);
  fireLight.position.set(0, 2, 0);  // 光源位置稍高于火焰基部
  
  // 创建火焰组，包含粒子和光源
  const fireGroup = new THREE.Group();
  fireGroup.add(fireParticles);
  fireGroup.add(fireLight);
  
  return { fireGroup, fireMaterial };
}

// 创建火焰并添加到场景
const { fireGroup, fireMaterial } = createRealisticFire();
scene.add(fireGroup);

// 添加环境光，提供基础照明
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);

// 动画相关
const clock = new THREE.Clock();

/**
 * 动画循环
 */
function animate() {
  requestAnimationFrame(animate);
  
  const elapsedTime = clock.getElapsedTime();
  
  // 更新火焰的时间参数
  fireMaterial.uniforms.time.value = elapsedTime;
  
  // 使火焰光源强度随时间微微变化，模拟火焰闪烁
  const fireLight = fireGroup.children[1];
  fireLight.intensity = 1 + Math.sin(elapsedTime * 5) * 0.2;
  
  controls.update();
  renderer.render(scene, camera);
}

// 启动动画
animate();

// 窗口大小变化处理
window.addEventListener('resize', () => {
  camera.aspect = box.clientWidth / box.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(box.clientWidth, box.clientHeight);
});
