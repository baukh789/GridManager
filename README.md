# GridManager.js
###实现功能
GridManager.js可快速的对table标签进行实例化，实例化后将实现以下功能:

- 表格宽度调整、位置更换、列展示隐藏、表头吸顶等前端交互效果
- 表格各项单项排序或组合排序功能
- 表格ajax分页功能
- 表格交互效果记忆功能,如记忆用户的列宽、列位置、列可视状态、每页显示条数
- 分页、排序、刷新时自动进行数据加载，且提供相应的before、after事件
- 支持自动生成序号列
- 支持自动生成全选列
- 提供表格下载，包括已选中的表格下载
- 便捷全面的配置



###演示及文档

- [演示地址及使用说明](http://www.lovejavascript.com/#!plugIn/listManager/index.html)

###调用方式
```javascript
	table.GM({
        supportRemind: true
        ,i18n:'zh-cn'
        ,textConfig:{
            'page-go': {
                'zh-cn':'跳转',
                'en-us':'Go '
            }
        }
        ,gridManagerName:'aaa'
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
                sorting: 'up',
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
                sorting: 'down',
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
###数据格式
```JSON
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
##常见问题解答
###1.数据在渲染前就已经存在,如何配置?
    可以通过参数ajax_data进行配置,如果存在配置数据ajax_data,将不再通过ajax_url进行数据请求,且ajax_beforeSend、ajax_error、ajax_complete将失效，仅有ajax_success会被执行.

###2.如何在数据请求中增加筛选条件?
    可以通过参数query进行配置,该参数会在GirdManager实例中一直存在,并且可以在筛选条件更改后通过$('table').GM('setQuery')方法进行重置.

###3.开发中想查看当前的GirdManager实例中的数据怎么实现?
    通过$('table').GM('get')方法可以获得完整的GirdManager对象;通过$('table').GM('getLocalStorage')可以获得本地存储信息.

###4.实例化出错怎么办?
    查看DOM节点是否为<table grid-manager="test"></table>格式
    查看配置项columnData中key值是否与返回数据字段匹配.

###5.后端语言返回的数据格式与插件格式不同怎么处理?
    可以通过参数[dataKey:ajax请求返回的列表数据key键值,默认为data][totalsKey:ajax请求返回的数据总条数key键值,默认为totals]进行配置.
###注意事项
   正在进行2.0版本功能测试。由于插件名称由listManager规范为GridManager，调用更简便，功能更强大。




