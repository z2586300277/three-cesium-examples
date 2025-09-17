import * as Cesium from 'cesium'
/**
 * Cesium飞行轨迹跟踪弹窗示例
 * 在飞行器沿轨迹移动时，显示一个跟随的弹窗显示当前位置信息
 */
// ==================== 初始化区域 ====================
/** 
 * 获取Cesium容器元素
 * @type {HTMLElement}
 */
const box = document.getElementById('box')
/**
 * 初始化Cesium Viewer实例
 * @type {Cesium.Viewer}
 */
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
    destination: Cesium.Cartesian3.fromDegrees(123, 34.32, 100000), // 目标位置
    duration: 0  // 飞行时间（秒）
})
// ==================== 弹窗元素创建区域 ====================
/**
 * 创建CSS元素 - 跟踪信息弹窗
 * 用于显示飞行器的实时位置信息
 * @type {HTMLDivElement}
 */
const trackInfoElement = document.createElement('div')
// 设置弹窗样式：白底黑字，带阴影和圆角
Object.assign(trackInfoElement.style, {
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // 白色半透明背景
    color: 'black', // 黑色文字
    padding: '8px 12px', // 内边距
    borderRadius: '6px', // 圆角
    fontWeight: 'bold', // 粗体文字
    fontSize: '14px', // 字体大小
    fontFamily: 'Arial, sans-serif', // 字体族
    zIndex: 'auto',
    position: 'absolute',
    transform: 'translate(-50%, -110%)', // 使元素中心对齐定位点上方
    textAlign: 'center',
    minWidth: '150px' // 最小宽度
})
// 将弹窗元素添加到CSS容器中
box.appendChild(trackInfoElement)

// ==================== 飞行轨迹数据区域 ====================
/**
 * 定义飞行轨迹点
 * 包含一系列经纬度和高度坐标，用于构建飞行路径
 * @type {Array<Cesium.Cartesian3>}
 */
const flightPositions = [
    Cesium.Cartesian3.fromDegrees(122.50, 34.70, 10000),   // 终点
    Cesium.Cartesian3.fromDegrees(123.46, 33.92, 10000),  // 起点：北京附近
]
// ==================== 飞行器实体创建区域 ====================
/**
 * 创建飞行路线实体
 * 在地图上可视化显示飞行轨迹
 * @type {Cesium.Entity}
 */
const flightPath = viewer.entities.add({
    name: '飞行路线',
    polyline: {
        positions: flightPositions,           // 路线点坐标
        width: 3,                             // 线条宽度
        material: Cesium.Color.RED, // 蓝色半透明材质
        clampToGround: false                  // 不贴地
    }
})
/**
 * 创建飞行器模型实体
 * 使用采样位置属性和速度方向属性实现沿轨迹移动
 * @type {Cesium.Entity}
 */
const myPoint = viewer.entities.add({
    position: new Cesium.SampledPositionProperty(), // 采样位置属性
    point: {
        pixelSize: 10,
        color: Cesium.Color.YELLOW,
    },
})

// ==================== 飞行路径设置区域 ====================

/**
 * 获取飞行器位置属性，用于设置轨迹点
 * @type {Cesium.SampledPositionProperty}
 */
const position = myPoint.position
/**
 * 每个轨迹点之间的时间间隔（秒）
 * @type {number}
 */
const timeStep = 20
/**
 * 创建时间序列，为每个轨迹点分配时间
 * 通过在不同时间点采样位置实现平滑移动效果
 */
for (let i = 0; i < flightPositions.length; i++) {
    // 计算当前点的时间戳
    const time = Cesium.JulianDate.addSeconds(
        viewer.clock.startTime,   // 起始时间
        i * timeStep,             // 时间偏移
        new Cesium.JulianDate()   // 结果时间
    )
    // 为该时间点添加位置采样
    position.addSample(time, flightPositions[i])
}
viewer.clock.shouldAnimate = true  // 启动动画
// 监听场景更新事件
viewer.scene.preUpdate.addEventListener(updateTrackInfoPosition)
function updateTrackInfoPosition() {
    // 获取飞行器在当前时间的精确位置
    const currentPosition = myPoint.position.getValue(viewer.clock.currentTime)
    // 如果飞行器位置存在，更新弹窗位置
    if (currentPosition) {
        // 将地球上的三维位置转换为屏幕坐标
        const windowCoord = Cesium.SceneTransforms.worldToWindowCoordinates(
            viewer.scene,      // 场景对象
            currentPosition    // 世界坐标
        )
        // 如果坐标转换成功，更新弹窗位置和内容
        if (windowCoord) {
            // 设置弹窗在屏幕上的位置
            trackInfoElement.style.left = windowCoord.x + 'px'
            trackInfoElement.style.top = windowCoord.y + 'px'
            trackInfoElement.style.display = 'block'
            // 将笛卡尔坐标转换为地理坐标（经纬度）
            const cartographic = Cesium.Cartographic.fromCartesian(currentPosition)
            // 格式化地理坐标信息
            const longitude = Cesium.Math.toDegrees(cartographic.longitude).toFixed(6)  // 经度
            const latitude = Cesium.Math.toDegrees(cartographic.latitude).toFixed(6)    // 纬度
            const height = cartographic.height.toFixed(0)  // 高度
            // 更新弹窗内容，显示实时位置信息
            trackInfoElement.innerHTML = `
                <div style="text-align: left;">
                    <div>经度: ${longitude}°</div>
                    <div>纬度: ${latitude}°</div>
                    <div>高度: ${height}米</div>
                </div>
            `
        } else {
            // 坐标转换失败时隐藏弹窗
            trackInfoElement.style.display = 'none'
        }
    } else {
        // 飞行器位置不存在时隐藏弹窗
        trackInfoElement.style.display = 'none'
    }
}