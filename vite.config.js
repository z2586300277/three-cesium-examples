import { defineConfig } from 'vite'

export default defineConfig({

  base: '/three-cesium-examples/public',

  server: {

    port: 8080,

    open: 'public/index.html',

    host: '0.0.0.0'

  }

})
