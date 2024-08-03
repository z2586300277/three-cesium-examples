<template>
    <div class="wathrMark" ref="wathrMark">
        <div class="iframeParent" ref="iframeParent"></div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'

const wathrMark = ref(null)

const iframeParent = ref(null)

class WaterMark {
    constructor(inputText = '', inputAllowDele = false, inputDestroy = false) {
        this.inputText = '开源不易,尊重作者--' + inputText
        this.inputAllowDele = inputAllowDele
        this.inputDestroy = inputDestroy
        this.maskDiv = {}
    }
    init(targetElement) {
        let canvas = document.createElement('canvas');
        canvas.id = 'canvas';
        canvas.width = targetElement.clientWidth / 3;
        canvas.height = targetElement.clientHeight / 3;
        this.maskDiv = document.createElement('div');
        let ctx = canvas.getContext('2d');
        ctx.font = 'normal 18px Microsoft Yahei';
        ctx.fillStyle = 'rgb(255, 255, 255, 0.1)';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(-30 * Math.PI / 180);
        ctx.fillText(this.inputText, 0, 0);
        let src = canvas.toDataURL('image/png');
        this.maskDiv.style.position = 'absolute';
        this.maskDiv.style.zIndex = '9999';
        this.maskDiv.id = '_waterMark';
        this.maskDiv.style.top = '0';
        this.maskDiv.style.left = '0';
        this.maskDiv.style.width = '100%';
        this.maskDiv.style.height = '100%';
        this.maskDiv.style.pointerEvents = 'none';
        this.maskDiv.style.backgroundImage = 'URL(' + src + ')';
        targetElement.style.position = 'relative';
        targetElement.appendChild(this.maskDiv);
        if (!this.inputAllowDele) {
            this.monitor(targetElement);
        }
    }
    monitor(targetElement) {
        let options = {
            childList: true,
            attributes: true,
            characterData: true,
            subtree: true,
            attributeOldValue: true,
            characterDataOldValue: true
        };
        let observer = new MutationObserver(this.callback.bind(this, targetElement));
        observer.observe(targetElement, options);
    }
    callback(targetElement, mutations, observer) {
        if (mutations[0].target.id === '_waterMark') {
            this.removeMaskDiv(targetElement);
        }
        if (mutations[0].attributeName === 'id') {
            this.removeMaskDiv(targetElement);
            this.init(targetElement);
        }
        if (mutations[0].removedNodes[0] && mutations[0].removedNodes[0].id === '_waterMark') {
            this.init(targetElement);
        }
    }
    removeMaskDiv(targetElement) {
        targetElement.removeChild(this.maskDiv);
    }
    createMaskDiv(targetElement) {
        this.init(targetElement);
    }
    destroy(targetElement) {
        if (this.inputDestroy) {
            this.removeMaskDiv(targetElement);
        }
    }
}

onMounted(() => new WaterMark(window?.NOW_AUTHOR_INFO?.value?.name, false, false).init(wathrMark.value))

defineExpose({

    usePreview: (v, t, dependent) => {

        const frame = document.createElement('iframe')

        frame.style = 'width: 100%; height: 100%; border: none;'

        iframeParent.value.appendChild(frame)

        const script = window.GET_SCRIPT(v, t, dependent)

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

.wathrMark {
    width: 100%;
    height: 100%;
}
</style>