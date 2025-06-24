import * as Cesium from 'cesium'
import { GUI } from 'dat.gui'

const box = document.getElementById('box')

const viewer = new Cesium.Viewer(box, {

    animation: false,//是否创建动画小器件，左下角仪表    

    baseLayerPicker: false,//是否显示图层选择器，右上角图层选择按钮

    baseLayer: Cesium.ImageryLayer.fromProviderAsync(Cesium.ArcGisMapServerImageryProvider.fromUrl('https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer')),

    fullscreenButton: false,//是否显示全屏按钮，右下角全屏选择按钮

    timeline: false,//是否显示时间轴    

    infoBox: false,//是否显示信息框   

})

const gui = new GUI()

const cartesian3ToDegrees = (cartesian3) => {
    const cartographic = Cesium.Cartographic.fromCartesian(cartesian3)
    return {
        longitude: Cesium.Math.toDegrees(cartographic.longitude),
        latitude: Cesium.Math.toDegrees(cartographic.latitude),
        height: cartographic.height
    }
}

const saveView = () => ({
    positionDegrees: cartesian3ToDegrees(camera.positionWC), // 经纬度坐标
    position: camera.positionWC, // 笛卡尔坐标
    direction: camera.directionWC, // 方向
    up: camera.upWC,  // 上方向
    frustum: {
        fov: camera.frustum.fov, // 视场角
        near: camera.frustum.near, // 近裁剪面距离
        far: camera.frustum.far // 远裁剪面距离
    },
    heading: camera.heading, // 偏航角 只读
    pitch: camera.pitch, // 俯仰角 只读
    roll: camera.roll, // 翻滚角 只读
})

function loadView(view) {
    if (view) {
        Math.random() > 0.5 ? viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(view.positionDegrees.longitude, view.positionDegrees.latitude
                , view.positionDegrees.height),
            orientation: {
                heading: view.heading,
                pitch: view.pitch,
                roll: view.roll
            }
        }) : camera.setView({
            destination: view.position,
            orientation: {
                heading: view.heading,
                pitch: view.pitch,
                roll: view.roll
            }
        })
    } else {
        slert('没有保存的视角数据')
    }
}

const camera = viewer.camera // 获取相机对象

let storage = JSON.parse(sessionStorage.getItem('TCE_savedView'))
if (!storage) storage = {
    url: FILE_HOST + '/examples/coffeeMug/coffeeMug.glb', // FILE_HOST + '/examples/coffeeMug/coffeeMug.glb'
    view: null
}

if (storage.view) {
    const { view } = storage
    camera.positionWC.x = view.position.x // 设置相机位置
    camera.positionWC.y = view.position.y
    camera.positionWC.z = view.position.z
    camera.directionWC.x = view.direction.x // 设置相机方向
    camera.directionWC.y = view.direction.y
    camera.directionWC.z = view.direction.z
    camera.upWC.x = view.up.x // 设置相机上方向
    camera.upWC.y = view.up.y
    camera.upWC.z = view.up.z
    camera.frustum.fov = view.frustum.fov // 设置视场角
    camera.frustum.near = view.frustum.near // 设置近裁剪面距离
    camera.frustum.far = view.frustum.far // 设置远裁剪面距离

    if (storage.url) {
        Cesium.Model.fromGltfAsync({
            url: storage.url,
            minimumPixelSize: 128,
            maximumScale: 200,
            modelMatrix: Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(139.767052, 35.681167, 0)),
        }).then(model => {
            viewer.scene.primitives.add(model)
        })
    }
}


gui.add({
    '保存视角': () => {
        storage.view = saveView()
        sessionStorage.setItem('TCE_savedView', JSON.stringify(storage))
        alert('视角已保存')
    }
}, '保存视角')

gui.add({
    '恢复保存视角': () => {
        const s = JSON.parse(sessionStorage.getItem('TCE_savedView'))
        if (s && s.view) loadView(s.view)
        else alert('没有保存的视角数据')
    }
}, '恢复保存视角')


gui.add(storage, 'url')
gui.add({
    '加载模型': () => {
        Cesium.Model.fromGltfAsync({
            url: storage.url,
            minimumPixelSize: 128,
            maximumScale: 200,
            modelMatrix: Cesium.Transforms.eastNorthUpToFixedFrame(Cesium.Cartesian3.fromDegrees(139.767052, 35.681167, 0)),
        }).then(model => {
            viewer.scene.primitives.add(model)
            viewer.camera.flyTo({ destination: Cesium.Cartesian3.fromDegrees(139.767052, 35.681167, 500) })
        })
    }
}, '加载模型')