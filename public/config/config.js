import cesiumExamples from "./cesium-examples.js";
import threeExamples from "./three-examples.js";
import threeCesiumAuthors from "./author.js";

window.THREE_CESIUM_NAVIGATION = [
    {
        name: "ThreeJS",
        label: "Three.js案例[r166]",
        examples: threeExamples,
        inject: {
            importmap: {
                "three": "/three-cesium-examples/public/js/three/three.module.min.js",
                "three/examples/jsm/": "/three-cesium-examples/public/js/three/addons/",
                "three/addons/": "/three-cesium-examples/public/js/three/addons/",
                "postprocessing": "/three-cesium-examples/public/js/postprocessing.js",
                "gsap": "/three-cesium-examples/public/js/gsap/index.js",
                "dat.gui": "/three-cesium-examples/public/js/dat.gui.module.js",
                "@tweenjs/tween.js": "/three-cesium-examples/public/js/tween.esm.js"
            }
        }
    },
    {
        name: "CesiumJS",
        label: "Cesium.js案例[1.119]",
        examples: cesiumExamples,
        inject: {
            link: [`/three-cesium-examples/public/js/cesium/style.css`],
            src: [],
            importmap: {
                "cesium": "/three-cesium-examples/public/js/cesium/Cesium.js",
                "dat.gui": "/three-cesium-examples/public/js/dat.gui.module.js"
            },
            jsHeader: `window.CESIUM_BASE_URL = "/three-cesium-examples/public/js/cesium"`
        }
    }
];

window.THREE_CESIUM_AUTHORS = threeCesiumAuthors;

/** 
 * dependent 
 * 附加依赖注入方式参考
 * 在文件头部注入以下系列代码
 * src 形式引入 列表
 * link 样式引入 列表
 * importmap 映射引入 列表
 * 严格执行案例代码缩进
 * 参考 threeExamples => expand => loadTiles.js, threeExamples => application => nav_mesh,nav.js, cesiumExamples => expand => echartsFlyLine.js
`{  
    "link": ["/test.css"],
    "src": ["/three-cesium-examples/public/js/echarts.min.js"],
    "importmap":{
      "3d-tiles-renderer": "https://z2586300277.github.io/3d-file-server/js/3dTilesRenderer/index.js",
      "three.path":"https://z2586300277.github.io/3d-file-server/js/three.path.module.js"
    }
}`=INCLUDE_SCRIPT_PLACEHOLDER
*/

/* 依赖注入 */
window.GET_SCRIPT = (code, navName, dependent) => {

    const { inject } = window.THREE_CESIUM_NAVIGATION.find(item => item.name === navName) // 获取注入

    dependent = dependent ? JSON.parse(dependent) : {} // 获取额外依赖

    if (!inject) return

    const html = `
    <style>
        body {
            margin: 0;
            padding: 1px;
            box-sizing: border-box;
            background-color: #1f1f1f;
            overflow: hidden;
        }
        #box {
            width: 100%;
            height: 100%;
        }
    </style>
    <div id="box"></div>
    `
    const getModeuleJs = (code, codeHeader) => {
        return `
        <script type="module">
        ${codeHeader || ''}
            ${code}
        </script>
        `
    }

    const { importmap, link, src, jsHeader } = inject

    const scriptContent = JSON.stringify({ imports: { ...importmap, ...dependent.importmap } }, null, 4)

    const importmapTag = `<script type="importmap">\n${scriptContent}\n<\/script>`

    const linkTags = [link, dependent.link].reduce((a, c) => (c && (a = a.concat(c)), a), []).filter(i => i).map(i => `<link rel="stylesheet" href="${i}">\n`)

    const srcTags = [src, dependent.src].reduce((a, c) => (c && (a = a.concat(c)), a), []).filter(i => i).map(i => `<script src="${i}"></script>\n`)

    const page = linkTags + srcTags + `${importmapTag}\n${html}\n${getModeuleJs(code, jsHeader)}\n`

    return page

}
