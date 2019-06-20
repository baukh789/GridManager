# GridManager.js
> 快速、灵活的对Table标签进行实例化，让Table标签充满活力。

![image](https://s2.ax1x.com/2019/04/16/AxA4xK.png)
[![Build Status](https://travis-ci.org/baukh789/GridManager.svg?branch=master&style=flat-square)](https://travis-ci.org/baukh789/GridManager)
[![npm version](https://img.shields.io/npm/v/gridmanager.svg?style=flat-square)](https://www.npmjs.com/package/gridmanager)
[![npm downloads](https://img.shields.io/npm/dt/gridmanager.svg?style=flat-square)](https://www.npmjs.com/package/gridmanager)
[![coverage](https://img.shields.io/codecov/c/github/baukh789/GridManager.svg?style=flat-square)](https://codecov.io/gh/baukh789/GridManager)

## 实现功能
| 功能 | 描述 | 
| -: | :- | 
| 宽度调整 | 表格的列宽度可进行拖拽式调整 | 
| 位置更换 | 表格的列位置进行拖拽式调整 |
| 配置列 | 可通过配置对列进行显示隐藏转换 |
| 表头吸顶 | 在表存在可视区域的情况下,表头将一直存在于顶部 |
| 排序 | 表格单项排序或组合排序 |
| 分页 | 表格ajax分页,包含选择每页显示总条数和跳转至指定页功能 |
| 用户偏好记忆 | 记住用户行为,含用户调整的列宽、列顺序、列可视状态及每页显示条数 |
| 序号 | 自动生成序号列 |
| 全选 | 自动生成全选列 |
| 导出 | 当前页数据下载,和仅针对已选中的表格下载 |
| 右键菜单 | 常用功能在菜单中可进行快捷操作 |
| 过滤 | 通过对列进行过滤达到快速搜索效果 |

## 安装
```javascript
npm install gridmanager --save
```

## 引用
### ES6+
```
import 'gridmanager/css/gm.css';
import GridManager from 'gridmanager';
```

### ES5
```
<link rel="stylesheet" href="/node_modules/gridmanager/css/gm.css">
<script src="/node_modules/gridmanager/js/gm.js"></script>
```

## API
- [API](http://gridmanager.lovejavascript.com/api/index.html)

## Demo
- [简单的示例](http://gridmanager.lovejavascript.com/demo/index.html)
- [复杂的示例](http://develop.lovejavascript.com/node_modules/gridmanager/demo/index.html)

## 相关链接
- [GridManager by Angular 1.x](https://github.com/baukh789/GridManager-Angular-1.x)
- [GridManager by Vue](https://github.com/baukh789/GridManager-Vue)
- [GridManager by React](https://github.com/baukh789/GridManager-React)

## 示例
### 使用默认配置
```html
<table></table>
```
```javascript
document.querySelector('table').GM({
	gridManagerName: 'demo-baseCode',
    ajax_url: 'https://www.lovejavascript.com/learnLinkManager/getLearnLinkList',
    ajax_type: 'POST',
    query: {pluginId: 1},
    columnData: [
        {
            key: 'name',
            text: '名称'
        },{
            key: 'info',
            text: '使用说明'
        },{
            key: 'url',
            text: 'url'
        }
    ]
});
```

### 使用分页
```html
<table></table>
```
```javascript
document.querySelector('table').GM({
	gridManagerName: 'demo-ajaxPageCode',
    ajax_url: 'https://www.lovejavascript.com/learnLinkManager/getLearnLinkList',
    ajax_type: 'POST'
    query: {pluginId: 1},
    supportAjaxPage: true,
    columnData: [
        {
            key: 'name',
            text: 'name'
        },{
            key: 'info',
            text: 'info'
        },{
            key: 'url',
            text: 'url'
        }
    ]
});
```

### 调用公开方法
```javascript
// 刷新
GM.refreshGrid('demo-ajaxPageCode');

// 更新查询条件
GM.setQuery('demo-ajaxPageCode', {name: 'baukh'});
```

其它更多请直接访问[API](http://gridmanager.lovejavascript.com/api/index.html)

## 数据格式
> 这是标准格式, 如果返回格式不同。可以通过参数或responseHandler进行修改。 具体请参考[API](http://gridmanager.lovejavascript.com/api/index.html#responseHandler)

```javascript
{
    "data":[{
        "name": "baukh",
        "age": "28",
        "createDate": "2015-03-12",
        "info": "野生前端程序",
        "operation": "修改"
    },
    {
        "name": "baukh",
        "age": "28",
        "createDate": "2015-03-12",
        "info": "野生前端程序",
        "operation": "修改"
    },
    {
        "name": "baukh",
        "age": "28",
        "createDate": "2015-03-12",
        "info": "野生前端程序",
        "operation": "修改"
    }],
    "totals": 1682
}
```

## 皮肤
> 以下皮肤为第三方提供，如果你也有过好的实现，请提交至 [issues](https://github.com/baukh789/GridManager/issues)

- [ccms-skin](https://github.com/BoWang816/GridManager-ccms-skin)
- [element-skin](https://github.com/xtfan21/GridManager-element-skin)

## 贡献者
<table>
<tr>
    <td>
        <a href="https://github.com/BoWang816">
            <img alt="" width="100" height="100" class="avatar width-full rounded-2" src="https://avatars2.githubusercontent.com/u/26587649?s=460&v=4">
            <div style="text-align:center">BoWang816</div>
        </a>
    </td>
    <td>
        <a href="https://github.com/luchyrabbit">
            <img alt="" width="100" height="100" class="avatar width-full rounded-2" src="https://avatars0.githubusercontent.com/u/21122430?s=460&v=4">
            <div style="text-align:center">luchyrabbit</div>
        </a>
    </td>
    <td>
        <a href="https://github.com/xtfan21">
            <img alt="" width="100" height="100" class="avatar width-full rounded-2" src="https://avatars2.githubusercontent.com/u/23092282?s=460&v=4">
            <div style="text-align:center">xtfan21</div>
        </a>
    </td>
    <td>
        <a href="https://github.com/gaochaodd">
            <img alt="" width="100" height="100" class="avatar width-full rounded-2" src="https://avatars3.githubusercontent.com/u/19342927?s=460&v=4">
            <div style="text-align:center">gaochaodd</div>
        </a>
    </td>
    <td>
        <a href="https://github.com/silence717">
            <img alt="" width="100" height="100" class="avatar width-full rounded-2" src="https://avatars2.githubusercontent.com/u/8267830?s=460&amp;v=4">
            <div style="text-align:center">silence717</div>
        </a>
    </td>
</tr>
</table>

## License
- [License](/LICENSE)

## 浏览器兼容
- Firefox, Chrome
- 这里提一下为什么不支持IE: 使用表格插件的大都是管理平台或系统,通常都是会进行浏览器指定,所以设计之初就没有考虑这个方面.
