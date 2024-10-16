import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import * as dat from 'dat.gui'
import gsap from 'gsap'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(5, 5, 5)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)

    camera.aspect = box.clientWidth / box.clientHeight

    camera.updateProjectionMatrix()

}

animate()

function animate() {

    requestAnimationFrame(animate)

    renderer.render(scene, camera)

}

scene.add(new THREE.AmbientLight(0xffffff, 1))

const pointLight = new THREE.PointLight(0xffffff, 1.5, 0, 2)

pointLight.position.set(5, 5, 5)

scene.add(pointLight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 2)

directionalLight.position.set(-5, 5, -5)

scene.add(directionalLight)

scene.add(new THREE.AxesHelper(1000))

let group

// 加载模型 gltf/ glb  draco解码器
const loader = new GLTFLoader()

loader.setDRACOLoader(new DRACOLoader().setDecoderPath(FILE_HOST + 'js/three/draco/'))

loader.load(

    HOST + '/files/model/car.glb',

    gltf => {

        group = gltf.scene

        const box = new THREE.Box3().setFromObject(group);

        const center = new THREE.Vector3();

        box.getCenter(center);

        group.center = center

        group.traverse((child) => {

            if (child.isMesh) {

                child.localToWorld(child.position)   //转为世界坐标

                child.startPoisition = child.position.clone()

            }

        })

        scene.add(group)

    }

)

// 拆解
const mergeHandle = (model) => {

    const distance = () => Math.random() > 0.5 ? 1.5 : -1.5

    model.traverse((child) => {

        if (child.startPoisition) {

            const v1 = distance()

            const v2 = distance()

            const v3 = distance()

            gsap.to(child.position, { x: child.startPoisition.x + v1, y: child.startPoisition.y + v2, z: child.startPoisition.z + v3, duration: 1, ease: 'power2.inOut' })

        }

    });
};

const gui = new dat.GUI()

gui.add({

    '拆解动画': () => {

        mergeHandle(group)
    }

}, '拆解动画')

gui.add({

    '还原动画': () => {

        group.traverse((child) => {

            if (child.startPoisition) {

                gsap.to(child.position, { x: child.startPoisition.x, y: child.startPoisition.y, z: child.startPoisition.z, duration: 1, ease: 'power2.inOut' })

            }

        });

    }

}, '还原动画')