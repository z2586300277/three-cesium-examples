import cesiumExamples from './cesium-examples.js'
import threeExamples from './three-examples.js'
import threeCesiumAuthors from './author.js'

window.THREE_CESIUM_NAVIGATION = [

    { name: 'Three.js案例[r166]', examples: threeExamples },

    { name: 'Cesium.js案例[1.119]', examples: cesiumExamples },

]

window.THREE_CESIUM_AUTHORS = threeCesiumAuthors

/* 依赖注入 */
window.GET_SCRIPT = (v, t) => (t === 'Cesium.js案例[1.119]' ?

`<link rel="stylesheet" href="/three-cesium-examples/public/js/cesium/style.css">
 <script type="importmap">
    {
        "imports": {
            "cesium": "/three-cesium-examples/public/js/cesium/Cesium.js",
            "dat.gui": "/three-cesium-examples/public/js/dat.gui.module.js"
        }
    }
 <\/script>`
:
`<script type="importmap">
    {
        "imports": {
            "three": "/three-cesium-examples/public/js/three/three.module.min.js",
            "three/examples/jsm/": "/three-cesium-examples/public/js/three/addons/",
            "postprocessing": "/three-cesium-examples/public/js/postprocessing.js",
            "gsap": "/three-cesium-examples/public/js/gsap/index.js",
            "dat.gui": "/three-cesium-examples/public/js/dat.gui.module.js",
            "3d-tiles-renderer": "/three-cesium-examples/public/js/3dTilesRenderer/index.js"
        }
    }
<\/script>`) +

`<style>
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
<script type="module">
    ${t === 'Cesium.js案例' ? 'window.CESIUM_BASE_URL = "/three-cesium-examples/public/cesium"' : ''}
    ${v}
<\/script>`
