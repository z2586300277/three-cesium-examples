import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";
const {
    Color, ShaderMaterial,
    BufferGeometry, Points,
    Vector3, Float32BufferAttribute,
} = THREE


class Bubble extends Points {

    _count = 0;

    _size = 10;

    _color = "#ff0000";

    _speed = 0.8;

    _maxHeight = 10;

    _radius = 10;

    _radius2 = 10;

    isBubble = true;

    _emitter = "cone"

    _emitters = [
        "cone", "cylinder",
        "box", "sphere"
    ];

    type = "Bubble";

    /**
     *
     * @param emitter {string}
     */
    set emitter(emitter) {
        if (this._emitters.indexOf(emitter) !== -1) {
            this._emitter = emitter;
            this.setPoints();
            this.uniforms.emitter.value = this._emitters.indexOf(this._emitter);
        }
    }

    set radius(radius) {
        this._radius = radius;
        this.setPoints();
    }

    set radius2(radius) {
        this._radius2 = radius;
        this.setPoints();
    }

    set count(count) {
        this._count = count;
        this.setPoints();
    }

    set maxHeight(maxHeight) {
        this._maxHeight = maxHeight;
        this.uniforms.maxHeight.value = maxHeight || 10;
        this.setPoints();
    }

    set speed(speed) {
        this._speed = speed;
        this.uniforms.speed.value = speed;
    }

    set size(size) {
        this._size = size;
        this.uniforms.size.value = size;
    }

    set color(color) {
        this._color = color;
        this.uniforms.color.value = new Color(color);
    }

    get radius() {
        return this._radius;
    }

    get emitter() {
        return this._emitter;
    }

    get emitters() {
        return this._emitters;
    }

    get count() { return this._count; }

    get speed() { return this._speed; }

    get size() { return this._size; }

    get maxHeight() { return this._maxHeight; }

    vertexShader = `
varying vec2 vUv;     //创建uv变量,用于给片元着色器传递uv
uniform float u_time; //从前端接收u_time
uniform float speed;  //从前端接收speed
uniform float size;   //从前端接收size
uniform float emitter;//发射器类型
uniform float maxHeight;//从前端接收maxHeight
attribute float data1;
attribute float data2;
void main(){
    
    //从顶点着色器取uv给片元着色器
    vUv = vec2(uv.x,uv.y);
    
    //用一个变量复制当前位置,用于计算最终位置
    vec3 u_position = position;
    
    if(emitter < 3.0){
        //粒子y轴变化
        float t = fract( u_time * speed + position.y/maxHeight);
        //对u_time取小数,使得数据一直在0~1按顺序变化,减y轴是用于移动图像
        u_position.y = t * maxHeight;
        
        //圆锥模式
        if(emitter == 0.0){
            u_position.x = cos(data2) * data1 * u_position.y/maxHeight;
            u_position.z = sin(data2) * data1 * u_position.y/maxHeight;
        }
        //圆柱模式
        if(emitter == 1.0){
            u_position.x = cos(data2) * data1;
            u_position.z = sin(data2) * data1;
        }
        
        //立方体模式
        if(emitter == 2.0){
            u_position.x = data1;
            u_position.z = data2;
        }
    }else{
        //球体模式
        if(emitter == 3.0){
            float r = length(u_position);
            float t = fract(u_time * speed + r/maxHeight);
            r = t * maxHeight;
            u_position.x = r * sin(data1) * cos(data2);
            u_position.y = r * sin(data2);
            u_position.z = r * cos(data1) * cos(data2);
        }  
    }
    
    //设定粒子大小
    gl_PointSize = size;
    
    //固定写法,将最终计算完成的顶点位置传递给显卡并交由显卡计算
    gl_Position = projectionMatrix * modelViewMatrix * vec4( u_position, 1.0 );
    
}
`;

    fragmentShader = `
uniform vec3 color;//从前端接收颜色
varying vec2 vUv; //获取从顶点着色器传递过来的uv
void main(){
    
    //气泡计算公式, 根据中心到边缘的距离设定透明度
    float dis = pow(  distance(  gl_PointCoord  ,  vec2(0.5,0.5)  )   ,2.0);
    
    //透明度高于0.2的部分舍弃,用于舍弃边缘方形的区域
    if(dis > 0.2){
        discard;
    }
    
    //固定写法,将计算后的颜色渲染出来
    gl_FragColor = vec4(color,dis * 2.0);
}
`;

    uniforms = {
        u_time: { value: 0 },
        speed: { value: 0.8 },
        size: { value: 10 },
        color: { value: new Color("#2acdf9") },
        maxHeight: { value: 10 },
        emitter: { value: this._emitters.indexOf(this._emitter) }
    };

    /**
     *
     * @param config {Object}
     * count:粒子数量
     * xArea:x随机范围
     * zArea:z随机范围
     * maxHeight:最大升腾高度
     * speed:升腾速度
     * size:气泡大小
     * color:气泡颜色
     */
    constructor(config) {
        super();
        this.material = this.initLineMaterial();
        this.geometry = new BufferGeometry();
        config = config || { color: "#2acdf9" };
        this.uniforms.speed.value = config.speed || this.uniforms.speed.value
        this.uniforms.size.value = config.size || this.uniforms.size.value
        this.uniforms.maxHeight.value = config.maxHeight || this.uniforms.maxHeight.value
        this.uniforms.color.value = new Color(config.color);
        this._count = config.count || 100;
        this.setPoints();
    }

    initLineMaterial = () => {
        return new ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: this.vertexShader,
            fragmentShader: this.fragmentShader,
            transparent: true,
        });
    }

    setPoints = () => {
        let points = [];
        let data1Array = [];
        let data2Array = [];
        for (let i = 0; i < this._count; i++) {

            //圆柱模式下,生成的数据用于半径和角度
            if (this._emitter === "cone" || this._emitter === "cylinder") {
                let data1 = Math.random() * this._radius;
                let data2 = Math.PI * 2 * Math.random();
                data1Array.push(data1);
                data2Array.push(data2);
            }
            if (this._emitter === "box") {
                let data1 = Math.random() * this._radius - this._radius / 2;
                let data2 = Math.random() * this._radius2 - this._radius2 / 2;
                data1Array.push(data1);
                data2Array.push(data2);
            }
            if (this._emitter === "sphere") {
                let data1 = Math.PI * 2 * Math.random();
                let data2 = Math.PI * 2 * Math.random();
                data1Array.push(data1);
                data2Array.push(data2);
            }
            let y = i / this._count * this.uniforms.maxHeight.value;
            points.push(new Vector3(0, y, 0));
        }
        this.geometry.setFromPoints(points);
        this.geometry.setAttribute('data1', new Float32BufferAttribute(data1Array, 1));
        this.geometry.setAttribute('data2', new Float32BufferAttribute(data2Array, 1));
        console.log(this.geometry);
    }

    onBeforeRender = () => {
        this.uniforms.u_time.value += 0.01;
    }
}


window.addEventListener('load', e => {
    init();
    addMesh();
    render();
})

let scene, renderer, camera;
let orbit;

let gui = new GUI();

let bubble;

function init() {

    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.append(renderer.domElement);

    camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 2000);
    camera.add(new THREE.PointLight());
    camera.position.set(10, 10, 10);
    scene.add(camera);

    orbit = new OrbitControls(camera, renderer.domElement);
    orbit.enableDamping = true;

    scene.add(new THREE.AxesHelper(10));
}

function addMesh() {
    let size = 1;
    let geometry = new THREE.BoxGeometry(size, size, size).translate(0, size / 2, 0);
    let material = new THREE.MeshBasicMaterial({
        color: "#00ffff",
        transparent: true,
        opacity: 0.5
    });
    let mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    bubble = new Bubble({
        speed: 0.8,
        size: 30,
        maxHeight: 10,
        color: "#ff0000"
    });
    scene.add(bubble);

    let params = {
        speed: 0.8,
        size: 30,
        maxHeight: 10,
        color: "#1acdf9",
        count: 100,
        radius: 10,
        rotateSpeed: 0.01,
        backgroundColor: "#000000",
        emitter: "cone",
        emitterOptions: ["cone", "cylinder", "box", "sphere"]
    };

    gui.add(params, "speed", -2, 2).step(0.01).onChange(v => bubble.speed = v);
    gui.add(params, "size").onChange(v => bubble.size = v);
    gui.add(params, "maxHeight").onChange(v => bubble.maxHeight = v);
    gui.addColor(params, "color").onChange(v => bubble.color = v);
    gui.add(params, "count").onChange(v => bubble.count = v);
    gui.add(params, "radius").onChange(v => bubble.radius = v);
    gui.add(params, "rotateSpeed").onChange(v => bubble.rotateSpeed = v);
    gui.addColor(params, 'backgroundColor').name('背景色').onChange(v => {
        scene.background = new THREE.Color(v);
    });
    gui.add(params, 'emitter', params.emitterOptions).name('粒子发射方式').onChange(v => {
        bubble.emitter = v;
    });
}

function render() {
    renderer.render(scene, camera);
    orbit.update();
    requestAnimationFrame(render);
}