import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 100000)

camera.position.set(157, 545, -987)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

renderer.setClearColor(0x000000, 0)

renderer.setPixelRatio(window.devicePixelRatio * 2)

new OrbitControls(camera, renderer.domElement)

window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)

    camera.aspect = box.clientWidth / box.clientHeight

    camera.updateProjectionMatrix()

}

box.appendChild(renderer.domElement)

const dirLight = new THREE.DirectionalLight(0xffffff, 3.8)

dirLight.position.set(83, 61, -183)

dirLight.target.position.set(10, -11, -194)

scene.add(dirLight)

const pointLight = new THREE.PointLight(0xffffff, 2)

pointLight.position.set(-60, 182, -98)

scene.add(pointLight)

let model = null

// 加载模型
new FBXLoader().load(HOST + '/files/model/city.FBX', (object3d) => {

    scene.add(object3d)

    object3d.scale.set(0.04, 0.04, 0.04)

    object3d.position.set(224, -9, -49)

    model = object3d

    modelBlendShader(object3d, box)

})

// 渲染
animate()

function animate() {

    model && model.render?.()

    renderer.render(scene, camera)

    requestAnimationFrame(animate)

}

/* 混合着色 */
function modelBlendShader(model) {

    let materials = []

    model.traverse(c => c.isMesh && materials.push(c.material))

    materials = [... new Set(materials)]

    const uniforms = {

        innerCircleWidth: { value: 480, type: 'number', unit: 'float' },

        circleWidth: { value: 160, type: 'number', unit: 'float' },

        circleMax: { value: 940, type: 'number', unit: 'float' },

        circleSpeed: { value: 1.5, type: 'number', unit: 'float' },

        diff: { value: new THREE.Color(0x6edbe8), type: 'color', unit: 'vec3' },

        color3: { value: new THREE.Color(0x1919f9), type: 'color', unit: 'vec3' },

        center: { value: new THREE.Vector3(-1, 0, 0), type: 'position', unit: 'vec3' },

        intensity: { value: 4, type: 'number', unit: 'float' },

        isDisCard: { value: false, type: 'bool', unit: 'bool' },

    }

    const glslProps = {

        vertexHeader: `
            varying vec2 vUv;
            varying vec3 v_position;
            void main() {
                vUv = uv;
                v_position = position;
        `,

        fragHeader: Object.keys(uniforms).map(i => 'uniform ' + uniforms[i].unit + ' ' + i + ';').join('\n') + '\n' + 'varying vec3 v_position; varying vec2 vUv;\n',

        fragBody: `
            float dis = length(v_position - center);
            vec4 diffuseColor;
            if(dis < (innerCircleWidth + circleWidth) && dis > innerCircleWidth) {
                float r = (dis - innerCircleWidth) / circleWidth;
                #ifdef USE_MAP
                    vec3 textureColor = texture2D(map, vUv).rgb;
                    if(isDisCard && textureColor.r < 0.1 && textureColor.g < 0.1  && textureColor.b < 0.1 ) discard;
                #endif
                diffuseColor = vec4( mix(diff, color3, r) * vec3(intensity, intensity, intensity)  , opacity);
            }
            else {
                if(isDisCard)  discard ;
                else diffuseColor = vec4( diffuse, opacity );
            }
        `

    }

    materials.forEach(material => {

        material.onBeforeCompile = (shader) => {

            Object.keys(uniforms).forEach((key) => shader.uniforms[key] = uniforms[key])

            shader.vertexShader = shader.vertexShader.replace(`void main() {`, glslProps.vertexHeader)

            shader.fragmentShader = shader.fragmentShader.replace(/#include <common>/, glslProps.fragHeader + '\n#include <common>\n')

            shader.fragmentShader = shader.fragmentShader.replace('vec4 diffuseColor = vec4( diffuse, opacity );', glslProps.fragBody)

        }

        material.needsUpdate = true

    })

    model.render = () => uniforms.innerCircleWidth.value < uniforms.circleMax.value ? uniforms.innerCircleWidth.value += uniforms.circleSpeed.value : uniforms.innerCircleWidth.value = 0

}
