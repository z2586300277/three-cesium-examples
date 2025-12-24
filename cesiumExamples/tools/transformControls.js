/**
 * Cesium Transform Controls - 模型变换控制器演示
 * 本案例演示了 cesium-transform-controls 插件的核心功能
 * 
 * 功能说明：
 * 1. 支持模型的平移（translate）、旋转（rotate）、缩放（scale）三种变换模式
 * 2. 支持局部坐标系（local）和地表坐标系（surface）两种坐标模式
 * 3. 支持对整个模型（Model）或模型子节点（ModelNode）进行变换操作
 * 4. 实时显示模型的位置、旋转角度和缩放信息
 * 
 * 依赖：
 * - cesium-transform-controls: https://github.com/123164867376464646/cesium-transform-controls
 * 
 * @author 123164867376464646
 */

// ==================== 导入模块 ====================
import * as Cesium from 'cesium'
import { CoordinateMode, Gizmo, GizmoMode } from 'cesium-transform-controls'
import { GUI } from 'dat.gui'

console.log(Cesium.VERSION)

// ==================== Cesium Viewer 初始化 ====================
/**
 * 初始化 Cesium Viewer 实例
 * @type {Cesium.Viewer}
 */

// 获取地图容器元素
const box = document.getElementById('box')

const viewer = new Cesium.Viewer(box, {
  baseLayerPicker: false,       // 不显示图层选择器
  geocoder: false,              // 不显示地理编码器
  homeButton: false,            // 不显示主页按钮
  sceneModePicker: false,       // 不显示场景模式选择器
  navigationHelpButton: false,  // 不显示导航帮助按钮
  animation: false,             // 不显示动画控件
  timeline: false,              // 不显示时间线
  infoBox: false,               // 不显示信息框
})

// ==================== 模型加载配置 ====================
/** 模型基准经度 */
const baseLon = 106.58446188
/** 模型基准纬度 */
const baseLat = 29.57088337
/** 模型基准高度 */
const baseHeight = 0

/**
 * 异步加载 glTF 模型
 * @type {Cesium.Model}
 */
const model = await Cesium.Model.fromGltfAsync({
  url: 'https://cesium-transform-controls.netlify.app/luaz.glb',
  modelMatrix: Cesium.Transforms.headingPitchRollToFixedFrame(
    Cesium.Cartesian3.fromDegrees(baseLon, baseLat, baseHeight),
    new Cesium.HeadingPitchRoll(
      Cesium.Math.toRadians(0),
      Cesium.Math.toRadians(0),
      Cesium.Math.toRadians(0)
    ),
  ),
  scale: 10,
})
viewer.scene.primitives.add(model)

// ==================== Gizmo 控制器初始化 ====================
/**
 * 创建 Gizmo 变换控制器实例
 * @type {Gizmo}
 */
const gizmo = new Gizmo({
  /**
   * Gizmo 拖拽移动时的回调函数
   * 用于实时更新 GUI 中显示的坐标信息
   * @param {Object} event - 事件对象
   */
  onGizmoPointerMove: (event) => {
    updateCoordinatesFromMatrix(gizmo._mountedPrimitive)
  },
})
gizmo.attach(viewer)

// ==================== GUI 控制面板配置 ====================
/**
 * GUI 控制面板设置项
 */
const settings = {
  transformMode: 'translate',   // 变换模式：translate/rotate/scale
  translateMode: 'local',       // 坐标模式：local/surface
  enabled: true,                // 是否启用 Gizmo
  // 位置信息显示
  longitude: '0.000000',        // 经度
  latitude: '0.000000',         // 纬度
  height: '0.00',               // 高度（米）
  // 旋转角度显示（度）
  rotateX: '0.00',
  rotateY: '0.00',
  rotateZ: '0.00',
  // 缩放比例显示
  scaleX: '1.00',
  scaleY: '1.00',
  scaleZ: '1.00',
}

// 设置 Gizmo 初始模式
gizmo.setMode(settings.transformMode)
gizmo.coordinateMode = CoordinateMode.local

// 创建 GUI 控制面板
const gui = new GUI({ name: '变换控制器' })

/** 坐标模式控制器引用（用于在 scale 模式时禁用） */
let translateModeController = null
/** 保存的坐标模式（用于从 scale 模式切换回来时恢复） */
let savedCoordinateMode = 'local'

// ==================== 变换模式控制 ====================
/**
 * 添加变换模式选择器
 * - translate: 平移模式
 * - rotate: 旋转模式
 * - scale: 缩放模式（仅支持局部坐标系）
 */
gui.add(settings, 'transformMode', ['translate', 'rotate', 'scale'])
  .name('变换模式')
  .onChange((value) => {
    switch (value) {
      case 'translate':
        gizmo.setMode(GizmoMode.translate)
        break
      case 'rotate':
        gizmo.setMode(GizmoMode.rotate)
        break
      case 'scale':
        gizmo.setMode(GizmoMode.scale)
        break
    }
    
    // 缩放模式仅支持局部坐标系，需要禁用坐标模式切换
    if (value === 'scale') {
      savedCoordinateMode = settings.translateMode
      gizmo.coordinateMode = CoordinateMode.local
      translateModeController.domElement.style.pointerEvents = 'none'
      translateModeController.domElement.style.opacity = '0.5'
    } else {
      translateModeController.domElement.style.pointerEvents = 'auto'
      translateModeController.domElement.style.opacity = '1'
      settings.translateMode = savedCoordinateMode
      gizmo.coordinateMode = savedCoordinateMode === 'surface' 
        ? CoordinateMode.surface 
        : CoordinateMode.local
      translateModeController.updateDisplay()
    }
  })

// ==================== 坐标模式控制 ====================
/**
 * 添加坐标模式选择器
 * - local: 局部坐标系（相对于模型自身）
 * - surface: 地表坐标系（相对于地球表面 ENU）
 */
translateModeController = gui.add(settings, 'translateMode', ['local', 'surface'])
  .name('坐标模式')
  .onChange((value) => {
    switch (value) {
      case 'local':
        gizmo.coordinateMode = CoordinateMode.local
        break
      case 'surface':
        gizmo.coordinateMode = CoordinateMode.surface
        break
    }
  })

// ==================== 启用/禁用控制 ====================
gui.add(settings, 'enabled')
  .name('启用控制器')
  .onChange((value) => {
    gizmo.setEnabled(value)
  })

// ==================== 信息显示面板 ====================
const coordsFolder = gui.addFolder('变换信息')

/** 拾取对象信息 */
const pickSettings = {
  modelName: '-',
  modelType: '-',
}

// 添加信息显示控件（只读）
const nameController = coordsFolder.add(pickSettings, 'modelName').name('名称').listen()
const typeController = coordsFolder.add(pickSettings, 'modelType').name('类型').listen()
const lonController = coordsFolder.add(settings, 'longitude').name('经度').listen()
const latController = coordsFolder.add(settings, 'latitude').name('纬度').listen()
const heightController = coordsFolder.add(settings, 'height').name('高度 (m)').listen()
const rotateXController = coordsFolder.add(settings, 'rotateX').name('旋转 X (°)').listen()
const rotateYController = coordsFolder.add(settings, 'rotateY').name('旋转 Y (°)').listen()
const rotateZController = coordsFolder.add(settings, 'rotateZ').name('旋转 Z (°)').listen()
const scaleXController = coordsFolder.add(settings, 'scaleX').name('缩放 X').listen()
const scaleYController = coordsFolder.add(settings, 'scaleY').name('缩放 Y').listen()
const scaleZController = coordsFolder.add(settings, 'scaleZ').name('缩放 Z').listen()
coordsFolder.open()

// 禁用名称和类型输入框的编辑
nameController.domElement.style.pointerEvents = 'none'
typeController.domElement.style.pointerEvents = 'none'

// ==================== 模型挂载与相机定位 ====================
/**
 * 模型加载完成后的处理
 * - 挂载 Gizmo 到模型子节点
 * - 飞行到模型位置
 */
model.readyEvent.addEventListener(() => {
  // 定义要操作的子节点名称
  // const nodeName = 'wheel_FR_luaz_diffuse_0' // 轮胎节点
  const nodeName = 'door_R_luaz_diffuse_0' // 车门节点
  const node = model.getNode(nodeName)

  // 将 Gizmo 挂载到模型子节点
  // 也可以使用 gizmo.mountToPrimitive(model, viewer) 挂载到整个模型
  gizmo.mountToNode(node, model, viewer)

  // 挂载完成后初始化显示位置信息
  updateCoordinatesFromMatrix(gizmo._mountedPrimitive)

  // 延迟飞行到模型位置（等待模型完全加载）
  setTimeout(() => {
    const boundingSphere = model.boundingSphere
    viewer.camera.flyToBoundingSphere(boundingSphere, {
      duration: 0,
      offset: new Cesium.HeadingPitchRange(
        Cesium.Math.toRadians(-45),
        Cesium.Math.toRadians(-15),
        boundingSphere.radius * 3
      ),
    })
  }, 1000)
})

// ==================== 工具函数 ====================

/**
 * 获取挂载对象的类型
 * @param {Object} mounted - 挂载的对象
 * @returns {string} 对象类型名称
 */
function getMountedObjectType(mounted) {
  if (!mounted) return '-'

  // Entity 类型
  if (mounted._isEntity) {
    return 'Entity'
  }

  // ModelNode 子节点类型
  if (mounted._isNode && mounted._node) {
    return 'ModelNode'
  }

  // 3D Tiles 类型
  if (mounted.tileset || mounted.content?.tileset) {
    return '3DTiles'
  }

  // Model 类型
  if (mounted instanceof Cesium.Model) {
    return 'Model'
  }

  // 其他 Primitive 类型
  if (mounted.modelMatrix) {
    return mounted.constructor?.name || 'Primitive'
  }

  return 'Unknown'
}

/**
 * 获取挂载对象的名称
 * @param {Object} mounted - 挂载的对象
 * @returns {string} 对象名称
 */
function getMountedObjectName(mounted) {
  if (!mounted) return '-'

  // Entity 名称
  if (mounted._isEntity && mounted._entity) {
    const entity = mounted._entity
    return entity.name || entity.id || 'Entity'
  }

  // ModelNode 子节点名称
  if (mounted._isNode && mounted._node) {
    const node = mounted._node
    return node.name || node._runtimeNode?.name || 'ModelNode'
  }

  // 3D Tiles 名称
  if (mounted.tileset) {
    return mounted.tileset._url?.split('/').pop() || '3D Tileset'
  }
  if (mounted.content?.tileset) {
    return mounted.content.tileset._url?.split('/').pop() || '3D Tileset'
  }

  // Model 名称（从 URL 提取文件名）
  if (mounted instanceof Cesium.Model) {
    const url = mounted._resource?._url || mounted._url || ''
    const fileName = url.split('/').pop()?.split('?')[0] || 'Model'
    return fileName
  }

  // 其他 Primitive 名称
  if (mounted.modelMatrix) {
    return mounted.constructor?.name || 'Primitive'
  }

  return '-'
}

/**
 * 更新挂载对象信息到 GUI
 * 通过检查 Gizmo 的可见状态来决定是否显示信息
 */
function updateMountedObjectInfo() {
  const mounted = gizmo._mountedPrimitive
  
  // 检查任意模式的 Gizmo 是否可见
  const isTransVisible = gizmo._transPrimitives?._show ?? false
  const isRotateVisible = gizmo._rotatePrimitives?._show ?? false
  const isScaleVisible = gizmo._scalePrimitives?._show ?? false
  const isGizmoVisible = isTransVisible || isRotateVisible || isScaleVisible

  if (mounted && isGizmoVisible) {
    pickSettings.modelName = getMountedObjectName(mounted)
    pickSettings.modelType = getMountedObjectType(mounted)
    coordsFolder.show()
  } else {
    pickSettings.modelName = '-'
    pickSettings.modelType = '-'
    coordsFolder.hide()
  }
}

// 通过 preRender 事件监听 Gizmo 的可见状态变化
viewer.scene.preRender.addEventListener(updateMountedObjectInfo)

// 初始化显示当前挂载的模型信息
updateMountedObjectInfo()

/**
 * 从模型矩阵中提取并更新坐标信息
 * 包括：位置（经纬度高度）、旋转角度、缩放比例
 * 
 * @param {Object} model - 挂载的模型对象
 */
function updateCoordinatesFromMatrix(model) {
  // 从模型矩阵提取位置
  const position = Cesium.Matrix4.getTranslation(model.modelMatrix, new Cesium.Cartesian3())
  const cartographic = Cesium.Cartographic.fromCartesian(position)

  // 检查坐标是否有效
  if (!cartographic) {
    settings.longitude = '-'
    settings.latitude = '-'
    settings.height = '-'
    settings.rotateX = '-'
    settings.rotateY = '-'
    settings.rotateZ = '-'
    settings.scaleX = '-'
    settings.scaleY = '-'
    settings.scaleZ = '-'
    return
  }

  // 更新位置信息（弧度转角度）
  const longitude = Cesium.Math.toDegrees(cartographic.longitude)
  const latitude = Cesium.Math.toDegrees(cartographic.latitude)
  const height = cartographic.height

  settings.longitude = longitude.toFixed(8)
  settings.latitude = latitude.toFixed(8)
  settings.height = height.toFixed(2)

  // ==================== 提取旋转分量 ====================
  if (model._isNode && model._node) {
    // 对于子节点（ModelNode），从节点矩阵中提取旋转
    const node = model._node
    let mat = node.matrix
    if (!mat && node._runtimeNode && node._runtimeNode.transform) {
      mat = node._runtimeNode.transform
    }
    if (!mat) {
      mat = Cesium.Matrix4.IDENTITY
    }

    // 提取旋转矩阵（去除缩放影响）
    const m3 = new Cesium.Matrix3()
    Cesium.Matrix4.getMatrix3(mat, m3)

    // 归一化列向量以移除缩放
    const c0 = Cesium.Cartesian3.fromElements(m3[0], m3[1], m3[2])
    const c1 = Cesium.Cartesian3.fromElements(m3[3], m3[4], m3[5])
    const c2 = Cesium.Cartesian3.fromElements(m3[6], m3[7], m3[8])
    Cesium.Cartesian3.normalize(c0, c0)
    Cesium.Cartesian3.normalize(c1, c1)
    Cesium.Cartesian3.normalize(c2, c2)

    // 重组纯旋转矩阵
    const r00 = c0.x, r01 = c1.x, r02 = c2.x
    const r10 = c0.y, r11 = c1.y, r12 = c2.y
    const r20 = c0.z, r21 = c1.z, r22 = c2.z

    // 分解欧拉角（顺序：Z -> Y -> X，即 R = Mz * My * Mx）
    let x = 0, y = 0, z = 0
    if (Math.abs(r20) < 0.99999) {
      y = Math.asin(-r20)
      x = Math.atan2(r21, r22)
      z = Math.atan2(r10, r00)
    } else {
      // 万向锁情况
      y = Math.PI / 2 * Math.sign(-r20)
      z = 0
      x = Math.atan2(-r12, r11)
    }

    settings.rotateX = Cesium.Math.toDegrees(x).toFixed(2)
    settings.rotateY = Cesium.Math.toDegrees(y).toFixed(2)
    settings.rotateZ = Cesium.Math.toDegrees(z).toFixed(2)

  } else {
    // 对于根模型（Root Model），使用 Cesium 提供的 ENU 转换
    // Heading = Z轴旋转, Pitch = Y轴旋转, Roll = X轴旋转
    const hpr = Cesium.Transforms.fixedFrameToHeadingPitchRoll(model.modelMatrix)
    settings.rotateX = Cesium.Math.toDegrees(hpr.roll).toFixed(2)
    settings.rotateY = Cesium.Math.toDegrees(hpr.pitch).toFixed(2)
    settings.rotateZ = Cesium.Math.toDegrees(hpr.heading).toFixed(2)
  }

  // ==================== 提取缩放分量 ====================
  let targetMatrix = Cesium.Matrix4.IDENTITY
  if (model._isNode && model._node) {
    const node = model._node
    if (node.matrix) {
      targetMatrix = node.matrix
    } else if (node._runtimeNode && node._runtimeNode.transform) {
      targetMatrix = node._runtimeNode.transform
    }
  } else {
    targetMatrix = model.modelMatrix
  }

  const scale = Cesium.Matrix4.getScale(targetMatrix, new Cesium.Cartesian3())

  // 对于根模型，还需要考虑 model.scale（统一缩放因子）
  let uniformScale = 1.0
  if (!model._isNode && typeof model.scale === 'number') {
    uniformScale = model.scale
  }

  settings.scaleX = (scale.x * uniformScale).toFixed(2)
  settings.scaleY = (scale.y * uniformScale).toFixed(2)
  settings.scaleZ = (scale.z * uniformScale).toFixed(2)
}

// ==================== 资源清理 ====================
/**
 * 页面卸载前清理资源
 */
window.addEventListener('beforeunload', () => {
  gizmo.detach()
  viewer.destroy()
})
