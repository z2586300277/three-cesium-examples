/**
 * Cesium点位计算与绘制工具
 * 本工具提供交互式点位绘制功能，可以根据起始点、方位角和距离计算新点位坐标并绘制在地图上
 * 使用球面三角学算法保证计算精度
 * 
 * 功能说明：
 * 1. 用户点击"绘制原始点"按钮开始交互式绘制
 * 2. 在地图上点击选择起始点
 * 3. 输入方位角和距离参数
 * 4. 系统自动计算并绘制终点
 * 5. 调整视角以完整显示两个点
 */

// ==================== 导入模块和初始化 ====================
import * as Cesium from 'cesium'
import { GUI } from 'dat.gui'

// 获取地图容器元素
const box = document.getElementById('box')

// ==================== GUI控制面板 ====================
/** 
 * 定义图形绘制操作对象
 * @namespace obj
 */
const obj = {
  /** 
   * 绘制原始点功能 - 启动交互式绘制模式
   * @function
   * @memberof obj
   */
  '绘制原始点': () => {
    setupInteractiveDrawing()
  },
};

// 创建GUI控制面板并添加操作按钮
const gui = new GUI();
for (const key in obj) gui.add(obj, key)

// ==================== Cesium Viewer初始化 ====================
/**
 * 初始化Cesium Viewer实例
 * @type {Cesium.Viewer}
 */
const viewer = new Cesium.Viewer(box, {
  animation: false,              // 不显示动画控件
  baseLayerPicker: false,        // 不显示图层选择器
  baseLayer: Cesium.ImageryLayer.fromProviderAsync(
    Cesium.ArcGisMapServerImageryProvider.fromUrl('https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer')
  ),                             // 设置基础影像图层
  fullscreenButton: false,       // 不显示全屏按钮
  timeline: false,               // 不显示时间线
  infoBox: false,                // 不显示信息框
})

// 隐藏Cesium默认的Logo信息
viewer._cesiumWidget._creditContainer.style.display = "none";
// 添加瓦片坐标信息
viewer.imageryLayers.addImageryProvider(new Cesium.TileCoordinatesImageryProvider());
// ==================== 状态管理 ====================
/**
 * 存储已创建的实体对象，用于后续操作和清理
 * @type {Array<Cesium.Entity>}
 */
let entitys = [];

/**
 * 存储用户输入的距离值（米），用于视角调整
 * @type {number}
 */
let distance;

/**
 * 全局事件处理器引用，用于管理交互事件
 * @type {Cesium.ScreenSpaceEventHandler}
 */
let globalHandler = null;

// ==================== 交互功能 ====================
/**
 * 设置交互式绘制模式
 * 用户点击地图时绘制点，并请求输入方位角和距离以计算新点
 * 遵循事件管理规范，确保不会重复注册事件
 */
function setupInteractiveDrawing() {
  viewer.entities.removeAll();
  entitys = []; // 清空实体数组
  // 遵循事件管理规范：在注册新事件前清除旧事件避免重复注册
  if (globalHandler) {
    globalHandler.destroy();
    globalHandler = null;
  }
  // 创建屏幕空间事件处理器
  globalHandler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);

  // 注册鼠标左键点击事件
  globalHandler.setInputAction(function (movement) {
    // 获取点击位置的射线
    const ray = viewer.camera.getPickRay(movement.position);
    // 在地球上拾取点击位置
    const cartesian = viewer.scene.globe.pick(ray, viewer.scene);

    if (cartesian) {
      // 将笛卡尔坐标转换为地理坐标（经纬度）
      const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
      const lon = Cesium.Math.toDegrees(cartographic.longitude);
      const lat = Cesium.Math.toDegrees(cartographic.latitude);

      // 绘制第一个点（起始点）
      drawPointOnMap([lon, lat], '起点');

      // 遵循事件管理规范：完成一次绘制后清除事件处理器
      if (globalHandler) {
        globalHandler.destroy();
        globalHandler = null;
      }
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

/**
 * 在地图上绘制点
 * @param {Array<number>} coordinates - 坐标 [lon, lat]
 * @param {string} name - 点的名称（起点/终点）
 */
function drawPointOnMap(coordinates, name) {
  // 创建点实体并添加到Viewer中
  const pointEntity = viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(coordinates[0], coordinates[1]),
    point: {
      pixelSize: 15,                    // 点的像素大小
      color: Cesium.Color.RED,          // 点的颜色
      outlineColor: Cesium.Color.WHITE, // 点的边框颜色
      outlineWidth: 3                   // 点的边框宽度
    },
    label: {
      // 根据点的索引设置标签文本
      text: `${name}\n[${coordinates[0].toFixed(4)}, ${coordinates[1].toFixed(4)}]`,
      font: '16px sans-serif',          // 字体样式
      fillColor: Cesium.Color.WHITE,    // 字体颜色
      outlineColor: Cesium.Color.BLACK, // 字体边框颜色
      outlineWidth: 2,                  // 字体边框宽度
      style: Cesium.LabelStyle.FILL_AND_OUTLINE, // 标签样式
      verticalOrigin: Cesium.VerticalOrigin.BOTTOM, // 垂直对齐方式
      pixelOffset: new Cesium.Cartesian2(0, -15)    // 像素偏移量
    }
  });

  // 将创建的实体添加到实体数组中，便于后续管理
  entitys.push(pointEntity);

  // 根据点的类型执行不同操作
  if (name == '起点') {
    // 如果是起点，请求用户输入方位角和距离
    requestAngleAndDistance(coordinates[0], coordinates[1]);
  } else {
    // 如果是终点，调整视角以完整显示所有点
    viewer.flyTo(entitys, {
      duration: 1,
      offset: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(-90),
        range: distance * 1.5, // 根据距离调整视角范围
      },
    });
  }
}

/**
 * 弹出输入框请求方位角和距离
 * 使用setTimeout确保在事件处理完成后才弹出对话框
 * @param {number} lon - 起始点经度
 * @param {number} lat - 起始点纬度
 */
function requestAngleAndDistance(lon, lat) {
  setTimeout(() => {
    // 弹出提示框请求用户输入
    const value = prompt(
      `请输入方位角&距离(km/>0)\n45&10 表示从正北方向顺时针45度方向,距离10公里`,
      "45&10"
    );

    // 如果用户输入了值
    if (value) {
      // 按"-"分割输入值
      const splitValue = value.split("&");

      // 检查分割后的数组长度是否为2
      if (splitValue.length == 2) {
        // 解析方位角和距离
        const angle = parseFloat(splitValue[0]);
        distance = parseFloat(splitValue[1]) * 1000; // 转换为米

        // 检查解析后的值是否为有效数字
        if (!isNaN(angle) && distance > 0) {
          // 计算新点坐标
          const newCoordinates = newPointByAngleAndDistance(lon, lat, distance, angle);
          // 绘制新点
          drawPointOnMap(newCoordinates, '终点');
        } else {
          alert("输入格式不正确，请输入有效的数字");
          viewer.entities.removeAll();
          entitys = []; // 清空实体数组
        }
      } else {
        alert("输入格式不正确，请按照格式：方位角&距离");
        viewer.entities.removeAll();
        entitys = []; // 清空实体数组
      }
    }
  }, 500);
}

/**
 * 根据起始点、距离和角度计算新坐标点位置（方法1）
 * 使用球面三角学的公式计算，更精确但计算复杂度较高
 * 
 * 该方法基于球面三角学公式，考虑地球曲率的影响，适用于中短距离的坐标计算
 * 采用椭球体模型，通过线性插值计算不同纬度的地球半径
 * 
 * 球面三角学原理：
 * 在球面上，给定一个起始点和移动方向（方位角）及距离，可以计算出终点坐标
 * 使用了球面三角学中的正弦定律和余弦定律
 * 
 * @param {number} lon - 起始点经度（度）
 * @param {number} lat - 起始点纬度（度）
 * @param {number} distance - 距离（米）
 * @param {number} angle - 方位角（度），正北为0度，顺时针增加
 * @returns {Array<number>} [经度, 纬度] - 新点的经纬度坐标
 */
function newPointByAngleAndDistance(lon, lat, distance, angle) {
  // 将角度转换为弧度，因为三角函数需要弧度值
  let angleRad = (angle * Math.PI) / 180;

  // 根据纬度计算地球半径（地球是椭球体）
  // 赤道半径6378137米，极地半径6356752米
  // 纬度越高，半径越小，这里使用线性插值近似计算
  let R = 6378137 - ((6378137 - 6356752) * lat) / 90;

  // 将起始点的经纬度转换为弧度
  let latRad = (lat * Math.PI) / 180;
  let lonRad = (lon * Math.PI) / 180;

  // 使用球面三角学公式计算新点的纬度
  // 这是球面三角学中的正弦定律应用：
  // sin(newLat) = sin(latRad) * cos(distance/R) + cos(latRad) * sin(distance/R) * cos(angleRad)
  // 
  // 原理解释：
  // 1. 我们在球面上从起始点(latRad, lonRad)出发，沿着方位角angleRad方向移动distance距离
  // 2. distance/R 是在球面上移动的弧度（因为弧长=半径×弧度）
  // 3. 这个公式考虑了：
  //    - 起始点纬度的影响: sin(latRad) * cos(distance/R)
  //    - 方位角的影响: cos(latRad) * sin(distance/R) * cos(angleRad)
  // 4. 最终通过反正弦函数(asin)得到新点的纬度弧度值
  let newLat = Math.asin(
    Math.sin(latRad) * Math.cos(distance / R) +           // 起始点纬度分量：保持原有纬度的部分影响
    Math.cos(latRad) * Math.sin(distance / R) * Math.cos(angleRad)  // 方位角影响分量：方位角和移动距离共同决定的纬度变化
  );

  // 计算新点的经度
  // 使用球面三角学中的公式计算经度变化
  // 这里使用atan2函数确保结果在正确的象限内
  // 
  // 原理解释：
  // 1. atan2(y, x)函数用于计算从x轴到点(x,y)的弧度角，结果范围是[-π, π]
  // 2. 分子部分：Math.sin(angleRad) * Math.sin(distance / R) * Math.cos(latRad)
  //    表示东西向（经度方向）的变化分量
  // 3. 分母部分：Math.cos(distance / R) - Math.sin(latRad) * Math.sin(newLat)
  //    表示南北向（纬度方向）的变化分量
  // 4. 将这个角度变化量加到原始经度上，得到新点的经度
  let newLon =
    lonRad +
    Math.atan2(
      Math.sin(angleRad) * Math.sin(distance / R) * Math.cos(latRad),  // 东西向分量：方位角和距离在经度方向的投影
      Math.cos(distance / R) - Math.sin(latRad) * Math.sin(newLat)     // 南北向分量：考虑起始点和终点纬度影响的修正项
    );

  // 将计算出的弧度转换回角度
  newLat = (newLat * 180) / Math.PI;
  newLon = (newLon * 180) / Math.PI;

  return [newLon, newLat];
}