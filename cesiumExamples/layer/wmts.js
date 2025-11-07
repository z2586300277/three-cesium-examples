import * as Cesium from 'cesium'

const box = document.getElementById('box')

const viewer = new Cesium.Viewer(box, {
    animation: false,//是否创建动画小器件，左下角仪表    
    baseLayerPicker: false,//是否显示图层选择器，右上角图层选择按钮
    fullscreenButton: false,//是否显示全屏按钮，右下角全屏选择按钮
    imageryProvider: false,
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


// 加载天地图wmts
var _layer = 'vec';
var token = 'bcc62222fc634ec736589c483de933e6';
var maxLevel = 18;
var matrixIds = new Array(maxLevel);
for (var z = 0; z <= maxLevel; z++) {
    matrixIds[z] = (z + 1).toString();
}
var _url = 'https://t{s}.tianditu.gov.cn/' + _layer + '_c/wmts?service=WMTS&version=1.0.0&request=GetTile&tilematrix={TileMatrix}&layer=' + _layer + '&style={style}&tilerow={TileRow}&tilecol={TileCol}&tilematrixset={TileMatrixSet}&format=tiles&tk=' + token;
var wmts = new Cesium.WebMapTileServiceImageryProvider({
    url: _url,
    layer: _layer,
    credit: 'opts.credit',
    style: 'default',
    format: 'tiles',
    tileMatrixSetID: 'c',
    subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
    tileMatrixLabels: matrixIds,
    tilingScheme: new Cesium.GeographicTilingScheme(), //WebMercatorTilingScheme、GeographicTilingScheme
    maximumLevel: maxLevel
});
viewer.imageryLayers.addImageryProvider(wmts)
