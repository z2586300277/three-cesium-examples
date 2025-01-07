import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Water } from 'three/examples/jsm/objects/Water.js';
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 1000000)

camera.position.set(6, 3, 15)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

controls.enableDamping = true

const waterGeometry = new THREE.PlaneGeometry(10000, 10000);

const water = new Water(
    waterGeometry,
    {
        textureWidth: 512,
        textureHeight: 512,
        waterNormals: new THREE.TextureLoader().load(  FILE_HOST +  '/images/texture/waternormals.jpg', function (texture) {
          
            texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

        }),
        sunDirection: new THREE.Vector3(),
        sunColor: 0xffffff,
        waterColor: 0x001e0f,
        distortionScale: 3.7,
        fog: scene.fog !== undefined
    }
);

water.rotation.x = - Math.PI / 2;

scene.add(water);

// 文件地址
const urls = [0, 1, 2, 3, 4, 5].map(k => (FILE_HOST + 'files/sky/skyBox0/' + (k + 1) + '.png'));

const textureCube = new THREE.CubeTextureLoader().load(urls);

scene.background = textureCube;

new GLTFLoader().load('https://z2586300277.github.io/3d-file-server/models/glb/wajueji.glb',

    gltf => {

        gltf.scene.traverse(child => {

            if (child.isMesh) {

                child.material.envMap = textureCube

            }

        })

        scene.add(gltf.scene)

    }

)

const gui = new GUI();

gui.addColor(water.material.uniforms['waterColor'], 'value').name('waterColor');

gui.addColor(water.material.uniforms['sunColor'], 'value').name('sunColor');

gui.add(water.material.uniforms['sunDirection'].value, 'x', - 1, 1).name('sunX');

animate()

function animate() {

    water.material.uniforms['time'].value += 1.0 / 60.0;

    requestAnimationFrame(animate)

    controls.update()

    renderer.render(scene, camera)

}

window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)

    camera.aspect = box.clientWidth / box.clientHeight

    camera.updateProjectionMatrix()

}
