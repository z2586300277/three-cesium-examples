/**
 * Cesium角度计算与线段绘制工具
 * 本工具提供交互式线段绘制功能，可以绘制线段并实时计算线段的角度信息
 * 
 * 功能说明：
 * 1. 用户点击"绘制线段"按钮开始交互式绘制
 * 2. 在地图上点击选择线段起点
 * 3. 移动鼠标实时显示临时线段和角度信息
 * 4. 点击第二个点确定线段终点，完成绘制
 * 5. 右键点击结束绘制模式
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
   * 绘制线段功能 - 启动交互式线段绘制模式
   * @function
   * @memberof obj
   */
  '绘制线段': () => {
    initLineDrawing()
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

// 添加瓦片坐标信息图层，便于调试和查看地图瓦片信息
viewer.imageryLayers.addImageryProvider(new Cesium.TileCoordinatesImageryProvider());

// ==================== 状态管理 ====================
/**
 * 全局事件处理器引用，用于管理交互事件
 * @type {Cesium.ScreenSpaceEventHandler}
 */
let globalHandler = null;

/**
 * 存储线段绘制过程中的点坐标
 * @type {Array<Cesium.Cartesian3>}
 */
let drawLinePositions = [];

/**
 * 临时线条实体，用于实时显示绘制过程中的线段
 * @type {Cesium.Entity}
 */
let tempLineEntity = null;

/**
 * 距离标签实体，用于显示线段的角度信息
 * @type {Cesium.Entity}
 */
let distanceLabelEntity = null;

// ==================== 交互功能 ====================
/**
 * 初始化绘制线功能
 * 注册鼠标事件处理程序，实现交互式线段绘制
 */
function initLineDrawing() {
  viewer.entities.removeAll();
  tempLineEntity = null;
  distanceLabelEntity = null;
  drawLinePositions = [];
  // 遵循事件管理规范：在注册新事件前清除旧事件避免重复注册
  if (globalHandler) {
    globalHandler.destroy();
    globalHandler = null
  }
  // 创建屏幕空间事件处理器
  globalHandler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);
  // 注册鼠标左键点击事件 - 用于确定线段的端点
  globalHandler.setInputAction(function (movement) {
    // 获取点击位置的笛卡尔坐标
    const cartesian = viewer.scene.pickPosition(movement.position);

    // 如果成功获取到坐标
    if (cartesian) {
      // 将坐标添加到绘制线的点数组中
      drawLinePositions.push(cartesian);

      // 在点击位置添加一个标记点
      viewer.entities.add({
        position: cartesian,
        point: {
          pixelSize: 10,                    // 点的像素大小
          color: Cesium.Color.RED,       // 点的颜色
          outlineColor: Cesium.Color.WHITE, // 点的边框颜色
          outlineWidth: 3                   // 点的边框宽度
        },
      });

      // 如果已经有两个点，则创建永久线段
      if (drawLinePositions.length === 2) {
        // 创建永久线条实体
        viewer.entities.add({
          polyline: {
            positions: [
              drawLinePositions[0],
              drawLinePositions[1]
            ],
            width: 5,                                   // 线条宽度
            material: Cesium.Color.RED.withAlpha(1),    // 红色不透明线条
            clampToGround: true                         // 贴地绘制
          }
        });

        // 遵循事件管理规范：在注册新事件前清除旧事件避免重复注册
        if (globalHandler) {
          globalHandler.destroy();
          globalHandler = null
        }
        // 计算并显示线段的角度信息
        updateRealTimeAngle(drawLinePositions[0], drawLinePositions[1]);
      }
    } else {
      // 如果没有获取到坐标，提示点击位置不在地球上
      alert('点击位置不在地球表面');
    }
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

  // 注册鼠标移动事件，用于实时绘制临时线条和角度信息
  globalHandler.setInputAction(function (movement) {
    // 获取鼠标位置的笛卡尔坐标
    const cartesian = viewer.scene.pickPosition(movement.endPosition);

    // 如果成功获取到坐标且至少有一个点
    if (cartesian && drawLinePositions.length > 0) {
      // 如果存在之前的临时线条，则更新其位置
      if (tempLineEntity) {
        // 更新临时线条的点集合
        tempLineEntity.polyline.positions = [
          drawLinePositions[0],
          cartesian
        ];
      } else {
        // 否则创建新的临时线条实体
        tempLineEntity = viewer.entities.add({
          polyline: {
            positions: [
              drawLinePositions[0],
              cartesian
            ],
            width: 3,                                    // 临时线条较细
            material: Cesium.Color.RED.withAlpha(0.5),   // 半透明红色
            clampToGround: true                          // 贴地绘制
          }
        });
      }

      // 实时计算并显示当前两点间的角度信息
      if (drawLinePositions.length >= 1) {
        updateRealTimeAngle(drawLinePositions[0], cartesian);
      }
    }
  }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
}

/**
 * 实时更新临时线段的角度显示
 * @param {Cesium.Cartesian3} point1 - 起始点
 * @param {Cesium.Cartesian3} point2 - 终止点（当前鼠标位置）
 */
function updateRealTimeAngle(point1, point2) {
  // 以第一个点为原点建立局部坐标系（东方向为x轴,北方向为y轴,垂直于地面为z轴）
  // 得到一个局部坐标到世界坐标转换的变换矩阵
  const localToWorld = Cesium.Transforms.eastNorthUpToFixedFrame(point1);

  // 求世界坐标到局部坐标的变换矩阵
  const worldToLocal = Cesium.Matrix4.inverse(localToWorld, new Cesium.Matrix4());

  // A点在局部坐标的位置，其实就是局部坐标原点
  const localPosition_A = Cesium.Matrix4.multiplyByPoint(
    worldToLocal,
    point1,
    new Cesium.Cartesian3()
  );

  // B点在以A点为原点的局部的坐标位置
  const localPosition_B = Cesium.Matrix4.multiplyByPoint(
    worldToLocal,
    point2,
    new Cesium.Cartesian3()
  );

  // 计算角度（弧度）
  const angle = Math.atan2(
    localPosition_B.x - localPosition_A.x,
    localPosition_B.y - localPosition_A.y
  );

  // 转换为角度（0-360度）
  let theta = angle * (180 / Math.PI);
  if (theta < 0) {
    theta = theta + 360;
  }

  // 计算线段中点，用于放置角度标签
  const midPoint = Cesium.Cartesian3.midpoint(point1, point2, new Cesium.Cartesian3());

  // 如果距离标签实体已存在，则更新其位置和文本
  if (distanceLabelEntity) {
    distanceLabelEntity.position = midPoint;
    distanceLabelEntity.label.text = `${theta.toFixed(3)}°`;
  } else {
    // 否则创建新的距离标签实体
    distanceLabelEntity = viewer.entities.add({
      position: midPoint,
      label: {
        text: `${theta.toFixed(3)}°`,        // 显示角度值，保留两位小数
        font: '18px sans-serif',              // 字体样式
        fillColor: Cesium.Color.WHITE,        // 字体颜色
        outlineColor: Cesium.Color.BLACK,     // 字体边框颜色
        outlineWidth: 0,                      // 字体边框宽度
        style: Cesium.LabelStyle.FILL_AND_OUTLINE, // 标签样式
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM, // 垂直对齐方式
      }
    });
  }
}