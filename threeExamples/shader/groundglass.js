import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(0, 0, 1)

const renderer = new THREE.WebGLRenderer()

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

animate()

function animate() {

    requestAnimationFrame(animate)

    renderer.render(scene, camera)

}

window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)

    camera.aspect = box.clientWidth / box.clientHeight

    camera.updateProjectionMatrix()

}

const vertexShader = ` 
    varying vec2 vUv;
    void main(){
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}`

const fragmentShader = `
    varying vec2 vUv;
    uniform sampler2D tDiffuse;
    uniform vec2 vScreenSize;
    uniform float fRadius;

    float rand(vec2 co) {
    float a = fract(dot(co, vec2(2.067390879775102, 12.451168662908249))) - 0.5;
    float s = a * (6.182785114200511 + a * a * (-38.026512460676566 + a * a * 53.392573080032137));
    float t = fract(s * 43758.5453);
    return t;
    }

    void main() {
    float x = (vUv.x * vScreenSize.x) + rand(vUv) * fRadius * 2.0 - fRadius;
    float y = (vUv.y * vScreenSize.y) + rand(vec2(vUv.y, vUv.x)) * fRadius * 2.0 - fRadius;
    vec4 textureColor = texture2D(tDiffuse, vec2(x, y) / vScreenSize);
    gl_FragColor = textureColor;
}`

const uniforms = {

    tDiffuse: { type: 't', value: new THREE.TextureLoader().load(HOST + 'files/author/flowers-10.jpg') },

    vScreenSize: { type: "v2", value: new THREE.Vector2(window.innerWidth, window.innerHeight) },

    fRadius: { type: "f", value: 20.0 },

}

const material = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader });

const geometry = new THREE.PlaneGeometry();

const mesh = new THREE.Mesh(geometry, material);

scene.add(mesh);

var gui = new dat.GUI();
gui.add(uniforms['fRadius'], 'value', 1.0, 100.0).step(1.0).name('mosaicScale');