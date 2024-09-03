import { HOST, FILE_HOST } from './host.js'

export default [
    {
        pid: 'friendStation',
        name: '开源导航',
        children: [
            {
                id: 'alwxkxk',
                author: 'alwxkxk',
                name: 'Three.js 案例',
                openUrl: 'https://alwxkxk.github.io/threejs-example/',
                githubUrl: 'https://github.com/alwxkxk/threejs-example',
                image: FILE_HOST + 'images/alwxkxk.jpg'
            },
            {
                id: 'jiawanlong',
                author: 'jiawanlong',
                name: 'Cesium&Three.js 案例',
                openUrl: 'https://jiawanlong.github.io/examples/cesiumEx/examples.html',
                githubUrl: 'https://github.com/jiawanlong/Cesium-Examples',
                image: FILE_HOST + 'images/jiawanlong.jpg'
            },
            {
                id: 'bosombaby',
                author: 'bosombaby',
                name: 'Three.js 源码地址',
                openUrl: 'https://product.vrteam.top/',
                githubUrl: 'https://github.com/bosombaby/web3d-product',
                image: FILE_HOST + 'images/bosombaby.jpg'
            },
            
            {
                id: 'wuyifan0203',
                author: 'wuyifan0203',
                name: 'Three.js 源码案例',
                openUrl: 'https://wuyifan0203.github.io/threejs-demo',
                githubUrl: 'https://github.com/wuyifan0203/threejs-demo',
                image: FILE_HOST + 'images/wuyifan0203.jpg'
            },

            {
                id: 'dragonir',
                author: 'dragonir',
                name: 'Three 案例',
                openUrl: 'https://dragonir.github.io/3d',
                githubUrl: 'https://github.com/dragonir/3d',
                image: FILE_HOST + 'images/dragonir.jpg'
            },

            {
                id: 'sxguojf',
                author: 'sxguojf',
                name: 'Three结合地图瓦片',
                openUrl: 'https://sxguojf.github.io/three-tile-example/',
                githubUrl: 'https://github.com/sxguojf/three-tile',
                image: 'https://raw.githubusercontent.com/sxguojf/three-tile/master/images/image-3.png'
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
                id: 'cssElement',
                name: 'CSS元素',
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
                image: HOST + "threeExamples/basic/帧率.png",
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
                image: HOST + "threeExamples/basic/阵列模型.png",
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
                image: HOST + "threeExamples/basic/几何体.png",
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
                image: HOST + "threeExamples/basic/旋转、缩放、平移几何体.png",
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
                image: HOST + "threeExamples/basic/顶点颜色.png",
                meta: {
                    title: "顶点颜色",
                    keywords: "three.js,顶点颜色",
                    description: "使用three.js顶点颜色"
                }
            }
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
                id: 'flowLight',
                name: '流光',
                author: 'yjsdszz',
                codeUrl: HOST + 'threeExamples/shader/flowLight.js',
                image: HOST + 'threeExamples/shader/flowLight.jpg',
                meta: {
                    title: '流光',
                    keywords: 'three.js,流光',
                    description: '使用three.js流光'
                }
            },
            {
                id: 'audioSolutions',
                name: '音乐可视化',
                author: 'flowers-10',
                codeUrl: HOST + 'threeExamples/shader/audioSolutions.js',
                image: HOST + 'threeExamples/shader/audioSolutions.png',
                meta: {
                    title: '音乐可视化',
                    keywords: 'three.js,音乐可视化',
                    description: '使用three.js音乐可视化'
                }
            }, {
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
                id: "imageShake",
                name: "图片抖动",
                author: "z2586300277",
                codeUrl: HOST + "threeExamples/shader/imageShake.js",
                image: HOST + "threeExamples/shader/imageShake.jpg"
            },
            {
                id: "fireball",
                name: "火球效果",
                author: "giser2017",
                htmlUrl: HOST + "threeExamples/shader/fireball.html",
                image: FILE_HOST + "images/four/fireball.png",
            },
            {
                id: "warnInfo",
                name: "警告信息",
                author: "yjsdszz",
                codeUrl: HOST + "threeExamples/shader/warnInfo.js",
                image: HOST + "threeExamples/shader/warnInfo.jpg",
            }
        ]
    },
    {
        gid: 'effectGroup',
        pid: 'particle',
        name: '粒子',
        children: [
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
                id: "RandomParticle",
                name: "随机粒子效果",
                author: "giser2017",
                htmlUrl: HOST + "threeExamples/particle/RandomParticle.html",
                image: HOST + "threeExamples/particle/RandomParticle.png",
            },
            {
                id: "PlanetParticle",
                name: "粒子效果的行星",
                author: "giser2017",
                htmlUrl: HOST + "threeExamples/particle/PlanetParticle.html",
                image: HOST + "threeExamples/particle/PlanetParticle.png",
            },
            {
                id: "bubble",
                name: "粒子泡泡",
                author: "huan_meng_hai_yan",
                codeUrl: HOST + "threeExamples/particle/bubble.js",
                image: FILE_HOST + "images/four/bubble.png",
            },
            {
                id: "downSnow",
                name: "下雪",
                author: "yjsdszz",
                codeUrl: HOST + "threeExamples/particle/downSnow.js",
                image: HOST + "threeExamples/particle/downSnow.jpg",
            }
        ]
    },
    {
        pid: 'application',
        name: '应用场景',
        children: [
            {
                id: 'flyLine',
                name: '飞线效果',
                author: 'ecojust',
                codeUrl: HOST + 'threeExamples/application/flyLine.js',
                image: FILE_HOST + 'threeExamples/application/flyLine/colorful.gif',
            },
            {
                id: 'smokeAir',
                name: '烟雾效果',
                author: 'yjsdszz',
                codeUrl: HOST + 'threeExamples/application/smokeAir.js',
                image: FILE_HOST + 'threeExamples/application/smokeAir.jpg',
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
                image: HOST + 'threeExamples/application/matrixOperation.jpg'
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
                id: 'flowerRain',
                name: '花瓣雨',
                author: 'QuarkGluonPlasma',
                codeUrl: HOST + 'threeExamples/application/flowerRain.js',
                image: HOST + 'threeExamples/application/flowerRain.jpg',
            },
            {
                id: 'houseScene',
                name: '第一人称房屋',
                author: 'QuarkGluonPlasma',
                codeUrl: HOST + 'threeExamples/application/houseScene.js',
                image: HOST + 'threeExamples/application/houseScene.jpg'
            },
            {
                id: "3DCircle",
                name: "扩散半球",
                author: "giser2017",
                codeUrl: HOST + "threeExamples/application/3DCircle.js",
                image: FILE_HOST + "images/four/3DCircle.png",
            },
            {
                id: 'happyNewYear',
                name: '新年快乐',
                author: 'yjsdszz',
                codeUrl: HOST + 'threeExamples/application/happyNewYear.js',
                image: HOST + 'threeExamples/application/happyNewYear.jpg'
            },
            {
                id: 'windMove',
                name: '风吹动画',
                author: 'yjsdszz',
                codeUrl: HOST + 'threeExamples/application/windMove.js',
                image: HOST + 'threeExamples/application/windMove.jpg'
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
            },
            {
                id: "EdgeBlurringEffect",
                name: "边缘模糊效果",
                author: "giser2017",
                codeUrl: HOST + 'threeExamples/effectComposer/EdgeBlurringEffect.js',
                image: FILE_HOST + "images/four/EdgeBlurringEffect.png",
            },
        ]
    },
    {
        pid: 'advancedExamples',
        name: '高级案例',
        children: [
            {
                id: 'taohuating',
                name: '桃花亭',
                author: 'huan_meng_hai_yan',
                openUrl: 'https://z2586300277.github.io/show-site/TaoHuaTing',
                downloadUrl: 'https://z2586300277.github.io/show-site/TaoHuaTing/TaoHuaTing.zip',
                image: HOST + 'threeExamples/openSource/taohuating.jpg'
            },
            {
                id: 'ziTengHua',
                name: '紫藤花',
                author: 'huan_meng_hai_yan',
                openUrl: 'https://g2657.github.io/examples-server/ziTenghua/',
                downloadUrl: 'https://g2657.github.io/examples-server/ziTenghua/ziTenghua.zip',
                image: HOST + 'threeExamples/openSource/ziTengHua.jpg'
            }
        ]
    },
    {
        pid: 'openSource',
        name: '开源作品',
        children: [
            {
                id: 'kallkago_su7',
                name: 'su7 demo',
                author: 'KallkaGo',
                openUrl: 'https://z2586300277.github.io/show-site/su7_demo/',
                githubUrl: 'https://github.com/KallkaGo/su7-demo',
                image: HOST + 'threeExamples/openSource/kallkago_su7.jpg'
            },
            {
                id: 'z2586300277_3d_editor',
                name: 'Three.js低代码编辑器',
                author: 'z2586300277',
                openUrl: 'https://z2586300277.github.io/three-editor/dist/#/editor',
                githubUrl: 'https://github.com/z2586300277/three-editor',
                image: HOST + 'threeExamples/openSource/z2586300277_3d_editor.jpg'
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
                id: 'gltf_report',
                name: 'gltf在线draco压缩工具',
                author: 'z2586300277',
                openUrl: 'https://gltf.report/',
                image: HOST + 'threeExamples/tools/gltf_report.jpg'
            },
            {
                id: 'skyBox_image',
                name: '免费hdr全景图资源',
                author: 'z2586300277',
                openUrl: 'https://polyhaven.com/hdris/skies',
                image: HOST + 'threeExamples/tools/skyBox_image.jpg'
            },
            {
                id: 'skyBox_Make',
                name: 'hdr制作天空盒',
                author: 'z2586300277',
                openUrl: 'https://matheowis.github.io/HDRI-to-CubeMap/',
                image: HOST + 'threeExamples/tools/skyBox_Make.jpg'
            },
            {
                id: 'make_json_font',
                name: '字体转Three使用json字体',
                author: 'z2586300277',
                openUrl: 'https://gero3.github.io/facetype.js/',
                image: HOST + 'threeExamples/tools/make_json_font.jpg'
            }
        ]
    },

]