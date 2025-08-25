import * as Cesium from 'cesium'
import * as dat from 'dat.gui'

const box = document.getElementById('box')

const viewer = new Cesium.Viewer(box, {

    animation: false,//是否创建动画小器件，左下角仪表    

    baseLayerPicker: false,//是否显示图层选择器，右上角图层选择按钮

    baseLayer: Cesium.ImageryLayer.fromProviderAsync(Cesium.ArcGisMapServerImageryProvider.fromUrl('https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer')),

    fullscreenButton: false,//是否显示全屏按钮，右下角全屏选择按钮

    timeline: false,//是否显示时间轴    

    infoBox: false,//是否显示信息框   

})

const tileset = await Cesium.Cesium3DTileset.fromUrl('https://guangfus:663/3dtiles/whiteModel/tileset.json')

viewer.scene.primitives.add(tileset)

tileset.maximumScreenSpaceError = 1

viewer.flyTo(tileset)

const uniforms = {
    u_sweep_color: { value: Cesium.Color.fromBytes(43, 167, 255, 255), type: Cesium.UniformType.VEC3 },
    u_mix_color1: { value: Cesium.Color.fromBytes(9, 9, 14, 255), type: Cesium.UniformType.VEC3 },
    u_mix_color2: { value: Cesium.Color.fromBytes(0, 128, 255, 255), type: Cesium.UniformType.VEC3 },
    u_sweep_width: { value: 0.03, type: Cesium.UniformType.FLOAT },
    u_time: { value: 0, type: Cesium.UniformType.FLOAT }
}

const gui = new dat.GUI()
gui.addColor({ sweepColor: '#2ba7ff' }, 'sweepColor').onChange(v => {
    const hex = v.replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    uniforms.u_sweep_color.value = Cesium.Color.fromBytes(r, g, b, 255)
})

gui.addColor({ mixColor1: '#09090e' }, 'mixColor1').onChange(v => {
    const hex = v.replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    uniforms.u_mix_color1.value = Cesium.Color.fromBytes(r, g, b, 255)
})
gui.addColor({ mixColor2: '#0080ff' }, 'mixColor2').onChange(v => {
    const hex = v.replace('#', '')
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    uniforms.u_mix_color2.value = Cesium.Color.fromBytes(r, g, b, 255)
})

gui.add({ sweepWidth: 0.2 }, 'sweepWidth', 0.05, 1.0).onChange(v => {
    uniforms.u_sweep_width.value = v
})

const shader = new Cesium.CustomShader({
    vertexShaderText: `void vertexMain(VertexInput vsInput, inout czm_modelVertexOutput vsOutput) {
            v_uv = vec2(vsInput.attributes.positionMC.z / 80., vsInput.attributes.positionMC.z / 250.);
        }`,
    fragmentShaderText: `float random(vec2 st) {
            return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
        }
        
        void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material) {
            vec3 originColor = mix(u_mix_color1, u_mix_color2, v_uv.y);
            float t = fract(u_time * 2.) * 2.;
            vec2 absUv = abs(v_uv - t);
            
            vec2 st = v_uv * 15.;
            vec2 ipos = floor(st + u_time * 5.);
            float r = random(ipos) + .2;
            
            float d = clamp(distance(0., absUv.y) / u_sweep_width, 0., 1.);
            float diffuse = clamp(-dot(czm_sunDirectionEC, fsInput.attributes.normalEC), 0., .45);
            
            vec3 color = mix(u_sweep_color * r + u_sweep_color * .8, originColor, d);
            material.diffuse = color;
            material.emissive = vec3(diffuse) * (1. - d);
        }`,
    uniforms,
    varyings: { v_uv: Cesium.VaryingType.VEC2 }
})

viewer.scene.preRender.addEventListener(function(scene, time) {
    shader.setUniform("u_time", performance.now() * 0.0001);
});

tileset.customShader = shader