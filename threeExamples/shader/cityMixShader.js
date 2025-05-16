import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'
import { GUI } from 'dat.gui'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 100000)

camera.position.set(150, 150, -700)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

renderer.setClearColor(0x000000, 0)

renderer.setPixelRatio(window.devicePixelRatio * 2)

new OrbitControls(camera, renderer.domElement)

window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)

    camera.aspect = box.clientWidth / box.clientHeight

    camera.updateProjectionMatrix()

}

box.appendChild(renderer.domElement)

const dirLight = new THREE.DirectionalLight(0xffffff, 3.8)

dirLight.position.set(83, 61, -183)

dirLight.target.position.set(10, -11, -194)

scene.add(dirLight, new THREE.AmbientLight(0xffffff, 2))

let model = null

// 加载模型
new FBXLoader().load(HOST + '/files/model/city.FBX', (object3d) => {

    scene.add(object3d)

    object3d.scale.set(0.04, 0.04, 0.04)

    object3d.position.set(224, -9, -49)

    model = object3d

    modelBlendShader(object3d, box)

})

// 渲染
animate()

function animate() {
    const time = performance.now() * 0.001; // 添加时间参数
    
    model && model.render?.(time)

    renderer.render(scene, camera)

    requestAnimationFrame(animate)
}

/* 新光线行进着色器实现 */
function modelBlendShader(model) {
    let materials = []
    
    model.traverse(c => c.isMesh && materials.push(c.material))
    
    materials = [... new Set(materials)]
    
    // 创建控制参数对象
    const params = {
        intensity: 1.2,
        colorScale: 1.5,
        animationSpeed: 0.8,
        baseColor: '#6edbe8',
        useTexture: true,
        textureMix: 0.7
    }
    
    const uniforms = {
        iTime: { value: 0, type: 'number', unit: 'float' },
        intensity: { value: params.intensity, type: 'number', unit: 'float' },
        colorScale: { value: params.colorScale, type: 'number', unit: 'float' },
        baseColor: { value: new THREE.Color(params.baseColor), type: 'color', unit: 'vec3' },
        animSpeed: { value: params.animationSpeed, type: 'number', unit: 'float' },
        useTexture: { value: params.useTexture, type: 'bool', unit: 'bool' },
        textureMix: { value: params.textureMix, type: 'float', unit: 'float' }
    }

    const glslProps = {
        vertexHeader: `
            varying vec2 vUv;
            varying vec3 v_position;
            void main() {
                vUv = uv;
                v_position = position;
        `,

        fragHeader: Object.keys(uniforms).map(i => 'uniform ' + uniforms[i].unit + ' ' + i + ';').join('\n') + '\n' + 'varying vec3 v_position; varying vec2 vUv;\n',

        fragBody: `
            vec4 O = vec4(0.0);
            vec2 I = (vUv - 0.5) * 2.0; // 将UV居中并扩展到[-1,1]范围
            
            //Raymarch iterator, step distance, depth
            float i = 0.0, d, z = 0.0;
            
            //Clear fragcolor and raymarch 100 steps
            for(O *= i; i++ < 1e2;
            //Pick colors and attenuate
            O += (cos(z + vec4(0,2,3,0)) + 1.5) / d / z * colorScale)
            {
                //Raymarch sample point
                vec3 p = z * normalize(vec3(I.x*2.0, I.y*2.0, -1.0)) + .8;
                //Reflection distance
                d = max(-p.y, 0.);
                //Reflect y-axis
                p.y += d+d - 1.;
                //Step forward slowly with a bias for soft reflections
                z += d = .3 * (.01 + .1*d + 
                //Lazer distance field
                length(min( p = cos(p + iTime * animSpeed) + cos(p / .6).yzx, p.zxy)) / ++d / d);
            }
            //Tanh tonemapping
            O = tanh(O / 7e2) * intensity;
            
            // 混合基础颜色
            O.rgb = mix(O.rgb, O.rgb * vec3(baseColor), 0.5);
            
            vec4 diffuseColor = O;
            
            #ifdef USE_MAP
                if(useTexture) {
                    vec3 textureColor = texture2D(map, vUv).rgb;
                    // 提高纹理细节可见度
                    float luminance = dot(textureColor, vec3(0.299, 0.587, 0.114));
                    diffuseColor = mix(diffuseColor, diffuseColor * vec4(textureColor * (1.0 + luminance), opacity), textureMix);
                }
            #endif
        `
    }

    materials.forEach(material => {
        material.onBeforeCompile = (shader) => {
            Object.keys(uniforms).forEach((key) => shader.uniforms[key] = uniforms[key])

            shader.vertexShader = shader.vertexShader.replace(`void main() {`, glslProps.vertexHeader)

            shader.fragmentShader = shader.fragmentShader.replace(/#include <common>/, glslProps.fragHeader + '\n#include <common>\n')

            shader.fragmentShader = shader.fragmentShader.replace('vec4 diffuseColor = vec4( diffuse, opacity );', glslProps.fragBody)
        }

        material.needsUpdate = true
    })

    // 设置GUI控制
    setupGUI(params, uniforms);

    // 更新着色器参数
    model.render = (time) => {
        uniforms.iTime.value = time || 0;
    }
}

// 设置GUI控制面板
let gui = null;
function setupGUI(params, uniforms) {
    // 如果已有GUI则销毁
    if (gui) gui.destroy();
    
    // 创建新的GUI
    gui = new GUI();
    gui.width = 300;
    
    // 添加效果控制
    const effectsFolder = gui.addFolder('着色器效果');
    
    effectsFolder.add(params, 'intensity', 0.1, 3.0).onChange(value => {
        uniforms.intensity.value = value;
    });
    
    effectsFolder.add(params, 'colorScale', 0.5, 3.0).onChange(value => {
        uniforms.colorScale.value = value;
    });
    
    effectsFolder.add(params, 'animationSpeed', 0.1, 2.0).onChange(value => {
        uniforms.animSpeed.value = value;
    });
    
    effectsFolder.addColor(params, 'baseColor').onChange(value => {
        uniforms.baseColor.value.set(value);
    });
    
    // 纹理混合控制
    const textureFolder = gui.addFolder('纹理控制');
    
    textureFolder.add(params, 'useTexture').onChange(value => {
        uniforms.useTexture.value = value;
    });
    
    textureFolder.add(params, 'textureMix', 0, 1).onChange(value => {
        uniforms.textureMix.value = value;
    });
    
    // 打开文件夹
    effectsFolder.open();
    textureFolder.open();
}
