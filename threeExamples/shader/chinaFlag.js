import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(0.5, -0.5, 3)

const renderer = new THREE.WebGLRenderer()

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)

    camera.aspect = box.clientWidth / box.clientHeight

    camera.updateProjectionMatrix()

}

const flagTexture = new THREE.TextureLoader().load(GLOBAL_CONFIG.getFileUrl("images/chinaFlag.jpg"))

const flagMaterial = new THREE.RawShaderMaterial({

    vertexShader: `uniform mat4 projectionMatrix;
        uniform mat4 modelMatrix;
        uniform mat4 viewMatrix;
        uniform vec2 uFrequency;
        uniform float uTime;
        uniform float uStrength;
        attribute vec3 position;
        attribute vec2 uv;
        varying float vDark;
        varying vec2 vUv;
        void main() {
            vec4 modelPosition = modelMatrix * vec4(position, 1.0);
            float xFactor = clamp((modelPosition.x + 1.25) / 2.0, 0.0, 2.0); 
            float vWave = sin(modelPosition.x * uFrequency.x - uTime ) * xFactor * uStrength ;
            vWave += sin(modelPosition.y * uFrequency.y - uTime) * xFactor * uStrength * 0.5;
            modelPosition.y += sin(modelPosition.x * 2.0 + uTime * 0.5) * 0.05 * xFactor;
            modelPosition.z += vWave;
            vec4 viewPosition = viewMatrix * modelPosition;
            vec4 projectedPosition = projectionMatrix * viewPosition;
            gl_Position = projectedPosition;
            vUv = uv;
            vDark = vWave;
        }`,

    fragmentShader: `precision mediump float;
        varying float vDark;
        uniform sampler2D uTexture;
        varying vec2 vUv;
        void main(){
            vec4 textColor = texture2D(uTexture, vUv);
            textColor.rgb *= vDark + 0.85;
            gl_FragColor = textColor;
        }`,

    side: THREE.DoubleSide,

    uniforms: {
        
        uFrequency: { value: new THREE.Vector2(3, 3) },
        
        uTime: { value: 0 },
        
        uTexture: { value: flagTexture },
        
        uStrength: { value: 0.2 }
        
    }

})

const flagGeometry = new THREE.BoxGeometry(3, 2, 0.025, 64, 64)

const flagMesh = new THREE.Mesh(flagGeometry, flagMaterial)

scene.add(flagMesh)

animate()

function animate() {

    flagMaterial.uniforms.uTime.value += 0.06

    renderer.render(scene, camera)

    requestAnimationFrame(animate)

}