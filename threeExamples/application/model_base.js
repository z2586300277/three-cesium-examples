import * as THREE from 'three';
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
const DOM = document.getElementById('box')

var scene = new THREE.Scene();
scene.background = new THREE.Color('gainsboro');

var camera = new THREE.PerspectiveCamera(30, innerWidth / innerHeight);
camera.position.set(0, 4, 4);
camera.lookAt(scene.position);

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setAnimationLoop(animationLoop);

function animationLoop() {
    renderer.render(scene, camera);
}
DOM.appendChild(renderer.domElement);

window.addEventListener("resize", () => {
    camera.aspect = innerWidth / innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, innerHeight);
});

var controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.autoRotate = true;

var light = new THREE.DirectionalLight('white', 3);
light.position.set(1, 1, 1);
scene.add(light);

let group

const loader = new GLTFLoader()

loader.setDRACOLoader(new DRACOLoader().setDecoderPath(FILE_HOST + 'js/three/draco/'))

loader.load(

    HOST + '/files/model/car.glb',

    function (gltf) {

        group = gltf.scene

        scene.add(group)
        add_model_base()
    }

)

// 模型底座
function add_model_base(){
    const box = new THREE.Box3()
    box.setFromObject(group)
    // const helper = new THREE.Box3Helper(box)
    // scene.add(helper)
    const center = box.getCenter(new THREE.Vector3())
    const size = box.getSize(new THREE.Vector3())
    const shape = new  THREE.Shape()
    shape.moveTo(center.x,center.z)
    // 底座大小在这控制 这里取半径的根号2倍
    let radius = Math.max(size.x,size.z) / 2 * Math.sqrt(2)
    shape.arc(0,0,radius,0,Math.PI * 2)
    let m = new THREE.MeshBasicMaterial({color:'red',side:2})
    const geo = new THREE.ShapeGeometry(shape,32)
    const mesh = new THREE.Mesh(geo,m)
    geo.center()
    mesh.rotateX(-Math.PI / 2)
    scene.add(mesh)
}