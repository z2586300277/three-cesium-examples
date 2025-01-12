import { HOST, FILE_HOST } from "./host.js";

export default [
    {
        pid: 'openSourceStation',
        name: '资源链接',
        children: [
            {
                id: 'codePen',
                name: 'CodePen 社区',
                tip: '国外包含大量在线运行的前端案例社区',
                author: 'Threejs',
                openUrl: 'https://codepen.io/search/pens?q=three+js',
                image: FILE_HOST + 'images/codepen.jpg'
            },

            {
                id: 'codeSandbox',
                name: 'CodeSandbox 社区',
                author: 'Threejs',
                openUrl: 'https://codesandbox.io/search?query=three',
                image: FILE_HOST + 'images/sandbox.jpg'
            },

            {
                id: 'tympanus',
                name: 'Codrops 社区',
                author: 'Threejs',
                openUrl: 'https://tympanus.net/codrops/demos/?tag=three-js',
                image: FILE_HOST + 'images/tympanus.jpg'
            },

            {
                id: 'sketchThree',
                author: 'AUTO',
                name: 'Three特效',
                openUrl: 'https://ykob.github.io/sketch-threejs/',
                githubUrl: 'https://github.com/ykob/sketch-threejs',
                image: FILE_HOST + 'images/sketchThree.jpg'
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
                id: 'ThreeJourney',
                author:'AUTO',
                name: 'ThreeJourney',
                openUrl: 'https://journey.pmnd.rs/',
                githubUrl: 'https://github.com/pmndrs/threejs-journey',
                image: HOST + 'threeExamples/openSource/threejs-journey.jpg'
            },

            {
                id: 'wuyifan0203',
                author: 'wuyifan0203',
                name: 'Three源码案例',
                openUrl: 'https://wuyifan0203.github.io/threejs-demo',
                githubUrl: 'https://github.com/wuyifan0203/threejs-demo',
                image: FILE_HOST + 'images/wuyifan0203.jpg'
            },
            {
                id: 'alwxkxk',
                author: 'alwxkxk',
                name: 'Three案例',
                openUrl: 'https://alwxkxk.github.io/threejs-example/',
                githubUrl: 'https://github.com/alwxkxk/threejs-example',
                image: FILE_HOST + 'images/alwxkxk.jpg'
            },

            {
                id: 'sxguojf',
                author: 'sxguojf',
                name: 'Three结合地图瓦片',
                openUrl: 'https://sxguojf.github.io/three-tile-example/',
                githubUrl: 'https://github.com/sxguojf/three-tile',
                image: FILE_HOST + 'images/wangpengfei.jpg'
            },

            {
                id: 'zhengjie9510',
                author: 'zhengjie9510',
                name: 'Cesium案例',
                openUrl: 'https://zhengjie9510.github.io/webgis-demo',
                githubUrl: 'https://github.com/zhengjie9510/webgis-demo',
                image: FILE_HOST + 'images/zhengjie9510.jpg'
            },

            {
                id: 'quyinggang',
                name: 'Three学习案例',
                author: 'AUTO',
                githubUrl: 'https://github.com/quyinggang/three3d',
                openUrl: 'https://quyinggang.github.io/three3d/',
                image: FILE_HOST + 'images/quyinggang.jpg'
            },
            {
                id: 'bosombaby',
                author: 'bosombaby',
                name: 'Three 案例',
                openUrl: 'https://product.vrteam.top/',
                githubUrl: 'https://github.com/bosombaby/web3d-product',
                image: FILE_HOST + 'images/bosombaby.jpg'
            },
            {
                id: 'pengfeiw',
                author: 'pengfeiw',
                name: '3d 案例',
                githubUrl: 'https://github.com/pengfeiw/threejs-case',
                openUrl: 'https://pengfeiw.github.io/minicode/',
                image: HOST + 'threeExamples/openSource/wangpengfei.jpg'
            },

            {
                id: 'lpya',
                author: 'lpya',
                name: 'vue Three案例',
                openUrl: 'https://lpya.github.io/vue2-threejs-sefficacy',
                githubUrl: 'https://github.com/lpya/vue2-threejs-sefficacy',
                image: FILE_HOST + 'images/lpya.jpg'
            },
            {
                id: 'etudes',
                author: 'AUTO',
                name: 'Three案例',
                openUrl: 'https://boytchev.github.io/etudes/',
                githubUrl: 'https://github.com/boytchev/etudes',
                image: HOST + 'threeExamples/openSource/etudes.jpg'
            }
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
            },
            {
                id: 'customEffect',
                name: '自定义后期处理(r3f)',
                tag: '后期处理',
                tip: '基于react-three-fiber 制作的自定义后期处理效果',
                author: 'KallkaGo',
                openUrl: 'https://z2586300277.github.io/show-site/customEffect/',
                githubUrl: 'https://github.com/KallkaGo/CustomEffect',
                image: 'https://z2586300277.github.io/show-site/customEffect/customEffect.jpg'
            },
            {
                id: 'kallkago_su7',
                tag: '热门-#5f9be3',
                tip: 'SU7车展示案例，使用React+Three.js开发',
                name: 'su7-R3f',
                author: 'KallkaGo',
                openUrl: 'https://z2586300277.github.io/show-site/su7_demo/',
                githubUrl: 'https://github.com/KallkaGo/su7-demo',
                image: HOST + 'threeExamples/openSource/kallkago_su7.jpg'
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
                id: '3dEarth',
                name: '3D地球',
                author: 'RainManGO',
                openUrl: 'https://z2586300277.github.io/show-site/3dEarth/',
                githubUrl: 'https://github.com/RainManGO/3d-earth',
                image: FILE_HOST + 'images/3dEarth.png'
            },
            {
                id: '3dEarth2',
                name: '虚幻地球',
                author: 'GhostCatcg',
                openUrl: 'https://z2586300277.github.io/show-site/3dEarth2/',
                githubUrl: 'https://github.com/GhostCatcg/3d-earth',
                image: HOST + 'threeExamples/openSource/3dEarth2.jpg'
            },
            {
                id: 'fogEarth',
                name: '雾地球',
                author: 'AUTO',
                openUrl: 'https://dgreenheck.github.io/threejs-procedural-planets/',
                githubUrl: 'https://github.com/dgreenheck/threejs-procedural-planets',
                image: HOST + 'threeExamples/openSource/fogEarth.jpg'
            },
            {   
                id: 'numberEarth',
                name: '数字地球',
                author: 'AUTO',
                openUrl: 'https://jackgit.github.io/xplan/',
                githubUrl:'https://github.com/JackGit/xplan',
                image: HOST + 'threeExamples/openSource/numberEarth.jpg'
            },
            {
                id: '3dPointsModel',
                name: '3D点云模型',
                author: 'youngdro',
                openUrl: 'https://g2657.github.io/examples-server/3DPoints/',
                githubUrl: 'https://github.com/youngdro/3DPoints',
                image: HOST + 'threeExamples/openSource/3dPointsModel.jpg',
                downloadUrl: 'https://g2657.github.io/examples-server/3DPoints/3DPoints.zip'
            },
            {
                id: 'threePerson',
                name: '第三人称控制',
                author: 'simondevyoutube',
                improver: 'z2586300277',
                openUrl: 'https://g2657.github.io/examples-server/thirdPerson/',
                githubUrl: 'https://github.com/simondevyoutube/ThreeJS_Tutorial_ThirdPersonCamera',
                image: 'https://g2657.github.io/examples-server/thirdPerson/thirdPerson.jpg',
                downloadUrl: 'https://g2657.github.io/examples-server/thirdPerson/thirdPerson.zip'
            },
            {
                id: 'smartCity',
                name: '智慧城市特效',
                author: '193Eric',
                openUrl: ' https://g2657.github.io/examples-server/smartCity/demo/',
                githubUrl: 'https://github.com/193Eric/threejs-demo',
                downloadUrl: 'https://g2657.github.io/examples-server/smartCity/smartCity.zip',
                image: HOST + 'threeExamples/openSource/smartCity.jpg'
            },
            {
                id: '3dGeoMap',
                name: '3D地图',
                author: 'xiaogua-bushigua',
                githubUrl: 'https://github.com/xiaogua-bushigua/3d-geoMap',
                openUrl: 'https://z2586300277.github.io/show-site/3dGeoMap',
                image: FILE_HOST + 'images/3dGeoMap.jpg',
                links: [
                    {
                        name: '📺B站',
                        url: 'https://www.bilibili.com/video/BV1ku4y1X7wU/'
                    }
                ]
            },
            {
                id: 'su7peng',
                name: 'SU7-Vue3',
                author: 'Pong-lei',
                openUrl: 'https://g2657.github.io/examples-server/su7_2/',
                githubUrl: 'https://github.com/Pong-lei/su7_imitate',
                image: HOST + 'threeExamples/openSource/su7peng.jpg'
            },
            {
                id: 'su7_three',
                name: '原生su7',
                author: 'ASouthernCat',
                openUrl: 'https://z2586300277.github.io/show-site/su7_car/',
                githubUrl: 'https://github.com/ASouthernCat/Porsche911-carshow-threejs',
                image: HOST + 'threeExamples/openSource/su7_three.jpg',
                links: [
                    {
                        name: '📺BiBi',
                        url: 'https://www.bilibili.com/video/BV1JH4y1N7pT'
                    }
                ]
            },
            {
                id: 'feng_ji',
                name: '风机',
                author: 'AUTO',
                openUrl: 'https://fengtianxi001.github.io/MF-TurbineMonitor',
                githubUrl: 'https://github.com/fengtianxi001/MF-TurbineMonitor',
                image: FILE_HOST + 'images/fengji.jpg'
            },
            {
                id: 'roaming',
                author: 'AUTO',
                name: '漫游模拟器',
                githubUrl: 'https://github.com/Junhong-Chen/roaming-simulator',
                openUrl: 'https://junhong-chen.github.io/roaming-simulator/',
                image: HOST + 'threeExamples/openSource/roaming.jpg'
            },

            {
                id: 'lonlat23',
                author: 'nico',
                name: '经纬度路线运动(车流模拟)',
                // githubUrl:'https://github.com/swift502/Sketchbook',
                openUrl: 'http://nicowebgl.cn/d3_geo/',
                image: HOST + 'threeExamples/openSource/lonlat23.jpg'
            },

            {
                id: 'change',
                author: 'nico',
                name: '二三位联动-物理实验',
                githubUrl: 'https://github.com/Nicolas-zn/distance_sign',
                openUrl: 'http://nicowebgl.cn/distance_sign/',
                image: HOST + 'threeExamples/openSource/distance_sign.jpg'
            },
            {
                id: 'draw,roam',
                author: 'nico',
                name: '绘线漫游',
                githubUrl: 'https://github.com/Nicolas-zn/path',
                openUrl: 'http://nicowebgl.cn/path/',
                image: HOST + 'threeExamples/openSource/roam.jpg'
            },
            {
                id: 'realWater',
                author: 'AUTO',
                name: '真实水效果',
                githubUrl: 'https://github.com/martinRenou/threejs-water',
                openUrl: 'https://martinrenou.github.io/threejs-water/',
                image: HOST + 'threeExamples/openSource/realWater.jpg',
            },
            {
                id: 'vrHall',
                author: 'AUTO',
                name: 'VR展厅',
                githubUrl: 'https://github.com/mtsee/vr-hall',
                openUrl: 'http://test4.h5ds.com/',
                image: HOST + 'files/site/logo.svg',
            },
            {
                id: 'music_wobble',
                name: '3D音乐 (简化)',
                author: 'AUTO',
                githubUrl: 'https://github.com/d3ttl4ff/music-wobble',
                openUrl: 'https://z2586300277.github.io/show-site/music_wobble',
                downloadUrl: 'https://z2586300277.github.io/show-site/music_wobble/source.zip',
                image: HOST + 'threeExamples/openSource/music_wobble.jpg',
            },
            {
                id: 'area,pixijs,webgl',
                author: 'nico',
                name: '场景导航（免模型）',
                githubUrl: 'https://github.com/Nicolas-zn/my_code/blob/main/src/code/interactive_image.vue',
                openUrl: 'http://nicowebgl.cn/portfolio/#/interactive_image',
                image: HOST + 'threeExamples/openSource/area.jpg'
            },
            {
                id: 'unreal',
                author: 'nico',
                name: 'unreal风格场景标注',
                githubUrl: 'https://github.com/Nicolas-zn/annotations',
                openUrl: 'http://www.nicowebgl.cn/annotations/',
                image: HOST + 'threeExamples/openSource/unrealstyle.jpg'
            },
            {
                id: 'blanderCar',
                author: 'ASouthernCat',
                name: '硬核小车',
                githubUrl: 'https://github.com/ASouthernCat/simple-muscle-car',
                openUrl: 'https://g2657.github.io/examples-server/blender_car/',
                image: HOST + 'threeExamples/openSource/blenderCar.jpg',
                links: [
                    {
                        name: '预览(vercel)',
                        url: 'https://simple-muscle-car.vercel.app/'
                    },
                    {
                        name: '📺BiBi',
                        url: 'https://www.bilibili.com/video/BV1AcSUY3Ez2'
                    }
                ]
            },
            {
                id: 'small_island',
                author: 'AUTO',
                name: '小岛',
                githubUrl: 'https://github.com/alezen9/unshaken',
                openUrl: 'https://alezen9.github.io/unshaken/',
                image: HOST + 'threeExamples/openSource/small_island.jpg'
            },
            {   
                id: 'threejs-image-gallery',
                name: '图片画廊',
                author: 'AUTO',
                githubUrl: 'https://github.com/dgreenheck/threejs-image-gallery',
                openUrl: 'https://dgreenheck.github.io/threejs-image-gallery/',
                image: HOST + 'threeExamples/openSource/threejs-image-gallery.jpg'
            },
            {
                id: 'noise_gird',
                name: '噪声网格',
                author: 'AUTO',
                githubUrl: 'https://github.com/AadarshGupta07/noise-grid',
                openUrl: 'https://z2586300277.github.io/show-site/nosie_gird/',
                image: HOST + 'threeExamples/openSource/noise_gird.jpg'
            },
            {
                id: 'cheapwater',
                name: '交互水效果',
                author: 'AUTO',
                openUrl: 'https://mqnc.github.io/cheapwater/',
                githubUrl: 'https://github.com/mqnc/cheapwater',
                image: HOST + 'threeExamples/openSource/cheapwater.jpg'
            },
            {   
                id: 'threeCSGMesh',
                name: 'CSG网格',
                author: 'AUTO',
                githubUrl: 'https://github.com/manthrax/THREE-CSGMesh',
                openUrl: 'https://manthrax.github.io/THREE-CSGMesh/demos/CSGDemo.html',
                image: HOST + 'threeExamples/openSource/threeCSGMesh.jpg'
            },
            {
                id: 'flyBy',
                name: '飞行漫游',
                author: 'AUTO',
                githubUrl: 'https://github.com/jessehhydee/fly-by',
                openUrl: 'https://hydeit.co/fly-by/',
                image: HOST + 'threeExamples/openSource/flyBy.jpg'
            }
        ]
    },
    {
        pid: 'physicsSource',
        name: '物理相关',
        children: [
            {
                id: 'Sketchbook',
                author: 'AUTO',
                name: '飞车',
                githubUrl: 'https://github.com/swift502/Sketchbook',
                openUrl: 'https://jblaha.art/sketchbook/0.4/',
                image: HOST + 'threeExamples/openSource/sketchbook.jpg'
            },
            {
                id: 'threeForce',
                name: '力导向图',
                author: 'vasturiano',
                openUrl: 'https://vasturiano.github.io/3d-force-graph/example/large-graph/',
                githubUrl: 'https://github.com/vasturiano/3d-force-graph',
                image: HOST + 'threeExamples/physics/threeForce.jpg',
            },
            {
                id: 'octreeDemo',
                name: '八叉树',
                author: 'AUTO',
                openUrl: 'https://eriksom.github.io/threejs-octree/dist/example/',
                githubUrl: 'https://github.com/ErikSom/threejs-octree',
                image: HOST + 'threeExamples/physics/octreeDemo.jpg'
            }
        ]

    },
    {
        pid: 'threejsSource',
        name: '扩展依赖',
        children: [
            {
                id: 'threejsExamples',
                name: 'alien.js',
                tag: '众多效果',
                author: 'AUTO',
                tip: '基于three.js封装了大量的特效和组件',
                openUrl: 'https://alien.js.org/examples/three/shader_fluid_distortion.html',
                githubUrl: 'https://github.com/alienkitty/alien.js',
                image: HOST + 'threeExamples/openSource/alien.jpg'
            },
            {
                id: 'cameraControls',
                name: '相机控制器',
                author: 'AUTO',
                tip: '基于three.js封装的相机控制器',
                openUrl: 'https://yomotsu.github.io/camera-controls/examples/basic.html',
                githubUrl: 'https://github.com/yomotsu/camera-controls',
                image: HOST + 'threeExamples/openSource/cameraControls.jpg'
            },
            {
                id: 'CustomShaderMaterial',
                name: '自定义ShaderMaterial',
                tip: ' 使用您自己的着色器扩展 Three.js 标准材质！',
                author: 'AUTO',
                openUrl: 'https://farazzshaikh.github.io/THREE-CustomShaderMaterial/',
                githubUrl: 'https://github.com/FarazzShaikh/THREE-CustomShaderMaterial',
                image: HOST + 'threeExamples/openSource/CustomShaderMaterial.jpg'
            },
            {
                id: 'drei_vanilla',
                name: 'drei-vanilla',
                author: 'AUTO',
                tip: 'Drei的原生版本，封装了很多函数',
                openUrl: 'https://pmndrs.github.io/drei-vanilla/',
                githubUrl: 'https://github.com/pmndrs/drei-vanilla',
                image: HOST + 'threeExamples/openSource/drei_vanilla.jpg'
            },
            {
                id: 'tShaderMaterial',
                name: 'threejs-shader-materials',
                author: 'AUTO',
                tip: 'Three.js的着色器材质扩展，包括多种着色器材质',
                openUrl: 'https://masatomakino.github.io/threejs-shader-materials/demo/',
                githubUrl: 'https://github.com/MasatoMakino/threejs-shader-materials',
                image: HOST + 'threeExamples/openSource/tShaderMaterial.jpg'
            },
            {
                id: 'GaussianSplats3D',
                name: '高斯点云渲染',
                author: 'AUTO',
                githubUrl: 'https://github.com/mkkellogg/GaussianSplats3D',
                openUrl: 'https://projects.markkellogg.org/threejs/demo_gaussian_splats_3d.php',
                image: HOST + 'threeExamples/openSource/GaussianSplats3D.jpg'
            },
            {   
                id: 'three-viewport-gizmo',
                name: '视口控制器',
                author: 'AUTO',
                githubUrl: 'https://github.com/Fennec-hub/three-viewport-gizmo',
                openUrl: 'https://fennec-hub.github.io/three-viewport-gizmo/examples/orbit-controls',
                image: HOST + 'threeExamples/openSource/three-viewport-gizmo.jpg'
            }
        ]
    },
    {
        pid: 'ortherSource',
        name: '其他资源',
        children: [
            {
                id: 'loveCode',
                author: 'AUTO',
                name: '爱心代码',
                githubUrl: 'https://github.com/sun0225SUN/Awesome-Love-Code',
                openUrl: 'https://sun0225sun.github.io/Awesome-Love-Code/',
                image: HOST + 'threeExamples/openSource/loveCode.jpg'
            },
            {
                id: 'bigScreen',
                author: 'AUTO',
                name: '大屏模板100套',
                githubUrl: 'https://github.com/iGaoWei/BigDataView',
                openUrl: 'https://igaowei.github.io/BigDataView/',
                image: HOST + 'threeExamples/openSource/bigScreen.jpg'
            },
            {
                id: 'axydemo',
                author: 'AUTO',
                name: '可视化大屏与3D',
                githubUrl: 'https://github.com/whanxueyu/demo-collection',
                openUrl: 'https://axydemo.netlify.app/#/bigScreen',
                image: HOST + 'threeExamples/openSource/axydemo.jpg'
            }
        ]

    }
]