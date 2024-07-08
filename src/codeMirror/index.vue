<template>
   <transition name="el-zoom-in-left">
      <Codemirror v-show="expand" v-model="jsCode" placeholder="代码..." :style="{ height: '100vh', width: '50vw' }"
         :autofocus="true" :indent-with-tab="true" :tab-size="2" :extensions="extensions" @ready="handleReady" />
   </transition>
   <div :class="expand ? 'boxIframe' : 'boxIframe2'">
      <Preview ref="preview" />
   </div>
   <div class="lico" :style="{ left: expand ? 'calc(50vw - 4px)' : '0px' }">
      <el-icon class="icon" @click="changeExpand(!expand)">
         <Expand v-if="!expand" />
         <Fold v-else />
      </el-icon>
   </div>
   <el-button v-show="expand" plain icon="CaretRight" @click="useCode" class="btn">执行</el-button>
</template>

<script setup>
import { onMounted, ref, shallowRef } from 'vue'
import Preview from './preview.vue'
import { Codemirror } from 'vue-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { oneDark } from '@codemirror/theme-one-dark'
import { useRoute } from 'vue-router'
import { setMetaContent } from '../router'

const { query } = useRoute()

const example_expand = localStorage.getItem('example_expand')

const expand = ref(example_expand ? example_expand === 'true' : true)

const changeExpand = v => {

   expand.value = v

   localStorage.setItem('example_expand', v)

}

const list = window.THREE_CESIUM_NAVIGATION

let currentExample = list.find(item => item.name === query.navigation)?.examples.find(item => item.pid === query.classify)?.children.find(i => i.id === query.id)

if (!currentExample) {

   const randomExample1 = list[0].examples[Math.round(Math.random() * (list[0].examples.length - 1))]

   currentExample = randomExample1.children[Math.round(Math.random() * (randomExample1.children.length - 1))]

}

function getAuthors(id) {

   return window.THREE_CESIUM_AUTHORS.find(i => i.id === id) || {}

}

window.NOW_AUTHOR_INFO = getAuthors(currentExample.author)

if (currentExample?.meta) setMetaContent(currentExample.meta)

async function getExampleCode(url) {

   const code_text = await fetch(url).then(res => res.text())

   jsCode.value = code_text

}

const jsCode = ref()

const extensions = [javascript(), oneDark]

const preview = ref()

const view = shallowRef()

const handleReady = (payload) => view.value = payload.view // 获取view

onMounted(async () => {

   await getExampleCode(currentExample.codeUrl)

   preview.value.usePreview(jsCode.value, query.navigation)

}) // 初始执行

const useCode = () => preview.value.usePreview(jsCode.value, query.navigation) // 执行

</script>

<style lang="less" scoped>
.btn {
   position: absolute;
   top: 0px;
   z-index: 1;
   left: calc(50vw - 80px);
   border: none;
   background-color: none;
}

.boxIframe {
   position: absolute;
   top: 0;
   left: 50vw;
   width: 50vw;
   height: 100vh;
   display: flex;
   box-sizing: border-box;
}

.boxIframe2 {
   position: absolute;
   top: 0;
   left: 0;
   width: 100vw;
   height: 100vh;
   display: flex;
   box-sizing: border-box;
}

.lico {
   position: absolute;
   z-index: 3;
   top: 0px;

   .icon {
      font-size: 30px;
      color: #fff;
      cursor: pointer;
      transition: all 0.8s;

      &:hover {
         transform: rotate(180deg);
      }
   }
}
</style>