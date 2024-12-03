import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GUI } from "three/addons/libs/lil-gui.module.min.js"

const getRandomIntInclusive = function (min, max) {
	const minCeiled = Math.ceil(min);
	const maxFloored = Math.floor(max);
	return Math.floor(Math.random() * (maxFloored - minCeiled + 1) + minCeiled); // 包含最小值和最大值
}

const setAoMapEnable = function (mesh) {
	mesh.geometry.setAttribute('uv2',
		new THREE.Float32BufferAttribute(
			mesh.geometry.attributes.uv.array, 2
		)
	)
}

const scene = new THREE.Scene();

const loaderManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loaderManager);
const door_colorTexture = textureLoader.load(FILE_HOST + 'threeExamples/application/haunted_house/door/color.jpg', () => { door_colorTexture.colorSpace = THREE.SRGBColorSpace });
const door_lphaTexture = textureLoader.load(FILE_HOST + 'threeExamples/application/haunted_house/door/alpha.jpg');
const door_ambientOcclusionTexture = textureLoader.load(FILE_HOST + 'threeExamples/application/haunted_house/door/ambientOcclusion.jpg');
const door_heightTexture = textureLoader.load(FILE_HOST + 'threeExamples/application/haunted_house/door/height.jpg');
const door_metalnessTexture = textureLoader.load(FILE_HOST + 'threeExamples/application/haunted_house/door/metalness.jpg');
const door_normalTexture = textureLoader.load(FILE_HOST + 'threeExamples/application/haunted_house/door/normal.jpg');
const door_roughnessTexture = textureLoader.load(FILE_HOST + 'threeExamples/application/haunted_house/door/roughness.jpg');

const bricks_colorTexture = textureLoader.load(FILE_HOST + 'threeExamples/application/haunted_house/bricks/color.jpg', () => { bricks_colorTexture.colorSpace = THREE.SRGBColorSpace });
const bricks_ambientOcclusionTexture = textureLoader.load(FILE_HOST + 'threeExamples/application/haunted_house/bricks/ambientOcclusion.jpg');
const bricks_normalTexture = textureLoader.load(FILE_HOST + 'threeExamples/application/haunted_house/bricks/normal.jpg');
const bricks_roughnessTexture = textureLoader.load(FILE_HOST + 'threeExamples/application/haunted_house/bricks/roughness.jpg');

const grass_colorTexture = textureLoader.load(FILE_HOST + 'threeExamples/application/haunted_house/grass/color.jpg', () => { grass_colorTexture.colorSpace = THREE.SRGBColorSpace });
const grass_ambientOcclusionTexture = textureLoader.load(FILE_HOST + 'threeExamples/application/haunted_house/grass/ambientOcclusion.jpg');
const grass_normalTexture = textureLoader.load(FILE_HOST + 'threeExamples/application/haunted_house/grass/normal.jpg');
const grass_roughnessTexture = textureLoader.load(FILE_HOST + 'threeExamples/application/haunted_house/grass/roughness.jpg');
loaderManager.onLoad = function () {
	console.log('纹理加载完毕')
}
loaderManager.onError = function (e) {
	console.log('纹理失败', e)
}
/**
 * Fog
 */
const fog = new THREE.Fog('#50508b', 1, 15);
scene.fog = fog;

/**
 * Objects
 */
const houseObj = {
	houseWidth: 4,
	houseHeight: 2.5,
	houseDepth: 4,
	roofHeight: 0.8,
	doorSize: 2.2
}

const house = new THREE.Group();
scene.add(house);

//房屋墙壁
const wall = new THREE.Mesh(
	new THREE.BoxGeometry(houseObj.houseWidth, houseObj.houseHeight, houseObj.houseDepth),
	new THREE.MeshStandardMaterial({
		map: bricks_colorTexture,
		aoMap: bricks_ambientOcclusionTexture,
		aoMapIntensity: 2,
		normalMap: bricks_normalTexture,
		roughnessMap: bricks_roughnessTexture,
	})
)
setAoMapEnable(wall);
wall.position.y = houseObj.houseHeight * 0.5
house.add(wall)

const roof = new THREE.Mesh(
	new THREE.ConeGeometry(
		Math.sqrt(houseObj.houseWidth * houseObj.houseWidth + houseObj.houseDepth * houseObj.houseDepth) * 0.5,
		houseObj.roofHeight,
		4),
	new THREE.MeshStandardMaterial(
		{
			color: '#b35f45'
		}
	)
)
roof.rotation.y = Math.PI / 4;
roof.position.y = houseObj.houseHeight + 0.5 * houseObj.roofHeight
roof.geometry.scale(1.5, 1.5, 1.5)
console.log('roof', roof);
house.add(roof);

// 门
const door = new THREE.Mesh(
	new THREE.PlaneGeometry(houseObj.doorSize, houseObj.doorSize, 100, 100),
	new THREE.MeshStandardMaterial({
		map: door_colorTexture,
		transparent: true,
		alphaMap: door_lphaTexture,
		aoMap: door_ambientOcclusionTexture,
		aoMapIntensity: 5,
		displacementMap: door_heightTexture,
		displacementScale: 0.1,
		normalMap: door_normalTexture,
		metalnessMap: door_metalnessTexture,
		roughness: door_roughnessTexture
	})
)
door.geometry.setAttribute('uv2',
	new THREE.Float32BufferAttribute(
		door.geometry.attributes.uv.array, 2
	)
)
door.position.y = 1;
door.position.z = houseObj.houseDepth * 0.5 + 0.01;
house.add(door);

// 灌木丛
const bushes = [];
const bushGeometry = new THREE.SphereGeometry(1, 16, 16)
const bushMaterial = new THREE.MeshStandardMaterial({ color: '#89c854' })
bushes[0] = new THREE.Mesh(bushGeometry, bushMaterial)
bushes[0].position.set(houseObj.houseWidth * 0.5 + 0.05, 0.2, houseObj.houseDepth + 0.05)
bushes[0].scale.set(0.5, 0.5, 0.5);

bushes[1] = new THREE.Mesh(bushGeometry, bushMaterial)
bushes[1].position.set(-(houseObj.houseWidth * 0.5 + 0.05), 0.2, -(houseObj.houseDepth + 0.05))
bushes[1].scale.set(0.8, 0.8, 0.8);

bushes[2] = new THREE.Mesh(bushGeometry, bushMaterial)
bushes[2].position.set(houseObj.houseWidth * 0.5 + 0.05, 0.2, -(houseObj.houseDepth + 0.05))
bushes[2].scale.set(0.3, 0.3, 0.3);

bushes[3] = new THREE.Mesh(bushGeometry, bushMaterial)
bushes[3].position.set(-(houseObj.houseWidth * 0.5 + 0.05), 0.2, houseObj.houseDepth + 0.05)
bushes[3].scale.set(0.6, 0.6, 0.6);
house.add(...bushes);


// 墓碑
const graves = new THREE.Group()
const gravesGeometry = new THREE.BoxGeometry(0.4, 0.8, 0.2)
const gravesMaterial = new THREE.MeshStandardMaterial({ color: '#ccc' })
for (let i = 0; i < 50; i++) {
	const grave = new THREE.Mesh(gravesGeometry, gravesMaterial);
	const angle = Math.random() * getRandomIntInclusive(0, Math.PI * 2)
	const radius = getRandomIntInclusive(
		(Math.max(houseObj.houseDepth, houseObj.houseWidth) * 0.5 + 3.2),
		10 - 0.4
	)
	// const x=Math.cos(angle)*radius;
	// const y=Math.sin(angle)*radius;

	grave.position.x = Math.cos(angle) * radius;
	grave.position.z = Math.sin(angle) * radius;
	grave.position.y = Math.random() * 0.5;
	grave.rotation.y = Math.random() * Math.PI
	grave.rotation.z = (Math.random() - 0.5) * 0.4
	grave.castShadow = true;
	graves.add(grave)
}
scene.add(graves)



// 地面
grass_colorTexture.wrapS = THREE.RepeatWrapping;
grass_colorTexture.wrapT = THREE.RepeatWrapping;
grass_colorTexture.repeat.set(8, 8);

grass_ambientOcclusionTexture.wrapS = THREE.RepeatWrapping;
grass_ambientOcclusionTexture.wrapT = THREE.RepeatWrapping;
grass_ambientOcclusionTexture.repeat.set(8, 8);

grass_normalTexture.wrapS = THREE.RepeatWrapping;
grass_normalTexture.wrapT = THREE.RepeatWrapping;
grass_normalTexture.repeat.set(8, 8);

grass_roughnessTexture.wrapS = THREE.RepeatWrapping;
grass_roughnessTexture.wrapT = THREE.RepeatWrapping;
grass_roughnessTexture.repeat.set(8, 8);
const ground = new THREE.Mesh(
	new THREE.PlaneGeometry(20, 20),
	new THREE.MeshStandardMaterial({
		map: grass_colorTexture,
		aoMap: grass_ambientOcclusionTexture,
		aoMapIntensity: 2,
		normalMap: grass_normalTexture,
		roughnessMap: grass_roughnessTexture,
	})
)
setAoMapEnable(ground);
ground.rotation.x = -Math.PI / 2;
ground.position.y = 0;
scene.add(ground);

// 鬼魂
const ghost1 = new THREE.PointLight('#ff00ff', 2, 3);
scene.add(ghost1);
const ghost2 = new THREE.PointLight('#00ff00', 2, 3);
scene.add(ghost2);
const ghost3 = new THREE.PointLight('#0000ff', 2, 3);
scene.add(ghost3);

/**
 * light
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12)
scene.add(ambientLight)

// Directional light
const moonLight = new THREE.DirectionalLight('#ffffff', 0.12)
moonLight.position.set(4, 5, - 2)
scene.add(moonLight)

const doorLight = new THREE.PointLight('#ff7d46', 1, 7)
doorLight.position.set(0, 2.2, 2.7);
house.add(doorLight);

const gui = new GUI({
	title: '控制面板',
	width: '320',
	closeFolders: true
});
gui.add(ambientLight, 'intensity').name('环境光强度').min(0).max(1).step(0.001);
gui.add(moonLight, 'intensity').name('平行光强度').min(0).max(1).step(0.001);
gui.add(moonLight.position, 'x').name('平行光光源x').min(- 5).max(5).step(0.001);
gui.add(moonLight.position, 'y').name('平行光光源y').min(- 5).max(5).step(0.001);
gui.add(moonLight.position, 'z').name('平行光光源z').min(- 5).max(5).step(0.001);
// gui.add(fog.color, 'z').name(fog').min(- 5).max(5).step(0.001);
gui.addColor(fog, 'color').name('颜色')


/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100)
camera.position.x = 4
camera.position.y = 2
camera.position.z = 5
scene.add(camera);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
document.getElementById('box').appendChild(renderer.domElement);
renderer.setClearColor('#50508b');

/**
 * Shadow
 */
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

moonLight.castShadow = true;
doorLight.castShadow = true;
ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;

wall.castShadow = true;
ground.castShadow = false;
ground.receiveShadow = true;

doorLight.shadow.mapSize.set(252, 252);

doorLight.shadow.camera.far = 7;

moonLight.shadow.mapSize.set(252, 252);


ghost1.shadow.mapSize.set(252, 252);

ghost1.shadow.camera.far = 7;

ghost2.shadow.mapSize.set(252, 252);

ghost2.shadow.camera.far = 7;

ghost3.shadow.mapSize.set(252, 252);
ghost3.shadow.camera.far = 7;




renderer.render(scene, camera);
const control = new OrbitControls(camera, renderer.domElement);


const clock = new THREE.Clock();
const tick = () => {
	const elapsedTime = clock.getElapsedTime() * 0.5;
	ghost1.position.x = Math.cos(elapsedTime) * 4.8;
	ghost1.position.z = Math.sin(elapsedTime) * 4.8;
	ghost1.position.y = Math.sin(elapsedTime * 3);

	ghost2.position.x = Math.cos(-0.8 * elapsedTime) * (8 + Math.sin(elapsedTime));
	ghost2.position.z = Math.sin(-0.8 * elapsedTime) * (8 + Math.sin(elapsedTime));
	ghost2.position.y = Math.sin(elapsedTime * 2);

	ghost3.position.x = Math.cos(-elapsedTime) * 5;
	ghost3.position.z = Math.sin(-elapsedTime) * 5;
	ghost3.position.y = Math.sin(elapsedTime * 2.5) + Math.cos(elapsedTime * 1.5);
	control.update();
	renderer.render(scene, camera);
	requestAnimationFrame(tick)
}
tick();

// 尺寸改变，重新渲染
window.onresize = function () {
	renderer.setSize(window.innerWidth, window.innerHeight);
	camera.aspect = window.innerWidth / window.innerHeight;
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	camera.updateProjectionMatrix();
}
