import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(3, 3, 3)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)

    camera.aspect = box.clientWidth / box.clientHeight

    camera.updateProjectionMatrix()

}

scene.add(new THREE.AmbientLight(0xffffff, 3))

scene.add(new THREE.AxesHelper(1000))

let car = null

const loader = new GLTFLoader()

loader.setDRACOLoader(new DRACOLoader().setDecoderPath('https://z2586300277.github.io/3d-file-server/js/three/draco/'))

loader.load(

    '/three-cesium-examples/public/files/model/car.glb',

    gltf => {

        car = gltf.scene

        scene.add(car)

        modelBlendShader(car, box)

    }

)

animate()

function animate() {

    requestAnimationFrame(animate)

    car?.render?.()

    renderer.render(scene, camera)

}

/* 混合着色 */
function modelBlendShader(model, DOM) {

    let materials = []

    model.traverse(c => c.isMesh && materials.push(c.material))

    materials = [... new Set(materials)]

    const uniforms = {

        iResolution: {
            type: 'v2',
            value: new THREE.Vector2(DOM.clientWidth, DOM.clientHeight)
        },

        iTime: {
            type: 'f',
            value: 1.0
        }

    }

    materials.forEach(material => {

        material.onBeforeCompile = shader => {

            shader.uniforms.iResolution = uniforms.iResolution

            shader.uniforms.iTime = uniforms.iTime

            shader.fragmentShader = shader.fragmentShader.replace(/#include <common>/, `
                uniform vec2 iResolution;
                uniform float iTime;
                #include <common> 
            `)

            shader.fragmentShader = shader.fragmentShader.replace('vec4 diffuseColor = vec4( diffuse, opacity );', `
                vec3 c;
                float l,z=iTime;
                for(int i=0;i<3;i++) {
                    vec2 uv,p=gl_FragCoord.xy/iResolution/2.0;
                    uv=p +  2.0;
                    p-=.5;
                    p.x*=iResolution.x/iResolution.y;
                    z+=.07;
                    l=length(p);
                    uv+=p/l*(sin(z)+1.)*abs(sin(l*9.-z-z));
                    c[i]=.01/length(mod(uv,1.)-.5);
                }
                vec4 diffuseColor = vec4( diffuse * c  * vec3(20.,20.,20.), opacity );
            `)

        }

        material.needsUpdate = true

    })

    model.render = () => uniforms.iTime.value += 0.02

}
