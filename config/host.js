let HOST = window.origin + window.location.pathname

HOST = HOST.replace(/\/index.html$/, '/')

console.log('当前域名/ip资源前缀设置:', HOST)

export { HOST }