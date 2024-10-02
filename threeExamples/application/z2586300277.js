import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 100, 300)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.autoRotate = true

let sampler = null

let path = null

new OBJLoader().load(

    FILE_HOST + 'files/model/z2586300277.obj',

    (obj) => {

        sampler = new MeshSurfaceSampler(obj.children[0]).build();

        path = new Path();

        scene.add(path.line);

        renderer.setAnimationLoop(render);

    }

)

const tempPosition = new THREE.Vector3();

class Path {
    constructor() {

        this.vertices = [];

        this.geometry = new THREE.BufferGeometry();

        this.material = new THREE.LineBasicMaterial({ color: 0xa58fb5, transparent: true, opacity: 0.5 });

        this.line = new THREE.Line(this.geometry, this.material);

        sampler.sample(tempPosition);

        this.previousPoint = tempPosition.clone()

    }
    update() {

        let pointFound = false;

        while (!pointFound) {

            sampler.sample(tempPosition);

            if (tempPosition.distanceTo(this.previousPoint) < 20) {

                this.vertices.push(tempPosition.x, tempPosition.y, tempPosition.z);

                this.previousPoint = tempPosition.clone();

                pointFound = true;

            }

        }

        this.geometry.setAttribute("position", new THREE.Float32BufferAttribute(this.vertices, 3));

    }

}

function render() {

    if (path.vertices.length < 50000) {

        Array.from({ length: 10 }).forEach(() => path.update())

    }

    controls.update();

    renderer.render(scene, camera);

}

window.onresize = () => {

    camera.aspect = window.innerWidth / window.innerHeight;

    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);

}