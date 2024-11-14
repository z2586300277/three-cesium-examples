import {
  Vector3,
  Mesh,
  BoxGeometry,
  Color,
  WebGLRenderer,
  PCFSoftShadowMap,
  OrthographicCamera,
  ShaderMaterial,
  Scene,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from "dat.gui";

function initOrthographicCamera(initialPosition) {
  const s = 15;
  const h = window.innerHeight;
  const w = window.innerWidth;
  const position =
    initialPosition !== undefined ? initialPosition : new Vector3(-30, 40, 30);

  const camera = new OrthographicCamera(
    -s,
    s,
    s * (h / w),
    -s * (h / w),
    1,
    10000
  );
  camera.position.copy(position);
  camera.lookAt(new Vector3(0, 0, 0));

  window.camera = camera;

  return camera;
}
function initRenderer(props = {}) {
  const dom = document.getElementById("box");
  dom.style.width = "100vw";
  dom.style.height = "100vh";

  const renderer = new WebGLRenderer({ antialias: true, ...props });
  renderer.shadowMap.enabled = true;
  renderer.shadowMapSoft = true;
  renderer.shadowMap.type = PCFSoftShadowMap;
  renderer.setPixelRatio(devicePixelRatio);
  renderer.setSize(dom.offsetWidth, dom.offsetHeight);

  dom.appendChild(renderer.domElement);
  window.renderer = renderer;

  return renderer;
}

window.onload = () => {
  init();
};

const colors = [
  new Color(0.5, 0.0, 1.0), // 紫色
  new Color(0.0, 0.0, 1.0), // 蓝色
  new Color(0.0, 1.0, 1.0), // 青色
  new Color(0.0, 1.0, 0.0), // 绿色
  new Color(1.0, 1.0, 0.0), // 黄色
  new Color(1.0, 0.0, 0.0), // 红色
];

const vertexShader = /*glsl*/ `
    varying vec4 vPosition;
    void main() {
      vPosition = modelMatrix * vec4(position, 1.0);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

const fragmentShader = /*glsl*/ `
    varying vec4 vPosition;
    uniform float uScale;
    uniform vec3 colors[6];
    void main() {
      float intensity = clamp((vPosition.y + 13.0) * uScale / 255.0, 0.0, 1.0);
  
      float segment = intensity * 5.0;
      int index = int(segment);
      float t = fract(segment);
  
      vec3 outputColor  = mix(colors[index], colors[index + 1], t);
      gl_FragColor = vec4(outputColor , 1.0);
    }
  `;

function init() {
  const renderer = initRenderer();

  const camera = initOrthographicCamera(new Vector3(0, 0, 100));
  camera.lookAt(0, 0, 0);
  camera.up.set(0, 0, 1);
  camera.zoom = 0.4;
  camera.updateProjectionMatrix();

  const orbitControls = new OrbitControls(camera, renderer.domElement);

  const scene = new Scene()

  const bars = [];
  const barCount = 64;
  const geometry = new BoxGeometry(0.5, 1, 0.5);
  const material = new ShaderMaterial({
    uniforms: {
      colors: { value: colors },
      uScale: { value: 1.0 },
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
  });

  for (let i = 0, offset = 0; i < barCount; i++, offset = i - barCount / 2) {
    const bar = new Mesh(geometry, material.clone());
    bar.position.x = offset;
    scene.add(bar);
    bars.push(bar);

    const mirrorBar = new Mesh(geometry, material.clone());
    mirrorBar.position.x = -offset;
    scene.add(mirrorBar);
    bars.push(mirrorBar);

    bar.position.y = mirrorBar.position.y = -12.5;
  }

  const audio = new Audio(FILE_HOST + "files/audio/YMCA.mp3");
  audio.crossOrigin = "anonymous";

  const audioContext = new AudioContext();
  const analyser = audioContext.createAnalyser();

  const source = audioContext.createMediaElementSource(audio);
  source.connect(analyser);
  source.connect(audioContext.destination);

  analyser.fftSize = barCount * 2;
  const bufferLength = analyser.frequencyBinCount;
  const dataArray = new Uint8Array(bufferLength);

  const length = bars.length - 1;
  function update() {
    analyser.getByteFrequencyData(dataArray);
    for (let i = 0, j = length; i < barCount; i++, j = length - i) {
      const scale = dataArray[barCount - i] / 10;
      const height = scale < 1 ? 1 : scale;
      const y = -13 + height / 2;
      bars[i].scale.y = height;
      bars[j].scale.y = height;
      bars[i].position.y = bars[j].position.y = y;
      bars[i].material.uniforms.uScale.value = scale;
      bars[j].material.uniforms.uScale.value = scale;
    }
  }

  function render() {
    renderer.clear();
    renderer.render(scene, camera);
    orbitControls.update();
    update();
    requestAnimationFrame(render);
  }
  render();

  const controls = {
    play() {
      audioContext.resume().then(() => {
        audio.play();
      });
    },
    pause() {
      audioContext.resume().then(() => {
        audio.pause();
      });
    },
  };

  const gui = new GUI();

  gui.add(controls, "play");
  gui.add(controls, "pause");

}
