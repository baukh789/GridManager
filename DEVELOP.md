# GridManager 开发文档

## 测试脚本
```
npm run test
```
在当前已启动服务的情况下，可通过`http://127.0.0.1:2015/chart/index.html`查看已生成的测试覆盖率。


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

### 发布后需操作
- 服务器执行installGM.sh
- 更新管理端: 版本、压维包、发布记录和API
- 发布gm-site (demo存在修改时，需要发布)
- 发布gm-test (demo存在修改时，需要发布)
- github发布releases
