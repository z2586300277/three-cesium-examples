import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

const { innerWidth, innerHeight } = window;
const aspect = innerWidth / innerHeight;

class Base {
    constructor() {
        this.init();
        this.main();
    }
    main() {
        const geometry = new THREE.PlaneGeometry(10, 10, 10, 10);
        const material = new THREE.ShaderMaterial({
            side: THREE.DoubleSide,
            transparent: true,
            uniforms: {
                uTime: this.elapsedTime,
            },
            vertexShader: `
                            varying vec2 vUv;
                            void main() {
                                vUv = uv;
                                
                                gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
                            }
                        `,
            fragmentShader: `
                            varying vec2 vUv;
                            uniform float uTime;

                            void main(){
                                vec3 color = vec3(1.0,0.0,0.0);

                                vec2 center = vec2(0.5,0.5);

                                float dis = distance(vUv,center);

                                float p = 6.0;

                                float r =  fract(dis* p - uTime)/3. + step(0.99, fract(dis* p - uTime));
                                
                                
                                if(dis> 0.5 ){
                                    r = 0.0;
                                } 

                                gl_FragColor = vec4(color,r);
                            }
                        `,
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.rotation.x = Math.PI / 2;
        this.scene.add(mesh);
    }
    init() {
        this.clock = new THREE.Clock();

        this.loader = new GLTFLoader();

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

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        this.elapsedTime = { value: 0 };

        const grid = new THREE.GridHelper(100);
        this.scene.add(grid);

        const light = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(light);
    }
    animate() {
        this.elapsedTime.value = this.clock.getElapsedTime();
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}
new Base();