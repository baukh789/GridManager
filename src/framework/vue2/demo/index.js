import Vue from 'vue2/dist/vue.js'; // 与webpack中的 alias:{'vue$': 'vue2/dist/vue.esm.js'} 作用相同
import './style.css';
import GridManagerVue, { $gridManager } from '../js/index';

Vue.use(GridManagerVue);
console.log('vvvv', Vue);
// 模拟的一个promise请求
const getBlogList = function(paramse) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://www.lovejavascript.com/blogManager/getBlogList');
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = function() {
            if (xhr.readyState !== 4) {
                return;
            }
            if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
                resolve(xhr.response);
            } else {
                reject(xhr);
            }
        };

        // 一个简单的处理参数的示例
        let formData = '';
        for (let key in paramse) {
            if(formData !== '') {
                formData += '&';
            }
            formData += key + '=' + paramse[key];
        }
        xhr.send(formData);
    });
};

const getData = num => {
    const data = [];
    let child = [];

    for (let i = 1; i<= num; i++) {
        child = [];
        for (let j = 1; j<= 40; j++) {
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
var ajaxData2 = {
    'data': getData(20),
    'totals': 20
};
let now = Date.now();
const index = new Vue({
    el: '#app',
    data: {
        // 表单数据
        formData: {
            title: '',
            content: ''
        },

        // 已销毁
        destroyDisabled: true,

        // 分类
        TYPE_LIST : [
            {value: '1', text: 'HTML/CSS'},
            {value: '2', text: 'nodeJS'},
            {value: '3', text: 'javaScript'},
            {value: '4', text: '前端鸡汤'},
            {value: '5', text: 'PM Coffee'},
            {value: '6', text: '前端框架'},
            {value: '7', text: '前端相关'}
        ],

        // github地址
        github: 'https://github.com/baukh789',

        // 表格渲染回调函数
        // query为gmOptions中配置的query
        callback: function(query) {
            console.log('callback => ', Date.now() - now);
        },

        // 类型
        TYPE_MAP: {
            '1': 'HTML/CSS',
            '2': 'nodeJS',
            '3': 'javaScript',
            '4': '前端鸡汤',
            '5': 'PM Coffee',
            '6': '前端框架',
            '7': '前端相关'
        },
        // GM所需参数
        option: {
            supportRemind: true,
            gridManagerName: 'test',
            height: '100%',
            supportAjaxPage: true,
            supportSorting: true,
            supportMoveRow: true,
			moveRowConfig: {
				useSingleMode: true,
				fixed: 'left'
			},
            isCombSorting: false,
            useCellFocus: true,
            virtualScroll: {
                useVirtualScroll: true,
                virtualNum: 20
            },
            autoOrderConfig: {
                fixed: 'left'
            },
            checkboxConfig: {
                fixed: 'left'
            },
            // summaryHandler: data => {
            //     let readNumber = 0;
            //     data.forEach(item => {
            //         readNumber += item.readNumber;
            //     });
            //     return {
            //         title: '<span style="color: red" @click="actionAlert()">测试vue template</span>',
            //         readNumber
            //     }
            // },
            ajaxData: (settings, params) => {
                return getBlogList(params);
            },
            // ajaxData: ajaxData2,
            // supportTreeData: true,
            disableCache: false,
            ajaxType: 'POST',
            supportMenu: true,
            query: {test: 22},
            pageSize: 30,
            emptyTemplate: settings => {
                const emptyText = settings.query.title ? '搜索结果为空' : '这个Vue表格, 什么数据也没有';
                return `<section style="text-align: center">${emptyText}</section>`;
            },
            // 顶部通栏
            // topFullColumn: {
            //     template: function(row, index){
            //         return `<div style="padding: 12px; text-align: center;">
            //                     {{index}} - 快速、灵活的对Table标签进行实例化，让Table标签充满活力。该项目已开源, <a target="_blank" href="https://github.com/baukh789/GridManager">点击进入</a>github
            //                 </div>`;
            //     }
            // },
            columnData: [
                {
                    key: 'pic',
                    remind: 'the pic',
                    width: '140px',
                    align: 'center',
                    text: '缩略图',
                    // vue template
                    template: `<a target="_blank" style="display:inline-block;" :href="\'https://www.lovejavascript.com/#!zone/blog/content.html?id=\'+row.id" :title="\'点击阅读[\'+ row.title + \']\'">
                                <img style="width:90px;height:58.5px;margin:0 auto;" :src="\'https://www.lovejavascript.com/\'+row.pic" :alt="row.title">
                            </a>`
                }, {
                    key: 'title',
                    remind: 'the title',
                    align: 'left',
                    text: '标题',
                    // 使用函数返回 vue template
                    template: function() {
                        return '<a class="plugin-action" target="_blank" :href="\'https://www.lovejavascript.com/#!zone/blog/content.html?id=\'+ row.id" :title="\'点击阅读[\'+ row.title +\']\'">{{row.title}}</a>';
                    }
                }, {
                    key: 'type',
                    text: '博文分类',
                    width: '150px',
                    align: 'center',
                    remind: {
                        text: '[HTML/CSS, nodeJS, javaScript, 前端鸡汤, PM Coffee, 前端框架, 前端相关]',
                        style: {
                            width: '400px',
                            'text-align': 'left'
                        }
                    },
                    // 表头筛选条件, 该值由用户操作后会将选中的值以{key: value}的形式覆盖至query参数内。非必设项
                    filter: {
                        // 筛选条件列表, 数组对象。格式: [{value: '1', text: 'HTML/CSS'}],在使用filter时该参数为必设项。
                        option: [
                            {value: '1', text: 'HTML/CSS'},
                            {value: '2', text: 'nodeJS'},
                            {value: '3', text: 'javaScript'},
                            {value: '4', text: '前端鸡汤'},
                            {value: '5', text: 'PM Coffee'},
                            {value: '6', text: '前端框架'},
                            {value: '7', text: '前端相关'}
                        ],

                        // 筛选选中项，字符串, 未存在选中项时设置为''。 在此设置的选中的过滤条件将会覆盖query
                        selected: '',

                        // 否为多选, 布尔值, 默认为false。非必设项
                        isMultiple: false
                    },
                    // 使用v-for、v-bind及简写形式
                    template: '<button type="button" @click="testClick(row)">{{TYPE_MAP[row.type]}}</button>'
                }, {
                    key: 'info',
                    text: '简介'
                }, {
                    key: 'readNumber',
                    text: 'readNumber',
                }, {
                    key: 'username',
                    remind: 'the username',
                    width: '100px',
                    align: 'center',
                    text: '作者',
                    template: `<a class="plugin-action" v-bind:href="github" target="_blank" :title="\'去看看的\'+ row.username + \'github\'">{{row.username}}</a>`
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
                    key: 'action',
                    remind: 'the action',
                    align: 'center',
                    width: '100px',
                    disableCustomize: true,
                    fixed: 'right',
                    text: '<span style="color: red;" @click="actionAlert()">操作</span>',
                    // 使用@click
                    template: (action, row, index) => {
                        return '<span class="plugin-action" @click="editRow(row, index)">编辑</span>';
                    }
                }
            ],
            // 排序后事件
            sortingAfter: function (data) {
                console.log('sortAfter', data);
            }
        }
    },
    methods: {
        // 测试click
        testClick: (row) => {
            console.log('click', row);
        },

        // 测试vue下的GM事件
        editRow: function (row, index) {
            row.title = row.title + ' (编辑于' + new Date().toLocaleDateString() +') ';
            $gridManager.updateRowData('test', 'id', row);
        },
        // 事件: 操作
        actionAlert: function() {
            alert('操作栏th是由vue模板渲染的');
        },
        // 事件: 搜索
        onSearch() {
            const params = Object.assign({cPage: 1}, this.formData);
            $gridManager.setQuery('test', params, function () {
                console.log('setQuery=>执行成功222');
            });
        },

        // 事件: 重置
        onReset: function () {
            this.formData.title = '';
            this.formData.content = '';
        },

        // 事件: 初始化
        onInit: function () {
            this.destroyDisabled = false;
        },

        // 事件: 销毁
        onDestroy: function () {
            this.destroyDisabled = true;
        }
    },

    // 创建完成
    created: function () {
        this.destroyDisabled = false;
    }
});
