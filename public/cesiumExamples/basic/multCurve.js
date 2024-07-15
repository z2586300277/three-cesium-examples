import * as Cesium from 'cesium'

const box = document.getElementById('box')

const viewer = new Cesium.Viewer(box, {

    animation: false,//是否创建动画小器件，左下角仪表    

    baseLayerPicker: false,//是否显示图层选择器，右上角图层选择按钮

    baseLayer: Cesium.ImageryLayer.fromProviderAsync(Cesium.ArcGisMapServerImageryProvider.fromUrl('https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer')),

    fullscreenButton: false,//是否显示全屏按钮，右下角全屏选择按钮

    timeline: false,//是否显示时间轴    

    infoBox: false,//是否显示信息框   

})


// 经纬度坐标5个点
const points = [116.405285, 39.904989, 121.472644, 31.231706, 113.280637, 23.125178, 114.057868, 22.543099, 120.153576, 30.287459]

const getColor = () => '#' + Math.floor(Math.random() * 0xffffff).toString(16).padEnd(6, '0') // 随机16进制颜色

setCurveCollection(viewer, curveCollection => {

    curveCollection.add({ positions: points, color: getColor(), width: 2, opacity: 0.5, id: 'curve1', multiplier: 1 }) // 添加一条曲线

    // 随机生成 300 个曲线
    for (let i = 0; i < 300; i++) {

        const positions = Array.from({ length: 10 }, () => Math.random() * 360 - 180).reduce((acc, cur) => acc.concat(cur), [])

        curveCollection.add({ positions, color: getColor(), width: 2, opacity: 0.5, id: i, multiplier: 20 })

    }

})

/* 创建曲线合集 */
function setCurveCollection(viewer, callback) {

    /* 曲线算法 */
    function generateCurvePoints(flattenedPoints, multiplier = 30) {

        const numOfPoints = flattenedPoints.length / 2 * multiplier

        // 将一维数组转换为二维数组
        const points = [];

        for (let i = 0; i < flattenedPoints.length; i += 2) {

            points.push([flattenedPoints[i], flattenedPoints[i + 1]])

        }

        const times = points.map((_, index) => index / (points.length - 1))

        const cartesianPoints = points.map(point => Cesium.Cartesian3.fromDegrees(point[0], point[1]))

        const spline = new Cesium.CatmullRomSpline({

            times: times,

            points: cartesianPoints

        });

        const curvePoints = [];

        for (let i = 0; i < numOfPoints; i++) {

            const time = i / (numOfPoints - 1)

            curvePoints.push(spline.evaluate(time))

        }

        return curvePoints;

    }

    const curveCollection = {

        instances: [],

        add({ positions, color = '#fff', id = '', width = 1.0, opacity = 1, multiplier = 10 }) {

            if (!positions) return

            this.instances.push(new Cesium.GeometryInstance({

                geometry: new Cesium.PolylineGeometry({

                    positions: generateCurvePoints(positions, multiplier),

                    width,

                    vertexFormat: Cesium.PolylineColorAppearance.VERTEX_FORMAT

                }),

                attributes: {

                    color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromCssColorString(color).withAlpha(opacity))

                },

                id

            }))

        }

    }

    if (callback) callback(curveCollection)

    // 增加线集合到场景中
    viewer.scene.primitives.add(new Cesium.Primitive({

        geometryInstances: curveCollection.instances,

        appearance: new Cesium.PolylineColorAppearance()

    }))

}
