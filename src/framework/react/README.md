# GridManager React
> 基于 React 的 GridManager 封装, 用于便捷的在 React 中使用GridManager。

## API
> 在相同的API的基本上，支持了React的特性。react版本除了在`columnData.text` `columnData.template` `topFullColumn.template`中可以使用react模版外，其它使用方式相同。
- [API](http://gridmanager.lovejavascript.com/api/index.html)

## 安装
```
npm install gridmanager --save
```

## 项目中引用
- es2015引入方式
```javascript
import GridManager from 'gridmanager/react';
import 'gridmanager/style.css';
```

## 示例
```html
<div id="example"></div>
```

```javascript
import ReactDOM from 'react-dom';
import React, { useState } from 'react';
import GridManager from 'gridmanager/react';
import 'gridmanager/style.css';

// 组件: 操作列
function ActionInner(props) {
    const actionAlert = event => {
        alert('操作栏th是由React模板渲染的');
    };
    return <span onClick={actionAlert} style={{display: 'block', color: 'red'}}>{props.text}</span>;
}

function ActionComponents(props) {
    return <ActionInner text={props.text}/>;
}

// 组件: 空模板
function EmptyTemplate(props) {
    return (
        <section style={{textAlign: 'center'}}>
            {props.text}
        </section>
    );
}

// 组件: 标题
function TitleComponents(props) {
    return (
        <a href={'https://www.lovejavascript.com/#!zone/blog/content.html?id=' + props.row.id} target={'_black'}>{props.row.title}</a>
    );
}

// 组件: 类型
function TypeComponents(props) {
    // 博文类型
    const TYPE_MAP = {
        '1': 'HTML/CSS',
        '2': 'nodeJS',
        '3': 'javaScript',
        '4': '前端鸡汤',
        '5': 'PM Coffee',
        '6': '前端框架',
        '7': '前端相关'
    };
    return (
        <button>{TYPE_MAP[props.type]}</button>
    );
}

// 组件: 删除
function DeleteComponents(props) {
    const {index, row} = props;
    const deleteAction = event => {
        if(window.confirm(`确认要删除当前页第[${event.target.getAttribute('data-index')}]条的['${event.target.title}]?`)){
            console.log('----删除操作开始----');
            GridManager.refreshGrid(option.gridManagerName);
            console.log('数据没变是正常的, 因为这只是个示例,并不会真实删除数据.');
            console.log('----删除操作完成----');
        }
    };

    return (
        <span className={'plugin-action'} onClick={deleteAction} data-index={index} title={row.title}>删除</span>
    );
}

// 表格组件配置
const option = {
    gridManagerName: 'testReact',
    height: '100%',
    emptyTemplate: <EmptyTemplate text={'这个React表格, 什么数据也没有'}/>,
    columnData: [{
        key: 'pic',
        remind: 'the pic',
        width: '110px',
        text: '缩略图',
        template: (pic, row) => {
            return (
                <img style={{width: '90px', margin: '0 auto'}} src={'https://www.lovejavascript.com' + pic} title={row.name}/>
            );
        }
    },{
        key: 'title',
        remind: 'the title',
        text: '标题',
        template: <TitleComponents/>
    },{
        key: 'type',
        remind: 'the type',
        text: '分类',
        align: 'center',
        template: (type, row, index) => {
            return <TypeComponents type={type}/>;
        }
    },{
        key: 'info',
        remind: 'the info',
        text: '使用说明'
    },{
        key: 'username',
        remind: 'the username',
        text: '作者',
        // 使用函数返回 dom node
        template: (username, row, index) => {
            return (
                <a href={'https://github.com/baukh789'} target={'_black'}>{username}</a>
            );
        }
    },{
        key: 'createDate',
        remind: 'the createDate',
        width: '100px',
        text: '创建时间',
        sorting: 'DESC',
        // 使用函数返回 htmlString
        template: function(createDate, rowObject){
            return new Date(createDate).toLocaleDateString();
        }
    },{
        key: 'lastDate',
        remind: 'the lastDate',
        width: '120px',
        text: '最后修改时间',
        sorting: '',
        // 使用函数返回 htmlString
        template: function(lastDate, rowObject){
            return new Date(lastDate).toLocaleDateString();
        }
    },{
        key: 'action',
        remind: 'the action',
        width: '100px',
        disableCustomize: true,
        text: <ActionComponents text={'操作'}/>,
        // 快捷方式，将自动向组件的props增加row、index属性
        template: <DeleteComponents/>
    }],
    supportRemind: true,
    isCombSorting:  true,
    supportAjaxPage: true,
    supportSorting: true,
    ajaxData: 'http://www.lovejavascript.com/blogManager/getBlogList',
    ajaxType: 'POST',
};

// 渲染回调函数
const callback = query => {
    console.log('callback => ', query);
};

ReactDOM.render(
    <GridManager
        option={option} // 也可以将option中的配置项展开
        height={'100%'} // 展开后的参数，会覆盖option中的值
        callback={callback}
    />,
    document.querySelector('#example')
);
```

### 调用公开方法
> 通过ES6语法，将GridManager引入。
```javascript
import GridManager, { $gridManager } from 'gridmanager/react';

// 刷新
GridManager.refreshGrid('testReact'); // 或 $gridManager.refreshGrid('testReact');

// 更新查询条件
GridManager.setQuery('testReact', {name: 'baukh'}); // 或 $gridManager.setQuery('testReact', {name: 'baukh'});

// ...其它更多请直接访问API
```

### 查看当前版本

```javascript
import GridManager from 'gridmanager/react';
console.log('GridManager', GridManager.version);
```
