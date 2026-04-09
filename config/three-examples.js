import { HOST, FILE_HOST } from './host.js'

export default [
    {
        pid: 'friendStation',
        name: '首页导航',
        name_en: 'Home Navigation',
        children: [

            // { id: 'test', name: '测试', codeUrl: HOST + 'threeExamples/other/test.js' }, // 本地开发调试模板用例 不更改提交

            {
                id: 'thanksBibi',
                name: '感谢来自BiBi的支持',
                name_en: 'Thanks BiBi',
                tag: TEXTS['感谢BiBi'] + '-#ff69b4',
                author: 'z2586300277',
                githubUrl: 'https://space.bilibili.com/245165721',
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
                id: 'z2586300277_3d_editor',
                tag: TEXTS['编辑器'] + '-#795cddba',
                tip: '使用three.js开发的低代码组态易用的编辑器',
                name: '低代码组态编辑器',
                name_en: 'LowCode Editor',
                author: 'z2586300277',
                openUrl: 'https://z2586300277.github.io/threejs-editor',
                githubUrl: 'https://github.com/z2586300277/threejs-editor',
                image: FILE_HOST + 'images/editor.jpg',
                links: [
                    {
                        name: '🌟' + TEXTS['cores'],
                        url: 'https://github.com/z2586300277/three-editor-cores'
                    },
                    {
                        name: '📖CSDN',
                        url: 'https://blog.csdn.net/guang2586/article/details/142910241'
                    }
                ]
            },

            {
                id: 'officialExamples',
                tag: TEXTS['官方'] + '-rgb(157 46 37)',
                name: '官方示例 - 优化版',
                name_en: 'Official',
                tip: 'Three.js官方案例100%在线最新同步，UI重置，案例分类，可在线调试预览，更加舒适高效的查阅和学习',
                improver: 'z2586300277',
                referUrl: 'https://openthree.github.io/three-offical-run/examples/',
                openUrl: 'https://openthree.github.io/three-official-examples',
                githubUrl: 'https://github.com/OpenThree/three-official-examples',
                image: HOST + 'threeExamples/openSource/official.jpg'
            },

            {
                id: 'threejsHome',
                name: 'ThreeJS官网',
                name_en: 'ThreeJS Home',
                tag: TEXTS['官网'] + '-rgb(0, 153, 255)',
                openUrl: 'https://threejs.org',
                githubUrl: 'https://github.com/mrdoob/three.js',
                image: FILE_HOST + 'images/ThreeJS.png'
            },
            {
                id: 'z2586300277_info',
                name: '优雅永不过时',
                name_en: 'Elegant',
                tag: TEXTS['Contact'] + '-#d96dca',
                author: 'z2586300277',
                openUrl: 'https://z2586300277.github.io',
                githubUrl: 'https://github.com/z2586300277',
                image: FILE_HOST + 'images/yy.jpg'
            }

        ]
    },

    {
        gid: 'effectGroup',
        group: '三维特效',
        group_en: '3D Effects',
        pid: 'shader',
        name: '着色器',
        name_en: 'Shader',
        children: [
            {
                id: 'cityEffect',
                name: '城市光效',
                name_en: 'City Effect',
                tag: TEXTS['smartCity'],
                referUrl: 'https://quyinggang.github.io/three3d',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/shader/cityEffect.js',
                image: HOST + 'threeExamples/shader/cityEffect.jpg',
            },

            {
                id: 'grassShader',
                name: '草地着色器',
                name_en: 'Grass Shader',
                author: 'Siricee',
                improver: 'z2586300277',
                codeUrl: HOST + 'threeExamples/shader/grassShader.js',
                image: HOST + 'threeExamples/shader/grassShader.jpg',
                meta: {
                    title: '草地着色器',
                    keywords: 'three.js,草地着色器',
                    description: '使用three.js草地着色器'
                }
            },
            {
                id: '2025Year',
                name: '2025',
                name_en: '2025 Year',
                author: 'Threejs',
                improver: 'z2586300277',
                referUrl: 'https://codepen.io/prisoner849/pen/gbYgjom',
                codeUrl: HOST + 'threeExamples/application/2025Year.js',
                image: HOST + 'threeExamples/application/2025Year.jpg',
            },
            {
                id: 'audioSolutions',
                tag: TEXTS['音乐'],
                tip: '将音乐可视化为动态效果',
                name: '音乐可视化',
                name_en: 'Audio visual',
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
                id: '700stars',
                name: '1000stars留念',
                name_en: '1000stars',
                tag: TEXTS['共享'] + '-rgb(198,0,0)',
                tip: '一个专注于前端可视化的开源组织，三维可视化开发者抱团取暖，开源分享知识，接活盈利，让自己更有底气，加入请联系',
                author: 'nico',
                improver: 'OpenThree',
                githubUrl: 'https://github.com/OpenThree',
                codeUrl: HOST + 'threeExamples/application/700stars.js',
                image: HOST + 'threeExamples/application/700stars.jpg',
            },
            {
                id: 'cityBlendLight',
                name: '城市混合扫光',
                name_en: 'City Blend',
                tag: TEXTS['扫光'],
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/shader/cityBlendLight.js',
                image: HOST + 'threeExamples/shader/cityBlendLight.jpg',
            },
            {
                id: 'oceanShader',
                name: '海面',
                name_en: 'Ocean Shader',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/shader/oceanShader.js',
                image: HOST + 'threeExamples/shader/oceanShader.jpg',
            },
            {
                id: 'chinaFlag',
                name: '中国旗帜',
                name_en: 'China Flag',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/shader/chinaFlag.js',
                image: HOST + 'threeExamples/shader/chinaFlag.jpg',
            },
            {
                id: 'circleWave',
                name: '圆波扫光',
                name_en: 'Circle Wave',
                author: 'z2586300277',
                referUrl: 'https://shadertoy-playground.netlify.app/entries/#circle-wave',
                codeUrl: HOST + 'threeExamples/shader/circleWave.js',
                image: HOST + 'threeExamples/shader/circleWave.jpg',
            },

            {
                id: 'fenceWall',
                name: '围墙着色器',
                name_en: 'Fence Wall',
                improver: 'yjsdszz',
                codeUrl: HOST + 'threeExamples/shader/fenceWall.js',
                image: HOST + 'threeExamples/shader/fenceWall.jpg',
                meta: {
                    title: '围墙着色器',
                    keywords: 'three.js,围墙着色器',
                    description: '使用three.js围墙着色器'
                }
            },
            {
                id: 'transparentGradient',
                name: '透明渐变',
                name_en: 'Trans Grad',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/shader/transparentGradient.js',
                image: HOST + 'threeExamples/shader/transparentGradient.jpg',
            },
            {
                id: 'fenceShader',
                name: '围栏着色器',
                name_en: 'Fence Shader',
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
                id: 'loveShader',
                name: '爱心',
                name_en: 'Love Shader',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/shader/loveShader.js',
                image: HOST + 'threeExamples/shader/loveShader.jpg',
            },
            {
                id: 'cityMixShader',
                name: '城市混合Shader',
                name_en: 'CityMixShader',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/shader/cityMixShader.js',
                image: HOST + 'threeExamples/shader/cityMixShader.jpg',
            },
            {
                id: 'tachnologyFloor',
                name: '科技风地面',
                name_en: 'TachnologyFloor',
                author: 'flowers-10',
                improver: 'z2586300277',
                tag: TEXTS['tech'],
                referUrl: 'https://three-auto.vercel.app/?tab=floor',
                codeUrl: HOST + 'threeExamples/shader/tachnologyFloor.js',
                image: HOST + 'threeExamples/shader/tachnologyFloor.jpg',
            },
            {
                id: 'threeLogo',
                name: 'three.js Logo',
                name_en: 'Three Logo',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/shader/threeLogo.js',
                image: HOST + 'threeExamples/shader/threeLogo.jpg',
            },
            {
                id: 'raningSea',
                name: '波涛海浪',
                name_en: 'move Sea',
                improver: 'z2586300277',
                referUrl: 'https://codepen.io/aderaaij/pen/XWpMONO',
                codeUrl: HOST + 'threeExamples/shader/raningSea.js',
                image: HOST + 'threeExamples/shader/raningSea.jpg',
            },
            {
                id: "warnInfo",
                name: "警告信息",
                name_en: "Warn Info",
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
                id: 'textStarShader',
                name: '点星感谢',
                name_en: 'Text Star',
                tag: TEXTS['致谢'],
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/shader/textStarShader.js',
                image: HOST + 'threeExamples/shader/textStarShader.jpg',
            },
            {
                id: 'cityMoveLight',
                name: '智慧城市扫光',
                name_en: 'City Move',
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
                name_en: 'City Light',
                author: 'z2586300277',
                referUrl: 'https://github.com/Fate-ui/WebglStudy',
                codeUrl: HOST + 'threeExamples/shader/cityLight.js',
                image: HOST + 'threeExamples/shader/cityLight.jpg',
            },
            {
                id: 'audioDance',
                name: '音乐舞动',
                name_en: 'Audio Dance',
                author: 'wuyifan0203',
                codeUrl: HOST + 'threeExamples/shader/audioDance.js',
                image: HOST + 'threeExamples/shader/audioDance.jpg',
            },
            {
                id: 'shaderSky',
                name: '着色器天空',
                name_en: 'Shader Sky',
                improver: 'z2586300277',
                codeUrl: HOST + 'threeExamples/shader/shaderSky.js',
                image: HOST + 'threeExamples/shader/shaderSky.jpg',
                meta: {
                    title: '着色器天空',
                    keywords: 'three.js,着色器天空',
                    description: '使用three.js着色器天空'
                }
            },
            {
                id: 'modelBlendShader',
                name: '模型混合着色器',
                name_en: 'Model Blend',
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
                id: 'planeScan',
                name: '平面扫描',
                name_en: 'Plane Scan',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/shader/planeScan.js',
                image: HOST + 'threeExamples/shader/planeScan.jpg',
            },
            {
                id: 'cityLine',
                name: '城市线条',
                name_en: 'City Line',
                author: 'superzay',
                improver: 'z2586300277',
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
                name_en: 'Wall Shader',
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
                name_en: 'Radar Shader',
                author: 'stonerao',
                improver: 'z2586300277',
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
                name_en: 'Candle Shader',
                improver: 'z2586300277',
                codeUrl: HOST + 'threeExamples/shader/candleShader.js',
                image: HOST + 'threeExamples/shader/candleShader.jpg',
                referUrl: 'https://codepen.io/prisoner849/pen/XPVGLp'
            },
            {
                id: 'ringShader',
                name: '环形着色器',
                name_en: 'Ring Shader',
                author: 'stonerao',
                improver: 'z2586300277',
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
                name_en: 'Smoke Circle',
                improver: 'z2586300277',
                referUrl: 'https://codepen.io/vcomics/pen/KBMyjE',
                codeUrl: HOST + 'threeExamples/shader/smokeCircle.js',
                image: HOST + 'threeExamples/shader/smokeCircle.jpg',
            },
            {
                id: 'radarScan',
                name: '雷达扫描',
                name_en: 'Radar Scan',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/shader/radarScan.js',
                image: HOST + 'threeExamples/shader/radarScan.jpg',
            },
            {
                id: 'imageParticle',
                name: '颗粒图像',
                name_en: 'Image Part',
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
                name_en: 'Gaussian Blur',
                author: 'hafly',
                improver: 'z2586300277',
                codeUrl: HOST + 'threeExamples/shader/gaussianBlur.js',
                image: HOST + 'threeExamples/shader/gaussianBlur.jpg',
                meta: {
                    title: '高斯模糊',
                    keywords: 'three.js,高斯模糊',
                    description: '使用three.js高斯模糊'
                }
            },
            {
                id: 'gridShader',
                name: '网格着色器',
                name_en: 'Grid Shader',
                author: 'z2586300277',
                referUrl: 'https://shad3rs.vercel.app/shaders/grid',
                codeUrl: HOST + 'threeExamples/shader/gridShader.js',
                image: HOST + 'threeExamples/shader/gridShader.jpg'
            },
            {
                id: 'compassShader',
                name: '罗盘',
                name_en: 'Compass Shader',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/shader/compassShader.js',
                image: HOST + 'threeExamples/shader/compassShader.jpg',
            },
            {
                id: 'halfCircle',
                name: '半圆',
                name_en: 'Half Circle',
                author: 'yiiiiiiqianyao',
                improver: 'z2586300277',
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
                name_en: 'Vortex Shader',
                author: 'hafly',
                improver: 'z2586300277',
                codeUrl: HOST + 'threeExamples/shader/vortexShader.js',
                image: HOST + 'threeExamples/shader/vortexShader.jpg'
            },
            {
                id: 'ringsShader',
                name: '环彩虹着色器',
                name_en: 'Rings Shader',
                author: 'stonerao',
                improver: 'z2586300277',
                codeUrl: HOST + 'threeExamples/shader/ringsShader.js',
                image: HOST + 'threeExamples/shader/ringsShader.jpg',
            },
            {
                id: 'videoShader',
                name: '视频着色器',
                name_en: 'Video Shader',
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
                name_en: 'Steam Sun',
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
                name_en: 'Groundglass',
                author: 'z2586300277',
                referUrl: 'https://github.com/hafly',
                codeUrl: HOST + 'threeExamples/shader/groundglass.js',
                image: HOST + 'threeExamples/shader/groundglass.jpg',
            },
            {
                id: 'infiniteGrid',
                name: '无限网格',
                name_en: 'Infinite Grid',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/shader/infiniteGrid.js',
                image: HOST + 'threeExamples/shader/infiniteGrid.jpg',
                referUrl: 'https://github.com/Fyrestar/THREE.InfiniteGridHelper'
            },
            {
                id: 'cobwebBox',
                name: '蛛网箱子',
                name_en: 'Cobweb Box',
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
                id: 'jumpHeart',
                name: '跳动的心',
                name_en: 'Jump Heart',
                author: 'stonerao',
                improver: 'z2586300277',
                codeUrl: HOST + 'threeExamples/shader/jumpHeart.js',
                image: HOST + 'threeExamples/shader/jumpHeart.jpg',
            },
            {
                id: 'rasterGrid',
                name: '栅格网格',
                name_en: 'Raster Grid',
                author: 'yjsdszz',
                improver: 'z2586300277',
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
                name_en: 'Flow Light',
                author: 'Fate-ui',
                improver: 'z2586300277',
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
                name_en: 'Gray Shader',
                author: 'z2586300277',
                referUrl: 'https://github.com/hafly',
                codeUrl: HOST + 'threeExamples/shader/grayShader.js',
                image: HOST + 'threeExamples/shader/grayShader.jpg',
            },
            {
                id: 'waveShader',
                name: '图像波动',
                name_en: 'Wave Shader',
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
                name_en: 'Dissolve',
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
                name_en: 'shaderToy',
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
                name_en: "Water Effect",
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
                name_en: 'Relief Image',
                author: 'hafly',
                codeUrl: HOST + 'threeExamples/shader/reliefImage.js',
                image: HOST + 'threeExamples/shader/reliefImage.jpg',
            },
            {
                id: 'flowerShader',
                name: '花',
                name_en: 'Flower Shader',
                referUrl: 'https://codepen.io/vcomics/pen/jeWpgX',
                improver: 'z2586300277',
                codeUrl: HOST + 'threeExamples/shader/flowerShader.js',
                image: HOST + 'threeExamples/shader/flowerShader.jpg',
            },
            {
                id: 'dissolveAnimate',
                name: '溶解动画',
                name_en: 'Dissolve',
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
                name_en: "Image Shake",
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
                name_en: 'Heart Shader',
                author: 'z2586300277',
                referUrl: 'https://github.com/xiaolidan00/my-earth?tab=readme-ov-file',
                codeUrl: HOST + 'threeExamples/shader/heartShader.js',
                image: HOST + 'threeExamples/shader/heartShader.jpg',
            },
            {
                id: "shaderBlock",
                name: "方块着色器",
                name_en: "Shader Block",
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
                name_en: "Fireball",
                improver: "giser2017",
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
                name_en: 'Blob Shader',
                referUrl: 'https://codepen.io/vcomics/pen/ZwNgvX',
                improver: 'z2586300277',
                codeUrl: HOST + "threeExamples/shader/blobShader.js",
                image: HOST + "threeExamples/shader/blobShader.jpg",
            },

            {
                id: 'circleRotate',
                name: '旋转的圆',
                name_en: 'Circle Rotate',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/shader/circleRotate.js',
                image: HOST + 'threeExamples/shader/circleRotate.jpg',
            },
            {
                id: 'whiteCloud',
                name: '白云',
                name_en: 'White Cloud',
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
                name_en: 'Water Sky',
                improver: 'z2586300277',
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
                name_en: 'Cloud Shader',
                author: 'wuyifan0203',
                codeUrl: HOST + 'threeExamples/shader/cloudShader.js',
                image: HOST + 'threeExamples/shader/cloudShader.jpg',
            },
            {
                id: 'darkClouds',
                name: '乌云',
                name_en: 'Dark Clouds',
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
                name_en: 'Cell Shader',
                author: 'stonerao',
                codeUrl: HOST + 'threeExamples/shader/cellShader.js',
                image: HOST + 'threeExamples/shader/cellShader.jpg',
            },
            {
                id: 'mushroom',
                name: '蘑菇',
                name_en: 'Mushroom',
                author: 'bubinyang',
                codeUrl: HOST + 'threeExamples/shader/mushroom.js',
                image: HOST + 'threeExamples/shader/mushroom.jpg',
            },
            {
                id: 'mosaicShader',
                name: '马赛克',
                name_en: 'Mosaic Shader',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/shader/mosaicShader.js',
                image: HOST + 'threeExamples/shader/mosaicShader.jpg',
            },
            {
                id: 'shader_planet',
                name: '着色器行星',
                name_en: 'Shader Planet',
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
                name_en: 'Contour',
                improver: 'nico',
                codeUrl: HOST + 'threeExamples/shader/contour.js',
                image: HOST + 'threeExamples/shader/contour.jpg',
            },
            {
                id: 'softLight',
                name: '柔光',
                name_en: 'Soft Light',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/shader/softLight.js',
                image: HOST + 'threeExamples/shader/softLight.jpg',
            },
            {
                id: 'earthScan',
                name: '地球扫描',
                name_en: 'Earth Scan',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/shader/earthScan.js',
                image: HOST + 'threeExamples/shader/earthScan.jpg',
                referUrl: 'https://juejin.cn/post/7378535517950525466'
            },
            {
                id: 'waveScan',
                name: '波扫描',
                name_en: 'Wave Scan',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/shader/waveScan.js',
                image: HOST + 'threeExamples/shader/waveScan.jpg',
            },
            {
                id: 'innerGlow',
                name: '内发光',
                name_en: 'Inner Glow',
                author: 'quyinggang',
                improver: 'z2586300277',
                codeUrl: HOST + 'threeExamples/shader/innerGlow.js',
                image: HOST + 'threeExamples/shader/innerGlow.jpg',
            },
            {
                id: 'fireShader',
                name: '火焰',
                name_en: 'Fire Shader',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/shader/fireShader.js',
                image: HOST + 'threeExamples/shader/fireShader.jpg',
            },

            {
                id: 'emitShader',
                name: '发散着色器',
                name_en: 'Emit Shader',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/shader/emitShader.js',
                image: HOST + 'threeExamples/shader/emitShader.jpg',
            },
            {
                id: 'ephemeralFlower',
                name: '幻影花烟',
                name_en: 'Flower Smoke',
                improver: 'z2586300277',
                referUrl: 'https://codepen.io/prisoner849/pen/LYmXKrr',
                codeUrl: HOST + 'threeExamples/shader/ephemeralFlower.js',
                image: HOST + 'threeExamples/shader/ephemeralFlower.jpg',
            },
            {
                id: 'fishShader',
                name: '鱼',
                name_en: 'Fish',
                author: 'Threejs',
                improver: 'z2586300277',
                referUrl: 'https://codepen.io/prisoner849/pen/bGgQmrX',
                codeUrl: HOST + 'threeExamples/shader/fishShader.js',
                image: HOST + 'threeExamples/shader/fishShader.jpg',
            },
            {
                id: 'energyBallShader',
                name: '能量球',
                name_en: 'Energy Ball',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/shader/energyBallShader.js',
                image: HOST + 'threeExamples/shader/energyBallShader.jpg',
            },
            {
                id: 'girdFloor',
                name: '网格地板',
                name_en: 'Gird Floor',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/shader/girdFloor.js',
                image: HOST + 'threeExamples/shader/girdFloor.jpg',
                referUrl: 'https://github.com/amiradeu/shaders-jikken'
            },
            {
                id: 'hologram',
                name: '全息投影',
                name_en: 'Hologram',
                author: 'FFMMCC',
                codeUrl: HOST + 'threeExamples/shader/hologram.js',
                image: 'https://coderfmc.github.io/three.js-demo/全息投影.png',
                improver: 'FFMMCC',
                referUrl: 'https://gitee.com/fu-meichuan/three.js-journey/tree/master/30Hologram'
            },
            {
                id: 'smoke',
                name: '燃烧烟雾',
                name_en: 'Smoke',
                author: 'z2586300277',
                improver: 'z2586300277',
                codeUrl: HOST + 'threeExamples/shader/smoke.js',
                image: HOST + 'threeExamples/shader/smoke.jpg',
            },
            {
                id: 'fireMaterial',
                name: '火焰材质',
                name_en: 'Fire Material',
                improver: 'z2586300277',
                referUrl: 'https://codesandbox.io/p/sandbox/3878x',
                codeUrl: HOST + 'threeExamples/shader/fireMaterial.js',
                image: HOST + 'threeExamples/shader/fireMaterial.jpg',
            },
            {
                id: 'wifiShader',
                name: 'WiFi',
                name_en: 'WiFi Shader',
                improver: 'z2586300277',
                codeUrl: HOST + 'threeExamples/shader/wifiShader.js',
                image: HOST + 'threeExamples/shader/wifiShader.jpg',
            },
            {
                id: 'buildGradient',
                name: '建筑渐变',
                name_en: 'Building Gradient',
                tag: TEXTS['smartCity'],
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/shader/buildGradient.js',
                image: HOST + 'threeExamples/shader/buildGradient.jpg',
            },
            {
                id: 'iceFloor',
                name: '冰面',
                name_en: 'Ice Floor',
                author: 'z2586300277',
                referUrl: 'https://github.com/rock-biter/ice-trails',
                codeUrl: HOST + 'threeExamples/shader/iceFloor.js',
                image: HOST + 'threeExamples/shader/iceFloor.jpg',
            },
            {
                id: 'blackhole',
                name: '黑洞',
                name_en: 'Black Hole',
                author: 'ylfq',
                codeUrl: HOST + 'threeExamples/shader/blackhole.js',
                image: HOST + 'threeExamples/shader/blackhole.jpg',
            }
        ]
    },
    {
        gid: 'effectGroup',
        pid: 'particle',
        name: '粒子',
        name_en: 'Particle',
        children: [
            {
                id: 'z2586300277',
                name: '优雅永不过时',
                name_en: 'Elegant Always',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/particle/z2586300277.js',
                image: HOST + 'threeExamples/particle/z2586300277.jpg',
            },
            {
                id: "RandomParticle",
                name: "随机粒子效果",
                tag: 'HTML',
                name_en: "Random",
                author: "Threejs",
                referUrl: 'https://codepen.io/prisoner849/pen/ExpLBEO',
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
                tag: 'HTML',
                name_en: "Planet",
                author: "Threejs",
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
                name_en: "Bubble",
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
                name_en: 'BlendShader',
                tag: TEXTS['混合着色'],
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/particle/particleBlendShader.js',
                image: HOST + 'threeExamples/particle/particleBlendShader.jpg',
            },

            {
                id: 'particleScattered',
                name: '粒子聚散',
                name_en: 'Scattered',
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
                name_en: "Snow",
                improver: "yjsdszz",
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
                name_en: 'Galaxy Star',
                author: 'brunosimon',
                improver: 'kavalcio',
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
                name_en: 'Points Earth',
                improver: 'giser2017',
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
                name_en: 'Wave',
                improver: 'z2586300277',
                codeUrl: HOST + 'threeExamples/particle/waveParticleShader.js',
                image: HOST + 'threeExamples/particle/waveParticleShader.jpg',
            },
            {
                id: 'particleLine',
                name: '粒子线条',
                name_en: 'Line',
                improver: 'z2586300277',
                codeUrl: HOST + 'threeExamples/particle/particleLine.js',
                image: HOST + 'threeExamples/particle/particleLine.jpg',
            },
            {
                id: 'sphereLine',
                name: '球体线条',
                name_en: 'Sphere Line',
                improver: 'z2586300277',
                codeUrl: HOST + 'threeExamples/particle/sphereLine.js',
                image: HOST + 'threeExamples/particle/sphereLine.jpg',
            },
            {
                id: 'particleWire',
                referUrl: 'https://mp.weixin.qq.com/s/R-WEoTG30DlqXvFfDgXQdg',
                name: '粒子线',
                name_en: 'Wire',
                improver: 'z2586300277',
                codeUrl: HOST + 'threeExamples/particle/particleWire.js',
                image: HOST + 'threeExamples/particle/particleWire.jpg',
            },
            {
                id: 'particleFire',
                name: '粒子烟花',
                name_en: 'Fire',
                author: 'FFMMCC',
                codeUrl: HOST + 'threeExamples/particle/particleFire.js',
                image: HOST + 'threeExamples/particle/particleFire.jpg',
            },
            {
                id: 'starrySky',
                name: '粒子星空',
                name_en: 'Starry Sky',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/particle/starrySky.js',
                image: HOST + 'threeExamples/particle/starrySky.jpg',
            },
            {
                id: 'technologyParticle',
                name: '科技粒子',
                name_en: 'Technology',
                tag: TEXTS['tech'],
                author: 'FFMMCC',
                codeUrl: HOST + 'threeExamples/particle/technologyParticle.js',
                image: HOST + 'threeExamples/particle/technologyParticle.jpg',
                improver: 'z2586300277',
            },
            {
                id: 'particlesCursorAnimation',
                name: '鼠标轨迹粒子',
                name_en: 'ParticlesCursorAnimation',
                author: 'FFMMCC',
                codeUrl: HOST + 'threeExamples/particle/particlesCursorAnimation.js',
                image: HOST + 'threeExamples/particle/particlesCursorAnimation.jpg',
                improver: 'FFMMCC',
            },
            {
                id: 'textParticle',
                name: '文字采集成粒子',
                name_en: 'Text Particle',
                tag: TEXTS['文字粒子'],
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/particle/textParticle.js',
                image: HOST + 'threeExamples/particle/textParticle.jpg',
            },
            {
                id: 'snowParticle',
                name: '雪花',
                name_en: 'Snow',
                author: 'Threejs',
                referUrl: 'https://codepen.io/prisoner849/pen/JjvQOXx',
                codeUrl: HOST + 'threeExamples/particle/snowParticle.js',
                image: HOST + 'threeExamples/particle/snowParticle.jpg',
            },
            {
                id: 'imgParticle',
                name: '图片粒子',
                name_en: 'Image Particle',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/particle/imgParticle.js',
                image: HOST + 'threeExamples/particle/imgParticle.jpg',
            },
            {
                id: 'fireParticles',
                name: '粒子火焰',
                name_en: 'Fire Particles',
                improver: 'z2586300277',
                referUrl: 'https://codepen.io/dlch/pen/eWXgyo',
                codeUrl: HOST + 'threeExamples/particle/fireParticles.js',
                image: HOST + 'threeExamples/particle/fireParticles.jpg',
            },
            {
                id: 'realFire',
                name: '真实火焰',
                name_en: 'Real Fire',
                tip: '使用claude 3.7 sonnect 帮助实现',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/particle/realFire.js',
                image: HOST + 'threeExamples/particle/realFire.jpg'
            },
            {
                id: 'globeParticle',
                name: '地球粒子',
                name_en: 'Globe Particle',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/particle/globeParticle.js',
                image: HOST + 'threeExamples/particle/globeParticle.jpg',
            },
            {
                id: 'spreadPartile',
                name: '发散粒子',
                name_en: 'Spread Partile',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/particle/spreadPartile.js',
                image: HOST + 'threeExamples/particle/spreadPartile.jpg',
            },
            {
                id: 'waterLeakage',
                name: '水流粒子',
                name_en: 'Water Leakage',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/particle/waterLeakage.js',
                image: HOST + 'threeExamples/particle/waterLeakage.jpg',
            },
            {
                id: 'waterFlowParticle',
                name: '喷泉水流',
                name_en: 'Water Flow',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/particle/waterFlowParticle.js',
                image: HOST + 'threeExamples/particle/waterFlowParticle.jpg',
            },
            {
                id: 'steamParticle',
                name: '蒸汽粒子',
                name_en: 'Steam Particle',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/particle/steamParticle.js',
                image: HOST + 'threeExamples/particle/steamParticle.jpg',
            }
        ]
    },
    {
        pid: 'application',
        name: '应用场景',
        name_en: 'Application',
        children: [
            {
                id: 'z2586300277',
                name: '优雅永不过时',
                name_en: 'Elegant Always',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/application/z2586300277.js',
                image: HOST + 'threeExamples/application/z2586300277.jpg',
            },

            {
                id: 'magicCircle',
                name: '魔法阵',
                name_en: 'Magic Circle',
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
                name_en: 'Code Cloud',
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
                name_en: 'Ghost House',
                improver: 'FFMMCC',
                author: 'brunosimon',
                codeUrl: HOST + 'threeExamples/application/ghostHouse.js',
                image: HOST + 'threeExamples/application/ghostHouse.jpg',
            },
            {
                id: 'canvasTexture',
                name: 'Canvas贴图',
                name_en: 'Canvas Texture',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/application/canvasTexture.js',
                image: HOST + 'threeExamples/application/canvasTexture.jpg',
            },
            {
                id: 'flowLine',
                name: '贴图飞线',
                name_en: 'Flow Line',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/application/flowLine.js',
                image: HOST + 'threeExamples/application/flowLine.jpg',
            },
            {
                id: 'flyLine',
                name: '飞线效果',
                name_en: 'Fly Line',
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
                name_en: 'Pipe Flow',
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
                id: 'buildingLine',
                name: '建筑线条',
                name_en: 'Building Line',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/application/buildingLine.js',
                image: HOST + 'threeExamples/application/buildingLine.jpg',
            },
            {
                id: 'videoModel',
                name: '模型视频材质',
                name_en: 'Video Model',
                author: 'z2586300277',
                referUrl: 'https://github.com/YCYTeam/YCY-TrainingCamp-S2/blob/main/src/day02_%E7%9B%B4%E6%92%AD%E4%BB%A3%E7%A0%81.js',
                codeUrl: HOST + 'threeExamples/application/videoModel.js',
                image: HOST + 'threeExamples/application/videoModel.jpg',
            },
            {
                id: 'spriteText',
                name: '精灵文字',
                name_en: 'Sprite Text',
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
                name_en: 'Simple Coll',
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
                name_en: 'Diffuse Line',
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
                name_en: 'Lampshade',
                author: 'Fate-ui',
                codeUrl: HOST + 'threeExamples/application/lampshade.js',
                image: HOST + 'threeExamples/application/lampshade.jpg',
            },
            {
                id: 'smokeAir',
                name: '烟雾效果',
                name_en: 'Smoke Air',
                improver: 'yjsdszz',
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
                name_en: 'Light Icon',
                author: 'Fate-ui',
                codeUrl: HOST + 'threeExamples/application/lightIcon.js',
                image: HOST + 'threeExamples/application/lightIcon.jpg',
            },
            {
                id: 'topology',
                name: '简单3d拓扑图',
                name_en: '3D Topology',
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
                name_en: '3D Pie',
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
                name_en: 'Draw Face',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/application/drawFace.js',
                image: HOST + 'threeExamples/application/drawFace.jpg',
            },
            {
                id: 'drawFace_improve',
                name: '绘制面_内置点',
                name_en: 'Draw Face',
                author: 'nico',
                codeUrl: HOST + 'threeExamples/application/draw_face_improve.js',
                image: HOST + 'threeExamples/application/draw_face_improve.jpg',
            },
            {
                id: 'roadShader',
                name: '道路流光',
                name_en: 'Road Shader',
                improver: 'z2586300277',
                codeUrl: HOST + 'threeExamples/application/roadShader.js',
                image: HOST + 'threeExamples/application/roadShader.jpg',
                referUrl: 'https://juejin.cn/post/7386485874300223514'
            },
            {
                id: 'model_navigation',
                name: '模型导航',
                name_en: 'Model Nav',
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
                name_en: 'Terrain',
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
                name_en: 'Line Measure',
                author: 'yjsdszz',
                codeUrl: HOST + 'threeExamples/application/lineMeasure.js',
                image: HOST + 'threeExamples/application/lineMeasure.jpg',
            },
            {
                id: 'textSphere',
                name: '球体文字',
                name_en: 'Text Sphere',
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
                name_en: 'Matrix Oper',
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
                name_en: 'Coffee Mug',
                improver: 'kavalcio',
                author: 'brunosimon',
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
                name_en: 'Light Bar',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/application/lightBar.js',
                image: HOST + 'threeExamples/application/lightBar.jpg',
            },
            {
                id: 'gridFloor',
                name: '贴图网格地面',
                name_en: 'Grid Floor',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/application/gridFloor.js',
                image: HOST + 'threeExamples/application/gridFloor.jpg',
            },
            {
                id: 'flowerRain',
                name: '花瓣雨',
                name_en: 'Flower Rain',
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
                name_en: 'House Scene',
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
                name_en: "3D Circle",
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
                name_en: 'Happy Year',
                improver: 'yjsdszz',
                referUrl: 'https://codepen.io/prisoner849/pen/OJqLMKN',
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
                name_en: 'Wind Move',
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
                id: 'imageMove',
                name: '图片移动',
                name_en: 'Image Move',
                referUrl: 'https://codepen.io/smcnally000/pen/eYqXWyJ',
                improver: 'z2586300277',
                codeUrl: HOST + 'threeExamples/application/imageMove.js',
                image: HOST + 'threeExamples/application/imageMove.jpg',
            },
            {
                id: 'vrVideo',
                name: 'VR 全景视频',
                name_en: 'VR Video',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/application/vrVideo.js',
                image: HOST + 'threeExamples/application/vrVideo.jpg',
            },
            {
                id: 'customGrid',
                name: '自定义网格',
                name_en: 'Custom Grid',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/application/customGrid.js',
                image: HOST + 'threeExamples/application/customGrid.jpg',
            },
            {
                id: 'faceMesh',
                name: '表情',
                name_en: 'Face Mesh',
                improver: 'z2586300277',
                codeUrl: HOST + 'threeExamples/application/faceMesh.js',
                image: HOST + 'threeExamples/application/faceMesh.jpg',
            },
            {
                id: 'sportFence',
                name: '流动围栏',
                name_en: 'Sport Fence',
                author: 'z2586300277',
                referUrl: 'https://blog.csdn.net/yunbabac/article/details/135481603',
                codeUrl: HOST + 'threeExamples/application/sportFence.js',
                image: HOST + 'threeExamples/application/sportFence.jpg',
            },
            {
                id: 'isoline',
                name: '等值线',
                name_en: 'Isoline',
                improver: 'nico',
                codeUrl: HOST + 'threeExamples/application/isoline.js',
                image: HOST + 'threeExamples/application/isoline.jpg',
                referUrl: 'https://codepen.io/boytchev/full/gOQQRLd'
            },

            {
                id: 'flowTube',
                name: '管道表面运动',
                name_en: 'Flow Tube',
                author: 'nico',
                codeUrl: HOST + 'threeExamples/application/flowTube.js',
                image: HOST + 'threeExamples/application/flowTube.png',
            },
            {
                id: 'videoEffect',
                name: '视频碎片',
                name_en: 'Video Effect',
                author: 'quyinggang',
                codeUrl: HOST + 'threeExamples/application/videoEffect.js',
                image: HOST + 'threeExamples/application/videoEffect.jpg',
            },
            {
                id: 'drawFence',
                name: '绘制围栏',
                name_en: 'Draw Fence',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/application/drawFence.js',
                image: HOST + 'threeExamples/application/drawFence.jpg',
            },
            {
                id: 'punk',
                name: '朋克风',
                name_en: 'Style Punk',
                author: 'nico',
                codeUrl: HOST + 'threeExamples/application/punk.js',
                image: HOST + 'threeExamples/application/punk.jpg',
            },
            {
                id: 'radarScan',
                name: '雷达扫描',
                name_en: 'Radar Scan',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/application/radarScan.js',
                image: HOST + 'threeExamples/application/radarScan.jpg',
            },
            {
                id: 'white model',
                name: '随机城市白膜',
                name_en: 'White Model',
                author: 'nico',
                codeUrl: HOST + 'threeExamples/application/white_model.js',
                image: HOST + 'threeExamples/application/white_model.jpg',
            },
            {
                id: 'model_base',
                name: '生成模型底座',
                name_en: 'Model Base',
                author: 'nico',
                codeUrl: HOST + 'threeExamples/application/model_base.js',
                image: HOST + 'threeExamples/application/model_base.jpg',
            },
            {
                id: 'coneMesh',
                name: '圆锥网格',
                name_en: 'Cone Mesh',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/application/coneMesh.js',
                image: HOST + 'threeExamples/application/coneMesh.jpg',
            },
            {
                id: 'videoFloor',
                name: '视频地板',
                name_en: 'Video Floor',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/application/videoFloor.js',
                image: HOST + 'threeExamples/application/videoFloor.jpg',
            },
            {
                id: 'rainRoof',
                name: '下雨效果',
                name_en: 'Rain Roof',
                author: 'Threejs',
                improver: 'z2586300277',
                referUrl: 'https://codepen.io/prisoner849/pen/yLWMLjK',
                codeUrl: HOST + 'threeExamples/application/rainRoof.js',
                image: HOST + 'threeExamples/application/rainRoof.jpg',
            },
            {
                id: 'phy,ocean',
                name: '具有物理效果的卡通海面',
                name_en: 'Cartoon Ocean',
                author: 'nico',
                codeUrl: HOST + 'threeExamples/application/cartoon_ocean.js',
                image: HOST + 'threeExamples/application/cartoon_ocean.jpg',
            },
            {
                id: 'redRose',
                name: '红玫瑰',
                name_en: 'Red Rose',
                author: 'FFMMCC',
                codeUrl: HOST + 'threeExamples/shader/redRose.js',
                image: 'https://coderfmc.github.io/three.js-demo/redRouse.gif',
                improver: 'FFMMCC',
                referUrl: 'https://gitee.com/fu-meichuan/three.js-journey/tree/master/47.redRose'
            },

            {
                id: 'samplexWave',
                name: '采样波',
                tip: 'use Claude 3.7 sonnect Thinking Preivew in vscode github copilot generate all code',
                name_en: 'Samplex Wave',
                author: 'z2586300277',
                improver: 'z2586300277',
                referUrl: 'https://codepen.io/calmound/pen/gbOPXER',
                codeUrl: HOST + 'threeExamples/application/samplexWave.js',
                image: HOST + 'threeExamples/application/samplexWave.jpg',
            },

            {
                id: 'tweenFire',
                name: '精灵火花',
                name_en: 'Tween Fire',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/application/tweenFire.js',
                image: HOST + 'threeExamples/application/tweenFire.jpg',
            },
            {
                id: 'driving',
                name: '无限行驶',
                name_en: 'Driving',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/application/drivingCar.js',
                image: HOST + 'threeExamples/application/drivingCar.jpg'
            },
            {
                id: 'modelHeatmap',
                name: '模型热力图',
                name_en: 'Model Heatmap',
                author: 'z2586300277',
                referUrl: 'https://z2586300277.github.io/three-cesium-examples/#/codeMirror?navigation=ThreeJS&classify=shader&id=heatmapShader',
                codeUrl: HOST + 'threeExamples/application/modelHeatmap.js',
                image: HOST + 'threeExamples/application/modelHeatmap.jpg',
            },
            {
                id: 'geometryMerge',
                name: '几何合并',
                name_en: 'Geometry Merge',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/application/geometryMerge.js',
                image: HOST + 'threeExamples/application/geometryMerge.jpg',
            },
            {
                id: 'measurement',
                name: '测量',
                name_en: 'Measurement',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/application/measurement.js',
                image: HOST + 'threeExamples/application/measurement.jpg',
            },
            {
                id: 'gsapTimeLine',
                name: '时间轴动画',
                name_en: 'Gsap TimeLine',
                tag: 'GSAP',
                improver: 'z2586300277',
                codeUrl: HOST + 'threeExamples/application/gsapTimeLine.js',
                image: HOST + 'threeExamples/application/gsapTimeLine.jpg'
            },
            {
                id: 'snake3D',
                name: '3D贪吃蛇',
                name_en: 'Snake 3D',
                author: 'TomCrum-wdm',
                htmlUrl: HOST + 'threeExamples/application/snake3D.html',
                image: HOST + 'threeExamples/application/snake3D.jpg',
            },
            {
                id: 'modelBorder',
                name: '模型边框',
                name_en: 'Model Border',
                author: 'z2586300277',
                referUrl: 'https://codepen.io/boytchev/pen/YPXJgLd',
                codeUrl: HOST + 'threeExamples/application/modelBorder.js',
                image: HOST + 'threeExamples/application/modelBorder.jpg'
            },
            {
                id: 'modelParticle',
                name: '模型粒子化',
                name_en: 'Model Particle',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/application/modelParticle.js',
                image: HOST + 'threeExamples/application/modelParticle.jpg'
            },
            {
                id: 'dynamicTube',
                name: '动态管道',
                name_en: 'Dynamic Tube',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/application/dynamicTube.js',
                image: HOST + 'threeExamples/application/dynamicTube.jpg'
            },
            {
                id: 'girdMaterial',
                name: '网格材质',
                name_en: 'Gird Material',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/application/girdMaterial.js',
                image: HOST + 'threeExamples/application/girdMaterial.jpg'
            },
            {
                id: 'jumpAnimate',
                name: '跳跃动画',
                name_en: 'Jump Animate',
                author: 'huan_meng_hai_yan',
                codeUrl: HOST + 'threeExamples/application/jumpAnimate.js',
                image: HOST + 'threeExamples/application/jumpAnimate.jpg'
            },
            {
                id: 'pointCloudFpsOctree',
                name: '点云第一人称漫游,碰撞检测',
                name_en: 'Point Cloud FPS Octree',
                author: 'pointCloudFpsOctree',
                codeUrl: HOST + 'threeExamples/application/pointCloudFpsOctree.js',
                image: HOST + 'threeExamples/application/pointCloudFpsOctree.png'
            },
            {
                id: 'windTurbineWake',
                name: '风力涡轮机尾迹',
                name_en: 'Wind Turbine Wake',
                author: 'pointCloudFpsOctree',
                codeUrl: HOST + 'threeExamples/application/windTurbineWake.js',
                image: HOST + 'threeExamples/application/windTurbineWake.png'
            }
        ]
    },
    {
        pid: 'animation',
        name: '动画效果',
        name_en: 'Animation',
        children: [
            {
                id: 'animejsBasic',
                name: 'animejs使用',
                name_en: 'Animejs Basic',
                author: 'z2586300277',
                referUrl: 'https://www.npmjs.com/package/animejs',
                codeUrl: HOST + 'threeExamples/animation/animejsBasic.js',
                image: HOST + 'threeExamples/animation/animejsBasic.jpg',
            },
            {
                id: 'gsapBasic',
                name: 'gsap使用',
                name_en: 'GSAP Basic',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/animation/gsapBasic.js',
                image: HOST + 'threeExamples/animation/animejsBasic.jpg',
            },
            {
                id: 'Theatrejs',
                name: 'Theatrejs',
                name_en: 'Theatre.js',
                author: 'z2586300277',
                referUrl: 'https://www.theatrejs.com/',
                githubUrl: 'https://github.com/theatre-js/theatre',
                codeUrl: HOST + 'threeExamples/animation/theatrejs.js',
                image: HOST + 'threeExamples/animation/theatrejs.jpg',
                inject: {
                    importmap: {
                        "@theatre/core": 'https://cdn.jsdelivr.net/npm/@theatre/core/+esm',
                        "@theatre/studio": 'https://cdn.jsdelivr.net/npm/@theatre/studio/+esm'
                    }
                }
            },
            {
                id: 'gsapCollection',
                name: '动画合集',
                name_en: 'GSAP',
                tag: 'GSAP',
                improver: 'z2586300277',
                codeUrl: HOST + 'threeExamples/application/gsapCollection.js',
                image: HOST + 'threeExamples/application/gsapCollection.jpg'
            },
            {
                id: 'clipAnimation',
                name: '裁剪动画',
                name_en: 'Clip Animation',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/animation/clipAnimation.js',
                image: HOST + 'threeExamples/animation/clipAnimation.jpg',
            },
            {
                id: 'pointLockControls',
                tag: TEXTS['漫游'],
                name: '第一人称漫游控制',
                name_en: 'Person Move',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/application/pointLockControls.js',
                image: HOST + 'threeExamples/application/pointLockControls.jpg',
            },
            {
                id: 'personAnimation',
                name: '点击第三人称移动',
                name_en: 'Person Move',
                tag: TEXTS['walk'],
                tip: '点击地面，人物会自动走到目标位置',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/animation/personAnimation.js',
                image: HOST + 'threeExamples/animation/personAnimation.jpg',
            },
            {
                id: 'personThirdMove',
                name: '第三人称移动',
                name_en: 'Third Move',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/animation/personThirdMove.js',
                image: HOST + 'threeExamples/animation/personThirdMove.jpg'
            },
            {
                id: 'modelUnpack',
                name: '模型拆解动画',
                name_en: 'Model Unpack',
                tag: TEXTS['拆解'],
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/basic/modelUnpack.js',
                image: HOST + 'threeExamples/basic/modelUnpack.jpg',
            },
            {
                id: 'personFirstMove',
                name: '第一人称移动',
                name_en: 'First Move',
                author: 'TomCrum-wdm',
                codeUrl: HOST + 'threeExamples/animation/personFirstMove.js',
                image: HOST + 'threeExamples/animation/personFirstMove.jpg',
                inject: {
                    importmap: {
                        "three-mesh-bvh": FILE_HOST + "js/bvh.module.js"
                    }
                }
            },
            {
                id: 'transformAnimate',
                name: 'Mesh变换动画',
                name_en: 'Transform Gsap',
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
                id: 'curveAnimate',
                name: '曲线动画',
                name_en: 'Curve Animate',
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
                id: 'downRotate',
                name: '下钻动画',
                name_en: 'Down Rotate',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/animation/downRotate.js',
                image: HOST + 'threeExamples/animation/downRotate.jpg',
            },
            {
                id: 'curlAnimate',
                name: '卷曲动画',
                name_en: 'Curl Animate',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/animation/curlAnimate.js',
                image: HOST + 'threeExamples/animation/curlAnimate.jpg',
            },
            {
                id: 'inspectionView',
                name: '巡检',
                name_en: 'Inspection View',
                author: 'huan_meng_hai_yan',
                improver: 'z2586300277',
                codeUrl: HOST + 'threeExamples/animation/inspectionView.js',
                image: HOST + 'threeExamples/animation/inspectionView.jpg',
            }
        ]
    },
    {
        pid: 'physics',
        name: '物理应用',
        name_en: 'Physics',
        children: [
            {
                id: 'physicsMesh',
                name: '物理cannon使用',
                name_en: 'Physics Mesh',
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
                name_en: 'Ammo Physics',
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
        name_en: 'Expand',
        children: [
            {
                id: 'localModel',
                name: '本地模型加载',
                name_en: 'Local Model',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/basic/localModel.js',
                image: HOST + 'threeExamples/basic/localModel.jpg',
            },
            {
                id: 'useIndexDB',
                name: 'IndexedDB使用',
                name_en: 'Use IndexDB',
                author: 'z2586300277',
                htmlUrl: HOST + 'threeExamples/basic/useIndexDB.html',
                image: HOST + 'threeExamples/basic/useIndexDB.jpg',
            },
            {
                id: 'loadTiles',
                name: '加载3dtiles',
                name_en: 'Load Tiles',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/expand/loadTiles.js',
                referUrl: 'https://www.npmjs.com/package/3d-tiles-renderer',
                githubUrl: 'https://github.com/NASA-AMMOS/3DTilesRendererJS',
                image: HOST + 'threeExamples/expand/loadTiles.jpg',
                inject: { "importmap": { "3d-tiles-renderer": FILE_HOST + "js/3dTilesRenderer@0.4.8/index.js" } },
                meta: {
                    title: 'three加载3dtiles',
                    keywords: 'three.js,3dtiles',
                    description: '使用three加载3dtiles'
                }
            },
            {
                id: 'map3d',
                name: '3D地图',
                name_en: 'Map 3D',
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
                id: 'areaMap',
                name: '分级地图',
                name_en: 'Area Map',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/other/areaMap.js',
                image: HOST + 'threeExamples/other/levelMap.jpg',
            },
            {
                id: 'geoBorder',
                name: '地理边界',
                name_en: 'Geo Border',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/expand/geoBorder.js',
                image: HOST + 'threeExamples/expand/geoBorder.jpg',
            },
            {
                id: 'heatmap3D',
                name: '3D热力图',
                name_en: 'Heatmap 3D',
                tag: TEXTS['normal'] + '-#e1d100',
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
                id: 'heatmapShader',
                name: '热力图',
                name_en: 'Heatmap Shader',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/shader/heatmapShader.js',
                image: HOST + 'threeExamples/shader/heatmapShader.jpg',
            },
            {
                id: 'heatmapModel',
                name: '模型热力图',
                name_en: 'Heatmap Model',
                author: 'z2586300277',
                referUrl: 'https://github.com/CHENJIAMIAN/InterpolatedGradientMaterial',
                codeUrl: HOST + 'threeExamples/expand/heatmapModel.js',
                image: HOST + 'threeExamples/expand/heatmapModel.jpg',
            },
            {
                id: 'Volumetric Heatmap',
                name: '3d热力图-体积版',
                name_en: 'volumeHeatmap',
                tag: TEXTS['volume'],
                author: 'ZackFair5185034',
                codeUrl: HOST + 'threeExamples/application/volumeHeatmap.js',
                image: HOST + 'threeExamples/application/volumeHeatmap.webp',
            },
            {
                id: 'modelBlendReflector',
                name: '模型反射效果',
                name_en: 'Model Blend',
                tag: TEXTS['模型反射'] + '--14',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/expand/modelBlendReflector.js',
                image: HOST + 'threeExamples/expand/modelBlendReflector.jpg',
            },
            {
                id: 'multWindowScene',
                name: '多浏览器窗口连接',
                name_en: 'Mult Window',
                author: 'z2586300277',
                referUrl: 'https://github.com/bgstaal/multipleWindow3dScene',
                codeUrl: HOST + 'threeExamples/expand/multWindowScene.js',
                image: HOST + 'threeExamples/expand/multWindowScene.jpg',
            },
            {
                id: 'combineEcharts',
                name: 'Echarts结合',
                name_en: 'Combine Echarts',
                author: 'z2586300277',
                referUrl: 'https://echarts.apache.org/',
                codeUrl: HOST + 'threeExamples/expand/combineEcharts.js',
                image: HOST + 'threeExamples/expand/combineEcharts.jpg',
            },
            {
                id: 'barCharts',
                name: '柱状图',
                name_en: 'Bar Charts',
                referUrl: 'https://mp.weixin.qq.com/s/jxHBDjb2EFxo8oHSuGiDqA',
                htmlUrl: HOST + 'threeExamples/expand/barCharts.html',
                image: HOST + 'threeExamples/expand/barCharts.jpg',
            },
            {
                id: 'gaussianSplats3D',
                name: '高斯溅射',
                name_en: 'gaussianSplats3D',
                referUrl: 'https://projects.markkellogg.org/threejs/demo_gaussian_splats_3d.php',
                author: 'ZackFair5185034',
                codeUrl: HOST + 'threeExamples/expand/gaussianSplats3D.js',
                image: HOST + 'threeExamples/expand/gaussianSplats3D.webp',
                inject: {
                    importmap: {
                        '@mkkellogg/gaussian-splats-3d': 'https://cdn.jsdelivr.net/npm/@mkkellogg/gaussian-splats-3d@0.4.7/+esm'
                    }
                }
            },
            {
                id: 'tilesMap',
                name: '瓦片地图',
                name_en: 'Tiles Map',
                author: 'z2586300277',
                referUrl: 'https://sxguojf.github.io/three-tile-doc/',
                codeUrl: HOST + 'threeExamples/expand/tilesMap.js',
                image: HOST + 'threeExamples/expand/tilesMap.jpg',
                inject: {
                    importmap: {
                        "three-tile": "https://cdn.jsdelivr.net/npm/three-tile@0.11.6/dist/index.js",
                        "three-tile/plugin": "https://cdn.jsdelivr.net/npm/three-tile@0.11.6/dist/plugin/index.js"
                    }
                }
            },
            {
                id: 'd3Svg',
                name: 'D3 svg与Three',
                name_en: 'D3 SVG Three',
                author: 'z2586300277',
                referUrl: 'https://d3js.org/',
                codeUrl: HOST + 'threeExamples/expand/d3Svg.js',
                image: HOST + 'threeExamples/expand/d3Svg.jpg',
                inject: {
                    importmap: {
                        "d3": "https://cdn.jsdelivr.net/npm/d3/+esm"
                    }
                }
            },
            {
                id: 'multViews',
                name: '多视图',
                name_en: 'Mult Views',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/expand/multViews.js',
                image: HOST + 'threeExamples/expand/multViews.jpg',
            }
        ]
    },
    {
        pid: 'effectComposer',
        name: '后期处理',
        name_en: 'EffectComposer',
        children: [
            {
                id: 'selectBloomPass',
                name: '辉光-postprocessing',
                name_en: 'Select Bloom',
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
                name_en: 'Custom Mask',
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
                name_en: "UV Transform",
                improver: "giser2017",
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
                name_en: 'Afterimage',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/effectComposer/afterimagePass.js',
                image: HOST + 'threeExamples/effectComposer/afterimagePass.jpg',
            },
            {
                id: 'blurReflect',
                name: '模糊反射(drei转原生)',
                name_en: 'Blur Reflect',
                tag: TEXTS['磨砂反射'] + '-#d265bb',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/expand/blurReflect.js',
                image: HOST + 'threeExamples/expand/blurReflect.jpg',
                referUrl: 'https://codesandbox.io/p/sandbox/bfplr'
            },
            {
                id: 'saturationPass',
                name: '饱和度(自定义Pass)',
                name_en: 'Saturation',
                author: 'huan_meng_hai_yan',
                codeUrl: HOST + 'threeExamples/effectComposer/saturationPass.js',
                image: HOST + 'threeExamples/effectComposer/saturationPass.jpg',
            },
            {
                id: "EdgeBlurringEffect",
                name: "边缘模糊效果",
                name_en: "Edge Blur",
                improver: "giser2017",
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
                name_en: 'Three Bloom',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/effectComposer/threeSelectBloom.js',
                image: HOST + 'threeExamples/effectComposer/threeSelectBloom.jpg',
                meta: {
                    title: '官方选择辉光简化版',
                    keywords: 'three.js,官方选择辉光简化版',
                    description: '使用three.js官方选择辉光简化版'
                }
            },
            {
                id: 'deferredLighting',
                name: '延迟光照',
                name_en: 'Deferred Lighting',
                author: 'ZackFair5185034',
                codeUrl: HOST + 'threeExamples/effectComposer/deferredLighting.js',
                image: HOST + 'threeExamples/effectComposer/deferredLighting.webp',
            },
            {
                id: 'sceneSnowEffect',
                name: '场景雪',
                name_en: 'sceneSnowEffect',
                author: 'ZackFair5185034',
                codeUrl: HOST + 'threeExamples/effectComposer/sceneSnowEffect.js',
                image: HOST + 'threeExamples/effectComposer/sceneSnowEffect.webp',
            }

        ]
    },
    {
        gid: 'generalGroup',
        group: '常规案例',
        group_en: 'General',
        pid: 'basic',
        name: '基础案例',
        name_en: 'Basic',
        children: [
            {
                id: 'modelAnimation',
                name: '人物模型动画案例',
                name_en: 'Model Animate',
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
                name_en: 'Model Load',
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
                name_en: 'Model Shadow',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/basic/modelShadow.js',
                image: HOST + 'threeExamples/basic/modelShadow.jpg',
            },
            {
                id: 'skyAndEnv',
                name: '天空盒',
                name_en: 'Sky And Env',
                tag: TEXTS['skybox'] + '-#d265bb',
                author: 'z2586300277',
                downloadUrl: 'https://pan.quark.cn/s/541e8eaea026',
                codeUrl: HOST + 'threeExamples/basic/skyAndEnv.js',
                image: HOST + 'threeExamples/basic/skyAndEnv.jpg',
                meta: {
                    title: '天空盒',
                    keywords: 'three.js,天空盒',
                    description: '使用three.js天空盒'
                }
            },
            {
                id: 'cameraAttribute',
                name: '相机属性',
                name_en: 'Camera',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/basic/cameraAttribute.js',
                image: HOST + 'threeExamples/basic/cameraAttribute.jpg',
            },
            {
                id: 'orbControls',
                name: '轨道控制器',
                name_en: 'Orbit Controls',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/basic/orbControls.js',
                image: HOST + 'threeExamples/basic/orbControls.jpg',
            },
            {
                id: 'createScene',
                name: '创建场景',
                name_en: 'Create Scene',
                tag: TEXTS['分布库'] + '-#f00',
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
                name_en: 'Model Sky',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/basic/modelSky.js',
                image: HOST + 'threeExamples/basic/modelSky.jpg',
            },
            {
                id: 'sceneFog',
                name: '场景雾化',
                name_en: 'Scene Fog',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/basic/sceneFog.js',
                image: HOST + 'threeExamples/basic/sceneFog.jpg'
            },
            {
                id: 'gltfOptLoader',
                name: 'Opt解压(su7 模型)',
                name_en: 'GLTF Opt',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/basic/gltfOptLoader.js',
                image: HOST + 'threeExamples/basic/gltfOptLoader.jpg'
            },
            {
                id: 'loadingAnimate',
                name: '加载动画',
                name_en: 'Load Animate',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/basic/loadingAnimate.js',
                image: HOST + 'threeExamples/basic/loadingAnimate.jpg',
            },
            {
                id: 'outlinePass',
                name: '轮廓光',
                name_en: 'Outline Pass',
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
                name_en: 'Screen Coord',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/basic/screenCoord.js',
                image: HOST + 'threeExamples/basic/screenCoord.jpg'
            },
            {
                id: 'gradientTriangle',
                name: '渐变三角形',
                name_en: 'Triangle',
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
                id: "扩散圈",
                name: "扩散圈",
                name_en: "Diffusion circle",
                author: "chenzhijie1",
                codeUrl: HOST + "threeExamples/basic/扩散圈.js",
                image: HOST + "threeExamples/basic/扩散圈.png",
                meta: {
                    title: "扩散圈",
                    keywords: "three.js,扩散圈",
                    description: "使用three.扩散圈"
                }
            },
            {
                id: 'changeMaterial',
                name: '材质修改动画',
                name_en: 'ChangeMaterial',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/basic/changeMaterial.js',
                image: HOST + 'threeExamples/basic/changeMaterial.jpg',
            },
            {
                id: 'transformObject',
                name: '拖拽控制',
                name_en: 'Transform Obj',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/basic/transformObject.js',
                image: HOST + 'threeExamples/basic/transformObject.jpg',
            },
            {
                id: 'transformBox3',
                name: '变换Box3',
                name_en: 'Transform Box3',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/basic/transformBox3.js',
                image: HOST + 'threeExamples/basic/transformBox3.jpg',
            },
            {
                id: 'modelAnimates',
                name: '单/多模型动画',
                name_en: 'Model Animates',
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
                name_en: 'GSAP Animate',
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
                name_en: 'Sprite Text',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/basic/spriteTexture.js',
                image: HOST + 'threeExamples/basic/spriteTexture.jpg',
            },
            {
                id: 'modelView',
                name: '模型视图',
                name_en: 'Model View',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/basic/modelView.js',
                image: HOST + 'threeExamples/basic/modelView.jpg',
            },
            {
                id: 'cssElement',
                name: 'CSS元素',
                name_en: 'CSS Element',
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
                id: 'domDisplay',
                name: 'DOM遮挡',
                name_en: 'DOM Display',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/basic/domDisplay.js',
                image: HOST + 'threeExamples/basic/domDisplay.jpg',
            },
            {
                id: 'cameraAnimate',
                name: '相机动画',
                name_en: 'Camera Animate',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/basic/cameraAnimate.js',
                image: HOST + 'threeExamples/basic/cameraAnimate.jpg',
            },
            {
                id: 'screenShot',
                name: '截图',
                name_en: 'Screen Shot',
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
                name_en: 'Skeleton Bone',
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
                name_en: 'View Helper',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/basic/viewHelper.js',
                image: HOST + 'threeExamples/basic/viewHelper.jpg',
            },
            {
                id: 'renderFrame',
                name: '帧率控制',
                name_en: 'Render Frame',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/basic/renderFrame.js',
                image: HOST + 'threeExamples/basic/renderFrame.jpg',
            },
            {
                id: 'renderTarget',
                name: '渲染贴图物体',
                name_en: 'Render Target',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/basic/renderTarget.js',
                image: HOST + 'threeExamples/basic/renderTarget.jpg',
            },
            {
                id: 'sceneScissor',
                name: '场景剪切-后处理',
                name_en: 'Scene Scissor',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/basic/sceneScissor.js',
                image: HOST + 'threeExamples/basic/sceneScissor.jpg',
            },
            {
                id: 'multOutlinePass',
                name: '多轮廓光',
                name_en: 'Mult Outline Pass',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/basic/multOutlinePass.js',
                image: HOST + 'threeExamples/basic/multOutlinePass.jpg',
            },
            {
                id: 'effectComposer',
                name: '渲染器配置',
                name_en: 'Effect Composer',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/basic/effectComposer.js',
                image: HOST + 'threeExamples/basic/effectComposer.jpg',
            },
            {
                id: 'modelExport',
                name: '模型导出',
                name_en: 'Model Export',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/basic/modelExport.js',
                image: HOST + 'threeExamples/basic/modelExport.jpg',
            },
            {
                id: 'fileChunks',
                name: '文件分片(打包zip)',
                name_en: 'File Chunks',
                author: 'z2586300277',
                codeUrl: HOST + 'threeExamples/basic/fileChunks.js',
                image: HOST + 'threeExamples/basic/localModel.jpg',
                inject: {
                    importmap: {
                        'jszip': 'https://cdn.jsdelivr.net/npm/jszip@3.10.1/+esm'
                    }
                }
            }
        ]
    },
    {
        gid: 'generalGroup',
        group: '常规案例',
        group_en: 'General',
        pid: 'introduction',
        name: '入门案例',
        name_en: 'Introduction',
        children: [
            {
                id: "入门",
                name: "入门",
                name_en: "Introduction",
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
                name_en: "Helper Line",
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
                name_en: "Light",
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
                name_en: "Camera",
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
                name_en: "Animation",
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
                name_en: "Fullscreen",
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
                name_en: "Frame Rate",
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
                name_en: "Array Model",
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
                name_en: "Geometry",
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
                name_en: "Points Lines",
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
                name_en: "Grid",
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
                name_en: "Index",
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
                name_en: "Transform",
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
                name_en: "Vertices",
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
                name_en: "Vertex Color",
                author: "jiawanlong",
                codeUrl: HOST + "threeExamples/basic/顶点颜色.js",
                image: HOST + "threeExamples/basic/顶点颜色.jpg",
                meta: {
                    title: "顶点颜色",
                    keywords: "three.js,顶点颜色",
                    description: "使用three.js顶点颜色"
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
                id: 'sketchfab_model',
                name: 'sketchfab免费模型',
                name_en: 'Sketchfab',
                author: 'z2586300277',
                openUrl: 'https://sketchfab.com/',
                image: HOST + 'threeExamples/tools/sketchfab.jpg'
            },
            {
                id: 'shaderToy',
                name: '开源shader社区',
                name_en: 'ShaderToy',
                author: 'z2586300277',
                openUrl: 'https://www.shadertoy.com/',
                image: FILE_HOST + 'images/shaderToy.jpg'
            },
            {
                id: 'skyBox_image',
                name: '免费hdr全景图资源',
                name_en: 'Free HDR',
                author: 'z2586300277',
                openUrl: 'https://polyhaven.com/hdris/skies',
                image: HOST + 'threeExamples/tools/skyBox_image.jpg'
            },
            {
                id: 'gltf_report',
                name: 'gltf在线draco压缩工具',
                name_en: 'GLTF Draco',
                author: 'donmccurdy',
                openUrl: 'https://gltf.report/',
                image: HOST + 'threeExamples/tools/gltf_report.jpg'
            },
            {
                id: 'skyBox_Make',
                name: 'hdr制作天空盒',
                name_en: 'HDR Skybox',
                author: 'matheowis',
                openUrl: 'https://matheowis.github.io/HDRI-to-CubeMap/',
                githubUrl: 'https://github.com/matheowis/HDRI-to-CubeMap',
                image: HOST + 'threeExamples/tools/skyBox_Make.jpg'
            },
            {
                id: 'make_json_font',
                name: '字体转Three使用json字体',
                name_en: 'Font to JSON',
                author: 'gero3',
                openUrl: 'https://gero3.github.io/facetype.js/',
                githubUrl: 'https://github.com/gero3/facetype.js',
                image: HOST + 'threeExamples/tools/make_json_font.jpg'
            },
            {
                id: 'shaderWebgl',
                name: 'Webgl直接可用Shader',
                name_en: 'WebGL Shader',
                author: 'mrdoob',
                openUrl: 'https://glslsandbox.com/',
                githubUrl: 'https://github.com/mrdoob/glsl-sandbox',
                image: FILE_HOST + 'images/shaderWebgl.jpg'
            },
            {
                id: 'shaderEditor',
                name: 'Shader编辑器',
                name_en: 'Shader Editor',
                author: 'patriciogonzalezvivo',
                openUrl: 'https://editor.thebookofshaders.com/',
                githubUrl: 'https://github.com/patriciogonzalezvivo/glslEditor',
                image: FILE_HOST + 'images/shaderEditor.jpg'
            },
            {
                id: 'geojsonTool',
                name: 'geojson获取工具',
                name_en: 'GeoJSON Tool',
                author: 'z2586300277',
                openUrl: 'https://datav.aliyun.com/portal/school/atlas/area_selector',
                image: HOST + 'threeExamples/tools/geojsonTool.jpg'
            },
            {
                id: 'TRELLIS',
                name: '图片生成3D模型',
                name_en: 'Image to 3D',
                author: 'AUTO',
                githubUrl: 'https://github.com/microsoft/TRELLIS',
                openUrl: 'https://microsoft.github.io/TRELLIS/',
                links: [
                    { name: 'hyper3d', url: 'https://hyper3d.ai/' },
                    { name: 'tripo3d', url: 'https://studio.tripo3d.ai/' }
                ],
                image: HOST + 'threeExamples/tools/TRELLIS.jpg'
            },
            {
                id: 'mixamo',
                name: '制作人物动画',
                name_en: 'Mixamo',
                author: 'z2586300277',
                openUrl: 'https://www.mixamo.com/',
                image: HOST + 'threeExamples/tools/mixamo.jpg'
            },
            {
                id: 'gltf_viewer',
                name: 'gltf模型查看器',
                name_en: 'GLTF Viewer',
                author: 'AUTO',
                githubUrl: 'https://github.com/donmccurdy/three-gltf-viewer',
                openUrl: 'https://gltf-viewer.donmccurdy.com/',
                image: HOST + 'threeExamples/tools/gltf_viewer.jpg'
            }
        ]
    },

]
