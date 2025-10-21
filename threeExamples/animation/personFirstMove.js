import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import { MeshBVH, acceleratedRaycast, computeBoundsTree } from 'three-mesh-bvh';

// 启用 BVH 加速光线投射
THREE.Mesh.prototype.raycast = acceleratedRaycast;

// 初始化场景、相机和渲染器
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 加载模型 fbx
let cityModel;
const collidableObjects = []; // 存储所有可碰撞对象

new FBXLoader().load(HOST + '/files/model/city.FBX', (object3d) => {
    object3d.scale.multiplyScalar(0.01)
    object3d.position.set(0, -1, 0)
    scene.add(object3d)
    cityModel = object3d;
    
    // 为所有网格生成 BVH 用于碰撞检测
    object3d.traverse((child) => {
        if (child.isMesh) {
            child.geometry.computeBoundsTree = computeBoundsTree;
            child.geometry.computeBoundsTree();
            collidableObjects.push(child);
        }
    });
})

// 添加装饰模型用于美化场景和测试碰撞
// 添加汽车模型
new GLTFLoader().load(FILE_HOST + 'files/model/car.glb', (gltf) => {
    const car = gltf.scene;
    car.scale.multiplyScalar(2);
    car.position.set(10, 0, 5);
    car.rotation.y = Math.PI / 4;
    scene.add(car);
    
    // 为汽车添加碰撞检测
    car.traverse((child) => {
        if (child.isMesh) {
            child.geometry.computeBoundsTree = computeBoundsTree;
            child.geometry.computeBoundsTree();
            collidableObjects.push(child);
        }
    });
});

// 添加飞机模型
new GLTFLoader().load(FILE_HOST + 'files/model/Cesium_Air.glb', (gltf) => {
    const plane = gltf.scene;
    plane.scale.multiplyScalar(3);
    plane.position.set(-15, 0, -10);
    plane.rotation.y = -Math.PI / 6;
    scene.add(plane);
    
    // 为飞机添加碰撞检测
    plane.traverse((child) => {
        if (child.isMesh) {
            child.geometry.computeBoundsTree = computeBoundsTree;
            child.geometry.computeBoundsTree();
            collidableObjects.push(child);
        }
    });
});

// 添加船模型
new GLTFLoader().load(FILE_HOST + 'files/model/ship_2.glb', (gltf) => {
    const ship = gltf.scene;
    ship.scale.multiplyScalar(2);
    ship.position.set(5, 0, -15);
    ship.rotation.y = Math.PI / 2;
    scene.add(ship);
    
    // 为船添加碰撞检测
    ship.traverse((child) => {
        if (child.isMesh) {
            child.geometry.computeBoundsTree = computeBoundsTree;
            child.geometry.computeBoundsTree();
            collidableObjects.push(child);
        }
    });
});

// 添加优雅模型
new GLTFLoader().load(FILE_HOST + 'files/model/elegant.glb', (gltf) => {
    const elegant = gltf.scene;
    elegant.scale.multiplyScalar(2);
    elegant.position.set(-8, 0, 10);
    elegant.rotation.y = -Math.PI / 3;
    scene.add(elegant);
    
    // 为模型添加碰撞检测
    elegant.traverse((child) => {
        if (child.isMesh) {
            child.geometry.computeBoundsTree = computeBoundsTree;
            child.geometry.computeBoundsTree();
            collidableObjects.push(child);
        }
    });
});

// 添加一些简单的几何体作为障碍物测试碰撞
// 立方体障碍物
const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
const cube1 = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube1.position.set(0, 1, 10);
cube1.geometry.computeBoundsTree = computeBoundsTree;
cube1.geometry.computeBoundsTree();
scene.add(cube1);
collidableObjects.push(cube1);

const cube2 = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube2.position.set(-10, 1, 0);
cube2.geometry.computeBoundsTree = computeBoundsTree;
cube2.geometry.computeBoundsTree();
scene.add(cube2);
collidableObjects.push(cube2);

// 圆柱体障碍物
const cylinderGeometry = new THREE.CylinderGeometry(1, 1, 3, 16);
const cylinderMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
cylinder.position.set(15, 1.5, -5);
cylinder.geometry.computeBoundsTree = computeBoundsTree;
cylinder.geometry.computeBoundsTree();
scene.add(cylinder);
collidableObjects.push(cylinder);

// 添加方向光以更好地显示模型
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);

// 移除天空盒，添加体积云和太阳效果
// 添加网格和环境光
scene.add(new THREE.GridHelper(100, 40));
scene.add(new THREE.AmbientLight(0xffffff, 0.5));

// 创建体积云着色器
const createVolumetricClouds = () => {
  const cloudVertexShader = `
    varying vec3 vWorldPosition;
    varying vec3 vNormal;
    
    void main() {
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;
  
  const cloudFragmentShader = `
    uniform float time;
    uniform vec3 cloudColor;
    uniform vec3 skyColor;
    
    varying vec3 vWorldPosition;
    varying vec3 vNormal;
    
    // 3D噪声函数
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    
    float snoise(vec3 v) {
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
      
      vec3 i  = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);
      
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      
      i = mod289(i);
      vec4 p = permute(permute(permute(
                i.z + vec4(0.0, i1.z, i2.z, 1.0))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0))
              + i.x + vec4(0.0, i1.x, i2.x, 1.0));
      
      float n_ = 0.142857142857;
      vec3 ns = n_ * D.wyz - D.xzx;
      
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);
      
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      
      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);
      
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
      
      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);
      
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
      
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
    }
    
    // 分形布朗运动 - 创建多层噪声
    float fbm(vec3 p) {
      float value = 0.0;
      float amplitude = 0.5;
      float frequency = 1.0;
      
      for(int i = 0; i < 5; i++) {
        value += amplitude * snoise(p * frequency);
        frequency *= 2.0;
        amplitude *= 0.5;
      }
      
      return value;
    }
    
    void main() {
      // 使用时间创建运动效果
      vec3 pos = vWorldPosition * 0.001;
      pos.x += time * 0.01;
      pos.z += time * 0.005;
      
      // 创建多层云效果
      float noise1 = fbm(pos * 2.0);
      float noise2 = fbm(pos * 4.0 + vec3(time * 0.02));
      float cloudDensity = noise1 * 0.7 + noise2 * 0.3;
      
      // 创建云层形状
      cloudDensity = smoothstep(0.2, 0.6, cloudDensity);
      
      // 根据高度调整云密度
      float heightFactor = smoothstep(-0.3, 0.5, normalize(vWorldPosition).y);
      cloudDensity *= heightFactor;
      
      // 混合云和天空颜色
      vec3 color = mix(skyColor, cloudColor, cloudDensity);
      
      // 添加一些变化
      float brightness = 1.0 + noise2 * 0.2;
      color *= brightness;
      
      gl_FragColor = vec4(color, 1.0);
    }
  `;
  
  const cloudUniforms = {
    time: { value: 0 },
    cloudColor: { value: new THREE.Color(0xffffff) },
    skyColor: { value: new THREE.Color(0x87ceeb) }
  };
  
  const cloudGeometry = new THREE.SphereGeometry(500, 64, 64);
  const cloudMaterial = new THREE.ShaderMaterial({
    uniforms: cloudUniforms,
    vertexShader: cloudVertexShader,
    fragmentShader: cloudFragmentShader,
    side: THREE.BackSide,
    depthWrite: false
  });
  
  return new THREE.Mesh(cloudGeometry, cloudMaterial);
};

// 创建太阳着色器
const createSun = () => {
  const sunVertexShader = `
    varying vec2 vUv;
    varying vec3 vPosition;
    
    void main() {
      vUv = uv;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;
  
  const sunFragmentShader = `
    uniform float time;
    uniform vec3 sunColor;
    uniform vec3 coronaColor;
    
    varying vec2 vUv;
    varying vec3 vPosition;
    
    // 简单的噪声函数
    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }
    
    float noise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      
      float a = hash(i);
      float b = hash(i + vec2(1.0, 0.0));
      float c = hash(i + vec2(0.0, 1.0));
      float d = hash(i + vec2(1.0, 1.0));
      
      return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
    }
    
    void main() {
      vec2 uv = vUv - 0.5;
      float dist = length(uv);
      
      // 太阳主体
      float sun = smoothstep(0.5, 0.45, dist);
      
      // 添加动态光晕效果
      float corona = smoothstep(0.6, 0.3, dist);
      float coronaNoise = noise(vUv * 10.0 + time * 0.5);
      corona *= 0.5 + coronaNoise * 0.5;
      
      // 添加太阳表面纹理
      float surface = noise(vUv * 20.0 + time * 0.3);
      surface *= noise(vUv * 15.0 - time * 0.2);
      
      // 组合效果
      vec3 finalColor = sunColor * sun;
      finalColor += coronaColor * corona * 0.5;
      finalColor += sunColor * surface * sun * 0.3;
      
      // 发光效果
      float glow = smoothstep(0.7, 0.0, dist);
      finalColor += coronaColor * glow * 0.3;
      
      float alpha = sun + corona * 0.5 + glow * 0.2;
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `;
  
  const sunUniforms = {
    time: { value: 0 },
    sunColor: { value: new THREE.Color(0xffdd44) },
    coronaColor: { value: new THREE.Color(0xffaa00) }
  };
  
  const sunGeometry = new THREE.PlaneGeometry(80, 80);
  const sunMaterial = new THREE.ShaderMaterial({
    uniforms: sunUniforms,
    vertexShader: sunVertexShader,
    fragmentShader: sunFragmentShader,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });
  
  const sun = new THREE.Mesh(sunGeometry, sunMaterial);
  sun.position.set(200, 150, -300);
  sun.lookAt(0, 0, 0);
  
  return sun;
};

// 添加体积云和太阳到场景
const volumetricClouds = createVolumetricClouds();
const sun = createSun();
scene.add(volumetricClouds);
scene.add(sun);

// 存储引用以便动画更新
const cloudSystem = { clouds: volumetricClouds, sun: sun };

// 游戏状态
const state = {
  // 输入控制
  keys: { w: false, a: false, s: false, d: false, space: false, shift: false },
  
  // 视角控制
  view: {
    yaw: 0,
    pitch: 0,
    mouseSensitivity: 0.002,
    pitchLimit: Math.PI/3
  },
  
  // 物理参数
  physics: {
    velocity: new THREE.Vector3(),
    speed: 0.1,
    sprintMultiplier: 1.8,
    jumpForce: 0.2,
    gravity: 0.01,
    airborne: false,
    collisionRadius: 0.5, // 碰撞检测半径
    collisionHeight: 1.8,  // 角色高度
    collisionDamping: 0.8   // 碰撞阻尼，防止抖动
  },
  
  // 相机参数
  camera: {
    height: 0.7
  }
};

// 加载角色模型
let character;
new GLTFLoader().load(FILE_HOST + "files/model/Fox.glb", (gltf) => {
  character = gltf.scene;
  scene.add(character);
  character.scale.multiplyScalar(0.01);
  character.rotation.y = Math.PI; // 修正朝向
  
  // 设置动画
  const mixer = new THREE.AnimationMixer(character);
  const action = mixer.clipAction(gltf.animations[1]);
  const clock = new THREE.Clock();
  character.mixerUpdate = () => mixer.update(clock.getDelta());
  action.play();
  
  // 初始化GUI控制面板
  setupGUI();
});

// 鼠标锁定和视角控制
document.addEventListener('click', () => document.body.requestPointerLock());

document.addEventListener('mousemove', (event) => {
  if (document.pointerLockElement !== document.body) return;
  
  // 水平和垂直旋转
  state.view.yaw -= event.movementX * state.view.mouseSensitivity;
  state.view.pitch -= event.movementY * state.view.mouseSensitivity;
  
  // 限制垂直视角
  state.view.pitch = Math.max(-state.view.pitchLimit, Math.min(state.view.pitchLimit, state.view.pitch));
  
  // 更新角色旋转
  if (character) character.rotation.y = state.view.yaw + Math.PI;
});

// 键盘输入处理
document.addEventListener('keydown', ({ key }) => {
  switch(key.toLowerCase()) {
    case 'w': state.keys.w = true; break;
    case 'a': state.keys.a = true; break;
    case 's': state.keys.s = true; break;
    case 'd': state.keys.d = true; break;
    case ' ': 
      state.keys.space = true; 
      if (!state.physics.airborne) {
        state.physics.velocity.y = state.physics.jumpForce;
        state.physics.airborne = true;
      }
      break;
    case 'shift': state.keys.shift = true; break;
  }
});

document.addEventListener('keyup', ({ key }) => {
  const k = key.toLowerCase();
  if (k in state.keys) state.keys[k] = false;
});

// 改进的碰撞检测函数
function checkCollision(position, velocity) {
  if (collidableObjects.length === 0) return { collided: false, correction: new THREE.Vector3() };
  
  const correction = new THREE.Vector3();
  const radius = state.physics.collisionRadius;
  const height = state.physics.collisionHeight;
  
  // 创建射线检测点（上中下三个点）
  const checkPoints = [
    new THREE.Vector3(0, height * 0.2, 0),   // 下部
    new THREE.Vector3(0, height * 0.5, 0),   // 中部
    new THREE.Vector3(0, height * 0.8, 0)    // 上部
  ];
  
  // 16个方向进行射线检测，提高碰撞检测精度
  const directions = [];
  for (let i = 0; i < 16; i++) {
    const angle = (i / 16) * Math.PI * 2;
    directions.push(new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle)));
  }
  
  const raycaster = new THREE.Raycaster();
  raycaster.near = 0;
  raycaster.far = radius * 1.2; // 稍微增加检测范围
  
  let collisionDetected = false;
  
  // 对每个高度点和每个方向进行检测
  checkPoints.forEach(point => {
    const checkPos = position.clone().add(point);
    
    directions.forEach(dir => {
      raycaster.set(checkPos, dir);
      
      // 检测所有可碰撞对象
      const intersects = raycaster.intersectObjects(collidableObjects, false);
      
      if (intersects.length > 0) {
        const hit = intersects[0];
        if (hit.distance < radius) {
          collisionDetected = true;
          // 计算推出向量，平滑处理
          const pushDistance = radius - hit.distance;
          const pushForce = Math.pow(pushDistance / radius, 2); // 使用平方使推力更平滑
          correction.add(dir.clone().multiplyScalar(-pushForce * 0.15));
        }
      }
    });
  });
  
  // 地面检测 - 改进以支持多个对象
  raycaster.set(
    position.clone().add(new THREE.Vector3(0, 0.5, 0)),
    new THREE.Vector3(0, -1, 0)
  );
  raycaster.far = 1.5;
  
  const groundIntersects = raycaster.intersectObjects(collidableObjects, false);
  
  if (groundIntersects.length > 0) {
    const groundHit = groundIntersects[0];
    if (groundHit.distance < 0.5) {
      correction.y = 0.5 - groundHit.distance;
      collisionDetected = true;
    }
  }
  
  return { collided: collisionDetected, correction };
}

// 游戏更新函数
function update() {
  if (!character) return;

  // 计算移动方向和速度
  const moveSpeed = state.keys.shift ? 
    state.physics.speed * state.physics.sprintMultiplier : 
    state.physics.speed;
  
  let [moveX, moveZ] = [0, 0];
  if (state.keys.w) moveZ = -1;
  if (state.keys.s) moveZ = 1;
  if (state.keys.a) moveX = -1;
  if (state.keys.d) moveX = 1;
  
  // 归一化对角线移动
  if (moveX !== 0 && moveZ !== 0) {
    const length = Math.sqrt(2);
    moveX /= length;
    moveZ /= length;
  }
  
  // 转换为世界坐标
  const rotation = state.view.yaw;
  const dx = (moveX * Math.cos(rotation) + moveZ * Math.sin(rotation)) * moveSpeed;
  const dz = (moveZ * Math.cos(rotation) - moveX * Math.sin(rotation)) * moveSpeed;
  
  // 应用重力和垂直运动
  if (state.physics.airborne) {
    state.physics.velocity.y -= state.physics.gravity;
  }
  
  // 保存旧位置
  const oldPosition = character.position.clone();
  
  // 尝试应用水平移动
  const newPosX = character.position.x + dx;
  const newPosZ = character.position.z + dz;
  
  // 先尝试完整移动
  character.position.x = newPosX;
  character.position.z = newPosZ;
  
  // 检测碰撞
  const collision = checkCollision(character.position, state.physics.velocity);
  
  if (collision.collided) {
    // 应用碰撞修正
    const correctionLength = collision.correction.length();
    
    if (correctionLength > 0.3) {
      // 如果修正量很大，回退到旧位置并尝试滑动
      character.position.copy(oldPosition);
      
      // 尝试只在 X 方向移动
      character.position.x = newPosX;
      const collisionX = checkCollision(character.position, state.physics.velocity);
      
      if (collisionX.collided && collisionX.correction.length() > 0.2) {
        // X方向碰撞，回退X
        character.position.x = oldPosition.x;
      } else if (collisionX.collided) {
        // 轻微碰撞，应用修正
        character.position.add(collisionX.correction.multiplyScalar(state.physics.collisionDamping));
      }
      
      // 尝试只在 Z 方向移动
      character.position.z = newPosZ;
      const collisionZ = checkCollision(character.position, state.physics.velocity);
      
      if (collisionZ.collided && collisionZ.correction.length() > 0.2) {
        // Z方向碰撞，回退Z
        character.position.z = oldPosition.z;
      } else if (collisionZ.collided) {
        // 轻微碰撞，应用修正
        character.position.add(collisionZ.correction.multiplyScalar(state.physics.collisionDamping));
      }
    } else {
      // 如果修正量较小，直接应用平滑修正
      collision.correction.multiplyScalar(state.physics.collisionDamping);
      character.position.add(collision.correction);
    }
  }
  
  // 应用垂直移动
  character.position.y += state.physics.velocity.y;
  
  // 检测地面碰撞
  if (character.position.y <= 0) {
    character.position.y = 0;
    state.physics.velocity.y = 0;
    state.physics.airborne = false;
  }
  
  // 更新动画
  character.mixerUpdate();
  
  // 更新相机
  const cameraRotation = new THREE.Quaternion().setFromEuler(
    new THREE.Euler(state.view.pitch, state.view.yaw, 0, 'YXZ')
  );
  
  camera.position.copy(character.position).add(new THREE.Vector3(0, state.camera.height, 0));
  camera.quaternion.copy(cameraRotation);
}

// 动画循环
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  update();
  
  // 更新云和太阳的时间uniform以创建运动效果
  const elapsedTime = clock.getElapsedTime();
  if (cloudSystem.clouds.material.uniforms) {
    cloudSystem.clouds.material.uniforms.time.value = elapsedTime;
  }
  if (cloudSystem.sun.material.uniforms) {
    cloudSystem.sun.material.uniforms.time.value = elapsedTime;
  }
  
  renderer.render(scene, camera);
}
animate();

// 窗口大小调整
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// GUI控制面板
function setupGUI() {
  const gui = new GUI({ width: 250 }).close();
  
  // 相机设置
  const cameraFolder = gui.addFolder('相机设置');
  cameraFolder.add(state.camera, 'height', 0.2, 2.0, 0.05).name('相机高度');
  cameraFolder.add(camera, 'fov', 60, 120, 1).name('视野角度')
    .onChange(() => camera.updateProjectionMatrix());
  
  // 控制设置
  const controlFolder = gui.addFolder('控制设置');
  controlFolder.add(state.view, 'mouseSensitivity', 0.0005, 0.005, 0.0001).name('鼠标灵敏度');
  controlFolder.add(state.view, 'pitchLimit', 0, Math.PI/2, 0.05).name('视角限制');
  
  // 移动设置
  const moveFolder = gui.addFolder('移动设置');
  moveFolder.add(state.physics, 'speed', 0.05, 0.3, 0.01).name('移动速度');
  moveFolder.add(state.physics, 'sprintMultiplier', 1.2, 3.0, 0.1).name('冲刺倍率');
  moveFolder.add(state.physics, 'jumpForce', 0.1, 0.5, 0.01).name('跳跃高度');
  moveFolder.add(state.physics, 'gravity', 0.005, 0.03, 0.001).name('重力');
  
  // 碰撞设置
  const collisionFolder = gui.addFolder('碰撞设置');
  collisionFolder.add(state.physics, 'collisionRadius', 0.1, 1.5, 0.1).name('碰撞半径');
  collisionFolder.add(state.physics, 'collisionHeight', 0.5, 3.0, 0.1).name('碰撞高度');
  collisionFolder.add(state.physics, 'collisionDamping', 0.1, 1.0, 0.05).name('碰撞阻尼');
  
  gui.domElement.style.cssText = 'position:absolute;top:0;right:0;';
  return gui;
}

// 显示操作提示
GLOBAL_CONFIG.ElMessage('WASD移动，鼠标视角，空格跳跃，Shift加速。场景中添加了多个模型用于测试碰撞系统！');
