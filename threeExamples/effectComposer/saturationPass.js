import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { GUI } from "three/examples/jsm/libs/lil-gui.module.min.js";

window.addEventListener('load', e => {
    init();
    initComposer();
    addMesh();
    render();
})

let scene, renderer, camera, orbit;
let composer;

function init() {
    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.add(new THREE.PointLight(0xffffff, 1, 1000, 0.01));
    camera.position.set(10, 10, 10);
    scene.add(camera);

    orbit = new OrbitControls(camera, renderer.domElement);
    orbit.enableDamping = true;

    scene.add(new THREE.GridHelper(10, 10));
}

function initComposer() {
    composer = new EffectComposer(renderer);
    let renderPass = new RenderPass(scene, camera);
    let outputPass = new OutputPass();
    composer.addPass(renderPass);
    composer.addPass(outputPass);

    let finalMaterial = new THREE.ShaderMaterial({
        uniforms: {
            baseTexture: { value: null },
            saturation: { value: 0.2 },
            brightness: { value: 0.2 }
        },
        vertexShader: `
            varying vec2 vUv;
            void main(){
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
            }
        `,
        fragmentShader: `

            vec3 hsv2rgb( in vec3 c ){
                vec3 rgb = clamp( abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),6.0)-3.0)-1.0, 0.0, 1.0 );

                return c.z * mix( vec3(1.0), rgb, c.y);
            }

            vec3 rgbToHsv(vec3 rgb){
                vec3 hsv = vec3(0);
                float maxC = max(max(rgb.r,rgb.g),rgb.b);
                float minC = min(min(rgb.r,rgb.g),rgb.b);
                float delta = maxC - minC;
                if (maxC == rgb.r) hsv.x = mod((rgb.g - rgb.b)/delta,6.0)/6.0;
                if (maxC == rgb.g) hsv.x = (rgb.b - rgb.r)/(delta*6.0) + 1.0/3.0;
                if (maxC == rgb.b) hsv.x = (rgb.r - rgb.g)/(delta*6.0) + 2.0/3.0;
                hsv.y = delta/maxC;
                hsv.z = maxC;
                return hsv;
            }

            varying vec2 vUv;
            uniform sampler2D tDiffuse;
            uniform float saturation;
            uniform float brightness;
            void main(){
                vec4 col = texture2D(tDiffuse,vUv);

                vec3 hsvCol = rgbToHsv(col.rgb);
                hsvCol.y *= saturation;
                hsvCol.z *= brightness;
                vec3 col2 = hsv2rgb(hsvCol);
                gl_FragColor = vec4(col2,col.a);

                #include <colorspace_fragment>
            }
        `
    });

    let finalPass = new ShaderPass(finalMaterial)
    composer.addPass(finalPass);

    let gui = new GUI();
    gui.add(finalMaterial.uniforms.saturation, 'value', 0, 1, 0.01).name('饱和度')
    gui.add(finalMaterial.uniforms.brightness, 'value', 0, 1, 0.01).name('亮度')

}

function addMesh() {
    let geometry = new THREE.BoxGeometry(1, 1, 1);

    for (let i = 0; i < 100; i++) {
        let material = new THREE.MeshStandardMaterial({ color: 0xffffff * Math.random() });
        let mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = Math.random() * 10 - 5;
        mesh.position.y = Math.random() * 10 - 5;
        mesh.position.z = Math.random() * 10 - 5;
        scene.add(mesh);
    }
}

function render() {
    // renderer.render(scene,camera);
    composer.render();
    orbit.update();
    requestAnimationFrame(render);
}