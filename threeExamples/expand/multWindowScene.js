import * as THREE from 'three'

confirm("是否打开多窗口？")
	?
	window.open(

		HOST + '#/codeMirror?navigation=ThreeJS&classify=expand&id=multWindowScene',

		'_blank',

		`width=800,height=600,left=${Math.random() * 500},top=${Math.random() * 200}`
	) : null

class WindowManager {
	#windows;
	#count = localStorage.getItem("count") || 0;
	#id;
	#winData;
	#winShapeChangeCallback;
	#winChangeCallback;

	constructor() {
		addEventListener("storage", (event) => {
			if (event.key == "windows") {
				let newWindows = JSON.parse(event.newValue);
				let winChange = this.#didWindowsChange(this.#windows, newWindows);
				this.#windows = newWindows;
				if (winChange && this.#winChangeCallback) this.#winChangeCallback();
			}
		});

		window.addEventListener('beforeunload', () => {
			let index = this.getWindowIndexFromId(this.#id);
			this.#windows.splice(index, 1);
			this.updateWindowsLocalStorage();
		});
	}

	#didWindowsChange(pWins, nWins) {
		if (pWins.length != nWins.length) return true;
		return pWins.some((pWin, i) => pWin.id != nWins[i].id);
	}

	init(metaData) {
		this.#windows = JSON.parse(localStorage.getItem("windows")) || [];
		this.#count++;
		this.#id = this.#count;
		let shape = this.getWinShape();
		this.#winData = { id: this.#id, shape: shape, metaData: metaData };
		this.#windows.push(this.#winData);
		localStorage.setItem("count", this.#count);
		this.updateWindowsLocalStorage();
	}

	getWinShape() {
		return { x: window.screenLeft, y: window.screenTop, w: window.innerWidth, h: window.innerHeight };
	}

	getWindowIndexFromId(id) {
		return this.#windows.findIndex(win => win.id == id);
	}

	updateWindowsLocalStorage() {
		localStorage.setItem("windows", JSON.stringify(this.#windows));
	}

	update() {
		let winShape = this.getWinShape();
		if (Object.values(winShape).some((value, i) => value != Object.values(this.#winData.shape)[i])) {
			this.#winData.shape = winShape;
			let index = this.getWindowIndexFromId(this.#id);
			this.#windows[index].shape = winShape;
			if (this.#winShapeChangeCallback) this.#winShapeChangeCallback();
			this.updateWindowsLocalStorage();
		}
	}

	setWinShapeChangeCallback(callback) {
		this.#winShapeChangeCallback = callback;
	}

	setWinChangeCallback(callback) {
		this.#winChangeCallback = callback;
	}

	getWindows() {
		return this.#windows;
	}

	getThisWindowData() {
		return this.#winData;
	}

	getThisWindowID() {
		return this.#id;
	}
}

let camera, scene, renderer, world, near, far, pixR = window.devicePixelRatio || 1, cubes = [], sceneOffsetTarget = { x: 0, y: 0 }, sceneOffset = { x: 0, y: 0 };
let today = new Date().setHours(0, 0, 0, 0), internalTime = (new Date().getTime() - today) / 1000.0, windowManager, initialized = false;

if (new URLSearchParams(window.location.search).get("clear")) localStorage.clear();
else {
	document.addEventListener("visibilitychange", () => { if (document.visibilityState != 'hidden' && !initialized) init(); });
	window.onload = () => { if (document.visibilityState != 'hidden') init(); };

	function init() {
		initialized = true;
		setTimeout(() => { setupScene(); setupWindowManager(); resize(); updateWindowShape(false); render(); window.addEventListener('resize', resize); }, 500)
	}

	function setupScene() {
		camera = new THREE.OrthographicCamera(0, 0, window.innerWidth, window.innerHeight, -10000, 10000);
		camera.position.z = 2.5; near = camera.position.z - .5; far = camera.position.z + 0.5;
		scene = new THREE.Scene(); scene.background = new THREE.Color(0.0); scene.add(camera);
		renderer = new THREE.WebGLRenderer({ antialias: true, depthBuffer: true }); renderer.setPixelRatio(pixR);
		world = new THREE.Object3D(); scene.add(world);
		renderer.domElement.setAttribute("id", "scene"); document.body.appendChild(renderer.domElement);
	}

	function setupWindowManager() {
		windowManager = new WindowManager(); windowManager.setWinShapeChangeCallback(updateWindowShape); windowManager.setWinChangeCallback(updateNumberOfCubes);
		windowManager.init({ foo: "bar" }); updateNumberOfCubes();
	}

	function updateNumberOfCubes() {
		cubes.forEach((c) => { world.remove(c); }); cubes = [];
		windowManager.getWindows().forEach((win, i) => {
			let c = new THREE.Color(); c.setHSL(i * .1, 1.0, .5);
			let s = 100 + i * 50, cube = new THREE.Mesh(new THREE.BoxGeometry(s, s, s), new THREE.MeshBasicMaterial({ color: c , transparent: true, opacity: 0.5 }));
			cube.position.x = win.shape.x + (win.shape.w * .5); cube.position.y = win.shape.y + (win.shape.h * .5);
			world.add(cube); cubes.push(cube);
		});
	}

	function updateWindowShape(easing = true) {
		sceneOffsetTarget = { x: -window.screenX, y: -window.screenY };
		if (!easing) sceneOffset = sceneOffsetTarget;
	}

	function render() {
		let t = (new Date().getTime() - today) / 1000.0, falloff = .05;
		windowManager.update();
		sceneOffset.x += (sceneOffsetTarget.x - sceneOffset.x) * falloff; sceneOffset.y += (sceneOffsetTarget.y - sceneOffset.y) * falloff;
		world.position.x = sceneOffset.x; world.position.y = sceneOffset.y;
		cubes.forEach((cube, i) => {
			let win = windowManager.getWindows()[i], _t = t, posTarget = { x: win.shape.x + (win.shape.w * .5), y: win.shape.y + (win.shape.h * .5) };
			cube.position.x += (posTarget.x - cube.position.x) * falloff; cube.position.y += (posTarget.y - cube.position.y) * falloff;
			cube.rotation.x = _t * .5; cube.rotation.y = _t * .3;
		});
		renderer.render(scene, camera); requestAnimationFrame(render);
	}

	function resize() {
		let width = window.innerWidth, height = window.innerHeight;
		camera = new THREE.OrthographicCamera(0, width, 0, height, -10000, 10000); camera.updateProjectionMatrix(); renderer.setSize(width, height);
	}
}