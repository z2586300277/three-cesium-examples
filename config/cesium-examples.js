import { FILE_HOST, HOST } from "./host.js";

export default [
    {
        pid: 'layer',
        name: '在线地图',
        name_en: 'Online Map',
        children: [
            {
                id: 'defaultLayer',
                name: '默认图层',
                name_en: 'Default Layer',
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
                name_en: 'Coordinate',
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
                name_en: 'Baidu Layer',
                author: 'z2586300277',
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
                name_en: 'ArcGIS Layer',
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
                name_en: 'Gaode Layer',
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
                name_en: 'Map Filter',
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
                name_en: 'Tianditu Layer',
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
                id: 'xyz',
                name: 'OGC- xyz服务',
                name_en: 'OGC-XYZ',
                author: 'jiawanlong',
                codeUrl: HOST + 'cesiumExamples/layer/xyz.js',
                image: HOST + 'cesiumExamples/layer/xyz.jpg',
                meta: {
                    title: 'xyz服务',
                    keywords: 'cesium.js,影像',
                    description: 'xyz服务'
                }
            },
            {
                id: 'tms',
                name: 'OGC- tms服务',
                name_en: 'OGC-TMS',
                author: 'jiawanlong',
                codeUrl: HOST + 'cesiumExamples/layer/tms.js',
                image: HOST + 'cesiumExamples/layer/tms.jpg',
                meta: {
                    title: 'tms服务',
                    keywords: 'cesium.js,影像',
                    description: 'tms服务'
                }
            },
            {
                id: 'wms',
                name: 'OGC- wms服务',
                name_en: 'OGC- WMS',
                author: 'jiawanlong',
                codeUrl: HOST + 'cesiumExamples/layer/wms.js',
                image: HOST + 'cesiumExamples/layer/wms.jpg',
                meta: {
                    title: 'wms服务',
                    keywords: 'cesium.js,影像',
                    description: 'wms服务'
                }
            },
            {
                id: 'wmts',
                name: 'OGC- wmts服务',
                name_en: 'OGC- WMTS',
                author: 'jiawanlong',
                codeUrl: HOST + 'cesiumExamples/layer/wmts.js',
                image: HOST + 'cesiumExamples/layer/wmts.jpg',
                meta: {
                    title: 'wmts服务',
                    keywords: 'cesium.js,影像',
                    description: 'wmts服务'
                }
            },
            {
                id: 'terrainLayer',
                name: '地形',
                name_en: 'Terrain',
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
        name_en: 'Offline Map',
        children: [
            {
                id: 'offlineBlue',
                name: '蓝色',
                name_en: 'Blue Map',
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
                name_en: 'Night Map',
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
                name_en: 'Image Map',
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
                name_en: 'Night Map',
                author: 'jiawanlong',
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
                name_en: 'Intranet Gaode',
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
                name_en: 'Intranet Baidu',
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
        name_en: 'Basic Function',
        children: [
            {
                id: 'autoRotate',
                name: '自动旋转',
                name_en: 'Auto Rotate',
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
                name_en: 'Draw Text',
                author: 'g2657',
                codeUrl: HOST + 'cesiumExamples/basic/cesiumText.js',
                image: HOST + 'cesiumExamples/layer/defaultLayer.jpg',
                meta: {
                    title: '绘制文字',
                    keywords: 'cesium.js,绘制文字',
                    description: 'cesium绘制文字'
                }
            },
            {
                id: 'cssElement',
                name: 'css2D元素',
                name_en: 'CSS2D Element',
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
                name_en: 'Click Event',
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
                name_en: 'GeoJSON Face',
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
                name_en: 'Multiple Points',
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
                name_en: 'Points Cluster',
                tag: '聚合',
                author: 'z2586300277',
                codeUrl: HOST + 'cesiumExamples/basic/multPointCluster.js',
                image: 'https://z2586300277.github.io/three-editor/src/codes/cesiumjs/basic/multPointCluster.jpg',
                inject: {
                    src: [FILE_HOST + "js/supercluster.min.js"]
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
                name_en: 'Face & Line',
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
                name_en: 'Multiple Curves',
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
                name_en: 'Multiple Texts',
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
                id: 'multBox',
                name: 'cesium大量立方体',
                name_en: 'Multiple Cubes',
                author: 'z2586300277',
                codeUrl: HOST + 'cesiumExamples/basic/multBox.js',
                image: HOST + 'cesiumExamples/basic/multBox.jpg',
                meta: {
                    title: 'cesium大量立方体',
                    keywords: 'cesium.js,cesium大量立方体',
                    description: 'cesium cesium大量立方体'
                }
            },
            {
                id: 'loadModel',
                name: '加载模型',
                name_en: 'Load Model',
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
                id: 'tilesShader',
                name: '智慧城市着色器',
                name_en: 'SmartCity Shader',
                author: 'z2586300277',
                referUrl: 'https://blog.csdn.net/weixin_45412353/article/details/130598349',
                codeUrl: HOST + 'cesiumExamples/basic/tilesShader.js',
                image: HOST + 'cesiumExamples/basic/tilesShader.jpg',
                meta: {
                    title: '智慧城市着色器',
                    keywords: 'cesium.js,智慧城市着色器',
                    description: 'cesium 智慧城市着色器'
                }
            },
            {
                id: 'flyLine',
                name: '流动飞线运动',
                name_en: 'Flowing Line',
                author: 'z2586300277',
                codeUrl: HOST + 'cesiumExamples/basic/flyLine.js',
                image: HOST + 'cesiumExamples/basic/flyLine.jpg',
                meta: {
                    title: '流动飞线运动',
                    keywords: 'cesium.js,流动飞线运动',
                    description: 'cesium 流动飞线运动'
                }
            },
            {
                id: 'curvePipe',
                name: '曲线管道',
                name_en: 'Curve Pipe',
                author: 'z2586300277',
                codeUrl: HOST + 'cesiumExamples/basic/curvePipe.js',
                image: HOST + 'cesiumExamples/basic/curvePipe.jpg',
            }
        ]
    },
    {
        pid: 'expand',
        name: '扩展功能',
        name_en: 'Expand Function',
        children: [
            {
                id: 'cesiumAndThree',
                name: 'cesium融合three',
                name_en: 'Cesium+Three',
                author: 'z2586300277',
                codeUrl: HOST + 'cesiumExamples/expand/cesiumAndThree.js',
                image: HOST + 'cesiumExamples/expand/cesiumAndThree.jpg',
                inject: {
                    importmap: { three: FILE_HOST + "js/three/three.module.min.js" }
                },
                meta: {
                    title: 'cesium融合three',
                    keywords: 'cesium融合three,场景,融合',
                    description: '使用three.js创建3D场景，cesium创建2D场景，融合在一起'
                }
            },
            {
                id: 'echartsFlyLine',
                name: 'echarts飞线',
                name_en: 'EchartsFlyLine',
                author: 'z2586300277',
                codeUrl: HOST + 'cesiumExamples/expand/echartsFlyLine.js',
                image: 'https://z2586300277.github.io/three-editor/src/codes/cesiumjs/basic/flyCharts.jpg',
                inject: {
                    src: [FILE_HOST + "js/echarts490.min.js"]
                },
                meta: {
                    title: 'echarts飞线',
                    keywords: 'cesium.js,echarts飞线',
                    description: 'cesium 结合 echarts 创建美丽的动态流动飞线'
                }
            },
            {
                id: 'heatMap',
                name: '热力图',
                name_en: 'Heat Map',
                author: 'z2586300277',
                codeUrl: HOST + 'cesiumExamples/expand/heatMap.js',
                image: 'https://z2586300277.github.io/three-editor/src/codes/cesiumjs/basic/heatMap.jpg',
                meta: {
                    title: '热力图',
                    keywords: 'cesium.js,热力图',
                    description: 'cesium 结合 热力图'
                }
            },
            {
                id: 'fire',
                name: '粒子（火焰）',
                name_en: 'Particle(Fire)',
                author: 'jiawanlong',
                codeUrl: HOST + 'cesiumExamples/expand/fire.js',
                image: HOST + 'cesiumExamples/expand/fire.jpg',
                meta: {
                    title: '粒子（火焰）',
                    keywords: '粒子',
                    description: '粒子（火焰）'
                }
            },
            {
                id: 'ripple',
                name: '水波纹',
                name_en: 'Ripple',
                author: 'jiawanlong',
                codeUrl: HOST + 'cesiumExamples/expand/ripple.js',
                image: HOST + 'cesiumExamples/expand/ripple.jpg',
                meta: {
                    title: '水波纹',
                    keywords: '水波纹',
                    description: '水波纹'
                }
            },
            {
                id: 'snow',
                name: '雪景',
                name_en: 'Snow Scene',
                author: '20Savage',
                codeUrl: HOST + 'cesiumExamples/expand/snow.js',
                image: HOST + 'cesiumExamples/expand/snow.jpg',
                meta: {
                    title: '雪景',
                    keywords: '雪景，模型积雪',
                    description: '雪景，模型积雪'
                }
            },
            {
                id: 'rain',
                name: '下雨',
                name_en: 'Rain',
                author: '20Savage',
                codeUrl: HOST + 'cesiumExamples/expand/rain.js',
                image: HOST + 'cesiumExamples/expand/rain.jpg',
                meta: {
                    title: '雨景',
                    keywords: '雨景，雨滴效果',
                    description: '雨景，雨滴效果'
                }
            },
            {
                id: 'lensFlare',
                name: '镜头光晕',
                name_en: 'Lens Flare',
                author: '20Savage',
                codeUrl: HOST + 'cesiumExamples/expand/lensFlare.js',
                image: HOST + 'cesiumExamples/expand/lensFlare.jpg',
                meta: {
                    title: '镜头光晕',
                    keywords: '镜头光晕，太阳效果',
                    description: '镜头光晕，太阳效果'
                }
            },
            {
                id: '3DheatMap',
                name: '3D热力图',
                name_en: '3D Heat Map',
                author: '20Savage',
                codeUrl: HOST + 'cesiumExamples/expand/3DheatMap.js',
                image: HOST + 'cesiumExamples/expand/3DheatMap.jpg',
                meta: {
                    title: '3D热力图',
                    keywords: 'cesium.js,3D热力图',
                    description: 'cesium 结合 3D热力图'
                }
            },
            {
                id: 'gradienGeojsonFace',
                name: '渐变行政区',
                name_en: 'Gradient Area',
                author: '20Savage',
                codeUrl: HOST + 'cesiumExamples/expand/gradienGeojsonFace.js',
                image: HOST + 'cesiumExamples/expand/gradienGeojsonFace.jpg',
                meta: {
                    title: '渐变行政区',
                    keywords: 'cesium.js,渐变行政区',
                    description: 'cesium 结合 渐变行政区'
                }
            },
            
        ]
    },
    {
        pid: 'tools',
        name: '相关工具',
        name_en: 'Tools',
        children: [
            {
                id: 'mapDataConvert',
                name: '地图转换工具',
                name_en: 'Map Convert',
                author: 'giser2017',
                openUrl: 'https://z2586300277.github.io/show-site/dgis/',
                image: HOST + 'cesiumExamples/tools/mapDataConvert.jpg',
            },
            {
                id: 'layerDownload',
                name: '地图下载器',
                name_en: 'Map Downloader',
                author: 'CrimsonHu',
                openUrl: 'https://gitee.com/CrimsonHu/java_map_download',
                image: HOST + 'cesiumExamples/tools/layerDownload.jpg',
            }
        ],
    }
]