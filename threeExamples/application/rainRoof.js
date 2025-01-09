import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

class DepthData extends THREE.WebGLRenderTarget{
  constructor(size, camParams){
    super(size, size);
    this.texture.minFilter = THREE.NearestFilter;
    this.texture.magFilter = THREE.NearestFilter;
    this.stencilBuffer = false;
    this.depthTexture = new THREE.DepthTexture();
    this.depthTexture.format = THREE.DepthFormat;
    this.depthTexture.type = THREE.UnsignedIntType;
    
    let hw = camParams.width * 0.5;
    let hh = camParams.height * 0.5;
    let d = camParams.depth;
    this.depthCam = new THREE.OrthographicCamera(-hw, hw, hh, -hh, 0, d);
    this.depthCam.layers.set(1);
    this.depthCam.position.set(0, d, 0);
    this.depthCam.lookAt(0, 0, 0);
  }
  
  update(){
    renderer.setRenderTarget(this);
    renderer.render(scene, this.depthCam);
    renderer.setRenderTarget(null);
  }
}

class Rain extends THREE.Line{
  constructor(size, amount){
    let v = new THREE.Vector3();
    let gBase = new THREE.BufferGeometry().setFromPoints([new THREE.Vector2(0, 0), new THREE.Vector2(0, 1)])
    let g = new THREE.InstancedBufferGeometry().copy(gBase)
    g.setAttribute("instPos", new THREE.InstancedBufferAttribute(
      new Float32Array(
        Array.from({length: amount}, () => {
          v.random().subScalar(0.5);
          v.y += 0.5;
          v.multiply(size);
          return [...v];
        }).flat()
      ), 3
    ))
    g.instanceCount = amount;
    
    let m = new THREE.LineBasicMaterial({
      color: 0x4488ff,
      transparent: true,
      onBeforeCompile: shader => {
        shader.uniforms.depthData = gu.depthData;
        shader.uniforms.time = gu.time;
        shader.vertexShader = `
          uniform float time;
          
          attribute vec3 instPos;
          
          varying float colorTransition;
          varying vec3 vPos;
          ${shader.vertexShader}
        `.replace(
          `#include <begin_vertex>`,
          `#include <begin_vertex>
          
          float t = time;
          vec3 iPos = instPos;
          iPos.y = mod(20. - instPos.y - t * 5., 20.);
          
          transformed.y *= 0.5;
          transformed += iPos;
          
          vPos = transformed;
          
          colorTransition = position.y;
          `
        );
        //console.log(shader.vertexShader);
        
        shader.fragmentShader = `
          uniform sampler2D depthData;
          varying float colorTransition;
          varying vec3 vPos;
          ${shader.fragmentShader}
        `.replace(
          `vec4 diffuseColor = vec4( diffuse, opacity );`,
          `
          vec2 depthUV = (vPos.xz + 10.) / 20.;
          depthUV.y = 1. - depthUV.y;
          
          float depthVal = 1. - texture(depthData, depthUV).r;
          float actualDepth = depthVal * 20.;
          
          if(vPos.y < actualDepth) discard;
          
          float trns = 1. - colorTransition;
          
          float distVal = smoothstep(3., 0., vPos.y - actualDepth);
          vec3 col = mix(diffuse, vec3(0.9), distVal); // the closer, the whiter
          vec4 diffuseColor = vec4( mix(col, col + 0.1, pow(trns, 16.)), (opacity * (0.25 + 0.75 * distVal)) * trns );
          `
        );
        //console.log(shader.fragmentShader);
      }
    })
    super(g, m);
    this.frustumCulled = false;
  }
}

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(30, innerWidth / innerHeight, 1, 1000);
camera.position.set(3, 5, 13).setLength(50);
let renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

window.addEventListener("resize", event => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
})

let camShift = new THREE.Vector3(0, 7, 0);
camera.position.add(camShift);
let controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.target.copy(camShift);

let light = new THREE.DirectionalLight(0xffffff, Math.PI);
light.position.setScalar(1);
scene.add(light, new THREE.AmbientLight(0xffffff, Math.PI * 0.5));

let maxHeight = 20;
let depthData = new DepthData(1024, {width: 20, height: 20, depth: maxHeight});

let gu = {
  time: {value: 0},
  depthData: {value: depthData.depthTexture}
}


let lawn = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20).rotateX(-Math.PI * 0.5),
  new THREE.MeshLambertMaterial({
    map: new THREE.TextureLoader().load(FILE_HOST + 'images/texture/g1.png'),
    //map: gu.depthData.value
  })
)
lawn.layers.enable(1);
scene.add(lawn);

let tent = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10).rotateX(-Math.PI * 0.65).translate(0, 10, 0),
  new THREE.MeshLambertMaterial({
    map: new THREE.TextureLoader().load(FILE_HOST + 'images/texture/g1.png'),
  })
)
tent.layers.enable(1);
tent.position.set(-2, 2, 0);
tent.rotation.y = Math.PI * 0.25;
scene.add(tent);

let rain = new Rain(new THREE.Vector3(20, 20, 20), 50000);
scene.add(rain);

let clock = new THREE.Clock();
let t = 0;

renderer.setAnimationLoop(() => {
  let dt = clock.getDelta();
  t += dt;
  gu.time.value = t;
  
  controls.update();
  
  tent.position.x = Math.sin(t * 0.2) * 7;
  
  depthData.update();
  renderer.render(scene, camera);
})