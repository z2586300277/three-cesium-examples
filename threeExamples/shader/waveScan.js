

import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(0, 0, 0.6)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

controls.enableDamping = true

window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)

    camera.aspect = box.clientWidth / box.clientHeight

    camera.updateProjectionMatrix()

}

const uniforms = {

    iTime: {

        value: 0

    },

    iResolution: {

        value: new THREE.Vector2(box.clientWidth, box.clientHeight)

    }

}

const geometry = new THREE.PlaneGeometry(1, 1)

const material = new THREE.ShaderMaterial({

    uniforms,

    transparent: true,

    side: THREE.DoubleSide,

    vertexShader: `
      varying vec3 vPosition;
      varying vec2 vUv;
      void main() { 
          vUv = uv; 
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;
      }
  `,
    fragmentShader: `
  uniform float iTime;
  const float PI = 3.14159265359;


  float random(float p){
      return fract(sin(p) * 10000.0);
  } 
  
  float noise(vec2 p){
      float t = iTime / 2000.0;
      if(t > 1.0) t -= floor(t);
      return random(p.x * 14. + p.y * sin(t) * 0.5);
  }

  vec2 sw(vec2 p){
      return vec2(floor(p.x), floor(p.y));
  }
  
  vec2 se(vec2 p){
      return vec2(ceil(p.x), floor(p.y));
  }
  
  vec2 nw(vec2 p){
      return vec2(floor(p.x), ceil(p.y));
  }
  
  vec2 ne(vec2 p){
      return vec2(ceil(p.x), ceil(p.y));
  }

  float smoothNoise(vec2 p){
      vec2 inter = smoothstep(0.0, 1.0, fract(p));
      float s = mix(noise(sw(p)), noise(se(p)), inter.x);
      float n = mix(noise(nw(p)), noise(ne(p)), inter.x);
      return mix(s, n, inter.y);
  }

  mat2 rotate (in float theta){
      float c = cos(theta);
      float s = sin(theta);
      return mat2(c, -s, s, c);
  }

  float circ(vec2 p){
      float r = length(p);
      r = log(sqrt(r));
      return abs(mod(4.0 * r, PI * 2.0) - PI) * 3.0 + 0.2;
  }

  float fbm(in vec2 p){
      float z = 2.0;
      float rz = 0.0;
      vec2 bp = p;
      for(float i = 1.0; i < 6.0; i++){
          rz += abs((smoothNoise(p) - 0.5)* 2.0) / z;
          z *= 2.0;
          p *= 2.0;
      }
      return rz;
  }
  float distanceTo(vec2 src, vec2 dst) {
      float dx = src.x - dst.x;
      float dy = src.y - dst.y;
      float dv = dx * dx + dy * dy;
      return sqrt(dv);
  }
  varying vec2 vUv; 
  uniform vec2 iResolution; 
  void main() { 
      float len = distanceTo(vec2(0.5, 0.5), vec2(vUv.x, vUv.y)) * 2.0; 

      vec2 p = vUv - 0.5;
      p.x *= iResolution.x / iResolution.y;
      p *= 8.0;
      float rz = fbm(p);
      p /= exp(mod(iTime * 2.0, PI));
      rz *= pow(abs(0.1 - circ(p)), 0.9);
      vec3 col = vec3(0.2, 0.1, 0.643); 
      
      gl_FragColor = vec4(col / rz,  1.0 - pow(len, 3.0))  ;
      
  }

    `
})

const mesh = new THREE.Mesh(geometry, material)

scene.add(mesh)

animate()

function animate() {

    uniforms.iTime.value += 0.01

    requestAnimationFrame(animate)

    controls.update()

    renderer.render(scene, camera)

}



/**
 * 名称: 罗盘
 * 作者: 优雅永不过时 https://github.com/z2586300277
*/
