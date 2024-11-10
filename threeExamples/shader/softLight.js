import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(0, 0, 1.5)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

controls.enableDamping = true

window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)

    camera.aspect = box.clientWidth / box.clientHeight

    camera.updateProjectionMatrix()

}

const uniforms = {

    iTime: {

        value: 0

    },

    iResolution: {

        value: new THREE.Vector2(box.clientWidth, box.clientHeight)

    }

}

const geometry = new THREE.PlaneGeometry(3, 3)

const material = new THREE.ShaderMaterial({

    uniforms,

    transparent: true,

    side: THREE.DoubleSide,

    vertexShader: `
      varying vec3 vPosition;
      varying vec2 vUv;
      void main() { 
          vUv = uv; 
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;
      }
  `,
    fragmentShader: `
  uniform float iTime; 
  uniform vec2 iResolution; 
  varying vec2 vUv;  

  mat2 m(float a){float c=cos(a), s=sin(a);return mat2(c,-s,s,c);}
  float map(vec3 p){
      p.xz*= m(iTime*0.4);p.xy*= m(iTime*0.3);
      vec3 q = p*2.+iTime;
      return length(p+vec3(sin(iTime*0.7)))*log(length(p)+1.) + sin(q.x+sin(q.z+sin(q.y)))*0.5 - 1.;
  }


  void main(void) { 
      
      vec2 p = (vUv - 0.5) * 2.0  ;
      vec3 cl = vec3(0.);
      float d = 2.5;
      for(int i=0; i<=5; i++)	{
          vec3 p = vec3(0,0,5.) + normalize(vec3(p, -1.))*d;
          float rz = map(p);
          float f =  clamp((rz - map(p+.1))*0.5, -.1, 1. );
          vec3 l = vec3(0.1,0.3,.4) + vec3(5., 2.5, 3.)*f;
          cl = cl*l + smoothstep(2.5, .0, rz)*.7*l;
          d += min(rz, 1.);
      }
      gl_FragColor = vec4(cl, 1.);
  }
    `
})

const mesh = new THREE.Mesh(geometry, material)

scene.add(mesh)

animate()

function animate() {

    uniforms.iTime.value += 0.01

    requestAnimationFrame(animate)

    controls.update()

    renderer.render(scene, camera)

}