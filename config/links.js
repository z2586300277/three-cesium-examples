import { HOST } from "./host.js"

// 企业可根据自己的需求修改url 成自己的导航地址 链接
export default {
    site: {
        name: 'Three JS',
        url: 'https://threejs.org/',
        logo: HOST + 'files/site/logo.svg',
        footName: '- Home',
        footLink: HOST
    },
    links: [
        {
            name: '📦Three',
            children: [
                {
                    name: '🏡Home',
                    url: 'https://threejs.org/'
                },
                {
                    name: '📚Documents',
                    url: 'https://threejs.org/docs/index.html#manual/en/introduction/Creating-a-scene'
                },
                {
                    name: '🐘Examples',
                    url: 'https://threejs.org/examples/#webgl_animation_keyframes',
                },
            ]
        },
        
        {
            name: '🌐Cesium',
            children: [
                {
                    name: '🏡Home',
                    url: 'https://cesium.com/cesiumjs/'
                },
                {
                    name: '🏠中文网',
                    url: 'http://cesium.xin/'
                },
                {
                    name: '📚Documents',
                    url: 'https://cesium.com/docs/cesiumjs-ref-doc/'
                },
                {
                    name: '🐘Examples',
                    url: 'https://sandcastle.cesium.com/'
                },
            ]
        },

        {
            name: '🍃OpenThree',
            url: 'https://openthree.github.io/three-cesium-links/'
        }
        
    ]
}