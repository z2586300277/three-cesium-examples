import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'

class City {

    constructor() {
        this.fbxLoader = new FBXLoader();
        this.group = new THREE.Group();
        this.clock = new THREE.Clock()
        this.surroundLineMaterial = null;// 定义包围线材质属性
        this.time = { value: 0 };
        this.startTime = { value: 0 };
        this.startLength = { value: 2 }
        this.isStart = false;

        this.fbxLoader.load(FILE_HOST + 'models/fbx/shanghai.FBX', (group) => {

            this.group.add(group);
            group.traverse((child) => {
                // 设置城市建筑（mesh物体），材质基本颜色
                if (child.name == 'CITY_UNTRIANGULATED') {
                    const materials = Array.isArray(child.material) ? child.material : [child.material]
                    materials.forEach((material) => {
                        material.transparent = true;
                        material.color.setStyle("#9370DB");
                    })
                }

                // 设置城市地面（mesh物体），材质基本颜色
                if (child.name == 'LANDMASS') {
                    const materials = Array.isArray(child.material) ? child.material : [child.material]
                    materials.forEach((material) => {
                        material.transparent = true;
                        material.color.setStyle("#040912");
                    })
                }
            })

            this.init();
        });
    }

    // 初始化城市类的实例
    init() {
        this.isStart = true; // 城市渲染启动
        this.clock.start()
        this.surroundLine();
    }

    // 创建包围线条效果
    surroundLine() {
        let cityBuildings // 城市建筑群
        this.group.traverse(child => {
            if (child.name !== 'CITY_UNTRIANGULATED') return
            cityBuildings = child
        })

        const geometry = new THREE.EdgesGeometry(cityBuildings.geometry);
        const surroundLineMaterial = new THREE.ShaderMaterial({
            transparent: true,
            uniforms: {
                uColor: {
                    value: new THREE.Color('#FFF')
                }
            },
            vertexShader: `
         void main() {
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
            fragmentShader: ` 
          uniform vec3 uColor;
          void main() {
            gl_FragColor = vec4(uColor, 1);
          }
        `
        });


        const line = new THREE.LineSegments(geometry, surroundLineMaterial);
        line.name = 'surroundLine';
        line.applyMatrix4(cityBuildings.matrix.clone())
        cityBuildings.parent.add(line)
    }

    updateData = () => {
        if (!this.isStart) return false;
        const dt = this.clock.getDelta();
        this.time.value += dt;
        this.startTime.value += dt;
        if (this.startTime.value >= this.startLength.value) {
            this.startTime.value = this.startLength.value;
        }
    }
}

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 1000000)
camera.position.set(600, 750, -1221)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
renderer.setSize(box.clientWidth, box.clientHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(new THREE.Color('#32373E'), 1);

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

window.onresize = () => {
    renderer.setSize(box.clientWidth, box.clientHeight)
    camera.aspect = box.clientWidth / box.clientHeight
    camera.updateProjectionMatrix()
}

box.appendChild(renderer.domElement)

// 坐标轴
scene.add(new THREE.AxesHelper(100000))
const light = new THREE.AmbientLight(0xadadad, 3); // 环境光，soft white light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5); // 方向光
directionalLight.position.set(100, 100, 0);
scene.add(light);
scene.add(directionalLight);

// 实例化
const city = new City({});
scene.add(city.group);

// 渲染
animate()
function animate() {
    city.updateData();
    controls.update()
    renderer.render(scene, camera)
    requestAnimationFrame(animate)
}