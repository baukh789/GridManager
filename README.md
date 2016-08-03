# GridManager.js
###实现功能
GridManager.js可快速的对table标签进行实例化，实例化后将实现以下功能:

- 宽度调整: 表格的列宽度可进行拖拽式调整
- 位置更换: 表格的列位置进行拖拽式调整
- 配置列: 可通过配置对列进行显示隐藏转换
- 表头吸顶: 在表存在可视区域的情况下,表头将一下存在于顶部
- 排序: 表格单项排序或组合排序
- 分页: 表格ajax分页,包含选择每页显示总条数和跳转至指定页功能
- 用户偏好记忆: 记住用户行为,含用户调整的列宽、列顺序、列可视状态及每页显示条数
- 分页、排序、刷新时自动进行数据加载，且提供相应的before、after事件
- 序号: 自动生成序号列
- 全选: 自动生成全选列
- 导出: 当前页数据下载,和仅针对已选中的表格下载
- 右键菜单: 常用功能在菜单中可进行快捷操作



###演示及文档

- [演示地址及使用说明](http://www.lovejavascript.com/#!plugIn/listManager/index.html)

###调用方式
```html
    <table grid-manager="test"></table>
```
```javascript
	$('table[grid-manager="test"]').GM({
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

###6.表格样式未加载成功,怎么处理?
    插件采用两种样式加载机制,一种是通过用户自动link,一种是通过配置参数autoLoadCss=true与参数basePath来进行自动加载.出现样式错误的情况,多半是由于采用自动加载机制,但参数basePath未配置正确导致的.
    排错重点为参数:autoLoadCss(是否自动加载CSS文件),basePath(当前基本路径,用于css自动加载样式文件)
    如果不能确定basePath,建议将autoLoadCss设置为false,通过link手动进行加载.

###7.表格th中的文本显示不全
    查看配置项[columnData]中的width, 将该值提高或不进行设置由插件自动控制. 如果还为生效,那是由于当臆实例开始了记忆功能,解决方法为:将localStorage中包含与当前表格grid-manager名称对应的项清除,或使用localStorage.clear()将本地存储全部清除.

###8.想清除当前记忆的宽度及列位置时怎么办?
    可使用clear方法,调用方式:$('table').GM('clear');
###注意事项
   正在进行2.0版本功能测试。由于插件名称由listManager规范为GridManager，调用更简便，功能更强大。





