import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { FullScreenQuad } from "three/examples/jsm/postprocessing/Pass.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GUI } from "dat.gui";

// 渲染流程
// 1. 渲染模型到 rt_model
// 2. 渲染场景到 rt_scene
// 3. 应用噪声偏移采样点，采样获取模型深度（实现故障效果）
// 4. 采样获取场景深度
// 5. 深度比较，对模型部分应用特殊材质，场景部分正常输出

const setting = {
  baseClearColor: 0xfafafa,
  baseClearAlpha: 1,
};

const rt_model = new THREE.RenderTarget();
rt_model.depthTexture = new THREE.DepthTexture();
const rt_scene = new THREE.RenderTarget();
rt_scene.depthTexture = new THREE.DepthTexture();

// 模型材质，渲染深度用做遮罩图
// 骨骼绑定具体参考 Three.js 着色器 skin
const model_mat = new THREE.ShaderMaterial({
  vertexShader: /* glsl */ `
    uniform mat4 bindMatrix;
    uniform mat4 bindMatrixInverse;

    uniform highp sampler2D boneTexture;

    mat4 getBoneMatrix(const in float i) {
      int size = textureSize(boneTexture, 0).x;
      int j = int(i) * 4;
      int x = j % size;
      int y = j / size;
      vec4 v1 = texelFetch(boneTexture, ivec2(x + 0, y), 0);
      vec4 v2 = texelFetch(boneTexture, ivec2(x + 1, y), 0);
      vec4 v3 = texelFetch(boneTexture, ivec2(x + 2, y), 0);
      vec4 v4 = texelFetch(boneTexture, ivec2(x + 3, y), 0);
      return mat4(v1, v2, v3, v4);
    }

    void main() {
      vec3 pos = position;

      mat4 boneMatX = getBoneMatrix(skinIndex.x);
      mat4 boneMatY = getBoneMatrix(skinIndex.y);
      mat4 boneMatZ = getBoneMatrix(skinIndex.z);
      mat4 boneMatW = getBoneMatrix(skinIndex.w);

      vec4 skinVertex = bindMatrix * vec4(pos, 1.0);

      vec4 skinned = vec4(0.0);
      skinned += boneMatX * skinVertex * skinWeight.x;
      skinned += boneMatY * skinVertex * skinWeight.y;
      skinned += boneMatZ * skinVertex * skinWeight.z;
      skinned += boneMatW * skinVertex * skinWeight.w;

      pos = (bindMatrixInverse * skinned).xyz;

      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    void main() {
      gl_FragColor = vec4(1.0);
    }
  `,
});

// 融合管线，合并模型和场景并着色
const pass_mix = new FullScreenQuad(
  new THREE.ShaderMaterial({
    uniforms: {
      t_model: {
        value: rt_model.texture,
      },
      t_modelDepth: {
        value: rt_model.depthTexture,
      },
      t_scene: {
        value: rt_scene.texture,
      },
      t_sceneDepth: {
        value: rt_scene.depthTexture,
      },
      time: {
        value: 0.0,
      },
      // 故障效果强度
      faultStrength: {
        value: 1.0,
      },
      // 是否启用条纹效果
      useStripe: {
        value: true,
      },
    },
    vertexShader: /* glsl */ `
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform  sampler2D  t_model        ;
      uniform  sampler2D  t_modelDepth   ;
      uniform  sampler2D  t_scene        ;
      uniform  sampler2D  t_sceneDepth   ;
      uniform  float      time           ;
      uniform  float      faultStrength  ;
      uniform  bool       useStripe      ;

      // RGBA深度解包，具体参考 Three.js 着色器 packing
      const float UnpackDownscale = 255.0 / 256.0;
      const vec4 PackFactors = vec4(1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0);
      const vec4 UnpackFactors4 = vec4(UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a);
      float unpackRGBAToDepth(const in vec4 v) {
        return dot(v, UnpackFactors4);
      }

      // 1D 柏林噪声
      float Random(float x) {
        return 2.0 * fract(sin(x * 12.9898) * 43758.5453) - 1.0;
      }
      float CubicInterpolate(float x) {
        return 3.0 * pow(x, 2.0) - 2.0 * pow(x, 3.0);
      }
      float PerlinNoise1D(float Position) {
        float PosInt = floor(Position);
        float PosFloat = fract(Position);
        float v0 = Random(PosInt);
        float v1 = Random(PosInt + 1.0);
        return v1 * CubicInterpolate(PosFloat) + v0 * CubicInterpolate(1.0 - PosFloat);
      }

      // 星空环境贴图
      vec4 hash43x(vec3 p) {
        uvec3 x = uvec3(ivec3(p));
        x = 1103515245U * ((x.xyz >> 1U) ^ (x.yzx));
        uint h = 1103515245U * ((x.x ^ x.z) ^ (x.y >> 3U));
        uvec4 rz = uvec4(h, h * 16807U, h * 48271U, h * 69621U);
        return vec4((rz >> 1) & uvec4(0x7fffffffU)) / float(0x7fffffff);
      }
      vec3 stars(vec3 p, vec2 rsln) {
        vec3 col = vec3(0);
        float rad = .087 * rsln.y;
        float dens = 0.15;
        float id = 0.;
        float rz = 0.;
        float z = 1.;
  
        for(float i = 0.; i < 5.; i++) {
          p *= mat3(0.86564, -0.28535, 0.41140, 0.50033, 0.46255, -0.73193, 0.01856, 0.83942, 0.54317);
          vec3 q = abs(p);
          vec3 p2 = p / max(q.x, max(q.y, q.z));
          p2 *= rad;
          vec3 ip = floor(p2 + 1e-5);
          vec3 fp = fract(p2 + 1e-5);
          vec4 rand = hash43x(ip * 283.1);
          vec3 q2 = abs(p2);
          vec3 pl = 1.0 - step(max(q2.x, max(q2.y, q2.z)), q2);
          vec3 pp = fp - ((rand.xyz - 0.5) * .6 + 0.5) * pl;
          float pr = length(ip) - rad;
          if(rand.w > (dens - dens * pr * 0.035))
            pp += 1e6;
  
          float d = dot(pp, pp);
          d /= pow(fract(rand.w * 172.1), 32.) + .25;
          float bri = dot(rand.xyz * (1. - pl), vec3(1.));
          id = fract(rand.w * 101.);
          col += bri * z * .00009 / pow(d + 0.025, 3.0) * (mix(vec3(1.0, 0.45, 0.1), vec3(0.75, 0.85, 1.), id) * 0.6 + 0.4);
  
          rad = floor(rad * 1.08);
          dens *= 1.45;
          z *= 0.6;
          p = p.yxz;
        }
  
        return col;
      }

      void main() {
        ivec2 texelCoord = ivec2(gl_FragCoord.xy);
        ivec2 texelCoord2 = texelCoord + ivec2(
          int(
            // 噪声控制效果整体效果                               故障强度控制            随机位移效果              时间轴动画
            PerlinNoise1D(gl_FragCoord.y * 0.15 * time * 0.25) * 200.0 * faultStrength * Random(gl_FragCoord.y) * (mod(time, 2.0) > 1.0 ? pow((mod(time, 2.0) - 1.5), 2.5) : 0.0 )
          ), 
          0
        );
        ivec2 texSize = textureSize(t_model, 0);

        float d_model = (texelCoord2.x >= 0 && texelCoord2.x < texSize.x) 
          ? unpackRGBAToDepth(texelFetch(t_modelDepth, texelCoord2, 0)) 
          : 1000000.0;
        float d_scene = unpackRGBAToDepth(texelFetch(t_sceneDepth, texelCoord, 0));

        // 遮罩混合
        if (d_model < d_scene) {
          // 这部分可替换为环境贴图，此处为了节省网络带宽使用着色器实现
          // fov 90 视线方向重建，视角旋转
          vec3 dir = normalize(vec3(vec2(texelCoord), 0.0) - vec3(ivec3(texSize, texSize.y)) * 0.5);
          float a = dir.x / dir.z - time * 0.1;
          float l = length(dir.xz);
          dir.x = cos(a) * l;
          dir.z = sin(a) * l;

          gl_FragColor = vec4(stars(dir, vec2(texSize) * 0.3), 1.0);
        } else {
          gl_FragColor = texelFetch(t_scene, texelCoord, 0);
        }

        // 条纹效果
        if (useStripe && mod(gl_FragCoord.y, 8.0) > 6.4) {
          gl_FragColor.rgb *= 0.93;
        }
      }
    `,
  })
);

const logoStr = `<svg viewBox="0 0 214 233" xmlns="http://www.w3.org/2000/svg" class="Header_logo__s3lE_"><path fill-rule="evenodd" fill="currentColor" d="M95.1 95.5V115L63.5 92.7 76.8 82.9 95.1 95.5ZM171.1 53.2V63.1H204.5V78.8H171.1V81.9L213.8 111.5V130.3H214.4V233.6H59.4L44.1 225.8V186.3L35.2 189.7V171.5H30V193.6L39.8 190V212.2L1.4 226.3V204.1L12.1 200.2V171.5H3.7V155.8H12.1V136H30V155.8H39.8V168.7L44.1 167V142.1H62V160.2L66.3 158.5V130.8H84.2V151.7L106.7 143.1V197.1L88.8 204.6V169.2L84.2 171V206L66.3 213.5V177.8L62 179.5V217.3H111.1V130.3H151.5V101.1L109.8 130.5H84.2L48.5 105.2 61.8 95.4 97 119.6 151.5 81.9V78.8H118V63.1H151.5V53.2H107.9V57.1L89.8 69.8 110.8 83.5V102.1L76.8 78.8 45.6 100.5 45.6 102.9 4.7 111.7V106.4L38.9 47.6H45.4L59.8 28.3H79.1L72.3 37.5H151.5V27.7H171.1V37.5H214.6V53.2H171.1ZM53.4 62.8 47.1 71.2H42.6L33.4 89 41.6 87V84.8L63.4 69.6 53.4 62.8ZM64.3 53.2 76.1 60.8 87.1 53.2H64.3ZM171.1 101.1V130.3H212.6L171.1 101.1ZM186 208V212.4H188.7V201.2H186V205.5H181.8V201.2H179.1V212.4H181.8V208H186ZM203.2 210.2C202 210.2 201.2 209.4 200.9 208.5L198.3 209.2C199.1 211.3 200.7 212.6 203 212.6 205.6 212.6 207.4 211.1 207.4 209.1 207.4 207.2 205.7 206.2 204 205.6 202.6 205.1 201.5 204.9 201.5 204.1 201.5 203.7 202 203.3 202.8 203.3 203.6 203.3 204.4 203.8 204.7 204.7L207.3 204C206.8 202.3 205.1 201 202.9 201 200.5 201 198.8 202.6 198.8 204.3 198.8 206.3 200.3 207 201.7 207.5 203.2 208.1 204.6 208.3 204.6 209.2 204.6 209.8 204.1 210.2 203.2 210.2ZM195.5 228.2H201.3C205.1 228.2 208.1 225.6 208.1 221.6 208.1 217.7 205.1 215 201.3 215H195.5V228.2ZM198.7 203.7V201.2H189.3V203.7H192.6V212.4H195.3V203.7H198.7ZM185.1 228.2H194.6V225.2H188.3V215H185.1V228.2ZM173.5 228.2H183.3V225.2H176.7V222.9H181.8V220.1H176.7V217.9H183.2V215H173.5V228.2ZM168.3 228.2H171.5V215H168.3V228.2ZM157.7 228.2H160.9V223.4H165.7V220.5H160.9V217.9H167.1V215H157.7V228.2ZM144 228.2H149.8C153.6 228.2 156.6 225.6 156.6 221.6 156.6 217.7 153.6 215 149.8 215H144V228.2ZM130.1 228.2H133.3V225.3C133.3 222.4 133.3 220.3 133.3 220.3H133.3C133.3 220.3 135.1 222.8 136.3 224.5L139 228.2H142V215H138.8V218C138.8 220.4 138.9 222.7 138.8 222.7H138.8C138.8 222.7 136.8 219.9 135.9 218.7L133.1 215H130.1V228.2ZM118.5 228.2H128.2V225.2H121.7V222.9H126.7V220.1H121.7V217.9H128.1V215H118.5V228.2ZM125.7 201.2H123.1L118.7 212.4H121.6L122.2 210.6H126.6L127.3 212.4H130.2L125.7 201.2ZM139 205C139 202.7 137.3 201.2 134.5 201.2H130.3V212.4H133V208.7H134.4L136.4 212.4H139.4L137 208.2C138.2 207.6 139 206.5 139 205ZM150.5 201.2H147.2L144.5 203.9C143.4 205 143.1 205.4 143 205.4H143C143 205.4 143.1 204.9 143.1 203V201.2H140.4V212.4H143.1V208.7L144 207.7 147.4 212.4H150.5L145.8 206 150.5 201.2ZM161.3 201.2H158.6V203.8C158.6 205.8 158.7 207.8 158.6 207.8H158.6C158.6 207.8 156.9 205.3 156.2 204.4L153.8 201.2H151.3V212.4H154V209.9C154 207.5 153.9 205.7 154 205.7H154C154 205.7 155.5 207.9 156.5 209.3L158.8 212.4H161.3V201.2ZM165.7 201.2H163V212.4H165.7V201.2ZM166.6 206.8C166.6 210.1 169.2 212.6 172.4 212.6 173.5 212.6 174.8 212.2 175.4 211.5H175.4C175.4 211.5 175.4 211.6 175.4 212.4H177.7V206H172.5V208.2H175.4V208.2C175.1 209 174.3 210 172.5 210 170.7 210 169.4 208.7 169.4 206.8 169.4 204.9 170.5 203.6 172.4 203.6 173.3 203.6 174.2 204 174.7 204.7L177.5 203.9C176.5 202.1 174.6 201 172.4 201 169.2 201 166.6 203.4 166.6 206.8ZM134.8 206.4H133V203.7H134.8C135.8 203.7 136.2 204.4 136.2 205 136.2 205.6 135.8 206.4 134.8 206.4ZM123.9 206.1C124.1 205.5 124.4 204.5 124.4 204.5H124.4C124.4 204.5 124.7 205.5 125 206.1L125.8 208.3H123.1L123.9 206.1ZM153.3 221.6C153.3 223.9 151.7 225.2 149.8 225.2H147.2V217.9H149.8C151.7 217.9 153.3 219.4 153.3 221.6ZM204.8 221.6C204.8 223.9 203.2 225.2 201.3 225.2H198.7V217.9H201.3C203.2 217.9 204.8 219.4 204.8 221.6ZM88.4 19.9C87.6 19 86 17.6 84.6 16.7L86.7 14.9C88.1 15.7 89.9 16.9 90.7 17.9L88.4 19.9ZM95.3 19.9C95.3 21.5 95 22.4 94.1 22.9 93.1 23.4 91.8 23.5 90.1 23.5 90 22.6 89.6 21.1 89.1 20.3A45.2 45.2 0 0091.4 20.3C91.7 20.3 91.8 20.2 91.8 19.9V14.6H83.4C83 17.9 81.9 21.3 79.2 23.6 78.7 22.9 77.3 21.7 76.6 21.3 78.8 19.5 79.7 17 80 14.6H77.1V11.5H80.2V4.2H85C85.3 3.3 85.6 2.3 85.8 1.5L90 1.8C89.6 2.7 89.1 3.5 88.6 4.2H95.3V11.5H98.2V14.6H95.3V19.9ZM83.6 7.2V11.5H87.8C87.1 10.7 85.8 9.7 84.8 8.9L86.8 7.2H83.6ZM91.8 7.2H87.1C88.2 8 89.6 9.1 90.3 9.9L88.4 11.5H91.8V7.2ZM65.5 10.7H75.5S75.4 11.7 75.4 12.1C75 18.3 74.5 20.9 73.5 22 72.7 22.8 71.9 23.1 70.7 23.2 69.7 23.3 68.2 23.3 66.7 23.2 66.6 22.3 66.1 20.9 65.4 20A48.4 48.4 0 0069.4 20.1C69.8 20.1 70.2 20.1 70.5 19.8 71.1 19.4 71.5 17.5 71.8 13.9H65C64.2 17.7 62.5 21.2 58.4 23.6 57.9 22.7 56.9 21.5 56 20.9 61.3 17.9 61.7 13.1 61.9 8.4H56.3V5.1H65.8C65.5 4.3 65 3.3 64.6 2.4L67.9 1.2C68 0 69.2 3.6 69.6 4.5L68 5.1H77.4V8.4H65.6A83.2 83.2 0 0165.5 10.7ZM50.8 21.7H41.2V23.2H37.8V2.9H54.4V23.2H50.8V21.7ZM50.8 6.3H41.2V10.5H50.8V6.3ZM50.8 13.8H41.2V18.3H50.8V13.8ZM34.1 22.9C33.1 23.4 31.7 23.5 29.8 23.5 29.7 22.6 29.1 21.1 28.7 20.3 29.8 20.3 31.2 20.3 31.5 20.3 32 20.3 32.1 20.2 32.1 19.8V16.3H28C27.5 19 26.4 21.8 24.1 23.6 23.6 23 22.2 21.9 21.5 21.5 24.9 18.7 25.2 14.3 25.2 10.9V2.5H35.4V19.8C35.4 21.5 35.1 22.4 34.1 22.9ZM32.1 5.6H28.5V7.9H32.1V5.6ZM32.1 10.9H28.5C28.5 11.7 28.4 12.5 28.4 13.3H32.1V10.9ZM18.3 19.1H15.2V2.8H23.3V17.2H18.3V19.1ZM20.2 5.8H18.3V8.4H20.2V5.8ZM20.2 14.1V11.4H18.3V14.1H20.2ZM43.1 27.7 16.8 77.3H4.7V61.4L23.5 27.7H43.1ZM47.5 121.8 4.6 130.5V115.5L47.5 106.8V121.8Z"></path></svg>`;
const modelUrl = "https://cdn.jsdelivr.net/gh/ylfq/ylfq.github.io/model/Walking.fbx";

const canvas = document.createElement("canvas");
canvas.style.width = "100vw !important";
canvas.style.height = "100vh !important";
document.body.appendChild(canvas);

const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
renderer.setClearColor(setting.baseClearColor, setting.baseClearAlpha);

const scene = new THREE.Scene();
const ground = new THREE.Points(
  new THREE.PlaneGeometry(2000, 1000, 45, 40).rotateX(-Math.PI / 2),
  new THREE.ShaderMaterial({
    uniforms: {
      size: {
        value: 5.0,
      },
      color: {
        value: new THREE.Color(0xaaaaaa),
      },
    },
    vertexShader: /* glsl */ `
      uniform float size;
      
      varying float z;

      void main() {
        vec4 mvPos = modelViewMatrix * vec4(position, 1.0);

        z = mvPos.z; 

        gl_PointSize = 300.0 / -mvPos.z * size;
        gl_Position = projectionMatrix * mvPos;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 color;

      varying float z;

      void main() {
        // 远处渐隐
        gl_FragColor = vec4(color, max(0.0, 0.4 + z * 0.0008));
      }
    `,
    transparent: true,
  })
);
ground.position.set(0, -120, 0);
// 给地面套一个组，方便计算位移
const group = new THREE.Group();
group.rotation.x = -0.35;
scene.add(group.add(ground));

const loader_fbx = new FBXLoader();
const loader_svg = new SVGLoader();

const logo = new THREE.Mesh(
  new THREE.ShapeGeometry(loader_svg.parse(logoStr).paths[0].toShapes(true)).center(),
  new THREE.ShaderMaterial({
    uniforms: {
      c_0: {
        value: new THREE.Color(0xf8f22d),
      },
    },
    vertexShader: /* glsl */ `
      void main() {
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 c_0;

      void main() {
        if (length(fract(gl_FragCoord * 0.07)) < 0.9) {
          gl_FragColor = vec4(c_0 * 0.9, 1.0);
        } else {
          gl_FragColor = vec4(c_0, 1.0);
        }
        
      }
    `,
    side: THREE.DoubleSide,
  })
);
logo.position.set(0, 0, 78);
logo.scale.set(0.15, -0.15, 1);
scene.add(logo);

const model = await loader_fbx.loadAsync(modelUrl);
model.traverse((obj) => {
  if (obj instanceof THREE.Mesh) {
    obj.material = model_mat;
  }
});
const mixer = new THREE.AnimationMixer(model);
const action = mixer.clipAction(model.animations[0]);
action.setLoop(THREE.LoopRepeat);
action.play();

const camera = new THREE.PerspectiveCamera(90, 1, 0.1, 1000);
camera.position.set(0, 0, 140);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const timer = new THREE.Timer();

const tick = (delta, elapsed) => {
  controls.update(delta);

  // 更新动画并限制模型不进行移动
  mixer.update(delta * 0.9);
  model.children[0].position.set(0, 0, 0);

  // 地面移动
  ground.position.z = (elapsed * -50) % 25;

  // 材质时间更新
  pass_mix.material.uniforms.time.value = elapsed;
};

const render = () => {
  renderer.setRenderTarget(rt_model);
  renderer.clearDepth();
  renderer.setClearColor(0x000000, 1);
  renderer.render(model, camera);

  renderer.setRenderTarget(rt_scene);
  renderer.clearDepth();
  renderer.setClearColor(setting.baseClearColor, setting.baseClearAlpha);
  renderer.render(scene, camera);

  renderer.setRenderTarget(null);
  renderer.clearDepth();
  pass_mix.render(renderer);
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
  get faultStrength() {
    return pass_mix.material.uniforms.faultStrength.value;
  },
  set faultStrength(value) {
    pass_mix.material.uniforms.faultStrength.value = value;
  },

  get useStripe() {
    return pass_mix.material.uniforms.useStripe.value;
  },
  set useStripe(value) {
    pass_mix.material.uniforms.useStripe.value = value;
  },

  get c_0() {
    return `#${logo.material.uniforms.c_0.value.getHexString()}`;
  },
  set c_0(value) {
    logo.material.uniforms.c_0.value.set(value);
  },

  get c_p() {
    return `#${ground.material.uniforms.color.value.getHexString()}`;
  },
  set c_p(value) {
    ground.material.uniforms.color.value.set(value);
  },

  get p_s() {
    return ground.material.uniforms.size.value;
  },
  set p_s(value) {
    ground.material.uniforms.size.value = value;
  },
};
const gui = new GUI();
gui.add(data, "faultStrength", 0, 5).step(0.001).name("故障强度");
gui.add(data, "useStripe").name("启用条纹");
gui.addColor(data, "c_0").name("logo颜色");
gui.addColor(data, "c_p").name("粒子颜色");
gui.add(data, "p_s", 1, 20, 0.001).name("粒子大小");

new ResizeObserver(() => {
  const rect = document.body.getBoundingClientRect();
  const w = rect.width;
  const h = rect.height;
  const a = w / h;
  const dpr = window.devicePixelRatio * 1.25;

  renderer.setSize(w, h, false);
  renderer.setPixelRatio(dpr);

  rt_model.setSize(w * dpr, h * dpr);
  rt_scene.setSize(w * dpr, h * dpr);

  camera.aspect = a;
  camera.updateProjectionMatrix();
}).observe(document.body);

ani();
