import { HOST } from "./host.js";

export default [
    {
        pid: 'layer',
        name: '在线地图',
        children: [
            {
                id: 'defaultLayer',
                name: '默认图层',
                author: 'z2586300277',
                codeUrl: HOST + 'cesiumExamples/layer/defaultLayer.js',
                image: HOST + 'cesiumExamples/layer/defaultLayer.jpg',
                meta: {
                    title: '默认图层',
                    keywords: 'cesium.js,默认图层',
                    description: 'cesium默认图层'
                }
            },
            {
                id: 'coordLayer',
                name: '坐标参考',
                author: 'giser2017',
                codeUrl: HOST + 'cesiumExamples/layer/coordLayer.js',
                image: HOST + 'cesiumExamples/layer/coord.jpg',
                meta: {
                    title: '坐标参考',
                    keywords: 'cesium.js,坐标参考',
                    description: '坐标参考'
                }
            },

            {
                id: 'baiduLayer',
                name: '百度图层',
                author: 'giser2017',
                codeUrl: HOST + 'cesiumExamples/layer/baiduLayer.js',
                image: HOST + 'cesiumExamples/layer/baiduLayer.jpg',
                meta: {
                    title: '百度图层',
                    keywords: 'cesium.js,百度图层',
                    description: 'cesium百度图层'
                }
            },
            {
                id: 'arcgisLayer',
                name: 'arcgis图层',
                author: 'z2586300277',
                codeUrl: HOST + 'cesiumExamples/layer/arcgisLayer.js',
                image: HOST + 'cesiumExamples/layer/arcgisLayer.jpg',
                meta: {
                    title: 'arcgis图层',
                    keywords: 'cesium.js,arcgis图层',
                    description: 'cesium arcgis图层'
                }
            },
            {
                id: 'gaodeLayer',
                name: '高德图层',
                author: 'z2586300277',
                codeUrl: HOST + 'cesiumExamples/layer/gaodeLayer.js',
                image: HOST + 'cesiumExamples/layer/gaodeLayer.jpg',
                meta: {
                    title: '高德图层',
                    keywords: 'cesium.js,高德图层',
                    description: 'cesium 高德图层'
                }
            },
            {
                id: 'mapfilterLayer',
                name: '地图滤镜',
                author: 'z2586300277',
                codeUrl: HOST + 'cesiumExamples/layer/mapfilterLayer.js',
                image: HOST + 'cesiumExamples/layer/mapfilterLayer.jpg',
                meta: {
                    title: '地图滤镜',
                    keywords: 'cesium.js,地图滤镜',
                    description: 'cesium 地图滤镜'
                }
            },
            {
                id: 'tiandituLayer',
                name: '天地图',
                author: 'z2586300277',
                codeUrl: HOST + 'cesiumExamples/layer/tiandituLayer.js',
                image: HOST + 'cesiumExamples/layer/tiandituLayer.jpg',
                meta: {
                    title: '天地图',
                    keywords: 'cesium.js,天地图',
                    description: 'cesium 天地图'
                }
            },
            {
                id: 'terrainLayer',
                name: '地形',
                author: 'z2586300277',
                codeUrl: HOST + 'cesiumExamples/layer/terrainLayer.js',
                image: HOST + 'cesiumExamples/layer/terrainLayer.jpg',
                meta: {
                    title: '地形',
                    keywords: 'cesium.js,地形',
                    description: 'cesium 地形'
                }
            }
        ]
    },
    {
        pid: 'offline',
        name: '离线地图',
        children: [
            {
                id: 'offlineBlue',
                name: '蓝色',
                author: 'giser2017',
                codeUrl: HOST + 'cesiumExamples/offline/blue.js',
                image: HOST + 'cesiumExamples/offline/blue.jpg',
                meta: {
                    title: '蓝色',
                    keywords: 'cesium.js,蓝色',
                    description: '蓝色'
                }
            }, {
                id: 'day',
                name: '夜间',
                author: 'giser2017',
                codeUrl: HOST + 'cesiumExamples/offline/day.js',
                image: HOST + 'cesiumExamples/offline/day.jpg',
                meta: {
                    title: '夜间',
                    keywords: 'cesium.js,夜间',
                    description: '夜间'
                }
            }
            , {
                id: 'img',
                name: '影像',
                author: 'giser2017',
                codeUrl: HOST + 'cesiumExamples/offline/img.js',
                image: HOST + 'cesiumExamples/offline/img.jpg',
                meta: {
                    title: '影像',
                    keywords: 'cesium.js,影像',
                    description: '影像'
                }
            }
            , {
                id: 'night',
                name: '夜间',
                author: 'giser2017',
                codeUrl: HOST + 'cesiumExamples/offline/night.js',
                image: HOST + 'cesiumExamples/offline/night.jpg',
                meta: {
                    title: '影像',
                    keywords: 'cesium.js,影像',
                    description: '夜间'
                }
            },
            {
                id: 'gaode',
                name: '内网高德',
                author: 'z2586300277',
                codeUrl: HOST + 'cesiumExamples/offline/gaode.js',
                image: HOST + 'cesiumExamples/offline/gaode.jpg',
                meta: {
                    title: '内网高德',
                    keywords: 'cesium.js,内网高德',
                    description: '内网高德'
                }
            },
            {
                id: 'baiDu',
                name: '内网百度',
                author: 'z2586300277',
                codeUrl: HOST + 'cesiumExamples/offline/baidu.js',
                image: HOST + 'cesiumExamples/offline/baidu.jpg',
                meta: {
                    title: '内网百度',
                    keywords: 'cesium.js,内网百度',
                    description: '内网百度'
                }
            }
        ]
    },
    {
        pid: 'basic',
        name: '基础功能',
        children: [
            {
                id: 'autoRotate',
                name: '自动旋转',
                author: 'z2586300277',
                codeUrl: HOST + 'cesiumExamples/basic/autoRotate.js',
                image: HOST + 'cesiumExamples/layer/defaultLayer.jpg',
                meta: {
                    title: '自动旋转',
                    keywords: 'cesium.js,自动旋转',
                    description: 'cesium自动旋转'
                }
            },
            {
                id: 'cesiumText',
                name: '绘制文字',
                author: 'g2657',
                codeUrl: HOST + 'cesiumExamples/basic/cesiumText.js',
                image: HOST + 'cesiumExamples/layer/defaultLayer.jpg',
            },
            {
                id: 'cssElement',
                name: 'css2D元素',
                author: 'z2586300277',
                codeUrl: HOST + 'cesiumExamples/basic/cssElement.js',
                image: HOST + 'cesiumExamples/basic/cssElement.jpg',
                meta: {
                    title: 'css2D元素',
                    keywords: 'cesium.js,css2D元素',
                    description: 'cesium css2D元素'
                }
            },
            {
                id: 'clickEvent',
                name: '点击事件',
                author: 'z2586300277',
                codeUrl: HOST + 'cesiumExamples/basic/clickEvent.js',
                image: HOST + 'cesiumExamples/basic/clickEvent.jpg',
                meta: {
                    title: '点击事件',
                    keywords: 'cesium.js,点击事件',
                    description: 'cesium 点击事件'
                }
            },
            {
                id: 'geojsonFace',
                name: 'geojson面',
                author: 'z2586300277',
                codeUrl: HOST + 'cesiumExamples/basic/geojsonFace.js',
                image: HOST + 'cesiumExamples/basic/geojsonFace.jpg',
                meta: {
                    title: 'geojson面',
                    keywords: 'cesium.js,geojson面',
                    description: 'cesium geojson面'
                }
            },
            {
                id: 'multPoint',
                name: 'cesium大量点',
                author: 'z2586300277',
                codeUrl: HOST + 'cesiumExamples/basic/multPoint.js',
                image: HOST + 'cesiumExamples/basic/multPoint.jpg',
                meta: {
                    title: 'cesium大量点',
                    keywords: 'cesium.js,cesium大量点',
                    description: 'cesium cesium大量点'
                }
            },
            {
                id: 'multPointCluster',
                name: 'cesium大量点聚合',
                author: 'z2586300277',
                codeUrl: HOST + 'cesiumExamples/basic/multPointCluster.js',
                image: 'https://z2586300277.github.io/three-editor/src/codes/cesiumjs/basic/multPointCluster.jpg',
                inject: {
                    src: ["https://z2586300277.github.io/3d-file-server/js/supercluster.min.js"]
                },
                meta: {
                    title: 'cesium大量点聚合',
                    keywords: 'cesium.js,cesium大量点聚合',
                    description: 'cesium cesium大量点聚合'
                }
            },
            {
                id: 'multFaceLine',
                name: 'cesium大量面线',
                author: 'z2586300277',
                codeUrl: HOST + 'cesiumExamples/basic/multFaceLine.js',
                image: HOST + 'cesiumExamples/basic/multFaceLine.jpg',
                meta: {
                    title: 'cesium大量面线',
                    keywords: 'cesium.js,cesium大量面线',
                    description: 'cesium cesium大量面线'
                }
            },
            {
                id: 'multCurve',
                name: 'cesium大量曲线',
                author: 'z2586300277',
                codeUrl: HOST + 'cesiumExamples/basic/multCurve.js',
                image: HOST + 'cesiumExamples/basic/multCurve.jpg',
                meta: {
                    title: 'cesium大量曲线',
                    keywords: 'cesium.js,cesium大量曲线',
                    description: 'cesium cesium大量曲线'
                }
            },
            {
                id: 'multText',
                name: 'cesium大量文字',
                author: 'z2586300277',
                codeUrl: HOST + 'cesiumExamples/basic/multText.js',
                image: HOST + 'cesiumExamples/basic/multText.jpg',
                meta: {
                    title: 'cesium大量文字',
                    keywords: 'cesium.js,cesium大量文字',
                    description: 'cesium cesium大量文字'
                }
            },
            {
                id: 'loadModel',
                name: '加载模型',
                author: 'z2586300277',
                codeUrl: HOST + 'cesiumExamples/basic/loadModel.js',
                image: HOST + 'cesiumExamples/basic/loadModel.jpg',
                meta: {
                    title: '加载模型',
                    keywords: 'cesium.js,加载模型',
                    description: 'cesium 加载模型'
                }
            },
            {
                id: 'flyLine',
                name: '流动飞线运动',
                author: 'z2586300277',
                codeUrl: HOST + 'cesiumExamples/basic/flyLine.js',
                image: HOST + 'cesiumExamples/basic/flyLine.jpg',
                meta: {
                    title: '流动飞线运动',
                    keywords: 'cesium.js,流动飞线运动',
                    description: 'cesium 流动飞线运动'
                }
            },
        ]
    },
    {
        pid: 'expand',
        name: '扩展功能',
        children: [
            {
                id: 'cesiumAndThree',
                name: 'cesium融合three',
                author: 'z2586300277',
                codeUrl: HOST + 'cesiumExamples/expand/cesiumAndThree.js',
                image: HOST + 'cesiumExamples/expand/cesiumAndThree.jpg',
                inject: {
                    importmap: { three: "https://z2586300277.github.io/3d-file-server/js/three/three.module.min.js" }
                }
            },
            {
                id: 'echartsFlyLine',
                name: 'echarts飞线',
                author: 'z2586300277',
                codeUrl: HOST + 'cesiumExamples/expand/echartsFlyLine.js',
                image: 'https://z2586300277.github.io/three-editor/src/codes/cesiumjs/basic/flyCharts.jpg',
                inject: {
                    src: ["https://z2586300277.github.io/3d-file-server/js/echarts490.min.js"]
                }
            },
            {
                id: 'heatMap',
                name: '热力图',
                author: 'z2586300277',
                codeUrl: HOST + 'cesiumExamples/expand/heatMap.js',
                image: 'https://z2586300277.github.io/three-editor/src/codes/cesiumjs/basic/heatMap.jpg',
            }
        ]
    },
    {
        pid: 'tools',
        name: '工具',
        children: [
            {
                id: 'mapDataConvert',
                name: '地图转换工具',
                author: 'giser2017',
                openUrl: 'https://threelab.cn/dgis/',
                image: HOST + 'cesiumExamples/tools/mapDataConvert.jpg',
            }
        ]
    }
]