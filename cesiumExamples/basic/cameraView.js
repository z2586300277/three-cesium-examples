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
        aspectRatio: camera.frustum.aspectRatio, // 纵横比
        near: camera.frustum.near, // 近裁剪面距离
        far: camera.frustum.far // 远裁剪面距离
    },
    heading: camera.heading, // 偏航角 只读
    pitch: camera.pitch, // 俯仰角 只读
    roll: camera.roll, // 翻滚角 只读
})

function loadView(data) {
    if (data) {
        Math.random() > 0.5 ? viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(data.positionDegrees.longitude, data.positionDegrees.latitude
                , data.positionDegrees.height),
            orientation: {
                heading: data.heading,
                pitch: data.pitch,
                roll: data.roll
            }
        }) : camera.setView({
            destination: data.position,
            orientation: {
                heading: data.heading,
                pitch: data.pitch,
                roll: data.roll
            }
        })
    } else {
        slert('没有保存的视角数据')
    }
}

const camera = viewer.camera // 获取相机对象

let data = sessionStorage.getItem('TCE_savedView')
if (data) {

    data = JSON.parse(data)

    camera.positionWC.x = data.position.x // 设置相机位置
    camera.positionWC.y = data.position.y
    camera.positionWC.z = data.position.z
    camera.directionWC.x = data.direction.x // 设置相机方向
    camera.directionWC.y = data.direction.y
    camera.directionWC.z = data.direction.z
    camera.upWC.x = data.up.x // 设置相机上方向
    camera.upWC.y = data.up.y
    camera.upWC.z = data.up.z
    camera.frustum.fov = data.frustum.fov // 设置视场角
    camera.frustum.aspectRatio = data.frustum.aspectRatio // 设置纵横比
    camera.frustum.near = data.frustum.near // 设置近裁剪面距离
    camera.frustum.far = data.frustum.far // 设置远裁剪面距离

}


gui.add({
    '保存视角': () => {
        const savedView = saveView()
        sessionStorage.setItem('TCE_savedView', JSON.stringify(savedView))
        alert('视角已保存')
    }
}, '保存视角')

gui.add({
    '恢复保存视角': () => {
        loadView(JSON.parse(sessionStorage.getItem('TCE_savedView')))
    }
}, '恢复保存视角')