import * as Cesium from 'cesium'
import { GUI } from 'dat.gui'
const box = document.getElementById('box')

/**
 * @namespace CONFIG
 * @description 全局配置对象，包含所有可自定义的参数
 */
const CONFIG = {
    /**
     * @namespace point
     * @memberof CONFIG
     * @property {number} pixelSize - 像素大小
     * @property {Cesium.Color} color - 颜色
     * @property {Cesium.Color} outlineColor - 边框颜色
     * @property {number} outlineWidth - 边框宽度
     */
    point: {
        pixelSize: 10,
        color: Cesium.Color.YELLOW,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 1,
    },

    /**
     * @namespace label
     * @memberof CONFIG
     * @property {string} font - 字体
     * @property {Cesium.Color} fillColor - 填充颜色
     * @property {Cesium.Color} outlineColor - 边框颜色
     * @property {number} outlineWidth - 边框宽度
     * @property {Cesium.LabelStyle} style - 样式
     * @property {Cesium.VerticalOrigin} verticalOrigin - 垂直对齐方式
     */
    label: {
        font: '14px sans-serif',
        fillColor: Cesium.Color.WHITE,
        outlineColor: Cesium.Color.BLACK,
        outlineWidth: 2,
        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
    },

    /**
     * @namespace line
     * @memberof CONFIG
     * @property {number} width - 宽度
     * @property {Cesium.Color} material - 材质
     * @property {boolean} clampToGround - 是否贴地
     */
    line: {
        width: 5,
        material: Cesium.Color.RED.withAlpha(1),
        clampToGround: true,
    },

    /**
     * @namespace tempLine
     * @memberof CONFIG
     * @property {number} width - 宽度
     * @property {Cesium.Color} material - 材质
     * @property {boolean} clampToGround - 是否贴地
     */
    tempLine: {
        width: 3,
        material: Cesium.Color.RED.withAlpha(0.5),
        clampToGround: true,
    }
};

// ==================== 初始化区域 ====================
/**
 * 初始化Cesium Viewer
 * @type {Cesium.Viewer}
 */
const viewer = new Cesium.Viewer(box, {
    animation: false,           // 是否创建动画小器件，左下角仪表    
    baseLayerPicker: false,     // 是否显示图层选择器，右上角图层选择按钮
    baseLayer: Cesium.ImageryLayer.fromProviderAsync(Cesium.ArcGisMapServerImageryProvider.fromUrl('https://server.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer')),
    fullscreenButton: false,    // 是否显示全屏按钮，右下角全屏选择按钮
    timeline: false,            // 是否显示时间轴    
    infoBox: false,             // 是否显示信息框   
});

viewer.camera.flyTo({
    duration: 2,
    destination: Cesium.Cartesian3.fromDegrees(116.4074, 39.9042, 10000),
    orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(-90),
        roll: 0
    },
});

// 隐藏Cesium Logo
viewer._cesiumWidget._creditContainer.style.display = "none";

/** 
 * 存储线实体
 * @type {Array<Cesium.Entity>}
 */
let lineEntities = [];

/** 
 * 用于存储临时线条实体
 * @type {Cesium.Entity}
 */
let tempLineEntity = null;

/** 
 * 用于存储绘制线的点
 * @type {Array<Cesium.Cartesian3>}
 */
let drawLinePositions = [];

/** 
 * 用于显示距离信息的标签实体
 * @type {Cesium.Entity}
 */
let distanceLabelEntity = null;

/** 
 * 创建GUI控制面板
 * @type {dat.GUI}
 */
const gui = new GUI();

/** 
 * 全局事件处理器
 * @type {Cesium.ScreenSpaceEventHandler}
 */
let globalHandler = null;

// ==================== 功能操作区域 ====================
/** 
 * 定义图形绘制操作对象
 * @namespace obj
 */
const obj = {
    /** 
     * 绘制线功能
     * @function
     * @memberof obj
     */
    '绘制线': () => {
        clearLineEntities();
        initLineDrawing();
    },
};

// 将操作对象添加到GUI控制面板
for (const key in obj) gui.add(obj, key)

// ==================== 实体管理区域 ====================
/**
 * 清除线实体
 */
function clearLineEntities() {
    lineEntities.forEach(entity => {
        viewer.entities.remove(entity);
    });
    lineEntities = [];

    drawLinePositions.length = 0;

    // 清除临时线条
    if (tempLineEntity) {
        viewer.entities.remove(tempLineEntity);
        tempLineEntity = null;
    }

    // 移除距离标签
    if (distanceLabelEntity) {
        viewer.entities.remove(distanceLabelEntity);
        distanceLabelEntity = null;
    }
    // 遵循事件管理规范：在注册新事件前清除旧事件避免重复注册
    if (globalHandler) {
        globalHandler.destroy();
        globalHandler = null
    }
}

// ==================== 图形绘制区域 ====================
/**
 * 初始化绘制线功能
 */
function initLineDrawing() {
    // 创建屏幕空间事件处理器
    globalHandler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);

    // 注册鼠标左键点击事件
    globalHandler.setInputAction(function (movement) {
        // 获取点击位置的笛卡尔坐标
        const cartesian = viewer.scene.pickPosition(movement.position);

        // 如果成功获取到坐标
        if (cartesian) {
            // 将坐标添加到绘制线的点数组中
            drawLinePositions.push(cartesian);

            // 在点击位置添加一个标记点
            const pointEntity = viewer.entities.add({
                position: cartesian,
                point: {
                    pixelSize: CONFIG.point.pixelSize,
                    color: CONFIG.point.color,
                    outlineColor: CONFIG.point.outlineColor,
                    outlineWidth: CONFIG.point.outlineWidth
                },
                billboard: {
                    image: customLabel(`${drawLinePositions.length}`, '#4ecb52', 'white'),
                    pixelOffset: new Cesium.Cartesian2(0, -20) // 文字偏移量
                }
            });
            lineEntities.push(pointEntity);

            // 如果已经有至少两个点，则创建线段
            if (drawLinePositions.length >= 2) {
                // 创建永久线条实体
                const lineEntity = viewer.entities.add({
                    polyline: {
                        positions: [
                            drawLinePositions[drawLinePositions.length - 2],
                            drawLinePositions[drawLinePositions.length - 1]
                        ],
                        width: CONFIG.line.width,
                        material: CONFIG.line.material,
                        clampToGround: CONFIG.line.clampToGround
                    }
                });

                // 将线条实体也添加到线实体数组中以便统一管理
                lineEntities.push(lineEntity);

                // 计算并显示两点间的贴地距离
                calculateAndDisplayDistance(
                    drawLinePositions[drawLinePositions.length - 2],
                    drawLinePositions[drawLinePositions.length - 1],
                    drawLinePositions.length - 1
                );
            }
        } else {
            // 如果没有获取到坐标，提示点击位置不在地球上
            alert('点击位置不在地球表面');
        }
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    // 注册鼠标右键点击事件，结束绘制
    globalHandler.setInputAction(function () {
        // 移除临时线条
        if (tempLineEntity) {
            viewer.entities.remove(tempLineEntity);
            tempLineEntity = null;
        }
        // 移除距离标签
        if (distanceLabelEntity) {
            viewer.entities.remove(distanceLabelEntity);
            distanceLabelEntity = null;
        }
        drawLinePositions = []
        // 遵循事件管理规范：在注册新事件前清除旧事件避免重复注册
        if (globalHandler) {
            globalHandler.destroy();
            globalHandler = null
        }
    }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);

    // 注册鼠标移动事件，用于实时绘制临时线条
    globalHandler.setInputAction(function (movement) {
        // 获取鼠标位置的笛卡尔坐标
        const cartesian = viewer.scene.pickPosition(movement.endPosition);

        // 如果成功获取到坐标且至少有一个点
        if (cartesian && drawLinePositions.length > 0) {
            // 如果存在之前的临时线条，则更新其位置
            if (tempLineEntity) {
                // 更新临时线条的点集合
                tempLineEntity.polyline.positions = [
                    drawLinePositions[drawLinePositions.length - 1],
                    cartesian
                ];
            } else {
                // 否则创建新的临时线条实体
                tempLineEntity = viewer.entities.add({
                    polyline: {
                        positions: [
                            drawLinePositions[drawLinePositions.length - 1],
                            cartesian
                        ],
                        width: CONFIG.tempLine.width,
                        material: CONFIG.tempLine.material,
                        clampToGround: CONFIG.tempLine.clampToGround
                    }
                });
            }

            // 实时计算并显示当前两点间的贴地距离
            if (drawLinePositions.length >= 1) {
                updateRealTimeDistance(drawLinePositions[drawLinePositions.length - 1], cartesian);
            }
        }
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
}

// ==================== 工具函数区域 ====================
/**
 * 计算并显示两点间的贴地距离
 * @param {Cesium.Cartesian3} point1 - 起始点
 * @param {Cesium.Cartesian3} point2 - 终止点
 * @param {number} index - 线段序号
 */
function calculateAndDisplayDistance(point1, point2, index) {
    // 计算贴地距离
    const distance = Cesium.Cartesian3.distance(point1, point2);

    // 创建中点用于显示距离标签
    const midPoint = Cesium.Cartesian3.midpoint(point1, point2, new Cesium.Cartesian3());
    const distanceEntity = viewer.entities.add({
        position: midPoint, // 航点位置
        billboard: {
            image: customLabel(`${distance.toFixed(2)} 米`, '#d22629', 'white'),
            pixelOffset: new Cesium.Cartesian2(0, -20) // 文字偏移量
        }
    });
    // 将距离标签实体添加到线实体数组中统一管理
    lineEntities.push(distanceEntity);
}

/**
 * 实时更新临时线段的距离显示
 * @param {Cesium.Cartesian3} point1 - 起始点
 * @param {Cesium.Cartesian3} point2 - 终止点
 */
function updateRealTimeDistance(point1, point2) {
    // 计算贴地距离
    const distance = Cesium.Cartesian3.distance(point1, point2);

    // 创建中点用于显示距离标签
    const midPoint = Cesium.Cartesian3.midpoint(point1, point2, new Cesium.Cartesian3());

    // 如果距离标签实体已存在，则更新其位置和文本
    if (distanceLabelEntity) {
        distanceLabelEntity.position = midPoint;
        distanceLabelEntity.label.text = `${distance.toFixed(2)} 米`;
    } else {
        // 否则创建新的距离标签实体，使用红色背景
        distanceLabelEntity = viewer.entities.add({
            position: midPoint,
            label: {
                text: `${distance.toFixed(2)} 米`,
                font: CONFIG.label.font,
                outlineColor: CONFIG.label.outlineColor,
                outlineWidth: CONFIG.label.outlineWidth,
                style: CONFIG.label.style,
                verticalOrigin: CONFIG.label.verticalOrigin,
                pixelOffset: new Cesium.Cartesian2(0, -15),
                scale: 1.1 // 稍微放大标签
            }
        });
    }
}
function customLabel(text, bgColor, fontColor) {
    // 创建一个canvas元素，用于绘制圆形背景和文字
    let canvas = document.createElement('canvas');
    // 使用 measureText 获取文本宽度
    let ctx = canvas.getContext('2d');
    let textWidth = ctx.measureText(text).width;
    // 根据文本宽度调整画布大小
    canvas.width = textWidth + 20; // 在文本长度之外加上一些额外的空间
    canvas.height = 20; // 设置一个合适的高度

    // 开始绘制圆形背景
    ctx.beginPath();
    ctx.roundRect(0, 0, canvas.width, canvas.height, 10); // 圆角半径为10像素
    ctx.fillStyle = bgColor; // 设置填充颜色为半透明的蓝色
    ctx.fill(); // 使用fill方法填充圆形

    // 开始绘制文字
    ctx.font = '12px sans-serif';
    ctx.fillStyle = fontColor; // 设置文字颜色为黑色
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2); // 在中间位置绘制文字

    // 将绘制好的canvas内容转换为dataURL格式的图片
    return canvas.toDataURL();
}