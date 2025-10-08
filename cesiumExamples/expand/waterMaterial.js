import * as Cesium from 'cesium'

const box = document.getElementById('box')

const viewer = new Cesium.Viewer(box, {

    animation: false,//是否创建动画小器件，左下角仪表    

    baseLayerPicker: false,//是否显示图层选择器，右上角图层选择按钮

    baseLayer: Cesium.ImageryLayer.fromProviderAsync(Cesium.ArcGisMapServerImageryProvider.fromUrl('https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer')),

    fullscreenButton: false,//是否显示全屏按钮，右下角全屏选择按钮

    timeline: false,//是否显示时间轴    

    infoBox: false,//是否显示信息框   

})

// 添加水波纹效果
const positions = [-109.080842, 45.002073, -105.91517, 45.002073 , -104.058488, 46.996596]; // 示例坐标数组
const index = 1; // 示例索引

const primitives = new Cesium.Primitive({
    geometryInstances: new Cesium.GeometryInstance({
        id: 'waterRipple' + index,
        geometry: new Cesium.PolygonGeometry({
            polygonHierarchy: new Cesium.PolygonHierarchy(Cesium.Cartesian3.fromDegreesArray(positions)),
            height: 0,
        }),
    }),
    appearance: new Cesium.EllipsoidSurfaceAppearance({
        material: new Cesium.Material({
            fabric: {
                type: "Water",
                uniforms: {
                    baseWaterColor: Cesium.Color.fromCssColorString('rgba(64,157,253,0.5)'),
                    blendColor: Cesium.Color.fromCssColorString('rgba(64,157,253,0.3)'),
                    normalMap: FILE_HOST + "images/drei/normal.jpg",
                    frequency: 500.0,
                    animationSpeed: 0.1,
                    amplitude: 20,
                    specularIntensity: 5
                }
            }
        }),
    }),
})

viewer.scene.primitives.add(primitives);

// 定位到水波纹位置
viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(-106.0, 44.5, 120000), // 提升高度可以看清水面效果
    orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(-45), // 斜视角度更容易看出波纹
        roll: 0
    },
    duration: 1
});