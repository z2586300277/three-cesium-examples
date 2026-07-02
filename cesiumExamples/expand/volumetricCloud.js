import * as Cesium from "cesium";

const box = document.getElementById("box");

let viewer = null;
let cloudsStage = null;

const state = {
    time: 0,
    lastFrameTime: performance.now(),
    windDir: new Cesium.Cartesian3(1, 0, 0),
    sunColor: new Cesium.Cartesian3(1, 1, 1),
    ambientTop: new Cesium.Cartesian3(0, 0, 0),
    ambientBot: new Cesium.Cartesian3(0, 0, 0),
};

const cloudProfile = {
    maxDistance: 6000000.0,
    cloudBase: 15000,
    cloudThickness: 10000,
    cloudCover: 0.55,
    density: 4.0,
    noiseScale: 1.2,
    detailStrength: 2.0,
    highCloudBase: 40000,
    highCloudThickness: 150,
    highCloudCover: 0.35,
    highDensity: 0.7,
    highNoiseScale: 0.7,
    weatherScale: 2.0,
    warpStrength: 4.0,
    windSpeed: 150.0,
    windAngle: 130,
    exposure: 2.0,
    brightness: 3.0,
    lightAbsorption: 1.2,
    shadowIntensity: 0.8,
    sunLightColor: [255, 248, 240],
    ambientTop: [60, 110, 190],
    ambientBot: [120, 140, 160],
    silverLining: 8.0,
    sunGlare: 10.0,
    phaseG1: 0.85,
    phaseG2: -0.2,
    phaseWeight: 0.8,
    fogBlend: 0.8,
    aerialPerspective: 0.6,
};

const QUALITY_PRESETS = {
    Low: { steps: 32, shadowSteps: 4, detail: false },
    Medium: { steps: 56, shadowSteps: 6, detail: true },
    High: { steps: 96, shadowSteps: 10, detail: true },
    Ultra: { steps: 140, shadowSteps: 16, detail: true },
};
const CLOUD_QUALITY = QUALITY_PRESETS.Low;

function toNormalizedColor(rgb) {
    return new Cesium.Cartesian3(rgb[0] / 255, rgb[1] / 255, rgb[2] / 255);
}

function updateCloudRuntime(deltaSeconds) {
    state.time += deltaSeconds * cloudProfile.windSpeed * 0.2;

    const rad = Cesium.Math.toRadians(cloudProfile.windAngle);
    state.windDir = new Cesium.Cartesian3(Math.cos(rad), Math.sin(rad), 0.0);
    state.sunColor = toNormalizedColor(cloudProfile.sunLightColor);
    state.ambientTop = toNormalizedColor(cloudProfile.ambientTop);
    state.ambientBot = toNormalizedColor(cloudProfile.ambientBot);
}

function injectStyles() {
    const style = document.createElement("style");
    style.textContent = `
    html,
    body,
    #box {
      background: #000;
      overflow: hidden;
    }

    #box {
      position: relative;
    }

    .volumetric-cloud-loading {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.85);
      color: #fff;
      padding: 20px 40px;
      border-radius: 4px;
      z-index: 10000;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.3s;
      font-family: Roboto, Arial, sans-serif;
      font-size: 14px;
      letter-spacing: 1px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
  `;
    document.head.appendChild(style);
}

function createLoadingElement() {
    const loading = document.createElement("div");
    loading.id = "volumetricCloudLoading";
    loading.className = "volumetric-cloud-loading";
    loading.textContent = "正在渲染...";
    box.appendChild(loading);
}

function initViewer() {
    injectStyles();
    createLoadingElement();

    viewer = new Cesium.Viewer(box, {
        animation: false,
        baseLayerPicker: false,
        baseLayer: Cesium.ImageryLayer.fromProviderAsync(
            Cesium.ArcGisMapServerImageryProvider.fromUrl(GLOBAL_CONFIG.getLayerUrl())
        ),
        fullscreenButton: false,
        timeline: false,
        infoBox: false,
        geocoder: false,
        homeButton: false,
        sceneModePicker: false,
        navigationHelpButton: false,
        selectionIndicator: false,
    });

    viewer._cesiumWidget._creditContainer.style.display = "none";
    viewer.resolutionScale = window.devicePixelRatio;
    viewer.scene.globe.enableLighting = true;
    viewer.scene.globe.depthTestAgainstTerrain = true;
    viewer.scene.highDynamicRange = true;

    const now = new Date();
    now.setUTCHours(4, 0, 0, 0);
    viewer.clock.currentTime = Cesium.JulianDate.fromDate(now);

    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(116.39, 39.9, 2000.0),
        orientation: {
            heading: 0,
            pitch: Cesium.Math.toRadians(0),
            roll: 0,
        },
        duration: 2,
    });

    updateCloudRuntime(0);
    mountCloudPass();

    viewer.clock.onTick.addEventListener(() => {
        const nowTime = performance.now();
        const dt = (nowTime - state.lastFrameTime) / 1000.0;
        state.lastFrameTime = nowTime;

        updateCloudRuntime(dt);
        viewer.scene.requestRender();
    });
}

function mountCloudPass() {
    const loader = document.getElementById("volumetricCloudLoading");
    loader.style.opacity = 1;

    cloudsStage = createVolumetricCloudStage();
    viewer.scene.postProcessStages.add(cloudsStage);

    setTimeout(() => {
        loader.style.opacity = 0;
    }, 600);
}

function createVolumetricCloudStage() {
    const q = CLOUD_QUALITY;
    const defines = `
    #define STEPS ${q.steps}
    #define SHADOW_STEPS ${q.shadowSteps}
    #define USE_DETAIL ${q.detail ? 1 : 0}
  `;

    const fragmentShader = `
    precision highp float;
    ${defines}

    in vec2 v_textureCoordinates;
    uniform sampler2D colorTexture;
    uniform sampler2D depthTexture;

    uniform float u_time;
    uniform vec3 u_windDir;
    uniform float u_cloudBase;
    uniform float u_cloudTop;
    uniform float u_cloudCover;
    uniform float u_density;
    uniform float u_highBase;
    uniform float u_highTop;
    uniform float u_highCover;
    uniform float u_highDensity;
    uniform float u_brightness;
    uniform float u_exposure;
    uniform float u_silverLining;
    uniform float u_phaseG1;
    uniform float u_phaseG2;
    uniform float u_phaseWeight;
    uniform float u_absorption;
    uniform float u_shadowIntensity;
    uniform float u_maxDist;
    uniform float u_fogBlend;
    uniform float u_aerialPerspective;
    uniform float u_sunGlare;
    uniform float u_noiseScale;
    uniform float u_highNoiseScale;
    uniform float u_detailStrength;
    uniform float u_weatherScale;
    uniform float u_warpStrength;

    uniform vec3 u_sunColor;
    uniform vec3 u_ambientTop;
    uniform vec3 u_ambientBot;

    const float EARTH_RADIUS = 6378137.0;

    vec2 raySphere(vec3 ro, vec3 rd, float r) {
      float b = dot(ro, rd);
      float c = dot(ro, ro) - r * r;
      float h = b*b - c;
      if(h < 0.0) return vec2(-1.0);
      h = sqrt(h);
      return vec2(-b - h, -b + h);
    }

    float hash(vec3 p) {
      p = fract(p * 0.3183099 + .1);
      p *= 17.0;
      return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
    }

    float noise(vec3 x) {
      vec3 p = floor(x);
      vec3 f = fract(x);
      f = f * f * (3.0 - 2.0 * f);
      return mix(mix(mix(hash(p + vec3(0,0,0)), hash(p + vec3(1,0,0)), f.x),
                     mix(hash(p + vec3(0,1,0)), hash(p + vec3(1,1,0)), f.x), f.y),
                 mix(mix(hash(p + vec3(0,0,1)), hash(p + vec3(1,0,1)), f.x),
                     mix(hash(p + vec3(0,1,1)), hash(p + vec3(1,1,1)), f.x), f.y), f.z);
    }

    float fbm(vec3 p) {
      float f = 0.0;
      float amp = 0.5;
      float freq = 1.0;
      for(int i=0; i<5; i++) {
        f += amp * noise(p * freq);
        freq *= 2.02;
        amp *= 0.5;
      }
      return f;
    }

    float remap(float value, float min1, float max1, float min2, float max2) {
      return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
    }

    float getCloudDensity(vec3 p) {
      float dist = length(p);
      float height = dist - EARTH_RADIUS;
      float totalDens = 0.0;

      if (height >= u_cloudBase && height <= u_cloudTop) {
        float h_norm = (height - u_cloudBase) / (u_cloudTop - u_cloudBase);
        vec3 p_weather = (p * 0.000005) * u_weatherScale;
        p_weather -= u_windDir * (u_time * 0.001);

        vec3 warp = vec3(noise(p_weather * 2.0 + vec3(5.2)), noise(p_weather * 2.0 + vec3(1.3)), 0.0);
        p_weather += warp * 0.2 * u_warpStrength;

        float weatherVal = noise(p_weather);
        float localCover = smoothstep(1.0 - u_cloudCover, 1.0 - u_cloudCover + 0.4, weatherVal);

        if (localCover > 0.05) {
          vec3 p_shape = (p * 0.00015) * u_noiseScale;
          p_shape -= u_windDir * (u_time * 0.005);

          float baseNoise = fbm(p_shape);
          float v_distort = (noise(p_shape * 0.5) - 0.5) * 0.3;
          float h_distorted = h_norm + v_distort;
          float verticalProfile = smoothstep(-0.1, 0.2, h_distorted) * smoothstep(1.2, 0.6, h_distorted);
          float shapedNoise = baseNoise * verticalProfile;
          float dens = remap(shapedNoise, 1.0 - localCover, 1.0, 0.0, 1.0);

          #if USE_DETAIL == 1
          if (dens > 0.0) {
            float detail = noise(p_shape * 8.0 + vec3(0, u_time*0.2, 0));
            dens -= detail * u_detailStrength * (1.0 - dens) * 0.5;
          }
          #endif

          totalDens += clamp(dens * u_density, 0.0, 1.0);
        }
      }

      if (height >= u_highBase && height <= u_highTop) {
        float h_norm = (height - u_highBase) / (u_highTop - u_highBase);
        vec3 p_high_macro = (p * 0.00001) * u_weatherScale;
        float highMacro = noise(p_high_macro + vec3(100.0));
        float highLocalCover = u_highCover * smoothstep(0.4, 0.7, highMacro);

        if (highLocalCover > 0.01) {
          vec3 p_high = (p * 0.00005 + vec3(4000.0)) * u_highNoiseScale;
          p_high -= u_windDir * (u_time * 0.015);

          vec3 warp = vec3(noise(p_high * 0.4), noise(p_high * 0.4 + 4.0), 0.0);
          p_high += warp * 0.8;
          p_high *= vec3(8.0, 1.0, 1.0);

          float highNoise = fbm(p_high);
          float dens = remap(highNoise, 1.0 - highLocalCover, 1.0, 0.0, 1.0);
          dens *= smoothstep(0.0, 0.25, h_norm) * smoothstep(1.0, 0.25, h_norm);
          totalDens += clamp(dens * u_highDensity, 0.0, 1.0);
        }
      }

      return totalDens;
    }

    float hg(float g, float costh) {
      return (1.0 - g*g) / (4.0 * 3.14159 * pow(1.0 + g*g - 2.0*g*costh, 1.5));
    }

    float phase(float costh) {
      return mix(hg(u_phaseG1, costh), hg(u_phaseG2, costh), u_phaseWeight);
    }

    float lightmarch(vec3 p, vec3 lightDir, float cosAngle) {
      vec3 p_light = p;
      float totalD = 0.0;
      float range = max(u_cloudTop, u_highTop) - min(u_cloudBase, u_highBase);
      float stepLen = range / 3.0;

      for(int i=0; i<3; i++) {
        p_light += lightDir * stepLen;
        float h = length(p_light) - EARTH_RADIUS;
        if ((h > u_cloudBase && h < u_cloudTop) || (h > u_highBase && h < u_highTop)) {
          float d = getCloudDensity(p_light);
          totalD += d * stepLen;
        }
      }

      float beer = exp(-totalD * u_absorption * 0.003);
      float powder = 1.0 - exp(-totalD * u_absorption * 0.015);
      float ph = phase(cosAngle);
      float radiance = beer * powder * ph * u_silverLining + (beer * 0.25);

      return radiance;
    }

    float dither(vec2 uv) {
      return fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453);
    }

    float calculateShadow(vec3 groundPos, vec3 lightDir, float distFromCam) {
      if (distFromCam > u_maxDist * 0.6) return 1.0;

      float r_top = EARTH_RADIUS + max(u_cloudTop, u_highTop);
      float r_base = EARTH_RADIUS + min(u_cloudBase, u_highBase);
      vec2 t_base = raySphere(groundPos, lightDir, r_base);
      vec2 t_top = raySphere(groundPos, lightDir, r_top);

      if (t_top.y <= 0.0) return 1.0;

      float t_start = (length(groundPos) < r_base) ? max(0.0, t_base.y) : 0.0;
      float t_end = t_top.y;
      if (t_end <= t_start) return 1.0;

      float shadowStepLen = (t_end - t_start) / float(SHADOW_STEPS);
      float totalD = 0.0;
      float dist = t_start + shadowStepLen * dither(gl_FragCoord.xy);

      for(int i=0; i<SHADOW_STEPS; i++) {
        vec3 p = groundPos + lightDir * dist;
        float d = getCloudDensity(p);
        if(d > 0.0) totalD += d * shadowStepLen;
        dist += shadowStepLen;
      }

      return exp(-totalD * u_absorption * 0.005);
    }

    vec3 ACESFilm(vec3 x) {
      float a = 2.51, b = 0.03, c = 2.43, d = 0.59, e = 0.14;
      return clamp((x*(a*x+b))/(x*(c*x+d)+e), 0.0, 1.0);
    }

    void main() {
      vec4 color = texture(colorTexture, v_textureCoordinates);
      vec4 depthRaw = texture(depthTexture, v_textureCoordinates);
      float depth = czm_unpackDepth(depthRaw);

      bool isSky = (depth >= 1.0 || depth <= 0.0);
      if (depth == 0.0) depth = 1.0;

      vec4 posEC = czm_windowToEyeCoordinates(gl_FragCoord.xy, depth);
      vec4 worldCoord = czm_inverseView * posEC;
      vec3 posWC = worldCoord.xyz / worldCoord.w;
      vec3 camPos = czm_viewerPositionWC;
      vec3 viewDir = normalize(posWC - camPos);
      vec3 sunDir = normalize(czm_sunPositionWC);

      float sceneDist = length(posWC - camPos);
      if(isSky) sceneDist = u_maxDist;

      if (!isSky && u_shadowIntensity > 0.01) {
        float shadow = calculateShadow(posWC, sunDir, sceneDist);
        vec3 shadowTone = vec3(0.55, 0.65, 0.75);
        color.rgb = mix(color.rgb * shadowTone, color.rgb, shadow);
      }

      float r_total_base = EARTH_RADIUS + min(u_cloudBase, u_highBase);
      float r_total_top = EARTH_RADIUS + max(u_cloudTop, u_highTop);

      vec2 t_base = raySphere(camPos, viewDir, r_total_base);
      vec2 t_top = raySphere(camPos, viewDir, r_total_top);

      float tmin = 0.0, tmax = 0.0;
      float camHeight = length(camPos);

      if (camHeight > r_total_top) {
        if (t_top.x < 0.0) {
          out_FragColor = color;
          return;
        }
        tmin = t_top.x;
        tmax = (t_base.x > 0.0) ? t_base.x : t_top.y;
      } else if (camHeight < r_total_base) {
        if (t_base.y < 0.0 || t_top.y < 0.0) {
          out_FragColor = color;
          return;
        }
        tmin = t_base.y;
        tmax = t_top.y;
      } else {
        tmin = 0.0;
        tmax = (t_base.x > 0.0) ? t_base.x : t_top.y;
      }

      tmax = min(tmax, sceneDist);
      tmax = min(tmax, u_maxDist);

      if (tmax <= tmin + 1.0) {
        out_FragColor = color;
        return;
      }

      float rayLen = tmax - tmin;
      float stepLen = rayLen / float(STEPS);
      float dist = tmin + stepLen * dither(gl_FragCoord.xy);

      vec4 cloudColor = vec4(0.0);
      float cosAngle = dot(viewDir, sunDir);

      for(int i=0; i<STEPS; i++) {
        if(dist >= tmax || cloudColor.a >= 0.99) break;

        vec3 p = camPos + viewDir * dist;
        float dens = getCloudDensity(p);

        if(dens > 0.001) {
          float light = lightmarch(p, sunDir, cosAngle);
          float h_norm = (length(p) - r_total_base) / (r_total_top - r_total_base);
          float ambientOcc = clamp(h_norm * 0.8 + 0.1 - dens * 0.2, 0.0, 1.0);
          vec3 ambient = mix(u_ambientBot, u_ambientTop, ambientOcc);
          vec3 scattering = (u_sunColor * light + ambient * 0.3) * u_brightness;
          float alpha = 1.0 - exp(-dens * stepLen * u_absorption * 0.05);

          cloudColor.rgb += scattering * alpha * (1.0 - cloudColor.a);
          cloudColor.a += alpha * (1.0 - cloudColor.a);
        }

        dist += stepLen;
      }

      float distFade = smoothstep(u_maxDist * 0.8, u_maxDist, tmax);
      vec3 up = normalize(camPos);
      float horizon = smoothstep(-0.15, 0.3, dot(viewDir, up));
      vec3 atmosColor = mix(u_ambientBot, u_ambientTop, horizon);

      float sunDot = max(dot(viewDir, sunDir), 0.0);
      float sunGlare = pow(sunDot, 32.0) * u_sunGlare;
      atmosColor += u_sunColor * sunGlare;

      cloudColor.rgb = mix(cloudColor.rgb, atmosColor, distFade * u_aerialPerspective);
      cloudColor.a *= (1.0 - distFade * u_fogBlend);

      vec3 finalColor = mix(color.rgb, cloudColor.rgb, cloudColor.a);
      finalColor *= u_exposure;
      finalColor = ACESFilm(finalColor);

      out_FragColor = vec4(finalColor, 1.0);
    }
  `;

    cloudsStage = new Cesium.PostProcessStage({
        fragmentShader,
        uniforms: {
            u_time: () => state.time,
            u_windDir: () => state.windDir,
            u_cloudBase: () => cloudProfile.cloudBase,
            u_cloudTop: () => cloudProfile.cloudBase + cloudProfile.cloudThickness,
            u_cloudCover: () => cloudProfile.cloudCover,
            u_density: () => cloudProfile.density,
            u_highBase: () => cloudProfile.highCloudBase,
            u_highTop: () => cloudProfile.highCloudBase + cloudProfile.highCloudThickness,
            u_highCover: () => cloudProfile.highCloudCover,
            u_highDensity: () => cloudProfile.highDensity,
            u_brightness: () => cloudProfile.brightness,
            u_exposure: () => cloudProfile.exposure,
            u_silverLining: () => cloudProfile.silverLining,
            u_phaseG1: () => cloudProfile.phaseG1,
            u_phaseG2: () => cloudProfile.phaseG2,
            u_phaseWeight: () => cloudProfile.phaseWeight,
            u_absorption: () => cloudProfile.lightAbsorption,
            u_shadowIntensity: () => cloudProfile.shadowIntensity,
            u_maxDist: () => cloudProfile.maxDistance,
            u_fogBlend: () => cloudProfile.fogBlend,
            u_aerialPerspective: () => cloudProfile.aerialPerspective,
            u_sunGlare: () => cloudProfile.sunGlare,
            u_noiseScale: () => cloudProfile.noiseScale,
            u_highNoiseScale: () => cloudProfile.highNoiseScale,
            u_detailStrength: () => cloudProfile.detailStrength,
            u_weatherScale: () => cloudProfile.weatherScale,
            u_warpStrength: () => cloudProfile.warpStrength,
            u_sunColor: () => state.sunColor,
            u_ambientTop: () => state.ambientTop,
            u_ambientBot: () => state.ambientBot,
        },
    });

    return cloudsStage;
}

initViewer();
