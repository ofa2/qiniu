# ofa2-qiniu

add next to config/env/xxxx

```js
{
  qiniu: {
    accessKey: '',
    secretKey: '',
    scope: '',
    // 存在则会在上传时自动添加这个前缀到文件名之前, 如 `${fileKeyPrefix}/${originKey}`
    fileKeyPrefix: '',
    // 最后返回的URL的前缀
    baseUrl: 'http://cdn.cloudnapps.com',
  },
}
```
