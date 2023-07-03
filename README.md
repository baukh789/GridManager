# GridManager [一套代码多框架运行]
> 快速、灵活的对Table标签进行实例化，让Table标签充满活力。

![image](https://s2.ax1x.com/2019/04/16/AxA4xK.png)
[![Build Status](https://travis-ci.org/baukh789/GridManager.svg?branch=master&style=flat-square)](https://travis-ci.org/baukh789/GridManager)
[![npm version](https://img.shields.io/npm/v/gridmanager.svg?style=flat-square)](https://www.npmjs.com/package/gridmanager)
[![npm downloads](https://img.shields.io/npm/dt/gridmanager.svg?style=flat-square)](https://www.npmjs.com/package/gridmanager)
[![coverage](https://img.shields.io/codecov/c/github/baukh789/GridManager.svg?style=flat-square)](https://codecov.io/gh/baukh789/GridManager)

## 优势
在支持常见功能的前提下，提供了如: 导出、打印、列配置、右键菜单、行列移动、用户偏好记忆等提升用户体验的功能。

内置基础类库jTool, 对原生DOM提供了缓存机制。

支持在原生JS、jQuery、Angular 1.x、Vue、React环境下使用，一套代码多框架运行。

在框架满天飞的时代，助力前端开发人员用更少的API做更多的事情。

## 实现功能
| 功能 | 描述 |
| -: | :- |
| 宽度调整 | 表格的列宽度可进行拖拽式调整 |
| 位置更换 | 表格的列位置进行拖拽式调整 |
| 配置列 | 可通过配置对列进行显示隐藏转换 |
| 表头吸顶 | 在表存在可视区域的情况下,表头将一直存在于顶部 |
| 列固定 | 指定某列固定在左侧或右侧 |
| 排序 | 表格单项排序或组合排序 |
| 分页 | 表格ajax分页,包含选择每页显示总条数和跳转至指定页功能 |
| 用户偏好记忆 | 记住用户行为,含用户调整的列宽、列顺序、列可视状态及每页显示条数 |
| 序号 | 自动生成序号列 |
| 全选 | 自动生成全选列 |
| 导出 | 静态数据导出、动态数据导出、已选数据导出 |
| 打印 | 当前页打印 |
| 右键菜单 | 常用功能在菜单中可进行快捷操作 |
| 过滤 | 通过对列进行过滤达到快速搜索效果 |
| 合并 | 同一列下相同值的单元格可自动合并 |
| 树表格 | 可通过配置快速实现树型表格结构 |
| 行移动 | 可通过配置快速实现行位置移动 |
| 嵌套表头 | 无层级限制配置复杂的表格实例 |

## 安装
```
npm install gridmanager --save
```

### 安装文件目录及说明
- index.css `样式文件，原生及框架使用同一份样式文件`
- index.js `原生使用的js文件`
- vue2 `vue2框架使用的js文件`
- react `react框架使用的js文件`
- angular-1.x.js `angular1.x使用的js文件`

## 引用
### ES6+
```
import 'gridmanager/index.css'; // 各框架通过样式文件
import GridManager from 'gridmanager'; // 原生js引用方式
import GridManager from 'gridmanager/vue2'; // vu2引用方式
import GridManager from 'gridmanager/react'; // react引用方式
import GridManager from 'gridmanager/angular-1.x'; // angular-1.x引用方式
```

### ES5
```
<link rel="stylesheet" href="gridmanager/index.css">
<script src="gridmanager/index.js"></script>
```

## API
- [API](https://gridmanager.lovejavascript.com/api/index.html)

## Demo
- [简单的示例](https://gridmanager.lovejavascript.com/demo/index.html)
- [复杂的示例](https://develop.lovejavascript.com/)

## 框架版本介绍
- [GridManager by Angular 1.x](https://github.com/baukh789/GridManager/tree/master/src/framework/angular-1.x/README.md)
- [GridManager by Vue](https://github.com/baukh789/GridManager/tree/master/src/framework/vue/README.md)
- [GridManager by React](https://github.com/baukh789/GridManager/tree/master/src/framework/react/README.md)

## 示例
### 使用默认配置
```html
<table></table>
```
```javascript
document.querySelector('table').GM({
    gridManagerName: 'demo-baseCode',
    ajaxData: 'https://www.lovejavascript.com/learnLinkManager/getLearnLinkList',
    ajaxType: 'POST',
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
    ajaxData: 'https://www.lovejavascript.com/learnLinkManager/getLearnLinkList',
    ajaxType: 'POST',
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

其它更多请直接访问[API](https://gridmanager.lovejavascript.com/api/index.html)

## 数据格式
> 这是标准格式, 如果返回格式不同。可以通过参数或responseHandler进行修改。 具体请参考[API](https://gridmanager.lovejavascript.com/api/index.html#responseHandler)

```
{
    "data": [
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
        },
        {
            "name": "baukh",
            "age": "28",
            "createDate": "2015-03-12",
            "info": "野生前端程序",
            "operation": "修改"
        }
    ],
   totals: 1682
}
```

## 皮肤
> 以下皮肤为第三方提供，如果你也有过好的实现，请提交至 [issues](https://github.com/baukh789/GridManager/issues)

- [element-ui](https://github.com/xtfan21/GridManager-element-skin)
- [ant-design](https://github.com/BoWang816/GridManager-antDesign-skin)
- [skin tool](http://skin.degapp.com/)

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
    <td>
        <a href="https://github.com/heriky">
            <img alt="" width="100" height="100" class="avatar width-full rounded-2" src="https://avatars1.githubusercontent.com/u/12195736?s=460&v=4">
            <div style="text-align:center">heriky</div>
        </a>
    </td>
</tr>
</table>

## License
- [License](/LICENSE)

## 浏览器兼容
- Firefox >= 59, Chrome >= 56，Edge >= 16, Safari >= 13

## 微信讨论群
> 使用问题可扫码加群讨论，BUG类问题请通过issues提交。
<img alt="" width="200" height="200" class="avatar width-full rounded-2" src="https://gridmanager.lovejavascript.com/wx-code.jpg">

