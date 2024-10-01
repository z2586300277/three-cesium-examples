import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'
/* heatmap.js 自行安装module 方式引入  此处我为src 方式引入  */

const DOM = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, DOM.clientWidth / DOM.clientHeight, 0.1, 1000)

camera.position.set(0, 40, 40)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(DOM.clientWidth, DOM.clientHeight)

DOM.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

scene.add(new THREE.AxesHelper(500), new THREE.AmbientLight(0xffffff, 3))

window.onresize = () => {

    renderer.setSize(DOM.clientWidth, DOM.clientHeight)

    camera.aspect = DOM.clientWidth / DOM.clientHeight

    camera.updateProjectionMatrix()

}

animate()

// 渲染 
function animate() {

    renderer.render(scene, camera)

    requestAnimationFrame(animate)

}

const getRandom = (max, min) => Math.round((Math.random() * (max - min + 1) + min) * 10) / 10

var heatmap = h337.create({
    container: document.createElement('div'),
    width: 256,
    height: 256,
    blur: '0.8',
    radius: 10
});

var i = 0, max = 10, data = [];
while (i < 2000) {
    data.push({ x: getRandom(1, 256), y: getRandom(1, 256), value: getRandom(1, 6) });
    i++;
}

heatmap.setData({
    max: max,
    data: data
});

const texture = new THREE.CanvasTexture(heatmap._renderer.canvas);
const geometry = new THREE.PlaneGeometry(50, 50, 1000, 1000);
geometry.rotateX(-Math.PI * 0.5);

const material = new THREE.ShaderMaterial({
    uniforms: {
        heightMap: { value: texture },
        heightRatio: { value: 5 }
    },
    vertexShader: `	uniform sampler2D heightMap;
			uniform float heightRatio;
			varying vec2 vUv;
			varying float hValue;
			varying vec3 cl;
			void main() {
			    vUv = uv;
			    vec3 pos = position;
		        cl = texture2D(heightMap, vUv).rgb;
		        hValue = texture2D(heightMap, vUv).r;
		        pos.y = hValue * heightRatio;
		        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos,1.0);
		    }`,
    fragmentShader: `varying float hValue;
			varying vec3 cl;
			void main() {
		 		float v = abs(hValue - 1.);
		 		gl_FragColor = vec4(cl, .8 - v * v) ; 
		    }`,
    transparent: true,
})

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

new dat.GUI().add(mesh.material.uniforms.heightRatio, "value", 1, 15).name("heightRatio")
