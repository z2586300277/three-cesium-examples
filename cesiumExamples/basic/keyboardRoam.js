import * as Cesium from "cesium";
import { GUI } from 'dat.gui';

// 获取用于渲染Cesium场景的容器元素
const box = document.getElementById('box')

// ==================== 初始化区域 ====================
/**
 * 初始化Cesium Viewer
 * @type {Cesium.Viewer}
 */
const viewer = new Cesium.Viewer(box, {
  animation: false,           // 是否创建动画小器件，左下角仪表    
  baseLayerPicker: false,     // 是否显示图层选择器，右上角图层选择按钮
  baseLayer: Cesium.ImageryLayer.fromProviderAsync(Cesium.ArcGisMapServerImageryProvider.fromUrl('https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer')),
  fullscreenButton: false,    // 是否显示全屏按钮，右下角全屏选择按钮
  timeline: false,            // 是否显示时间轴    
  infoBox: false,             // 是否显示信息框   
});

// 隐藏Cesium Logo
viewer._cesiumWidget._creditContainer.style.display = "none";

/** 
 * 创建GUI控制面板
 * @type {dat.GUI}
 */
const gui = new GUI();
// 添加瓦片坐标信息
viewer.imageryLayers.addImageryProvider(new Cesium.TileCoordinatesImageryProvider());

// ==================== 状态管理区域 ====================
// 定义事件组 - 用于跟踪键盘按键状态
let flags = {
  // 相机姿态控制相关标志
  pitchUp: false,      // 俯仰角向上
  pitchDown: false,    // 俯仰角向下
  rollLeft: false,     // 翻滚角向左
  rollRight: false,    // 翻滚角向右
  headingLeft: false,  // 偏航角向左
  headingRight: false, // 偏航角向右

  // 相机位置移动相关标志
  moveForward: false,  // 相机自身向前平移
  moveBackward: false, // 相机自身向后平移
  moveLeft: false,     // 相机自身向左平移
  moveRight: false,    // 相机自身向右平移
  moveUp: false,       // 相机自身向上平移
  moveDown: false,     // 相机自身向下平移
  key1: false,         // 相机视角向上旋转
  key2: false,         // 相机视角向下旋转
  key3: false,         // 相机视角向左旋转
  key4: false,         // 相机视角向右旋转
  // 新增的控制标志
  arrowUp: false,      // 地球沿经度向北自转
  arrowDown: false,    // 地球沿经度向南自转
  arrowLeft: false,    // 地球沿纬度向东自转
  arrowRight: false,   // 地球沿纬度向西自转
};

// 相机相关变量
let cameraHeight;  // 相机高度
let heading;       // 相机偏航角
let pitch;         // 相机俯仰角
let roll;          // 相机翻滚角

// 事件处理器引用 - 用于后续移除事件监听器
let tickHandler;      // 帧更新事件处理器
let keyDownHandler;   // 键盘按下事件处理器
let keyUpHandler;     // 键盘释放事件处理器

// 启用地形深度测试，确保正确渲染
viewer.scene.globe.depthTestAgainstTerrain = true;

// ==================== GUI控制区域 ====================
/** 
 * 定义键盘漫游操作对象
 * @namespace keyboardRoamObj
 */
const keyboardRoamObj = {
  '启动键盘漫游': () => {
    if (viewer) {
      startKeyboardRoam(1);
    }
  },
  '停止键盘漫游': () => {
    quitKeyboardRoam();
  },
  '重置视角': () => {
    // 重置相机到默认视角
    viewer.camera.flyHome(1);
  },
  '使用说明': () => {
    const instructions = `
键盘控制说明:
====================
相机姿态控制 (WASDQE):
  W : 向上俯仰视角
  S : 向下俯仰视角
  A : 向左偏航视角
  D : 向右偏航视角
  Q : 向左翻滚视角
  E : 向右翻滚视角
相机位置移动 (IJKLUO):
  I : 向前移动相机
  K : 向后移动相机
  J : 向左移动相机
  L : 向右移动相机
  U : 向上移动相机
  O : 向下移动相机
观察方向控制 (数字键1234):
  1 : 向上观察
  2 : 向下观察
  3 : 向左观察
  4 : 向右观察
地球自转控制 (方向键):
  ↑ : 地球向北自转
  ↓ : 地球向南自转
  ← : 地球向东自转
  → : 地球向西自转
    `;
    alert(instructions);
  }
};

// 将操作对象添加到GUI控制面板
for (const key in keyboardRoamObj) gui.add(keyboardRoamObj, key)

// ==================== 功能操作区域 ====================
/**
 * 键盘漫游加载方法
 * @param {Number} setStep - 相机视角移动步长
 */
function startKeyboardRoam(setStep) {
  // 如果已经存在漫游功能，先停止它
  if (tickHandler) {
    quitKeyboardRoam();
  }

  // 添加键盘按下事件监听器
  document.addEventListener(
    "keydown",
    keyDownHandler = function (e) {
      let flagName = getFlagFromKeyboard(e);
      if (typeof flagName !== "undefined") {
        flags[flagName] = true;
      }
    },
    false
  );

  // 禁用鼠标控制相机平移和倾斜，避免与键盘控制冲突
  viewer.scene.screenSpaceCameraController.enableTranslate = false;  // 禁用平移
  viewer.scene.screenSpaceCameraController.enableTilt = false;       // 禁用倾斜

  // 添加键盘释放事件监听器
  document.addEventListener(
    "keyup",
    keyUpHandler = function (e) {
      let flagName = getFlagFromKeyboard(e);
      if (typeof flagName !== "undefined") {
        flags[flagName] = false;
      }
    },
    false
  );

  // 添加每帧更新事件监听器
  tickHandler = viewer.clock.onTick.addEventListener(() => {
    let camera = viewer.camera;
    let ellipsoid = viewer.scene.globe.ellipsoid;
    // 获取当前相机高度
    cameraHeight = ellipsoid.cartesianToCartographic(camera.position).height;
    // 根据相机高度动态调整移动速率，高度越高移动越快
    let moveRate = (cameraHeight / 150.0) * setStep;
    // 获取当前相机姿态（偏航角、俯仰角、翻滚角）
    heading = camera.heading;
    pitch = camera.pitch;
    roll = camera.roll;
    if (flags.headingLeft) {
      hprSetting(-0.005 * setStep, 0, 0);
    }
    if (flags.headingRight) {
      hprSetting(0.005 * setStep, 0, 0);
    }
    if (flags.pitchUp) {
      hprSetting(0, 0.01 * setStep, 0);
    }
    if (flags.pitchDown) {
      hprSetting(0, -0.01 * setStep, 0);
    }
    if (flags.rollLeft) {
      hprSetting(0, 0, 0.01 * setStep);
    }
    if (flags.rollRight) {
      hprSetting(0, 0, -0.01 * setStep);
    }
    // （zoomIn与moveForward效果相同）
    if (flags.moveForward) {
      camera.zoomIn(moveRate);
      // camera.moveForward(moveRate);
    }
    // （zoomOut与moveBackward效果相同）
    if (flags.moveBackward) {
      camera.zoomOut(moveRate);
      // camera.moveBackward(moveRate);
    }
    if (flags.moveUp) {
      camera.moveUp(moveRate);
    }
    if (flags.moveDown) {
      camera.moveDown(moveRate);
    }
    if (flags.moveLeft) {
      camera.moveLeft(moveRate);
    }
    if (flags.moveRight) {
      camera.moveRight(moveRate);
    }
    if (flags.key1) {
      camera.lookUp(Cesium.Math.toRadians(setStep))
    }
    if (flags.key2) {
      camera.lookDown(Cesium.Math.toRadians(setStep))
    }
    if (flags.key3) {
      camera.lookLeft(Cesium.Math.toRadians(setStep))
    }
    if (flags.key4) {
      camera.lookRight(Cesium.Math.toRadians(setStep))
    }
    if (flags.arrowUp) {
      camera.rotateDown(Cesium.Math.toRadians(setStep))
    }
    if (flags.arrowDown) {
      camera.rotateUp(Cesium.Math.toRadians(setStep))
    }
    if (flags.arrowLeft) {
      camera.rotateLeft(Cesium.Math.toRadians(setStep))
    }
    if (flags.arrowRight) {
      camera.rotateRight(Cesium.Math.toRadians(setStep))
    }
  });
}

/**
 * 相机姿态设置方法
 * @param {number} h - 偏航角调整量
 * @param {number} p - 俯仰角调整量
 * @param {number} r - 翻滚角调整量
 */
function hprSetting(h, p, r) {
  viewer.camera.setView({
    orientation: {
      heading: heading + h,  // 偏航角
      pitch: pitch + p,      // 俯仰角
      roll: roll + r,        // 翻滚角
    },
  });
}

/**
 * 监听键盘按下和松开的状态
 * @param {KeyboardEvent} k - 键盘事件
 * @returns {string|undefined} 对应的标志名称
 */
function getFlagFromKeyboard(k) {
  switch (k.key) {
    // 按字符的Unicode编码
    // 相机姿态操控（WASDQE控制相机视角）
    case "w":
      return "pitchUp";       // W键 - 向上俯仰
    case "s":
      return "pitchDown";     // S键 - 向下俯仰
    case "a":
      return "headingLeft";   // A键 - 向左偏航
    case "d":
      return "headingRight";  // D键 - 向右偏航
    case "q":
      return "rollLeft";      // Q键 - 向左翻滚
    case "e":
      return "rollRight";     // E键 - 向右翻滚
    // 相机位置操控（IJKLUO控制相机移动）
    case "i":
      return "moveForward";   // I键 - 向前移动
    case "k":
      return "moveBackward";  // K键 - 向后移动
    case "j":
      return "moveLeft";      // J键 - 向左移动
    case "l":
      return "moveRight";     // L键 - 向右移动
    case "u":
      return "moveUp";        // U键 - 向上移动
    case "o":
      return "moveDown";      // O键 - 向下移动
    case "1":
      return "key1";          // 数字键1
    case "2":
      return "key2";          // 数字键2
    case "3":
      return "key3";          // 数字键3
    case "4":
      return "key4";          // 数字键4
    case "ArrowUp":
      return "arrowUp";       // 方向键上
    case "ArrowDown":
      return "arrowDown";     // 方向键下
    case "ArrowLeft":
      return "arrowLeft";     // 方向键左
    case "ArrowRight":
      return "arrowRight";    // 方向键右
    // 未匹配的按键
    default:
      return undefined;
  }
}

/**
 * 销毁键盘漫游事件 - 清理所有事件监听器并重置状态
 */
function quitKeyboardRoam() {
  // 移除键盘按下事件监听器
  if (keyDownHandler) {
    document.removeEventListener("keydown", keyDownHandler, false);
    keyDownHandler = null;
  }

  // 移除键盘释放事件监听器
  if (keyUpHandler) {
    document.removeEventListener("keyup", keyUpHandler, false);
    keyUpHandler = null;
  }

  // 移除帧更新事件监听器
  if (tickHandler) {
    viewer.clock.onTick.removeEventListener(tickHandler);
    tickHandler = null;
  }

  // 解除禁用鼠标移动地图事件，恢复默认控制
  if (viewer) {
    viewer.scene.screenSpaceCameraController.enableTranslate = true;  // 恢复平移
    viewer.scene.screenSpaceCameraController.enableTilt = true;       // 恢复倾斜
  }

  // 重置所有标志为false状态
  for (let flag in flags) {
    flags[flag] = false;
  }
}
