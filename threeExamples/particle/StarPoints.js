import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min.js'

    window.addEventListener('load',e=>{
        init();
        addMesh();
        render();
    })

    let scene,renderer,camera;
    let orbit;
    let starField;

    function init(){

        scene = new THREE.Scene();
        renderer = new THREE.WebGLRenderer({
            alpha:true,
            antialias:true
        });
        renderer.setSize(window.innerWidth,window.innerHeight);
        document.body.appendChild(renderer.domElement);

        camera = new THREE.PerspectiveCamera(50,window.innerWidth/window.innerHeight,0.1,2000);
        camera.position.set(0,0,50);
        scene.add(camera);

        orbit = new OrbitControls(camera,renderer.domElement);
        orbit.enableDamping = true;
    }

    function addMesh() {
        starField = new StarField(3000);
        scene.add(starField);

        let gui = new GUI();
        starField.test(gui);
    }

    let clock = new THREE.Clock();

    function render() {
        let time = clock.getElapsedTime();
        if(starField) starField.update(time);

        renderer.render(scene,camera);
        orbit.update();
        requestAnimationFrame(render);
    }

    class StarField extends THREE.Points {

        /**
         * 星星数量
         * @type {number}
         * @private
         */
        _count = 3000;

        /**
         * 最小半径
         * @type {number}
         * @private
         */
        _minRadius = 15;

        /**
         * 半径范围
         * @type {number}
         * @private
         */
        _radiusRange = 120;

        /**
         * 透明度
         * @type {number}
         * @private
         */
        _opacity = 1.0;

        /**
         * 最近限制距离 (在此距离内粒子保持最大)
         * @type {number}
         * @private
         */
        _near = 50;

        /**
         * 最远限制距离 (在此距离外粒子保持最小)
         * @type {number}
         * @private
         */
        _far = 500;

        /**
         * 粒子最小缩放尺寸
         * @type {number}
         * @private
         */
        _minSize = 0.1;

        /**
         * 粒子最大缩放尺寸
         * @type {number}
         * @private
         */
        _maxSize = 100;

        /**
         * 颜色池
         * @type {Array}
         * @private
         */
        _starColors = [
            [1.0, 0.4, 0.4],   // 红
            [1.0, 0.6, 0.2],   // 橙
            [1.0, 1.0, 0.3],   // 黄
            [0.4, 1.0, 0.4],   // 绿
            [0.3, 0.7, 1.0],   // 蓝
            [0.6, 0.4, 1.0],   // 紫
            [1.0, 0.5, 0.8],   // 粉
            [0.3, 1.0, 1.0],   // 青
            [1.0, 1.0, 1.0],   // 白
            [0.7, 0.8, 1.0],   // 蓝白
        ];

        get count() {
            return this._count;
        }

        set count(value) {
            this._count = value;
            this.createPoints();
        }

        get minRadius() {
            return this._minRadius;
        }

        set minRadius(value) {
            this._minRadius = value;
            this.createPoints();
        }

        get radiusRange() {
            return this._radiusRange;
        }

        set radiusRange(value) {
            this._radiusRange = value;
            this.createPoints();
        }

        get opacity() {
            return this._opacity;
        }

        set opacity(value) {
            this._opacity = value;
            if (this.uniforms) {
                this.uniforms.opacity.value = value;
            }
        }

        get near() {
            return this._near;
        }

        set near(value) {
            this._near = value;
            if (this.uniforms) {
                this.uniforms.near.value = value;
            }
        }

        get far() {
            return this._far;
        }

        set far(value) {
            this._far = value;
            if (this.uniforms) {
                this.uniforms.far.value = value;
            }
        }

        get minSize() {
            return this._minSize;
        }

        set minSize(value) {
            this._minSize = value;
            if (this.uniforms) {
                this.uniforms.minSize.value = value;
            }
        }

        get maxSize() {
            return this._maxSize;
        }

        set maxSize(value) {
            this._maxSize = value;
            if (this.uniforms) {
                this.uniforms.maxSize.value = value;
            }
        }

        get starColors() {
            return this._starColors;
        }

        set starColors(value) {
            this._starColors = value;
            this.createPoints();
        }

        constructor(count = 3000) {
            super();
            this._count = count;
            this.type = 'StarField';

            this.uniforms = {
                iTime: { value: 0 },
                opacity: { value: this._opacity },
                near: { value: this._near },
                far: { value: this._far },
                minSize: { value: this._minSize },
                maxSize: { value: this._maxSize }
            };

            this.vertexShader = `
            attribute float aSize;
            attribute float aPhase;
            attribute vec3 aColor;
            attribute float aCross;
            uniform float iTime;
            uniform float near;
            uniform float far;
            uniform float minSize;
            uniform float maxSize;
            varying float vAlpha;
            varying vec3 vColor;
            varying float vCross;

            void main(){
                vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );

                // 每个粒子有不同的闪烁相位和频率
                float flicker = sin(iTime * (1.5 + aPhase * 2.0) + aPhase * 6.2831) * 0.5 + 0.5;
                // 加入第二层高频闪烁，模拟星星的快速闪烁
                float flicker2 = sin(iTime * (4.0 + aPhase * 3.0) + aPhase * 3.14) * 0.3 + 0.7;
                vAlpha = 0.3 + 0.7 * flicker * flicker2;
                vColor = aColor;
                vCross = aCross;

                // 限制相机距离在 [near, far] 范围内
                float dist = length(mvPosition.xyz);
                float clampedDist = clamp(dist, near, far);

                // 计算点大小，并限制在 [minSize, maxSize]
                float size = aSize * (400.0 / clampedDist);
                gl_PointSize = clamp(size, minSize, maxSize);

                gl_Position = projectionMatrix * mvPosition;
            }
        `;

            this.fragmentShader = `
            uniform float opacity;
            varying float vAlpha;
            varying vec3 vColor;
            varying float vCross;

            void main(){
                vec2 uv = gl_PointCoord - vec2(0.5);
                float dist = length(uv);

                // 核心亮点
                float core = 1.0 - smoothstep(0.0, 0.08, dist);
                core = pow(core, 2.0);

                // 凹角圆弧形正四角星 (基于 |x|^p + |y|^p = r^p)
                // sharpness 越大，p 越小，星星越尖锐。
                // vCross (0.3~1.0) -> p (0.8~0.4)
                float p = mix(0.8, 0.4, vCross);

                // 计算到星形的“距离”感
                float starDist = pow(pow(abs(uv.x), p) + pow(abs(uv.y), p), 1.0 / p);

                // 形状遮罩：由内向外衰减
                float starShape = 1.0 - smoothstep(0.0, 0.5, starDist);
                starShape = pow(starShape, 3.0);

                // 叠加一个基础光晕，使边缘更柔和
                float glow = 1.0 - smoothstep(0.0, 0.5, dist);
                glow = pow(glow, 4.0) * 0.5;

                float finalGlow = max(core, starShape);
                finalGlow = max(finalGlow, glow);

                if(finalGlow < 0.01) discard;

                // 颜色处理：中心更亮
                vec3 color = mix(vColor, vec3(1.0, 1.0, 1.0), finalGlow * 0.7);
                gl_FragColor = vec4(color, finalGlow * vAlpha * opacity);
            }
        `;

            this.init();
        }

        init() {
            this.geometry = new THREE.BufferGeometry();
            this.createPoints();
            this.material = new THREE.ShaderMaterial({
                uniforms: this.uniforms,
                vertexShader: this.vertexShader,
                fragmentShader: this.fragmentShader,
                transparent: true,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
            });
        }

        createPoints() {
            if (!this.geometry) return;

            this.geometry.dispose();
            this.geometry = new THREE.BufferGeometry();

            let count = this._count;
            let positions = new Float32Array(count * 3);
            let sizes = new Float32Array(count);
            let phases = new Float32Array(count);
            let colors = new Float32Array(count * 3);
            let crosses = new Float32Array(count);

            for(let i = 0; i < count; i++){
                // 球形分布
                let r = this._minRadius + Math.random() * this._radiusRange;
                let theta = Math.random() * Math.PI * 2;
                let phi = Math.acos(2 * Math.random() - 1);

                positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
                positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
                positions[i * 3 + 2] = r * Math.cos(phi);

                // 大部分星星很小，少数星星很大，模拟真实星空
                let rand = Math.random();
                if(rand < 0.6){
                    sizes[i] = 0.5 + Math.random() * 1.5;  // 小星星
                } else if(rand < 0.9){
                    sizes[i] = 2.0 + Math.random() * 3.0;  // 中等星星
                } else {
                    sizes[i] = 5.0 + Math.random() * 5.0;  // 大星星
                }
                phases[i] = Math.random();

                // 随机尖锐度：0.3=有基础十字感，1.0=最尖锐
                crosses[i] = 0.3 + Math.random() * 0.7;

                let c = this._starColors[Math.floor(Math.random() * this._starColors.length)];
                colors[i * 3]     = c[0];
                colors[i * 3 + 1] = c[1];
                colors[i * 3 + 2] = c[2];
            }

            this.geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            this.geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
            this.geometry.setAttribute('aPhase', new THREE.BufferAttribute(phases, 1));
            this.geometry.setAttribute('aColor', new THREE.BufferAttribute(colors, 3));
            this.geometry.setAttribute('aCross', new THREE.BufferAttribute(crosses, 1));
        }

        onBeforeRender(renderer, scene, camera, geometry, material, group) {
            super.onBeforeRender(renderer, scene, camera, geometry, material, group);
        }

        update(time) {
            this.uniforms.iTime.value = time;
        }

        test(gui, name = "星空粒子", closed = true) {
            let folder = gui.addFolder(name);
            if (closed) folder.close();

            folder.add(this, 'count', 10, 10000).step(10).name("星星数量");
            folder.add(this, 'minRadius', 1, 500).step(1).name("最小半径");
            folder.add(this, 'radiusRange', 1, 1000).step(1).name("半径范围");
            folder.add(this, 'opacity', 0, 1).step(0.01).name("透明度");
            folder.add(this, 'near', 1, 200).step(1).name("最近限制点");
            folder.add(this, 'far', 100, 2000).step(1).name("最远限制点");
            folder.add(this, 'minSize', 0.1, 10).step(0.1).name("最小Size限制");
            folder.add(this, 'maxSize', 10, 500).step(1).name("最大Size限制");

            return folder;
        }
    }
