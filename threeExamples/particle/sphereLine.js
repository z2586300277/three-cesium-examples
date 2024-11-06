import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 10000)

camera.position.set(1000, 1000, 1000)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

controls.enableDamping = true

let group;
let particlesData = [];
let positions, colors;
let particles;
let pointCloud;
let particlePositions;
let linesMesh;

let maxParticleCount = 1000;
let particleCount = 500;
let r = 800;

let effectController = {
    showDots: true,
    showLines: true,
    minDistance: 150,
    limitConnections: false,
    maxConnections: 20,
    particleCount: 500
}

group = new THREE.Group();
scene.add(group);

let segments = maxParticleCount * maxParticleCount;

positions = new Float32Array(segments * 3);
colors = new Float32Array(segments * 3);

let pMaterial = new THREE.PointsMaterial({
    color: 0xFFFFFF,
    size: 3,
    blending: THREE.AdditiveBlending,
    transparent: true,
    sizeAttenuation: false
});

particles = new THREE.BufferGeometry();
particlePositions = new Float32Array(maxParticleCount * 3);

function getPos(radius, a, b) {
    const x = radius * Math.sin(a) * Math.cos(b);
    const y = radius * Math.sin(a) * Math.sin(b);
    const z = radius * Math.cos(a);
    return { x, y, z };
}

for (let i = 0; i < maxParticleCount; i++) {

    const p = getPos(r, Math.PI * 2 * Math.random(), Math.PI * 2 * Math.random())

    let x = p.x;
    let y = p.y;
    let z = p.z;

    particlePositions[i * 3] = x;
    particlePositions[i * 3 + 1] = y;
    particlePositions[i * 3 + 2] = z;

    particlesData.push({
        velocity: new THREE.Vector3(- 1 + Math.random() * 2, - 1 + Math.random() * 2, - 1 + Math.random() * 2),
        numConnections: 0
    });

}

particles.setDrawRange(0, particleCount);
particles.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3).setUsage(THREE.DynamicDrawUsage));

pointCloud = new THREE.Points(particles, pMaterial);
group.add(pointCloud);

let geometry = new THREE.BufferGeometry();

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3).setUsage(THREE.DynamicDrawUsage));

geometry.computeBoundingSphere();

geometry.setDrawRange(0, 0);

let material = new THREE.LineBasicMaterial({
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    transparent: true
});

linesMesh = new THREE.LineSegments(geometry, material);
group.add(linesMesh);
animate()

function animate() {


    let vertexpos = 0;
    let colorpos = 0;
    let numConnected = 0;
    let O = new THREE.Vector3(0, 0, 0)

    for (let i = 0; i < particleCount; i++)
        particlesData[i].numConnections = 0;

    for (let i = 0; i < particleCount; i++) {

        // get the particle
        let particleData = particlesData[i];

        particlePositions[i * 3] += particleData.velocity.x;
        particlePositions[i * 3 + 1] += particleData.velocity.y;
        particlePositions[i * 3 + 2] += particleData.velocity.z;

        const v = new THREE.Vector3(particlePositions[i * 3], particlePositions[i * 3 + 1], particlePositions[i * 3 + 2])
        if (v.distanceTo(O) > r + 20) {
            particleData.velocity.x = - particleData.velocity.x;
            particleData.velocity.y = - particleData.velocity.y;
            particleData.velocity.z = - particleData.velocity.z;
        }
        if (v.distanceTo(O) < r) {
            particleData.velocity.x = + particleData.velocity.x;
            particleData.velocity.y = + particleData.velocity.y;
            particleData.velocity.z = + particleData.velocity.z;
        }

        if (effectController.limitConnections && particleData.numConnections >= effectController.maxConnections)
            continue;

        for (let j = i + 1; j < particleCount; j++) {

            let particleDataB = particlesData[j];
            if (effectController.limitConnections && particleDataB.numConnections >= effectController.maxConnections)
                continue;

            let dx = particlePositions[i * 3] - particlePositions[j * 3];
            let dy = particlePositions[i * 3 + 1] - particlePositions[j * 3 + 1];
            let dz = particlePositions[i * 3 + 2] - particlePositions[j * 3 + 2];
            let dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

            if (dist < effectController.minDistance) {

                particleData.numConnections++;
                particleDataB.numConnections++;

                let alpha = 1.0 - dist / effectController.minDistance;

                positions[vertexpos++] = particlePositions[i * 3];
                positions[vertexpos++] = particlePositions[i * 3 + 1];
                positions[vertexpos++] = particlePositions[i * 3 + 2];

                positions[vertexpos++] = particlePositions[j * 3];
                positions[vertexpos++] = particlePositions[j * 3 + 1];
                positions[vertexpos++] = particlePositions[j * 3 + 2];

                colors[colorpos++] = alpha;
                colors[colorpos++] = alpha;
                colors[colorpos++] = alpha;

                colors[colorpos++] = alpha;
                colors[colorpos++] = alpha;
                colors[colorpos++] = alpha;

                numConnected++;

            }

        }

    }

    linesMesh.geometry.setDrawRange(0, numConnected * 2);
    linesMesh.geometry.attributes.position.needsUpdate = true;
    linesMesh.geometry.attributes.color.needsUpdate = true;

    pointCloud.geometry.attributes.position.needsUpdate = true;

    requestAnimationFrame(animate);

    group.rotation.y += 0.001
    renderer.render(scene, camera);
    controls.update()
}

let gui = new dat.GUI()

gui.add(effectController, "showDots").onChange(function (value) {

    pointCloud.visible = value;

});
gui.add(effectController, "showLines").onChange(function (value) {

    linesMesh.visible = value;

});
gui.add(effectController, "minDistance", 10, 300);
gui.add(effectController, "limitConnections");
gui.add(effectController, "maxConnections", 0, 30, 1);
gui.add(effectController, "particleCount", 0, maxParticleCount, 1).onChange(function (value) {

    particleCount = parseInt(value);
    particles.setDrawRange(0, particleCount);

});