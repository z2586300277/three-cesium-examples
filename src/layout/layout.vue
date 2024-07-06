<template>
    <router-view />
    <div v-show="isShow">
        <div class="info">
            <div class="text"> - 加入社区 </div>
            <div class="text"> - QQ 2586300277</div>
            <div class="flexAuthor">
                <img src="/site.png" alt="logo" width="20px" height="20px"> &nbsp;
                <el-link class="text" @click="openUrl('author')">@优雅永不过时</el-link>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'

const isShow = ref(!localStorage.getItem('hide_author_info'))

const openUrl = (k) => window.open(__SITE_URLS__[k])

/* rem 配置 */
window.addEventListener('resize', () => document.documentElement.style.fontSize = document.documentElement.clientWidth / 1920 * 16 + 'px')

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

    .text {
        color: #cfd3dc;
        font-weight: bold;
        font-size: 12px;
    }

    .flexAuthor {
        display: flex;
        align-items: center;
    }

}
</style>