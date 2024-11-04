import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 10000)

camera.position.set(0, 800, 1000)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

controls.enableDamping = true

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

// 定义雷达参数
const radarData = {
  position: {
    x: 0,
    y: 20,
    z: 0
  },
  radius: 240,
  color: '#f005f0',
  opacity: 0.5,
  speed: 300,
  followWidth: 220
}

// 创建几何体
const circleGeometry = new THREE.CircleGeometry(radarData.radius, 1000)
const rotateMatrix = new THREE.Matrix4().makeRotationX((-Math.PI / 180) * 90)
circleGeometry.applyMatrix4(rotateMatrix)

// 创建材质
const material = new THREE.MeshBasicMaterial({
  color: radarData.color,
  opacity: radarData.opacity,
  transparent: true
})

const radar = new THREE.Mesh(circleGeometry, material)
radar.updateMatrix()

scene.add(radar)

material.onBeforeCompile = (shader) => {
  Object.assign(shader.uniforms, {
    uSpeed: {
      value: radarData.speed
    },
    uRadius: {
      value: radarData.radius
    },
    uTime: {
      value: 0
    },
    uFollowWidth: {
      value: radarData.followWidth
    }
  })

  requestAnimationFrame(function update(time) {
    shader.uniforms.uTime.value = time / 1000
    requestAnimationFrame(update)
  })

  const vertex = `


      varying vec3 vPosition;
      void main() {

        vPosition = position;

    `
  shader.vertexShader = shader.vertexShader.replace('void main() {', vertex)
  const fragment = `


      uniform float uRadius;     
      uniform float uTime;            
      uniform float uSpeed; 
      uniform float uFollowWidth; 
      varying vec3 vPosition;
     

      float calcAngle(vec3 oFrag){

        float fragAngle;

        const vec3 ox = vec3(1,0,0);

        float dianji = oFrag.x * ox.x + oFrag.z*ox.z;

        float oFrag_length = length(oFrag); // length是内置函数
        float ox_length = length(ox); // length是内置函数

        float yuxian = dianji / (oFrag_length * ox_length);


        fragAngle = acos(yuxian);
        fragAngle = degrees(fragAngle);


        if(oFrag.z > 0.0) {
          fragAngle = -fragAngle + 360.0;
        }


        float scanAngle = uTime * uSpeed - floor(uTime * uSpeed / 360.0) * 360.0;

        float angle = scanAngle - fragAngle;

        if(angle < 0.0){
          angle = angle + 360.0;
        }


        return angle;
      }

      void main() {
  
    `

  const fragementColor = `
      #include <opaque_fragment>
      

      // length内置函数，取向量的长度
      if(length(vPosition) == 0.0 || length(vPosition) > uRadius-2.0){
        gl_FragColor = vec4( outgoingLight, diffuseColor.a );

      } else {

        float angle = calcAngle(vPosition);
        if(angle < uFollowWidth){
          // 尾焰区域
          float opacity =  1.0 - angle / uFollowWidth; 
          gl_FragColor = vec4( outgoingLight, diffuseColor.a * opacity );  

        } else {
          // 其他位置的像素均为透明
          gl_FragColor = vec4( outgoingLight, 0.0 ); 

        }

      }
      
    `
  shader.fragmentShader = shader.fragmentShader.replace('void main() {', fragment)

  shader.fragmentShader = shader.fragmentShader.replace('#include <opaque_fragment>', fragementColor)

}