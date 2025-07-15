import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const box = document.getElementById('box')
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000)
camera.position.set(0, 0, 15)
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

        float M_PI = 3.1415926;
        float M_TWO_PI = 6.28318530718;
        vec3 iMouse = vec3(0.0, 0.0 ,0.0 );
		uniform float iTime;
		uniform vec2 iResolution; 
          
		varying vec2 vUv;
        float rand(vec2 n) {
            return fract(sin(dot(n, vec2(12.9898,12.1414))) * 83758.5453);
        }
        
        float noise(vec2 n) {
            const vec2 d = vec2(0.0, 1.0);
            vec2 b = floor(n);
            vec2 f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
            return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
        }
        
        vec3 ramp(float t) {
            return t <= .5 ? vec3( 1. - t * 1.4, .2, 1.05 ) / t : vec3( .3 * (1. - t) * 2., .2, 1.05 ) / t;
        }
        vec2 polarMap(vec2 uv, float shift, float inner) {
        
            uv = vec2(0.5) - uv;
            
            
            float px = 1.0 - fract(atan(uv.y, uv.x) / 6.28 + 0.25) + shift;
            float py = (sqrt(uv.x * uv.x + uv.y * uv.y) * (1.0 + inner * 2.0) - inner) * 2.0;
            
            return vec2(px, py);
        }
        float fire(vec2 n) {
            return noise(n) + noise(n * 2.1) * .6 + noise(n * 5.4) * .42;
        }
        
        float shade(vec2 uv, float t) {
            uv.x += uv.y < .5 ? 23.0 + t * .035 : -11.0 + t * .03;    
            uv.y = abs(uv.y - .5);
            uv.x *= 35.0;
            
            float q = fire(uv - t * .013) / 2.0;
            vec2 r = vec2(fire(uv + q / 2.0 + t - uv.x - uv.y), fire(uv + q - t));
            
            return pow((r.y + r.y) * max(.0, uv.y) + .1, 4.0);
        }
        
        vec3 color(float grad) {
            
            float m2 = iMouse.z < 0.0001 ? 1.15 : iMouse.y * 3.0 / iResolution.y;
            grad =sqrt( grad);
            vec3 color = vec3(1.0 / (pow(vec3(0.5, 0.0, .1) + 2.61, vec3(2.0))));
            vec3 color2 = color;
            color = ramp(grad);
            color /= (m2 + max(vec3(0), color));
            
            return color;
        
        }
        
         
        float distanceTo(vec2 src, vec2 dst) {
			float dx = src.x - dst.x;
			float dy = src.y - dst.y;
			float dv = dx * dx + dy * dy;
			return sqrt(dv);
		}

        
		void main() { 
            float m1 = iMouse.z < 0.0001 ? 3.6 : iMouse.x * 5.0 / iResolution.x;
    
            float t = iTime;
            vec2 uv = vUv;
            float ff = 1.0 - uv.y;
            uv.x -= (iResolution.x / iResolution.y - 1.0) / 2.0;
            vec2 uv2 = uv;
            uv2.y = 1.0 - uv2.y;
            uv = polarMap(uv, 1.3, m1);
            uv2 = polarMap(uv2, 1.9, m1);

            vec3 c1 = color(shade(uv, t)) * ff;
            vec3 c2 = color(shade(uv2, t)) * (1.0 - ff);
             

			gl_FragColor = vec4(c1 + c2, 1.0);;
			
		}
        `
    })
    const mesh = new THREE.Mesh(geometry, material);

    return {
        mesh,
        uniforms
    }
}