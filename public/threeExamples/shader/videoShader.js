import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'dat.gui'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(0, 10, 10)

const renderer = new THREE.WebGLRenderer()

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

window.onresize = () => {

  renderer.setSize(box.clientWidth, box.clientHeight)

  camera.aspect = box.clientWidth / box.clientHeight

  camera.updateProjectionMatrix()
  
}

scene.add(new THREE.AxesHelper(50000)) // 坐标轴

const amibientLight = new THREE.AmbientLight(0xffffff, 4) // 环境光

scene.add(amibientLight) // 添加环境光

const geometry = new THREE.BoxGeometry(5, 5, 5) // 立方体

const video = document.createElement('video')

video.crossOrigin = 'anonymous' // 跨域

video.src = 'http://vjs.zencdn.net/v/oceans.mp4'

video.loop = true // 循环播放

video.muted = true // 静音

video.play()

const texture = await new Promise(r => video.onloadeddata = () => r(new THREE.VideoTexture(video))) // 创建视频纹理

// 使用 shader 库中的phong材质 进行修改
const shader = {
    
    uniforms: THREE.UniformsUtils.merge([

        THREE.ShaderLib['phong'].uniforms,

        {
            r: {
                type: 'v2',
                value: new THREE.Vector2(box.clientWidth, box.clientHeight)
            },
            t: {
                type: 'f',
                value: 0.0
            },
            colorTexture: { value: texture },
            calcType: {
                value: 2
            }
        }

    ]),

    vertexShader: THREE.ShaderLib['phong'].vertexShader,

    fragmentShader: THREE.ShaderLib['phong'].fragmentShader,

}

// GUI 切换混合运算类型
const GUI = new dat.GUI()

GUI.add(shader.uniforms.calcType, 'value', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]).name('混合运算类型');

// 动画
animate()

function animate() {

    shader.uniforms.t.value += 0.1

    renderer.render(scene, camera)

    requestAnimationFrame(animate)

}

shader.vertexShader = shader.vertexShader.replace(/#include <common>/, `
    varying vec2 vUv;
    #include <common>    
`)

shader.vertexShader = shader.vertexShader.replace('void main() {', `
    void main() {
    vUv = uv; 
`)

shader.fragmentShader = shader.fragmentShader.replace(/#include <common>/, `
    precision highp float;
    varying vec2 vUv;
    uniform vec2 r;
    uniform float t;
    uniform float calcType;
    uniform sampler2D colorTexture;
    #include <common> 
`)

shader.fragmentShader = shader.fragmentShader.replace('vec4 diffuseColor = vec4( diffuse, opacity );', `
   vec3 c;
    float l,z=t;
    for(int i=0;i<3;i++) {
        vec2 uv,p=gl_FragCoord.xy/r/2.0;
        uv=p +  2.0 * vUv;
        p-=.5;
        p.x*=r.x/r.y;
        z+=.07;
        l=length(p);
        uv+=p/l*(sin(z)+1.)*abs(sin(l*9.-z-z));
        c[i]=.01/length(mod(uv,1.)-.5);
    }
  vec3 color = texture2D( colorTexture, vUv ).rgb;
  vec3 mixedColor;
  if (calcType == 0.0)  mixedColor = max(color, c);
  else if(calcType == 1.0) mixedColor = min(color, c);
  else if(calcType == 2.0) mixedColor = mix(color, c, 0.5);
  else if(calcType == 3.0) mixedColor = mod(color, c);
  else if(calcType == 4.0) mixedColor = pow(color, c);
  else if(calcType == 5.0) mixedColor = step(color, c);
  else if(calcType == 6.0) mixedColor = color + c;
  else if(calcType == 7.0) mixedColor = color - c;
  else if(calcType == 8.0) mixedColor = c  - color;
  else if(calcType == 9.0) mixedColor = color + c - vec3(1.0) * c * color;
  else mixedColor = color;
  vec4 diffuseColor = vec4( diffuse * mixedColor, opacity );
`)

const material = new THREE.ShaderMaterial(shader)

material.lights = true // 光照影响

const mesh = new THREE.Mesh(geometry, material)

scene.add(mesh)