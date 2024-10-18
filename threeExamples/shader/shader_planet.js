import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const box = document.getElementById("box");
const scene = new THREE.Scene();
const texture = await new THREE.TextureLoader().load(FILE_HOST + 'images/channels/8k_stars_milky_way.jpg')
scene.background = texture;
const camera = new THREE.PerspectiveCamera(
    75,
    box.clientWidth / box.clientHeight,
    0.1,
    1000,
);
camera.position.set(0, 0, 20);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(box.clientWidth, box.clientHeight);
box.appendChild(renderer.domElement);
new OrbitControls(camera, renderer.domElement);
window.onresize = () => {
    renderer.setSize(box.clientWidth, box.clientHeight);
    camera.aspect = box.clientWidth / box.clientHeight;
    camera.updateProjectionMatrix();
};


function animate() {
    // uniforms.iTime.value += 0.01
    mesh.rotation.y += 0.01;
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
import init, { fbm } from "three_noise";
const generate_texture = async () => {
    await init();

    // let noise = new ImprovedNoise();

    let texture_height = 1024,
        texture_width = 1024;
    let texture_data = new Uint8Array(texture_height * texture_width * 4);
    for (let x = 0; x < texture_width; x++) {
        for (let y = 0; y < texture_height; y++) {
            // const noisevalue = noise.noise(x, y, 0.325);
            let fbm_value = fbm(
                x / texture_width,
                y / texture_height,
                6,
                2.0,
                1.5,
            );
            let color = fbm_value * 128 + 128;
            let i = (x + y * texture_width) * 4;
            texture_data[i] = color;
            texture_data[i + 1] = color;
            texture_data[i + 2] = fbm_value * 255;
            texture_data[i + 3] = 255;
        }
    }
    const texture = new THREE.DataTexture(
        texture_data,
        texture_width,
        texture_height,
        THREE.RGBAFormat,
    );
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, -1);
    texture.needsUpdate = true;
    return texture;
};
let material,mesh;
const add_sky_sphere = async () => {
    const texture = await generate_texture();
    const uniforms = {
        u_texture: {
            value: texture,
        },
    };
    const sphere_geo = new THREE.SphereGeometry(5, 100, 100);
    const vertexShader = `
              varying vec2 vUv;
              void main() {
                  vUv = uv;
                  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
              }
          `;
    const fragmentShader = `
            varying vec2 vUv;
            uniform sampler2D u_texture;
            void main(){
                  vec2 uv = vUv;
                  vec4 color = texture2D(u_texture,uv);
                  gl_FragColor = color;
            }
          `;
    material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader,
        fragmentShader,
        side: THREE.DoubleSide,
        // wireframe:true
    });
    mesh = new THREE.Mesh(sphere_geo, material);
    // mesh.translateX(-10);
    material.needsUpdate = true
    scene.add(mesh);
};

const change_material = ()=>{
    if (params.showTerrain) {
        material.vertexShader = `
        uniform sampler2D u_texture;
        varying vec2 vUv;
        void main() {
            vUv = uv;
            vec4 color = texture2D(u_texture, uv);
            // float height = length(color);
            float height = color.r;
            vec3 newPosition = position + normal * height * 1.5;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
        `
    }else{
        material.vertexShader = `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
        `
    }
    material.needsUpdate = true
}
import { GUI } from "dat.gui";
const params = {
    showTerrain:false
}
const add_gui = ()=>{
    const gui = new GUI()
    gui.add(params,'showTerrain').onChange(change_material)
}
await add_sky_sphere();
add_gui()
animate();