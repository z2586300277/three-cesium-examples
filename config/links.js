import { HOST } from "./host.js"

// 企业可根据自己的需求修改url 成自己的导航地址 链接
export default {
    site: {
        name: 'THREELAB',
        url: 'https://threelab.cn/',
        logo: HOST + 'files/site/logo.png',
        footName: '加入-THREELAB',
        footLink: 'https://threelab.cn/'
    },
    links : [
        {
            name: '🏡官网',
            url: 'https://threelab.cn/'
        },
        {
            name: '📚笔记',
            url: 'https://threelab.cn/pages/5a8283/'
        },
        {
            name: '🐘贡献者',
            url: 'https://threelab.cn/pages/5d571c11/',
        },
        {
            name: '🍃开源助力',
            children: [
                {
                    name: '👬加入开发者',
                    url: 'https://github.com/z2586300277'
                },
                {
                    name: '⭐github点星',
                    url: 'https://github.com/z2586300277/three-cesium-examples'
                },
                {
                    name: '🌟gitee点星',
                    url: 'https://gitee.com/giser2017/three-cesium-examples'
                }
            ]
        }
    ]
}