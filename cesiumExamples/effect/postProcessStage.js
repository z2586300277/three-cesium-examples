import * as Cesium from 'cesium'
import { GUI } from 'dat.gui';

/**
 * Cesium后处理阶段示例
 * 该示例演示了如何使用Cesium的后处理效果来增强场景视觉效果
 * 包括FXAA、Bloom、SSAO、模糊、黑白、夜视、描边、景深和运动模糊等效果
 */

// 获取Cesium容器元素
const box = document.getElementById('box')

// 初始化Cesium Viewer
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
// 隐藏Cesium Logo
viewer._cesiumWidget._creditContainer.style.display = "none";

// 获取后处理阶段集合
const stages = viewer.scene.postProcessStages;
let myentity = viewer.entities.add({
    position: Cesium.Cartesian3.fromDegrees(113.5, 34.5, 0),
    model: {
        uri: HOST + '/files/model/car.glb',
        minimumPixelSize: 100,
        maximumScale: 300
    }
})
viewer.zoomTo(myentity)
/**
 * 清空所有特效
 * 禁用内置特效并移除所有自定义后处理阶段
 */
function clearAll() {
    // 禁用内置的FXAA抗锯齿效果
    stages.fxaa.enabled = false;
    // 禁用内置的Bloom辉光效果
    stages.bloom.enabled = false;
    // 禁用内置的环境光遮蔽效果
    stages.ambientOcclusion.enabled = false;
    // 移除所有自定义添加的后处理阶段
    stages.removeAll();
}

/**
 * 应用指定名称的滤镜效果
 * @param {string} name - 滤镜名称
 */
function applyFilter(name) {
    clearAll(); // 先清空所有特效
    switch (name) {
        case 'fxaa':
            // 启用快速近似抗锯齿(FXAA)效果
            stages.fxaa.enabled = true;
            break;
        case 'bloom':
            // 启用辉光(Bloom)效果
            stages.bloom.enabled = true;
            // 设置对比度参数
            stages.bloom.uniforms.contrast = 128;
            // 设置亮度参数
            stages.bloom.uniforms.brightness = -0.3;
            break;
        case 'ssao':
            // 启用屏幕空间环境光遮蔽(SSAO)效果
            stages.ambientOcclusion.enabled = true;
            // 设置遮蔽强度
            stages.ambientOcclusion.uniforms.intensity = 1.5;
            break;
        case 'blur':
            // 添加高斯模糊后处理阶段
            stages.add(Cesium.PostProcessStageLibrary.createBlurStage());
            break;
        case 'bw':
            // 添加黑白滤镜后处理阶段
            stages.add(Cesium.PostProcessStageLibrary.createBlackAndWhiteStage());
            break;
        case 'nv':
            // 添加夜视效果后处理阶段
            stages.add(Cesium.PostProcessStageLibrary.createNightVisionStage());
            break;
        case 'sil': {
            // 添加描边效果后处理阶段
            const sil = stages.add(Cesium.PostProcessStageLibrary.createSilhouetteStage());
            // 设置描边颜色为黄色
            sil.uniforms.color = Cesium.Color.YELLOW;
            // 这里可以 push 选中物体：sil.selected.push(entity);
            break;
        }
        case 'dof': {
            // 添加景深效果后处理阶段
            const dof = stages.add(Cesium.PostProcessStageLibrary.createDepthOfFieldStage());
            // 设置焦距距离
            dof.uniforms.focalDistance = 200;
            // 设置景深参数
            dof.uniforms.delta = 1.0;
            // 设置高斯模糊参数
            dof.uniforms.sigma = 2.0;
            break;
        }
        case 'mb': {
            // 添加运动模糊后处理阶段
            const mb = stages.add(Cesium.PostProcessStageLibrary.createMotionBlurStage());
            // 设置模糊强度
            mb.uniforms.intensity = 0.8;
            break;
        }
        case 'none':
            // 无滤镜效果，保持清空状态
            break;
    }
}

// ==================== GUI控制 ====================

/** 
 * 定义图形绘制操作对象
 * 包含各种滤镜效果的触发函数
 * @namespace obj
 */
const obj = {
    '无滤镜': () => {
        applyFilter('none');
    },
    'FXAA': () => {
        applyFilter('fxaa');
    },
    'Bloom': () => {
        applyFilter('bloom');
    },
    'SSAO': () => {
        applyFilter('ssao');
    },
    'Blur': () => {
        applyFilter('blur');
    },
    '黑白': () => {
        applyFilter('bw');
    },
    '夜视': () => {
        applyFilter('nv');
    },
    '描边': () => {
        applyFilter('sil');
    },
    '景深': () => {
        applyFilter('dof');
    },
    '运动模糊': () => {
        applyFilter('mb');
    }
};

/** 
 * 创建GUI控制面板
 * @type {dat.GUI}
 */
const gui = new GUI();
// 将操作对象添加到GUI控制面板
for (const key in obj) gui.add(obj, key)

// 默认应用无滤镜效果
applyFilter('none');