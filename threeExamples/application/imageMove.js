import * as THREE from 'three';

const [w, h] = [innerWidth, innerHeight]
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 1000);
camera.position.z = 3;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

const loader = new THREE.TextureLoader()
const urls = [
    FILE_HOST + 'images/wx_star.png',
    FILE_HOST + 'images/QQ.png',
    FILE_HOST + 'images/nico.jpg',
]
const tex = urls.map(u => loader.load(u));
tex[2].wrapS = tex[2].wrapT = THREE.RepeatWrapping; tex[2].repeat.set(.1, .1);

function R(g, t) {
    const m = new THREE.MeshMatcapMaterial({ matcap: t, transparent: true });
    m.onBeforeCompile = sh => {
        sh.vertexShader = sh.vertexShader
            .replace('#include <common>', `\n#include <common>\nvarying vec2 vUv;`)
            .replace('#include <fog_vertex>', `\n#include <fog_vertex>\nvUv=uv;`);
        sh.fragmentShader = sh.fragmentShader
            .replace('#include <common>', `\n#include <common>\nvarying vec2 vUv;\nfloat sdf(vec2 c,vec2 s,float r){return length(max(abs(c)-s+r,0.0))-r;}`)
            .replace('#include <dithering_fragment>', `\n#include <dithering_fragment>\nfloat d=sdf(vUv-vec2(.5),vec2(.5),.08);\nfloat a=1.-smoothstep(0.,.002,d);\ngl_FragColor=vec4(outgoingLight,a);`);
    };
    return new THREE.Mesh(g, m);
}

const scale = 1.25;
const g = new THREE.PlaneGeometry(1 * scale, 1.4 * scale);
const group = new THREE.Group();
[[-1, 0, 1, .1], [0, 0, .5, 0], [1, 0, 1, -.1]].forEach((p, i) => {
    const m = R(g, tex[i]);
    m.position.set(p[0] * scale, p[1] * scale, p[2] * scale);
    if (p[3]) m.rotation.y = Math.PI * p[3];
    group.add(m);
});
scene.add(group);

const mouse = new THREE.Vector2(), clock = new THREE.Clock();
addEventListener('mousemove', e => { mouse.x = (e.clientX / w) * 2 - 1; mouse.y = -(e.clientY / h) * 2 + 1 });

renderer.setAnimationLoop(() => {
    const d = clock.getDelta(), x = mouse.x * -0.3, y = mouse.y * .3;
    group.rotation.y += (x - group.rotation.y) * 3 * d;
    group.rotation.x += (y - group.rotation.x) * 3 * d;
    renderer.render(scene, camera);
});