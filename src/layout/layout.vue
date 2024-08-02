<template>
    <router-view />
    <div>
        <div class="info">
            <div class="text author" v-if="authorInfo" @click="openAuthor(authorInfo.github)"
                style="margin-bottom: 5px;">
                作者 - <img :src="authorInfo.icon" width="16px" height="16px">&nbsp;{{ authorInfo.name }}
            </div>
            <div class="flexAuthor">
                <img src="/files/site/logo.png" alt="logo" width="20px" height="20px"> &nbsp;
                <el-link class="text" @click="openUrl('web')"
                    :style="{ color: route.name === 'example' ? '#071228' : '' }">加入社区-THREELAB</el-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()

const authorInfo = ref(null)

const router = useRouter()

router.beforeEach((to, from, next) => {

    if (from.name == 'codeMirror') authorInfo.value = null

    next()
})

window.NOW_AUTHOR_INFO = authorInfo

const openAuthor = (url) => window.open(url)

const openUrl = (k) => window.open(__SITE_URLS__[k])

</script>

<style lang="less" scoped>
.info {
    position: fixed;
    line-height: 20px;
    right: 3px;
    bottom: 5px;
    z-index: 200;
    opacity: 0.9;
    font-size: 12px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;

    .author {
        display: flex;
        align-items: center;
    }

    .text {
        color: #e6e6e6;
        font-weight: bold;
        font-size: 13px;
        cursor: pointer;

        &:hover {
            color: #409eff;
        }
    }

    .flexAuthor {
        display: flex;
        align-items: center;
    }

}
</style>