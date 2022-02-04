import ReactDOM from 'react-dom';
import React, { Component } from 'react';
import GridManagerReact from '../js/index.js';
import SearchComponent from './search';
import { ActionComponents, EmptyTemplate, TitleComponents, TypeComponents, EditComponents } from './components';
import FooterComponent from './footer';
import AppContext from './AppContext';

// 静态数据
const getData = num => {
    const data = [];
    let child = [];

    for (let i = 1; i <= num; i++) {
        child = [];
        for (let j = 1; j <= 40; j++) {
            child.push({
                'id': parseInt((i.toString() + j.toString()), 10),
                'pic': '/upload/blog/pic/6717_%E5%AF%BC%E5%87%BA.png',
                'author': '33',
                'praiseNumber': '0',
                'status': '1',
                'readNumber': '111',
                'title': '测试数据' + j,
                'subtitle': '测试数据' + j,
                'type': j % 5,
                'info': '野生前端程序',
                'createDate': 1579350185000,
                'lastDate': 1579662679374,
                'commentSum': 0,
                'username': '拭目以待'
            });
        }
        data.push({
            'id': i,
            'pic': '/upload/blog/pic/6717_%E5%AF%BC%E5%87%BA.png',
            'author': '33',
            'praiseNumber': '0',
            'status': '1',
            'readNumber': '111',
            'title': '测试数据' + i,
            'subtitle': '测试数据' + i,
            'type': i % 5,
            'info': '野生前端程序',
            'createDate': 1579350185000,
            'lastDate': 1579662679374,
            'commentSum': 0,
            'username': '拭目以待',
            'children': child
        });
    }

    return data;
};

/* eslint-disable */
const ajaxData1 = {
    'data': getData(20),
    'totals': 20
};
const option = {
    disableCache: false,
    virtualScroll: {
        useVirtualScroll: true
    },
    isCombSorting: true,
    supportAjaxPage: true,
    supportSorting: true,
    supportMoveRow: true,
    useCellFocus: true,
    autoOrderConfig: {
        fixed: 'left'
    },
    isIconFollowText: true,
    checkboxConfig: {
        // useRowCheck: true,
        fixed: 'left'
    },
    // supportTreeData: true,
    // treeConfig: {
    //     insertTo: 'title',
    //     openState: false,
    //     treeKey: 'children'
    // },
    ajaxData: 'https://www.lovejavascript.com/blogManager/getBlogList',
    // ajaxData: ajaxData1,
    ajaxType: 'POST'
};

const getEmptyTemplate = (query, num, testFN) => {
    const text = query.title ? '这个React表格, 搜索结果为空' : '这个React表格, 数据为空';
    return (
        <>
            <EmptyTemplate text={text + num} testFN={testFN}/>
        </>
    );
};

const getFullColumn = num => {
    return {
        useFold: true,
        // interval: 6,
        bottomTemplate: function () {
            return (
                    <div style={{padding: '12px', textAlign: 'center'}}>
                        快速、灵活的对Table标签进行实例化，让Table标签充满活力。该项目已开源, {num}
                        <a target="_blank" href="https://github.com/baukh789/GridManager">点击进入</a>
                        github
                    </div>
            );
        }
    };
};
const getColumnData = (num, testFN) => {
    return [{
        key: 'pic',
        remind: 'the pic',
        width: '130px',
        text: '缩略图',
        template: (pic, row) => {
            return (
                <img style={{width: '90px', height: 58.5, margin: '0 auto'}} src={'https://www.lovejavascript.com' + pic} title={row.name}/>
            );
        }
    }, {
        key: 'title',
        remind: 'the title',
        text: '标题',
        // 快捷方式，将自动向组件的props增加row、index属性
        template: <TitleComponents/>
    }, {
        key: 'type',
        text: '博文分类',
        width: '150px',
        align: 'center',
        template: (type, row, index) => {
            return <TypeComponents type={type}/>;
        }
    }, {
        key: 'info',
        text: '简介'
    }, {
        key: 'readNumber',
        text: '阅读量'
    }, {
        key: 'username',
        remind: 'the username',
        width: '100px',
        text: '作者',
        // 使用函数返回 dom node
        template: (username, row, index) => {
            return (
                <a href={'https://github.com/baukh789'} target={'_black'}>{username}</a>
            );
        }
    }, {
        key: 'createDate',
        remind: 'the createDate',
        width: '130px',
        text: '创建时间',
        sorting: 'DESC',
        // 使用函数返回 htmlString
        template: function (createDate, rowObject) {
            return new Date(createDate).toLocaleDateString();
        }
    }, {
        key: 'lastDate',
        remind: 'the lastDate',
        width: '130px',
        text: '最后修改时间',
        sorting: '',
        // 使用函数返回 htmlString
        template: function (lastDate, rowObject) {
            return new Date(lastDate).toLocaleDateString();
        }
    }, {
        key: 'state',
        remind: '展示当前的state',
        width: '100px',
        text: 'state',
        align: 'center',
        template: (state, row, index) => {
            return (
                <span>{num}</span>
            );
        }
    }, {
        key: 'action',
        remind: 'the action',
        width: '100px',
        disableCustomize: true,
        disableRowCheck: true,
        disableMoveRow: true,
        fixed: 'right',
        text: <ActionComponents text={'操作' + num}/>,
        template: (action, row, index) => {
            return (
                <>
                    <EditComponents row={row} index={index} gmkey={gridManagerName}/>
                    <span className='plugin-action' onClick={testFN}>state</span>
                </>
            );
        }
    }];
};
class App extends Component {
    constructor() {
        super();
        this.state = {
            num: 1,
            now: Date.now(),
            isShow: true
        };
        this.testFN = () => {
            this.setState(state => {
                return {
                    num: state.num + 1
                };
            });
        };
    }
    static contextType = AppContext;
    summaryHandler(data) {
        let readNumber = 0;
        data.forEach(item => {
            readNumber += item.readNumber;
        });
        return {
            title: <ActionComponents text={'测试 JSX'}/>,
            readNumber
        };
    }

    callback(query) {
        console.log('callback', Date.now() - this.state.now);
    }

    resetTable(isShow) {
        this.setState({'isShow': isShow});
    }
    render() {
        this.columnData = getColumnData(this.state.num, this.testFN);
        this.fullColumn = getFullColumn(this.state.num);
        const { gridManagerName, option } = this.context;
        return (
            <>
                <div id="search">
                    <SearchComponent/>
                </div>
                <div id="example">
                    {
                        this.state.isShow ?
                            <GridManagerReact
                            gridManagerName={gridManagerName}
                            option={option} // 也可以将option中的配置项展开
                            height={'100%'} // 展开后的参数，会覆盖option中的值
                            columnData={this.columnData}
                            // summaryHandler={this.summaryHandler}
                            // fullColumn={this.fullColumn}
                            emptyTemplate={ settings => {
                                return getEmptyTemplate(settings.query, this.state.num, this.testFN);
                            }}
                            callback={this.callback.bind(this)}/>
                            : ''
                    }

                </div>
                <div id="footer">
                    <FooterComponent resetTable={this.resetTable.bind(this)}/>
                </div>
            </>
        );
    }
}

const gridManagerName = 'test';
ReactDOM.render(
    <AppContext.Provider value={{gridManagerName, option}}>
        <App/>
    </AppContext.Provider>,
    document.querySelector('#app')
);
