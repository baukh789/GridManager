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
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *  GridManager: 入口
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * */


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

	var _Config = __webpack_require__(11);

	var _Config2 = _interopRequireDefault(_Config);

	var _Checkbox = __webpack_require__(12);

	var _Checkbox2 = _interopRequireDefault(_Checkbox);

	var _Drag = __webpack_require__(16);

	var _Drag2 = _interopRequireDefault(_Drag);

	var _Export = __webpack_require__(10);

	var _Export2 = _interopRequireDefault(_Export);

	var _I18n = __webpack_require__(9);

	var _I18n2 = _interopRequireDefault(_I18n);

	var _Menu = __webpack_require__(8);

	var _Menu2 = _interopRequireDefault(_Menu);

	var _Order = __webpack_require__(13);

	var _Order2 = _interopRequireDefault(_Order);

	var _Remind = __webpack_require__(14);

	var _Remind2 = _interopRequireDefault(_Remind);

	var _Scroll = __webpack_require__(17);

	var _Scroll2 = _interopRequireDefault(_Scroll);

	var _Sort = __webpack_require__(15);

	var _Sort2 = _interopRequireDefault(_Sort);

	var _Settings = __webpack_require__(18);

	var _Hover = __webpack_require__(19);

	var _Publish = __webpack_require__(20);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var GridManager = function () {
		function GridManager() {
			_classCallCheck(this, GridManager);

			this.version = '2.3.14';
			this.extentGridManager();
		}
		/*
	  * [对外公开方法]
	  * @初始化方法
	  * $.jToolObj: table [jTool object]
	  * $.arg: 参数
	  * $.callback:回调
	  * */


		_createClass(GridManager, [{
			key: 'init',
			value: function init(jToolObj, arg, callback) {
				var _this = this;
				if (typeof arg.gridManagerName !== 'string' || arg.gridManagerName.trim() === '') {
					arg.gridManagerName = jToolObj.attr('grid-manager'); //存储gridManagerName值
				}
				// 配置参数
				var _settings = _jTool2.default.extend(true, {}, _Settings.Settings);
				_settings.textConfig = new _Settings.TextSettings();
				_jTool2.default.extend(true, _settings, arg);
				_this.updateSettings(jToolObj, _settings);

				_jTool2.default.extend(true, this, _settings);

				//通过版本较验 清理缓存
				_this.cleanTableCacheForVersion(jToolObj, this.version);
				if (_this.gridManagerName.trim() === '') {
					_this.outLog('请在html标签中为属性[grid-manager]赋值或在配置项中配置gridManagerName', 'error');
					return false;
				}

				// 验证当前表格是否已经渲染
				if (jToolObj.hasClass('GridManager-ready') || jToolObj.hasClass('GridManager-loading')) {
					_this.outLog('渲染失败：可能该表格已经渲染或正在渲染', 'error');
					return false;
				}

				//根据本地缓存配置每页显示条数
				if (_this.supportAjaxPage) {
					_this.configPageForCache(jToolObj);
				}

				//增加渲染中标注
				jToolObj.addClass('GridManager-loading');

				// 初始化表格
				_this.initTable(jToolObj);
				//如果初始获取缓存失败，在渲染完成后首先存储一次数据
				if (typeof jToolObj.attr('grid-manager-cache-error') !== 'undefined') {
					window.setTimeout(function () {
						_this.saveUserMemory(jToolObj, true);
						jToolObj.removeAttr('grid-manager-cache-error');
					}, 1000);
				}

				//启用回调
				typeof callback == 'function' ? callback(_this.query) : '';
				return jToolObj;
			}
			/*
	   @初始化列表
	   $.table: table[jTool object]
	   */

		}, {
			key: 'initTable',
			value: function initTable(table) {
				var _this = this;
				//渲染HTML，嵌入所需的事件源DOM
				_Core2.default.createDOM(table);

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

		}, {
			key: 'extentGridManager',
			value: function extentGridManager() {
				// GM导入功能: 配置项
				_jTool2.default.extend(true, this, _Settings.Settings);

				// GM导入功能: 基本
				_jTool2.default.extend(this, _Base2.default);

				// GM导入功能: 核心
				_jTool2.default.extend(this, _Core2.default);

				// GM导入功能: 鼠标
				_jTool2.default.extend(this, _Hover.Hover);

				// GM导入功能: 选择
				_jTool2.default.extend(this, _Checkbox2.default);

				// GM导入功能: 缓存
				_jTool2.default.extend(this, _Cache2.default);

				// GM导入功能: 宽度调整
				_jTool2.default.extend(this, _Adjust2.default);

				// GM导入功能: 分页
				_jTool2.default.extend(this, _AjaxPage2.default);

				// GM导入功能: 配置列显示隐藏
				_jTool2.default.extend(this, _Config2.default);

				// GM导入功能: 拖拽
				_jTool2.default.extend(this, _Drag2.default);

				// GM导入功能: 排序
				_jTool2.default.extend(this, _Sort2.default);

				// GM导入功能: 导出数据
				_jTool2.default.extend(this, _Export2.default);

				// GM导入功能: 国际化
				_jTool2.default.extend(this, _I18n2.default);

				// GM导入功能: 右键菜单
				_jTool2.default.extend(this, _Menu2.default);

				// GM导入功能: 序号
				_jTool2.default.extend(this, _Order2.default);

				// GM导入功能: 表头提示
				_jTool2.default.extend(this, _Remind2.default);

				// GM导入功能: 表头吸顶
				_jTool2.default.extend(this, _Scroll2.default);

				// GM导入功能: 公开方法
				_jTool2.default.extend(this, _Publish.PublishMethod);
			}
		}]);

		return GridManager;
	}();

	/*
	*  捆绑至选择器对象
	* */


	(function ($) {
		Element.prototype.GM = Element.prototype.GridManager = function () {
			var $table = $(this);
			// 特殊情况处理：单组tr进行操作，如resetTd()方法
			if (this.nodeName === 'TR') {
				return;
			}
			var name = void 0; // 方法名
			var settings = void 0; // 参数
			var callback = void 0; // 回调函数
			var condition = void 0; // 条件
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

			if (_Publish.publishMethodArray.indexOf(name) === -1) {
				throw new Error('GridManager Error:方法调用错误，请确定方法名[' + name + ']是否正确');
				return false;
			}
			var gmObj = void 0;
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

	/*
	* 兼容jquery
	* */
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

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	__webpack_require__(2);

	var $ = jTool; /**
	                * jTool: export jTool
	                */
	exports.default = $;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	var require;var require;!function t(e,n,o){function i(s,u){if(!n[s]){if(!e[s]){var a="function"==typeof require&&require;if(!u&&a)return require(s,!0);if(r)return r(s,!0);var c=new Error("Cannot find module '"+s+"'");throw c.code="MODULE_NOT_FOUND",c}var l=n[s]={exports:{}};e[s][0].call(l.exports,function(t){var n=e[s][1][t];return i(n?n:t)},l,l.exports,t,e,n,o)}return n[s].exports}for(var r="function"==typeof require&&require,s=0;s<o.length;s++)i(o[s]);return i}({1:[function(t,e){var n=t("./utilities"),o=t("../src/Css"),i={show:function(){return n.each(this.DOMList,function(t,e){var n="",o=["SPAN","A","FONT","I"];if(-1!==e.nodeName.indexOf(o))return e.style.display="inline-block",this;switch(e.nodeName){case"TABLE":n="table";break;case"THEAD":n="table-header-group";break;case"TBODY":n="table-row-group";break;case"TR":n="table-row";break;case"TH":n="table-cell";break;case"TD":n="table-cell";break;default:n="block"}e.style.display=n}),this},hide:function(){return n.each(this.DOMList,function(t,e){e.style.display="none"}),this},animate:function(t,e,i){var r=this,s="",u="",a=r.DOMList[0];if(t){"undefined"===n.type(i)&&"function"===n.type(e)&&(i=e,e=0),"undefined"===n.type(i)&&(i=n.noop),"undefined"===n.type(e)&&(e=0),n.each(t,function(t,e){t=n.toHyphen(t),s+=t+":"+n.getStyle(a,t)+";",u+=t+":"+e+";"});var c="@keyframes jToolAnimate {from {"+s+"}to {"+u+"}}",l=document.createElement("style");l.className="jTool-animate-style",l.type="text/css",document.head.appendChild(l),l.textContent=l.textContent+c,a.style.animation="jToolAnimate "+e/1e3+"s ease-in-out forwards",window.setTimeout(function(){o.css.call(r,t),a.style.animation="",l.remove(),i()},e)}}};e.exports=i},{"../src/Css":3,"./utilities":13}],2:[function(t,e){var n=t("./utilities"),o={addClass:function(t){return this.changeClass(t,"add")},removeClass:function(t){return this.changeClass(t,"remove")},toggleClass:function(t){return this.changeClass(t,"toggle")},hasClass:function(t){return[].some.call(this.DOMList,function(e){return e.classList.contains(t)})},parseClassName:function(t){return t.indexOf(" ")?t.split(" "):[t]},changeClass:function(t,e){var o=this.parseClassName(t);return n.each(this.DOMList,function(t,i){n.each(o,function(t,n){i.classList[e](n)})}),this}};e.exports=o},{"./utilities":13}],3:[function(t,e){var n=t("./utilities"),o={css:function(t,e){function o(t,e){"number"===n.type(e)&&(e=e.toString()),-1!==r.indexOf(t)&&-1===e.indexOf("px")&&(e+="px"),n.each(i.DOMList,function(n,o){o.style[t]=e})}var i=this,r=["width","height","min-width","max-width","min-height","min-height","top","left","right","bottom","padding-top","padding-right","padding-bottom","padding-left","margin-top","margin-right","margin-bottom","margin-left","border-width","border-top-width","border-left-width","border-right-width","border-bottom-width"];if("string"===n.type(t)&&!e&&0!==e)return-1!==r.indexOf(t)?parseInt(n.getStyle(this.DOMList[0],t),10):n.getStyle(this.DOMList[0],t);if("object"===n.type(t)){var s=t;for(var u in s)o(u,s[u])}else o(t,e);return this},width:function(t){return this.css("width",t)},height:function(t){return this.css("height",t)}};e.exports=o},{"./utilities":13}],4:[function(t,e){var n=t("./utilities"),o={dataKey:"jTool"+n.version,data:function(t,e){var o=this,i={};if("undefined"==typeof t&&"undefined"==typeof e)return o.DOMList[0][o.dataKey];if("undefined"!=typeof e){var r=n.type(e);return("string"===r||"number"===r)&&o.attr(t,e),n.each(o.DOMList,function(n,r){i=r[o.dataKey]||{},i[t]=e,r[o.dataKey]=i}),this}return i=o.DOMList[0][o.dataKey]||{},this.transformValue(i[t]||o.attr(t))},removeData:function(t){var e,o=this;"undefined"!=typeof t&&(n.each(o.DOMList,function(n,i){e=i[o.dataKey]||{},delete e[t]}),o.removeAttr(t))},attr:function(t,e){return"undefined"==typeof t&&"undefined"==typeof e?"":"undefined"!=typeof e?(n.each(this.DOMList,function(n,o){o.setAttribute(t,e)}),this):this.transformValue(this.DOMList[0].getAttribute(t))},removeAttr:function(t){"undefined"!=typeof t&&n.each(this.DOMList,function(e,n){n.removeAttribute(t)})},prop:function(t,e){return"undefined"==typeof t&&"undefined"==typeof e?"":"undefined"!=typeof e?(n.each(this.DOMList,function(n,o){o[t]=e}),this):this.transformValue(this.DOMList[0][t])},removeProp:function(t){"undefined"!=typeof t&&n.each(this.DOMList,function(e,n){delete n[t]})},val:function(t){return this.prop("value",t)||""},transformValue:function(t){return"null"===n.type(t)&&(t=void 0),t}};e.exports=o},{"./utilities":13}],5:[function(t,e){var n=t("./utilities"),o=t("./Sizzle"),i={append:function(t){return this.html(t,"append")},prepend:function(t){return this.html(t,"prepend")},before:function(t){t.jTool&&(t=t.DOMList[0]);var e=this.DOMList[0],n=e.parentNode;return n.insertBefore(t,e),this},after:function(t){t.jTool&&(t=t.DOMList[0]);var e=this.DOMList[0],n=e.parentNode;n.lastChild==e?n.appendChild(t):n.insertBefore(t,e.nextSibling)},text:function(t){return"undefined"!=typeof t?(n.each(this.DOMList,function(e,n){n.textContent=t}),this):this.DOMList[0].textContent},html:function(t,e){if("undefined"==typeof t&&"undefined"==typeof e)return this.DOMList[0].innerHTML;var o=this,i=n.type(t);t.jTool?t=t.DOMList:"string"===i?t=n.createDOM(t||""):"element"===i&&(t=[t]);var r;return n.each(o.DOMList,function(o,i){e?"prepend"===e&&(r=i.firstChild):i.innerHTML="",n.each(t,function(t,e){e=e.cloneNode(!0),e.nodeType||(e=document.createTextNode(e)),r?i.insertBefore(e,r):i.appendChild(e),i.normalize()})}),this},wrap:function(t){var e;return n.each(this.DOMList,function(n,i){e=i.parentNode;var r=new o(t,i.ownerDocument).get(0);e.insertBefore(r,i),r.querySelector(":empty").appendChild(i)}),this},closest:function(t){function e(){return n&&0!==i.length&&1===n.nodeType?void(-1===[].indexOf.call(i,n)&&(n=n.parentNode,e())):void(n=null)}var n=this.DOMList[0].parentNode;if("undefined"==typeof t)return new o(n);var i=document.querySelectorAll(t);return e(),new o(n)},parent:function(){return this.closest()},clone:function(t){return new o(this.DOMList[0].cloneNode(t||!1))},remove:function(){n.each(this.DOMList,function(t,e){e.remove()})}};e.exports=i},{"./Sizzle":9,"./utilities":13}],6:[function(t,e){var n=t("./Sizzle"),o={get:function(t){return this.DOMList[t]},eq:function(t){return new n(this.DOMList[t])},find:function(t){return new n(t,this)},index:function(t){var e=this.DOMList[0];return t?t.jTool&&(t=t.DOMList):t=e.parentNode.childNodes,t?[].indexOf.call(t,e):-1}};e.exports=o},{"./Sizzle":9}],7:[function(t,e){var n=t("./utilities"),o={on:function(t,e,n,o){return this.addEvent(this.getEventObject(t,e,n,o))},off:function(t,e){return this.removeEvent(this.getEventObject(t,e))},bind:function(t,e,n){return this.on(t,void 0,e,n)},unbind:function(t){return this.removeEvent(this.getEventObject(t))},trigger:function(t){return n.each(this.DOMList,function(e,o){try{if(o.jToolEvent&&o.jToolEvent[t].length>0){var i=new Event(t);o.dispatchEvent(i)}else"click"!==t?n.error("预绑定的事件只有click事件可以通过trigger进行调用"):"click"===t&&o[t]()}catch(r){n.error("事件:["+t+"]未能正确执行, 请确定方法已经绑定成功")}}),this},getEventObject:function(t,e,o,i){if("function"==typeof e&&(i=o||!1,o=e,e=void 0),!t)return n.error("事件绑定失败,原因: 参数中缺失事件类型"),this;if(e&&"element"===n.type(this.DOMList[0])||(e=""),""!==e){var r=o;o=function(t){for(var n=t.target;n!==this;){if(-1!==[].indexOf.call(this.querySelectorAll(e),n)){r.apply(n,arguments);break}n=n.parentNode}}}var s,u,a=t.split(" "),c=[];return n.each(a,function(t,r){return""===r.trim()?!0:(s=r.split("."),u={eventName:r+e,type:s[0],querySelector:e,callback:o||n.noop,useCapture:i||!1,nameScope:s[1]||void 0},void c.push(u))}),c},addEvent:function(t){var e=this;return n.each(t,function(t,o){n.each(e.DOMList,function(t,e){e.jToolEvent=e.jToolEvent||{},e.jToolEvent[o.eventName]=e.jToolEvent[o.eventName]||[],e.jToolEvent[o.eventName].push(o),e.addEventListener(o.type,o.callback,o.useCapture)})}),e},removeEvent:function(t){var e,o=this;return n.each(t,function(t,i){n.each(o.DOMList,function(t,o){o.jToolEvent&&(e=o.jToolEvent[i.eventName],e&&(n.each(e,function(t,e){o.removeEventListener(e.type,e.callback)}),o.jToolEvent[i.eventName]=void 0))})}),o}};e.exports=o},{"./utilities":13}],8:[function(t,e){var n=t("./utilities"),o={offset:function(){var t={top:0,left:0},e=this.DOMList[0];if(!e.getClientRects().length)return t;if("none"===n.getStyle(e,"display"))return t;t=e.getBoundingClientRect();var o=e.ownerDocument.documentElement;return{top:t.top+window.pageYOffset-o.clientTop,left:t.left+window.pageXOffset-o.clientLeft}},scrollTop:function(t){return this.scrollFN(t,"top")},scrollLeft:function(t){return this.scrollFN(t,"left")},scrollFN:function(t,e){var n=this.DOMList[0];return t||0===t?(this.setScrollFN(n,e,t),this):this.getScrollFN(n,e)},getScrollFN:function(t,e){return n.isWindow(t)?"top"===e?t.pageYOffset:t.pageXOffset:9===t.nodeType?"top"===e?t.body.scrollTop:t.body.scrollLeft:1===t.nodeType?"top"===e?t.scrollTop:t.scrollLeft:void 0},setScrollFN:function(t,e,o){return n.isWindow(t)?"top"===e?t.document.body.scrollTop=o:t.document.body.scrollLeft=o:9===t.nodeType?"top"===e?t.body.scrollTop=o:t.body.scrollLeft=o:1===t.nodeType?"top"===e?t.scrollTop=o:t.scrollLeft=o:void 0}};e.exports=o},{"./utilities":13}],9:[function(t,e){var n=t("./utilities"),o=function(t,e){var o;return t?n.isWindow(t)?(o=[t],e=void 0):t===document?(o=[document],e=void 0):t instanceof HTMLElement?(o=[t],e=void 0):t instanceof NodeList||t instanceof Array?(o=t,e=void 0):t.jTool?(o=t.DOMList,e=void 0):/<.+>/.test(t)?(o=n.createDOM(t),e=void 0):(e?e="string"==typeof e?document.querySelectorAll(e):e instanceof HTMLElement?[e]:e instanceof NodeList?e:e.jTool?e.DOMList:void 0:o=document.querySelectorAll(t),e&&(o=[],n.each(e,function(e,i){n.each(i.querySelectorAll(t),function(t,e){e&&o.push(e)})}))):t=null,o&&0!==o.length||(o=void 0),this.jTool=!0,this.DOMList=o,this.length=this.DOMList?this.DOMList.length:0,this.querySelector=t,this};e.exports=o},{"./utilities":13}],10:[function(t,e){function n(t){var e={url:null,type:"GET",data:null,headers:{},async:!0,beforeSend:s.noop,complete:s.noop,success:s.noop,error:s.noop};if(t=r(e,t),!t.url)return void s.error("jTool ajax: url不能为空");var n=new XMLHttpRequest,o="";"object"===s.type(t.data)?s.each(t.data,function(t,e){""!==o&&(o+="&"),o+=t+"="+e}):o=t.data,"GET"===t.type.toUpperCase()&&o&&(t.url=t.url+(-1===t.url.indexOf("?")?"?":"&")+o,o=null),n.open(t.type,t.url,t.async);for(var i in t.headers)n.setRequestHeader(i,t.headers[i]);t.beforeSend(n),n.onload=function(){t.complete(n,n.status)},n.onreadystatechange=function(){4===n.readyState&&(n.status>=200&&n.status<300||304===n.status?t.success(n.response,n.status):t.error(n,n.status,n.statusText))},n.send(o)}function o(t,e,o){n({url:t,type:"POST",data:e,success:o})}function i(t,e,o){n({url:t,type:"GET",data:e,success:o})}var r=t("./extend"),s=t("./utilities");e.exports={ajax:n,post:o,get:i}},{"./extend":11,"./utilities":13}],11:[function(t,e){function n(){function t(e,i){for(var r in e)e.hasOwnProperty(r)&&(n&&"object"===o.type(e[r])?("object"!==o.type(i[r])&&(i[r]={}),t(e[r],i[r])):i[r]=e[r])}if(0===arguments.length)return{};var e,n=!1,i=1,r=arguments[0];for(1===arguments.length&&"object"==typeof arguments[0]?(r=this,i=0):2===arguments.length&&"boolean"==typeof arguments[0]?(n=arguments[0],r=this,i=1):arguments.length>2&&"boolean"==typeof arguments[0]&&(n=arguments[0],r=arguments[1]||{},i=2);i<arguments.length;i++)e=arguments[i]||{},t(e,r);return r}var o=t("./utilities");e.exports=n},{"./utilities":13}],12:[function(t,e){var n=t("./Sizzle"),o=t("./extend"),i=t("./utilities"),r=t("./ajax"),s=t("./Event"),u=t("./Css"),a=t("./Class"),c=t("./Document"),l=t("./Offset"),d=t("./Element"),f=t("./Animate"),p=t("./Data"),h=function(t,e){return new n(t,e)};n.prototype=h.prototype={},h.extend=h.prototype.extend=o,h.extend(i),h.extend(r),h.prototype.extend(s),h.prototype.extend(u),h.prototype.extend(a),h.prototype.extend(c),h.prototype.extend(l),h.prototype.extend(d),h.prototype.extend(f),h.prototype.extend(p),"undefined"!=typeof window.$&&(window._$=$),window.jTool=window.$=h,e.exports=h},{"./Animate":1,"./Class":2,"./Css":3,"./Data":4,"./Document":5,"./Element":6,"./Event":7,"./Offset":8,"./Sizzle":9,"./ajax":10,"./extend":11,"./utilities":13}],13:[function(t,e){function n(){return-1==navigator.userAgent.indexOf("Chrome")?!1:!0}function o(t){return null!==t&&t===t.window}function i(t){return Array.isArray(t)}function r(t){return v[y.call(t)]||(t instanceof Element?"element":"")}function s(){}function u(t,e){t&&t.jTool&&(t=t.DOMList);var n=r(t);if("array"===n||"nodeList"===n||"arguments"===n)[].every.call(t,function(t,n){o(t)?s():t.jTool?t=t.get(0):s();return e.call(t,n,t)===!1?!1:!0});else if("object"===n)for(var i in t)if(e.call(t[i],i,t[i])===!1)break}function a(t){return t.trim()}function c(t){throw new Error("[jTool Error: "+t+"]")}function l(t){var e=!0;for(var n in t)t.hasOwnProperty(n)&&(e=!1);return e}function d(t,e){return e?window.getComputedStyle(t)[e]:window.getComputedStyle(t)}function f(t){var e=["px","vem","em","%"],n="";return"number"==typeof t?n:(u(e,function(e,o){return-1!==t.indexOf(o)?(n=o,!1):void 0}),n)}function p(t){return t.replace(/-\w/g,function(t){return t.split("-")[1].toUpperCase()})}function h(t){return t.replace(/([A-Z])/g,"-$1").toLowerCase()}function m(t){var e=document.querySelector("#jTool-create-dom");if(!e||0===e.length){var n=document.createElement("table");n.id="jTool-create-dom",n.style.display="none",document.body.appendChild(n),e=document.querySelector("#jTool-create-dom")}e.innerHTML=t||"";var o=e.childNodes;return 1!=o.length||/<tbody|<TBODY/.test(t)||"TBODY"!==o[0].nodeName||(o=o[0].childNodes),1!=o.length||/<thead|<THEAD/.test(t)||"THEAD"!==o[0].nodeName||(o=o[0].childNodes),1!=o.length||/<tr|<TR/.test(t)||"TR"!==o[0].nodeName||(o=o[0].childNodes),1!=o.length||/<td|<TD/.test(t)||"TD"!==o[0].nodeName||(o=o[0].childNodes),1!=o.length||/<th|<TH/.test(t)||"TH"!==o[0].nodeName||(o=o[0].childNodes),e.remove(),o}var y=Object.prototype.toString,v={"[object String]":"string","[object Boolean]":"boolean","[object Undefined]":"undefined","[object Number]":"number","[object Object]":"object","[object Error]":"error","[object Function]":"function","[object Date]":"date","[object Array]":"array","[object RegExp]":"regexp","[object Null]":"null","[object NodeList]":"nodeList","[object Arguments]":"arguments","[object Window]":"window","[object HTMLDocument]":"document"};e.exports={isWindow:o,isChrome:n,isArray:i,noop:s,type:r,toHyphen:h,toHump:p,getStyleUnit:f,getStyle:d,isEmptyObject:l,trim:a,error:c,each:u,createDOM:m,version:"1.2.21"}},{}]},{},[12]);

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

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
			return '<span class="adjust-action"></span>';
		}
		/*
	  @绑定宽度调整事件
	  $table: table [jTool object]
	  */
		, bindAdjustEvent: function bindAdjustEvent($table) {
			// 监听鼠标调整列宽度
			$table.off('mousedown', '.adjust-action');
			$table.on('mousedown', '.adjust-action', function (event) {
				var _dragAction = (0, _jTool2.default)(this);
				// 事件源所在的th
				var _th = _dragAction.closest('th');

				// 事件源所在的tr
				var _tr = _th.parent();

				// 事件源所在的table
				var _table = _tr.closest('table');

				// 事件源所在的DIV

				var tableDiv = _table.closest('.table-div');

				// 当前存储属性
				var settings = _Cache2.default.getSettings(_table);

				// 事件源同层级下的所有th
				var _allTh = _tr.find('th[th-visible="visible"]');

				// 事件源下一个可视th
				var _nextTh = _allTh.eq(_th.index(_allTh) + 1);

				// 存储与事件源同列的所有td
				var _td = _Base2.default.getColTd(_th);

				// 宽度调整触发回调事件
				settings.adjustBefore(event);

				//增加宽度调整中样式
				_th.addClass('adjust-selected');
				_td.addClass('adjust-selected');

				// 更新界面交互标识
				_Base2.default.updateInteractive(_table, 'Adjust');

				//绑定鼠标拖动事件
				var _thWidth = void 0,
				    _NextWidth = void 0;
				var _thMinWidth = _Base2.default.getTextWidth(_th),
				    _NextThMinWidth = _Base2.default.getTextWidth(_nextTh);
				_table.unbind('mousemove');
				_table.bind('mousemove', function (event) {
					_table.addClass('no-select-text');
					_thWidth = event.clientX - _th.offset().left;
					_thWidth = Math.ceil(_thWidth);
					_NextWidth = _nextTh.width() + _th.width() - _thWidth;
					_NextWidth = Math.ceil(_NextWidth);
					// 限定最小值
					// TODO @baukh20170430: 由原来限定最小值调整为达到最小值后不再执行后续操作
					if (_thWidth < _thMinWidth) {
						// _thWidth = _thMinWidth;
						return;
					}
					// TODO 这里需要确认,当向后调整至最小时,该如何操作?
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

					// 当前宽度调整的事件原为表头置顶的thead th
					// 修改与置顶thead 对应的 thead
					if (_th.closest('.set-top').length === 1) {
						(0, _jTool2.default)('thead[grid-manager-thead] th[th-name="' + _th.attr('th-name') + '"]', _table).width(_thWidth);
						(0, _jTool2.default)('thead[grid-manager-thead] th[th-name="' + _nextTh.attr('th-name') + '"]', _table).width(_NextWidth);
						(0, _jTool2.default)('thead[grid-manager-mock-thead]', _table).width((0, _jTool2.default)('thead[grid-manager-thead]', _table).width());
					}
				});

				// 绑定鼠标放开、移出事件
				_table.unbind('mouseup mouseleave');
				_table.bind('mouseup mouseleave', function (event) {
					var settings = _Cache2.default.getSettings($table);
					_table.unbind('mousemove mouseleave');
					// 存储用户记忆
					_Cache2.default.saveUserMemory(_table);
					if (_th.hasClass('adjust-selected')) {
						// 其它操作也在table以该事件进行绑定,所以通过class进行区别
						// 宽度调整成功回调事件
						settings.adjustAfter(event);
					}
					_th.removeClass('adjust-selected');
					_td.removeClass('adjust-selected');
					_table.removeClass('no-select-text');
					// 更新界面交互标识
					_Base2.default.updateInteractive(_table);
				});
				return false;
			});
			return this;
		}
		/*
	  @通过缓存配置成功后, 重置宽度调整事件源dom
	  用于禁用最后一列调整宽度事件
	  $.table: table[jTool Object]
	  */
		, resetAdjust: function resetAdjust($table) {
			if (!$table || $table.length == 0) {
				return false;
			}
			var _thList = (0, _jTool2.default)('thead [th-visible="visible"]', $table),
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

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

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
	 * @渲染表格使用的json数据
	 * 通过每个tr上的cache-key进行获取
	 * */
	/*
	* @Cache: 本地缓存
	* 缓存分为三部分:
	* 1.gridData: 渲染表格时所使用的json数据 [存储在GM实例]
	* 2.coreData: 核心缓存数据 [存储在DOM上]
	* 3.userMemory: 用户记忆 [存储在localStorage]
	* */
	var GridData = function GridData() {
		this.responseData = {};
		/*
	  * @获取当前行渲染时使用的数据
	  * $table: 当前操作的grid,由插件自动传入
	  * target: 将要获取数据所对应的tr[Element or NodeList]
	  * */
		this.__getRowData = function ($table, target) {
			var gmName = $table.attr('grid-manager');
			if (!gmName) {
				return;
			}
			if (!this.responseData[gmName]) {
				return;
			}
			// target type = Element 元素时, 返回单条数据对象;
			if (_jTool2.default.type(target) === 'element') {
				return this.responseData[gmName][target.getAttribute('cache-key')];
			}
			// target type =  NodeList 类型时, 返回数组
			else if (_jTool2.default.type(target) === 'nodeList') {
					var _this = this;
					var rodData = [];
					_jTool2.default.each(target, function (i, v) {
						rodData.push(_this.responseData[gmName][v.getAttribute('cache-key')]);
					});
					return rodData;
				}
		};
		/*
	  * 存储行数据
	  * */
		this.setRowData = function (gmName, key, value) {
			if (!this.responseData[gmName]) {
				this.responseData[gmName] = {};
			}
			this.responseData[gmName][key] = value;
		};
	};
	/*
	* 用户记忆
	* */
	// TODO 需要处理项: 将所有的记忆信息放至一个字段, 不再使用一个表一个字段.
	var UserMemory = function UserMemory() {
		/*
	  * 删除用户记忆
	  * $table: table [jTool Object]
	  * */
		this.delUserMemory = function ($table) {
			// 如果未指定删除的table, 则全部清除
			if (!$table || $table.length === 0) {
				window.localStorage.removeItem('GridManagerMemory');
				return true;
			}
			var GridManagerMemory = window.localStorage.getItem('GridManagerMemory');
			if (!GridManagerMemory) {
				return false;
			}
			GridManagerMemory = JSON.parse(GridManagerMemory);
			// 指定删除的table, 则定点清除
			var _key = this.getMemoryKey($table);
			delete GridManagerMemory[_key];
			// 清除后, 重新存储
			window.localStorage.setItem('GridManagerMemory', JSON.stringify(GridManagerMemory));
			return true;
		};
		/*
	  * 获取表格的用户记忆标识码
	  * $table: table jTool
	  * */
		this.getMemoryKey = function ($table) {
			var settings = Cache.getSettings($table);
			// 验证table是否有效
			if (!$table || $table.length === 0) {
				_Base2.default.outLog('getUserMemory:无效的table', 'error');
				return false;
			}
			//当前表是否禁用缓存  被禁用原因是用户缺失了必要的参数
			var noCache = $table.attr('no-cache');
			if (noCache && noCache == 'true') {
				_Base2.default.outLog('缓存已被禁用：当前表缺失必要html标签属性[grid-manager或th-name]', 'info');
				return false;
			}
			if (!window.localStorage) {
				_Base2.default.outLog('当前浏览器不支持：localStorage，缓存功能失效', 'info');
				return false;
			}
			return window.location.pathname + window.location.hash + '-' + settings.gridManagerName;
		};
		/*
	  * @获取用户记忆
	  * $table:table
	  * 成功则返回本地存储数据,失败则返回空对象
	  * */
		this.getUserMemory = function ($table) {
			if (!$table || $table.length === 0) {
				return {};
			}
			var _key = this.getMemoryKey($table);
			if (!_key) {
				return {};
			}
			var GridManagerMemory = window.localStorage.getItem('GridManagerMemory');
			//如无数据，增加属性标识：grid-manager-cache-error
			if (!GridManagerMemory || GridManagerMemory === '{}') {
				$table.attr('grid-manager-cache-error', 'error');
				return {};
			}
			GridManagerMemory = JSON.parse(GridManagerMemory);
			var _data = {
				key: _key,
				cache: JSON.parse(GridManagerMemory[_key] || '{}')
			};
			return _data;
		};
		/*
	  * @存储用户记忆
	  * $table:table [jTool object]
	  * isInit: 是否为初始存储缓存[用于处理宽度在特定情况下发生异常]
	  */
		// TODO @baukh20170414: 参数isInit 已经废弃, 之后可以删除
		this.saveUserMemory = function (table, isInit) {
			var Settings = Cache.getSettings(table);
			var _this = this;
			//当前为禁用缓存模式，直接跳出
			if (Settings.disableCache) {
				return false;
			}
			var _table = (0, _jTool2.default)(table);
			//当前表是否禁用缓存  被禁用原因是用户缺失了必要的参数
			var noCache = _table.attr('no-cache');
			if (!_table || _table.length == 0) {
				_Base2.default.outLog('saveUserMemory:无效的table', 'error');
				return false;
			}
			if (noCache && noCache == 'true') {
				_Base2.default.outLog('缓存功能已被禁用：当前表缺失必要参数', 'info');
				return false;
			}
			if (!window.localStorage) {
				_Base2.default.outLog('当前浏览器不支持：localStorage，缓存功能失效。', 'error');
				return false;
			}
			var thList = (0, _jTool2.default)('thead[grid-manager-thead] th', _table);
			if (!thList || thList.length == 0) {
				_Base2.default.outLog('saveUserMemory:无效的thList,请检查是否正确配置table,thead,th', 'error');
				return false;
			}

			var _cache = {},
			    _pageCache = {},
			    _thCache = [],
			    _thData = {};

			var $v = void 0;
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
					_thData.th_width = $v.width();
				}
				if (Settings.supportConfig) {
					_thData.isShow = (0, _jTool2.default)('.config-area li[th-name="' + _thData.th_name + '"]', _table.closest('.table-wrap')).find('input[type="checkbox"]').get(0).checked;
				}
				_thCache.push(_thData);
			});
			_cache.th = _thCache;
			//存储分页
			if (Settings.supportAjaxPage) {
				_pageCache.pSize = parseInt((0, _jTool2.default)('select[name="pSizeArea"]', _table.closest('.table-wrap')).val());
				_cache.page = _pageCache;
			}
			var _cacheString = JSON.stringify(_cache);
			var GridManagerMemory = window.localStorage.getItem('GridManagerMemory');
			if (!GridManagerMemory) {
				GridManagerMemory = {};
			} else {
				GridManagerMemory = JSON.parse(GridManagerMemory);
			}
			GridManagerMemory[_this.getMemoryKey(_table)] = _cacheString;
			window.localStorage.setItem('GridManagerMemory', JSON.stringify(GridManagerMemory));
			return _cacheString;
		};
	};
	/*
	*
	* */
	var Cache = {
		/*
	  * 获取配置项
	  * $table:table [jTool object]
	  * */
		getSettings: function getSettings($table) {
			if (!$table || $table.length === 0) {
				return {};
			}
			// 这里返回的是clone对象 而非对象本身
			return _jTool2.default.extend(true, {}, $table.data('settings'));
		}
		/*
	 * 更新配置项
	 * $table:table [jTool object]
	 * */
		, updateSettings: function updateSettings($table, settings) {
			var data = _jTool2.default.extend(true, {}, settings);
			$table.data('settings', data);
		}
		/*
	 *  @验证版本号清除列表缓存
	 *  $table: jTool table
	 *  version: 版本号
	 * */
		, cleanTableCacheForVersion: function cleanTableCacheForVersion($table, version) {
			var cacheVersion = window.localStorage.getItem('GridManagerVersion');
			// 当前为第一次渲染
			if (!cacheVersion) {
				window.localStorage.setItem('GridManagerVersion', version);
			}
			// 版本变更, 清除所有的用户记忆
			if (cacheVersion && cacheVersion !== version) {
				this.cleanTableCache(null, '版本已升级,原全部缓存被自动清除');
				window.localStorage.setItem('GridManagerVersion', version);
			}
		}
		/*
	 * @清除列表缓存
	 * $table: table [jTool object]
	 * cleanText: 清除缓存的原因
	 * */
		, cleanTableCache: function cleanTableCache($table, cleanText) {
			// 不指定table, 清除全部
			if ($table === null) {
				this.delUserMemory();
				_Base2.default.outLog('清除缓存成功,清除原因：' + cleanText, 'info');
				// 指定table, 定点清除
			} else {
				var Settings = this.getSettings($table);
				this.delUserMemory($table);
				_Base2.default.outLog(Settings.gridManagerName + '清除缓存成功,清除原因：' + cleanText, 'info');
			}
		}
		/*
	 * @根据本地缓存thead配置列表: 获取本地缓存, 存储原位置顺序, 根据本地缓存进行配置
	 * $.table: table [jTool object]
	 * */
		, configTheadForCache: function configTheadForCache(table) {
			var Settings = this.getSettings(table);
			var _this = this;
			var _data = _this.getUserMemory(table),
			    //本地缓存的数据
			_domArray = [];
			//验证：当前table 没有缓存数据
			if (!_data || _jTool2.default.isEmptyObject(_data) || !_data.cache || _jTool2.default.isEmptyObject(_data.cache)) {
				return;
			}
			// 列表的缓存数据
			var _cache = _data.cache;
			// th相关 缓存
			var _thCache = _cache.th;
			//验证：缓存数据与当前列表项是否匹配
			var _thNameTmpList = [];
			var _dataAvailable = true;
			// 单一的th
			var _th = void 0;
			// th的缓存json
			var _thJson = void 0;
			//验证：缓存数据与当前列表是否匹配
			if (!_thCache || _thCache.length != (0, _jTool2.default)('thead th', table).length) {
				_this.cleanTableCache(table, '缓存数据与当前列表不匹配');
				return;
			}
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
	  @存储原Th DOM至table data
	  $table: table [jTool object]
	  */
		, setOriginalThDOM: function setOriginalThDOM($table) {
			var _thList = [];
			var _thDOM = (0, _jTool2.default)('thead[grid-manager-thead] th', $table);

			_jTool2.default.each(_thDOM, function (i, v) {
				_thList.push(v.getAttribute('th-name'));
			});
			$table.data('originalThList', _thList);
		}
		/*
	  @获取原Th DOM至table data
	  $table: table [jTool object]
	  */
		, getOriginalThDOM: function getOriginalThDOM($table) {
			var _thArray = [];
			var _thList = $table.data('originalThList');

			_jTool2.default.each(_thList, function (i, v) {
				_thArray.push((0, _jTool2.default)('thead[grid-manager-thead] th[th-name="' + v + '"]', $table).get(0));
			});
			return (0, _jTool2.default)(_thArray);
		}
		/*
	 * @存储对外实例
	 * $table:当前被实例化的table
	 * */
		, setGridManagerToJTool: function setGridManagerToJTool($table) {
			$table.data('gridManager', this); // 调用的地方需要使用call 更改 this指向
		}
		/*
	  @获取gridManager
	  $.table:table [jTool object]
	  */
		, __getGridManager: function __getGridManager($table) {
			if (!$table || $table.length === 0) {
				return {};
			}
			var settings = this.getSettings($table);
			var gridManager = $table.data('gridManager');
			// 会一并被修改 $table.data('gridManager') 指向的 Object
			_jTool2.default.extend(gridManager, settings);
			return gridManager;
		}
	};
	_jTool2.default.extend(Cache, new UserMemory(), new GridData());
	exports.default = Cache;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

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
	  type: 输出分类[info,warn,error]
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
	  * @获取与 th 同列的 td jTool 对象, 该方法的调用者只允许为 Th
	  * $th: jTool th
	  * */
		, getColTd: function getColTd($th) {
			var tableWrap = $th.closest('.table-wrap'),
			    thIndex = $th.index(),
			    trList = (0, _jTool2.default)('tbody tr', tableWrap);
			var tdList = [];
			var _td = null;
			_jTool2.default.each(trList, function (i, v) {
				_td = (0, _jTool2.default)('td', v).get(thIndex);
				if (_td) {
					tdList.push(_td);
				}
			});
			return (0, _jTool2.default)(tdList);
		}
		/*
	 * @初始化列显示\隐藏
	 * */
		, initVisible: function initVisible($table) {
			// 所有的th
			var _thList = (0, _jTool2.default)('thead th', $table);

			// tbody下的tr
			var _trList = (0, _jTool2.default)('tbody tr', $table);
			var _td = null;
			_jTool2.default.each(_thList, function (i, v) {
				v = (0, _jTool2.default)(v);
				_jTool2.default.each(_trList, function (i2, v2) {
					_td = (0, _jTool2.default)('td', v2).eq(v.index());
					_td.attr('td-visible', v.attr('th-visible'));
				});
			});
		}
		/*
	  @设置列是否可见
	  $._thList_	： 即将配置的列所对应的th[jTool object，可以是多个]
	  $._visible_: 是否可见[Boolean]
	  $.cb		: 回调函数
	  */
		, setAreVisible: function setAreVisible(_thList_, _visible_, cb) {
			var _table = void 0,
			    //当前所在的table
			_tableWarp = void 0,
			    //当前所在的容器
			_th = void 0,
			    //当前操作的th
			_trList = void 0,
			    //当前tbody下所有的tr
			_tdList = [],
			    //所对应的td
			_checkLi = void 0,
			    //所对应的显示隐藏所在的li
			_checkbox = void 0; //所对应的显示隐藏事件
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
						// $(v2).show();
						v2.setAttribute('td-visible', 'visible');
					});
					_checkLi.addClass('checked-li');
					_checkbox.prop('checked', true);
				}
				//隐藏
				else {
						_th.attr('th-visible', 'none');
						_jTool2.default.each(_tdList, function (i2, v2) {
							// $(v2).hide();
							v2.setAttribute('td-visible', 'none');
						});
						_checkLi.removeClass('checked-li');
						_checkbox.prop('checked', false);
					}
				typeof cb == 'function' ? cb() : '';
			});
		}

		/*
	  @获取TH宽度
	  @th: th
	  */
		, getTextWidth: function getTextWidth(th) {
			var $th = (0, _jTool2.default)(th);
			var thWarp = (0, _jTool2.default)('.th-wrap', $th); // th下的GridManager包裹容器
			var thText = (0, _jTool2.default)('.th-text', $th); // 文本所在容器

			//文本镜象 用于处理实时获取文本长度
			var tableWrap = $th.closest('.table-wrap');
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
			var thWidth = textDreamland.width() + (thPaddingLeft ? thPaddingLeft : 0) + (thPaddingRight ? thPaddingRight : 0);
			return thWidth;
		}
		/*
	 * 显示加载中动画
	 * @dom
	 * */
		, showLoading: function showLoading(dom, cb) {
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
		/*
	  * 隐藏加载中动画
	  * @dom
	  * */
		hideLoading: function hideLoading(dom, cb) {
			if (!dom || dom.length === 0) {
				return;
			}
			window.setTimeout(function () {
				(0, _jTool2.default)('.load-area', dom).remove();
				typeof cb === 'function' ? cb() : '';
			}, 500);
		}
		/**
	  * 更新当前用户交互状态, 用于优化置顶状态下进行[拖拽, 宽度调整]操作时,页面出现滚动的问题
	  * @param $table
	  * @param interactive: 如果不存在于interactiveList内, 将删除属性[user-interactive]
	     */
		, updateInteractive: function updateInteractive($table, interactive) {
			var interactiveList = ['Adjust', 'Drag'];
			// 事件源所在的容器
			var tableWrap = $table.closest('.table-wrap');
			if (!interactive || interactiveList.indexOf(interactive) === -1) {
				tableWrap.removeAttr('user-interactive');
			} else {
				tableWrap.attr('user-interactive', interactive);
			}
		}
	}; /*
	    * Base: 基础方法
	    * */
	exports.default = Base;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

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

	var _I18n = __webpack_require__(9);

	var _I18n2 = _interopRequireDefault(_I18n);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var AjaxPage = {
		html: function html($table) {
			var html = '<div class="page-toolbar">\n\t\t\t\t\t\t<div class="refresh-action"><i class="iconfont icon-shuaxin"></i></div>\n\t\t\t\t\t\t<div class="goto-page">\n\t\t\t\t\t\t\t' + _I18n2.default.i18nText($table, "goto-first-text") + '\n\t\t\t\t\t\t\t<input type="text" class="gp-input"/>\n\t\t\t\t\t\t\t' + _I18n2.default.i18nText($table, "goto-last-text") + '\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="change-size"><select name="pSizeArea"></select></div>\n\t\t\t\t\t\t<div class="dataTables_info"></div>\n\t\t\t\t\t\t<div class="ajax-page"><ul class="pagination"></ul></div>\n\t\t\t\t\t</div>';
			return html;
		}
		/**
	  * 初始化分页
	  * @param $table：[jTool object]
	  */
		, initAjaxPage: function initAjaxPage($table) {
			var Settings = _Cache2.default.getSettings($table);
			var _this = this;
			var tableWarp = $table.closest('.table-wrap'),
			    pageToolbar = (0, _jTool2.default)('.page-toolbar', tableWarp); //分页工具条
			var sizeData = Settings.sizeData;
			pageToolbar.hide();
			//生成每页显示条数选择框
			_this.createPageSizeDOM($table, sizeData);

			//绑定页面跳转事件
			_this.bindPageJumpEvent($table);

			//绑定设置显示条数切换事件
			_this.bindSetPageSizeEvent($table);
		}
		/**
	  * 生成页码DOM节点
	  * @param $table [jTool object]
	  * @param pageData  分页数据格式
	  */
		, createPaginationDOM: function createPaginationDOM($table, pageData) {
			var tableWarp = $table.closest('.table-wrap'),
			    pageToolbar = (0, _jTool2.default)('.page-toolbar', tableWarp),
			    //分页工具条
			pagination = (0, _jTool2.default)('.pagination', pageToolbar); //分页区域
			pagination.html(this.joinPagination($table, pageData));
		}
		/*
	 * 拼接页码字符串
	  * @param $table: [table jTool object]
	  * @param cPage: 当前页码
	  * @param pageData  分页数据格式
	 * */
		, joinPagination: function joinPagination($table, pageData) {
			var cPage = Number(pageData.cPage || 0),
			    //当前页
			tPage = Number(pageData.tPage || 0),
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
			tHtml += '<li c-page="1" class="' + firstClassName + '">\n\t\t\t\t\t' + _I18n2.default.i18nText($table, "first-page") + '\n\t\t\t\t</li>\n\t\t\t\t<li c-page="' + (cPage - 1) + '" class="' + previousClassName + '">\n\t\t\t\t\t' + _I18n2.default.i18nText($table, "previous-page") + '\n\t\t\t\t</li>';
			// 循环开始数
			var i = 1;
			// 循环结束数
			var maxI = tPage;

			//配置first端省略符
			if (cPage > 4) {
				tHtml += '<li c-page="1">\n\t\t\t\t\t\t1\n\t\t\t\t\t</li>\n\t\t\t\t\t<li class="disabled">\n\t\t\t\t\t\t...\n\t\t\t\t\t</li>';
				i = cPage - 2;
			}
			//配置last端省略符
			if (tPage - cPage > 4) {
				maxI = cPage + 2;
				lHtml += '<li class="disabled">\n\t\t\t\t\t\t...\n\t\t\t\t\t</li>\n\t\t\t\t\t<li c-page="' + tPage + '">\n\t\t\t\t\t\t' + tPage + '\n\t\t\t\t\t</li>';
			}
			// 配置页码
			for (i; i <= maxI; i++) {
				if (i == cPage) {
					tHtml += '<li class="active">\n\t\t\t\t\t\t\t' + cPage + '\n\t\t\t\t\t\t</li>';
					continue;
				}
				tHtml += '<li c-page="' + i + '">\n\t\t\t\t\t\t' + i + '\n\t\t\t\t\t</li>';
			}
			tHtml += lHtml;
			//配置下一页与尾页
			var nextClassName = 'next-page',
			    lastClassName = 'last-page';
			if (cPage >= tPage) {
				nextClassName += ' disabled';
				lastClassName += ' disabled';
			}
			tHtml += '<li c-page="' + (cPage + 1) + '" class="' + nextClassName + '">\n\t\t\t\t\t' + _I18n2.default.i18nText($table, "next-page") + '\n\t\t\t\t</li>\n\t\t\t\t<li c-page="' + tPage + '" class="' + lastClassName + '">\n\t\t\t\t\t' + _I18n2.default.i18nText($table, "last-page") + '\n\t\t\t\t</li>';
			return tHtml;
		}
		/**
	  * 生成每页显示条数选择框据
	  * @param $table: [table jTool object]
	  * @param _sizeData: _选择框自定义条数
	  */
		, createPageSizeDOM: function createPageSizeDOM($table, _sizeData_) {
			var tableWarp = $table.closest('.table-wrap'),
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
				_ajaxPageHtml += '<option value="' + v + '">\n\t\t\t\t\t\t\t\t' + v + '\n\t\t\t\t\t\t\t</option>';
			});
			pSizeArea.html(_ajaxPageHtml);
		}
		/**
	  * 绑定页面跳转事件
	  * @param $table: [table jTool object]
	  */
		, bindPageJumpEvent: function bindPageJumpEvent($table) {
			var _this = this;
			var tableWarp = $table.closest('.table-wrap'),
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
				_this.gotoPage($table, cPage);
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
				_this.gotoPage($table, _inputValue);
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
				_this.gotoPage($table, _inputValue);
				_input.val('');
			});
		}

		/**
	  * 跳转至指定页
	  * @param $table: [table jTool object]
	  * @param _cPage: 指定页
	  */
		, gotoPage: function gotoPage($table, _cPage) {
			var settings = _Cache2.default.getSettings($table);
			//跳转的指定页大于总页数
			if (_cPage > settings.pageData.tPage) {
				_cPage = settings.pageData.tPage;
			}
			//替换被更改的值
			settings.pageData.cPage = _cPage;
			settings.pageData.pSize = settings.pageData.pSize || settings.pageSize;
			// 更新缓存
			_Cache2.default.updateSettings($table, settings);

			//调用事件、渲染DOM
			var query = _jTool2.default.extend({}, settings.query, settings.sortData, settings.pageData);
			settings.pagingBefore(query);
			_Core2.default.__refreshGrid($table, function () {
				settings.pagingAfter(query);
			});
		}

		/**
	  * 绑定设置当前页显示数事件
	  * @param $table: [table jTool object]
	  * @returns {boolean}
	  */
		, bindSetPageSizeEvent: function bindSetPageSizeEvent($table) {
			var tableWarp = $table.closest('.table-wrap'),
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
				var settings = _Cache2.default.getSettings($table);
				settings.pageData = {
					cPage: 1,
					pSize: parseInt(_size.val())
				};

				_Cache2.default.saveUserMemory(_table);
				// 更新缓存
				_Cache2.default.updateSettings($table, settings);
				//调用事件、渲染tbody
				var query = _jTool2.default.extend({}, settings.query, settings.sortData, settings.pageData);
				settings.pagingBefore(query);
				_Core2.default.__refreshGrid(_table, function () {
					settings.pagingAfter(query);
				});
			});
		}

		/**
	  * 重置每页显示条数, 重置条数文字信息 [注: 这个方法只做显示更新, 不操作Cache 数据]
	  * @param $table: [table jTool object]
	  * @param _pageData_: 分页数据格式
	  * @returns {boolean}
	  */
		, resetPSize: function resetPSize($table, _pageData_) {
			var tableWarp = $table.closest('.table-wrap'),
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
			var tmpHtml = _I18n2.default.i18nText($table, 'dataTablesInfo', [fromNum, toNum, totalNum]);
			//根据返回值修正单页条数显示值
			pSizeArea.val(_pageData_.pSize || 10);

			//修改条数文字信息
			pSizeInfo.html(tmpHtml);
			pSizeArea.show();
		}
		/**
	  * 重置分页数据
	  * @param $table: [table jTool object]
	  * @param totals: 总条数
	  */
		, resetPageData: function resetPageData($table, totals) {
			var settings = _Cache2.default.getSettings($table);
			var _this = this;
			if (isNaN(parseInt(totals, 10))) {
				return;
			}
			var _pageData = getPageData(totals);
			// 生成页码DOM节点
			_this.createPaginationDOM($table, _pageData);

			// 重置当前页显示条数
			_this.resetPSize($table, _pageData);

			// 更新Cache
			_Cache2.default.updateSettings($table, _jTool2.default.extend(true, settings, { pageData: _pageData }));

			var tableWarp = $table.closest('.table-wrap');
			//分页工具条
			var pageToolbar = (0, _jTool2.default)('.page-toolbar', tableWarp);
			pageToolbar.show();

			// 计算分页数据
			function getPageData(tSize) {
				var _pSize = settings.pageData.pSize || settings.pageSize,
				    _tSize = tSize,
				    _cPage = settings.pageData.cPage || 1;
				return {
					tPage: Math.ceil(_tSize / _pSize), // 总页数
					cPage: _cPage, // 当前页
					pSize: _pSize, // 每页显示条数
					tSize: _tSize // 总条路
				};
			}
		}
		/**
	  * 根据本地缓存配置分页数据
	  * @param $table: [table jTool object]
	  */
		, configPageForCache: function configPageForCache($table) {
			var settings = _Cache2.default.getSettings($table);
			var _data = _Cache2.default.getUserMemory($table);
			// 缓存对应
			var _cache = _data.cache;
			// 每页显示条数
			var _pSize = null;

			// 验证是否存在每页显示条数缓存数据
			if (!_cache || !_cache.page || !_cache.page.pSize) {
				_pSize = settings.pageSize || 10.;
			} else {
				_pSize = _cache.page.pSize;
			}
			var pageData = {
				pSize: _pSize,
				cPage: 1
			};
			_jTool2.default.extend(settings, { pageData: pageData });
			_Cache2.default.updateSettings($table, settings);
		}
	}; /*
	    * AjaxPage: 分页
	    * */
	exports.default = AjaxPage;

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _jTool = __webpack_require__(1);

	var _jTool2 = _interopRequireDefault(_jTool);

	var _Menu = __webpack_require__(8);

	var _Menu2 = _interopRequireDefault(_Menu);

	var _Adjust = __webpack_require__(3);

	var _Adjust2 = _interopRequireDefault(_Adjust);

	var _AjaxPage = __webpack_require__(6);

	var _AjaxPage2 = _interopRequireDefault(_AjaxPage);

	var _Cache = __webpack_require__(4);

	var _Cache2 = _interopRequireDefault(_Cache);

	var _Config = __webpack_require__(11);

	var _Config2 = _interopRequireDefault(_Config);

	var _Checkbox = __webpack_require__(12);

	var _Checkbox2 = _interopRequireDefault(_Checkbox);

	var _Base = __webpack_require__(5);

	var _Base2 = _interopRequireDefault(_Base);

	var _Export = __webpack_require__(10);

	var _Export2 = _interopRequireDefault(_Export);

	var _Order = __webpack_require__(13);

	var _Order2 = _interopRequireDefault(_Order);

	var _Remind = __webpack_require__(14);

	var _Remind2 = _interopRequireDefault(_Remind);

	var _Sort = __webpack_require__(15);

	var _Sort2 = _interopRequireDefault(_Sort);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/*
	* Core: 核心方法
	* 1.刷新
	* 2.渲染GM DOM
	* 3.重置tbody
	* */
	var Core = {
		/*
	  @刷新表格 使用现有参数重新获取数据，对表格数据区域进行渲染
	  $.callback: 回调函数
	  */
		__refreshGrid: function __refreshGrid($table, callback) {
			var settings = _Cache2.default.getSettings($table);
			var tbodyDOM = (0, _jTool2.default)('tbody', $table),
			    //tbody dom
			gmName = $table.attr('grid-manager'),
			    tableWrap = $table.closest('.table-wrap'),
			    refreshAction = (0, _jTool2.default)('.page-toolbar .refresh-action', tableWrap); //刷新按纽
			//增加刷新中标识
			refreshAction.addClass('refreshing');
			/*
	   使用配置数据
	   如果存在配置数据ajax_data,将不再通过ajax_rul进行数据请求
	   且ajax_beforeSend、ajax_error、ajax_complete将失效，仅有ajax_success会被执行
	   */
			if (settings.ajax_data) {
				driveDomForSuccessAfter(settings.ajax_data);
				settings.ajax_success(settings.ajax_data);
				removeRefreshingClass();
				typeof callback === 'function' ? callback() : '';
				return;
			}
			if (typeof settings.ajax_url != 'string' || settings.ajax_url === '') {
				settings.outLog('请求表格数据失败！参数[ajax_url]配制错误', 'error');
				removeRefreshingClass();
				typeof callback === 'function' ? callback() : '';
				return;
			}
			var pram = _jTool2.default.extend(true, {}, settings.query);
			//合并分页信息至请求参
			if (settings.supportAjaxPage) {
				_jTool2.default.extend(pram, settings.pageData);
			}
			//合并排序信息至请求参
			if (settings.supportSorting) {
				_jTool2.default.each(settings.sortData, function (key, value) {
					pram['sort_' + key] = value; // 增加sort_前缀,防止与搜索时的条件重叠
				});
				// $.extend(pram, settings.sortData);
			}
			//当前页不存在,或者小于1时, 修正为1
			if (!pram.cPage || pram.cPage < 1) {
				pram.cPage = 1;
				//当前页大于总页数时, 修正为总页数
			} else if (pram.cPage > pram.tPage) {
				pram.cPage = pram.tPage;
			}
			// settings.query = pram;
			_Cache2.default.updateSettings($table, settings);

			_Base2.default.showLoading(tableWrap);

			// 当前为POST请求 且 Content-Type 未进行配置时, 默认使用 application/x-www-form-urlencoded
			// 说明|备注:
			// 1. Content-Type = application/x-www-form-urlencoded 的数据形式为 form data
			// 2. Content-Type = text/plain;charset=UTF-8 的数据形式为 request payload
			if (settings.ajax_type.toUpperCase() === 'POST' && !settings.ajax_headers['Content-Type']) {
				settings.ajax_headers['Content-Type'] = 'application/x-www-form-urlencoded';
			}
			// 请求前处理程序, 可以通过该方法修改全部的请求参数
			settings.requestHandler(pram);

			//执行ajax
			_jTool2.default.ajax({
				url: settings.ajax_url,
				type: settings.ajax_type,
				data: pram,
				headers: settings.ajax_headers,
				cache: true,
				beforeSend: function beforeSend(XMLHttpRequest) {
					settings.ajax_beforeSend(XMLHttpRequest);
				},
				success: function success(response) {
					driveDomForSuccessAfter(response);
					settings.ajax_success(response);
				},
				error: function error(XMLHttpRequest, textStatus, errorThrown) {
					settings.ajax_error(XMLHttpRequest, textStatus, errorThrown);
				},
				complete: function complete(XMLHttpRequest, textStatus) {
					settings.ajax_complete(XMLHttpRequest, textStatus);
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

				// 执行请求后执行程序, 通过该程序可以修改返回值格式
				settings.responseHandler(parseRes);

				var _data = parseRes[settings.dataKey];
				var key = void 0,
				    //数据索引
				alignAttr = void 0,
				    //文本对齐属性
				template = void 0,
				    //数据模板
				templateHTML = void 0; //数据模板导出的html
				//数据为空时
				if (!_data || _data.length === 0) {
					tbodyTmpHTML = '<tr emptyTemplate>' + '<td colspan="' + (0, _jTool2.default)('th[th-visible="visible"]', $table).length + '">' + (settings.emptyTemplate || '<div class="gm-emptyTemplate">数据为空</div>') + '</td>' + '</tr>';
					parseRes.totals = 0;
					tbodyDOM.html(tbodyTmpHTML);
				} else {
					_jTool2.default.each(_data, function (i, v) {
						_Cache2.default.setRowData(gmName, i, v);
						tbodyTmpHTML += '<tr cache-key="' + i + '">';
						_jTool2.default.each(settings.columnData, function (i2, v2) {
							key = v2.key;
							template = v2.template;
							templateHTML = typeof template === 'function' ? template(v[key], v) : v[key];
							alignAttr = v2.align ? 'align="' + v2.align + '"' : '';
							tbodyTmpHTML += '<td gm-create="false" ' + alignAttr + '>' + templateHTML + '</td>';
						});
						tbodyTmpHTML += '</tr>';
					});
					tbodyDOM.html(tbodyTmpHTML);
					Core.resetTd($table, false);
				}
				//渲染分页
				if (settings.supportAjaxPage) {
					_AjaxPage2.default.resetPageData($table, parseRes[settings.totalsKey]);
					_Menu2.default.checkMenuPageAction($table);
				}
				typeof callback === 'function' ? callback() : '';
			}
		}
		/*
	 * 渲染HTML，根据配置嵌入所需的事件源DOM
	 * $table: table[jTool对象]
	 * */
		, createDOM: function createDOM($table) {
			var settings = _Cache2.default.getSettings($table);
			$table.attr('width', '100%').attr('cellspacing', 1).attr('cellpadding', 0).attr('grid-manager', settings.gridManagerName);
			var theadHtml = '<thead grid-manager-thead>',
			    tbodyHtml = '<tbody></tbody>',
			    alignAttr = '',
			    //文本对齐属性
			widthHtml = '',
			    //宽度对应的html片段
			remindHtml = '',
			    //提醒对应的html片段
			sortingHtml = ''; //排序对应的html片段
			// 通过配置项[columnData]生成thead
			_jTool2.default.each(settings.columnData, function (i, v) {
				// 表头提醒
				if (settings.supportRemind && typeof v.remind === 'string' && v.remind !== '') {
					remindHtml = 'remind="' + v.remind + '"';
				}
				// 排序
				sortingHtml = '';
				if (settings.supportSorting && typeof v.sorting === 'string') {
					if (v.sorting === settings.sortDownText) {
						sortingHtml = 'sorting="' + settings.sortDownText + '"';
						settings.sortData[v.key] = settings.sortDownText;
						_Cache2.default.updateSettings($table, settings);
					} else if (v.sorting === settings.sortUpText) {
						sortingHtml = 'sorting="' + settings.sortUpText + '"';
						settings.sortData[v.key] = settings.sortUpText;
						_Cache2.default.updateSettings($table, settings);
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
			$table.html(theadHtml + tbodyHtml);
			// 嵌入序号DOM
			if (settings.supportAutoOrder) {
				_Order2.default.initDOM($table);
			}
			//嵌入选择返选DOM
			if (settings.supportCheckbox) {
				_Checkbox2.default.initCheckbox($table);
			}
			// 存储原始th DOM
			_Cache2.default.setOriginalThDOM($table);

			// 表头提醒HTML
			var _remindHtml = _Remind2.default.html();

			// 配置列表HTML
			var _configHtml = _Config2.default.html();

			// 宽度调整HTML
			var _adjustHtml = _Adjust2.default.html();

			// 排序HTML
			var _sortingHtml = _Sort2.default.html();

			// 导出表格数据所需的事件源DOM
			var exportActionHtml = _Export2.default.html();
			// AJAX分页HTML
			var _ajaxPageHtml = _AjaxPage2.default.html($table);
			var wrapHtml = void 0,
			    //外围的html片段
			tableWarp = void 0,
			    //单个table所在的DIV容器
			onlyThead = void 0,
			    //单个table下的thead
			onlyThList = void 0,
			    //单个table下的TH
			onlyTH = void 0,
			    //单个TH
			onlyThWarp = void 0,
			    //单个TH下的上层DIV
			remindDOM = void 0,
			    //表头提醒DOM
			adjustDOM = void 0,
			    //调整宽度DOM
			sortingDom = void 0,
			    //排序DOM
			sortType = void 0,
			    //排序类形
			isLmOrder = void 0,
			    //是否为插件自动生成的序号列
			isLmCheckbox = void 0; //是否为插件自动生成的选择列

			onlyThead = (0, _jTool2.default)('thead[grid-manager-thead]', $table);
			onlyThList = (0, _jTool2.default)('th', onlyThead);
			wrapHtml = '<div class="table-wrap"><div class="table-div" style="height:calc(' + settings.height + ' - 40px)"></div><span class="text-dreamland"></span></div>';
			$table.wrap(wrapHtml);
			tableWarp = $table.closest('.table-wrap');
			// 配置文本对齐方式
			if (settings.textAlign) {
				tableWarp.attr('gm-text-align', settings.textAlign);
			}
			// 嵌入配置列表DOM
			if (settings.supportConfig) {
				tableWarp.append(_configHtml);
			}
			// 嵌入Ajax分页DOM
			if (settings.supportAjaxPage) {
				tableWarp.append(_ajaxPageHtml);
				_AjaxPage2.default.initAjaxPage($table);
			}
			// 嵌入导出表格数据事件源
			if (settings.supportExport) {
				tableWarp.append(exportActionHtml);
			}
			var configList = (0, _jTool2.default)('.config-list', tableWarp);
			var onlyWidth = void 0;
			onlyThWarp = (0, _jTool2.default)('<div class="th-wrap"></div>');
			_jTool2.default.each(onlyThList, function (i2, v2) {
				onlyTH = (0, _jTool2.default)(v2);
				onlyTH.attr('th-visible', 'visible');
				// 是否为自动生成的序号列
				if (settings.supportAutoOrder && onlyTH.attr('gm-order') === 'true') {
					isLmOrder = true;
				} else {
					isLmOrder = false;
				}
				// 是否为自动生成的选择列
				if (settings.supportCheckbox && onlyTH.attr('gm-checkbox') === 'true') {
					isLmCheckbox = true;
				} else {
					isLmCheckbox = false;
				}

				//嵌入配置列表项
				if (settings.supportConfig) {
					configList.append('<li th-name="' + onlyTH.attr('th-name') + '" class="checked-li">' + '<input type="checkbox" checked="checked"/>' + '<label>' + '<span class="fake-checkbox"></span>' + onlyTH.text() + '</label>' + '</li>');
				}
				// 嵌入拖拽事件源
				// 插件自动生成的排序与选择列不做事件绑定
				if (settings.supportDrag && !isLmOrder && !isLmCheckbox) {
					onlyThWarp.html('<span class="th-text drag-action">' + onlyTH.html() + '</span>');
				} else {
					onlyThWarp.html('<span class="th-text">' + onlyTH.html() + '</span>');
				}
				var onlyThWarpPaddingTop = onlyThWarp.css('padding-top');
				// 嵌入表头提醒事件源
				// 插件自动生成的排序与选择列不做事件绑定
				if (settings.supportRemind && onlyTH.attr('remind') != undefined && !isLmOrder && !isLmCheckbox) {
					remindDOM = (0, _jTool2.default)(_remindHtml);
					remindDOM.find('.ra-title').text(onlyTH.text());
					remindDOM.find('.ra-con').text(onlyTH.attr('remind') || onlyTH.text());
					if (onlyThWarpPaddingTop != '' && onlyThWarpPaddingTop != '0px') {
						remindDOM.css('top', onlyThWarpPaddingTop);
					}
					onlyThWarp.append(remindDOM);
				}
				// 嵌入排序事件源
				// 插件自动生成的排序与选择列不做事件绑定
				sortType = onlyTH.attr('sorting');
				if (settings.supportSorting && sortType != undefined && !isLmOrder && !isLmCheckbox) {
					sortingDom = (0, _jTool2.default)(_sortingHtml);
					// 依据 sortType 进行初始显示
					switch (sortType) {
						case settings.sortUpText:
							sortingDom.addClass('sorting-up');
							break;
						case settings.sortDownText:
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
				// 嵌入宽度调整事件源,插件自动生成的选择列不做事件绑定
				if (settings.supportAdjust && !isLmOrder && !isLmCheckbox) {
					adjustDOM = (0, _jTool2.default)(_adjustHtml);
					// 最后一列不支持调整宽度
					if (i2 === onlyThList.length - 1) {
						adjustDOM.hide();
					}
					onlyThWarp.append(adjustDOM);
				}
				onlyTH.html(onlyThWarp);
				// 宽度配置: GM自动创建为固定宽度
				if (isLmOrder || isLmCheckbox) {
					onlyWidth = 50;
				}
				// 宽度配置: 非GM自动创建的列
				else {
						var _minWidth = _Base2.default.getTextWidth(onlyTH); // 当前th文本所占宽度大于设置的宽度
						var _oldWidth = onlyTH.width();
						onlyWidth = _oldWidth > _minWidth ? _oldWidth : _minWidth;
					}
				// 清除width属性, 使用style.width进行宽度控制
				onlyTH.removeAttr('width');
				onlyTH.width(onlyWidth);
			});

			//删除渲染中标识、增加渲染完成标识
			$table.removeClass('GridManager-loading');
			$table.addClass('GridManager-ready');
		}
		/*
	 * 重置列表, 处理局部刷新、分页事件之后的td排序
	 * dom: table 或者 tr
	 * isSingleRow: 指定DOM节点是否为tr[布尔值]
	 * */
		, resetTd: function resetTd(dom, isSingleRow) {
			var _table = null,
			    _tr = null;
			if (isSingleRow) {
				_tr = (0, _jTool2.default)(dom);
				_table = _tr.closest('table');
			} else {
				_table = (0, _jTool2.default)(dom);
				_tr = _table.find('tbody tr');
			}
			if (!_tr || _tr.length == 0) {
				return false;
			}
			var settings = _Cache2.default.getSettings(_table);
			//重置表格序号
			if (settings.supportAutoOrder) {
				var _pageData = settings.pageData;
				var onlyOrderTd = null,
				    _orderBaseNumber = 1,
				    _orderText = void 0;
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
			if (settings.supportCheckbox) {
				var onlyCheckTd = null;
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
			if (settings.supportDrag) {
				var _thCacheList = _Cache2.default.getOriginalThDOM(_table);
				var _td = null;
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
			if (settings.supportConfig) {
				_Base2.default.initVisible(_table);
			}
		}
	};
	exports.default = Core;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _jTool = __webpack_require__(1);

	var _jTool2 = _interopRequireDefault(_jTool);

	var _Cache = __webpack_require__(4);

	var _Cache2 = _interopRequireDefault(_Cache);

	var _I18n = __webpack_require__(9);

	var _I18n2 = _interopRequireDefault(_I18n);

	var _Export = __webpack_require__(10);

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
	   $table: table[jTool Object]
	  */
		, bindRightMenuEvent: function bindRightMenuEvent($table) {
			var Settings = _Cache2.default.getSettings($table);
			var tableWarp = $table.closest('.table-wrap'),
			    tbody = (0, _jTool2.default)('tbody', tableWarp);
			//刷新当前表格
			var menuHTML = '<div class="grid-menu" grid-master="' + Settings.gridManagerName + '">';
			//分页类操作
			if (Settings.supportAjaxPage) {
				menuHTML += '<span grid-action="refresh-page" refresh-type="previous">\n\t\t\t\t\t\t\t' + _I18n2.default.i18nText($table, "previous-page") + '\n\t\t\t\t\t\t\t<i class="iconfont icon-sanjiao2"></i>\n\t\t\t\t\t\t</span>\n\t\t\t\t\t\t<span grid-action="refresh-page" refresh-type="next">\n\t\t\t\t\t\t\t' + _I18n2.default.i18nText($table, "next-page") + '\n\t\t\t\t\t\t\t<i class="iconfont icon-sanjiao1"></i>\n\t\t\t\t\t\t</span>';
			}
			menuHTML += '<span grid-action="refresh-page" refresh-type="refresh">\n\t\t\t\t\t\t' + _I18n2.default.i18nText($table, "refresh") + '\n\t\t\t\t\t\t<i class="iconfont icon-31shuaxin"></i>\n\t\t\t\t\t</span>';
			//导出类
			if (Settings.supportExport) {
				menuHTML += '<span class="grid-line"></span>\n\t\t\t\t\t\t<span grid-action="export-excel" only-checked="false">\n\t\t\t\t\t\t\t' + _I18n2.default.i18nText($table, "save-as-excel") + '\n\t\t\t\t\t\t\t<i class="iconfont icon-baocun"></i>\n\t\t\t\t\t\t</span>\n\t\t\t\t\t\t<span grid-action="export-excel" only-checked="true">\n\t\t\t\t\t\t\t' + _I18n2.default.i18nText($table, "save-as-excel-for-checked") + '\n\t\t\t\t\t\t\t<i class="iconfont icon-saveas24"></i>\n\t\t\t\t\t\t</span>';
			}
			//配置类
			if (Settings.supportConfig) {
				menuHTML += '<span class="grid-line"></span>\n\t\t\t\t\t\t<span grid-action="setting-grid">\n\t\t\t\t\t\t\t' + _I18n2.default.i18nText($table, "setting-grid") + '\n\t\t\t\t\t\t\t<i class="iconfont icon-shezhi"></i>\n\t\t\t\t\t\t</span>';
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
				_Export2.default.__exportGridToXls(_table, undefined, onlyChecked);
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

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /*
	                                                                                                                                                                                                                                                                               * I18n: 国际化
	                                                                                                                                                                                                                                                                               * */


	var _Base = __webpack_require__(5);

	var _Base2 = _interopRequireDefault(_Base);

	var _Cache = __webpack_require__(4);

	var _Cache2 = _interopRequireDefault(_Cache);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var I18n = {
		//选择使用哪种语言，暂时支持[zh-cn:简体中文，en-us:美式英语] 默认zh-cn
		getLanguage: function getLanguage($table) {
			return _Cache2.default.getSettings($table).i18n;
		}
		// 指定[表格 键值 语言]获取对应文本
		, getText: function getText($table, key, language) {
			return _Cache2.default.getSettings($table).textConfig[key][language] || '';
		}
		/*
	  * @获取与当前配置国际化匹配的文本
	  *  $table: table [jTool Object]
	  *  key: 指向的文本索引
	  *  v1,v2,v3:可为空，也存在一至3项，只存在一项时可为数组
	  * */
		, i18nText: function i18nText($table, key, v1, v2, v3) {
			var _this = this;
			var intrusion = [];
			//处理参数，实现多态化
			if (arguments.length == 3 && _typeof(arguments[2]) == 'object') {
				intrusion = arguments[2];
			} else if (arguments.length > 1) {
				for (var i = 1; i < arguments.length; i++) {
					intrusion.push(arguments[i]);
				}
			}
			var _text = '';
			try {
				_text = _this.getText($table, key, _this.getLanguage($table));
				if (!intrusion || intrusion.length == 0) {
					return _text;
				}
				_text = _text.replace(/{\d+}/g, function (word) {
					return intrusion[word.match(/\d+/)];
				});
				return _text;
			} catch (e) {
				_Base2.default.outLog('未找到与' + key + '相匹配的' + _this.getLanguage($table) + '语言', 'warn');
				return '';
			}
		}
	};
	exports.default = I18n;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

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
	  * 导出表格 .xls
	  * @param $table:当前操作的grid,由插件自动传入
	  * @param fileName: 导出后的文件名
	  * @param onlyChecked: 是否只导出已选中的表格
	  * */
		, __exportGridToXls: function __exportGridToXls($table, fileName, onlyChecked) {
			var Settings = _Cache2.default.getSettings($table);
			var gmExportAction = (0, _jTool2.default)('#gm-export-action'); //createDOM内添加
			if (gmExportAction.length === 0) {
				_Core2.default.outLog('导出失败，请查看配置项:supportExport是否配置正确', 'error');
				return false;
			}
			// type base64
			var uri = 'data:application/vnd.ms-excel;base64,';

			//存储导出的thead数据
			var theadHTML = '';
			//存储导出的tbody下的数据
			var tbodyHTML = '';

			var thDOM = (0, _jTool2.default)('thead[grid-manager-thead] th[th-visible="visible"][gm-create="false"]', $table);

			var trDOM = void 0,
			    tdDOM = void 0;
			//验证：是否只导出已选中的表格
			if (onlyChecked) {
				trDOM = (0, _jTool2.default)('tbody tr[checked="true"]', $table);
			} else {
				trDOM = (0, _jTool2.default)('tbody tr', $table);
			}
			_jTool2.default.each(thDOM, function (i, v) {
				theadHTML += '<th>' + v.getElementsByClassName('th-text')[0].textContent + '</th>';
			});
			_jTool2.default.each(trDOM, function (i, v) {
				tdDOM = (0, _jTool2.default)('td[gm-create="false"][td-visible="visible"]', v);
				tbodyHTML += '<tr>';
				_jTool2.default.each(tdDOM, function (i2, v2) {
					tbodyHTML += v2.outerHTML;
				});
				tbodyHTML += '</tr>';
			});
			// 拼接要导出html格式数据
			var exportHTML = '\n\t\t\t<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">\n\t\t\t\t<head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"></head>\n\t\t\t\t<body>\n\t\t\t\t\t<table>\n\t\t\t\t\t\t<thead>\'\n\t\t\t\t\t\t\t' + theadHTML + '\n\t\t\t\t\t\t</thead>\n\t\t\t\t\t\t<tbody>\n\t\t\t\t\t\t\t' + tbodyHTML + '\n\t\t\t\t\t\t</tbody>\n\t\t\t\t\t</table>\n\t\t\t\t</body>\n\t\t\t</html>';
			gmExportAction.prop('href', uri + base64(exportHTML));
			gmExportAction.prop('download', (fileName || Settings.gridManagerName) + '.xls');
			gmExportAction.get(0).click();

			function base64(s) {
				return window.btoa(unescape(encodeURIComponent(s)));
			}

			// 成功后返回true
			return true;
		}
	}; /*
	    * Export: 数据导出
	    * */
	exports.default = Export;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

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
			var html = '<div class="config-area">\n\t\t\t\t\t\t<span class="config-action">\n\t\t\t\t\t\t\t<i class="iconfont icon-31xingdongdian"></i>\n\t\t\t\t\t\t</span>\n\t\t\t\t\t\t<ul class="config-list"></ul>\n\t\t\t\t\t</div>';
			return html;
		}
		/*
	 * 绑定配置列表事件[隐藏展示列]
	 * $table: table [jTool object]
	 * */
		, bindConfigEvent: function bindConfigEvent($table) {
			var Settings = _Cache2.default.getSettings($table);
			// GM容器
			var tableWarp = $table.closest('div.table-wrap');
			// 打开/关闭设置事件源
			var configAction = (0, _jTool2.default)('.config-action', tableWarp);
			configAction.unbind('click');
			configAction.bind('click', function () {
				// 展示事件源
				var _configAction = (0, _jTool2.default)(this);

				// 设置区域
				var _configArea = _configAction.closest('.config-area');

				// 关闭
				if (_configArea.css('display') === 'block') {
					_configArea.hide();
					return false;
				}
				// 打开
				_configArea.show();

				//验证当前是否只有一列处于显示状态 并根据结果进行设置是否可以取消显示
				var checkedLi = (0, _jTool2.default)('.checked-li', _configArea);
				checkedLi.length === 1 ? checkedLi.addClass('no-click') : checkedLi.removeClass('no-click');
			});
			//设置事件
			(0, _jTool2.default)('.config-list li', tableWarp).unbind('click');
			(0, _jTool2.default)('.config-list li', tableWarp).bind('click', function () {
				//单个的设置项
				var _only = (0, _jTool2.default)(this);

				//单个设置项的thName
				var _thName = _only.attr('th-name');

				//事件下的checkbox
				var _checkbox = _only.find('input[type="checkbox"]');

				//所在的大容器
				var _tableWarp = _only.closest('.table-wrap');

				//所在的table-div
				var _tableDiv = (0, _jTool2.default)('.table-div', _tableWarp);

				//所对应的table
				var _table = (0, _jTool2.default)('[grid-manager]', _tableWarp);

				//所对应的th
				var _th = (0, _jTool2.default)('thead[grid-manager-thead] th[th-name="' + _thName + '"]', _table);

				// 最后一项显示列不允许隐藏
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

				//当前处于选中状态的展示项
				var _checkedList = (0, _jTool2.default)('.config-area input[type="checkbox"]:checked', _tableWarp);

				//限制最少显示一列
				if (_checkedList.length == 1) {
					_checkedList.parent().addClass('no-click');
				}

				//重置调整宽度事件源
				if (Settings.supportAdjust) {
					_Adjust2.default.resetAdjust(_table);
				}

				//重置镜像滚动条的宽度
				(0, _jTool2.default)('.sa-inner', _tableWarp).width('100%');

				//重置当前可视th的宽度
				var _visibleTh = (0, _jTool2.default)('thead[grid-manager-thead] th[th-visible="visible"]', _table);
				_jTool2.default.each(_visibleTh, function (i, v) {
					// 特殊处理: GM自动创建的列使终为50px
					if (v.getAttribute('gm-create') === 'true') {
						v.style.width = '50px';
					} else {
						v.style.width = 'auto';
					}
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
				_Cache2.default.saveUserMemory(_table); // 存储用户记忆

				// 处理置顶表头
				var topThead = (0, _jTool2.default)('thead.set-top', _table);
				if (topThead.length === 1) {
					topThead.remove();
					_tableDiv.trigger('scroll');
				}
			});
		}
	};
	exports.default = Config;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _jTool = __webpack_require__(1);

	var _jTool2 = _interopRequireDefault(_jTool);

	var _I18n = __webpack_require__(9);

	var _I18n2 = _interopRequireDefault(_I18n);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/*
	 * Checkbox: 数据选择/全选/返选
	 * */
	var Checkbox = {
		/*
	  * checkbox 拼接字符串
	  * table: table [jTool Object]
	  * */
		html: function html($table) {
			var checkboxHtml = '<th th-name="gm_checkbox" gm-checkbox="true" gm-create="true">\n\t\t\t\t\t\t\t\t<input type="checkbox"/>\n\t\t\t\t\t\t\t\t<span style="display: none">\n\t\t\t\t\t\t\t\t\t' + _I18n2.default.i18nText($table, 'checkall-text') + '\n\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t</th>';
			return checkboxHtml;
		}
		/*
	  * 初始化选择与反选DOM
	  * table: table [jTool Object]
	  * */
		, initCheckbox: function initCheckbox($table) {
			// 插入选择DOM
			(0, _jTool2.default)('thead tr', $table).prepend(this.html($table));

			// 绑定选择框事件
			this.bindCheckboxEvent($table);
		}
		/*
	 * 绑定选择框事件
	 * table: table [jTool Object]
	 * */
		, bindCheckboxEvent: function bindCheckboxEvent($table) {
			$table.off('click', 'input[type="checkbox"]');
			$table.on('click', 'input[type="checkbox"]', function () {
				// 存储th中的checkbox的选中状态
				var _thChecked = true;
				// 全选键事件源
				var _checkAction = (0, _jTool2.default)(this);
				// th中的选择框
				var _thCheckbox = (0, _jTool2.default)('thead th[gm-checkbox] input[type="checkbox"]', $table);

				// td中的选择框
				var _tdCheckbox = (0, _jTool2.default)('tbody td[gm-checkbox] input[type="checkbox"]', $table);
				// 当前为全选事件源
				if (_checkAction.closest('th[th-name="gm_checkbox"]').length === 1) {
					_jTool2.default.each(_tdCheckbox, function (i, v) {
						v.checked = _checkAction.prop('checked');
						(0, _jTool2.default)(v).closest('tr').attr('checked', v.checked);
					});
					// 当前为单个选择
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
	};
	exports.default = Checkbox;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _jTool = __webpack_require__(1);

	var _jTool2 = _interopRequireDefault(_jTool);

	var _I18n = __webpack_require__(9);

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
		initDOM: function initDOM($table) {
			var orderHtml = '<th th-name="gm_order" gm-order="true" gm-create="true">' + _I18n2.default.i18nText($table, 'order-text') + '</th>';
			(0, _jTool2.default)('thead tr', $table).prepend(orderHtml);
		}
	};
	exports.default = Order;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _jTool = __webpack_require__(1);

	var _jTool2 = _interopRequireDefault(_jTool);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Remind = {
		html: function html() {
			var html = '<div class="remind-action">\n\t\t\t\t\t\t<i class="ra-help iconfont icon-icon"></i>\n\t\t\t\t\t\t<div class="ra-area">\n\t\t\t\t\t\t\t<span class="ra-title"></span>\n\t\t\t\t\t\t\t<span class="ra-con"></span>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>';
			return html;
		}
		/*
	 * @绑定表头提醒功能
	 * $.table: table [jTool object]
	 * */
		, bindRemindEvent: function bindRemindEvent(table) {
			var remindAction = (0, _jTool2.default)('.remind-action', table);
			remindAction.unbind('mouseenter');
			remindAction.bind('mouseenter', function () {
				var raArea = (0, _jTool2.default)(this).find('.ra-area');
				var tableDiv = (0, _jTool2.default)(this).closest('.table-div');
				raArea.show();
				var theLeft = tableDiv.get(0).offsetWidth - ((0, _jTool2.default)(this).offset().left - tableDiv.offset().left) > raArea.get(0).offsetWidth;
				raArea.css({
					left: theLeft ? '0px' : 'auto',
					right: theLeft ? 'auto' : '0px'
				});
			});
			remindAction.unbind('mouseleave');
			remindAction.bind('mouseleave', function () {
				var raArea = (0, _jTool2.default)(this).find('.ra-area');
				raArea.hide();
			});
		}
	}; /*
	    * Remind: 表头提醒
	    * */
	exports.default = Remind;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

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
			var html = '<div class="sorting-action">\n\t\t\t\t\t\t<i class="sa-icon sa-up iconfont icon-sanjiao2"></i>\n\t\t\t\t\t\t<i class="sa-icon sa-down iconfont icon-sanjiao1"></i>\n\t\t\t\t\t</div>';
			return html;
		}
		/*
	  * 手动设置排序
	  * @param sortJson: 需要排序的json串 如:{th-name:'down'} value需要与参数sortUpText 或 sortDownText值相同
	  * @param callback: 回调函数[function]
	  * @param refresh: 是否执行完成后对表格进行自动刷新[boolean, 默认为true]
	  *
	  * 排序json串示例:
	  * sortJson => {name: 'ASC}
	  * */
		, __setSort: function __setSort($table, sortJson, callback, refresh) {
			var settings = _Cache2.default.getSettings($table);
			if (!sortJson || _jTool2.default.type(sortJson) !== 'object' || _jTool2.default.isEmptyObject(sortJson)) {
				return false;
			}
			_jTool2.default.extend(settings.sortData, sortJson);
			_Cache2.default.updateSettings($table, settings);

			//默认执行完后进行刷新列表操作
			if (typeof refresh === 'undefined') {
				refresh = true;
			}
			var _th = void 0,
			    _sortAction = void 0,
			    _sortType = void 0;
			for (var s in sortJson) {
				_th = (0, _jTool2.default)('[th-name="' + s + '"]', $table);
				_sortType = sortJson[s];
				_sortAction = (0, _jTool2.default)('.sorting-action', _th);
				if (_sortType === settings.sortUpText) {
					_th.attr('sorting', settings.sortUpText);
					_sortAction.removeClass('sorting-down');
					_sortAction.addClass('sorting-up');
				} else if (_sortType === settings.sortDownText) {
					_th.attr('sorting', settings.sortDownText);
					_sortAction.removeClass('sorting-up');
					_sortAction.addClass('sorting-down');
				}
			}
			refresh ? _Core2.default.__refreshGrid($table, callback) : typeof callback === 'function' ? callback() : '';
		}
		/**
	  * 绑定排序事件
	  * @param $table
	     */
		, bindSortingEvent: function bindSortingEvent($table) {
			var _this = this;
			var settings = _Cache2.default.getSettings($table);
			var action = void 0,
			    //向上或向下事件源
			th = void 0,
			    //事件源所在的th
			table = void 0,
			    //事件源所在的table
			thName = void 0; //th对应的名称
			//绑定排序事件
			$table.off('mouseup', '.sorting-action');
			$table.on('mouseup', '.sorting-action', function () {
				action = (0, _jTool2.default)(this);
				th = action.closest('th');
				table = th.closest('table');
				thName = th.attr('th-name');
				if (!thName || _jTool2.default.trim(thName) == '') {
					_Base2.default.outLog('排序必要的参数丢失', 'error');
					return false;
				}
				// 根据组合排序配置项判定：是否清除原排序及排序样式
				if (!settings.isCombSorting) {
					_jTool2.default.each((0, _jTool2.default)('.sorting-action', table), function (i, v) {
						if (v != action.get(0)) {
							//action.get(0) 当前事件源的DOM
							(0, _jTool2.default)(v).removeClass('sorting-up sorting-down');
							(0, _jTool2.default)(v).closest('th').attr('sorting', '');
						}
					});
				}
				// 更新排序样式
				_this.updateSortStyle(action, th, settings);
				// 当前触发项为置顶表头时, 同步更新至原样式
				if (th.closest('thead[grid-manager-mock-thead]').length === 1) {
					var _th = (0, _jTool2.default)('thead[grid-manager-thead] th[th-name="' + thName + '"]', table);
					var _action = (0, _jTool2.default)('.sorting-action', _th);
					_this.updateSortStyle(_action, _th, settings);
				}
				// 拼装排序数据: 单列排序
				settings.sortData = {};
				if (!settings.isCombSorting) {
					settings.sortData[th.attr('th-name')] = th.attr('sorting');
					// 拼装排序数据: 组合排序
				} else {
					_jTool2.default.each((0, _jTool2.default)('thead[grid-manager-thead] th[th-name][sorting]', table), function (i, v) {
						if (v.getAttribute('sorting') != '') {
							settings.sortData[v.getAttribute('th-name')] = v.getAttribute('sorting');
						}
					});
				}
				//调用事件、渲染tbody
				_Cache2.default.updateSettings($table, settings);
				var query = _jTool2.default.extend({}, settings.query, settings.sortData, settings.pageData);
				settings.sortingBefore(query);
				_Core2.default.__refreshGrid($table, function () {
					settings.sortingAfter(query, th);
				});
			});
		}
		/**
	  * 更新排序样式
	  * @param sortAction
	  * @param th
	  * @param settings
	     */
		, updateSortStyle: function updateSortStyle(sortAction, th, settings) {
			// 排序操作：升序
			if (sortAction.hasClass('sorting-down')) {
				sortAction.addClass('sorting-up');
				sortAction.removeClass('sorting-down');
				th.attr('sorting', settings.sortUpText);
			}
			// 排序操作：降序
			else {
					sortAction.addClass('sorting-down');
					sortAction.removeClass('sorting-up');
					th.attr('sorting', settings.sortDownText);
				}
		}
	};
	exports.default = Sort;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

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
		/**
	  * 绑定拖拽换位事件
	  * @param $table
	     */
		bindDragEvent: function bindDragEvent($table) {
			var _this = this;
			//指定拖拽换位事件源,配置拖拽样式
			$table.off('mousedown', '.drag-action');
			$table.on('mousedown', '.drag-action', function (event) {
				var $body = (0, _jTool2.default)('body');
				// 获取设置项
				var settings = _Cache2.default.getSettings($table);

				// 事件源th
				var _th = (0, _jTool2.default)(this).closest('th');

				// 事件源的上一个th
				var prevTh = null;

				//事件源的下一个th
				var nextTh = null;

				//事件源所在的tr
				var _tr = _th.parent();

				//事件源同层级下的所有可视th
				var _allTh = _tr.find('th[th-visible="visible"]');

				//事件源所在的table
				var _table = _tr.closest('table');

				//事件源所在的DIV
				var tableDiv = _table.closest('.table-div');

				//事件源所在的容器
				var _tableWrap = _table.closest('.table-wrap');

				//与事件源同列的所有td
				var colTd = _Base2.default.getColTd(_th);

				// 列拖拽触发回调事件
				settings.dragBefore(event);

				//禁用文字选中效果
				$body.addClass('no-select-text');

				// 更新界面交互标识
				_Base2.default.updateInteractive(_table, 'Drag');

				//增加拖拽中样式
				_th.addClass('drag-ongoing opacityChange');
				colTd.addClass('drag-ongoing opacityChange');

				//增加临时展示DOM
				_tableWrap.append('<div class="dreamland-div"></div>');
				var dreamlandDIV = (0, _jTool2.default)('.dreamland-div', _tableWrap);
				dreamlandDIV.get(0).innerHTML = '<table class="dreamland-table ' + _table.attr('class') + '"></table>';
				//tbody内容：将原tr与td上的属性一并带上，解决一部分样式问题
				var _tbodyHtml = '';
				var _cloneTr = void 0,
				    _cloneTd = void 0;
				_jTool2.default.each(colTd, function (i, v) {
					_cloneTd = v.cloneNode(true);
					_cloneTd.style.height = v.offsetHeight + 'px';
					_cloneTr = (0, _jTool2.default)(v).closest('tr').clone();
					_tbodyHtml += _cloneTr.html(_cloneTd.outerHTML).get(0).outerHTML;
				});
				var tmpHtml = '<thead>\n\t\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t<th style="height:' + _th.height() + 'px">\n\t\t\t\t\t\t\t\t' + (0, _jTool2.default)('.drag-action', _th).get(0).outerHTML + '\n\t\t\t\t\t\t\t\t</th>\n\t\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t</thead>\n\t\t\t\t\t\t\t<tbody>\n\t\t\t\t\t\t\t\t' + _tbodyHtml + '\n\t\t\t\t\t\t\t</tbody>';
				(0, _jTool2.default)('.dreamland-table', dreamlandDIV).html(tmpHtml);
				//绑定拖拽滑动事件
				var _thIndex = 0; //存储移动时的th所处的位置
				$body.unbind('mousemove');
				$body.bind('mousemove', function (e2) {
					_thIndex = _th.index(_allTh);
					prevTh = undefined;
					//当前移动的非第一列
					if (_thIndex > 0) {
						prevTh = _allTh.eq(_thIndex - 1);
					}
					nextTh = undefined;
					//当前移动的非最后一列
					if (_thIndex < _allTh.length) {
						nextTh = _allTh.eq(_thIndex + 1);
					}
					//插件自动创建的项,不允许移动
					if (prevTh && prevTh.length !== 0 && prevTh.attr('gm-create') === 'true') {
						prevTh = undefined;
					} else if (nextTh && nextTh.length !== 0 && nextTh.attr('gm-create') === 'true') {
						nextTh = undefined;
					}
					dreamlandDIV.show();
					dreamlandDIV.css({
						width: _th.get(0).offsetWidth,
						height: _table.get(0).offsetHeight,
						left: e2.clientX - _tableWrap.offset().left + window.pageXOffset - _th.get(0).offsetWidth / 2,
						top: e2.clientY - _tableWrap.offset().top + window.pageYOffset - dreamlandDIV.find('th').get(0).offsetHeight / 2
					});
					// 当前触发项为置顶表头时, 同步更新至原样式
					var haveMockThead = false; // 当前是否包含置顶表头
					if (_th.closest('thead[grid-manager-mock-thead]').length === 1) {
						haveMockThead = true;
					}
					_this.updateDrag(_table, prevTh, nextTh, _th, colTd, dreamlandDIV, tableDiv, haveMockThead);
					_allTh = _tr.find('th'); //重置TH对象数据
				});
				//绑定拖拽停止事件
				$body.unbind('mouseup');
				$body.bind('mouseup', function (event) {
					var settings = _Cache2.default.getSettings($table);
					$body.unbind('mousemove');
					$body.unbind('mouseup');
					//清除临时展示被移动的列
					dreamlandDIV = (0, _jTool2.default)('.dreamland-div');
					if (dreamlandDIV.length != 0) {
						dreamlandDIV.animate({
							top: _table.get(0).offsetTop + 'px',
							left: _th.get(0).offsetLeft - tableDiv.get(0).scrollLeft + 'px'
						}, settings.animateTime, function () {
							// tableDiv.css('position',_divPosition);
							_th.removeClass('drag-ongoing');
							colTd.removeClass('drag-ongoing');
							dreamlandDIV.remove();

							// 列拖拽成功回调事件
							settings.dragAfter(event);
						});
					}
					// 存储用户记忆
					_Cache2.default.saveUserMemory(_table);

					//重置调整宽度事件源
					if (settings.supportAdjust) {
						_Adjust2.default.resetAdjust(_table);
					}
					//开启文字选中效果
					$body.removeClass('no-select-text');

					// 更新界面交互标识
					_Base2.default.updateInteractive(_table);
				});
			});
		}
		/**
	  * 拖拽触发后更新DOM
	  * @param _table
	  * @param prevTh
	  * @param nextTh
	  * @param _th
	  * @param colTd
	  * @param dreamlandDIV
	  * @param tableDiv
	     * @param haveMockThead
	     */
		, updateDrag: function updateDrag(_table, prevTh, nextTh, _th, colTd, dreamlandDIV, tableDiv, haveMockThead) {
			// 事件源对应的上一组td
			var prevTd = null;
			//事件源对应的下一组td
			var nextTd = null;
			// 处理向左拖拽
			if (prevTh && prevTh.length != 0 && dreamlandDIV.offset().left < prevTh.offset().left) {
				prevTd = _Base2.default.getColTd(prevTh);
				prevTh.before(_th);
				_jTool2.default.each(colTd, function (i, v) {
					prevTd.eq(i).before(v);
				});
				if (haveMockThead) {
					var _prevTh = (0, _jTool2.default)('thead[grid-manager-thead] th[th-name="' + prevTh.attr('th-name') + '"]', _table);
					var __th = (0, _jTool2.default)('thead[grid-manager-thead] th[th-name="' + _th.attr('th-name') + '"]', _table);
					_prevTh.before(__th);
				}
			}
			//处理向右拖拽
			else if (nextTh && nextTh.length != 0 && dreamlandDIV.offset().left + dreamlandDIV.width() > nextTh.offset().left) {
					nextTd = _Base2.default.getColTd(nextTh);
					nextTh.after(_th);
					_jTool2.default.each(colTd, function (i, v) {
						nextTd.eq(i).after(v);
					});
					if (haveMockThead) {
						var _nextTh = (0, _jTool2.default)('thead[grid-manager-thead] th[th-name="' + nextTh.attr('th-name') + '"]', _table);
						var _th2 = (0, _jTool2.default)('thead[grid-manager-thead] th[th-name="' + _th.attr('th-name') + '"]', _table);
						_nextTh.after(_th2);
					}
				}
		}
	};
	exports.default = Drag;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

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
			var tableDIV = table.closest('.table-div');
			// 绑定resize事件: 对表头吸顶的列宽度进行修正
			window.addEventListener('resize', function () {
				var _setTopHead = (0, _jTool2.default)('.set-top', table); // 吸顶元素
				if (_setTopHead && _setTopHead.length === 1) {
					_setTopHead.remove();
					table.closest('.table-div').trigger('scroll');
				}
			});
			//绑定滚动条事件
			tableDIV.unbind('scroll');
			tableDIV.bind('scroll', function (e, _isWindowResize_) {
				var _scrollDOMTop = (0, _jTool2.default)(this).scrollTop();
				// 列表head
				var _thead = (0, _jTool2.default)('thead[grid-manager-thead]', table);
				// 列表body
				var _tbody = (0, _jTool2.default)('tbody', table);
				// 吸顶元素
				var _setTopHead = (0, _jTool2.default)('.set-top', table);
				// 当前列表数据为空
				if ((0, _jTool2.default)('tr', _tbody).length == 0) {
					return true;
				}
				//配置吸顶区的宽度
				if (_setTopHead.length == 0 || _isWindowResize_) {
					_setTopHead.length == 0 ? table.append(_thead.clone(true).addClass('set-top')) : '';
					_setTopHead = (0, _jTool2.default)('.set-top', table);
					_setTopHead.removeAttr('grid-manager-thead');
					_setTopHead.attr('grid-manager-mock-thead', '');
					_setTopHead.removeClass('scrolling');
					_setTopHead.css({
						width: _thead.width(),
						left: -table.closest('.table-div').scrollLeft() + 'px'
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
							left: -table.closest('.table-div').scrollLeft() + 'px'
						});
					}
				return true;
			});
		}
	}; /*
	    * Scroll: 滚动轴
	    * */
	exports.default = Scroll;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.TextSettings = exports.Settings = undefined;

	var _jTool = __webpack_require__(1);

	var _jTool2 = _interopRequireDefault(_jTool);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Settings = {
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

		// 文本对齐方式
		textAlign: '',

		// 动画效果时长
		animateTime: 300,

		// 是否禁用本地缓存
		disableCache: false,

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
		requestHandler: _jTool2.default.noop, // 请求前处理程序, 可以通过该方法修改全部的请求参数 @v2.3.14
		responseHandler: _jTool2.default.noop, // 执行请求后执行程序, 通过该程序可以修改返回值格式. 仅有成功后该函数才会执行 @v2.3.14
		dataKey: 'data', //ajax请求返回的列表数据key键值,默认为data
		totalsKey: 'totals', //ajax请求返回的数据总条数key键值,默认为totals
		//数据导出
		supportExport: true //支持导出表格数据
	};

	// 表格中使用到的国际化文本信息
	/**
	 * Settings: 配置项
	 */
	var TextSettings = function TextSettings() {
		this['order-text'] = {
			'zh-cn': '序号',
			'en-us': 'order'
		};
		this['first-page'] = {
			'zh-cn': '首页',
			'en-us': 'first'
		};
		this['previous-page'] = {
			'zh-cn': '上一页',
			'en-us': 'previous'
		};
		this['next-page'] = {
			'zh-cn': '下一页',
			'en-us': 'next'
		};
		this['last-page'] = {
			'zh-cn': '尾页',
			'en-us': 'last'
		};
		this['dataTablesInfo'] = {
			'zh-cn': '此页显示 {0}-{1} 共{2}条',
			'en-us': 'this page show {0}-{1} count {2}'
		};
		this['goto-first-text'] = {
			'zh-cn': '跳转至',
			'en-us': 'goto'
		};
		this['goto-last-text'] = {
			'zh-cn': '页',
			'en-us': 'page'
		};
		this['refresh'] = {
			'zh-cn': '重新加载',
			'en-us': 'Refresh'
		};
		this['save-as-excel'] = {
			'zh-cn': '另存为Excel',
			'en-us': 'Save as Excel'
		};
		this['save-as-excel-for-checked'] = {
			'zh-cn': '已选中项另存为Excel',
			'en-us': 'Save selected as Excel'
		};
		this['setting-grid'] = {
			'zh-cn': '配置表',
			'en-us': 'Setting Grid'
		};
		this['checkall-text'] = {
			'zh-cn': '全选',
			'en-us': 'All'
		};
	};
	exports.Settings = Settings;
	exports.TextSettings = TextSettings;

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.Hover = undefined;

	var _jTool = __webpack_require__(1);

	var _jTool2 = _interopRequireDefault(_jTool);

	var _Base = __webpack_require__(5);

	var _Base2 = _interopRequireDefault(_Base);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Created by baukh on 17/3/3.
	 * 事件类
	 */
	var Hover = exports.Hover = {
		onTbodyHover: function onTbodyHover($table) {
			var $td = null,
			    $tr = null;
			$table.off('mousemove', 'td');
			$table.on('mousemove', 'td', function () {
				$td = (0, _jTool2.default)(this);
				$tr = $td.parent();
				// row col 并未发生变化
				if ($td.attr('col-hover') === 'true' && $tr.attr('row-hover') === 'true') {
					return;
				}
				// row 发生变化
				if ($tr.attr('row-hover') !== 'true') {
					(0, _jTool2.default)('tr[row-hover="true"]', $table).removeAttr('row-hover');
					$tr.attr('row-hover', 'true');
				}

				// col 发生变化
				if ($tr.attr('col-hover') !== 'true') {
					(0, _jTool2.default)('td[col-hover="true"]', $table).removeAttr('col-hover');
					_Base2.default.getColTd($td).attr('col-hover', 'true');
				}
			});
		}
	};

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.publishMethodArray = exports.PublishMethod = undefined;

	var _jTool = __webpack_require__(1);

	var _jTool2 = _interopRequireDefault(_jTool);

	var _Cache = __webpack_require__(4);

	var _Cache2 = _interopRequireDefault(_Cache);

	var _Base = __webpack_require__(5);

	var _Base2 = _interopRequireDefault(_Base);

	var _Sort = __webpack_require__(15);

	var _Sort2 = _interopRequireDefault(_Sort);

	var _Export = __webpack_require__(10);

	var _Export2 = _interopRequireDefault(_Export);

	var _Core = __webpack_require__(7);

	var _Core2 = _interopRequireDefault(_Core);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Created by baukh on 17/4/14.
	 * 公开方法
	 * 参数中的$table, 将由组件自动添加
	 */
	var PublishMethod = {
		/*
	  * 通过jTool实例获取GridManager
	  * @param $table: table [jTool Object]
	  * */
		get: function get($table) {
			return _Cache2.default.__getGridManager($table);
		}
		/*
	  * 获取指定表格的本地存储数据
	  * 成功则返回本地存储数据,失败则返回空对象
	  * @param $table: table [jTool Object]
	  * */
		, getLocalStorage: function getLocalStorage($table) {
			return _Cache2.default.getUserMemory($table);
		}
		/*
	  * 清除指定表的表格记忆数据
	  * @param $table: table [jTool Object]
	  * return 成功或者失败的布尔值
	  * */
		, clear: function clear($table) {
			return _Cache2.default.delUserMemory($table);
		}
		/*
	  * @获取当前行渲染时使用的数据
	  * @param $table: table [jTool Object]
	  * @param target: 将要获取数据所对应的tr[Element or NodeList]
	  * */
		, getRowData: function getRowData($table, target) {
			return _Cache2.default.__getRowData($table, target);
		}
		/*
	 * 手动设置排序
	 * @param sortJson: 需要排序的json串 如:{th-name:'down'} value需要与参数sortUpText 或 sortDownText值相同
	 * @param callback: 回调函数[function]
	 * @param refresh: 是否执行完成后对表格进行自动刷新[boolean, 默认为true]
	 * */
		, setSort: function setSort($table, sortJson, callback, refresh) {
			_Sort2.default.__setSort($table, sortJson, callback, refresh);
		}
		/*
	 * 显示Th及对应的TD项
	 * @param $table: table [jTool Object]
	 * @param target: th[Element or NodeList]
	 * */
		, showTh: function showTh($table, target) {
			_Base2.default.setAreVisible((0, _jTool2.default)(target), true);
		}
		/*
	 * 隐藏Th及对应的TD项
	  * @param $table: table [jTool Object]
	  * @param target: th[Element or NodeList]
	 * */
		, hideTh: function hideTh($table, target) {
			_Base2.default.setAreVisible((0, _jTool2.default)(target), false);
		}
		/*
	 * 导出表格 .xls
	 * @param $table:当前操作的grid,由插件自动传入
	 * @param fileName: 导出后的文件名
	 * @param onlyChecked: 是否只导出已选中的表格
	 * */
		, exportGridToXls: function exportGridToXls($table, fileName, onlyChecked) {
			return _Export2.default.__exportGridToXls($table, fileName, onlyChecked);
		}
		/**
	  * 设置查询条件
	  * @param $table: table [jTool object]
	  * @param query: 配置的数据 [Object]
	  * @param callback: 回调函数
	  * @param isGotoFirstPage: 是否返回第一页[Boolean default=true]
	  * 注意事项:
	  * - query的key值如果与分页及排序等字段冲突, query中的值将会被忽略.
	  * - setQuery() 会立即触发刷新操作
	  * - 在此配置的query在分页事件触发时, 会以参数形式传递至pagingAfter(query)事件内
	  * - setQuery对query字段执行的操作是修改而不是合并, 每次执行setQuery都会将之前配置的query值覆盖
	  */
		, setQuery: function setQuery($table, query, isGotoFirstPage, callback) {
			var settings = _Cache2.default.getSettings($table);
			if (typeof isGotoFirstPage !== 'boolean') {
				callback = isGotoFirstPage;
				isGotoFirstPage = true;
			}
			_jTool2.default.extend(settings, { query: query });
			if (isGotoFirstPage) {
				settings.pageData.cPage = 1;
			}
			_Cache2.default.updateSettings($table, settings);
			_Core2.default.__refreshGrid($table, callback);
		}
		/**
	  * 配置静态数ajaxData
	  * @param $table: table [jTool object]
	  * @param ajaxData: 配置的数据
	  */
		, setAjaxData: function setAjaxData($table, ajaxData) {
			var settings = _Cache2.default.getSettings($table);
			_jTool2.default.extend(settings, { ajax_data: ajaxData });
			_Cache2.default.updateSettings($table, settings);
			_Core2.default.__refreshGrid($table);
		}
		/*
	 * 刷新表格 使用现有参数重新获取数据，对表格数据区域进行渲染
	 * @param $table:当前操作的grid,由插件自动传入
	 * @param isGotoFirstPage:  是否刷新时跳转至第一页[boolean类型, 默认false]
	 * @param callback: 回调函数
	 * */
		, refreshGrid: function refreshGrid($table, isGotoFirstPage, callback) {
			var settings = _Cache2.default.getSettings($table);
			if (typeof isGotoFirstPage !== 'boolean') {
				callback = isGotoFirstPage;
				isGotoFirstPage = false;
			}
			if (isGotoFirstPage) {
				settings.pageData['cPage'] = 1;
				_Cache2.default.updateSettings($table, settings);
			}
			_Core2.default.__refreshGrid($table, callback);
		}
		/*
	 * 获取当前选中的行
	 * @param $table: table [jTool Object]
	 * return 当前选中的行 [NodeList]
	 * */
		, getCheckedTr: function getCheckedTr($table) {
			return $table.get(0).querySelectorAll('tbody tr[checked="true"]');
		}
		/*
	 * 获取当前选中行渲染时使用的数据
	 * @param $table: table [jTool Object]
	 * */
		, getCheckedData: function getCheckedData($table) {
			return _Cache2.default.__getRowData($table, this.getCheckedTr($table));
		}
	};

	/*
		//对外公开方法展示
		'init',					// 初始化方法
		'setSort',				// 手动设置排序
		'get',					// 通过jTool实例获取GridManager
		'showTh',				// 显示Th及对应的TD项
		'hideTh',				// 隐藏Th及对应的TD项
		'exportGridToXls',		// 导出表格 .xls
		'getLocalStorage',		// 获取指定表格的本地存储数据
		'setQuery',				// 配置query 该参数会在分页触发后返回至pagingAfter(query)方法
		'setAjaxData',          // 用于再次配置ajax_data数据, 配置后会根据配置的数据即刻刷新表格
		'refreshGrid',			// 刷新表格 使用现有参数重新获取数据，对表格数据区域进行渲染
		'getCheckedTr',			// 获取当前选中的行
		'getRowData',			// 获取当前行渲染时使用的数据
		'getCheckedData',		// 获取当前选中行渲染时使用的数据
		'clear'					// 清除指定表的表格记忆数据
	*/
	// 对外公开方法列表
	var publishMethodArray = ['init'];
	for (var key in PublishMethod) {
		publishMethodArray.push(key);
	}
	exports.PublishMethod = PublishMethod;
	exports.publishMethodArray = publishMethodArray;

/***/ })
/******/ ]);