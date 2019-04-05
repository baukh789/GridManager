
// 模拟的一个promise请求
const getBlogList = function (paramse) {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://www.lovejavascript.com/blogManager/getBlogList');
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.onreadystatechange = () => {
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

window.Vue.use(window.GridManager);

const gridManagerName = 'testVue';
new window.Vue({
    el: '#app',
    data: {

        // 表单数据
        searchForm: {
            title: '',
            type: '3',
            content: ''
        },

        // 分类 list
        TYPE_LIST: [
            {value: '1', text: 'HTML/CSS'},
            {value: '2', text: 'nodeJS'},
            {value: '3', text: 'javaScript'},
            {value: '4', text: '前端鸡汤'},
            {value: '5', text: 'PM Coffee'},
            {value: '6', text: '前端框架'},
            {value: '7', text: '前端相关'}
        ],

        // 分类 map
        TYPE_MAP () {
            let TYPE_MAP = {};
            this.TYPE_LIST.forEach(item => {
                TYPE_MAP[item.value] = item.text;
            });
            return TYPE_MAP;
        },

        // 公开方法列表
        GM_PUBLISH_METHOD_MAP: {
                get: {
                key: 'get',
                relyInit: true,  // 是否依赖init方法
                title: '获取表格的实时配置信息',
                code: 'this.$refs["grid"].$el.GM("get");'
            },
            version: {
                key: 'version',
                relyInit: false,
                title: '获取当前GridManager的版本号',
                code: 'this.$refs["grid"].$el.GM("version");'
            },
            getLocalStorage: {
                key: 'getLocalStorage',
                relyInit: true,
                title: '获取表格用户记忆',
                code: 'this.$refs["grid"].$el.GM("getLocalStorage");'
            },
            resetLayout: {
                key: 'resetLayout',
                relyInit: true,
                title: '重置表格布局',
                code: 'this.$refs["grid"].$el.GM("resetLayout", "800px", "500px");'
            },
            clear: {
                key: 'clear',
                relyInit: true,
                title: '清除表格记忆数据',
                code: 'this.$refs["grid"].$el.GM("clear");'
            },
            getRowData: {
                key: 'getRowData',
                relyInit: true,
                title: '获取指定tr所使用的数据',
                code: 'this.$refs["grid"].$el.GM("getRowData", document.querySelector("table[grid-manager=testVue] tbody tr"));'
            },
            updateRowData: {
                key: 'updateRowData',
                relyInit: true,
                title: '更新指定行所使用的数据',
                code: 'this.$refs["grid"].$el.GM("updateRowData", "id", {"id": 92, "title": "ccc"});'
            },
            setSort: {
                key: 'setSort',
                relyInit: true,
                title: '手动设置排序',
                code: 'this.$refs["grid"].$el.GM("setSort", {createDate: "ASC"});'
            },
            setConfigVisible: {
                key: 'setConfigVisible',
                relyInit: true,
                title: '设置表头配置区域可视状态',
                code: 'this.$refs["grid"].$el.GM("setConfigVisible", true);'
            },
            showTh: {
                key: 'showTh',
                relyInit: true,
                title: '设置列为可视状态',
                code: 'this.$refs["grid"].$el.GM("showTh", "pic");'
            },
            hideTh: {
                key: 'hideTh',
                relyInit: true,
                title: '设置列为隐藏状态',
                code: 'this.$refs["grid"].$el.GM("hideTh", "pic");'
            },
            exportGridToXls: {
                key: 'exportGridToXls',
                relyInit: true,
                title: '导出指定表格',
                code: 'this.$refs["grid"].$el.GM("exportGridToXls", "demo中使用的导出");'
            },
            setQuery: {
                key: 'setQuery',
                relyInit: true,
                title: '更改在生成组件时所配置的参数query',
                code: 'this.$refs["grid"].$el.GM("setQuery", {"userName":"baukh","sex":"男"});'
            },
            setAjaxData: {
                key: 'setAjaxData',
                relyInit: true,
                title: '用于再次配置ajax_data数据',
                code: 'this.$refs["grid"].$el.GM("setAjaxData", {data: [], totals: 0});'
            },
            refreshGrid: {
                key: 'refreshGrid',
                relyInit: true,
                title: '刷新表格',
                code: 'this.$refs["grid"].$el.GM("refreshGrid");'
            },
            getCheckedTr: {
                key: 'getCheckedTr',
                relyInit: true,
                title: '获取当前选中的行',
                code: 'this.$refs["grid"].$el.GM("getCheckedTr");'
            },
            getCheckedData: {
                key: 'getCheckedData',
                relyInit: true,
                title: '获取选中行的渲染数据',
                code: 'this.$refs["grid"].$el.GM("getCheckedData");'
            },
            setCheckedData: {
                key: 'setCheckedData',
                relyInit: true,
                title: '设置选中的数据',
                code: 'this.$refs["grid"].$el.GM("setCheckedData", []);'
            },
            cleanData: {
                key: 'cleanData',
                relyInit: true,
                title: '清除指定表格数据',
                code: 'this.$refs["grid"].$el.GM("cleanData");'
            },
            destroy: {
                key: 'destroy',
                relyInit: true,
                title: '消毁指定的GridManager实例',
                code: 'this.$refs["grid"].$el.GM("destroy");'
            }
        },

        // 执行提示
        fnRunInfo: '',

        // 当前选中的公开方法
        fnSelected: '-1',

        // 公开方法code
        fnCode: '',

        // 当前是否已经实例化
        inited: false,

        // github地址
        github: 'https://github.com/baukh789',

        // 初始化按纽禁用标识
        initDisabled: true,

        // 销毁按纽禁用标识
        destroyDisabled: true,

        // 表格渲染回调函数
        // query为gmOptions中配置的query
        callback: function(query) {
            this.inited = true;
        },

        // GM所需参数
        option: {
            supportRemind: true,
            gridManagerName: gridManagerName,
            width: '100%',
            height: '100%',
            supportAjaxPage: true,
            supportSorting: true,
            isCombSorting: false,
            ajax_data: (settings, parsme) => {
                return getBlogList(parsme);
            },
            ajax_type: 'POST',
            supportMenu: true,
            query: {test: 22},
            pageSize: 30,

            // 顶部通栏
            // topFullColumn: {
            //     template: function(){
            //         return `<div style="padding: 12px; text-align: center;">
            //                     {{row.title}}快速、灵活的对Table标签进行实例化，让Table标签充满活力。该项目已开源, <a target="_blank" href="https://github.com/baukh789/GridManager">点击进入</a>github
            //                 </div>`;
            //     }
            // },
            columnData: [
                {
                    key: 'pic',
                    remind: 'the pic',
                    width: '110px',
                    align: 'center',
                    text: '缩略图',
                    // vue template
                    template: `<a target="_blank" style="display:block; height:58.5px;" :href="\'https://www.lovejavascript.com/#!zone/blog/content.html?id=\'+row.id" :title="\'点击阅读[\'+ row.title + \']\'">
                                <img style="width:90px;margin:0 auto;" :src="\'https://www.lovejavascript.com/\'+row.pic" :alt="row.title">
                            </a>`
                }, {
                    key: 'title',
                    remind: 'the title',
                    align: 'left',
                    text: '标题',
                    sorting: '',
                    // 使用函数返回 vue template
                    template: function() {
                        return '<a class="plugin-action" target="_blank" :href="\'https://www.lovejavascript.com/#!zone/blog/content.html?id=\'+ row.id" :title="\'点击阅读[\'+ row.title +\']\'">{{row.title}}</a>';
                    }
                }, {
                    key: 'type',
                    text: '博文分类',
                    width: '150px',
                    align: 'center',
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
                        selected: '3',

                        // 否为多选, 布尔值, 默认为false。非必设项
                        isMultiple: false
                    },
                    // 使用v-for、v-bind及简写形式
                    template: '<select><option v-for="item in TYPE_LIST" v-bind:value="item.value" :selected="item.value === row.type.toString()">{{item.text}}</option></select>'
                }, {
                    key: 'info',
                    text: '简介',
                    width: '300px'
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
                    text: '<span style="color: red">操作</span>',
                    // 使用@click
                    template: () => {
                        return '<span class="plugin-action" @click="delectRow(row, index)">删除</span>';
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
        // 测试vue下的GM事件
        delectRow: function (row, index) {
            if(window.confirm(`确认要删除当前页第[${index}]条的['${row.title}]?`)){
                console.log('----删除操作开始----');
                this.$refs['grid'].$el.GM('refreshGrid');
                console.log('数据没变是正常的, 因为这只是个示例,并不会真实删除数据.');
                console.log('----删除操作完成----');
                console.log('');
            }
        },

        // 事件: 搜索
        onSearch: function () {
            var params = Object.assign({cPage: 1}, this.searchForm);
            this.$refs['grid'].$el.GM('setQuery', params, function () {
                console.log('setQuery执行成功');
            });
        },

        // 事件: 重置
        onReset: function () {
            this.searchForm = {
                title: '',
                type: '-1',
                content: ''
            };
        },

        // 事件: 初始化
        onInit: function () {
            this.$refs['grid'].$el.GM('init', this.option);
            this.initDisabled = true;
            this.destroyDisabled = false;
        },

        // 事件: 销毁
        onDestroy: function () {
            this.$refs['grid'].$el.GM('destroy');
            this.initDisabled = false;
            this.destroyDisabled = true;
        },

        // 切换执行方法事件
        onFnChange(fnSelected) {
            this.fnSelected = fnSelected;
            this.fnCode = this.GM_PUBLISH_METHOD_MAP[fnSelected] ? this.GM_PUBLISH_METHOD_MAP[fnSelected].code : '';
        },

        // 执行方法事件
        onFnRun() {
            if (this.fnSelected === '-1') {
                return;
            }
            const selectedFN = this.GM_PUBLISH_METHOD_MAP[this.fnSelected];
            try {
                const log = eval(selectedFN.code);
                console.group(selectedFN.key);
                console.log(selectedFN.code);
                console.log(log);
                console.groupEnd();
                if (selectedFN.key === 'init') {
                    this.inited = true;
                }
                if (selectedFN.key === 'destroy') {
                    this.inited = false;
                }
                this.fnRunInfo = `<span class="success-info">
                    <a href="http://gridmanager.lovejavascript.com/api/index.html#${selectedFN.key}" target="_blank">${selectedFN.key}</a>
                    执行成功, 请打开控制台查看具体信息
                </span>`;
            } catch (e) {
                this.fnRunInfo = `<span class="error-info">
                    <a href="http://gridmanager.lovejavascript.com/api/index.html#${selectedFN.key}" target="_blank">${selectedFN.key}</a>
                    执行失败, 请打开控制台查看具体信息
                </span>`;
                console.error('执行错误: ', e);
            }
        }
    },

    // 创建完成
    created: function () {
        this.initDisabled = true;
        this.destroyDisabled = false;
    }
});
