import { HOST, FILE_HOST } from './host.js'

export default [
    {
        pid: 'friendStation',
        name: '首页导航',
        children: [

            {
                id: 'jiawanlong',
                tag: '推荐',
                tip: 'Cesium2024年最新demos，200多个原生示例：自定义纹理、地形开挖、可视域分析、洪水淹没、缓冲分析、日照分析、方量分析、通透分析、剖面、单体化、视频融合、视频投射、雨雪雾、天空盒、场景出图、体积云、闪电、视锥体、雷达扫描、水波纹、动态扩散点、电子围栏、粒子效果、物理引擎、克里金、海流、大数据可视化、坐标转换、相机、飞行漫游、瓦片加载、xyz、tms、wms、wmts、天地图、高德、百度、wkt、shp、geojson、pbf、地形、entity、模型、海量数据、Primitive、gif、聚合、czml、字体图标、运动、3Dtiles、模型偏移、等等。。',
                author: 'jiawanlong',
                name: 'Cesium案例',
                openUrl: 'https://jiawanlong.github.io/examples/cesiumEx/examples.html',
                githubUrl: 'https://github.com/jiawanlong/Cesium-Examples',
                image: FILE_HOST + 'images/jiawanlong.jpg'
            },

            {
                id: 'z2586300277_3d_editor',
                tag: '编辑器-#795cddba',
                tip: '使用three.js开发的低代码组态易用的编辑器',
                name: '低代码组态编辑器',
                author: 'z2586300277',
                openUrl: 'https://z2586300277.github.io/three-editor/dist/#/editor',
                githubUrl: 'https://github.com/z2586300277/three-editor',
                image: FILE_HOST + 'images/editor.jpg',
                links: [
                    {
                        name: '📖CSDN',
                        url: 'https://blog.csdn.net/guang2586/article/details/142910241'
                    }
                ]
            },

            {
                id: 'fmc_car',
                tag: '效果佳',
                name: '麦克斯韦汽车',
                author: 'FFMMCC',
                tip: '效果超级棒的 three.js实现麦克斯韦汽车展厅项目',
                openUrl: 'https://g2657.github.io/examples-server/fmc_car/',
                githubUrl: 'https://gitee.com/fu-meichuan/fmc-personal-blog',
                image: FILE_HOST + 'images/fmc_car.jpg',
                links: [
                    {
                        name: '📺BiBi',
                        url: 'https://www.bilibili.com/video/BV1dxBxYvEnh'
                    }
                ]
            },


            {
                id: 'thanksBibi',
                name: '感谢来自BiBi的支持',
                tag: '感谢BiBi-#ff69b4',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/application/thanksBibi.js',
                image: HOST + 'threeExamples/application/thanksBibi.jpg',
                links: [
                    {
                        name: '📺BiBi',
                        url: 'https://www.bilibili.com/video/BV1HumBYMEa1'
                    }
                ]
            },

            {
                id: '700stars',
                name: 'tks-700stars留念',
                tag: '共筑,共享-rgb(198,0,0)',
                author: 'nico',
                codeUrl: HOST + 'threeExamples/application/700stars.js',
                image: HOST + 'threeExamples/application/700stars.jpg',
            },
        ]
    },

    {
        gid: 'effectGroup',
        group: '三维特效',
        pid: 'shader',
        name: '着色器',
        children: [
            {
                id: 'modelBlendShader',
                name: '模型混合着色器',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/shader/modelBlendShader.js',
                image: HOST + 'threeExamples/shader/modelBlendShader.jpg',
                meta: {
                    title: '模型混合着色器',
                    keywords: 'three.js,模型混合着色器',
                    description: '使用three.js模型混合着色器'
                }
            },
            {
                id: 'grassShader',
                name: '草地着色器',
                author: 'Siricee',
                codeUrl: HOST + 'threeExamples/shader/grassShader.js',
                image: HOST + 'threeExamples/shader/grassShader.jpg',
                meta: {
                    title: '草地着色器',
                    keywords: 'three.js,草地着色器',
                    description: '使用three.js草地着色器'
                }
            },
            {
                id: 'textStarShader',
                name: '点星感谢',
                tag: '致谢',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/shader/textStarShader.js',
                image: HOST + 'threeExamples/shader/textStarShader.jpg',
            },
            {
                id: 'audioSolutions',
                tag: '音乐',
                tip: '将音乐可视化为动态效果',
                name: '音乐可视化',
                author: 'flowers-10',
                codeUrl: HOST + 'threeExamples/shader/audioSolutions.js',
                image: HOST + 'threeExamples/shader/audioSolutions.jpg',
                meta: {
                    title: '音乐可视化',
                    keywords: 'three.js,音乐可视化',
                    description: '使用three.js音乐可视化'
                }
            },
            {
                id: 'cityBlendLight',
                name: '城市混合扫光',
                tag: '常用扫光',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/shader/cityBlendLight.js',
                image: HOST + 'threeExamples/shader/cityBlendLight.jpg',
            },
            {
                id: 'fenceShader',
                name: '围栏着色器',
                author: 'flowers-10',
                codeUrl: HOST + 'threeExamples/shader/fenceShader.js',
                image: HOST + 'threeExamples/shader/fenceShader.jpg',
                meta: {
                    title: '围栏着色器',
                    keywords: 'three.js,围栏着色器',
                    description: '使用three.js围栏着色器'
                }
            },
            {
                id: 'raningSea',
                name: '波涛海浪',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/shader/raningSea.js',
                image: HOST + 'threeExamples/shader/raningSea.jpg',
            },
            {
                id: 'fenceWall',
                name: '围墙着色器',
                author: 'yjsdszz',
                codeUrl: HOST + 'threeExamples/shader/fenceWall.js',
                image: HOST + 'threeExamples/shader/fenceWall.jpg',
                meta: {
                    title: '围墙着色器',
                    keywords: 'three.js,围墙着色器',
                    description: '使用three.js围墙着色器'
                }
            },
            {
                id: 'cityMoveLight',
                name: '智慧城市扫光',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/shader/cityMoveLight.js',
                image: HOST + 'threeExamples/shader/cityMoveLight.jpg',
                meta: {
                    title: '智慧城市扫光',
                    keywords: 'three.js,智慧城市扫光',
                    description: '使用three.智慧城市扫光'
                }
            },
            {
                id: 'cityLight',
                name: '城市光影',
                author: 'z2586300277',
                referUrl: 'https://github.com/Fate-ui/WebglStudy',
                codeUrl: HOST + 'threeExamples/shader/cityLight.js',
                image: HOST + 'threeExamples/shader/cityLight.jpg',
            },
            {
                id: 'audioDance',
                name: '音乐舞动',
                author: 'wuyifan0203',
                codeUrl: HOST + 'threeExamples/shader/audioDance.js',
                image: HOST + 'threeExamples/shader/audioDance.jpg',
            },
            {
                id: 'shaderSky',
                name: '着色器天空',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/shader/shaderSky.js',
                image: HOST + 'threeExamples/shader/shaderSky.jpg',
                meta: {
                    title: '着色器天空',
                    keywords: 'three.js,着色器天空',
                    description: '使用three.js着色器天空'
                }
            },
            {
                id: 'cityLine',
                name: '城市线条',
                author: 'superzay',
                codeUrl: HOST + 'threeExamples/shader/cityLine.js',
                image: HOST + 'threeExamples/shader/cityLine.jpg',
                meta: {
                    title: '城市线条',
                    keywords: 'three.js,城市线条',
                    description: '使用three.js城市线条'
                }
            },
            {
                id: 'wallShader',
                name: '扩散圆墙',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/shader/wallShader.js',
                image: HOST + 'threeExamples/shader/wallShader.jpg',
                meta: {
                    title: '扩散圆墙',
                    keywords: 'three.js,扩散圆墙',
                    description: '使用three.js扩散圆墙'
                }
            },
            {
                id: 'radarShader',
                name: '雷达着色器',
                author: 'stonerao',
                codeUrl: HOST + 'threeExamples/shader/radarShader.js',
                image: HOST + 'threeExamples/shader/radarShader.jpg',
                meta: {
                    title: '雷达着色器',
                    keywords: 'three.js,雷达着色器',
                    description: '使用three.雷达着色器'
                }
            },
            {
                id: 'candleShader',
                name: '蜡烛',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/shader/candleShader.js',
                image: HOST + 'threeExamples/shader/candleShader.jpg',
            },
            {
                id: 'ringShader',
                name: '环形着色器',
                author: 'stonerao',
                codeUrl: HOST + 'threeExamples/shader/ringShader.js',
                image: HOST + 'threeExamples/shader/ringShader.jpg',
                meta: {
                    title: '环形着色器',
                    keywords: 'three.js,环形着色器',
                    description: '使用three.js环形着色器'
                }
            },
            {
                id: 'smokeCircle',
                name: '圆泡吸附',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/shader/smokeCircle.js',
                image: HOST + 'threeExamples/shader/smokeCircle.jpg',
            },
            {
                id: 'radarScan',
                name: '雷达扫描',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/shader/radarScan.js',
                image: HOST + 'threeExamples/shader/radarScan.jpg',
            },
            {
                id: 'imageParticle',
                name: '颗粒图像',
                author: 'superzay',
                codeUrl: HOST + 'threeExamples/shader/imageParticle.js',
                image: HOST + 'threeExamples/shader/imageParticle.jpg',
                meta: {
                    title: '颗粒图像',
                    keywords: 'three.js,颗粒图像',
                    description: '使用three.js颗粒图像'
                }
            },
            {
                id: 'gaussianBlur',
                name: '高斯模糊',
                author: 'hafly',
                codeUrl: HOST + 'threeExamples/shader/gaussianBlur.js',
                image: HOST + 'threeExamples/shader/gaussianBlur.jpg',
                meta: {
                    title: '高斯模糊',
                    keywords: 'three.js,高斯模糊',
                    description: '使用three.js高斯模糊'
                }
            },
            {
                id: 'compassShader',
                name: '罗盘',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/shader/compassShader.js',
                image: HOST + 'threeExamples/shader/compassShader.jpg',
            },
            {
                id: 'halfCircle',
                name: '半圆',
                author: 'yiiiiiiqianyao',
                codeUrl: HOST + 'threeExamples/shader/halfCircle.js',
                image: HOST + 'threeExamples/shader/halfCircle.jpg',
                meta: {
                    title: '半圆',
                    keywords: 'three.js,半圆',
                    description: '使用three.js半圆'
                }
            },
            {
                id: 'vortexShader',
                name: '扭曲',
                author: 'hafly',
                codeUrl: HOST + 'threeExamples/shader/vortexShader.js',
                image: HOST + 'threeExamples/shader/vortexShader.jpg'
            },
            {
                id: 'ringsShader',
                name: '环彩虹着色器',
                author: 'stonerao',
                codeUrl: HOST + 'threeExamples/shader/ringsShader.js',
                image: HOST + 'threeExamples/shader/ringsShader.jpg',
            },
            {
                id: 'heatmapShader',
                name: '热力图',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/shader/heatmapShader.js',
                image: HOST + 'threeExamples/shader/heatmapShader.jpg',
            },
            {
                id: 'videoShader',
                name: '视频着色器',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/shader/videoShader.js',
                image: HOST + 'threeExamples/shader/videoShader.jpg',
                meta: {
                    title: '视频着色器',
                    keywords: 'three.js,视频着色器',
                    description: '使用three.js视频着色器'
                }
            },
            {
                id: 'steamWaveSun',
                name: '蒸汽波太阳',
                author: 'xzw199509',
                codeUrl: HOST + 'threeExamples/shader/steamWaveSun.js',
                image: HOST + 'threeExamples/shader/steamWaveSun.jpg',
                meta: {
                    title: '蒸汽波太阳',
                    keywords: 'three.js,蒸汽波太阳',
                    description: '使用three.js蒸汽波太阳'
                }
            },
            {
                id: 'groundglass',
                name: '毛玻璃',
                author: 'z2586300277',
                referUrl: 'https://github.com/hafly',
                codeUrl: HOST + 'threeExamples/shader/groundglass.js',
                image: HOST + 'threeExamples/shader/groundglass.jpg',
            },
            {
                id: 'cobwebBox',
                name: '蛛网箱子',
                author: 'xzw199509',
                codeUrl: HOST + 'threeExamples/shader/cobwebBox.js',
                image: HOST + 'threeExamples/shader/cobwebBox.jpg',
                meta: {
                    title: '蛛网箱子',
                    keywords: 'three.js,蛛网箱子',
                    description: '使用three.js蛛网箱子'
                }
            },
            {
                id: 'chinaFlag',
                name: '中国旗帜',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/shader/chinaFlag.js',
                image: HOST + 'threeExamples/shader/chinaFlag.jpg',
            },
            {
                id: 'jumpHeart',
                name: '跳动的心',
                author: 'stonerao',
                codeUrl: HOST + 'threeExamples/shader/jumpHeart.js',
                image: HOST + 'threeExamples/shader/jumpHeart.jpg',
            },
            {
                id: 'rasterGrid',
                name: '栅格网格',
                author: 'yjsdszz',
                codeUrl: HOST + 'threeExamples/shader/rasterGrid.js',
                image: HOST + 'threeExamples/shader/rasterGrid.jpg',
                meta: {
                    title: '栅格网格',
                    keywords: 'three.js,栅格网格',
                    description: '使用three.js栅格网格'
                }
            },
            {
                id: 'flowLight',
                name: '流光',
                author: 'Fate-ui',
                codeUrl: HOST + 'threeExamples/shader/flowLight.js',
                image: HOST + 'threeExamples/shader/flowLight.jpg',
                meta: {
                    title: '流光',
                    keywords: 'three.js,流光',
                    description: '使用three.js流光'
                }
            },
            {
                id: 'grayShader',
                name: '灰度',
                author: 'z2586300277',
                referUrl: 'https://github.com/hafly',
                codeUrl: HOST + 'threeExamples/shader/grayShader.js',
                image: HOST + 'threeExamples/shader/grayShader.jpg',
            },
            {
                id: 'waveShader',
                name: '图像波动',
                author: 'gitee18247670551',
                codeUrl: HOST + 'threeExamples/shader/waveShader.js',
                image: HOST + 'threeExamples/shader/waveShader.jpg',
                meta: {
                    title: '图像波动',
                    keywords: 'three.js,图像波动',
                    description: '使用three.js图像波动'
                }
            },
            {
                id: 'dissolve',
                name: '溶解',
                author: 'KallkaGo',
                codeUrl: HOST + 'threeExamples/shader/dissolve.js',
                image: FILE_HOST + 'images/dissolve/dissolve.png',
                meta: {
                    title: '溶解',
                    keywords: 'three.js,溶解',
                    description: '溶解特效'
                }
            },
            {
                id: 'changeShaderToy',
                name: '切换ShaderToy',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/shader/changeShaderToy.js',
                image: HOST + 'threeExamples/shader/changeShaderToy.jpg',
                meta: {
                    title: '切换ShaderToy',
                    keywords: 'three.js,切换ShaderToy',
                    description: '切换ShaderToy'
                }
            },
            {
                id: "waterA",
                name: "波浪效果",
                author: "giser2017",
                codeUrl: HOST + "threeExamples/shader/waterA.js",
                image: HOST + "threeExamples/shader/waterA.jpg",
                meta: {
                    title: "水效果",
                    keywords: "three.js,水效果",
                    description: "使用three水效果",
                },
            },
            {
                id: 'reliefImage',
                name: '浮雕图像',
                author: 'hafly',
                codeUrl: HOST + 'threeExamples/shader/reliefImage.js',
                image: HOST + 'threeExamples/shader/reliefImage.jpg',
            },
            {
                id: 'flowerShader',
                name: '花',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/shader/flowerShader.js',
                image: HOST + 'threeExamples/shader/flowerShader.jpg',
            },
            {
                id: 'dissolveAnimate',
                name: '溶解动画',
                author: 'yiiiiiiqianyao',
                codeUrl: HOST + 'threeExamples/shader/dissolveAnimate.js',
                image: HOST + 'threeExamples/shader/dissolveAnimate.jpg',
                meta: {
                    title: '溶解动画',
                    keywords: 'three.js,溶解动画',
                    description: '使用three.js溶解动画'
                }
            },
            {
                id: "imageShake",
                name: "图片抖动",
                author: "z2586300277",
                codeUrl: HOST + "threeExamples/shader/imageShake.js",
                image: HOST + "threeExamples/shader/imageShake.jpg",
                meta: {
                    title: "图片抖动",
                    keywords: "three.js,图片抖动",
                    description: "使用three图片抖动",
                }
            },
            {
                id: 'heartShader',
                name: '心',
                author: 'z2586300277',
                referUrl: 'https://github.com/xiaolidan00/my-earth?tab=readme-ov-file',
                codeUrl: HOST + 'threeExamples/shader/heartShader.js',
                image: HOST + 'threeExamples/shader/heartShader.jpg',
            },
            {
                id: "shaderBlock",
                name: "方块着色器",
                author: "z2586300277",
                codeUrl: HOST + "threeExamples/shader/shaderBlock.js",
                image: HOST + "threeExamples/shader/shaderBlock.jpg",
                meta: {
                    title: "方块着色器",
                    keywords: "three.js,方块着色器",
                    description: "使用three方块着色器"
                }
            },
            {
                id: "fireball",
                name: "火球效果",
                author: "giser2017",
                htmlUrl: HOST + "threeExamples/shader/fireball.html",
                image: FILE_HOST + "images/four/fireball.png",
                meta: {
                    title: "火球效果",
                    keywords: "three.js,火球效果",
                    description: "火球效果"
                }
            },
            {
                id: 'blobShader',
                name: '一团揉动',
                author: 'z2586300277',
                codeUrl: HOST + "threeExamples/shader/blobShader.js",
                image: HOST + "threeExamples/shader/blobShader.jpg",
            },
            {
                id: "warnInfo",
                name: "警告信息",
                author: "yjsdszz",
                codeUrl: HOST + "threeExamples/shader/warnInfo.js",
                image: HOST + "threeExamples/shader/warnInfo.jpg",
                meta: {
                    title: "警告信息",
                    keywords: "three.js,警告信息",
                    description: "使用three.js 制作警告信息"
                }
            },
            {
                id: 'circleRotate',
                name: '旋转的圆',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/shader/circleRotate.js',
                image: HOST + 'threeExamples/shader/circleRotate.jpg',
            },
            {
                id: 'whiteCloud',
                name: '白云',
                author: 'yjsdszz',
                codeUrl: HOST + 'threeExamples/shader/whiteCloud.js',
                image: HOST + 'threeExamples/shader/whiteCloud.jpg',
                meta: {
                    title: '白云',
                    keywords: 'three.js,白云',
                    description: '使用three.js白云'
                }
            },
            {
                id: 'waterSky',
                name: '水天一色',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/shader/waterSky.js',
                image: HOST + 'threeExamples/shader/waterSky.jpg',
                meta: {
                    title: '水天一色',
                    keywords: 'three.js,水天一色',
                    description: '使用three.js水天一色'
                }
            },
            {
                id: 'cloudShader',
                name: '天空云',
                author: 'wuyifan0203',
                codeUrl: HOST + 'threeExamples/shader/cloudShader.js',
                image: HOST + 'threeExamples/shader/cloudShader.jpg',
            },
            {
                id: 'darkClouds',
                name: '乌云',
                author: 'stonerao',
                codeUrl: HOST + 'threeExamples/shader/darkClouds.js',
                image: HOST + 'threeExamples/shader/darkClouds.jpg',
                meta: {
                    title: '乌云',
                    keywords: 'three.js,乌云',
                    description: '使用three.js乌云'
                }
            },
            {
                id: 'cellShader',
                name: '细胞',
                author: 'stonerao',
                codeUrl: HOST + 'threeExamples/shader/cellShader.js',
                image: HOST + 'threeExamples/shader/cellShader.jpg',
            },
            {
                id: 'mushroom',
                name: '蘑菇',
                author: 'bubinyang',
                codeUrl: HOST + 'threeExamples/shader/mushroom.js',
                image: HOST + 'threeExamples/shader/mushroom.jpg',
            },
            {
                id: 'mosaicShader',
                name: '马赛克',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/shader/mosaicShader.js',
                image: HOST + 'threeExamples/shader/mosaicShader.jpg',
            },
            {
                id: 'shader_planet',
                name: '着色器行星',
                author: 'nico',
                codeUrl: HOST + 'threeExamples/shader/shader_planet.js',
                image: HOST + 'threeExamples/shader/shader_planet.jpg',
                inject: {
                    importmap: {
                        "three_noise": FILE_HOST + "js/wasm/three_noise.js"
                    }
                }
            },
            {
                id: 'contour',
                name: '魔幻山体',
                author: 'nico',
                codeUrl: HOST + 'threeExamples/shader/contour.js',
                image: HOST + 'threeExamples/shader/contour.jpg',
            },
            {
                id: 'softLight',
                name: '柔光',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/shader/softLight.js',
                image: HOST + 'threeExamples/shader/softLight.jpg',
            },
            {
                id: 'earthScan',
                name: '地球扫描',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/shader/earthScan.js',
                image: HOST + 'threeExamples/shader/earthScan.jpg',
                referUrl: 'https://juejin.cn/post/7378535517950525466'
            },
            {
                id: 'waveScan',
                name: '波扫描',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/shader/waveScan.js',
                image: HOST + 'threeExamples/shader/waveScan.jpg',
            }
        ]
    },
    {
        gid: 'effectGroup',
        pid: 'particle',
        name: '粒子',
        children: [
            {
                id: 'z2586300277',
                name: '优雅永不过时',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/particle/z2586300277.js',
                image: HOST + 'threeExamples/particle/z2586300277.jpg',
            },
            {
                id: "RandomParticle",
                name: "随机粒子效果",
                author: "giser2017",
                htmlUrl: HOST + "threeExamples/particle/RandomParticle.html",
                image: HOST + "threeExamples/particle/RandomParticle.jpg",
                meta: {
                    title: "随机粒子效果",
                    keywords: "three.js,随机粒子效果",
                    description: "随机粒子效果"
                }
            },
            {
                id: "PlanetParticle",
                name: "粒子效果的行星",
                author: "giser2017",
                htmlUrl: HOST + "threeExamples/particle/PlanetParticle.html",
                image: HOST + "threeExamples/particle/PlanetParticle.jpg",
                meta: {
                    title: "粒子效果的行星",
                    keywords: "three.js,粒子效果的行星",
                    description: "粒子效果的行星"
                }
            },

            {
                id: "bubble",
                name: "粒子泡泡",
                author: "huan_meng_hai_yan",
                codeUrl: HOST + "threeExamples/particle/bubble.js",
                image: FILE_HOST + "images/four/bubble.png",
                meta: {
                    title: "粒子泡泡",
                    keywords: "three.js,粒子泡泡",
                    description: "粒子泡泡"
                }
            },

            {
                id: 'particleBlendShader',
                name: '粒子混合着色器',
                tag: '混合着色',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/particle/particleBlendShader.js',
                image: HOST + 'threeExamples/particle/particleBlendShader.jpg',
            },

            {
                id: 'particleScattered',
                name: '粒子聚散',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/particle/particleScattered.js',
                image: HOST + 'threeExamples/particle/particleScattered.jpg',
                meta: {
                    title: '粒子聚散',
                    keywords: 'three.js,粒子聚散',
                    description: '使用three.js粒子聚散'
                }
            },
            {
                id: "downSnow",
                name: "下雪",
                author: "yjsdszz",
                codeUrl: HOST + "threeExamples/particle/downSnow.js",
                image: HOST + "threeExamples/particle/downSnow.jpg",
                meta: {
                    title: "下雪",
                    keywords: "three.js,下雪",
                    description: "使用three.js下雪"
                }
            },
            {
                id: 'galaxyStar',
                name: '星系',
                author: 'kavalcio',
                codeUrl: HOST + 'threeExamples/particle/galaxyStar.js',
                image: HOST + 'threeExamples/particle/galaxyStar.jpg',
                meta: {
                    title: '星系',
                    keywords: 'three.js,星系',
                    description: '使用three.js星系'
                }
            },
            {
                id: 'pointsEarth',
                name: '粒子地球',
                author: 'giser2017',
                codeUrl: HOST + 'threeExamples/particle/pointsEarth.js',
                image: HOST + 'threeExamples/particle/pointsEarth.jpg',
                meta: {
                    title: '粒子地球',
                    keywords: 'three.js,粒子地球',
                    description: '使用three.js粒子地球'
                }
            },
            {
                id: 'waveParticleShader',
                name: '波浪粒子',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/particle/waveParticleShader.js',
                image: HOST + 'threeExamples/particle/waveParticleShader.jpg',
            },
            {
                id: 'particleLine',
                name: '粒子线条',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/particle/particleLine.js',
                image: HOST + 'threeExamples/particle/particleLine.jpg',
            },
            {
                id: 'sphereLine',
                name: '球体线条',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/particle/sphereLine.js',
                image: HOST + 'threeExamples/particle/sphereLine.jpg',
            },
            {
                id: 'particleWire',
                referUrl: 'https://mp.weixin.qq.com/s/R-WEoTG30DlqXvFfDgXQdg',
                name: '粒子线',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/particle/particleWire.js',
                image: HOST + 'threeExamples/particle/particleWire.jpg',
            },
            {
                id: 'particleFire',
                name: '粒子烟花',
                author: 'FFMMCC',
                codeUrl: HOST + 'threeExamples/particle/particleFire.js',
                image: HOST + 'threeExamples/particle/particleFire.jpg',
            },
            {
                id: 'starrySky',
                name: '粒子星空',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/particle/starrySky.js',
                image: HOST + 'threeExamples/particle/starrySky.jpg',
            }
        ]
    },
    {
        pid: 'application',
        name: '应用场景',
        children: [
            {
                id: 'z2586300277',
                name: '优雅永不过时',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/application/z2586300277.js',
                image: HOST + 'threeExamples/application/z2586300277.jpg',
            },

            {
                id: 'magicCircle',
                name: '魔法阵',
                author: 'gitee18247670551',
                codeUrl: HOST + 'threeExamples/application/magicCircle.js',
                image: HOST + 'threeExamples/application/magicCircle.jpg',
                meta: {
                    title: '魔法阵',
                    keywords: 'three.js,魔法阵',
                    description: '使用three.js魔法阵'
                }
            },

            {
                id: 'codeCloud',
                name: '代码云',
                author: 'yiiiiiiqianyao',
                codeUrl: HOST + 'threeExamples/application/codeCloud.js',
                image: HOST + 'threeExamples/application/codeCloud.jpg',
                meta: {
                    title: '代码云',
                    keywords: 'three.js,代码云',
                    description: '使用three.js代码云'
                }
            },
            {
                id: 'ghostHouse',
                name: '鬼屋',
                author: 'FFMMCC',
                codeUrl: HOST + 'threeExamples/application/ghostHouse.js',
                image: HOST + 'threeExamples/application/ghostHouse.jpg',
            },
            {
                id: 'flowLine',
                name: '贴图飞线',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/application/flowLine.js',
                image: HOST + 'threeExamples/application/flowLine.jpg',
            },
            {
                id: 'flyLine',
                name: '飞线效果',
                author: 'ecojust',
                codeUrl: HOST + 'threeExamples/application/flyLine.js',
                image: FILE_HOST + 'threeExamples/application/flyLine/colorful.jpg',
                meta: {
                    title: '飞线效果',
                    keywords: 'three.js,飞线效果',
                    description: '使用three.js飞线效果'
                }
            },
            {
                id: 'pipeFlow',
                name: '管道流动',
                author: 'gitee18247670551',
                codeUrl: HOST + 'threeExamples/application/pipeFlow.js',
                image: HOST + 'threeExamples/application/pipeFlow.jpg',
                meta: {
                    title: '管道流动',
                    keywords: 'three.js,管道流动',
                    description: '使用three.js管道流动'
                }
            },
            {
                id: 'videoModel',
                name: '模型视频材质',
                author: 'z2586300277',
                referUrl: 'https://github.com/YCYTeam/YCY-TrainingCamp-S2/blob/main/src/day02_%E7%9B%B4%E6%92%AD%E4%BB%A3%E7%A0%81.js',
                codeUrl: HOST + 'threeExamples/application/videoModel.js',
                image: HOST + 'threeExamples/application/videoModel.jpg',
            },
            {
                id: 'spriteText',
                name: '精灵文字',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/application/spriteText.js',
                image: HOST + 'threeExamples/application/spriteText.jpg',
                meta: {
                    title: '精灵文字',
                    keywords: 'three.js,精灵文字',
                    description: '使用three.js精灵文字'
                }
            },
            {
                id: 'simple_collision',
                name: '简单碰撞检测',
                author: 'nico',
                codeUrl: HOST + 'threeExamples/application/simpleCollision.js',
                image: HOST + 'threeExamples/application/simple_coll.jpg',
                inject: {
                    importmap: {
                        "three-mesh-bvh": FILE_HOST + "js/bvh.module.js"
                    }
                }
            },
            {
                id: 'diffuseLine',
                name: '发散飞线',
                author: 'stonerao',
                codeUrl: HOST + 'threeExamples/application/diffuseLine.js',
                image: HOST + 'threeExamples/application/diffuseLine.jpg',
                meta: {
                    title: '发散飞线',
                    keywords: 'three.js,发散飞线',
                    description: '使用three.js发散飞线'
                }
            },
            {
                id: 'lampshade',
                name: '灯罩',
                author: 'Fate-ui',
                codeUrl: HOST + 'threeExamples/application/lampshade.js',
                image: HOST + 'threeExamples/application/lampshade.jpg',
            },
            {
                id: 'smokeAir',
                name: '烟雾效果',
                author: 'yjsdszz',
                codeUrl: HOST + 'threeExamples/application/smokeAir.js',
                image: FILE_HOST + 'threeExamples/application/smokeAir.jpg',
                meta: {
                    title: '烟雾效果',
                    keywords: 'three.js,烟雾效果',
                    description: '使用three.js烟雾效果'
                }
            },
            {
                id: 'lightIcon',
                name: '亮光标记',
                author: 'Fate-ui',
                codeUrl: HOST + 'threeExamples/application/lightIcon.js',
                image: HOST + 'threeExamples/application/lightIcon.jpg',
            },
            {
                id: 'topology',
                name: '简单3d拓扑图',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/application/topology.js',
                image: HOST + 'threeExamples/application/topology.jpg',
                meta: {
                    title: '3d拓扑图',
                    keywords: 'three.js,3d拓扑图',
                    description: '使用three.js制作3d拓扑图'
                }
            },
            {
                id: 'pieCharts',
                name: '3D饼图',
                author: 'superzay',
                codeUrl: HOST + 'threeExamples/application/pieCharts.js',
                image: HOST + 'threeExamples/application/pieCharts.jpg',
                meta: {
                    title: '3D饼图',
                    keywords: 'three.js,3D饼图',
                    description: '使用three.js制作3D饼图'
                }
            },
            {
                id: 'drawFace',
                name: '绘制面',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/application/drawFace.js',
                image: HOST + 'threeExamples/application/drawFace.jpg',
            },
            {
                id: 'drawFace_improve',
                name: '绘制面_内置点',
                author: 'nico',
                codeUrl: HOST + 'threeExamples/application/draw_face_improve.js',
                image: HOST + 'threeExamples/application/draw_face_improve.jpg',
            },
            {
                id: 'roadShader',
                name: '道路流光',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/application/roadShader.js',
                image: HOST + 'threeExamples/application/roadShader.jpg',
                referUrl: 'https://juejin.cn/post/7386485874300223514'
            },
            {
                id: 'model_navigation',
                name: '模型导航',
                author: 'nico',
                codeUrl: HOST + 'threeExamples/application/nav.js',
                image: HOST + 'threeExamples/application/nav.jpg',
                inject: {
                    "importmap": {
                        "@recast-navigation/three": FILE_HOST + "js/@recast-navigation/three/dist/index.mjs",
                        "@recast-navigation/core": FILE_HOST + "js/@recast-navigation/core/dist/index.mjs",
                        "@recast-navigation/wasm": FILE_HOST + "js/@recast-navigation/wasm/dist/recast-navigation.wasm-compat.js",
                        "@recast-navigation/generators": FILE_HOST + "js/@recast-navigation/generators/dist/index.mjs",
                        "three.path": FILE_HOST + "js/three.path.module.js"
                    }
                },
                meta: {
                    title: '模型导航',
                    keywords: 'three.js,模型导航',
                    description: '模型导航'
                }
            },
            {
                id: 'terrain',
                name: '程序化地形生成',
                author: 'nico',
                codeUrl: HOST + 'threeExamples/application/generate_terrain.js',
                image: HOST + 'threeExamples/application/generate_terrain.jpg',
                meta: {
                    title: '程序化地形生成',
                    keywords: 'three.js,程序化地形生成',
                    description: '程序化地形生成'
                }
            },
            {
                id: 'lineMeasure',
                name: '测量',
                author: 'yjsdszz',
                codeUrl: HOST + 'threeExamples/application/lineMeasure.js',
                image: HOST + 'threeExamples/application/lineMeasure.jpg',
            },
            {
                id: 'textSphere',
                name: '球体文字',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/application/textSphere.js',
                image: HOST + 'threeExamples/application/textSphere.jpg',
                meta: {
                    title: '球体文字',
                    keywords: 'three.js,球体文字',
                    description: '使用three球体文字'
                }
            },
            {
                id: 'matrixOperation',
                name: '矩阵操作',
                author: 'alwxkxk',
                htmlUrl: HOST + 'threeExamples/application/matrixOperation.html',
                image: HOST + 'threeExamples/application/matrixOperation.jpg',
                meta: {
                    title: '矩阵操作',
                    keywords: 'three.js,矩阵操作',
                    description: '矩阵操作'
                }
            },
            {
                id: 'coffeeMug',
                name: '咖啡',
                author: 'kavalcio',
                codeUrl: HOST + 'threeExamples/application/coffeeMug.js',
                image: HOST + 'threeExamples/application/coffeeMug.jpg',
                meta: {
                    title: '咖啡',
                    keywords: 'three.js,咖啡',
                    description: '咖啡'
                }
            },
            {
                id: 'lightBar',
                name: '光柱',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/application/lightBar.js',
                image: HOST + 'threeExamples/application/lightBar.jpg',
            },
            {
                id: 'flowerRain',
                name: '花瓣雨',
                author: 'QuarkGluonPlasma',
                codeUrl: HOST + 'threeExamples/application/flowerRain.js',
                image: HOST + 'threeExamples/application/flowerRain.jpg',
                meta: {
                    title: '花瓣雨',
                    keywords: 'three.js,花瓣雨',
                    description: '花瓣雨'
                }
            },
            {
                id: 'houseScene',
                name: '第一人称房屋',
                author: 'QuarkGluonPlasma',
                codeUrl: HOST + 'threeExamples/application/houseScene.js',
                image: HOST + 'threeExamples/application/houseScene.jpg',
                meta: {
                    title: '第一人称房屋',
                    keywords: 'three.js,第一人称房屋',
                    description: '第一人称房屋'
                }
            },
            {
                id: "3DCircle",
                name: "扩散半球",
                author: "giser2017",
                codeUrl: HOST + "threeExamples/application/3DCircle.js",
                image: FILE_HOST + "images/four/3DCircle.png",
                meta: {
                    title: "扩散半球",
                    keywords: "three.js,扩散半球",
                    description: "扩散半球"
                }
            },
            {
                id: 'happyNewYear',
                name: '新年快乐',
                author: 'yjsdszz',
                codeUrl: HOST + 'threeExamples/application/happyNewYear.js',
                image: HOST + 'threeExamples/application/happyNewYear.jpg',
                meta: {
                    title: '新年快乐',
                    keywords: 'three.js,新年快乐',
                    description: '新年快乐'
                }
            },
            {
                id: 'windMove',
                name: '风吹动画',
                author: 'yjsdszz',
                codeUrl: HOST + 'threeExamples/application/windMove.js',
                image: HOST + 'threeExamples/application/windMove.jpg',
                meta: {
                    title: '风吹动画',
                    keywords: 'three.js,风吹动画',
                    description: '风吹动画'
                }
            },
            {
                id: 'gsapCollection',
                name: '动画合集',
                tag: '动画',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/application/gsapCollection.js',
                image: HOST + 'threeExamples/application/gsapCollection.jpg'
            },
            {
                id: 'customGrid',
                name: '自定义网格',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/application/customGrid.js',
                image: HOST + 'threeExamples/application/customGrid.jpg',
            },
            {
                id: 'faceMesh',
                name: '表情',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/application/faceMesh.js',
                image: HOST + 'threeExamples/application/faceMesh.jpg',
            },
            {
                id: 'isoline',
                name: '等值线',
                author: 'nico',
                codeUrl: HOST + 'threeExamples/application/isoline.js',
                image: HOST + 'threeExamples/application/isoline.jpg',
            },
            {
                id: 'flowTube',
                name: '管道表面运动',
                author: 'nico',
                codeUrl: HOST + 'threeExamples/application/flowTube.js',
                image: HOST + 'threeExamples/application/flowTube.png',
            }
        ]
    },
    {
        pid: 'animation',
        name: '动画效果',
        children: [
            {
                id: 'clipAnimation',
                name: '裁剪动画',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/animation/clipAnimation.js',
                image: HOST + 'threeExamples/animation/clipAnimation.jpg',
            },
            {
                id: 'personAnimation',
                name: '点击第三人称移动',
                tag: '人物行走',
                tip: '点击地面，人物会自动走到目标位置',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/animation/personAnimation.js',
                image: HOST + 'threeExamples/animation/personAnimation.jpg',
            }
        ]
    },
    {
        pid: 'physics',
        name: '物理应用',
        children: [
            {
                id: 'physicsMesh',
                name: '物理cannon使用',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/physics/physicsMesh.js',
                image: HOST + 'threeExamples/physics/physicsMesh.jpg',
                inject: {
                    importmap: {
                        "cannon-es": HOST + "js/cannon-es.js"
                    }
                }
            },
            {
                id: 'ammoPhysics',
                name: '物理ammo使用',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/physics/ammoPhysics.js',
                image: HOST + 'threeExamples/physics/ammoPhysics.jpg',
                inject: {
                    src: [FILE_HOST + "js/three/addons/libs/ammo.wasm.js"]
                }
            }
        ]
    },
    {
        pid: 'expand',
        name: '扩展功能',
        children: [
            {
                id: 'loadTiles',
                name: '加载3dtiles',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/expand/loadTiles.js',
                image: HOST + 'threeExamples/expand/loadTiles.jpg',
                inject: { "importmap": { "3d-tiles-renderer": FILE_HOST + "js/3dTilesRenderer/index.js" } },
                meta: {
                    title: 'three加载3dtiles',
                    keywords: 'three.js,3dtiles',
                    description: '使用three加载3dtiles'
                }
            },
            {
                id: 'map3d',
                name: '3D地图',
                author: 'z2586300277',
                codeUrl: 'https://g2657.github.io/examples-server/three/test/map3d.js',
                image: 'https://g2657.github.io/examples-server/three/test/map3d.jpg',
                meta: {
                    title: '3D地图',
                    keywords: 'three.js,3D地图',
                    description: '使用three.js制作3D地图'
                }
            },
            {
                id: 'geoBorder',
                name: '地理边界',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/expand/geoBorder.js',
                image: HOST + 'threeExamples/expand/geoBorder.jpg',
            },
            {
                id: 'heatmap3D',
                name: '3D热力图',
                tag: '常用-#e1d100',
                author: 'z2586300277',
                referUrl: 'https://github.com/treasureMoment/heatmap-three.js',
                githubUrl: 'https://github.com/treasureMoment/heatmap-three.js',
                codeUrl: HOST + 'threeExamples/expand/heatmap3D.js',
                image: HOST + 'threeExamples/expand/heatmap3D.jpg',
                meta: {
                    title: '3D热力图',
                    keywords: 'three.js,3D热力图',
                    description: '使用three.js制作3D热力图'
                },
                inject: {
                    src: [HOST + "js/heatmap.js"]
                }
            },
            {
                id: 'heatmapModel',
                name: '模型热力图',
                author: 'z2586300277',
                referUrl: 'https://github.com/CHENJIAMIAN/InterpolatedGradientMaterial',
                codeUrl: HOST + 'threeExamples/expand/heatmapModel.js',
                image: HOST + 'threeExamples/expand/heatmapModel.jpg',
            },
            {
                id: 'modelBlendReflector',
                name: '模型反射效果',
                tag: '模型反射--14',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/expand/modelBlendReflector.js',
                image: HOST + 'threeExamples/expand/modelBlendReflector.jpg',
            },
            {
                id: 'blurReflect',
                name: '模糊反射(drei转原生)',
                tag: '磨砂反射-#d265bb',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/expand/blurReflect.js',
                image: HOST + 'threeExamples/expand/blurReflect.jpg',
                referUrl: 'https://codesandbox.io/p/sandbox/bfplr'
            },
            {
                id: 'multWindowScene',
                name: '多浏览器窗口连接',
                author: 'z2586300277',
                referUrl: 'https://github.com/bgstaal/multipleWindow3dScene',
                codeUrl: HOST + 'threeExamples/expand/multWindowScene.js',
                image: HOST + 'threeExamples/expand/multWindowScene.jpg',
            }
        ]
    },
    {
        pid: 'effectComposer',
        name: '后期处理',
        children: [
            {
                id: 'selectBloomPass',
                name: '辉光-postprocessing',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/effectComposer/selectBloomPass.js',
                image: HOST + 'threeExamples/effectComposer/selectBloomPass.jpg',
                meta: {
                    title: '辉光通道',
                    keywords: 'three.js,辉光通道',
                    description: '使用three.js辉光通道'
                }
            },
            {
                id: 'customMaskPass',
                name: '自定义遮罩通道',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/effectComposer/customMaskPass.js',
                image: HOST + 'threeExamples/effectComposer/customMaskPass.jpg',
                meta: {
                    title: '自定义遮罩通道',
                    keywords: 'three.js,自定义遮罩通道',
                    description: '使用three.js自定义遮罩通道'
                }
            },
            {
                id: "uvTransformation",
                name: "UV图像变换",
                author: "giser2017",
                codeUrl: HOST + 'threeExamples/effectComposer/uvTransformation.js',
                image: FILE_HOST + "images/four/uvTransformation.png",
                meta: {
                    title: "UV图像变换",
                    keywords: "three.js,UV图像变换",
                    description: "UV图像变换"
                }
            },
            {
                id: 'afterimagePass',
                name: '残影效果',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/effectComposer/afterimagePass.js',
                image: HOST + 'threeExamples/effectComposer/afterimagePass.jpg',
            },
            {
                id: 'saturationPass',
                name: '饱和度(自定义Pass)',
                author: 'huan_meng_hai_yan',
                codeUrl: HOST + 'threeExamples/effectComposer/saturationPass.js',
                image: HOST + 'threeExamples/effectComposer/saturationPass.jpg',
            },
            {
                id: "EdgeBlurringEffect",
                name: "边缘模糊效果",
                author: "giser2017",
                codeUrl: HOST + 'threeExamples/effectComposer/EdgeBlurringEffect.js',
                image: FILE_HOST + "images/four/EdgeBlurringEffect.png",
                meta: {
                    title: "边缘模糊效果",
                    keywords: "three.js,边缘模糊效果",
                    description: "边缘模糊效果"
                }
            },
            {
                id: 'threeSelectBloom',
                name: '官方选择辉光简化版',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/effectComposer/threeSelectBloom.js',
                image: HOST + 'threeExamples/effectComposer/threeSelectBloom.jpg',
                meta: {
                    title: '官方选择辉光简化版',
                    keywords: 'three.js,官方选择辉光简化版',
                    description: '使用three.js官方选择辉光简化版'
                }
            }
        ]
    },
    {
        gid: 'generalGroup',
        group: '常规案例',
        pid: 'basic',
        name: '基础案例',
        children: [
            {
                id: 'modelAnimation',
                name: '人物模型动画案例',
                author: 'abining',
                codeUrl: HOST + 'threeExamples/basic/modelAnimation.js',
                image: HOST + 'threeExamples/basic/modelAnimation.jpg',
                meta: {
                    title: '模型动画',
                    keywords: 'three.js,模型动画',
                    description: '使用three.js的fbx模型动画'
                }
            },
            {
                id: 'modelLoad',
                name: 'gltf/fbx/obj模型加载',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/basic/modelLoad.js',
                image: HOST + 'threeExamples/basic/modelLoad.jpg',
                meta: {
                    title: '模型加载',
                    keywords: 'three.js,模型加载',
                    description: '使用three.js模型加载'
                }
            },
            {
                id: 'modelShadow',
                name: '模型阴影',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/basic/modelShadow.js',
                image: HOST + 'threeExamples/basic/modelShadow.jpg',
            },
            {
                id: 'cameraAttribute',
                name: '相机属性',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/basic/cameraAttribute.js',
                image: HOST + 'threeExamples/basic/cameraAttribute.jpg',
            },
            {
                id: 'orbControls',
                name: '轨道控制器',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/basic/orbControls.js',
                image: HOST + 'threeExamples/basic/orbControls.jpg',
            },
            {
                id: 'createScene',
                name: '创建场景',
                tag: '分布库-#f00',
                tip: '使用分布式仓库, 开发案例, 可互相引用运行',
                author: 'z2586300277',
                referUrl: 'https://z2586300277.github.io/three-cesium-examples-self/',
                codeUrl: 'https://z2586300277.github.io/three-cesium-examples-self/threeExamples/createScene.js',
                image: 'https://z2586300277.github.io/three-cesium-examples-self/threeExamples/createScene.jpg',
                githubUrl: 'https://github.com/z2586300277/three-cesium-examples-self',
            },
            {
                id: 'modelSky',
                name: '模型天空',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/basic/modelSky.js',
                image: HOST + 'threeExamples/basic/modelSky.jpg',
            },
            {
                id: 'sceneFog',
                name: '场景雾化',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/basic/sceneFog.js',
                image: HOST + 'threeExamples/basic/sceneFog.jpg'
            },
            {
                id: 'gltfOptLoader',
                name: 'Opt解压(su7 模型)',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/basic/gltfOptLoader.js',
                image: HOST + 'threeExamples/basic/gltfOptLoader.jpg'
            },
            {
                id: 'loadingAnimate',
                name: '加载动画',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/basic/loadingAnimate.js',
                image: HOST + 'threeExamples/basic/loadingAnimate.jpg',
            },
            {
                id: 'outlinePass',
                name: '轮廓光',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/basic/outlinePass.js',
                image: HOST + 'threeExamples/basic/outlinePass.jpg',
                meta: {
                    title: '轮廓光',
                    keywords: 'three.js,轮廓光',
                    description: '使用three轮廓光'
                }
            },
            {
                id: 'screenCoord',
                name: '三维转屏幕坐标',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/basic/screenCoord.js',
                image: HOST + 'threeExamples/basic/screenCoord.jpg'
            },
            {
                id: 'gradientTriangle',
                name: '渐变三角形',
                author: 'giser2017',
                codeUrl: HOST + 'threeExamples/basic/gradientTriangle.js',
                image: HOST + 'threeExamples/basic/gradientTriangle.jpg',
                meta: {
                    title: '渐变三角形',
                    keywords: 'three.js,渐变三角形',
                    description: '使用three.js渐变三角形'
                }
            },
            {
                id: 'modelUnpack',
                name: '模型拆解动画',
                tag: '拆解',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/basic/modelUnpack.js',
                image: HOST + 'threeExamples/basic/modelUnpack.jpg',
            },
            {
                id: 'changeMaterial',
                name: '材质修改动画',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/basic/changeMaterial.js',
                image: HOST + 'threeExamples/basic/changeMaterial.jpg',
            },
            {
                id: 'transformObject',
                name: '拖拽控制',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/basic/transformObject.js',
                image: HOST + 'threeExamples/basic/transformObject.jpg',
            },
            {
                id: 'transformBox3',
                name: '变换Box3',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/basic/transformBox3.js',
                image: HOST + 'threeExamples/basic/transformBox3.jpg',
            },
            {
                id: 'skyAndEnv',
                name: '天空盒',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/basic/skyAndEnv.js',
                image: HOST + 'threeExamples/basic/skyAndEnv.jpg',
                meta: {
                    title: '天空盒',
                    keywords: 'three.js,天空盒',
                    description: '使用three.js天空盒'
                }
            },
            {
                id: 'modelAnimates',
                name: '单/多模型动画',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/basic/modelAnimates.js',
                image: HOST + 'threeExamples/basic/modelAnimates.jpg',
                meta: {
                    title: '模型自带动画',
                    keywords: 'three.js,模型自带动画',
                    description: '使用three播放模型自带动画'
                }
            },
            {
                id: 'gsapAnimate',
                name: 'GSAP动画',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/basic/gsapAnimate.js',
                image: HOST + 'threeExamples/basic/gsapAnimate.jpg',
                meta: {
                    title: 'GSAP动画',
                    keywords: 'three.js,GSAP动画',
                    description: '使用three.js GSAP动画'
                }
            },
            {
                id: 'spriteTexture',
                name: '精灵标签',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/basic/spriteTexture.js',
                image: HOST + 'threeExamples/basic/spriteTexture.jpg',
            },
            {
                id: 'modelView',
                name: '模型视图',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/basic/modelView.js',
                image: HOST + 'threeExamples/basic/modelView.jpg',
            },
            {
                id: 'cssElement',
                name: 'CSS元素',
                tag: 'DOM',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/basic/cssElement.js',
                image: HOST + 'threeExamples/basic/cssElement.jpg',
                meta: {
                    title: 'CSS元素',
                    keywords: 'three.js,CSS元素',
                    description: '使用three.js CSS元素'
                }
            },
            {

                id: 'curveAnimate',
                name: '曲线动画',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/basic/curveAnimate.js',
                image: HOST + 'threeExamples/basic/curveAnimate.jpg',
                meta: {
                    title: '曲线动画',
                    keywords: 'three.js,曲线动画',
                    description: '使用three.js曲线动画'
                }
            },
            {
                id: 'transformAnimate',
                name: 'Mesh变换动画',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/basic/transformAnimate.js',
                image: HOST + 'threeExamples/basic/transformAnimate.jpg',
                meta: {
                    title: '变换动画',
                    keywords: 'three.js,变换动画',
                    description: '使用three.js变换动画'
                }
            },
            {
                id: 'screenShot',
                name: '截图',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/basic/screenShot.js',
                image: HOST + 'threeExamples/basic/screenShot.jpg',
                meta: {
                    title: '截图',
                    keywords: 'three.js,截图',
                    description: '使用three.js截图'
                }
            },
            {
                id: 'skeletonBone',
                name: '骨骼动画',
                author: 'yjsdszz',
                codeUrl: HOST + 'threeExamples/basic/skeletonBone.js',
                image: FILE_HOST + 'threeExamples/basic/skeletonBone.jpg',
                meta: {
                    title: '骨骼动画',
                    keywords: 'three.js,骨骼动画',
                    description: '使用three.js骨骼动画'
                }
            },
            {
                id: 'viewHelper',
                name: '视图辅助',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/basic/viewHelper.js',
                image: HOST + 'threeExamples/basic/viewHelper.jpg',
            }
        ]
    },
    {
        gid: 'generalGroup',
        group: '常规案例',
        pid: 'introduction',
        name: '入门案例',
        children: [
            {
                id: "入门",
                name: "入门",
                author: "jiawanlong",
                codeUrl: HOST + "threeExamples/basic/入门.js",
                image: HOST + "threeExamples/basic/入门.png",
                meta: {
                    title: "入门",
                    keywords: "three.js,入门",
                    description: "使用three.js入门"
                }
            },
            {
                id: "辅助线",
                name: "辅助线",
                author: "jiawanlong",
                codeUrl: HOST + "threeExamples/basic/辅助线.js",
                image: HOST + "threeExamples/basic/辅助线.png",
                meta: {
                    title: "辅助线",
                    keywords: "three.js,辅助线",
                    description: "使用three.js辅助线"
                }
            },
            {
                id: "光线",
                name: "光线",
                author: "jiawanlong",
                codeUrl: HOST + "threeExamples/basic/光线.js",
                image: HOST + "threeExamples/basic/光线.png",
                meta: {
                    title: "光线",
                    keywords: "three.js,光线",
                    description: "使用three.js光线"
                }
            },
            {
                id: "相机控件",
                name: "相机控件",
                author: "jiawanlong",
                codeUrl: HOST + "threeExamples/basic/相机控件.js",
                image: HOST + "threeExamples/basic/相机控件.png",
                meta: {
                    title: "相机控件",
                    keywords: "three.js,相机控件",
                    description: "使用three.js相机控件"
                }
            },
            {
                id: "动画",
                name: "动画",
                author: "jiawanlong",
                codeUrl: HOST + "threeExamples/basic/动画.js",
                image: HOST + "threeExamples/basic/动画.png",
                meta: {
                    title: "动画",
                    keywords: "three.js,动画",
                    description: "使用three.js动画"
                }
            },
            {
                id: "全屏",
                name: "全屏",
                author: "jiawanlong",
                codeUrl: HOST + "threeExamples/basic/全屏.js",
                image: HOST + "threeExamples/basic/全屏.png",
                meta: {
                    title: "全屏",
                    keywords: "three.js,全屏",
                    description: "使用three.js全屏"
                }
            },
            {
                id: "帧率",
                name: "帧率",
                author: "jiawanlong",
                codeUrl: HOST + "threeExamples/basic/帧率.js",
                image: HOST + "threeExamples/basic/帧率.jpg",
                meta: {
                    title: "帧率",
                    keywords: "three.js,帧率",
                    description: "使用three.js帧率"
                }
            },
            {
                id: "阵列模型",
                name: "阵列模型",
                author: "jiawanlong",
                codeUrl: HOST + "threeExamples/basic/阵列模型.js",
                image: HOST + "threeExamples/basic/阵列模型.jpg",
                meta: {
                    title: "阵列模型",
                    keywords: "three.js,阵列模型",
                    description: "使用three.js阵列模型"
                }
            },
            {
                id: "几何体",
                name: "几何体",
                author: "jiawanlong",
                codeUrl: HOST + "threeExamples/basic/几何体.js",
                image: HOST + "threeExamples/basic/几何体.jpg",
                meta: {
                    title: "几何体",
                    keywords: "three.js,几何体",
                    description: "使用three.js几何体"
                }
            },
            {
                id: "点线",
                name: "点、线",
                name_en: "点、线",
                author: "jiawanlong",
                codeUrl: HOST + "threeExamples/basic/点线.js",
                image: HOST + "threeExamples/basic/点、线.png",
                meta: {
                    title: "点、线",
                    keywords: "three.js,点线",
                    description: "使用three.js点、线"
                }
            },
            {
                id: "网格",
                name: "网格",
                name_en: "网格",
                author: "jiawanlong",
                codeUrl: HOST + "threeExamples/basic/网格.js",
                image: HOST + "threeExamples/basic/网格.png",
                meta: {
                    title: "网格",
                    keywords: "three.js,网格",
                    description: "使用three.js网格"
                }
            },
            {
                id: "索引",
                name: "索引",
                name_en: "索引",
                author: "jiawanlong",
                codeUrl: HOST + "threeExamples/basic/索引.js",
                image: HOST + "threeExamples/basic/索引.png",
                meta: {
                    title: "索引",
                    keywords: "three.js,索引",
                    description: "使用three.js索引"
                }
            },
            {
                id: "旋转缩放平移几何体",
                name: "旋转、缩放、平移几何体",
                name_en: "旋转、缩放、平移几何体",
                author: "jiawanlong",
                codeUrl: HOST + "threeExamples/basic/旋转、缩放、平移几何体.js",
                image: HOST + "threeExamples/basic/旋转、缩放、平移几何体.jpg",
                meta: {
                    title: "旋转、缩放、平移几何体",
                    keywords: "three.js,旋转缩放平移几何体",
                    description: "使用three.js旋转、缩放、平移几何体"
                }
            },
            {
                id: "自带几何体顶点",
                name: "自带几何体顶点",
                name_en: "自带几何体顶点",
                author: "jiawanlong",
                codeUrl: HOST + "threeExamples/basic/自带几何体顶点.js",
                image: HOST + "threeExamples/basic/自带几何体顶点.png",
                meta: {
                    title: "自带几何体顶点",
                    keywords: "three.js,自带几何体顶点",
                    description: "使用three.js自带几何体顶点"
                }
            },
            {
                id: "顶点颜色",
                name: "顶点颜色",
                name_en: "顶点颜色",
                author: "jiawanlong",
                codeUrl: HOST + "threeExamples/basic/顶点颜色.js",
                image: HOST + "threeExamples/basic/顶点颜色.jpg",
                meta: {
                    title: "顶点颜色",
                    keywords: "three.js,顶点颜色",
                    description: "使用three.js顶点颜色"
                }
            }
        ]
    },
    {
        pid: 'tools',
        name: '相关工具',
        children: [
            {
                id: 'sketchfab_model',
                name: 'sketchfab免费模型',
                author: 'z2586300277',
                openUrl: 'https://sketchfab.com/',
                image: HOST + 'threeExamples/tools/sketchfab.jpg'
            },
            {
                id: 'shaderToy',
                name: '开源shader社区',
                author: 'z2586300277',
                openUrl: 'https://www.shadertoy.com/',
                image: FILE_HOST + 'images/shaderToy.jpg'
            },
            {
                id: 'skyBox_image',
                name: '免费hdr全景图资源',
                author: 'z2586300277',
                openUrl: 'https://polyhaven.com/hdris/skies',
                image: HOST + 'threeExamples/tools/skyBox_image.jpg'
            },
            {
                id: 'gltf_report',
                name: 'gltf在线draco压缩工具',
                author: 'donmccurdy',
                openUrl: 'https://gltf.report/',
                image: HOST + 'threeExamples/tools/gltf_report.jpg'
            },
            {
                id: 'skyBox_Make',
                name: 'hdr制作天空盒',
                author: 'matheowis',
                openUrl: 'https://matheowis.github.io/HDRI-to-CubeMap/',
                githubUrl: 'https://github.com/matheowis/HDRI-to-CubeMap',
                image: HOST + 'threeExamples/tools/skyBox_Make.jpg'
            },
            {
                id: 'make_json_font',
                name: '字体转Three使用json字体',
                author: 'gero3',
                openUrl: 'https://gero3.github.io/facetype.js/',
                githubUrl: 'https://github.com/gero3/facetype.js',
                image: HOST + 'threeExamples/tools/make_json_font.jpg'
            },
            {
                id: 'shaderWebgl',
                name: 'Webgl直接可用Shader',
                author: 'mrdoob',
                openUrl: 'https://glslsandbox.com/',
                githubUrl: 'https://github.com/mrdoob/glsl-sandbox',
                image: FILE_HOST + 'images/shaderWebgl.jpg'
            },
            {
                id: 'shaderEditor',
                name: 'Shader编辑器',
                author: 'patriciogonzalezvivo',
                openUrl: 'https://editor.thebookofshaders.com/',
                githubUrl: 'https://github.com/patriciogonzalezvivo/glslEditor',
                image: FILE_HOST + 'images/shaderEditor.jpg'
            },
            {
                id: 'geojsonTool',
                name: 'geojson获取工具',
                author: 'z2586300277',
                openUrl: 'https://datav.aliyun.com/portal/school/atlas/area_selector',
                image: HOST + 'threeExamples/tools/geojsonTool.jpg'
            },
            {
                id: 'scene_fase',
                name: '场景快速调试工具',
                author: 'nico',
                openUrl: 'http://nicowebgl.cn/three_tool/',
                image: HOST + 'threeExamples/tools/scene.jpg'

            }
        ]
    },

]