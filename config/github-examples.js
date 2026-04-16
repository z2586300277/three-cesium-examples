import { HOST, FILE_HOST } from "./host.js";

export default [
    {
        pid: 'recommended',
        name: '优质推荐',
        name_en: 'Recommended',
        order: -10,
        children: [
            {
                id: "heat3dMap",
                name: "热力3D地图",
                name_en: "Heat 3d Map",
                author: "knight-L",
                tag: '地图' + '-#ff6d6d',
                openUrl: "https://knight-l.github.io/sc-datav/#/demo1",
                githubUrl: "https://github.com/knight-L/sc-datav",
                image: HOST + "threeExamples/openSource/heat3dMap.jpg",
            },
            {
                id: 'fmc_car',
                tag: TEXTS['效果佳'] + '-#2539a1',
                name: '麦克斯韦汽车',
                name_en: 'FMC Car',
                author: 'FFMMCC',
                tip: '效果超级棒的 three.js实现麦克斯韦汽车展厅项目',
                openUrl: 'https://g2657.github.io/examples-server/fmc_car/',
                githubUrl: 'https://coderfmc.github.io/three.js-demo/fmc-web-3d/',
                image: FILE_HOST + 'images/fmc_car.jpg',
                links: [
                    {
                        name: '📺BiBi',
                        url: 'https://www.bilibili.com/video/BV1dxBxYvEnh'
                    }
                ]
            },
            {
                id: 'numberFram',
                name: '数字农场',
                name_en: 'Number Fram',
                author: 'FFMMCC',
                tag: '智慧农业',
                githubUrl: 'https://gitee.com/fu-meichuan/digital-farmland',
                openUrl: 'https://coderfmc.github.io/three.js-demo/digital-farmland/#/carbon-neutral-bigscreen',
                image: 'https://coderfmc.github.io/three.js-demo/fmc-web-3d/img/智慧农田.png'
            },
            {
                id: 'z2586300277_new3d_editor',
                tag: TEXTS['编辑器'],
                tip: '使用Three.js开发的低代码组态易用的编辑器——全新版本',
                name: '新低代码编辑器',
                name_en: 'LowCode Editor',
                author: 'z2586300277',
                openUrl: 'https://z2586300277.github.io/threejs-editor/',
                githubUrl: 'https://github.com/z2586300277/threejs-editor',
                image: HOST + 'threeExamples/openSource/newThreeEditor.jpg',
            },
            {
                id: 'goViewThreeEditor',
                tag: 'GoView' + '-#62B1EE',
                tip: 'GoView集成three.js开发的三维编辑器，支持丰富的三维功能',
                name: 'GoView集成编辑器',
                name_en: 'GoView Three Editor',
                author: 'z2586300277',
                referUrl: 'https://www.mtruning.club/',
                openUrl: 'https://z2586300277.github.io/go-view-three-editor',
                githubUrl: 'https://github.com/z2586300277/go-view-three-editor',
                image: HOST + 'threeExamples/openSource/goViewThreeEditor.jpg'
            },
            {
                id: 'blanderCar',
                author: 'ASouthernCat',
                name: '硬核小车',
                name_en: 'Blender Car',
                tag: '汽车' + '-#006d6d',
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
                id: 'myWorld',
                name: '我的世界',
                name_en: 'My World',
                author: 'AUTO',
                githubUrl: 'https://github.com/hexianWeb/Third-Person-MC',
                openUrl: 'https://third-person-mc.vercel.app/',
                image: 'https://raw.githubusercontent.com/hexianWeb/picx-images-hosting/master/image.webp',
            }
        ]
    },
    {
        pid: 'topNavigation',
        name: '精选导航',
        name_en: 'Top Navigation',
        order: 70,
        children: [
            {
                id: 'codePen',
                name: 'CodePen 社区',
                name_en: 'CodePen',
                tag: TEXTS['推荐'] + '-#5f9be3',
                tip: '国外包含大量在线运行的前端案例社区',
                author: 'Threejs',
                openUrl: 'https://codepen.io/search/pens?q=three+js',
                image: FILE_HOST + 'images/codepen.jpg'
            },

            {
                id: 'codeSandbox',
                name: 'CodeSandbox 社区',
                name_en: 'CodeSandbox',
                author: 'Threejs',
                openUrl: 'https://codesandbox.io/search?query=three',
                image: FILE_HOST + 'images/sandbox.jpg'
            },

            {
                id: 'tympanus',
                name: 'Codrops 社区',
                name_en: 'Codrops',
                tag: TEXTS['推荐'],
                author: 'Threejs',
                openUrl: 'https://tympanus.net/codrops/demos/?tag=three-js',
                image: FILE_HOST + 'images/tympanus.jpg'
            },

            {
                id: 'reactThreeFiber',
                name: 'R3F官方案例',
                tag: 'React',
                name_en: 'React Three',
                openUrl: 'https://r3f.docs.pmnd.rs/getting-started/examples#showcase',
                githubUrl: 'https://github.com/pmndrs/react-three-fiber',
                image: HOST + 'threeExamples/openSource/reactThree.jpg'
            },

            {
                id: 'tres',
                name: 'Tres官方案例',
                tag: 'Vue',
                name_en: 'Tres',
                openUrl: 'https://tresjs.org/showcase',
                githubUrl: 'https://github.com/Tresjs',
                image: HOST + 'threeExamples/openSource/tres.jpg'
            }
        ]
    },
    {
        pid: 'openSourceStation',
        name: '资源链接',
        name_en: 'Resource Link',
        order: 80,
        children: [
            {
                id: 'sketchThree',
                author: 'AUTO',
                name: 'Three特效',
                name_en: 'Sketch_Three',
                openUrl: 'https://ykob.github.io/sketch-threejs/',
                githubUrl: 'https://github.com/ykob/sketch-threejs',
                image: FILE_HOST + 'images/sketchThree.jpg'
            },

            {
                id: 'dragonir',
                author: 'dragonir',
                name: 'Three 案例',
                name_en: 'Three Examples',
                openUrl: 'https://dragonir.github.io/3d',
                githubUrl: 'https://github.com/dragonir/3d',
                image: FILE_HOST + 'images/dragonir.jpg'
            },

            {
                id: 'ThreeJourney',
                author: 'AUTO',
                name: 'ThreeJourney',
                name_en: 'ThreeJourney',
                openUrl: 'https://journey.pmnd.rs/',
                githubUrl: 'https://github.com/pmndrs/threejs-journey',
                image: HOST + 'threeExamples/openSource/threejs-journey.jpg'
            },

            {
                id: 'wuyifan0203',
                author: 'wuyifan0203',
                name: 'Three源码案例',
                name_en: 'Three Source',
                openUrl: 'https://avan0203.github.io/threejs-demo/',
                githubUrl: 'https://github.com/Avan0203/threejs-demo',
                image: FILE_HOST + 'images/wuyifan0203.jpg'
            },
            {
                id: 'aSouthernCat',
                name: 'ASouthernCat 3D之旅',
                name_en: 'ASouthernCat Journey',
                author: 'ASouthernCat',
                githubUrl: 'https://github.com/ASouthernCat',
                openUrl: 'https://my-threejs-journey-theta.vercel.app/#amazing-globe',
                image: HOST + 'threeExamples/openSource/aSouthernCat.jpg',
            },
            {
                id: 'alwxkxk',
                author: 'alwxkxk',
                name: 'Three案例',
                name_en: 'Three Demo',
                openUrl: 'https://alwxkxk.github.io/threejs-example/',
                githubUrl: 'https://github.com/alwxkxk/threejs-example',
                image: FILE_HOST + 'images/alwxkxk.jpg'
            },

            {
                id: 'sxguojf',
                author: 'sxguojf',
                name: 'Three结合地图瓦片',
                name_en: 'Three MapTile',
                openUrl: 'https://sxguojf.github.io/three-tile-example/',
                githubUrl: 'https://github.com/sxguojf/three-tile',
                image: FILE_HOST + 'images/wangpengfei.jpg'
            },

            {
                id: 'bulang_cesium',
                author: 'AUTO',
                name: 'Cesium案例',
                name_en: 'Cesium Example',
                openUrl: 'https://tingyuxuan2302.github.io/cesium-vue3-vite/',
                githubUrl: 'https://github.com/tingyuxuan2302/cesium-vue3-vite',
                image: HOST + 'threeExamples/openSource/bulang_cesium.jpg'
            },

            {
                id: 'zhengjie9510',
                author: 'zhengjie9510',
                name: 'Cesium案例',
                name_en: 'Cesium Example',
                openUrl: 'https://zhengjie9510.github.io/webgis-demo',
                githubUrl: 'https://github.com/zhengjie9510/webgis-demo',
                image: FILE_HOST + 'images/zhengjie9510.jpg'
            },

            {
                id: 'quyinggang',
                name: 'Three学习案例',
                name_en: 'Three Study',
                author: 'AUTO',
                githubUrl: 'https://github.com/quyinggang/three3d',
                openUrl: 'https://quyinggang.github.io/three3d/',
                image: FILE_HOST + 'images/quyinggang.jpg'
            },
            {
                id: 'bosombaby',
                author: 'bosombaby',
                name: 'Three 案例',
                name_en: 'Three Examples',
                openUrl: 'https://product.vrteam.top/',
                githubUrl: 'https://github.com/bosombaby/web3d-product',
                image: FILE_HOST + 'images/bosombaby.jpg'
            },
            {
                id: 'pengfeiw',
                author: 'pengfeiw',
                name: '3d 案例',
                name_en: '3D Examples',
                githubUrl: 'https://github.com/pengfeiw/threejs-case',
                openUrl: 'https://pengfeiw.github.io/minicode/',
                image: HOST + 'threeExamples/openSource/wangpengfei.jpg'
            },

            {
                id: 'lpya',
                author: 'lpya',
                name: 'vue Three案例',
                name_en: 'Vue Three',
                openUrl: 'https://lpya.github.io/vue2-threejs-sefficacy',
                githubUrl: 'https://github.com/lpya/vue2-threejs-sefficacy',
                image: FILE_HOST + 'images/lpya.jpg'
            },
            {
                id: 'etudes',
                author: 'AUTO',
                name: 'Three案例',
                name_en: 'Three etudes',
                openUrl: 'https://boytchev.github.io/etudes/',
                githubUrl: 'https://github.com/boytchev/etudes',
                image: HOST + 'threeExamples/openSource/etudes.jpg'
            },
            {
                id: 'genuary',
                author: 'AUTO',
                name: 'Genuary 2022',
                githubUrl: 'https://github.com/spite/genuary-2022',
                openUrl: 'https://spite.github.io/genuary-2022/',
                image: HOST + 'threeExamples/openSource/genuary.jpg'
            },
            {
                id: 'threeLab',
                author: 'AUTO',
                name: 'ThreeLab',
                name_en: 'ThreeLab',
                githubUrl: 'https://github.com/lo-th/three.lab',
                openUrl: 'https://lo-th.github.io/three.lab/examples/#webgl_gpgpu_water',
                image: HOST + 'threeExamples/openSource/threelab.jpg'
            },
            {
                id: 'threejsProject',
                name: 'three_project',
                name_en: 'Three Project',
                author: 'AUTO',
                openUrl: 'https://syncopika.github.io/threejs-projects/',
                githubUrl: 'https://github.com/syncopika/threejs-projects',
                image: HOST + 'threeExamples/openSource/threejsProject.jpg'
            },
            {
                id: 'xiaolidan00',
                name: '三维案例',
                name_en: 'Three Examples',
                author: 'AUTO',
                githubUrl: 'https://github.com/xiaolidan00/my-earth',
                openUrl: 'https://xiaolidan00.github.io/my-earth',
                image: HOST + 'threeExamples/openSource/xiaolidan00.jpg',
            },
            {
                id: 'farazzshaikh',
                name: '3D 作品集',
                name_en: '3D Portfolio',
                author: 'AUTO',
                githubUrl: 'https://github.com/Faraz-Portfolio/',
                openUrl: 'https://farazzshaikh.com/demos',
                image: HOST + 'threeExamples/openSource/farazzshaikh.jpg',
            },
            {
                id: 'yuka',
                name: 'Three学习',
                name_en: 'Yuka Examples',
                author: 'AUTO',
                githubUrl: 'https://github.com/Mugen87/yuka',
                openUrl: 'https://mugen87.github.io/yuka/examples/',
                image: HOST + 'threeExamples/openSource/yuka.jpg',
            }
        ]
    },
    {
        pid: 'editor',
        name: '三维编辑',
        name_en: 'Three Editor',
        order: 20,
        children: [
            {
                id: 'shadowEditor',
                name: 'Three编辑器',
                name_en: 'ShadowEditor',
                author: 'AUTO',
                openUrl: 'https://tengge1.github.io/ShadowEditor-examples/',
                githubUrl: 'https://github.com/tengge1/ShadowEditor',
                image: HOST + 'threeExamples/openSource/shadowEditor.jpg'
            },
            {
                id: 'visEditor',
                name: 'vis-three编辑器',
                name_en: 'Vis Editor',
                author: 'AUTO',
                githubUrl: 'https://github.com/vis-three/scene-editor',
                openUrl: 'https://vis-three.github.io/scene-editor/',
                image: HOST + 'threeExamples/openSource/visThree.jpg'
            },
            {
                id: 'Astral3DEditor',
                name: 'Astral3D编辑器',
                name_en: 'Astral3DEditor',
                author: 'AUTO',
                githubUrl: 'https://github.com/mlt131220/Astral3DEditor',
                openUrl: 'https://editor.astraljs.com',
                image: HOST + 'threeExamples/openSource/Astral3DEditor.jpg'
            },
            {
                id: 'next3dEditor',
                name: 'Next3D编辑器',
                name_en: 'Next3D Editor',
                tag: 'Babylon',
                author: 'AUTO',
                links: [
                    {
                        name: '🏡官网',
                        url: 'http://babylonjsx.cn/home.html'
                    },
                    {
                        url: 'https://www.bilibili.com/video/BV1FGRfYGEAF',
                        name: '📺B站'
                    }
                ],
                openUrl: 'http://babylonjsx.cn/index.html?id=0064#/editor',
                referUrl: 'http://babylonjsx.cn/Next3DExample.html#postprocess_msaa',
                githubUrl: 'https://github.com/blueRaining/Next3D',
                image: HOST + 'threeExamples/other/next3dEditor.jpg'
            },

            {
                id: 'z2586300277_3d_editor',
                tag: TEXTS['编辑器'] + '-#795cddba',
                tip: '使用three.js开发的低代码组态易用的编辑器',
                name: '低代码组态编辑器',
                name_en: 'LowCode Editor',
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
                id: 'buildingEditor',
                name: '建筑编辑器(fiber)',
                name_en: 'BuildingEditor',
                author: 'AUTO',
                githubUrl: 'https://github.com/krystiandzirba/Rust-Base-Builder',
                openUrl: 'https://krystiandzirba.github.io/Rust-Base-Builder/',
                image: HOST + 'threeExamples/openSource/buildingEditor.jpg'
            },
            {
                id: 'chili3d',
                name: 'Chili3D-CAD',
                name_en: 'Chili3D-CAD',
                author: 'AUTO',
                openUrl: 'https://chili3d.com/',
                githubUrl: 'https://github.com/xiangechen/chili3d',
                image: HOST + 'threeExamples/openSource/chili3d.jpg'
            },
            {
                id: '3dmodelEdit',
                name: '3D模型编辑器',
                name_en: '3D Model Edit',
                author: 'AUTO',
                openUrl: 'http://threeflowx.cn/open/#/',
                referUrl: 'http://threeflowx.cn/',
                githubUrl: 'https://github.com/zhangbo126/threejs-3dmodel-edit',
                image: HOST + 'threeExamples/openSource/3dmodelEdit.jpg'
            },
            {
                id: 'pipeEditor',
                name: 'Pipe编辑器',
                author: 'AUTO',
                name_en: 'Pipe Editor',
                openUrl: 'https://editor.threepipe.org/',
                githubUrl: 'https://github.com/repalash/threepipe',
                referUrl: 'https://threepipe.org/',
                image: HOST + 'threeExamples/openSource/pipeEditor.jpg'
            },
            {
                id: 'thebrowserlab',
                name: 'R3F编辑器',
                name_en: 'ReactThree Editor',
                author: 'AUTO',
                openUrl: 'https://thebrowserlab.com/',
                githubUrl: 'https://github.com/icurtis1/thebrowserlab',
                image: HOST + 'threeExamples/openSource/thebrowserlab.jpg'
            },
            {
                id: 'meteor3d',
                name: 'Meteor3D编辑器',
                name_en: 'Meteor3D Editor',
                author: 'AUTO',
                githubUrl: 'https://github.com/nikonikoCW/Meteor3DEditor',
                openUrl: 'https://meteor3d.cn/',
                image: HOST + 'threeExamples/openSource/meteor3d.jpg'
            },
            {
                id: 'rezeStudio',
                name: 'Reze Studio',
                author: 'AUTO',
                githubUrl: 'https://github.com/AmyangXYZ/reze-studio',
                openUrl: 'https://reze-studio.vercel.app/',
                image: HOST + 'threeExamples/openSource/rezeStudio.jpg'
            },
            {
                id: 'pascalorg_editor',
                name: 'Pascalorg编辑器',
                name_en: 'Pascalorg Editor',
                author: 'AUTO',
                openUrl: 'https://editor.pascal.app/',
                githubUrl: 'https://github.com/pascalorg/editor',
                image: HOST + 'threeExamples/openSource/pascalorg_editor.jpg'
            }
        ]
    },
    {
        pid: 'threeMap',
        name: '三维地图',
        name_en: 'Three Map',
        gid: 'commonSeries',
        group: '常用系列',
        group_en: 'Common Series',
        order: 30,
        children: [
            {
                id: '3dGeoMap',
                name: '3D地图',
                name_en: '3D GeoMap',
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
                id: 'editorMap',
                name: '编辑器地图',
                name_en: 'Editor Map',
                author: 'z2586300277',
                htmlUrl: HOST + 'threeExamples/other/editorMap.html',
                githubUrl: 'https://github.com/z2586300277/three-editor',
                image: HOST + 'threeExamples/other/editorMap.jpg',
            },
            {
                id: 'editCoresMap',
                name: '编辑器内核地图',
                name_en: 'Editor Map',
                author: 'z2586300277',
                openUrl: 'https://z2586300277.github.io/threejs-editor/apply.html#/codeMirror?navigation=ThreeJS&classify=Basic&id=chartsMap',
                referUrl: 'https://z2586300277.github.io/threejs-editor/#/editor',
                githubUrl: 'https://github.com/z2586300277/threejs-editor',
                image: 'https://z2586300277.github.io/threejs-editor/demos/chartMap.png',
            },
            {
                id: 'levelMap',
                name: '分级地图',
                name_en: 'Level Map',
                author: 'z2586300277',
                openUrl: 'https://z2586300277.github.io/show-site/geoMap',
                image: HOST + 'threeExamples/other/levelMap.jpg',
            },
            {
                id: 'geoArea',
                name: '地理区域',
                name_en: 'Geo Area',
                author: 'AUTO',
                openUrl: 'https://z2586300277.github.io/show-site/geoArea/',
                githubUrl: 'https://github.com/Pakeyeo/temp-map',
                image: HOST + 'threeExamples/openSource/geoArea.jpg',
            },
            {
                id: "sc-datav",
                name: "四川3D地图",
                name_en: "SC DataV",
                author: "knight-L",
                openUrl: "https://knight-l.github.io/sc-datav/#/demo0",
                githubUrl: "https://github.com/knight-L/sc-datav",
                image: HOST + "threeExamples/openSource/scDatav.jpg",
            },
            {
                id: "heat3dMap",
                name: "热力3D地图",
                name_en: "Heat 3d Map",
                author: "knight-L",
                openUrl: "https://knight-l.github.io/sc-datav/#/demo1",
                githubUrl: "https://github.com/knight-L/sc-datav",
                image: HOST + "threeExamples/openSource/heat3dMap.jpg",
            },
            {
                id: 'threeMapv',
                name: '地图可视化',
                name_en: 'Map Visualization',
                author: 'AUTO',
                openUrl: 'https://g2657.github.io/examples-server/map3d/#/gdMap',
                githubUrl: 'https://github.com/wangscript007/ThreeMaps',
                image: 'https://raw.githubusercontent.com/wangscript007/ThreeMaps/refs/heads/main/images/1721032698514.jpg'
            }
        ]
    },
    {
        pid: 'threeCar',
        name: '汽车相关',
        name_en: 'Car Related',
        gid: 'commonSeries',
        group: '常用系列',
        group_en: 'Common Series',
        order: 30,
        children: [
            {
                id: 'su7peng',
                name: 'SU7-Vue3',
                name_en: 'SU7_Vue3',
                author: 'Pong-lei',
                openUrl: 'https://g2657.github.io/examples-server/su7_2/',
                githubUrl: 'https://github.com/Pong-lei/su7_imitate',
                image: HOST + 'threeExamples/openSource/su7peng.jpg'
            },
            {
                id: 'su7_three',
                name: '原生su7',
                name_en: 'SU7_vanilla',
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
                id: 'su7_replica',
                name: 'SU7-Replica',
                name_en: 'SU7 Replica',
                author: 'AUTO',
                openUrl: 'https://su7-replica.netlify.app/',
                githubUrl: 'https://github.com/alphardex/su7-replica',
                image: HOST + 'threeExamples/openSource/su7_replica.jpg'
            },
            {
                id: 'blanderCar',
                author: 'ASouthernCat',
                name: '硬核小车',
                name_en: 'Blender Car',
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
                id: 'kallkago_su7',
                tag: TEXTS.hot + '-#5f9be3',
                tip: 'SU7车展示案例，使用React+Three.js开发',
                name: 'su7-R3f',
                name_en: 'SU7-R3f',
                author: 'KallkaGo',
                openUrl: 'https://z2586300277.github.io/show-site/su7_demo/',
                githubUrl: 'https://github.com/KallkaGo/su7-demo',
                image: HOST + 'threeExamples/openSource/kallkago_su7.jpg'
            },
            {
                id: 'car911Show',
                name: '911车展示',
                name_en: 'Car 911 Show',
                author: 'AUTO',
                openUrl: 'https://totorozuo.github.io/3d-car-showcase/',
                githubUrl: 'https://github.com/TotoroZuo/3d-car-showcase',
                image: HOST + 'threeExamples/openSource/car911Show.jpg',
            },
            {
                id: 'paintCar',
                name: '汽车911',
                name_en: 'Car Paint',
                author: 'AUTO',
                openUrl: 'https://faraz-portfolio.github.io/demo-2025-car-paint/',
                githubUrl: 'https://github.com/Faraz-Portfolio/demo-2025-car-paint',
                image: HOST + 'threeExamples/openSource/paintCar.jpg',
            },
            {
                id: 'carShowReact',
                name: '汽车展示',
                name_en: 'Car Show(React)',
                author: 'AUTO',
                openUrl: 'https://nik-car-show.netlify.app/',
                githubUrl: 'https://github.com/n1k02/three-js-projects',
                image: HOST + 'threeExamples/openSource/carShowReact.jpg',
            }
        ]
    },
    {
        pid: 'threeEarth',
        name: '三维地球',
        name_en: 'Three Earth',
        gid: 'commonSeries',
        group: '常用系列',
        group_en: 'Common Series',
        order: 30,
        children: [
            {
                id: '3dEarth',
                name: '3D地球',
                name_en: '3D Earth',
                author: 'RainManGO',
                openUrl: 'https://z2586300277.github.io/show-site/3dEarth/',
                githubUrl: 'https://github.com/RainManGO/3d-earth',
                image: FILE_HOST + 'images/3dEarth.png'
            },
            {
                id: '3dEarth2',
                name: '虚幻地球',
                name_en: 'Unreal Earth',
                author: 'GhostCatcg',
                openUrl: 'https://z2586300277.github.io/show-site/3dEarth2/',
                githubUrl: 'https://github.com/GhostCatcg/3d-earth',
                image: HOST + 'threeExamples/openSource/3dEarth2.jpg'
            },
            {
                id: 'fogEarth',
                name: '雾地球',
                name_en: 'Fog Earth',
                author: 'AUTO',
                openUrl: 'https://dgreenheck.github.io/threejs-procedural-planets/',
                githubUrl: 'https://github.com/dgreenheck/threejs-procedural-planets',
                image: HOST + 'threeExamples/openSource/fogEarth.jpg'
            },
            {
                id: 'numberEarth',
                name: '数字地球',
                name_en: 'Number Earth',
                author: 'AUTO',
                openUrl: 'https://jackgit.github.io/xplan/',
                githubUrl: 'https://github.com/JackGit/xplan',
                image: HOST + 'threeExamples/openSource/numberEarth.jpg'
            },
            {
                id: 'geoGlobe',
                name: '地理球体',
                name_en: 'Geo Globe',
                author: 'AUTO',
                openUrl: 'https://gkjohnson.github.io/three-geojson/example/bundle/globe.html',
                githubUrl: 'https://github.com/gkjohnson/three-geojson',
                image: HOST + 'threeExamples/openSource/geoGlobe.jpg'
            },
            {
                id: 'flightsTracker',
                name: '航班追踪',
                name_en: 'Flights Tracker',
                author: 'AUTO',
                openUrl: 'https://jeantimex.github.io/flights-tracker/',
                githubUrl: 'https://github.com/jeantimex/flights-tracker',
                image: HOST + 'threeExamples/openSource/flightsTracker.jpg'
            },
            {
                id: 'globeGL',
                name: 'Globe.GL地球',
                name_en: 'Globe.GL',
                author: 'AUTO',
                tip: '基于Three.js的交互式地球可视化库',
                openUrl: 'https://globe.gl/',
                githubUrl: 'https://github.com/vasturiano/globe.gl',
                image: HOST + 'threeExamples/openSource/globeGL.jpg'
            }
        ]

    },
    {
        pid: 'digitalTwin',
        name: '数字孪生',
        name_en: 'digitalTwin',
        order: 40,
        children: [
            {
                id: 'digitalFarm',
                name: '智慧农场',
                name_en: 'digitalFarm',
                author: 'AUTO',
                githubUrl: 'https://github.com/gyrate/digitalFarm',
                openUrl: 'https://gyrate.github.io/digitalFarm/dist/index.html',
                image: HOST + 'threeExamples/openSource/digitalFarm.jpg'
            },
            {
                id: 'digitalTraffic',
                name: '数字交通',
                name_en: 'Digital Traffic',
                author: 'AUTO',
                githubUrl: 'https://github.com/gyrate/digitalTraffic',
                openUrl: 'https://gyrate.github.io/digitalTraffic/dist/index.html#/index',
                image: HOST + 'threeExamples/openSource/digitalTraffic.jpg'
            },
            {
                id: 'StationMonitor',
                name: '站点监控',
                name_en: 'Station Monitor',
                author: 'AUTO',
                openUrl: 'https://fengtianxi001.github.io/MF-StationMonitor/',
                githubUrl: 'https://github.com/fengtianxi001/MF-StationMonitor',
                image: HOST + 'threeExamples/openSource/StationMonitor.jpg'
            },
            {
                id: 'feng_ji',
                name: '风机',
                name_en: 'Wind Turbine',
                author: 'AUTO',
                openUrl: 'https://fengtianxi001.github.io/MF-TurbineMonitor',
                githubUrl: 'https://github.com/fengtianxi001/MF-TurbineMonitor',
                image: FILE_HOST + 'images/fengji.jpg'
            },
            {
                id: 'numberFram',
                name: '数字农场',
                name_en: 'Number Fram',
                author: 'FFMMCC',
                githubUrl: 'https://gitee.com/fu-meichuan/digital-farmland',
                openUrl: 'https://coderfmc.github.io/three.js-demo/digital-farmland/#/carbon-neutral-bigscreen',
                image: 'https://coderfmc.github.io/three.js-demo/fmc-web-3d/img/智慧农田.png'
            },
            {
                id: 'MF-GisMonitor',
                name: 'GIS监控',
                name_en: 'GIS Monitor',
                author: 'AUTO',
                openUrl: 'https://fengtianxi001.github.io/MF-GisMonitor',
                githubUrl: 'https://github.com/fengtianxi001/MF-GisMonitor',
                image: HOST + 'threeExamples/openSource/gisMonitor.jpg'
            },
            {
                id: 'MF-ShipMonitor',
                name: '船只监控',
                name_en: 'Ship Monitor',
                author: 'AUTO',
                openUrl: 'https://fengtianxi001.github.io/MF-ShipMonitor',
                githubUrl: 'https://github.com/fengtianxi001/MF-ShipMonitor',
                image: HOST + 'threeExamples/openSource/shipMonitor.jpg'
            }
        ]
    },
    {
        pid: 'gameExamples',
        name: '游戏案例',
        name_en: 'Game Examples',
        order: 45,
        children: [
            {
                id: 'snakeGame',
                name: '贪吃蛇',
                name_en: 'Snake Game',
                openUrl: 'https://z2586300277.github.io/show-site/snake/',
                githubUrl: 'https://github.com/rock-biter/three-snake-live',
                image: HOST + 'threeExamples/openSource/snakeGame.jpg'
            },
            {
                id: 'Sketchbook',
                author: 'AUTO',
                name: '飞车',
                name_en: 'flying car',
                githubUrl: 'https://github.com/swift502/Sketchbook',
                openUrl: 'https://jblaha.art/sketchbook/0.4/',
                image: HOST + 'threeExamples/openSource/sketchbook.jpg'
            },
            {
                id: 'flyBy',
                name: '飞行漫游',
                name_en: 'Fly By',
                author: 'AUTO',
                githubUrl: 'https://github.com/jessehhydee/fly-by',
                openUrl: 'https://hydeit.co/fly-by/',
                image: HOST + 'threeExamples/openSource/flyBy.jpg'
            },
            {
                id: '3dcity',
                name: '3D城市',
                name_en: '3D City',
                author: 'AUTO',
                githubUrl: 'https://github.com/lo-th/3d.city',
                openUrl: 'https://lo-th.github.io/3d.city/index.html',
                image: HOST + 'threeExamples/openSource/3dcity.jpg'
            },
            {
                id: 'phy',
                name: '小物理游戏',
                name_en: 'Physics Game',
                author: 'AUTO',
                openUrl: 'https://lo-th.github.io/phy/',
                githubUrl: 'https://github.com/lo-th/phy',
                image: HOST + 'threeExamples/openSource/phy.jpg'
            },
            {
                id: 'threejsZombieshooter',
                name: '僵尸射击游戏',
                name_en: 'Zombie Shooter',
                author: 'AUTO',
                githubUrl: 'https://github.com/RohanVashisht1234/threejs-zombieshooter-game',
                openUrl: 'https://www.zombiestrike.monster/',
                image: HOST + 'threeExamples/openSource/threejsZombieshooter.jpg',
            },
            {
                id: 'CrossRoad',
                name: '过马路',
                name_en: 'Cross Road',
                author: 'AUTO',
                githubUrl: 'https://github.com/hexianWeb/CrossRoad',
                openUrl: 'https://cross-road-eight.vercel.app/',
                image: 'https://github.com/hexianWeb/CrossRoad/raw/main/cover2.png',
            },
            {
                id: 'cubeCity',
                name: '方块城市',
                name_en: 'Cube City',
                author: 'AUTO',
                openUrl: 'https://cube-city.vercel.app/',
                githubUrl: 'https://github.com/hexianWeb/CubeCity',
                image: 'https://raw.githubusercontent.com/hexianWeb/CubeCity/refs/heads/big-simcity/README/游玩时动图.gif',
            },
            {
                id: 'room3d',
                name: '3D房间',
                name_en: 'Room 3D',
                author: 'AUTO',
                githubUrl: 'https://github.com/brunosimon/my-room-in-3d/',
                openUrl: 'https://my-room-in-3d.vercel.app/',
                image: HOST + 'threeExamples/openSource/room3d.jpg',
            },
            {
                id: 'jokebearPark',
                name: 'Jokebear公园',
                name_en: 'Jokebear Park',
                author: 'AUTO',
                githubUrl: 'https://github.com/yuwuweichun/jokebear-park',
                openUrl: 'https://yuwuweichun.github.io/jokebear-park/',
                image: 'https://raw.githubusercontent.com/yuwuweichun/jokebear-park/refs/heads/main/media/og-image.webp',
            },
            {
                id: 'portal',
                name: '传送门',
                name_en: 'Portal',
                author: 'AUTO',
                githubUrl: 'https://github.com/MisterPrada/portal',
                openUrl: 'https://portal.misterprada.com/',
                image: 'https://user-images.githubusercontent.com/8146111/257077594-eb445650-c662-412f-8cf5-662b76c27057.gif'
            },
            {
                id: 'threePlayerController',
                name: '玩家控制器',
                name_en: 'Player Controller',
                author: 'AUTO',
                openUrl: 'https://hh-hang.github.io/three-player-controller/',
                githubUrl: 'https://github.com/hh-hang/three-player-controller',
                image: HOST + 'threeExamples/openSource/threePlayerController.jpg'
            },
            {
                id: 'rubiksCube',
                name: '魔方',
                name_en: 'Rubiks Cube',
                author: 'AUTO',
                githubUrl: 'https://github.com/Junhong-Chen/rubiks-cube',
                openUrl: 'https://junhong-chen.github.io/rubiks-cube/',
                image: HOST + 'threeExamples/openSource/rubiksCube.jpg'
            }
        ]
    },
    {
        pid: 'advancedExamples',
        name: '高级案例',
        name_en: 'Advanced Examples',
        order: 50,
        children: [
            {
                id: 'taohuating',
                name: '桃花亭',
                name_en: 'TaoHuaTing',
                author: 'huan_meng_hai_yan',
                openUrl: 'https://z2586300277.github.io/show-site/TaoHuaTing',
                downloadUrl: 'https://z2586300277.github.io/show-site/TaoHuaTing/TaoHuaTing.zip',
                image: HOST + 'threeExamples/openSource/taohuating.jpg'
            },
            {
                id: 'ziTengHua',
                name: '紫藤花',
                name_en: 'ZiTengHua',
                author: 'huan_meng_hai_yan',
                openUrl: 'https://g2657.github.io/examples-server/ziTenghua/',
                downloadUrl: 'https://g2657.github.io/examples-server/ziTenghua/ziTenghua.zip',
                image: HOST + 'threeExamples/openSource/ziTengHua.jpg'
            },
            {
                id: 'customEffect',
                name: '自定义后期处理(r3f)',
                name_en: 'Custom Effect',
                tag: TEXTS.effect,
                tip: '基于react-three-fiber 制作的自定义后期处理效果',
                author: 'KallkaGo',
                openUrl: 'https://z2586300277.github.io/show-site/customEffect/',
                githubUrl: 'https://github.com/KallkaGo/CustomEffect',
                image: 'https://z2586300277.github.io/show-site/customEffect/customEffect.jpg'
            },
            {
                id: 'cartoon-grass',
                name: '卡通草地',
                name_en: 'cartoon grass',
                author: 'KallkaGo',
                githubUrl: 'https://github.com/KallkaGo/Grass',
                openUrl: 'https://grass-sooty.vercel.app/',
                image: HOST + 'threeExamples/openSource/cartoon-grass.jpg'
            },
            {
                id: '3dAssests',
                name: '3D资源库',
                name_en: '3D Assests',
                author: 'AUTO',
                openUrl: 'https://boytchev.github.io/3d-assets/',
                githubUrl: 'https://github.com/boytchev/3d-assets',
                image: HOST + 'threeExamples/openSource/3dAssests.jpg'
            },
            {
                id: '3dPointsModel',
                name: '3D点云模型',
                name_en: '3DPoints Model',
                author: 'youngdro',
                openUrl: 'https://g2657.github.io/examples-server/3DPoints/',
                githubUrl: 'https://github.com/youngdro/3DPoints',
                image: HOST + 'threeExamples/openSource/3dPointsModel.jpg',
                downloadUrl: 'https://g2657.github.io/examples-server/3DPoints/3DPoints.zip'
            },
            {
                id: 'threePerson',
                name: '第三人称控制',
                name_en: 'Third Person',
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
                name_en: 'Smart City',
                author: '193Eric',
                openUrl: ' https://g2657.github.io/examples-server/smartCity/demo/',
                githubUrl: 'https://github.com/193Eric/threejs-demo',
                downloadUrl: 'https://g2657.github.io/examples-server/smartCity/smartCity.zip',
                image: HOST + 'threeExamples/openSource/smartCity.jpg'
            },

            {
                id: 'roaming',
                author: 'AUTO',
                name: '漫游模拟器',
                name_en: 'Roaming',
                githubUrl: 'https://github.com/Junhong-Chen/roaming-simulator',
                openUrl: 'https://junhong-chen.github.io/roaming-simulator/',
                image: HOST + 'threeExamples/openSource/roaming.jpg'
            },

            {
                id: 'dissovles',
                author: 'AUTO',
                name: '溶解效果',
                name_en: 'Dissovles',
                openUrl: 'https://z2586300277.github.io/show-site/dissolve/',
                githubUrl: 'https://github.com/JatinChopra/Dissolve-Effect',
                image: HOST + 'threeExamples/openSource/dissolves.jpg'
            },

            {
                id: 'realWater',
                author: 'AUTO',
                name: '真实水效果',
                name_en: 'Real Water',
                githubUrl: 'https://github.com/martinRenou/threejs-water',
                openUrl: 'https://martinrenou.github.io/threejs-water/',
                image: HOST + 'threeExamples/openSource/realWater.jpg',
            },
            {
                id: 'vrHall',
                author: 'AUTO',
                name: 'VR展厅',
                name_en: 'VR Hall',
                githubUrl: 'https://github.com/mtsee/vr-hall',
                openUrl: 'http://test4.h5ds.com/',
                image: HOST + 'threeExamples/openSource/vr.jpg',
            },
            {
                id: 'music_wobble',
                name: '3D音乐 (简化)',
                name_en: 'Music Wobble',
                author: 'AUTO',
                githubUrl: 'https://github.com/d3ttl4ff/music-wobble',
                openUrl: 'https://z2586300277.github.io/show-site/music_wobble',
                downloadUrl: 'https://z2586300277.github.io/show-site/music_wobble/source.zip',
                image: HOST + 'threeExamples/openSource/music_wobble.jpg',
            },

            {
                id: 'small_island',
                author: 'AUTO',
                name: '小岛',
                name_en: 'Small Island',
                githubUrl: 'https://github.com/alezen9/unshaken',
                openUrl: 'https://alezen9.github.io/unshaken/',
                image: HOST + 'threeExamples/openSource/small_island.jpg'
            },
            {
                id: 'threejs-image-gallery',
                name: '图片画廊',
                name_en: 'Image Gallery',
                author: 'AUTO',
                githubUrl: 'https://github.com/dgreenheck/threejs-image-gallery',
                openUrl: 'https://dgreenheck.github.io/threejs-image-gallery/',
                image: HOST + 'threeExamples/openSource/threejs-image-gallery.jpg'
            },
            {
                id: 'ezTree',
                name: '树',
                name_en: 'Tree',
                author: 'AUTO',
                openUrl: 'https://www.eztree.dev/',
                githubUrl: 'https://github.com/dgreenheck/ez-tree',
                image: HOST + 'threeExamples/openSource/ezTree.jpg'
            },
            {
                id: 'noise_gird',
                name: '噪声网格',
                name_en: 'Noise Grid',
                author: 'AUTO',
                githubUrl: 'https://github.com/AadarshGupta07/noise-grid',
                openUrl: 'https://z2586300277.github.io/show-site/nosie_gird/',
                image: HOST + 'threeExamples/openSource/noise_gird.jpg'
            },
            {
                id: 'cheapwater',
                name: '交互水效果',
                name_en: 'Cheap Water',
                author: 'AUTO',
                openUrl: 'https://mqnc.github.io/cheapwater/',
                githubUrl: 'https://github.com/mqnc/cheapwater',
                image: HOST + 'threeExamples/openSource/cheapwater.jpg'
            },
            {
                id: 'threeCSGMesh',
                name: 'CSG网格',
                name_en: 'CSG Mesh',
                author: 'AUTO',
                links: [
                    {
                        name: 'npm',
                        url: 'https://www.npmjs.com/package/three-csg-ts'
                    }
                ],
                githubUrl: 'https://github.com/manthrax/THREE-CSGMesh',
                openUrl: 'https://manthrax.github.io/THREE-CSGMesh/demos/CSGDemo.html',
                image: HOST + 'threeExamples/openSource/threeCSGMesh.jpg'
            },
            {
                id: 'musicParticle',
                name: '音乐粒子',
                name_en: 'Music Particle',
                author: 'AUTO',
                githubUrl: 'https://github.com/najafmohammed/muon-music-visualizer',
                openUrl: 'https://muon-vis.netlify.app/',
                image: HOST + 'threeExamples/openSource/musicParticle.jpg'
            },
            {
                id: 'driverCar',
                name: '驾驶模拟',
                name_en: 'Driver Car',
                author: 'AUTO',
                openUrl: 'https://mattbradley.github.io/dash/',
                githubUrl: 'https://github.com/mattbradley/dash',
                image: HOST + 'threeExamples/openSource/driverCar.jpg'
            },
            {
                id: '3d-portfolio',
                name: '3D Portfolio',
                author: 'AUTO',
                githubUrl: 'https://github.com/TomasGonzalez/3d-portfolio',
                openUrl: 'https://tomasgonzalez.github.io/3d-portfolio/',
                image: HOST + 'threeExamples/openSource/3d-portfolio.jpg'
            },

            {
                id: 'octreeDemo',
                name: '八叉树',
                name_en: 'Octree',
                author: 'AUTO',
                openUrl: 'https://eriksom.github.io/threejs-octree/dist/example/',
                githubUrl: 'https://github.com/ErikSom/threejs-octree',
                image: HOST + 'threeExamples/physics/octreeDemo.jpg'
            },
            {
                id: 'CollisionRoaming',
                name: '八叉树碰撞漫游',
                name_en: 'Collision Roaming',
                author: 'AUTO',
                openUrl: 'https://z2586300277.github.io/show-site/octreeMap/',
                githubUrl: 'https://github.com/Aizener/three-template',
                image: HOST + 'threeExamples/openSource/CollisionRoaming.jpg'
            },
            {
                id: 'fire',
                name: '烟花',
                name_en: 'fire',
                author: 'AUTO',
                openUrl: 'https://z2586300277.github.io/show-site/fire/',
                githubUrl: 'https://github.com/manthrax/atos',
                downloadUrl: 'https://z2586300277.github.io/show-site/fire/fire.zip',
                image: HOST + 'threeExamples/openSource/fire.jpg'
            },
            {
                id: 'waterBall',
                name: '水球',
                name_en: 'Water Ball',
                author: 'AUTO',
                openUrl: 'https://waterball.netlify.app/',
                githubUrl: 'https://github.com/matsuoka-601/waterball',
                image: HOST + 'threeExamples/openSource/waterBall.jpg'
            },
            {
                id: 'sky-cloud-3d',
                name: '天空云',
                name_en: 'Sky Cloud',
                author: 'AUTO',
                githubUrl: 'https://github.com/xiaxiangfeng/sky-cloud-3d',
                openUrl: 'https://home.annibao.top/sky-cloud-3d/threejs-sky-clouds.html',
                image: HOST + 'threeExamples/openSource/sky-cloud-3d.jpg'
            },
            {
                id: 'waterShader',
                name: '水效果',
                name_en: 'Water Shader',
                author: 'AUTO',
                githubUrl: 'https://github.com/dgreenheck/threejs-water-shader',
                openUrl: 'https://dgreenheck.github.io/threejs-water-shader/',
                image: HOST + 'threeExamples/openSource/threejs-water-shader.jpg'
            },

            {
                id: 'threejs-caustics',
                name: '水波纹',
                name_en: 'Caustics',
                author: 'AUTO',
                githubUrl: 'https://github.com/martinRenou/threejs-caustics',
                openUrl: 'https://martinRenou.github.io/threejs-caustics/',
                image: HOST + 'threeExamples/openSource/threejs-caustics.jpg'
            },
            {
                id: 'autopilot',
                name: '自动驾驶',
                name_en: 'Autopilot',
                author: 'AUTO',
                referUrl: 'https://juejin.cn/column/7338674902280650779',
                openUrl: 'https://z2586300277.github.io/show-site/autopilot/',
                githubUrl: 'https://github.com/GitHubJackson/autopilot',
                image: HOST + 'threeExamples/openSource/autopilot.jpg'
            },
            {
                id: 'steve245270533Gallery',
                name: '3D画廊',
                name_en: '3D Gallery',
                author: 'AUTO',
                openUrl: 'https://steve245270533.github.io/gallery/',
                githubUrl: 'https://github.com/Steve245270533/gallery',
                image: HOST + 'threeExamples/openSource/steve245270533Gallery.jpg'
            },
            {
                id: 'fullik',
                name: '逆动力学',
                name_en: 'Fullik',
                author: 'AUTO',
                openUrl: 'https://lo-th.github.io/fullik/',
                githubUrl: 'https://github.com/lo-th/fullik',
                image: HOST + 'threeExamples/openSource/fullik.jpg'
            },
            {
                id: 'rain_puddle',
                name: '雨水积水效果',
                name_en: 'Rain Puddle Effect',
                author: 'AUTO',
                githubUrl: 'https://github.com/Faraz-Portfolio/demo-2023-rain-puddle',
                openUrl: 'https://faraz-portfolio.github.io/demo-2023-rain-puddle/',
                image: HOST + 'threeExamples/openSource/rain_puddle.jpg'
            },
            {
                id: 'three-shader-baker',
                name: '着色器烘焙',
                name_en: 'Shader Baker',
                author: 'AUTO',
                openUrl: 'https://farazzshaikh.github.io/three-shader-baker/',
                githubUrl: 'https://github.com/FarazzShaikh/three-shader-baker',
                image: HOST + 'threeExamples/openSource/three-shader-baker.jpg'
            },
            {
                id: 'Terrain',
                name: '地形生成',
                name_en: 'Terrain',
                author: 'AUTO',
                githubUrl: 'https://github.com/IceCreamYou/THREE.Terrain',
                openUrl: 'https://icecreamyou.github.io/THREE.Terrain/',
                image: HOST + 'threeExamples/openSource/Terrain.jpg'
            },
            {
                id: 'FluffyGrass',
                name: '草地',
                name_en: 'Fluffy Grass',
                author: 'AUTO',
                githubUrl: 'https://github.com/thebenezer/FluffyGrass',
                openUrl: 'https://fluffygrass.vercel.app/',
                image: HOST + 'threeExamples/openSource/FluffyGrass.jpg'
            },
            {
                id: 'enhance-shader-lighting',
                name: '增强着色器光照',
                name_en: 'Enhance Shader Lighting',
                author: 'AUTO',
                githubUrl: 'https://github.com/0beqz/enhance-shader-lighting',
                openUrl: 'https://enhance-shader-lighting.vercel.app/',
                image: 'https://raw.githubusercontent.com/0beqz/enhance-shader-lighting/main/example/public/screenshots/gym.webp'
            },
            {
                id: 'X-Ray-Visualizer-Threejs',
                name: 'X光视觉',
                name_en: 'X-Ray Visualizer',
                author: 'AUTO',
                openUrl: 'https://x-ray-visualizer-threejs-yh19.vercel.app/',
                githubUrl: 'https://github.com/J0SUKE/X-Ray-Visualizer-Threejs',
                image: HOST + 'threeExamples/openSource/X-Ray-Visualizer-Threejs.jpg'
            },
            {
                id: 'interactive-shield',
                name: '交互式护盾',
                name_en: 'Interactive Shield',
                author: 'AUTO',
                githubUrl: 'https://github.com/bhushan6/interactive-shield',
                openUrl: 'https://interactive-shield.vercel.app/',
                image: HOST + 'threeExamples/openSource/interactive-shield.jpg'
            },
            {
                id: 'm-trust',
                name: 'M-Trust',
                name_en: 'M-Trust',
                author: 'Pong-lei',
                githubUrl: 'https://github.com/Pong-lei/m-trust',
                openUrl: 'https://m-trust.vercel.app/',
                image: HOST + 'threeExamples/openSource/m-trust.jpg'
            },
            {
                id: 'three-plateau-tps',
                name: '三维地形TPS',
                name_en: 'Three Plateau TPS',
                author: 'AUTO',
                githubUrl: 'https://github.com/satoshi7190/three-plateau-tps',
                openUrl: 'https://satoshi7190.github.io/three-plateau-tps/',
                image: 'https://raw.githubusercontent.com/satoshi7190/three-plateau-tps/refs/heads/main/image.jpg'
            },
            {
                id: 'isgalaxias',
                name: '星系模拟',
                name_en: 'Isgalaxias',
                author: 'AUTO',
                openUrl: 'https://isgalaxias.vercel.app/',
                githubUrl: 'https://github.com/hexianWeb/isgalaxias',
                image: 'https://raw.githubusercontent.com/hexianWeb/isgalaxias/refs/heads/big-star-vue/TD/page.png'
            },
            {
                id: 'jumpflood-demo',
                name: '描边特效',
                name_en: 'Jump Flooding Demo',
                author: 'AUTO',
                githubUrl: 'https://github.com/gkjohnson/three-jumpflood-demo',
                openUrl: 'https://gkjohnson.github.io/three-jumpflood-demo/',
                image: 'https://raw.githubusercontent.com/gkjohnson/three-jumpflood-demo/main/banner.png'
            },
            {
                id: 'cyber-ocean',
                name: '赛博海洋',
                name_en: 'Cyber Ocean',
                author: 'AUTO',
                openUrl: 'https://cyber-ocean.vercel.app/',
                githubUrl: 'https://github.com/SahilK-027/Cyber-Ocean',
                image: 'https://raw.githubusercontent.com/SahilK-027/Cyber-Ocean/refs/heads/main/PREVIEW.png'

            },
            {
                id: 'three-video-projection',
                name: '视频投影',
                name_en: 'Video Projection',
                author: "AUTO",
                githubUrl: 'https://github.com/hh-hang/three-video-projection',
                openUrl: 'https://hh-hang.github.io/three-video-projection/',
                image: 'https://raw.githubusercontent.com/hh-hang/three-video-projection/main/example/public/imgs/2.gif'
            },
            {
                id: 'spotify-visualiser',
                name: 'Spotify可视化',
                name_en: 'Spotify Visualiser',
                author: 'AUTO',
                openUrl: 'https://spotify-visualiser-three.vercel.app/',
                githubUrl: 'https://github.com/J0SUKE/spotify-visualiser',
                image: HOST + 'threeExamples/openSource/spotify-visualiser.jpg'
            },
            {
                id: 'roomDesigner',
                name: '3D房间设计器',
                name_en: '3D Room Designer',
                author: 'AUTO',
                githubUrl: 'https://github.com/CodeHole7/threejs-3d-room-designer',
                openUrl: 'https://threejs-room-configurator.netlify.app/',
                image: HOST + 'threeExamples/openSource/roomDesigner.jpg'
            },
            {
                id: 'three-good-godrays',
                name: '丁达尔光效果',
                name_en: 'Godrays Effect',
                author: 'AUTO',
                githubUrl: 'https://github.com/Ameobea/three-good-godrays',
                openUrl: 'https://three-good-godrays.ameo.design/',
                image: HOST + 'threeExamples/openSource/three-good-godrays.jpg'
            },
            {
                id: 'robot-arm-sim',
                name: '机械臂模拟',
                name_en: 'Robot Arm Sim',
                author: 'AUTO',
                openUrl: 'https://robot-arm-sim.vercel.app/',
                githubUrl: 'https://github.com/ASouthernCat/robot-arm-sim',
                image: 'https://raw.githubusercontent.com/ASouthernCat/robot-arm-sim/main/preview.png'
            },
            {
                id: 'Elemental-Serenity',
                name: '元素宁静',
                name_en: 'Elemental Serenity',
                author: 'AUTO',
                githubUrl: 'https://github.com/SahilK-027/Elemental-Serenity',
                openUrl: 'https://elemental-serenity.vercel.app/',
                image: 'https://raw.githubusercontent.com/SahilK-027/Sahilk-027/main/assets/thumbs/project-14.webp'
            },
            {
                id: 'lightning-vfx',
                name: '闪电特效',
                name_en: 'Lightning VFX',
                author: 'AUTO',
                githubUrl: 'https://github.com/SahilK-027/Lightning-VFX',
                openUrl: 'https://lightning-vfx.vercel.app/',
                image: 'https://raw.githubusercontent.com/SahilK-027/Sahilk-027/main/assets/thumbs/project-20.webp'
            },
            {
                id: 'glsl-curl-noise',
                name: '卷曲噪声',
                name_en: 'Curl Noise',
                author: 'AUTO',
                githubUrl: 'https://github.com/SahilK-027/glsl-curl-noise',
                openUrl: 'https://glsl-curl-noise.vercel.app/',
                image: 'https://raw.githubusercontent.com/SahilK-027/Sahilk-027/main/assets/thumbs/project-19.webp'
            },
            {
                id: 'the-erdtree',
                name: '黄金树',
                name_en: 'The Erdtree',
                author: 'AUTO',
                githubUrl: 'https://github.com/SahilK-027/The-Erdtree',
                openUrl: 'https://the-erdtree.vercel.app/',
                image: 'https://raw.githubusercontent.com/SahilK-027/Sahilk-027/main/assets/thumbs/project-18.webp'
            },
            {
                id: 'digital-brain',
                name: '数字大脑',
                name_en: 'Digital Brain',
                author: 'AUTO',
                githubUrl: 'https://github.com/SahilK-027/Digital-Brain',
                openUrl: 'https://digital-brain-sk.vercel.app/',
                image: 'https://raw.githubusercontent.com/SahilK-027/Sahilk-027/main/assets/thumbs/project-17.webp'
            },
            {
                id: 'crystal-bird',
                name: '水晶鸟',
                name_en: 'Crystal Bird',
                author: 'AUTO',
                githubUrl: 'https://github.com/SahilK-027/Crystal-Bird',
                openUrl: 'https://crystal-bird.vercel.app/',
                image: 'https://raw.githubusercontent.com/SahilK-027/Sahilk-027/main/assets/thumbs/project-15.webp'
            },
            {
                id: 'celestial-drift',
                name: '天体漂流',
                name_en: 'Celestial Drift',
                author: 'AUTO',
                githubUrl: 'https://github.com/SahilK-027/Celestial-Drift',
                openUrl: 'https://celestial-drift.vercel.app/',
                image: 'https://raw.githubusercontent.com/SahilK-027/Sahilk-027/main/assets/thumbs/project-13.webp'
            },
            {
                id: 'space-distortion',
                name: '空间扭曲',
                name_en: 'Space Distortion',
                author: 'AUTO',
                githubUrl: 'https://github.com/SahilK-027/0x7444ff/tree/main/space-distortion',
                openUrl: 'https://space-distortion-sk027.vercel.app/',
                image: 'https://raw.githubusercontent.com/SahilK-027/Sahilk-027/main/assets/thumbs/project-12.webp'
            },
            {
                id: 'iron-man-hologram',
                name: '全息投影',
                name_en: 'Holograms',
                author: 'AUTO',
                githubUrl: 'https://github.com/SahilK-027/0x7444ff/tree/main/iron-man-hologram',
                openUrl: 'https://iron-man-sk027.vercel.app/',
                image: 'https://raw.githubusercontent.com/SahilK-027/Sahilk-027/main/assets/thumbs/project-11.webp'
            },
            {
                id: 'gpgpu-particles',
                name: 'GPGPU粒子',
                name_en: 'GPGPU Particles',
                author: 'AUTO',
                githubUrl: 'https://github.com/SahilK-027/0x7444ff/tree/main/particles-GPGPU',
                openUrl: 'https://particles-gpgpu-sk027.vercel.app/',
                image: 'https://raw.githubusercontent.com/SahilK-027/Sahilk-027/main/assets/thumbs/project-10.webp'
            },
            {
                id: 'perlin-pattern',
                name: '柏林噪声图案',
                name_en: 'Perlin Pattern',
                author: 'AUTO',
                githubUrl: 'https://github.com/SahilK-027/0x7444ff/tree/main/perlin-noise-advanced-abstract-pattern',
                openUrl: 'https://0x7444ff-perlin-noise-advanced-abstract-pattern.vercel.app/',
                image: 'https://raw.githubusercontent.com/SahilK-027/Sahilk-027/main/assets/thumbs/project-9.webp'
            },
            {
                id: 'frosted-canvas',
                name: '磨砂画布',
                name_en: 'Frosted Canvas',
                author: 'AUTO',
                githubUrl: 'https://github.com/SahilK-027/Frosted-Canvas',
                openUrl: 'https://frosted-canvas.vercel.app/',
                image: 'https://raw.githubusercontent.com/SahilK-027/Sahilk-027/main/assets/thumbs/project-8.webp'
            },
            {
                id: 'sahilk-minecraft',
                name: '我的世界',
                name_en: 'Minecraft',
                author: 'AUTO',
                githubUrl: 'https://github.com/SahilK-027/My-Minecraft',
                openUrl: 'https://minecraft-sahilk.vercel.app/',
                image: 'https://raw.githubusercontent.com/SahilK-027/Sahilk-027/main/assets/thumbs/project-7.webp'
            },
            {
                id: 'neon-christmas',
                name: '霓虹圣诞',
                name_en: 'Neon Christmas',
                author: 'AUTO',
                githubUrl: 'https://github.com/SahilK-027/neon-christmas',
                openUrl: 'https://neon-christmas-sk027.vercel.app/',
                image: 'https://raw.githubusercontent.com/SahilK-027/Sahilk-027/main/assets/thumbs/project-6.webp'
            },
            {
                id: 'hello-world-r3f',
                name: 'Hello World',
                name_en: 'Hello World',
                author: 'AUTO',
                githubUrl: 'https://github.com/SahilK-027/hello-world-r3f',
                openUrl: 'https://sk027v2.vercel.app/',
                image: 'https://raw.githubusercontent.com/SahilK-027/Sahilk-027/main/assets/thumbs/project-5.webp'
            },
            {
                id: 'water-color',
                name: '水彩效果',
                name_en: 'Water Color',
                author: 'AUTO',
                githubUrl: 'https://github.com/SahilK-027/water-color',
                openUrl: 'https://watercolor-sk027.vercel.app/',
                image: 'https://raw.githubusercontent.com/SahilK-027/Sahilk-027/main/assets/thumbs/project-4.webp'
            },
            {
                id: 'ship-selection',
                name: '飞船',
                name_en: 'Ship Selection',
                author: 'AUTO',
                githubUrl: 'https://github.com/cortiz2894/ship-selection-page',
                openUrl: 'https://ship-selection-page.vercel.app/',
                image: HOST + 'threeExamples/openSource/ship-selection.jpg'
            }
        ]
    },
    {
        pid: 'threejsSource',
        name: '扩展依赖',
        name_en: 'Dependency',
        gid: 'ecologyExpand',
        group: '生态扩展',
        group_en: 'Ecology Expand',
        order: 60,
        children: [
            {
                id: 'threejsExamples',
                name: 'alien.js',
                name_en: 'Alien.js',
                tag: TEXTS['众多效果'],
                author: 'AUTO',
                tip: '基于three.js封装了大量的特效和组件',
                openUrl: 'https://alien.js.org/examples/three/shader_fluid_distortion.html',
                githubUrl: 'https://github.com/alienkitty/alien.js',
                image: HOST + 'threeExamples/openSource/alien.jpg'
            },
            {
                id: 'cameraControls',
                name: '相机控制器',
                name_en: 'CameraControls',
                author: 'AUTO',
                tip: '基于three.js封装的相机控制器',
                openUrl: 'https://yomotsu.github.io/camera-controls/examples/basic.html',
                githubUrl: 'https://github.com/yomotsu/camera-controls',
                image: HOST + 'threeExamples/openSource/cameraControls.jpg'
            },
            {
                id: 'CustomShaderMaterial',
                name: '自定义ShaderMaterial',
                name_en: 'Custom Shader',
                tip: ' 使用您自己的着色器扩展 Three.js 标准材质！',
                author: 'AUTO',
                openUrl: 'https://farazzshaikh.github.io/THREE-CustomShaderMaterial/',
                githubUrl: 'https://github.com/FarazzShaikh/THREE-CustomShaderMaterial',
                image: HOST + 'threeExamples/openSource/CustomShaderMaterial.jpg'
            },
            {
                id: 'drei_vanilla',
                name: 'drei-vanilla',
                name_en: 'Drei Vanilla',
                author: 'AUTO',
                tip: 'Drei的原生版本，封装了很多函数',
                openUrl: 'https://pmndrs.github.io/drei-vanilla/',
                githubUrl: 'https://github.com/pmndrs/drei-vanilla',
                image: HOST + 'threeExamples/openSource/drei_vanilla.jpg'
            },
            {
                id: 'tShaderMaterial',
                name: 'threejs-shader-materials',
                name_en: 'ShaderMaterial',
                author: 'AUTO',
                tip: 'Three.js的着色器材质扩展，包括多种着色器材质',
                openUrl: 'https://masatomakino.github.io/threejs-shader-materials/demo/',
                githubUrl: 'https://github.com/MasatoMakino/threejs-shader-materials',
                image: HOST + 'threeExamples/openSource/tShaderMaterial.jpg'
            },
            {
                id: 'GaussianSplats3D',
                name: '高斯点云渲染',
                name_en: 'GaussianSplats',
                author: 'AUTO',
                githubUrl: 'https://github.com/mkkellogg/GaussianSplats3D',
                openUrl: 'https://projects.markkellogg.org/threejs/demo_gaussian_splats_3d.php',
                image: HOST + 'threeExamples/openSource/GaussianSplats3D.jpg'
            },
            {
                id: 'three-viewport-gizmo',
                name: '视口控制器',
                name_en: 'Viewport Gizmo',
                author: 'AUTO',
                githubUrl: 'https://github.com/Fennec-hub/three-viewport-gizmo',
                openUrl: 'https://fennec-hub.github.io/three-viewport-gizmo/examples/orbit-controls',
                image: HOST + 'threeExamples/openSource/three-viewport-gizmo.jpg'
            },
            {
                id: 'cadViewer',
                name: 'CAD查看器',
                name_en: 'CAD Viewer',
                author: 'AUTO',
                referUrl: 'https://www.npmjs.com/package/three-cad-viewer',
                openUrl: 'https://bernhard-42.github.io/three-cad-viewer/example.html',
                githubUrl: 'https://github.com/bernhard-42/three-cad-viewer',
                image: HOST + 'threeExamples/openSource/cadViewer.jpg'
            },
            {
                id: 'threeText',
                name: 'three文本渲染',
                name_en: 'Three Text',
                author: 'AUTO',
                githubUrl: 'https://github.com/protectwise/troika/tree/main/packages/troika-three-text',
                openUrl: 'https://troika-examples.netlify.app/#text',
                image: HOST + 'threeExamples/openSource/threeText.jpg'
            },
            {
                id: 'textureProject',
                name: '纹理投影',
                name_en: 'Texture Project',
                author: 'AUTO',
                openUrl: 'https://marcofugaro.github.io/three-projected-material/',
                githubUrl: 'https://github.com/marcofugaro/three-projected-material',
                image: HOST + 'threeExamples/openSource/textureProject.jpg'
            },
            {
                id: 'threeGeospatial',
                name: '地理空间',
                name_en: 'Geospatial',
                githubUrl: 'https://github.com/takram-design-engineering/three-geospatial',
                openUrl: 'https://takram-design-engineering.github.io/three-geospatial/',
                image: HOST + 'threeExamples/openSource/threeGeospatial.jpg'
            },
            {
                id: 'maptalks_three',
                githubUrl: 'https://github.com/maptalks/maptalks.three',
                openUrl: 'https://maptalks.org/maptalks.three/docs/dist/',
                name: 'maptalks_three',
                image: HOST + 'threeExamples/openSource/maptalks_three.jpg'
            },
            {
                id: 'Photons',
                name: 'Photons',
                author: 'AUTO',
                openUrl: 'https://projects.markkellogg.org/threejs/demo_particle_system.php',
                githubUrl: 'https://github.com/mkkellogg/Photons2',
                image: HOST + 'threeExamples/openSource/Photons.jpg'
            },
            {
                id: 'threeQuarks',
                name: 'three-quarks',
                name_en: 'Three Quarks',
                author: 'AUTO',
                referUrl: 'https://www.npmjs.com/package/three.quarks',
                openUrl: 'https://quarks.art/',
                githubUrl: 'https://github.com/Alchemist0823/three.quarks',
                image: HOST + 'threeExamples/openSource/threeQuarks.jpg'
            },
            {
                id: 'sparkjs',
                name: 'Spark-splat',
                name_en: 'Spark-splat',
                author: 'AUTO',
                openUrl: 'https://sparkjs.dev/examples/',
                githubUrl: 'https://github.com/sparkjsdev/spark',
                image: HOST + 'threeExamples/openSource/sparkjs.jpg'
            },
            {
                id: 'threeForce',
                name: '力导向图',
                name_en: 'Force Graph',
                author: 'vasturiano',
                openUrl: 'https://vasturiano.github.io/3d-force-graph/example/large-graph/',
                githubUrl: 'https://github.com/vasturiano/3d-force-graph',
                image: HOST + 'threeExamples/physics/threeForce.jpg',
            },
            {
                id: 'GlobeStream3D',
                name: '3D地球',
                name_en: 'Globe Stream3D',
                author: 'AUTO',
                githubUrl: 'https://github.com/hululuuuuu/GlobeStream3D',
                openUrl: 'https://globestream3d.netlify.app/',
                image: HOST + 'threeExamples/openSource/GlobeStream3D.jpg'
            },
            {
                id: 'three-pinata',
                name: '碎裂',
                name_en: 'Three Pinata',
                author: 'AUTO',
                openUrl: 'https://three-pinata-demo.vercel.app/',
                githubUrl: 'https://github.com/dgreenheck/three-pinata',
                image: HOST + 'threeExamples/openSource/three-pinata.jpg'
            },
            {
                id: 'threeMapBox',
                name: 'MapBox Three',
                name_en: 'MapBox Three',
                author: 'AUTO',
                openUrl: 'https://ethan-zf.github.io/mapbox-bloom-effect-sample/example/index.html',
                githubUrl: 'https://github.com/ethan-zf/mapbox-bloom-effect-sample',
                links: [
                    { name: 'threeBox-plugin', url: 'https://github.com/jscastro76/threebox' }
                ],
                image: HOST + 'threeExamples/plugins/threeMapbox.jpg'
            },
            {
                id: 'gaodeMapThree',
                name: '高德结合Three.js',
                name_en: 'Gaode Map Three',
                author: 'AUTO',
                openUrl: 'https://lbs.amap.com/demo/javascript-api-v2/example/selflayer/glcustom-layer',
                githubUrl: 'https://github.com/AMap-Web/amap-three',
                image: HOST + 'threeExamples/plugins/gaodeMapThree.jpg'
            },
            {
                id: 'qgisThree',
                name: 'QGIS Three',
                author: 'AUTO',
                openUrl: 'https://minorua.github.io/Qgis2threejs/docs/',
                githubUrl: 'https://github.com/minorua/Qgis2threejs',
                image: HOST + 'threeExamples/plugins/qgisThree.jpg'
            },
            {
                id: 'vrThree',
                name: 'Three VR应用',
                name_en: 'Three VR',
                author: 'AUTO',
                githubUrl: 'https://github.com/felixmariotto/three-mesh-ui',
                openUrl: 'https://felixmariotto.github.io/three-mesh-ui/#border',
                image: HOST + 'threeExamples/openSource/vrThree.jpg'
            },
            {
                id: 'mesh-modifiers',
                name: '网格变形',
                name_en: 'Mesh Modifiers',
                author: 'AUTO',
                githubUrl: 'https://github.com/drawcall/threejs-mesh-modifiers',
                openUrl: 'https://drawcall.github.io/threejs-mesh-modifiers/',
                image: HOST + 'threeExamples/openSource/mesh-modifiers.jpg'
            },
            {
                id: 'three-raymarcher',
                name: '光线行进',
                name_en: 'Ray Marcher',
                author: 'AUTO',
                githubUrl: 'https://github.com/danielesteban/three-raymarcher',
                openUrl: 'https://danielesteban.github.io/three-raymarcher/animation.html',
                image: HOST + 'threeExamples/openSource/three-raymarcher.jpg'
            },
            {
                id: 'three-geo',
                name: 'Three Geo',
                name_en: 'Three Geo',
                author: 'AUTO',
                githubUrl: 'https://github.com/w3reality/three-geo',
                openUrl: 'https://w3reality.github.io/three-geo/examples/geo-viewer/io/index.html',
                image: HOST + 'threeExamples/openSource/three-geo.jpg'
            },
            {
                id: 'makio-meshline',
                name: 'Makio Meshline',
                name_en: 'Makio Meshline',
                author: 'AUTO',
                githubUrl: 'https://github.com/Makio64/makio-meshline',
                openUrl: 'https://meshline-demo.makio.io/',
                image: 'https://github.com/user-attachments/assets/deb1ccd7-46a9-4be0-8f07-280c21aafe81'
            }
        ]
    },
    {
        pid: 'framework',
        name: '相关框架',
        name_en: 'Frame Work',
        gid: 'ecologyExpand',
        group: '生态扩展',
        group_en: 'Ecology Expand',
        order: 60,
        children: [
            {
                id: 'iTowns',
                name: 'iTowns',
                tag: 'Tiles',
                author: 'AUTO',
                githubUrl: 'https://github.com/iTowns/itowns',
                openUrl: 'https://www.itowns-project.org/',
                image: HOST + 'threeExamples/openSource/iTowns.jpg'
            },
            {
                id: 'tvtJs',
                name: 'vue-tres框架',
                name_en: 'Vue Tres Frame',
                author: 'AUTO',
                githubUrl: 'https://github.com/hawk86104/three-vue-tres',
                openUrl: 'https://hawk86104.github.io',
                image: HOST + 'threeExamples/openSource/tvtJs.jpg'
            },
            {
                id: 'kokomijs',
                name: 'kokomi.js',
                author: 'AUTO',
                githubUrl: 'https://github.com/alphardex/kokomi.js',
                openUrl: 'https://kokomi-js.netlify.app/',
                image: HOST + 'threeExamples/openSource/kokomi.jpg'
            },
            {
                id: 'troisjs',
                openUrl: 'https://troisjs.github.io/',
                githubUrl: 'https://github.com/troisjs/trois',
                author: 'AUTO',
                name: 'trois.js',
                image: HOST + 'threeExamples/openSource/trois.jpg',
            },
            {
                id: 'vueCesium',
                name: 'vue-cesium',
                name_en: 'Vue Cesium',
                author: 'AUTO',
                openUrl: 'https://zouyaoji.top/vue-cesium',
                githubUrl: 'https://github.com/zouyaoji/vue-cesium',
                image: HOST + 'threeExamples/openSource/vueCesium.jpg'
            },
            {
                id: 'cesiumExtends',
                name: 'cesium扩展',
                name_en: 'Cesium Extends',
                author: 'AUTO',
                openUrl: 'https://extends.opendde.com/',
                githubUrl: 'https://github.com/hongfaqiu/cesium-extends',
                image: HOST + 'threeExamples/openSource/cesiumExtends.jpg'
            },
            {
                id: 'mbs',
                name: '图界 mbs',
                name_en: 'Mapbs 3D',
                openUrl: 'http://mapbs.com/#/example',
                githubUrl: 'https://github.com/mapbs/mbs.js',
                image: HOST + 'threeExamples/openSource/mbs.jpg'
            }
        ]
    },
    {
        pid: 'ortherSource',
        name: '其他资源',
        name_en: 'Other Resources',
        order: 90,
        children: [
            {
                id: 'loveCode',
                author: 'AUTO',
                name: '爱心代码',
                name_en: 'Love Code',
                githubUrl: 'https://github.com/sun0225SUN/Awesome-Love-Code',
                openUrl: 'https://sun0225sun.github.io/Awesome-Love-Code/',
                image: HOST + 'threeExamples/openSource/loveCode.jpg'
            },
            {
                id: 'bigScreen',
                author: 'AUTO',
                name: '大屏模板100套',
                name_en: 'Big Screen',
                githubUrl: 'https://github.com/iGaoWei/BigDataView',
                openUrl: 'https://igaowei.github.io/BigDataView/',
                image: HOST + 'threeExamples/openSource/bigScreen.jpg'
            },
            {
                id: 'axydemo',
                author: 'AUTO',
                name: '可视化大屏与3D',
                name_en: 'BigScreen 3D',
                githubUrl: 'https://github.com/whanxueyu/demo-collection',
                openUrl: 'https://axydemo.netlify.app/#/bigScreen',
                image: HOST + 'threeExamples/openSource/axydemo.jpg'
            },
            {
                id: 'visualization-collection',
                name: '可视化效果集合',
                name_en: 'Visualization',
                author: 'AUTO',
                openUrl: 'http://hepengwei.cn',
                githubUrl: 'https://github.com/hepengwei/visualization-collection',
                image: HOST + 'threeExamples/openSource/visualization.jpg'
            }
        ]

    }
].sort((a, b) => (a.order ?? 100) - (b.order ?? 100))

/* 可能在未来上线的一些链接资源记录 - 筛选
https://threepipe.org/
http://jasonsturges.com/three-low-poly/
http://idflood.github.io/ThreeNodes.js/index_optimized.html
*/