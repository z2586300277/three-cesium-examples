import * as Cesium from 'cesium'

const box = document.getElementById('box')

const viewer = new Cesium.Viewer(box, {

    animation: false,//是否创建动画小器件，左下角仪表    

    baseLayerPicker: false,//是否显示图层选择器，右上角图层选择按钮

    baseLayer: false, // 不显示默认图层

    fullscreenButton: false,//是否显示全屏按钮，右下角全屏选择按钮

    timeline: false,//是否显示时间轴    

    infoBox: false,//是否显示信息框   

})

const url = 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'
 
const layer = Cesium.ImageryLayer.fromProviderAsync(

    Cesium.ArcGisMapServerImageryProvider.fromUrl(url)

)

viewer.imageryLayers.add(layer)

// 添加点击事件监听器
viewer.screenSpaceEventHandler.setInputAction(function (event) {

    const object = viewer.scene.pick(event.position)

    const cartesian = viewer.scene.pickPosition(event.position)

    if (Cesium.defined(cartesian)) {

        const cartographic = Cesium.Cartographic.fromCartesian(cartesian)

        const longitude = Cesium.Math.toDegrees(cartographic.longitude)

        const latitude = Cesium.Math.toDegrees(cartographic.latitude)

        const height = cartographic.height

        console.log('经度：', longitude, '纬度：', latitude, '高度：', height)

    }

    if (Cesium.defined(object)) {

        const { id } = object

        alert('点击到的对象：' + id.name + '-----id：'+ id.id)
        
    }

}, Cesium.ScreenSpaceEventType.LEFT_CLICK)

// 视角定位到中国
viewer.camera.flyTo({

    destination: Cesium.Cartesian3.fromDegrees(116.39, 39.9, 10000000)

})

// 测试点
const point = viewer.entities.add({

    name: '测试点',

    id: '点-id',

    position: Cesium.Cartesian3.fromDegrees(116.39, 39.9),

    point: {

        pixelSize: 10,

        color: Cesium.Color.RED,

        outlineColor: Cesium.Color.WHITE,

        outlineWidth: 2

    }

})

// 测试面
const polygon = viewer.entities.add({

    name: '测试多边形',

    id: '多边形-id',

    polygon: {

        hierarchy: Cesium.Cartesian3.fromDegreesArray([

            90.38, 30.91,

            80.38, 30.89,

            100.4, 39.89,

            105.4, 39.91

        ]),

        material: Cesium.Color.RED.withAlpha(0.5)

    }

})

// 测试线
const polyline = viewer.entities.add({

    name: '测试线段',

    id: '线段-id',

    polyline: {

        positions: Cesium.Cartesian3.fromDegreesArray([

            116.41, 36.91,

            100.41, 30.89

        ]),

        width: 20,

        material: new Cesium.PolylineGlowMaterialProperty({

            glowPower: 0.1,

            color: Cesium.Color.YELLOW

        })

    }

})

