export default [
    {
        pid: 'layer',
        name: '在线地图',
        children: [
            {
                id: 'defaultLayer',
                name: '默认图层',
                author: 'z2586300277',
                codeUrl: '/three-cesium-examples/public/cesiumExamples/layer/defaultLayer.js',
                image: '/three-cesium-examples/public/cesiumExamples/layer/defaultLayer.jpg',
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
                codeUrl: '/three-cesium-examples/public/cesiumExamples/layer/coordLayer.js',
                image: '/three-cesium-examples/public/cesiumExamples/layer/coord.png',
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
                codeUrl: '/three-cesium-examples/public/cesiumExamples/layer/baiduLayer.js',
                image: '/three-cesium-examples/public/cesiumExamples/layer/baiduLayer.jpg',
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
                codeUrl: '/three-cesium-examples/public/cesiumExamples/layer/arcgisLayer.js',
                image: '/three-cesium-examples/public/cesiumExamples/layer/arcgisLayer.jpg',
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
                codeUrl: '/three-cesium-examples/public/cesiumExamples/layer/gaodeLayer.js',
                image: '/three-cesium-examples/public/cesiumExamples/layer/gaodeLayer.jpg',
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
                codeUrl: '/three-cesium-examples/public/cesiumExamples/layer/mapfilterLayer.js',
                image: '/three-cesium-examples/public/cesiumExamples/layer/mapfilterLayer.jpg',
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
                codeUrl: '/three-cesium-examples/public/cesiumExamples/layer/tiandituLayer.js',
                image: '/three-cesium-examples/public/cesiumExamples/layer/tiandituLayer.jpg',
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
                codeUrl: '/three-cesium-examples/public/cesiumExamples/layer/terrainLayer.js',
                image: '/three-cesium-examples/public/cesiumExamples/layer/terrainLayer.jpg',
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
                codeUrl: '/three-cesium-examples/public/cesiumExamples/offline/blue.js',
                image: '/three-cesium-examples/public/cesiumExamples/offline/blue.png',
                meta: {
                    title: '蓝色',
                    keywords: 'cesium.js,蓝色',
                    description: '蓝色'
                }
            }, {
                id: 'day',
                name: '夜间',
                author: 'giser2017',
                codeUrl: '/three-cesium-examples/public/cesiumExamples/offline/day.js',
                image: '/three-cesium-examples/public/cesiumExamples/offline/day.png',
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
                codeUrl: '/three-cesium-examples/public/cesiumExamples/offline/img.js',
                image: '/three-cesium-examples/public/cesiumExamples/offline/img.png',
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
                codeUrl: '/three-cesium-examples/public/cesiumExamples/offline/night.js',
                image: '/three-cesium-examples/public/cesiumExamples/offline/night.png',
                meta: {
                    title: '影像',
                    keywords: 'cesium.js,影像',
                    description: '夜间'
                }
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
                githubUrl: 'https://threelab.cn/dgis/',
                image: '/three-cesium-examples/public/cesiumExamples/tools/mapDataConvert.jpg',
            }
        ]
    }
]