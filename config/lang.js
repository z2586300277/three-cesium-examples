let LANG_EN, local_langEn = localStorage.getItem('langEn')

if (local_langEn === null) {

    LANG_EN = !(navigator.language || navigator.userLanguage).startsWith("zh")

    localStorage.setItem('langEn', LANG_EN)

}

else LANG_EN = local_langEn === 'true'

window.TEXTS = Object.fromEntries(Object.entries({

    openThree: { zh: '开源三维', en: 'OpenThree' },

    '官方': { zh: '官方', en: 'Official' },

    officials: { zh: '官方示例', en: 'Official' },

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

    'skybox': { zh: '天空盒', en: 'Skybox' },

    'smartCity': { zh: '智慧城市', en: 'SmartCity' },

    'Support': { zh: '打赏支持', en: 'Sponsor' },

    'Star': { zh: '点星助力', en: 'Star' },

    download: { zh: '下载', en: 'Download' },

    'market': { zh: '市场', en: 'Market' },

    'jiawanlong': { zh: '贾宛龙', en: 'jiawanlong' },

    '融合': { zh: '融合', en: 'Fusion' },

    tech: { zh: '科技风', en: 'Tech' },

    volume: { zh: '体渲染', en: 'Volume' },

    cores: { zh: '核心', en: 'Cores' },

}).map(

    ([key, value]) => [key, LANG_EN ? value.en : value.zh])

)
