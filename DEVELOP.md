# GridManager 开发文档

## 测试脚本
```
npm run test
```

## 发布脚本
```
npm version <version_category: major | minor | patch>
```

### 执行后会自动运行以下操作:
- 检查当前代码是否commit
- 执行测试脚本`npm run test`
- 执行构建脚本`npm run build`, 版本号会根据参数进行递增。`major`: 主版本, `minor`: 次版本, `patch`: 补丁
- 执行发布脚本`npm publish dist`
- 执行提交代码脚本`git push && git push --tags`

## 问题点收集
- `karma-phantomjs-launcher`在安装时，会由于github release包在下载时会跳转至一个临时连接。解决方法: 将已经下载好的包移至错误提示目录内，重新安装即可。
