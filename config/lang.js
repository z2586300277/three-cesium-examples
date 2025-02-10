let LANG_EN, local_langEn = localStorage.getItem('langEn')

if (local_langEn === null) {

    LANG_EN = !(navigator.language || navigator.userLanguage).startsWith("zh")

    localStorage.setItem('langEn', LANG_EN)

}

else LANG_EN = local_langEn === 'true'

window.TEXTS = Object.fromEntries(Object.entries({

    elegant: { zh: '优雅永不过时', en: 'Elegant' },

    '推荐': { zh: '推荐', en: 'HOT' },

    hot: { zh: '热门', en: 'HOT' },

    effect: { zh: '后期处理', en: 'Effect' },

    '编辑器': { zh: '编辑器', en: 'Editor' },

    '效果佳': { zh: '效果佳', en: 'Great' },

    '感谢BiBi': { zh: '感谢BiBi', en: 'For BiBi' },

    '共享': { zh: '共筑,共享', en: 'Share' },

    '致谢': { zh: '致谢', en: 'Thanks' },

    '音乐': { zh: '音乐', en: 'Music' },

    '扫光': { zh: '扫光', en: 'Scan' },

    '混合着色': { zh: '混合着色', en: 'Mix' },

    '文字粒子': { zh: '文字粒子', en: 'Text' },

    '漫游': { zh: '漫游', en: 'Roam' },

    'walk': { zh: '人物行走', en: 'Walk' },

    'normal': { zh: '常用', en: 'Normal' },

    '模型反射': { zh: '模型反射', en: 'Reflect' },

    '磨砂反射': { zh: '磨砂反射', en: 'Reflect' },

    '分布库': { zh: '分布库', en: 'Scatter' },

    '拆解': { zh: '拆解', en: 'Break' },

    '众多效果': { zh: '众多效果', en: 'Many' },

    '聚合': { zh: '聚合', en: 'Aggregate' },

}).map(

    ([key, value]) => [key, LANG_EN ? value.en : value.zh])

)
