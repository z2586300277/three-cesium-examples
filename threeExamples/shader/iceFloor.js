import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const box = document.getElementById('box')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(75, box.clientWidth / box.clientHeight, 0.1, 100000)

camera.position.set(5, 5, 5)

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, logarithmicDepthBuffer: true })

renderer.setSize(box.clientWidth, box.clientHeight)

box.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

// https://github.com/rock-biter/ice-trails
const textureLoader = new THREE.TextureLoader()
const crackMap = textureLoader.load(FILE_HOST + 'images/shader/cracks.png')
crackMap.wrapS = THREE.RepeatWrapping
crackMap.wrapT = THREE.RepeatWrapping
const perlinMap = textureLoader.load(FILE_HOST + 'images/shader/smokeMap.png')
perlinMap.wrapS = THREE.RepeatWrapping
perlinMap.wrapT = THREE.RepeatWrapping
const groundMaterial = new THREE.ShaderMaterial({
	vertexShader: `
		uniform float uParallaxDistance;

		varying vec2 vParallax;
		varying vec2 vUv;

		void main() {

		vUv = uv;

		vec3 pos = position;
		vec4 wPos = modelMatrix * vec4(pos, 1.0);

		mat3 tbn = mat3(vec3(1.,0,0), vec3(0,0.,-1.), vec3(0.,1.,0.));
		tbn = transpose(tbn);

		vec3 viewDir = normalize(wPos.xyz - cameraPosition);
		vec3 tbnViewDir = tbn * viewDir;

		vParallax = tbnViewDir.xy;
		vParallax *= uParallaxDistance / dot(-tbnViewDir, vec3(0.0,0.0,1.0));

		gl_Position = projectionMatrix * viewMatrix * wPos;

	}`,
	fragmentShader: `uniform sampler2D uCracksMap;
		uniform sampler2D uTrailMap;
		uniform sampler2D uPerlin;

		varying vec2 vParallax;
		varying vec2 vUv;

		void main() {

		float perlin = texture(uPerlin, vUv).r;
		float perlin2 = texture(uPerlin, vUv * 10.).r;
		vec3 trail = texture(uTrailMap, vUv).rgb;
		float cracks = texture(uCracksMap, vUv * 4.).r;
		float nomalization = 1.0;

		vec3 colorBlue = vec3(0.0,0.2,0.25);
		vec3 colorDeepBlue = vec3(0.0,0.01,0.03);
		vec3 colorGreen = vec3(0.1,0.2,0.35);

		float accumulateFrosted = 0.;

		for (int i = 0; i < 50; i++) {
			float aplitude = float(70 - i) / 1.;
			vec2 uv = vUv * 4. + vParallax * 0.002 * float(i + 1);

			float currCrack = (1. - texture(uCracksMap, uv ).r) * aplitude;

			float currTrail = texture(uTrailMap, vUv + vParallax * 0.0025 * float(i + 1)).r;

			currCrack = currCrack * step(0.7, 1. - pow(currTrail,0.7));

			cracks += currCrack;
			nomalization += aplitude;

			accumulateFrosted += currTrail * aplitude;
		}
		cracks /= nomalization;
		accumulateFrosted /= nomalization;
		cracks += pow(1. - texture(uCracksMap, vUv * 4.).r, 3.) * 3. * step(0.92, 1. - pow(trail.r,0.6));
		
		vec3 cracksParallax = texture(uCracksMap, vUv * 2. + vParallax * 0.1).rgb;
		
		// color += 1. - cracks;
		// color += 1.0 - cracksParallax;

		vec3 frosted = colorBlue * 3. + perlin * 0.6 + perlin2 * 0.6;
		vec3 cracksColor = mix(colorBlue, colorGreen, pow(cracks,1.) * 1.);
		cracksColor += pow(cracks,1.) * 2.;
		cracksColor *= perlin * 8. * colorBlue;
		cracksColor += pow(cracks,1.) * 0.5;
		// cracksColor *= perlin2 * 4.;

		vec3 prxCracksColor = mix(colorDeepBlue, colorBlue, pow(1. - cracksParallax.r,3.) * 10.);
		prxCracksColor *= perlin;
		
		cracksColor = mix(cracksColor, prxCracksColor, 0.3);

		// vec3 color = mix(cracksColor, frosted, pow(trail.r,0.5));
		// cracksColor = mix(cracksColor, vec3(0.1,0.7,0.7), pow(accumulateFrosted,1.5));
		vec3 deepColor = mix(vec3(0.1,0.7,0.7),vec3(0., 0.3, 1.), 1. - pow(accumulateFrosted,1.5));
		cracksColor = mix(cracksColor, deepColor, pow(accumulateFrosted,1.5));
		vec3 color = mix(cracksColor, frosted, pow(trail.r,0.5) );
		// color = mix( color, colorBlue * frosted, pow(trail.r,3.));

		vec2 uv = vUv - 0.5;
		uv *= 2.0;
		color = mix(color, vec3(0.0, 0.01, 0.02), smoothstep(0.2,1.,length(pow(abs(uv), vec2(1.)))));

		// 添加边缘透明度处理，剔除边缘纯色部分
		float edgeDistance = length(uv);
		float alpha = 1.0 - smoothstep(0.8, 1.0, edgeDistance);

		gl_FragColor = vec4(color, alpha);

		#include <tonemapping_fragment>
		#include <colorspace_fragment>
		}`,
	transparent: true,
	side: THREE.DoubleSide,
	uniforms: {
		uTrailMap: new THREE.Uniform(),
		uCracksMap: new THREE.Uniform(crackMap),
		uPerlin: new THREE.Uniform(perlinMap),
		uParallaxDistance: new THREE.Uniform(1),
	},
})

const groundGeometry = new THREE.PlaneGeometry(15, 15)
groundGeometry.rotateX(-Math.PI * 0.5)
const ground = new THREE.Mesh(groundGeometry, groundMaterial)
scene.add(ground)


animate()

function animate() {

	controls.update()
    requestAnimationFrame(animate)
    renderer.render(scene, camera)

}

window.onresize = () => {

    renderer.setSize(box.clientWidth, box.clientHeight)
    camera.aspect = box.clientWidth / box.clientHeight
    camera.updateProjectionMatrix()

}

