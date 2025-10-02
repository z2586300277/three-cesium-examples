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
const positions = [-109.080842, 45.002073, -105.91517, 45.002073, -104.058488, 44.996596, -104.053011, 43.069758, -107.314,43.069758, -109.080842, 45.002073]; // 示例坐标数组
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
    destination: Cesium.Cartesian3.fromDegrees(-106.0, 44.5, 100000), // 设置相机位置
    orientation: {
        heading: Cesium.Math.toRadians(0), // 水平旋转角度
        pitch: Cesium.Math.toRadians(-90), // 垂直旋转角度
        roll: 0 // 侧翻角度
    },
    duration: 1 // 飞行持续时间，单位为秒
});