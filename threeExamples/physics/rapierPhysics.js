import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
import Stats from "three/addons/libs/stats.module.js";
import { RapierPhysics } from "three/addons/physics/RapierPhysics.js";

let gui = new GUI();
let stats = new Stats();
document.body.appendChild(stats.dom);

let scene, renderer, camera, orbit;
let physics;

let world, RAPIER;
let trackSegments = [];
let keys = { w: false, a: false, s: false, d: false };
let wallColliders = new Set();

// 履带板尺寸
const trackWidth = 4.0;   // 宽度
const trackHeight = 0.3;  // 厚度 (比竹片厚，增加坚硬感)
const trackDepth = 0.6;   // 长度 (单个履带节的长度)
const spacing = 0.65;     // 间距

async function start() {
    physics = await RapierPhysics();
    world = physics.world;
    RAPIER = physics.RAPIER;

    init();
    addFloor();
    addWalls();
    createTankTrack(100);

    window.addEventListener('keydown', e => { if (keys.hasOwnProperty(e.key.toLowerCase())) keys[e.key.toLowerCase()] = true; });
    window.addEventListener('keyup', e => { if (keys.hasOwnProperty(e.key.toLowerCase())) keys[e.key.toLowerCase()] = false; });

    render();
}

window.addEventListener('load', e => {
    start();
});

function init() {
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.body.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 4000);
    camera.position.set(40, 40, 60);

    let ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    let dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(20, 40, 20);
    dirLight.castShadow = true;
    scene.add(dirLight);

    orbit = new OrbitControls(camera, renderer.domElement);
    orbit.enableDamping = true;

    scene.add(new THREE.GridHelper(80, 80));
}

function addFloor() {
    let geometry = new THREE.BoxGeometry(200, 0.2, 200);
    let material = new THREE.MeshStandardMaterial({ color: 0x333333 });
    let mesh = new THREE.Mesh(geometry, material);
    mesh.receiveShadow = true;
    scene.add(mesh);

    physics.addMesh(mesh, 0, 0.5);
}

function addWalls() {
    const wallSize = 200;
    const wallHeight = 50;
    const wallThickness = 4;

    const walls = [
        { pos: [0, wallHeight / 2, wallSize / 2], size: [wallSize, wallHeight, wallThickness] },
        { pos: [0, wallHeight / 2, -wallSize / 2], size: [wallSize, wallHeight, wallThickness] },
        { pos: [wallSize / 2, wallHeight / 2, 0], size: [wallThickness, wallHeight, wallSize] },
        { pos: [-wallSize / 2, wallHeight / 2, 0], size: [wallThickness, wallHeight, wallSize] }
    ];

    walls.forEach(w => {
        let geometry = new THREE.BoxGeometry(...w.size);
        let material = new THREE.MeshStandardMaterial({ color: 0x444444, transparent: true, opacity: 0.3 });
        let mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(...w.pos);
        scene.add(mesh);
        physics.addMesh(mesh, 0, 0.1);

        if (mesh.userData.physics && mesh.userData.physics.collider) {
            wallColliders.add(mesh.userData.physics.collider.handle);
        }
    });
}

function createTankTrack(count) {
    for (let i = 0; i < count; i++) {
        let geometry = new THREE.BoxGeometry(trackWidth, trackHeight, trackDepth);
        let material = new THREE.MeshStandardMaterial({
            color: i === 0 ? 0xff0000 : 0x555555,
            metalness: 0.8,
            roughness: 0.2
        });
        let mesh = new THREE.Mesh(geometry, material);

        mesh.position.set(0, trackHeight / 2 + 5, -i * spacing);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        scene.add(mesh);

        // 增加质量，使其更稳重
        physics.addMesh(mesh, 2.0, 0.0);

        let body = mesh.userData.physics.body;
        if (!body) continue;

        // 履带非常坚硬，增加阻尼防止抖动
        body.setLinearDamping(1.0);
        body.setAngularDamping(2.0);

        trackSegments.push({ mesh, body });

        if (i > 0) {
            let parentBody = trackSegments[i - 1].body;
            let currentBody = trackSegments[i].body;

            // 使用 Revolute 关节模拟履带销
            // 旋转轴设为 X 轴 (1, 0, 0)
            let params = RAPIER.JointData.revolute(
                new RAPIER.Vector3(0, 0, -spacing / 2),
                new RAPIER.Vector3(0, 0, spacing / 2),
                new RAPIER.Vector3(1, 0, 0)
            );
            world.createImpulseJoint(params, parentBody, currentBody, true);
        }
    }
}

function updateControl() {
    if (!trackSegments.length) return;

    let force = 1200; // 履带更重，需要更大的力
    let moveX = 0;
    let moveZ = 0;

    if (keys.w) moveZ -= 1;
    if (keys.s) moveZ += 1;
    if (keys.a) moveX -= 1;
    if (keys.d) moveX += 1;

    if (moveX !== 0 || moveZ !== 0) {
        const length = Math.sqrt(moveX * moveX + moveZ * moveZ);
        moveX /= length;
        moveZ /= length;

        const head = trackSegments[0];
        head.body.applyImpulse({ x: moveX * force * 0.1, y: 0, z: moveZ * force * 0.1 }, true);

        // 检测红色头部是否撞墙
        let isHittingWall = false;
        if (head.mesh.userData.physics && head.mesh.userData.physics.collider) {
            const headCollider = head.mesh.userData.physics.collider;
            world.contactPairsWith(headCollider, (otherCollider) => {
                if (wallColliders.has(otherCollider.handle)) {
                    isHittingWall = true;
                }
            });
        }

        // 堆叠效果
        if (isHittingWall) {
            for (let i = 1; i < trackSegments.length; i++) {
                const current = trackSegments[i].body;
                const prev = trackSegments[i - 1].body;

                const curPos = current.translation();
                const prevPos = prev.translation();

                let dirX = prevPos.x - curPos.x;
                let dirY = prevPos.y - curPos.y;
                let dirZ = prevPos.z - curPos.z;

                const dist = Math.sqrt(dirX * dirX + dirY * dirY + dirZ * dirZ);
                // 履带板较厚，距离阈值稍微调大
                if (dist > 0.4) {
                    dirX /= dist;
                    dirY /= dist;
                    dirZ /= dist;

                    const factor = Math.pow(0.96, i);
                    const attractForce = force * 1.2 * factor;

                    // 履带堆叠时不需要过大的向上力，revolute 关节会处理旋转
                    current.applyImpulse({
                        x: dirX * attractForce * 0.1,
                        y: dirY * attractForce * 0.1 + 0.2,
                        z: dirZ * attractForce * 0.1
                    }, true);
                }
            }
        }
    }

    // 稳定性维持：锁定侧翻
    trackSegments.forEach((seg) => {
        let body = seg.body;
        // 坦克履带主要在地面平移，锁定 X 和 Z 轴的全局旋转 (但允许 revolute 关节的局部 X 轴旋转)
        // 实际上启用 revolute 关节后，关节本身就限制了旋转自由度
        // 我们只需要确保它不翻车
        let rot = body.rotation();
        // 这里我们不强制重置旋转，因为 revolute 需要旋转，我们只限制线性速度

        let currentVel = body.linvel();
        let speed = Math.sqrt(currentVel.x ** 2 + currentVel.z ** 2);
        const maxVel = 60;

        if (speed > maxVel || Math.abs(currentVel.y) > 5) {
            let ratio = speed > maxVel ? maxVel / speed : 1;
            body.setLinvel({ x: currentVel.x * ratio, y: currentVel.y * 0.8, z: currentVel.z * ratio }, true);
        }
    });
}

function render() {
    updateControl();
    renderer.render(scene, camera);
    orbit.update();
    stats.update();
    requestAnimationFrame(render);
}

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
