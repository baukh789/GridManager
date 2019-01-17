/**
 * Settings: 配置项
 */
import {$} from './Base';

class Settings {
	constructor() {
		/**
		 * 框架相关配置
		 */
		const frameworks = {
			// @2.6.0
			// vue框架解析器，在gridmanager-vue项目中使用
			compileVue: null,

            // @2.6.13
            // angularjs框架解析器，在gridmanager-angularjs项目中使用
            compileAngularjs: null
		};

		/**
		 * 拖拽
		 */
		const drag = {
			// 是否支持拖拽功能
			supportDrag: true,

			// 拖拽前事件
			dragBefore: $.noop,

			// 拖拽后事件
			dragAfter: $.noop
		};

		/**
		 * 宽度调整
		 */
		const adjust = {
			// 是否支持宽度调整功能
			supportAdjust: true,

			// 宽度调整前事件
			adjustBefore: $.noop,

			// 宽度调整后事件
			adjustAfter: $.noop
		};

		/**
		 * 右键菜单
		 */
		const menu = {
			supportMenu: true
		};

		/**
		 * 配置列表
		 */
		const config = {
			// 是否支持配置列表功能[操作列是否可见]
			supportConfig: true,

			// 配置区域的描述信息
			configInfo: '配置列的显示状态'
		};

		/**
		 * 样式
		 */
		const gridStyle = {
			// 宽度配置
			width: '100%',

			// 高度配置, 可配置的最小宽度为300px
			height: '300px',

			// 文本对齐方式
			// textAlign: '',       // v2.3.15弃用

			// 动画效果时长
			animateTime: 300,

            // 配置是否禁用单元格分割线
            disableLine: false,  // v2.6.1新增

            // 配置是否禁用边框线
            disableBorder: false,  // v2.6.1新增

            // 数据加载中模板
            loadingTemplate: '<div class="loading"><div class="loadInner kernel"></div></div>', // v2.6.2新增

            //  皮肤样式所使用的className
            skinClassName: '', // v2.7.0 新增

            // 表头的icon图标是否跟随文本
            isIconFollowText: false // v2.7.0 新增
		};

        /**
         * hover选中
         * @type {{disableHover: boolean}}
         */
		const hover = {
            // 配置是否禁用hover选中样式
            disableHover: false, // v2.6.1新增

            // 单个td的hover事件
            cellHover: $.noop
        };

		/**
		 * 本地缓存
		 */
		const cache = {
			// 是否禁用本地缓存
			disableCache: true
		};

		/**
		 * 排序
		 */
		const sort = {
			// 是否为组合排序[只有在支持排序的情况下生效
			isCombSorting: false,

            // 配置是否合并排序字段
            // false: {sort_createDate: 'DESC', sort_title: 'ASC'}
            // true: sort: 'createDate: "DESC"'
            mergeSort: false,

            // mergeSort=true: 排序所使用的字段名, 示例: 列名='createDate', sortKey='orderBys', 排序参数为: orderBys: 'createDate:"DESC"'
            // mergeSort=false: 排序所使用的字段名前缀, 示例: 列名='createDate', sortKey='sort_', 排序参数为: sort_createDate: 'DESC'
			sortKey: 'sort_',

			// 存储排序数据[不对外公开参数]
			sortData: {},

			// 排序：升序标识[该标识将会传至数据接口]
			sortUpText: 'ASC',

			// 排序：降序标识[该标识将会传至数据接口]
			sortDownText: 'DESC',

			// 排序事件发生前
			sortingBefore: $.noop,

			// 排序事件发生后
			sortingAfter: $.noop
		};

		/**
		 * 分页
		 */
		const ajaxPage = {
			// 是否支持配置列表ajxa分页
			supportAjaxPage: false,

            // 是否使用无总条数模式
            useNoTotalsMode: false,

            // 是否显示底部工具: 刷新按纽
            showFooterRefresh: true,

            // 是否显示底部工具: 快捷跳转
            showFooterGoTo: true,

            // 是否显示底部工具: 切换每页显示条数
            showFooterPageSize: true,

            // 是否显示底部工具: 选中项描述信息
            showFooterCheckedInfo: true,

            // 是否显示底部工具: 分页描述信息
            showFooterPageInfo: true,

			// 用于配置列表每页展示条数选择框
			sizeData: [10, 20, 30, 50, 100],

			// 每页显示条数，如果使用缓存且存在缓存数据，那么该值将失效
			pageSize: 20,

			// 存储分页数据[不对外公开参数]
			pageData: {},

			// 返回数据中数据总条数的key键值,默认为totals
			totalsKey: 'totals',

			// @2.6.0
			// 请求参数中当前页的key键值,默认为cPage
			currentPageKey: 'cPage',

			// @2.6.0
			// 请求参数中每页显示条数的key健值, 默认为pSize
			pageSizeKey: 'pSize',

			// 分页事件发生前
			pagingBefore: $.noop,

			// 分页事件发生后
			pagingAfter: $.noop
		};

		/**
		 * 序号
		 */
		const autoOrder = {
			// 是否支持自动序号
			supportAutoOrder: true
		};

		/**
		 * 选择与反选
		 */
		const checkbox = {
			// 是否支持选择与反选
			supportCheckbox: true,

            // 使用行选中
            useRowCheck: false,

            // 使用单选
            useRadio: false,

			// 选择事件执行前事件
			checkedBefore: $.noop,

			// 选择事件执行后事件
			checkedAfter: $.noop,

			// 全选事件执行前事件
			checkedAllBefore: $.noop,

			// 全选事件执行后事件
			checkedAllAfter: $.noop
		};

		/**
		 * 国际化
		 */
		const i18n = {
			// 选择使用哪种语言，暂时支持[zh-cn:简体中文，en-us:美式英语, zh-tw: 繁体中文] 默认zh-cn
			i18n: 'zh-cn'
		};

		/**
		 * 数据交互相关项
		 */
		const gridData = {
			// 表格列数据配置项
			/* columnData示例
			columnData: [{

                // 列的唯一索引。字符串类型，必设项
                key: 'url',

                // 列的显示文本。字符串类型，必设项
                text: 'url',

                // @2.4.0
                // 是否显示, 默认值 true
                isShow: true,

                // @2.6.13
                // 该列是否禁止使用个性配置功能(宽度调整、位置更换、列的显示隐藏)
                disableCustomize: false

                // 列所占宽度, 字符串类型，非必设项
                // 需要注意的是:
                // 1.如果当前列的th内文本实际占用宽度大于该参数指定的宽度时， GridManager会自动进行适配。
                // 2.建议不要将所有的列都进行宽度设置，而留一个进行自动适应
                width: '100px',

                // 列文本对齐信息，字符串类型，非必设项
                // 三种值: 'left', 'center', 'right'
                align: '',

                // 列的排序类型，字符串类型，非必设项
                // 1、'': 该列支持排序，但初始化时不指定排序类型
                // 2、'DESC': 该列支持排序，并在初始化时指定排序类型为降序。可通过参数[sortDownText]来指定降序所使用的字符串
                // 3、'ASC': 该列支持排序，并在初始化时指定排序类型为升序。可通过参数[sortUpText]来指定升序所使用的字符串
                sorting: 'DESC',

                // 列的表头提醒内容,字符串类型，非必设项
                remind: '文本介绍',

                // 表头筛选条件, 该值由用户操作后会将选中的值以{key: value}的形式覆盖至query参数内。非必设项
                filter: {
                    // 筛选条件列表, 数组对象。格式: [{value: '1', text: 'HTML/CSS'}],在使用filter时该参数为必设项。
                    option: [],
                    // 筛选选中项，字符串, 默认为''。 非必设项，选中的过滤条件将会覆盖query
                    selected: '3',
                    // 否为多选, 布尔值, 默认为false。非必设项
                    isMultiple: false
                },
                // 自定义列模板，函数类型，非必设项
                // 通过返回的字符串对列进行重绘
                // nodeData: 当前单元格的渲染数据
                // rowData: 当前单元格所在行的渲染数据, 本例中: 参数nodeData=== rowData.url
                template: function(nodeData, rowData){
                    return '<a href="'+nodeData+'">'+rowData.url+'</a>';
                }
			 }]
			*/

			// tr区域顶部通栏
            topFullColumn: {},

            // 列配置
			columnData: [],

			// 表格grid-manager所对应的值[可在html中配置]
			gridManagerName: '',

			// @2.5.8
			// 初次渲染时是否加载数据
			firstLoading: true,

			// @2.6.0 不再建议使用且在外续版本中会被移除
			// 后端API调用地址
			// ajax_url: '',

			// 后端API调用, [string url | function {retrun string url | promise | data}] @v2.6.0
			ajax_data: undefined,

			// ajax请求类型['GET', 'POST']默认GET
			ajax_type: 'GET',

			// 其它需要带入的参数，该参数中设置的数据会在分页或排序事件中以参数形式传递
            // 过滤中的选中值将会覆盖query参数
			query: {},

			// ajax请求头信息
			ajax_headers: {},

			// @v2.4.0
			// 设置XHR对象, ajax_xhrFields 中的属性将追加至实例化后的XHR对象上
			// 示例 -> ajax_xhrFields: {withCredentials: true}, 那么将会配置跨域访问时协带cookies, authorization headers(头部授权)
			ajax_xhrFields: {},

			// ajax请求之前,与jTool的beforeSend使用方法相同
			ajax_beforeSend: $.noop,

			// ajax成功后,与jTool的success使用方法相同
			ajax_success: $.noop,

			// ajax完成后,与jTool的complete使用方法相同
			ajax_complete: $.noop,

			// ajax失败后,与jTool的error使用方法相同
			ajax_error: $.noop,

			// 请求前处理程序, 可以通过该方法修改全部的请求参数 @v2.3.14
			requestHandler: request => request,

			// 执行请求后执行程序, 通过该程序可以修改返回值格式. 仅有成功后该函数才会执行 @v2.3.14
			responseHandler: response => response,

			// 返回数据中列表数据的key键值,默认为data
			dataKey: 'data',

			// 为空时显示的html
			emptyTemplate: '<div class="gm-emptyTemplate">暂无数据</div>'
		};

		/**
		 * 表格导出
		 */
		const gridExport = {
			// 支持导出表格数据
			supportExport: true,

            // 导出相关配置
            exportConfig: {
			    // 导出的方式: 默认为static
                // 1.static: 前端静态导出, 无需后端提供接口，该方式导出的文件并不完美。
                // 2.blob: 通过后端接口返回二进制流。`nodejs`可使用`js-xlsx`, `java`可使用 `org.apache.poi`生成二进制流。
                mode: 'static',

                // 导出的后缀名, 默认为`xls`。
                suffix: 'xls',

                // 导出处理器函数,该函数需要返回一个promise。当`exportType`为`static`时，该参数不生效。
                handler: $.noop
            }
		};

		const settings = {
			...frameworks,
			...drag,
			...adjust,
			...menu,
			...config,
			...gridStyle,
			...cache,
			...sort,
			...ajaxPage,
			...autoOrder,
			...checkbox,
			...i18n,
			...gridData,
			...gridExport,
            ...hover
		};
		$.extend(true, this, settings);
	}
}

// 表格中使用到的国际化文本信息
class TextSettings {
	constructor() {
	    // order
		this['order-text'] = {
			'zh-cn': '序号',
			'zh-tw': '序號',
			'en-us': 'order'
		};

		// ajax page
        this['refresh-action'] = {
            'zh-cn': '<i class="iconfont icon-refresh"></i>',
            'zh-tw': '<i class="iconfont icon-refresh"></i>',
            'en-us': '<i class="iconfont icon-refresh"></i>'
        };
		this['first-page'] = {
			'zh-cn': '首页',
			'zh-tw': '首頁',
			'en-us': 'first'
		};
		this['previous-page'] = {
			'zh-cn': '上一页',
			'zh-tw': '上一頁',
			'en-us': 'previous'
		};
		this['next-page'] = {
			'zh-cn': '下一页',
			'zh-tw': '下一頁',
			'en-us': 'next'
		};
		this['last-page'] = {
			'zh-cn': '尾页',
			'zh-tw': '尾頁',
			'en-us': 'last'
		};

		// page-info 会传入五个值
        // 0: 当前页从多少条开始显示
        // 1: 当前页到多少条结束显示
        // 2: 总条数
        // 3: 当前页
        // 4: 总页数
		this['page-info'] = {
			'zh-cn': '此页显示 {0}-{1}<span class="page-info-totals"> 共{2}条</span>',
			'zh-tw': '此頁顯示 {0}-{1}<span class="page-info-totals"> 共{2}條</span>',
			'en-us': 'this page show {0}-{1}<span class="page-info-totals"> count {2}</span>'
		};
        this['checked-info'] = {
            'zh-cn': '已选 {0} 条',
            'zh-tw': '已選 {0} 條',
            'en-us': 'selected {0}'
        };
		this['goto-first-text'] = {
			'zh-cn': '跳转至',
			'zh-tw': '跳轉至',
			'en-us': 'goto'
		};
		this['goto-last-text'] = {
			'zh-cn': '页',
			'zh-tw': '頁',
			'en-us': 'page'
		};

		// menu
        this['menu-previous-page'] = {
            'zh-cn': '上一页',
            'zh-tw': '上一頁',
            'en-us': 'previous'
        };
        this['menu-next-page'] = {
            'zh-cn': '下一页',
            'zh-tw': '下一頁',
            'en-us': 'next'
        };
		this['menu-refresh'] = {
			'zh-cn': '重新加载',
			'zh-tw': '重新加載',
			'en-us': 'Refresh'
		};
		this['menu-save-as-excel'] = {
			'zh-cn': '另存为Excel',
			'zh-tw': '另存為Excel',
			'en-us': 'Save as Excel'
		};
		this['menu-save-as-excel-for-checked'] = {
			'zh-cn': '已选中项另存为Excel',
			'zh-tw': '已選中項另存為Excel',
			'en-us': 'Save selected as Excel'
		};
		this['menu-config-grid'] = {
			'zh-cn': '配置表',
			'zh-tw': '配置表',
			'en-us': 'Setting Grid'
		};

		// filter
        this['filter-ok'] = {
            'zh-cn': '确定',
            'zh-tw': '確定',
            'en-us': 'OK'
        };
        this['filter-reset'] = {
            'zh-cn': '重置',
            'zh-tw': '重置',
            'en-us': 'Reset'
        };
	}
}

export {Settings, TextSettings};
