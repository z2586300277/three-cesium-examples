import { createRouter, createWebHashHistory } from 'vue-router'

import layout from '../layout/layout.vue'
import example from '../example/example.vue'
import codeMirror from '../codeMirror/index.vue'

const routes = [
  {
    path: '',
    component: layout,
    redirect: '/example',
    children: [
      {
        name: 'example',
        path: '/example',
        component: example,
        meta: {
          title: 'web3D功能案例',
          keywords: 'threejs,cesium,功能案例',
          description: '三维低代码编辑器相关功能案例,threejs功能案例'
        }
      },
      {
        name: 'codeMirror',
        path: '/codeMirror',
        component: codeMirror
      }
    ]
  }
]

const router = createRouter({ history: createWebHashHistory(), routes })

router.beforeEach((to, from, next) => {

  if (to.meta) setMetaContent(to.meta)

  next()

})

export function setMetaContent(meta) {

  if (meta.title) document.title = meta.title

  if (meta.keywords) document.querySelector('meta[name="keywords"]').setAttribute('content', meta.keywords)

  if (meta.description) document.querySelector('meta[name="description"]').setAttribute('content', meta.description)

}

export default router
