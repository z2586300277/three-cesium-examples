export default [
    {
        pid: 'layer',
        name: '图层',
        children: [
            {
                id: 'defaultLayer',
                name: '默认图层',
                codeUrl: 'defaultLayer',
                image: '',
                meta: {
                    title: '默认图层',
                    keywords: 'three.js,默认图层',
                    description: 'three.js默认图层'
                }
            },
            {
                id: 'gaodeLayer',
                name: '高德地图',
                codeUrl: 'gaodeLayer',
                image: '',
                meta: {
                    title: '高德地图',
                    keywords: 'three.js,高德地图',
                    description: '加载高德地图'
                }
            },
            {
                id: 'baiduLayer',
                name: '百度地图',
                codeUrl: 'baiduLayer',
                image: '',
                meta: {
                    title: '百度地图',
                    keywords: 'three.js,百度地图',
                    description: '加载百度地图'
                }
            }
        ]
    },
    {

        pid: 'function',
        name: '功能',
        children: [
            {
                id: 'clickEvent',
                name: '点击事件',
                codeUrl: 'clickEvent',
                image: '',
                meta: {
                    title: 'cesium点击事件',
                    keywords: 'cesium, 点击事件',
                    description: '点击事件'
                }
            }
        ]
    }
]