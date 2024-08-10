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

// 这里 https://github.com/z2586300277/3d-file-server 是我存放离线地图瓦片资源的仓库 

// 瓦片下载 - 可通过多种方式 例如 望远网 地图资源下载 

// 这里我只下载了 3 - 5 级的瓦片    

/* 百度 影像服务 */
class BaiduImageryProvider {
    constructor(options) {
        this._errorEvent = new Cesium.Event();
        this._tileWidth = 256;
        this._tileHeight = 256;
        this._maximumLevel = 18;
        this._minimumLevel = 1;
        this._tilingScheme = new Cesium.WebMercatorTilingScheme({
            rectangleSouthwestInMeters: new Cesium.Cartesian2(-33554054, -33746824),
            rectangleNortheastInMeters: new Cesium.Cartesian2(33554054, 33746824)
        });
        this._rectangle = this._tilingScheme.rectangle;
        this._resource = Cesium.Resource.createIfNeeded(options.url);
    }

    get url() { return this._resource.url; }
    get proxy() { return this._resource.proxy; }
    get tileWidth() { return this._tileWidth; }
    get tileHeight() { return this._tileHeight; }
    get maximumLevel() { return this._maximumLevel; }
    get minimumLevel() { return this._minimumLevel; }
    get tilingScheme() { return this._tilingScheme; }
    get tileDiscardPolicy() { return this._tileDiscardPolicy; }
    get rectangle() { return this._rectangle; }
    get errorEvent() { return this._errorEvent; }
    get ready() { return this._resource; }
    get readyPromise() { return this._readyPromise; }
    get credit() { return this._credit; }

    requestImage(x, y, level) {
        let url = this.url
            .replace("{x}", x - this._tilingScheme.getNumberOfXTilesAtLevel(level) / 2)
            .replace("{y}", this._tilingScheme.getNumberOfYTilesAtLevel(level) / 2 - y - 1)
            .replace("{z}", level)
            .replace("{s}", Math.floor(10 * Math.random()));
        return Cesium.ImageryProvider.loadImage(this, url);
    }
}

viewer.imageryLayers.addImageryProvider(

    new BaiduImageryProvider({

        url: 'https://z2586300277.github.io/3d-file-server/map/Baidu/tiles/{z}/{x}/{y}.jpg'

    })

)