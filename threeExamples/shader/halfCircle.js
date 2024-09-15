import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Stats from 'three/examples/jsm/libs/stats.module.js'

var scene, camera, renderer, clock, controller, stats
var shader_material, rayMarchingFireMaterial, shaderMaterial
const vs = `
varying vec2 vUv;
varying vec3 vPosition;

void main(){
    vec4 modelPosition=modelMatrix*vec4(position,1.);
    vec4 viewPosition=viewMatrix*modelPosition;
    vec4 projectedPosition=projectionMatrix*viewPosition;
    gl_Position=projectedPosition;
    
    vUv=uv;
    vPosition=position;
}
`;

const fs = `
      #define PI 3.1415926535897932384626433832795
      varying vec2 vUv;

      uniform float uTime;

      vec2 rotatePoint(vec2 center,float angle,vec2 p) {
        float s = sin(angle);
        float c = cos(angle);

        // translate point back to origin:
        p.x -= center.x;
        p.y -= center.y;

        // rotate point
        float xNew = p.x * c - p.y * s;
        float yNew = p.x * s + p.y * c;

        // translate point back:
        p.x = xNew + center.x;
        p.y = yNew + center.y;
        return p;
      }

      float angleVec(vec2 a_, vec2 b_) {
          vec3 a = vec3(a_, 0);
          vec3 b = vec3(b_, 0);
          float dotProd = dot(a,b); 
          vec3 crossprod = cross(a,b);
          float crossprod_l = length(crossprod);
          float lenProd = length(a)*length(b);
          float cosa = dotProd/lenProd;
          float sina = crossprod_l/lenProd;
          float angle = atan(sina, cosa);
          
          if(dot(vec3(0,0,1), crossprod) < 0.0) 
              angle=90.0;
          return (angle * (180.0 / PI));
      }

      void main(){
        vec2 center = vec2(0.5, 0.5);
        float angleStela = 180.0;
        float radius = 0.5;
        float startAlpha = 0.0;
        float endAlpha = 0.5;
        vec3 color = vec3(0.0, 1.0, 0.0);
        float alpha = 0.0;
        
        float angle = (-uTime * 2.0);

        vec2 lineEnd =  vec2(center.x, center.y + radius);
        float distanceToCenter = distance(center, vUv.xy);	
        lineEnd = rotatePoint(center, angle, lineEnd);
        float angleStelaToApply = angleVec(normalize(lineEnd - center), normalize(vUv - center));
        if (angleStelaToApply < angleStela && distanceToCenter < radius) {
          float factorAngle = 1.0 - angleStelaToApply/angleStela;
          float finalFactorAngle = factorAngle * endAlpha;
          if (finalFactorAngle > startAlpha) {
            alpha = finalFactorAngle;
          }
        }

        gl_FragColor=vec4(color, alpha);
      }
      `

init();
animate();

// - Functions -
function init() {
  scene = new THREE.Scene();
  clock = new THREE.Clock();
  camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(10, 10, 10)
  renderer = new THREE.WebGLRenderer({
    antialias: true, // 开启抗锯齿处理
    alpha: true,
  });

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio)

  createRayMarchingFireMaterial();

  var axisHelper = new THREE.AxesHelper(10);
  scene.add(axisHelper);



  stats = new Stats()
  document.body.appendChild(stats.dom);

  // --------
  var geometry = new THREE.PlaneGeometry(5, 5);
  var cube = new THREE.Mesh(geometry, rayMarchingFireMaterial);
  scene.add(cube);
  // --------

  controller = new OrbitControls(camera, renderer.domElement);
  document.body.appendChild(renderer.domElement);
  window.onresize = onResize;
}

function createRayMarchingFireMaterial() {
  rayMarchingFireMaterial = new THREE.ShaderMaterial({
    transparent: true,
    vertexShader: vs,
    fragmentShader: fs,
    side: THREE.DoubleSide,
    uniforms: {
      uTime: {
        value: 0,
      },
      uMouse: {
        value: new THREE.Vector2(0, 0),
      },
      uResolution: {
        value: new THREE.Vector2(512, 512)
      },
      uVelocity: {
        value: 3,
      },
      uColor1: {
        value: new THREE.Color('#ff801a'),
      },
      uColor2: {
        value: new THREE.Color('#ff5718'),
      },
    },
  });
  shaderMaterial = rayMarchingFireMaterial;
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  stats.update();
  controller.update(clock.getDelta());
  if (rayMarchingFireMaterial) {
    rayMarchingFireMaterial.uniforms.uTime.value += 0.01
  }
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}