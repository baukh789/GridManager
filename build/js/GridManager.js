/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _jTool = __webpack_require__(1);

	var _jTool2 = _interopRequireDefault(_jTool);

	var _Adjust = __webpack_require__(3);

	var _Adjust2 = _interopRequireDefault(_Adjust);

	var _AjaxPage = __webpack_require__(6);

	var _AjaxPage2 = _interopRequireDefault(_AjaxPage);

	var _Base = __webpack_require__(5);

	var _Base2 = _interopRequireDefault(_Base);

	var _Cache = __webpack_require__(4);

	var _Cache2 = _interopRequireDefault(_Cache);

	var _Core = __webpack_require__(7);

	var _Core2 = _interopRequireDefault(_Core);

	var _Config = __webpack_require__(9);

	var _Config2 = _interopRequireDefault(_Config);

	var _Checkbox = __webpack_require__(10);

	var _Checkbox2 = _interopRequireDefault(_Checkbox);

	var _Drag = __webpack_require__(17);

	var _Drag2 = _interopRequireDefault(_Drag);

	var _Export = __webpack_require__(12);

	var _Export2 = _interopRequireDefault(_Export);

	var _I18n = __webpack_require__(11);

	var _I18n2 = _interopRequireDefault(_I18n);

	var _Menu = __webpack_require__(16);

	var _Menu2 = _interopRequireDefault(_Menu);

	var _Order = __webpack_require__(13);

	var _Order2 = _interopRequireDefault(_Order);

	var _Remind = __webpack_require__(14);

	var _Remind2 = _interopRequireDefault(_Remind);

	var _Scroll = __webpack_require__(18);

	var _Scroll2 = _interopRequireDefault(_Scroll);

	var _Sort = __webpack_require__(15);

	var _Sort2 = _interopRequireDefault(_Sort);

	var _Settings = __webpack_require__(19);

	var _Settings2 = _interopRequireDefault(_Settings);

	var _DOM = __webpack_require__(8);

	var _DOM2 = _interopRequireDefault(_DOM);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/*
	 *  GridManager: 构造函数
	 * */
	function GridManager() {
		// 版本号
		this.version = '2.2.4';
	}
	GridManager.prototype = {
		/*
	  * [对外公开方法]
	  * @初始化方法
	  * $.jToolObj: table [jTool object]
	  * $.arg: 参数
	  * $.callback:回调
	  * */
		init: function init(jToolObj, arg, callback) {

			var _this = this;
			if (typeof arg.gridManagerName !== 'string' || arg.gridManagerName.trim() === '') {
				arg.gridManagerName = jToolObj.attr('grid-manager'); //存储gridManagerName值
			}
			// 参数
			// Settings 域存在问题
			// 考虑将Settings中的内容放到GridManager中,在原引用Settings的地方引用GridManager
			_jTool2.default.extend(false, _Settings2.default, arg);
			_this.updateSettings(jToolObj, _Settings2.default);
			_jTool2.default.extend(true, this, arg);
			//通过版本较验 清理缓存
			_this.cleanTableCacheForVersion(jToolObj, this.version);
			if (_this.gridManagerName.trim() === '') {
				_this.outLog('请在html标签中为属性[grid-manager]赋值或在配置项中配置gridManagerName', 'error');
				return false;
			}

			if (jToolObj.hasClass('GridManager-ready') || jToolObj.hasClass('GridManager-loading')) {
				_this.outLog('渲染失败：可能该表格已经渲染或正在渲染', 'error');
				return false;
			}
			//根据本地缓存配置每页显示条数
			if (_this.supportAjaxPage) {
				_this.configPageForCache(jToolObj);
			}
			var query = _jTool2.default.extend({}, _this.query, _this.pageData);
			//增加渲染中标注
			jToolObj.addClass('GridManager-loading');
			_this.initTable(jToolObj);

			//如果初始获取缓存失败，在渲染完成后首先存储一次数据
			if (typeof jToolObj.attr('grid-manager-cache-error') !== 'undefined') {
				window.setTimeout(function () {
					_this.setToLocalStorage(jToolObj, true);
					jToolObj.removeAttr('grid-manager-cache-error');
				}, 1000);
			}

			//启用回调
			typeof callback == 'function' ? callback(query) : '';
			return jToolObj;
		}
		/*
	  @初始化列表
	  $.table: table[jTool object]
	  */
		, initTable: function initTable(table) {
			var _this = this;
			//渲染HTML，嵌入所需的事件源DOM
			_DOM2.default.createDOM(table);
			//获取本地缓存并对列表进行配置
			if (!_this.disableCache) {
				_this.configTheadForCache(table);
				_this.supportAdjust ? _this.resetAdjust(table) : ''; // 通过缓存配置成功后, 重置宽度调整事件源dom
			}
			//绑定宽度调整事件
			if (_this.supportAdjust) {
				_this.bindAdjustEvent(table);
			}
			//绑定拖拽换位事件
			if (_this.supportDrag) {
				_this.bindDragEvent(table);
			}
			//绑定排序事件
			if (_this.supportSorting) {
				_this.bindSortingEvent(table);
			}
			//绑定表头提示事件
			if (_this.supportRemind) {
				_this.bindRemindEvent(table);
			}
			//绑定配置列表事件
			if (_this.supportConfig) {
				_this.bindConfigEvent(table);
			}
			//绑定表头置顶功能
			_this.bindScrollFunction(table);
			//绑定右键菜单事件
			_this.bindRightMenuEvent(table);
			//渲梁tbodyDOM
			_this.__refreshGrid(table);
			//将GridManager实例化对象存放于jTool data
			_this.setGridManagerToJTool.call(_this, table);
		}
	};
	// GM导入功能: 配置项
	_jTool2.default.extend(true, GridManager.prototype, _Settings2.default);
	// GM导入功能: 核心
	_jTool2.default.extend(GridManager.prototype, _Base2.default);
	_jTool2.default.extend(GridManager.prototype, _Core2.default);
	// GM导入功能: 选择
	_jTool2.default.extend(GridManager.prototype, _Checkbox2.default);
	// GM导入功能: 缓存
	_jTool2.default.extend(GridManager.prototype, _Cache2.default);
	// GM导入功能: 宽度调整
	_jTool2.default.extend(GridManager.prototype, _Adjust2.default);
	// GM导入功能: 分页
	_jTool2.default.extend(GridManager.prototype, _AjaxPage2.default);
	// GM导入功能: 配置列显示隐藏
	_jTool2.default.extend(GridManager.prototype, _Config2.default);
	// GM导入功能: 拖拽
	_jTool2.default.extend(GridManager.prototype, _Drag2.default);
	// GM导入功能: 排序
	_jTool2.default.extend(GridManager.prototype, _Sort2.default);
	// GM导入功能: 导出数据
	_jTool2.default.extend(GridManager.prototype, _Export2.default);
	// GM导入功能: 国际化
	_jTool2.default.extend(GridManager.prototype, _I18n2.default);
	// GM导入功能: 右键菜单
	_jTool2.default.extend(GridManager.prototype, _Menu2.default);
	// GM导入功能: 序号
	_jTool2.default.extend(GridManager.prototype, _Order2.default);
	// GM导入功能: 表头提示
	_jTool2.default.extend(GridManager.prototype, _Remind2.default);
	// GM导入功能: 表头吸顶
	_jTool2.default.extend(GridManager.prototype, _Scroll2.default);
	// GM导入功能: DOM操作
	_jTool2.default.extend(GridManager.prototype, _DOM2.default);

	// 对外公开方法列表
	var publishList = ['init', //初始化
	'setSort', //手动设置排序
	'get', //通过jTool实例获取GridManager
	'getSettings', //获取配置参数
	'getCheckedTr', //获取当前选中的行
	'showTh', //显示Th及对应的TD项
	'hideTh', //隐藏Th及对应的TD项
	'exportGridToXls', //导出表格 .xls
	'getLocalStorage', //获取指定表格的本地存储数据
	'setQuery', //配置query 该参数会在分页触发后返回至pagingAfter(query)方法
	'setAjaxData', 'refreshGrid', //刷新表格 使用现有参数重新获取数据，对表格数据区域进行渲染
	'getRowData', //获取当前行渲染时使用的数据
	'clear' //清除指定表的表格记忆数据
	];
	(function ($) {
		// 捆绑至选择器对象
		Element.prototype.GM = Element.prototype.GridManager = function () {
			var $table = $(this);
			// 特殊情况处理：单组tr进行操作，如resetTd()方法
			if (this.nodeName === 'TR') {
				return;
			}
			var name, // 方法名
			settings, // 参数
			callback, // 回调函数
			condition; // 条件
			// 格式化参数
			// ex: document.querySelector('table').GridManager()
			if (arguments.length === 0) {
				name = 'init';
				settings = {};
				callback = undefined;
			}
			// ex: document.querySelector('table').GridManager({settings}, callback)
			else if ($.type(arguments[0]) !== 'string') {
					name = 'init';
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

			if (publishList.indexOf(name) === -1) {
				throw new Error('GridManager Error:方法调用错误，请确定方法名[' + name + ']是否正确');
				return false;
			}
			var gmObj;
			// 当前为初始化方法
			if (name == 'init') {
				var _GM = new GridManager();
				_GM.init($table, settings, callback);
				return _GM;
			}
			// 当前为其它方法
			else if (name != 'init') {
					gmObj = $table.data('gridManager');
					var gmData = gmObj[name]($table, settings, callback, condition);
					//如果方法存在返回值则返回，如果没有返回dom, 用于链式操作
					return typeof gmData === 'undefined' ? this : gmData;
				}
		};
	})(_jTool2.default);

	// 兼容jquery
	(function () {
		if (typeof jQuery !== 'undefined' && jQuery.fn.extend) {
			jQuery.fn.extend({
				GM: function GM() {
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
				GridManager: function GridManager() {
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

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	__webpack_require__(2);

	var $ = jTool; /**
	                * jTool: export jTool
	                */
	exports.default = $;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var require;var require;!function t(e,n,o){function i(s,u){if(!n[s]){if(!e[s]){var a="function"==typeof require&&require;if(!u&&a)return require(s,!0);if(r)return r(s,!0);var c=new Error("Cannot find module '"+s+"'");throw c.code="MODULE_NOT_FOUND",c}var l=n[s]={exports:{}};e[s][0].call(l.exports,function(t){var n=e[s][1][t];return i(n?n:t)},l,l.exports,t,e,n,o)}return n[s].exports}for(var r="function"==typeof require&&require,s=0;s<o.length;s++)i(o[s]);return i}({1:[function(t,e){var n=t("./utilities"),o=t("../src/Css"),i={show:function(){return n.each(this.DOMList,function(t,e){var n="",o=["SPAN","A","FONT","I"];if(-1!==e.nodeName.indexOf(o))return e.style.display="inline-block",this;switch(e.nodeName){case"TABLE":n="table";break;case"THEAD":n="table-header-group";break;case"TBODY":n="table-row-group";break;case"TR":n="table-row";break;case"TH":n="table-cell";break;case"TD":n="table-cell";break;default:n="block"}e.style.display=n}),this},hide:function(){return n.each(this.DOMList,function(t,e){e.style.display="none"}),this},animate:function(t,e,i){var r=this,s="",u="",a=r.DOMList[0];if(t){"undefined"===n.type(i)&&"function"===n.type(e)&&(i=e,e=0),"undefined"===n.type(i)&&(i=n.noop),"undefined"===n.type(e)&&(e=0),n.each(t,function(t,e){t=n.toHyphen(t),s+=t+":"+n.getStyle(a,t)+";",u+=t+":"+e+";"});var c="@keyframes jToolAnimate {from {"+s+"}to {"+u+"}}",l=document.createElement("style");l.className="jTool-animate-style",l.type="text/css",document.head.appendChild(l),l.textContent=l.textContent+c,a.style.animation="jToolAnimate "+e/1e3+"s ease-in-out forwards",window.setTimeout(function(){o.css.call(r,t),a.style.animation="",l.remove(),i()},e)}}};e.exports=i},{"../src/Css":3,"./utilities":13}],2:[function(t,e){var n=t("./utilities"),o={addClass:function(t){return this.changeClass(t,"add")},removeClass:function(t){return this.changeClass(t,"remove")},toggleClass:function(t){return this.changeClass(t,"toggle")},hasClass:function(t){return[].some.call(this.DOMList,function(e){return e.classList.contains(t)})},parseClassName:function(t){return t.indexOf(" ")?t.split(" "):[t]},changeClass:function(t,e){var o=this.parseClassName(t);return n.each(this.DOMList,function(t,i){n.each(o,function(t,n){i.classList[e](n)})}),this}};e.exports=o},{"./utilities":13}],3:[function(t,e){var n=t("./utilities"),o={css:function(t,e){function o(t,e){"number"===n.type(e)&&(e=e.toString()),-1!==r.indexOf(t)&&-1===e.indexOf("px")&&(e+="px"),n.each(i.DOMList,function(n,o){o.style[t]=e})}var i=this,r=["width","height","min-width","max-width","min-height","min-height","top","left","right","bottom","padding-top","padding-right","padding-bottom","padding-left","margin-top","margin-right","margin-bottom","margin-left","border-width","border-top-width","border-left-width","border-right-width","border-bottom-width"];if("string"===n.type(t)&&!e&&0!==e)return-1!==r.indexOf(t)?parseInt(n.getStyle(this.DOMList[0],t),10):n.getStyle(this.DOMList[0],t);if("object"===n.type(t)){var s=t;for(var u in s)o(u,s[u])}else o(t,e);return this},width:function(t){return this.css("width",t)},height:function(t){return this.css("height",t)}};e.exports=o},{"./utilities":13}],4:[function(t,e){var n=t("./utilities"),o={dataKey:"jTool"+n.version,data:function(t,e){var o=this,i={};if("undefined"==typeof t&&"undefined"==typeof e)return o.DOMList[0][o.dataKey];if("undefined"!=typeof e){var r=n.type(e);return("string"===r||"number"===r)&&o.attr(t,e),n.each(o.DOMList,function(n,r){i=r[o.dataKey]||{},i[t]=e,r[o.dataKey]=i}),this}return i=o.DOMList[0][o.dataKey]||{},this.transformValue(i[t]||o.attr(t))},removeData:function(t){var e,o=this;"undefined"!=typeof t&&(n.each(o.DOMList,function(n,i){e=i[o.dataKey]||{},delete e[t]}),o.removeAttr(t))},attr:function(t,e){return"undefined"==typeof t&&"undefined"==typeof e?"":"undefined"!=typeof e?(n.each(this.DOMList,function(n,o){o.setAttribute(t,e)}),this):this.transformValue(this.DOMList[0].getAttribute(t))},removeAttr:function(t){"undefined"!=typeof t&&n.each(this.DOMList,function(e,n){n.removeAttribute(t)})},prop:function(t,e){return"undefined"==typeof t&&"undefined"==typeof e?"":"undefined"!=typeof e?(n.each(this.DOMList,function(n,o){o[t]=e}),this):this.transformValue(this.DOMList[0][t])},removeProp:function(t){"undefined"!=typeof t&&n.each(this.DOMList,function(e,n){delete n[t]})},val:function(t){return this.prop("value",t)||""},transformValue:function(t){return"null"===n.type(t)&&(t=void 0),t}};e.exports=o},{"./utilities":13}],5:[function(t,e){var n=t("./utilities"),o=t("./Sizzle"),i={append:function(t){return this.html(t,"append")},prepend:function(t){return this.html(t,"prepend")},before:function(t){t.jTool&&(t=t.DOMList[0]);var e=this.DOMList[0],n=e.parentNode;return n.insertBefore(t,e),this},after:function(t){t.jTool&&(t=t.DOMList[0]);var e=this.DOMList[0],n=e.parentNode;n.lastChild==e?n.appendChild(t):n.insertBefore(t,e.nextSibling)},text:function(t){return"undefined"!=typeof t?(n.each(this.DOMList,function(e,n){n.textContent=t}),this):this.DOMList[0].textContent},html:function(t,e){if("undefined"==typeof t&&"undefined"==typeof e)return this.DOMList[0].innerHTML;var o=this,i=n.type(t);t.jTool?t=t.DOMList:"string"===i?t=n.createDOM(t||""):"element"===i&&(t=[t]);var r;return n.each(o.DOMList,function(o,i){e?"prepend"===e&&(r=i.firstChild):i.innerHTML="",n.each(t,function(t,e){e=e.cloneNode(!0),e.nodeType||(e=document.createTextNode(e)),r?i.insertBefore(e,r):i.appendChild(e),i.normalize()})}),this},wrap:function(t){var e;return n.each(this.DOMList,function(n,i){e=i.parentNode;var r=new o(t,i.ownerDocument).get(0);e.insertBefore(r,i),r.querySelector(":empty").appendChild(i)}),this},closest:function(t){function e(){return n&&0!==i.length&&1===n.nodeType?void(-1===[].indexOf.call(i,n)&&(n=n.parentNode,e())):void(n=null)}var n=this.DOMList[0].parentNode;if("undefined"==typeof t)return new o(n);var i=document.querySelectorAll(t);return e(),new o(n)},parent:function(){return this.closest()},clone:function(t){return new o(this.DOMList[0].cloneNode(t||!1))},remove:function(){n.each(this.DOMList,function(t,e){e.remove()})}};e.exports=i},{"./Sizzle":9,"./utilities":13}],6:[function(t,e){var n=t("./Sizzle"),o={get:function(t){return this.DOMList[t]},eq:function(t){return new n(this.DOMList[t])},find:function(t){return new n(t,this)},index:function(t){var e=this.DOMList[0];return t?t.jTool&&(t=t.DOMList):t=e.parentNode.childNodes,t?[].indexOf.call(t,e):-1}};e.exports=o},{"./Sizzle":9}],7:[function(t,e){var n=t("./utilities"),o={on:function(t,e,n,o){return this.addEvent(this.getEventObject(t,e,n,o))},off:function(t,e){return this.removeEvent(this.getEventObject(t,e))},bind:function(t,e,n){return this.on(t,void 0,e,n)},unbind:function(t){return this.removeEvent(this.getEventObject(t))},trigger:function(t){return n.each(this.DOMList,function(e,o){try{if(o.jToolEvent&&o.jToolEvent[t].length>0){var i=new Event(t);o.dispatchEvent(i)}else o[t]()}catch(r){n.error("事件:["+t+"]未能正确执行, 请确定方法已经绑定成功")}}),this},getEventObject:function(t,e,o,i){if("function"==typeof e&&(i=o||!1,o=e,e=void 0),!t)return n.error("事件绑定失败,原因: 参数中缺失事件类型"),this;if(e&&"element"===n.type(this.DOMList[0])||(e=""),""!==e){var r=o;o=function(t){-1!==[].indexOf.call(this.querySelectorAll(e),t.target)&&r.apply(t.target,arguments)}}var s,u,a=t.split(" "),c=[];return n.each(a,function(t,r){return""===r.trim()?!0:(s=r.split("."),u={eventName:r+e,type:s[0],querySelector:e,callback:o||n.noop,useCapture:i||!1,nameScope:s[1]||void 0},void c.push(u))}),c},addEvent:function(t){var e=this;return n.each(t,function(t,o){n.each(e.DOMList,function(t,e){e.jToolEvent=e.jToolEvent||{},e.jToolEvent[o.eventName]=e.jToolEvent[o.eventName]||[],e.jToolEvent[o.eventName].push(o),e.addEventListener(o.type,o.callback,o.useCapture)})}),e},removeEvent:function(t){var e,o=this;return n.each(t,function(t,i){n.each(o.DOMList,function(t,o){o.jToolEvent&&(e=o.jToolEvent[i.eventName],e&&(n.each(e,function(t,e){o.removeEventListener(e.type,e.callback)}),o.jToolEvent[i.eventName]=void 0))})}),o}};e.exports=o},{"./utilities":13}],8:[function(t,e){var n=t("./utilities"),o={offset:function(){function t(i,r){if(1===i.nodeType){if(e=n.getStyle(i,"position"),"undefined"==typeof r&&"static"===e)return void t(i.parentNode);o.top=i.offsetTop+o.top-i.scrollTop,o.left=i.offsetLeft+o.left-i.scrollLeft,"fixed"!==e&&t(i.parentNode)}}var e,o={top:0,left:0};return t(this.DOMList[0],!0),o},scrollTop:function(t){return this.scrollFN(t,"top")},scrollLeft:function(t){return this.scrollFN(t,"left")},scrollFN:function(t,e){var n=this.DOMList[0];return t||0===t?(this.setScrollFN(n,e,t),this):this.getScrollFN(n,e)},getScrollFN:function(t,e){return n.isWindow(t)?"top"===e?t.pageYOffset:t.pageXOffset:9===t.nodeType?"top"===e?t.body.scrollTop:t.body.scrollLeft:1===t.nodeType?"top"===e?t.scrollTop:t.scrollLeft:void 0},setScrollFN:function(t,e,o){return n.isWindow(t)?"top"===e?t.document.body.scrollTop=o:t.document.body.scrollLeft=o:9===t.nodeType?"top"===e?t.body.scrollTop=o:t.body.scrollLeft=o:1===t.nodeType?"top"===e?t.scrollTop=o:t.scrollLeft=o:void 0}};e.exports=o},{"./utilities":13}],9:[function(t,e){var n=t("./utilities"),o=function(t,e){var o;return t?n.isWindow(t)?(o=[t],e=void 0):t===document?(o=[document],e=void 0):t instanceof HTMLElement?(o=[t],e=void 0):t instanceof NodeList||t instanceof Array?(o=t,e=void 0):t.jTool?(o=t.DOMList,e=void 0):/<.+>/.test(t)?(o=n.createDOM(t),e=void 0):(e?e="string"==typeof e?document.querySelectorAll(e):e instanceof HTMLElement?[e]:e instanceof NodeList?e:e.jTool?e.DOMList:void 0:o=document.querySelectorAll(t),e&&(o=[],n.each(e,function(e,i){n.each(i.querySelectorAll(t),function(t,e){e&&o.push(e)})}))):t=null,o&&0!==o.length||(o=void 0),this.jTool=!0,this.DOMList=o,this.length=this.DOMList?this.DOMList.length:0,this.querySelector=t,this};e.exports=o},{"./utilities":13}],10:[function(t,e){function n(t){var e={url:null,type:"GET",data:null,headers:{},async:!0,beforeSend:r.noop,complete:r.noop,success:r.noop,error:r.noop};if(t=i(e,t),!t.url)return void r.error("jTool ajax: url不能为空");var n=new XMLHttpRequest,o="";"object"===r.type(t.data)?r.each(t.data,function(t,e){""!==o&&(o+="&"),o+=t+"="+e}):o=t.data,"GET"===t.type&&o&&(t.url=t.url+(-1===t.url.indexOf("?")?"?":"&")+o,o=null),n.open(t.type,t.url,t.async);for(var s in t.headers)n.setRequestHeader(s,t.headers[s]);t.beforeSend(n),n.onload=function(){t.complete(n,n.status)},n.onreadystatechange=function(){4===n.readyState&&(n.status>=200&&n.status<300||304===n.status?t.success(n.response,n.status):t.error(n,n.status,n.statusText))},n.send(o)}function o(t,e,o){n({url:t,type:"POST",data:e,success:o})}var i=t("./extend"),r=t("./utilities");e.exports={ajax:n,post:o}},{"./extend":11,"./utilities":13}],11:[function(t,e){function n(){function t(e,i){for(var r in e)e.hasOwnProperty(r)&&(n&&"object"===o.type(e[r])&&"object"===o.type(i[r])?t(e[r],i[r]):i[r]=e[r])}if(0===arguments.length)return{};var e,n=!1,i=1,r=arguments[0];for(1===arguments.length&&"object"==typeof arguments[0]?(r=this,i=0):2===arguments.length&&"boolean"==typeof arguments[0]?(n=arguments[0],r=this,i=1):arguments.length>2&&"boolean"==typeof arguments[0]&&(n=arguments[0],r=arguments[1]||{},i=2);i<arguments.length;i++)e=arguments[i]||{},t(e,r);return r}var o=t("./utilities");e.exports=n},{"./utilities":13}],12:[function(t,e){var n=t("./Sizzle"),o=t("./extend"),i=t("./utilities"),r=t("./ajax"),s=t("./Event"),u=t("./Css"),a=t("./Class"),c=t("./Document"),l=t("./Offset"),d=t("./Element"),f=t("./Animate"),p=t("./Data"),h=function(t,e){return new n(t,e)};n.prototype=h.prototype={},h.extend=h.prototype.extend=o,h.extend(i),h.extend(r),h.prototype.extend(s),h.prototype.extend(u),h.prototype.extend(a),h.prototype.extend(c),h.prototype.extend(l),h.prototype.extend(d),h.prototype.extend(f),h.prototype.extend(p),"undefined"!=typeof window.$&&(window._$=$),window.jTool=window.$=h,e.exports=h},{"./Animate":1,"./Class":2,"./Css":3,"./Data":4,"./Document":5,"./Element":6,"./Event":7,"./Offset":8,"./Sizzle":9,"./ajax":10,"./extend":11,"./utilities":13}],13:[function(t,e){function n(){return-1==navigator.userAgent.indexOf("Chrome")?!1:!0}function o(t){return null!==t&&t===t.window}function i(t){return Array.isArray(t)}function r(t){return v[m.call(t)]||(t instanceof Element?"element":"")}function s(){}function u(t,e){t&&t.jTool&&(t=t.DOMList);var n=r(t);if("array"===n||"nodeList"===n||"arguments"===n)[].every.call(t,function(t,n){o(t)?s():t.jTool?t=t.get(0):s();return e.call(t,n,t)===!1?!1:!0});else if("object"===n)for(var i in t)if(e.call(t[i],i,t[i])===!1)break}function a(t){return t.trim()}function c(t){throw new Error("[jTool Error: "+t+"]")}function l(t){var e=!0;for(var n in t)t.hasOwnProperty(n)&&(e=!1);return e}function d(t,e){return e?window.getComputedStyle(t)[e]:window.getComputedStyle(t)}function f(t){var e=["px","vem","em","%"],n="";return"number"==typeof t?n:(u(e,function(e,o){return-1!==t.indexOf(o)?(n=o,!1):void 0}),n)}function p(t){return t.replace(/-\w/g,function(t){return t.split("-")[1].toUpperCase()})}function h(t){return t.replace(/([A-Z])/g,"-$1").toLowerCase()}function y(t){var e=document.querySelector("#jTool-create-dom");if(!e||0===e.length){var n=document.createElement("table");n.id="jTool-create-dom",n.style.display="none",document.body.appendChild(n),e=document.querySelector("#jTool-create-dom")}e.innerHTML=t||"";var o=e.childNodes;return 1!=o.length||/<tbody|<TBODY/.test(t)||"TBODY"!==o[0].nodeName||(o=o[0].childNodes),1!=o.length||/<thead|<THEAD/.test(t)||"THEAD"!==o[0].nodeName||(o=o[0].childNodes),1!=o.length||/<tr|<TR/.test(t)||"TR"!==o[0].nodeName||(o=o[0].childNodes),1!=o.length||/<td|<TD/.test(t)||"TD"!==o[0].nodeName||(o=o[0].childNodes),1!=o.length||/<th|<TH/.test(t)||"TH"!==o[0].nodeName||(o=o[0].childNodes),e.remove(),o}var m=Object.prototype.toString,v={"[object String]":"string","[object Boolean]":"boolean","[object Undefined]":"undefined","[object Number]":"number","[object Object]":"object","[object Error]":"error","[object Function]":"function","[object Date]":"date","[object Array]":"array","[object RegExp]":"regexp","[object Null]":"null","[object NodeList]":"nodeList","[object Arguments]":"arguments","[object Window]":"window","[object HTMLDocument]":"document"};e.exports={isWindow:o,isChrome:n,isArray:i,noop:s,type:r,toHyphen:h,toHump:p,getStyleUnit:f,getStyle:d,isEmptyObject:l,trim:a,error:c,each:u,createDOM:y,version:"1.1.0"}},{}]},{},[12]);

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _jTool = __webpack_require__(1);

	var _jTool2 = _interopRequireDefault(_jTool);

	var _Cache = __webpack_require__(4);

	var _Cache2 = _interopRequireDefault(_Cache);

	var _Base = __webpack_require__(5);

	var _Base2 = _interopRequireDefault(_Base);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Adjust = {
		html: function html() {
			var html = '<span class="adjust-action"></span>';
			return html;
		}
		/*
	  @绑定宽度调整事件
	  $.table: table [jTool object]
	  */
		, bindAdjustEvent: function bindAdjustEvent(table) {
			var thList = (0, _jTool2.default)('thead th', table); //table下的TH
			//监听鼠标调整列宽度
			thList.off('mousedown', '.adjust-action');
			thList.on('mousedown', '.adjust-action', function (event) {
				var Settings = _Cache2.default.getSettings(table);
				var _dragAction = (0, _jTool2.default)(this);
				var _th = _dragAction.closest('th'),
				    //事件源所在的th
				_tr = _th.parent(),
				    //事件源所在的tr
				_table = _tr.closest('table'),
				    //事件源所在的table
				_allTh = _tr.find('th[th-visible="visible"]'),
				    //事件源同层级下的所有th
				_nextTh = _allTh.eq(_th.index(_allTh) + 1),
				    //事件源下一个可视th
				_td = _Base2.default.getRowTd(_th); //存储与事件源同列的所有td
				// 宽度调整触发回调事件
				Settings.adjustBefore(event);

				//增加宽度调整中样式
				_th.addClass('adjust-selected');
				_td.addClass('adjust-selected');
				//绑定鼠标拖动事件
				var _thWidth, _NextWidth;
				var _thMinWidth = _Base2.default.getTextWidth(_th),
				    _NextThMinWidth = _Base2.default.getTextWidth(_nextTh);
				_table.unbind('mousemove');
				_table.bind('mousemove', function (e) {
					_thWidth = e.clientX - _th.offset().left - _th.css('padding-left') - _th.css('padding-right');
					_thWidth = Math.ceil(_thWidth);
					_NextWidth = _nextTh.width() + _th.width() - _thWidth;
					_NextWidth = Math.ceil(_NextWidth);
					//限定最小值
					if (_thWidth < _thMinWidth) {
						_thWidth = _thMinWidth;
					}
					if (_NextWidth < _NextThMinWidth) {
						_NextWidth = _NextThMinWidth;
					}
					// 验证是否更改
					if (_thWidth === _th.width()) {
						return;
					}
					// 验证宽度是否匹配
					if (_thWidth + _NextWidth < _th.width() + _nextTh.width()) {
						_NextWidth = _th.width() + _nextTh.width() - _thWidth;
					}
					_th.width(_thWidth);
					_nextTh.width(_NextWidth);
				});

				//绑定鼠标放开、移出事件
				_table.unbind('mouseup mouseleave');
				_table.bind('mouseup mouseleave', function (event) {
					var Settings = _Cache2.default.getSettings(table);
					_table.unbind('mousemove mouseleave');
					//缓存列表宽度信息
					_Cache2.default.setToLocalStorage(_table);
					if (_th.hasClass('adjust-selected')) {
						//其它操作也在table以该事件进行绑定,所以通过class进行区别
						// 宽度调整成功回调事件
						Settings.adjustAfter(event);
					}
					_th.removeClass('adjust-selected');
					_td.removeClass('adjust-selected');
				});
				return false;
			});
			return this;
		}
		/*
	  @通过缓存配置成功后, 重置宽度调整事件源dom
	  用于禁用最后一列调整宽度事件
	  $.table:table
	  */
		, resetAdjust: function resetAdjust(table) {
			var _table = (0, _jTool2.default)(table),
			    _thList = (0, _jTool2.default)('thead [th-visible="visible"]', _table),
			    _adjustAction = (0, _jTool2.default)('.adjust-action', _thList);
			if (!_adjustAction || _adjustAction.length == 0) {
				return false;
			}
			_adjustAction.show();
			_adjustAction.eq(_adjustAction.length - 1).hide();
		}
	}; /*
	    * Adjust: 宽度调整
	    * */
	exports.default = Adjust;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _jTool = __webpack_require__(1);

	var _jTool2 = _interopRequireDefault(_jTool);

	var _Base = __webpack_require__(5);

	var _Base2 = _interopRequireDefault(_Base);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/*
	* @Cache: 本地缓存
	* */
	var Cache = {
		/*
	 * @缓存数据
	 * 用于存储当前渲染表格的数据
	 * 通过每个tr上的cache-key进行获取
	 * */
		cacheData: {},
		updateSettings: function updateSettings(table, settings) {
			var data = _jTool2.default.extend(true, {}, settings);
			table.data('settings', data);
		},
		getSettings: function getSettings(table) {
			return table.data('settings');
		}
		/*
	  * [对外公开方法]
	  * @获取当前行渲染时使用的数据
	  * $.table:当前操作的grid,由插件自动传入
	  * $.tr: 将要获取数据所对应的tr[tr DOM]
	  * */
		, getRowData: function getRowData(table, tr) {
			return this.cacheData[(0, _jTool2.default)(tr).attr('cache-key')];
		},
		setRowData: function setRowData(key, value) {
			this.cacheData[key] = value;
		}
		/*
	 *  @验证版本号清除列表缓存
	 *  $.table: jTool table
	 *  $.version: 版本号
	 * */
		, cleanTableCacheForVersion: function cleanTableCacheForVersion(table, version) {
			var cacheVersion = window.localStorage.getItem('GridManagerVersion');
			if (!cacheVersion || cacheVersion !== version) {
				this.cleanTableCache(table, '版本已升级,原缓存被自动清除');
				window.localStorage.setItem('GridManagerVersion', version);
			}
		}
		/*
	 * @清除列表缓存
	 * $.table: table [jTool object]
	 * $.cleanText: 清除缓存的原因
	 * */
		, cleanTableCache: function cleanTableCache(table, cleanText) {
			var Settings = Cache.getSettings(table);
			this.clear(table);
			_Base2.default.outLog(Settings.gridManagerName + '清除缓存成功,清除原因：' + cleanText, 'info');
		}
		/*
	 * [对外公开方法]
	 * @清除指定表的缓存数据
	 * $.table:table
	 * return 成功或者失败的布尔值
	 * */
		, clear: function clear(table) {
			var _table = (0, _jTool2.default)(table);
			var _key = this.getLocalStorageKey(_table);
			if (!_key) {
				return false;
			}
			window.localStorage.removeItem(_key);
			return true;
		}

		/*
	  * 获取指定表格本地存储所使用的key
	  * table: table jTool
	  * */
		, getLocalStorageKey: function getLocalStorageKey(table) {
			var Settings = Cache.getSettings(table);
			// 验证table是否有效
			if (!table || table.length === 0) {
				_Base2.default.outLog('getLocalStorage:无效的table', 'error');
				return false;
			}
			//当前表是否禁用缓存  被禁用原因是用户缺失了必要的参数
			var noCache = table.attr('no-cache');
			if (noCache && noCache == 'true') {
				_Base2.default.outLog('缓存已被禁用：当前表缺失必要html标签属性[grid-manager或th-name]', 'info');
				return false;
			}
			if (!window.localStorage) {
				_Base2.default.outLog('当前浏览器不支持：localStorage，缓存功能失效', 'info');
				return false;
			}
			return window.location.pathname + window.location.hash + '-' + Settings.gridManagerName;
		}
		/*
	 * @根据本地缓存thead配置列表: 获取本地缓存, 存储原位置顺序, 根据本地缓存进行配置
	 * $.table: table [jTool object]
	 * */
		, configTheadForCache: function configTheadForCache(table) {
			var Settings = Cache.getSettings(table);
			var _this = this;
			var _data = _this.getLocalStorage(table),
			    //本地缓存的数据
			_domArray = [];
			var _th, //单一的th
			_td, //单列的td，与_th对应
			_cache, //列表的缓存数据
			_thCache, //th相关 缓存
			_thJson, //th的缓存json
			_thArray, _tbodyArray;
			//验证：当前table 没有缓存数据
			if (!_data || _jTool2.default.isEmptyObject(_data)) {
				_Base2.default.outLog('configTheadForCache:当前table没有缓存数据', 'info');
				return;
			}
			_cache = _data.cache;
			_thCache = _cache.th;
			//验证：缓存数据与当前列表是否匹配
			if (!_thCache || _thCache.length != (0, _jTool2.default)('thead th', table).length) {
				_this.cleanTableCache(table, '缓存数据与当前列表不匹配');
				return;
			}
			//验证：缓存数据与当前列表项是否匹配
			var _thNameTmpList = [],
			    _dataAvailable = true;
			_jTool2.default.each(_thCache, function (i2, v2) {
				_thJson = v2;
				_th = (0, _jTool2.default)('th[th-name=' + _thJson.th_name + ']', table);
				if (_th.length == 0 || _thNameTmpList.indexOf(_thJson.th_name) != -1) {
					_this.cleanTableCache(table, '缓存数据与当前列表不匹配');
					_dataAvailable = false;
					return false;
				}
				_thNameTmpList.push(_thJson.th_name);
			});
			//数据可用，进行列的配置
			if (_dataAvailable) {
				_jTool2.default.each(_thCache, function (i2, v2) {
					_thJson = v2;
					_th = (0, _jTool2.default)('th[th-name=' + _thJson.th_name + ']', table);
					//配置列的宽度
					if (Settings.supportAdjust && _th.attr('gm-create') !== 'true') {
						_th.css('width', _thJson.th_width);
					}
					//配置列排序数据
					if (Settings.supportDrag && typeof _thJson.th_index !== 'undefined') {
						_domArray[_thJson.th_index] = _th;
					} else {
						_domArray[i2] = _th;
					}
					//配置列的可见
					if (Settings.supportConfig) {
						_Base2.default.setAreVisible(_th, typeof _thJson.isShow == 'undefined' ? true : _thJson.isShow, true);
					}
				});
				//配置列的顺序
				if (Settings.supportDrag) {
					table.find('thead tr').html(_domArray);
				}
			}
		}
		/*
	  @保存至本地缓存
	  $.table:table [jTool object]
	  $.isInit: 是否为初始存储缓存[用于处理宽度在特定情况下发生异常]
	  */
		, setToLocalStorage: function setToLocalStorage(table, isInit) {
			var Settings = Cache.getSettings(table);
			var _this = this;
			//当前为禁用缓存模式，直接跳出
			if (Settings.disableCache) {
				return;
			}
			var _table = (0, _jTool2.default)(table);
			//当前表是否禁用缓存  被禁用原因是用户缺失了必要的参数
			var noCache = _table.attr('no-cache');
			if (noCache && noCache == 'true') {
				_Base2.default.outLog('缓存功能已被禁用：当前表缺失必要参数', 'info');
				return false;
			}
			if (!window.localStorage) {
				_Base2.default.outLog('当前浏览器不支持：localStorage，缓存功能失效。', 'error');
				return false;
			}
			if (!_table || _table.length == 0) {
				_Base2.default.outLog('setToLocalStorage:无效的table', 'error');
				return false;
			}
			var _cache = {},
			    _pageCache = {},
			    _thCache = new Array(),
			    _thData = {};
			var thList = (0, _jTool2.default)('thead[grid-manager-thead] th', _table);
			if (!thList || thList.length == 0) {
				_Base2.default.outLog('setToLocalStorage:无效的thList,请检查是否正确配置table,thead,th', 'error');
				return false;
			}

			var $v;
			_jTool2.default.each(thList, function (i, v) {
				$v = (0, _jTool2.default)(v);
				_thData = {};
				_thData.th_name = $v.attr('th-name');
				if (Settings.supportDrag) {
					_thData.th_index = $v.index();
				}
				if (Settings.supportAdjust) {
					//用于处理宽度在特定情况下发生异常
					// isInit ? $v.css('width', $v.css('width')) : '';
					_thData.th_width = $v.width();;
				}
				if (Settings.supportConfig) {
					_thData.isShow = (0, _jTool2.default)('.config-area li[th-name="' + _thData.th_name + '"]', _table.closest('.table-wrap')).find('input[type="checkbox"]').get(0).checked;
				}
				_thCache.push(_thData);
			});
			_cache.th = _thCache;
			//存储分页
			if (Settings.supportAjaxPage) {
				_pageCache.pSize = (0, _jTool2.default)('select[name="pSizeArea"]', _table.closest('.table-wrap')).val();
				_cache.page = _pageCache;
			}
			var _cacheString = JSON.stringify(_cache);
			window.localStorage.setItem(_this.getLocalStorageKey(_table), _cacheString);
			return _cacheString;
		}
		/*
	  [对外公开方法]
	  @获取指定表格的本地存储数据
	  $.table:table
	  成功则返回本地存储数据,失败则返回空对象
	  */
		, getLocalStorage: function getLocalStorage(table) {
			var _table = (0, _jTool2.default)(table);
			var _key = this.getLocalStorageKey(_table);
			if (!_key) {
				return {};
			}
			var _data = {},
			    _localStorage = window.localStorage.getItem(_key);
			//如无数据，增加属性标识：grid-manager-cache-error
			if (!_localStorage) {
				_table.attr('grid-manager-cache-error', 'error');
				return {};
			}
			_data.key = _key;
			_data.cache = JSON.parse(_localStorage);
			return _data;
		}
		/*
	  @存储原Th DOM至table data
	  $.table: table [jTool object]
	  */
		, setOriginalThDOM: function setOriginalThDOM(table) {
			var _thDOM = (0, _jTool2.default)('thead[grid-manager-thead] th', table);
			var _thList = [];
			_jTool2.default.each(_thDOM, function (i, v) {
				_thList.push(v.getAttribute('th-name'));
			});
			table.data('originalThList', _thList);
		}
		/*
	  @获取原Th DOM至table data
	  $.table: table [jTool object]
	  */
		, getOriginalThDOM: function getOriginalThDOM(table) {
			var _thList = (0, _jTool2.default)(table).data('originalThList');
			var _thArray = [];

			_jTool2.default.each(_thList, function (i, v) {
				_thArray.push((0, _jTool2.default)('thead[grid-manager-thead] th[th-name="' + v + '"]', table).get(0));
			});
			return (0, _jTool2.default)(_thArray);
		}

		/*
	  @存储对外实例
	  $.table:当前被实例化的table
	  */
		, setGridManagerToJTool: function setGridManagerToJTool(table) {
			table.data('gridManager', this);
		}
		/*
	  [对外公开方法]
	  @通过jTool实例获取gridManager
	  $.table:table [jTool object]
	  */
		, get: function get(table) {
			return this.__getGridManager(table);
		}
		/*
	  @获取gridManager
	  $.table:table [jTool object]
	  */
		, __getGridManager: function __getGridManager(table) {
			return table.data('gridManager');
		}
	};
	exports.default = Cache;

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _jTool = __webpack_require__(1);

	var _jTool2 = _interopRequireDefault(_jTool);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Base = {
		/*
	  @输出日志
	  $.type: 输出分类[info,warn,error]
	  */
		outLog: function outLog(msg, type) {
			if (!type) {
				console.log('GridManager:', msg);
			} else if (type === 'info') {
				console.info('GridManager Info: ', msg);
			} else if (type === 'warn') {
				console.warn('GridManager Warn: ', msg);
			} else if (type === 'error') {
				console.error('GridManager Error: ', msg);
			}
			return msg;
		}
		/*
	  [对外公开方法]
	  @显示Th及对应的TD项
	  $.table: table
	  $.th:th
	  */
		, showTh: function showTh(table, th) {
			this.setAreVisible((0, _jTool2.default)(th), true);
		}
		/*
	  [对外公开方法]
	  @隐藏Th及对应的TD项
	  $.table: table
	  $.th:th
	  */
		, hideTh: function hideTh(table, th) {
			this.setAreVisible((0, _jTool2.default)(th), false);
		}
		/*
	  * @获取与 th 同列的 td jTool 对象, 该方法的调用者只允许为 Th
	  * $.th: jTool th
	  * */
		, getRowTd: function getRowTd(th) {
			var tableWrap = th.closest('.table-wrap'),
			    trList = (0, _jTool2.default)('tbody tr', tableWrap);

			var tdList = [],
			    thIndex = th.index();
			var _td;
			_jTool2.default.each(trList, function (i, v) {
				_td = (0, _jTool2.default)('td', v).get(thIndex);
				if (_td) {
					tdList.push(_td);
				}
			});
			return (0, _jTool2.default)(tdList);
		}
		/*
	  @设置列是否可见
	  $._thList_	： 即将配置的列所对应的th[jTool object，可以是多个]
	  $._visible_: 是否可见[Boolean]
	  $.cb		: 回调函数
	  */
		, setAreVisible: function setAreVisible(_thList_, _visible_, cb) {
			var _table,
			    //当前所在的table
			_tableWarp,
			    //当前所在的容器
			_th,
			    //当前操作的th
			_trList,
			    //当前tbody下所有的tr
			_tdList = [],
			    //所对应的td
			_checkLi,
			    //所对应的显示隐藏所在的li
			_checkbox; //所对应的显示隐藏事件
			_jTool2.default.each(_thList_, function (i, v) {
				_th = (0, _jTool2.default)(v);
				_table = _th.closest('table');
				_tableWarp = _table.closest('.table-wrap');
				_trList = (0, _jTool2.default)('tbody tr', _table);
				_checkLi = (0, _jTool2.default)('.config-area li[th-name="' + _th.attr('th-name') + '"]', _tableWarp);
				_checkbox = _checkLi.find('input[type="checkbox"]');
				if (_checkbox.length == 0) {
					return;
				}
				_jTool2.default.each(_trList, function (i2, v2) {
					_tdList.push((0, _jTool2.default)(v2).find('td').get(_th.index()));
				});
				//显示
				if (_visible_) {
					_th.attr('th-visible', 'visible');
					_jTool2.default.each(_tdList, function (i2, v2) {
						(0, _jTool2.default)(v2).show();
					});
					_checkLi.addClass('checked-li');
					_checkbox.prop('checked', true);
				}
				//隐藏
				else {
						_th.attr('th-visible', 'none');
						_jTool2.default.each(_tdList, function (i2, v2) {
							(0, _jTool2.default)(v2).hide();
						});
						_checkLi.removeClass('checked-li');
						_checkbox.prop('checked', false);
					}
				typeof cb == 'function' ? cb() : '';
			});
		}

		/*
	  @获取TH宽度
	  $.element: th
	  */
		, getTextWidth: function getTextWidth(element) {
			var th = (0, _jTool2.default)(element);
			var thWarp = (0, _jTool2.default)('.th-wrap', th),
			    //th下的GridManager包裹容器
			thText = (0, _jTool2.default)('.th-text', th),
			    //文本所在容器
			remindAction = (0, _jTool2.default)('.remind-action', thWarp),
			    //提醒所在容器
			sortingAction = (0, _jTool2.default)('.sorting-action', thWarp); //排序所在容器

			//文本镜象 用于处理实时获取文本长度
			var tableWrap = th.closest('.table-wrap');
			var textDreamland = (0, _jTool2.default)('.text-dreamland', tableWrap);
			//将th文本嵌入文本镜象 用于获取文本实时宽度
			textDreamland.text(thText.text());
			textDreamland.css({
				fontSize: thText.css('font-size'),
				fontWeight: thText.css('font-weight'),
				fontFamily: thText.css('font-family')
			});
			var thPaddingLeft = thWarp.css('padding-left'),
			    thPaddingRight = thWarp.css('padding-right');
			var thWidth = textDreamland.width() + (thPaddingLeft ? thPaddingLeft : 0) + (thPaddingRight ? thPaddingRight : 0) + (remindAction.length == 1 ? 20 : 5) + (sortingAction.length == 1 ? 20 : 5);
			return thWidth;
		},
		showLoading: function showLoading(dom, cb) {
			if (!dom || dom.length === 0) {
				return;
			}
			var loading = dom.find('.load-area');
			if (loading.length > 0) {
				loading.remove();
			}
			var loadingDom = (0, _jTool2.default)('<div class="load-area loading"><div class="loadInner kernel"></div></div>');
			dom.append(loadingDom);

			//进行loading图标居中显示
			var loadInner = dom.find('.load-area').find('.loadInner');
			var domHeight = dom.height(),
			    loadInnerHeight = loadInner.height();
			loadInner.css('margin-top', (domHeight - loadInnerHeight) / 2);
			window.setTimeout(function () {
				typeof cb === 'function' ? cb() : '';
			}, 100);
		},
		hideLoading: function hideLoading(dom, cb) {
			if (!dom || dom.length === 0) {
				return;
			}
			window.setTimeout(function () {
				(0, _jTool2.default)('.load-area', dom).remove();
				typeof cb === 'function' ? cb() : '';
			}, 500);
		}
	}; /*
	    * Base: 基础方法
	    * */
	exports.default = Base;

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _jTool = __webpack_require__(1);

	var _jTool2 = _interopRequireDefault(_jTool);

	var _Base = __webpack_require__(5);

	var _Base2 = _interopRequireDefault(_Base);

	var _Core = __webpack_require__(7);

	var _Core2 = _interopRequireDefault(_Core);

	var _Cache = __webpack_require__(4);

	var _Cache2 = _interopRequireDefault(_Cache);

	var _I18n = __webpack_require__(11);

	var _I18n2 = _interopRequireDefault(_I18n);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var AjaxPage = {
		html: function html() {
			var html = '<div class="page-toolbar">' + '<div class="refresh-action"><i class="iconfont icon-shuaxin"></i></div>' + '<div class="goto-page">' + _I18n2.default.i18nText("goto-first-text") + '<input type="text" class="gp-input"/>' + _I18n2.default.i18nText("goto-last-text") + '</div>' + '<div class="change-size"><select name="pSizeArea"></select></div>' + '<div class="dataTables_info"></div>' + '<div class="ajax-page"><ul class="pagination"></ul></div>' + '</div>';
			return html;
		}
		/*
	  @初始化分页
	  $.table:table
	  */
		, initAjaxPage: function initAjaxPage(table) {
			var Settings = _Cache2.default.getSettings(table);
			var _this = this;
			var table = (0, _jTool2.default)(table),
			    tableWarp = table.closest('.table-wrap'),
			    pageToolbar = (0, _jTool2.default)('.page-toolbar', tableWarp); //分页工具条
			var sizeData = Settings.sizeData;
			pageToolbar.hide();
			//生成每页显示条数选择框
			_this.createPageSizeDOM(table, sizeData);

			//绑定页面跳转事件
			_this.bindPageJumpEvent(table);

			//绑定设置显示条数切换事件
			_this.bindSetPageSizeEvent(table);
		}
		/*
	  @生成分页DOM节点据
	  $.table: table的juqery实例化对象
	  $._pageData_:分页数据格式
	  */
		, createPageDOM: function createPageDOM(table, _pageData_) {
			var table = (0, _jTool2.default)(table),
			    tableWarp = table.closest('.table-wrap'),
			    pageToolbar = (0, _jTool2.default)('.page-toolbar', tableWarp),
			    //分页工具条
			pagination = (0, _jTool2.default)('.pagination', pageToolbar); //分页区域
			var cPage = Number(_pageData_.cPage || 0),
			    //当前页
			tPage = Number(_pageData_.tPage || 0),
			    //总页数
			tHtml = '',
			    //临时存储分页HTML片段
			lHtml = ''; //临时存储末尾页码THML片段
			//配置首页
			var firstClassName = 'first-page',
			    previousClassName = 'previous-page';
			if (cPage == 1) {
				firstClassName += ' disabled';
				previousClassName += ' disabled';
			}
			tHtml += '<li c-page="1" class="' + firstClassName + '">' + _I18n2.default.i18nText("first-page") + '</li>' + '<li c-page="' + (cPage - 1) + '" class="' + previousClassName + '">' + _I18n2.default.i18nText("previous-page") + '</li>';
			var i = 1,
			    //循环开始数
			maxI = tPage; //循环结束数
			//配置first端省略符
			if (cPage > 4) {
				tHtml += '<li c-page="1">' + '1' + '</li>' + '<li class="disabled">' + '...' + '</li>';
				i = cPage - 2;
			}
			//配置last端省略符
			if (tPage - cPage > 4) {
				maxI = cPage + 2;
				lHtml += '<li class="disabled">' + '...' + '</li>' + '<li c-page="' + tPage + '">' + tPage + '</li>';
			}
			// 配置页码
			for (i; i <= maxI; i++) {
				if (i == cPage) {
					tHtml += '<li class="active">' + cPage + '</li>';
					continue;
				}
				tHtml += '<li c-page="' + i + '">' + i + '</li>';
			}
			tHtml += lHtml;
			//配置下一页与尾页
			var nextClassName = 'next-page',
			    lastClassName = 'last-page';
			if (cPage >= tPage) {
				nextClassName += ' disabled';
				lastClassName += ' disabled';
			}
			tHtml += '<li c-page="' + (cPage + 1) + '" class="' + nextClassName + '">' + _I18n2.default.i18nText("next-page") + '</li>' + '<li c-page="' + tPage + '" class="' + lastClassName + '">' + _I18n2.default.i18nText("last-page") + '</li>';
			pagination.html(tHtml);
		}
		/*
	  @生成每页显示条数选择框据
	  $.table: table的juqery实例化对象
	  $._sizeData_: 选择框自定义条数
	  */
		, createPageSizeDOM: function createPageSizeDOM(table, _sizeData_) {
			var table = (0, _jTool2.default)(table),
			    tableWarp = table.closest('.table-wrap'),
			    pageToolbar = (0, _jTool2.default)('.page-toolbar', tableWarp),
			    //分页工具条
			pSizeArea = (0, _jTool2.default)('select[name="pSizeArea"]', pageToolbar); //分页区域
			//error
			if (!_sizeData_ || _sizeData_.length === 0) {
				_Base2.default.outLog('渲染失败：参数[sizeData]配置错误', 'error');
				return;
			}

			var _ajaxPageHtml = '';
			_jTool2.default.each(_sizeData_, function (i, v) {
				_ajaxPageHtml += '<option value="' + v + '">' + v + '</option>';
			});
			pSizeArea.html(_ajaxPageHtml);
		}
		/*
	  @绑定页面跳转事件
	  $.table: table的juqery实例化对象
	  */
		, bindPageJumpEvent: function bindPageJumpEvent(table) {
			var _this = this;
			var table = (0, _jTool2.default)(table),
			    tableWarp = table.closest('.table-wrap'),
			    pageToolbar = (0, _jTool2.default)('.page-toolbar', tableWarp),
			    //分页工具条
			pagination = (0, _jTool2.default)('.pagination', pageToolbar),
			    //分页区域
			gp_input = (0, _jTool2.default)('.gp-input', pageToolbar),
			    //快捷跳转
			refreshAction = (0, _jTool2.default)('.refresh-action', pageToolbar); //快捷跳转
			//绑定分页点击事件
			pageToolbar.off('click', 'li');
			pageToolbar.on('click', 'li', function () {
				var pageAction = (0, _jTool2.default)(this);
				var cPage = pageAction.attr('c-page'); //分页页码
				if (!cPage || !Number(cPage) || pageAction.hasClass('disabled')) {
					_Base2.default.outLog('指定页码无法跳转,已停止。原因:1、可能是当前页已处于选中状态; 2、所指向的页不存在', 'info');
					return false;
				}
				cPage = parseInt(cPage);
				_this.gotoPage(table, cPage);
			});
			//绑定快捷跳转事件
			gp_input.unbind('keyup');
			gp_input.bind('keyup', function (e) {
				if (e.which !== 13) {
					return;
				}
				var _inputValue = parseInt(this.value, 10);
				if (!_inputValue) {
					this.focus();
					return;
				}
				_this.gotoPage(table, _inputValue);
				this.value = '';
			});
			//绑定刷新界面事件
			refreshAction.unbind('click');
			refreshAction.bind('click', function () {
				var _tableWarp = (0, _jTool2.default)(this).closest('.table-wrap'),
				    _table = (0, _jTool2.default)('table[grid-manager]', _tableWarp),
				    _input = (0, _jTool2.default)('.page-toolbar .gp-input', _tableWarp),
				    _value = _input.val();
				//跳转输入框为空时: 刷新当前页
				if (_value.trim() === '') {
					_Core2.default.__refreshGrid(_table);
					return;
				}
				//跳转输入框不为空时: 验证输入值是否有效,如果有效跳转至指定页,如果无效对输入框进行聚焦
				var _inputValue = parseInt(_input.val(), 10);
				if (!_inputValue) {
					_input.focus();
					return;
				}
				_this.gotoPage(table, _inputValue);
				_input.val('');
			});
		}
		/*
	 * @跳转至指定页
	 * */
		, gotoPage: function gotoPage(table, _cPage) {
			var Settings = _Cache2.default.getSettings(table);
			//跳转的指定页大于总页数
			if (_cPage > Settings.pageData.tPage) {
				_cPage = Settings.pageData.tPage;
			}
			//替换被更改的值
			Settings.pageData.cPage = _cPage;
			Settings.pageData.pSize = Settings.pageData.pSize || Settings.pageSize;
			//调用事件、渲染DOM
			var query = _jTool2.default.extend({}, Settings.query, Settings.sortData, Settings.pageData);
			Settings.pagingBefore(query);
			_Core2.default.__refreshGrid(table, function () {
				Settings.pagingAfter(query);
			});
		}
		/*
	  @绑定设置当前页显示数事件
	  $.table: table的juqery实例化对象
	  */
		, bindSetPageSizeEvent: function bindSetPageSizeEvent(table) {
			var table = (0, _jTool2.default)(table),
			    tableWarp = table.closest('.table-wrap'),
			    pageToolbar = (0, _jTool2.default)('.page-toolbar', tableWarp),
			    //分页工具条
			sizeArea = (0, _jTool2.default)('select[name=pSizeArea]', pageToolbar); //切换条数区域
			if (!sizeArea || sizeArea.length == 0) {
				_Base2.default.outLog('未找到单页显示数切换区域，停止该事件绑定', 'info');
				return false;
			}
			sizeArea.unbind('change');
			sizeArea.bind('change', function () {
				var _size = (0, _jTool2.default)(this);
				var _tableWarp = _size.closest('.table-wrap'),
				    _table = (0, _jTool2.default)('table[grid-manager]', _tableWarp);
				var Settings = _Cache2.default.getSettings(table);
				Settings.pageData = {
					cPage: 1,
					pSize: parseInt(_size.val())
				};

				_Cache2.default.setToLocalStorage(_table);
				//调用事件、渲染tbody
				var query = _jTool2.default.extend({}, Settings.query, Settings.sortData, Settings.pageData);
				Settings.pagingBefore(query);
				_Core2.default.__refreshGrid(_table, function () {
					Settings.pagingAfter(query);
				});
			});
		}
		/*
	  @重置当前页显示条数据
	  $.table: table的juqery实例化对象
	  $._pageData_:分页数据格式
	  */
		, resetPSize: function resetPSize(table, _pageData_) {
			var table = (0, _jTool2.default)(table),
			    tableWarp = table.closest('.table-wrap'),
			    toolBar = (0, _jTool2.default)('.page-toolbar', tableWarp),
			    pSizeArea = (0, _jTool2.default)('select[name="pSizeArea"]', toolBar),
			    pSizeInfo = (0, _jTool2.default)('.dataTables_info', toolBar);
			if (!pSizeArea || pSizeArea.length == 0) {
				_Base2.default.outLog('未找到条数切换区域，停止该事件绑定', 'info');
				return false;
			}
			var fromNum = _pageData_.cPage == 1 ? 1 : (_pageData_.cPage - 1) * _pageData_.pSize + 1,
			    //从多少开始
			toNum = _pageData_.cPage * _pageData_.pSize,
			    //到多少结束
			totalNum = _pageData_.tSize; //总共条数
			var tmpHtml = _I18n2.default.i18nText('dataTablesInfo', [fromNum, toNum, totalNum]);
			//根据返回值修正单页条数显示值
			pSizeArea.val(_pageData_.pSize || 10);
			//修改单页条数文字信息
			pSizeInfo.html(tmpHtml);
			pSizeArea.show();
		}
		/*
	  @重置分页数据
	  $.table: table
	  $.totals: 总条数
	  */
		, resetPageData: function resetPageData(table, totals) {
			var Settings = _Cache2.default.getSettings(table);
			var _this = this;
			if (isNaN(parseInt(totals, 10))) {
				return;
			}
			var _pageData = getPageData(totals);
			//生成分页DOM节点
			_this.createPageDOM(table, _pageData);
			//重置当前页显示条数
			_this.resetPSize(table, _pageData);
			_Cache2.default.updateSettings(table, _jTool2.default.extend(true, Settings, { pageData: _pageData }));
			var tableWarp = table.closest('.table-wrap'),
			    pageToolbar = (0, _jTool2.default)('.page-toolbar', tableWarp); //分页工具条
			pageToolbar.show();

			//计算分页数据
			function getPageData(tSize) {
				var _pSize = Settings.pageData.pSize || Settings.pageSize,
				    _tSize = tSize,
				    _cPage = Settings.pageData.cPage || 1;
				return {
					tPage: Math.ceil(_tSize / _pSize), //总页数
					cPage: _cPage, //当前页
					pSize: _pSize, //每页显示条数
					tSize: _tSize //总条路
				};
			}
		}
		/*
	  @根据本地缓存配置分页数据
	  $.table: table[jTool object]
	  配置当前页显示数
	  */
		, configPageForCache: function configPageForCache(table) {
			var Settings = _Cache2.default.getSettings(table);
			var _data = _Cache2.default.getLocalStorage(table),
			    //本地缓存的数据
			_cache = _data.cache,
			    //缓存对应
			_pSize; //每页显示条数
			//验证是否存在每页显示条数缓存数据
			if (!_cache || !_cache.page || !_cache.page.pSize) {
				_pSize = Settings.pageSize || 10.;
			} else {
				_pSize = _cache.page.pSize;
			}
			var pageData = {
				pSize: _pSize,
				cPage: 1
			};
			_jTool2.default.extend(Settings, { pageData: pageData });
			_Cache2.default.updateSettings(table, Settings);
		}
	}; /*
	    * AjaxPage: 分页
	    * */
	exports.default = AjaxPage;

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _jTool = __webpack_require__(1);

	var _jTool2 = _interopRequireDefault(_jTool);

	var _Base = __webpack_require__(5);

	var _Base2 = _interopRequireDefault(_Base);

	var _DOM = __webpack_require__(8);

	var _DOM2 = _interopRequireDefault(_DOM);

	var _Cache = __webpack_require__(4);

	var _Cache2 = _interopRequireDefault(_Cache);

	var _AjaxPage = __webpack_require__(6);

	var _AjaxPage2 = _interopRequireDefault(_AjaxPage);

	var _Menu = __webpack_require__(16);

	var _Menu2 = _interopRequireDefault(_Menu);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/*
	* Core: 核心方法
	* */
	var Core = {
		/*
	  [对外公开方法]
	  @刷新表格 使用现有参数重新获取数据，对表格数据区域进行渲染
	  $.table:当前操作的grid,由插件自动传入
	  $.gotoFirstPage:  是否刷新时跳转至第一页
	  $.callback: 回调函数
	  */
		refreshGrid: function refreshGrid(table, gotoFirstPage, callback) {
			var Settings = _Cache2.default.getSettings(table);
			var _this = this;
			if (typeof gotoFirstPage !== 'boolean') {
				callback = gotoFirstPage;
				gotoFirstPage = false;
			}
			if (gotoFirstPage) {
				Settings.pageData['cPage'] = 1;
			}
			_this.__refreshGrid(table, callback);
		}
		/*
	  @刷新表格 使用现有参数重新获取数据，对表格数据区域进行渲染
	  $.callback: 回调函数
	  */
		, __refreshGrid: function __refreshGrid(table, callback) {
			var Settings = _Cache2.default.getSettings(table);
			var tbodyDOM = (0, _jTool2.default)('tbody', table),
			    //tbody dom
			tableWrap = table.closest('.table-wrap'),
			    refreshAction = (0, _jTool2.default)('.page-toolbar .refresh-action', tableWrap); //刷新按纽
			//增加刷新中标识
			refreshAction.addClass('refreshing');
			/*
	   使用配置数据
	   如果存在配置数据ajax_data,将不再通过ajax_rul进行数据请求
	   且ajax_beforeSend、ajax_error、ajax_complete将失效，仅有ajax_success会被执行
	   */
			if (Settings.ajax_data) {
				driveDomForSuccessAfter(Settings.ajax_data);
				Settings.ajax_success(Settings.ajax_data);
				removeRefreshingClass();
				typeof callback === 'function' ? callback() : '';
				return;
			}
			if (typeof Settings.ajax_url != 'string' || Settings.ajax_url === '') {
				Settings.outLog('请求表格数据失败！参数[ajax_url]配制错误', 'error');
				removeRefreshingClass();
				typeof callback === 'function' ? callback() : '';
				return;
			}
			var pram = _jTool2.default.extend(true, {}, Settings.query);
			//合并分页信息至请求参
			if (Settings.supportAjaxPage) {
				_jTool2.default.extend(pram, Settings.pageData);
			}
			//合并排序信息至请求参
			if (Settings.supportSorting) {
				_jTool2.default.each(Settings.sortData, function (key, value) {
					pram['sort_' + key] = value; // 增加sort_前缀,防止与搜索时的条件重叠
				});
				// $.extend(pram, Settings.sortData);
			}
			//当前页小于1时, 修正为1
			if (pram.cPage < 1) {
				pram.cPage = 1;
				//当前页大于总页数时, 修正为总页数
			} else if (pram.cPage > pram.tPage) {
				pram.cPage = pram.tPage;
			}
			// Settings.query = pram;
			_Cache2.default.updateSettings(table, Settings);

			_Base2.default.showLoading(tableWrap);
			//执行ajax
			_jTool2.default.ajax({
				url: Settings.ajax_url,
				type: Settings.ajax_type,
				data: pram,
				headers: Settings.ajax_headers,
				cache: true,
				beforeSend: function beforeSend(XMLHttpRequest) {
					Settings.ajax_beforeSend(XMLHttpRequest);
				},
				success: function success(response) {
					driveDomForSuccessAfter(response);
					Settings.ajax_success(response);
				},
				error: function error(XMLHttpRequest, textStatus, errorThrown) {
					Settings.ajax_error(XMLHttpRequest, textStatus, errorThrown);
				},
				complete: function complete(XMLHttpRequest, textStatus) {
					Settings.ajax_complete(XMLHttpRequest, textStatus);
					removeRefreshingClass();
					_Base2.default.hideLoading(tableWrap);
				}
			});
			//移除刷新中样式
			function removeRefreshingClass() {
				window.setTimeout(function () {
					refreshAction.removeClass('refreshing');
				}, 2000);
			}
			//执行ajax成功后重新渲染DOM
			function driveDomForSuccessAfter(response) {
				if (!response) {
					_Base2.default.outLog('请求数据失败！请查看配置参数[ajax_url或ajax_data]是否配置正确，并查看通过该地址返回的数据格式是否正确', 'error');
					return;
				}

				var tbodyTmpHTML = ''; //用于拼接tbody的HTML结构
				var parseRes = typeof response === 'string' ? JSON.parse(response) : response;
				var _data = parseRes[Settings.dataKey];
				var key, //数据索引
				alignAttr, //文本对齐属性
				template, //数据模板
				templateHTML; //数据模板导出的html
				//数据为空时
				if (!_data || _data.length === 0) {
					tbodyTmpHTML = '<tr emptyTemplate>' + '<td colspan="' + (0, _jTool2.default)('th[th-visible="visible"]', table).length + '">' + (Settings.emptyTemplate || '<div class="gm-emptyTemplate">数据为空</div>') + '</td>' + '</tr>';
					parseRes.totals = 0;
					tbodyDOM.html(tbodyTmpHTML);
				} else {
					_jTool2.default.each(_data, function (i, v) {
						_Cache2.default.setRowData(i, v);
						tbodyTmpHTML += '<tr cache-key="' + i + '">';
						_jTool2.default.each(Settings.columnData, function (i2, v2) {
							key = v2.key;
							template = v2.template;
							templateHTML = typeof template === 'function' ? template(v[key], v) : v[key];
							alignAttr = v2.align ? 'align="' + v2.align + '"' : '';
							tbodyTmpHTML += '<td gm-create="false" ' + alignAttr + '>' + templateHTML + '</td>';
						});
						tbodyTmpHTML += '</tr>';
					});
					tbodyDOM.html(tbodyTmpHTML);
					_DOM2.default.resetTd(table, false);
				}
				//渲染分页
				if (Settings.supportAjaxPage) {
					_AjaxPage2.default.resetPageData(table, parseRes[Settings.totalsKey]);
					_Menu2.default.checkMenuPageAction(table);
				}
				typeof callback === 'function' ? callback() : '';
			}
		}
		/*
	  [对外公开方法]
	  @配置query 该参数会在分页触发后返回至pagingAfter(query)方法
	  $.table: table [jTool object]
	  $.query:配置的数据
	  */
		, setQuery: function setQuery(table, query) {
			var settings = _Cache2.default.getSettings(table);
			_jTool2.default.extend(settings, { query: query });
			_Cache2.default.updateSettings(table, settings);
		}
		/*
	  [对外公开方法]
	  @配置ajaxData
	  $.table: table [jTool object]
	  $.query:配置的数据
	  */
		, setAjaxData: function setAjaxData(table, ajaxData) {
			var settings = _Cache2.default.getSettings(table);
			_jTool2.default.extend(settings, { ajax_data: ajaxData });
			_Cache2.default.updateSettings(table, settings);
			this.__refreshGrid(table);
		}

	};
	exports.default = Core;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _jTool = __webpack_require__(1);

	var _jTool2 = _interopRequireDefault(_jTool);

	var _Adjust = __webpack_require__(3);

	var _Adjust2 = _interopRequireDefault(_Adjust);

	var _AjaxPage = __webpack_require__(6);

	var _AjaxPage2 = _interopRequireDefault(_AjaxPage);

	var _Cache = __webpack_require__(4);

	var _Cache2 = _interopRequireDefault(_Cache);

	var _Config = __webpack_require__(9);

	var _Config2 = _interopRequireDefault(_Config);

	var _Checkbox = __webpack_require__(10);

	var _Checkbox2 = _interopRequireDefault(_Checkbox);

	var _Base = __webpack_require__(5);

	var _Base2 = _interopRequireDefault(_Base);

	var _Export = __webpack_require__(12);

	var _Export2 = _interopRequireDefault(_Export);

	var _Order = __webpack_require__(13);

	var _Order2 = _interopRequireDefault(_Order);

	var _Remind = __webpack_require__(14);

	var _Remind2 = _interopRequireDefault(_Remind);

	var _Sort = __webpack_require__(15);

	var _Sort2 = _interopRequireDefault(_Sort);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var DOM = {
		/*
	  @渲染HTML，根据配置嵌入所需的事件源DOM
	  $.table: table[jTool对象]
	  */
		createDOM: function createDOM(table) {
			var Settings = _Cache2.default.getSettings(table);
			table.attr('width', '100%').attr('cellspacing', 1).attr('cellpadding', 0).attr('grid-manager', Settings.gridManagerName);
			var theadHtml = '<thead grid-manager-thead>',
			    tbodyHtml = '<tbody></tbody>',
			    alignAttr = '',
			    //文本对齐属性
			widthHtml = '',
			    //宽度对应的html片段
			remindHtml = '',
			    //提醒对应的html片段
			sortingHtml = ''; //排序对应的html片段
			//通过配置项[columnData]生成thead
			_jTool2.default.each(Settings.columnData, function (i, v) {
				// 表头提醒
				if (Settings.supportRemind && typeof v.remind === 'string' && v.remind !== '') {
					remindHtml = 'remind="' + v.remind + '"';
				}
				// 排序
				sortingHtml = '';
				if (Settings.supportSorting && typeof v.sorting === 'string') {
					if (v.sorting === Settings.sortDownText) {
						sortingHtml = 'sorting="' + Settings.sortDownText + '"';
						Settings.sortData[v.key] = Settings.sortDownText;
					} else if (v.sorting === Settings.sortUpText) {
						sortingHtml = 'sorting="' + Settings.sortUpText + '"';
						Settings.sortData[v.key] = Settings.sortUpText;
					} else {
						sortingHtml = 'sorting=""';
					}
				}
				if (v.width) {
					widthHtml = 'width="' + v.width + '"';
				} else {
					widthHtml = '';
				}
				alignAttr = v.align ? 'align="' + v.align + '"' : '';
				theadHtml += '<th gm-create="false" th-name="' + v.key + '" ' + remindHtml + ' ' + sortingHtml + ' ' + widthHtml + ' ' + alignAttr + '>' + v.text + '</th>';
			});
			theadHtml += '</thead>';
			table.html(theadHtml + tbodyHtml);
			//嵌入序号DOM
			if (Settings.supportAutoOrder) {
				_Order2.default.initDOM(table);
			}
			//嵌入选择返选DOM
			if (Settings.supportCheckbox) {
				_Checkbox2.default.initDOM(table);
			}
			//存储原始th DOM
			_Cache2.default.setOriginalThDOM(table);
			//表头提醒HTML
			var _remindHtml = _Remind2.default.html();
			//配置列表HTML
			var _configHtml = _Config2.default.html();
			//宽度调整HTML
			var _adjustHtml = _Adjust2.default.html();
			//排序HTML
			var _sortingHtml = _Sort2.default.html();
			//导出表格数据所需的事件源DOM
			var exportActionHtml = _Export2.default.html();
			//AJAX分页HTML
			if (Settings.supportAjaxPage) {
				var _ajaxPageHtml = _AjaxPage2.default.html();
			}
			var wrapHtml, //外围的html片段
			tableWarp, //单个table所在的DIV容器
			onlyThead, //单个table下的thead
			onlyThList, //单个table下的TH
			onlyTH, //单个TH
			onlyThWarp, //单个TH下的上层DIV
			remindDOM, //表头提醒DOM
			adjustDOM, //调整宽度DOM
			sortingDom, //排序DOM
			sortType, //排序类形
			isLmOrder, //是否为插件自动生成的序号列
			isLmCheckbox; //是否为插件自动生成的选择列

			//根据配置使用默认的表格样式
			if (Settings.useDefaultStyle) {
				table.addClass('grid-manager-default');
			}
			onlyThead = (0, _jTool2.default)('thead', table);
			onlyThList = (0, _jTool2.default)('th', onlyThead);
			wrapHtml = '<div class="table-wrap"><div class="table-div" style="height: ' + Settings.height + '"></div><span class="text-dreamland"></span></div>';
			table.wrap(wrapHtml);
			tableWarp = table.closest('.table-wrap');
			//嵌入配置列表DOM
			if (Settings.supportConfig) {
				tableWarp.append(_configHtml);
			}
			//嵌入Ajax分页DOM
			if (Settings.supportAjaxPage) {
				tableWarp.append(_ajaxPageHtml);
				_AjaxPage2.default.initAjaxPage(table);
			}
			//嵌入导出表格数据事件源
			if (Settings.supportExport) {
				tableWarp.append(exportActionHtml);
			}
			_jTool2.default.each(onlyThList, function (i2, v2) {
				onlyTH = (0, _jTool2.default)(v2);
				onlyTH.attr('th-visible', 'visible');
				//是否为自动生成的序号列
				if (Settings.supportAutoOrder && onlyTH.attr('gm-order') === 'true') {
					isLmOrder = true;
				} else {
					isLmOrder = false;
				}

				//是否为自动生成的选择列
				if (Settings.supportCheckbox && onlyTH.attr('gm-checkbox') === 'true') {
					isLmCheckbox = true;
				} else {
					isLmCheckbox = false;
				}

				onlyThWarp = (0, _jTool2.default)('<div class="th-wrap"></div>');
				//嵌入配置列表项
				if (Settings.supportConfig) {
					(0, _jTool2.default)('.config-list', tableWarp).append('<li th-name="' + onlyTH.attr('th-name') + '" class="checked-li">' + '<input type="checkbox" checked="checked"/>' + '<label>' + '<span class="fake-checkbox"></span>' + onlyTH.text() + '</label>' + '</li>');
				}
				//嵌入拖拽事件源
				//插件自动生成的排序与选择列不做事件绑定
				if (Settings.supportDrag && !isLmOrder && !isLmCheckbox) {
					onlyThWarp.html('<span class="th-text drag-action">' + onlyTH.html() + '</span>');
				} else {
					onlyThWarp.html('<span class="th-text">' + onlyTH.html() + '</span>');
				}
				var onlyThWarpPaddingTop = onlyThWarp.css('padding-top');
				//嵌入表头提醒事件源
				//插件自动生成的排序与选择列不做事件绑定
				if (Settings.supportRemind && onlyTH.attr('remind') != undefined && !isLmOrder && !isLmCheckbox) {
					remindDOM = (0, _jTool2.default)(_remindHtml);
					remindDOM.find('.ra-title').text(onlyTH.text());
					remindDOM.find('.ra-con').text(onlyTH.attr('remind') || onlyTH.text());
					if (onlyThWarpPaddingTop != '' && onlyThWarpPaddingTop != '0px') {
						remindDOM.css('top', onlyThWarpPaddingTop);
					}
					onlyThWarp.append(remindDOM);
				}
				//嵌入排序事件源
				//插件自动生成的排序与选择列不做事件绑定
				sortType = onlyTH.attr('sorting');
				if (Settings.supportSorting && sortType != undefined && !isLmOrder && !isLmCheckbox) {
					sortingDom = (0, _jTool2.default)(_sortingHtml);
					//依据 sortType 进行初始显示
					switch (sortType) {
						case Settings.sortUpText:
							sortingDom.addClass('sorting-up');
							break;
						case Settings.sortDownText:
							sortingDom.addClass('sorting-down');
							break;
						default:
							break;
					}
					if (onlyThWarpPaddingTop != '' && onlyThWarpPaddingTop != '0px') {
						sortingDom.css('top', onlyThWarpPaddingTop);
					}
					onlyThWarp.append(sortingDom);
				}
				//嵌入宽度调整事件源,插件自动生成的选择列不做事件绑定
				if (Settings.supportAdjust && !isLmOrder && !isLmCheckbox) {
					adjustDOM = (0, _jTool2.default)(_adjustHtml);
					//最后一列不支持调整宽度
					if (i2 == onlyThList.length - 1) {
						adjustDOM.hide();
					}
					onlyThWarp.append(adjustDOM);
				}
				onlyTH.html(onlyThWarp);
				//如果th上存在width属性，则表明配置项中存在该项配置；
				//验证当前列是否存在宽度配置，如果存在，则直接使用配置项中的宽度，如果不存在则使用getTextWidth方法进行计算
				var thWidthForConfig = onlyTH.attr('width');
				// 宽度配置: GM自动创建为固定宽度
				if (isLmOrder || isLmCheckbox) {
					onlyTH.width(50);
				}
				// 宽度配置: 非GM自动创建的列
				else {
						// 当前列被手动配置了宽度
						if (thWidthForConfig && thWidthForConfig !== '') {
							onlyTH.width(thWidthForConfig);
							onlyTH.removeAttr('width');
						}
						// 当前列宽度未进行手动配置
						else {
								var _minWidth = _Base2.default.getTextWidth(onlyTH); //当前th文本所占宽度大于设置的宽度
								//重置width 防止auto现象
								var _oldWidth = onlyTH.width();
								onlyTH.width(_oldWidth > _minWidth ? _oldWidth : _minWidth);
							}
					}
			});
			//删除渲染中标识、增加渲染完成标识
			table.removeClass('GridManager-loading');
			table.addClass('GridManager-ready');
		}
		/*
	  [对外公开方法]
	  @重置列表[tbody]
	  这个方法对外可以直接调用
	  作用：处理局部刷新、分页事件之后的tb排序
	  $.table: table [jTool object]
	  $.isSingleRow: 指定DOM节点是否为tr[布尔值]
	  */
		, resetTd: function resetTd(dom, isSingleRow) {
			if (isSingleRow) {
				var _tr = (0, _jTool2.default)(dom),
				    _table = _tr.closest('table');
			} else {
				var _table = (0, _jTool2.default)(dom),
				    _tr = _table.find('tbody tr');
			}
			if (!_tr || _tr.length == 0) {
				return false;
			}
			var Settings = _Cache2.default.getSettings(_table);
			//重置表格序号
			if (Settings.supportAutoOrder) {
				var _pageData = Settings.pageData;
				var onlyOrderTd = undefined,
				    _orderBaseNumber = 1,
				    _orderText;
				//验证是否存在分页数据
				if (_pageData && _pageData['pSize'] && _pageData['cPage']) {
					_orderBaseNumber = _pageData.pSize * (_pageData.cPage - 1) + 1;
				}
				_jTool2.default.each(_tr, function (i, v) {
					_orderText = _orderBaseNumber + i;
					onlyOrderTd = (0, _jTool2.default)('td[gm-order="true"]', v);
					if (onlyOrderTd.length == 0) {
						(0, _jTool2.default)(v).prepend('<td gm-order="true" gm-create="true">' + _orderText + '</td>');
					} else {
						onlyOrderTd.text(_orderText);
					}
				});
			}
			//重置表格选择 checkbox
			if (Settings.supportCheckbox) {
				var onlyCheckTd = undefined;
				_jTool2.default.each(_tr, function (i, v) {
					onlyCheckTd = (0, _jTool2.default)('td[gm-checkbox="true"]', v);
					if (onlyCheckTd.length == 0) {
						(0, _jTool2.default)(v).prepend('<td gm-checkbox="true" gm-create="true"><input type="checkbox"/></td>');
					} else {
						(0, _jTool2.default)('[type="checkbox"]', onlyCheckTd).prop('checked', false);
					}
				});
			}
			//依据存储数据重置td顺序
			if (Settings.supportDrag) {
				var _thCacheList = _Cache2.default.getOriginalThDOM(_table),
				    _td;
				if (!_thCacheList || _thCacheList.length == 0) {
					_Base2.default.outLog('resetTdForCache:列位置重置所必须的原TH DOM获取失败', 'error');
					return false;
				}
				var _tdArray = [];
				_jTool2.default.each(_tr, function (i, v) {
					_tdArray = [];
					_td = (0, _jTool2.default)('td', v);
					_jTool2.default.each(_td, function (i2, v2) {
						_tdArray[_thCacheList.eq(i2).index()] = v2.outerHTML;
					});
					v.innerHTML = _tdArray.join('');
				});
			}
			//依据配置对列表进行隐藏、显示
			if (Settings.supportConfig) {
				_Base2.default.setAreVisible((0, _jTool2.default)('[th-visible="none"]'), false, true);
			}
		}
	}; /*
	   * DOM: 表格DOM相关操作
	   * */
	exports.default = DOM;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _jTool = __webpack_require__(1);

	var _jTool2 = _interopRequireDefault(_jTool);

	var _Base = __webpack_require__(5);

	var _Base2 = _interopRequireDefault(_Base);

	var _Cache = __webpack_require__(4);

	var _Cache2 = _interopRequireDefault(_Cache);

	var _Adjust = __webpack_require__(3);

	var _Adjust2 = _interopRequireDefault(_Adjust);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/*
	 * Config: th配置
	 * */
	var Config = {
		html: function html() {
			var html = '<div class="config-area"><span class="config-action"><i class="iconfont icon-31xingdongdian"></i></span><ul class="config-list"></ul></div>';
			return html;
		}
		/*
	  @绑定配置列表事件[隐藏展示列]
	  $.table: table [jTool object]
	  */
		, bindConfigEvent: function bindConfigEvent(table) {
			var Settings = _Cache2.default.getSettings(table);
			//打开/关闭设置区域
			var tableWarp = (0, _jTool2.default)(table).closest('div.table-wrap');
			var configAction = (0, _jTool2.default)('.config-action', tableWarp);
			configAction.unbind('click');
			configAction.bind('click', function () {
				var _configAction = (0, _jTool2.default)(this),
				    //展示事件源
				_configArea = _configAction.closest('.config-area'); //设置区域
				//关闭
				if (_configArea.css('display') === 'block') {
					_configArea.hide();
					return false;
				}
				//打开
				_configArea.show();
				var _tableWarp = _configAction.closest('.table-wrap'),
				    //当前事件源所在的div
				_table = (0, _jTool2.default)('[grid-manager]', _tableWarp),
				    //对应的table
				_thList = (0, _jTool2.default)('thead th', _table),
				    //所有的th
				_trList = (0, _jTool2.default)('tbody tr', _table),
				    //tbody下的tr
				_td; //与单个th对应的td
				_jTool2.default.each(_thList, function (i, v) {
					v = (0, _jTool2.default)(v);
					_jTool2.default.each(_trList, function (i2, v2) {
						_td = (0, _jTool2.default)('td', v2).eq(v.index());
						_td.css('display', v.css('display'));
					});
				});
				//验证当前是否只有一列处于显示状态 并根据结果进行设置是否可以取消显示
				var checkedLi = (0, _jTool2.default)('.checked-li', _configArea);
				checkedLi.length == 1 ? checkedLi.addClass('no-click') : checkedLi.removeClass('no-click');
			});
			//设置事件
			(0, _jTool2.default)('.config-list li', tableWarp).unbind('click');
			(0, _jTool2.default)('.config-list li', tableWarp).bind('click', function () {
				var _only = (0, _jTool2.default)(this),
				    //单个的设置项
				_thName = _only.attr('th-name'),
				    //单个设置项的thName
				_checkbox = _only.find('input[type="checkbox"]'),
				    //事件下的checkbox
				_tableWarp = _only.closest('.table-wrap'),
				    //所在的大容器
				_tableDiv = (0, _jTool2.default)('.table-div', _tableWarp),
				    //所在的table-div
				_table = (0, _jTool2.default)('[grid-manager]', _tableWarp),
				    //所对应的table
				_th = (0, _jTool2.default)('thead[grid-manager-thead] th[th-name="' + _thName + '"]', _table),
				    //所对应的th
				_checkedList; //当前处于选中状态的展示项
				if (_only.hasClass('no-click')) {
					return false;
				}
				_only.closest('.config-list').find('.no-click').removeClass('no-click');
				var isVisible = !_checkbox.prop('checked');
				//设置与当前td同列的td是否可见
				_tableDiv.addClass('config-editing');
				_Base2.default.setAreVisible(_th, isVisible, function () {
					_tableDiv.removeClass('config-editing');
				});
				//限制最少显示一列
				_checkedList = (0, _jTool2.default)('.config-area input[type="checkbox"]:checked', _tableWarp);
				if (_checkedList.length == 1) {
					_checkedList.parent().addClass('no-click');
				}

				//重置调整宽度事件源
				if (Settings.supportAdjust) {
					_Adjust2.default.resetAdjust(_table);
				}

				//重置镜像滚动条的宽度
				// if(Settings.supportScroll){
				(0, _jTool2.default)('.sa-inner', _tableWarp).width('100%');
				// }
				//重置当前可视th的宽度
				var _visibleTh = (0, _jTool2.default)('thead th[th-visible="visible"]', _table);
				_jTool2.default.each(_visibleTh, function (i, v) {
					v.style.width = 'auto';
				});
				//当前th文本所占宽度大于设置的宽度
				//需要在上一个each执行完后才可以获取到准确的值
				_jTool2.default.each(_visibleTh, function (i, v) {
					var _realWidthForThText = _Base2.default.getTextWidth(v),
					    _thWidth = (0, _jTool2.default)(v).width();
					if (_thWidth < _realWidthForThText) {
						(0, _jTool2.default)(v).width(_realWidthForThText);
					} else {
						(0, _jTool2.default)(v).width(_thWidth);
					}
				});
				_Cache2.default.setToLocalStorage(_table); //缓存信息
			});
		}
	};
	exports.default = Config;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _jTool = __webpack_require__(1);

	var _jTool2 = _interopRequireDefault(_jTool);

	var _I18n = __webpack_require__(11);

	var _I18n2 = _interopRequireDefault(_I18n);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/*
	 * Checkbox: 数据选择/全选/返选
	 * */
	var Checkbox = {
		/*
	  @初始化选择与反选DOM
	  $.table: table DOM
	  */
		initDOM: function initDOM(table) {
			var checkboxHtml = '<th th-name="gm_checkbox" gm-checkbox="true" gm-create="true"><input type="checkbox"/><span style="display: none">' + _I18n2.default.i18nText('checkall-text') + '</span></th>';
			(0, _jTool2.default)('thead tr', table).prepend(checkboxHtml);
			//绑定选择事件
			table.off('click', 'input[type="checkbox"]');
			table.on('click', 'input[type="checkbox"]', function () {
				var _checkAction = (0, _jTool2.default)(this),
				    //全选键事件源
				_thChecked = true,
				    //存储th中的checkbox的选中状态
				_thCheckbox = (0, _jTool2.default)('thead th[gm-checkbox] input[type="checkbox"]', table),
				    //th中的选择框
				_tdCheckbox = (0, _jTool2.default)('tbody td[gm-checkbox] input[type="checkbox"]', table); //td中的选择框
				//当前为全选事件源
				if (_checkAction.closest('th[th-name="gm_checkbox"]').length === 1) {
					_jTool2.default.each(_tdCheckbox, function (i, v) {
						v.checked = _checkAction.prop('checked');
						(0, _jTool2.default)(v).closest('tr').attr('checked', v.checked);
					});
					//当前为单个选择
				} else {
					_jTool2.default.each(_tdCheckbox, function (i, v) {
						if (v.checked === false) {
							_thChecked = false;
						}
						(0, _jTool2.default)(v).closest('tr').attr('checked', v.checked);
					});
					_thCheckbox.prop('checked', _thChecked);
				}
			});
		}
		/*
	  [对外公开方法]
	  @获取当前选中的行
	  $.table:当前操作的grid
	  */
		, getCheckedTr: function getCheckedTr(table) {
			return (0, _jTool2.default)('tbody tr[checked="true"]', table).DOMList || [];
		}
	};
	exports.default = Checkbox;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /*
	                                                                                                                                                                                                                                                                               * I18n: 国际化
	                                                                                                                                                                                                                                                                               * */


	var _Base = __webpack_require__(5);

	var _Base2 = _interopRequireDefault(_Base);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var I18n = {
		//选择使用哪种语言，暂时支持[zh-cn:简体中文，en-us:美式英语] 默认zh-cn
		i18n: 'zh-cn'
		/*
	  * @获取与当前配置国际化匹配的文本
	  *  $.key: 指向的文本索引
	  *  v1,v2,v3:可为空，也存在一至3项，只存在一项时可为数组
	  * */
		, i18nText: function i18nText(key, v1, v2, v3) {
			var _this = this;
			var intrusion = [];
			//处理参数，实现多态化
			if (arguments.length == 2 && _typeof(arguments[1]) == 'object') {
				intrusion = arguments[1];
			} else if (arguments.length > 1) {
				for (var i = 1; i < arguments.length; i++) {
					intrusion.push(arguments[i]);
				}
			}
			var _lg = '';
			try {
				_lg = _this.textConfig[key][_this.i18n] || '';
				if (!intrusion || intrusion.length == 0) {
					return _lg;
				}
				_lg = _lg.replace(/{\d+}/g, function (word) {
					return intrusion[word.match(/\d+/)];
				});
				return _lg;
			} catch (e) {
				_Base2.default.outLog('未找到与' + key + '相匹配的' + _this.i18n + '语言', 'warn');
				return '';
			}
		}
		/*
	  * 	@插件存在文本配置
	  * */
		, textConfig: {
			'order-text': {
				'zh-cn': '序号',
				'en-us': 'order'
			},
			'first-page': {
				'zh-cn': '首页',
				'en-us': 'first'
			},
			'previous-page': {
				'zh-cn': '上一页',
				'en-us': 'previous'
			},
			'next-page': {
				'zh-cn': '下一页',
				'en-us': 'next '
			},
			'last-page': {
				'zh-cn': '尾页',
				'en-us': 'last '
			},
			'dataTablesInfo': {
				'zh-cn': '此页显示 {0}-{1} 共{2}条',
				'en-us': 'this page show {0}-{1} count {2}'
			},
			'goto-first-text': {
				'zh-cn': '跳转至',
				'en-us': 'goto '
			},
			'goto-last-text': {
				'zh-cn': '页',
				'en-us': 'page '
			},
			'refresh': {
				'zh-cn': '重新加载',
				'en-us': 'Refresh '
			},
			'save-as-excel': {
				'zh-cn': '另存为Excel',
				'en-us': 'Save as Excel '
			},
			'save-as-excel-for-checked': {
				'zh-cn': '已选中项另存为Excel',
				'en-us': 'Save as Excel of Checked'
			},
			'setting-grid': {
				'zh-cn': '配置表',
				'en-us': 'Setting Grid'
			},
			'checkall-text': {
				'zh-cn': '全选',
				'en-us': 'All'
			}

		}
	};
	exports.default = I18n;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _jTool = __webpack_require__(1);

	var _jTool2 = _interopRequireDefault(_jTool);

	var _Core = __webpack_require__(7);

	var _Core2 = _interopRequireDefault(_Core);

	var _Cache = __webpack_require__(4);

	var _Cache2 = _interopRequireDefault(_Cache);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Export = {
		html: function html() {
			var html = '<a href="" download="" id="gm-export-action"></a>';
			return html;
		}
		/*
	  [对外公开方法]
	  @导出表格 .xls
	  $.table:当前操作的grid,由插件自动传入
	  $.fileName: 导出后的文件名
	  $.onlyChecked: 是否只导出已选中的表格
	  */
		, exportGridToXls: function exportGridToXls(table, fileName, onlyChecked) {
			var Settings = _Cache2.default.getSettings(table);
			var _this = this;
			var gmExportAction = (0, _jTool2.default)('#gm-export-action'); //createDOM内添加
			if (gmExportAction.length === 0) {
				_Core2.default.outLog('导出失败，请查看配置项:supportExport是否配置正确', 'error');
				return;
			}

			var uri = 'data:application/vnd.ms-excel;base64,',
			    theadHTML = '',
			    //存储导出的thead数据
			tbodyHTML = '',
			    //存储导出的tbody下的数据
			tableDOM = (0, _jTool2.default)(table); //当前要导出的table
			var thDOM = (0, _jTool2.default)('thead[grid-manager-thead] th[th-visible="visible"][gm-create="false"]', tableDOM),
			    trDOM,
			    tdDOM;
			//验证：是否只导出已选中的表格
			if (onlyChecked) {
				trDOM = (0, _jTool2.default)('tbody tr[checked="true"]', tableDOM);
			} else {
				trDOM = (0, _jTool2.default)('tbody tr', tableDOM);
			}
			_jTool2.default.each(thDOM, function (i, v) {
				theadHTML += '<th>' + v.getElementsByClassName('th-text')[0].textContent + '</th>';
			});
			_jTool2.default.each(trDOM, function (i, v) {
				tdDOM = (0, _jTool2.default)('td[gm-create="false"]', v);
				tbodyHTML += '<tr>';
				_jTool2.default.each(tdDOM, function (i2, v2) {
					tbodyHTML += v2.outerHTML;
				});
				tbodyHTML += '</tr>';
			});
			// 拼接要导出html格式数据
			var exportHTML = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">' + '<head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"></head>' + '<body><table>' + '<thead>' + theadHTML + '</thead>' + '<tbody>' + tbodyHTML + '</tbody>' + '</table></body>' + '</html>';
			gmExportAction.prop('href', uri + base64(exportHTML));
			gmExportAction.prop('download', (fileName || Settings.gridManagerName) + '.xls');
			gmExportAction.get(0).click();

			function base64(s) {
				return window.btoa(unescape(encodeURIComponent(s)));
			}
		}
	}; /*
	    * Export: 数据导出
	    * */
	exports.default = Export;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _jTool = __webpack_require__(1);

	var _jTool2 = _interopRequireDefault(_jTool);

	var _I18n = __webpack_require__(11);

	var _I18n2 = _interopRequireDefault(_I18n);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/*
	 * Order: 序号
	 * */
	var Order = {
		/*
	  @生成序号DOM
	  $.table: table [jTool object]
	  */
		initDOM: function initDOM(table) {
			var orderHtml = '<th th-name="gm_order" gm-order="true" gm-create="true">' + _I18n2.default.i18nText('order-text') + '</th>';
			(0, _jTool2.default)('thead tr', table).prepend(orderHtml);
		}
	};
	exports.default = Order;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _jTool = __webpack_require__(1);

	var _jTool2 = _interopRequireDefault(_jTool);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Remind = {
		html: function html() {
			var html = '<div class="remind-action">' + '<i class="ra-help iconfont icon-icon"></i>' + '<div class="ra-area">' + '<span class="ra-title"></span>' + '<span class="ra-con"></span>' + '</div>' + '</div>';
			return html;
		}
		/*
	 * @绑定表头提醒功能
	 * $.table: table [jTool object]
	 * */
		, bindRemindEvent: function bindRemindEvent(table) {
			var raArea, tableDiv, theLeft;
			var remindAction = (0, _jTool2.default)('.remind-action', table);
			remindAction.unbind('mouseenter');
			remindAction.bind('mouseenter', function () {
				raArea = (0, _jTool2.default)(this).find('.ra-area');
				tableDiv = (0, _jTool2.default)(this).closest('.table-div');
				raArea.show();
				theLeft = tableDiv.get(0).offsetWidth - ((0, _jTool2.default)(this).offset().left - tableDiv.offset().left) > raArea.get(0).offsetWidth;
				raArea.css({
					left: theLeft ? '0px' : 'auto',
					right: theLeft ? 'auto' : '0px'
				});
			});
			remindAction.unbind('mouseleave');
			remindAction.bind('mouseleave', function () {
				raArea = (0, _jTool2.default)(this).find('.ra-area');
				raArea.hide();
			});
		}
	}; /*
	    * Remind: 表头提醒
	    * */
	exports.default = Remind;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _jTool = __webpack_require__(1);

	var _jTool2 = _interopRequireDefault(_jTool);

	var _Base = __webpack_require__(5);

	var _Base2 = _interopRequireDefault(_Base);

	var _Core = __webpack_require__(7);

	var _Core2 = _interopRequireDefault(_Core);

	var _Cache = __webpack_require__(4);

	var _Cache2 = _interopRequireDefault(_Cache);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/*
	* Sort: 排序
	* */
	var Sort = {
		html: function html() {
			var html = '<div class="sorting-action">' + '<i class="sa-icon sa-up iconfont icon-sanjiao2"></i>' + '<i class="sa-icon sa-down iconfont icon-sanjiao1"></i>' + '</div>';
			return html;
		}
		/*
	  [对外公开方法]
	  @手动设置排序
	  $.table: table [jTool object]
	  $.sortJson: 需要排序的json串
	  $.callback: 回调函数
	  $.refresh: 是否执行完成后对表格进行自动刷新[boolean]
	  ex: sortJson
	  sortJson = {
	  th-name:up/down 	//其中up/down 需要与参数 sortUpText、sortDownText值相同
	  }
	  */
		, setSort: function setSort(table, sortJson, callback, refresh) {
			console.log(refresh);
			var Settings = _Cache2.default.getSettings(table);
			if (table.length == 0 || !sortJson || _jTool2.default.isEmptyObject(sortJson)) {
				return false;
			}
			//默认执行完后进行刷新列表操作
			if (typeof refresh === 'undefined') {
				refresh = true;
			}
			var _th, _sortAction, _sortType;
			for (var s in sortJson) {
				_th = (0, _jTool2.default)('[th-name="' + s + '"]', table);
				_sortType = sortJson[s];
				_sortAction = (0, _jTool2.default)('.sorting-action', _th);
				if (_sortType == Settings.sortUpText) {
					_th.attr('sorting', Settings.sortUpText);
					_sortAction.removeClass('sorting-down');
					_sortAction.addClass('sorting-up');
				} else if (_sortType == Settings.sortDownText) {
					_th.attr('sorting', Settings.sortDownText);
					_sortAction.removeClass('sorting-up');
					_sortAction.addClass('sorting-down');
				}
			}
			refresh ? _Core2.default.__refreshGrid(table, callback) : typeof callback === 'function' ? callback() : '';
			return table;
		}
		/*
	  @绑定排序事件
	  $.table: table [jTool object]
	  */
		, bindSortingEvent: function bindSortingEvent(table) {
			var Settings = _Cache2.default.getSettings(table);
			var _thList = (0, _jTool2.default)('th[sorting]', table),
			    //所有包含排序的列
			_action,
			    //向上或向下事件源
			_th,
			    //事件源所在的th
			_table,
			    //事件源所在的table
			_thName; //th对应的名称

			//绑定排序事件
			(0, _jTool2.default)('.sorting-action', _thList).unbind('mouseup');
			(0, _jTool2.default)('.sorting-action', _thList).bind('mouseup', function () {
				_action = (0, _jTool2.default)(this);
				_th = _action.closest('th');
				_table = _th.closest('table');
				_thName = _th.attr('th-name');
				if (!_thName || _jTool2.default.trim(_thName) == '') {
					_Base2.default.outLog('排序必要的参数丢失', 'error');
					return false;
				}
				//根据组合排序配置项判定：是否清除原排序及排序样式
				if (!Settings.isCombSorting) {
					_jTool2.default.each((0, _jTool2.default)('.sorting-action', _table), function (i, v) {
						if (v != _action.get(0)) {
							//_action.get(0) 当前事件源的DOM
							(0, _jTool2.default)(v).removeClass('sorting-up sorting-down');
							(0, _jTool2.default)(v).closest('th').attr('sorting', '');
						}
					});
				}
				//排序操作：升序
				if (_action.hasClass('sorting-down')) {
					_action.addClass('sorting-up');
					_action.removeClass('sorting-down');
					_th.attr('sorting', Settings.sortUpText);
				}
				//排序操作：降序
				else {
						_action.addClass('sorting-down');
						_action.removeClass('sorting-up');
						_th.attr('sorting', Settings.sortDownText);
					}
				//生成排序数据
				Settings.sortData = {};
				if (!Settings.isCombSorting) {
					Settings.sortData[_th.attr('th-name')] = _th.attr('sorting');
				} else {
					_jTool2.default.each((0, _jTool2.default)('th[th-name][sorting]', _table), function (i, v) {
						if (v.getAttribute('sorting') != '') {
							Settings.sortData[v.getAttribute('th-name')] = v.getAttribute('sorting');
						}
					});
				}
				//调用事件、渲染tbody
				_Cache2.default.updateSettings(table, Settings);
				var query = _jTool2.default.extend({}, Settings.query, Settings.sortData, Settings.pageData);
				Settings.sortingBefore(query);
				_Core2.default.__refreshGrid(table, function () {
					Settings.sortingAfter(query, _th);
				});
			});
		}
	};
	exports.default = Sort;

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _jTool = __webpack_require__(1);

	var _jTool2 = _interopRequireDefault(_jTool);

	var _Cache = __webpack_require__(4);

	var _Cache2 = _interopRequireDefault(_Cache);

	var _I18n = __webpack_require__(11);

	var _I18n2 = _interopRequireDefault(_I18n);

	var _Export = __webpack_require__(12);

	var _Export2 = _interopRequireDefault(_Export);

	var _AjaxPage = __webpack_require__(6);

	var _AjaxPage2 = _interopRequireDefault(_AjaxPage);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Menu = {
		/*
	  @验证菜单区域: 禁用、开启分页操作
	  */
		checkMenuPageAction: function checkMenuPageAction(table) {
			var Settings = _Cache2.default.getSettings(table);
			//右键菜单区上下页限制
			var gridMenu = (0, _jTool2.default)('.grid-menu[grid-master="' + Settings.gridManagerName + '"]');
			if (!gridMenu || gridMenu.length === 0) {
				return;
			}
			var previousPage = (0, _jTool2.default)('[refresh-type="previous"]', gridMenu),
			    nextPage = (0, _jTool2.default)('[refresh-type="next"]', gridMenu);
			if (Settings.pageData.cPage === 1 || Settings.pageData.tPage === 0) {
				previousPage.addClass('disabled');
			} else {
				previousPage.removeClass('disabled');
			}
			if (Settings.pageData.cPage === Settings.pageData.tPage || Settings.pageData.tPage === 0) {
				nextPage.addClass('disabled');
			} else {
				nextPage.removeClass('disabled');
			}
		}
		/*
	  @绑定右键菜单事件
	  $.table:table
	  */
		, bindRightMenuEvent: function bindRightMenuEvent(table) {
			var Settings = _Cache2.default.getSettings(table);
			var tableWarp = (0, _jTool2.default)(table).closest('.table-wrap'),
			    tbody = (0, _jTool2.default)('tbody', tableWarp);
			//刷新当前表格
			var menuHTML = '<div class="grid-menu" grid-master="' + Settings.gridManagerName + '">';
			//分页类操作
			if (Settings.supportAjaxPage) {
				menuHTML += '<span grid-action="refresh-page" refresh-type="previous">' + _I18n2.default.i18nText("previous-page") + '<i class="iconfont icon-sanjiao2"></i></span>' + '<span grid-action="refresh-page" refresh-type="next">' + _I18n2.default.i18nText("next-page") + '<i class="iconfont icon-sanjiao1"></i></span>';
			}
			menuHTML += '<span grid-action="refresh-page" refresh-type="refresh">' + _I18n2.default.i18nText("refresh") + '<i class="iconfont icon-31shuaxin"></i></span>';
			//导出类
			if (Settings.supportExport) {
				menuHTML += '<span class="grid-line"></span>' + '<span grid-action="export-excel" only-checked="false">' + _I18n2.default.i18nText("save-as-excel") + '<i class="iconfont icon-baocun"></i></span>' + '<span grid-action="export-excel" only-checked="true">' + _I18n2.default.i18nText("save-as-excel-for-checked") + '<i class="iconfont icon-saveas24"></i></span>';
			}
			//配置类
			if (Settings.supportConfig) {
				menuHTML += '<span class="grid-line"></span>' + '<span grid-action="setting-grid">' + _I18n2.default.i18nText("setting-grid") + '<i class="iconfont icon-shezhi"></i></span>';
			}
			menuHTML += '</div>';
			var _body = (0, _jTool2.default)('body');
			_body.append(menuHTML);
			//绑定打开右键菜单栏
			var menuDOM = (0, _jTool2.default)('.grid-menu[grid-master="' + Settings.gridManagerName + '"]');
			tableWarp.unbind('contextmenu');
			tableWarp.bind('contextmenu', function (e) {
				e.preventDefault();
				e.stopPropagation();
				//验证：如果不是tbdoy或者是tbody的子元素，直接跳出
				if (e.target.nodeName !== 'TBODY' && (0, _jTool2.default)(e.target).closest('tbody').length === 0) {
					return;
				}
				//验证：当前是否存在已选中的项
				var exportExcelOfChecked = (0, _jTool2.default)('[grid-action="export-excel"][only-checked="true"]');
				if ((0, _jTool2.default)('tbody tr[checked="true"]', (0, _jTool2.default)('table[grid-manager="' + Settings.gridManagerName + '"]')).length === 0) {
					exportExcelOfChecked.addClass('disabled');
				} else {
					exportExcelOfChecked.removeClass('disabled');
				}
				var menuWidth = menuDOM.width(),
				    menuHeight = menuDOM.height(),
				    offsetHeight = document.documentElement.offsetHeight,
				    offsetWidth = document.documentElement.offsetWidth;
				var top = offsetHeight < e.clientY + menuHeight ? e.clientY - menuHeight : e.clientY;
				var left = offsetWidth < e.clientX + menuWidth ? e.clientX - menuWidth : e.clientX;
				menuDOM.css({
					'top': top + tableWarp.get(0).scrollTop + (document.body.scrollTop || document.documentElement.scrollTop),
					'left': left + tableWarp.get(0).scrollLeft + (document.body.scrollLeft || document.documentElement.scrollLeft)
				});
				//隐藏非当前展示表格的菜单项
				(0, _jTool2.default)('.grid-menu[grid-master]').hide();
				menuDOM.show();
				_body.off('mousedown.gridMenu');
				_body.on('mousedown.gridMenu', function (e) {
					var eventSource = (0, _jTool2.default)(e.target);
					if (eventSource.hasClass('.grid-menu') || eventSource.closest('.grid-menu').length === 1) {
						return;
					}
					_body.off('mousedown.gridMenu');
					menuDOM.hide();
				});
			});

			//绑定事件：上一页、下一页、重新加载
			var refreshPage = (0, _jTool2.default)('[grid-action="refresh-page"]');
			refreshPage.unbind('click');
			refreshPage.bind('click', function (e) {
				if (isDisabled(this, e)) {
					return false;
				}
				var _gridMenu = (0, _jTool2.default)(this).closest('.grid-menu');
				var _table = (0, _jTool2.default)('table[grid-manager="' + _gridMenu.attr('grid-master') + '"]');
				var refreshType = this.getAttribute('refresh-type');
				var Settings = _Cache2.default.getSettings(_table);
				var cPage = Settings.pageData.cPage;
				//上一页
				if (refreshType === 'previous' && Settings.pageData.cPage > 1) {
					cPage = Settings.pageData.cPage - 1;
				}
				//下一页
				else if (refreshType === 'next' && Settings.pageData.cPage < Settings.pageData.tPage) {
						cPage = Settings.pageData.cPage + 1;
					}
					//重新加载
					else if (refreshType === 'refresh') {
							cPage = Settings.pageData.cPage;
						}
				_AjaxPage2.default.gotoPage(_table, cPage);
				_body.off('mousedown.gridMenu');
				_gridMenu.hide();
			});
			//绑定事件：另存为EXCEL、已选中表格另存为Excel
			var exportExcel = (0, _jTool2.default)('[grid-action="export-excel"]');
			exportExcel.unbind('click');
			exportExcel.bind('click', function (e) {
				if (isDisabled(this, e)) {
					return false;
				}
				var _gridMenu = (0, _jTool2.default)(this).closest('.grid-menu'),
				    _table = (0, _jTool2.default)('table[grid-manager="' + _gridMenu.attr('grid-master') + '"]');
				var onlyChecked = false;
				if (this.getAttribute('only-checked') === 'true') {
					onlyChecked = true;
				}
				_Export2.default.exportGridToXls(_table, undefined, onlyChecked);
				_body.off('mousedown.gridMenu');
				_gridMenu.hide();
			});
			//绑定事件：配置表
			var settingGrid = (0, _jTool2.default)('[grid-action="setting-grid"]');
			settingGrid.unbind('click');
			settingGrid.bind('click', function (e) {
				if (isDisabled(this, e)) {
					return false;
				}
				var _gridMenu = (0, _jTool2.default)(this).closest('.grid-menu'),
				    _table = (0, _jTool2.default)('table[grid-manager="' + _gridMenu.attr('grid-master') + '"]');
				var configArea = (0, _jTool2.default)('.config-area', _table.closest('.table-wrap'));
				(0, _jTool2.default)('.config-action', configArea).trigger('click');
				_body.off('mousedown.gridMenu');
				_gridMenu.hide();
			});
			//验证当前是否禁用
			function isDisabled(dom, events) {
				if ((0, _jTool2.default)(dom).hasClass('disabled')) {
					events.stopPropagation();
					events.preventDefault();
					return true;
				} else {
					return false;
				}
			}
		}
	}; /*
	    * GridManager: 右键菜单
	    * */
	exports.default = Menu;

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _jTool = __webpack_require__(1);

	var _jTool2 = _interopRequireDefault(_jTool);

	var _Base = __webpack_require__(5);

	var _Base2 = _interopRequireDefault(_Base);

	var _Adjust = __webpack_require__(3);

	var _Adjust2 = _interopRequireDefault(_Adjust);

	var _Cache = __webpack_require__(4);

	var _Cache2 = _interopRequireDefault(_Cache);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/*
	 * Drag: 拖拽
	 * */
	var Drag = {
		/*
	  @绑定拖拽换位事件
	  $.table: table [jTool object]
	  */
		bindDragEvent: function bindDragEvent(table) {
			var thList = (0, _jTool2.default)('thead th', table),
			    //匹配页面下所有的TH
			dragAction = thList.find('.drag-action');
			//指定拖拽换位事件源,配置拖拽样式
			var _th, //事件源th
			_prevTh, //事件源的上一个th
			_nextTh, //事件源的下一个th
			_prevTd, //事件源对应的上一组td
			_nextTd, //事件源对应的下一组td
			_tr, //事件源所在的tr
			_allTh, //事件源同层级下的所有可视th
			_table, //事件源所在的table
			_tableDiv, //事件源所在的DIV
			_tableWrap, //事件源所在的容器
			_td, //与事件源同列的所在td
			_divPosition, //所在DIV使用定位方式
			_dreamlandDIV; //临时展示被移动的列
			dragAction.unbind('mousedown');
			dragAction.bind('mousedown', function (event) {
				var Settings = _Cache2.default.getSettings(table);
				_th = (0, _jTool2.default)(this).closest('th'), _prevTh = undefined, _nextTh = undefined, _prevTd = undefined, _nextTd = undefined, _tr = _th.parent(), _allTh = _tr.find('th[th-visible="visible"]'), _table = _tr.closest('table'), _tableDiv = _table.closest('.table-div'), _tableWrap = _table.closest('.table-wrap'), _td = _Base2.default.getRowTd(_th);
				// 列拖拽触发回调事件
				Settings.dragBefore(event);

				//禁用文字选中效果
				(0, _jTool2.default)('body').addClass('no-select-text');
				//父级DIV使用相对定位
				_divPosition = _tableDiv.css('position');
				if (_divPosition != 'relative' && _divPosition != 'absolute') {
					_tableDiv.css('position', 'relative');
				}
				//增加拖拽中样式
				_th.addClass('drag-ongoing opacityChange');
				_td.addClass('drag-ongoing opacityChange');

				//增加临时展示DOM
				_tableWrap.append('<div class="dreamland-div"></div>');
				_dreamlandDIV = (0, _jTool2.default)('.dreamland-div', _tableWrap);
				_dreamlandDIV.get(0).innerHTML = '<table class="dreamland-table ' + _table.attr('class') + '"></table>';
				var tmpHtml = '<thead>' + '<tr>' + '<th style="height:' + _th.get(0).offsetHeight + 'px">' + _th.find('.drag-action').get(0).outerHTML + '</th>' + '</tr>' + '</thead>' + '<tbody>';
				//tbody内容：将原tr与td上的属性一并带上，解决一部分样式问题
				var _cloneTr, _cloneTd;
				_jTool2.default.each(_td, function (i, v) {
					_cloneTd = v.cloneNode(true);
					_cloneTd.style.height = v.offsetHeight + 'px';
					_cloneTr = (0, _jTool2.default)(v).closest('tr').clone();
					tmpHtml += _cloneTr.html(_cloneTd.outerHTML).get(0).outerHTML;
				});
				tmpHtml += '</tbody>';
				(0, _jTool2.default)('.dreamland-table', _dreamlandDIV).html(tmpHtml);
				//绑定拖拽滑动事件
				var _thIndex = 0; //存储移动时的th所处的位置
				(0, _jTool2.default)('body').unbind('mousemove');
				(0, _jTool2.default)('body').bind('mousemove', function (e2) {
					_thIndex = _th.index(_allTh);
					_prevTh = undefined;
					//当前移动的非第一列
					if (_thIndex > 0) {
						_prevTh = _allTh.eq(_thIndex - 1);
					}
					_nextTh = undefined;
					//当前移动的非最后一列
					if (_thIndex < _allTh.length) {
						_nextTh = _allTh.eq(_thIndex + 1);
					}
					//插件自动创建的项,不允许移动
					if (_prevTh && _prevTh.length !== 0 && _prevTh.attr('gm-create') === 'true') {
						_prevTh = undefined;
					} else if (_nextTh && _nextTh.length !== 0 && _nextTh.attr('gm-create') === 'true') {
						_nextTh = undefined;
					}
					_dreamlandDIV.show();
					_dreamlandDIV.css({
						width: _th.get(0).offsetWidth,
						height: _table.get(0).offsetHeight,
						left: e2.clientX - _tableDiv.offset().left
						//  + $('html').get(0).scrollLeft
						+ _tableDiv.get(0).scrollLeft + (document.body.scrollLeft || document.documentElement.scrollLeft) - _th.get(0).offsetWidth / 2 + 'px',
						top: e2.clientY - _tableDiv.offset().top + _tableDiv.get(0).scrollTop + (document.body.scrollTop || document.documentElement.scrollTop) - _dreamlandDIV.find('th').get(0).offsetHeight / 2
					});
					//处理向左拖拽
					if (_prevTh && _prevTh.length != 0 && _dreamlandDIV.get(0).offsetLeft < _prevTh.get(0).offsetLeft) {
						_prevTd = _Base2.default.getRowTd(_prevTh);
						_prevTh.before(_th);
						_jTool2.default.each(_td, function (i, v) {
							_prevTd.eq(i).before(v);
						});
						_allTh = _tr.find('th'); //重置TH对象数据
					}
					//处理向右拖拽
					if (_nextTh && _nextTh.length != 0 && _dreamlandDIV.get(0).offsetLeft > _nextTh.get(0).offsetLeft - _dreamlandDIV.get(0).offsetWidth / 2) {
						_nextTd = _Base2.default.getRowTd(_nextTh);
						_nextTh.after(_th);
						_jTool2.default.each(_td, function (i, v) {
							_nextTd.eq(i).after(v);
						});
						_allTh = _tr.find('th'); //重置TH对象数据
					}
				});
				//绑定拖拽停止事件
				(0, _jTool2.default)('body').unbind('mouseup');
				(0, _jTool2.default)('body').bind('mouseup', function (event) {
					var Settings = _Cache2.default.getSettings(table);
					(0, _jTool2.default)('body').unbind('mousemove');
					//清除临时展示被移动的列
					_dreamlandDIV = (0, _jTool2.default)('.dreamland-div');
					if (_dreamlandDIV.length != 0) {
						_dreamlandDIV.animate({
							top: _table.get(0).offsetTop + 'px',
							left: _th.get(0).offsetLeft - _tableDiv.get(0).scrollLeft + 'px'
						}, Settings.animateTime, function () {
							_tableDiv.css('position', _divPosition);
							_th.removeClass('drag-ongoing');
							_td.removeClass('drag-ongoing');
							_dreamlandDIV.remove();

							// 列拖拽成功回调事件
							Settings.dragAfter(event);
						});
					}
					//缓存列表位置信息
					_Cache2.default.setToLocalStorage(_table);

					//重置调整宽度事件源
					if (Settings.supportAdjust) {
						_Adjust2.default.resetAdjust(_table);
					}
					//开启文字选中效果
					(0, _jTool2.default)('body').removeClass('no-select-text');
				});
			});
		}
	};
	exports.default = Drag;

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _jTool = __webpack_require__(1);

	var _jTool2 = _interopRequireDefault(_jTool);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Scroll = {
		/*
	  @绑定表格滚动轴功能
	  $.table: table [jTool object]
	  */
		bindScrollFunction: function bindScrollFunction(table) {
			var _tableDIV = table.closest('.table-div'),
			    //列表所在的DIV,该DIV的class标识为table-div
			_tableWarp = _tableDIV.closest('.table-wrap'); //列表所在的外围容器
			// 绑定resize事件: 对表头吸顶的列宽度进行修正
			window.addEventListener('resize', function () {
				var _setTopHead = (0, _jTool2.default)('.set-top', table); //吸顶元素
				if (_setTopHead && _setTopHead.length === 1) {
					_setTopHead.remove();
					_tableDIV.trigger('scroll');
				}
			});
			//绑定滚动条事件
			_tableDIV.unbind('scroll');
			_tableDIV.bind('scroll', function (e, _isWindowResize_) {
				var _scrollDOMTop = (0, _jTool2.default)(this).scrollTop();
				_tableDIV = table.closest('.table-div');
				_tableWarp = _tableDIV.closest('.table-wrap');
				var _thead = (0, _jTool2.default)('thead[grid-manager-thead]', table); //列表head
				var _tbody = (0, _jTool2.default)('tbody', table); //列表body
				var _setTopHead = (0, _jTool2.default)('.set-top', table); //吸顶元素
				//当前列表数据为空
				if ((0, _jTool2.default)('tr', _tbody).length == 0) {
					return true;
				}
				//配置吸顶区的宽度
				if (_setTopHead.length == 0 || _isWindowResize_) {
					_setTopHead.length == 0 ? table.append(_thead.clone(true).addClass('set-top')) : '';
					_setTopHead = (0, _jTool2.default)('.set-top', table);
					_setTopHead.removeAttr('grid-manager-thead');
					_setTopHead.removeClass('scrolling');
					_setTopHead.css({
						width: _thead.width(),
						left: table.css('border-left-width') + 'px'
					});
					// 防止window.resize事件后导致的吸顶宽度错误. 可以优化
					_jTool2.default.each((0, _jTool2.default)('th', _thead), function (i, v) {
						(0, _jTool2.default)('th', _setTopHead).eq(i).width((0, _jTool2.default)(v).width());
					});
				}
				if (_setTopHead.length === 0) {
					return;
				}
				// 删除表头置顶
				if (_scrollDOMTop === 0) {
					_thead.removeClass('scrolling');
					_setTopHead.remove();
				}
				// 显示表头置顶
				else {
						_thead.addClass('scrolling');
						_setTopHead.css({
							top: _scrollDOMTop
						});
					}
				return true;
			});
		}
	}; /*
	    * Scroll: 滚动轴
	    * */
	exports.default = Scroll;

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _jTool = __webpack_require__(1);

	var _jTool2 = _interopRequireDefault(_jTool);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Settings = {
		// 是否使用默认的table样式
		useDefaultStyle: true,

		// 拖拽
		supportDrag: true, // 是否支持拖拽功能
		dragBefore: _jTool2.default.noop, // 拖拽前事件
		dragAfter: _jTool2.default.noop, // 拖拽后事件

		// 宽度调整
		supportAdjust: true, // 是否支持宽度调整功能
		adjustBefore: _jTool2.default.noop, // 宽度调整前事件
		adjustAfter: _jTool2.default.noop, // 宽度调整后事件

		// 是否支持表头提示信息[需在地应的TH上增加属性remind]
		supportRemind: false,

		// 是否支持配置列表功能[操作列是否可见]
		supportConfig: true,

		// 宽度配置
		width: '100%',

		// 高度配置, 可配置的最小宽度为300px
		height: '300px',

		// 动画效果时长
		animateTime: 300,

		// 是否禁用本地缓存
		disableCache: false,

		// 是否自动加载CSS文件
		// autoLoadCss: false,
		// 排序 sort
		supportSorting: false, //排序：是否支持排序功能
		isCombSorting: false, //是否为组合排序[只有在支持排序的情况下生效
		sortKey: 'sort_', //排序字段前缀, 示例: 列名='date', sortKey='sort_', 排序参数则为sort_date
		sortData: {}, //存储排序数据[不对外公开参数]
		sortUpText: 'ASC', //排序：升序标识[该标识将会传至数据接口]
		sortDownText: 'DESC', //排序：降序标识[该标识将会传至数据接口]
		sortingBefore: _jTool2.default.noop, //排序事件发生前
		sortingAfter: _jTool2.default.noop, //排序事件发生后

		// 分页 ajaxPag
		supportAjaxPage: false, //是否支持配置列表ajxa分页
		sizeData: [10, 20, 30, 50, 100], //用于配置列表每页展示条数选择框
		pageSize: 20, //每页显示条数，如果使用缓存且存在缓存数据，那么该值将失效
		pageData: {}, //存储分页数据[不对外公开参数]
		query: {}, //其它需要带入的参数，该参数中设置的数据会在分页或排序事件中以参数形式传递
		pagingBefore: _jTool2.default.noop, //分页事件发生前
		pagingAfter: _jTool2.default.noop, //分页事件发生后

		//序目录
		supportAutoOrder: true, //是否支持自动序目录

		//全选项
		supportCheckbox: true, //是否支持选择与反选

		//国际化
		i18n: 'zh-cn', //选择使用哪种语言，暂时支持[zh-cn:简体中文，en-us:美式英语] 默认zh-cn

		//用于支持通过数据渲染DOM
		columnData: [], //表格列数据配置项
		gridManagerName: '', //表格grid-manager所对应的值[可在html中配置]
		ajax_url: '', //获取表格数据地址，配置该参数后，将会动态获取数据
		ajax_type: 'GET', //ajax请求类型['GET', 'POST']默认GET
		ajax_headers: {}, //ajax请求头信息
		ajax_beforeSend: _jTool2.default.noop, //ajax请求之前,与jTool的beforeSend使用方法相同
		ajax_success: _jTool2.default.noop, //ajax成功后,与jTool的success使用方法相同
		ajax_complete: _jTool2.default.noop, //ajax完成后,与jTool的complete使用方法相同
		ajax_error: _jTool2.default.noop, //ajax失败后,与jTool的error使用方法相同
		ajax_data: undefined, //ajax静态数据,配置后ajax_url将无效
		dataKey: 'data', //ajax请求返回的列表数据key键值,默认为data
		totalsKey: 'totals', //ajax请求返回的数据总条数key键值,默认为totals
		//数据导出
		supportExport: true //支持导出表格数据
	}; /**
	    * Settings: 配置项
	    */
	exports.default = Settings;

/***/ }
/******/ ]);