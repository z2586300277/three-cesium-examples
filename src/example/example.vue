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
                        v-for="item in data.raw_classify_list" :key="item.pid" :index="String(item.pid)"
                        @click="changeClassify(item)">
                        <div class="flex-around">
                            {{ item.name }}
                            <el-badge class="badge" type="primary" :value="item.children.length"> </el-badge>
                        </div>
                    </el-menu-item>
                </el-menu>
            </div>
            <div class="content">
                <div class="bar">
                    <div class="num">🍀总数：{{ sum }}</div>
                    <el-input v-model="input" style="max-width: 240px" placeholder="请输入内容" class="input-with-select">
                        <template #append>
                            <el-button icon="Search" />
                        </template>
                    </el-input>
                </div>
                <div class="navigation-parent">
                    <div class="navigation" ref="navigationRef">
                        <div v-for="examples in data.classify_list">
                            <div :to="examples.pid" style="position: relative;z-index: 1;top:-40px"> </div>
                            <el-divider content-position="left">{{ examples.name }}</el-divider>
                            <div class="examples">
                                <div class="examples-item" v-for="i in examples.children">
                                    <div class="box">
                                        <div @click="showCode(i, examples)">
                                            <el-image class="image" fit="cover" :src="i.image" lazy
                                                :scroll-container="navigationRef" />
                                        </div>
                                        <div class="author" @click="openAuthor(i)">
                                            <el-image class="author-image" :src="getAuthors(i.author).icon" lazy
                                                :scroll-container="navigationRef" />
                                            <span> - {{ getAuthors(i.author).name }}</span>
                                        </div>
                                        <div class="name-content">
                                            <el-link v-if="i.githubUrl" class="text" @click="openLink(i.githubUrl)"> -
                                                {{ i.name }}
                                                -</el-link>
                                            <div class="text" v-else>{{ i.name }}</div>
                                            <div class="download" v-if="i.downloadUrl">
                                                <el-popconfirm title="下载？" @confirm="() => openLink(i.downloadUrl)">
                                                    <template #reference>
                                                        <el-link class="link"
                                                            icon="Download"></el-link>
                                                    </template>
                                                </el-popconfirm>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { onMounted, shallowReactive, ref, watch } from 'vue';

const input = ref('')

const navigationRef = ref(null)

function getAuthors(id) {

    return window.THREE_CESIUM_AUTHORS.find(i => i.id === id) || {}

}

function openAuthor(item) {

    const author = getAuthors(item.author)

    window.open(author.github)

}

const router = useRouter();

const openLink = (url) => window.open(url)

const openUrl = (k) => window.open(__SITE_URLS__[k])

const data = shallowReactive({ classify_list: [], raw_classify_list: [] })

const navigation_list = window.THREE_CESIUM_NAVIGATION

let currentNavigationName = localStorage.getItem('navigation') || navigation_list[0].name

data.raw_classify_list = (navigation_list.find(item => item.name === currentNavigationName) || navigation_list[0]).examples

const sum = ref(0)

sum.value = data.raw_classify_list.reduce((acc, item) => acc + item.children.length, 0)

data.classify_list = data.raw_classify_list

let currentClassify = ref(localStorage.getItem('classify') || data.raw_classify_list[0].pid)

const goNavigation = async (item) => {

    data.raw_classify_list = item.examples

    sum.value = data.raw_classify_list.reduce((acc, item) => acc + item.children.length, 0)

    data.classify_list = data.raw_classify_list

    const findClassify = item.examples.find(item => item.pid === currentClassify.value)

    if (!findClassify) {

        currentClassify.value = item.examples[0].pid

        localStorage.setItem('classify', item.examples[0].pid)

    }

    currentNavigationName = item.name

    localStorage.setItem('navigation', item.name)

}

const changeClassify = item => {

    navigationRef.value.querySelector(`[to="${item.pid}"]`)?.scrollIntoView({ behavior: 'smooth' })

    currentClassify.value = item.pid

    localStorage.setItem('classify', item.pid)

}

watch(() => input.value, (v) => {

    if (v) {

        data.classify_list = data.raw_classify_list.map(item => {

            return {

                ...item,

                children: item.children.map(i => {

                    if (i.name.includes(v)) return { ...i }

                }).filter(i => i)

            }

        }).filter(item => item.children.length)

    }

    else data.classify_list = data.raw_classify_list

})

onMounted(() => navigationRef.value.querySelector(`[to="${currentClassify.value}"]`)?.scrollIntoView())

const showCode = (item, examples) => {

    if (item.openUrl) return window.open(item.openUrl)

    const path = router.resolve({

        name: 'codeMirror',

        query: { navigation: currentNavigationName, classify: examples.pid, id: item.id }

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
    padding-left: 20px;
    padding-right: 20px;
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

.content {
    width: 100%;
}

.bar {
    height: 46px;
    width: 100%;
    box-shadow: -1px 3px 10px rgba(0, 0, 0, .2);
    padding-left: 20px;
    padding-right: 45px;
    box-sizing: border-box;
    display: flex;
    justify-content: space-between;
    align-items: center;
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
        overflow: scroll;
    }

    .nav::-webkit-scrollbar {
        width: 0px; //纵向滚动条的宽度
        height: 0px; //横向滚动条的高度
    }
}

.num {
    color: black;
    font-weight: bold;
}

.menuItem {
    background-color: rgba(51, 55, 93, 0.4);
}

.navigation-parent {
    width: 100%;
    height: calc(100% - 46px);
    overflow: hidden;
}

.navigation {
    width: 100%;
    height: 100%;
    overflow: scroll;
    padding: 15px 20px 20px 20px;
    box-sizing: border-box;
}

.examples {
    box-sizing: border-box;
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fill, 250px);
    grid-template-rows: repeat(auto-fill, 290px);
    overflow: scroll;
    grid-row-gap: 5px;
    grid-column-gap: 5px;

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
                transition: all 0.3s;

                &:hover {
                    box-shadow: rgba(0, 0, 0, 0.38) 0px 6px 12px, rgba(0, 0, 0, 0.23) 0px 6px 12px;
                }
            }

            .author-image {
                width: 16px;
                height: 16px;
            }
        }
    }
}

.gitLink {
    height: 100%;
    width: 80px;
    margin-left: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    img {
        cursor: pointer;
        transition: all 0.3s;
        &:hover {
            width: 40px;
            height: 40px;
        }
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
        // 发光
        text-shadow: 0 0 10px #85d7e0;
    }
}

.name-content {
    width: 100%;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;

    .download {
        position: absolute;
        display: flex;
        width: 100%;
        justify-content: flex-end;

        .link {
            color: rgb(51, 105, 153);
            font-size: 20px;
            margin-right: 6px;

            :hover {
                color: #71a5ee;
            }
        }
    }
}

.text {
    font-size: 14px;
    color: #1e232e;
}

.badge {
    display: flex;
    align-items: center;
    font-weight: 500;
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

//deep是深度选择器，表示选择所有的子孙元素
:deep(.el-input__inner) {
    color: #071228;
}
</style>