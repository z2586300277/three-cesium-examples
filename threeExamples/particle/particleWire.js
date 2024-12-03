import * as THREE from 'three'

const container = document.getElementById('box');

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);

container.appendChild(renderer.domElement);

const particlesGeometry = new THREE.BufferGeometry();

const particleCount = 300;

const posArray = new Float32Array(particleCount * 3);

const velocityArray = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount * 3; i++) { 
    
    posArray[i] = (Math.random() - 0.5) * 8; velocityArray[i] = (Math.random() - 0.5) * 0.02;

}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3)); 

particlesGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocityArray, 3));

const particleMaterial = new THREE.ShaderMaterial({
    vertexShader: `
        uniform float uTime;
        uniform vec2 uMouse;
        attribute vec3 velocity;
        varying vec3 vPosition;
        varying float vDistance;
        void main() {
            vPosition = position;
            vec3 pos = position;
            float dist = length(pos.xy - uMouse);
            float influence = 1.0 - clamp(dist / 2.0, 0.0, 1.0);
            pos.xy += uMouse * influence * 0.1;
            pos += velocity * sin(uTime + position.x * 2.0);
            pos.y += sin(uTime * 0.5 + position.x) * 0.2;
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            vDistance = influence;
            gl_PointSize = mix(3.0, 8.0, influence) * (1.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
        }
    `,
    fragmentShader: `
        uniform float uTime;
        varying vec3 vPosition;
        varying float vDistance;
        void main() {
            float distanceToCenter = length(gl_PointCoord - vec2(0.5));
            if (distanceToCenter > 0.5) discard;
            vec3 baseColor = vec3(0.3, 0.6, 1.0);
            vec3 pulseColor = vec3(1.0, 0.4, 0.8);
            vec3 color = mix(baseColor, pulseColor, vDistance);
            color = color + 0.2 * sin(uTime + vPosition.xyx + vec3(0,2,4));
            float alpha = 1.0 - distanceToCenter * 2.0;
            alpha *= 0.8 + 0.2 * sin(uTime * 2.0);
            gl_FragColor = vec4(color, alpha);
        }
    `,
    uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) }
    },
    transparent: true,
    blending: THREE.AdditiveBlending
});

const particleSystem = new THREE.Points(particlesGeometry, particleMaterial); scene.add(particleSystem);

const linesMaterial = new THREE.ShaderMaterial({
    vertexShader: `
        uniform float uTime;
        uniform vec2 uMouse;
        varying vec3 vPosition;
        varying float vDistance;
        void main() {
            vPosition = position;
            vec3 pos = position;
            float dist = length(pos.xy - uMouse);
            float influence = 1.0 - clamp(dist / 2.0, 0.0, 1.0);
            pos.xy += uMouse * influence * 0.1;
            pos.y += sin(uTime * 0.5 + position.x) * 0.2;
            vDistance = influence;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
    `,
    fragmentShader: `
        uniform float uTime;
        varying vec3 vPosition;
        varying float vDistance;
        void main() {
            vec3 baseColor = vec3(0.3, 0.6, 1.0);
            vec3 pulseColor = vec3(1.0, 0.4, 0.8);
            vec3 color = mix(baseColor, pulseColor, vDistance);
            color = color + 0.2 * sin(uTime + vPosition.xyx + vec3(0,2,4));
            float alpha = 0.15 + 0.1 * vDistance;
            alpha *= 0.8 + 0.2 * sin(uTime * 2.0);
            gl_FragColor = vec4(color, alpha);
        }
    `,
    uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) }
    },
    transparent: true,
    blending: THREE.AdditiveBlending
});

const linesGeometry = new THREE.BufferGeometry();
const linePositions = [];
for (let i = 0; i < particleCount; i++) {
    for (let j = i + 1; j < particleCount; j++) {
        const dist = Math.sqrt(
            Math.pow(posArray[i * 3] - posArray[j * 3], 2) +
            Math.pow(posArray[i * 3 + 1] - posArray[j * 3 + 1], 2)
        );
        if (dist < 2) {
            linePositions.push(
                posArray[i * 3], posArray[i * 3 + 1], posArray[i * 3 + 2],
                posArray[j * 3], posArray[j * 3 + 1], posArray[j * 3 + 2]
            );
        }
    }
}
linesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));

const lines = new THREE.LineSegments(linesGeometry, linesMaterial);

scene.add(lines);

camera.position.z = 5;

const mouse = new THREE.Vector2(); let isMouseDown = false;

function onMouseMove(event) { mouse.x = (event.clientX / window.innerWidth) * 2 - 1; mouse.y = -(event.clientY / window.innerHeight) * 2 + 1; particleMaterial.uniforms.uMouse.value = mouse; linesMaterial.uniforms.uMouse.value = mouse; }

function onMouseDown() { isMouseDown = true; }

function onMouseUp() { isMouseDown = false; }

window.addEventListener('mousemove', onMouseMove);

window.addEventListener('mousedown', onMouseDown);

window.addEventListener('mouseup', onMouseUp);

window.addEventListener('touchstart', () => isMouseDown = true);

window.addEventListener('touchend', () => isMouseDown = false);

function animate(timestamp) {

    requestAnimationFrame(animate); const time = timestamp * 0.001;

    particleMaterial.uniforms.uTime.value = time;
    
    linesMaterial.uniforms.uTime.value = time;

    const positions = particlesGeometry.attributes.position.array; const velocities = particlesGeometry.attributes.velocity.array;

    for (let i = 0; i < positions.length; i += 3) {

        if (isMouseDown) { velocities[i] += (Math.random() - 0.5) * 0.001; velocities[i + 1] += (Math.random() - 0.5) * 0.001; }

        positions[i] += velocities[i]; positions[i + 1] += velocities[i + 1];

        if (Math.abs(positions[i]) > 4) velocities[i] *= -0.9; if (Math.abs(positions[i + 1]) > 4) velocities[i + 1] *= -0.9;

    }

    particlesGeometry.attributes.position.needsUpdate = true;

    const linePositions = linesGeometry.attributes.position.array; let lineIndex = 0; for (let i = 0; i < particleCount; i++) { for (let j = i + 1; j < particleCount; j++) { const dist = Math.sqrt(Math.pow(positions[i * 3] - positions[j * 3], 2) + Math.pow(positions[i * 3 + 1] - positions[j * 3 + 1], 2)); if (dist < 2) { linePositions[lineIndex++] = positions[i * 3]; linePositions[lineIndex++] = positions[i * 3 + 1]; linePositions[lineIndex++] = positions[i * 3 + 2]; linePositions[lineIndex++] = positions[j * 3]; linePositions[lineIndex++] = positions[j * 3 + 1]; linePositions[lineIndex++] = positions[j * 3 + 2]; } } } linesGeometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
}


function onWindowResize() { 
    
    camera.aspect = window.innerWidth / window.innerHeight;
    
    camera.updateProjectionMatrix(); 
    
    renderer.setSize(window.innerWidth, window.innerHeight);

}

window.addEventListener('resize', onWindowResize); animate(0);