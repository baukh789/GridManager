import React from 'react';
import { $gridManager } from '../js/index.js';

// 组件: 操作列
function ActionInner(props) {
    const actionAlert = event => {
        alert('操作栏th是由React模板渲染的');
    };
    return <span onClick={actionAlert} style={{display: 'block', color: 'red'}}>{props.text}</span>;
}

// 组件: th 操作列
export function ActionComponents(props) {
    return <ActionInner text={props.text}/>;
}

// 组件: 空模板
export function EmptyTemplate(props) {
    return (
        <section style={{textAlign: 'center'}}>
            {props.text}
            <span className='plugin-action' onClick={props.testFN}>state</span>
        </section>
    );
}

// 组件: 标题
export function TitleComponents(props) {
    return (
        <a href={'https://www.lovejavascript.com/#!zone/blog/content.html?id=' + props.row.id} target={'_black'}>{props.row.title}</a>
    );
}

// 组件: 类型
export function TypeComponents(props) {
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
export function EditComponents(props) {
    const { gmkey, index, row } = props;
    const editAction = () => {
        // window.event.stopPropagation();
        // window.event.preventDefault();
        row.title = row.title + '(编辑于' + new Date().toLocaleDateString() + ')';
        $gridManager.updateRowData(gmkey, 'id', row);
    };

    return (
        <span className='plugin-action' onClick={editAction} data-index={index} title={row.title}>编辑</span>
    );
}
