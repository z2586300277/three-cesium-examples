import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000)

camera.position.set(5, 5, 5)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)

    camera.aspect = box.clientWidth / box.clientHeight

    camera.updateProjectionMatrix()

}

animate()

function animate() {

    requestAnimationFrame(animate)

    renderer.render(scene, camera)

}

scene.add(new THREE.AmbientLight(0xffffff, 3))

new GLTFLoader().load(

    'https://z2586300277.github.io/three-editor/dist/files/resource/datacenter.glb',

    gltf => {

        scene.add(gltf.scene)

        callModel(gltf.scene)

    }

)

let model = null

function callModel(e) {
    model = e
    const box3 = new THREE.Box3().setFromObject(model)
    const { min, max } = box3
    // 根据模型的包围盒 固定y 生成一个平面
    const p1 = new THREE.Vector3(min.x, 0, min.z)
    const p2 = new THREE.Vector3(min.x, 0, max.z)
    const p3 = new THREE.Vector3(max.x, 0, max.z)
    const p4 = new THREE.Vector3(max.x, 0, min.z)
    const geometry = new THREE.BufferGeometry()
    const vertices = new Float32Array([
        p1.x, p1.y, p1.z,
        p2.x, p2.y, p2.z,
        p3.x, p3.y, p3.z,
        p4.x, p4.y, p4.z,
    ])
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))
    geometry.setIndex([0, 1, 2, 0, 2, 3])
    geometry.attributes.uv = new THREE.Float32BufferAttribute([
        0, 0,
        0, 1,
        1, 1,
        1, 0
    ], 2)
    geometry.computeVertexNormals()

    let list = []

    model.traverse(i => {
        if (i.isMesh) {
            i.material.transparent = true
            i.material.opacity = 0.5
            i.isMesh && list.push(i.name)
        }
    })

    // list 随机获取 5 - 10 个名字形成新的数组
    const randomNum = Math.floor(Math.random() * (10 - 5 + 1)) + 5
    list = list.sort(() => Math.random() - 0.5).slice(0, randomNum)

    let w = max.x - min.x
    let h = max.z - min.z

    /* 热力图实现 */
    const arr = list.map(i => {
        const obj = model.getObjectByName(i)
        const worldPosition = new THREE.Vector3()
        obj.getWorldPosition(worldPosition)
        return [(worldPosition.x - min.x) / w, (worldPosition.z - min.z) / h, Math.random() * 10]
    }).flat()
  
    const uniforms1 = {
        HEAT_MAX: { value: 10, type: 'number', unit: 'float' },
        PointRadius: { value: 0.2, type: 'number', unit: 'float' },
        intensity: { value: 3, type: 'number', unit: 'float' },
        PointsCount: { value: arr.length, type: 'number-array', unit: 'int' },
        c1: { value: new THREE.Color('green'), type: 'color', unit: 'vec3' }, // 蓝色
        c2: { value: new THREE.Color('red'), type: 'color', unit: 'vec3' }, // 红色
        uvY: { value: 1, type: 'number', unit: 'float' },
        uvX: { value: 1, type: 'number', unit: 'float' },
        opacity: { value: 0.6, type: 'number', unit: 'float' }, // 稍微降低整体不透明度
        edgeFalloff: { value: 2.0, type: 'number', unit: 'float' } // 边缘衰减参数
    }

    const gui = new GUI()
    gui.add(uniforms1.HEAT_MAX, 'value', 0, 10).name('HEAT_MAX')
    gui.add(uniforms1.PointRadius, 'value', 0, 1).name('PointRadius')
    gui.add(uniforms1.intensity, 'value', 0, 10).name('intensity')
    gui.add(uniforms1.uvY, 'value', 0, 1).name('uvY')
    gui.add(uniforms1.uvX, 'value', 0, 1).name('uvX')
    gui.add(uniforms1.opacity, 'value', 0, 1).name('opacity')
    gui.add(uniforms1.edgeFalloff, 'value', 0.1, 5).name('边缘衰减')
    gui.addColor(uniforms1.c1, 'value').name('冷色')
    gui.addColor(uniforms1.c2, 'value').name('热色')

    const uniforms2 = {
        Points: { value: arr, type: 'vec3-array', unit: 'vec3' }
    }

    const uniforms = {
        ...uniforms1,
        ...uniforms2
    }
    const vertexShader = `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
        `
    const getFragmentShader = () => 'precision highp float;\n' + 'varying vec2 vUv; \n' +

        Object.keys(uniforms1).map(i => 'uniform ' + uniforms1[i].unit + ' ' + i + ';')
            .join('\n')

        + '\nuniform vec3 Points['
        + uniforms1.PointsCount.value + '];'
        +
        `
            vec3 gradient(float w, vec2 uv) {
                // 平滑过渡的热力图颜色
                w = pow(clamp(w, 0., 1.), 0.8);
                return mix(c1, c2, w);
            }
            
            void main()
            {
                vec2 uv = vUv;
                uv.xy *= vec2(uvX, uvY);
                float d = 0.;
                
                // 计算热度值
                for (int i = 0; i < PointsCount; i++) {
                    vec3 v = Points[i];
                    float intensity = v.z / HEAT_MAX;
                    float dist = length(uv - v.xy);
                    float pd = (1. - dist / PointRadius) * intensity;
                    d += pow(max(0., pd), 1.5);
                }
                
                // 计算边缘衰减因子
                float edgeFactor = 1.0;
                vec2 center = vec2(0.5, 0.5);
                float distFromCenter = length(uv - center);
                
                // 在UV坐标的边缘部分应用透明度衰减
                float edgeStart = 0.4;
                if (distFromCenter > edgeStart) {
                    edgeFactor = 1.0 - pow((distFromCenter - edgeStart) / (0.5 - edgeStart), edgeFalloff);
                }
                
                // 确保边缘的透明度为0
                edgeFactor = clamp(edgeFactor, 0.0, 1.0);
                
                // 应用热力颜色和透明度
                vec3 heatColor = gradient(d, uv);
                float alpha = min(opacity * edgeFactor, d > 0.05 ? 1.0 : d * 20.0);
                
                gl_FragColor = vec4(heatColor * vec3(intensity,intensity,intensity), alpha);
            } `
    
    const shaderMaterial = new THREE.ShaderMaterial({
        uniforms,
        vertexShader,
        fragmentShader: getFragmentShader(),
        side: THREE.DoubleSide,
        depthWrite: false,
        depthTest: false,
        transparent: true,
        blending: THREE.AdditiveBlending // 使用加法混合使热力图更具光晕效果
    })
    const mesh = new THREE.Mesh(geometry, shaderMaterial)
    scene.add(mesh)
}