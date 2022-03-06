/**
 * Created by baukh on 18/4/11.
 */
import angular from 'angular';
import gridManagerModule from '../js/index';

// 静态数据

const getData = num => {
    const data = [];
    let child = [];

    for (let i = 1; i<= num; i++) {
        child = [];
        for (let j = 1; j<= 40; j++) {
            child.push({
                "id": parseInt((i.toString() + j.toString()), 10),
                "pic": '/upload/blog/pic/6717_%E5%AF%BC%E5%87%BA.png',
                "author": "33",
                "praiseNumber": "0",
                "status": "1",
                "readNumber": "111",
                "title": "测试数据" + j,
                "subtitle": "测试数据" + j,
                "type": j % 5,
                "info": "野生前端程序",
                "createDate": 1579350185000,
                "lastDate": 1579662679374,
                "commentSum": 0,
                "username": "拭目以待"
            });
        }
        data.push({
            "id": i,
            "pic": '/upload/blog/pic/6717_%E5%AF%BC%E5%87%BA.png',
            "author": "33",
            "praiseNumber": "0",
            "status": "1",
            "readNumber": "111",
            "title": "测试数据" + i,
            "subtitle": "测试数据" + i,
            "type": i % 5,
            "info": "野生前端程序",
            "createDate": 1579350185000,
            "lastDate": 1579662679374,
            "commentSum": 0,
            "username": "拭目以待",
            "children": child
        });
    }

    return data;
};
const ajaxData1 = {
    "data": getData(20),
    "totals": 20
};

const getColumnData = () => {
    return [
        {
            key: 'pic',
            remind: {
                text: 'the pic',
                style: {
                    color: 'yellow'
                }
            },
            width: '130px',
            align: 'center',
            text: '缩略图',
            // ng template
            template: `<a target="_blank" style="display:inline-block;" ng-href="https://www.lovejavascript.com/#!zone/blog/content.html?id={{row.id}}" title="点击阅读[{{row.title}}]">
                                <img style="width:90px;height:58.5px;margin:0 auto;" ng-src="https://www.lovejavascript.com/{{row.pic}}"/>
                            </a>`
        },{
            key: 'title',
            remind: 'the title',
            align: 'left',
            text: '标题',
            // 使用函数返回 ng template
            template: function() {
                return '<a class="plugin-action" target="_blank" ng-href="https://www.lovejavascript.com/#!zone/blog/content.html?id={{row.id}}" title="点击阅读[{{row.title}}]" ng-bind="row.title"></a>';
            }
        },{
            key: 'type',
            text: '博文分类',
            align: 'center',
            width: '150px',
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
                isMultiple: true
            },
            // ng template
            template: '<button type="button" ng-click="testClick(row)" ng-bind="TYPE_MAP[row.type]"></button>'
        },{
            key: 'info',
            remind: 'the info',
            width: '300px',
            text: '简介'
        },{
            key: 'readNumber',
            text: '阅读',
        },{
            key: 'username',
            remind: 'the username',
            align: 'center',
            width: '100px',
            text: '作者',
            // 使用函数返回 dom string
            template: `<a class="plugin-action" href="https://github.com/baukh789" target="_blank" title="去看看{{row.username}}的github" ng-bind="row.username"></a>`
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
            disableCustomize: true,
            fixed: 'right',
            text: '<span style="color: red" ng-click="actionAlert()">操作</span>',
            // 直接返回 htmlString
            template: '<span class="plugin-action" ng-click="editRowData(row, index)">编辑</span>'
        }
    ];
};
var index = angular.module("myApp", [gridManagerModule]);
index.controller('AppController', ['$window', '$rootScope', '$scope', '$element', '$gridManager', function($window, $rootScope, $scope, $element, $gridManager) {
    $scope.testClick = (row) => {
        console.log('click', row);
    };

    // 常量: 搜索条件
    $scope.TYPE_MAP = {
        '1': 'HTML/CSS',
        '2': 'nodeJS',
        '3': 'javaScript',
        '4': '前端鸡汤',
        '5': 'PM Coffee',
        '6': '前端框架',
        '7': '前端相关'
    };

    $scope.searchForm = {
        title: '',
        content: ''
    };

    /**
     * 搜索事件
     */
    $scope.onSearch = () => {
        console.log('onSearch');
        $gridManager.setQuery('test', $scope.searchForm);
    };

    $scope.onReset = () => {
        $scope.searchForm = {
            title: '',
            content: ''
        };
    };

    $scope.onAddCol = () => {
		$scope.option.columnData.unshift({
			key: 'add' + Math.random(),
			text: () => {
				return '新增的列';
			}
		})
		$gridManager.renderGrid($scope.option.gridManagerName, $scope.option.columnData);
	};

    // 事件: 初始化
    $scope.onInit = () => {
        $scope.option.columnData = getColumnData();
        $scope.destroyDisabled = false;
    };

    // 事件: 销毁
    $scope.onDestroy = () => {
        $scope.destroyDisabled = true;
    };

    // 表格渲染回调函数
    // query为gmOptions中配置的query
    let now = Date.now();
    $scope.callback = function(query) {
        console.log('callback => ', Date.now() - now);
    };

    $scope.option = {
        gridManagerName: 'test',
        width: '100%',
        height: '100%',
        virtualScroll: {
            useVirtualScroll: true
        },
        supportAjaxPage:true,
        isCombSorting: true,
        disableCache: false,
        supportMoveRow: true,
        useCellFocus: true,
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
        //         title: '<span style="color: red" ng-click="actionAlert()">测试 angular template</span>',
        //         readNumber
        //     }
        // },
        // 图标跟随文本
        isIconFollowText: true,
        // firstLoading: false,
        emptyTemplate: settings => {
            const text = settings.query.title ? '查询结果为空' : '这个Angular 1.x表格, 什么数据也没有';
            return `<section style="text-align: center" ng-bind="'${text}'"></section>`;
        },
        // topFullColumn: {
        //     template:  (row, index) => {
        //         return `<div style="padding: 12px; text-align: center">
        //             快速、灵活的对Table标签进行实例化，让Table标签充满活力。该项目已开源,
        //             <a target="_blank" href="https://github.com/baukh789/GridManager">点击进入</a>
        //             github
        //         </div>`;
        //     }
        // },
        // supportTreeData: true,
        ajaxData: function () {
            return 'https://www.lovejavascript.com/blogManager/getBlogList';
        },
        // ajaxData: ajaxData1,
        checkedAfter: aa => {
            console.log(aa);
        },
        ajaxType: 'POST',

        columnData: getColumnData()
    };

    $scope.actionAlert = function() {
        alert('操作栏th是由ng模板渲染的');
    };

    /**
     * 模拟编辑
     * @param row
     * @param index
     */
    $scope.editRowData = function(row, index) {
        row.title = row.title + '(编辑于' + new Date().toLocaleDateString() +')';
    };
}]);
