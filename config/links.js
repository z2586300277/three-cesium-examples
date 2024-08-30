import { HOST } from "./host.js"

// 企业可根据自己的需求修改url 成自己的导航地址 链接
export default {
    site: {
        name: 'THREE.JS',
        url: 'https://threejs.org/',
        logo: HOST + 'files/site/logo.svg',
        footName: '- Home',
        footLink: HOST
    },
    links : [
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
        {
            name: '🍃Open Source',
            children: [
                {
                    name: '👬Join Us',
                    url: 'https://github.com/z2586300277'
                },
                {
                    name: '⭐github star',
                    url: 'https://github.com/z2586300277/three-cesium-examples'
                }
            ]
        }
    ]
}