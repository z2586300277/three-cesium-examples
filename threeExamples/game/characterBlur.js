import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from "dat.gui";

const modelUrl = "https://ylfq.github.io/model/walk.fbx";

const canvas = document.createElement("canvas");
canvas.style.width = "100vw !important";
canvas.style.height = "100vh !important";
document.body.appendChild(canvas);

const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
renderer.setClearColor(0x333333, 0);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;

const scene = new THREE.Scene();

const loader_fbx = new FBXLoader();

const modelMaterialUniforms = {
  blur: 0.85,
  blockSize: 12.0,
};

const model = await loader_fbx.loadAsync(modelUrl);
model.traverse((obj) => {
  if (obj instanceof THREE.Mesh) {
    obj.castShadow = true;
    obj.receiveShadow = true;

    /** @type {THREE.MeshPhongMaterial} */
    const m = obj.material;
    m.onBeforeCompile = (shader) => {
      shader.uniforms.blur = {
        get value() {
          return modelMaterialUniforms.blur;
        },
      };
      shader.uniforms.blockSize = {
        get value() {
          return modelMaterialUniforms.blockSize;
        },
      };

      shader.fragmentShader = shader.fragmentShader.replace(
        /* glsl */ `void main() {`,
        /* glsl */ `
          // 虚化阈值
          uniform float blur;
          // 虚化区块大小
          uniform float blockSize;

          // 虚化矩阵，自定义区块内的虚化顺序，当像素对应的虚化矩阵值小于blur时，该像素不进行渲染
          const mat4 blurMatrix = mat4(
            0.1, 0.5, 0.7, 0.3,
            0.6, 0.6, 0.9, 0.8,
            0.8, 1.0, 0.2, 0.6,
            0.3, 0.7, 0.5, 0.4
          );
            
          void main() {
            ivec2 xyInBlur = ivec2(fract(gl_FragCoord.xy / blockSize) * 4.0);
            if (blurMatrix[xyInBlur.y][xyInBlur.x] <= blur) discard;
        `
      );
    };
  }
});
const mixer = new THREE.AnimationMixer(model);
const action = mixer.clipAction(model.animations[0]);
action.setLoop(THREE.LoopRepeat);
action.play();

const light_ambient = new THREE.AmbientLight(0xffffff, 0.7);

const light_directional = new THREE.DirectionalLight(0xffffff, 0.8);
light_directional.position.set(200, 200, 200);
light_directional.castShadow = true;
light_directional.shadow.camera.left = -100;
light_directional.shadow.camera.right = 100;
light_directional.shadow.camera.top = 100;
light_directional.shadow.camera.bottom = -100;
light_directional.shadow.camera.near = 1;
light_directional.shadow.camera.far = 1000;
light_directional.shadow.mapSize.width = 1024;
light_directional.shadow.mapSize.height = 1024;

scene.add(model, light_ambient, light_directional);

const camera = new THREE.PerspectiveCamera(90, 1, 0.1, 1000);
camera.position.set(0, 0, 140);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const timer = new THREE.Timer();

const tick = (delta, elapsed) => {
  controls.update(delta);

  // 更新动画并限制模型不进行移动
  mixer.update(delta * 0.9);
  model.children[2].children[0].position.set(0, 0, 0);
};

const render = () => {
  renderer.render(scene, camera);
};

const ani = () => {
  const elapsed = timer.getElapsed();
  const delta = timer.getDelta();

  timer.update();

  tick(delta, elapsed);
  render();

  requestAnimationFrame(ani);
};

const data = {
  get blur() {
    return modelMaterialUniforms.blur;
  },
  set blur(v) {
    modelMaterialUniforms.blur = v;
  },

  get blockSize() {
    return modelMaterialUniforms.blockSize;
  },
  set blockSize(v) {
    modelMaterialUniforms.blockSize = v;
  },
};
const gui = new GUI();
gui.add(data, "blur", 0, 1, 0.001).name("虚化强度");
gui.add(data, "blockSize", 2.0, 20.0, 4.0).name("虚化区块大小");

new ResizeObserver(() => {
  const rect = document.body.getBoundingClientRect();
  const w = rect.width;
  const h = rect.height;
  const a = w / h;
  const dpr = window.devicePixelRatio * 1.25;

  renderer.setSize(w, h, false);
  renderer.setPixelRatio(dpr);

  camera.aspect = a;
  camera.updateProjectionMatrix();
}).observe(document.body);

ani();
