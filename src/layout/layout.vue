<template>
    <router-view />
    <div v-show="isShow">
        <div class="info">
            <div class="text author" v-if="authorInfo.value" @click="openAuthor(authorInfo.value.github)">
                作者 - <img :src="authorInfo.value.icon" width="16px" height="16px">{{ authorInfo.value.name }}
            </div>
            <div class="flexAuthor">
                <img src="/files/site/logo.png" alt="logo" width="20px" height="20px"> &nbsp;
                <el-link class="text" @click="openUrl('web')">加入社区-THREELAB</el-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const authorInfo = reactive({ value: null })

const openAuthor = (url) => window.open(url)

onMounted(() => {

    if (route.name === 'codeMirror') {

        authorInfo.value = window.NOW_AUTHOR_INFO

    }

})

const isShow = ref(!localStorage.getItem('hide_author_info'))

const openUrl = (k) => window.open(__SITE_URLS__[k])

</script>

<style lang="less" scoped>
.info {
    position: fixed;
    line-height: 20px;
    bottom: 5px;
    z-index: 200;
    opacity: 0.9;
    margin-right: 2px;
    font-size: 11px;
    display: flex;
    flex-direction: column;

    .author {
        display: flex;
        align-items: center;
    }

    .text {
        color: #cfd3dc;
        font-weight: bold;
        font-size: 12px;
        transition: all 0.3s;
        cursor: pointer;

        &:hover {
            color: #4ec4e4;
        }
    }

    .flexAuthor {
        display: flex;
        align-items: center;
    }

}
</style>