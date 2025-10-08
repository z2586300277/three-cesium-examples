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

const instances = [];

for (let i = 0; i < 10000; i++) {

    const longitude = Math.random() * 360 - 180;

    const latitude = Math.random() * 180 - 90;

    const position = Cesium.Cartesian3.fromDegrees(longitude, latitude, 0);

    const dimensions = new Cesium.Cartesian3(40000.0, 30000.0, 500000.0);

    const color = Cesium.Color.RED.withAlpha(0.2);

    instances.push(new Cesium.GeometryInstance({

        geometry: new Cesium.BoxGeometry.fromDimensions({

            vertexFormat: Cesium.PerInstanceColorAppearance.VERTEX_FORMAT,

            dimensions: dimensions

        }),

        modelMatrix: Cesium.Transforms.eastNorthUpToFixedFrame(position),

        attributes: {

            color: Cesium.ColorGeometryInstanceAttribute.fromColor(color)

        }

    }));

}

viewer.scene.primitives.add(new Cesium.Primitive({

    geometryInstances: instances,

    appearance: new Cesium.PerInstanceColorAppearance()

}));