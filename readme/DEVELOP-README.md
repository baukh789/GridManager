# 开发者帮助文档
## 下载
```git
git clone https://github.com/baukh789/GridManager.git
```

## 启动
### 加载依赖包
```
	npm install
```
### 启动服务
```
npm run start
```
### 构建打包
```
npm run build
```
### 展示路径 
```
http://127.0.0.1:1987
```

## 单元测试
- 执行命令
```
npm test
```
- 测试文件路径及文件名规范
```
/test/****_text.js
```

## 发布
### 发布至github
- npm publish build
### 发布至官网
- 将build目录下的[js, css, demo, fonts]四个文件夹压缩为zip格式, 并上传至官网

## 问题汇总
### npm install 总是失败?
这是由于在国内加载时,有些依赖包无法加载导致的. 
将以 karma-phantomjs-launcher 与 phantomjs-prebuilt 移除掉再进行install, 这两个包都是用于npm run test
- karma-phantomjs-launcher  需要注意两点: 1.单独安装; 2.翻墙
```
	npm install karma-phantomjs-launcher
```
- phantomjs-prebuilt 该工具作者曾公布的解决方案 (https://stackoverflow.com/questions/40992231/failed-at-the-phantomjs-prebuilt2-1-13-install-script-node-install-js),但我发现并不是很理想.
```
	npm install phantomjs-prebuilt@2.1.13 --ignore-scripts
```

## 参与开发[需要在github提交5个以上commit]
QQ群号: 151094839
