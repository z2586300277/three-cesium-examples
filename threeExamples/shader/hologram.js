import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

/**
 * Base
 */


// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader();
const vertexShader=`
#include <common>
precision mediump float;

uniform float uTime;

varying vec2 vUv;
varying vec3 vPosition;
varying vec3 vNormal;
float random (in vec2 _st) {
    return fract(sin(dot(_st.xy,
                         vec2(12.9898,78.233)))*
        43758.5453123);
}


void main(){
    /**
    * Position
    */
    vec4 modelPosition=modelMatrix*vec4(position,1.);

    // 实现
    float gltichTime = modelPosition.y-uTime;
    // 正弦波的叠加，非规律
    float gltichStrength=sin(gltichTime)+sin(gltichTime*3.45)-sin(gltichTime*8.5);
    gltichTime=gltichTime/3.0;
    // 平滑step
    gltichStrength=smoothstep(0.3,1.0 ,gltichStrength );
    // 随着时间变化的随机数种子，生成随机偏移量。 
    modelPosition.x+=(random(modelPosition.xz+uTime)-0.5)*gltichStrength*0.25;
    modelPosition.z+=(random(modelPosition.zx+uTime)-0.5)*gltichStrength*0.25;

       // 计算法线变换矩阵：逆矩阵并转置
     mat3 normalMatrix = transpose(inverse(mat3(modelMatrix)));
    // 使用法线变换矩阵变换法线
    vec3 transformedNormal = normalize(normalMatrix * normal);
    // vec3 transformedNormal = normal;



    
    vec4 viewPosition=viewMatrix*modelPosition;
    vec4 projectedPosition=projectionMatrix*viewPosition;
    gl_Position=projectedPosition;

    vPosition=modelPosition.xyz;
    vNormal=transformedNormal;
    
}
`
const fragmentShader=`

precision mediump float;
varying vec2 vUv;
uniform float uTime;
varying vec3 vPosition;
varying vec3 vNormal;

void main(){
  float stripes=vPosition.y-uTime*0.02;
  stripes=mod(stripes*20.0,1.0);
  stripes=pow(stripes,3.0 );



  // gl_FragColor=vec4(1.0,1.0,1.0,stripes);
  vec3 normal =normalize(vNormal);

  // 让背面的法向量也朝向观察者，保持与正面一致
  if(!gl_FrontFacing)
      normal*=-1.0;

  vec3 viewDirection=normalize(vPosition-cameraPosition);
  float fresnel=dot(viewDirection,normal);
  fresnel=fresnel+1.0;
  fresnel=pow(fresnel,2.0 );

  //falloff
  float falloff = smoothstep(0.8,0.0 ,fresnel );

  float holographic=fresnel*stripes;
  holographic+=fresnel*1.25;
  holographic*=falloff;

// 注意开启材质透明
  gl_FragColor=vec4(0.7,0.25,0.8,holographic);

  // 引入three.js的内置shader代码。开启toneMapping和colorSpace
  #include <tonemapping_fragment>
  #include <colorspace_fragment>
  
}
`
// Textures
const material = new THREE.ShaderMaterial({
  transparent:true,
  side:THREE.DoubleSide,
  vertexShader,
  fragmentShader,
  blending:THREE.AdditiveBlending,
  uniforms: {
    uTime: new THREE.Uniform(0),
  },
});
/**
 * Models
 */
let suzanne = null;
gltfLoader.load("https://coderfmc.github.io/three.js-demo/suzanne.glb", (gltf) => {
  // Model
  gltf.scene.traverse((item) => {
    if (item.isMesh) {
      item.material = material;
      suzanne = item;
      scene.add(item);
    }
  });
});
/**
 * Objects
 */
// Torus knot
const torusKnot = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.6, 0.25, 128, 32),
  material
);
torusKnot.position.x = 3;
scene.add(torusKnot);

// Sphere
const sphere = new THREE.Mesh(new THREE.SphereGeometry(), material);
sphere.position.x = -3;
scene.add(sphere);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(4, 1, -4);
scene.add(camera);
// scene.add(new THREE.AxesHelper(1, 1, 1));

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.getElementById("root").appendChild(renderer.domElement);
// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  // Update controls
  controls.update();
  torusKnot.rotation.y = elapsedTime * 0.5;
  sphere.rotation.y = elapsedTime * 0.5;
  if (suzanne) {
    suzanne.rotation.y = elapsedTime * 0.5;
  }
  material.uniforms.uTime.value = elapsedTime;
  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
