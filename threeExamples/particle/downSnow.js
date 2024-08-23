import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
let renderer, scene, camera, stats, controls;

let mesh, uniforms, geometry;
let snowMaterial;
const particles = 1000;

init();
animate();

function init() {
	camera = new THREE.PerspectiveCamera(
		40,
		window.innerWidth / window.innerHeight,
		1,
		10000
	);


	scene = new THREE.Scene();

	snowMaterial = new THREE.PointsMaterial({
		size: 5,
		blending: THREE.AdditiveBlending,
		transparent: true,
	});

	geometry = new THREE.BufferGeometry();

	let positions = new Float32Array(particles * 3);

	for (let i = 0; i < particles * 3; i += 3) {
		positions[i] = Math.random() * 200 - 100;
		positions[i + 1] = Math.random() * 200 - 100;
		positions[i + 2] = Math.random() * 200 - 100;
	}
	geometry.setAttribute(
		"position",
		new THREE.Float32BufferAttribute(positions, 3)
	);

	snowMaterial.onBeforeCompile = (shader) => {
		shader.uniforms.uColor = {
			value: new THREE.Color(0xffffff),
		};

		shader.fragmentShader = shader.fragmentShader.replace(
			`#include <common>`,
			`
                        #include <common>
                            uniform vec3 uColor;
                        `
		);

		shader.fragmentShader = shader.fragmentShader.replace(
			`#include <premultiplied_alpha_fragment>`,
			`
                            #include <premultiplied_alpha_fragment>
                                float distanceLen = distance(gl_PointCoord,vec2(0.5));
                                distanceLen = 1.0 - distanceLen;
                                distanceLen = pow(distanceLen,10.0);
                                vec4 color = vec4(uColor,distanceLen);
                                // if(color.a<0.1)
                                //     discard;
                                gl_FragColor = color;
                            `
		);
	};

	mesh = new THREE.Points(geometry, snowMaterial);
	scene.add(mesh);

	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);

	controls = new OrbitControls(camera, renderer.domElement);

	const container = document.getElementById("box");
	container.appendChild(renderer.domElement);

	window.addEventListener("resize", onWindowResize);
}

function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
	requestAnimationFrame(animate);

	render();
	controls.update();
}

function update(time, position) {
	if (snowMaterial) {
		const positions = mesh.geometry.getAttribute("position").array;
		for (let i = 0; i < positions.length; i += 3) {
			positions[i + 1] -= 0.1;
			positions[i] -= Math.sin(i) * 0.1;
			positions[i + 2] -= Math.sin(i) * 0.1;
			if (positions[i + 1] < -100) {
				positions[i + 1] = 100;
			}
		}

		mesh.geometry.getAttribute("position").needsUpdate = true;
	}
}

function render() {
	const time = Date.now() * 0.005;
	update();
	// mesh.rotation.z = 0.01 * time;

	renderer.render(scene, camera);
}