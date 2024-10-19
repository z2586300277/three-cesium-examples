let HOST = window.origin + window.location.pathname

HOST = HOST.replace(/\/index.html$/, '/')

const FILE_HOST = 'https://z2586300277.github.io/3d-file-server/' // 文件资源服务器

export { HOST, FILE_HOST }

/* 注 部署可将 资源全部下载 然后配置成自己的资源地址即可 */

if (localStorage.getItem('KNOW_TIP') != 'true') localStorage.setItem('KNOW_TIP', confirm('注：因网络问题无法访问，请自行加速github, 确认后不再提示'))