<template>
    <div class="main">
        <div class="top">
            <div class="top-title" @click="openUrl('web')">
                <img class="logo" src="/files/site/logo.png" alt="logo" width="36px" height="36px">
                <div class="top-title-text">三界® THREELAB</div>
            </div>
            <el-menu class="menu" style="border: none;" :default-active="currentNavigationName" mode="horizontal"
                :ellipsis="false" active-text-color="#fff" text-color="#fff" :default-openeds="[currentNavigationName]">
                <el-menu-item v-for="item in navigation_list" :key="item.name" :index="String(item.name)"
                    @click="goNavigation(item)">
                    {{ item.name }}
                </el-menu-item>
                <div class="gitLink">
                    源码
                    <img @click="openUrl('gitee')" src="/files/site/gitee.png" alt="logo" width="36px" height="36px">
                    <img @click="openUrl('github')" src="/files/site/github.png" alt="logo" width="36px" height="36px">
                </div>
            </el-menu>
        </div>
        <div class="center">
            <div class="nav">
                <el-menu class="menu" style="border: none;" :default-active="currentClassify" :ellipsis="false"
                    text-color="#fff" active-text-color="#71a5ee">
                    <el-menu-item :class="{ 'menuItem': item.pid == currentClassify }"
                        v-for="item in data.classify_list" :key="item.pid" :index="String(item.pid)"
                        @click="changeClassify(item)">
                        <div class="flex-around">
                            {{ item.name }}
                            <el-badge class="badge" type="primary" :value="item.children.length"> </el-badge>
                        </div>
                    </el-menu-item>
                </el-menu>
            </div>
            <div class="examples">
                <div class="examples-item" v-for="i, k in data.examples_list">
                    <div class="box">
                        <el-image class="image" @click="showCode(i)" fit="cover" :src="i.image" lazy />
                        <div class="author" @click="openAuthor(i)">
                            <img :src="getAuthors(i.author).icon" width="16px" height="16px">
                            <span> - {{ getAuthors(i.author).name }}</span>
                        </div>
                        <div class="text">{{ i.name }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { reactive } from 'vue';

function getAuthors(id) {

    return window.THREE_CESIUM_AUTHORS.find(i => i.id === id) || {}

}

function openAuthor(item) {

    const author = getAuthors(item.author)

    window.open(author.github)

}

const router = useRouter();

const openUrl = (k) => window.open(__SITE_URLS__[k])

const data = reactive({

    classify_list: [],

    examples_list: []

})

const navigation_list = window.THREE_CESIUM_NAVIGATION

let currentNavigationName = localStorage.getItem('navigation') || navigation_list[0].name

const classify_list = (navigation_list.find(item => item.name === currentNavigationName) || navigation_list[0]).examples

data.classify_list = classify_list

let currentClassify = localStorage.getItem('classify') || classify_list[0].pid

const goNavigation = async (item) => {

    data.classify_list = item.examples

    const findClassify = item.examples.find(item => item.pid === currentClassify)

    if (!findClassify) {

        currentClassify = item.examples[0].pid

        data.examples_list = item.examples[0].children

        localStorage.setItem('classify', item.examples[0].pid)

    }

    else data.examples_list = findClassify.children

    currentNavigationName = item.name

    localStorage.setItem('navigation', item.name)

}

const changeClassify = item => {

    data.examples_list = item.children

    currentClassify = item.pid

    localStorage.setItem('classify', item.pid)

}

const examples_list = (classify_list.find(item => item.pid === currentClassify) || classify_list[0]).children

data.examples_list = examples_list

const showCode = (item) => {

    if (item.openUrl) return window.open(item.openUrl)

    const path = router.resolve({

        name: 'codeMirror',

        query: { navigation: currentNavigationName, classify: currentClassify, id: item.id }

    }).href

    window.open(path)

};

</script>

<style lang="less" scoped>
.main {
    width: 100vw;
    height: 100vh;
    background-color: #fff;
    overflow: hidden;
}

.top {
    width: 100vw;
    height: 70px;
    box-sizing: border-box;
    padding-left: 40px;
    padding-right: 40px;
    background-color: #071228;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 22px;
    font-weight: 700;
    color: #fff;
    border-bottom: 1px solid #636871;
    box-shadow: 0 1px 1px 0 rgba(19, 18, 18, 0.7);

    &-title {
        display: flex;
        align-items: center;
        cursor: pointer;

        &-text {
            margin-left: 10px;
        }
    }
}

.center {
    display: flex;
    background-color: none;
    height: calc(100vh - 70px);
    box-sizing: border-box;
    width: 100%;

    .nav {
        background: linear-gradient(180deg, #101b2e, #071228);
        height: 100%;
        padding-top: 10px;
        box-sizing: border-box;
        font-weight: 550;
        width: 240px;
    }
}

.menuItem {
    background-color: rgba(51, 55, 93, 0.4);
}

.examples {
    padding: 20px;
    box-sizing: border-box;
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fill, 250px);
    grid-template-rows: repeat(auto-fill, 290px);
    overflow: scroll;
    grid-row-gap: 5px;
    grid-column-gap: 10px;

    &-item {
        width: 250px;
        height: 290px;
        display: flex;
        justify-content: center;
        align-items: center;

        .box {
            padding: 20px 8px 8px 8px;
            box-sizing: border-box;
            width: 230px;
            height: 270px;
            overflow: hidden;
            box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
            border-radius: 3px;
            color: rgb(17, 17, 17);
            display: flex;
            flex-direction: column;
            align-items: center;
            cursor: pointer;
            justify-content: space-between;

            .image {
                width: 190px;
                height: 190px;
                display: flex;
                overflow: hidden;
                justify-content: center;
                align-items: center;
                border-radius: 3px;

                img {
                    border-radius: 3px;
                    width: 190px;
                    height: 190px;

                    &:hover {
                        transform: scale(1.8);
                        transition: all 0.5s;
                    }
                }
            }
        }
    }
}

.gitLink {
    height: 100%;
    width: 120px;
    margin-left: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    img {
        cursor: pointer;
    }
}

.author {
    font-size: 13px;
    transition: all 0.3s;
    display: flex;
    align-items: center;

    span {
        margin-left: 8px;
    }

    &:hover {
        color: #71a5ee;
    }
}

.text {
    font-size: 16px;
}

.badge {
    display: flex;
    align-items: center;
}

.flex-around {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

::-webkit-scrollbar {
    width: 6px; //纵向滚动条的宽度
    height: 6px; //横向滚动条的高度
}

//滚动条滑块
::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background: rgba(171, 190, 228, 0.3);
}
</style>