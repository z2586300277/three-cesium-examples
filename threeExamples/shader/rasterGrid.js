import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const { innerWidth, innerHeight } = window;
const aspect = innerWidth / innerHeight;

class Base {
    constructor() {
        this.init();
        this.main();
    }
    main() {
        const geometry = new THREE.PlaneGeometry(10,10,100,100);

        const vertexShader = `
        varying vec2 vUv;

        void main(){
            vUv = uv;

            gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);

        }
        `;
        const fragmentShader = `
        uniform float iTime;
        varying vec2 vUv;
        #define PI 3.14159

        vec3 palette(float t){
            vec3 a = vec3(0.5,0.5,0.5);
            vec3 b = vec3(0.5,0.5,0.5);
            vec3 c = vec3(1.0,1.0,1.0);
            vec3 d = vec3(0.263,0.416,0.557);

            return a+b*cos(PI*2.0*(c*t+d));
        }

        vec4 mainImage(){
            vec3 finalColor = vec3(0.0);
            vec2 uuv = vUv*2.0-1.0;
            vec2 uv = vUv*2.0-1.0;
            for(float i = 0.0;i<4.0;i++){
                uv = fract(uv*1.5)-0.5;
                float d = length(uv) * exp(-length(uuv));

                vec3 col = palette(length(uuv) + i*.4 + iTime*.4);

                d = sin(d*8. + iTime)/8.;
                d = abs(d);

                d = pow(0.01 / d, 1.2);

                finalColor += col * d;
            }
            return  vec4(finalColor,1.0);
        }
        void main(){
            gl_FragColor = mainImage();
        }
        `;
        const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            uniforms: {
                iTime: {
                    value: 0,
                },
            },
            side: THREE.DoubleSide,
        });

        const plane = new THREE.Mesh(geometry, material);
        this.material = plane.material;
        this.scene.add(plane);
    }
    init() {
        this.clock = new THREE.Clock();

        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            logarithmicDepthBuffer: true,
        });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(innerWidth, innerHeight);
        this.renderer.setAnimationLoop(this.animate.bind(this));
        document.body.appendChild(this.renderer.domElement);

        this.camera = new THREE.PerspectiveCamera(60, aspect, 0.01, 10000);
        this.camera.position.set(5, 5, 5);

        this.scene = new THREE.Scene();

        this.controls = new OrbitControls(
            this.camera,
            this.renderer.domElement
        );

        const grid = new THREE.GridHelper(100);
        this.scene.add(grid);

        const light = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(light);
    }
    animate() {
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
        this.material.uniforms.iTime.value += 0.01;
    }
}
new Base();