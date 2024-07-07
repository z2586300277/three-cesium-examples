import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({

  plugins: [

    {
      transformIndexHtml: html => html.replace(
        /<head>/,
        `<head><script type="module" src="/three-cesium-examples/public/config/config.js"></script>`
      )
    },
    
    vue()

  ],

  define: {

    __SITE_URLS__: {

      gitee: 'https://gitee.com/giser2017/three-cesium-examples',

      github: 'https://github.com/z2586300277/three-cesium-examples',

      web: "http://threelab.cn/"

    },

  },

  build: {

    outDir: 'public',

    emptyOutDir: false, // 不删除输出目录中的旧资源

    target: 'es2015',

    chunkSizeWarningLimit: 999999, // 最大打包体积

    assetsInlineLimit: 0, // 资源内联限制

    copyPublicDir: false,

    cssCodeSplit: false, // css代码分割

  },

  base: '/three-cesium-examples/public',

  server: {

    port: 3344,

    open: true,

    host: '0.0.0.0'

  }

})
