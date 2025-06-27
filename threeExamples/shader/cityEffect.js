import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(50, box.clientWidth / box.clientHeight, 0.1, 100000)

camera.position.set(0, 400, 1000)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setPixelRatio(window.devicePixelRatio * 1.3)

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)

controls.enableDamping = true

// 文件地址
const urls = [0, 1, 2, 3, 4, 5].map(k => (FILE_HOST + 'files/sky/skyBox0/' + (k + 1) + '.png'));

const textureCube = new THREE.CubeTextureLoader().load(urls);

scene.background = textureCube;

const renderList = []

const light = new THREE.AmbientLight(0xadadad)

scene.add(light)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)

directionalLight.position.set(600, 600, 0)

scene.add(directionalLight)

/**
 * 对于shader内容的修改，需要根据具体内容进行处理
 * shader中会存在#include <begin_vertex>等语句，这些事three定义的glsl，具体脚本内容查看three源码中renderer/shaders/shaderChunk下对应脚本文件
 * 而修改shader就是在对应的脚本语句后修改脚本或增加语句
 */
const applyGrowShader = (shader) => {
    shader.uniforms.uProgress = { value: 0 }
    shader.vertexShader = `
    uniform float uProgress;
    ${shader.vertexShader}
  `
    shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `
      #include <begin_vertex>
      transformed.z = position.z * min(uProgress, 1.0);
    `
    )
    renderList.push((progress) => {
        shader.uniforms.uProgress.value = progress
    })
}
// 建筑表面流动上升效果
const applyRiseShader = (shader) => {
    shader.uniforms.uRiseTime = { value: 0 }
    shader.uniforms.uRiseColor = { value: new THREE.Color('#87CEEB') }

    shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        `
      #include <common>
      varying vec3 vTransformedNormal;
      varying float vHeight;
    `
    )
    shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `
      #include <begin_vertex>
      vTransformedNormal = normalize(normal);
      vHeight = transformed.z;
    `
    )

    shader.fragmentShader = shader.fragmentShader.replace(
        '#include <common>',
        `
      #include <common>
      uniform vec3 uRiseColor;
      uniform float uRiseTime;
      varying float vHeight;
      varying vec3 vTransformedNormal;
      
      vec3 riseLine() {
        float smoothness = 1.8;
        float speed = uRiseTime;
        bool isTopBottom = (vTransformedNormal.z > 0.0 || vTransformedNormal.z < 0.0) && vTransformedNormal.x == 0.0 && vTransformedNormal.y == 0.0;
        float ratio = isTopBottom ? 0.0 : smoothstep(speed, speed + smoothness, vHeight) - smoothstep(speed + smoothness, speed + smoothness * 2.0, vHeight);
        return uRiseColor * ratio;
      }
    `
    )
    shader.fragmentShader = shader.fragmentShader.replace(
        '#include <dithering_fragment>',
        `
      #include <dithering_fragment>
      gl_FragColor = gl_FragColor + vec4(riseLine(), 1.0);
    `
    )
    renderList.push((time) => {
        shader.uniforms.uRiseTime.value = time * 30.0
    })
}

// 扩散波效果
const applySpreadShader = (shader) => {
    shader.uniforms.uSpreadTime = { value: 0 }
    shader.uniforms.uSpreadColor = { value: new THREE.Color('#9932CC') }

    shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        `
      #include <common>
      varying vec2 vTransformedPosition;
    `
    )
    shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `
      #include <begin_vertex>
      vTransformedPosition = vec2(position.x, position.y);
    `
    )
    shader.fragmentShader = shader.fragmentShader.replace(
        '#include <common>',
        `
      #include <common>
      uniform vec3 uSpreadColor;
      uniform float uSpreadTime;
      varying vec2 vTransformedPosition;
      
      vec3 spread() {
        vec2 center = vec2(0.0);
        float smoothness = 60.0;
        float start = mod(uSpreadTime, 1800.0);
        float distance = length(vTransformedPosition - center);
        float ratio = smoothstep(start, start + smoothness, distance) - smoothstep(start + smoothness, start + smoothness * 2.0, distance);
        return uSpreadColor * ratio;
      }
    `
    )
    shader.fragmentShader = shader.fragmentShader.replace(
        '#include <dithering_fragment>',
        `
      #include <dithering_fragment>
      gl_FragColor = gl_FragColor + vec4(spread(), 1.0);
    `
    )
    renderList.push((time) => {
        shader.uniforms.uSpreadTime.value = time * 200.0
    })
}
// 扫光
const applySweepShader = (shader) => {
    shader.uniforms.uSweepTime = { value: 0 }
    shader.uniforms.uSweepColor = { value: new THREE.Color('#00FFFF') }

    shader.vertexShader = shader.vertexShader.replace(
        '#include <common>',
        `
      #include <common>
      varying vec2 vSweepPosition;
    `
    )
    shader.vertexShader = shader.vertexShader.replace(
        '#include <begin_vertex>',
        `
      #include <begin_vertex>
      vSweepPosition = vec2(position.x, position.y);
    `
    )
    shader.fragmentShader = shader.fragmentShader.replace(
        '#include <common>',
        `
      #include <common>
      uniform vec3 uSweepColor;
      uniform float uSweepTime;
      varying vec2 vSweepPosition;
      
      vec3 sweep() {
        vec2 center = vec2(0.0);
        float smoothness = 60.0;
        float start = mod(uSweepTime, 1800.0) - 800.0;
        float ratio = smoothstep(start, start + smoothness, vSweepPosition.x) - smoothstep(start + smoothness, start + smoothness * 2.0, vSweepPosition.x);
        return uSweepColor * ratio;
      }
    `
    )
    shader.fragmentShader = shader.fragmentShader.replace(
        '#include <dithering_fragment>',
        `
      #include <dithering_fragment>
      gl_FragColor = gl_FragColor + vec4(sweep(), 1.0);
    `
    )
    renderList.push((time) => {
        shader.uniforms.uSweepTime.value = time * 160.0
    })
}

const modelHandlerMap = {
    CITY_UNTRIANGULATED: (model, group) => {
        // 城市建筑
        const { geometry, position, material } = model

        // 模型线框化
        const lienMaterial = new THREE.LineBasicMaterial({ color: '#2685fe' })
        const lineBox = new THREE.LineSegments(new THREE.EdgesGeometry(geometry, 1), lienMaterial)
        lineBox.position.copy(position)
        // 模型坐标系与WebGL坐标系不同需要处理
        lineBox.rotateX(-Math.PI / 2)
        group.add(lineBox)

        // 在原先材质效果的基础上修改shader
        material.onBeforeCompile = (shader) => {
            material.color = new THREE.Color('#0e233d')
            material.transparent = true
            material.opacity = 0.9
            // 实现生长效果
            applyGrowShader(shader)
            applyRiseShader(shader)
            applySpreadShader(shader)
            applySweepShader(shader)
        }
        lienMaterial.onBeforeCompile = (shader) => {
            applyGrowShader(shader)
        }
    },
    LANDMASS: (model) => {
        // 地面
        const material = model.material
        material.color = new THREE.Color('#040912')
        material.transparent = true
        material.opacity = 0.8
    },
    ROADS: (model) => {
        // 道路
        const material = model.material
        material.color = new THREE.Color('#292e4c')
    }
}

new FBXLoader().load(FILE_HOST + 'models/fbx/shanghai.FBX', cityScene => {

    const group = new THREE.Group()

    cityScene.children.forEach((item) => {

        const clonedData = item.clone()

        modelHandlerMap[clonedData.name]?.(clonedData, group)

        group.add(clonedData)

    })

    scene.add(group)
    
})

const clock = new THREE.Clock()

animate()

function animate() {

    renderList.forEach(fn => fn(clock.getElapsedTime()))

    requestAnimationFrame(animate)

    controls.update()

    renderer.render(scene, camera)

}

window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)

    camera.aspect = box.clientWidth / box.clientHeight

    camera.updateProjectionMatrix()

}