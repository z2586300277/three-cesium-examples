import './lang.js';
import cesiumExamples from "./cesium-examples.js";
import threeExamples from "./three-examples.js";
import githubExamples from "./github-examples.js";
import threeCesiumAuthors from "./author.js";
import threeCesiumLinks from "./links.js";
import { HOST, FILE_HOST } from "./host.js";

window.THREE_CESIUM_LINKS = threeCesiumLinks // 链接

window.HOST = HOST // 当前项目服务 host 地址, 注入到全局变量

window.FILE_HOST = FILE_HOST // 文件资源服务器地址, 注入到全局变量

/* 全局注入iframe 中可使用 GLOBAL_CONFIG.ElMessage 消息提示 可在内部使用 不影响代码逻辑 */
window.GLOBAL_CONFIG = {

    getLayerUrl: () => "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer", // cesium 图层源

    getFileUrl: (url) => FILE_HOST + url, // 例 threeExamples/shader/chinaFlag.js 文件中的图片资源引用

    /*  ... 可任意增添方法 返回 boolean number string 的值 */

}

/* 注入 HTML */
window.HTML_TEMPLATE =
`<style>
    body {
        margin: 0;
        padding: 1px;
        box-sizing: border-box;
        background-color: #1f1f1f;
        display: flex;
        flex-direction: column;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
    }
    #box {
        width: 100%;
        height: 100%;
    }
</style>
</head>
<body>
<div id="box"></div>`

/* 依赖注入可使用 如 线上官网 或 cdn 或者本地路径 */
window.THREE_CESIUM_NAVIGATION = [
    {
        name: "ThreeJS",
        label: "Three js案例",
        label_en: "Three JS",
        examples: threeExamples,
        inject: {
            importmap: {
                "three": "https://threejs.org/build/three.module.min.js",
                "three/addons/": "https://threejs.org/examples/jsm/",
                "three/examples/jsm/": "https://threejs.org/examples/jsm/",
                "gsap": FILE_HOST + "js/gsap/index.js", // https://cdn.jsdelivr.net/npm/gsap/+esm gsap最新版
                "animejs/": "https://cdn.jsdelivr.net/npm/animate.js/+esm",
                "dat.gui": HOST + "js/dat.gui.module.js",
                "postprocessing": "https://cdn.jsdelivr.net/npm/postprocessing/+esm",
                "tweakpane": "https://cdn.jsdelivr.net/npm/tweakpane/+esm",
                "@tweenjs/tween.js": HOST + "js/tween.esm.js",
                "echarts": "https://cdn.jsdelivr.net/npm/echarts/+esm"
            }
        }
    },
    {
        name: "CesiumJS",
        label: "Cesium js案例",
        label_en: "Cesium JS",
        examples: cesiumExamples,
        inject: {
            link: [FILE_HOST + `js/cesium/style.css`],
            src: [],
            importmap: {
                "cesium": FILE_HOST + "js/cesium/Cesium.js",
                "dat.gui": HOST + "js/dat.gui.module.js"
            },
            jsHeader: `window.CESIUM_BASE_URL = "${FILE_HOST}js/cesium"`
        }
    },
    {
        name: "Github",
        label: "Github案例",
        label_en: "Github",
        examples: githubExamples,
    }
]

window.THREE_CESIUM_AUTHORS = threeCesiumAuthors // 作者

/** 
 * inject 附加依赖注入方式 
 * 上述 为公共依赖注入
 * 单个的案例配置额外的依赖注入参考 threeExamples => expand => loadTiles.js, threeExamples => application => nav_mesh,nav.js, cesiumExamples => expand => echartsFlyLine.js
 * src 形式引入 列表
 * link 样式引入 列表
 * importmap 映射引入 列表
 * 配置单个 案例信息的 inject 属性
 * 引用可使用 https://www.jsdelivr.com/ cdn 或者 https://unpkg.com/ 进行外部依赖
    {  
        "link": ["/test.css"],
        "src": [HOST+"js/echarts.min.js"],
        "importmap":{
            "3d-tiles-renderer": "https://z2586300277.github.io/3d-file-server/js/3dTilesRenderer/index.js",
            "three.path":"https://z2586300277.github.io/3d-file-server/js/three.path.module.js"
        }
    }
*/

/* 语言切换 */
if (localStorage.getItem('langEn') === 'true') {

    window.THREE_CESIUM_NAVIGATION.forEach(item => {

        item.label = item.label_en || item.label

        item.examples?.forEach(example => {

            example.name = example.name_en || example.name

            example.group = example.group_en || example.group

            example.children?.forEach(child => (child.name = child.name_en || child.name))

        })

    })

}

/* 设置 meta 信息 */
function setMeta(query) {

    const navigation = window.THREE_CESIUM_NAVIGATION.find(item => item.name === query.navigation)

    if (!navigation) return

    const classify = navigation.examples.find(item => item.pid === query.classify)

    if (!classify) return

    const example = classify.children.find(item => item.id === query.id)

    if (!example) return

    const { meta } = example

    if (!meta) return

    if (meta.title) document.title = meta.title

    if (meta.keywords) document.querySelector('meta[name="keywords"]').setAttribute('content', meta.keywords)

    if (meta.description) document.querySelector('meta[name="description"]').setAttribute('content', meta.description)

}

/* 提取hash url 传参 */
const href = window.location.href

const params = href.split('?')[1]

if (params) {

    const query = params.split('&').reduce((pre, cur) => {

        const [key, value] = cur.split('=')

        pre[key] = decodeURIComponent(value)

        return pre

    }, {})

    setMeta(query)

}

/* 
🌹🍀🍎💰📱🌙🍁🍂🍃🌷💎🔪🔫🏀⚽⚡👄👍🔥😀😁😂😃😄😅😆😉😊😋
😎😍😘😗😙😚☺😇😐😑😶😏😣😥😮😯😪😫😴😌😛😜😝😒😓😔😕😲
😷😖😞😟😤😢😭😦😧😨😬😰😱😳😵😡😠😈👿👹👺💀👻👽👦👧👨👩
👴👵👶👱👮👲👳👷👸💂🎅👰👼💆💇🙍🙎🙅🙆💁🙋🙇🙌🙏👤👥🚶🏃
👯💃👫👬👭💏💑👪💪👈👉☝👆👇✌✋👌👍👎✊👊👋👏👐✍👣👀👂👃
👅👄💋👓👔👕👖👗👘👙👚👛👜👝🎒💼👞👟👠👡👢👑👒🎩🎓💄💅💍
🌂🙈🙉🙊🐵🐒🐶🐕🐩🐺🐱😺😸😹😻😼😽🙀😿😾🐈🐯🐅🐆🐴🐎🐮🐂
🐃🐄🐷🐖🐗🐽🐏🐑🐐🐪🐫🐘🐭🐁🐀🐹🐰🐇🐻🐨🐼🐾🐔🐓🐣🐤🐥
🐦🐧🐸🐊🐢🐍🐲🐉🐳🐋🐬🐟🐠🐡🐙🐚🐌🐛🐜🐝🐞🦋💐🌸💮🌹🌺
🌻🌼🌷🌱🌲🌳🌴🌵🌾🌿🍀🍁🍂🍃🌍🌎🌏🌐🌑🌒🌓🌔🌕🌖🌗🌘🌙
🌚🌛🌜☀🌝🌞⭐🌟🌠☁⛅☔⚡❄🔥💧🌊💩🍇🍈🍉🍊🍋🍌🍍🍎🍏🍐🍑
🍒🍓🍅🍆🌽🍄🌰🍞🍖🍗🍔🍟🍕🍳🍲🍱🍘🍙🍚🍛🍜🍝🍠🍢🍣🍤🍥
🍡🍦🍧🍨🍩🍪🎂🍰🍫🍬🍭🍮🍯🍼☕🍵🍶🍷🍸🍹🍺🍻🍴🎪🎭🎨🎰
🚣🛀🎫🏆⚽⚾🏀🏈🏉🎾🎱🎳⛳🎣🎽🎿🏂🏄🏇🏊🚴🚵🎯🎮🎲🎷🎸
🎺🎻🎬👾🌋🗻🏠🏡🏢🏣🏤🏥🏦🏨🏩🏪🏫🏬🏭🏯🏰💒🗼🗽⛪⛲🌁
🌃🌆🌇🌉🌌🎠🎡🎢🚂🚃🚄🚅🚆🚇🚈🚉🚊🚝🚞🚋🚌🚍🚎🚏🚐🚑🚒
🚓🚔🚕🚖🚗🚘🚚🚛🚜🚲⛽🚨🚥🚦🚧⚓⛵🚤🚢✈💺🚁🚟🚠🚡🚀🎑🗿
🛂🛃🛄🛅💌💎🔪💈🚪🚽🚿🛁⌛⏳⌚⏰🎈🎉🎊🎎🎏🎐🎀🎁📯📻📱📲
☎📞📟📠🔋🔌💻💽💾💿📀🎥📺📷📹📼🔍🔎🔬🔭📡💡🔦🏮📔📕📖📗
📘📙📚📓📃📜📄📰📑🔖💰💴💵💶💷💸💳✉📧📨📩📤📥📦📫📪📬📭
📮✏✒📝📁📂📅📆📇📈📉📊📋📌📍📎📏📐✂🔒🔓🔏🔐🔑🔨🔫🔧🔩
🔗💉💊🚬🔮🚩🎌💦💨💣☠♠♥♦♣🀄🎴🔇🔈🔉🔊📢📣💤💢💬💭♨🌀
🔔🔕✡✝🔯📛🔰🔱⭕✅☑✔✖❌❎➕➖➗➰➿〽✳✴❇‼⁉❓❔❕❗©®™🎦🔅
🔆💯🔠🔡🔢🔣🔤🅰🆎🅱🆑🆒🆓ℹ🆔Ⓜ🆕🆖🅾🆗🅿🆘🆙🆚🈁🈂🈷
🈶🈯🉐🈹🈚🈲🉑🈸🈴🈳㊗㊙🈺🈵▪▫◻◼◽◾⬛⬜🔶🔷🔸🔹🔺🔻💠
🔲🔳⚪⚫🔴🔵♈♉♊♋♌♍♎♏♐♑♒♓⛎💘❤💓💔💕💖💗💙💚💛💜💝
💞💟❣🌿🚧💒☎📟💽⬆↗➡↘⬇↙⬅↖↕↔↩↪⤴⤵🔃🔄🔙🔚🔛🔜🔝🔀
🔁🔂▶⏩◀⏪🔼⏫🔽⏬📱📶📳📴♻🏧🚮🚰♿🚹🚺🚻🚼🚾⚠🚸⛔🚫🚳
*/