/*
 *  GridManager: 构造函数
 * */
import jTool from './jTool';
import Adjust from './Adjust';
import AjaxPage from './AjaxPage';
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
import Settings from './Settings';
import DOM from './DOM';
class GridManager {
	constructor() {
	};
	/*
	 * [对外公开方法]
	 * @初始化方法
	 * $.jToolObj: table [jTool object]
	 * $.arg: 参数
	 * $.callback:回调
	 * */
	init(jToolObj, arg, callback) {

		var _this = this;
		// 参数
		jTool.extend(Settings, arg);
		//通过版本较验 清理缓存
		Cache.cleanTableCacheForVersion(jToolObj, Settings.version);
		if(typeof Settings.gridManagerName !== 'string' || Settings.gridManagerName.trim() === ''){
			Settings.gridManagerName = jToolObj.attr('grid-manager');	//存储gridManagerName值
		}
		if(Settings.gridManagerName.trim() === ''){
			Settings.outLog('请在html标签中为属性[grid-manager]赋值或在配置项中配置gridManagerName', 'error');
			return false;
		}

		if(jToolObj.hasClass('GridManager-ready') || jToolObj.hasClass('GridManager-loading')){
			Settings.outLog('渲染失败：可能该表格已经渲染或正在渲染' , 'error');
			return false;
		}
		//根据本地缓存配置每页显示条数
		if(Settings.supportAjaxPage){
			AjaxPage.configPageForCache(jToolObj);
		}
		var query = jTool.extend({}, Settings.query, Settings.pageData);
		//增加渲染中标注
		jToolObj.addClass('GridManager-loading');
		_this.initTable(jToolObj);

		//如果初始获取缓存失败，则在mousedown时，首先存储一次数据
		if(typeof jToolObj.attr('grid-manager-cache-error') !== 'undefined'){
			window.setTimeout(function(){
				Cache.setToLocalStorage(jToolObj, true);
				jToolObj.removeAttr('grid-manager-cache-error');
			},1000);
		}

		//启用回调
		typeof(callback) == 'function' ? callback(query) :'';
		return jToolObj;
	}
	/*
	 @初始化列表
	 $.table: table[jTool object]
	 */
	initTable(table) {
		var _this = this;

		//渲染HTML，嵌入所需的事件源DOM
		DOM.createDOM(table);
		//获取本地缓存并对列表进行配置
		if(!Settings.disableCache){
			Cache.configTheadForCache(table);
			Settings.supportAdjust ? Adjust.resetAdjust(table) : ''; // 通过缓存配置成功后, 重置宽度调整事件源dom
		}
		//绑定宽度调整事件
		if(Settings.supportAdjust){
			Adjust.bindAdjustEvent(table);
		}
		//绑定拖拽换位事件
		if(Settings.supportDrag){
			Drag.bindDragEvent(table);
		}
		//绑定排序事件
		if(Settings.supportSorting){
			Sort.bindSortingEvent(table);
		}
		//绑定表头提示事件
		if(Settings.supportRemind){
			Remind.bindRemindEvent(table);
		}
		//绑定配置列表事件
		if(Settings.supportConfig){
			Config.bindConfigEvent(table);
		}
		//绑定表头吸顶功能
		// if(Settings.supportSetTop){
			Scroll.bindScrollFunction(table);
		// }
		//绑定右键菜单事件
		Menu.bindRightMenuEvent(table);
		//渲梁tbodyDOM
		Core.__refreshGrid();
		//将GridManager实例化对象存放于jTool data
		Cache.setGridManagerToJTool(table);

	}
}
// GM导入功能: 配置项
jTool.extend(GridManager.prototype, Settings);
// GM导入功能: 核心
jTool.extend(GridManager.prototype, Core);
// GM导入功能: 选择
jTool.extend(GridManager.prototype, Checkbox);
// GM导入功能: 宽度调整
jTool.extend(GridManager.prototype, Adjust);
// GM导入功能: 分页
jTool.extend(GridManager.prototype, AjaxPage);
// GM导入功能: 配置列显示隐藏
jTool.extend(GridManager.prototype, Config);
// GM导入功能: 拖拽
jTool.extend(GridManager.prototype, Drag);
// GM导入功能: 排序
jTool.extend(GridManager.prototype, Sort);
// GM导入功能: 导出数据
jTool.extend(GridManager.prototype, Export);
// GM导入功能: 国际化
jTool.extend(GridManager.prototype, I18n);
// GM导入功能: 右键菜单
jTool.extend(GridManager.prototype, Menu);
// GM导入功能: 序号
jTool.extend(GridManager.prototype, Order);
// GM导入功能: 表头提示
jTool.extend(GridManager.prototype, Remind);
// GM导入功能: 表头吸顶
jTool.extend(GridManager.prototype, Scroll);
// GM导入功能: DOM操作
jTool.extend(GridManager.prototype, DOM);

// 对外公开方法列表
var publishList = [
	'init',					//初始化
	'setSort',				//手动设置排序
	'get',					//通过jTool实例获取GridManager
	'getCheckedTr',			//获取当前选中的行
	'showTh',				//显示Th及对应的TD项
	'hideTh',				//隐藏Th及对应的TD项
	'exportGridToXls',		//导出表格 .xls
	'getLocalStorage',		//获取指定表格的本地存储数据
	'resetTd',				//重置列表[tbody]
	'setQuery',				//配置query 该参数会在分页触发后返回至pagingAfter(query)方法
	'refreshGrid',			//刷新表格 使用现有参数重新获取数据，对表格数据区域进行渲染
	'getRowData',			//获取当前行渲染时使用的数据
	'clear'					//清除指定表的表格记忆数据
];
(function ($) {
	// 捆绑至选择器对象
	Element.prototype.GM = Element.prototype.GridManager = function(_name_, _settings_, _callback_){
		if(this.length == 0){
			throw new Error('GridManager Error: DOM为空，请确定选择器匹配是否正确');
			return false;
		}
		var table = this;
		var $table = $(table);
		// 特殊情况处理：单组tr进行操作，如resetTd()方法
		if(table.nodeName === 'TR'){
			console.log('resetTd未执行');
			return;
		}
		var name,
			settings,
			callback;
		// 格式化参数
		// ex: $(table).GridManager()
		if(arguments.length === 0){
			name	 = 'init';
			settings = {};
			callback = undefined;
		}
		// ex: $(table).GridManager('init')
		else if(arguments.length === 1 && $.type(arguments[0]) === 'string' && $.type(arguments[0]) === 'init'){
			name	 = arguments[0];
			settings = {};
			callback = undefined;
		}
		// ex: $(table).GridManager('get')
		else if(arguments.length === 1 && $.type(arguments[0]) === 'string' && $.type(arguments[0]) !== 'init'){
			name	 = arguments[0];
			settings = undefined;
			callback = undefined;
		}
		// ex: $(table).GridManager({settings})
		else if(arguments.length === 1 && $.type(arguments[0]) === 'object'){
			name	 = 'init';
			settings = arguments[0];
			callback = undefined;
		}
		// ex: $(table).GridManager(callback)
		else if(arguments.length === 1 && $.type(arguments[0]) === 'function'){
			name	 = 'init';
			settings = undefined;
			callback = arguments[0];
		}
		// ex: $(table).GridManager('init', callback)
		else if(arguments.length === 2 && $.type(arguments[0]) === 'string' && $.type(arguments[1]) === 'function'){
			name	 = arguments[0];
			settings = arguments[1];
			callback = undefined;
		}
		// ex: $(table).GridManager('init', {settings})
		// ex: $(table).GridManager('resetTd', false)
		// ex: $(table).GridManager('exportGridToXls', 'fileName')
		else if(arguments.length === 2 && $.type(arguments[0]) === 'string' && $.type(arguments[1]) !== 'function'){
			name	 = arguments[0];
			settings = arguments[1];
			callback = undefined;
		}
		// ex: $(table).GridManager({settings}, callback)
		else if(arguments.length === 2 && $.isPlainObject(arguments[0]) && $.type(arguments[1]) === 'function'){
			name	 = 'init';
			settings = arguments[0];
			callback = arguments[1];
		}
		// ex: $(table).GridManager('resetTd', false)
		else if(arguments.length === 2 && $.type(arguments[0]) === 'string' && $.type(arguments[1]) === 'boolean'){
			name	 = arguments[0];
			settings = arguments[1];
			callback = undefined;
		}
		// ex: $(table).GridManager('init', {settings}, callback)
		else if(arguments.length === 3){
			name	 = arguments[0];
			settings = arguments[1];
			callback = arguments[2];
		}

		if(publishList.indexOf(name) === -1){
			throw new Error('GridManager Error:方法调用错误，请确定方法名['+ name +']是否正确');
			return false;
		}
		var gmObj;
		// 当前为初始化方法
		if(name == 'init') {
			var _GM = new GridManager();
			_GM.init($table, settings, _callback_);
			return _GM;
		}
		// 当前为其它方法
		else if(name != 'init'){
			gmObj = $table.data('gridManager');
			var gmData = gmObj[name]($table, settings, callback);
			//如果方法存在返回值则返回，如果没有返回jTool object用于链式操作
			return typeof(gmData) === 'undefined' ? $table : gmData;
		}
	};
})(jTool);

// 兼容jquery
(function(){
	if(typeof(jQuery) !== 'undefined' && jQuery.fn.extend) {
		jQuery.fn.extend({
			GM: function(settings){
				this.get(0).GM(settings)
			},
			GridManager: function(settings){
				this.get(0).GridManager(settings)
			}
		});
	}
})();
// 恢复jTool占用的$变量
(function(){
	window.$ = window._$ || undefined;
})();
