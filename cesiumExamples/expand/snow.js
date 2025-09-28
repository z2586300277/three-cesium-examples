import * as Cesium from "cesium";

let viewer;
let tileset;
let snowEffect;

const initViewer = () => {
  const DOM = document.getElementById("box");
  viewer = new Cesium.Viewer(DOM, {
    animation: false,//是否创建动画小器件，左下角仪表    

    baseLayerPicker: false,//是否显示图层选择器，右上角图层选择按钮

    baseLayer: Cesium.ImageryLayer.fromProviderAsync(Cesium.ArcGisMapServerImageryProvider.fromUrl('https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer')),

    fullscreenButton: false,//是否显示全屏按钮，右下角全屏选择按钮

    timeline: false,//是否显示时间轴    

    infoBox: false,//是否显示信息框   
  });
  initScene();
  let interval;
  interval = setInterval(() => {
    if (tileset.customShader.uniforms.u_snowAlpha.value >= 1.0) {
      window.clearInterval(interval);
      return false;
    }
    tileset.customShader.uniforms.u_snowAlpha.value += 0.01;
  }, 20);
};

const initScene = async () => {
  tileset = await Cesium.Cesium3DTileset.fromUrl(
    FILE_HOST + '3dtiles/house/tileset.json',
    {
      customShader: new Cesium.CustomShader({
        uniforms: {
          u_lightColor: {
            type: Cesium.UniformType.VEC3,
            value: new Cesium.Cartesian3(1, 1, 1),
          },
          u_snowAlpha: {
            type: Cesium.UniformType.FLOAT,
            value: 0,
          },
        },
        fragmentShaderText: `
              #define MAX_RADIUS 2
              #define DOUBLE_HASH 0
              #define HASHSCALE1 .1031
              #define HASHSCALE3 vec3(.1031, .1030, .0973)
              float hash12(vec2 p)
              {
                  vec3 p3  = fract(vec3(p.xyx) * HASHSCALE1);
                  p3 += dot(p3, p3.yzx + 19.19);
                  return fract((p3.x + p3.y) * p3.z);
              }
              vec2 hash22(vec2 p)
              {
                  vec3 p3 = fract(vec3(p.xyx) * HASHSCALE3);
                  p3 += dot(p3, p3.yzx+19.19);
                  return fract((p3.xx+p3.yz)*p3.zy);

              }
              void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material) {
                  vec3 positionEC = fsInput.attributes.positionEC;
                  vec3 positionMC = fsInput.attributes.positionMC;
                  vec2 uv = fsInput.attributes.texCoord_0 * 500.;
                  vec3 pos_dx = dFdx(positionEC);
                  vec3 pos_dy = dFdy(positionEC);
                  vec3 normalEC = normalize(cross(pos_dx, pos_dy));
                  vec4 positionWC = normalize(czm_inverseView * vec4(positionEC,1.0));
                  vec3 normalWC = normalize(czm_inverseViewRotation * normalEC);
                  float time = czm_frameNumber / 60.0;
                  vec2 p0 = floor(uv);
                  vec2 circles = vec2(0.);
                  for (int j = -MAX_RADIUS; j <= MAX_RADIUS; ++j)
                  {
                      for (int i = -MAX_RADIUS; i <= MAX_RADIUS; ++i)
                      {
                          vec2 pi = p0 + vec2(i, j);
                          #if DOUBLE_HASH
                          vec2 hsh = hash22(pi);
                          #else
                          vec2 hsh = pi;
                          #endif
                          vec2 p = pi + hash22(hsh);

                          float t = fract(0.3*time + hash12(hsh));
                          vec2 v = p - uv;
                          float d = length(v) - (float(MAX_RADIUS) + 1.)*t;

                          float h = 1e-3;
                          float d1 = d - h;
                          float d2 = d + h;
                          float p1 = sin(31.*d1) * smoothstep(-0.6, -0.3, d1) * smoothstep(0., -0.3, d1);
                          float p2 = sin(31.*d2) * smoothstep(-0.6, -0.3, d2) * smoothstep(0., -0.3, d2);
                          circles += 0.5 * normalize(v) * ((p2 - p1) / (2. * h) * (1. - t) * (1. - t));
                      }
                  }
                  circles /= float((MAX_RADIUS*2+1)*(MAX_RADIUS*2+1));
                  vec3 n = vec3(circles, sqrt(1. - dot(circles, circles)));
                  material.diffuse = mix(material.diffuse, vec3(1.0) , u_snowAlpha * smoothstep(0., .5, dot(positionWC.xyz, normalWC)));
                  material.diffuse *= min(max(0.0, dot(normalEC, czm_sunDirectionEC) * 1.0) + u_lightColor, 1.0);


              }
              `,
      }),
    }
  );
  viewer.flyTo(tileset);
  viewer.scene.primitives.add(tileset);

  snowEffect = new Cesium.PostProcessStage({
    fragmentShader: `
        precision highp float;
        uniform sampler2D colorTexture;
        uniform sampler2D depthTexture;
        in vec2 v_textureCoordinates;
        float time;
        #define HASHSCALE1 .1031
        #define HASHSCALE3 vec3(.1031, .1030, .0973)
        #define HASHSCALE4 vec3(.1031, .1030, .0973, .1099)
        float SIZE_RATE = 0.1;
        float XSPEED = 0.2;
        float YSPEED = 0.5;
        float LAYERS = 10.;
        float Hash11(float p)
        {
            vec3 p3  = fract(vec3(p) * HASHSCALE1);
            p3 += dot(p3, p3.yzx + 19.19);
            return fract((p3.x + p3.y) * p3.z); 
        }
        vec2 Hash22(vec2 p)
        {
            vec3 p3 = fract(vec3(p.xyx) * HASHSCALE3);
            p3 += dot(p3, p3.yzx+19.19);
            return fract((p3.xx+p3.yz)*p3.zy);
        }
        vec2 Rand22(vec2 co)
        {
            float x = fract(sin(dot(co.xy ,vec2(122.9898,783.233))) * 43758.5453);
            float y = fract(sin(dot(co.xy ,vec2(457.6537,537.2793))) * 37573.5913);
            return vec2(x,y);
        }
        vec3 SnowSingleLayer(vec2 uv,float layer){
            vec3 acc = vec3(0.3);
            uv = uv * (2.0+layer);
            float xOffset = uv.y * (((Hash11(layer)*2.-1.)*0.5+1.)*XSPEED);
            float yOffset = (YSPEED*time);
            uv += vec2(xOffset,yOffset);
            vec2 rgrid = Hash22(floor(uv)+(31.1759*layer));
            uv = fract(uv);
            uv -= (rgrid*2.-1.0) * 0.35;
            uv -=0.5;
            float r = length(uv);
            float circleSize = 0.08*(1.0+0.3*sin(time*SIZE_RATE));
            float val = smoothstep(circleSize,-circleSize,r);
            vec3 col = vec3(val,val,val)* rgrid.x ;
            return col;
        }

        void main()
        {
            time = czm_frameNumber / 120.0;
            vec3 col = vec3(0.3, .3, .3);
            // Normalized pixel coordinates (from 0 to 1)
            vec2 uv = gl_FragCoord.xy/czm_viewport.zw;
            uv *= vec2(czm_viewport.z/czm_viewport.w,1.0);
            vec3 acc = vec3(0,0,0);
            for (float i=0.;i<LAYERS;i++) {
                acc += SnowSingleLayer(uv,i); 
            }
            out_FragColor = mix( texture(colorTexture, v_textureCoordinates), vec4(acc,1.0) , 0.5);
        }

        `,
  });
  viewer.scene.postProcessStages.add(snowEffect);
};
initViewer();
