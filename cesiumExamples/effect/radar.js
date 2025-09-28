import * as Cesium from 'cesium'

const box = document.getElementById('box')

const viewer = new Cesium.Viewer(box, {
    animation: false,
    baseLayerPicker: false,
    baseLayer: Cesium.ImageryLayer.fromProviderAsync(
        Cesium.ArcGisMapServerImageryProvider.fromUrl(
            'https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer'
        )
    ),
    fullscreenButton: false,
    timeline: false,
    infoBox: false
})

// ================= RadarSolidScan 类实现 =================
class RadarSolidScan {
    constructor(options) {
        this.viewer = options.viewer
        this.id = options.id || 'radar'
        this.position = Cesium.Cartesian3.fromDegrees(...options.position, 0)
        this.longitude = options.position[0]
        this.latitude = options.position[1]
        this.shortwaveRange = options.shortwaveRange || 50000
        this.positionArr = []
        this.heading = 0
        this.tickListener = null
        this.addEntities()
        this.addPostRender()
    }

    addEntities() {
        this.entity = this.viewer.entities.add({
            id: this.id,
            position: this.position,
            wall: {
                positions: new Cesium.CallbackProperty(() => {
                    return Cesium.Cartesian3.fromDegreesArrayHeights(this.positionArr)
                }, false),
                material: Cesium.Color.fromCssColorString("#00dcff82"),
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 10.5e6)
            },
            ellipsoid: {
                radii: new Cesium.Cartesian3(
                    this.shortwaveRange,
                    this.shortwaveRange,
                    this.shortwaveRange
                ),
                maximumCone: Cesium.Math.toRadians(90),
                material: Cesium.Color.fromCssColorString("#00dcff82"),
                outline: true,
                outlineColor: Cesium.Color.fromCssColorString("#00dcff82"),
                outlineWidth: 1,
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0.0, 10.5e6)
            }
        })
    }

    addPostRender() {
        this.tickListener = this.viewer.clock.onTick.addEventListener(() => {
            this.heading += 1.0
            if (this.heading >= 360) this.heading = 0
            this.positionArr = this.calcPoints(
                this.longitude,
                this.latitude,
                this.shortwaveRange,
                this.heading
            )
        })
    }

    calcPoints(x1, y1, radius, heading) {
        const m = Cesium.Transforms.eastNorthUpToFixedFrame(
            Cesium.Cartesian3.fromDegrees(x1, y1)
        )
        const rad = Cesium.Math.toRadians(heading)
        const rx = radius * Math.cos(rad)
        const ry = radius * Math.sin(rad)
        const translation = Cesium.Cartesian3.fromElements(rx, ry, 0)
        const d = Cesium.Matrix4.multiplyByPoint(
            m,
            translation,
            new Cesium.Cartesian3()
        )
        const c = Cesium.Cartographic.fromCartesian(d)
        const x2 = Cesium.Math.toDegrees(c.longitude)
        const y2 = Cesium.Math.toDegrees(c.latitude)
        return this.computeCirclularFlight(x1, y1, x2, y2, 0, 90)
    }

    computeCirclularFlight(x1, y1, x2, y2, fx, angle) {
        let positionArr = []
        positionArr.push(x1, y1, 0)
        const radius = Cesium.Cartesian3.distance(
            Cesium.Cartesian3.fromDegrees(x1, y1),
            Cesium.Cartesian3.fromDegrees(x2, y2)
        )
        for (let i = fx; i <= fx + angle; i++) {
            const rad = Cesium.Math.toRadians(i)
            const h = radius * Math.sin(rad)
            const r = Math.cos(rad)
            const x = (x2 - x1) * r + x1
            const y = (y2 - y1) * r + y1
            positionArr.push(x, y, h)
        }
        return positionArr
    }

    clear() {
        if (this.tickListener) {
            this.tickListener()
            this.tickListener = null
        }
        if (this.viewer && this.id) {
            const entity = this.viewer.entities.getById(this.id)
            if (entity) {
                this.viewer.entities.remove(entity)
            }
        }
        this.positionArr = []
        this.heading = 0
    }

    destroy() {
        this.clear()
        this.viewer = null
    }

    stop() {
        if (this.tickListener) {
            this.tickListener()
            this.tickListener = null
        }
    }

    start() {
        if (!this.tickListener) {
            this.addPostRender()
        }
    }

    hide() {
        if (this.entity) this.entity.show = false
    }

    show() {
        if (this.entity) this.entity.show = true
    }
}

// ================= 使用示例 =================
const radar = new RadarSolidScan({
    viewer: viewer,
    id: 'radar1',
    position: [120, 36],
    shortwaveRange: 50000 // 50公里
})

viewer.flyTo(radar.entity)
