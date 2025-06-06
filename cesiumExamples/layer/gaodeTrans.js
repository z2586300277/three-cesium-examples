import * as Cesium from 'cesium';
import * as dat from 'dat.gui';

// 定义一些常量
const BD_FACTOR = (3.14159265358979324 * 3000.0) / 180.0;
const PI = 3.1415926535897932384626;
const RADIUS = 6378245.0;
const EE = 0.00669342162296594323;

class CoordTransform {
    /**
     * BD-09(百度坐标系) To GCJ-02(火星坐标系)
     * @param lng
     * @param lat
     * @returns {number[]}
     */
    static BD09ToGCJ02(lng, lat) {
        let x = +lng - 0.0065;
        let y = +lat - 0.006;
        let z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * BD_FACTOR);
        let theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * BD_FACTOR);
        let gg_lng = z * Math.cos(theta);
        let gg_lat = z * Math.sin(theta);
        return [gg_lng, gg_lat];
    }

    /**
     * GCJ-02(火星坐标系) To BD-09(百度坐标系)
     * @param lng
     * @param lat
     * @returns {number[]}
     * @constructor
     */
    static GCJ02ToBD09(lng, lat) {
        lat = +lat;
        lng = +lng;
        let z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * BD_FACTOR);
        let theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * BD_FACTOR);
        let bd_lng = z * Math.cos(theta) + 0.0065;
        let bd_lat = z * Math.sin(theta) + 0.006;
        return [bd_lng, bd_lat];
    }

    /**
     * WGS-84(世界大地坐标系) To GCJ-02(火星坐标系)
     * @param lng
     * @param lat
     * @returns {number[]}
     */
    static WGS84ToGCJ02(lng, lat) {
        lat = +lat;
        lng = +lng;
        if (this.out_of_china(lng, lat)) {
            return [lng, lat];
        } else {
            let d = this.delta(lng, lat);
            return [lng + d[0], lat + d[1]];
        }
    }

    /**
     * GCJ-02(火星坐标系) To WGS-84(世界大地坐标系)
     * @param lng
     * @param lat
     * @returns {number[]}
     * @constructor
     */
    static GCJ02ToWGS84(lng, lat) {
        lat = +lat;
        lng = +lng;
        if (this.out_of_china(lng, lat)) {
            return [lng, lat];
        } else {
            let d = this.delta(lng, lat);
            let mgLng = lng + d[0];
            let mgLat = lat + d[1];
            return [lng * 2 - mgLng, lat * 2 - mgLat];
        }
    }

    /**
     *
     * @param lng
     * @param lat
     * @returns {number[]}
     */
    static delta(lng, lat) {
        let dLng = this.transformLng(lng - 105, lat - 35);
        let dLat = this.transformLat(lng - 105, lat - 35);
        const radLat = (lat / 180) * PI;
        let magic = Math.sin(radLat);
        magic = 1 - EE * magic * magic;
        const sqrtMagic = Math.sqrt(magic);
        dLng = (dLng * 180) / ((RADIUS / sqrtMagic) * Math.cos(radLat) * PI);
        dLat = (dLat * 180) / (((RADIUS * (1 - EE)) / (magic * sqrtMagic)) * PI);
        return [dLng, dLat];
    }

    /**
     *
     * @param lng
     * @param lat
     * @returns {number}
     */
    static transformLng(lng, lat) {
        lat = +lat;
        lng = +lng;
        let ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
        ret += ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0) / 3.0;
        ret += ((20.0 * Math.sin(lng * PI) + 40.0 * Math.sin((lng / 3.0) * PI)) * 2.0) / 3.0;
        ret += ((150.0 * Math.sin((lng / 12.0) * PI) + 300.0 * Math.sin((lng / 30.0) * PI)) * 2.0) / 3.0;
        return ret;
    }

    /**
     *
     * @param lng
     * @param lat
     * @returns {number}
     */
    static transformLat(lng, lat) {
        lat = +lat;
        lng = +lng;
        let ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
        ret += ((20.0 * Math.sin(6.0 * lng * PI) + 20.0 * Math.sin(2.0 * lng * PI)) * 2.0) / 3.0;
        ret += ((20.0 * Math.sin(lat * PI) + 40.0 * Math.sin((lat / 3.0) * PI)) * 2.0) / 3.0;
        ret += ((160.0 * Math.sin((lat / 12.0) * PI) + 320 * Math.sin((lat * PI) / 30.0)) * 2.0) / 3.0;
        return ret;
    }

    /**
     * 判断是否在国内。不在国内不做偏移
     * @param lng
     * @param lat
     * @returns {boolean}
     */
    static out_of_china(lng, lat) {
        lat = +lat;
        lng = +lng;
        return !(lng > 73.66 && lng < 135.05 && lat > 3.86 && lat < 53.55);
    }
}

class AmapMercatorTilingScheme extends Cesium.WebMercatorTilingScheme {

    constructor() {
        super();

        let projection = new Cesium.WebMercatorProjection();

        this._projection.project = function (cartographic, result) {
            result = CoordTransform.WGS84ToGCJ02(
                Cesium.Math.toDegrees(cartographic.longitude),
                Cesium.Math.toDegrees(cartographic.latitude)
            );
            result = projection.project(new Cesium.Cartographic(Cesium.Math.toRadians(result[0]), Cesium.Math.toRadians(result[1])));
            return new Cesium.Cartesian2(result.x, result.y);
        };

        this._projection.unproject = function (cartesian, result) {
            let cartographic = projection.unproject(cartesian);
            result = CoordTransform.GCJ02ToWGS84(
                Cesium.Math.toDegrees(cartographic.longitude),
                Cesium.Math.toDegrees(cartographic.latitude)
            );
            return new Cesium.Cartographic(Cesium.Math.toRadians(result[0]), Cesium.Math.toRadians(result[1]));
        };
    }
}

const box = document.getElementById('box')

const viewer = new Cesium.Viewer(box, {

    animation: false,//是否创建动画小器件，左下角仪表    

    baseLayerPicker: false,//是否显示图层选择器，右上角图层选择按钮

    baseLayer: false, // 不显示默认图层

    fullscreenButton: false,//是否显示全屏按钮，右下角全屏选择按钮

    timeline: false,//是否显示时间轴    

    infoBox: false,//是否显示信息框   

})

viewer.imageryLayers.addImageryProvider(
    new Cesium.UrlTemplateImageryProvider({
        url: 'https://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=2&style=8&x={x}&y={y}&z={z}',
        maximumLevel: 18,
        tilingScheme: new AmapMercatorTilingScheme()
    })
)

viewer.entities.add({

    name: 'gltf',

    position: Cesium.Cartesian3.fromDegrees(116.3975, 39.9085, 0), // 北京的经纬度和高度

    model: {

        uri: FILE_HOST + '/files/model/LittlestTokyo.glb',

        minimumPixelSize: 128,

        maximumScale: 200,

    }

})

const gui = new dat.GUI();

const mapParams = {
    mapType: '纠偏校正', // 默认使用纠偏后的高德地图
    locations: '北京',
};

// 预定义常用位置
const locations = {
    '北京': [116.3975, 39.9085, 2000],
    '上海': [121.4737, 31.2304, 2000],
    '广州': [113.2644, 23.1292, 2000],
    '深圳': [114.0579, 22.5431, 2000]
};

// 飞行到指定位置
function flyToLocation(name) {
    const position = locations[name];
    if (position) {
        viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(position[0], position[1], position[2]),
            duration: 1.5
        });
    }
}

// 添加GUI控制
const mapFolder = gui.addFolder('坐标纠偏对比');

// 添加地图类型选择
mapFolder.add(mapParams, 'mapType', ['纠偏校正', '未纠正']).name('地图类型').onChange(function (value) {
    viewer.imageryLayers.removeAll();
    viewer.imageryLayers.addImageryProvider(
        new Cesium.UrlTemplateImageryProvider({
            url: 'https://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=2&style=8&x={x}&y={y}&z={z}',
            maximumLevel: 18,
            tilingScheme: value === '纠偏校正' ? new AmapMercatorTilingScheme() : null
        })
    )
});

// 添加位置选择
mapFolder.add(mapParams, 'locations', Object.keys(locations)).name('常用位置')
    .onChange(function (value) {
        flyToLocation(value);
    });


// 默认展开文件夹
mapFolder.open();

flyToLocation(mapParams.locations);

