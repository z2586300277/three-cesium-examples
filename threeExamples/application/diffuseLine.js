import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import Stats from 'three/examples/jsm/libs/stats.module.js';

class InitFly {
    constructor({
        texture
    } = opt) {
        this.flyId = 0; //id
        this.flyArr = []; //存储所有飞线
        this.baicSpeed = 1; //基础速度
        this.texture = 0.0;
        if (texture && !texture.isTexture) {
            this.texture = new THREE.TextureLoader().load(texture)
        } else {
            this.texture = texture;
        }
        this.flyShader = {
            vertexshader: ` 
                uniform float size; 
                uniform float time; 
                uniform float u_len; 
                attribute float u_index;
                varying float u_opacitys;
                void main() { 
                    if( u_index < time + u_len && u_index > time){
                        float u_scale = 1.0 - (time + u_len - u_index) /u_len;
                        u_opacitys = u_scale;
                        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                        gl_Position = projectionMatrix * mvPosition;
                        gl_PointSize = size * u_scale * 300.0 / (-mvPosition.z);
                    } 
                }
                `,
            fragmentshader: ` 
                uniform sampler2D u_map;
                uniform float u_opacity;
                uniform vec3 color;
                uniform float isTexture;
                varying float u_opacitys;
                void main() {
                    vec4 u_color = vec4(color,u_opacity * u_opacitys);
                    if( isTexture != 0.0 ){
                        gl_FragColor = u_color * texture2D(u_map, vec2(gl_PointCoord.x, 1.0 - gl_PointCoord.y));
                    }else{
                        gl_FragColor = u_color;
                    }
                }`
        }
    }
    /**
     * [addFly description]
     *
     * @param   {String}  opt.color  [颜色_透明度]
     * @param   {Array}   opt.curve  [线的节点]
     * @param   {Number}  opt.width  [宽度]
     * @param   {Number}  opt.length [长度]
     * @param   {Number}  opt.speed  [速度]
     * @param   {Number}  opt.repeat [重复次数]
     * @return  {Mesh}               [return 图层]
     */
    addFly({
        color = "rgba(255,255,255,1)",
        curve = [],
        width = 1,
        length = 10,
        speed = 1,
        repeat = 1,
        texture = null,
        callback
    } = opt) {
        let colorArr = this.getColorArr(color);
        let geometry = new THREE.BufferGeometry();
        let material = new THREE.ShaderMaterial({
            uniforms: {
                color: {
                    value: colorArr[0],
                    type: "v3"
                },
                size: {
                    value: width,
                    type: "f"
                },
                u_map: {
                    value: texture ? texture : this.texture,
                    type: "t2"
                },
                u_len: {
                    value: length,
                    type: "f"
                },
                u_opacity: {
                    value: colorArr[1],
                    type: "f"
                },
                time: {
                    value: -length,
                    type: "f"
                },
                isTexture: {
                    value: 1.0,
                    type: "f"
                }
            },
            transparent: true,
            depthTest: false,
            vertexShader: this.flyShader.vertexshader,
            fragmentShader: this.flyShader.fragmentshader
        });
        const [position, u_index] = [
            [],
            []
        ];
        curve.forEach(function (elem, index) {
            position.push(elem.x, elem.y, elem.z);
            u_index.push(index);
        })
        geometry.setAttribute("position", new THREE.Float32BufferAttribute(position, 3));
        geometry.setAttribute("u_index", new THREE.Float32BufferAttribute(u_index, 1));
        let mesh = new THREE.Points(geometry, material);
        mesh.name = "fly";
        mesh._flyId = this.flyId;
        mesh._speed = speed;
        mesh._repeat = repeat;
        mesh._been = 0;
        mesh._total = curve.length;
        mesh._callback = callback;
        this.flyId++;
        this.flyArr.push(mesh);
        return mesh
    }
    /**
     * 根据线条组生成路径
     * @param {*} arr 需要生成的线条组
     * @param {*} dpi 密度
     */
    tranformPath(arr, dpi = 1) {
        const vecs = [];
        for (let i = 1; i < arr.length; i++) {
            let src = arr[i - 1];
            let dst = arr[i];
            let s = new THREE.Vector3(src.x, src.y, src.z);
            let d = new THREE.Vector3(dst.x, dst.y, dst.z);
            let length = s.distanceTo(d) * dpi;
            let len = parseInt(length);
            for (let i = 0; i <= len; i++) {
                vecs.push(s.clone().lerp(d, i / len))
            }
        }
        return vecs;
    }
    /**
     * [remove 删除]
     * @param   {Object}  mesh  [当前飞线]
     */
    remove(mesh) {
        mesh.material.dispose();
        mesh.geometry.dispose();
        this.flyArr = this.flyArr.filter(elem => elem._flyId != mesh._flyId);
        mesh.parent.remove(mesh);
        mesh = null;
    }
    /**
     * [animation 动画] 
     * @param   {Number}  delta  [执行动画间隔时间] 
     */
    animation(delta = 0.015) {
        if (delta > 0.2) return;
        this.flyArr.forEach(elem => {
            if (!elem.parent) return;
            if (elem._been > elem._repeat) {
                elem.visible = false;
                if (typeof elem._callback === 'function') {
                    elem._callback(elem);
                }
                this.remove(elem)
            } else {
                let uniforms = elem.material.uniforms;
                //完结一次
                if (uniforms.time.value < elem._total) {
                    uniforms.time.value += delta * (this.baicSpeed / delta) * elem._speed;
                } else {
                    elem._been += 1;
                    uniforms.time.value = -uniforms.u_len.value;
                }
            }
        })
    }
    color(c) {
        return new THREE.Color(c);
    }
    getColorArr(str) {
        if (Array.isArray(str)) return str; //error
        var _arr = [];
        str = str + '';
        str = str.toLowerCase().replace(/\s/g, "");
        if (/^((?:rgba)?)\(\s*([^\)]*)/.test(str)) {
            var arr = str.replace(/rgba\(|\)/gi, '').split(',');
            var hex = [
                pad2(Math.round(arr[0] * 1 || 0).toString(16)),
                pad2(Math.round(arr[1] * 1 || 0).toString(16)),
                pad2(Math.round(arr[2] * 1 || 0).toString(16))
            ];
            _arr[0] = this.color('#' + hex.join(""));
            _arr[1] = Math.max(0, Math.min(1, (arr[3] * 1 || 0)));
        } else if ('transparent' === str) {
            _arr[0] = this.color();
            _arr[1] = 0;
        } else {
            _arr[0] = this.color(str);
            _arr[1] = 1;
        }

        function pad2(c) {
            return c.length == 1 ? '0' + c : '' + c;
        }
        return _arr;
    }
}

function Initialize(opt) {
    var camera, controls, scene, renderer;
    var clock = new THREE.Clock();
    var thm = this;
    var df_Mouse, df_Raycaster;
    var df_Width, df_Height; //当前盒子的高宽
    var df_canvas;

    var stats

    function init() {
        camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 10000);
        camera.position.set(0, 400, 400);
        camera.lookAt(new THREE.Vector3(0, 0, 0))
        scene = new THREE.Scene()

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setPixelRatio(window.devicePixelRatio * 1.3);
        renderer.setSize(window.innerWidth, window.innerHeight);

        document.querySelector(opt.id).appendChild(renderer.domElement);
        df_canvas = renderer.domElement
        controls = new OrbitControls(camera, renderer.domElement);
        window.addEventListener('resize', onWindowResize, false);
        renderer.domElement.addEventListener('mouseup', onDocumentMouseUp, false);
        df_Width = window.innerWidth;
        df_Height = window.innerHeight;
        df_Mouse = new THREE.Vector2();
        df_Raycaster = new THREE.Raycaster();
        // onload 
        if (opt.load) {
            opt.load({
                camera, controls, scene, renderer
            })
        }
        if (Stats) {
            stats = new Stats();
            document.querySelector(opt.id).appendChild(stats.dom);
        }
    }

    function onDocumentMouse(event) {
        event.preventDefault();
        df_Mouse.x = ((event.clientX - df_canvas.getBoundingClientRect().left) / df_canvas.offsetWidth) * 2 - 1;
        df_Mouse.y = -((event.clientY - df_canvas.getBoundingClientRect().top) / df_canvas.offsetHeight) * 2 + 1;
        df_Raycaster.setFromCamera(df_Mouse, camera);
        return {
            mouse: df_Mouse,
            event: event,
            raycaster: df_Raycaster
        }
    }
    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    function onDocumentMouseUp(event) {
        if (typeof opt.mouseUp === 'function') {
            opt.mouseUp(onDocumentMouse(event))
        }
    }
    function animate() {
        requestAnimationFrame(animate);
        var delta = clock.getDelta();
        renderer.render(scene, camera);
        if (opt.animation) opt.animation(delta);
        if (stats) stats.update();
    }
    init();
    animate();
}

var _Fly;
var GL = new Initialize({
    id: "#box",
    animation: function (dalte) {
        if (_Fly) {
            // 更新线 必须
            _Fly.animation(dalte);
        }
    },
    load({ scene, camera }) {
        _Fly = new InitFly({
            texture: FILE_HOST + "threeExamples/application/flyLine/point.png"
        });
        let index = 0;
        var time = setInterval(() => {
            if (index >= 4000) {
                clearInterval(time)
            }
            var x = 0;
            var z = 0;
            var x1 = THREE.MathUtils.randFloat(-200, 200);
            var z1 = THREE.MathUtils.randFloat(-200, 200);
            var curve = new THREE.QuadraticBezierCurve3(
                new THREE.Vector3(x, 0, z),
                new THREE.Vector3((x + x1) / 2, THREE.MathUtils.randInt(200, 420), (z1 + z) / 2),
                new THREE.Vector3(x1, 0, z1)
            );
            var points = curve.getPoints(500);
            var flyMesh = _Fly.addFly({
                color: `rgba(${THREE.MathUtils.randInt(0, 255)},${THREE.MathUtils.randInt(0, 255)},${THREE.MathUtils.randInt(0, 255)},1)`,
                curve: points,
                width: 9,
                length: 150,
                speed: 1,
                repeat: Infinity
            })
            scene.add(flyMesh);
            index++;
        })
    }
})