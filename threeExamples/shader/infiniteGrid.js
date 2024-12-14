import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Sky } from 'three/examples/jsm/objects/Sky.js'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 100000000)

camera.position.set(1000, 1000, 1000)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

controls.enableDamping = true

animate()

function animate() {

    requestAnimationFrame(animate)

    controls.update()

    renderer.render(scene, camera)

}

window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)

    camera.aspect = box.clientWidth / box.clientHeight

    camera.updateProjectionMatrix()

}

scene.add(new THREE.AmbientLight(0x222222))

const light = new THREE.DirectionalLight(0xffffff, 1)

light.position.set(80, 80, 80)

scene.add(light)

const sky = new Sky()

sky.scale.setScalar(450000)

const { uniforms } = sky.material

uniforms.sunPosition.value = new THREE.Vector3().setFromSphericalCoords(1, THREE.MathUtils.degToRad(90), THREE.MathUtils.degToRad(180))
uniforms["rayleigh"].value = 2


scene.add(sky);

class InfiniteGridHelper extends THREE.Mesh {

    constructor(size1 = 10, size2 = 100, color = new THREE.Color('white'), distance = 8000, axes = 'xzy') {

        const planeAxes = axes.substring(0, 2);

        const geometry = new THREE.PlaneGeometry(2, 2, 1, 1);

        const material = new THREE.ShaderMaterial({
            side: THREE.DoubleSide,
            uniforms: {
                uSize1: { value: size1 },
                uSize2: { value: size2 },
                uColor: { value: color },
                uDistance: { value: distance }
            },
            transparent: true,
            vertexShader: `
                varying vec3 worldPosition;
                uniform float uDistance;

                void main() {
                    vec3 pos = position.${axes} * uDistance;
                    pos.${planeAxes} += cameraPosition.${planeAxes};
                    worldPosition = pos;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
                }
            `,
            fragmentShader: `
                varying vec3 worldPosition;
                uniform float uSize1;
                uniform float uSize2;
                uniform vec3 uColor;
                uniform float uDistance;

                float getGrid(float size) {
                    vec2 r = worldPosition.${planeAxes} / size;
                    vec2 grid = abs(fract(r - 0.5) - 0.5) / fwidth(r);
                    float line = min(grid.x, grid.y);
                    return 1.0 - min(line, 1.0);
                }

                void main() {
                    float d = 1.0 - min(distance(cameraPosition.${planeAxes}, worldPosition.${planeAxes}) / uDistance, 1.0);
                    float g1 = getGrid(uSize1);
                    float g2 = getGrid(uSize2);
                    gl_FragColor = vec4(uColor.rgb, mix(g2, g1, g1) * pow(d, 3.0));
                    gl_FragColor.a = mix(0.5 * gl_FragColor.a, gl_FragColor.a, g2);
                    if (gl_FragColor.a <= 0.0) discard;
                }
            `,
            extensions: {
                derivatives: true
            }
        });

        super(geometry, material);

        this.frustumCulled = false; 
    }
}

const gridHelper = new InfiniteGridHelper(10, 100);

scene.add(gridHelper)