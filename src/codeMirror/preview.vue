<template>
    <div class="iframeParent" ref="iframeParent"></div>
</template>

<script setup>
import { ref } from 'vue'

const iframeParent = ref(null)

defineExpose({

    usePreview: (v, t) => {

        const frame = document.createElement('iframe')

        frame.style = 'width: 100%; height: 100%; border: none;'

        iframeParent.value.appendChild(frame)

        const script = window.GET_SCRIPT(v, t)

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