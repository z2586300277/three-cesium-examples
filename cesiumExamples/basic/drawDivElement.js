import * as Cesium from 'cesium'
const box = document.getElementById('box')
const viewer = new Cesium.Viewer(box, {
    animation: false, // 启用动画器件
    baseLayerPicker: false, // 是否显示图层选择器，右上角图层选择按钮
    baseLayer: Cesium.ImageryLayer.fromProviderAsync(Cesium.ArcGisMapServerImageryProvider.fromUrl(GLOBAL_CONFIG.getLayerUrl())),
    fullscreenButton: false, // 是否显示全屏按钮，右下角全屏选择按钮
    timeline: false, // 是否显示时间轴    
    infoBox: false, // 是否显示信息框   
})
// 隐藏Cesium Logo
viewer._cesiumWidget._creditContainer.style.display = "none";
// 启用地形深度测试，确保正确渲染
viewer.scene.globe.depthTestAgainstTerrain = false
/**
 * 设置相机初始视角
 * 将视角定位到飞行轨迹中心区域
 */
viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(118, 37, 1000), // 目标位置
    duration: 0  // 飞行时间（秒）
})
// ==================== 弹窗元素创建区域 ====================
const trackInfoElement = document.createElement('div')
// 设置弹窗样式：白底黑字，带阴影和圆角
Object.assign(trackInfoElement.style, {
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // 白色半透明背景
    color: 'black', // 黑色文字
    padding: '8px 12px', // 内边距
    borderRadius: '6px', // 圆角
    fontWeight: 'bold', // 粗体文字
    fontSize: '14px', // 字体大小
    position: 'absolute',
    textAlign: 'center',
    maxWidth: '100px' // 最小宽度
})
// 将弹窗元素添加到CSS容器中
box.appendChild(trackInfoElement)
// 监听场景更新事件
viewer.scene.preUpdate.addEventListener(updateTrackInfoPosition)
// ==================== 弹窗更新逻辑区域 ====================
function updateTrackInfoPosition() {
    // 将地球上的三维位置转换为屏幕坐标
    const windowCoord = Cesium.SceneTransforms.worldToWindowCoordinates(
        viewer.scene,      // 场景对象
        Cesium.Cartesian3.fromDegrees(118, 37, 1)    // 世界坐标
    )
    // 如果坐标转换成功，更新弹窗位置和内容
    if (windowCoord) {
        // 设置弹窗在屏幕上的位置
        trackInfoElement.style.left = windowCoord.x + 'px'
        trackInfoElement.style.top = windowCoord.y + 'px'
        trackInfoElement.style.display = 'block'
        // 更新弹窗内容，显示实时位置信息
        trackInfoElement.innerHTML = '你们瞎搞'
    } else {
        // 坐标转换失败时隐藏弹窗
        trackInfoElement.style.display = 'none'
    }
}