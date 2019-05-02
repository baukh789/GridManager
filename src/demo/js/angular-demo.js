/**
 * Created by baukh on 18/4/11.
 */

angular.module("myApp", ['gridManager'])
.controller('AppController', ['$window', '$rootScope', '$timeout', '$scope', '$element', '$sce', '$gridManager', function($window, $rootScope, $timeout, $scope, $element, $sce, $gridManager) {
    $scope.testClick = (row) => {
        console.log('click', row);
    };
    // 表格唯一标识
    $scope.gridManagerName = 'testAngular';

    // 博文类型
    $scope.TYPE_MAP = {};
    $scope.TYPE_LIST = [
        {value: '1', text: 'HTML/CSS'},
        {value: '2', text: 'nodeJS'},
        {value: '3', text: 'javaScript'},
        {value: '4', text: '前端鸡汤'},
        {value: '5', text: 'PM Coffee'},
        {value: '6', text: '前端框架'},
        {value: '7', text: '前端相关'}
    ];
    $scope.TYPE_LIST.forEach(item => {
        $scope.TYPE_MAP[item.value] = item.text;
    });

    // 公开方法列表
    $scope.GM_PUBLISH_METHOD_MAP =  {
        get: {
            key: 'get',
            relyInit: true,  // 是否依赖init方法
            title: '获取表格的实时配置信息',
            code: `$gridManager.get('${$scope.gridManagerName}');`
        },
        version: {
            key: 'version',
            relyInit: false,
            title: '获取当前GridManager的版本号',
            code: `$gridManager.version;`
        },
        getLocalStorage: {
            key: 'getLocalStorage',
            relyInit: true,
            title: '获取表格用户记忆',
            code: `$gridManager.getLocalStorage('${$scope.gridManagerName}');`
        },
        resetLayout: {
            key: 'resetLayout',
            relyInit: true,
            title: '重置表格布局',
            code: `$gridManager.resetLayout('${$scope.gridManagerName}', '800px', '500px');`
        },
        clear: {
            key: 'clear',
            relyInit: true,
            title: '清除表格记忆数据',
            code: `$gridManager.clear('${$scope.gridManagerName}');`
        },
        getRowData: {
            key: 'getRowData',
            relyInit: true,
            title: '获取指定tr所使用的数据',
            code: `$gridManager.getRowData('${$scope.gridManagerName}', document.querySelector("table[grid-manager=${$scope.gridManagerName}] tbody tr"));`
        },
        updateRowData: {
            key: 'updateRowData',
            relyInit: true,
            title: '更新指定行所使用的数据',
            code: `$gridManager.updateRowData('${$scope.gridManagerName}', 'id', {id: 92, title: 'ccc'});`
        },
        setSort: {
            key: 'setSort',
            relyInit: true,
            title: '手动设置排序',
            code: `$gridManager.setSort('${$scope.gridManagerName}', {createDate: 'ASC'});`
        },
        setConfigVisible: {
            key: 'setConfigVisible',
            relyInit: true,
            title: '设置表头配置区域可视状态',
            code: `$gridManager.setConfigVisible('${$scope.gridManagerName}', true);`
        },
        showTh: {
            key: 'showTh',
            relyInit: true,
            title: '设置列为可视状态',
            code: `$gridManager.showTh('${$scope.gridManagerName}', 'pic');`
        },
        hideTh: {
            key: 'hideTh',
            relyInit: true,
            title: '设置列为隐藏状态',
            code: `$gridManager.hideTh('${$scope.gridManagerName}', 'pic');`
        },
        exportGridToXls: {
            key: 'exportGridToXls',
            relyInit: true,
            title: '导出指定表格',
            code: `$gridManager.exportGridToXls('${$scope.gridManagerName}', 'demo中使用的导出');`
        },
        setQuery: {
            key: 'setQuery',
            relyInit: true,
            title: '更改在生成组件时所配置的参数query',
            code: `$gridManager.setQuery('${$scope.gridManagerName}', {'userName':'baukh','sex':'男'});`
        },
        setAjaxData: {
            key: 'setAjaxData',
            relyInit: true,
            title: '用于再次配置ajax_data数据',
            code: `$gridManager.setAjaxData('${$scope.gridManagerName}', {data: [], totals: 0});`
        },
        refreshGrid: {
            key: 'refreshGrid',
            relyInit: true,
            title: '刷新表格',
            code: `$gridManager.refreshGrid('${$scope.gridManagerName}');`
        },
        getCheckedTr: {
            key: 'getCheckedTr',
            relyInit: true,
            title: '获取当前选中的行',
            code: `$gridManager.getCheckedTr('${$scope.gridManagerName}');`
        },
        getCheckedData: {
            key: 'getCheckedData',
            relyInit: true,
            title: '获取选中行的渲染数据',
            code: `$gridManager.getCheckedData('${$scope.gridManagerName}');`
        },
        setCheckedData: {
            key: 'setCheckedData',
            relyInit: true,
            title: '设置选中的数据',
            code: `$gridManager.setCheckedData('${$scope.gridManagerName}', []);`
        },
        cleanData: {
            key: 'cleanData',
            relyInit: true,
            title: '清除指定表格数据',
            code: `$gridManager.cleanData('${$scope.gridManagerName}');`
        },
        destroy: {
            key: 'destroy',
            relyInit: true,
            title: '消毁指定的GridManager实例',
            code: `$gridManager.destroy('${$scope.gridManagerName}');`
        }
    };

    // 当前选中的公开方法
    $scope.fnSelected = '-1';

    // 公开方法code
    $scope.fnCode = '';

    // 切换执行方法事件
    $scope.onFnChange = fnSelected => {
        $scope.fnSelected = fnSelected;
        $scope.fnCode = $scope.GM_PUBLISH_METHOD_MAP[fnSelected] ? $scope.GM_PUBLISH_METHOD_MAP[fnSelected].code : '';
    };

    // 当前是否已经实例化
    $scope.inited = false;

    // 执行方法事件
    $scope.onFnRun = () => {
        if ($scope.fnSelected === '-1') {
            return;
        }
        const selectedFN = $scope.GM_PUBLISH_METHOD_MAP[$scope.fnSelected];
        try {
            const log = eval($scope.fnCode);
            console.group(selectedFN.key);
            console.log($scope.fnCode);
            console.log(log);
            console.groupEnd();
            if (selectedFN.key === 'init') {
                $scope.inited = true;
            }
            if (selectedFN.key === 'destroy') {
                $scope.inited = false;
            }
            $scope.fnRunInfo = $sce.trustAsHtml(`<span class="success-info">
                    <a href="http://gridmanager.lovejavascript.com/api/index.html#${selectedFN.key}" target="_blank">${selectedFN.key}</a>
                    执行成功, 请打开控制台查看具体信息
                </span>`);
        } catch (e) {
            $scope.fnRunInfo = $sce.trustAsHtml(`<span class="error-info">
                    <a href="http://gridmanager.lovejavascript.com/api/index.html#${selectedFN.key}" target="_blank">${selectedFN.key}</a>
                    执行失败, 请打开控制台查看具体信息
                </span>`);
            console.error('执行错误: ', e);
        }
    };

    // 搜索
    $scope.searchForm = {
        title: '',
        type: '3',
        content: ''
    };

    /**
     * 搜索事件
     */
    $scope.onSearch = () => {
        console.log('onSearch');
        $gridManager.setQuery('testAngular', $scope.searchForm);
    };

    $scope.onReset = () => {
        $scope.searchForm = {
            title: '',
            type: '-1',
            content: ''
        };
    };

    // 表格渲染回调函数
    // query为gmOptions中配置的query
    $scope.callback = () => {
        $timeout(() => {
            $scope.inited = true;
            $scope.$digest();
        }, 100);
    };

    $scope.option = {
        gridManagerName: $scope.gridManagerName,
        width: '100%',
        height: '100%',
        supportAjaxPage:true,
        isCombSorting: true,
        disableCache: false,
        ajax_data: function () {
            return 'https://www.lovejavascript.com/blogManager/getBlogList';
        },
        ajax_type: 'POST',

        columnData: [
            {
                key: 'pic',
                remind: 'the pic',
                width: '110px',
                align: 'center',
                text: '缩略图',
                // ng template
                template: `<a target="_blank" style="display:block; height:58.5px;" ng-href="https://www.lovejavascript.com/#!zone/blog/content.html?id={{row.id}}" title="点击阅读[{{row.title}}]">
                                <img style="width:90px;margin:0 auto;" ng-src="https://www.lovejavascript.com/{{row.pic}}" alt="{{row.title}}">
                            </a>`
            },{
                key: 'title',
                remind: 'the title',
                align: 'left',
                text: '标题',
                sorting: '',
                // 使用函数返回 ng template
                template: function() {
                    return '<a class="plugin-action" target="_blank" ng-href="https://www.lovejavascript.com/#!zone/blog/content.html?id={{row.id}}" title="点击阅读[{{row.title}}]">{{row.title}}</a>';
                }
            },{
                key: 'type',
                remind: 'the type',
                text: '博文分类',
                align: 'center',
                width: '150px',
                sorting: '',
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
                    selected: $scope.searchForm.type,
                    // 否为多选, 布尔值, 默认为false。非必设项
                    isMultiple: true
                },
                // isShow: false,
                template: `<button type="button" ng-click="testClick(row)" ng-bind="TYPE_MAP[row.type]"></button>`
            },{
                key: 'info',
                remind: 'the info',
                width: '300px',
                text: '简介'
            },{
                key: 'username',
                remind: 'the username',
                align: 'center',
                width: '100px',
                text: '作者',
                // 使用函数返回 dom string
                template: `<a class="plugin-action" href="https://github.com/baukh789" target="_blank" title="去看看{{row.username}}的github">{{row.username}}</a>`
            },{
                key: 'createDate',
                width: '130px',
                text: '创建时间',
                sorting: 'DESC',
                // 使用函数返回 htmlString
                template: function(createDate, rowObject){
                    return new Date(createDate).toLocaleDateString();
                }
            },{
                key: 'lastDate',
                width: '130px',
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
                align: 'center',
                text: '<span style="color: red">操作</span>',
                // 直接返回 htmlString
                template: '<span class="plugin-action" ng-click="delectRowData(row, index)">删除</span>'
            }
        ]
    };

    /**
     * 模拟删除
     * @param row
     * @param index
     */
    $scope.delectRowData = function(row, index) {
        if(window.confirm(`确认要删除当前页第[${index}]条的['${row.title}]?`)){
            console.log('----删除操作开始----');
            $gridManager.refreshGrid('testAngular');
            // $element[0].querySelector('table[grid-manager="testAngular"]').GM('refreshGrid');
            console.log('数据没变是正常的, 因为这只是个示例,并不会真实删除数据.');
            console.log('----删除操作完成----');
        }
    };
}]);
