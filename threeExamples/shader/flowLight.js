import {
	AmbientLight,
	Color,
	DirectionalLight,
	DoubleSide,
	Mesh,
	MeshBasicMaterial,
	PerspectiveCamera,
	Scene,
	TextureLoader,
	TorusKnotGeometry,
	Vector2,
	WebGLRenderer
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js'

const size = { width: window.innerWidth, height: window.innerHeight }
const scene = new Scene()
scene.background = new Color('black')

const camera = new PerspectiveCamera(50, size.width / size.height, 1, 10000)
camera.position.set(0, 0, 50)

const renderer = new WebGLRenderer({ antialias: true, alpha: true , logarithmicDepthBuffer: true})
renderer.setSize(size.width, size.height)
renderer.setPixelRatio(window.devicePixelRatio)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

const textureLoader = new TextureLoader()
const lineTexture = textureLoader.load(FILE_HOST + 'images/channels/flowLight.png')
lineTexture.offset.x = -0.6

const geometry = new TorusKnotGeometry( 10, 0.2, 800, 16 )

const material = new MeshBasicMaterial({ color: 0xffffff, map: lineTexture, side: DoubleSide })
const torus = new Mesh(geometry, material)
scene.add(torus)

gsap.to(lineTexture.offset, {
	x: 0.6,
	duration: 5,
	repeat: -1
})

const renderPass = new RenderPass(scene, camera)
const composer = new EffectComposer(renderer)
const bloomPass = new UnrealBloomPass(new Vector2(size.width, size.height), 3, 0.8, 0.85)
const outputPass = new OutputPass()
composer.addPass(renderPass)
composer.addPass(bloomPass)
composer.addPass(outputPass)

const animate = () => {
	requestAnimationFrame(animate)
	controls.update()
	composer.render()
}

animate()

