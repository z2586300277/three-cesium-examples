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
        const vertexShader = `
				varying vec2 vUv;

				void main() {
				vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
				}
				`;

        const fragmentShader = `
				varying vec2 vUv;

				uniform float uTime;

				void main() {
				float len = 0.15;
				float falloff = 0.1;
				float p =  mod(uTime*0.5 , 1.0);
				float alpha = smoothstep(len, len - falloff, abs(vUv.x - p));
				float width = smoothstep(len * 2.0, 0.0, abs(vUv.x - p)) * 0.5;
				alpha *= smoothstep(width, width - 0.3, abs(vUv.y - 0.5));

				alpha *= smoothstep(0.5, 0.3, abs(p - 0.5) * (1.0 + len));

				gl_FragColor.rgb = vec3(0.51);
				gl_FragColor.a = alpha;
				    //    gl_FragColor.a += 0.1;
				}
				`;


        let _renderer = this.renderer, _scene = this.scene, _camera = this.camera, _controls = this.controls;
        let _geometry;
        let _shaders = [];

        init()
        function init() {
            initWorld();
            initScene();
        }

        //=====// World //========================================//

        function initWorld() {
            window.addEventListener('resize', resize, false);
            resize();
            requestAnimationFrame(render);
        }

        function resize() {
            _renderer.setSize(window.innerWidth, window.innerHeight);
            _camera.aspect = window.innerWidth / window.innerHeight;
            _camera.updateProjectionMatrix();
        }

        function render() {
            requestAnimationFrame(render);
            if (_controls) _controls.update();
            _renderer.render(_scene, _camera);
        }

        //=====// Scene //========================================//

        function initScene() {
            initGeometry();
            for (let i = 0; i < 24; i++) initMesh();
            requestAnimationFrame(loop);
        }

        function createSpiral() {
            let points = [];
            let r = 8;
            let a = 0;
            for (let i = 0; i < 120; i++) {
                let p = (1 - i / 120);
                r -= Math.pow(p, 2) * 0.187;
                a += 0.3 - (r / 6) * 0.2;

                console.log(p, Math.pow(p, 2.5) * 6);

                points.push(new THREE.Vector3(
                    r * Math.sin(a),
                    Math.pow(p, 2.5) * 6,
                    r * Math.cos(a)
                ));
            }
            return points;
        }

        function initGeometry() {
            const points = createSpiral();

            // Create the flat geometry
            const geometry = new THREE.BufferGeometry();

            // create two times as many vertices as points, as we're going to push them in opposing directions to create a ribbon
            geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(points.length * 3 * 2), 3));
            geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(points.length * 2 * 2), 2));
            geometry.setIndex(new THREE.BufferAttribute(new Uint16Array(points.length * 6), 1));

            points.forEach((b, i) => {
                let o = 0.1;

                geometry.attributes.position.setXYZ(i * 2 + 0, b.x, b.y + o, b.z);
                geometry.attributes.position.setXYZ(i * 2 + 1, b.x, b.y - o, b.z);

                geometry.attributes.uv.setXY(i * 2 + 0, i / (points.length - 1), 0);
                geometry.attributes.uv.setXY(i * 2 + 1, i / (points.length - 1), 1);

                if (i < points.length - 1) {
                    geometry.index.setX(i * 6 + 0, i * 2);
                    geometry.index.setX(i * 6 + 1, i * 2 + 1);
                    geometry.index.setX(i * 6 + 2, i * 2 + 2);

                    geometry.index.setX(i * 6 + 0 + 3, i * 2 + 1);
                    geometry.index.setX(i * 6 + 1 + 3, i * 2 + 3);
                    geometry.index.setX(i * 6 + 2 + 3, i * 2 + 2);
                }
            });

            _geometry = geometry;
        }

        function initMesh() {
            const uniforms = {
                uTime: { type: 'f', value: Math.random() * 3 },
            };

            let shader = new THREE.ShaderMaterial({
                uniforms: uniforms,
                vertexShader: vertexShader,
                fragmentShader: fragmentShader,
                side: THREE.DoubleSide,
                transparent: true,
                depthTest: false,
            });
            shader.speed = Math.random() * 0.4 + 0.6;
            _shaders.push(shader);

            let mesh = new THREE.Mesh(_geometry, shader);
            mesh.rotation.y = Math.random() * 10;
            mesh.scale.setScalar(0.5 + Math.random());
            mesh.scale.y = Math.random() * 0.4 + 0.9;
            mesh.position.y = Math.random();
            mesh.isTornado = true
            _scene.add(mesh);
        }

        let lastTime = 0;
        function loop(e) {
            requestAnimationFrame(loop);
            // _scene.rotation.y += 0.02;

            let delta = e - lastTime;
            _shaders.forEach(shader => {
                shader.uniforms.uTime.value += delta * 0.001 * shader.speed;
            });
            _scene.traverse(child => {
                if (child.isTornado) {
                    child.rotation.y += delta * 0.001
                    child.position.z -= delta * 0.01
                    if (child.position.distanceTo(box.position) < 3) {
                        box.position.y += 0.01
                    } else {
                        if (box.position.y > 0) {
                            box.position.y -= 0.01
                        }
                    }

                    if (child.position.z < -40) {
                        child.position.z = 0
                    }
                }
            })
            lastTime = e;
        }


        const box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1))
        box.position.set(0, 0, -10)
        _scene.add(box)
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
        this.camera.position.set(25, 0, 30);

        this.scene = new THREE.Scene();

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        const grid = new THREE.GridHelper(100);
        this.scene.add(grid);

        const light = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(light);
    }
    animate() {
        this.controls.update();
        this.renderer.render(this.scene, this.camera);
    }
}
new Base();