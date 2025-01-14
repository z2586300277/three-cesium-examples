import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js"

let noise = `
//	Simplex 4D Noise 
//	by Ian McEwan, Ashima Arts
//
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
float permute(float x){return floor(mod(((x*34.0)+1.0)*x, 289.0));}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float taylorInvSqrt(float r){return 1.79284291400159 - 0.85373472095314 * r;}

vec4 grad4(float j, vec4 ip){
  const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);
  vec4 p,s;

  p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;
  p.w = 1.5 - dot(abs(p.xyz), ones.xyz);
  s = vec4(lessThan(p, vec4(0.0)));
  p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www; 

  return p;
}

float snoise(vec4 v){
  const vec2  C = vec2( 0.138196601125010504,  // (5 - sqrt(5))/20  G4
                        0.309016994374947451); // (sqrt(5) - 1)/4   F4
// First corner
  vec4 i  = floor(v + dot(v, C.yyyy) );
  vec4 x0 = v -   i + dot(i, C.xxxx);

// Other corners

// Rank sorting originally contributed by Bill Licea-Kane, AMD (formerly ATI)
  vec4 i0;

  vec3 isX = step( x0.yzw, x0.xxx );
  vec3 isYZ = step( x0.zww, x0.yyz );
//  i0.x = dot( isX, vec3( 1.0 ) );
  i0.x = isX.x + isX.y + isX.z;
  i0.yzw = 1.0 - isX;

//  i0.y += dot( isYZ.xy, vec2( 1.0 ) );
  i0.y += isYZ.x + isYZ.y;
  i0.zw += 1.0 - isYZ.xy;

  i0.z += isYZ.z;
  i0.w += 1.0 - isYZ.z;

  // i0 now contains the unique values 0,1,2,3 in each channel
  vec4 i3 = clamp( i0, 0.0, 1.0 );
  vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );
  vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );

  //  x0 = x0 - 0.0 + 0.0 * C 
  vec4 x1 = x0 - i1 + 1.0 * C.xxxx;
  vec4 x2 = x0 - i2 + 2.0 * C.xxxx;
  vec4 x3 = x0 - i3 + 3.0 * C.xxxx;
  vec4 x4 = x0 - 1.0 + 4.0 * C.xxxx;

// Permutations
  i = mod(i, 289.0); 
  float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);
  vec4 j1 = permute( permute( permute( permute (
             i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))
           + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))
           + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))
           + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));
// Gradients
// ( 7*7*6 points uniformly over a cube, mapped onto a 4-octahedron.)
// 7*7*6 = 294, which is close to the ring size 17*17 = 289.

  vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;

  vec4 p0 = grad4(j0,   ip);
  vec4 p1 = grad4(j1.x, ip);
  vec4 p2 = grad4(j1.y, ip);
  vec4 p3 = grad4(j1.z, ip);
  vec4 p4 = grad4(j1.w, ip);

// Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  p4 *= taylorInvSqrt(dot(p4,p4));

// Mix contributions from the five corners
  vec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);
  vec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)            ), 0.0);
  m0 = m0 * m0;
  m1 = m1 * m1;
  return 49.0 * ( dot(m0*m0, vec3( dot( p0, x0 ), dot( p1, x1 ), dot( p2, x2 )))
               + dot(m1*m1, vec2( dot( p3, x3 ), dot( p4, x4 ) ) ) ) ;

}  
  `
let innerWidth = window.innerWidth; 
let innerHeight = window.innerHeight;
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 1, 1000);
camera.position.set(10, 10, 7).setLength(13);
let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);
window.addEventListener("resize", () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
});
new OrbitControls(camera, renderer.domElement);

let g = new THREE.CylinderGeometry(1, 1, 10, 200, 200, true);
let gu = { 
    time: { value: 0 },
    color1: { value: new THREE.Color(0x00ff00) },
    color2: { value: new THREE.Color(0xff0000) }
};
let m = new THREE.MeshBasicMaterial({
    depthTest: false,
    depthWrite: false,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.75,
    onBeforeCompile: shader => {
        shader.uniforms.time = gu.time;
        shader.uniforms.color1 = gu.color1;
        shader.uniforms.color2 = gu.color2;
        shader.vertexShader = `
        #define ss(a, b, c) smoothstep(a, b, c)
        uniform float time;
        varying vec3 nView;
        varying vec3 nNor;
        ${noise}
        vec3 getShaped(vec3 p) {
          float curve = ss(0., 0.2, uv.y) + ss(0.5, 1., uv.y) * 2.5;
          p.xz *= 0.75 + curve;
          return p;
        }
        vec3 getNoised(vec3 p) {
          float t = time * 0.5;
          float n = snoise(vec4(p * 0.4 - vec3(0, t, 0), 3.14)) * (0.5 + 0.5 * uv.y);
          p += normal * n;
          return p;
        }
        vec3 rotY(vec3 p, float a) {
          float s = sin(a), c = cos(a);
          p.xz *= mat2(c, -s, s, c);
          return p;
        }
        ${shader.vertexShader}
      `.replace(
            `#include <begin_vertex>`,
            `#include <begin_vertex>
          vec3 pos = getNoised(getShaped(position));
          vec3 pos2 = getNoised(getShaped(rotY(position, 3.1415926 * 0.001)));
          vec3 pos3 = getNoised(getShaped(position + vec3(0., 0.001, 0.)));
          transformed = pos;
          nNor = normalMatrix * cross(normalize(pos2 - pos), normalize(pos3 - pos));
        `
        ).replace(
            `#include <fog_vertex>`,
            `#include <fog_vertex>
          nView = normalize(mvPosition.xyz);
        `
        );
        shader.fragmentShader = `
        #define ss(a, b, c) smoothstep(a, b, c)
        varying vec3 nView;
        varying vec3 nNor;
        uniform vec3 color1;
        uniform vec3 color2;
        ${shader.fragmentShader}
      `.replace(
            `#include <color_fragment>`,
            `#include <color_fragment>
          diffuseColor.rgb = mix(color1, color2, pow(vUv.y, 2.));
          float alpha = ss(0., 0.2, vUv.y) - ss(0.8, 1., vUv.y);
          vec3 nor = nNor * (gl_FrontFacing ? 1. : -1.);
          float vAlpha = abs(dot(normalize(nView), nor));
          float angleAlpha = (1. - vAlpha) * 0.9 + 0.1;
          float totalAlpha = clamp(alpha * 0.5 + angleAlpha * 0.5, 0., 1.) * alpha;
          diffuseColor.rgb += vec3(1) * totalAlpha * 0.1;
          diffuseColor.a *= totalAlpha;
        `
        );
    }
});
m.defines = { "USE_UV": "" } // to use vUv
let o = new THREE.Mesh(g, m);
scene.add(o);

let gui = new GUI();
gui.addColor(gu.color1, "value").name("Color 1");
gui.addColor(gu.color2, "value").name("Color 2");

let clock = new THREE.Clock();
renderer.setAnimationLoop(() => {
    gu.time.value = clock.getElapsedTime();
    renderer.render(scene, camera);
});