import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 1000)
camera.position.set(0, 0, 10)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })
renderer.setSize(box.clientWidth, box.clientHeight)
box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

const loader = new FontLoader()
loader.load(FILE_HOST + 'files/json/font.json', font => {

    const textGeometry = new TextGeometry(`
        Three.js
        Cesium.js
        Examples
          - star -
    `, {
        font,
        size: 1,
        depth: 0.5,
        curveSegments: 10,
        bevelEnabled: false,
        bevelThickness: 0.1,
        bevelSize: 0.1,
        bevelSegments: 5
    }).center()

    const mesh = new THREE.Mesh(textGeometry, new THREE.MeshBasicMaterial({ color: 0xffffff }));
    const sampler = new MeshSurfaceSampler(mesh).build();
    const positions = new Float32Array(30000);
    const colors = new Float32Array(30000);
    const samplePoint = new THREE.Vector3();
    const color = new THREE.Color();
    
    for (let i = 0; i < 10000; i++) {
        sampler.sample(samplePoint);
        positions.set([samplePoint.x, samplePoint.y, samplePoint.z], i * 3);
    
        // 随机生成颜色
        color.setHSL(Math.random(), 1.0, 0.5);
        colors.set([color.r, color.g, color.b], i * 3);
    }
    
    const pointsGeometry = new THREE.BufferGeometry();
    pointsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pointsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const pointsMaterial = new THREE.PointsMaterial({ size: 0.04, vertexColors: true });
    scene.add(new THREE.Points(pointsGeometry, pointsMaterial));

})

animate()
function animate() {

    requestAnimationFrame(animate)
    controls.update()
    renderer.render(scene, camera)

}

window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)
    camera.aspect = box.clientWidth / box.clientHeight
    camera.updateProjectionMatrix()

}