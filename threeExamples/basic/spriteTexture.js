import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(2, 10, 10)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

controls.enableDamping = true

scene.add(new THREE.AxesHelper(100))

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

const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

const devicePixelRatio = window.devicePixelRatio * 4;
const logicalWidth = 124;
const logicalHeight = 164;

canvas.width = logicalWidth * devicePixelRatio;
canvas.height = logicalHeight * devicePixelRatio;
canvas.style.width = `${logicalWidth}px`;
canvas.style.height = `${logicalHeight}px`;

ctx.scale(devicePixelRatio, devicePixelRatio);

const img = new Image();
img.src = HOST + 'files/author/z2586300277.png';

const text = '测试文本';

const setText = () => {

    // 画图
    const imglong = 124;
    const left = (logicalWidth - imglong) / 2;
    ctx.drawImage(img, left, 40, imglong, imglong); // 向下移动图片

    // 写字
    ctx.fillStyle = '#fff';
    ctx.font = 'Bold 30px Arial';

    const textWidth = ctx.measureText(text).width;
    ctx.fillText(text, (logicalWidth - textWidth) / 2, 30); // 放在图片上方

    // 纹理图
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;

    // 纹理生成材质
    const material = new THREE.SpriteMaterial({ map: texture });

    // 创建精灵几何体
    const sprite = new THREE.Sprite(material);
    sprite.center = new THREE.Vector2(0.5, 0);

    return sprite;

}

img.onload = () => {

    for (let i = 0; i < 5; i++) {

        const sprite = setText()

        sprite.position.set(i, i, i)

        scene.add(sprite)

    }

}