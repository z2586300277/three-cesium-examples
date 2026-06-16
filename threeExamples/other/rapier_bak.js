import * as THREE from "three";
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RapierPhysics } from "three/addons/physics/RapierPhysics.js";

let gui = new GUI();

// --- 初始化全局变量 ---
let scene, renderer, camera, orbit;
let physics, world, RAPIER;
let steelSegments = [];       // 存储每个节段的物理体
let wallColliders = new Set(); // 记录墙体的碰撞体句柄

let isPaused = false;          // 暂停标志

// --- 履带尺寸参数 ---
const segmentCount = 200;      // 节段数量
const steelWidth = 6.0;        // 宽度
const steelThickness = 1.0;    // 厚度
const spacing = 1.1;           // 节段间距

// --- 连续网格模型 (用于视觉) ---
let continuousMesh;
let positionAttr;


let params = {
    conveyorForce: 200
}

gui.add(params, 'conveyorForce').step(1).name("方向力");

// ========== 初始化引擎 ==========
async function start() {
    physics = await RapierPhysics();
    world = physics.world;
    RAPIER = physics.RAPIER;

    initScene();
    addFloor();

    params.show = () => {
        addWall();          // 只保留一面墙壁（位于 Z 正方向）
        createPhysicsBodies(segmentCount);
        createContinuousMesh(segmentCount);
    }

    gui.add(params, 'show');

    // 键盘事件：P 键暂停
    window.addEventListener('keydown', e => {
        if (e.key.toLowerCase() === 'p') {
            isPaused = !isPaused;
        }
    });

    // 拦截 world.step 以支持暂停
    const originalStep = world.step;
    world.step = function () {
        if (!isPaused) {
            originalStep.call(world);
        }
    };

    render();
}

// ========== Three.js 场景基础 ==========
function initScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xdddddd);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 5000);
    camera.position.set(45, 35, 85);
    camera.lookAt(0, 5, 30);

    // 光照
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.9);
    dirLight.position.set(30, 60, 20);
    scene.add(dirLight);
    const fillLight = new THREE.PointLight(0x4466cc, 0.3);
    fillLight.position.set(0, 20, 0);
    scene.add(fillLight);

    orbit = new OrbitControls(camera, renderer.domElement);
    orbit.enableDamping = true;
    orbit.target.set(0, 8, 40);

    scene.add(new THREE.AxesHelper(100));

}

// ========== 地面 (物理静态体) ==========
function addFloor() {
    const geometry = new THREE.BoxGeometry(400, 0.2, 400);
    const material = new THREE.MeshStandardMaterial({ color: 0xaaaaaa });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.y = -0.1;
    scene.add(mesh);
    physics.addMesh(mesh, 0); // 质量 0 表示静态
}

// ========== 墙体 (物理静态体，位于 Z 正方向远处) ==========
function addWall(x = 0, y = 9, z = 0) {
    const wallHeight = 50;
    const wallThickness = 2.0;
    const geometry = new THREE.BoxGeometry(80, wallHeight, wallThickness);
    const material = new THREE.MeshStandardMaterial({
        color: 0x997755,
        transparent: true,
        opacity: 0
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    scene.add(mesh);
    physics.addMesh(mesh, 0); // 静态碰撞体

    // 记录碰撞体句柄，用于碰撞检测
    if (mesh.userData.physics && mesh.userData.physics.collider) {
        wallColliders.add(mesh.userData.physics.collider.handle);
    }
}

// ========== 创建履带的物理节段（盒状碰撞体，不可见） ==========
function createPhysicsBodies(count) {
    for (let i = 0; i < count; i++) {
        // 每个节段的碰撞体大小 (宽, 厚, 长)
        const dummyGeo = new THREE.BoxGeometry(steelWidth, steelThickness, spacing * 0.9);
        const dummyMesh = new THREE.Mesh(dummyGeo);
        dummyMesh.position.set(0, 1.0, -i * spacing);
        dummyMesh.visible = false;     // 隐藏物理代理体
        scene.add(dummyMesh);

        // 添加刚体: 质量 5.0，恢复系数 0.0
        physics.addMesh(dummyMesh, 5.0, 0.0);
        const body = dummyMesh.userData.physics.body;
        body.setLinearDamping(1.2);
        body.setAngularDamping(2.0);
        body.enableCcd(true);          // 连续碰撞检测，防止穿透
        // 限制旋转：只允许绕 X 轴转动（俯仰），保持履带刚性
        body.setEnabledRotations(true, false, false, true);

        steelSegments.push({
            body,
            collider: dummyMesh.userData.physics.collider
        });

        // 相邻节段之间添加旋转铰链 (Revolute Joint)
        if (i > 0) {
            const parentBody = steelSegments[i - 1].body;
            const currentBody = steelSegments[i].body;
            const jointParams = RAPIER.JointData.revolute(
                new RAPIER.Vector3(0, 0, -spacing / 2),
                new RAPIER.Vector3(0, 0, spacing / 2),
                new RAPIER.Vector3(1, 0, 0)   // 旋转轴为 X 轴
            );
            world.createImpulseJoint(jointParams, parentBody, currentBody, true);
        }
    }
}

// ========== 创建连续的视觉网格 (带厚度、实时跟随物理节段) ==========
function createContinuousMesh(count) {
    const geometry = new THREE.BufferGeometry();
    // 每个节段产生 4 个顶点 (上左, 上右, 下左, 下右)
    const vertices = new Float32Array(count * 4 * 3);
    const indices = [];

    for (let i = 0; i < count; i++) {
        if (i < count - 1) {
            // 上表面两个三角形
            const a_up = i * 4 + 0;
            const b_up = i * 4 + 1;
            const c_up = (i + 1) * 4 + 0;
            const d_up = (i + 1) * 4 + 1;
            indices.push(a_up, b_up, c_up);
            indices.push(b_up, d_up, c_up);
            // 下表面两个三角形
            const a_down = i * 4 + 2;
            const b_down = i * 4 + 3;
            const c_down = (i + 1) * 4 + 2;
            const d_down = (i + 1) * 4 + 3;
            indices.push(a_down, c_down, b_down);
            indices.push(b_down, c_down, d_down);
            // 左侧面
            indices.push(a_up, c_up, a_down);
            indices.push(c_up, c_down, a_down);
            // 右侧面
            indices.push(b_up, b_down, d_up);
            indices.push(d_up, b_down, d_down);
        }
    }
    // 封头 (首尾两端)
    indices.push(0, 2, 1);
    indices.push(1, 2, 3);
    const last = (count - 1) * 4;
    indices.push(last, last + 1, last + 2);
    indices.push(last + 1, last + 3, last + 2);

    geometry.setIndex(indices);
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));

    const material = new THREE.MeshStandardMaterial({
        color: 0x3a6ea5,
        metalness: 0.75,
        roughness: 0.35,
        emissive: 0x001133,
        side: THREE.DoubleSide
    });

    continuousMesh = new THREE.Mesh(geometry, material);
    scene.add(continuousMesh);

    positionAttr = continuousMesh.geometry.attributes.position;
}

// ========== 更新视觉网格的顶点位置 (根据物理体实时位置 & 旋转) ==========
function updateContinuousMesh() {
    if (steelSegments.length > 0) {
        const vertices = positionAttr.array;
        const halfThick = steelThickness / 2;
        const halfWidth = steelWidth / 2;

        for (let i = 0; i < steelSegments.length; i++) {
            const body = steelSegments[i].body;
            const pos = body.translation();
            const rot = body.rotation();
            const q = new THREE.Quaternion(rot.x, rot.y, rot.z, rot.w);

            // 计算局部坐标系的四个角点 (上左, 上右, 下左, 下右)
            const localUL = new THREE.Vector3(-halfWidth, halfThick, 0);
            const localUR = new THREE.Vector3(halfWidth, halfThick, 0);
            const localLL = new THREE.Vector3(-halfWidth, -halfThick, 0);
            const localLR = new THREE.Vector3(halfWidth, -halfThick, 0);

            const worldUL = localUL.applyQuaternion(q).add(pos);
            const worldUR = localUR.applyQuaternion(q).add(pos);
            const worldLL = localLL.applyQuaternion(q).add(pos);
            const worldLR = localLR.applyQuaternion(q).add(pos);

            const idx = i * 12;
            vertices[idx + 0] = worldUL.x; vertices[idx + 1] = worldUL.y; vertices[idx + 2] = worldUL.z;
            vertices[idx + 3] = worldUR.x; vertices[idx + 4] = worldUR.y; vertices[idx + 5] = worldUR.z;
            vertices[idx + 6] = worldLL.x; vertices[idx + 7] = worldLL.y; vertices[idx + 8] = worldLL.z;
            vertices[idx + 9] = worldLR.x; vertices[idx + 10] = worldLR.y; vertices[idx + 11] = worldLR.z;
        }
        positionAttr.needsUpdate = true;
        continuousMesh.geometry.computeVertexNormals(); // 重新计算光照
    }
}

// ========== 每帧物理更新 & 堆叠逻辑 ==========
function updateSimulation() {
    if (isPaused) return;

    if (steelSegments.length > 0) {
        // 1. 头部碰撞检测 (是否撞墙)
        const headBody = steelSegments[0].body;
        const headCollider = steelSegments[0].collider;
        let isHittingWall = false;
        if (headCollider) {
            world.contactPairsWith(headCollider, (otherCollider) => {
                if (wallColliders.has(otherCollider.handle)) {
                    isHittingWall = true;
                }
            });
        }

        // 2. 施加传送带推力 (所有节段持续向前)
        const impulseZ = params.conveyorForce * 0.05;
        steelSegments.forEach(seg => {
            seg.body.applyImpulse({ x: 0, y: 0, z: impulseZ }, true);
        });

        // 3. 撞墙后的堆叠效果 (向上后方挤压)
        if (isHittingWall) {
            for (let i = 1; i < steelSegments.length; i++) {
                const current = steelSegments[i].body;
                const prev = steelSegments[i - 1].body;
                const curPos = current.translation();
                const prevPos = prev.translation();
                const dirZ = prevPos.z - curPos.z;   // 前后挤压程度
                if (dirZ > 0.5) {
                    const factor = Math.pow(0.98, i);
                    // 向上 (y方向) + 轻微向后 (z方向负) 形成堆叠
                    current.applyImpulse({
                        x: 0,
                        y: 0.5 * factor,
                        z: params.conveyorForce * 0.03 * factor
                    }, true);
                }
            }
        }

        // 4. 全局速度限制，防止物理爆炸
        const maxVel = 18.0;
        steelSegments.forEach(seg => {
            const vel = seg.body.linvel();
            const speed = Math.hypot(vel.x, vel.y, vel.z);
            if (speed > maxVel) {
                const ratio = maxVel / speed;
                seg.body.setLinvel({ x: vel.x * ratio, y: vel.y * ratio, z: vel.z * ratio }, true);
            }
        });
    }
}

// ========== 渲染循环 ==========
function render() {
    updateSimulation();      // 更新物理逻辑
    updateContinuousMesh();  // 更新视觉网格

    renderer.render(scene, camera);
    orbit.update();
    requestAnimationFrame(render);
}

// 窗口尺寸适配
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// 启动仿真
start();