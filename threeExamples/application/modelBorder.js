import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'
import { BufferGeometry, EdgesGeometry } from 'three';
import { mergeAttributes } from 'three/addons/utils/BufferGeometryUtils.js';

class MeshEdgesGeometry extends BufferGeometry {

    constructor(object, thresholdAngle = 1) {

        super();

        object.updateWorldMatrix(true, true);

        var position = this.extractEdges(object, thresholdAngle);

        this.setAttribute('position', position);

    } // MeshEdgesGeometry.constructor

    extractEdges(object, thresholdAngle) {

        var attributes = [];

        object.traverse(child => {

            if (child.geometry) {

                var geo = new EdgesGeometry(child.geometry, thresholdAngle);
                var pos = geo.getAttribute('position');

                attributes.push(pos.applyMatrix4(child.matrixWorld));

            } // if

        }); // object.traverse

        if (attributes.length == 0) {

            throw 'MeshEdgesGeometry: No edges found';

        }

        return mergeAttributes(attributes);

    } // MeshEdgesGeometry.extractEdges

} // MeshEdgesGeometry

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 100000)

camera.position.set(10, 10, 12)

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

const loader = new GLTFLoader()

loader.setDRACOLoader(new DRACOLoader().setDecoderPath(FILE_HOST + 'js/three/draco/'))

loader.load(

    FILE_HOST + 'files/model/elegant.glb',

    gltf => {

        const model = new THREE.LineSegments(new MeshEdgesGeometry(gltf.scene), new THREE.LineBasicMaterial({ color: 'pink' }));

        scene.add(model)

    }

)


