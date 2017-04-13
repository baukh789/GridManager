/**
 * Settings: 配置项
 */
import $ from './jTool';
const Settings = {
	// 拖拽
	supportDrag: true,  // 是否支持拖拽功能
	dragBefore: $.noop, // 拖拽前事件
	dragAfter: $.noop,	// 拖拽后事件

	// 宽度调整
	supportAdjust: true,  // 是否支持宽度调整功能
	adjustBefore: $.noop, // 宽度调整前事件
	adjustAfter: $.noop,  // 宽度调整后事件

	// 是否支持表头提示信息[需在地应的TH上增加属性remind]
	supportRemind: false,

	// 是否支持配置列表功能[操作列是否可见]
	supportConfig: true,

	// 宽度配置
	width: '100%',

	// 高度配置, 可配置的最小宽度为300px
	height: '300px',

	// 文本对齐方式
	textAlign: '',

	// 动画效果时长
	animateTime: 300,

	// 是否禁用本地缓存
	disableCache: false,

	// 排序 sort
	supportSorting		: false, 					//排序：是否支持排序功能
	isCombSorting		: false,					//是否为组合排序[只有在支持排序的情况下生效
	sortKey				: 'sort_',					//排序字段前缀, 示例: 列名='date', sortKey='sort_', 排序参数则为sort_date
	sortData 			: {},						//存储排序数据[不对外公开参数]
	sortUpText			: 'ASC',					//排序：升序标识[该标识将会传至数据接口]
	sortDownText		: 'DESC',					//排序：降序标识[该标识将会传至数据接口]
	sortingBefore		: $.noop,					//排序事件发生前
	sortingAfter		: $.noop,					//排序事件发生后

	// 分页 ajaxPag
	supportAjaxPage		: false,					//是否支持配置列表ajxa分页
	sizeData 			: [10,20,30,50,100], 		//用于配置列表每页展示条数选择框
	pageSize			: 20,						//每页显示条数，如果使用缓存且存在缓存数据，那么该值将失效
	pageData 			: {},						//存储分页数据[不对外公开参数]
	query 				: {},						//其它需要带入的参数，该参数中设置的数据会在分页或排序事件中以参数形式传递
	pagingBefore		: $.noop,					//分页事件发生前
	pagingAfter			: $.noop,					//分页事件发生后

	//序目录
	supportAutoOrder	: true,						//是否支持自动序目录

	//全选项
	supportCheckbox		: true,						//是否支持选择与反选

	//国际化
	i18n	 			: 'zh-cn',					//选择使用哪种语言，暂时支持[zh-cn:简体中文，en-us:美式英语] 默认zh-cn

	//用于支持通过数据渲染DOM
	columnData			: [],						//表格列数据配置项
	gridManagerName   	: '',						//表格grid-manager所对应的值[可在html中配置]
	ajax_url			: '',						//获取表格数据地址，配置该参数后，将会动态获取数据
	ajax_type			: 'GET',					//ajax请求类型['GET', 'POST']默认GET
	ajax_headers		: {},						//ajax请求头信息
	ajax_beforeSend		: $.noop,					//ajax请求之前,与jTool的beforeSend使用方法相同
	ajax_success		: $.noop,					//ajax成功后,与jTool的success使用方法相同
	ajax_complete		: $.noop,					//ajax完成后,与jTool的complete使用方法相同
	ajax_error			: $.noop,					//ajax失败后,与jTool的error使用方法相同
	ajax_data			: undefined,				//ajax静态数据,配置后ajax_url将无效
	dataKey				: 'data',					//ajax请求返回的列表数据key键值,默认为data
	totalsKey			: 'totals',					//ajax请求返回的数据总条数key键值,默认为totals
	//数据导出
	supportExport		: true						//支持导出表格数据
};

// 表格中使用到的国际化文本信息
const TextSettings = function (){
	this['order-text'] = {
		'zh-cn':'序号',
		'en-us':'order'
	};
	this['first-page'] = {
		'zh-cn':'首页',
		'en-us':'first'
	};
	this['previous-page'] = {
		'zh-cn':'上一页',
		'en-us':'previous'
	};
	this['next-page'] = {
		'zh-cn':'下一页',
		'en-us':'next'
	};
	this['last-page'] = {
		'zh-cn':'尾页',
		'en-us':'last'
	};
	this['dataTablesInfo'] = {
		'zh-cn':'此页显示 {0}-{1} 共{2}条',
		'en-us':'this page show {0}-{1} count {2}'
	};
	this['goto-first-text'] = {
		'zh-cn':'跳转至',
		'en-us':'goto'
	};
	this['goto-last-text'] = {
		'zh-cn':'页',
		'en-us':'page'
	};
	this['refresh'] = {
		'zh-cn':'重新加载',
		'en-us':'Refresh'
	};
	this['save-as-excel'] = {
		'zh-cn':'另存为Excel',
		'en-us':'Save as Excel'
	};
	this['save-as-excel-for-checked'] = {
		'zh-cn':'已选中项另存为Excel',
		'en-us':'Save selected as Excel'
	};
	this['setting-grid'] = {
		'zh-cn':'配置表',
		'en-us':'Setting Grid'
	};
	this['checkall-text'] = {
		'zh-cn':'全选',
		'en-us':'All'
	};
};
export { Settings, TextSettings }
