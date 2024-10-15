import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(0, 0, 20)

const renderer = new THREE.WebGLRenderer()

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

const composer = new EffectComposer(renderer);

const renderPass = new RenderPass(scene, camera);

composer.addPass(renderPass);

const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 5, 1.2, 0)

composer.addPass(bloomPass);

window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)

    camera.aspect = box.clientWidth / box.clientHeight

    camera.updateProjectionMatrix()

}

class HeartCurve extends THREE.Curve {
    constructor(scale = 1) {
        super();
        this.scale = scale;
    }

    getPoint(a, optionalTarget = new THREE.Vector3()) {
        const t = a * Math.PI * 2;
        const tx = 16 * Math.pow(Math.sin(t), 3);
        const ty = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
        const tz = 0;

        return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
    }
}

const geometry = new THREE.TubeGeometry(new HeartCurve(0.5), 100, 0.1, 30, false);

const vertexShader = `
    varying vec2 vUv;
    void main(void) {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }`;
const fragmentShader = `
    varying vec2 vUv;
    uniform float uSpeed;
    uniform float uTime;
    uniform vec2 uFade;
    uniform vec3 uColor;
    uniform float uDirection;
    void main() {
    vec3 color =uColor;
    float s=0.0;
    float v=0.0;
    if(uDirection==1.0){
    v=vUv.x;
    s=-uTime*uSpeed;
    }else{
    v= -vUv.x;
    s= -uTime*uSpeed;
    }
    float d=mod(  (v + s) ,1.0) ;
    if(d>uFade.y)discard;
    else{
    float alpha = smoothstep(uFade.x, uFade.y, d);
    if (alpha < 0.0001) discard;
    gl_FragColor =  vec4(color,alpha);
    }
} `;

const getMaterial = (uniforms) => {
    return new THREE.ShaderMaterial({
        uniforms,
        vertexShader,
        fragmentShader,
        transparent: true
    });
}

const material1 = getMaterial({
    uColor: { value: new THREE.Color('pink') },
    uTime: { value: 0 },
    uDirection: { value: 1 },
    uSpeed: { value: 1 },
    uFade: { value: new THREE.Vector2(0, 0.5) },
    uDirection: { value: 1 },
    uSpeed: { value: 1 }
})

const material2 = getMaterial({
    uColor: { value: new THREE.Color('#00BFFF') },
    uTime: { value: 0.5 },
    uDirection: { value: 1 },
    uSpeed: { value: 1 },
    uFade: { value: new THREE.Vector2(0, 0.5) },
    uDirection: { value: 1 },
    uSpeed: { value: 1 }
})


const mesh = new THREE.Mesh(geometry, material1)
const mesh2 = new THREE.Mesh(geometry, material2)

scene.add(mesh);

scene.add(mesh2)


animate()

function animate() {

    material1.uniforms.uTime.value += 0.002
    material2.uniforms.uTime.value += 0.002

    requestAnimationFrame(animate)

    renderer.render(scene, camera)

    composer.render();

}