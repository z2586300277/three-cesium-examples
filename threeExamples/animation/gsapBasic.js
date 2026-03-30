import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import { GUI } from 'dat.gui'

const box = document.getElementById('box')
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 100000)
camera.position.set(0, 10, 40)
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })
renderer.setSize(box.clientWidth, box.clientHeight)
box.appendChild(renderer.domElement)
const controls = new OrbitControls(camera, renderer.domElement)
scene.add(new THREE.GridHelper(100, 20))
const gidHelper = new THREE.GridHelper(100, 20)
gidHelper.rotation.x = Math.PI / 2
scene.add(gidHelper)

animate()
function animate() {
    requestAnimationFrame(animate)
    renderer.render(scene, camera)
}

function createMesh(color = 0xffffff, p, size = 1) {
    const geometry = new THREE.BoxGeometry(size, size, size)
    const material = new THREE.MeshBasicMaterial({ color })
    const mesh = new THREE.Mesh(geometry, material)
    if (p) mesh.position.set(...p)
    scene.add(mesh)
    return mesh
}
const mesh = createMesh()

// https://gsap.com/cheatsheet

// 设置默认动画参数
gsap.defaults({ ease: "none", duration: 2 });

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
 * overwrite: false, // 是否覆盖同一目标的其他动画
 * startAt: { x: 0, y: 0, z: 0, opacity: 1 }, // 动画开始时的属性值
 * 属性同名方法基本是 获取或者设置动画属性值
 * gsap.killTweensOf(mesh6.position) // 终止 mesh6 上的所有动画
 */

let tween = gsap.to(
    mesh.position, { z: 30, delay: 0.5 }
).repeat(1) // 重复一次 等同于设置 repeat: 1
// .timeScale(0.5) // 设置动画的时间缩放，值为 0.5 时动画将以正常速度的一半播放
// .then(() => console.log('动画完成')) // tween 就会变成Promise 对象

// tween.progress(0.3) // 将动画的进度设置为 0.3 会待过 delay 的时间
tween.pause() // 停止
// tween.paused(true) // 也可以这样停止 获取或设置动画的暂停状态

const gui = new GUI()

const folder = gui.addFolder('动画类型')
folder.add({ fn: () => gsap.from(mesh.position, { y: 30, duration: 2 }) }, 'fn').name('from从指定值到当前值')
folder.add({ fn: () => gsap.fromTo(mesh.position, { y: 25 }, { y: 15, duration: 2 }) }, 'fn').name('fromTo从指定值到指定值')

const folder1 = gui.addFolder('基础动画控制')
// folder1.open()

folder1.add({ play: () => tween.play() }, 'play').name('播放动画')
folder1.add({ pause: () => tween.pause() }, 'pause').name('停止动画')

folder1.add({ restart: () => tween.restart() }, 'restart').name('重新开始动画')
folder1.add({ reverse: () => tween.reverse() }, 'reverse').name('反向播放动画')

folder1.add({ resume: () => tween.resume() }, 'resume').name('继续动画') // 仅在动画暂停（pause）时使用
folder1.add({ revert: () => tween.revert() }, 'revert').name('回退并终止动画') // 回退动画并终止它，将目标恢复到动画之前的状态
folder1.add({ kill: () => tween.kill() }, 'kill').name('终止动画') // 终止动画并将其从内存中移除，无法再对其进行控制

// 不会终止 tween 的播放，但会将其时间跳转设置为 value 的值
folder1.add({ seek: 0 }, 'seek').step(0.01).onChange(value => tween.seek(value, false)).name('跳转到指定时间') // 第二个参数表示是否跳过 delay 的时间

folder1.add({
    fn: () => {

        // 由于gsap3 本身就是全局时间线, 所以可以接受第三个参数 => 位置参数  
        gsap.to(mesh.position, {
            y: 30,
            duration: 0.5,
            repeat: 1
        }, 2) //此处位置参数表示2秒后开始动画

    }
}, 'fn').name('第三个参数')

const mesh2 = createMesh(0xff0000, [5, 0, 0])
const mesh3 = createMesh(0x00ff00, [10, 0, 0])

folder1.add({
    fn: () => {
        gsap.to([mesh.position, mesh2.position, mesh3.position], {
            y: 30,
            duration: 0.5,
            repeat: 1,
            stagger: 0.2 // 每个动画之间的延迟时间
        })
    }
}, 'fn').name('多个目标-间隔错开')

const mesh4 = createMesh(0x0000ff, [5, 0, 5])
folder1.add({
    fn: () =>
        gsap.to(mesh4.position, {
            y: '+=5', // 相对值
            duration: 1,
            repeat: 1,
            repeatDelay: 0.5, // 重复之间的延迟时间
            repeatRefresh: true // 每次重复时重新计算动画的起始值
        })
}, 'fn').name('相对-延迟-刷新重复')

folder1.add({
    fn: () => {
        gsap.to(mesh4.position, {
            y: 'random(-5, 10)', // 随机
            duration: 1
        })
    }
}, 'fn').name('随机值')

const mesh5 = createMesh(0xffff00, [10, 0, 5])
folder1.add({
    fn: () =>
        gsap.to(mesh5.position, {
            y: '18',
            snap: { y: 2 }, // 将 y 的最终值吸附到最接近的 2 的倍数（如 0, 2, 4, 6...）
            duration: 1
        })
}, 'fn').name('snap吸附值')

const mesh7 = createMesh(0x00ffff, [15, 0, 5])
folder1.add({
    fn: () => {
        gsap.to(mesh7.position, {
            keyframes: [
                { y: 10, duration: 0.5 },
                { x: 20, duration: 0.3 },
                { y: 0, duration: 0.4 },
                { x: 30, duration: 0.3 }  // 回到地面
            ],
            ease: "none"
        })
    }
}, 'fn').name('keyframes关键帧')


const folder2 = gui.addFolder('时间线')
folder2.open()

folder2.addFn = (fn) => {
    const obj = { fn }
    return folder2.add(obj, 'fn')
}

/**
 * gsap.timeline 参数
 * 写在 defaults 外面的属性是控制 timeline 自身行为的，写在 defaults 里面的属性是传递给子动画的。
 * 	delay: 0.5, // 动画延迟时间
	paused: true, //  动画是否从一开始就暂停
	repeat: 2, // 重复次数 (-1 表示无限循环)
	repeatDelay: 1, // 重复之间的延迟时间
	repeatRefresh: true, // 每次重复时重新计算动画的起始值
	yoyo: true, // 如果为 true > A-B-B-A, 如果为 false > A-B-A-B
	defaults: {
		// 这里面的是给子动画的默认参数 
		duration: 1,
		ease: 'none',
        ... 例如 gsap.to 里面的所有参数
	},
	smoothChildTiming: true, // 使时间线中的动画在父时间线的时间缩放、暂停、反向等操作下保持同步
	autoRemoveChildren: true, // 当动画完成后自动从时间线中移除它们
	onComplete: () => console.log('时间线完成') // 时间线完成回调函数
 */
const mesh6 = createMesh(0xff00ff, [0, 0, 15])

// timeline 让多个动画按顺序依次播放（前一个完成后，下一个自动开始）
folder2.addFn(() => {

    const tl = gsap.timeline({ defaults: { duration: 0.8, ease: 'none' } })

    // 链式调用 .to()，动画会按顺序执行
    tl.to(mesh6.position, { y: 10 })   // 第1段：向上移动
      .to(mesh6.position, { x: 10 })   // 第2段：向右移动（等第1段完成后才开始）
      .to(mesh6.position, { z: 25 })   // 第3段：向前移动
      .to(mesh6.position, { y: 0 })    // 第4段：回到地面

}).name('1-连续动画')

/**
 * 位置参数
 * "<" : 与上一个动画同时开始 <0.2 : 与上一个动画开始后 0.2s  <-0.3 : 与上一个动画开始前 0.3s
 * ">": 上一个动画结束后开始（默认行为，等同于不写） >0.5 : 上一个动画结束后再等 0.5s  >-0.2 : 上一个动画结束前 0.2s
 * 绝对时间：在时间线的某个具体时间点开始，如 0.5 表示在时间线的 0.5s 处开始
 * 相对偏移：相对于默认位置的偏移，如 "-=0.3" 表示比默认位置提前 0.3s 开始，"+=0.5" 表示比默认位置延后 0.5s 开始
 * mylabel : 从标签 mylabel 处开始
 * mylabel+=0.2 : 从标签 mylabel 后 0.2s 处开始
 * mylabel-=0.2 : 从标签 mylabel 前 0.2s 处开始
 * -=50% <25% : 相对于上一个动画持续时间的百分比偏移，如 "-=50%" 表示比默认位置提前 50% 的时间，"<25%" 表示与上一个动画同时开始，但在上一个动画的前 25% 时间点处开始 
 */
const mesh8 = createMesh(0xffa500, [5, 0, 15])
const mesh9 = createMesh(0x888888, [10, 0, 15])

folder2.addFn(() => {
    const tl = gsap.timeline({ defaults: { duration: 2, ease: 'none' } })

    tl.to(mesh6.position, { y: 10 })           // 正常：从 0s 开始
      .to(mesh8.position, { y: 10 }, "<")       // "<" : 与上一个动画同时开始
      .to(mesh9.position, { y: 10 }, "<1")    // "<1" : 与上一个动画开始后 1s 
}).name('2-同时开始 <')

folder2.addFn(() => {
    const tl = gsap.timeline({ defaults: { duration: 1, ease: 'none' } })

    tl.to(mesh6.position, { y: 10 })
      .to(mesh8.position, { y: 10 }, ">")       // ">" : 上一个动画结束后开始（默认行为，等同于不写）
      .to(mesh9.position, { y: 10 }, ">1")    // ">0.5" : 上一个动画结束后再等 0.5s
}).name('3-结束后 >')

folder2.addFn(() => {
    const tl = gsap.timeline({ defaults: { duration: 2, ease: 'none' } })

    tl.to(mesh6.position, { y: 10 })
      .to(mesh8.position, { y: 10 }, 0.5)        // 绝对时间：在时间线的 0.3s 处开始
      .to(mesh9.position, { y: 10 }, 1)           // 绝对时间：在时间线的 1s 处开始
}).name('4-绝对时间')

folder2.addFn(() => {
    const tl = gsap.timeline({ defaults: {  ease: 'none' } })

    tl.to(mesh6.position, { y: 10 , duration: 2, })
      .to(mesh8.position, { y: 10 , duration: 1}, "<")    // "<" : 与上一个动画同时开始
      // 相对是针对前面动画总时间的末尾 并不是上一个动画结束末尾
      .to(mesh9.position, { y: 10 }, "+=0.5")    // "+=0.5" : 比默认位置延后 0.5s（留空隙）
}).name('5-相对偏移 +=/-=')

// ========== 第3步：Timeline 控制方法 ==========
// timeline 和 tween 一样，支持 play/pause/reverse/seek 等全部控制方法
let mainTl = gsap.timeline({
    defaults: { duration: 0.6, ease: 'power2.inOut' },
    paused: true,  // 创建时暂停，手动控制播放
    repeat: 1,
    yoyo: true
})
mainTl.to(mesh6.position, { y: 15 })
    .to(mesh8.position, { y: 15 }, "<")
    .to(mesh9.position, { y: 15 }, "<0.2")
    .to(mesh6.position, { x: 10 })
    .to(mesh8.position, { x: 15 }, "<")

folder2.addFn(() => mainTl.play()).name('6-tl.play()')
folder2.addFn(() => mainTl.pause()).name('6-tl.pause()')
folder2.addFn(() => mainTl.reverse()).name('6-tl.reverse()')
folder2.addFn(() => mainTl.restart()).name('6-tl.restart()')
folder2.add({ progress: 0 }, 'progress', 0, 1).step(0.01).onChange(v => {
    mainTl.progress(v) // 拖拽滑块控制整条时间线的进度
}).name('6-tl.progress滑块')

// ========== 第4步：label 标签 ==========
// label 可以给时间线的某个时间点命名，方便跳转和定位
folder2.addFn(() => {
    const tl = gsap.timeline({ defaults: { duration: 0.6, ease: 'bounce.out' } })

    tl.to(mesh6.position, { y: 10 })
      .addLabel("middle")                            // 在此处添加标签 "middle"
      .to(mesh8.position, { y: 10 }, "middle")       // 从 "middle" 标签处开始
      .to(mesh9.position, { y: 10 }, "middle+=0.2")  // 从 "middle" 标签后 0.2s 开始
      .addLabel("end")

    // 也可以跳转到标签
    // tl.play("middle")   // 从 middle 标签处开始播放
    // tl.seek("end")      // 直接跳到 end 标签

    console.log('标签 middle 的时间点:', tl.labels.middle, 's')
    console.log('标签 end 的时间点:', tl.labels.end, 's')
}).name('7-label标签')

// ========== 第5步：嵌套时间线 ==========
// 时间线可以嵌套，把复杂动画拆分成可复用的小段
function bounceUp(target) {
    // 返回一个独立的小时间线
    const tl = gsap.timeline()
    tl.to(target.position, { y: 12, duration: 0.3, ease: 'none' })
      .to(target.position, { y: 0, duration: 0.3, ease: 'bounce.out' })
    return tl
}

function slideRight(target, distance = 10) {
    const tl = gsap.timeline()
    tl.to(target.position, { x: `+=${distance}`, duration: 0.5, ease: 'power1.inOut' })
    return tl
}

folder2.addFn(() => {
    const masterTl = gsap.timeline()

    // 把小时间线作为子动画添加到主时间线
    masterTl.add(bounceUp(mesh6))           // 先弹跳 mesh6
            .add(bounceUp(mesh8), "-=0.1")  // 稍微重叠，弹跳 mesh8
            .add(bounceUp(mesh9), "-=0.1")  // 再弹跳 mesh9
            .add(slideRight(mesh6))          // 然后 mesh6 向右滑
            .add(slideRight(mesh8), "<")     // mesh8 同时向右滑

}).name('8-嵌套时间线')

// ========== 第6步：综合实战 - 方块编队表演 ==========
folder2.addFn(() => {
    // 先重置所有位置
    gsap.set(mesh6.position, { x: 0, y: 0, z: 15 })
    gsap.set(mesh8.position, { x: 5, y: 0, z: 15 })
    gsap.set(mesh9.position, { x: 10, y: 0, z: 15 })

    const tl = gsap.timeline({
        defaults: { ease: 'power2.inOut' },
        onStart: () => console.log('🎬 表演开始'),
        onComplete: () => console.log('🎬 表演结束')
    })

    tl
      // 第一幕：三个方块同时升起，高度不同
      .to(mesh6.position, { y: 5, duration: 0.5 })
      .to(mesh8.position, { y: 10, duration: 0.5 }, "<")
      .to(mesh9.position, { y: 15, duration: 0.5 }, "<")

      .addLabel("risen")

      // 第二幕：旋转
      .to(mesh6.rotation, { y: Math.PI * 2, duration: 1 }, "risen")
      .to(mesh8.rotation, { y: Math.PI * 2, duration: 1 }, "risen+=0.1")
      .to(mesh9.rotation, { y: Math.PI * 2, duration: 1 }, "risen+=0.2")

      .addLabel("spun")

      // 第三幕：向中心聚拢
      .to(mesh6.position, { x: 5, duration: 0.6 }, "spun")
      .to(mesh9.position, { x: 5, duration: 0.6 }, "spun")

      // 第四幕：一起落下
      .to([mesh6.position, mesh8.position, mesh9.position], {
          y: 0,
          duration: 0.4,
          ease: 'bounce.out',
          stagger: 0.1
      })

      // 第五幕：散开回到原位
      .to(mesh6.position, { x: 0, duration: 0.5 })
      .to(mesh9.position, { x: 10, duration: 0.5 }, "<")

}).name('9-综合实战表演')