export default [
    {
        pid: 'start',
        name: '开始',
        children: [
            {
                id: 'createScene',
                name: '创建场景',
                codeUrl: '/three-cesium-examples/public/threeExamples/createScene.js',
                image: '',
                meta: {
                    title: '开始',
                    keywords: 'three.js,开始',
                    description: '使用three.js创建的开始'
                }
            }
        ]
    },
    {
        pid: '着色器',
        name: 'shader',
        children: [
            {
                id: 'changeShader',
                name: '着色器切换',
                codeUrl: 'changeShader',
                image: '',
                meta: {
                    title: '着色器切换',
                    keywords: 'three.js,着色器',
                    description: '使用three.js创建的更换着色器'
                }
            },
            {
                id: 'fenceShader',
                name: '围栏着色器',
                codeUrl: 'fenceShader',
                image: '',
                meta: {
                    title: '围栏着色器',
                    keywords: 'three.js 着色器,区域围栏着色器',
                    description: '使用three.js创建的围栏着色器'
                }
            }
        ]
    }
]