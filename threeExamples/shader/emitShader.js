import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(0, 10, 10)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

controls.enableDamping = true

const boxGeometry = new THREE.BoxGeometry(6, 6, 6);

const vertexShader = `
void main() {
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

}
`
const fragmentShader = `
uniform vec2 u_resolution;
uniform float iTime;
vec3 palette( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d )
{
    return a + b*cos( 6.283185*(c*t+d) );
}
void main() {
      vec3 finalcol = vec3(0.0);
    vec2 uv = (gl_FragCoord.xy * 2. - u_resolution.xy) / u_resolution.y;
    vec2 uv0 = uv;
    for (float i = 0.0; i < 3.0; i++) {
       
        uv = fract(uv*5.5)-0.5;
        vec3 col = palette(length(uv0)+iTime,vec3(0.768, 0.648, 1.0), vec3(-0.252, -0.082, 0.0), vec3(0.5, 0.5, 0.0), vec3(0.5, 0.0, 0.0));
        
        float d = length(uv) * exp(-length(uv0));

        d = sin(d*8. + iTime)/8.;
        d = abs(d);

        d = pow(0.01 / d, 1.2);
        
        finalcol += col * d;
    }
    gl_FragColor = vec4(finalcol, 1.0);
}
`

const boxMaterial = new THREE.ShaderMaterial({
    uniforms: {
        u_resolution: { value: new THREE.Vector2(box.clientWidth, box.clientHeight) },
        iTime: { value: 0 }
    },
    vertexShader,
    fragmentShader
});

const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);

scene.add(boxMesh);

animate()

function animate() {

    boxMaterial.uniforms.iTime.value += 0.01

    requestAnimationFrame(animate)

    controls.update()

    renderer.render(scene, camera)

}

window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)

    camera.aspect = box.clientWidth / box.clientHeight

    camera.updateProjectionMatrix()

}