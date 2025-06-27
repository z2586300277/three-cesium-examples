import * as GaussianSplats3D from 'https://cdn.jsdelivr.net/npm/@mkkellogg/gaussian-splats-3d@0.4.7/+esm'


/**
 * 参考引用自  https://github.com/mkkellogg/GaussianSplats3D
 * 可结合Three.js 融合 更多玩法参考源文档
 * @type {GaussianSplats3D.Viewer}
 */

// 修改初始化配置
const viewer = new GaussianSplats3D.Viewer({
    'useSharedArrayBuffer': false,
    'useBuiltInControls': true,
    'sharedMemoryForWorkers':false,
    'cameraUp': [0, -1, -0.6],
    'initialCameraPosition': [-1, -4, 6],
    'initialCameraLookAt': [0, 4, 0]
});
viewer.addSplatScene('https://axidake.oss-cn-chengdu.aliyuncs.com/public-res/3dgs/garden.ksplat', {
    'splatAlphaRemovalThreshold': 5,
    'showLoadingUI': true,
    'position': [0, 1, 0],
    'rotation': [0, 0, 0, 1],
    'scale': [1.5, 1.5, 1.5]
}).then(() => {
    viewer.start()
});