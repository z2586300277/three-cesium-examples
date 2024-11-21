import * as Cesium from "cesium";

let viewer;
let tileset;
let rainEffect;
/**
 * 初始化viewer
 */
const initViewer = () => {
  const DOM = document.getElementById("box");
  viewer = new Cesium.Viewer(DOM, {
    animation: false,//是否创建动画小器件，左下角仪表    
    baseLayerPicker: false,//是否显示图层选择器，右上角图层选择按钮
    baseLayer: Cesium.ImageryLayer.fromProviderAsync(Cesium.ArcGisMapServerImageryProvider.fromUrl('https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer')),
    fullscreenButton: false,//是否显示全屏按钮，右下角全屏选择按钮
    timeline: false,//是否显示时间轴    
    infoBox: false,//是否显示信息框   
  });
  initScene();
  addMaterial();
  let interval;
  interval = setInterval(() => {
    if (tileset.customShader.uniforms.u_rainAlpha.value >= 0.5) {
      window.clearInterval(interval);
      return false;
    }
    tileset.customShader.uniforms.u_rainAlpha.value += 0.05;
  }, 20);
};
const addMaterial = () => {
  let appearance = new Cesium.MaterialAppearance({
    material: new Cesium.Material({
      fabric: {
        type: "MyImage",
        uniforms: {
          image: "/files/images/rain.png",
        },
      },
    }),
    fragmentShaderSource: ` 
        #define MAX_RADIUS 2
        #define DOUBLE_HASH 0
        #define HASHSCALE1 .1031
        #define HASHSCALE3 vec3(.1031, .1030, .0973)
        in vec2 v_st;
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
        
        void main()
        {
            float iTime = czm_frameNumber / 120.;
            float resolution =20.;
            vec2 uv = v_st * resolution;
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
        
                    float t = fract(0.3*iTime + hash12(hsh));
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
        
            float intensity = mix(0.01, 0.15, smoothstep(0.1, 0.6, abs(fract(0.05*iTime + 0.5)*2.-1.)));
            vec3 n = vec3(circles, sqrt(1. - dot(circles, circles)));
            vec3 color = texture(image_0, uv/resolution - intensity*n.xy).rgb + 5.*pow(clamp(dot(n, normalize(vec3(1., 0.7, 0.5))), 0., 1.), 6.);
            out_FragColor = vec4(color, 0.5);
        }
        `,
  });
  var positions = Cesium.Cartesian3.fromDegreesArray([
    121.48033090358801, 29.790483294870796, 121.4778771950879,
    29.79083578574342, 121.47877939338282, 29.79193540741442, 121.4804061804202,
    29.791480141327728,
  ]);
  viewer.scene.primitives.add(
    new Cesium.Primitive({
      geometryInstances: new Cesium.GeometryInstance({
        geometry: Cesium.PolygonGeometry.fromPositions({
          positions: positions,
          height: 20,
        }),
      }),
      appearance: appearance,
    })
  );
};
const initScene = async () => {
  tileset = await Cesium.Cesium3DTileset.fromUrl(
    "http://data.mars3d.cn/3dtiles/max-fsdzm/tileset.json",
    {
      customShader: new Cesium.CustomShader({
        uniforms: {
          u_lightColor: {
            type: Cesium.UniformType.VEC3,
            value: new Cesium.Cartesian3(1, 1, 1),
          },
          u_rainAlpha: {
            type: Cesium.UniformType.FLOAT,
            value: 0,
          },
        },
        fragmentShaderText: `
              #define MAX_RADIUS 2
              // Set to 1 to hash twice. Slower, but less patterns.
              #define DOUBLE_HASH 0
              // Hash functions shamefully stolen from:
              // https://www.shadertoy.com/view/4djSRW
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
                  material.diffuse = mix(material.diffuse, vec3((n * vec3(1.2)).r) , u_rainAlpha * smoothstep(0., .5, dot(positionWC.xyz, normalWC)));
                  material.diffuse *= min(max(0.0, dot(normalEC, czm_sunDirectionEC) * 1.0) + u_lightColor, 1.0);


              }
              `,
      }),
    }
  );
  viewer.flyTo(tileset);
  viewer.scene.primitives.add(tileset);

  rainEffect = new Cesium.PostProcessStage({
    fragmentShader: `
        uniform sampler2D colorTexture;
        in vec2 v_textureCoordinates;
        float hash(float x){
            return fract(sin(x*23.3)*13.13);
        }
        void main(){
            float time = czm_frameNumber / 120.0;
            vec2 resolution = czm_viewport.zw;
            vec2 uv=(gl_FragCoord.xy*2.-resolution.xy)/min(resolution.x,resolution.y);
            vec3 c=vec3(.6,.7,.8);
            float a=-.4;
            float si=sin(a),co=cos(a);
            uv*=mat2(co,-si,si,co);
            uv*=length(uv+vec2(0,8.9))*.3+1.;
            float v=1.-sin(hash(floor(uv.x*100.))*2.);
            float b=clamp(abs(sin(20.*time*v+uv.y*(5./(2.+v))))-.95,0.,1.)*20.;
            c*=v*b;
            out_FragColor = mix(texture(colorTexture, v_textureCoordinates), vec4(c, 1), 0.5);
        }`,
  });
  viewer.scene.postProcessStages.add(rainEffect);
};
initViewer();
