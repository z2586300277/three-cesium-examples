import * as Cesium from 'cesium'
import { Color, defined, Event, Material, Property } from 'cesium'

const box = document.getElementById('box')

const viewer = new Cesium.Viewer(box, {

    animation: false,//是否创建动画小器件，左下角仪表    

    baseLayerPicker: false,//是否显示图层选择器，右上角图层选择按钮

    baseLayer: Cesium.ImageryLayer.fromProviderAsync(Cesium.ArcGisMapServerImageryProvider.fromUrl(GLOBAL_CONFIG.getLayerUrl())),

    fullscreenButton: false,//是否显示全屏按钮，右下角全屏选择按钮

    timeline: false,//是否显示时间轴    

    infoBox: false,//是否显示信息框   

})

viewer._cesiumWidget._creditContainer.style.display = "none"

viewer.clock.shouldAnimate = true

//定位北京
viewer.camera.flyTo({

    destination: Cesium.Cartesian3.fromDegrees(116.41, 36.91, 1000000),

    orientation: {

        heading: Cesium.Math.toRadians(0),

        pitch: Cesium.Math.toRadians(-90),

        roll: 0

    }

})

/* 飞线材质类 */
class PolylineTrailLinkMaterialProperty {

    constructor(image, color = Color.WHITE, duration = 1000, repeat = 60) {

        this._definitionChanged = new Event()

        this._color = undefined

        this.color = color

        this.duration = duration

        this._time = new Date().getTime()

        this.image = image

        Material._materialCache.addMaterial('PolylineTrailLink', {

            fabric: {

                type: 'PolylineTrailLink',

                uniforms: {

                    color: color.withAlpha(1.0),

                    image: image,

                    time: 0,

                    repeat

                },

                source: `
                    czm_material czm_getMaterial(czm_materialInput materialInput) 
                    {
                    czm_material material = czm_getDefaultMaterial(materialInput);
                    vec2 st = materialInput.st;
                    vec4 sampledColor = texture(image, vec2(fract(repeat*st.s - time), st.t));
                    material.alpha = sampledColor.a * color.a;
                    material.diffuse = (sampledColor.rgb + color.rgb) / 2.0;
                    return material;
                }`

            },

            translucent: () => true

        })

    }

    get isConstant() { return false }

    get definitionChanged() { return this._definitionChanged }

    getType(_) { return 'PolylineTrailLink' }

    getValue(time, result) {

        if (!defined(result)) result = {}

        result.color = Property.getValueOrClonedDefault(this._color, time, Color.WHITE, result.color)

        result.image = this.image

        result.time = (new Date().getTime() - this._time) % this.duration / this.duration

        return result

    }

    equals(other) { return this === other || Property.equals(this._color, other._color) }

}

// 生成一组飞线动画
[
    [[116.41, 36.91], [130.40, 45.39]],
    [[116.41, 36.91], [114.11, 39.44]],
    [[116.41, 36.91], [109.62, 25.72]],
    [[116.41, 36.91], [121.48, 31.22]],
    [[116.41, 36.91], [13.78, 12.31]],
    [[116.41, 36.91], [74.12, 33.50]],
].forEach(([p1, p2]) => createPlaneCurve(p1, p2))

// 组合
function createPlaneCurve(p1, p2) {

    const { curvePoints } = getGenerateCurve(p1, p2, { maxHeight: 100000 })

    viewer.entities.add({
        polylineVolume: createCurvePipe(curvePoints)

    })

}

/* 生成曲线 */
function getGenerateCurve(start, end, params = {}) {

    const [startLongitude, startLatitude] = start

    const [endLongitude, endLatitude] = end

    const startCartographic = Cesium.Cartographic.fromDegrees(startLongitude, startLatitude)

    const endCartographic = Cesium.Cartographic.fromDegrees(endLongitude, endLatitude)

    const geodesic = new Cesium.EllipsoidGeodesic(startCartographic, endCartographic)

    const curvePoints = []

    for (let t = 0; t <= 1; t += (params.step || 0.01)) {

        const pointCartographic = geodesic.interpolateUsingFraction(t)

        pointCartographic.height = (params.maxHeight || 400000) * Math.sin(Math.PI * t)

        const pointCartesian = Cesium.Cartographic.toCartesian(pointCartographic)

        curvePoints.push(pointCartesian)

    }

    endCartographic.height = 0

    const endPointCartesian = Cesium.Cartographic.toCartesian(endCartographic)

    curvePoints.push(endPointCartesian)

    function getCurvePointAtTime(t) {

        const pointCartographic = geodesic.interpolateUsingFraction(t)

        pointCartographic.height = (params.maxHeight || 400000) * Math.sin(Math.PI * t)

        return Cesium.Cartographic.toCartesian(pointCartographic)

    }

    return { curvePoints, getCurvePointAtTime }

}

function createCurvePipe(curvePoints, params = {}) {

    const getShape = (radius) => {

        const positions = [];

        for (let i = 0; i < 360; i++) {

            if (i % 1 === 0) {

                const radians = Cesium.Math.toRadians(i);

                positions.push(

                    new Cesium.Cartesian2(

                        (radius / 2) * Math.cos(radians),

                        (radius / 2) * Math.sin(radians)

                    )

                );

            }

        }

        return positions;

    }

    const radius = 16000.0

    const _ps = curvePoints.map(i => {

        const [longitude, latitude, height] = cartesian3ToDegrees(i)

        return Cesium.Cartesian3.fromDegrees(longitude, latitude, height - radius)

    })

    return {

        positions: _ps,

        shape: getShape(2 * radius),

        cornerType: Cesium.CornerType.ROUNDED,

        material: new PolylineTrailLinkMaterialProperty(FILE_HOST + 'images/channels/lmap.png', Cesium.Color.RED, 2000)

    }

}

function cartesian3ToDegrees(cartesian3, type = 'Array') {

    const cartographic = Cesium.Cartographic.fromCartesian(cartesian3) // 笛卡尔坐标转经纬度

    const longitude = Cesium.Math.toDegrees(cartographic.longitude) // 弧度转度

    const latitude = Cesium.Math.toDegrees(cartographic.latitude) // 弧度转度

    const height = cartographic.height // 高度

    return type === 'Array' ? [longitude, latitude, height] : { longitude, latitude, height }

}