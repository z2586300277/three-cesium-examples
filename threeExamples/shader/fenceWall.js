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
        const geometry = new THREE.CylinderGeometry(30, 30, 20, 4, 64, true);
        const material = new THREE.ShaderMaterial({
            side: THREE.DoubleSide,
            transparent: true,
            depthWrite: false,
            uniforms: {
                uTime: this.deltaTime,
            },
            vertexShader: `
                        varying vec2 vUv; 
                        void main(){
                            vUv = uv;
                            gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
                        }
                        `,
            fragmentShader: `
                        uniform float uTime;
                        varying vec2 vUv;
                        #define PI 3.14159265

                        void main(){

                        vec4 baseColor = vec4(0.0,1.,0.5,1.);
						
                        vec4 finalColor;
                            
                        float amplitude = 1.;
                        float frequency = 10.;
                        
                        float x = vUv.x;

                        float y = sin(x * frequency) ;
                        float t = 0.01*(-uTime*130.0);
                        y += sin(x*frequency*2.1 + t)*4.5;
                        y += sin(x*frequency*1.72 + t*1.121)*4.0;
                        y += sin(x*frequency*2.221 + t*0.437)*5.0;
                        y += sin(x*frequency*3.1122+ t*4.269)*2.5;
                        y *= amplitude*0.06;
                        y /= 3.;
                        y += 0.55;

                        vec4 color = gl_FragColor.rgba;

                        float r = step(0.5, fract(vUv.y - uTime));

                        baseColor.a = step(vUv.y,y) * (y-vUv.y)/y;
                        
                        gl_FragColor = baseColor;

                        }
                        `,
        });
        const cylinder = new THREE.Mesh(geometry, material);
        cylinder.position.y += 10;
        this.scene.add(cylinder);
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
        this.camera.position.set(0, 40, 40);

        this.scene = new THREE.Scene();

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        this.deltaTime = {
            value: 0,
        };

        const grid = new THREE.GridHelper(100);
        this.scene.add(grid);

        const light = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(light);
    }
    animate() {
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
        this.deltaTime.value = this.clock.getElapsedTime();
    }
}
new Base();