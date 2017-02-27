#开发者帮助文档
##下载
```git
git clone https://github.com/baukh789/GridManager.git
```
##启动
- 启动命令
```javascript
node server.js
```
- 展示路径 
```
127.0.0.1:1987/build/demo/index.html
```
##单元测试
- 执行命令
```
npm test
```
- 测试文件路径及文件名规范
```
/test/****_text.js
```
##问题汇总
- npm install 总是失败?
这是由于在国内加载时,有些依赖包无法加载导致的. 可以将package.json中的( karma-phantomjs-launcher )移除掉再进行install.

##联系我
QQ群号: 452781895
