import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Stats from 'three/examples/jsm/libs/stats.module.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import {GUI} from 'dat.gui'

const initializeScene = ({ root, antialias = true } = {}) => {
    // Create scene
    const scene = new THREE.Scene();

    // Create camera
    const camera = new THREE.PerspectiveCamera(
        35,
        window.innerWidth / window.innerHeight,
        0.1,
        1000,
    );
    camera.position.z = 110;

    // Create renderer
    const renderer = new THREE.WebGLRenderer({ antialias });
    renderer.setSize(window.innerWidth, window.innerHeight);
    // renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    root.appendChild(renderer.domElement);

    const onWindowResize = () => {
        // Adjust camera and renderer on window resize
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        controls.update();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.render(scene, camera);
    };
    onWindowResize();
    window.addEventListener('resize', onWindowResize, false);

    // Create GUI
    const gui = new GUI({ container: root });

    const stats = new Stats();
    stats.showPanel(0);
    root.appendChild(stats.domElement);

    return {
        scene,
        renderer,
        camera,
        controls,
        gui,
        stats,
    };
};

const init = (root) => {
    const { scene, renderer, camera, gui, stats, controls } = initializeScene({
        root,
    });

    camera.position.set(12, 6, 12);

    const gltfLoader = new GLTFLoader();
    gltfLoader.load('https://z2586300277.github.io/3d-file-server/examples/coffeeMug/coffeeMug.glb', (gltf) => {
        gltf.scene.getObjectByName('baked').material.map.anisotropy = 8;
        controls.target.y += 3;
        scene.add(gltf.scene);
    });

    const textureLoader = new THREE.TextureLoader();
    const perlinTexture = textureLoader.load('https://z2586300277.github.io/3d-file-server/examples/coffeeMug/perlin.png');
    perlinTexture.wrapS = THREE.RepeatWrapping;
    perlinTexture.wrapT = THREE.RepeatWrapping;

    const smokeGeometry = new THREE.PlaneGeometry(1, 1, 16, 64);
    smokeGeometry.translate(0, 0.5, 0);
    smokeGeometry.scale(1.5, 6, 1.5);

    const smokeMaterial = new THREE.ShaderMaterial({
        // wireframe: true,
        vertexShader:`#define M_PI 3.1415926535897932384626433832795

        varying vec2 vUv;
        
        uniform float uTime;
        uniform sampler2D uPerlinTexture;
        
        vec2 rotate2D(vec2 value, float angle)
        {
        float s = sin(angle);
        float c = cos(angle);
        mat2 m = mat2(c, s, -s, c);
        return m * value;
        }

        
        void main()
        {
          vUv = uv;
        
          vec3 newPosition = position;
          float angle = texture(
            uPerlinTexture,
            vec2(0.5, uv.y * 0.3 + uTime * 0.02
          )).x * 7.;
          newPosition.xz = rotate2D(position.xz, angle);
        
          vec2 windOffset = vec2(
            texture(uPerlinTexture, vec2(0.2, uTime * 0.02)).x - 0.5,
            texture(uPerlinTexture, vec2(0.7, uTime * 0.02)).x - 0.5
          );
        
          newPosition.xz += windOffset * pow(uv.y, 2.) * 8.;
        
          gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(newPosition, 1.0);
        }
        `,
        fragmentShader:`varying vec2 vUv;

        uniform float uTime;
        uniform sampler2D uPerlinTexture;
        
        void main()
        {
        
          vec2 uv = vec2(vUv.x * 0.5, vUv.y * 0.3 - uTime / 15.);
        
          float intensity = texture2D(uPerlinTexture, uv).x;
          intensity = smoothstep(0.4, 1.0, intensity);
          
          intensity *= smoothstep(0.0, 0.1, vUv.x);
          intensity *= smoothstep(1.0, 0.9, vUv.x);
        
          intensity *= smoothstep(0.0, 0.1, vUv.y);
          intensity *= smoothstep(1.0, 0.4, vUv.y);
        
        
          gl_FragColor = vec4(1.0, 0.8, 0.6, intensity);
          
          #include <tonemapping_fragment>
          #include <colorspace_fragment>
        }
        `,
        uniforms: {
            uTime: { value: 0 },
            uPerlinTexture: { value: perlinTexture },
        },
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
    });

    const smoke = new THREE.Mesh(smokeGeometry, smokeMaterial);
    smoke.position.y = 1.83;
    scene.add(smoke);

    const clock = new THREE.Clock();

    const tick = () => {
        requestAnimationFrame(tick);
        stats.begin();

        controls.update();

        smokeMaterial.uniforms.uTime.value = clock.getElapsedTime();

        stats.end();
        renderer.render(scene, camera);
    };

    tick();

    return renderer;
};

init(document.getElementById('box'));