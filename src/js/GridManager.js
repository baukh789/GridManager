/*
 *  GridManager: 入口
 * */
import jTool from './jTool';
import Adjust from './Adjust';
import AjaxPage from './AjaxPage';
import Base from './Base';
import Cache from './Cache';
import Core from './Core';
import Config from './Config';
import Checkbox from './Checkbox';
import Drag from './Drag';
import Export from './Export';
import I18n from './I18n';
import Menu from './Menu';
import Order from './Order';
import Remind from './Remind';
import Scroll from './Scroll';
import Sort from './Sort';
import { Settings, TextSettings } from './Settings';
import DOM from './DOM';
import { Hover } from './Hover';
class GridManager {
	constructor() {
		this.version = '2.3.0';
		this.extentGridManager();
	}
	/*
	 * [对外公开方法]
	 * @初始化方法
	 * $.jToolObj: table [jTool object]
	 * $.arg: 参数
	 * $.callback:回调
	 * */
	init(jToolObj, arg, callback) {

		const _this = this;
		if(typeof arg.gridManagerName !== 'string' || arg.gridManagerName.trim() === ''){
			arg.gridManagerName = jToolObj.attr('grid-manager');	//存储gridManagerName值
		}
		// 配置参数
		var _settings = jTool.extend(true, {}, Settings);
		console.log(arg.gridManagerName);
		_settings.textConfig = new TextSettings();
		jTool.extend(true, _settings, arg);
		_this.updateSettings(jToolObj, _settings);

		jTool.extend(true, this, _settings);

		//通过版本较验 清理缓存
		_this.cleanTableCacheForVersion(jToolObj, this.version);
		if(_this.gridManagerName.trim() === ''){
			_this.outLog('请在html标签中为属性[grid-manager]赋值或在配置项中配置gridManagerName', 'error');
			return false;
		}

		// 验证当前表格是否已经渲染
		if(jToolObj.hasClass('GridManager-ready') || jToolObj.hasClass('GridManager-loading')){
			_this.outLog('渲染失败：可能该表格已经渲染或正在渲染' , 'error');
			return false;
		}

		//根据本地缓存配置每页显示条数
		if(_this.supportAjaxPage){
			_this.configPageForCache(jToolObj);
		}

		//增加渲染中标注
		jToolObj.addClass('GridManager-loading');

		// 初始化表格
		_this.initTable(jToolObj);
		//如果初始获取缓存失败，在渲染完成后首先存储一次数据
		if(typeof jToolObj.attr('grid-manager-cache-error') !== 'undefined'){
			window.setTimeout(() => {
				_this.setToLocalStorage(jToolObj, true);
				jToolObj.removeAttr('grid-manager-cache-error');
			},1000);
		}

		//启用回调
		typeof(callback) == 'function' ? callback(_this.query) :'';
		return jToolObj;
	}
	/*
	 @初始化列表
	 $.table: table[jTool object]
	 */
	initTable(table) {
		const _this = this;
		//渲染HTML，嵌入所需的事件源DOM
		DOM.createDOM(table);

		//获取本地缓存并对列表进行配置
		if(!_this.disableCache){
			_this.configTheadForCache(table);
			_this.supportAdjust ? _this.resetAdjust(table) : ''; // 通过缓存配置成功后, 重置宽度调整事件源dom
		}

		//绑定宽度调整事件
		if(_this.supportAdjust){
			_this.bindAdjustEvent(table);
		}

		//绑定拖拽换位事件
		if(_this.supportDrag){
			_this.bindDragEvent(table);
		}

		//绑定排序事件
		if(_this.supportSorting){
			_this.bindSortingEvent(table);
		}

		//绑定表头提示事件
		if(_this.supportRemind){
			_this.bindRemindEvent(table);
		}

		//绑定配置列表事件
		if(_this.supportConfig){
			_this.bindConfigEvent(table);
		}

		//绑定table区域hover事件
		_this.onTbodyHover(table);

		//绑定表头置顶功能
		_this.bindScrollFunction(table);

		//绑定右键菜单事件
		_this.bindRightMenuEvent(table);

		//渲染tbodyDOM
		_this.__refreshGrid(table);

		//将GridManager实例化对象存放于jTool data
		_this.setGridManagerToJTool.call(_this, table);
	}

	// 拼装GirdManager
	extentGridManager(){
		// GM导入功能: 配置项
		jTool.extend(true, this, Settings);

		// GM导入功能: 基本
		jTool.extend(this, Base);

		// GM导入功能: 核心
		jTool.extend(this, Core);

		// GM导入功能: 鼠标
		jTool.extend(this, Hover);

		// GM导入功能: 选择
		jTool.extend(this, Checkbox);

		// GM导入功能: 缓存
		jTool.extend(this, Cache);

		// GM导入功能: 宽度调整
		jTool.extend(this, Adjust);

		// GM导入功能: 分页
		jTool.extend(this, AjaxPage);

		// GM导入功能: 配置列显示隐藏
		jTool.extend(this, Config);

		// GM导入功能: 拖拽
		jTool.extend(this, Drag);

		// GM导入功能: 排序
		jTool.extend(this, Sort);

		// GM导入功能: 导出数据
		jTool.extend(this, Export);

		// GM导入功能: 国际化
		jTool.extend(this, I18n);

		// GM导入功能: 右键菜单
		jTool.extend(this, Menu);

		// GM导入功能: 序号
		jTool.extend(this, Order);

		// GM导入功能: 表头提示
		jTool.extend(this, Remind);

		// GM导入功能: 表头吸顶
		jTool.extend(this, Scroll);

		// GM导入功能: DOM操作
		jTool.extend(this, DOM);
	}
}

// 对外公开方法列表
const publishList = [
	'init',					//初始化
	'setSort',				//手动设置排序
	'get',					//通过jTool实例获取GridManager
	'getSettings',			//获取配置参数
	'showTh',				//显示Th及对应的TD项
	'hideTh',				//隐藏Th及对应的TD项
	'exportGridToXls',		//导出表格 .xls
	'getLocalStorage',		//获取指定表格的本地存储数据
	'setQuery',				//配置query 该参数会在分页触发后返回至pagingAfter(query)方法
	'setAjaxData',          //用于再次配置ajax_data数据, 配置后会根据配置的数据即刻刷新表格
	'refreshGrid',			//刷新表格 使用现有参数重新获取数据，对表格数据区域进行渲染
	'getCheckedTr',			//获取当前选中的行
	'getRowData',			//获取当前行渲染时使用的数据
	'getCheckedData',		//获取当前选中行渲染时使用的数据
	'clear'					//清除指定表的表格记忆数据
];
// 对外公开但不建议使用 [即将删除 或 存在性能问题]
const warnPublishList = [

];
/*
*  捆绑至选择器对象
* */
(function ($) {
	Element.prototype.GM = Element.prototype.GridManager = function () {
		const $table = $(this);
		// 特殊情况处理：单组tr进行操作，如resetTd()方法
		if(this.nodeName === 'TR'){
			return;
		}
		let name;  // 方法名
		let	settings; // 参数
		let	callback; // 回调函数
		let	condition; // 条件
		// 格式化参数
		// ex: document.querySelector('table').GridManager()
		if(arguments.length === 0){
			name	 = 'init';
			settings = {};
			callback = undefined;
		}
		// ex: document.querySelector('table').GridManager({settings}, callback)
		else if($.type(arguments[0]) !== 'string'){
			name	 = 'init';
			settings = arguments[0];
			callback = arguments[1];
		}
		// ex: document.querySelector('table').GridManager('get')
		// ex: document.querySelector('table').GM('showTh', $th);
		// ex: document.querySelector('table').GM('setSort',sortJson,callback, refresh);
		else {
			name = arguments[0];
			settings = arguments[1];
			callback = arguments[2];
			condition = arguments[3];
		}

		if(publishList.indexOf(name) === -1){
			throw new Error('GridManager Error:方法调用错误，请确定方法名['+ name +']是否正确');
			return false;
		}
		let gmObj;
		// 当前为初始化方法
		if(name == 'init') {
			const _GM = new GridManager();
			_GM.init($table, settings, callback);
			return _GM;
		}
		// 当前为其它方法
		else if(name != 'init'){
			gmObj = $table.data('gridManager');
			const gmData = gmObj[name]($table, settings, callback, condition);
			//如果方法存在返回值则返回，如果没有返回dom, 用于链式操作
			return typeof(gmData) === 'undefined' ? this : gmData;
		}
	};
})(jTool);

/*
* 兼容jquery
* */
(function(){
	if(typeof(jQuery) !== 'undefined' && jQuery.fn.extend) {
		jQuery.fn.extend({
			GM: function () {
				if(arguments.length === 0) {
					return this.get(0).GM();
				}
				else if(arguments.length === 1) {
					return this.get(0).GM(arguments[0]);
				}
				else if(arguments.length === 2) {
					return this.get(0).GM(arguments[0], arguments[1]);
				}
				else if(arguments.length === 3) {
					return this.get(0).GM(arguments[0], arguments[1], arguments[2]);
				}
			},
			GridManager: function () {
				if(arguments.length === 0) {
					return this.get(0).GridManager();
				}
				else if(arguments.length === 1) {
					return this.get(0).GridManager(arguments[0]);
				}
				else if(arguments.length === 2) {
					return this.get(0).GridManager(arguments[0], arguments[1]);
				}
				else if(arguments.length === 3) {
					return this.get(0).GridManager(arguments[0], arguments[1], arguments[2]);
				}
			}
		});
	}
})();
// 恢复jTool占用的$变量
(function(){
	window.$ = window._$ || undefined;
})();
