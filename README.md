# GridManager.js

[![Build Status](https://travis-ci.org/baukh789/GridManager.svg?branch=master&style=flat-square)](https://travis-ci.org/baukh789/GridManager)
[![npm version](https://img.shields.io/npm/v/gridmanager.svg?style=flat-square)](https://www.npmjs.com/package/gridmanager)
[![npm downloads](https://img.shields.io/npm/dt/gridmanager.svg?style=flat-square)](https://www.npmjs.com/package/gridmanager)
[![coverage](https://img.shields.io/codecov/c/github/baukh789/GridManager.svg?style=flat-square)](https://codecov.io/gh/baukh789/GridManager)

## Select Language
- [English](readme/README-EN.md)
- [中文](readme/README-CN.md)

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

## GridManager by frameworks
- [GridManager by Vue](https://github.com/baukh789/GridManager-Vue)

## API
- [API](http://gridmanager.lovejavascript.com/api/index.html)

## Demo
- [base grid](http://runjs.cn/code/dkxyyzim)
- [use I18N grid](http://runjs.cn/code/tho0nht5)
- [use search grid](http://runjs.cn/code/eoxfjqgc)
- [use export grid](http://runjs.cn/code/iqixtlhw)
- [use template grid](http://runjs.cn/code/rcyn61v1)

## Version Information
- [v2.5.x.md](/version/v2.5.x.md)
- [v2.4.x.md](/version/v2.4.x.md)
- [v2.3.x.md](/version/v2.3.x.md)
- [v2.2.x.md](/version/v2.2.x.md)
- [v2.1.x.md](/version/v2.1.x.md)

## License
- [License](/LICENSE)

## Init
### demo-baseCode
```html
<table></table>
```
```javascript
document.querySelector('table').GM({
	gridManagerName: 'demo-baseCode',
    ajax_url: 'http://www.lovejavascript.com/learnLinkManager/getLearnLinkList',
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

### demo-ajaxPageCode
```html
<table></table>
```
```javascript
document.querySelector('table').GM({
	gridManagerName: 'demo-ajaxPageCode',
    ajax_url: 'http://www.lovejavascript.com/learnLinkManager/getLearnLinkList',
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

[more dome](http://gridmanager.lovejavascript.com/demo/index.html)
