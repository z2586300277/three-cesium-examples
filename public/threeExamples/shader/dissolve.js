import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import * as dat from 'dat.gui'


/* GUI */

const gui = new dat.GUI()

// Container
const box = document.getElementById("box")


// Scene
const scene = new THREE.Scene()

/**
 * Loader
 */
const textureLoader = new THREE.TextureLoader()


/* Tex */
const dissolveTex = textureLoader.load('https://z2586300277.github.io/3d-file-server/images/dissolve/dissolveTex.png')
dissolveTex.colorSpace = THREE.SRGBColorSpace
const dissolveRampTex = textureLoader.load('https://z2586300277.github.io/3d-file-server/images/dissolve/dissolveRamp.png')
dissolveRampTex.colorSpace = THREE.SRGBColorSpace
const diffuseTex = textureLoader.load('https://z2586300277.github.io/3d-file-server/images/dissolve/diffuse.png')
diffuseTex.colorSpace = THREE.SRGBColorSpace

/**
 * Test mesh
 */
// Geometry
const geometry = new THREE.PlaneGeometry(4, 3, 32, 32)

// Material
const shaderMaterial = new THREE.ShaderMaterial({
  side: THREE.DoubleSide,
  vertexShader:/* glsl */`
    varying vec2 vUv;
    void main() {
      vUv = uv;
      vec4 modelPosition = modelMatrix * vec4(position, 1.);
      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectedPosition = projectionMatrix * viewPosition;
      gl_Position = projectedPosition;
    }
    `,
  fragmentShader:/* glsl */`
    uniform sampler2D uDissloveTex;
    uniform sampler2D uRamTex;
    uniform sampler2D uDiffuseTex;
    uniform float uClip;
    varying vec2 vUv;
    
    float customSmoothstep(float min, float max, float x) {
      return (x - min) / (max - min);
    }

    vec4 map(in vec4 value, in vec4 inMin, in vec4 inMax, in vec4 outMin, in vec4 outMax) {
      return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);
    }
    
    void main() {
  
      vec4 DissloveTex = texture2D(uDissloveTex, vUv);
      DissloveTex = map(DissloveTex, vec4(0.), vec4(1.), vec4(0.1), vec4(1.));

      if((DissloveTex.r - uClip) < 0.) {
        discard;
      }
     
      float dissloveValue = clamp(customSmoothstep(uClip, uClip+.1, DissloveTex.r), 0., 1.);
      vec4 RamTex = texture2D(uRamTex, vec2(dissloveValue));
      vec4 diffuse = texture2D(uDiffuseTex, vUv);

      vec3 color = vec3(clamp( diffuse.rgb  + RamTex.rgb, 0., 1.));

      gl_FragColor = vec4(color, 1.0);

      #include <tonemapping_fragment>
	    #include <colorspace_fragment>
    }
    `,
  uniforms: {
    uDissloveTex: new THREE.Uniform(dissolveTex),
    uRamTex: new THREE.Uniform(dissolveRampTex),
    uDiffuseTex: new THREE.Uniform(diffuseTex),
    uClip: new THREE.Uniform(0)
  }
})

gui.add(shaderMaterial.uniforms.uClip, 'value').min(0).max(1).step(0.01).name('Clip')

// Mesh
const mesh = new THREE.Mesh(geometry, shaderMaterial)
scene.add(mesh)

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0.25, - 0.25, 3.5)
scene.add(camera)

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer()
renderer.antialias = true
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.outputColorSpace = THREE.SRGBColorSpace
box.appendChild(renderer.domElement)

// Controls
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
  const elapsedTime = clock.getElapsedTime()

  // Update controls
  controls.update()

  // Render
  renderer.render(scene, camera)

  // Call tick again on the next frame
  window.requestAnimationFrame(tick)
}

tick()