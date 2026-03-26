import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import { GUI } from 'dat.gui'

const box = document.getElementById('box')
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 100000)
camera.position.set(30, 30, 30)
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })
renderer.setSize(box.clientWidth, box.clientHeight)
box.appendChild(renderer.domElement)
const controls = new OrbitControls(camera, renderer.domElement)
scene.add(new THREE.AxesHelper(5000))

animate()
function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
}

// 创建一个mesh
const geometry = new THREE.BoxGeometry()
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// 设置默认动画参数
gsap.defaults({
    ease: "none",
    duration: 2,
});

/**
 * 所有参数
 * duration: 2, // 动画持续时间
 * delay: 0, // 动画延迟时间
 * repeat: 0, // 重复次数
 * repeatDelay: 0, // 重复之间的延迟时间
 * yoyo: false, // 是否往返动画
 * ease: "none", // 动画缓动函数
 * onStart: null, // 动画开始回调函数
 * onUpdate: null, // 动画更新回调函数
 * onComplete: null, // 动画完成回调函数
 * onRepeat: null, // 动画重复回调函数
 * reversed: false, // 是否反向播放动画
 * startAt: { x: 0, y: 0, z: 0, opacity: 1 }, // 动画开始时的属性值
 * 属性同名方法基本是 获取或者设置动画属性值
 */
let tween = gsap.to(mesh.position, {
    z: 30,
    delay: 0.5
}).repeat(1) // 重复一次 等同于设置 repeat: 1
// .timeScale(0.5) // 设置动画的时间缩放，值为 0.5 时动画将以正常速度的一半播放
// .then(() => console.log('动画完成')) // tween 就会变成Promise 对象

// tween.progress(0.3) // 将动画的进度设置为 0.3 会待过 delay 的时间
tween.pause() // 停止
// tween.paused(true) // 也可以这样停止 获取或设置动画的暂停状态

const gui = new GUI()

const folder1 = gui.addFolder('基础动画控制')
folder1.open()

folder1.add({ play: () => tween.play() }, 'play').name('播放动画')
folder1.add({ pause: () => tween.pause() }, 'pause').name('停止动画')
console.log(tween) // tween 对象上有很多方法可以控制动画的播放
folder1.add({ restart: () => tween.restart() }, 'restart').name('重新开始动画')
folder1.add({ reverse: () => tween.reverse() }, 'reverse').name('反向播放动画')

folder1.add({ resume: () => tween.resume() }, 'resume').name('继续动画') // 仅在动画暂停（pause）时使用
folder1.add({ revert: () => tween.revert() }, 'revert').name('回退并动画') // 回退动画并终止它，将目标恢复到动画之前的状态
folder1.add({ kill: () => tween.kill() }, 'kill').name('终止动画') // 终止动画并将其从内存中移除，无法再对其进行控制

// 不会终止 tween 的播放，但会将其时间跳转设置为 value 的值
folder1.add({ seek: 0 }, 'seek').step(0.01).onChange(value => tween.seek(value, false))

folder1.add({
    fn: () => {

        // 由于gsap3 本身就是全局时间线, 所以可以接受第三个参数 => 位置参数  
        gsap.to(mesh.position, {
            y: 30,
            duration: 0.5,
            repeat: 1
        }, 2) //此处位置参数表示2秒后开始动画

    }
}, 'fn').name('y轴动画')

const mesh2 = mesh.clone()
mesh2.material = new THREE.MeshBasicMaterial({ color: 'red' })
mesh2.position.x = 5
scene.add(mesh2)

const mesh3 = mesh.clone()
mesh3.material = new THREE.MeshBasicMaterial({ color: 'yellow' })
mesh3.position.x = 10
scene.add(mesh3)

folder1.add({
    fn: () => {
        gsap.to([mesh.position, mesh2.position, mesh3.position], {
            y: 30,
            duration: 0.5,
            repeat: 1,
            stagger: 0.2 // 每个动画之间的延迟时间
        })
    }
}, 'fn').name('控制多个')

const folder2 = gui.addFolder('时间线动画控制')
folder2.open()