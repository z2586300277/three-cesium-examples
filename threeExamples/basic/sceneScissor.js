import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';

const box = document.getElementById('box')
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000)
camera.position.set(0, 10, 10)
const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true , logarithmicDepthBuffer: true})
renderer.setSize(box.clientWidth, box.clientHeight)
renderer.setAnimationLoop(animate)
box.appendChild(renderer.domElement)
new OrbitControls(camera, renderer.domElement)

const renderPass = new RenderPass(scene, camera);

// 无辉光渲染
const composer_original = new EffectComposer(renderer);
composer_original.addPass(renderPass);

// 辉光渲染
const composer_bloom = new EffectComposer(renderer);
composer_bloom.addPass(renderPass);
composer_bloom.addPass( new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.5, 0, 0));


// 设置分割线位置
let initialWidth = 350
createSlider(document.body, initialWidth, (left) => initialWidth = left)

function animate() {

    renderer.setScissorTest( true )

    renderer.setScissor( 0, 0, initialWidth, box.offsetHeight );
    composer_original.render()

    renderer.setScissor( initialWidth, 0, box.clientWidth - initialWidth, box.offsetHeight );
    composer_bloom.render();

    renderer.setScissorTest( false )

}

// 物体
for (let i = 0; i < 100; i++) {
    const geometry = new THREE.BoxGeometry(1, 1, 1)
    const material = new THREE.MeshBasicMaterial({ color: Math.random() * 0xffffff })
    const cube = new THREE.Mesh(geometry, material)
    cube.position.set(Math.random() * 10 - 5, Math.random() * 10 - 5, Math.random() * 10 - 5)
    scene.add(cube)
}

/* 分割滑块方法 */
function createSlider(box, initialWidth, callback) {

    const minLeftWidth = 50;
    const minRightWidth = 100;
    const slider_dom = document.createElement('div')
    box.prepend(slider_dom)

    const color = 'rgba(255, 255, 255, 0.5)'
    Object.assign(slider_dom.style, {
        position: 'absolute',
        left: initialWidth + 'px',
        height: box.clientHeight + 'px',
        transition: 'background 0.5s',
        backgroundColor: color,
        width: '2px',
        cursor: 'ew-resize',
    })

    const move = () => {
        slider_dom.style.backgroundColor = '#277CD5'
        document.body.style.cursor = 'ew-resize'
    }
    const leave = () => {
        slider_dom.style.backgroundColor = color
        document.body.style.cursor = 'default'
    }

    slider_dom.onmousemove = move
    slider_dom.onmouseleave = leave

    slider_dom.ondblclick = function () {
        slider_dom.style.left = initialWidth + 'px'
        callback?.(initialWidth)
    }

    slider_dom.onmousedown = function (e) {

        e.preventDefault()
        let old_left = slider_dom.getBoundingClientRect().left - box.getBoundingClientRect().left

        document.onmousemove = function (e) {

            move()

            if (old_left + e.movementX < minLeftWidth) return
            if (old_left + e.movementX > box.clientWidth - minRightWidth) return

            old_left += e.movementX;
            slider_dom.style.left = old_left + 'px';
            callback?.(old_left)
        }

        document.onmouseup = function () {
            document.onmousemove = null;
            leave()
        }
    }
}