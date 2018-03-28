# GridManager.js

[![Build Status](https://travis-ci.org/baukh789/GridManager.svg?branch=master&style=flat-square)](https://travis-ci.org/baukh789/GridManager)
[![npm version](https://img.shields.io/npm/v/GridManager.svg?style=flat-square)](https://www.npmjs.com/package/GridManager)
[![npm downloads](https://img.shields.io/npm/dt/GridManager.svg?style=flat-square)](https://www.npmjs.com/package/GridManager)
[![coverage](https://img.shields.io/codecov/c/github/baukh789/GridManager.svg?style=flat-square)](https://codecov.io/gh/baukh789/GridManager)

## API and DEMO
- [API](http://gridmanager.lovejavascript.com/api/index.html)
- [DEMO](http://www.lovejavascript.com/node_modules/GridManager/demo/index.html)

## Operation Instruction
> Please choose the right tag to download, don’t use the codes of the branch in the master.

- Jquery is used before v 2.0
- Native code is used from v2.1

## Implementation Function 
### GridManager.js can make the tag of table into real cases. And after that ,these functions are accessed:
- Width control: you can control the width of your grid easily
- Position replacement: the position of the list of your grid can be changed
- Set the list: hide or reveal the list can be choosed by setting your grid
- Header ceiling: the header will always alive unless the your grid is invisible
- Sorting: sorting a single list or a group of the lists
- Pagination: ajax pagination of the grid, including the total number of the pages and going to any pages which you like
- Memory of uses: remember the action of users, including the width ,order, number of the lines of each page ,and if it is visible or not
- Serial number: product serial number automatically
- Check all: check al l boxes are available 
- Export: the visible data or the checked lists can be download
- Context Menu: frequently used functions can be find in the context menu

## Install Command
```
npm install gridmanager
```

## Way of Introduction
```html
<link rel="stylesheet" type="text/css" href="/node_modules/gridmanager/css/gm.css"/>
<script type="text/javascript" src="/node_modules/gridmanager/js/gm.js"></script>
```

## Browser Capabilities
- Firefox, Chrome,IE10+.
- TIPS: why lower version browsers is unavailable ?For, grid is usually used for management system which will always ask their users to choose the right browsers, so lower version browsers did not be considered.

## Method of Calling
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
    
## Data Format
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
## Q&A
### It doesn't work when configured by myself althought there is the method or the property in API?
You can find the version of the `Gridmanager` by the way of  `GM.version or document.querySelector('table').GM('version')` .If it is different from  the main station version ,please try again after downloading the newer one.
### How to set my grid if datas have been existed before rendering?
You can solve it by setting the `ajax_data`, datas will not be asked by `ajax_url` if the ajax_data is existed, and `ajax_beforeSend、ajax_error、ajax_complete` will lose efficacy, only `ajax_success` will be done.

### How can I add a select term when asking for data?
You can do it by setting the query,which will always exist in the case, and it can be resetted by `document.querySelector('table').GM('setQuery')` ,when the selecting condition is changed.

### How to check the data in the Gridmanager of the current case when developing?
You can achieve the total `Gridmanager` object by the way of `document.querySelector('table').GM('get')`.
Local storage information can be received by the way `document.querySelector('table').GM('getLocalStorage')`

### What if there is a mistake in my case?
Check the form of the DOM node, if it is `<table grid-manager="test"></table>` ,check the key in the `columnData` to find if it is matched with the revert data.

### How can I deal with the condition that the form of the revert data from back-end is different from the form of the plug-in board?
Setting by the parameter `[datakey:ajax Requesting the key of the grid data , default:data]` `[totalskey:ajax Requesting the key of the grid data, default: totals]`

### Context can not be totally revealed in the th of the grid? 
Check the term  `width` in the  `[columData]`,It is automatically controlled if the data of the term should be hold or raised. The case start its memory ,which will cause the term in operation.
You can clear the local storage which including the name of the current `grid manager`, or clear all the local storage by `localStorage.clear()`.

### How to clear the width and the position of the list which are memorized?
Using the mean of clear,  calling method : `document.querySelector('table').GM('clear'); `

