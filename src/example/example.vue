<template>
    <div class="main">
        <div class="top">
            <div class="top-title" @click="openUrl('github')">
                <img class="logo" src="/site.png" alt="logo" width="36px" height="36px">
                <div class="top-title-text">3D案例社区</div>
            </div>
            <el-menu class="menu" style="border: none;" :default-active="initPath" mode="horizontal" :ellipsis="false"
                active-text-color="#fff" text-color="#fff" :default-openeds="['0']">
                <el-menu-item v-for="(item, index) in list" :key="index" :index="String(item.path)"
                    @click="goRouter(item.path)">
                    {{ item.name }}
                </el-menu-item>
            </el-menu>
        </div>
        <div class="center">
            <div class="nav">
                <el-menu class="menu" style="border: none;" default-active="0" :ellipsis="false" text-color="#fff"
                    active-text-color="#71a5ee">
                    <el-menu-item :class="{ 'menuItem': index == active }" v-for="(item, index) in data.exampleList"
                        :key="index" :index="String(index)" @click="changeActive(index, item)">
                        {{ item.name }}
                    </el-menu-item>
                </el-menu>
            </div>
            <div class="examples">
                <div class="examples-item" v-for="i, k in data.activeList">
                    <div class="box" @click="showCode(i)">
                        <img :src="i.image" />
                        <div>{{ i.name }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const openUrl = (k) => window.open(__SITE_URLS__[k])

const data = reactive({ exampleList: [], activeList: [] })

const list = [

    // { name: 'Three-Editor案例', path: 'threeEditor', list: ThreeEditorExamples },

    // { name: 'Three.js案例', path: 'threejs', list: ThreeJsExamples },

    // { name: 'Cesium.js案例', path: 'cesiumjs', list: CesiumJsExamples },

]

const goRouter = (path) => {

    data.exampleList = list.find(item => item.path === path)?.list

    localStorage.setItem('example_path', path)

    changeActive(0)

}

const active = ref(0)

const changeActive = (index) => {

    data.activeList = data.exampleList?.[index]?.children

    active.value = index

    localStorage.setItem('example_active', index)

}

const showCode = (item) => {

    const path = router.resolve({

        name: 'codeMirror',

        query: { example_path: localStorage.getItem('example_path'), example_active: localStorage.getItem('example_active'), key: item.key }

    }).href

    window.open(path)

}

const initPath = localStorage.getItem('example_path') || 'threeEditor'

const initActive = localStorage.getItem('example_active') || 0

goRouter(initPath)

changeActive(initActive);

window.addEventListener('resize', () => {

    console.log('resize')

})
</script>

<style lang="less" scoped>
.main {
    width: 100vw;
    height: 100vh;
    background-color: #fff;
}

.top {
    width: 100vw;
    height: 70px;
    box-sizing: border-box;
    padding-left: 50px;
    padding-right: 50px;
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
        width: 240px;
        padding-top: 10px;
        box-sizing: border-box;
        font-weight: 550;
    }
}

.menuItem {
    background-color: rgba(51, 55, 93, 0.4);
}

.examples {
    margin: 20px;
    box-sizing: border-box;
    width: calc(100% - 240px);
    display: grid;
    grid-template-columns: repeat(auto-fill, 280px);
    grid-template-rows: repeat(auto-fill, 280px);
    overflow: scroll;
    grid-gap: 5px;

    &-item {
        width: 280px;
        height: 280px;
        display: flex;
        justify-content: center;
        align-items: center;

        .box {
            width: 250px;
            height: 260px;
            box-shadow: rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
            border-radius: 3px;
            color: rgb(17, 17, 17);
            display: flex;
            flex-direction: column;
            align-items: center;
            cursor: pointer;
            justify-content: space-evenly;

            img {
                margin-top: 10px;
                border-radius: 3px;
                width: 200px;
                height: 180px;

                &:hover {
                    transform: scale(1.1);
                    transition: all 0.5s;
                }
            }
        }
    }
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