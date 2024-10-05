import * as THREE from "three";
import gsap from 'gsap'

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x1E2630, 0.002)

const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000)
camera.animAngle = 0
camera.position.set(Math.cos(camera.animAngle) * 400, 180, Math.sin(camera.animAngle) * 400)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)
renderer.setClearColor(scene.fog.color)

scene.add(new THREE.GridHelper(600, 10))

const alight = new THREE.AmbientLight(0xffffff, 0.2)
scene.add(alight)

const light = new THREE.DirectionalLight(0xffffff, 1)
light.position.set(1, 1, 1)
scene.add(light)

const light2 = new THREE.DirectionalLight(0x002288, 1)
light2.position.set(-1, -1, -1)
scene.add(light2)

const dome = new THREE.Mesh(new THREE.IcosahedronGeometry(700, 1), new THREE.MeshPhongMaterial({
    color: 0xfb3550,
    side: THREE.BackSide
}))
scene.add(dome)

const planeGeometry = new THREE.PlaneGeometry(600, 600)
const planeMaterial = new THREE.MeshPhongMaterial({
    color: 0x222A38,
    transparent: true,
    opacity: 0.8,
    side: THREE.DoubleSide
})
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
plane.rotation.x = Math.PI / 2
scene.add(plane)

const geometry = new THREE.BoxGeometry(10, 10, 10)
const getMaterial = () => new THREE.MeshPhongMaterial({ color: 0xffffff * Math.random() })
const boxes = new Array(100).fill('').map(() => {
    const mesh = new THREE.Mesh(geometry, getMaterial())
    scene.add(mesh)
    return mesh
})

loop()
function loop() {

    const t = 1.5; //时间

    boxes.forEach(box => {

        gsap.to(box.scale, t, {
            x: 1 + Math.random() * 3,
            y: 1 + Math.random() * 20 + (Math.random() < 0.1 ? 15 : 0),
            z: 1 + Math.random() * 3
        })
        gsap.to(box.position, t, {
            x: -200 + Math.random() * 400,
            z: -200 + Math.random() * 400
        })

    })

    // 视角
    gsap.to(camera, t, {
        animAngle: camera.animAngle + (2 * Math.random() - 1) * Math.PI,
        onUpdate: function () {
            camera.position.x = Math.cos(camera.animAngle) * 440;
            camera.position.z = Math.sin(camera.animAngle) * 440;
            camera.updateProjectionMatrix();
            camera.lookAt(scene.position);
        }
    })

    const intens =  Math.random() 
    
    // 灯光强度
    gsap.to(light, t * 1.5, {
        intensity: intens * 3,
    })

    gsap.to(light2, t * 1.5, {
        intensity: intens * 3
    })

    gsap.to(alight, t * 1.5, {
        intensity: intens
    })

    gsap.to(window, 2.5, {
        onComplete: loop
    })
}

animate()

window.onresize = () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
}

animate()
function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
}
