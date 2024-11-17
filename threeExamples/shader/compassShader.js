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
  uniform float ratio;

  float PI = 3.1415926;
  uniform float iTime;
  uniform vec2 iResolution; 
  varying vec2 vUv;
  
  vec2 rotate(vec2 p, float rad) {
      mat2 m = mat2(cos(rad), sin(rad), -sin(rad), cos(rad));
      return m * p;
  }
  
  vec2 translate(vec2 p, vec2 diff) {
      return p - diff;
  }
  
  vec2 scale(vec2 p, float r) {
      return p*r;
  }
  
  float circle(float pre, vec2 p, float r1, float r2, float power) {
      float leng = length(p);
      float d = min(abs(leng-r1), abs(leng-r2));
      if (r1<leng && leng<r2) pre /= exp(d)/r2;
      float res = power / d;
      return clamp(pre + res, 0.0, 1.0);
  }
  
  float rectangle(float pre, vec2 p, vec2 half1, vec2 half2, float power) {
      p = abs(p);
      if ((half1.x<p.x || half1.y<p.y) && (p.x<half2.x && p.y<half2.y)) {
          pre = max(0.01, pre);
      }
      float dx1 = (p.y < half1.y) ? abs(half1.x-p.x) : length(p-half1);
      float dx2 = (p.y < half2.y) ? abs(half2.x-p.x) : length(p-half2);
      float dy1 = (p.x < half1.x) ? abs(half1.y-p.y) : length(p-half1);
      float dy2 = (p.x < half2.x) ? abs(half2.y-p.y) : length(p-half2);
      float d = min(min(dx1, dx2), min(dy1, dy2));
      float res = power / d;
      return clamp(pre + res, 0.0, 1.0);
  }
  float radiation(float pre, vec2 p, float r1, float r2, int num, float power) {
      float angle = 2.0*PI/float(num);
      float d = 1e10;
      for(int i=0; i<360; i++) {
          if (i>=num) break;
          float _d = (r1<p.y && p.y<r2) ? 
              abs(p.x) : 
              min(length(p-vec2(0.0, r1)), length(p-vec2(0.0, r2)));
          d = min(d, _d);
          p = rotate(p, angle);
      }
      float res = power / d;
      return clamp(pre + res, 0.0, 1.0);
  }
  vec3 calc(vec2 p) {
      float dst = 0.0;
      p = scale(p, sin(PI*iTime/1.0)*0.02+1.1);
      {
          vec2 q = p;
          q = rotate(q, iTime * PI / 6.0);
          dst = circle(dst, q, 0.85, 0.9, 0.006);
          dst = radiation(dst, q, 0.87, 0.88, 36, 0.0008);
      }
      {
          vec2 q = p;
          q = rotate(q, iTime * PI / 6.0);
          const int n = 6;
          float angle = PI / float(n);
          q = rotate(q, floor(atan(q.x, q.y)/angle + 0.5) * angle);
          for(int i=0; i<n; i++) {
              dst = rectangle(dst, q, vec2(0.85/sqrt(2.0)), vec2(0.85/sqrt(2.0)), 0.0015);
              q = rotate(q, angle);
          }
      }
      {
          vec2 q = p;
          q = rotate(q, iTime * PI / 6.0);
          const int n = 12;
          q = rotate(q, 2.0*PI/float(n)/2.0);
          float angle = 2.0*PI / float(n);
          for(int i=0; i<n; i++) {
              dst = circle(dst, q-vec2(0.0, 0.875), 0.001, 0.05, 0.004);
              dst = circle(dst, q-vec2(0.0, 0.875), 0.001, 0.001, 0.008);
              q = rotate(q, angle);
          }
      }
      {
          vec2 q = p;
          dst = circle(dst, q, 0.5, 0.55, 0.002);
      }
      {
          vec2 q = p;
          q = rotate(q, -iTime * PI / 6.0);
          const int n = 3;
          float angle = PI / float(n);
          q = rotate(q, floor(atan(q.x, q.y)/angle + 0.5) * angle);
          for(int i=0; i<n; i++) {
              dst = rectangle(dst, q, vec2(0.36, 0.36), vec2(0.36, 0.36), 0.0015);
              q = rotate(q, angle);
          }
      }
      {
          vec2 q = p;
          q = rotate(q, -iTime * PI / 6.0);
          const int n = 12;
          q = rotate(q, 2.0*PI/float(n)/2.0);
          float angle = 2.0*PI / float(n);
          for(int i=0; i<n; i++) {
              dst = circle(dst, q-vec2(0.0, 0.53), 0.001, 0.035, 0.004);
              dst = circle(dst, q-vec2(0.0, 0.53), 0.001, 0.001, 0.001);
              q = rotate(q, angle);
          }
      }
      {
          vec2 q = p;
          q = rotate(q, iTime * PI / 6.0);
          dst = radiation(dst, q, 0.25, 0.3, 12, 0.005);
      }
      {
          vec2 q = p;
          q = scale(q, sin(PI*iTime/1.0)*0.04+1.1);
          q = rotate(q, -iTime * PI / 6.0);
          for(float i=0.0; i<6.0; i++) {
              float r = 0.13-i*0.01;
              q = translate(q, vec2(0.1, 0.0));
              dst = circle(dst, q, r, r, 0.002);
              q = translate(q, -vec2(0.1, 0.0));
              q = rotate(q, -iTime * PI / 12.0);
          }
          dst = circle(dst, q, 0.04, 0.04, 0.004);
      }
      return pow(dst, 2.5) * vec3(1.0, 0.95, 0.8);
  }
  void main() { 
      vec2 uv = (vUv - 0.5) * 2.0;
      gl_FragColor = vec4(calc(uv), 1.0);;
      
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

