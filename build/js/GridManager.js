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

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *  GridManager: 构造函数
	                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * */


	var _jTool = __webpack_require__(1);

	var _jTool2 = _interopRequireDefault(_jTool);

	var _Adjust = __webpack_require__(3);

	var _Adjust2 = _interopRequireDefault(_Adjust);

	var _AjaxPage = __webpack_require__(7);

	var _AjaxPage2 = _interopRequireDefault(_AjaxPage);

	var _Cache = __webpack_require__(4);

	var _Cache2 = _interopRequireDefault(_Cache);

	var _Core = __webpack_require__(8);

	var _Core2 = _interopRequireDefault(_Core);

	var _Config = __webpack_require__(10);

	var _Config2 = _interopRequireDefault(_Config);

	var _Checkbox = __webpack_require__(11);

	var _Checkbox2 = _interopRequireDefault(_Checkbox);

	var _Drag = __webpack_require__(19);

	var _Drag2 = _interopRequireDefault(_Drag);

	var _Export = __webpack_require__(13);

	var _Export2 = _interopRequireDefault(_Export);

	var _I18n = __webpack_require__(12);

	var _I18n2 = _interopRequireDefault(_I18n);

	var _Menu = __webpack_require__(18);

	var _Menu2 = _interopRequireDefault(_Menu);

	var _Order = __webpack_require__(14);

	var _Order2 = _interopRequireDefault(_Order);

	var _Remind = __webpack_require__(15);

	var _Remind2 = _interopRequireDefault(_Remind);

	var _Scroll = __webpack_require__(16);

	var _Scroll2 = _interopRequireDefault(_Scroll);

	var _Sort = __webpack_require__(17);

	var _Sort2 = _interopRequireDefault(_Sort);

	var _Settings = __webpack_require__(6);

	var _Settings2 = _interopRequireDefault(_Settings);

	var _DOM = __webpack_require__(9);

	var _DOM2 = _interopRequireDefault(_DOM);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var GridManager = function () {
		function GridManager() {
			_classCallCheck(this, GridManager);
		}

		_createClass(GridManager, [{
			key: 'init',

			/*
	   * [对外公开方法]
	   * @初始化方法
	   * $.jToolObj: table [jTool object]
	   * $.settings: 参数
	   * $.callback:回调
	   * */
			value: function init(jToolObj, settings, callback) {

				var _this = this;
				// 参数
				_jTool2.default.extend(_Settings2.default, settings);

				//通过版本较验 清理缓存
				_Cache2.default.cleanTableCacheForVersion(jToolObj, _Settings2.default.version);
				if (typeof _Settings2.default.gridManagerName !== 'string' || _Settings2.default.gridManagerName.trim() === '') {
					_Settings2.default.gridManagerName = jToolObj.attr('grid-manager'); //存储gridManagerName值
				}
				if (_Settings2.default.gridManagerName.trim() === '') {
					_Settings2.default.outLog('请在html标签中为属性[grid-manager]赋值或在配置项中配置gridManagerName', 'error');
					return false;
				}

				if (jToolObj.hasClass('GridManager-ready') || jToolObj.hasClass('GridManager-loading')) {
					_Settings2.default.outLog('渲染失败：可能该表格已经渲染或正在渲染', 'error');
					return false;
				}
				//根据本地缓存配置每页显示条数
				if (_Settings2.default.supportAjaxPage) {
					_AjaxPage2.default.configPageForCache(jToolObj);
				}
				var query = _jTool2.default.extend({}, _Settings2.default.query, _Settings2.default.pageData);
				//增加渲染中标注
				jToolObj.addClass('GridManager-loading');
				_this.initTable(jToolObj);

				//如果初始获取缓存失败，则在mousedown时，首先存储一次数据
				if (typeof jToolObj.attr('grid-manager-cache-error') !== 'undefined') {
					window.setTimeout(function () {
						_Cache2.default.setToLocalStorage(jToolObj, true);
						jToolObj.removeAttr('grid-manager-cache-error');
					}, 1000);
				}

				//重置tbody存在数据的列表 @20160717:的2.0版本中，重置已在其它位置执行，该处已无用
				//$('tbody tr', jToolObj).length > 0 ? _this.resetTd(v, false) : '';
				//启用回调
				typeof callback == 'function' ? callback(query) : '';
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
				_DOM2.default.createDOM(table);
				//获取本地缓存并对列表进行配置
				if (!_Settings2.default.disableCache) {
					_Cache2.default.configTheadForCache(table);
					_Settings2.default.supportAdjust ? _Adjust2.default.resetAdjust(table) : ''; // 通过缓存配置成功后, 重置宽度调整事件源dom
				}
				//绑定宽度调整事件
				if (_Settings2.default.supportAdjust) {
					_Adjust2.default.bindAdjustEvent(table);
				}
				//绑定拖拽换位事件
				if (_Settings2.default.supportDrag) {
					_Drag2.default.bindDragEvent(table);
				}
				//绑定排序事件
				if (_Settings2.default.supportSorting) {
					_Sort2.default.bindSortingEvent(table);
				}
				//绑定表头提示事件
				if (_Settings2.default.supportRemind) {
					_Remind2.default.bindRemindEvent(table);
				}
				//绑定配置列表事件
				if (_Settings2.default.supportConfig) {
					_Config2.default.bindConfigEvent(table);
				}
				//绑定表头吸顶功能
				// if(Settings.supportSetTop){
				_Scroll2.default.bindScrollFunction(table);
				// }
				//绑定右键菜单事件
				_Menu2.default.bindRightMenuEvent(table);
				//渲梁tbodyDOM
				_Core2.default.__refreshGrid();
				//将GridManager实例化对象存放于jTool data
				_Cache2.default.setGridManagerToJTool(table);
			}
		}]);

		return GridManager;
	}();
	// GM导入功能: 配置项


	_jTool2.default.extend(GridManager.prototype, _Settings2.default);
	// GM导入功能: 核心
	_jTool2.default.extend(GridManager.prototype, _Core2.default);
	// GM导入功能: 选择
	_jTool2.default.extend(GridManager.prototype, _Checkbox2.default);
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
	'getCheckedTr', //获取当前选中的行
	'showTh', //显示Th及对应的TD项
	'hideTh', //隐藏Th及对应的TD项
	'exportGridToXls', //导出表格 .xls
	'getLocalStorage', //获取指定表格的本地存储数据
	'resetTd', //重置列表[tbody]
	'setQuery', //配置query 该参数会在分页触发后返回至pagingAfter(query)方法
	'refreshGrid', //刷新表格 使用现有参数重新获取数据，对表格数据区域进行渲染
	'getRowData', //获取当前行渲染时使用的数据
	'clear' //清除指定表的表格记忆数据
	];
	(function ($) {
		// 捆绑至选择器对象
		Element.prototype.GM = Element.prototype.GridManager = function (_name_, _settings_, _callback_) {
			if (this.length == 0) {
				throw new Error('GridManager Error: DOM为空，请确定选择器匹配是否正确');
				return false;
			}
			var table = this;
			var $table = $(table);
			// 特殊情况处理：单组tr进行操作，如resetTd()方法
			if (table.nodeName === 'TR') {
				console.log('resetTd未执行');
				return;
			}
			var name, settings, callback;
			// 格式化参数
			// ex: $(table).GridManager()
			if (arguments.length === 0) {
				name = 'init';
				settings = {};
				callback = undefined;
			}
			// ex: $(table).GridManager('init')
			else if (arguments.length === 1 && $.type(arguments[0]) === 'string' && $.type(arguments[0]) === 'init') {
					name = arguments[0];
					settings = {};
					callback = undefined;
				}
				// ex: $(table).GridManager('get')
				else if (arguments.length === 1 && $.type(arguments[0]) === 'string' && $.type(arguments[0]) !== 'init') {
						name = arguments[0];
						settings = undefined;
						callback = undefined;
					}
					// ex: $(table).GridManager({settings})
					else if (arguments.length === 1 && $.type(arguments[0]) === 'object') {
							name = 'init';
							settings = arguments[0];
							callback = undefined;
						}
						// ex: $(table).GridManager(callback)
						else if (arguments.length === 1 && $.type(arguments[0]) === 'function') {
								name = 'init';
								settings = undefined;
								callback = arguments[0];
							}
							// ex: $(table).GridManager('init', callback)
							else if (arguments.length === 2 && $.type(arguments[0]) === 'string' && $.type(arguments[1]) === 'function') {
									name = arguments[0];
									settings = arguments[1];
									callback = undefined;
								}
								// ex: $(table).GridManager('init', {settings})
								// ex: $(table).GridManager('resetTd', false)
								// ex: $(table).GridManager('exportGridToXls', 'fileName')
								else if (arguments.length === 2 && $.type(arguments[0]) === 'string' && $.type(arguments[1]) !== 'function') {
										name = arguments[0];
										settings = arguments[1];
										callback = undefined;
									}
									// ex: $(table).GridManager({settings}, callback)
									else if (arguments.length === 2 && $.isPlainObject(arguments[0]) && $.type(arguments[1]) === 'function') {
											name = 'init';
											settings = arguments[0];
											callback = arguments[1];
										}
										// ex: $(table).GridManager('resetTd', false)
										else if (arguments.length === 2 && $.type(arguments[0]) === 'string' && $.type(arguments[1]) === 'boolean') {
												name = arguments[0];
												settings = arguments[1];
												callback = undefined;
											}
											// ex: $(table).GridManager('init', {settings}, callback)
											else if (arguments.length === 3) {
													name = arguments[0];
													settings = arguments[1];
													callback = arguments[2];
												}

			if (publishList.indexOf(name) === -1) {
				throw new Error('GridManager Error:方法调用错误，请确定方法名[' + name + ']是否正确');
				return false;
			}
			var gmObj;
			// 当前为初始化方法
			if (name == 'init') {
				var _GM = new GridManager();
				_GM.init($table, settings, _callback_);
				return _GM;
			}
			// 当前为其它方法
			else if (name != 'init') {
					gmObj = $table.data('gridManager');
					var gmData = gmObj[name]($table, settings, callback);
					//如果方法存在返回值则返回，如果没有返回jTool object用于链式操作
					return typeof gmData === 'undefined' ? $table : gmData;
				}
		};
	})(jTool);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _jTool2 = __webpack_require__(2);

	var _jTool3 = _interopRequireDefault(_jTool2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var $ = jTool; /**
	                * jTool: export jTool
	                */

	exports.default = $;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var require;var require;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return require(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
	/*
	 * 动画效果
	 * --动画中的参数对应--
	 * styleObj: 元素将要实现的样式, 只允许为Object格式
	 * time: 执行动画的间隔时间
	 * callback: 动画执行完成后的回调函数
	 * --Ex--
	 * 无回调参数: jTool('#div1').animate({height: '100px', width: '200px'}, 1000);
	 * 无时间参数: jTool('#div1').animate({height: '100px', width: '200px'}, callback);
	 * 完整参数: jTool('#div1').animate({height: '100px', width: '200px'}, 1000, callback);
	 * --注意事项--
	 * show与hide方法只是一个简单的实现,不支持参数及动画效果
	 * */
	var utilities = require('./utilities');
	var _Css = require('../src/Css');

	var _Animate = {
		show: function() {
			utilities.each(this.DOMList, function(i, v) {
				if(v.style.oldDisplay && v.style.oldDisplay !== 'none'){
					v.style.display = v.style.oldDisplay;
				}
				else{
					v.style.display = 'block';
				}
			});
			return this;
		},
		hide: function() {
			utilities.each(this.DOMList, function(i, v){
				v.style.oldDisplay = utilities.getStyle(v, 'display');
				v.style.display = 'none';
			});
			return this;
		},
		// 动画效果, 动画样式仅支持以对象类型传入且值需要存在有效的单位
		animate: function(styleObj, time, callback) {
			var _this = this;
			var animateFromText = '',   // 动画执行前样式文本
				animateToText = '',     // 动画执行后样式文本
				node = _this.DOMList[0];
			// 无有效的参数, 直接跳出. 但并不返回错误.
			if(!styleObj){
				return;
			}
			// 参数转换
			if(utilities.type(callback) === 'undefined' && utilities.type(time) === 'function'){
				callback = time;
				time = 0;
			}
			if(utilities.type(callback) === 'undefined'){
				callback = utilities.noop;
			}
			if(utilities.type(time) === 'undefined'){
				time = 0;
			}
			// 组装动画 keyframes
			utilities.each(styleObj, function(key, v){
				key = utilities.toHyphen(key);
				animateFromText += key + ':' + utilities.getStyle(node, key) + ';';
				animateToText += key + ':' + v + ';';
			});
			// 拼接动画样式文本
			var animateText = '@keyframes jToolAnimate {' +
				'from {' +
				animateFromText +
				'}' +
				'to {' +
				animateToText +
				'}' +
				'}';

			// 引入动画样式至页面
			var jToolAnimate = document.createElement('style');
			jToolAnimate.className = 'jTool-animate-style';
			jToolAnimate.type = 'text/css';
			document.head.appendChild(jToolAnimate);
			jToolAnimate.textContent = jToolAnimate.textContent + animateText;

			// 启用动画
			node.style.animation = 'jToolAnimate ' + time / 1000 + 's ease-in-out forwards';

			// 延时执行回调函数及清理操作
			window.setTimeout(function(){
				_Css.css.call(_this, styleObj);
				node.style.animation = '';
				jToolAnimate.remove();
				callback();
			}, time);
		}
	};

	module.exports = _Animate;

	},{"../src/Css":3,"./utilities":13}],2:[function(require,module,exports){
	var utilities = require('./utilities');

	var _Class = {

	    addClass: function(className) {
	        return this.changeClass(className, 'add');
	    },

		removeClass: function(className) {
	        return this.changeClass(className, 'remove');
	    },

		toggleClass: function(className) {
	        return this.changeClass(className, 'toggle');
	    },

		// 不支持多 className
	    hasClass: function(className) {
		    return [].some.call(this.DOMList, function(dom) {
				return dom.classList.contains(className);
		    });
	    },

	    // 解析className 将以空格间格的字符串分割为数组
	    parseClassName: function(className) {
	        return className.indexOf(' ') ?  className.split(' ') : [className];
	    },

	    // 执行指定classList方法
	    changeClass: function(className, exeName) {
	        var classNameList = this.parseClassName(className);
		    utilities.each(this.DOMList, function(i, dom) {
			    utilities.each(classNameList, function(index, name){
	                dom.classList[exeName](name);
	            });
	        });
	        return this;
	    }
	};

	module.exports = _Class;

	},{"./utilities":13}],3:[function(require,module,exports){
	/*
	 * CSS
	 * */
	var utilities = require('./utilities');

	var _CSS = {
		// 如果长度是带 px 的值, 会将其转换成 数字
		// 其他情况 不做处理, 返回对应的字符串
		// TODO 颜色处理 返回16进制颜色值, 考虑 rgba 的情况
		css: function(key, value) {
			var _this = this;
			var pxList = ['width', 'height', 'top', 'left', 'right', 'bottom',
				'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
				'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
				'border-width', 'border-top-width', 'border-left-width', 'border-right-width', 'border-bottom-width'];

			// getter
			if (utilities.type(key) === 'string' && (!value && value !== 0)) {
				if (pxList.indexOf(key) !== -1) {
					return parseInt(utilities.getStyle(this.DOMList[0], key), 10);
				} else {
					return utilities.getStyle(this.DOMList[0], key);
				}
			}

			// setter
			// ex: {width:13px, height:10px}
			if (utilities.type(key) === 'object') {
				var obj = key;
				for(var k in obj){
					setStyle(k, obj[k]);
				}
			}
			// ex: width, 13px
			else {
				setStyle(key, value);
			}

			function setStyle(name, val) {
				if (utilities.type(val) === 'number') {
					val = val.toString();
				}
				if (pxList.indexOf(name) !== -1 && val.indexOf('px') === -1) {
					val = val + 'px';
				}
				utilities.each(_this.DOMList, function(i, v) {
					v.style[name] = val;
				});
			}
			return this;
		},

		width: function(value){
			return this.css('width', value);
		},

		height: function(value){
			return this.css('height', value);
		}
	};

	module.exports = _CSS;

	},{"./utilities":13}],4:[function(require,module,exports){
	/*
	 * 属性 数据
	 * --注意事项--
	 * #Data0001: 存储值类型为字符或数字时使用setAttribute, Object则存储在dom.dataKey属性下
	 * #Data0002: 获取操作会优先获取dom.dataKey, 如果没有则通过获取getAttribute进行获取
	 * #Data0003: removeData时需要同时清除dom上所对应的属性,而removeAttr则不会清除通过data存储的数据
	 * #Data0004: get操作时, 如果无有效值,则返回undefined
	 * */
	var utilities = require('./utilities');

	var _Data = {
		// data唯一识别码
		dataKey: 'jTool' + utilities.version,
		// 设置\获取对象类属性
		data: function(key, value) {
			var _this = this,
				_data = {};
			// 未指定参数,返回全部
			if (typeof key === 'undefined' && typeof value === 'undefined') {
				return _this.DOMList[0][_this.dataKey];
			}
			// setter
			if (typeof(value) !== 'undefined') {
				var _type = utilities.type(value);
				// #Data0001: 存储值类型为字符或数字时, 使用attr执行
				if (_type === 'string' || _type === 'number') {
					_this.attr(key, value);
				}
				utilities.each(_this.DOMList, function(i, v) {
					_data = v[_this.dataKey] || {};
					_data[key] = value;
					v[_this.dataKey] = _data;
				});
				return this;
			}
			// getter
			else{
				_data = _this.DOMList[0][_this.dataKey] || {};
				//#Data0002: 获取操作会优先获取dom.dataKey, 如果没有则通过获取getAttribute进行获取
				return this.transformValue(_data[key] || _this.attr(key));
			}
		},
		// 删除对象类属性
		removeData: function(key) {
			var _this = this,
				_data;
			if(typeof key === 'undefined'){
				return;
			}
			utilities.each(_this.DOMList, function(i, v){
				_data = v[_this.dataKey] || {};
				delete _data[key];
			});
			// #Data0003: removeData时需要同时清除dom上所对应的属性
			_this.removeAttr(key);
		},
		// 普通属性
		attr: function(key, value){
			// 未指定参数,返回空字符
			if (typeof key === 'undefined' && typeof value === 'undefined') {
				return '';
			}
			// setter
			if (typeof(value) !== 'undefined') {
				utilities.each(this.DOMList, function(i, v) {
					v.setAttribute(key, value);
				});
				return this;
			}
			// getter
			else{
				return this.transformValue(this.DOMList[0].getAttribute(key));
			}
		},
		// 删除普通属性
		removeAttr: function(key) {
			if (typeof key === 'undefined') {
				return;
			}
			utilities.each(this.DOMList, function(i, v){
				v.removeAttribute(key);
			});
		},
		// 配置固有属性
		prop: function(key, value) {
			// 未指定参数,返回空字符
			if (typeof key === 'undefined' && typeof value === 'undefined') {
				return '';
			}
			// setter
			if (typeof(value) !== 'undefined') {
				utilities.each(this.DOMList, function(i, v) {
					v[key] = value;
				});
				return this;
			}
			// getter
			else{
				return this.transformValue(this.DOMList[0][key]);
			}
		},
		// 删除固有属性
		removeProp: function(key) {
			if (typeof key === 'undefined') {
				return;
			}
			utilities.each(this.DOMList, function(i, v){
				delete v[key];
			});
		},
		// attr -> value
		val: function (value) {
			return this.prop('value', value) || '';
		},
		// 值转换
		transformValue: function (value) {
			// null => undefined
			if(utilities.type(value) === 'null') {
				value = undefined;
			}
			return value;
		}
	};

	module.exports = _Data;

	},{"./utilities":13}],5:[function(require,module,exports){
	/*
	 * 文档操作
	 * */
	var utilities = require('./utilities');
	var Sizzle = require('./Sizzle');

	var _Document = {
		append: function(childList){
			return this.html(childList, 'append');
		},

		prepend: function(childList){
			return this.html(childList, 'prepend');
		},

		before: function (node) {
			if(node.jTool){
				node = node.DOMList[0];
			}
			var thisNode = this.DOMList[0];
			var parentEl = thisNode.parentNode;
			parentEl.insertBefore(node, thisNode);
			return this;
		},

		after: function (node) {
			if(node.jTool){
				node = node.DOMList[0];
			}
			var thisNode = this.DOMList[0];
			var parentEl = thisNode.parentNode;
			if(parentEl.lastChild == thisNode){
				parentEl.appendChild(node);
			}else{
				parentEl.insertBefore(node, thisNode.nextSibling);
			}
			//  parentEl.insertBefore(node, thisNode);
		},
		text: function(text){
			// setter
			if (typeof(text) !== 'undefined') {
				utilities.each(this.DOMList, function(i, v){
					v.textContent = text;
				});
				return this;
				// getter
			} else {
				return this.DOMList[0].textContent;
			}
		},
		html: function(childList, insertType) {
			// getter
			if (typeof(childList) == 'undefined' && typeof(insertType) == 'undefined') {
				return this.DOMList[0].innerHTML;
			}
			// setter
			var _this = this;
			var type = utilities.type(childList);
			if (childList.jTool) {
				childList = childList.DOMList;
			}
			else if(type === 'string'){
				childList = utilities.createDOM(childList || '');
			}
			else if(type === 'element'){
				childList = [childList];
			}
			var firstChild;
			utilities.each(_this.DOMList, function(e, element){
				// html
				if(!insertType){
					element.innerHTML = '';
				}
				// prepend
				else if (insertType === 'prepend') {
					firstChild = element.firstChild;
				}
				utilities.each(childList, function(c, child) {
					child = child.cloneNode(true);
					// text node
					if(!child.nodeType){
						child = document.createTextNode(child);
					}
					if(firstChild){
						element.insertBefore(child, firstChild);
					}
					else{
						element.appendChild(child);
					}
					element.normalize();
				});
			});
			return this;
		},
		// TODO 这个方法有问题
		wrap: function (elementText) {
			var selfDOM = '', //存储当前node 的html
				parentNode;  // 存储父节点
			utilities.each(this.DOMList, function(i, v){
				selfDOM = v;
				parentNode = v.parentNode;
				v.outerHTML = elementText;
				// 将原节点添加入wrap中第一个为空的节点内
				parentNode.querySelector(':empty').appendChild(selfDOM);
			});
			return this;
		},
		// 向上寻找匹配节点
		closest: function(selectorText) {
			var _this = this;
			var parentDOM = this.DOMList[0].parentNode;
			if (typeof selectorText === 'undefined') {
				return new Sizzle(parentDOM);
			}
			var target = document.querySelectorAll(selectorText);

			// 递归查找匹配的父级元素
			function getParentNode() {
				if (!parentDOM || target.length === 0 || parentDOM.nodeType !== 1) {
					parentDOM = null;
					return;
				}

				if ([].indexOf.call(target, parentDOM) !== -1) {
					return;
				}

				parentDOM = parentDOM.parentNode;

				getParentNode();
			}

			getParentNode();

			return new Sizzle(parentDOM);
		},

		// 获取当前元素父级,返回jTool对象
		parent: function() {
			return this.closest();
		},
		//克隆节点: 参数deep克隆节点及其后代
		clone: function(deep) {
			return new Sizzle(this.DOMList[0].cloneNode(deep || false));
		},
		//批量删除节点
		remove: function() {
			utilities.each(this.DOMList, function(i, v) {
				v.remove();
			});
		}
	};

	module.exports = _Document;

	},{"./Sizzle":9,"./utilities":13}],6:[function(require,module,exports){
	var utilities = require('./utilities');
	var Sizzle = require('./Sizzle');

	var _Element = {
		// 获取指定DOM Element
		get: function(index){
			return this.DOMList[index];
		},

		// 获取指定索引的jTool对象
		eq: function(index){
			return new Sizzle(this.DOMList[index]);
		},

		// 返回指定选择器的jTool对象
		find: function(selectText) {
			return new Sizzle(selectText, this);
		},

		// 获取当前元素在指定元素中的索引, 当无参数时为当前同级元素中的索引
		index: function (nodeList) {
			var node = this.DOMList[0];
			// 查找范围参数为空时,找寻同层节点
			if (!nodeList) {
				nodeList = node.parentNode.childNodes;
			}
			// 查找范围参数为jTool对象,则使用对象的DOMList
			else if (nodeList.jTool) {
				nodeList = nodeList.DOMList;
			}
			return nodeList ? [].indexOf.call(nodeList, node) : -1;
		}
	};

	module.exports = _Element;

	},{"./Sizzle":9,"./utilities":13}],7:[function(require,module,exports){
	/*
	 * Event 事件
	 * --事件中的参数对应--
	 * event: 事件名
	 * querySelector: 子选择器
	 * callback: 事件触发后执行的函数
	 * useCapture: 指定事件是否在捕获或冒泡阶段执行.true - 事件句柄在捕获阶段执行 false- 默认。事件句柄在冒泡阶段执行
	 * http://stackoverflow.com/questions/2381572/how-can-i-trigger-a-javascript-event-click
	 * --注意事项--
	 * #Event001: 预绑定的事件,无法通过new Event().dispatchEvent()来执行,所以通过属性调用的方式来触发.
	 *            存在父级的元素不会是window 或document 所以不会存在问题.
	 *            目前只有click事件可以通过trigger进行调用, 需要修改.(但是通过真实的事件触发,是不会有问题的)
	 * #Event002: 当前使用的是new Event().dispatchEvent();
	 *            并未使用document.createEvent('HTMLEvents').initEvent(event, true, true).dispatchEvent()
	 *            原因是initEvent已经被新的DOM标准废弃了。
	 * #Event003: 如果存在子选择器,会对回调函数进行包装, 以达到在触发事件时所传参数为当前的window.event对象
	 * --EX--
	 * 在选择元素上绑定一个或多个事件的事件处理函数: .bind('click mousedown', function(){}) 或.on('click mousedown', function(){})
	 * 在选择元素上为当前并不存在的子元素绑定事件处理函数: .on('click mousedown', '.test', function(){})
	 * */
	var utilities = require('./utilities');
	var _Event = {
		on: function(event, querySelector, callback, useCapture) {
			// 将事件触发执行的函数存储于DOM上, 在清除事件时使用
			return this.addEvent(this.getEventObject(event, querySelector, callback, useCapture));
		},

		off: function(event, querySelector) {
			return this.removeEvent(this.getEventObject(event, querySelector));
		},

		bind: function(event, callback, useCapture) {
			return this.on(event, undefined, callback, useCapture);
		},

		unbind: function(event) {
			return this.removeEvent(this.getEventObject(event));
		},

		trigger: function(event) {
			utilities.each(this.DOMList, function(index, element){
				try {
					// #Event001: trigger的事件是直接绑定在当前DOM上的
					if (element.jToolEvent && element.jToolEvent[event].length > 0) {
						var myEvent = new Event(event); // #Event002: 创建一个事件对象，用于模拟trigger效果
						element.dispatchEvent(myEvent);
					}
					// trigger的事件是预绑定在父级或以上级DOM上的
					else {
						element[event]();
					}
				} catch(e) {
					utilities.error('事件:['+ event +']未能正确执行, 请确定方法已经绑定成功');
				}
			});
			return this;
		},

		// 获取 jTool Event 对象
		getEventObject: function(event, querySelector, callback, useCapture) {
			// $(dom).on(event, callback);
			if (typeof querySelector === 'function') {
				useCapture = callback || false;
				callback = querySelector;
				querySelector = undefined;
			}
			// event callback 为必要参数
			if (!event) {
				utilities.error('事件绑定失败,原因: 参数中缺失事件类型');
				return this;
			}

			// 子选择器不存在 或 当前DOM对象包含Window Document 则将子选择器置空
			if(!querySelector || utilities.type(this.DOMList[0]) !== 'element'){
				querySelector = '';
			}
			// #Event003 存在子选择器 -> 包装回调函数, 回调函数的参数
			if(querySelector !== ''){
				var fn = callback;
				callback = function(e){
					// 验证子选择器所匹配的nodeList中是否包含当前事件源
					// 注意: 这个方法为包装函数,此处的this为触发事件的Element
					if([].indexOf.call( this.querySelectorAll(querySelector), e.target) !== -1){
						fn.apply(e.target, arguments);
					}
				};
			}
			var eventSplit = event.split(' ');
			var eventList = [],
				eventScopeSplit,
				eventObj;

			utilities.each(eventSplit, function(i, eventName) {
				if (eventName.trim() === '') {
					return true;
				}

				eventScopeSplit = eventName.split('.');
				eventObj = {
					eventName: eventName + querySelector,
					type: eventScopeSplit[0],
					querySelector: querySelector,
					callback: callback || utilities.noop,
					useCapture: useCapture || false,
					// TODO: nameScope暂时不用
					nameScope: eventScopeSplit[1] || undefined
				};
				eventList.push(eventObj);
			});

			return eventList;
		},

		// 增加事件,并将事件对象存储至DOM节点
		addEvent: function(eventList) {
			var _this = this;
			utilities.each(eventList, function (index, eventObj) {
				utilities.each(_this.DOMList, function(i, v){
					v.jToolEvent = v.jToolEvent || {};
					v.jToolEvent[eventObj.eventName] = v.jToolEvent[eventObj.eventName] || [];
					v.jToolEvent[eventObj.eventName].push(eventObj);
					v.addEventListener(eventObj.type, eventObj.callback, eventObj.useCapture);
				});
			});
			return _this;
		},

		// 删除事件,并将事件对象移除出DOM节点
		removeEvent: function(eventList) {
			var _this = this;
			var eventFnList; //事件执行函数队列
			utilities.each(eventList, function(index, eventObj) {
				utilities.each(_this.DOMList, function(i, v){
					if (!v.jToolEvent) {
						return;
					}
					eventFnList = v.jToolEvent[eventObj.eventName];
					if (eventFnList) {
						utilities.each(eventFnList, function(i2, v2) {
							v.removeEventListener(v2.type, v2.callback);
						});
						v.jToolEvent[eventObj.eventName] = undefined;
					}
				});
			});
			return _this;
		}
	};

	module.exports = _Event;

	},{"./utilities":13}],8:[function(require,module,exports){
	/*
	 * 位置
	 * */
	var utilities = require('./utilities');

	var Offset = {

		// 获取匹配元素在当前视口的相对偏移。
		offset: function() {
			var offest = {
				top: 0,
				left: 0
			};

			var _position;

			getOffset(this.DOMList[0], true);

			return offest;

			// 递归获取 offset, 可以考虑使用 getBoundingClientRect
			function getOffset(node, init) {
				// 非Element 终止递归
				if (node.nodeType !== 1) {
					return;
				}
				_position = utilities.getStyle(node, 'position');

				// position=static: 继续递归父节点
				if (typeof(init) === 'undefined' && _position === 'static') {
					getOffset(node.parentNode);
					return;
				}
				offest.top = node.offsetTop + offest.top - node.scrollTop;
				offest.left = node.offsetLeft + offest.left - node.scrollLeft;

				// position = fixed: 获取值后退出递归
				if (_position === 'fixed') {
					return;
				}

				getOffset(node.parentNode);
			}
		},
		// 获取|设置 匹配元素相对滚动条顶部的偏移 value is number
		scrollTop: function (value) {
			return this.scrollFN(value, 'top');
		},
		// 获取|设置 匹配元素相对滚动条左部的偏移 value is number
		scrollLeft: function (value) {
			return this.scrollFN(value, 'left');
		},
		// 根据参数对位置操作进行get,set分类操作
		scrollFN: function(value, type) {
			var node = this.DOMList[0];
			// setter
			if (value || value === 0) {
				this.setScrollFN(node, type, value);
				return this;
			}
			// getter
			else {
				return this.getScrollFN(node, type);
			}
		},
		// 根据元素的不同对滚动轴进行获取
		getScrollFN: function(node, type){
			// node => window
			if (utilities.isWindow(node)) {
				return type === 'top' ? node.pageYOffset : node.pageXOffset;
			}
			// node => document
			else if (node.nodeType === 9) {
				return type === 'top' ? node.body.scrollTop : node.body.scrollLeft;
			}
			// node => element
			else if (node.nodeType === 1) {
				return type === 'top' ? node.scrollTop : node.scrollLeft;
			}
		},
		// 根据元素的不同对滚动轴进行设置
		setScrollFN: function(node, type, value){
			// node => window
			if (utilities.isWindow(node)) {
				return type === 'top' ? node.document.body.scrollTop = value : node.document.body.scrollLeft = value;
			}
			// node => document
			else if (node.nodeType === 9) {
				return type === 'top' ? node.body.scrollTop = value : node.body.scrollLeft = value;
			}
			// node => element
			else if (node.nodeType === 1) {
				return type === 'top' ? node.scrollTop = value : node.scrollLeft = value;
			}
		}
	};

	module.exports = Offset;

	},{"./utilities":13}],9:[function(require,module,exports){
	/**
	 * Created by baukh on 16/11/25.
	 */
	// Sizzle 选择器, 类似于 jQuery.Sizzle;

	var utilities = require('./utilities');

	var Sizzle = function(selector, context) {

		var DOMList;

		// selector -> undefined || null
		if (!selector) {
			selector = null;
		}

		// selector -> window
		else if (utilities.isWindow(selector)) {
			DOMList = [selector];
			context = undefined;
		}

		// selector -> document
		else if (selector === document) {
			DOMList = [document];
			context = undefined;
		}

		// selector -> DOM
		else if (selector instanceof HTMLElement) {
			DOMList = [selector];
			context = undefined;
		}

		// selector -> NodeList || selector -> Array
		else if (selector instanceof NodeList || selector instanceof Array) {
			DOMList = selector;
			context = undefined;
		}

		// selector -> jTool Object
		else if (selector.jTool) {
			DOMList = selector.DOMList;
			context = undefined;
		}

		// selector -> Html String
		else if (/<.+>/.test(selector)) {
			// TODO
			DOMList = utilities.createDOM(selector);
			context = undefined;
		}

		// selector -> 字符CSS选择器
		else {
			// context -> undefined
			if (!context) {
				DOMList = document.querySelectorAll(selector);
			}

			// context -> 字符CSS选择器
			else if (typeof context === 'string') {
				context = document.querySelectorAll(context);
			}

			// context -> DOM 将HTMLElement转换为数组
			else if (context instanceof HTMLElement) {
				context = [context];
			}

			// context -> NodeList
			else if (context instanceof NodeList) {
				context = context;
			}

			// context -> jTool Object
			else if (context.jTool) {
				context = context.DOMList;
			}

			// 其它不可以用类型
			else {
				context = undefined;
			}

			// 通过父容器获取 NodeList: 存在父容器
			if (context) {
				DOMList = [];
				utilities.each(context, function (i, v) {
					// NodeList 只是类数组, 直接使用 concat 并不会将两个数组中的参数边接, 而是会直接将 NodeList 做为一个参数合并成为二维数组
					utilities.each(v.querySelectorAll(selector), function (i2, v2) {
						DOMList.push(v2);
					});
				});
			}
		}

		if (!DOMList || DOMList.length === 0) {
			DOMList = undefined;
		}

		// 用于确认是否为jTool对象
		this.jTool = true;

		// 用于存储当前选中的节点
		this.DOMList = DOMList;
		this.length = this.DOMList ? this.DOMList.length : 0;

		// 存储选择器条件
		this.querySelector = selector;

		return this;
	};

	module.exports = Sizzle;

	},{"./utilities":13}],10:[function(require,module,exports){
	/*
	 * ajax
	 * type === GET: data格式 name=baukh&age=29
	 * type === POST: data格式 { name: 'baukh', age:29 }
	 * 与 jquery 不同的是,[success, error, complete]返回的第二个参数, 并不是返回错误信息, 而是错误码
	 * */

	var extend = require('./extend');
	var utilities = require('./utilities');

	function ajax(options) {

		var defaults = {
			url: null,
			type: 'GET',
			data: null,
			headers: {},
			async: true,
			beforeSend: utilities.noop,
			complete: utilities.noop,
			success: utilities.noop,
			error: utilities.noop
		};


		options = extend(defaults, options);


		if (!options.url) {
			utilities.error('jTool ajax: url不能为空');
			return;
		}

		var xhr = new XMLHttpRequest();
		var formData = '';
		if (utilities.type(options.data) === 'object') {
			utilities.each(options.data, function (key, value) {
				if(formData !== '') {
					formData += '&';
				}
				formData += key + '=' + value;
			});
		}else {
			formData = options.data;
		}
		if(options.type === 'GET' && formData) {
			options.url = options.url + (options.url.indexOf('?') === -1 ?  '?' : '&') + formData;
			formData = null;
		}

		xhr.open(options.type, options.url, options.async);

		for (var key in options.headers) {
			xhr.setRequestHeader(key, options.headers[key]);
		}

		// 执行发送前事件
		options.beforeSend(xhr);

		// 监听onload并执行完成事件
		xhr.onload = function() {
			// jquery complete(XHR, TS)
			options.complete(xhr, xhr.status);
		};

		// 监听onreadystatechange并执行成功后失败事件
		xhr.onreadystatechange = function() {

			if (xhr.readyState !== 4) {
				return;
			}

			if (xhr.status >= 200 && xhr.status < 300 || xhr.status === 304) {
				// jquery success(XHR, TS)
				options.success(xhr.response, xhr.status);
			} else {
				// jquery error(XHR, TS, statusText)
				options.error(xhr, xhr.status, xhr.statusText);
			}
		};

		xhr.send(formData);
	}

	function post(url, data, callback) {
		ajax({ url: url, type: 'POST', data: data, success: callback });
	}

	module.exports = {
		ajax: ajax,
		post: post
	};

	},{"./extend":11,"./utilities":13}],11:[function(require,module,exports){
	// 可以使用 Object.assign() 方法完成该功能

	function extend() {
		// 参数为空,返回空对象
		if (arguments.length === 0) {
			return {};
		}

		var deep = false, // 是否递归
			i = 1,
			target = arguments[0],
			options;

		// 如果参数只有一个, 将认为是对jTool进行扩展
		if (arguments.length === 1) {
			target = this;
			i = 0;
		}

		// 暂不支持 递归
		if(typeof(target) === 'boolean') {
			// deep = target;
			target = arguments[1] || {};
		}

		for (; i < arguments.length; i++) {
			options = arguments[i] || {};
			for (var p in options) {
				if (options.hasOwnProperty(p)) {
					target[p] = options[p];
				}
			}
		}
		return target;
	}

	module.exports = extend;

	},{}],12:[function(require,module,exports){
	var Sizzle = require('./Sizzle');
	var Extend = require('./extend');
	var Utilities = require('./utilities');
	var Ajax = require('./ajax');
	var _Event = require('./Event');
	var _Css = require('./Css');
	var _Class = require('./Class');
	var _Document = require('./Document');
	var _Offset = require('./Offset');
	var _Element = require('./Element');
	var _Animate = require('./Animate');
	var _Data = require('./Data');

	// 如果需要集成Angular,React,在此处进行集成
	var jTool = function (selector, context){
		return new Sizzle(selector, context);
	};

	// 把jquery原先的jQuery.fn给省略了.原先的方式是 init = jQuery.fn.init; init.prototype = jQuery.fn;
	Sizzle.prototype = jTool.prototype = {};
	// 捆绑jTool 工具
	jTool.extend = jTool.prototype.extend = Extend;
	jTool.extend(Utilities);
	jTool.extend(Ajax);

	//捆绑jTool 方法
	jTool.prototype.extend(_Event);
	jTool.prototype.extend(_Css);
	jTool.prototype.extend(_Class);
	jTool.prototype.extend(_Document);
	jTool.prototype.extend(_Offset);
	jTool.prototype.extend(_Element);
	jTool.prototype.extend(_Animate);
	jTool.prototype.extend(_Data);

	window.jTool = window.$ = jTool;

	module.exports = jTool;

	},{"./Animate":1,"./Class":2,"./Css":3,"./Data":4,"./Document":5,"./Element":6,"./Event":7,"./Offset":8,"./Sizzle":9,"./ajax":10,"./extend":11,"./utilities":13}],13:[function(require,module,exports){
	var toString = Object.prototype.toString;

	var class2type = {
		'[object String]': 'string',
		'[object Boolean]': 'boolean',
		'[object Undefined]': 'undefined',
		'[object Number]': 'number',
		'[object Object]': 'object',
		'[object Error]': 'error',
		'[object Function]': 'function',
		'[object Date]': 'date',
		'[object Array]': 'array',
		'[object RegExp]': 'regexp',
		'[object Null]': 'null',
		'[object NodeList]': 'nodeList',
		'[object Arguments]': 'arguments',
		'[object Window]': 'window',
		'[object HTMLDocument]': 'document'
	};

	function isChrome() {
		return navigator.userAgent.indexOf('Chrome') == -1 ? false : true;
	}

	function isWindow(object) {
		return object !== null && object === object.window;
	}

	function isArray(value) {
		return Array.isArray(value);
	}

	function type(value) {
		return class2type[toString.call(value)] || (value instanceof Element ? 'element' : '');
	}

	function noop() {}

	function each(object, callback) {

		// 当前为jTool对象,循环目标更换为jTool.DOMList
		if(object && object.jTool){
			object = object.DOMList;
		}

		var objType = type(object);

		// 为类数组时, 返回: index, value
		if (objType === 'array' || objType === 'nodeList' || objType === 'arguments') {
			// 由于存在类数组 NodeList, 所以不能直接调用 every 方法
			[].every.call(object, function(v, i){
				var tmp = isWindow(v) ? noop() : (v.jTool ? v = v.get(0) : noop()); // 处理jTool 对象
				return callback.call(v, i, v) === false ? false : true;
			});
		} else if (objType === 'object') {
			for(var i in object){
				if(callback.call(object[i], i, object[i]) === false) {
					break;
				}
			}
		}
	}

	// 清除字符串前后的空格
	function trim(text) {
		return text.trim();
	}

	// 抛出异常信息
	function error(msg){
		throw new Error('[jTool Error: '+ msg + ']');
	}

	// 检测是否为空对象
	function isEmptyObject(obj) {

		var isEmptyObj = true;

		for (var pro in obj) {
			if(obj.hasOwnProperty(pro)) {
				isEmptyObj = false;
			}
		}

		return isEmptyObj;
	}

	// 获取节点样式: key为空时则返回全部
	function getStyle(dom, key){
		return key ? window.getComputedStyle(dom)[key] : window.getComputedStyle(dom);
	}

	// 获取样式的单位
	function getStyleUnit(style) {
		var unitList = ['px', 'vem', 'em', '%'],
			unit = '';

		// 样式本身为纯数字,则直接返回单位为空
		if(typeof(style) === 'number'){
			return unit;
		}

		each(unitList, function (i, v) {
			if(style.indexOf(v) !== -1){
				unit = v;
				return false;
			}
		});

		return unit;
	}

	// 字符格式转换: 连字符转驼峰
	function toHump(text) {
		return text.replace(/-\w/g, function(str){
			return str.split('-')[1].toUpperCase();
		});
	}

	//字符格式转换: 驼峰转连字符
	function toHyphen(text) {
		return text.replace(/([A-Z])/g,"-$1").toLowerCase();
	}

	// 通过html字符串, 生成DOM.  返回生成后的子节点
	// 该方法无处处理包含table标签的字符串,但是可以处理table下属的标签
	function createDOM(htmlString) {
		var jToolDOM = document.querySelector('#jTool-create-dom');
		if (!jToolDOM || jToolDOM.length === 0) {
			// table标签 可以在新建element时可以更好的容错.
			// div标签, 添加thead,tbody等表格标签时,只会对中间的文本进行创建
			// table标签,在添加任务标签时,都会成功生成.且会对table类标签进行自动补全
			var el = document.createElement('table');
			el.id = 'jTool-create-dom';
			el.style.display = 'none';
			document.body.appendChild(el);
			jToolDOM = document.querySelector('#jTool-create-dom');
		}

		jToolDOM.innerHTML = htmlString || '';
		var childNodes = jToolDOM.childNodes;

		// 进行table类标签清理, 原因是在增加如th,td等table类标签时,浏览器会自动补全节点.
		if (childNodes.length == 1 && !/<tbody|<TBODY/.test(htmlString) && childNodes[0].nodeName === 'TBODY') {
			childNodes = childNodes[0].childNodes;
		}
		if (childNodes.length == 1 && !/<thead|<THEAD/.test(htmlString) && childNodes[0].nodeName === 'THEAD') {
			childNodes = childNodes[0].childNodes;
		}
		if (childNodes.length == 1 && !/<tr|<TR/.test(htmlString) &&  childNodes[0].nodeName === 'TR') {
			childNodes = childNodes[0].childNodes;
		}
		if (childNodes.length == 1 && !/<td|<TD/.test(htmlString) && childNodes[0].nodeName === 'TD') {
			childNodes = childNodes[0].childNodes;
		}
		if (childNodes.length == 1 && !/<th|<TH/.test(htmlString) && childNodes[0].nodeName === 'TH') {
			childNodes = childNodes[0].childNodes;
		}
		jToolDOM.remove();
		return childNodes;
	}

	module.exports = {
		isWindow: isWindow,
		isChrome: isChrome,
		isArray: isArray,
		noop: noop,
		type: type,
		toHyphen: toHyphen,
		toHump: toHump,
		getStyleUnit: getStyleUnit,
		getStyle: getStyle,
		isEmptyObject: isEmptyObject,
		trim: trim,
		error: error,
		each: each,
		createDOM: createDOM,
		version: '1.1.0'
	};

	},{}]},{},[12]);


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

	var _Settings = __webpack_require__(6);

	var _Settings2 = _interopRequireDefault(_Settings);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/*
	 * Adjust: 宽度调整
	 * */
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
				var _dragAction = (0, _jTool2.default)(this);
				var _th = _dragAction.closest('th'),
				    //事件源所在的th
				_tr = _th.parent(),
				    //事件源所在的tr
				_table = _tr.closest('table'),
				    //事件源所在的table
				_tableDiv = _table.closest('.table-div'),
				    //事件源所在的DIV
				_allTh = _tr.find('th[th-visible="visible"]'),
				    //事件源同层级下的所有th
				_nextTh = _allTh.eq(_th.index() + 1),
				    //事件源下一个可视th
				_last = _allTh.eq(_allTh.length - 1),
				    //事件源同层级倒数第一个th
				_lastButOne = _allTh.eq(_allTh.length - 2),
				    //事件源同层级倒数第二个th
				_td = _Base2.default.getRowTd(_th); //存储与事件源同列的所有td
				// 宽度调整触发回调事件
				_Settings2.default.adjustBefore(event);
				//重置width 防止auto现象
				_jTool2.default.each(_allTh, function (i, v) {
					if (v.style.width == 'auto' || v.style.width == '') {
						//	$(v).css('width',$(v).width());
						(0, _jTool2.default)(v).width((0, _jTool2.default)(v).width());
					}
				});
				//增加宽度调整中样式
				_th.addClass('adjust-selected');
				_td.addClass('adjust-selected');
				//绑定鼠标拖动事件
				var _w, _w2;
				var _realWidthForThText = _Base2.default.getTextWidth(_th);
				_table.unbind('mousemove');
				_table.bind('mousemove', function (e) {
					_w = e.clientX - _th.offset().left - _th.css('padding-left') - _th.css('padding-right');
					//限定最小值
					if (_w < _realWidthForThText) {
						_w = _realWidthForThText;
					}
					//触发源为倒数第二列时 缩小倒数第一列
					if (_th.index() == _lastButOne.index()) {
						_w2 = _th.width() - _w + _last.width();
						_last.width(Math.ceil(_w2 < _realWidthForThText ? _realWidthForThText : _w2));
					}
					_th.css('width', Math.ceil(_w));
					//_isSame:table的宽度与table-div宽度是否相同
					//Chrome下 宽度会精确至小数点后三位 且 使用width时会进行四舍五入，需要对其进行特殊处理 宽度允许相差1px
					var _isSame = _jTool2.default.isChrome() ? _table.get(0).offsetWidth == _tableDiv.width() || _table.get(0).offsetWidth == _tableDiv.width() + 1 || _table.get(0).offsetWidth == _tableDiv.width() - 1 : _table.get(0).offsetWidth == _tableDiv.width();
					//table宽度与table-div宽度相同 且 当前处理缩小HT宽度操作时
					if (_isSame && _th.width() > _w) {
						_nextTh.width(Math.ceil(_nextTh.width() + _th.width() - _w));
					}
					//重置镜像滚动条的宽度
					// if(Settings.supportScroll){
					// 	$(Settings.scrollDOM).trigger('scroll');
					// }
				});

				//绑定鼠标放开、移出事件
				_table.unbind('mouseup mouseleave');
				_table.bind('mouseup mouseleave', function () {
					_table.unbind('mousemove mouseleave');
					_th.removeClass('adjust-selected');
					_td.removeClass('adjust-selected');
					//重置镜像滚动条的宽度
					// if(Settings.supportScroll){
					// 	$(Settings.scrollDOM).trigger('scroll');
					// }
					//缓存列表宽度信息
					_Cache2.default.setToLocalStorage(_table);
					// 宽度调整成功回调事件
					_Settings2.default.adjustAfter(event);
				});
				return false;
			});
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
	};
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

	var _Settings = __webpack_require__(6);

	var _Settings2 = _interopRequireDefault(_Settings);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Cache = {
		/*
	 * @缓存数据
	 * 用于存储当前渲染表格的数据
	 * 通过每个tr上的cache-key进行获取
	 * */
		cacheData: {}
		/*
	  * [对外公开方法]
	  * @获取当前行渲染时使用的数据
	  * $.table:当前操作的grid,由插件自动传入
	  * $.tr: 将要获取数据所对应的tr[tr DOM]
	  * */
		, getRowData: function getRowData(table, tr) {
			return this.cacheData[(0, _jTool2.default)(tr).attr('cache-key')];
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
			this.clear(table);
			this.outLog(v.getAttribute('grid-manager') + '清除缓存成功,清除原因：' + cleanText, 'info');
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
	  * $table: table jTool
	  * */
		, getLocalStorageKey: function getLocalStorageKey($table) {
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
			if (!$table || $table.length === 0) {
				_Base2.default.outLog('getLocalStorage:无效的table', 'error');
				return false;
			}
			var _gridKey = $table.attr('grid-manager');
			//验证当前表是否为GridManager
			if (!_gridKey || _jTool2.default.trim(_gridKey) == '') {
				_Base2.default.outLog('getLocalStorage:无效的grid-manager', 'error');
				return false;
			}
			return window.location.pathname + window.location.hash + '-' + _gridKey;
		}
		/*
	 * @根据本地缓存thead配置列表: 获取本地缓存, 存储原位置顺序, 根据本地缓存进行配置
	 * $.table: table [jTool object]
	 * */
		, configTheadForCache: function configTheadForCache(table) {
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
					if (_Settings2.default.supportAdjust && _th.attr('gm-create') !== 'true') {
						_th.css('width', _thJson.th_width);
					}
					//配置列排序数据
					if (_Settings2.default.supportDrag && typeof _thJson.th_index !== 'undefined') {
						_domArray[_thJson.th_index] = _th;
					} else {
						_domArray[i2] = _th;
					}
					//配置列的可见
					if (_Settings2.default.supportConfig) {
						_Base2.default.setAreVisible(_th, typeof _thJson.isShow == 'undefined' ? true : _thJson.isShow, true);
					}
				});
				//配置列的顺序
				if (_Settings2.default.supportDrag) {
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
			var _this = this;
			//当前为禁用缓存模式，直接跳出
			if (_Settings2.default.disableCache) {
				return;
			}
			var _table = (0, _jTool2.default)(table);
			//当前表是否禁用缓存  被禁用原因是用户缺失了必要的参数
			var noCache = _table.attr('no-cache');
			if (noCache && noCache == 'true') {
				_Base2.default.outLog('缓存已被禁用：当前表缺失必要html标签属性[grid-manager或th-name]', 'info');
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
			var _gridKey = _table.attr('grid-manager');
			//验证当前表是否为GridManager
			if (!_gridKey || _jTool2.default.trim(_gridKey) == '') {
				_Base2.default.outLog('setToLocalStorage:无效的grid-manager', 'error');
				return false;
			}
			var _cache = {},
			    _cacheString = '',
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
				_thData.th_name = v.getAttribute('th-name');
				if (_Settings2.default.supportDrag) {
					_thData.th_index = $v.index();
				}
				if (_Settings2.default.supportAdjust) {
					//用于处理宽度在特定情况下发生异常
					isInit ? $v.css('width', $v.css('width')) : '';
					_thData.th_width = v.offsetWidth;
				}
				if (_Settings2.default.supportConfig) {
					_thData.isShow = (0, _jTool2.default)('.config-area li[th-name="' + _thData.th_name + '"]', _table.closest('.table-wrap')).find('input[type="checkbox"]').get(0).checked;
				}
				_thCache.push(_thData);
			});
			_cache.th = _thCache;
			//存储分页
			if (_Settings2.default.supportAjaxPage) {
				_pageCache.pSize = (0, _jTool2.default)('select[name="pSizeArea"]', _table.closest('.table-wrap')).val();
				_cache.page = _pageCache;
			}
			_cacheString = JSON.stringify(_cache);
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
			table.data('originalThDOM', (0, _jTool2.default)('thead th', table));
		}
		/*
	  @获取原Th DOM至table data
	  $.table: table [jTool object]
	  */
		, getOriginalThDOM: function getOriginalThDOM(table) {
			return (0, _jTool2.default)(table).data('originalThDOM');
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
	}; /*
	   * @Cache: 本地缓存
	   * */
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
			if (!this.isDevelopMode && !type) {
				return console.log('GridManager:', msg);
			} else if (!this.isDevelopMode && type === 'info') {
				return console.info('GridManager Info: ', msg);
			} else if (!this.isDevelopMode && type === 'warn') {
				return console.warn('GridManager Warn: ', msg);
			} else if (type === 'error') {
				return console.error('GridManager Error: ', msg);
			}
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

			_jTool2.default.each(trList, function (i, v) {
				tdList.push((0, _jTool2.default)('td', v).get(thIndex));
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
					_tdList.push((0, _jTool2.default)(v2).find('td').eq(_th.index()));
				});
				//显示
				if (_visible_) {
					_th.attr('th-visible', 'visible');
					_jTool2.default.each(_tdList, function (i2, v2) {
						(0, _jTool2.default)(v2).show();
					});
					_checkLi.addClass('checked-li');
					_checkbox.get(0).checked = true;
				}
				//隐藏
				else {
						_th.attr('th-visible', 'none');
						_jTool2.default.each(_tdList, function (i2, v2) {
							(0, _jTool2.default)(v2).hide();
						});
						_checkLi.removeClass('checked-li');
						_checkbox.get(0).checked = false;
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
			var thWidth = textDreamland.width() + (Number(thPaddingLeft) ? Number(thPaddingLeft) : 0) + (Number(thPaddingRight) ? Number(thPaddingRight) : 0) + (remindAction.length == 1 ? 20 : 5) + (sortingAction.length == 1 ? 20 : 5);
			return thWidth;
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

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Settings = {
		// 版本号
		version: '2.1.0',
		// 是否为开发模式，为true时将打印事件日志
		isDevelopMode: false,

		//当前基本路径[用于加载分页所需样式文件]
		basePath: '',

		// 是否使用默认的table样式
		useDefaultStyle: true,

		// 拖拽
		supportDrag: true, // 是否支持拖拽功能
		dragBefore: _jTool2.default.noop, // 拖拽前事件
		dragAfter: _jTool2.default.noop, // 拖拽后事件

		// 列表内是否存在实时刷新[平时尽量不要设置为true，以免消耗资源]
		isRealTime: false,

		// 宽度调整
		supportAdjust: true, // 是否支持宽度调整功能
		adjustBefore: _jTool2.default.noop, // 宽度调整前事件
		adjustAfter: _jTool2.default.noop, // 宽度调整后事件

		// 是否支持表头提示信息[需在地应的TH上增加属性remind]
		supportRemind: false,

		// 是否支持配置列表功能[操作列是否可见]
		supportConfig: true,

		// 是否支持表头置顶
		// supportSetTop: true,

		// 宽度配置
		width: '100%',

		// 高度配置, 可配置的最小宽度为300px
		height: '300px',

		//是否支持表头置顶
		// scrollDOM: window,

		// 特殊情况下才进行设置，在有悬浮物遮挡住表头置顶区域时进行使用，配置值为遮挡的高度
		topValue: 0,

		// 动画效果时长
		animateTime: 300,

		// 是否禁用本地缓存
		disableCache: false,

		// 是否自动加载CSS文件
		autoLoadCss: false,
		// 排序 sort
		supportSorting: false, //排序：是否支持排序功能
		isCombSorting: false, //是否为组合排序[只有在支持排序的情况下生效
		sortData: {}, //存储排序数据[不对外公开参数]
		sortUpText: 'up', //排序：升序标识[该标识将会传至数据接口]
		sortDownText: 'down', //排序：降序标识[该标识将会传至数据接口]
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
		pageCssFile: '', //分页样式文件路径[用户自定义分页样式]

		//序目录
		supportAutoOrder: true, //是否支持自动序目录
		// baukh20161104:移除 orderThName		: 'order',					//序目录所使用的th-name

		//全选项
		supportCheckbox: true, //是否支持选择与反选
		// baukh20161104:移除 checkboxThName		: 'gm-checkbox',			//选择与反选列所使用的th-name
		//国际化
		i18n: 'zh-cn', //选择使用哪种语言，暂时支持[zh-cn:简体中文，en-us:美式英语] 默认zh-cn

		//用于支持通过数据渲染DOM
		columnData: [], //表格列数据配置项
		gridManagerName: '', //表格grid-manager所对应的值[可在html中配置]
		ajax_url: '', //获取表格数据地址，配置该参数后，将会动态获取数据
		ajax_type: 'GET', //ajax请求类型['GET', 'POST']默认GET
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

	var _Core = __webpack_require__(8);

	var _Core2 = _interopRequireDefault(_Core);

	var _Settings = __webpack_require__(6);

	var _Settings2 = _interopRequireDefault(_Settings);

	var _Cache = __webpack_require__(4);

	var _Cache2 = _interopRequireDefault(_Cache);

	var _I18n = __webpack_require__(12);

	var _I18n2 = _interopRequireDefault(_I18n);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/*
	 * AjaxPage: 分页
	 * */
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
			var _this = this;
			var table = (0, _jTool2.default)(table),
			    tableWarp = table.closest('.table-wrap'),
			    pageToolbar = (0, _jTool2.default)('.page-toolbar', tableWarp); //分页工具条
			var sizeData = _Settings2.default.sizeData;
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
	  $._tableDOM_: table的juqery实例化对象
	  $._pageData_:分页数据格式
	  */
		, createPageDOM: function createPageDOM(_tableDOM_, _pageData_) {
			var table = (0, _jTool2.default)(_tableDOM_),
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
	  $._tableDOM_: table的juqery实例化对象
	  $._sizeData_: 选择框自定义条数
	  */
		, createPageSizeDOM: function createPageSizeDOM(_tableDOM_, _sizeData_) {
			var table = (0, _jTool2.default)(_tableDOM_),
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
	  $._tableDOM_: table的juqery实例化对象
	  */
		, bindPageJumpEvent: function bindPageJumpEvent(_tableDOM_) {
			var _this = this;
			var table = (0, _jTool2.default)(_tableDOM_),
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
				_this.gotoPage(cPage);
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
				_this.gotoPage(_inputValue);
				this.value = '';
			});
			//绑定刷新界面事件
			refreshAction.unbind('click');
			refreshAction.bind('click', function () {
				var _tableWarp = (0, _jTool2.default)(this).closest('.table-wrap'),
				    _input = (0, _jTool2.default)('.page-toolbar .gp-input', _tableWarp),
				    _value = _input.val();
				//跳转输入框为空时: 刷新当前菜
				if (_value.trim() === '') {
					_Core2.default.__refreshGrid();
					return;
				}
				//跳转输入框不为空时: 验证输入值是否有效,如果有效跳转至指定页,如果无效对输入框进行聚焦
				var _inputValue = parseInt(_input.val(), 10);
				if (!_inputValue) {
					_input.focus();
					return;
				}
				_this.gotoPage(_inputValue);
				_input.val('');
			});
		}
		/*
	 * @跳转至指定页
	 * */
		, gotoPage: function gotoPage(_cPage) {
			//跳转的指定页大于总页数
			if (_cPage > _Settings2.default.pageData.tPage) {
				_cPage = _Settings2.default.pageData.tPage;
			}
			//替换被更改的值
			_Settings2.default.pageData.cPage = _cPage;
			_Settings2.default.pageData.pSize = _Settings2.default.pageData.pSize || _Settings2.default.pageSize;

			//调用事件、渲染DOM
			var query = _jTool2.default.extend({}, _Settings2.default.query, _Settings2.default.sortData, _Settings2.default.pageData);
			_Settings2.default.pagingBefore(query);
			_Core2.default.__refreshGrid(function () {
				_Settings2.default.pagingAfter(query);
			});
		}
		/*
	  @绑定设置当前页显示数事件
	  $._tableDOM_: table的juqery实例化对象
	  */
		, bindSetPageSizeEvent: function bindSetPageSizeEvent(_tableDOM_) {
			var table = (0, _jTool2.default)(_tableDOM_),
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
				_Settings2.default.pageData = {
					cPage: 1,
					pSize: parseInt(_size.val())
				};

				_Cache2.default.setToLocalStorage(_table);
				//调用事件、渲染tbody
				var query = _jTool2.default.extend({}, _Settings2.default.query, _Settings2.default.sortData, _Settings2.default.pageData);
				_Settings2.default.pagingBefore(query);
				_Core2.default.__refreshGrid(function () {
					_Settings2.default.pagingAfter(query);
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
			var _this = this;
			if (isNaN(parseInt(totals, 10))) {
				return;
			}
			var _pageData = getPageData(totals);
			//生成分页DOM节点
			_this.createPageDOM(table, _pageData);
			//重置当前页显示条数
			_this.resetPSize(table, _pageData);

			var table = (0, _jTool2.default)(table),
			    tableWarp = table.closest('.table-wrap'),
			    pageToolbar = (0, _jTool2.default)('.page-toolbar', tableWarp); //分页工具条
			_jTool2.default.extend(_Settings2.default.pageData, _pageData); //存储pageData信息
			pageToolbar.show();

			//计算分页数据
			function getPageData(tSize) {
				var _pSize = _Settings2.default.pageData.pSize || _Settings2.default.pageSize,
				    _tSize = tSize,
				    _cPage = _Settings2.default.pageData.cPage || 1;
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
			var _data = _Cache2.default.getLocalStorage(table),
			    //本地缓存的数据
			_cache = _data.cache,
			    //缓存对应
			_pSize; //每页显示条数
			//验证是否存在每页显示条数缓存数据
			if (!_cache || !_cache.page || !_cache.page.pSize) {
				_pSize = _Settings2.default.pageSize || 10.;
			} else {
				_pSize = _cache.page.pSize;
			}
			_Settings2.default.pageData = {
				pSize: _pSize,
				cPage: 1
			};
		}
	};
	exports.default = AjaxPage;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _jTool = __webpack_require__(1);

	var _jTool2 = _interopRequireDefault(_jTool);

	var _Base = __webpack_require__(5);

	var _Base2 = _interopRequireDefault(_Base);

	var _DOM = __webpack_require__(9);

	var _DOM2 = _interopRequireDefault(_DOM);

	var _Cache = __webpack_require__(4);

	var _Cache2 = _interopRequireDefault(_Cache);

	var _Settings = __webpack_require__(6);

	var _Settings2 = _interopRequireDefault(_Settings);

	var _AjaxPage = __webpack_require__(7);

	var _AjaxPage2 = _interopRequireDefault(_AjaxPage);

	var _Menu = __webpack_require__(18);

	var _Menu2 = _interopRequireDefault(_Menu);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Core = {
		/*
	  [对外公开方法]
	  @刷新表格 使用现有参数重新获取数据，对表格数据区域进行渲染
	  $.table:当前操作的grid,由插件自动传入
	  $.gotoFirstPage:  是否刷新时跳转至第一页
	  $.callback: 回调函数
	  */
		refreshGrid: function refreshGrid(table, gotoFirstPage, callback) {
			var _this = this;
			if (typeof gotoFirstPage !== 'boolean') {
				callback = gotoFirstPage;
				gotoFirstPage = false;
			}
			if (gotoFirstPage) {
				_Settings2.default.pageData['cPage'] = 1;
			}
			_this.__refreshGrid(callback);
		}
		/*
	  @刷新表格 使用现有参数重新获取数据，对表格数据区域进行渲染
	  $.callback: 回调函数
	  */
		, __refreshGrid: function __refreshGrid(callback) {
			var _this = this;
			var tableDOM = (0, _jTool2.default)('table[grid-manager="' + _Settings2.default.gridManagerName + '"]'),
			    //table dom
			tbodyDOM = (0, _jTool2.default)('tbody', tableDOM),
			    //tbody dom
			refreshAction = (0, _jTool2.default)('.page-toolbar .refresh-action', tableDOM.closest('.table-wrap')); //刷新按纽
			//增加刷新中标识
			refreshAction.addClass('refreshing');
			/*
	   使用配置数据
	   如果存在配置数据ajax_data,将不再通过ajax_rul进行数据请求
	   且ajax_beforeSend、ajax_error、ajax_complete将失效，仅有ajax_success会被执行
	   */
			if (_Settings2.default.ajax_data) {
				driveDomForSuccessAfter(_Settings2.default.ajax_data);
				_Settings2.default.ajax_success(_Settings2.default.ajax_data);
				removeRefreshingClass();
				typeof callback === 'function' ? callback() : '';
				return;
			}
			if (typeof _Settings2.default.ajax_url != 'string' || _Settings2.default.ajax_url === '') {
				_Settings2.default.outLog('请求表格数据失败！参数[ajax_url]配制错误', 'error');
				removeRefreshingClass();
				typeof callback === 'function' ? callback() : '';
				return;
			}
			var parme = _jTool2.default.extend({}, _Settings2.default.query);
			//合并分页信息至请求参
			if (_Settings2.default.supportAjaxPage) {
				_jTool2.default.extend(parme, _Settings2.default.pageData);
			}
			//合并排序信息至请求参
			if (_Settings2.default.supportSorting) {
				_jTool2.default.extend(parme, _Settings2.default.sortData);
			}
			//当前页小于1时, 修正为1
			if (parme.cPage < 1) {
				parme.cPage = 1;
				//当前页大于总页数时, 修正为总页数
			} else if (parme.cPage > parme.tPage) {
				parme.cPage = parme.tPage;
			}
			//执行ajax前事件
			_jTool2.default.ajax({
				url: _Settings2.default.ajax_url,
				type: _Settings2.default.ajax_type,
				data: parme,
				cache: true,
				beforeSend: function beforeSend(XMLHttpRequest) {
					_Settings2.default.ajax_beforeSend(XMLHttpRequest);
				},
				success: function success(response) {
					driveDomForSuccessAfter(response);
					_Settings2.default.ajax_success(response);
				},
				error: function error(XMLHttpRequest, textStatus, errorThrown) {
					_Settings2.default.ajax_error(XMLHttpRequest, textStatus, errorThrown);
				},
				complete: function complete(XMLHttpRequest, textStatus) {
					_Settings2.default.ajax_complete(XMLHttpRequest, textStatus);
					removeRefreshingClass();
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
				var _data = parseRes[_Settings2.default.dataKey];
				var key, //数据索引
				alignAttr, //文本对齐属性
				template, //数据模板
				templateHTML; //数据模板导出的html
				_Cache2.default.cacheData = {};
				//数据为空时
				if (!_data || _data.length === 0) {
					tbodyTmpHTML = '<tr emptyTemplate>' + '<td colspan="' + (0, _jTool2.default)('th[th-visible="visible"]', tableDOM).length + '">' + (_Settings2.default.emptyTemplate || '<div class="gm-emptyTemplate">数据为空</div>') + '</td>' + '</tr>';
					parseRes.totals = 0;
					tbodyDOM.html(tbodyTmpHTML);
				} else {
					_jTool2.default.each(_data, function (i, v) {
						_Cache2.default.cacheData[i] = v;
						tbodyTmpHTML += '<tr cache-key="' + i + '">';
						_jTool2.default.each(_Settings2.default.columnData, function (i2, v2) {
							key = v2.key;
							template = v2.template;
							templateHTML = typeof template === 'function' ? template(v[key], v) : v[key];
							alignAttr = v2.align ? 'align="' + v2.align + '"' : '';
							tbodyTmpHTML += '<td ' + alignAttr + '>' + templateHTML + '</td>';
						});
						tbodyTmpHTML += '</tr>';
					});
					tbodyDOM.html(tbodyTmpHTML);
					_DOM2.default.resetTd(tableDOM, false);
				}
				//渲染分页
				if (_Settings2.default.supportAjaxPage) {
					_AjaxPage2.default.resetPageData(tableDOM, parseRes[_Settings2.default.totalsKey]);
					_Menu2.default.checkMenuPageAction();
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
			table.GridManager('get')['query'] = query;
		}

	}; /*
	   * Core: 核心方法
	   * */
	exports.default = Core;

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _jTool = __webpack_require__(1);

	var _jTool2 = _interopRequireDefault(_jTool);

	var _Adjust = __webpack_require__(3);

	var _Adjust2 = _interopRequireDefault(_Adjust);

	var _AjaxPage = __webpack_require__(7);

	var _AjaxPage2 = _interopRequireDefault(_AjaxPage);

	var _Cache = __webpack_require__(4);

	var _Cache2 = _interopRequireDefault(_Cache);

	var _Config = __webpack_require__(10);

	var _Config2 = _interopRequireDefault(_Config);

	var _Checkbox = __webpack_require__(11);

	var _Checkbox2 = _interopRequireDefault(_Checkbox);

	var _Base = __webpack_require__(5);

	var _Base2 = _interopRequireDefault(_Base);

	var _Export = __webpack_require__(13);

	var _Export2 = _interopRequireDefault(_Export);

	var _Order = __webpack_require__(14);

	var _Order2 = _interopRequireDefault(_Order);

	var _Remind = __webpack_require__(15);

	var _Remind2 = _interopRequireDefault(_Remind);

	var _Scroll = __webpack_require__(16);

	var _Scroll2 = _interopRequireDefault(_Scroll);

	var _Sort = __webpack_require__(17);

	var _Sort2 = _interopRequireDefault(_Sort);

	var _Settings = __webpack_require__(6);

	var _Settings2 = _interopRequireDefault(_Settings);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var DOM = {
		/*
	  @渲染HTML，根据配置嵌入所需的事件源DOM
	  $.table: table[jTool对象]
	  */
		createDOM: function createDOM(table) {
			var _this = this;
			table.attr('width', '100%').attr('cellspacing', 1).attr('cellpadding', 0).attr('grid-manager', _Settings2.default.gridManagerName);
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
			_jTool2.default.each(_Settings2.default.columnData, function (i, v) {
				// 表头提醒
				if (_Settings2.default.supportRemind && typeof v.remind === 'string' && v.remind !== '') {
					remindHtml = 'remind="' + v.remind + '"';
				}
				// 排序
				sortingHtml = '';
				if (_Settings2.default.supportSorting && typeof v.sorting === 'string') {
					if (v.sorting === _Settings2.default.sortDownText) {
						sortingHtml = 'sorting="' + _Settings2.default.sortDownText + '"';
						_Settings2.default.sortData[v.key] = _Settings2.default.sortDownText;
					} else if (v.sorting === _Settings2.default.sortUpText) {
						sortingHtml = 'sorting="' + _Settings2.default.sortUpText + '"';
						_Settings2.default.sortData[v.key] = _Settings2.default.sortUpText;
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
			if (_Settings2.default.supportAutoOrder) {
				_Order2.default.initDOM(table);
			}
			//嵌入选择返选DOM
			if (_Settings2.default.supportCheckbox) {
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
			if (_Settings2.default.supportAjaxPage) {
				var _ajaxPageHtml = _AjaxPage2.default.html();
			}
			var wrapHtml,
			    //外围的html片段
			setTopHtml = '',
			    //表头置顶html片段
			tableWarp,
			    //单个table所在的DIV容器
			onlyThead,
			    //单个table下的thead
			onlyThList,
			    //单个table下的TH
			onlyTH,
			    //单个TH
			onlyThWarp,
			    //单个TH下的上层DIV
			thPadding,
			    //TH当前的padding值
			remindDOM,
			    //表头提醒DOM
			adjustDOM,
			    //调整宽度DOM
			sortingDom,
			    //排序DOM
			sortType,
			    //排序类形
			isLmOrder,
			    //是否为插件自动生成的序号列
			isLmCheckbox; //是否为插件自动生成的选择列

			//根据配置使用默认的表格样式
			if (_Settings2.default.useDefaultStyle) {
				table.addClass('grid-manager-default');
			}
			onlyThead = (0, _jTool2.default)('thead', table);
			onlyThList = (0, _jTool2.default)('th', onlyThead);
			//表头置顶
			// if(Settings.supportSetTop){
			setTopHtml = _Scroll2.default.initDOM();
			// }
			wrapHtml = '<div class="table-wrap"><div class="table-div" style="height: ' + _Settings2.default.height + '"></div>' + setTopHtml + '<span class="text-dreamland"></span></div>';
			table.wrap(wrapHtml);
			tableWarp = table.closest('.table-wrap');
			//嵌入配置列表DOM
			if (_Settings2.default.supportConfig) {
				tableWarp.append(_configHtml);
			}
			//嵌入Ajax分页DOM
			if (_Settings2.default.supportAjaxPage) {
				tableWarp.append(_ajaxPageHtml);
				_AjaxPage2.default.initAjaxPage(table);
			}
			//嵌入导出表格数据事件源
			if (_Settings2.default.supportExport) {
				tableWarp.append(exportActionHtml);
			}
			_jTool2.default.each(onlyThList, function (i2, v2) {
				onlyTH = (0, _jTool2.default)(v2);
				onlyTH.attr('th-visible', 'visible');
				//是否为自动生成的序号列
				if (_Settings2.default.supportAutoOrder && onlyTH.attr('gm-order') === 'true') {
					isLmOrder = true;
				} else {
					isLmOrder = false;
				}

				//是否为自动生成的选择列
				if (_Settings2.default.supportCheckbox && onlyTH.attr('gm-checkbox') === 'true') {
					isLmCheckbox = true;
				} else {
					isLmCheckbox = false;
				}

				onlyThWarp = (0, _jTool2.default)('<div class="th-wrap"></div>');
				//th存在padding时 转移至th-wrap
				thPadding = onlyTH.css('padding-top') + onlyTH.css('padding-right') + onlyTH.css('padding-bottom') + onlyTH.css('padding-left');
				if (thPadding !== 0) {
					onlyThWarp.css('padding', thPadding);
					onlyTH.css('cssText', 'padding:0px!important');
				}
				//嵌入配置列表项
				if (_Settings2.default.supportConfig) {
					(0, _jTool2.default)('.config-list', tableWarp).append('<li th-name="' + onlyTH.attr('th-name') + '" class="checked-li">' + '<input type="checkbox" checked="checked"/>' + '<label>' + '<span class="fake-checkbox"></span>' + onlyTH.text() + '</label>' + '</li>');
				}
				//嵌入拖拽事件源
				//插件自动生成的排序与选择列不做事件绑定
				if (_Settings2.default.supportDrag && !isLmOrder && !isLmCheckbox) {
					onlyThWarp.html('<span class="th-text drag-action">' + onlyTH.html() + '</span>');
				} else {
					onlyThWarp.html('<span class="th-text">' + onlyTH.html() + '</span>');
				}
				var onlyThWarpPaddingTop = onlyThWarp.css('padding-top');
				//嵌入表头提醒事件源
				//插件自动生成的排序与选择列不做事件绑定
				if (_Settings2.default.supportRemind && onlyTH.attr('remind') != undefined && !isLmOrder && !isLmCheckbox) {
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
				if (_Settings2.default.supportSorting && sortType != undefined && !isLmOrder && !isLmCheckbox) {
					sortingDom = (0, _jTool2.default)(_sortingHtml);
					//依据 sortType 进行初始显示
					switch (sortType) {
						case _Settings2.default.sortUpText:
							sortingDom.addClass('sorting-up');
							break;
						case _Settings2.default.sortDownText:
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
				//嵌入宽度调整事件源
				//插件自动生成的选择列不做事件绑定
				if (_Settings2.default.supportAdjust && !isLmCheckbox) {
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
				if (thWidthForConfig && thWidthForConfig !== '') {
					onlyTH.width(thWidthForConfig);
					onlyTH.removeAttr('width'); //直接使用removeProp 无效
				} else {
					var _realWidthForThText = _Base2.default.getTextWidth(onlyTH); //当前th文本所占宽度大于设置的宽度
					onlyTH.css('min-width', _realWidthForThText);
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
			var _this = this;
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
			//重置表格序号
			if (_Settings2.default.supportAutoOrder) {
				var _pageData = _Settings2.default.pageData;
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
			if (_Settings2.default.supportCheckbox) {
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
			//依据顺序存储重置td顺序
			if (_Settings2.default.supportAdjust) {
				// 这里应该是验证换位而不是宽度调整
				return;
				var _thList = _this.getOriginalThDOM(_table),
				    _td;
				if (!_thList || _thList.length == 0) {
					_Base2.default.outLog('resetTdForCache:列位置重置所必须的原TH DOM获取失败', 'error');
					return false;
				}
				var _tmpHtml = [],
				    _tdArray = [];
				//		console.log(_thList.eq(4).index())
				_jTool2.default.each(_tr, function (i, v) {
					_tmpHtml[i] = (0, _jTool2.default)(v);
					_td = (0, _jTool2.default)(v).find('td');
					_jTool2.default.each(_td, function (i2, v2) {
						_tdArray[_thList.eq(i2).index()] = v2.outerHTML;
					});
					_tmpHtml[i].html(_tdArray.join(''));
				});
			}
			//依据配置对列表进行隐藏、显示
			if (_Settings2.default.supportConfig) {
				_Config2.default.setAreVisible((0, _jTool2.default)('[th-visible="none"]'), false, true);
			}
			//重置吸顶事件
			// if(Settings.supportSetTop){
			// var _tableDIV 	= _table.closest('.table-div');
			var _tableWarp = _tableDIV.closest('.table-wrap');
			// _tableDIV.css({
			// 	height:'auto'
			// });
			_tableWarp.css({
				marginBottom: 0
			});
			// }
		}
	}; /*
	   * DOM: 表格DOM相关操作
	   * */
	exports.default = DOM;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _jTool = __webpack_require__(1);

	var _jTool2 = _interopRequireDefault(_jTool);

	var _Cache = __webpack_require__(4);

	var _Cache2 = _interopRequireDefault(_Cache);

	var _Adjust = __webpack_require__(3);

	var _Adjust2 = _interopRequireDefault(_Adjust);

	var _Settings = __webpack_require__(6);

	var _Settings2 = _interopRequireDefault(_Settings);

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
				_configArea = _only.closest('.config-area'),
				    //事件源所在的区域
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
				_th = (0, _jTool2.default)('thead th[th-name="' + _thName + '"]', _table),
				    //所对应的th
				_checkedList; //当前处于选中状态的展示项
				if (_only.hasClass('no-click')) {
					return false;
				}
				_only.closest('.config-list').find('.no-click').removeClass('no-click');
				var isVisible = !_checkbox.get(0).checked;
				//设置与当前td同列的td是否可见
				_tableDiv.addClass('config-editing');
				Base.setAreVisible(_th, isVisible, function () {
					_tableDiv.removeClass('config-editing');
				});
				//最后一项禁止取消
				_checkedList = (0, _jTool2.default)('.config-area input[type="checkbox"]:checked', _tableWarp);
				if (_checkedList.length == 1) {
					_checkedList.parent().addClass('no-click');
				}

				//重置调整宽度事件源
				if (_Settings2.default.supportAdjust) {
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
					var _realWidthForThText = Base.getTextWidth(v),
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
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _jTool = __webpack_require__(1);

	var _jTool2 = _interopRequireDefault(_jTool);

	var _I18n = __webpack_require__(12);

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
			return (0, _jTool2.default)('tbody td[gm-checkbox] input[type="checkbox"]:checked', table).closest('tr');
		}
	};
	exports.default = Checkbox;

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; /*
	                                                                                                                                                                                                                                                                               * I18n: 国际化
	                                                                                                                                                                                                                                                                               * */


	var _jTool = __webpack_require__(1);

	var _jTool2 = _interopRequireDefault(_jTool);

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
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _jTool = __webpack_require__(1);

	var _jTool2 = _interopRequireDefault(_jTool);

	var _Core = __webpack_require__(8);

	var _Core2 = _interopRequireDefault(_Core);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/*
	 * Export: 数据导出
	 * */
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
				trDOM = (0, _jTool2.default)('tbody tr[checked="checked"]', tableDOM);
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
			gmExportAction.prop('download', (fileName || tableDOM.attr('grid-manager')) + '.xls');
			gmExportAction.get(0).click();

			function base64(s) {
				return window.btoa(unescape(encodeURIComponent(s)));
			}
		}
	};
	exports.default = Export;

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _jTool = __webpack_require__(1);

	var _jTool2 = _interopRequireDefault(_jTool);

	var _I18n = __webpack_require__(12);

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
/* 15 */
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
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _jTool = __webpack_require__(1);

	var _jTool2 = _interopRequireDefault(_jTool);

	var _Settings = __webpack_require__(6);

	var _Settings2 = _interopRequireDefault(_Settings);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/*
	 * Scroll: 滚动轴
	 * */
	var Scroll = {
		initDOM: function initDOM() {
			return '<div class="scroll-area"><div class="sa-inner"></div></div>';
		}
		/*
	  @绑定表格滚动轴功能
	  $.table: table [jTool object]
	  */
		, bindScrollFunction: function bindScrollFunction(table) {
			var _this = this;
			var _tableDIV = table.closest('.table-div'),
			    //列表所在的DIV,该DIV的class标识为table-div
			_tableWarp = _tableDIV.closest('.table-wrap'); //列表所在的外围容器
			//绑定窗口变化事件
			window.onresize = function () {
				(0, _jTool2.default)('.table-div').trigger('scroll', [true]);
			};
			//绑定模拟X轴滚动条
			(0, _jTool2.default)('.scroll-area').unbind('scroll');
			(0, _jTool2.default)('.scroll-area').bind('scroll', function () {
				(0, _jTool2.default)(this).closest('.table-div').scrollLeft(this.scrollLeft);
				this.style.left = this.scrollLeft + 'px';
			});
			//Settings.scrollDOM != window 时 清除Settings.scrollDOM 的padding值
			// if(Settings.scrollDOM != window){
			// 	$(Settings.scrollDOM).css('padding','0px');
			// }

			//绑定滚动条事件
			_tableDIV.unbind('scroll');
			_tableDIV.bind('scroll', function (e, _isWindowResize_) {
				var _scrollDOM = (0, _jTool2.default)(this),
				    _setTopHead,
				    //吸顶元素
				_table,
				    //原生table
				_thead,
				    //列表head
				_thList,
				    //列表下的th
				_tbody; //列表body
				var _scrollDOMTop = _scrollDOM.scrollTop();

				var _tWarpMB = undefined; //吸顶触发后,table所在外围容器的margin-bottom值
				// var scrollDOMisWindow = $.isWindow(Settings.scrollDOM);
				_tableDIV = table.closest('.table-div');
				_tableWarp = _tableDIV.closest('.table-wrap');
				_table = table.get(0);
				_thead = (0, _jTool2.default)('thead[grid-manager-thead]', table);
				_tbody = (0, _jTool2.default)('tbody', table);

				var _tDIVTop = _tableDIV.offset().top;
				// 列表与_tableDIV之间的间隙，如marin-top,padding-top
				var _tableOffsetTop = _table.offsetTop;

				_setTopHead = (0, _jTool2.default)('.set-top', table);
				//当前列表数据为空
				if ((0, _jTool2.default)('tr', _tbody).length == 0) {
					return true;
				}
				//配置X轴滚动条
				var scrollArea = (0, _jTool2.default)('.scroll-area', _tableWarp);
				if (_tableDIV.width() < table.width()) {
					//首先验证宽度是否超出了父级DIV
					// if(scrollDOMisWindow){
					// 	_tWarpMB = Number(_tableDIV.height())
					// 		+ Number(_tableWarp.css('margin-bottom'))
					// 		- (document.body.scrollTop || document.documentElement.scrollTop || window.scrollY)
					// 		- (window.innerHeight - _tableDIV.offset().top);
					// }else{
					// 	_tWarpMB = Number(_tableDIV.height())
					// 		+ Number(_tableWarp.css('margin-bottom'))
					// 		- _scrollDOM.scrollTop()
					// 		- _scrollDOM.height();
					// }
					//
					// if(_tWarpMB < 0){
					// 	_tWarpMB = 0;
					// }
					(0, _jTool2.default)('.sa-inner', scrollArea).css({
						width: table.width()
					});
					scrollArea.css({
						left: _tableDIV.scrollLeft()
					});
					scrollArea.scrollLeft(_tableDIV.scrollLeft());
					scrollArea.show();
				} else {
					scrollArea.hide();
				}
				//表头完全可见 分两种情况 scrollDOM 为 window 或自定义容器
				// if(scrollDOMisWindow ? (_tDIVTop - _scrollDOMTop >= -_tableOffsetTop) : (_scrollDOMTop == 0)){
				// 	console.log('表头完全可见')
				// 	if(_thead.hasClass('scrolling')){
				// 		_thead.removeClass('scrolling');
				// 	}
				// 	_setTopHead.remove();
				// 	return true;
				// }
				//表完全不可见
				// console.log('表完全不可见')
				// console.log(Math.abs(_tDIVTop - _scrollDOMTop));
				// console.log(_thead.height());
				// console.log();
				// if(scrollDOMisWindow ? (_tDIVTop - _scrollDOMTop < 0 &&
				// 	Math.abs(_tDIVTop - _scrollDOMTop) + _thead.height() - _tableOffsetTop > _tableDIV.height()) : false){
				// 	_setTopHead.show();
				// 	_setTopHead.css({
				// 		top		: 'auto',
				// 		bottom	: '0px'
				// 	});
				// 	return true;
				// }
				//配置吸顶区的宽度
				if (_setTopHead.length == 0 || _isWindowResize_) {
					_setTopHead.length == 0 ? table.append(_thead.clone(true).addClass('set-top')) : '';
					_setTopHead = (0, _jTool2.default)('.set-top', table);
					_setTopHead.removeAttr('grid-manager-thead');
					_setTopHead.css({
						width: _thead.width() + Number(_thead.css('border-left-width')) + Number(_thead.css('border-right-width')),
						left: table.css('border-left-width')
					});
					//$(v).width(_thList.get(i).offsetWidth)  获取值只能精确到整数
					//$(v).width(_thList.eq(i).width()) 取不到宽
					//调整吸顶表头下每一个th的宽度[存在性能问题，后期需优化]
					// _thList = $('th', _thead);
					// $.each($('th', _setTopHead), function(i, v){
					// 	$(v).css({
					// 		width : _thList.eq(i).width()
					// 		+ _thList.eq(i).css('border-left-width')
					// 		+ _thList.eq(i).css('border-right-width')
					// 	});
					// });
				}
				//当前吸引thead 没有背景时 添加默认背景
				if (!_setTopHead.css('background') || _setTopHead.css('background') == '' || _setTopHead.css('background') == 'none') {
					_setTopHead.css('background', '#f5f5f5');
				}

				//表部分可见
				// if(scrollDOMisWindow ? (_tDIVTop - _scrollDOMTop < 0 &&
				// 	Math.abs(_tDIVTop - _scrollDOMTop) <= _tableDIV.height() +_tableOffsetTop) : true){
				// 	if(!_thead.hasClass('scrolling')){
				// 		_thead.addClass('scrolling');
				// 	}
				// 	_setTopHead.css({
				// 		top		: _scrollDOMTop  - _tDIVTop + _this.topValue,
				// 		bottom	: 'auto'
				// 	});
				// 	_setTopHead.show();
				// 	return true;
				// }
				// 隐藏表头置镜像顶条
				if (_scrollDOMTop === 0) {
					_thead.removeClass('scrolling');
					_setTopHead.remove();
				}
				// 显示表头置镜像顶条
				else {
						_thead.addClass('scrolling');
						_setTopHead.css({
							top: _scrollDOMTop,
							bottom: 'auto'
						});
						_setTopHead.show();
					}
				return true;
			});
			//     $(Settings.scrollDOM).trigger('scroll');
		}
	};
	exports.default = Scroll;

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

	var _Core = __webpack_require__(8);

	var _Core2 = _interopRequireDefault(_Core);

	var _Settings = __webpack_require__(6);

	var _Settings2 = _interopRequireDefault(_Settings);

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
				if (_sortType == _Settings2.default.sortUpText) {
					_th.attr('sorting', _Settings2.default.sortUpText);
					_sortAction.removeClass('sorting-down');
					_sortAction.addClass('sorting-up');
				} else if (_sortType == _Settings2.default.sortDownText) {
					_th.attr('sorting', _Settings2.default.sortDownText);
					_sortAction.removeClass('sorting-up');
					_sortAction.addClass('sorting-down');
				}
			}
			refresh ? _Core2.default.__refreshGrid(callback) : typeof callback === 'function' ? callback() : '';
			return table;
		}
		/*
	  @绑定排序事件
	  $.table: table [jTool object]
	  */
		, bindSortingEvent: function bindSortingEvent(table) {
			var _thList = (0, _jTool2.default)('th[sorting]', table),
			    //所有包含排序的列
			_action,
			    //向上或向下事件源
			_th,
			    //事件源所在的th
			_table,
			    //事件源所在的table
			_tName,
			    //table grid-manager
			_thName; //th对应的名称

			//绑定排序事件
			(0, _jTool2.default)('.sorting-action', _thList).unbind('mouseup');
			(0, _jTool2.default)('.sorting-action', _thList).bind('mouseup', function () {
				_action = (0, _jTool2.default)(this);
				_th = _action.closest('th');
				_table = _th.closest('table');
				_tName = _table.attr('grid-manager');
				_thName = _th.attr('th-name');
				if (!_thName || _jTool2.default.trim(_thName) == '') {
					_Base2.default.outLog('排序必要的参数丢失', 'error');
					return false;
				}
				//根据组合排序配置项判定：是否清除原排序及排序样式
				if (!_Settings2.default.isCombSorting) {
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
					_th.attr('sorting', _Settings2.default.sortUpText);
				}
				//排序操作：降序
				else {
						_action.addClass('sorting-down');
						_action.removeClass('sorting-up');
						_th.attr('sorting', _Settings2.default.sortDownText);
					}
				//生成排序数据
				if (!_Settings2.default.isCombSorting) {
					_Settings2.default.sortData[_th.attr('th-name')] = _th.attr('sorting');
				} else {
					_jTool2.default.each((0, _jTool2.default)('th[th-name][sorting]', _table), function (i, v) {
						if (v.getAttribute('sorting') != '') {
							_Settings2.default.sortData[v.getAttribute('th-name')] = v.getAttribute('sorting');
						}
					});
				}
				//调用事件、渲染tbody
				var query = _jTool2.default.extend({}, _Settings2.default.query, _Settings2.default.sortData, _Settings2.default.pageData);
				_Settings2.default.sortingBefore(query);
				_Core2.default.__refreshGrid(function () {
					_Settings2.default.sortingAfter(query, _th);
				});
			});
		}
	};
	exports.default = Sort;

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _jTool = __webpack_require__(1);

	var _jTool2 = _interopRequireDefault(_jTool);

	var _I18n = __webpack_require__(12);

	var _I18n2 = _interopRequireDefault(_I18n);

	var _Settings = __webpack_require__(6);

	var _Settings2 = _interopRequireDefault(_Settings);

	var _AjaxPage = __webpack_require__(7);

	var _AjaxPage2 = _interopRequireDefault(_AjaxPage);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/*
	 * GridManager: 右键菜单
	 * */
	var Menu = {
		/*
	  @验证菜单区域: 禁用、开启分页操作
	  */
		checkMenuPageAction: function checkMenuPageAction() {
			//右键菜单区上下页限制
			var gridMenu = (0, _jTool2.default)('.grid-menu[grid-master="' + _Settings2.default.gridManagerName + '"]');
			if (!gridMenu || gridMenu.length === 0) {
				return;
			}
			var previousPage = (0, _jTool2.default)('[refresh-type="previous"]', gridMenu),
			    nextPage = (0, _jTool2.default)('[refresh-type="next"]', gridMenu);
			if (_Settings2.default.pageData.cPage === 1 || _Settings2.default.pageData.tPage === 0) {
				previousPage.addClass('disabled');
			} else {
				previousPage.removeClass('disabled');
			}
			if (_Settings2.default.pageData.cPage === _Settings2.default.pageData.tPage || _Settings2.default.pageData.tPage === 0) {
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
			var tableWarp = (0, _jTool2.default)(table).closest('.table-wrap'),
			    tbody = (0, _jTool2.default)('tbody', tableWarp);
			//刷新当前表格
			var menuHTML = '<div class="grid-menu" grid-master="' + _Settings2.default.gridManagerName + '">';
			//分页类操作
			if (_Settings2.default.supportAjaxPage) {
				menuHTML += '<span grid-action="refresh-page" refresh-type="previous">' + _I18n2.default.i18nText("previous-page") + '<i class="iconfont icon-sanjiao2"></i></span>' + '<span grid-action="refresh-page" refresh-type="next">' + _I18n2.default.i18nText("next-page") + '<i class="iconfont icon-sanjiao1"></i></span>';
			}
			menuHTML += '<span grid-action="refresh-page" refresh-type="refresh">' + _I18n2.default.i18nText("refresh") + '<i class="iconfont icon-31shuaxin"></i></span>';
			//导出类
			if (_Settings2.default.supportExport) {
				menuHTML += '<span class="grid-line"></span>' + '<span grid-action="export-excel" only-checked="false">' + _I18n2.default.i18nText("save-as-excel") + '<i class="iconfont icon-baocun"></i></span>' + '<span grid-action="export-excel" only-checked="true">' + _I18n2.default.i18nText("save-as-excel-for-checked") + '<i class="iconfont icon-saveas24"></i></span>';
			}
			//配置类
			if (_Settings2.default.supportConfig) {
				menuHTML += '<span class="grid-line"></span>' + '<span grid-action="setting-grid">' + _I18n2.default.i18nText("setting-grid") + '<i class="iconfont icon-shezhi"></i></span>';
			}
			menuHTML += '</div>';
			var _body = (0, _jTool2.default)('body');
			_body.append(menuHTML);
			//绑定打开右键菜单栏
			var menuDOM = (0, _jTool2.default)('.grid-menu[grid-master="' + _Settings2.default.gridManagerName + '"]');
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
				if ((0, _jTool2.default)('tbody tr[checked="true"]', (0, _jTool2.default)('table[grid-manager="' + _Settings2.default.gridManagerName + '"]')).length === 0) {
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
				var refreshType = this.getAttribute('refresh-type');
				var cPage = _Settings2.default.pageData.cPage;
				//上一页
				if (refreshType === 'previous' && _Settings2.default.pageData.cPage > 1) {
					cPage = _Settings2.default.pageData.cPage - 1;
				}
				//下一页
				else if (refreshType === 'next' && _Settings2.default.pageData.cPage < _Settings2.default.pageData.tPage) {
						cPage = _Settings2.default.pageData.cPage + 1;
					}
					//重新加载
					else if (refreshType === 'refresh') {
							cPage = _Settings2.default.pageData.cPage;
						}
				_AjaxPage2.default.gotoPage(cPage);
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
				_Settings2.default.exportGridToXls(_table, undefined, onlyChecked);
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
	};
	exports.default = Menu;

/***/ },
/* 19 */
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

	var _Settings = __webpack_require__(6);

	var _Settings2 = _interopRequireDefault(_Settings);

	var _Cache = __webpack_require__(4);

	var _Cache2 = _interopRequireDefault(_Cache);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Drag = {
		// 动画执行时间
		animateTime: _Settings2.default.animateTime
		/*
	  @绑定拖拽换位事件
	  $.table: table [jTool object]
	  */
		, bindDragEvent: function bindDragEvent(table) {
			var _this = this;
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
			var SIV_td; //用于处理时实刷新造成的列表错乱
			dragAction.unbind('mousedown');
			dragAction.bind('mousedown', function () {
				_th = (0, _jTool2.default)(this).closest('th'), _prevTh = undefined, _nextTh = undefined, _prevTd = undefined, _nextTd = undefined, _tr = _th.parent(), _allTh = _tr.find('th[th-visible="visible"]'), _table = _tr.closest('table'), _tableDiv = _table.closest('.table-div'), _tableWrap = _table.closest('.table-wrap'), _td = _Base2.default.getRowTd(_th);
				// 列拖拽触发回调事件
				_Settings2.default.dragBefore(event);

				//禁用文字选中效果
				(0, _jTool2.default)('body').addClass('no-select-text');

				//父级DIV使用相对定位
				_divPosition = _tableDiv.css('position');
				if (_divPosition != 'relative' && _divPosition != 'absolute') {
					_tableDiv.css('position', 'relative');
				}
				//处理时实刷新造成的列表错乱
				if (_this.isRealTime) {
					_th.addClass('drag-ongoing');
					_td.addClass('drag-ongoing');
					window.clearInterval(SIV_td);
					SIV_td = window.setInterval(function () {
						_td = _table.find('tbody tr').find('td:eq(' + _th.index() + ')'); //与事件源同列的所有td
						_td.addClass('drag-ongoing');
					}, 100);
				} else {
					_th.addClass('drag-ongoing opacityChange');
					_td.addClass('drag-ongoing opacityChange');
				}
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
				(0, _jTool2.default)('body').bind('mouseup', function () {
					(0, _jTool2.default)('body').unbind('mousemove');
					//清除临时展示被移动的列
					_dreamlandDIV = (0, _jTool2.default)('.dreamland-div');
					if (_dreamlandDIV.length != 0) {
						_dreamlandDIV.animate({
							top: _table.get(0).offsetTop + 'px',
							left: _th.get(0).offsetLeft - _tableDiv.get(0).scrollLeft + 'px'
						}, _this.animateTime, function () {
							_tableDiv.css('position', _divPosition);
							_th.removeClass('drag-ongoing');
							_td.removeClass('drag-ongoing');
							_dreamlandDIV.remove();
						});
					}
					//缓存列表位置信息
					_Cache2.default.setToLocalStorage(_table);

					//重置调整宽度事件源
					if (_Settings2.default.supportAdjust) {
						_Adjust2.default.resetAdjust(_table);
					}
					//开启文字选中效果
					(0, _jTool2.default)('body').removeClass('no-select-text');
					if (_this.isRealTime) {
						window.clearInterval(SIV_td);
					}
					// 列拖拽成功回调事件
					_Settings2.default.dragAfter(event);
				});
			});
		}
	}; /*
	    * Drag: 拖拽
	    * */
	exports.default = Drag;

/***/ }
/******/ ]);