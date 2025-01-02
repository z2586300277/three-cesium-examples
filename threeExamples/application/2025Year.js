import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { VignetteShader } from 'three/addons/shaders/VignetteShader.js';
import { GammaCorrectionShader } from 'three/addons/shaders/GammaCorrectionShader.js';

let rotations = `
// https://forum.gamemaker.io/index.php?threads/solved-3d-rotations-with-a-shader-matrix-or-a-matrix-glsl-es.61064/
  mat4 rx(float a) {
    return mat4( 1.0, 0.0, 0.0, 0.0,
                 0.0,cos(a),sin(a), 0.0,
                 0.0,-sin(a),cos(a), 0.0,
                 0.0, 0.0, 0.0, 1.0);
  }

  mat4 ry(float a){
    return mat4( cos(a),0.0, -sin(a), 0.0,
                 0.0, 1.0, 0.0, 0.0,
                 sin(a), 0.0, cos(a), 0.0,
                 0.0,0.0,0.0,1.0);
  }
           
  mat4 rz(float a){
    return mat4( cos(a), sin(a), 0.0, 0.0,
                 -sin(a), cos(a), 0.0, 0.0,
                 0.0        , 0.0       ,1.0 ,0.0,
                 0.0        , 0.0       ,0.0 ,1.0);
  }
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  
  mat4 rotationXYZ(vec3 angles){
    return rz(angles.z) * ry(angles.y) * rx(angles.x);
  }
`;


class Postprocessing extends EffectComposer{
  constructor(){
    super(renderer, new THREE.WebGLRenderTarget(innerWidth, innerHeight, {samples: 1}));
    
    let renderPass = new RenderPass(scene, camera);
    let effectVignette = new ShaderPass(VignetteShader);
        effectVignette.uniforms[ 'offset' ].value = 0.2;
	      effectVignette.uniforms[ 'darkness' ].value = 10;
    let gammaCorrection = new ShaderPass( GammaCorrectionShader );
    
    //console.log(effectVignette.material);
    effectVignette.material.onBeforeCompile = shader => {
      shader.uniforms.time = gu.time;
      shader.uniforms.aspect = gu.aspect;
      shader.uniforms.texWriting = {
        value: (() => {
          let c = document.createElement("canvas");
          c.width = 2048;
          c.height = 512;
          let ctx = c.getContext("2d");
          let u = val => val * c.height * 0.01;
          
          ctx.fillStyle = `rgba(0, 255, 0, 0.5)`;
          ctx.strokeStyle = `rgba(255, 0, 0, 1)`;
          ctx.lineWidth = u(1.25);
          ctx.lineJoin = "round";
          ctx.lineCap = "round";
          ctx.font = `${u(45)}px BerkshireSwash`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          
          //ctx.strokeRect(0, 0, c.width, c.height);
          let text = `Happy New Year!`;
          ctx.fillText(text, c.width * 0.5, c.height * 0.5);
          ctx.strokeText(text, c.width * 0.5, c.height * 0.5);
          
          let tex = new THREE.CanvasTexture(c);
          tex.colorSpace = "srgb";
          
          return tex;
        })()
      }
      
      shader.fragmentShader = `
        uniform float time;
        uniform float aspect;
        uniform sampler2D texWriting;
        
        float N21(vec2 p) {
          p = fract(p * vec2(233.34, 851.73));
          p += dot(p, p + 23.45);
          return fract(p.x * p.y);
        }
        vec2 N22(vec2 p){
          vec3 a = fract(p.xyx * vec3(123.45, 234.56, 345.67));
          a += dot(a, a+45.69);
          return fract(vec2(a.x * a.y, a.y * a.z));
        }
        ${shader.fragmentShader}
      `.replace(
        `gl_FragColor = vec4( mix( texel.rgb, vec3( 1.0 - darkness ), dot( uv, uv ) ), texel.a );`,
        `gl_FragColor = vec4( mix( texel.rgb, vec3( 1.0 - darkness ), dot( uv, uv ) ), texel.a );
        
        vec2 texUV = (vUv - 0.5) * vec2(aspect, 4.) + 0.5;
        texUV.y += 1.7;

        vec4 col = texture(texWriting, texUV);
        
        // cells
        float t = time * 0.1;
        vec2 cellsUV = (texUV + vec2(0., t)) * vec2(4., 1.) * 40.;
        vec2 cId = floor(cellsUV);
        vec2 cUv = fract(cellsUV);
        
        // particles
        float c = 0.;
      
        for(float y = -2.; y <= 2.;y++){
          for(float x = -2.; x <= 2.; x++){
            vec2 offs = vec2(x, y);
            vec2 locId = mod(cId + offs, vec2(100.)); 
            float n1 = N21(locId);
            float rr = (n1 * 0.5 + 0.5) * 0.5;
            vec2 shift = N22(locId) + offs;
            shift.x += sin(mod((n1 + t * 2. * n1) * ${Math.PI * 2}, ${Math.PI * 2})) * 1.25; // swaying
            c = max(c, smoothstep(rr, rr - 0.1, length(shift - cUv)));
          }
        }
        
        // fill
        float fFill = c * col.g;
        float fDraw = max(fFill, col.r);
        
        gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.9875, 1, 1) * 0.9, fDraw);
        
        `
      );
      console.log(shader.fragmentShader);
    }
    
    this.addPass(renderPass);
    this.addPass(gammaCorrection);
    this.addPass(effectVignette);
  }
}

class BackShards extends THREE.LineSegments{
  constructor(){
    let g = new THREE.InstancedBufferGeometry().copy(
      new THREE.EdgesGeometry(new THREE.TetrahedronGeometry())
    );
    g.instanceCount = 100;
    let v = new THREE.Vector3();
    g.setAttribute("instPos", new THREE.InstancedBufferAttribute(
      new Float32Array(
        Array.from({length: g.instanceCount}, () => {
          v.random().subScalar(0.5).multiply(new THREE.Vector3(40, 20, 0));
          return [v.x, v.y, v.z];
        }).flat()
      )
      ,3
    ));
    g.setAttribute("instRotPhase", new THREE.InstancedBufferAttribute(
      new Float32Array(
        Array.from({length: g.instanceCount}, () => {
          v.random().subScalar(0.5).multiplyScalar(2);
          return [v.x, v.y, v.z];
        }).flat()
      )
      ,3
    ));
    g.setAttribute("instRotSpeed", new THREE.InstancedBufferAttribute(
      new Float32Array(
        Array.from({length: g.instanceCount}, () => {
          v.random().multiplyScalar(0.1).addScalar(0.1).multiplyScalar(2);
          return [v.x, v.y, v.z];
        }).flat()
      )
      ,3
    ));
    
    let m = new THREE.LineBasicMaterial({
      color: 0x004499,
      onBeforeCompile: shader => {
        shader.uniforms.time = gu.time;
        shader.vertexShader = `
          uniform float time;
          
          attribute vec3 instPos;
          attribute vec3 instRotPhase;
          attribute vec3 instRotSpeed;
          
          ${rotations}
          ${shader.vertexShader}
        `.replace(
          `#include <begin_vertex>`,
          `#include <begin_vertex>
          
            mat4 rotXYZ = rotationXYZ((instRotPhase + instRotSpeed * time * 1. * normalize(instRotPhase)) * ${Math.PI});
            
            transformed = vec3(rotXYZ * vec4(transformed, 1.));
            transformed += instPos;
          `
        );
        //console.log(shader.vertexShader);
      }
    });
    
    super(g, m);
  }
  
  update(){
    camera.getWorldDirection(this.position);
    this.position.setLength(22).add(camera.position);
    this.quaternion.copy(camera.quaternion);
  }
}

class Shards extends THREE.Mesh{
  constructor(){
    super();
    
    let g = new THREE.InstancedBufferGeometry().copy(new THREE.TetrahedronGeometry());
    g.instanceCount = 10000;
    let v = new THREE.Vector3();
    g.setAttribute("center", new THREE.Float32BufferAttribute(
      [
        1, 0, 0, 0, 1, 0, 0, 0, 1,
        1, 0, 0, 0, 1, 0, 0, 0, 1,
        1, 0, 0, 0, 1, 0, 0, 0, 1,
        1, 0, 0, 0, 1, 0, 0, 0, 1
      ],
      3
    ));
    g.setAttribute("instPos", new THREE.InstancedBufferAttribute(
      new Float32Array(
        Array.from({length: g.instanceCount}, () => {
          let a = Math.random() * Math.PI * 2;
          v.set(
            Math.cos(a),
            Math.sin(a),
            Math.random()
          );
          return [v.x, v.y, v.z];
        }).flat()
      )
      ,3
    ));
    g.setAttribute("instSca", new THREE.InstancedBufferAttribute(
      new Float32Array(
        Array.from({length: g.instanceCount}, () => {
          v.random().multiplyScalar(0.5).addScalar(0.5);
          return [v.x, v.y, v.z];
        }).flat()
      )
      ,3
    ));
    g.setAttribute("instRotPhase", new THREE.InstancedBufferAttribute(
      new Float32Array(
        Array.from({length: g.instanceCount}, () => {
          v.random().subScalar(0.5).multiplyScalar(2);
          return [v.x, v.y, v.z];
        }).flat()
      )
      ,3
    ));
    g.setAttribute("instRotSpeed", new THREE.InstancedBufferAttribute(
      new Float32Array(
        Array.from({length: g.instanceCount}, () => {
          v.random().multiplyScalar(0.1).addScalar(0.1).multiplyScalar(2);
          return [v.x, v.y, v.z];
        }).flat()
      )
      ,3
    ));
    
    let m = new THREE.MeshStandardMaterial({
      color: 0x4488ff,
      emissive: 0x2266ff,
      roughness: 0.25,
      metalness: 0.9,
      envMapIntensity: 0.1,
      onBeforeCompile: shader => {
        shader.uniforms.time = gu.time;
        shader.uniforms.texDate = {value: (() => {
          let c = document.createElement("canvas");
          c.width = c.height = 1024;
          let u = val => val * c.height * 0.01;
          let ctx = c.getContext("2d");
          
          let fSize = 45;
          ctx.font = `${u(fSize)}px Limelight`;
          ctx.fillStyle = `rgba(0, 0, 0, 1)`;
          ctx.strokeStyle = `rgba(255, 255, 255, 1)`;
          ctx.lineWidth = u(3);
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          
          ctx.fillRect(0, 0, c.width, c.height);
          
          //ctx.fillStyle = `rgba(255, 255, 255, 1)`;
          [
            {letter: "2", pos: new THREE.Vector2(-1, -1)},
            {letter: "0", pos: new THREE.Vector2( 1, -1)},
            {letter: "2", pos: new THREE.Vector2(-1,  1)},
            {letter: "5", pos: new THREE.Vector2( 1,  1)}
          ].forEach(item => {
            let itemX = u(item.pos.x * 17 + 50);
            let itemY = u(item.pos.y * 20 + 52);
            ctx.strokeText(item.letter, itemX, itemY);
            //ctx.fillText(item.letter, itemX, itemY);
          })
          
          let tex = new THREE.CanvasTexture(c);
          return tex;
        })()}
        shader.vertexShader = `
          uniform float time;
          uniform sampler2D texDate;
          
          attribute vec3 center;
          attribute vec3 instPos;
          attribute vec3 instSca;
          attribute vec3 instRotPhase;
          attribute vec3 instRotSpeed;
          
          varying vec3 vCenter;
          varying float vTexColor;
          
          // 2D Random
          float random (in vec2 st) {
              return fract(sin(dot(st.xy,
                                   vec2(12.9898,78.233)))
                           * 43758.5453123);
          }
          // 2D Noise based on Morgan McGuire @morgan3d
          // https://www.shadertoy.com/view/4dS3Wd
          float noise (in vec2 st) {
              vec2 i = floor(st);
              vec2 f = fract(st);

              // Four corners in 2D of a tile
              float a = random(i);
              float b = random(i + vec2(1.0, 0.0));
              float c = random(i + vec2(0.0, 1.0));
              float d = random(i + vec2(1.0, 1.0));

              // Smooth Interpolation

              // Cubic Hermine Curve.  Same as SmoothStep()
              vec2 u = f*f*(3.0-2.0*f);
              // u = smoothstep(0.,1.,f);

              // Mix 4 coorners percentages
              return mix(a, b, u.x) +
                      (c - a)* u.y * (1.0 - u.x) +
                      (d - b) * u.x * u.y;
          }
          
          float getNoise(vec2 st, float time){
            float a = atan(st.y, st.x) + ${Math.PI * 0.5};
            float r = length(st);
            float aStep = ${Math.PI} / 3.;
            float aPart = abs(mod(a, aStep) - (0.5 * aStep));
            vec2 suv = vec2(cos(aPart), sin(aPart)) * r - vec2(time, 0.);
            float n = noise(suv);
            return n;
          }
          
          ${rotations}
          ${shader.vertexShader}
        `.replace(
          `#include <beginnormal_vertex>`,
          `#include <beginnormal_vertex>
            mat4 rotXYZ = rotationXYZ((instRotPhase + instRotSpeed * time * 1. * normalize(instRotPhase)) * ${Math.PI});
            
            objectNormal = vec3(rotXYZ * vec4(objectNormal, 1.));
          `
        ).replace(
          `#include <begin_vertex>`,
          `#include <begin_vertex>
          vCenter = center;

          transformed = vec3(rotXYZ * vec4(transformed, 1.));
          
          float t = time * 0.25;
          float maxR = 5.;
          float currLen = mod(instPos.z * maxR + t, maxR);
          vec3 iPos = vec3(instPos.xy * currLen, 0.);
          
          float nz = clamp(getNoise(iPos.xy * 2., t * 4.), 0., 1.);
          nz *= nz * nz * nz * nz;
          
          float sideSize = maxR * 0.9;
          vec2 texUV = (vec2(iPos.xy) + sideSize ) / (sideSize * 2.);
          vec4 texVals = texture(texDate, texUV);
          
          float nf = nz * (1. - smoothstep(maxR * 0.8, maxR, currLen));
          vTexColor = texVals.g;
          nf = max(nf * 2., texVals.g * 0.25);
          
          transformed *= instSca;
          transformed *= 0.5 * nf;
          
          transformed += iPos;
          transformed.z += vTexColor * 0.5;
          `
        );
        //console.log(shader.vertexShader);
        shader.fragmentShader = `
          varying vec3 vCenter;
          varying float vTexColor;
          ${shader.fragmentShader}
        `.replace(
          `vec3 totalEmissiveRadiance = emissive;`,
          `vec3 totalEmissiveRadiance = mix(emissive, vec3(1), vTexColor);
            float edgeThickness = 1. + vTexColor * 0.25;
            vec3 afwidth = fwidth( vCenter.xyz );

            vec3 edge3 = smoothstep( ( edgeThickness - 1.0 ) * afwidth, edgeThickness * afwidth, vCenter.xyz );

            float edge = 1.0 - min( min( edge3.x, edge3.y ), edge3.z );
            
            totalEmissiveRadiance *= edge;
          `
        ).replace(
          `#include <normal_fragment_begin>`,
          `
          roughnessFactor += vTexColor * 0.25;
          metalnessFactor -= vTexColor * 0.5;
          
          #include <normal_fragment_begin>`
        );
        //console.log(shader.fragmentShader);
      }
    });
    
    this.geometry = g;
    this.material = m;
  }
}

let gu = {
  time: {value: 0},
  aspect: {value: innerWidth / innerHeight}
}
let dpr = Math.min(devicePixelRatio, 1);
let scene = new THREE.Scene();
scene.background = new THREE.Color(0x002f55);
let camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 100);
camera.position.set(0, 0, 1).setLength(12);
let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(devicePixelRatio);
renderer.setSize(innerWidth * dpr, innerHeight * dpr);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
document.body.appendChild(renderer.domElement);

let postprocessing = new Postprocessing();

window.addEventListener("resize", (event) => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  gu.aspect.value = camera.aspect;
  renderer.setSize(innerWidth * dpr, innerHeight * dpr);
  postprocessing.setSize(innerWidth * dpr, innerHeight * dpr);
});

let controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minAzimuthAngle = -Math.PI * 0.25;
controls.maxAzimuthAngle = Math.PI * 0.24;
controls.minPolarAngle = Math.PI * 0.25;
controls.maxPolarAngle = Math.PI * 0.75;
controls.minDistance = controls.getDistance() * 0.25;
controls.maxDistance = controls.getDistance();

let lightAmount = 3;
for(let i = 0; i < lightAmount; i++){
  let light = new THREE.DirectionalLight(0xffffff, Math.PI / lightAmount * 2);
  light.position.setScalar(1).applyAxisAngle(new THREE.Vector3(0, 0, 1), Math.PI * 2 / lightAmount * i);
  scene.add(light);
}
scene.add(new THREE.AmbientLight(0xffffff, Math.PI * 0.5));

let shards = new Shards();
scene.add(shards);

let backShards = new BackShards();
scene.add(backShards);

let clock = new THREE.Clock();
let t = 0;

renderer.setAnimationLoop(() => {
  let dt = clock.getDelta();
  t += dt;
  gu.time.value = t;
  controls.update();
  
  backShards.update();
  
  //renderer.render(scene, camera);
  postprocessing.render();
});