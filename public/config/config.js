import cesiumExamples from "./cesium-examples.js";
import threeExamples from "./three-examples.js";
import threeCesiumAuthors from "./author.js";

window.THREE_CESIUM_NAVIGATION = [
    {
        name: "Three.js案例[r166]",
        examples: threeExamples,
        inject: {
            importmap: {
                "three": "/three-cesium-examples/public/js/three/three.module.min.js",
                "three/examples/jsm/": "/three-cesium-examples/public/js/three/addons/",
                "postprocessing": "/three-cesium-examples/public/js/postprocessing.js",
                "gsap": "/three-cesium-examples/public/js/gsap/index.js",
                "dat.gui": "/three-cesium-examples/public/js/dat.gui.module.js",
                "3d-tiles-renderer": "https://z2586300277.github.io/3d-file-server/js/3dTilesRenderer/index.js",
                "@tweenjs/tween.js": "/three-cesium-examples/public/js/tween.esm.js"
            }
        }
    },
    {
        name: "Cesium.js案例[1.119]",
        examples: cesiumExamples,
        inject: {
            link: `<link rel="stylesheet" href="/three-cesium-examples/public/js/cesium/style.css">`,
            src: `<script src="/three-cesium-examples/public/js/echarts.min.js"></script>`,
            importmap: {
                "cesium": "/three-cesium-examples/public/js/cesium/Cesium.js",
                "dat.gui": "/three-cesium-examples/public/js/dat.gui.module.js"
            },
            jsHeader: `window.CESIUM_BASE_URL = "/three-cesium-examples/public/js/cesium"`
        }
    }
];

window.THREE_CESIUM_AUTHORS = threeCesiumAuthors;

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

    const scriptTag = `<script type="importmap">\n${scriptContent}\n<\/script>`

    const page = `${link || ''}\n${src || ''}\n${scriptTag}\n${html}\n${getModeuleJs(code, jsHeader)}\n`

    return page

}
