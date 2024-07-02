<template>
    <div class="iframeParent" ref="iframeParent"></div>
</template>

<script setup>
import { ref } from 'vue'

const iframeParent = ref(null)

const getScript = (v, t) => (t === 'cesiumjs' ? '<link rel="stylesheet" href="/three-editor/dist/cesium/style.css">' : '') +

    `<style>
        body {
            margin: 0;
            padding: 1px;
            box-sizing: border-box;
            background-color: #1f1f1f;
            overflow: hidden;
        }
        #box {
            width: 100%;
            height: 100%;
        }
    </style>
    <div id="box"></div>
    <script type="module">
        ${t === 'cesiumjs' ? 'window.CESIUM_BASE_URL = "/three-editor/dist/cesium"' : ''}
        ${v}
    <\/script>`

defineExpose({

    usePreview: (v, t) => {

        const frame = document.createElement('iframe')

        frame.style = 'width: 100%; height: 100%; border: none;'

        iframeParent.value.appendChild(frame)

        const script = getScript(v, t)

        frame.contentWindow.document.open()

        frame.contentWindow.document.write(script)

        frame.contentWindow.document.close()

        frame.onload = () => iframeParent.value.childNodes.length > 1 && iframeParent.value.removeChild(iframeParent.value.childNodes[0])

    }

});

</script>

<style lang="less" scoped>
.iframeParent {
    width: 100%;
    height: 100%;
    overflow: hidden;
}
</style>