import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// 魔幻山体-等高线示意
const box = document.getElementById("box");
const scene = new THREE.Scene();
scene.background = new THREE.Color(0.5, 1, 0.875);
scene.fog = new THREE.Fog(scene.background, 20, 45);
const camera = new THREE.PerspectiveCamera(
    75,
    box.clientWidth / box.clientHeight,
    0.1,
    1000,
);
camera.position.set(0, 10, 10);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(box.clientWidth, box.clientHeight);
box.appendChild(renderer.domElement);
new OrbitControls(camera, renderer.domElement);
window.onresize = () => {
    renderer.setSize(box.clientWidth, box.clientHeight);
    camera.aspect = box.clientWidth / box.clientHeight;
    camera.updateProjectionMatrix();
};

animate();
function animate() {
    // uniforms.iTime.value += 0.01
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

//  添加一个plane
import { Clock, DoubleSide, Mesh, PlaneGeometry, ShaderMaterial } from 'three'
const add_plane = () => {
    const clock = new Clock();
    const planeGeometry = new PlaneGeometry(50, 50, 500, 500);
    planeGeometry.rotateX(-Math.PI / 2)
    let uniforms = {
        u_time: {
            value: clock.getDelta()
        }
    }
    // shader material
    const vertexShader = `

        vec3 hash(vec3 p) {
            p = vec3( dot(p, vec3(127.1, 311.7, 74.7)),
            dot(p, vec3(269.5, 183.3, 246.1)),
            dot(p, vec3(113.5, 271.9, 124.6)));
            return fract(sin(p) * 43758.5453123);
        }
            // returns 3D value noise
        float noise( in vec3 x )
        {
            // grid
            vec3 p = floor(x);
            vec3 w = fract(x);
            // quintic interpolant
            vec3 u = w*w*w*(w*(w*6.0-15.0)+10.0);
            // gradients
            vec3 ga = hash( p+vec3(0.0,0.0,0.0) );
            vec3 gb = hash( p+vec3(1.0,0.0,0.0) );
            vec3 gc = hash( p+vec3(0.0,1.0,0.0) );
            vec3 gd = hash( p+vec3(1.0,1.0,0.0) );
            vec3 ge = hash( p+vec3(0.0,0.0,1.0) );
            vec3 gf = hash( p+vec3(1.0,0.0,1.0) );
            vec3 gg = hash( p+vec3(0.0,1.0,1.0) );
            vec3 gh = hash( p+vec3(1.0,1.0,1.0) );
            // projections
            float va = dot( ga, w-vec3(0.0,0.0,0.0) );
            float vb = dot( gb, w-vec3(1.0,0.0,0.0) );
            float vc = dot( gc, w-vec3(0.0,1.0,0.0) );
            float vd = dot( gd, w-vec3(1.0,1.0,0.0) );
            float ve = dot( ge, w-vec3(0.0,0.0,1.0) );
            float vf = dot( gf, w-vec3(1.0,0.0,1.0) );
            float vg = dot( gg, w-vec3(0.0,1.0,1.0) );
            float vh = dot( gh, w-vec3(1.0,1.0,1.0) );
            // interpolation
            return va +
            u.x*(vb-va) +
            u.y*(vc-va) +
            u.z*(ve-va) +
            u.x*u.y*(va-vb-vc+vd) +
            u.y*u.z*(va-vc-ve+vg) +
            u.z*u.x*(va-vb-ve+vf) +
            u.x*u.y*u.z*(-va+vb+vc-vd+ve-vf-vg+vh);
        }
        varying vec2 v_uv;
        varying float v_y;
        void main(){
            v_uv = uv;
            float noise_value = noise(position);
            float y = noise_value;
            y = pow(y,3.);
            vec3 in_position = position;
            in_position.y = v_y = min(y*35.,15.)*2.;
            gl_Position = projectionMatrix * modelViewMatrix * vec4( in_position, 1.0 );
        }
    `
    const fragmentShader = `
        uniform float u_time;
        varying float v_y;
        varying vec2 v_uv;
        void main(){
            gl_FragColor = vec4(v_uv.x,sin(v_y*100.*u_time),0.5,1.);
        }
    `
    const shaderMaterial = new ShaderMaterial({
        vertexShader, fragmentShader, side: DoubleSide, uniforms
    })
    function animate() {
        uniforms.u_time.value = clock.getElapsedTime()*0.01;
        requestAnimationFrame(animate)
    }
    animate()

    const mesh = new Mesh(planeGeometry, shaderMaterial)
    scene.add(mesh)
    return mesh;
}

add_plane()