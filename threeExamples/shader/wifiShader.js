import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

class RadioSignals extends THREE.InstancedMesh {
	constructor(gu, camera, amount, colors = []) {
		const segs = 36;
		const offsets = [0.0625, 0.25 + 0.1875, 0.5 + 0.1875, 0.75 + 0.1875];
		const gs = offsets.map((offset, idx) => {
			const g = new THREE.PlaneGeometry(1, 0.125, segs, 1).translate(0, offset, 0);
			const count = g.attributes.position.count;
			const ts = Math.random() * 2;
			g.setAttribute("batchIndex", new THREE.Float32BufferAttribute(new Array(count).fill(idx), 1));
			return g;
		});
		const g = mergeGeometries(gs);
		g.setAttribute(
			"timeShift",
			new THREE.InstancedBufferAttribute(
				new Float32Array(Array.from({ length: amount }, () => Math.random() * 2)),
				1
			)
		);
		const material = new THREE.MeshBasicMaterial({
			onBeforeCompile: shader => {
				shader.uniforms.time = gu.time;
				shader.uniforms.bendAngle = this.uniforms.bendAngle;
				shader.vertexShader = `
                uniform float time;
                uniform float bendAngle;
                attribute float batchIndex;
                attribute float timeShift;
                mat2 rot(float a){
                float c = cos(a);
                float s = sin(a);
                return mat2(c, s, -s, c);
                }
                ${shader.vertexShader}
                            `.replace(
                                `#include <begin_vertex>`,
                                `#include <begin_vertex>
                float t = (time + timeShift) * PI2;
                bool notZero = batchIndex > 0.5;
                float a = notZero ? bendAngle : PI2;
                float r = position.y;
                transformed.xy = rot(a * -position.x) * vec2(0., r);
                
                if (notZero){
                    float fr = sin(mod((floor((r * 4.) - 0.25)) - t, PI2));
                    transformed *= step(0., fr);
                }`
				);
			}
		});
		super(g, material, amount);
		this.uniforms = { bendAngle: { value: (Math.PI * 2) / 3 } };
		this.items = Array.from({ length: amount }, (_, idx) => {
			const o = new THREE.Object3D();
			o.position.set(THREE.MathUtils.randInt(-10, 10), 0, THREE.MathUtils.randInt(-10, 10));
			o.updateMatrix();
			this.setMatrixAt(idx, o.matrix);
			const _color = new THREE.Color();
			if (Array.isArray(colors)) {
				if (colors.length !== amount) {
					console.warn("Amount of elements for colours is not equal to amount of instances. Randomness will be used.");
					_color.setHSL(Math.random(), 1, 0.75);
				} else {
					_color.set(colors[idx]);
				}
			}
			this.setColorAt(idx, _color);
			return o;
		});
		this.update = () => {
			this.items.forEach((o, idx) => {
				o.quaternion.copy(camera.quaternion);
				o.updateMatrix();
				this.setMatrixAt(idx, o.matrix);
			});
			this.instanceMatrix.needsUpdate = true;
		};
	}
}

let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 1, 1000);
camera.position.set(0, 10, 10);
let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);
let controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
let gu = { time: { value: 0 }};
let radioSignals = new RadioSignals(gu, camera, 45);
scene.add(radioSignals);
const clock = new THREE.Clock();
renderer.setAnimationLoop(() => {
    gu.time.value = clock.getElapsedTime();
    controls.update();
    radioSignals.update();
    renderer.render(scene, camera);
});