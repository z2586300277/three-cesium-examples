## 💎 原生Three.js 和 Cesium.js 案例 (想要加入一起管理 - qq 2586300277) - 作者更新到死 -

- dev分支更新后 github实时预览 http://z2586300277.github.io/three-cesium-examples/public/index.html

- 官网预览  https://www.threelab.cn/three-cesium-examples/public/index.html

- 开发者交流 🐧QQ 2945853209 - 交流群 131995948

- node 18+ 较好 - 当前适配Node 14 - 22 版本 (当前项目所有依赖 2024-7-2 已经更新 至 最新版本)

- 运行框架  安装推荐使用npm,pnpm,使用yarn安装依赖可能会出现vue-codemirror的关联依赖codemirror安装不上,可自行手动安装

##### 💖 - 注: 先点星！先点星！先点星！重要的事情说三遍。

##### - 如果这些里面有案例帮助了您 - 我们不求回报 - 有意的话您可以提交您的作品 - 让爱传递给更多开发者

##### - fork仓库后 - 增加用户信息 - 上传您最自豪的作品 - 提交合并到主分支 - 爱心人士赞助后，将爱回馈作者 （开发或者合并 基于dev分支）

##### - 开发 如果只修改了 public 里面得内容，没修改src 内容则不需要打包, 如果需要打包手动删除 public/assets 目录

1. 创作者可以在 public/config/author.js 录入你的开发者信息,然后你提交的案例关联上id 就会展示作者信息。

2. 将案例js放入到public目录下的cesiumExamples/threeExamples 中的文件夹中 如threeExamples/basic中放入 test.js, test.jpg, 或者目录test[test.js, test.jpg]

3. 在config目录下 找到threeExamples 录入案例信息, 内部的资源指向与你的 js 和 image 资源路径对应

4. 注: 为保证轻量化 案例展示图片资源使用 - https://yasuo.xunjiepdf.com/img/  _(自定义压缩至4k以内)_

5. 涉及其他依赖js,可将module.js 放到public/js目录  如 dat.gui,gasp ,注入方式 config.js 可见

6. 音视频模型存储等一些可以公用的资源 public/files 文件夹下 为了保证存储库大小尽量缩小到5M以内

- assets 打包后目录
- config  js注入和配置案例信息目录
- files 音视频模型存储等一些可以公用的资源
- js dat.gui gsap three官方源码 cesium官方源码
- threeExamples three.js 案例代码目录
- cesiumExamples cesium 案例代码目录

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

## 🏠 搭建自己的分布式存储仓库

- 架构设计是以请求资源形式访问代码,所以如 codeUrl image, 等资源信息不局限于存储在 本仓库中，例如存储在你自己的服务器，然后url 访问到你的资源地址即可。

- 然后在此仓库仅配置 案例信息即可, 可参考 three案例 => 扩展功能 => 3D 地图 案例的配置

- 注 由于 github 访问限制 http 会被自动禁止, 建议 也搭建自己得github page ,使用 github 充当自己的资源服务器。

- 如：我的一些分布式资源存储在 https://github.com/z2586300277/3d-file-server 仓库下 —— 访问服务: https://z2586300277.github.io/3d-file-server/

- github page 搭建  => 创建仓库 => 页面流程 => setting => pages => Build and deployment => source (depoly from a branch) => branch 选择对应分支

- 注： github page 搭建完成后 直接访问 如 https://xxxx.github.io/xxxx/ 下的资源文件无法显示是正常现象, 在代码中可正常获取

- 参考访问案例 如 cesium 案例 => 离线地图 => 内网高德

- 如需帮助联系 QQ 2586300277