import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const box = document.getElementById('box')
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000)
camera.position.set(0, 0, 10)
const renderer = new THREE.WebGLRenderer()
renderer.setSize(box.clientWidth, box.clientHeight)
box.appendChild(renderer.domElement)
new OrbitControls(camera, renderer.domElement)
scene.add(new THREE.AxesHelper(50000))
window.onresize = () => {
    renderer.setSize(box.clientWidth, box.clientHeight)
    camera.aspect = box.clientWidth / box.clientHeight
    camera.updateProjectionMatrix()
}

const { mesh, uniforms } = getShaderMesh()
scene.add(mesh)

animate()
function animate() {
    uniforms.iTime.value += 0.01
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
}

function getShaderMesh() {

    const uniforms = {
        iTime: {
            value: 0
        },
        iResolution: {
            value: new THREE.Vector2(1900, 1900)
        },
        iChannel0: {
            value: window.iChannel0
        }
    }

    const geometry = new THREE.PlaneGeometry(20, 20);
    const material = new THREE.ShaderMaterial({
        uniforms,
        side: 2,
        depthWrite: false,
        transparent: true,
        vertexShader: `
            varying vec3 vPosition;
            varying vec2 vUv;
            void main() { 
                vUv = uv; 
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
        uniform float ratio;

        float PI = 3.1415926;
		uniform float iTime;
		uniform vec2 iResolution; 
		varying vec2 vUv;
        
		void main() { 
            vec2 p = (vUv - 0.5) * 2.0;
            float tau = PI * 2.0;
            float a = atan(p.x,p.y);
            float r = length(p)*0.75;
            vec2 uv = vec2(a/tau,r);
            
            //get the color
            float xCol = (uv.x - (iTime / 3.0)) * 3.0;
            xCol = mod(xCol, 3.0);
            vec3 horColour = vec3(0.25, 0.25, 0.25);
            
            if (xCol < 1.0) {
                
                horColour.r += 1.0 - xCol;
                horColour.g += xCol;
            }
            else if (xCol < 2.0) {
                
                xCol -= 1.0;
                horColour.g += 1.0 - xCol;
                horColour.b += xCol;
            }
            else {
                
                xCol -= 2.0;
                horColour.b += 1.0 - xCol;
                horColour.r += xCol;
            }

            // draw color beam
            uv = (2.0 * uv) - 1.0;
            float beamWidth = (0.7+0.5*cos(uv.x*10.0*tau*0.15*clamp(floor(5.0 + 10.0*cos(iTime)), 0.0, 10.0))) * abs(1.0 / (30.0 * uv.y));
            vec3 horBeam = vec3(beamWidth); 
			gl_FragColor = vec4((( horBeam) * horColour), 1.0);
			
		}
        `
    })
    const mesh = new THREE.Mesh(geometry, material);

    return {
        mesh,
        uniforms
    }
}