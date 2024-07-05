import * as Cesium from 'cesium'

const box = document.getElementById('box')

const viewer = new Cesium.Viewer(box, { infoBox: false, baseLayer: false })

/* 百度 影像服务 */
class BaiduImageryProvider {

    constructor(options) {

        // 创建错误事件对象
        this._errorEvent = new Cesium.Event()

        // 定义瓦片宽度和高度
        this._tileWidth = 256

        this._tileHeight = 256

        // 定义最大和最小级别
        this._maximumLevel = 18

        this._minimumLevel = 1

        // 定义瓦片范围的南西角和东北角坐标
        let southwestInMeters = new Cesium.Cartesian2(-33554054, -33746824)

        let northeastInMeters = new Cesium.Cartesian2(33554054, 33746824)

        // 创建 WebMercatorTilingScheme 对象
        this._tilingScheme = new Cesium.WebMercatorTilingScheme({

            rectangleSouthwestInMeters: southwestInMeters,

            rectangleNortheastInMeters: northeastInMeters

        })

        // 获取瓦片范围
        this._rectangle = this._tilingScheme.rectangle

        // 创建资源对象
        this._resource = Cesium.Resource.createIfNeeded(options.url)

        // 设置其他属性的初始值
        this._tileDiscardPolicy = undefined

        this._credit = undefined

        this._readyPromise = undefined

    }

    // 定义属性访问器
    get url() {

        return this._resource.url

    }

    get proxy() {

        return this._resource.proxy

    }

    get tileWidth() {

        if (!this.ready) throw new Cesium.DeveloperError('tileWidth must not be called before the imagery provider is ready.')

        return this._tileWidth
    }

    get tileHeight() {

        if (!this.ready) throw new Cesium.DeveloperError('tileHeight must not be called before the imagery provider is ready.')

        return this._tileHeight

    }

    get maximumLevel() {

        if (!this.ready) throw new Cesium.DeveloperError('maximumLevel must not be called before the imagery provider is ready.')

        return this._maximumLevel

    }

    get minimumLevel() {

        if (!this.ready) throw new Cesium.DeveloperError('minimumLevel must not be called before the imagery provider is ready.')

        return this._minimumLevel

    }

    get tilingScheme() {

        if (!this.ready) throw new Cesium.DeveloperError('tilingScheme must not be called before the imagery provider is ready.')

        return this._tilingScheme

    }

    get tileDiscardPolicy() {

        if (!this.ready) throw new Cesium.DeveloperError('tileDiscardPolicy must not be called before the imagery provider is ready.')

        return this._tileDiscardPolicy

    }

    get rectangle() {

        if (!this.ready) throw new Cesium.DeveloperError('rectangle must not be called before the imagery provider is ready.')

        return this._rectangle

    }

    get errorEvent() {

        return this._errorEvent

    }

    get ready() {

        return this._resource

    }

    get readyPromise() {

        return this._readyPromise

    }

    get credit() {

        if (!this.ready) {

            throw new Cesium.DeveloperError('credit must not be called before the imagery provider is ready.')

        }

        return this._credit

    }

    // 请求影像数据
    requestImage(x, y, level, request) {

        let xTileCount = this._tilingScheme.getNumberOfXTilesAtLevel(level)

        let yTileCount = this._tilingScheme.getNumberOfYTilesAtLevel(level)

        // 构建请求 URL
        let url = this.url

            .replace("{x}", x - xTileCount / 2)

            .replace("{y}", yTileCount / 2 - y - 1)

            .replace("{z}", level)

            .replace("{s}", Math.floor(10 * Math.random()))

        // 加载影像数据
        return Cesium.ImageryProvider.loadImage(this, url)

    }

}

viewer.imageryLayers.addImageryProvider(

    new BaiduImageryProvider({

        url: 'https://maponline0.bdimg.com/tile/?qt=vtile&x={x}&y={y}&z={z}&styles=pl&scaler=1&udt=20210709'

    })

)