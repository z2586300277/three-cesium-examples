`{"src": ["https://z2586300277.github.io/3d-file-server/js/echarts490.min.js"]}`=INCLUDE_SCRIPT_PLACEHOLDER/* 注 echarts 版本使用 4.9.0  请自行引入  此处我为 src 引入 */
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

// 视角设置北京
viewer.camera.flyTo({ destination: Cesium.Cartesian3.fromDegrees(116.4551, 40.2539, 10000000) })

class RegisterCoordinateSystem {
    static dimensions = ['lng', 'lat']
    constructor(glMap) {
        this._GLMap = glMap
        this._mapOffset = [0, 0]
        this.dimensions = ['lng', 'lat']
    }
    setMapOffset(mapOffset) {
        this._mapOffset = mapOffset
    }
    getBMap() {
        return this._GLMap
    }
    fixLat(lat) {
        return lat >= 90 ? 89.99999999999999 : lat <= -90 ? -89.99999999999999 : lat
    }
    dataToPoint(coords) {
        let lonlat = [99999, 99999]
        coords[1] = this.fixLat(coords[1])
        let position = Cesium.Cartesian3.fromDegrees(coords[0], coords[1])
        if (!position) return lonlat
        let coordinates = this._GLMap.cartesianToCanvasCoordinates(position)
        if (!coordinates) return lonlat
        if (this._GLMap.mode === Cesium.SceneMode.SCENE3D) {
            if (Cesium.Cartesian3.angleBetween(this._GLMap.camera.position, position) > Cesium.Math.toRadians(75)) return !1
        }
        return [coordinates.x - this._mapOffset[0], coordinates.y - this._mapOffset[1]]
    }
    pointToData(pt) {
        var mapOffset = this._mapOffset
        pt = this._bmap.project([pt[0] + mapOffset[0], pt[1] + mapOffset[1]])
        return [pt.lng, pt.lat]
    }
    getViewRect() {
        let api = this._api
        return new echarts.graphic.BoundingRect(0, 0, api.getWidth(), api.getHeight())
    }
    getRoamTransform() {
        return echarts.matrix.create()
    }
    static create(echartModel, api) {
        this._api = api
        let registerCoordinateSystem
        echartModel.eachComponent('GLMap', function (seriesModel) {
            let painter = api.getZr().painter
            if (painter) {
                let glMap = echarts.glMap
                registerCoordinateSystem = new RegisterCoordinateSystem(glMap, api)
                registerCoordinateSystem.setMapOffset(seriesModel.__mapOffset || [0, 0])
                seriesModel.coordinateSystem = registerCoordinateSystem
            }
        })
        echartModel.eachSeries(function (series) {
            'GLMap' === series.get('coordinateSystem') && (series.coordinateSystem = registerCoordinateSystem)
        })
    }
}

const mockClickChart = (event, chart) => {
    const evmousedown = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
    const evmouseup = new MouseEvent('mouseup', { bubbles: true, cancelable: true });
    const evmouseclick = new MouseEvent('click', { bubbles: true, cancelable: true });
    for (const key in event) {
        try {
            Object.defineProperty(evmousedown, key, { value: event[key] });
            Object.defineProperty(evmouseup, key, { value: event[key] });
            Object.defineProperty(evmouseclick, key, { value: event[key] });
        } catch (err) { /* event 对象中部分属性是只读，忽略即可 */ }
    }

    // 事件触发的容器，即不是 #app 也不是 canvas，而是中间这个 div
    const container = chart._dom.firstElementChild;
    container.dispatchEvent(evmousedown);
    container.dispatchEvent(evmouseup);
    container.dispatchEvent(evmouseclick);
}

class EchartsLayer {

    constructor(map, options) {
        this._map = map;
        this._overlay = this._createChartOverlay();
        if (options) this._registerMap();
        this._overlay.setOption(options || {});
    }
    _registerMap() {
        if (!this._isRegistered) {
            echarts.registerCoordinateSystem('GLMap', RegisterCoordinateSystem);
            echarts.registerAction({ type: 'GLMapRoam', event: 'GLMapRoam', update: 'updateLayout' }, function (t, e) { });
            echarts.extendComponentModel({
                type: 'GLMap',
                getBMap() {
                    return this.__GLMap;
                },
                defaultOption: { roam: false },
            });
            echarts.extendComponentView({
                type: 'GLMap',
                init(t, e) {
                    this.api = e;
                    echarts.glMap.postRender.addEventListener(this.moveHandler, this);
                },
                moveHandler(t, e) {
                    this.api.dispatchAction({ type: 'GLMapRoam' });
                },
                render(t, e, i) { },
                dispose(t) {
                    echarts.glMap.postRender.removeEventListener(this.moveHandler, this);
                },
            });
            this._isRegistered = true;
        }
    }
    _createChartOverlay() {
        var scene = this._map.scene;
        scene.canvas.setAttribute('tabIndex', 0);
        const ele = document.createElement('div');
        ele.style.position = 'absolute';
        ele.style.top = '0px';
        ele.style.left = '0px';
        ele.style.width = scene.canvas.width + 'px';
        ele.style.height = scene.canvas.height + 'px';
        ele.style.pointerEvents = 'none';
        ele.setAttribute('id', 'echarts');
        ele.setAttribute('class', 'echartMap');
        this._map.container.appendChild(ele);
        this._echartsContainer = ele;
        echarts.glMap = scene;
        this._chart = echarts.init(ele);
        const handler = new Cesium.ScreenSpaceEventHandler(scene.canvas);
        handler.setInputAction(click => mockClickChart(event, this._chart), Cesium.ScreenSpaceEventType.LEFT_CLICK);
        return this._chart;
    }
    dispose() {
        if (this._echartsContainer) {
            this._map.container.removeChild(this._echartsContainer);
            this._echartsContainer = null;
        }
        if (this._overlay) {
            this._overlay.dispose();
            this._overlay = null;
        }
    }
    updateOverlay(t) {
        if (this._overlay) {
            this._overlay.setOption(t);
        }
    }
    getMap() {
        return this._map;
    }
    getOverlay() {
        return this._overlay;
    }
    show() {
        if (this._echartsContainer) {
            this._echartsContainer.style.visibility = 'visible';
        }
    }
    hide() {
        if (this._echartsContainer) {
            this._echartsContainer.style.visibility = 'hidden';
        }
    }
    remove() {
        this._chart.clear();
        if (this._echartsContainer.parentNode) {
            this._echartsContainer.parentNode.removeChild(this._echartsContainer);
        }
        this._map = undefined;
    }
    resize() {
        const me = this;
        const container = me._map.container;
        me._echartsContainer.style.width = container.clientWidth + 'px';
        me._echartsContainer.style.height = container.clientHeight + 'px';
        me._chart.resize();
    }
}

const echartsLayer = new EchartsLayer(viewer, {

    animation: false,

    GLMap: {},

    series: [
        {
            type: 'lines',
            coordinateSystem: 'GLMap',
            zlevel: 2,
            effect: { show: true, period: 6, trailLength: 0.1, symbol: 'arrow', symbolSize: 5 },
            lineStyle: { normal: { color: '#60ff44', width: 1, opacity: 0.4, curveness: 0.2 } },
            data: [{ fromName: '北京', toName: '无锡', coords: [[116.4551, 40.2539], [120.3442, 31.5527],], }, { fromName: '上海', toName: '无锡', coords: [[121.4648, 31.2891], [120.3442, 31.5527],], }, { fromName: '广州', toName: '无锡', coords: [[113.5107, 23.2196], [120.3442, 31.5527],], }, { fromName: '大连', toName: '无锡', coords: [[122.2229, 39.4409], [120.3442, 31.5527],], }, { fromName: '青岛', toName: '无锡', coords: [[120.4651, 36.3373], [120.3442, 31.5527],], }, { fromName: '石家庄', toName: '无锡', coords: [[114.4995, 38.1006], [120.3442, 31.5527],], }, { fromName: '南昌', toName: '无锡', coords: [[116.0046, 28.6633], [120.3442, 31.5527],], }, { fromName: '合肥', toName: '无锡', coords: [[117.29, 32.0581], [120.3442, 31.5527],], }, { fromName: '呼和浩特', toName: '无锡', coords: [[111.4124, 40.4901], [120.3442, 31.5527],], }, { fromName: '宿州', toName: '无锡', coords: [[117.5535, 33.7775], [120.3442, 31.5527],], }, { fromName: '曲阜', toName: '无锡', coords: [[117.323, 35.8926], [120.3442, 31.5527],], }, { fromName: '杭州', toName: '无锡', coords: [[119.5313, 29.8773], [120.3442, 31.5527],], }, { fromName: '武汉', toName: '无锡', coords: [[114.3896, 30.6628], [120.3442, 31.5527],], }, { fromName: '深圳', toName: '无锡', coords: [[114.5435, 22.5439], [120.3442, 31.5527],], }, { fromName: '珠海', toName: '无锡', coords: [[113.7305, 22.1155], [120.3442, 31.5527],], }, { fromName: '福州', toName: '无锡', coords: [[119.4543, 25.9222], [120.3442, 31.5527],], }, { fromName: '西安', toName: '无锡', coords: [[109.1162, 34.2004], [120.3442, 31.5527],], }, { fromName: '赣州', toName: '无锡', coords: [[116.0046, 25.6633], [120.3442, 31.5527],], },],
        },
        {
            type: 'effectScatter',
            coordinateSystem: 'GLMap',
            zlevel: 2,
            rippleEffect: { brushType: 'stroke' },
            label: { normal: { show: true, position: 'right', formatter: '{b}' } },
            itemStyle: { normal: { color: '#60ff44' } },
            data: [{ name: '北京', value: [116.4551, 40.2539, 100] }, { name: '上海', value: [121.4648, 31.2891, 30] }, { name: '广州', value: [113.5107, 23.2196, 20] }, { name: '大连', value: [122.2229, 39.4409, 10] }, { name: '青岛', value: [120.4651, 36.3373, 20] }, { name: '石家庄', value: [114.4995, 38.1006, 20] }, { name: '南昌', value: [116.0046, 28.6633, 10] }, { name: '合肥', value: [117.29, 32.0581, 30] }, { name: '呼和浩特', value: [111.4124, 40.4901, 10] }, { name: '宿州', value: [117.5535, 33.7775, 10] }, { name: '曲阜', value: [117.323, 35.8926, 10] }, { name: '杭州', value: [119.5313, 29.8773, 10] }, { name: '武汉', value: [114.3896, 30.6628, 10] }, { name: '深圳', value: [114.5435, 22.5439, 10] }, { name: '珠海', value: [113.7305, 22.1155, 10] }, { name: '福州', value: [119.4543, 25.9222, 20] }, { name: '西安', value: [109.1162, 34.2004, 60] }, { name: '赣州', value: [116.0046, 25.6633, 10] },],
        },
    ],

})

echartsLayer._chart.on('click', params => console.log(params))

window.addEventListener('resize', () => echartsLayer.resize())