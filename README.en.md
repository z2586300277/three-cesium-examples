## 💎Primitive Three.js And Cesium.js Examples - Author updated to death -

- Real time preview on GitHub after dev branch update http://z2586300277.github.io/three-cesium-examples/public/index.html

- Official website preview https://www.threelab.cn/three-cesium-examples/public/index.html

Join the repository and manage together  |  email - 2     
:-------------------------:|:-------------------------:
  2586300277@qq.com    |  2945853209@qq.com

- Node 18+is good - currently compatible with Node 14-22 versions (all dependencies of the current project have been updated to the latest version on July 2, 2024)

- It is recommended to use npm and pnpm for framework installation. Using yarn to install dependencies may result in the inability to install vue coremirror's associated dependency codemirror. You can manually install it yourself

##### 💖 - Note: Star first! Star first! Star first! Important things are to be repeated for 3 times.

##### - If any of these cases have helped you - if interested, you can submit your work - to spread love to more developers

##### - After forking the repository, add user information, upload your proudest work, submit and merge it into the main branch, and after sponsorship by kind-hearted individuals, give back love to the author (develop or merge based on dev branch)

##### - If the development only modifies the content in public without modifying the src content, there is no need to package it. If packaging is required, manually delete the public/assets directory

1. Creators can enter their developer information in public/config/author.js, and then the ID associated with the submitted case will display the author information。

2. Put the case js into the folder cesiumExamples/threeEmples in the public directory, such as testing. js, testing. jpg, or the directory test [testing. js, testing. jpg] in the folder threeEmples/basic

3. Find ThreeEmples in the config directory and enter the case information. The internal resources point to the paths corresponding to your JS and image resources

4. Note: To ensure the use of lightweight case display image resources- https://yasuo.xunjiepdf.com/img/ _(Custom compression to within 4k)_

5. If it involves other dependent JavaScript, module.js can be placed in the public/JS directory such as dat.gui, Gasp, and the injection method can be seen in fig.js

6. Store audio and video models and other resources that can be shared in the public/files folder. Whenever possible, reference external URLs for file resources

-Assets => directory after packaging
-Config => JS injection and configuration case information directory
-Files => Storage of audio and video models and other resources that can be shared. Try not to upload file resources and use external URL addresses to access them
-Js => dat.gui gsap three cesium echarts and other dependency repositories
-ThreeEmples => Three.js Case Code Catalog
-CesiumExamples => cesium case code directory

```js
{
    id: 'examples id',
    name: 'name',
    author: 'author id',
    codeUrl: '/three-cesium-examples/public/threeExamples/basic/test.js', // more exmaples
    image: '/three-cesium-examples/public/threeExamples/basic/test.jpg',
    openUrl: 'open url', // openurl and codeurl use one  see 桃花亭 su7 examples
    downloadUrl: 'download url', // see tthree.js => 高级案例 => 桃花亭
    githubUrl: 'open github repository url', // see three.js => 开源作品 => su7
    meta: {
        title: 'site title',
        keywords: 'site keywords',
        description: 'site description'
    }
}
```

## 🏠 Build your own distributed storage warehouse

-Architecture design is to access code in the form of requesting resources, so resource information such as codeURL image is not limited to being stored in this repository, such as on your own server, and then the URL can be accessed to your resource address.

-Then only the case information can be configured in this warehouse, which can refer to the configuration of three cases=>extended functions=>3D map cases

-Due to access restrictions on GitHub, HTTP will be automatically banned. It is recommended to set up your own GitHub page and use GitHub as your resource server.

-For example, some of my distributed resources are stored in https://github.com/z2586300277/3d-file-server Under the warehouse - Access service: https://z2586300277.github.io/3d-file-server/

-GitHub page setup=>create repository=>page process=>settings=>pages=>build and deployment=>source (depoly from a branch)=>branch Select the corresponding branch

-Note: After the GitHub page is built, you can directly access it as follows: https://xxxx.github.io/xxxx/ It is normal that the resource files under cannot be displayed, but they can be obtained normally in the code

-Reference access cases such as Cesium case=>Offline map=>Intranet Gaode  : Cesium案例=>离线地图=>内网高德
## 🐳 [official ThreeLab](https://threelab.cn/)  |  [China html Template](https://gitee.com/giser2017/Web3dExamples)
