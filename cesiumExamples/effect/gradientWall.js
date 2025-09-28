import * as Cesium from 'cesium'

// 获取Cesium容器元素，用于初始化Viewer
const box = document.getElementById('box')

// 初始化Cesium Viewer，配置相关选项
const viewer = new Cesium.Viewer(box, {
    // 禁用动画控件（左下角仪表）
    animation: false,
    // 禁用图层选择器（右上角图层选择按钮）
    baseLayerPicker: false,
    // 设置基础影像图层为ArcGIS影像服务
    baseLayer: Cesium.ImageryLayer.fromProviderAsync(Cesium.ArcGisMapServerImageryProvider.fromUrl('https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer')),
    // 禁用全屏按钮（右下角全屏选择按钮）
    fullscreenButton: false,
    // 禁用时间轴控件
    timeline: false,
    // 禁用信息框
    infoBox: false,
})

// 启用地形深度检测，使墙体能够贴合地形
viewer.scene.globe.depthTestAgainstTerrain = true
// 隐藏Cesium Logo版权信息
viewer._cesiumWidget._creditContainer.style.display = "none";

// 定义围墙的经纬度坐标和高度数据
// 格式为 [经度, 纬度, 高度...]，这里定义了一个矩形围墙
const positions = [
    115.6434, 28.76762, 10,  // 第一个点：东经115.6434度，北纬28.76762度，高度10米
    115.6432, 28.76762, 10,  // 第二个点：东经115.6432度，北纬28.76762度，高度10米
    115.6432, 28.76756, 10,  // 第三个点：东经115.6432度，北纬28.76756度，高度10米
    115.6434, 28.76756, 10,  // 第四个点：东经115.6434度，北纬28.76756度，高度10米
    115.6434, 28.76762, 10,  // 第五个点（闭合点）：回到第一个点位置
]

// 定义墙体的基本颜色
const color = Cesium.Color.YELLOW;

// 添加墙体实体到场景中
let wall = viewer.entities.add({
    wall: {
        // 设置墙体的位置，使用Cesium.Cartesian3.fromDegreesArrayHeights将经纬度高度数组转换为笛卡尔坐标
        positions: Cesium.Cartesian3.fromDegreesArrayHeights(positions),
        // 设置墙体材质，使用图像材质属性创建渐变效果
        material: new Cesium.ImageMaterialProperty({
            transparent: true,  // 启用透明度
            // 使用自定义函数生成渐变色带图像
            image: getColorRamp({
                0.0: color.withAlpha(1.0).toCssColorString(),  // 底部不透明黄色
                0.2: color.withAlpha(0.8).toCssColorString(),  // 20%高度处80%透明度
                0.4: color.withAlpha(0.6).toCssColorString(),  // 40%高度处60%透明度
                0.6: color.withAlpha(0.4).toCssColorString(),  // 60%高度处40%透明度
                0.8: color.withAlpha(0.2).toCssColorString(),  // 80%高度处20%透明度
                1.0: color.withAlpha(0.0).toCssColorString(),  // 顶部完全透明
            })
        }),
    }
});

// 缩放视角以完整显示创建的墙体
viewer.zoomTo(wall);

/**
 * 创建垂直渐变色带图像
 * @param {Object} val - 颜色值对象，键为位置比例(0.0-1.0)，值为CSS颜色字符串
 * @returns {HTMLCanvasElement} 包含垂直渐变的canvas元素
 */
function getColorRamp(val) {
    // 创建canvas元素用于绘制渐变色带
    const ramp = document.createElement('canvas');
    ramp.width = 1;      // 宽度为 1 像素（只需要垂直方向的渐变）
    ramp.height = 100;   // 高度为 100 像素
    
    // 获取2D绘图上下文
    const ctx = ramp.getContext("2d");
    
    // 创建垂直线性渐变，从顶部(0,0)到底部(0,100)
    const grd = ctx.createLinearGradient(0, 0, 0, 100);
    
    // 添加颜色断点到渐变中
    for (let key in val) {
        // 反转颜色位置，因为Canvas坐标系与我们期望的渐变方向相反
        grd.addColorStop(1 - Number(key), val[key]);
    }
    
    // 应用渐变填充整个canvas
    ctx.fillStyle = grd;
    ctx.fillRect(0, 0, 1, 100);
    
    // 返回生成的渐变图像
    return ramp;
}