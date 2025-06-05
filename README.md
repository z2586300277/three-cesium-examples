# 💎 Three.js 和 Cesium.js 案例 - 为爱发电 - 只做开源 -

## Web3D TOP1 - 👋 - 分享知识 - ⭐ - 点星助力 - ⚡ - 更新到死

#### 前端3d相关资源、仓库、链接、效果案例、需求、优化建议可使用 Issues 留言投稿✍。

#### 开发者记录、查阅、分享、展示作品、结识朋友、合作🤝。(加入管理仓库联系作者🍉)

| QQ 群 |           微信群            |              预览图                       | Stars           |
| :---------------:| :---------------: | :---------: | :--------- |
| <img src="https://z2586300277.github.io/3d-file-server/images/QQ.png" height="140px" /> | <img src="https://z2586300277.github.io/3d-file-server/images/nico.jpg" height="140px" /> | <img src="https://z2586300277.github.io/3d-file-server/images/threeCesiumExamples.jpg" width="200px" height="140px" /> | <img src="https://api.star-history.com/svg?repos=z2586300277/three-editor,z2586300277/three-cesium-examples&type=Date" width="200px" height="140px" /> |

- 2025 拥抱未来，分享永不停止 - [开源组织](https://openthree.github.io/three-cesium-links)，从零打造WebGPU开源案例 - [链接](https://openthree.github.io/webgpu)

- github dev 分支实时预览 http://z2586300277.github.io/three-cesium-examples

- 国内访问 https://threehub.cn ，可下滑至 📦 自行部署 - 助力企业 查看其他部署站点🏫。

- 由于此仓库关注和浏览的人很多且活跃, 仓库会经常更新。(点个 watch 获取最新动态🐸)

- 关注 git histroy, 记录人生的每一天, 开发者人生历史的足迹。(点个 follow 监视作者🍏)

- 人生旅程中的 Web3D 知识记录, 复习回顾, 高效查阅, 资源共享, 为爱发电。(fork 一下提交自己作品🍀)

- 源码内存约10M，运行框架(Vue)和在线调试源于 作者名下的 three-editor库 - [链接](https://z2586300277.github.io/three-editor/dist/#/example)

- 注：尽量不要提交超过200k的文件，image 控制压缩到 10k，在线压缩 - [链接](https://yasuo.xunjiepdf.com/img/)

- 留下链接，便于企业寻求专业的技术或人员支持，个人开发者承接项目、资源售卖，交流支持🐋。

### 👋 欢迎联系 (任意用户自行添加）

<img src="https://contrib.rocks/image?repo=z2586300277/three-cesium-examples&type=Date&45" />

|     作者     |   联系方式   |    联系方式     |             链接             |          描述
| :----------: | :----------: | :-------------: | :------------------------: | :------------------------: |
| 优雅永不过时 | 🐧2586300277 | 微:z2586300277  |  [主页](https://z2586300277.github.io) |  Web3D 为爱发电
|  贾宛龙  | 微: trampjwl | 🐧 群 585667336 | [Cesium社区](https://jiawanlong.github.io) |  专注于Cesium.js领域
|     Nico     |  🐧805879871   | 微:15230117323  |     [官网](http://nicowebgl.cn )  |   Three.js Cesium.js
|  FFMMCC  | 微:fmc2055615840 | 🐧2055615840 | [主页](https://coderfmc.github.io/three.js-demo/fmc-web-3d/) | Web3D爱好者
|     ThreeX     |  🐧383612104   | 微:web-gpu  |     [官网](https://three-x.cn)      |   致力于Three.js小程序
|  Threelab |🐧2945853209 | - | [官网](https://threelab.cn) | 海量点云渲染引擎
| - | - | - | - | - |

## 🌳 创作

#### ✋ 如果这些里面有案例帮助了您，有意的话您可以提交您的作品，让爱传递给更多开发者

#### 👏 加入管理仓库的开发者，可自行创建自己的分支，或者在 dev 分支直接开发

#### 📑 fork 仓库开发 - 增加用户信息 - 提交代码 - 合并到 dev

#### 🌿 分布式仓库开发模式 https://github.com/z2586300277/three-cesium-examples-self

- 运行框架 - 确保联网(three、gsap等依赖引入) - 服务端口指向index.html 如nginx apache liveServer等

1. 创作者可以在 config/author.js 录入你的开发者信息,然后你提交的案例关联上 id 就会展示作者信息。

2. 将案例 js 放入目录 cesiumExamples/threeExamples 中的文件夹中 如 threeExamples/basic 中放入 test.js, test.jpg, 或者目录 test[test.js, test.jpg]

3. 在 config 目录下 找到 threeExamples 录入案例信息, 内部的资源指向与你的 js 和 image 资源路径对应

4. 注: 为保证轻量化 案例展示图片资源使用 - https://yasuo.xunjiepdf.com/img/ _(自定义压缩至 10k 以内)_

5. 涉及其他依赖 js,可将 module.js 放到 js 目录 如 dat.gui,gasp ,注入方式 config/config.js 可见

6. 音视频模型存储等一些可以公用的资源 files 文件夹下,涉及文件资源尽量引用外部 url,保证仓库轻量化

- assets => ui 运行框架 不需要修改
- config => 配置项[host:主机, links:链接, author:作者信息, lang:语言, config:注入运行]
- files 音视频模型存储等一些可以公用的资源, 尽量不要上传文件资源, 使用 外部 url 地址访问
- js => dat.gui gsap 等等一些依赖存放处,尽量可使用 如 cdn 线上 js 引入
- threeExamples three.js 案例代码目录
- cesiumExamples cesium 案例代码目录

```js
// HOST 自动获取 当前域名/ip 防止部署环境不同 资源引用失效
{
    id: '列表唯一id',
    name: '名称',
    name_en: '英文名',
    tag: '标签名字-背景颜色-字体大小',
    tip: '提示信息',
    author: '作者id',
    referUrl: '案例参考来源地址', // 如 没有可不配置
    downloadUrl: '附带下载的url', // 如three.js => 高级案例 => 桃花亭 配置后refer将不显示
    imporver: '优化作者', // 优化作者的id
    links: [{ url: '连接', name: '名称' }] //配置link imporver 将不显示
    image: HOST + 'threeExamples/basic/test.jpg', // 对应窗口图
    codeUrl: HOST + 'threeExamples/basic/test.js', // js module格式 大多数案例形式
    htmlUrl: HOST + 'threeExamples/test/test.html' // html 在线格式 如 three案例 => 粒子 => 随机粒子 粒子行星
    openUrl: '预览外联地址url', // openurl 和 codeurl 为二选一形式 如 可见桃花亭 su7 案例
    githubUrl: '附带github 仓库的url', // 如 three.js => 开源作品 => su7
    meta: {
        title: '此案例网站标题',
        keywords: '搜索引擎关键字',
        description: '此案例页面描述'
    }
}
```
## 🏠 搭建自己的分布式存储仓库

- 架构设计是以请求资源形式访问代码,如codeUrl image，等资源文件不局限于存储在本仓库中，例如存储在你自己的服务器，然后 url 访问到你的文件即可，类似于请求接口。

- 然后在此仓库仅配置 案例信息即可, 可参考 three 案例 => 扩展功能 => 3D 地图 案例的配置

- 因github.io是https, https 访问限制 http 会被自动禁止, 建议搭建自己的 github page ,使用 github 充当自己的资源服务器。

- 如：我的一些分布式资源存储在 https://github.com/z2586300277/3d-file-server 仓库下 —— 访问服务: https://z2586300277.github.io/3d-file-server/

- github page 搭建 => 创建仓库 => 进入管理页面 => setting => pages => Build and deployment => source (depoly from a branch) => branch 选择对应分支 => save 即可

- 注： github page 搭建完成后 浏览器直接访问如 https://xxxx.github.io/xxxx/ 目录404整行现象，路径精确到文件后访问可正常

- 参考访问案例 如 cesium 案例 => 离线地图 => 内网高德 

- 搭建视频可参照 https://www.bilibili.com/video/BV12T94YhEQA/

## 📦 自行部署 - 助力企业

- 可通过 config/links 文件修改 所有的链接和 logo, 替换成自己的官网或者链接地址。

| 🍊 | 🍐 | 🍏 | 
| ------- | ----- | ------ |
|[elegant-github](http://z2586300277.github.io/three-cesium-examples)|[elegant-vercel](https://three-cesium-examples.vercel.app)|[openThree-github](https://openthree.github.io/three-cesium-examples/)|
|[threehub-site](https://threehub.cn) | [cesiumhub-site](http://cesiumhub.cn)| [nico-site](http://nicowebgl.cn/three-cesium-examples)|
|[codeLike-github](https://g2657.github.io/webgl-examples/)|

### 🏫 解决方案 - 项目

- 小程序threejs https://three-x.cn  、 移动端 https://meta-gate.cn 

#  💎 Three.js and Cesium.js Case Study - Generating Love - Only Open Source-
## Top 1 in China- 👋 -  Share knowledge- ⭐ -  Dianxing Assistance- ⚡ -  Update to death
#### Web3D related resources, repositories, links, effect cases, requirements, and optimization suggestions can be submitted using Issues comments ✍。
#### 3D developers record, review, share, showcase works, make friends, collaborate 🤝。 (Join the warehouse management and contact the author) 🍉)

- Embracing the future in 2025, sharing never stops - [Open Source Organization](https://openthree.github.io/three-cesium-links)Building WebGPU Open Source Cases from Scratch - [Link](https://openthree.github.io/webgpu)
- Real time preview of GitHub dev branch http://z2586300277.github.io/three-cesium-examples
- Domestic visits https://threehub.cn , can slide down to 📦  Self deployment - Assist enterprises in viewing other deployment sites 🏫。
- Due to the large and active number of people following and browsing this repository, it will be updated frequently. (Click on watch to get the latest updates) 🐸
- Follow git histroy to record every day of your life and the footprints of your developer's life history. (Click follow to monitor the author) 🍏
- Web3D knowledge recording, review, efficient searching, resource sharing in the journey of life, generating electricity for love. (Fork to submit your own work) 🍀
- The source code memory is about 10M, and the framework (Vue) and online debugging are sourced from the three editor library under the author's name - [link](https://z2586300277.github.io/three-editor/dist/#/example)
- Note: Try not to submit files exceeding 200k. Image control compression to 10k, online compression - [link](https://yasuo.xunjiepdf.com/img/)
- Leave a link for businesses to seek professional technical or personnel support, individual developers to undertake projects, sell resources, and exchange support 🐋。

##  🌳  a literary creation
####  ✋  If there are any cases that have helped you, if interested, you can submit your work to spread love to more developers
####  👏  Developers who join the repository management can create their own branches or develop directly in the dev branch
####  📑  Fork repository development - Add user information - Submit code - Merge into dev
####  🌿  Distributed Warehouse Development Model https://github.com/z2586300277/three-cesium-examples-self

- Run the framework to start the service port pointing to index.html, such as nginx Apache Node.js LiveServer, as long as the service can be started
1. Creators can enter their developer information in config/author.js, and then the ID associated with the submitted case will display the author information.
2. Place the case js in the folder cesiumExamples/threeEmples in the directory, such as ThreeEmples/basic, and put testjs in it, test.jpg,  Or directory test [test. js, test. jpg]
3. Find ThreeEmples in the config directory and enter the case information. The internal resources point to the paths corresponding to your JS and image resources
4. Note: To ensure the use of lightweight case display image resources- https://yasuo.xunjiepdf.com/img/ _(Custom compression to within 10k)_
5. If it involves other dependent JS, you can place module.js in the JS directory such as dat.gui, gasp , The injection method config/config.js is visible
6. Store audio and video models and other resources that can be shared in the files folder. Whenever possible, reference external URLs for file resources to ensure a lightweight warehouse

- Assets=>UI runtime framework does not require modification
- Config=>Configuration options [host: host, links: links, author: author information, lang: language, config: injection run]
- Files, audio and video model storage, and other resources that can be shared should be avoided as much as possible, and external URL addresses should be used to access them
- Js=>dat.gui gsap and other dependency repositories, try to use online js such as CDN to introduce them as much as possible
- ThreeEamples Three.js Case Code Catalog
- CesiumExamples cesium case code directory

```js
//HOST automatically retrieves the current domain name/IP to prevent invalid resource references in different deployment environments
{
    id: ' The unique id in list',
    name: ' Chinese Name',
    name_en: 'language English Name',
    tag: ' Tag Name - Background Color - Font Size ',
    tip: ' Prompt message ',
    author: ' Author ID ',
    imporver: 'imporver id',
    referUrl: ' Case reference source address',//if not available, do not configure
    links: [{url: 'Connect', name: ' Name '}]//Configure link referURL to not display
    image: HOST + 'threeExamples/basic/test.jpg', //  Corresponding window diagram
    codeUrl: HOST+'threExamples/basic/test.js',//js module format Most case forms
    htmlUrl: HOST+'threExamples/test/test.html '//HTML online format such as three case=>particle=>random particle particle planet
    openUrl: ' Preview the external link URL '// Choose between openURL and codeURL, as seen in the case of Taohua Pavilion Su7
    downloadUrl: ' Attached download URL ',//such as Three.js=>Advanced Case=>Peach Blossom Pavilion
    githubUrl: ' github link URL ',// Three.js=>Open source works=>su7
    meta: {
        title: ' The title of this case website is',
        keywords: ' Search engine keywords',
        description: ' This case page describes'
    }
}
```
##  🏠  Build your own distributed storage warehouse

- Architecture design is to access code in the form of request resources, such as codeURL images, etc. Resource files are not limited to being stored in this repository, such as on your own server, and then the URL can access your file, similar to a request interface.

- Then only the case information can be configured in this warehouse, which can refer to the configuration of three cases=>extended functions=>3D map cases

- Because GitHub. io is HTTPS, HTTPS access restriction: HTTP will be automatically banned. It is recommended to set up your own GitHub page and use GitHub as your resource server.

- For example, some of my distributed resources are stored in https://github.com/z2586300277/3d-file-server Under the warehouse - Access service: https://z2586300277.github.io/3d-file-server/

- GitHub page setup=>create repository=>enter management page=>settings=>pages=>build and deployment=>source (depoly from a branch)=>branch select corresponding branch=>save

- Note: After the GitHub page is built, the browser can directly access it as follows: https://xxxx.github.io/xxxx/ 404 directory full line phenomenon, access can be normal after the path is precise to the file

- Reference access cases such as Cesium case=>Offline map=>Intranet Gaode

- Building a video can refer to https://www.bilibili.com/video/BV12T94YhEQA/

<img src="https://profile-counter.glitch.me/z2586300277/count.svg" >
