import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

const DOM = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, DOM.clientWidth / DOM.clientHeight, 0.1, 1000)

camera.position.set(0, 10, 10)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(DOM.clientWidth, DOM.clientHeight)

DOM.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

window.onresize = () => {

    renderer.setSize(DOM.clientWidth, DOM.clientHeight)

    camera.aspect = DOM.clientWidth / DOM.clientHeight

    camera.updateProjectionMatrix()

}

scene.add(new THREE.AmbientLight(0xffffff, 8))

const mesh = new THREE.Mesh(new THREE.BoxGeometry(4, 4, 4), new THREE.MeshBasicMaterial({ color: 0xffffff }));

scene.add(mesh);

// GUI 对象
const GUI = new dat.GUI()

const fileList = new Array(6).fill().map((_, i) => `https://z2586300277.github.io/3d-file-server/files/glsl/${i}.frag`)

GUI.add({ url: fileList[0] }, 'url', fileList).onChange((url) => changeShader(url))

changeShader(fileList[5])

let shader = null

animate()

// 渲染 
function animate() {

    shader && (shader.uniforms.u_time.value += 0.02)

    renderer.render(scene, camera)

    requestAnimationFrame(animate)

}

async function changeShader(url) {

    const str = await fetch(url).then(res => res.text())

    shader = {

        uniforms: THREE.UniformsUtils.merge([

            THREE.ShaderLib['phong'].uniforms,

            {
                u_resolution: {
                    type: 'v2',
                    value: new THREE.Vector2(DOM.clientWidth, DOM.clientHeight)
                },

                u_time: {
                    type: 'f',
                    value: 0.0
                },

                u_mouse: {
                    type: 'v2',
                    value: new THREE.Vector2(0, 0)
                }

            }

        ]),

        side: THREE.DoubleSide,

        vertexShader: `
            varying vec2 vUv;
            void main() {
                vUv = uv;
                vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
                gl_Position = projectionMatrix * mvPosition;
            }
        `,

        fragmentShader: str,

    }

    shader.fragmentShader = shader.fragmentShader.replace(/gl_FragCoord/, 'vUv * u_resolution.xy')

    shader.fragmentShader = shader.fragmentShader.replace(/uniform float u_time;/, `
        uniform float u_time;
        varying vec2 vUv;
    `)

    const material = new THREE.ShaderMaterial(shader);

    mesh.material.dispose()

    mesh.material = material

}

