import * as Cesium from 'cesium'

const box = document.getElementById('box')

const viewer = new Cesium.Viewer(box, {
    imageryProvider: false,
    animation: false,//是否创建动画小器件，左下角仪表    
    baseLayerPicker: false,//是否显示图层选择器，右上角图层选择按钮
    fullscreenButton: false,//是否显示全屏按钮，右下角全屏选择按钮
    geocoder: false,//是否显示geocoder小器件，右上角查询按钮    
    homeButton: false,//是否显示Home按钮，右上角home按钮 
    sceneMode: Cesium.SceneMode.SCENE3D,//初始场景模式
    sceneModePicker: false,//是否显示3D/2D选择器，右上角按钮 
    navigationHelpButton: false,//是否显示右上角的帮助按钮  
    selectionIndicator: false,//是否显示选取指示器组件   
    timeline: false,//是否显示时间轴    
    infoBox: false,//是否显示信息框   
    scene3DOnly: true,//如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源  
    orderIndependentTranslucency: false, //是否启用无序透明
    contextOptions: { webgl: { alpha: true } },
    skyBox: new Cesium.SkyBox({ show: false })
})
viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(110.511154, 29.362943, 3000000),
});

 // 加载tms
 let tms = new Cesium.UrlTemplateImageryProvider({
    "credit": "riv_m",
    "url": 'http://39.107.182.155:9000/tserver/wmts.ashx?r={y}&c={x}&l={z}&t=riv_m'
})
viewer.imageryLayers.addImageryProvider(tms)