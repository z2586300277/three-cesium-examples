import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

let gui = new GUI();
// 初始化场景、相机和渲染器
const gl = {
    clearColor: '#332148',
    shadows: false,
    alpha: false,
    outputColorSpace: THREE.SRGBColorSpace,
};

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    100
);

const renderer = new THREE.WebGLRenderer({ alpha: gl.alpha });
renderer.setClearColor(gl.clearColor);
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.update();
// 设置相机位置
camera.position.z = 2;
// Shaders
const vertexShader = `  uniform float size;
uniform sampler2D elevTexture;
uniform sampler2D alphaTexture;
uniform float uTime;
uniform float uWaveHeight;
uniform float uWaveSpeed;

varying vec2 vUv;
varying float vVisible;
varying float vAlpha;
varying float vElevation;
// Function to generate fBm with vec3 input
float random(vec3 st) {
return fract(sin(dot(st.xyz, vec3(12.9898,78.233,45.164))) * 43758.5453123);
}

float noise(vec3 st) {
vec3 i = floor(st);
vec3 f = fract(st);

// Eight corners in 3D of a tile
float a = random(i);
float b = random(i + vec3(1.0, 0.0, 0.0));
float c = random(i + vec3(0.0, 1.0, 0.0));
float d = random(i + vec3(1.0, 1.0, 0.0));
float e = random(i + vec3(0.0, 0.0, 1.0));
float f1 = random(i + vec3(1.0, 0.0, 1.0));
float g = random(i + vec3(0.0, 1.0, 1.0));
float h = random(i + vec3(1.0, 1.0, 1.0));

vec3 u = f * f * (3.0 - 2.0 * f);

return mix(mix(mix(a, b, u.x), mix(c, d, u.x), u.y),
       mix(mix(e, f1, u.x), mix(g, h, u.x), u.y), u.z);
}

float fbm(vec3 st) {
float value = 0.0;
float amplitude = 0.5;

for (int i = 0; i < 5; i++) {
value += amplitude * noise(st);
st *= 2.0;
amplitude *= 0.5;
}
return value;
}

void main() {
vUv = uv;
float alphaLand = 1.0 - texture2D(alphaTexture, vUv).r;
vAlpha = alphaLand;
vec3 newPosition = position;

if(alphaLand < 0.5) {
// Sea
// fBm for wave-like displacement
float waveHeight = uWaveHeight; // Adjust wave height as needed
float waveSpeed = uWaveSpeed;  // Adjust wave speed as needed
float displacement = (fbm(newPosition * 5.0 + uTime * waveSpeed) * 2.0 - 1.0) * waveHeight;
vElevation = displacement;
newPosition += normal * displacement ;
}

vec4 mvPosition = modelViewMatrix * vec4( newPosition, 1.0 );
float elv = texture2D(elevTexture, vUv).r;
vec3 vNormal = normalMatrix * normal;
vVisible = step(0.0, dot( -normalize(mvPosition.xyz), normalize(vNormal)));
mvPosition.z += 0.45 * elv;

// 求出 mvPosition 距离相机的距离
float dist = length(mvPosition.xyz);
// 根据距离调整 size
float pointSize = size * (1.0 - dist / 10.0);
gl_PointSize = max(pointSize, 1.0);
gl_PointSize = pointSize;
gl_Position = projectionMatrix * mvPosition;
}
`; // 将pointsEarth.vert的内容粘贴在这里
const fragmentShader = `  uniform sampler2D colorTexture;
// uniform sampler2D alphaTexture;
uniform sampler2D earthTexture;
uniform sampler2D starTexture;

varying vec2 vUv;
varying float vVisible;
varying float vAlpha;
varying float vElevation;

void main() {
if (floor(vVisible + 0.1) == 0.0) discard;
vec2 coord = gl_PointCoord;
float alpha = texture2D(starTexture, coord).a;
// 根据 alpha 值来裁剪形状
if (alpha < 0.1) discard;

// float alphaLand = 1.0 - texture2D(alphaTexture, vUv).r;
vec3 color = texture2D(colorTexture, vUv).rgb;
vec3 earth = texture2D(earthTexture, vUv).rgb;
color = mix(color, earth, 0.65);
if(
vAlpha > 0.5
) {
gl_FragColor = vec4(color, vAlpha);
}else {
// 对于海洋部分，根据 vElevation 调整颜色
float elevationEffect = clamp(vElevation*30.0, -1.0, 1.0); // 将 vElevation 限制在 [-1, 1] 范围内
vec3 deep_sea_blue = vec3(0.004, 0.227, 0.388);
vec3 adjustedColor = mix(deep_sea_blue, earth*1.75, (elevationEffect + 1.0) * 0.5); // 根据 vElevation 调整颜色
gl_FragColor = vec4(adjustedColor, 1.0-vAlpha);
}
}
`; // 将pointsEarth.frag的内容粘贴在这里


const params = {
    color: '#17c5a9',
    pointSize: 4.0,
};

const wireframeMaterial = {
    color: params.color,
    wireframe: true,
    transparent: true,
    opacity: 0.2,
};

const textures = {
    earthMap: new THREE.TextureLoader().load(FILE_HOST + 'threeExamples/shader/earth1.jpg'),
    starSprite: new THREE.TextureLoader().load(FILE_HOST + 'threeExamples/particle/particleEarth/circle.png'),
    colorMap: new THREE.TextureLoader().load(FILE_HOST + 'threeExamples/particle/particleEarth/04_rainbow1k.jpg'),
    elevMap: new THREE.TextureLoader().load(FILE_HOST + 'threeExamples/particle/particleEarth/01_earthbump1k.jpg'),
    alphaMap: new THREE.TextureLoader().load(FILE_HOST + 'threeExamples/particle/particleEarth/02_earthspec1k.jpg'),
};


const pointsShader = {
    uniforms: {
        size: { type: 'f', value: params.pointSize },
        uTime: { type: 'f', value: 0.0 },
        uWaveHeight: { type: 'f', value: 0.075 },
        uWaveSpeed: { type: 'f', value: 0.2 },
        colorTexture: { type: 't', value: textures.colorMap },
        elevTexture: { type: 't', value: textures.elevMap },
        alphaTexture: { type: 't', value: textures.alphaMap },
        earthTexture: { type: 't', value: textures.earthMap },
        starTexture: { type: 't', value: textures.starSprite },
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    transparent: true,
    side: THREE.FrontSide,
};


const group = new THREE.Group();
const wireframeMaterialRef = new THREE.MeshBasicMaterial(wireframeMaterial);
const pointsMaterial = new THREE.ShaderMaterial(pointsShader);

const geometry = new THREE.IcosahedronGeometry(1, 4);
const wireframeMesh = new THREE.Mesh(geometry, wireframeMaterialRef);
group.add(wireframeMesh);

const pointsGeometry = new THREE.IcosahedronGeometry(1, 128);
const pointsMesh = new THREE.Points(pointsGeometry, pointsMaterial);
group.add(pointsMesh);

const hemisphereLight = new THREE.HemisphereLight('#ffffff', '#080820', 3);
scene.add(hemisphereLight);

scene.add(group);

// 创建一个名为 'Debug' 的文件夹
let debugFolder = gui.addFolder('Debug');

// 添加颜色控制器
debugFolder.addColor(params, 'color').name('color').onChange((value) => {
    wireframeMaterialRef.color.set(value);
});

// 添加粒子大小控制器
debugFolder.add(params, 'pointSize', 0.1, 10, 0.1).name('粒子大小').onChange((value) => {
    pointsShader.uniforms.size.value = value;
});

// 添加海浪高度控制器
debugFolder.add(pointsShader.uniforms.uWaveHeight, 'value', 0.01, 0.5, 0.01).name('海浪高度').onChange((value) => {
    pointsShader.uniforms.uWaveHeight.value = value;
});

// 添加海浪变化速度控制器
debugFolder.add(pointsShader.uniforms.uWaveSpeed, 'value', 0.01, 1, 0.01).name('海浪变化速度').onChange((value) => {
    pointsShader.uniforms.uWaveSpeed.value = value;
});


// 渲染循环
function animate() {
    pointsShader.uniforms.uTime.value += 10 * 0.016;
    group.rotation.y += 0.002;
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();