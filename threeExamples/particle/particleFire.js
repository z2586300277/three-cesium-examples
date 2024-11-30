import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import gsap from "gsap";


const scene = new THREE.Scene();

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
  resolution: null,
  pixelRatio: Math.min(window.devicePixelRatio, 2),
};
sizes.resolution = new THREE.Vector2(
  window.innerWidth * sizes.pixelRatio,
  window.innerHeight * sizes.pixelRatio
);


const textureLoader = new THREE.TextureLoader();

const textures = [
  textureLoader.load("/particles/1.png"),
  textureLoader.load("/particles/10.png"),
  textureLoader.load("/particles/3.png"),
  textureLoader.load("/particles/4.png"),
  textureLoader.load("/particles/5.png"),
  textureLoader.load("/particles/6.png"),
  textureLoader.load("/particles/7.png"),
  textureLoader.load("/particles/8.png"),
];

/**
 *
 * @param {粒子数目} count
 * @param {烟花位置} position
 * @param {烟花粒子大小} size
 * @param {纹理} texture
 *  @param {烟花半径} radius
 * @param {颜色}color
 */
const createFireWork = async (
  count,
  position,
  size,
  texture,
  radius = 1,
  color
) => {
  if (!texture && texture instanceof THREE.Texture) return;
  // 反转纹理
  texture.flipY = false;
  const positionsArray = new Float32Array(count * 3);

  // 粒子的随机大小
  const sizeArray = new Float32Array(count);
  // 粒子的随机存在寿命
  const lifeArray = new Float32Array(count);
  for (let index = 0; index < count; index++) {
    const spherical = new THREE.Spherical(
      radius * (0.75 + (Math.random() - 0.5) * 0.25),
      Math.random() * Math.PI,
      Math.random() * Math.PI * 2
    );
    const position = new THREE.Vector3();
    position.setFromSpherical(spherical);

    positionsArray[index * 3] = position.x;
    positionsArray[index * 3 + 1] = position.y;
    positionsArray[index * 3 + 2] = position.z;

    sizeArray[index] = Math.random();
    // 粒子的寿命只能够在原有的基础上的更短，
    //这样烟花粒子就消失的更快,会在vs基于原有的寿命乘上这个值
    lifeArray[index] = Math.random() + 1;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positionsArray, 3)
  );
  geometry.setAttribute(
    "aSize",
    new THREE.Float32BufferAttribute(sizeArray, 1)
  );
  geometry.setAttribute(
    "aLife",
    new THREE.Float32BufferAttribute(lifeArray, 1)
  );
  const material = new THREE.ShaderMaterial({
    fragmentShader:`
    precision mediump float;
    
    uniform sampler2D uTexture;
    uniform vec3 uColor;
    
    varying vec2 vUv;
    uniform float uTime;
    varying vec3 vPosition;
    varying vec3 vNormal;
    
    void main(){
    // 注意开启材质透明
    
      float textureAlpha=texture(uTexture,gl_PointCoord).r;
    
      gl_FragColor=vec4(uColor, textureAlpha);
    
      // 引入three.js的内置shader代码。开启toneMapping和colorSpace
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
      
    }`,
    vertexShader:`#include <common>
    precision mediump float;
    
    attribute float aSize;
    attribute float aLife;
    
    uniform float uTime;
    uniform float uSize;
    uniform vec2 uResolution;
    uniform float uProgress;
    
    
    varying vec3 vPosition;
    varying vec3 vNormal;
    
    float linearFunction (float x,float x1,float y1,float x2,float y2) {
        return x*((y2-y1)/(x2-x1))+(y2-((y2-y1)/(x2-x1))*x2);
    }
    
    
    void main(){
        /**
        * Position
        */
        vec3 newPosition=position;
    
        newPosition=newPosition;
    
        float vProgress=uProgress;
        vProgress*=aLife;
    
    
        //Explding
        // float explodingProgress=uProgress*((1.0-0)/(0.1-0));
        float explodingProgress=vProgress*10.0;
        explodingProgress=clamp(explodingProgress,0.0 ,1.0 );
        explodingProgress=1.0-pow(1.0-explodingProgress,3.0);
        newPosition*=explodingProgress;
    
        // Falling
        // fallingProgress
        float fallingProgress=linearFunction(vProgress,0.1,0.0,1.0,1.0);
        fallingProgress=clamp(fallingProgress,0.0 ,1.0 );
        fallingProgress=(1.0-pow(1.0-fallingProgress,3.0))*0.2;
        newPosition.y-=fallingProgress;
    
    
        //scalling
        float sizeOpenProgress=linearFunction(vProgress,0.0,0.0,0.125,1.0);
        float sizecCloseProgress=linearFunction(vProgress,0.125,1.0,1.0,0.0);
        float scallingProcess =min(sizecCloseProgress,sizecCloseProgress ) ;
        scallingProcess=clamp(scallingProcess,0.0 ,1.0 );
    
        //Twinkling
        float twinkProgreess=linearFunction(vProgress,0.2,0.0,0.8,1.0);
        twinkProgreess=clamp(twinkProgreess,0.0 ,1.0 );
        float twinkSize=sin(vProgress*30.0)*0.5+0.5;
        twinkSize=1.0-twinkProgreess*twinkSize;
    
    
    
        vec4 modelPosition=modelMatrix*vec4(newPosition,1.);
        vec4 viewPosition=viewMatrix*modelPosition;
        vec4 projectedPosition=projectionMatrix*viewPosition;
        gl_Position=projectedPosition;
    
    
        gl_PointSize=uSize*uResolution.y;
        gl_PointSize*=aSize;
        gl_PointSize*=scallingProcess;
        gl_PointSize*=twinkSize;
        // 实现粒子的透视效果，viewPosition为是模型视图变化后的posotion
        gl_PointSize*=(1.0/-viewPosition.z);
    
        if(gl_PointSize<1.0)
            gl_Position=vec4(9999.9);
        
    }`,
    uniforms: {
      uSize: new THREE.Uniform(size),
      // 屏幕分辨率
      uResolution: new THREE.Uniform(sizes.resolution),
      uTexture: new THREE.Uniform(texture),
      uColor: new THREE.Uniform(color),
      uProgress: new THREE.Uniform(0),
    },
    transparent: true,
    // 关闭粒子深度测试
    depthTest: false,
    // 开启混合
    blending: THREE.AdditiveBlending,
  });
  const fireWork = new THREE.Points(geometry, material);
  fireWork.position.copy(position);
  scene.add(fireWork);

  //Destory
  const destory = () => {
    scene.remove(fireWork);
    geometry.dispose();
    material.dispose();
  };

  // Animate
  gsap.to(material.uniforms.uProgress, {
    value: 1,
    duration: 3,
    ease: "linear",
    onComplete: destory,
  });
};

const radomCreateFireWork = () => {
  const count = Math.round(400 + Math.random() * 1000);
  const position = new THREE.Vector3(
    (Math.random() - 0.5) * 2,
    Math.random(),
    (Math.random() - 0.5) * 2
  );
  const size = 0.1 + Math.random() * 0.1;
  const texture = textures[Math.floor(Math.random() * textures.length)];
  const radius = 1 + Math.random();
  const color = new THREE.Color();
  color.setHSL(Math.random(), 1, 0.7);
  createFireWork(count, position, size, texture, radius, color);
};

setInterval(radomCreateFireWork, 600);

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(0, 0, 2);
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(sizes.pixelRatio);
document.getElementById("box").appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const tick = () => {

  controls.update()

  renderer.render(scene, camera)

  requestAnimationFrame(tick)

};

tick();
