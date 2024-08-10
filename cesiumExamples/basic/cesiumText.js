import * as Cesium from 'cesium'

const DOM = document.getElementById('box')

const viewer = new Cesium.Viewer(DOM, {

    animation: false,//是否创建动画小器件，左下角仪表    

    baseLayerPicker: false,//是否显示图层选择器，右上角图层选择按钮

    baseLayer: Cesium.ImageryLayer.fromProviderAsync(Cesium.ArcGisMapServerImageryProvider.fromUrl('https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer')),

    fullscreenButton: false,//是否显示全屏按钮，右下角全屏选择按钮

    timeline: false,//是否显示时间轴    

    infoBox: false,//是否显示信息框   

})

viewer._cesiumWidget._creditContainer.style.display = "none"

// 深度监测
viewer.scene.globe.depthTestAgainstTerrain = true;

var text = viewer.entities.add({
    name: '贴地',
    position: Cesium.Cartesian3.fromDegrees(-75.166493, 39.9060534),
    point: {
        pixelSize: 5,
        color: Cesium.Color.RED,
        outlineColor: Cesium.Color.WHITE,
        outlineWidth: 2,
        verticalOrigin: Cesium.VerticalOrigin.TOP,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,

    },
    label: {
        text: '贴地',
        font: '14pt monospace',
        outlineWidth: 2,
        verticalOrigin: Cesium.VerticalOrigin.TOP,
        heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        showBackground: true,
        backgroundColor: Cesium.Color.WHITE
    }
});

var world = viewer.entities.add({
    name: '不贴地',
    position: Cesium.Cartesian3.fromDegrees(-95.166493, 39.9060534, 2000),
    point: {
        pixelSize: 5,
        color: Cesium.Color.RED,
        outlineColor: Cesium.Color.WHITE,
        outlineWidth: 2,
    },
    label: {
        text: '不贴地',
        font: '14pt monospace',
        outlineWidth: 2,
    }
});

// 自动计算贴地，需要等地形加载完方可
function add() {
    viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(-115.166493, 39.9060534, 15000.0),
        duration: 3,
        orientation: {
            heading: Cesium.Math.toRadians(90.0), // 水平旋转，围绕Y轴，0为正北方向
            pitch: Cesium.Math.toRadians(-90),     // 上下旋转，围绕X轴，-90为俯视地面
            roll: 0.0                             // 视口的翻滚角度，围绕Z轴，0为不翻转
        },
        complete: () => {
            setTimeout(() => {
                var cartographic = Cesium.Cartographic.fromDegrees(-115.166493, 39.9060534, 10);
                var posi = new Cesium.Cartographic(cartographic.longitude, cartographic.latitude)
                var height = viewer.scene.globe.getHeight(posi)
                console.log(height)

                var haha = viewer.entities.add({
                    name: '自动计算贴地',
                    position: Cesium.Cartesian3.fromDegrees(-115.166493, 39.9060534, height + 0.1),
                    point: {
                        pixelSize: 5,
                        color: Cesium.Color.RED,
                        outlineColor: Cesium.Color.WHITE,
                        outlineWidth: 2,
                        verticalOrigin: Cesium.VerticalOrigin.TOP,
                        disableDepthTestDistance: Number.POSITIVE_INFINITY,
                    },
                    label: {
                        text: '自动计算贴地',
                        font: '14pt monospace',
                        outlineWidth: 2,
                        verticalOrigin: Cesium.VerticalOrigin.TOP,
                        disableDepthTestDistance: Number.POSITIVE_INFINITY,
                    }
                });
            }, 1000)
        }
    });
}




// 修改值和属性
text.label.text = '贴地文字'
text.label.fillColor = Cesium.Color.RED
 // text.position =  Cesium.Cartesian3.fromDegrees(-100, 39.9060534)
