import * as Cesium from 'cesium'

const box = document.getElementById('box')

const viewer = new Cesium.Viewer(box, {

    animation: false,//是否创建动画小器件，左下角仪表    

    baseLayerPicker: false,//是否显示图层选择器，右上角图层选择按钮

    baseLayer: Cesium.ImageryLayer.fromProviderAsync(Cesium.ArcGisMapServerImageryProvider.fromUrl('https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer')),

    fullscreenButton: false,//是否显示全屏按钮，右下角全屏选择按钮

    timeline: false,//是否显示时间轴    

    infoBox: false,//是否显示信息框   

})

// 3dtiles 模型
const tileset = await Cesium.Cesium3DTileset.fromUrl('https://z2586300277.github.io/3d-file-server/3dtiles/test/tileset.json')

viewer.scene.primitives.add(tileset)

adjust3dtilesPosition(tileset)

// 设置视角
viewer.camera.viewBoundingSphere(tileset.boundingSphere, new Cesium.HeadingPitchRange(0, -0.5, 0))

// gltf 模型 放到 3dtiles 模型中心
viewer.entities.add({

    name: 'gltf',

    position: tileset.boundingSphere.center,

    model: {

        uri: '/three-cesium-examples/public/files/model/car.glb',

        minimumPixelSize: 128,

        maximumScale: 200,

    }

})

// 贴地
function adjust3dtilesPosition(tileset) {

    const boundingSphere = tileset.boundingSphere

    const cartographic = Cesium.Cartographic.fromCartesian(boundingSphere.center) // 获取中心点

    const surface = Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0.0) // 获取表面点

    const offset = Cesium.Cartesian3.subtract(surface, boundingSphere.center, new Cesium.Cartesian3()) // 计算偏移

    tileset.modelMatrix = Cesium.Matrix4.fromTranslation(offset) // 设置偏移

}
