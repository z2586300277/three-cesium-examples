/**
 * 卡通海面
 */


import { Scene, PerspectiveCamera, WebGLRenderer, DirectionalLight, MathUtils, PMREMGenerator, AmbientLight, PlaneGeometry, Clock, Mesh, MeshBasicMaterial, Vector3, BoxGeometry, Box3, BufferGeometry, Float32BufferAttribute, BufferAttribute, Matrix4, ShaderMaterial, } from "three";
import { OrbitControls, Sky } from "three/examples/jsm/Addons.js";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js'

const three = document.getElementById("box");
let scene, camera, renderer, controls;
// onMounted(() => {
//     initScene();
//     initOceanAndSphere();
// });
// onBeforeUnmount(() => {
//     cancelAnimationFrame(rf);
//     window.removeEventListener("resize", onWindowResize);
// });
const clock = new Clock();
function initScene() {
    scene = new Scene();
    camera = new PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(30, 5, 20);
    renderer = new WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    three.appendChild(renderer.domElement);
    //utils.setSkyFromTexture(scene, renderer)
    // .setSky(scene, renderer);
    setSky(scene, renderer)
    controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.update();
    const light = new DirectionalLight(0xffffff, 0.5);
    light.position.set(10, 20, 10);
    scene.add(light, new AmbientLight(0xffffff, 0.5));
    window.addEventListener("resize", onWindowResize);
}

function setSky(scene, renderer) {
    const sky = new Sky();
    sky.scale.setScalar(10000);
    scene.add(sky);
    const skyUniforms = sky.material.uniforms;
    skyUniforms['turbidity'].value = 10;
    skyUniforms['rayleigh'].value = 2;
    skyUniforms['mieCoefficient'].value = 0.0001;
    skyUniforms['mieDirectionalG'].value = 0.8;
    let renderTarget, sun = new Vector3();

    const parameters = {
        elevation: 2,
        azimuth: 180
    };
    const sceneEnv = new Scene();
    const pmremGenerator = new PMREMGenerator(renderer);
    function updateSun() {

        const phi = MathUtils.degToRad(90 - parameters.elevation);
        const theta = MathUtils.degToRad(parameters.azimuth);

        sun.setFromSphericalCoords(1, phi, theta);

        sky.material.uniforms['sunPosition'].value.copy(sun);
        // water.material.uniforms['sunDirection'].value.copy(sun).normalize();

        if (renderTarget !== undefined) renderTarget.dispose();

        sceneEnv.add(sky);
        renderTarget = pmremGenerator.fromScene(sceneEnv);
        scene.add(sky);

        scene.environment = renderTarget.texture;

    }

    updateSun();
}
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
let grid = 200;
let ocean, sphere, gu = { time: { value: 0 } };

let fragment = `
// #define WATER_COL vec3(0.0, 0.4453, 0.7305)

// #define WATER2_COL vec3(0.0, 0.4180, 0.6758)
// #define FOAM_COL vec3(0.8125, 0.9609, 0.9648)
// rgb(0,113,186)
// rgb(0,104,172)
// rgb(172,244,244)
#define WATER_COL vec3(0.0, 0.4453, 1.)
#define WATER2_COL vec3(0.0, 0.4180, 0.6758)
#define FOAM_COL vec3(0.8125, 0.9609, 0.9648)

#define M_2PI 6.283185307
#define M_6PI 18.84955592
        varying vec2 v_uv;
    uniform float time;
float circ(vec2 pos, vec2 c, float s)
{
    c = abs(pos - c);
    c = min(c, 1.0 - c);

    return smoothstep(0.0, 0.002, sqrt(s) - sqrt(dot(c, c))) * -1.0;
}

// Foam pattern for the water constructed out of a series of circles
float waterlayer(vec2 uv)
{
    uv = mod(uv, 1.0); // Clamp to [0..1]
    float ret = 1.0;
    ret += circ(uv, vec2(0.37378, 0.277169), 0.0268181);
    ret += circ(uv, vec2(0.0317477, 0.540372), 0.0193742);
    ret += circ(uv, vec2(0.430044, 0.882218), 0.0232337);
    ret += circ(uv, vec2(0.641033, 0.695106), 0.0117864);
    ret += circ(uv, vec2(0.0146398, 0.0791346), 0.0299458);
    ret += circ(uv, vec2(0.43871, 0.394445), 0.0289087);
    ret += circ(uv, vec2(0.909446, 0.878141), 0.028466);
    ret += circ(uv, vec2(0.310149, 0.686637), 0.0128496);
    ret += circ(uv, vec2(0.928617, 0.195986), 0.0152041);
    ret += circ(uv, vec2(0.0438506, 0.868153), 0.0268601);
    ret += circ(uv, vec2(0.308619, 0.194937), 0.00806102);
    ret += circ(uv, vec2(0.349922, 0.449714), 0.00928667);
    ret += circ(uv, vec2(0.0449556, 0.953415), 0.023126);
    ret += circ(uv, vec2(0.117761, 0.503309), 0.0151272);
    ret += circ(uv, vec2(0.563517, 0.244991), 0.0292322);
    ret += circ(uv, vec2(0.566936, 0.954457), 0.00981141);
    ret += circ(uv, vec2(0.0489944, 0.200931), 0.0178746);
    ret += circ(uv, vec2(0.569297, 0.624893), 0.0132408);
    ret += circ(uv, vec2(0.298347, 0.710972), 0.0114426);
    ret += circ(uv, vec2(0.878141, 0.771279), 0.00322719);
    ret += circ(uv, vec2(0.150995, 0.376221), 0.00216157);
    ret += circ(uv, vec2(0.119673, 0.541984), 0.0124621);
    ret += circ(uv, vec2(0.629598, 0.295629), 0.0198736);
    ret += circ(uv, vec2(0.334357, 0.266278), 0.0187145);
    ret += circ(uv, vec2(0.918044, 0.968163), 0.0182928);
    ret += circ(uv, vec2(0.965445, 0.505026), 0.006348);
    ret += circ(uv, vec2(0.514847, 0.865444), 0.00623523);
    ret += circ(uv, vec2(0.710575, 0.0415131), 0.00322689);
    ret += circ(uv, vec2(0.71403, 0.576945), 0.0215641);
    ret += circ(uv, vec2(0.748873, 0.413325), 0.0110795);
    ret += circ(uv, vec2(0.0623365, 0.896713), 0.0236203);
    ret += circ(uv, vec2(0.980482, 0.473849), 0.00573439);
    ret += circ(uv, vec2(0.647463, 0.654349), 0.0188713);
    ret += circ(uv, vec2(0.651406, 0.981297), 0.00710875);
    ret += circ(uv, vec2(0.428928, 0.382426), 0.0298806);
    ret += circ(uv, vec2(0.811545, 0.62568), 0.00265539);
    ret += circ(uv, vec2(0.400787, 0.74162), 0.00486609);
    ret += circ(uv, vec2(0.331283, 0.418536), 0.00598028);
    ret += circ(uv, vec2(0.894762, 0.0657997), 0.00760375);
    ret += circ(uv, vec2(0.525104, 0.572233), 0.0141796);
    ret += circ(uv, vec2(0.431526, 0.911372), 0.0213234);
    ret += circ(uv, vec2(0.658212, 0.910553), 0.000741023);
    ret += circ(uv, vec2(0.514523, 0.243263), 0.0270685);
    ret += circ(uv, vec2(0.0249494, 0.252872), 0.00876653);
    ret += circ(uv, vec2(0.502214, 0.47269), 0.0234534);
    ret += circ(uv, vec2(0.693271, 0.431469), 0.0246533);
    ret += circ(uv, vec2(0.415, 0.884418), 0.0271696);
    ret += circ(uv, vec2(0.149073, 0.41204), 0.00497198);
    ret += circ(uv, vec2(0.533816, 0.897634), 0.00650833);
    ret += circ(uv, vec2(0.0409132, 0.83406), 0.0191398);
    ret += circ(uv, vec2(0.638585, 0.646019), 0.0206129);
    ret += circ(uv, vec2(0.660342, 0.966541), 0.0053511);
    ret += circ(uv, vec2(0.513783, 0.142233), 0.00471653);
    ret += circ(uv, vec2(0.124305, 0.644263), 0.00116724);
    ret += circ(uv, vec2(0.99871, 0.583864), 0.0107329);
    ret += circ(uv, vec2(0.894879, 0.233289), 0.00667092);
    ret += circ(uv, vec2(0.246286, 0.682766), 0.00411623);
    ret += circ(uv, vec2(0.0761895, 0.16327), 0.0145935);
    ret += circ(uv, vec2(0.949386, 0.802936), 0.0100873);
    ret += circ(uv, vec2(0.480122, 0.196554), 0.0110185);
    ret += circ(uv, vec2(0.896854, 0.803707), 0.013969);
    ret += circ(uv, vec2(0.292865, 0.762973), 0.00566413);
    ret += circ(uv, vec2(0.0995585, 0.117457), 0.00869407);
    ret += circ(uv, vec2(0.377713, 0.00335442), 0.0063147);
    ret += circ(uv, vec2(0.506365, 0.531118), 0.0144016);
    ret += circ(uv, vec2(0.408806, 0.894771), 0.0243923);
    ret += circ(uv, vec2(0.143579, 0.85138), 0.00418529);
    ret += circ(uv, vec2(0.0902811, 0.181775), 0.0108896);
    ret += circ(uv, vec2(0.780695, 0.394644), 0.00475475);
    ret += circ(uv, vec2(0.298036, 0.625531), 0.00325285);
    ret += circ(uv, vec2(0.218423, 0.714537), 0.00157212);
    ret += circ(uv, vec2(0.658836, 0.159556), 0.00225897);
    ret += circ(uv, vec2(0.987324, 0.146545), 0.0288391);
    ret += circ(uv, vec2(0.222646, 0.251694), 0.00092276);
    ret += circ(uv, vec2(0.159826, 0.528063), 0.00605293);
	return max(ret, 0.0);
}

// Procedural texture generation for the water
vec3 water(vec2 uv, vec3 cdir)
{
    uv *= vec2(0.85);

    // Parallax height distortion with two directional waves at
    // slightly different angles.
    vec2 a = 0.025 * cdir.xz / cdir.y; // Parallax offset
    float h = sin(uv.x + time); // Height at UV
    uv += a * h;
    h = sin(0.841471 * uv.x - 0.540302 * uv.y + time);
    uv += a * h;
    
    // Texture distortion
    float d1 = mod(uv.x + uv.y, M_2PI);
    float d2 = mod((uv.x + uv.y + 0.25) * 1.3, M_6PI);
    d1 = time * 0.07 + d1;
    d2 = time * 0.5 + d2;
    vec2 dist = vec2(
    	sin(d1) * 0.15 + sin(d2) * 0.05,
    	cos(d1) * 0.15 + cos(d2) * 0.05
    );
    
    vec3 ret = mix(WATER_COL, WATER2_COL, waterlayer(uv + dist.xy));
    ret = mix(ret, FOAM_COL, waterlayer(vec2(1.0) - uv - dist.yx));
    return ret;
}

void main()
{
    gl_FragColor = vec4(water(v_uv/0.01, vec3(1,0.1,1)),1);
}
`
let ship_model;
async function initOceanAndSphere() {
    let vertexShader = `
  
          varying vec2 v_uv;
                uniform float time;
      varying float vHeight;
      vec3 moveWave(vec3 p) {
        float waveHeight = 0.0;
        float k = 360.0 / 200.67;

        // Wave 1
        float angle1 = mod(50.0 * time + -1.0 * p.x * k + -2.0 * p.z * k, 360.0) * 3.14159 / 180.0;
        waveHeight += 3.0 * sin(angle1);

        // Wave 2
        float angle2 = mod(25.0 * time + -3.0 * p.x * k, 360.0) * 3.14159 / 180.0;
        waveHeight += 2.0 * sin(angle2);

        return vec3(p.x, waveHeight, p.z);
      }
        void main(){
          v_uv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4( moveWave(position), 1.0 );
        }`;
    const sm = new ShaderMaterial({
        vertexShader,
        fragmentShader: fragment,
        uniforms: {
            time: gu.time
        }
    });
    // 创建海面
    const oceanGeometry = new PlaneGeometry(grid, grid, 50, 50);
    oceanGeometry.rotateX(-Math.PI / 2);
    ocean = new Mesh(oceanGeometry, sm);
    scene.add(ocean);
    // 创建小球
    const sphereGeometry = new BoxGeometry(0.5, 0.5, 0.5);
    const sphereMaterial = new MeshBasicMaterial({ color: "green" });
    sphere = new Mesh(sphereGeometry, sphereMaterial);
    // scene.add(sphere);
    // ship
    const loader = new GLTFLoader()
    loader.setDRACOLoader(new DRACOLoader().setDecoderPath(FILE_HOST + 'js/three/draco/'))
    const ship = await loader.loadAsync(HOST + '/files/model/ship_2.glb');
    console.log(ship);

    // const ship = m.scene
    let scale = 0.01;
    ship.scene.scale.set(scale, scale, scale);
    ship_model = ship.scene;
    scene.add(ship.scene);
    function animate() {
        gu.time.value = clock.getElapsedTime();
        process_ship_model();
        // 更新小球位置
        const x = 0; // 小球的 x 坐标
        const z = 0; // 小球的 z 坐标
        const y = moveWave(new Vector3(x, 0, z), gu.time.value);
        sphere.position.set(x, y, z);
        ship.scene.position.set(x, y, z);
        // 渲染场景
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
    }
    animate();
}
function mod(a, b) {
    return ((a % b) + b) % b;
}
function moveWave(p, time) {
    const k = 360.0 / 200.67;
    let waveHeight = 0.0;
    // Wave 1
    let angle1 = mod(50.0 * time + -1.0 * p.x * k + -2.0 * p.z * k, 360.0) * (Math.PI / 180.0);
    waveHeight += 3.0 * Math.sin(angle1);
    // Wave 2
    let angle2 = mod(25.0 * time + -3.0 * p.x * k, 360.0) * (Math.PI / 180.0);
    waveHeight += 2.0 * Math.sin(angle2);
    return waveHeight;
}
let box3, bottomPlaneGeo;
let i = 1, plane;
function process_ship_model() {
    box3 = new Box3();
    box3.setFromObject(ship_model);
    // const helper = new Box3Helper(box3)
    // scene.add(helper)
    const center = box3.getCenter(new Vector3());
    const size = box3.getSize(new Vector3());
    let mini = Math.abs(size.x) < Math.abs(size.z) ? Math.abs(size.x) : Math.abs(size.z);
    // mini = 0 - mini
    let fourCoords = [
        center.clone().add(new Vector3(-mini / 2, 0, -mini / 2)),
        center.clone().add(new Vector3(mini / 2, 0, -mini / 2)),
        center.clone().add(new Vector3(mini / 2, 0, mini / 2)),
        center.clone().add(new Vector3(-mini / 2, 0, mini / 2)),
    ];
    // let color = ['red', 'green', 'white', 'pink']
    fourCoords;
    bottomPlaneGeo === null || bottomPlaneGeo === void 0 ? void 0 : bottomPlaneGeo.dispose();
    bottomPlaneGeo = new BufferGeometry();
    fourCoords.forEach((v3) => {
        let y = moveWave(v3, gu.time.value);
        v3.y = y;
    });
    const vertices = new Float32Array([
        fourCoords[0].x, fourCoords[0].y, fourCoords[0].z,
        fourCoords[1].x, fourCoords[1].y, fourCoords[1].z,
        fourCoords[2].x, fourCoords[2].y, fourCoords[2].z,
        fourCoords[3].x, fourCoords[3].y, fourCoords[3].z,
    ]);
    const indices = new Uint16Array([
        0, 1, 2, // 第一个三角形
        0, 2, 3, // 第二个三角形
    ]);
    bottomPlaneGeo.setIndex(new BufferAttribute(indices, 1));
    bottomPlaneGeo.setAttribute('position', new Float32BufferAttribute(vertices, 3));
    bottomPlaneGeo.computeVertexNormals();
    if (i == 1) {
        const material = new MeshBasicMaterial({ color: 0x00ff00, side: 2 });
        plane = new Mesh(bottomPlaneGeo, material);
        // plane.add(ship_model)
        scene.add(plane);
    }
    else {
        bottomPlaneGeo.computeVertexNormals();
        plane.geometry = bottomPlaneGeo;
        const normal = calculatePlaneNormal(bottomPlaneGeo);
        const m = adjust_model(normal);
        ship_model.rotation.setFromRotationMatrix(m);
    }
    i = 2;
}
function calculatePlaneNormal(geometry) {
    // 获取几何体的顶点数据
    const position = geometry.attributes.position.array;
    // 提取前三个顶点 (v0, v1, v2)
    const v0 = new Vector3(position[0], position[1], position[2]);
    const v1 = new Vector3(position[3], position[4], position[5]);
    const v2 = new Vector3(position[6], position[7], position[8]);
    // 计算边向量 u 和 v
    const u = new Vector3().subVectors(v1, v0);
    const v = new Vector3().subVectors(v2, v0);
    // 计算法线向量 n
    const normal = new Vector3().crossVectors(u, v).normalize();
    return normal;
}
function adjust_model(planeNormal) {
    // 获取模型当前的法线（假设模型初始时有一个法线方向）
    const modelNormal = new Vector3(0, -1, 0);
    // 计算旋转轴和角度
    const axis = new Vector3().crossVectors(modelNormal, planeNormal).normalize();
    const angle = Math.acos(modelNormal.dot(planeNormal) / (modelNormal.length() * planeNormal.length()));
    // 创建旋转矩阵
    const rotationMatrix = new Matrix4().makeRotationAxis(axis, angle);
    return rotationMatrix;
}

initScene();
initOceanAndSphere();