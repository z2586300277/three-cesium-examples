const HOST = window.FIX_HOST || (window.origin + window.location.pathname).replace(/\/index.html$/, '/')

const FILE_HOST = 'https://z2586300277.github.io/3d-file-server/' // 文件资源服务器

export { HOST, FILE_HOST }

/* 注 部署可将 资源全部下载 然后配置成自己的资源地址即可 */