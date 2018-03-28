# GridManager.js

[![Build Status](https://travis-ci.org/baukh789/GridManager.svg?branch=master&style=flat-square)](https://travis-ci.org/baukh789/GridManager)
[![npm version](https://img.shields.io/npm/v/GridManager.svg?style=flat-square)](https://www.npmjs.com/package/GridManager)
[![npm downloads](https://img.shields.io/npm/dt/GridManager.svg?style=flat-square)](https://www.npmjs.com/package/GridManager)
[![coverage](https://img.shields.io/codecov/c/github/baukh789/GridManager.svg?style=flat-square)](https://codecov.io/gh/baukh789/GridManager)

## 文档及演示
- [文档](http://gridmanager.lovejavascript.com/api/index.html)
- [演示](http://www.lovejavascript.com/node_modules/GridManager/demo/index.html)

## 使用需知
> 下载时请选择对应的tag进行下载, 请不要直接使用master分支上的代码.

- v2.0和之前版本为jquery版本
- v2.1开始为原生js版本

## 实现功能
### GridManager.js可快速的对table标签进行实例化，实例化后将实现以下功能:

- 宽度调整: 表格的列宽度可进行拖拽式调整
- 位置更换: 表格的列位置进行拖拽式调整
- 配置列: 可通过配置对列进行显示隐藏转换
- 表头吸顶: 在表存在可视区域的情况下,表头将一直存在于顶部
- 排序: 表格单项排序或组合排序
- 分页: 表格ajax分页,包含选择每页显示总条数和跳转至指定页功能
- 用户偏好记忆: 记住用户行为,含用户调整的列宽、列顺序、列可视状态及每页显示条数
- 序号: 自动生成序号列
- 全选: 自动生成全选列
- 导出: 当前页数据下载,和仅针对已选中的表格下载
- 右键菜单: 常用功能在菜单中可进行快捷操作

## 安装命令
```
npm install gridmanager
```

## 引入方式
```html
<link rel="stylesheet" type="text/css" href="/node_modules/gridmanager/css/gm.css"/>
<script type="text/javascript" src="/node_modules/gridmanager/js/gm.js"></script>
```

## 浏览器兼容
- Firefox, Chrome,IE10+
- 这里提一下为什么不支持低版本: 使用表格插件的大都是管理平台或系统,通常都是会进行浏览器指定,所以设计之初就没有考虑这个方面.

## 调用方式
```html
    <table grid-manager="test"></table>
```

```javascript
   document.querySelector('table[grid-manager="test"]').GM({
        supportRemind: true
        ,i18n:'zh-cn'
        ,textConfig:{
            'page-go': {
                'zh-cn':'跳转',
                'en-us':'Go '
            }
        }
        ,disableCache:false
        ,disableOrder:false
        ,supportSorting: true
        ,isCombSorting: true
        ,sortDownText: 'up'
        ,sortUpText: 'down'
        ,supportDrag:true
        ,supportAjaxPage:true
        ,ajax_url: 'data/test.json'
        ,ajax_type: 'POST'
        ,pageSize:30
        ,query: {ex: '用户自定义的查询参数,格式:{key:value}'}
        ,columnData: [{
                key: 'name',
                remind: 'the username',
                sorting: 'ASC',
                width: '200px',
                text: 'username'
            },{
                key: 'age',
                remind: 'the age',
                width: '200px',
                text: 'age'
            },{
                key: 'createDate',
                remind: 'the createDate',
                sorting: 'DESC',
                width: '200px',
                text: 'createDate'
            },{
                key: 'info',
                remind: 'the info',
                text: 'info'
            },{
                key: 'operation',
                remind: 'the operation',
                sorting: '',
                width: '200px',
                text: 'operation',
                template: function(operation, rowObject){  //operation:当前key所对应的单条数据；rowObject：单个一行完整数据
                    return '<a href=javascript:alert("这是一个按纽");>'+operation+'</a>';
                }
            }
        ]
    });
```
## 数据格式
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
   		}
   	],
   	"totals": 1682
   }
```
## 常见问题解答
### API上存在的属性或方法，自已配置后却不生效?
可以通过 `GM.version 或 document.querySelector('table').GM('version')` 查看 `GridManager` 版本号。如版本号与主站版本存在差异，请重新下载新版本进行尝试。
    
### 数据在渲染前就已经存在,如何配置?
可以通过参数 `ajax_data` 进行配置,如果存在配置数据 `ajax_data`,将不再通过 `ajax_url` 进行数据请求。且 `ajax_beforeSend、ajax_error、ajax_complete` 将失效，仅有 `ajax_success` 会被执行。

### 如何在数据请求中增加筛选条件?
可以通过参数query进行配置,该参数会在 `GirdManager` 实例中一直存在。并且可以在筛选条件更改后通过 `document.querySelector('table').GM('setQuery')` 方法进行重置。

### 开发中想查看当前的GirdManager实例中的数据怎么实现?
通过 `document.querySelector('table').GM('get')` 方法可以获得完整的 `GirdManager` 对象。通过 `document.querySelector('table').GM('getLocalStorage')` 可以获得本地存储信息。

### 实例化出错怎么办?
查看DOM节点是否为 `<table grid-manager="test"></table>` 格式。查看配置项 `columnData` 中key值是否与返回数据字段匹配。

### 后端语言返回的数据格式与插件格式不同怎么处理?
可以通过参数 `[dataKey:ajax请求返回的列表数据key键值, 默认为data]`, `[totalsKey:ajax请求返回的数据总条数key键值,默认为totals]` 进行配置。

### 表格th中的文本显示不全
查看配置项 `[columnData]` 中的 `width`, 将该值提高或不进行设置由插件自动控制;如果还为生效,那是由于当臆实例开始了记忆功能;
解决方法为:将 `localStorage` 中包含与当前表格 `grid-manager` 名称对应的项清除,或使用 `localStorage.clear()` 将本地存储全部清除。

### 想清除当前记忆的宽度及列位置时怎么办?
可使用 `clear` 方法,调用方式: `document.querySelector('table').GM('clear');`

### 某一例配置的宽度为100px, 而生成的宽度却不是100px，并且出现了横向滚动条?
这是因为该列的文本实际所占宽度超出了100px, 移除宽度配置或将宽度配置到合理值即可.
GridManager 对宽度进行配置时, 会参照当前列th文本的实际宽度值. 从而达到th文本在初始展示的完整性。
因此在配置宽度时需要参照实际场景, 并建议留下一列做为自适应时的缓冲.
特别注意的是: 当最后一列配置了宽度, 且配置的宽度小于文本所占的实际宽度时. 表格将会出现横向滚动条.


