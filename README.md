## Three.js 和 Cesium.js 案例

- github预览 http://z2586300277.github.io/three-cesium-examples/public/index.html

- 官网预览  https://www.threelab.cn/three-cesium-examples/public/index.html

#### - 注: 先点星！先点星！先点星！重要的事情说三遍。

#### - 如果这些里面有案例帮助了您 - 我们不求回报 - 有意的话您可以提交您的作品 - 让爱传递给更多开发者

#### - fork仓库后 - 增加用户信息 - 上传您最自豪的作品 - 提交合并到主分支 - 爱心人士赞助后，将爱回馈作者

#### - 开发 如果只修改了 public 里面得内容，没修改src 内容则不需要打包, 如果需要打包手动删除 public/assets 目录

1. 创作者可以在 public/config/author.js 录入你的开发者信息,然后你提交的案例关联上id 就会展示作者信息。

2. 将案例js放入到public目录下的cesiumExamples/threeExamples 中的文件夹中 如threeExamples/basic中放入 test.js, test.jpg。

3. 在config目录下 找到threeExamples 录入案例信息。

4. 注: 为保证轻量化 图片资源使用 - https://yasuo.xunjiepdf.com/img/  _(自定义压缩至4k以内)_

5. 涉及其他js 使用 可将js 放到 public/ js 目录  如 dat.gui

6. 涉及到资源文件可创建到 public/ files 文件夹下 能压缩尽量压缩较小

```js
{
    id: '父级列表唯一id',
    name: '名称',
    author: '作者id',
    codeUrl: '/three-cesium-examples/public/threeExamples/basic/test.js',
    image: '/three-cesium-examples/public/threeExamples/basic/test.jpg',
    meta: {
        title: '此案例网站标题',
        keywords: '搜索引擎关键字',
        description: '此案例页面描述'
    }
}
```

- 加入开发者社区 - 获取知识的同时不忘分享 - fork此模板提交你自己的案例
 
- 开发者交流 QQ 2945853209- 交流群 131995948

- node 18+ 较好 - 当前适配Node 14 - 22 版本 npm pnpm yarn 安装,若一些依赖的捆绑依赖未装上,请手动安装

- 当前项目所有依赖 2024-7-2 已经更新 至 最新版本

- 目录已最简化 - 通俗易懂 - 开发习惯全靠开发者自行遵守  src-开发 public-文件 index.html-模板 vite.config.js-配置

# [国内镜像](https://gitee.com/giser2017/three-cesium-examples)
# [国外镜像](https://github.com/z2586300277/three-cesium-examples)
