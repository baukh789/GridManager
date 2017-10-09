/*
 *  GridManager: 入口
 * */
import '../css/index.scss';
import { jTool } from './Base';
import Adjust from './Adjust';
import AjaxPage from './AjaxPage';
// import Base from './Base';
import Cache from './Cache';
import Core from './Core';
import Config from './Config';
// import Checkbox from './Checkbox';
import Drag from './Drag';
// import Export from './Export';
// import I18n from './I18n';
import Menu from './Menu';
// import Order from './Order';
import Remind from './Remind';
import Scroll from './Scroll';
import Sort from './Sort';
import { Settings, TextSettings } from './Settings';
import Hover from './Hover';
import { PublishMethod, publishMethodArray } from './Publish';
class GridManager {
	constructor() {
		this.version = '2.3.15';
		// this.extentGridManager();
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
		if (typeof arg.gridManagerName !== 'string' || arg.gridManagerName.trim() === '') {
			// 存储gridManagerName值
			arg.gridManagerName = jToolObj.attr('grid-manager');
		}

		// 配置参数
		var _settings = new Settings();
		_settings.textConfig = new TextSettings();
		jTool.extend(true, _settings, arg);
		Cache.updateSettings(jToolObj, _settings);

		jTool.extend(true, this, _settings);

		// 通过版本较验 清理缓存
		Cache.cleanTableCacheForVersion(jToolObj, this.version);
		if (_this.gridManagerName.trim() === '') {
			_this.outLog('请在html标签中为属性[grid-manager]赋值或在配置项中配置gridManagerName', 'error');
			return false;
		}

		// 验证当前表格是否已经渲染
		if (jToolObj.hasClass('GridManager-ready') || jToolObj.hasClass('GridManager-loading')) {
			_this.outLog('渲染失败：可能该表格已经渲染或正在渲染', 'error');
			return false;
		}

		// 根据本地缓存配置每页显示条数
		if (_this.supportAjaxPage) {
			AjaxPage.configPageForCache(jToolObj);
		}

		// 增加渲染中标注
		jToolObj.addClass('GridManager-loading');

		// 初始化表格
		_this.initTable(jToolObj);
		// 如果初始获取缓存失败，在渲染完成后首先存储一次数据
		if (typeof jToolObj.attr('grid-manager-cache-error') !== 'undefined') {
			window.setTimeout(() => {
				Cache.saveUserMemory(jToolObj);
				jToolObj.removeAttr('grid-manager-cache-error');
			}, 1000);
		}
		// 启用回调
		typeof (callback) === 'function' ? callback(_this.query) : '';
		return jToolObj;
	}

	/*
	 @初始化列表
	 $.table: table[jTool object]
	 */
	initTable(table) {
		const _this = this;
		// 渲染HTML，嵌入所需的事件源DOM
		Core.createDOM(table);

		// 获取本地缓存并对列表进行配置
		if (!_this.disableCache) {
			Cache.configTheadForCache(table);
			// 通过缓存配置成功后, 重置宽度调整事件源dom
			_this.supportAdjust ? Adjust.resetAdjust(table) : '';
		}

		// 绑定宽度调整事件
		if (_this.supportAdjust) {
			Adjust.bindAdjustEvent(table);
		}

		// 绑定拖拽换位事件
		if (_this.supportDrag) {
			Drag.bindDragEvent(table);
		}

		// 绑定排序事件
		if (_this.supportSorting) {
			Sort.bindSortingEvent(table);
		}

		// 绑定表头提示事件
		if (_this.supportRemind) {
			Remind.bindRemindEvent(table);
		}

		// 绑定配置列表事件
		if (_this.supportConfig) {
			Config.bindConfigEvent(table);
		}

		// 绑定table区域hover事件
		Hover.onTbodyHover(table);

		// 绑定表头置顶功能
		Scroll.bindScrollFunction(table);

		// 绑定右键菜单事件
		Menu.bindRightMenuEvent(table);

		// 渲染tbodyDOM
		Core.__refreshGrid(table);

		// TODO Eslint整改时, 不再将各个模块拼装至GirdManager, 所以验证是否已经实例化的方式需要调整
		// 将GridManager实例化对象存放于jTool data
		Cache.setGridManagerToJTool(table, _this);
	}
}

/*
*  捆绑至选择器对象
* */
(function ($) {
	Element.prototype.GM = Element.prototype.GridManager = function () {
		const $table = $(this);

		// 特殊情况处理：单组tr进行操作，如resetTd()方法
		if (this.nodeName === 'TR') {
			return;
		}
		// 方法名
		let name = null;

		// 参数
		let	settings = null;

		// 回调函数
		let	callback = null;

		// 条件
		let	condition = null;

		// 格式化参数
		// ex: document.querySelector('table').GridManager()
		if (arguments.length === 0) {
			name	 = 'init';
			settings = {};
			callback = undefined;
		} else if ($.type(arguments[0]) !== 'string') {
			// ex: document.querySelector('table').GridManager({settings}, callback)
			name	 = 'init';
			settings = arguments[0];
			callback = arguments[1];
		} else {
			// ex: document.querySelector('table').GridManager('get')
			// ex: document.querySelector('table').GM('showTh', $th);
			// ex: document.querySelector('table').GM('setSort',sortJson,callback, refresh);
			name = arguments[0];
			settings = arguments[1];
			callback = arguments[2];
			condition = arguments[3];
		}

		if (publishMethodArray.indexOf(name) === -1) {
			throw new Error(`GridManager Error:方法调用错误，请确定方法名[${name}]是否正确`);
		}

		// let gmObj;
		// 当前为初始化方法
		if (name === 'init') {
			const _GM = new GridManager();
			_GM.init($table, settings, callback);
			return _GM;
			// 当前为其它方法
		} else if (name !== 'init') {
			// gmObj = $table.data('gridManager');
			// console.log(gmObj);
			const gmData = PublishMethod[name]($table, settings, callback, condition);

			// 如果方法存在返回值则返回，如果没有返回dom, 用于链式操作
			return typeof (gmData) === 'undefined' ? this : gmData;
		}
	};
})(jTool);

/*
* 兼容jquery
* */
(function () {
	if (typeof (window.jQuery) !== 'undefined' && window.jQuery.fn.extend) {
		window.jQuery.fn.extend({
			GM: function () {
				if (arguments.length === 0) {
					return this.get(0).GM();
				} else if (arguments.length === 1) {
					return this.get(0).GM(arguments[0]);
				} else if (arguments.length === 2) {
					return this.get(0).GM(arguments[0], arguments[1]);
				} else if (arguments.length === 3) {
					return this.get(0).GM(arguments[0], arguments[1], arguments[2]);
				}
			},
			GridManager: function () {
				if (arguments.length === 0) {
					return this.get(0).GridManager();
				} else if (arguments.length === 1) {
					return this.get(0).GridManager(arguments[0]);
				} else if (arguments.length === 2) {
					return this.get(0).GridManager(arguments[0], arguments[1]);
				} else if (arguments.length === 3) {
					return this.get(0).GridManager(arguments[0], arguments[1], arguments[2]);
				}
			}
		});
	}
})();

// 恢复jTool占用的$变量
(function () {
	window.$ = window._$ || undefined;
})();
