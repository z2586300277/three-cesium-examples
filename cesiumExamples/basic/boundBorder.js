import * as Cesium from 'cesium'

const TDT_TOKEN = 'c4e3a9d54b4a79e885fff9da0fca712a'
const box = document.getElementById('box')

const viewer = new Cesium.Viewer(box, {
    animation: false,
    baseLayerPicker: false,
    baseLayer: false,
    fullscreenButton: false,
    geocoder: false,
    homeButton: false,
    sceneModePicker: false,
    navigationHelpButton: false,
    selectionIndicator: false,
    timeline: false,
    infoBox: false,
    scene3DOnly: true,
    orderIndependentTranslucency: false,
    contextOptions: { webgl: { alpha: true } },
    skyBox: new Cesium.SkyBox({ show: false }),
    requestRenderMode: false,
})

viewer.scene.sun.show = false
viewer.scene.moon.show = false
viewer.scene.skyBox.show = false
viewer.scene.backgroundColor = new Cesium.Color(0, 0, 0, 0)
viewer.resolutionScale = window.devicePixelRatio * 2
viewer.scene.globe.maximumScreenSpaceError = 1
viewer.scene.globe.tileCacheSize = 1000
viewer.scene.fog.enabled = false
viewer.scene.postProcessStages.fxaa.enabled = false
viewer._cesiumWidget._creditContainer.style.display = 'none'

function addTdt(layer, max = 18) {
    viewer.imageryLayers.addImageryProvider(new Cesium.WebMapTileServiceImageryProvider({
        url: `https://t{s}.tianditu.gov.cn/${layer}_w/wmts?tk=${TDT_TOKEN}&service=wmts&request=GetTile&version=1.0.0&LAYER=${layer}&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles`,
        layer,
        style: 'default',
        format: 'tiles',
        tileMatrixSetID: 'GoogleMapsCompatible',
        minimumLevel: 1,
        maximumLevel: max,
        subdomains: ['0', '1', '2', '3', '4', '5', '6', '7']
    }))
}

addTdt('img', 18)
addTdt('cva', 18)

async function init() {
    const geojson = await (await fetch('https://z2586300277.github.io/file-server/data/china_geo_bound.json')).json()
    const geom = geojson.features[0].geometry
    const ring = geom.type === 'Polygon' ? geom.coordinates[0] : geom.coordinates[0][0]
    const positions = ring.flatMap(([lng, lat]) => [lng, lat])

    const line = viewer.entities.add({
        polyline: {
            positions: Cesium.Cartesian3.fromDegreesArray(positions),
            width: 5,
            material: Cesium.Color.fromCssColorString('#6dcdeb'),
        }
    })

    viewer.flyTo(line, { duration: 1.5 })
}

init()
