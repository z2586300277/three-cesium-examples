import * as THREE from "three";
import { ImprovedNoise } from 'three/examples/jsm/Addons.js';
// 700stars留念 共筑 共享
import {  DirectionalLight, AmbientLight, Mesh, PlaneGeometry, MeshLambertMaterial, Vector2,Color } from 'three';
let fbm = `
    // https://github.com/yiwenl/glsl-fbm/blob/master/3d.glsl
    #define NUM_OCTAVES 6

    float mod289(float x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
    vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}
    vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}

    float noise(vec3 p){
        vec3 a = floor(p);
        vec3 d = p - a;
        d = d * d * (3.0 - 2.0 * d);

        vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
        vec4 k1 = perm(b.xyxy);
        vec4 k2 = perm(k1.xyxy + b.zzww);

        vec4 c = k2 + a.zzzz;
        vec4 k3 = perm(c);
        vec4 k4 = perm(c + 1.0);

        vec4 o1 = fract(k3 * (1.0 / 41.0));
        vec4 o2 = fract(k4 * (1.0 / 41.0));

        vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
        vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

        return o4.y * d.y + o4.x * (1.0 - d.y);
    }


    float fbm(vec3 x) {
      float v = 0.0;
      float a = 0.5;
      vec3 shift = vec3(100);
      for (int i = 0; i < NUM_OCTAVES; ++i) {
        v += a * noise(x);
        x = x * 2.0 + shift;
        a *= 0.5;
      }
      return v;
    }
  `;
let renderer,scene,camera
let init_scene = async () => {
    const box = document.getElementById("box");
    console.log(box);
    

 scene = new THREE.Scene();

 camera = new THREE.PerspectiveCamera(
    60,
  box.clientWidth / box.clientHeight,
  0.1,
  1000
);
let vHeight = 3;
camera.position.set(30, vHeight + 2, 20).setLength(15);
scene.background = new Color(0.5, 1, 0.875);
// scene.fog = new Fog(scene.background, 20, 45);
// camera.position.set(20, 50, 0);
 renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true,
  logarithmicDepthBuffer: true,
});

renderer.setSize(box.clientWidth, box.clientHeight);
box.appendChild(renderer.domElement);
// new OrbitControls(camera, renderer.domElement);

window.onresize = () => {
  renderer.setSize(box.clientWidth, box.clientHeight);
  camera.aspect = box.clientWidth / box.clientHeight;
  camera.updateProjectionMatrix();
};
    let light = new DirectionalLight(0xffffff, 0.25);
    light.position.setScalar(1);
    scene.add(light, new AmbientLight(0xffffff, 0.75));
};

let terrain;
let plane, material;
const load_terrain = () => {
    let perlin = new ImprovedNoise();
    plane = new PlaneGeometry(50, 50, 500, 500);
    plane.rotateX(-Math.PI / 2);
    let { position } = plane.attributes;
    let uv = plane.attributes.uv;
    let v2 = new Vector2();
    for (let i = 0; i < position.count; i++) {
        v2.fromBufferAttribute(uv, i).multiplyScalar(15);
        let n = perlin.noise(v2.x, v2.y, 0.314);
        n = Math.abs(n);
        n = Math.pow(n, 3);
        position.setY(i, Math.min(n * 35, 10));
    }
    plane.computeVertexNormals();
    material = new MeshLambertMaterial({
        color: 0xface8d,
        // wireframe:true
    });
    material.onBeforeCompile = (shader) => {
        // shader.uniforms.time = globalUniforms.time;
        shader.vertexShader = `
        varying vec3 vPos;
        ${shader.vertexShader}
        `.replace(`#include <begin_vertex>`, `#include <begin_vertex>
            vPos = position;`);
        shader.fragmentShader = `
            #define ss(a,b,c) smoothstep(a,b,c)
            uniform float time;
            varying vec3 vPos;
            ${fbm}
            ${shader.fragmentShader}
        `
            .replace(`vec4 diffuseColor = vec4( diffuse, opacity );`, `
                vec3 col = diffuse;

                float d = noise(vPos * vec3(0.05, 1, 0.05));
                col = mix(col + 0.2, vec3(1, 0.2, 0.01), d);

                vec3 strokePos = vPos * vec3(0.1, 3., 0.1);
                d = fbm(strokePos);
                float e = fwidth(strokePos.y);
                col = mix(col * (0.5 + 0.5 * ss(2., 8., vPos.y)), col, ss(0.4 - e, 0.4, abs(d)));

                col = mix(diffuse + 0.1, col, ss(0.5, 1.5, vPos.y));

                // wind
                float dw = noise(vec3(vPos.x, vPos.y, vPos.z + time) * vec3(0.1, 10, 0.1));
                d = ss(0.1, 0., abs(dw));
                d = max(d, ss(1., 0., abs(dw)));
                d = max(d, pow(abs(noise(vPos - vec3(0, 0, time))), 1.));
                d *= smoothstep(2., -0.5, abs(vPos.y));
                col = mix(col, diffuse + 0.25, d);

                vec4 diffuseColor = vec4( col, opacity );
                `)
            .replace(`#include <dithering_fragment>`, `gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(0.5, 1, 0.875), pow(ss(7., 10., vPos.y), 0.5));`);
    };
    terrain = new Mesh(plane, material);
    scene.add(terrain);
};
// 定时生成新地形并平滑过渡
const generate_new_terrain_1 = () => {
    let perlin = new ImprovedNoise();
    let new_position = plane.attributes.position.clone();
    let uv = plane.attributes.uv;
    let v2 = new Vector2();
    let random = Math.random();
    for (let i = 0; i < new_position.count; i++) {
        v2.fromBufferAttribute(uv, i).multiplyScalar(15);
        let n = perlin.noise(v2.x, v2.y, random);
        n = Math.abs(n);
        n = Math.pow(n, 3);
        new_position.setY(i, Math.min(n * 35, 10));
    }
    new_position.needsUpdate = true;
    // const old_position_array = plane.attributes.position.array
    const new_position_array = new_position.array;
    return new_position_array;
};
// 地形插值
import { gsap } from 'gsap';
const new_fun = () => {
    const position = plane.attributes.position;
    const position_array = position.array;
    const new_position_array = generate_new_terrain_1;
    gsap.to(position_array, {
        duration: 1.5, // 动画时长
        ease: "power2.out", // 缓动效果
        endArray: new_position_array, // 动画目标值
        onUpdate: () => {
            position.needsUpdate = true; // 通知 Three.js 属性已更新
        },
    });
};
const render = () => {
    renderer.render(scene, camera);
    requestAnimationFrame(render);
};
init_scene();
load_terrain();
setInterval(() => {
    new_fun();
}, 2000);
render();

// 文字

const ele = ()=>{
    const box = document.getElementById("box");
    box.style.position = 'relative'
    const div = document.createElement('div')
    div.style.position ='absolute'
    div.style.top ='0px'
    div.style.width ='100%'
    div.style.height ='100%'
    div.style.display = 'grid'
    div.style.placeItems = 'center'
    div.innerHTML = `
        <div style="width:40%;height:35%;display:grid;place-items:center;position:relative;">
            <div style="font-size:calc(45px);white-space: nowrap;text-shadow: 2px 3px 1px rgb(155,155,155);">共筑3D世界,共享3D世界</div>
            <div style="font-size:calc(45px);white-space: nowrap;text-shadow: 2px 3px 1px rgb(155,155,155);">Build & Share 3D World Together</div>
               <div style="position:absolute;right:0px;bottom:0px;">
                    for 'three-cesium-examples' 700 stars
                </div>
            </div>

    `
    box.appendChild(div)
}

ele()