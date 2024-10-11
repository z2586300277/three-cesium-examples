import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';      
import { DotScreenPass } from 'three/examples/jsm/postprocessing/DotScreenPass.js';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js';
import { GUI } from 'dat.gui';

let scene, camera, renderer, particles, lines, mouse, controls, gui, glitchPass, dotScreenPass, pixelPass, composer, material, lineMaterial;
const params = {
  particleCount: 1000,
  lineDistance: 1000,
  repulsionStrength: 5,
  bloomStrength: 1.5,
  bloomThreshold: 0,
  bloomRadius: 0,
  pixelSize: 1.0,
  bloomStrength: 1,
  bloomRadius: 0.4,
  bloomThreshold: 0,
  activateGlitch: false,
  dotScale: 0.5,
  activateDotScreen: false 
};

init()
animate()

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 1200;
  scene.fog = new THREE.Fog( 0x000000, 10, 2000 );
  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);

  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(params.particleCount * 3);
  for (let i = 0; i < positions.length; i++) {
    positions[i] = (Math.random() * 2 - 1) * 500;
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  material = new THREE.PointsMaterial({ color: getRandomColor(), size: 10, fog:true });
  particles = new THREE.Points(geometry, material);
  scene.add(particles);

  lineMaterial = new THREE.LineBasicMaterial({ color: getRandomColor(), linewidth: .25, fog:true });

  lines = new THREE.LineSegments(new THREE.BufferGeometry(), lineMaterial);
  scene.add(lines);

  mouse = new THREE.Vector2();

  window.addEventListener('resize', onWindowResize, false);
  document.addEventListener('mousemove', onMouseMove, false);

  const renderScene = new RenderPass(scene, camera);

  composer = new EffectComposer(renderer);
  composer.addPass(renderScene);

  const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), params.bloomStrength, params.bloomRadius, params.bloomThreshold);
  composer.addPass(bloomPass);

  const pixelationShader = {
    uniforms: {
      'tDiffuse': { value: null },
      'resolution': { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      'pixelSize': { value: 1.0 }
    },
    vertexShader: `
      varying vec2 vUv;
      void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
  `,
    fragmentShader: `
      uniform sampler2D tDiffuse;
      uniform vec2 resolution;
      uniform float pixelSize;
      varying vec2 vUv;
      void main() {
          vec2 dxy = pixelSize / resolution;
          vec2 coord = dxy * floor(vUv / dxy);
          gl_FragColor = texture2D(tDiffuse, coord);
      }
  `
  };

  pixelPass = new ShaderPass(pixelationShader);
  composer.addPass(pixelPass);

  glitchPass = new GlitchPass();
  glitchPass.enabled = false;
  composer.addPass(glitchPass);

  dotScreenPass = new DotScreenPass(new THREE.Vector2(0.5, 0.5), 0.5, 0.8);
  dotScreenPass.enabled = false;
  composer.addPass(dotScreenPass);


  gui = new GUI();
  
  gui.add(params, 'lineDistance', 500, 1000);
  gui.add(params, 'repulsionStrength', 1, 10);
  gui.add(params, 'bloomStrength', 0, 3).name('Bloom Strength').onChange(updateBloom);
  gui.add(params, 'bloomRadius', 0, 1).name('Bloom Radius').onChange(updateBloom);
  gui.add(params, 'bloomThreshold', 0, 1).name('Bloom Threshold').onChange(updateBloom);
  
  gui.add(params, 'pixelSize', 1.0, 30.0).name('Pixel Size').onChange((value) => {
    pixelPass.uniforms.pixelSize.value = value;
  });
  gui.add(params, 'activateDotScreen').name('Activate Dot Screen').onChange((value) => {
    dotScreenPass.enabled = value; 
  });

  gui.add(params, 'dotScale', 0.1, 1.5).name('Dot Scale').onChange((value) => {
    if (dotScreenPass) {
      dotScreenPass.uniforms['scale'].value = value;
    }
  });
  gui.add(params, 'activateGlitch').name('Activate Glitch').onChange((value) => {
    glitchPass.enabled = value;
  });
}

function getRandomColor() {
  return `hsl(${Math.random() * 360}, 100%, 80%)`;
}

function changeColor() {
  material.color.set(getRandomColor());
  lineMaterial.color.set(getRandomColor());
}

window.addEventListener('dblclick', changeColor);

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);      
  pixelPass.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
}

function onMouseMove(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

function animate() {
  requestAnimationFrame(animate);

  const positions = particles.geometry.attributes.position.array;
  const linePositions = [];
  for (let i = 0; i < positions.length; i += 3) {
    const dx = positions[i] - mouse.x * 500;
    const dy = positions[i + 1] - mouse.y * 500;
    const dz = positions[i + 2];
    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
    if (distance < params.lineDistance) {
      linePositions.push(positions[i], positions[i + 1], positions[i + 2]);
      linePositions.push(mouse.x * 500, mouse.y * 500, 0);
    }
    if (distance < 50) {
      positions[i] += dx / distance * params.repulsionStrength;
      positions[i + 1] += dy / distance * params.repulsionStrength;
    }
  }
  lines.geometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
  lines.geometry.computeBoundingSphere();
  particles.geometry.attributes.position.needsUpdate = true;

  particles.rotation.x += 0.01;
  lines.rotation.x += 0.01;

  controls.update();
  renderer.render(scene, camera);
  composer.render();
}

function updateBloom() {
  composer.passes[1].strength = params.bloomStrength;
  composer.passes[1].threshold = params.bloomThreshold;
  composer.passes[1].radius = params.bloomRadius;
}
