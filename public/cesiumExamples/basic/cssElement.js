import * as Cesium from 'cesium'

const box = document.getElementById('box')

// 创建一个专门用于放置2dDOM的容器
const css2dContainer = document.createElement('div')

Object.assign(css2dContainer.style, {

    position: 'absolute',

    top: '0',

    left: '0',

    pointerEvents: 'none',

    zIndex: '1',

})

box.appendChild(css2dContainer)

const viewer = new Cesium.Viewer(box, {

    animation: false,//是否创建动画小器件，左下角仪表    

    baseLayerPicker: false,//是否显示图层选择器，右上角图层选择按钮

    baseLayer: false, // 不显示默认图层

    fullscreenButton: false,//是否显示全屏按钮，右下角全屏选择按钮

    timeline: false,//是否显示时间轴    

    infoBox: false,//是否显示信息框   

})

const url = 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer'

const layer = Cesium.ImageryLayer.fromProviderAsync(

    Cesium.ArcGisMapServerImageryProvider.fromUrl(url)

)

viewer.imageryLayers.add(layer)

// 创建2dDOM
const DOM = document.createElement('div')

// 样式 
Object.assign(DOM.style, {

    width: '100px',

    height: '30px',

    border: '1px solid blue',

    color: 'white',

    fontSize: '20px',

    cursor: 'pointer'

})

DOM.innerHTML = '2dDOM'

setCss2dDom(viewer, DOM, [116.46, 39.92, 0]) // 设置2dDOM 移动

viewer.entities.add({ position: Cesium.Cartesian3.fromDegrees(116.46, 39.92), point: { pixelSize: 10 } }) // 创建测试点

viewer.camera.flyTo({ destination: Cesium.Cartesian3.fromDegrees(116.46, 39.92, 10000000) }) // 定位

/* 设置2dDOM 移动 */
function setCss2dDom(viewer, DOM, position) {

    if (!position) return

    if (!(position instanceof Cesium.Cartesian3)) position = Cesium.Cartesian3.fromDegrees(...position)

    Object.assign(DOM.style, {

        pointerEvents: 'all',

        zIndex: 'auto',

    })

    const { offsetHeight } = DOM

    const { camera, scene } = viewer

    css2dContainer.appendChild(DOM)

    const destroy = viewer.scene.postRender.addEventListener(() => {

        const windowCoord = Cesium.SceneTransforms.worldToWindowCoordinates(viewer.scene, position)

        if (windowCoord) {

            DOM.style.transform = `translate(${windowCoord.x}px, ${windowCoord.y - offsetHeight}px)`

        }

        const maxDistance = scene.globe.ellipsoid.cartesianToCartographic(camera.position).height + scene.globe.ellipsoid.maximumRadius

        Cesium.Cartesian3.distance(camera.position, position) > maxDistance ? DOM.style.display = 'none' : DOM.style.display = 'block'

    })

    return () => {

        viewer.css2dContainer.removeChild(DOM)

        destroy()

    }

}