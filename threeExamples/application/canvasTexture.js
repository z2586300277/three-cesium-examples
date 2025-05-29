import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as echarts from 'echarts'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 100000)

camera.position.set(0, 0, 3)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

const w = 800, h = 600
const container = document.createElement('canvas')
// 设置实际尺寸而不是CSS尺寸
container.width = w
container.height = h
// 保持CSS尺寸以便echarts正确初始化
container.style.width = w + "px"
container.style.height = h + "px"

const myChart = echarts.init(container, null, {
    devicePixelRatio: window.devicePixelRatio // 使用正确的设备像素比
})
const texture = new THREE.CanvasTexture(container)
// 设置贴图过滤模式以提高清晰度
texture.minFilter = THREE.LinearFilter
texture.magFilter = THREE.LinearFilter

// 计算保持纵横比的平面尺寸
const aspectRatio = w / h
const planeWidth = 4
const planeHeight = planeWidth / aspectRatio
const planeGeometry = new THREE.PlaneGeometry(planeWidth, planeHeight)
const planeMaterial = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide, transparent: true })
const plane = new THREE.Mesh(planeGeometry, planeMaterial)
scene.add(plane)

const uniforms = {
    iResolution: {
        type: 'v2',
        value: new THREE.Vector2(box.clientWidth, box.clientHeight)
    },
    iTime: {
        type: 'f',
        value: 1.0
    }
}
planeMaterial.onBeforeCompile = shader => {
    shader.uniforms.iResolution = uniforms.iResolution
    shader.uniforms.iTime = uniforms.iTime
    shader.fragmentShader = shader.fragmentShader.replace(/#include <common>/, `
        uniform vec2 iResolution;
        uniform float iTime;
        #include <common> 
    `)
    shader.fragmentShader = shader.fragmentShader.replace('vec4 diffuseColor = vec4( diffuse, opacity );', `
        vec3 c;
        float l,z=iTime;
        for(int i=0;i<3;i++) {
            vec2 uv,p=gl_FragCoord.xy/iResolution;
            uv=p +  2.0;
            p-=.5;
            p.x*=iResolution.x/iResolution.y;
            z+=.07;
            l=length(p);
            uv+=p/l*(sin(z)+1.)*abs(sin(l*9.-z-z));
            c[i]=.01/length(mod(uv,1.)-.5);
        }
        vec4 diffuseColor = vec4( diffuse * c  * vec3(8.,8.,8.), opacity );
    `)
}

animate()

function animate() {
    texture.needsUpdate = true
    uniforms.iTime.value += 0.05
    requestAnimationFrame(animate)
    renderer.render(scene, camera)

}

const data = [820, 932, 901, 934, 1290, 1330, 1320]
const option = {
    xAxis: {
        type: 'category',
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
        type: 'value'
    },
    series: [
        {
            data,
            type: 'line',
            areaStyle: {}
        }
    ]
}
myChart.setOption(option)
setInterval(() => {
    data.forEach((item, index) => {
        data[index] = Math.floor(Math.random() * 1000)
    })
    myChart.setOption({
        series: [{
            data: data
        }]
    })
}, 2000)