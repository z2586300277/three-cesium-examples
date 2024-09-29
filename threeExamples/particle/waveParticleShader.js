import { BufferAttribute, Clock, Color, PerspectiveCamera, PlaneGeometry, Points, Scene, ShaderMaterial, WebGLRenderer } from 'three';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js';

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const scene = new Scene()

const camera = new PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.z = 10
camera.position.y = 1.1
camera.position.x = 0
scene.add(camera)


const planeGeometry = new PlaneGeometry(20, 20, 150, 150)
const planeMaterial = new ShaderMaterial({
    uniforms: {
        uTime: { value: 0 },
        uElevation: { value: 0.482 },
        ucolor: { value: new Color(0x9ab0f4) },
        bsize: { value: 3 }
    },
    vertexShader: `
        uniform float uTime;
        uniform float uElevation;

        attribute float aSize;
        uniform float bsize;

        varying float vPositionY;
        varying float vPositionZ;

        void main() {
            vec4 modelPosition = modelMatrix * vec4(position, 1.0);
            modelPosition.y = sin(modelPosition.x - uTime) * sin(modelPosition.z * 0.6 + uTime) * uElevation;

            vec4 viewPosition = viewMatrix * modelPosition;
            gl_Position = projectionMatrix * viewPosition;

            gl_PointSize = 2.0 * aSize;
            gl_PointSize *= ( 1.0 / - viewPosition.z ) * bsize;

            vPositionY = modelPosition.y;
            vPositionZ = modelPosition.z;
        }
    `,
    fragmentShader: `
        varying float vPositionY;
        varying float vPositionZ;
        uniform vec3 ucolor;

        void main() {
            float strength = (vPositionY + 0.25) * 0.3;
            gl_FragColor = vec4(ucolor, strength);
        }
    `,
    transparent: true,
})
const planeSizesArray = new Float32Array(planeGeometry.attributes.position.count)
for (let i = 0; i < planeSizesArray.length; i++) {
    planeSizesArray[i] = Math.random() * 4.0
}
planeGeometry.setAttribute('aSize', new BufferAttribute(planeSizesArray, 1))
const plane = new Points(planeGeometry, planeMaterial)
plane.rotation.x = - Math.PI * 0.4
scene.add(plane)


window.addEventListener('resize', () => {
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

const renderer = new WebGLRenderer()
document.body.appendChild(renderer.domElement)
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1))

const gui = new GUI()
const planeFolder = gui.addFolder('Plane')
planeFolder.addColor(planeMaterial.uniforms.ucolor, 'value').name('Color')
planeFolder.add(planeMaterial.uniforms.bsize, 'value').min(0).max(10).step(0.001).name('Size')

const clock = new Clock()
const animate = () => {
    const elapsedTime = clock.getElapsedTime()
    planeMaterial.uniforms.uTime.value = elapsedTime
    renderer.render(scene, camera)
    window.requestAnimationFrame(animate)
}

animate()