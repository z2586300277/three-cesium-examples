import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(0, 0, 20)

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

scene.add(new THREE.AmbientLight(0xffffff, 2), new THREE.AxesHelper(1000))

/* 热力图实现 */
const arr = [[0., 0., 10.], [.2, .6, 5.], [.25, .7, 8.], [.33, .9, 5.], [.35, .8, 6.], [0.017, 5.311, 6.000], [-.45, .8, 4.], [-.2, -.6, 5.], [-.25, -.7, 8.], [-.33, -.9, 8.], [.35, -.45, 10.], [-.1, -.8, 10.], [.33, -.3, 5.], [-.35, .75, 6.], [.6, .4, 10.], [-.4, -.8, 4.], [.7, -.3, 6.], [.3, -.8, 8.]].map(i => new THREE.Vector3(...i))

const uniforms1 = {

    HEAT_MAX: { value: 10, type: 'number', unit: 'float' },

    PointRadius: { value: 0.42, type: 'number', unit: 'float' },

    PointsCount: { value: arr.length, type: 'number-array', unit: 'int' }, // 数量

    c1: { value: new THREE.Color(0x000000), type: 'color', unit: 'vec3' },

    c2: { value: new THREE.Color(0x000000), type: 'color', unit: 'vec3' },

    uvY: { value: 1, type: 'number', unit: 'float' },

    uvX: { value: 1, type: 'number', unit: 'float' },

    opacity: { value: 1, type: 'number', unit: 'float' }

}

const gui = new GUI()

gui.add(uniforms1.HEAT_MAX, 'value', 0, 10).name('HEAT_MAX')

gui.add(uniforms1.PointRadius, 'value', 0, 1).name('PointRadius')

gui.add(uniforms1.uvY, 'value', 0, 1).name('uvY')

gui.add(uniforms1.uvX, 'value', 0, 1).name('uvX')

gui.add(uniforms1.opacity, 'value', 0, 1).name('opacity')

gui.addColor(uniforms1.c1, 'value').name('c1')

gui.addColor(uniforms1.c2, 'value').name('c2')

const uniforms2 = {

    Points: { value: arr, type: 'vec3-array', unit: 'vec3' }

}

const uniforms = {

    ...uniforms1,

    ...uniforms2

}

const vertexShader = `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`

const getFragmentShader = () => 'precision highp float;\n' + 'varying vec2 vUv; \n' +

    Object.keys(uniforms1).map(i => 'uniform ' + uniforms1[i].unit + ' ' + i + ';')
        .join('\n')

    + '\nuniform vec3 Points['
    + uniforms1.PointsCount.value + '];'
    +
    `
vec3 gradient(float w, vec2 uv) {
    w = pow(clamp(w, 0., 1.) * 3.14159 * .5, .9);
    return vec3(sin(w), sin(w * 2.), cos(w))* 1.1 + mix(c1, c2, w) * 1.1; 
}
void main()
{
    vec2 uv = vUv;
    uv.xy *= vec2(uvX, uvY);
    float d = 0.;
    for (int i = 0; i < PointsCount; i++) {
        vec3 v = Points[i];
        float intensity = v.z / HEAT_MAX;
        float pd = (1. - length(uv - v.xy) / PointRadius) * intensity;
        d += pow(max(0., pd), 2.);
    }
    gl_FragColor = vec4(gradient(d, uv), opacity);
} `

const shaderMaterial = new THREE.ShaderMaterial({

    uniforms,

    vertexShader,

    fragmentShader: getFragmentShader(),

    transparent: true


})

const plane = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), shaderMaterial)

scene.add(plane)

/* 循环 */
setInterval(() => {

    arr.pop()

    arr.unshift(new THREE.Vector3(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 10))

    uniforms.PointsCount.value = arr.length

    shaderMaterial.fragmentShader = getFragmentShader()

    shaderMaterial.needsUpdate = true

}, 200)
