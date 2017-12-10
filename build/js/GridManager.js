/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 20);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Base = exports.$ = exports.jTool = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Base: 基础方法
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * */


__webpack_require__(22);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var $ = window.jTool;
var jTool = window.jTool;

var BaseClass = function () {
	function BaseClass() {
		_classCallCheck(this, BaseClass);
	}

	_createClass(BaseClass, [{
		key: 'outLog',

		/**
   * 输出日志
   * @param msg 输出文本
   * @param type 输出分类[info,warn,error]
   * @returns {*}
      */
		value: function outLog(msg, type) {
			switch (type) {
				case 'info':
					console.info('GridManager Info: ', msg);
					break;
				case 'warn':
					console.warn('GridManager Warn: ', msg);
					break;
				case 'error':
					console.error('GridManager Error: ', msg);
					break;
				default:
					console.log('GridManager: ', msg);
					break;
			}
		}

		/**
   * 获取表的GM 唯一标识
   * @param $table
   * @returns {*|string}
      */

	}, {
		key: 'getKey',
		value: function getKey($table) {
			return $table.attr('grid-manager') || '';
		}

		/**
   * 获取同列的 td jTool 对象, 该方法的调用者只允许为 Th
   * @param $dom: $th 或 $td
   * @returns {*|HTMLElement|jTool}
      */

	}, {
		key: 'getColTd',
		value: function getColTd($dom) {
			var $table = $dom.closest('table[grid-manager]');
			var thIndex = $dom.index();
			var trList = $('tbody tr', $table);
			var tdList = [];
			var _td = null;

			$.each(trList, function (i, v) {
				_td = $('td', v).get(thIndex);
				if (_td) {
					tdList.push(_td);
				}
			});
			return $(tdList);
		}

		/**
   * 根据参数设置列是否可见(th 和 td)
   * @param $thList 即将配置的列所对应的th[jTool object，可以是多个]
   * @param isVisible 是否可见
      * @param cb
      */
		// TODO 应该调整为columnMap更新后触发

	}, {
		key: 'setAreVisible',
		value: function setAreVisible($thList, isVisible, cb) {
			// 当前所在的table
			var _table = null;

			// 当前所在的容器
			var _tableWarp = void 0;

			// 当前操作的th
			var _th = null;

			// 当前tbody下所有的tr
			var _trList = null;

			// 所对应的td
			var _tdList = [];

			// 所对应的显示隐藏所在的li
			var _checkLi = null;

			// 所对应的显示隐藏事件
			var _checkbox = null;
			$.each($thList, function (i, v) {
				_th = $(v);
				_table = _th.closest('table');
				_tableWarp = _table.closest('.table-wrap');
				_trList = $('tbody tr', _table);
				_checkLi = $('.config-area li[th-name="' + _th.attr('th-name') + '"]', _tableWarp);
				_checkbox = _checkLi.find('input[type="checkbox"]');
				if (_checkbox.length === 0) {
					return;
				}
				$.each(_trList, function (i2, v2) {
					_tdList.push($(v2).find('td').get(_th.index()));
				});
				// 显示
				if (isVisible) {
					_th.attr('th-visible', 'visible');
					$.each(_tdList, function (i2, v2) {
						// $(v2).show();
						v2.setAttribute('td-visible', 'visible');
					});
					_checkLi.addClass('checked-li');
					_checkbox.prop('checked', true);
				} else {
					// 隐藏
					_th.attr('th-visible', 'none');
					$.each(_tdList, function (i2, v2) {
						// $(v2).hide();
						v2.setAttribute('td-visible', 'none');
					});
					_checkLi.removeClass('checked-li');
					_checkbox.prop('checked', false);
				}
				typeof cb === 'function' ? cb() : '';
			});
		}

		/**
   * 获取TH中文本的宽度. 该宽度指的是文本所实际占用的宽度
   * @param th
   * @returns {*}
      */

	}, {
		key: 'getTextWidth',
		value: function getTextWidth(th) {
			var $th = $(th);

			// th下的GridManager包裹容器
			var thWarp = $('.th-wrap', $th);

			// 文本所在容器
			var thText = $('.th-text', $th);

			// 文本镜象 用于处理实时获取文本长度
			var tableWrap = $th.closest('.table-wrap');
			var textDreamland = $('.text-dreamland', tableWrap);

			// 将th文本嵌入文本镜象 用于获取文本实时宽度
			textDreamland.text(thText.text());
			textDreamland.css({
				fontSize: thText.css('font-size'),
				fontWeight: thText.css('font-weight'),
				fontFamily: thText.css('font-family')
			});
			var thPaddingLeft = thWarp.css('padding-left');
			var thPaddingRight = thWarp.css('padding-right');
			// 返回宽度值
			return textDreamland.width() + (thPaddingLeft || 0) + (thPaddingRight || 0);
		}

		/**
   * 显示加载中动画
   * @param dom[jTool] 加载动画的容器
   * @param cb 回调函数
      */

	}, {
		key: 'showLoading',
		value: function showLoading(dom, cb) {
			if (!dom || dom.length === 0) {
				return;
			}
			var loading = dom.find('.load-area');
			if (loading.length > 0) {
				loading.remove();
			}
			var loadingDom = $('<div class="load-area loading"><div class="loadInner kernel"></div></div>');
			dom.append(loadingDom);

			// 进行loading图标居中显示
			var loadInner = dom.find('.load-area').find('.loadInner');
			var domHeight = dom.height();
			var loadInnerHeight = loadInner.height();
			loadInner.css('margin-top', (domHeight - loadInnerHeight) / 2);
			window.setTimeout(function () {
				typeof cb === 'function' ? cb() : '';
			}, 100);
		}

		/**
   * 隐藏加载中动画
   * @param dom
   * @param cb
      */

	}, {
		key: 'hideLoading',
		value: function hideLoading(dom, cb) {
			if (!dom || dom.length === 0) {
				return;
			}
			window.setTimeout(function () {
				$('.load-area', dom).remove();
				typeof cb === 'function' ? cb() : '';
			}, 500);
		}

		/**
   * 更新当前用户交互状态, 用于优化置顶状态下进行[拖拽, 宽度调整]操作时,页面出现滚动的问题
   * @param $table
   * @param interactive: 如果不存在于interactiveList内, 将删除属性[user-interactive]
   */

	}, {
		key: 'updateInteractive',
		value: function updateInteractive($table, interactive) {
			var interactiveList = ['Adjust', 'Drag'];
			// 事件源所在的容器
			var tableWrap = $table.closest('.table-wrap');
			if (!interactive || interactiveList.indexOf(interactive) === -1) {
				tableWrap.removeAttr('user-interactive');
			} else {
				tableWrap.attr('user-interactive', interactive);
			}
		}

		/**
   * 更新滚动轴显示状态
   * @param $table
   */

	}, {
		key: 'updateScrollStatus',
		value: function updateScrollStatus($table) {
			var $tableDiv = $table.closest('.table-div');
			// 宽度: table === tableDiv 隐藏横向滚动轴. 反之 显示
			if ($table.width() === $tableDiv.width()) {
				$tableDiv.css('overflow-x', 'hidden');
				return 'hidden';
			} else {
				$tableDiv.css('overflow-x', 'auto');
				return 'auto';
			}
		}

		/**
   * 通过配置项columnData 获取指定列的可视信息
   * @param col 列的配置信息
   * @returns {string}
      */

	}, {
		key: 'getVisibleForColumn',
		value: function getVisibleForColumn(col) {
			return col.isShow ? 'visible' : 'none';
		}
	}]);

	return BaseClass;
}();

var Base = new BaseClass();
exports.jTool = jTool;
exports.$ = $;
exports.Base = Base;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     * @Cache: 本地缓存
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     * 缓存分为三部分:
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     * 1.GridData: 渲染表格时所使用的json数据 [存储在GM实例]
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     * 2.Cache: 核心缓存数据 [存储在DOM上]
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     * 3.UserMemory: 用户记忆 [存储在localStorage]
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     * */


var _Base = __webpack_require__(0);

var _Settings2 = __webpack_require__(19);

var _Checkbox = __webpack_require__(8);

var _Checkbox2 = _interopRequireDefault(_Checkbox);

var _Order = __webpack_require__(11);

var _Order2 = _interopRequireDefault(_Order);

var _Store = __webpack_require__(14);

var _Store2 = _interopRequireDefault(_Store);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Cache = function () {
	function Cache() {
		_classCallCheck(this, Cache);

		this.initCoreMethod();
		this.initGridData();
		this.initUserMemory();
	}
	/**
  * 渲染表格使用的json数据 通过每个tr上的cache-key进行获取
  */


	_createClass(Cache, [{
		key: 'initGridData',
		value: function initGridData() {
			/**
    * 获取当前行渲染时使用的数据
    * @param $table 当前操作的grid,由插件自动传入
    * @param target 将要获取数据所对应的tr[Element or NodeList]
    * @returns {*}
          * @private
          */
			this.__getRowData = function ($table, target) {
				var gmName = _Base.Base.getKey($table);
				if (!_Store2.default.responseData[gmName]) {
					return;
				}
				// target type = Element 元素时, 返回单条数据对象;
				if (_Base.jTool.type(target) === 'element') {
					return _Store2.default.responseData[gmName][target.getAttribute('cache-key')];
				} else if (_Base.jTool.type(target) === 'nodeList') {
					// target type =  NodeList 类型时, 返回数组
					var rodData = [];
					_Base.jTool.each(target, function (i, v) {
						rodData.push(_Store2.default.responseData[gmName][v.getAttribute('cache-key')]);
					});
					return rodData;
				} else {
					// 不为Element NodeList时, 返回空对象
					return {};
				}
			};

			/**
    * 存储行数据
    * @param gmName
    * @param key
          * @param value
          */
			this.setRowData = function (gmName, key, value) {
				if (!_Store2.default.responseData[gmName]) {
					_Store2.default.responseData[gmName] = {};
				}
				_Store2.default.responseData[gmName][key] = value;
			};

			/**
    * 获取完整的渲染时使用的数据
    * @param $table
          */
			this.getTableData = function ($table) {
				return _Store2.default.responseData[_Base.Base.getKey($table)] || {};
			};
		}

		/**
   * 用户记忆
   */

	}, {
		key: 'initUserMemory',
		value: function initUserMemory() {
			var _this2 = this;

			/**
    * 删除用户记忆
    * @param $table
    * @returns {boolean}
          */
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
				var _key = _this2.getMemoryKey($table);
				delete GridManagerMemory[_key];

				// 清除后, 重新存储
				window.localStorage.setItem('GridManagerMemory', JSON.stringify(GridManagerMemory));
				return true;
			};

			/**
    * 获取表格的用户记忆标识码
    * @param $table
    * @returns {*}
    */
			this.getMemoryKey = function ($table) {
				var settings = _this2.getSettings($table);
				// 验证table是否有效
				if (!$table || $table.length === 0) {
					_Base.Base.outLog('getUserMemory:无效的table', 'error');
					return false;
				}
				// 当前表是否禁用缓存  被禁用原因是用户缺失了必要的参数
				var noCache = $table.attr('no-cache');
				if (noCache && noCache === 'true') {
					_Base.Base.outLog('缓存已被禁用：当前表缺失必要html标签属性[grid-manager或th-name]', 'info');
					return false;
				}
				if (!window.localStorage) {
					_Base.Base.outLog('当前浏览器不支持：localStorage，缓存功能失效', 'info');
					return false;
				}
				return window.location.pathname + window.location.hash + '-' + settings.gridManagerName;
			};

			/**
    * 获取用户记忆
    * @param $table
    * @returns {*} 成功则返回本地存储数据,失败则返回空对象
    */
			this.getUserMemory = function ($table) {
				if (!$table || $table.length === 0) {
					return {};
				}
				var _key = _this2.getMemoryKey($table);
				if (!_key) {
					return {};
				}
				var GridManagerMemory = window.localStorage.getItem('GridManagerMemory');
				// 如无数据，增加属性标识：grid-manager-cache-error
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

			/**
    * 存储用户记忆
    * @param $table
    * @returns {boolean}
    */
			this.saveUserMemory = function ($table) {
				var Settings = _this2.getSettings($table);
				var _this = _this2;

				// 当前为禁用缓存模式，直接跳出
				if (Settings.disableCache) {
					return false;
				}
				// 当前表是否禁用缓存  被禁用原因是用户缺失了必要的参数
				var noCache = $table.attr('no-cache');
				if (!$table || $table.length === 0) {
					_Base.Base.outLog('saveUserMemory:无效的table', 'error');
					return false;
				}
				if (noCache && noCache === 'true') {
					_Base.Base.outLog('缓存功能已被禁用：当前表缺失必要参数', 'info');
					return false;
				}
				if (!window.localStorage) {
					_Base.Base.outLog('当前浏览器不支持：localStorage，缓存功能失效。', 'error');
					return false;
				}
				var thList = (0, _Base.jTool)('thead[grid-manager-thead] th', $table);
				if (!thList || thList.length === 0) {
					_Base.Base.outLog('saveUserMemory:无效的thList,请检查是否正确配置table,thead,th', 'error');
					return false;
				}

				var _cache = {};
				var _pageCache = {};
				_cache.column = Settings.columnMap;

				// 存储分页
				if (Settings.supportAjaxPage) {
					_pageCache.pSize = parseInt((0, _Base.jTool)('select[name="pSizeArea"]', $table.closest('.table-wrap')).val(), 10);
					_cache.page = _pageCache;
				}
				var _cacheString = JSON.stringify(_cache);
				var GridManagerMemory = window.localStorage.getItem('GridManagerMemory');
				if (!GridManagerMemory) {
					GridManagerMemory = {};
				} else {
					GridManagerMemory = JSON.parse(GridManagerMemory);
				}
				GridManagerMemory[_this.getMemoryKey($table)] = _cacheString;
				window.localStorage.setItem('GridManagerMemory', JSON.stringify(GridManagerMemory));
				return _cacheString;
			};
		}

		/**
   * 核心方法
   */

	}, {
		key: 'initCoreMethod',
		value: function initCoreMethod() {
			var _this3 = this;

			/**
    * 初始化设置相关: 合并, 存储
    * @param $table
    * @param arg
    */
			this.initSettings = function ($table, arg) {
				// 合并参数
				var _settings = new _Settings2.Settings();
				_settings.textConfig = new _Settings2.TextSettings();

				// 将默认项与配置项
				_Base.jTool.extend(true, _settings, arg);

				// 存储配置项
				_this3.setSettings($table, _settings);

				// 校验 columnData
				if (!_settings.columnData || _settings.columnData.length === 0) {
					_Base.Base.outLog('请对参数columnData进行有效的配置', 'error');
					return;
				}

				// 为 columnMap columnData 增加 序号列
				if (_settings.supportAutoOrder) {
					_settings.columnData.unshift(_Order2.default.getColumn($table, _settings.i18n));
				}

				// 为 columnMap columnData 增加 选择列
				if (_settings.supportCheckbox) {
					_settings.columnData.unshift(_Checkbox2.default.getColumn($table, _settings.i18n));
				}

				// 为 columnData 提供锚 => columnMap
				// columnData 在此之后, 将不再被使用到
				// columnData 与 columnMap 已经过特殊处理, 不会彼此影响
				_settings.columnMap = {};
				_settings.columnData.forEach(function (col, index) {
					_settings.columnMap[col.key] = col;

					// 如果未设定, 设置默认值为true
					_settings.columnMap[col.key].isShow = col.isShow || typeof col.isShow === 'undefined';

					// 为列Map 增加索引
					_settings.columnMap[col.key].index = index;
				});

				var mergeColumn = function mergeColumn() {
					// 当前为禁用状态
					if (_settings.disableCache) {
						return;
					}

					var userMemory = _this3.getUserMemory($table);
					var columnCache = userMemory.cache && userMemory.cache.column ? userMemory.cache.column : {};
					var columnCacheKeys = Object.keys(columnCache);
					var columnMapKeys = Object.keys(_settings.columnMap);

					// 无用户记忆
					if (columnCacheKeys.length === 0) {
						return;
					}

					// 是否为有效的用户记忆
					var isUsable = true;

					// 列数量不匹配
					if (columnCacheKeys.length !== columnMapKeys.length) {
						isUsable = false;
					}
					// 列的key 或 text 不匹配
					isUsable && _Base.jTool.each(_settings.columnMap, function (key, col) {
						if (!columnCache[key] || columnCache[key].text !== col.text) {
							isUsable = false;
							return false;
						}
					});

					// 将用户记忆并入 columnMap 内
					if (isUsable) {
						_Base.jTool.extend(true, _settings.columnMap, columnCache);
					} else {
						// 清除用户记忆
						_this3.cleanTableCache($table, '与配置项[columnData]不匹配');
					}
				};
				// 合并用户记忆至配置项
				mergeColumn();

				// 更新存储配置项
				_this3.setSettings($table, _settings);
				return _settings;
			};

			/**
    * 获取配置项
    * @param $table
    * @returns {*}
    */
			this.getSettings = function ($table) {
				if (!$table || $table.length === 0) {
					return {};
				}
				// 返回的是 clone 对象 而非对象本身
				return _Base.jTool.extend(true, {}, _Store2.default.settings[_Base.Base.getKey($table)] || {});
			};

			/**
    * 更新配置项
    * @param $table
    * @param settings
    */
			this.setSettings = function ($table, settings) {
				_Store2.default.settings[_Base.Base.getKey($table)] = _Base.jTool.extend(true, {}, settings);
			};

			/**
    * 验证版本号清除列表缓存
    * @param $table
    * @param version 版本号
    */
			this.cleanTableCacheForVersion = function () {
				var cacheVersion = window.localStorage.getItem('GridManagerVersion');
				// 当前为第一次渲染
				if (!cacheVersion) {
					window.localStorage.setItem('GridManagerVersion', _Store2.default.version);
				}
				// 版本变更, 清除所有的用户记忆
				if (cacheVersion && cacheVersion !== _Store2.default.version) {
					_this3.cleanTableCache(null, '版本已升级,原全部缓存被自动清除');
					window.localStorage.setItem('GridManagerVersion', _Store2.default.version);
				}
			};

			/**
    * 清除列表缓存
    * @param $table
    * @param cleanText
    */
			this.cleanTableCache = function ($table, cleanText) {
				// 不指定table, 清除全部
				if ($table === null) {
					_Base.Base.outLog('\u7528\u6237\u8BB0\u5FC6\u88AB\u6E05\u9664\uFF1A' + cleanText, 'warn');
					return _this3.delUserMemory();

					// 指定table, 定点清除
				} else {
					var _Settings = _this3.getSettings($table);
					_Base.Base.outLog(_Settings.gridManagerName + '\u7528\u6237\u8BB0\u5FC6\u88AB\u6E05\u9664\uFF1A' + cleanText, 'warn');
					return _this3.delUserMemory($table);
				}
			};

			/**
    * 存储原Th DOM至table data
    * @param $table
    */
			this.setOriginalThDOM = function ($table) {
				var _thList = [];
				var _thDOM = (0, _Base.jTool)('thead[grid-manager-thead] th', $table);

				_Base.jTool.each(_thDOM, function (i, v) {
					_thList.push(v.getAttribute('th-name'));
				});
				_Store2.default.originalTh[_Base.Base.getKey($table)] = _thList;
				$table.data('originalThList', _thList);
			};

			/**
    * 获取原Th DOM至table data
    * @param $table
    * @returns {*|HTMLElement|jTool}
    */
			this.getOriginalThDOM = function ($table) {
				var _thArray = [];
				var _thList = _Store2.default.originalTh[_Base.Base.getKey($table)];
				_Base.jTool.each(_thList, function (i, v) {
					_thArray.push((0, _Base.jTool)('thead[grid-manager-thead] th[th-name="' + v + '"]', $table).get(0));
				});
				return (0, _Base.jTool)(_thArray);
			};
		}
	}]);

	return Cache;
}();

exports.default = new Cache();

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Adjust: 宽度调整
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * */


var _Base = __webpack_require__(0);

var _Cache = __webpack_require__(1);

var _Cache2 = _interopRequireDefault(_Cache);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Adjust = function () {
	function Adjust() {
		_classCallCheck(this, Adjust);
	}

	_createClass(Adjust, [{
		key: 'bindAdjustEvent',


		/**
   * 绑定宽度调整事件
   * @param: table [jTool object]
   */
		value: function bindAdjustEvent($table) {
			var _this = this;
			// 监听鼠标调整列宽度
			$table.off('mousedown', '.adjust-action');
			$table.on('mousedown', '.adjust-action', function (event) {
				var _dragAction = (0, _Base.$)(this);
				// 事件源所在的th
				var $th = _dragAction.closest('th');

				// 事件源所在的tr
				var $tr = $th.parent();

				// 事件源所在的table
				var _$table = $tr.closest('table');

				// 当前存储属性
				var settings = _Cache2.default.getSettings(_$table);

				// 事件源同层级下的所有th
				var _allTh = $tr.find('th[th-visible="visible"]');

				// 事件源下一个可视th
				var $nextTh = _allTh.eq($th.index(_allTh) + 1);

				// 存储与事件源同列的所有td
				var $td = _Base.Base.getColTd($th);

				// 宽度调整触发回调事件
				settings.adjustBefore(event);

				// 增加宽度调整中样式
				$th.addClass('adjust-selected');
				$td.addClass('adjust-selected');

				// 更新界面交互标识
				_Base.Base.updateInteractive(_$table, 'Adjust');

				// 执行移动事件
				_this.runMoveEvent(_$table, $th, $nextTh);

				// 绑定停止事件
				_this.runStopEvent(_$table, $th, $td);
				return false;
			});
			return this;
		}

		/**
   * 执行移动事件
   * @param $table
   * @param $th
   * @param $nextTh
      */

	}, {
		key: 'runMoveEvent',
		value: function runMoveEvent($table, $th, $nextTh) {
			var _thWidth = null;
			var _NextWidth = null;
			var _thMinWidth = _Base.Base.getTextWidth($th);
			var _NextThMinWidth = _Base.Base.getTextWidth($nextTh);
			$table.unbind('mousemove');
			$table.bind('mousemove', function (event) {
				$table.addClass('no-select-text');
				_thWidth = event.clientX - $th.offset().left;
				_thWidth = Math.ceil(_thWidth);
				_NextWidth = $nextTh.width() + $th.width() - _thWidth;
				_NextWidth = Math.ceil(_NextWidth);
				// 达到最小值后不再执行后续操作
				if (_thWidth < _thMinWidth) {
					return;
				}
				if (_NextWidth < _NextThMinWidth) {
					_NextWidth = _NextThMinWidth;
				}
				// 验证是否更改
				if (_thWidth === $th.width()) {
					return;
				}
				// 验证宽度是否匹配
				if (_thWidth + _NextWidth < $th.width() + $nextTh.width()) {
					_NextWidth = $th.width() + $nextTh.width() - _thWidth;
				}
				$th.width(_thWidth);
				$nextTh.width(_NextWidth);

				// 当前宽度调整的事件原为表头置顶的thead th
				// 修改与置顶thead 对应的 thead
				if ($th.closest('.set-top').length === 1) {
					(0, _Base.$)('thead[grid-manager-thead] th[th-name="' + $th.attr('th-name') + '"]', $table).width(_thWidth);
					(0, _Base.$)('thead[grid-manager-thead] th[th-name="' + $nextTh.attr('th-name') + '"]', $table).width(_NextWidth);
					(0, _Base.$)('thead[grid-manager-mock-thead]', $table).width((0, _Base.$)('thead[grid-manager-thead]', $table).width());
				}
			});
		}

		/**
   * 绑定鼠标放开、移出事件
   * @param $table
   * @param $th
   * @param $td
      */

	}, {
		key: 'runStopEvent',
		value: function runStopEvent($table, $th, $td) {
			$table.unbind('mouseup mouseleave');
			$table.bind('mouseup mouseleave', function (event) {
				var settings = _Cache2.default.getSettings($table);
				$table.unbind('mousemove mouseleave');

				// 其它操作也在table以该事件进行绑定,所以通过class进行区别
				if ($th.hasClass('adjust-selected')) {
					// 宽度调整成功回调事件
					settings.adjustAfter(event);
				}
				$th.removeClass('adjust-selected');
				$td.removeClass('adjust-selected');
				$table.removeClass('no-select-text');

				// 更新界面交互标识
				_Base.Base.updateInteractive($table);

				// 更新滚动轴状态
				_Base.Base.updateScrollStatus($table);

				// 更新表格列Map
				_Base.$.each(settings.columnMap, function (key, col) {
					col.width = (0, _Base.$)('th[th-name="' + col.key + '"]', $table).width() + 'px';
				});
				_Cache2.default.setSettings($table, settings);

				// 存储用户记忆
				_Cache2.default.saveUserMemory($table);
			});
		}

		/**
   * 通过缓存配置成功后, 重置宽度调整事件源dom 用于禁用最后一列调整宽度事件
   * @param $table
   * @returns {boolean}
      */

	}, {
		key: 'resetAdjust',
		value: function resetAdjust($table) {
			if (!$table || $table.length === 0) {
				return false;
			}
			var _thList = (0, _Base.$)('thead [th-visible="visible"]', $table);
			var _adjustAction = (0, _Base.$)('.adjust-action', _thList);
			if (!_adjustAction || _adjustAction.length === 0) {
				return false;
			}
			_adjustAction.show();
			_adjustAction.eq(_adjustAction.length - 1).hide();

			// 更新滚动轴状态
			_Base.Base.updateScrollStatus($table);
		}
	}, {
		key: 'html',

		/**
   * 宽度调整HTML
   * @returns {string}
      */
		get: function get() {
			return '<span class="adjust-action"></span>';
		}
	}]);

	return Adjust;
}();

exports.default = new Adjust();

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     * Core: 核心方法
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     * 1.刷新
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     * 2.渲染GM DOM
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     * 3.重置tbody
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     * */


var _Base = __webpack_require__(0);

var _Menu = __webpack_require__(10);

var _Menu2 = _interopRequireDefault(_Menu);

var _Adjust = __webpack_require__(2);

var _Adjust2 = _interopRequireDefault(_Adjust);

var _AjaxPage = __webpack_require__(5);

var _AjaxPage2 = _interopRequireDefault(_AjaxPage);

var _Cache = __webpack_require__(1);

var _Cache2 = _interopRequireDefault(_Cache);

var _Config = __webpack_require__(9);

var _Config2 = _interopRequireDefault(_Config);

var _Checkbox = __webpack_require__(8);

var _Checkbox2 = _interopRequireDefault(_Checkbox);

var _Export = __webpack_require__(6);

var _Export2 = _interopRequireDefault(_Export);

var _Order = __webpack_require__(11);

var _Order2 = _interopRequireDefault(_Order);

var _Remind = __webpack_require__(12);

var _Remind2 = _interopRequireDefault(_Remind);

var _Sort = __webpack_require__(13);

var _Sort2 = _interopRequireDefault(_Sort);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Core = function () {
	function Core() {
		_classCallCheck(this, Core);
	}

	_createClass(Core, [{
		key: '__refreshGrid',


		/**
   * 刷新表格 使用现有参数重新获取数据，对表格数据区域进行渲染
   * @param $table
   * @param callback
      * @private
      */
		value: function __refreshGrid($table, callback) {
			var _this = this;

			var settings = _Cache2.default.getSettings($table);

			var tableWrap = $table.closest('.table-wrap');

			// 刷新按纽
			var refreshAction = (0, _Base.$)('.page-toolbar .refresh-action', tableWrap);

			// 增加刷新中标识
			refreshAction.addClass('refreshing');

			// 使用配置数据
			// 如果存在配置数据ajax_data,将不再通过ajax_rul进行数据请求
			// 且ajax_beforeSend、ajax_error、ajax_complete将失效，仅有ajax_success会被执行
			if (settings.ajax_data) {
				this.driveDomForSuccessAfter($table, settings, settings.ajax_data, callback);
				settings.ajax_success(settings.ajax_data);
				this.removeRefreshingClass(tableWrap);
				return;
			}
			if (typeof settings.ajax_url !== 'string' || settings.ajax_url === '') {
				settings.outLog('请求表格数据失败！参数[ajax_url]配制错误', 'error');
				this.removeRefreshingClass(tableWrap);
				typeof callback === 'function' ? callback() : '';
				return;
			}
			var pram = _Base.$.extend(true, {}, settings.query);

			// 合并分页信息至请求参
			if (settings.supportAjaxPage) {
				_Base.$.extend(pram, settings.pageData);
			}

			// 合并排序信息至请求参
			if (settings.supportSorting) {
				_Base.$.each(settings.sortData, function (key, value) {
					// 增加sort_前缀,防止与搜索时的条件重叠
					pram['sort_' + key] = value;
				});
			}

			// 当前页不存在,或者小于1时, 修正为1
			if (!pram.cPage || pram.cPage < 1) {
				pram.cPage = 1;

				// 当前页大于总页数时, 修正为总页数
			} else if (pram.cPage > pram.tPage) {
				pram.cPage = pram.tPage;
			}

			// settings.query = pram;
			_Cache2.default.setSettings($table, settings);

			_Base.Base.showLoading(tableWrap);

			// 当前为POST请求 且 Content-Type 未进行配置时, 默认使用 application/x-www-form-urlencoded
			// 说明|备注:
			// 1. Content-Type = application/x-www-form-urlencoded 的数据形式为 form data
			// 2. Content-Type = text/plain;charset=UTF-8 的数据形式为 request payload
			if (settings.ajax_type.toUpperCase() === 'POST' && !settings.ajax_headers['Content-Type']) {
				settings.ajax_headers['Content-Type'] = 'application/x-www-form-urlencoded';
			}

			// 请求前处理程序, 可以通过该方法修改全部的请求参数
			settings.requestHandler(pram);

			// 执行ajax
			_Base.$.ajax({
				url: settings.ajax_url,
				type: settings.ajax_type,
				data: pram,
				headers: settings.ajax_headers,
				xhrFields: settings.ajax_xhrFields,
				cache: true,
				beforeSend: function beforeSend(XMLHttpRequest) {
					settings.ajax_beforeSend(XMLHttpRequest);
				},
				success: function success(response) {
					_this.driveDomForSuccessAfter($table, settings, response, callback);
					settings.ajax_success(response);
				},
				error: function error(XMLHttpRequest, textStatus, errorThrown) {
					settings.ajax_error(XMLHttpRequest, textStatus, errorThrown);
				},
				complete: function complete(XMLHttpRequest, textStatus) {
					settings.ajax_complete(XMLHttpRequest, textStatus);
					_this.removeRefreshingClass(tableWrap);
					_Base.Base.hideLoading(tableWrap);
				}
			});
		}

		/**
   * tableWrap
   * @param tableWrap
      */

	}, {
		key: 'removeRefreshingClass',
		value: function removeRefreshingClass($tableWrap) {
			// 刷新按纽
			var refreshAction = (0, _Base.$)('.page-toolbar .refresh-action', $tableWrap);
			window.setTimeout(function () {
				refreshAction.removeClass('refreshing');
			}, 2000);
		}

		/**
   * 执行ajax成功后重新渲染DOM
   * @param $table
   * @param settings
   * @param response
   * @param callback
      */

	}, {
		key: 'driveDomForSuccessAfter',
		value: function driveDomForSuccessAfter($table, settings, response, callback) {
			// tbody dom
			var tbodyDOM = (0, _Base.$)('tbody', $table);
			var gmName = _Base.Base.getKey($table);

			if (!response) {
				_Base.Base.outLog('请求数据失败！请查看配置参数[ajax_url或ajax_data]是否配置正确，并查看通过该地址返回的数据格式是否正确', 'error');
				return;
			}

			// 用于拼接tbody的HTML结构
			var tbodyTmpHTML = '';
			var parseRes = typeof response === 'string' ? JSON.parse(response) : response;

			// 执行请求后执行程序, 通过该程序可以修改返回值格式
			settings.responseHandler(parseRes);

			var _data = parseRes[settings.dataKey];

			// 文本对齐属性
			var alignAttr = null;

			// 数据模板
			var template = null;

			// 数据模板导出的html
			var templateHTML = null;

			// 数据为空时
			if (!_data || _data.length === 0) {
				tbodyTmpHTML = '<tr emptyTemplate>\n\t\t\t\t\t\t\t\t\t\t<td colspan="' + (0, _Base.$)('th[th-visible="visible"]', $table).length + '">\n\t\t\t\t\t\t\t\t\t\t' + (settings.emptyTemplate || '<div class="gm-emptyTemplate">数据为空</div>') + '\n\t\t\t\t\t\t\t\t\t\t</td>\n\t\t\t\t\t\t\t\t\t</tr>';
				parseRes.totals = 0;
				tbodyDOM.html(tbodyTmpHTML);
			} else {
				// 为数据追加序号字段
				if (settings.supportAutoOrder) {
					var _pageData = settings.pageData;
					var _orderBaseNumber = 1;

					// 验证是否存在分页数据
					if (_pageData && _pageData['pSize'] && _pageData['cPage']) {
						_orderBaseNumber = _pageData.pSize * (_pageData.cPage - 1) + 1;
					}
					_data = _data.map(function (item, index) {
						item[_Order2.default.key] = _orderBaseNumber + index;
						return item;
					});
				}

				// 为数据追加全选字段
				if (settings.supportCheckbox) {
					_data = _data.map(function (item, index) {
						item[_Checkbox2.default.key] = false;
						return item;
					});
				}
				var tdList = [];
				_Base.$.each(_data, function (index, row) {
					_Cache2.default.setRowData(gmName, index, row);
					tbodyTmpHTML += '<tr cache-key="' + index + '">';
					_Base.$.each(settings.columnMap, function (key, col) {
						template = col.template;
						templateHTML = typeof template === 'function' ? template(row[col.key], row) : row[col.key];
						alignAttr = col.align ? 'align="' + col.align + '"' : '';
						// 插件自带列(序号,全选) 的 templateHTML会包含dom节点, 所以需要特殊处理一下
						tdList[col.index] = col.isAutoCreate ? templateHTML : '<td gm-create="false" ' + alignAttr + '>' + templateHTML + '</td>';
					});
					tbodyTmpHTML += tdList.join('');
					tbodyTmpHTML += '</tr>';
				});
				tbodyDOM.html(tbodyTmpHTML);
				this.resetTd($table, false);
			}
			// 渲染分页
			if (settings.supportAjaxPage) {
				_AjaxPage2.default.resetPageData($table, parseRes[settings.totalsKey]);
				_Menu2.default.checkMenuPageAction($table);
			}
			typeof callback === 'function' ? callback() : '';
		}
	}, {
		key: 'createDOM',


		/**
   * 渲染HTML，根据配置嵌入所需的事件源DOM
   * @param $table
      */
		value: function createDOM($table) {
			var settings = _Cache2.default.getSettings($table);
			$table.attr('width', '100%').attr('cellspacing', 1).attr('cellpadding', 0);
			var theadHtml = '<thead grid-manager-thead>';
			var tbodyHtml = '<tbody></tbody>';

			// 文本对齐属性
			var alignAttr = '';

			// 宽度信息
			var widthInfo = '';

			// 提醒对应的html片段
			var remindHtml = '';

			// 排序对应的html片段
			var sortingHtml = '';

			// th显示状态
			var thVisible = '';

			// 将 columnMap 转换为 数组
			// 转换的原因是为了处理用户记忆
			var thList = [];
			if (settings.disableCache) {
				_Base.$.each(settings.columnMap, function (key, col) {
					thList.push(col);
				});
			} else {
				_Base.$.each(settings.columnMap, function (key, col) {
					thList[col.index] = col;
				});
			}

			// thList 生成thead
			_Base.$.each(thList, function (index, col) {
				// 表头提醒
				if (settings.supportRemind && typeof col.remind === 'string' && col.remind !== '') {
					remindHtml = 'remind="' + col.remind + '"';
				}

				// 排序
				sortingHtml = '';
				if (settings.supportSorting && typeof col.sorting === 'string') {
					if (col.sorting === settings.sortDownText) {
						sortingHtml = 'sorting="' + settings.sortDownText + '"';
						settings.sortData[col.key] = settings.sortDownText;
						_Cache2.default.setSettings($table, settings);
					} else if (col.sorting === settings.sortUpText) {
						sortingHtml = 'sorting="' + settings.sortUpText + '"';
						settings.sortData[col.key] = settings.sortUpText;
						_Cache2.default.setSettings($table, settings);
					} else {
						sortingHtml = 'sorting=""';
					}
				}

				// 宽度文本
				widthInfo = col.width ? 'width="' + col.width + '"' : '';

				// 文本对齐
				alignAttr = col.align ? 'align="' + col.align + '"' : '';

				// th可视状态值
				thVisible = _Base.Base.getVisibleForColumn(col);

				// 拼接th
				switch (col.key) {
					// 插件自动生成序号列
					case _Order2.default.key:
						theadHtml += _Order2.default.getThString($table, thVisible);
						break;
					// 插件自动生成选择列
					case _Checkbox2.default.key:
						theadHtml += _Checkbox2.default.getThString($table, thVisible);
						break;
					// 普通列
					default:
						theadHtml += '<th gm-create="false" th-name="' + col.key + '" th-visible="' + thVisible + '" ' + remindHtml + ' ' + sortingHtml + ' ' + widthInfo + ' ' + alignAttr + '>' + col.text + '</th>';
						break;
				}
			});
			theadHtml += '</thead>';
			$table.html(theadHtml + tbodyHtml);

			// 绑定选择框事件
			if (settings.supportCheckbox) {
				_Checkbox2.default.bindCheckboxEvent($table);
			}

			// 存储原始th DOM
			_Cache2.default.setOriginalThDOM($table);

			// 是否为插件自动生成的序号列
			var isLmOrder = null;

			// 是否为插件自动生成的选择列
			var isLmCheckbox = null;

			// 单个table下的thead
			var onlyThead = (0, _Base.$)('thead[grid-manager-thead]', $table);

			// 单个table下的TH
			var onlyThList = (0, _Base.$)('th', onlyThead);

			// 外围的html片段
			var wrapHtml = '<div class="table-wrap">\n\t\t\t\t\t\t<div class="table-div" style="height:calc(' + settings.height + ' - 40px)"></div>\n\t\t\t\t\t\t<span class="text-dreamland"></span>\n\t\t\t\t\t</div>';
			$table.wrap(wrapHtml);

			// 单个table所在的DIV容器
			var tableWarp = $table.closest('.table-wrap');

			// 嵌入配置列表DOM
			if (settings.supportConfig) {
				tableWarp.append(_Config2.default.html);
			}

			// 嵌入Ajax分页DOM
			if (settings.supportAjaxPage) {
				tableWarp.append(_AjaxPage2.default.createHtml($table));
				_AjaxPage2.default.initAjaxPage($table);
			}

			// 嵌入导出表格数据事件源
			if (settings.supportExport) {
				tableWarp.append(_Export2.default.html);
			}
			var configList = (0, _Base.$)('.config-list', tableWarp);

			// 单个TH
			var onlyTH = null;

			// 单个TH所占宽度
			var onlyWidth = 0;

			// 单个TH下的上层DIV
			var onlyThWarp = (0, _Base.$)('<div class="th-wrap"></div>');
			_Base.$.each(onlyThList, function (i2, v2) {
				onlyTH = (0, _Base.$)(v2);
				// onlyTH.attr('th-visible', 'visible');

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

				// 嵌入配置列表项
				if (settings.supportConfig) {
					configList.append('<li th-name="' + onlyTH.attr('th-name') + '">\n\t\t\t\t\t\t\t\t<input type="checkbox"/>\n\t\t\t\t\t\t\t\t<label>\n\t\t\t\t\t\t\t\t\t<span class="fake-checkbox"></span>\n\t\t\t\t\t\t\t\t\t' + onlyTH.text() + '\n\t\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t</li>');
				}

				// 嵌入拖拽事件源
				// 插件自动生成的排序与选择列不做事件绑定
				if (settings.supportDrag && !isLmOrder && !isLmCheckbox) {
					onlyThWarp.html('<span class="th-text drag-action">' + onlyTH.html() + '</span>');
				} else {
					onlyThWarp.html('<span class="th-text">' + onlyTH.html() + '</span>');
				}

				// 嵌入表头提醒事件源
				// 插件自动生成的排序与选择列不做事件绑定
				if (settings.supportRemind && onlyTH.attr('remind') !== undefined && !isLmOrder && !isLmCheckbox) {
					var remindDOM = (0, _Base.$)(_Remind2.default.html);
					remindDOM.find('.ra-title').text(onlyTH.text());
					remindDOM.find('.ra-con').text(onlyTH.attr('remind') || onlyTH.text());
					onlyThWarp.append(remindDOM);
				}

				// 嵌入排序事件源
				// 插件自动生成的排序与选择列不做事件绑定
				// 排序类型
				var sortType = onlyTH.attr('sorting');
				if (settings.supportSorting && sortType !== undefined && !isLmOrder && !isLmCheckbox) {
					var sortingDom = (0, _Base.$)(_Sort2.default.html);

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
					onlyThWarp.append(sortingDom);
				}
				// 嵌入宽度调整事件源,插件自动生成的选择列不做事件绑定
				if (settings.supportAdjust && !isLmOrder && !isLmCheckbox) {
					var adjustDOM = (0, _Base.$)(_Adjust2.default.html);
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

					// 宽度配置: 非GM自动创建的列
				} else {
					// 当前th文本所占宽度大于设置的宽度
					var _minWidth = _Base.Base.getTextWidth(onlyTH);
					var _oldWidth = onlyTH.width();
					onlyWidth = _oldWidth > _minWidth ? _oldWidth : _minWidth;
				}

				// 清除width属性, 使用style.width进行宽度控制
				onlyTH.removeAttr('width');
				onlyTH.width(onlyWidth);
			});

			// 删除渲染中标识、增加渲染完成标识
			$table.removeClass('GridManager-loading');
			$table.addClass('GridManager-ready');
		}

		/**
   * 重置列表, 处理局部刷新、分页事件之后的td排序
   * @param dom: able 或者 tr
   * @param isSingleRow: 指定DOM节点是否为tr[布尔值]
      */

	}, {
		key: 'resetTd',
		value: function resetTd(dom, isSingleRow) {
			var _table = null;
			var _tr = null;
			if (isSingleRow) {
				_tr = (0, _Base.$)(dom);
				_table = _tr.closest('table');
			} else {
				_table = (0, _Base.$)(dom);
				_tr = _table.find('tbody tr');
			}

			if (!_tr || _tr.length === 0) {
				return false;
			}
			// 依据配置对列表进行隐藏、显示
			this.initVisible(_table);
		}

		/**
   * 根据配置项初始化列显示|隐藏 (th 和 td)
   * @param $table
   */

	}, {
		key: 'initVisible',
		value: function initVisible($table) {
			// tbody下的tr
			var _trList = (0, _Base.$)('tbody tr', $table);
			var _th = null;
			var _td = null;
			var _visible = 'visible';
			var settings = _Cache2.default.getSettings($table);
			_Base.$.each(settings.columnMap, function (i, col) {
				_th = (0, _Base.$)('th[th-name="' + col.key + '"]', $table);
				_visible = _Base.Base.getVisibleForColumn(col);
				_th.attr('th-visible', _visible);
				_Base.$.each(_trList, function (i2, v2) {
					_td = (0, _Base.$)('td', v2).eq(_th.index());
					_td.attr('td-visible', _visible);
				});
			});
		}
	}]);

	return Core;
}();

exports.default = new Core();

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * I18n: 国际化
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * */


var _Base = __webpack_require__(0);

var _Cache = __webpack_require__(1);

var _Cache2 = _interopRequireDefault(_Cache);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var I18n = function () {
	function I18n() {
		_classCallCheck(this, I18n);
	}

	_createClass(I18n, [{
		key: 'getLanguage',

		/**
   * 获取所用语种，暂时支持[zh-cn:简体中文，en-us:美式英语] 默认zh-cn
   * @param $table
   * @returns {string|string}
      */
		value: function getLanguage($table) {
			return _Cache2.default.getSettings($table).i18n;
		}

		/**
   * 指定[表格 键值 语种]获取对应文本
   * @param $table 表格
   * @param key 键值
   * @param language 语种
   * @returns {*|string}
      */

	}, {
		key: 'getText',
		value: function getText($table, key, language) {
			return _Cache2.default.getSettings($table).textConfig[key][language || this.getLanguage($table)] || '';
		}

		/**
   * 获取与当前配置国际化匹配的文本
   * @param $table
   * @param key 指向的文本索引
   * @param v1 可为空，也存在一至3项，只存在一项时可为数组
   * @param v2 可为空，也存在一至3项，只存在一项时可为数组
   * @param v3 可为空，也存在一至3项，只存在一项时可为数组
      * @returns {string}
      */

	}, {
		key: 'i18nText',
		value: function i18nText($table, key, v1, v2, v3) {
			var _this = this;
			var intrusion = [];

			// 处理参数，实现多态化
			if (arguments.length === 3 && _typeof(arguments[2]) === 'object') {
				intrusion = arguments[2];
			} else if (arguments.length > 1) {
				for (var i = 1; i < arguments.length; i++) {
					intrusion.push(arguments[i]);
				}
			}
			var _text = '';
			try {
				_text = _this.getText($table, key);
				if (!intrusion || intrusion.length === 0) {
					return _text;
				}
				_text = _text.replace(/{\d+}/g, function (word) {
					return intrusion[word.match(/\d+/)];
				});
				return _text;
			} catch (e) {
				_Base.Base.outLog('\u672A\u627E\u5230\u4E0E' + key + '\u76F8\u5339\u914D\u7684' + _this.getLanguage($table) + '\u8BED\u8A00', 'warn');
				return '';
			}
		}
	}]);

	return I18n;
}();

exports.default = new I18n();

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * AjaxPage: 分页
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * */


var _Base = __webpack_require__(0);

var _Core = __webpack_require__(3);

var _Core2 = _interopRequireDefault(_Core);

var _Cache = __webpack_require__(1);

var _Cache2 = _interopRequireDefault(_Cache);

var _I18n = __webpack_require__(4);

var _I18n2 = _interopRequireDefault(_I18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var AjaxPage = function () {
	function AjaxPage() {
		_classCallCheck(this, AjaxPage);
	}

	_createClass(AjaxPage, [{
		key: 'createHtml',

		/**
   * 分页所需HTML
   * @param $table
   * @returns {string}
      */
		value: function createHtml($table) {
			var html = '<div class="page-toolbar">\n\t\t\t\t\t\t<div class="refresh-action"><i class="iconfont icon-shuaxin"></i></div>\n\t\t\t\t\t\t<div class="goto-page">\n\t\t\t\t\t\t\t' + _I18n2.default.i18nText($table, 'goto-first-text') + '\n\t\t\t\t\t\t\t<input type="text" class="gp-input"/>\n\t\t\t\t\t\t\t' + _I18n2.default.i18nText($table, 'goto-last-text') + '\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="change-size"><select name="pSizeArea"></select></div>\n\t\t\t\t\t\t<div class="dataTables_info"></div>\n\t\t\t\t\t\t<div class="ajax-page"><ul class="pagination"></ul></div>\n\t\t\t\t\t</div>';
			return html;
		}

		/**
   * 初始化分页
   * @param $table
      */

	}, {
		key: 'initAjaxPage',
		value: function initAjaxPage($table) {
			var settings = _Cache2.default.getSettings($table);
			var _this = this;
			var tableWarp = $table.closest('.table-wrap');

			// 分页工具条
			var pageToolbar = (0, _Base.$)('.page-toolbar', tableWarp);
			var sizeData = settings.sizeData;
			pageToolbar.hide();

			// 生成每页显示条数选择框
			_this.createPageSizeDOM($table, sizeData);

			// 绑定页面跳转事件
			_this.bindPageJumpEvent($table);

			// 绑定设置显示条数切换事件
			_this.bindSetPageSizeEvent($table);
		}

		/**
   * 生成页码DOM节点
   * @param $table
   * @param pageData 分页数据格式
      */

	}, {
		key: 'createPaginationDOM',
		value: function createPaginationDOM($table, pageData) {
			var tableWarp = $table.closest('.table-wrap');

			// 分页工具条
			var pageToolbar = (0, _Base.$)('.page-toolbar', tableWarp);

			// 分页区域
			var pagination = (0, _Base.$)('.pagination', pageToolbar);

			pagination.html(this.joinPagination($table, pageData));
		}

		/**
   * 拼接页码字符串
   * @param $table
   * @param pageData 分页数据格式
      */

	}, {
		key: 'joinPagination',
		value: function joinPagination($table, pageData) {
			// 当前页
			var cPage = Number(pageData.cPage || 0);

			// 总页数
			var tPage = Number(pageData.tPage || 0);

			// 临时存储分页HTML片段
			var tHtml = '';

			// 临时存储末尾页码THML片段
			var lHtml = '';

			// 配置首页
			var firstClassName = 'first-page';
			var previousClassName = 'previous-page';

			if (cPage === 1) {
				firstClassName += ' disabled';
				previousClassName += ' disabled';
			}
			tHtml += '<li c-page="1" class="' + firstClassName + '">\n\t\t\t\t\t' + _I18n2.default.i18nText($table, 'first-page') + '\n\t\t\t\t</li>\n\t\t\t\t<li c-page="' + (cPage - 1) + '" class="' + previousClassName + '">\n\t\t\t\t\t' + _I18n2.default.i18nText($table, 'previous-page') + '\n\t\t\t\t</li>';
			// 循环开始数
			var i = 1;

			// 循环结束数
			var maxI = tPage;

			// 配置first端省略符
			if (cPage > 4) {
				tHtml += '<li c-page="1">\n\t\t\t\t\t\t1\n\t\t\t\t\t</li>\n\t\t\t\t\t<li class="disabled">\n\t\t\t\t\t\t...\n\t\t\t\t\t</li>';
				i = cPage - 2;
			}
			// 配置last端省略符
			if (tPage - cPage > 4) {
				maxI = cPage + 2;
				lHtml += '<li class="disabled">\n\t\t\t\t\t\t...\n\t\t\t\t\t</li>\n\t\t\t\t\t<li c-page="' + tPage + '">\n\t\t\t\t\t\t' + tPage + '\n\t\t\t\t\t</li>';
			}
			// 配置页码
			for (i; i <= maxI; i++) {
				if (i === cPage) {
					tHtml += '<li class="active">' + cPage + '</li>';
					continue;
				}
				tHtml += '<li c-page="' + i + '">' + i + '</li>';
			}
			tHtml += lHtml;

			// 配置下一页与尾页
			var nextClassName = 'next-page';
			var lastClassName = 'last-page';
			if (cPage >= tPage) {
				nextClassName += ' disabled';
				lastClassName += ' disabled';
			}
			tHtml += '<li c-page="' + (cPage + 1) + '" class="' + nextClassName + '">\n\t\t\t\t\t' + _I18n2.default.i18nText($table, 'next-page') + '\n\t\t\t\t</li>\n\t\t\t\t<li c-page="' + tPage + '" class="' + lastClassName + '">\n\t\t\t\t\t' + _I18n2.default.i18nText($table, 'last-page') + '\n\t\t\t\t</li>';
			return tHtml;
		}

		/**
   * 生成每页显示条数选择框据
   * @param $table
   * @param _sizeData_ 选择框自定义条数
      */

	}, {
		key: 'createPageSizeDOM',
		value: function createPageSizeDOM($table, _sizeData_) {
			var tableWarp = $table.closest('.table-wrap');

			// 分页工具条
			var pageToolbar = (0, _Base.$)('.page-toolbar', tableWarp);

			// 分页区域
			var pSizeArea = (0, _Base.$)('select[name="pSizeArea"]', pageToolbar);

			// error
			if (!_sizeData_ || _sizeData_.length === 0) {
				_Base.Base.outLog('渲染失败：参数[sizeData]配置错误', 'error');
				return;
			}

			var _ajaxPageHtml = '';
			_Base.$.each(_sizeData_, function (i, v) {
				_ajaxPageHtml += '<option value="' + v + '">\n\t\t\t\t\t\t\t\t' + v + '\n\t\t\t\t\t\t\t</option>';
			});
			pSizeArea.html(_ajaxPageHtml);
		}

		/**
   * 绑定页面跳转事件
   * @param $table
      */

	}, {
		key: 'bindPageJumpEvent',
		value: function bindPageJumpEvent($table) {
			var tableWarp = $table.closest('.table-wrap');

			// 分页工具条
			var pageToolbar = (0, _Base.$)('.page-toolbar', tableWarp);

			this.bindPageClick($table, pageToolbar);
			this.bindInputEvent($table, pageToolbar);
			this.bindRefreshEvent($table, pageToolbar);
		}

		/**
   * 绑定分页点击事件
   * @param $table
   * @param pageToolbar
      */

	}, {
		key: 'bindPageClick',
		value: function bindPageClick($table, pageToolbar) {
			var _this = this;

			pageToolbar.off('click', 'li').on('click', 'li', function () {
				var pageAction = (0, _Base.$)(this);

				// 分页页码
				var cPage = pageAction.attr('c-page');
				if (!cPage || !Number(cPage) || pageAction.hasClass('disabled')) {
					_Base.Base.outLog('指定页码无法跳转,已停止。原因:1、可能是当前页已处于选中状态; 2、所指向的页不存在', 'info');
					return false;
				}
				cPage = window.parseInt(cPage);
				_this.gotoPage($table, cPage);
			});
		}

		/**
   * 绑定快捷跳转事件
   * @param $table
   * @param pageToolbar
      */

	}, {
		key: 'bindInputEvent',
		value: function bindInputEvent($table, pageToolbar) {
			var _this = this;
			var gp_input = (0, _Base.$)('.gp-input', pageToolbar);

			gp_input.unbind('keyup').bind('keyup', function (e) {
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
		}

		/**
   * 绑定刷新界面事件
   * @param $table
   * @param pageToolbar
      */

	}, {
		key: 'bindRefreshEvent',
		value: function bindRefreshEvent($table, pageToolbar) {
			var _this = this;
			var refreshAction = (0, _Base.$)('.refresh-action', pageToolbar);

			refreshAction.unbind('click').bind('click', function () {
				var _tableWarp = (0, _Base.$)(this).closest('.table-wrap');
				var _table = (0, _Base.$)('table[grid-manager]', _tableWarp);
				var _input = (0, _Base.$)('.page-toolbar .gp-input', _tableWarp);
				var _value = _input.val();

				// 跳转输入框为空时: 刷新当前页
				if (_value.trim() === '') {
					_Core2.default.__refreshGrid(_table);
					return;
				}

				// 跳转输入框不为空时: 验证输入值是否有效,如果有效跳转至指定页,如果无效对输入框进行聚焦
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
   * @param $table
   * @param _cPage 指定页
      */

	}, {
		key: 'gotoPage',
		value: function gotoPage($table, _cPage) {
			var settings = _Cache2.default.getSettings($table);

			// 跳转的指定页大于总页数
			if (_cPage > settings.pageData.tPage) {
				_cPage = settings.pageData.tPage;
			}

			// 替换被更改的值
			settings.pageData.cPage = _cPage;
			settings.pageData.pSize = settings.pageData.pSize || settings.pageSize;

			// 更新缓存
			_Cache2.default.setSettings($table, settings);

			// 调用事件、渲染DOM
			var query = _Base.$.extend({}, settings.query, settings.sortData, settings.pageData);
			settings.pagingBefore(query);
			_Core2.default.__refreshGrid($table, function () {
				settings.pagingAfter(query);
			});
		}

		/**
   * 绑定设置当前页显示数事件
   * @param $table
      */

	}, {
		key: 'bindSetPageSizeEvent',
		value: function bindSetPageSizeEvent($table) {
			var tableWarp = $table.closest('.table-wrap');

			// 分页工具条
			var pageToolbar = (0, _Base.$)('.page-toolbar', tableWarp);

			// 切换条数区域
			var sizeArea = (0, _Base.$)('select[name=pSizeArea]', pageToolbar);

			if (!sizeArea || sizeArea.length === 0) {
				_Base.Base.outLog('未找到单页显示数切换区域，停止该事件绑定', 'info');
				return false;
			}
			sizeArea.unbind('change');
			sizeArea.bind('change', function () {
				var _size = (0, _Base.$)(this);
				var _tableWarp = _size.closest('.table-wrap');
				var _table = (0, _Base.$)('table[grid-manager]', _tableWarp);
				var settings = _Cache2.default.getSettings($table);
				settings.pageData = {
					cPage: 1,
					pSize: window.parseInt(_size.val())
				};

				_Cache2.default.saveUserMemory(_table);

				// 更新缓存
				_Cache2.default.setSettings($table, settings);

				// 调用事件、渲染tbody
				var query = _Base.$.extend({}, settings.query, settings.sortData, settings.pageData);
				settings.pagingBefore(query);
				_Core2.default.__refreshGrid(_table, function () {
					settings.pagingAfter(query);
				});
			});
		}

		/**
   * 重置每页显示条数, 重置条数文字信息 [注: 这个方法只做显示更新, 不操作Cache 数据]
   * @param $table
   * @param _pageData_ 分页数据格式
   * @returns {boolean}
      */

	}, {
		key: 'resetPSize',
		value: function resetPSize($table, _pageData_) {
			var tableWarp = $table.closest('.table-wrap');
			var toolBar = (0, _Base.$)('.page-toolbar', tableWarp);
			var pSizeArea = (0, _Base.$)('select[name="pSizeArea"]', toolBar);
			var pSizeInfo = (0, _Base.$)('.dataTables_info', toolBar);
			if (!pSizeArea || pSizeArea.length === 0) {
				_Base.Base.outLog('未找到条数切换区域，停止该事件绑定', 'info');
				return false;
			}

			// 从多少开始
			var fromNum = _pageData_.cPage === 1 ? 1 : (_pageData_.cPage - 1) * _pageData_.pSize + 1;

			// 到多少结束
			var toNum = _pageData_.cPage * _pageData_.pSize;

			// 总共条数
			var totalNum = _pageData_.tSize;

			var tmpHtml = _I18n2.default.i18nText($table, 'dataTablesInfo', [fromNum, toNum, totalNum]);

			// 根据返回值修正单页条数显示值
			pSizeArea.val(_pageData_.pSize || 10);

			// 修改条数文字信息
			pSizeInfo.html(tmpHtml);
			pSizeArea.show();
			return true;
		}

		/**
   * 重置分页数据
   * @param $table
   * @param totals 总条数
      */

	}, {
		key: 'resetPageData',
		value: function resetPageData($table, totals) {
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
			_Cache2.default.setSettings($table, _Base.$.extend(true, settings, { pageData: _pageData }));

			var tableWarp = $table.closest('.table-wrap');

			// 分页工具条
			var pageToolbar = (0, _Base.$)('.page-toolbar', tableWarp);
			pageToolbar.show();

			// 计算分页数据
			function getPageData(tSize) {
				var _pSize = settings.pageData.pSize || settings.pageSize;
				var _tSize = tSize;
				var _cPage = settings.pageData.cPage || 1;
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
   * @param $table
      */

	}, {
		key: 'configPageForCache',
		value: function configPageForCache($table) {
			var settings = _Cache2.default.getSettings($table);
			var _data = _Cache2.default.getUserMemory($table);

			// 缓存对应
			var _cache = _data.cache;

			// 每页显示条数
			var _pSize = null;

			// 验证是否存在每页显示条数缓存数据
			if (!_cache || !_cache.page || !_cache.page.pSize) {
				_pSize = settings.pageSize || 10;
			} else {
				_pSize = _cache.page.pSize;
			}
			var pageData = {
				pSize: _pSize,
				cPage: 1
			};
			_Base.$.extend(settings, { pageData: pageData });
			_Cache2.default.setSettings($table, settings);
		}
	}]);

	return AjaxPage;
}();

exports.default = new AjaxPage();

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Export: 数据导出
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * */


var _Base = __webpack_require__(0);

var _Core = __webpack_require__(3);

var _Core2 = _interopRequireDefault(_Core);

var _Cache = __webpack_require__(1);

var _Cache2 = _interopRequireDefault(_Cache);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Export = function () {
	function Export() {
		_classCallCheck(this, Export);
	}

	_createClass(Export, [{
		key: 'createExportHTML',


		/**
   * 拼接要导出html格式数据
   * @param theadHTML
   * @param tbodyHTML
   * @returns {string}
      */
		value: function createExportHTML(theadHTML, tbodyHTML) {
			var exportHTML = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">\n\t\t\t\t\t\t\t\t<head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"></head>\n\t\t\t\t\t\t\t\t<body>\n\t\t\t\t\t\t\t\t\t<table>\n\t\t\t\t\t\t\t\t\t\t<thead>\n\t\t\t\t\t\t\t\t\t\t\t' + theadHTML + '\n\t\t\t\t\t\t\t\t\t\t</thead>\n\t\t\t\t\t\t\t\t\t\t<tbody>\n\t\t\t\t\t\t\t\t\t\t\t' + tbodyHTML + '\n\t\t\t\t\t\t\t\t\t\t</tbody>\n\t\t\t\t\t\t\t\t\t</table>\n\t\t\t\t\t\t\t\t</body>\n\t\t\t\t\t\t\t</html>';
			return exportHTML;
		}

		/**
   * 导出表格 .xls
   * @param $table:当前操作的grid,由插件自动传入
   * @param fileName: 导出后的文件名
   * @param onlyChecked: 是否只导出已选中的表格
   * @returns {boolean}
      * @private
      */

	}, {
		key: '__exportGridToXls',
		value: function __exportGridToXls($table, fileName, onlyChecked) {
			var Settings = _Cache2.default.getSettings($table);
			// createDOM内添加
			var gmExportAction = (0, _Base.$)('#gm-export-action');
			if (gmExportAction.length === 0) {
				_Core2.default.outLog('导出失败，请查看配置项:supportExport是否配置正确', 'error');
				return false;
			}

			// type base64
			var uri = 'data:application/vnd.ms-excel;base64,';

			// 存储导出的thead数据

			var theadHTML = '';

			// 存储导出的tbody下的数据
			var tbodyHTML = '';

			var thDOM = (0, _Base.$)('thead[grid-manager-thead] th[th-visible="visible"][gm-create="false"]', $table);
			var trDOM = null;
			var tdDOM = null;

			// 验证：是否只导出已选中的表格
			if (onlyChecked) {
				trDOM = (0, _Base.$)('tbody tr[checked="true"]', $table);
			} else {
				trDOM = (0, _Base.$)('tbody tr', $table);
			}

			_Base.$.each(thDOM, function (i, v) {
				theadHTML += '<th>' + v.getElementsByClassName('th-text')[0].textContent + '</th>';
			});

			_Base.$.each(trDOM, function (i, v) {
				tdDOM = (0, _Base.$)('td[gm-create="false"][td-visible="visible"]', v);
				tbodyHTML += '<tr>';
				_Base.$.each(tdDOM, function (i2, v2) {
					tbodyHTML += v2.outerHTML;
				});
				tbodyHTML += '</tr>';
			});

			// 拼接要导出html格式数据
			var exportHTML = this.createExportHTML(theadHTML, tbodyHTML);
			gmExportAction.prop('href', uri + base64(exportHTML));
			gmExportAction.prop('download', (fileName || Settings.gridManagerName) + '.xls');
			gmExportAction.get(0).click();

			function base64(s) {
				return window.btoa(unescape(encodeURIComponent(s)));
			}

			// 成功后返回true
			return true;
		}
	}, {
		key: 'html',

		/**
   * 导出所需的HTML
   * @returns {string}
      */
		get: function get() {
			var html = '<a href="" download="" id="gm-export-action"></a>';
			return html;
		}
	}]);

	return Export;
}();

exports.default = new Export();

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by baukh on 17/10/26.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * 构造类
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


__webpack_require__(21);

var _Base = __webpack_require__(0);

var _Adjust = __webpack_require__(2);

var _Adjust2 = _interopRequireDefault(_Adjust);

var _AjaxPage = __webpack_require__(5);

var _AjaxPage2 = _interopRequireDefault(_AjaxPage);

var _Cache = __webpack_require__(1);

var _Cache2 = _interopRequireDefault(_Cache);

var _Config = __webpack_require__(9);

var _Config2 = _interopRequireDefault(_Config);

var _Core = __webpack_require__(3);

var _Core2 = _interopRequireDefault(_Core);

var _Drag = __webpack_require__(16);

var _Drag2 = _interopRequireDefault(_Drag);

var _Export = __webpack_require__(6);

var _Export2 = _interopRequireDefault(_Export);

var _Menu = __webpack_require__(10);

var _Menu2 = _interopRequireDefault(_Menu);

var _Remind = __webpack_require__(12);

var _Remind2 = _interopRequireDefault(_Remind);

var _Scroll = __webpack_require__(18);

var _Scroll2 = _interopRequireDefault(_Scroll);

var _Sort = __webpack_require__(13);

var _Sort2 = _interopRequireDefault(_Sort);

var _Store = __webpack_require__(14);

var _Store2 = _interopRequireDefault(_Store);

var _Hover = __webpack_require__(17);

var _Hover2 = _interopRequireDefault(_Hover);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var GridManager = function () {
	function GridManager() {
		_classCallCheck(this, GridManager);
	}

	_createClass(GridManager, [{
		key: 'init',


		/**
   * [对外公开方法]
   * @param table
   * @param arg: 参数
   * @param callback: 回调
   * @returns {*}
   */
		value: function init(table, arg, callback) {
			var $table = (0, _Base.jTool)(table);
			// 参数中未存在配置项 gridManagerName: 使用table DOM 上的 grid-manager属性
			if (typeof arg.gridManagerName !== 'string' || arg.gridManagerName.trim() === '') {
				// 存储gridManagerName值
				arg.gridManagerName = _Base.Base.getKey($table);
				// 参数中存在配置项 gridManagerName: 更新table DOM 的 grid-manager属性
			} else {
				$table.attr('grid-manager', arg.gridManagerName);
			}

			// 通过版本较验 清理缓存
			_Cache2.default.cleanTableCacheForVersion();

			// 初始化设置相关: 合并, 存储
			var settings = _Cache2.default.initSettings($table, arg);

			// 校验 gridManagerName
			if (settings.gridManagerName.trim() === '') {
				_Base.Base.outLog('请在html标签中为属性[grid-manager]赋值或在配置项中配置gridManagerName', 'error');
				return false;
			}

			// 校验 当前表格是否已经渲染
			if ($table.hasClass('GridManager-ready') || $table.hasClass('GridManager-loading')) {
				_Base.Base.outLog('渲染失败：可能该表格已经渲染或正在渲染', 'error');
				return false;
			}

			// 根据本地缓存配置每页显示条数
			if (settings.supportAjaxPage) {
				_AjaxPage2.default.configPageForCache($table);
			}

			// 增加渲染中标注
			$table.addClass('GridManager-loading');

			// 初始化表格
			this.initTable($table, settings);

			// 如果初始获取缓存失败，在渲染完成后首先存储一次数据
			if (typeof $table.attr('grid-manager-cache-error') !== 'undefined') {
				window.setTimeout(function () {
					_Cache2.default.saveUserMemory($table);
					$table.removeAttr('grid-manager-cache-error');
				}, 1000);
			}
			// 启用回调
			typeof callback === 'function' ? callback(settings.query) : '';
			return $table;
		}

		/**
   * 初始化列表
   * @param $table
   * @param settings
      */

	}, {
		key: 'initTable',
		value: function initTable($table, settings) {

			// 渲染HTML，嵌入所需的事件源DOM
			_Core2.default.createDOM($table);

			// 通过缓存配置成功后, 重置宽度调整事件源dom
			settings.supportAdjust ? _Adjust2.default.resetAdjust($table) : '';

			// 绑定宽度调整事件
			if (settings.supportAdjust) {
				_Adjust2.default.bindAdjustEvent($table);
			}

			// 绑定拖拽换位事件
			if (settings.supportDrag) {
				_Drag2.default.bindDragEvent($table);
			}

			// 绑定排序事件
			if (settings.supportSorting) {
				_Sort2.default.bindSortingEvent($table);
			}

			// 绑定表头提示事件
			if (settings.supportRemind) {
				_Remind2.default.bindRemindEvent($table);
			}

			// 绑定配置列表事件
			if (settings.supportConfig) {
				_Config2.default.bindConfigEvent($table);
			}

			// 绑定$table区域hover事件
			_Hover2.default.onTbodyHover($table);

			// 绑定表头置顶功能
			_Scroll2.default.bindScrollFunction($table);

			// 绑定右键菜单事件
			_Menu2.default.bindRightMenuEvent($table);

			// 渲染tbodyDOM
			_Core2.default.__refreshGrid($table);
		}
	}], [{
		key: 'get',


		/**
   * @静态方法
   * 获取Table 对应 GridManager的实例
   * @param table
   * @returns {*}
   */
		value: function get(table) {
			// return Cache.__getGridManager(jTool(table));
			return _Cache2.default.getSettings((0, _Base.jTool)(table));
		}

		/**
   * @静态方法
   * 获取指定表格的本地存储数据
   * 成功则返回本地存储数据,失败则返回空对象
   * @param table
   * @returns {{}}
      */

	}, {
		key: 'getLocalStorage',
		value: function getLocalStorage(table) {
			return _Cache2.default.getUserMemory((0, _Base.jTool)(table));
		}

		/**
   * @静态方法
   * 清除指定表的表格记忆数据,  如果未指定删除的table, 则全部清除
   * @param table
   * @returns {boolean}
      */

	}, {
		key: 'clear',
		value: function clear(table) {
			return _Cache2.default.cleanTableCache((0, _Base.jTool)(table), '通过clear()方法清除');
		}

		/**
   * @静态方法
   * 获取当前行渲染时使用的数据
   * @param table
   * @param target 将要获取数据所对应的tr[Element or NodeList]
   * @returns {{}}
      */

	}, {
		key: 'getRowData',
		value: function getRowData(table, target) {
			return _Cache2.default.__getRowData((0, _Base.jTool)(table), target);
		}

		/**
   * @静态方法
   * 手动设置排序
   * @param table
   * @param sortJson 需要排序的json串 如:{th-name:'down'} value需要与参数sortUpText 或 sortDownText值相同
   * @param callback 回调函数[function]
      * @param refresh 是否执行完成后对表格进行自动刷新[boolean, 默认为true]
      */

	}, {
		key: 'setSort',
		value: function setSort(table, sortJson, callback, refresh) {
			_Sort2.default.__setSort((0, _Base.jTool)(table), sortJson, callback, refresh);
		}

		/**
   * @静态方法
   * 显示Th及对应的TD项
   * @param table
   * @param target
      */

	}, {
		key: 'showTh',
		value: function showTh(table, target) {
			_Base.Base.setAreVisible((0, _Base.jTool)(target), true);
		}

		/**
   * @静态方法
   * 隐藏Th及对应的TD项
   * @param table
   * @param target
      */

	}, {
		key: 'hideTh',
		value: function hideTh(table, target) {
			_Base.Base.setAreVisible((0, _Base.jTool)(target), false);
		}

		/**
   * @静态方法
   * 导出表格 .xls
   * @param table
   * @param fileName 导出后的文件名
   * @param onlyChecked 是否只导出已选中的表格
   * @returns {boolean}
      */

	}, {
		key: 'exportGridToXls',
		value: function exportGridToXls(table, fileName, onlyChecked) {
			return _Export2.default.__exportGridToXls((0, _Base.jTool)(table), fileName, onlyChecked);
		}

		/**
   * @静态方法
   * 设置查询条件
   * @param table
   * @param query: 配置的数据 [Object]
   * @param callback: 回调函数
   * @param isGotoFirstPage: 是否返回第一页[Boolean default=true]
   * 注意事项:
   * - query的key值如果与分页及排序等字段冲突, query中的值将会被忽略.
   * - setQuery() 会立即触发刷新操作
   * - 在此配置的query在分页事件触发时, 会以参数形式传递至pagingAfter(query)事件内
   * - setQuery对query字段执行的操作是修改而不是合并, 每次执行setQuery都会将之前配置的query值覆盖
   */

	}, {
		key: 'setQuery',
		value: function setQuery(table, query, isGotoFirstPage, callback) {
			var $table = (0, _Base.jTool)(table);
			var settings = _Cache2.default.getSettings($table);
			if (typeof isGotoFirstPage !== 'boolean') {
				callback = isGotoFirstPage;
				isGotoFirstPage = true;
			}
			_Base.jTool.extend(settings, { query: query });
			if (isGotoFirstPage) {
				settings.pageData.cPage = 1;
			}
			_Cache2.default.setSettings($table, settings);
			_Core2.default.__refreshGrid($table, callback);
		}

		/**
   * @静态方法
   * 配置静态数ajaxData
   * @param table
   * @param ajaxData: 配置的数据
   */

	}, {
		key: 'setAjaxData',
		value: function setAjaxData(table, ajaxData) {
			var $table = (0, _Base.jTool)(table);
			var settings = _Cache2.default.getSettings($table);
			_Base.jTool.extend(settings, { ajax_data: ajaxData });
			_Cache2.default.setSettings($table, settings);
			_Core2.default.__refreshGrid($table);
		}

		/**
   * @静态方法
   * 刷新表格 使用现有参数重新获取数据，对表格数据区域进行渲染
   * @param table
   * @param isGotoFirstPage:  是否刷新时跳转至第一页[boolean类型, 默认false]
   * @param callback: 回调函数
   */

	}, {
		key: 'refreshGrid',
		value: function refreshGrid(table, isGotoFirstPage, callback) {
			var $table = (0, _Base.jTool)(table);
			var settings = _Cache2.default.getSettings($table);
			if (typeof isGotoFirstPage !== 'boolean') {
				callback = isGotoFirstPage;
				isGotoFirstPage = false;
			}
			if (isGotoFirstPage) {
				settings.pageData['cPage'] = 1;
				_Cache2.default.setSettings($table, settings);
			}
			_Core2.default.__refreshGrid($table, callback);
		}
	}, {
		key: 'getCheckedTr',


		/**
   * @静态方法
   * 获取当前选中的行
   * @param table
   * @returns {NodeList} 当前选中的行
      */
		value: function getCheckedTr(table) {
			return table.querySelectorAll('tbody tr[checked="true"]');
		}
	}, {
		key: 'getCheckedData',


		/**
   * @静态方法
   * 获取当前选中行渲染时使用的数据
   * @param table
   * @returns {{}}
      */
		value: function getCheckedData(table) {
			var $table = (0, _Base.jTool)(table);
			return _Cache2.default.__getRowData($table, this.getCheckedTr(table));
		}
	}, {
		key: 'version',

		/**
   * @静态方法
   * 版本号
   * GridManager.version || GM.version
   * @returns {string}
   */
		get: function get() {
			return _Store2.default.version;
		}
	}]);

	return GridManager;
}();

exports.default = GridManager;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Checkbox: 数据选择/全选/返选
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * */


var _Base = __webpack_require__(0);

var _I18n = __webpack_require__(4);

var _I18n2 = _interopRequireDefault(_I18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Checkbox = function () {
	function Checkbox() {
		_classCallCheck(this, Checkbox);

		// 序号的唯一标识
		this.key = 'gm_checkbox';
	}

	/**
  * 获取 th 的字符串节点
  * @param $table
  * @returns {string}
     */


	_createClass(Checkbox, [{
		key: 'getThString',
		value: function getThString($table, thVisible) {
			var checkboxHtml = '<th th-name="' + this.key + '" th-visible="' + thVisible + '" gm-checkbox="true" gm-create="true">\n\t\t\t\t\t\t\t\t<input type="checkbox"/>\n\t\t\t\t\t\t\t\t<span style="display: none">\n\t\t\t\t\t\t\t\t\t' + _I18n2.default.i18nText($table, 'checkall-text') + '\n\t\t\t\t\t\t\t\t</span>\n\t\t\t\t\t\t\t</th>';
			return checkboxHtml;
		}
		/**
   * 获取选择列对象
   * @param $table
   * @param language
   * @returns {{key: string, name: (*|string), isShow: boolean, width: string, align: string}}
   */

	}, {
		key: 'getColumn',
		value: function getColumn($table, language) {
			return {
				key: this.key,
				text: _I18n2.default.getText($table, 'checkall-text', language),
				isAutoCreate: true,
				isShow: true,
				width: '50px',
				align: 'center',
				template: function template(nodeData) {
					return '<td gm-checkbox="true" gm-create="true"><input type="checkbox" ' + (nodeData ? 'checked="checked"' : '') + '/></td>';
				}
			};
		}

		/**
   * 绑定选择框事件
   * @param $table
      */

	}, {
		key: 'bindCheckboxEvent',
		value: function bindCheckboxEvent($table) {
			var _this = this;
			$table.off('click', 'input[type="checkbox"]');
			$table.on('click', 'input[type="checkbox"]', function () {
				// 存储th中的checkbox的选中状态
				var _thChecked = true;

				// 全选键事件源
				var _checkAction = (0, _Base.$)(this);

				// th中的选择框
				var _thCheckbox = (0, _Base.$)('thead th[gm-checkbox] input[type="checkbox"]', $table);

				// td中的选择框
				var _tdCheckbox = (0, _Base.$)('tbody td[gm-checkbox] input[type="checkbox"]', $table);

				// 当前为全选事件源
				if (_checkAction.closest('th[th-name="' + _this.key + '"]').length === 1) {
					_Base.$.each(_tdCheckbox, function (i, v) {
						v.checked = _checkAction.prop('checked');
						(0, _Base.$)(v).closest('tr').attr('checked', v.checked);
					});
				} else {
					// 当前为单个选择
					_Base.$.each(_tdCheckbox, function (i, v) {
						if (v.checked === false) {
							_thChecked = false;
						}
						(0, _Base.$)(v).closest('tr').attr('checked', v.checked);
					});
					_thCheckbox.prop('checked', _thChecked);
				}
			});
		}
	}]);

	return Checkbox;
}();

exports.default = new Checkbox();

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Config: th配置
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * */


var _Base = __webpack_require__(0);

var _Cache = __webpack_require__(1);

var _Cache2 = _interopRequireDefault(_Cache);

var _Adjust = __webpack_require__(2);

var _Adjust2 = _interopRequireDefault(_Adjust);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Config = function () {
	function Config() {
		_classCallCheck(this, Config);
	}

	_createClass(Config, [{
		key: 'bindConfigEvent',


		/**
   * 绑定配置列表事件[隐藏展示列]
   * @param $table
      */
		value: function bindConfigEvent($table) {
			var settings = _Cache2.default.getSettings($table);
			// GM容器
			var tableWarp = $table.closest('div.table-wrap');

			// 打开/关闭设置事件源
			var configAction = (0, _Base.$)('.config-action', tableWarp);

			// 事件: 打开 关闭
			configAction.unbind('click');
			configAction.bind('click', function () {
				// 展示事件源
				var _configAction = (0, _Base.$)(this);

				var _tableWrap = _configAction.closest('.table-wrap');

				// 设置区域
				var _configArea = _tableWrap.find('.config-area');

				// 关闭配置区域
				if (_configArea.css('display') === 'block') {
					_configArea.hide();
					return false;
				}

				// 选中状态的li
				var checkLi = null;

				// 选中状态的input
				var checkInput = null;

				// 验证当前是否只有一列处于显示状态 并根据结果进行设置是否可以取消显示
				var showNum = 0;
				settings.columnData.forEach(function (col) {
					checkLi = (0, _Base.$)('li[th-name="' + col.key + '"]', _configArea);
					checkInput = (0, _Base.$)('input[type="checkbox"]', checkLi);
					if (col.isShow) {
						checkLi.addClass('checked-li');
						checkInput.prop('checked', true);
						showNum++;
						return;
					}
					checkLi.removeClass('checked-li');
					checkInput.prop('checked', false);
				});
				var checkedLi = (0, _Base.$)('.checked-li', _configArea);
				showNum === 1 ? checkedLi.addClass('no-click') : checkedLi.removeClass('no-click');

				// 打开配置区域
				_configArea.show();
			});

			// 事件: 设置
			(0, _Base.$)('.config-list li', tableWarp).unbind('click');
			(0, _Base.$)('.config-list li', tableWarp).bind('click', function () {
				// 单个的设置项
				var _only = (0, _Base.$)(this);

				// 单个设置项的thName
				var _thName = _only.attr('th-name');

				// 事件下的checkbox
				var _checkbox = _only.find('input[type="checkbox"]');

				// 所在的大容器
				var _tableWarp = _only.closest('.table-wrap');

				// 所在的table-div
				var _tableDiv = (0, _Base.$)('.table-div', _tableWarp);

				// 所对应的table
				var _table = (0, _Base.$)('[grid-manager]', _tableWarp);

				// 所对应的th
				var _th = (0, _Base.$)('thead[grid-manager-thead] th[th-name="' + _thName + '"]', _table);

				// 最后一项显示列不允许隐藏
				if (_only.hasClass('no-click')) {
					return false;
				}
				_only.closest('.config-list').find('.no-click').removeClass('no-click');
				var isVisible = !_checkbox.prop('checked');

				// 设置与当前td同列的td是否可见
				_tableDiv.addClass('config-editing');
				_Base.Base.setAreVisible(_th, isVisible, function () {
					_tableDiv.removeClass('config-editing');
				});

				// 更新配置信息
				// TODO 今天时间问题, 之后需要处理
				// TODO 在配置, 调整宽度, 位置更换后, 应该统一使用同一个方法对 columnMap 进行更新
				settings.columnMap[_thName].isShow = isVisible;
				_Cache2.default.setSettings($table, settings);

				// 当前处于选中状态的展示项
				var _checkedList = (0, _Base.$)('.config-area input[type="checkbox"]:checked', _tableWarp);

				// 限制最少显示一列
				if (_checkedList.length === 1) {
					_checkedList.parent().addClass('no-click');
				}

				// 重置调整宽度事件源
				if (settings.supportAdjust) {
					_Adjust2.default.resetAdjust(_table);
				}

				// 重置镜像滚动条的宽度
				(0, _Base.$)('.sa-inner', _tableWarp).width('100%');

				// 重置当前可视th的宽度
				var _visibleTh = (0, _Base.$)('thead[grid-manager-thead] th[th-visible="visible"]', _table);
				_Base.$.each(_visibleTh, function (i, v) {
					// 特殊处理: GM自动创建的列使终为50px
					if (v.getAttribute('gm-create') === 'true') {
						v.style.width = '50px';
					} else {
						v.style.width = 'auto';
					}
				});

				// 当前th文本所占宽度大于设置的宽度
				// 需要在上一个each执行完后才可以获取到准确的值
				_Base.$.each(_visibleTh, function (i, v) {
					var _realWidthForThText = _Base.Base.getTextWidth(v);
					var _thWidth = (0, _Base.$)(v).width();
					if (_thWidth < _realWidthForThText) {
						(0, _Base.$)(v).width(_realWidthForThText);
					} else {
						(0, _Base.$)(v).width(_thWidth);
					}
				});

				// 存储用户记忆
				_Cache2.default.saveUserMemory(_table);

				// 处理置顶表头
				var topThead = (0, _Base.$)('thead.set-top', _table);
				if (topThead.length === 1) {
					topThead.remove();
					_tableDiv.trigger('scroll');
				}
			});
		}
	}, {
		key: 'html',

		/**
   * 表格配置区域HTML
   * @returns {string}
      */
		get: function get() {
			var html = '<div class="config-area">\n\t\t\t\t\t\t<span class="config-action">\n\t\t\t\t\t\t\t<i class="iconfont icon-31xingdongdian"></i>\n\t\t\t\t\t\t</span>\n\t\t\t\t\t\t<ul class="config-list"></ul>\n\t\t\t\t\t</div>';
			return html;
		}
	}]);

	return Config;
}();

exports.default = new Config();

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * GridManager: 右键菜单
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * */


var _Base = __webpack_require__(0);

var _Cache = __webpack_require__(1);

var _Cache2 = _interopRequireDefault(_Cache);

var _I18n = __webpack_require__(4);

var _I18n2 = _interopRequireDefault(_I18n);

var _Export = __webpack_require__(6);

var _Export2 = _interopRequireDefault(_Export);

var _AjaxPage = __webpack_require__(5);

var _AjaxPage2 = _interopRequireDefault(_AjaxPage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Menu = function () {
	function Menu() {
		_classCallCheck(this, Menu);
	}

	_createClass(Menu, [{
		key: 'checkMenuPageAction',

		/**
   * 验证菜单区域: 禁用、开启分页操作
   * @param $table
      */
		value: function checkMenuPageAction($table) {
			var Settings = _Cache2.default.getSettings($table);
			// 右键菜单区上下页限制
			var gridMenu = (0, _Base.$)('.grid-menu[grid-master="' + Settings.gridManagerName + '"]');
			if (!gridMenu || gridMenu.length === 0) {
				return;
			}
			var previousPage = (0, _Base.$)('[refresh-type="previous"]', gridMenu);
			var nextPage = (0, _Base.$)('[refresh-type="next"]', gridMenu);
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

		/**
   * 绑定右键菜单事件
   * @param $table
      */

	}, {
		key: 'bindRightMenuEvent',
		value: function bindRightMenuEvent($table) {
			var _this = this;
			var Settings = _Cache2.default.getSettings($table);
			var tableWarp = $table.closest('.table-wrap');

			// 刷新当前表格
			var menuHTML = '<div class="grid-menu" grid-master="' + Settings.gridManagerName + '">';

			// 分页类操作
			if (Settings.supportAjaxPage) {
				menuHTML += '<span grid-action="refresh-page" refresh-type="previous">\n\t\t\t\t\t\t\t' + _I18n2.default.i18nText($table, 'previous-page') + '\n\t\t\t\t\t\t\t<i class="iconfont icon-sanjiao2"></i>\n\t\t\t\t\t\t</span>\n\t\t\t\t\t\t<span grid-action="refresh-page" refresh-type="next">\n\t\t\t\t\t\t\t' + _I18n2.default.i18nText($table, 'next-page') + '\n\t\t\t\t\t\t\t<i class="iconfont icon-sanjiao1"></i>\n\t\t\t\t\t\t</span>';
			}
			menuHTML += '<span grid-action="refresh-page" refresh-type="refresh">\n\t\t\t\t\t\t' + _I18n2.default.i18nText($table, 'refresh') + '\n\t\t\t\t\t\t<i class="iconfont icon-31shuaxin"></i>\n\t\t\t\t\t</span>';
			// 导出类
			if (Settings.supportExport) {
				menuHTML += '<span class="grid-line"></span>\n\t\t\t\t\t\t<span grid-action="export-excel" only-checked="false">\n\t\t\t\t\t\t\t' + _I18n2.default.i18nText($table, 'save-as-excel') + '\n\t\t\t\t\t\t\t<i class="iconfont icon-baocun"></i>\n\t\t\t\t\t\t</span>\n\t\t\t\t\t\t<span grid-action="export-excel" only-checked="true">\n\t\t\t\t\t\t\t' + _I18n2.default.i18nText($table, 'save-as-excel-for-checked') + '\n\t\t\t\t\t\t\t<i class="iconfont icon-saveas24"></i>\n\t\t\t\t\t\t</span>';
			}
			// 配置类
			if (Settings.supportConfig) {
				menuHTML += '<span class="grid-line"></span>\n\t\t\t\t\t\t<span grid-action="config-grid">\n\t\t\t\t\t\t\t' + _I18n2.default.i18nText($table, 'config-grid') + '\n\t\t\t\t\t\t\t<i class="iconfont icon-shezhi"></i>\n\t\t\t\t\t\t</span>';
			}
			menuHTML += '</div>';
			var _body = (0, _Base.$)('body');
			_body.append(menuHTML);

			// 绑定打开右键菜单栏
			var menuDOM = (0, _Base.$)('.grid-menu[grid-master="' + Settings.gridManagerName + '"]');
			tableWarp.unbind('contextmenu');
			tableWarp.bind('contextmenu', function (e) {
				e.preventDefault();
				e.stopPropagation();

				// 验证：如果不是tbdoy或者是tbody的子元素，直接跳出
				if (e.target.nodeName !== 'TBODY' && (0, _Base.$)(e.target).closest('tbody').length === 0) {
					console.log('contextmenu    !TBODY');
					return;
				}

				// 验证：当前是否存在已选中的项
				var exportExcelOfChecked = (0, _Base.$)('[grid-action="export-excel"][only-checked="true"]');
				if ((0, _Base.$)('tbody tr[checked="true"]', (0, _Base.$)('table[grid-manager="' + Settings.gridManagerName + '"]')).length === 0) {
					exportExcelOfChecked.addClass('disabled');
				} else {
					exportExcelOfChecked.removeClass('disabled');
				}

				var menuWidth = menuDOM.width();
				var menuHeight = menuDOM.height();
				var offsetHeight = document.documentElement.offsetHeight;
				var offsetWidth = document.documentElement.offsetWidth;
				var top = offsetHeight < e.clientY + menuHeight ? e.clientY - menuHeight : e.clientY;
				var left = offsetWidth < e.clientX + menuWidth ? e.clientX - menuWidth : e.clientX;
				menuDOM.css({
					top: top + tableWarp.get(0).scrollTop + (document.body.scrollTop || document.documentElement.scrollTop),
					left: left + tableWarp.get(0).scrollLeft + (document.body.scrollLeft || document.documentElement.scrollLeft)
				});

				// 隐藏非当前展示表格的菜单项
				(0, _Base.$)('.grid-menu[grid-master]').hide();
				menuDOM.show();
				_body.off('mousedown.gridMenu');
				_body.on('mousedown.gridMenu', function (e) {
					var eventSource = (0, _Base.$)(e.target);
					if (eventSource.hasClass('.grid-menu') || eventSource.closest('.grid-menu').length === 1) {
						return;
					}
					_body.off('mousedown.gridMenu');
					menuDOM.hide();
				});
			});

			// 绑定事件：上一页、下一页、重新加载
			var refreshPage = (0, _Base.$)('[grid-action="refresh-page"]');
			refreshPage.unbind('click');
			refreshPage.bind('click', function (e) {
				if (_this.isDisabled(this, e)) {
					return false;
				}
				var _gridMenu = (0, _Base.$)(this).closest('.grid-menu');
				var _table = (0, _Base.$)('table[grid-manager="' + _gridMenu.attr('grid-master') + '"]');
				var refreshType = this.getAttribute('refresh-type');
				var Settings = _Cache2.default.getSettings(_table);
				var cPage = Settings.pageData.cPage;

				// 上一页
				if (refreshType === 'previous' && Settings.pageData.cPage > 1) {
					cPage = Settings.pageData.cPage - 1;
					// 下一页
				} else if (refreshType === 'next' && Settings.pageData.cPage < Settings.pageData.tPage) {
					cPage = Settings.pageData.cPage + 1;
					// 重新加载
				} else if (refreshType === 'refresh') {
					cPage = Settings.pageData.cPage;
				}

				_AjaxPage2.default.gotoPage(_table, cPage);
				_body.off('mousedown.gridMenu');
				_gridMenu.hide();
			});

			// 绑定事件：另存为EXCEL、已选中表格另存为Excel
			var exportExcel = (0, _Base.$)('[grid-action="export-excel"]');
			exportExcel.unbind('click');
			exportExcel.bind('click', function (e) {
				if (_this.isDisabled(this, e)) {
					return false;
				}
				var _gridMenu = (0, _Base.$)(this).closest('.grid-menu');
				var _table = (0, _Base.$)('table[grid-manager="' + _gridMenu.attr('grid-master') + '"]');
				var onlyChecked = false;
				if (this.getAttribute('only-checked') === 'true') {
					onlyChecked = true;
				}
				_Export2.default.__exportGridToXls(_table, undefined, onlyChecked);
				_body.off('mousedown.gridMenu');
				_gridMenu.hide();
			});

			// 绑定事件：配置表
			var settingGrid = (0, _Base.$)('[grid-action="config-grid"]');
			settingGrid.unbind('click');
			settingGrid.bind('click', function (e) {
				if (_this.isDisabled(this, e)) {
					return false;
				}
				var _gridMenu = (0, _Base.$)(this).closest('.grid-menu');
				var _table = (0, _Base.$)('table[grid-manager="' + _gridMenu.attr('grid-master') + '"]');
				var configArea = (0, _Base.$)('.config-area', _table.closest('.table-wrap'));
				(0, _Base.$)('.config-action', configArea).trigger('click');
				_body.off('mousedown.gridMenu');
				_gridMenu.hide();
			});
		}

		/**
   * 获取右键菜单中的某项 是为禁用状态. 若为禁用状态清除事件默认行为
   * @param dom
   * @param events
   * @returns {boolean}
      */

	}, {
		key: 'isDisabled',
		value: function isDisabled(dom, events) {
			if ((0, _Base.$)(dom).hasClass('disabled')) {
				events.stopPropagation();
				events.preventDefault();
				return true;
			} else {
				return false;
			}
		}
	}]);

	return Menu;
}();

exports.default = new Menu();

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Order: 序号
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * */


var _Base = __webpack_require__(0);

var _I18n = __webpack_require__(4);

var _I18n2 = _interopRequireDefault(_I18n);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Order = function () {
	function Order() {
		_classCallCheck(this, Order);

		// 序号的唯一标识
		this.key = 'gm_order';
	}

	/**
  * 获取 th 的字符串节点
  * @param $table
  * @returns {string}
  */


	_createClass(Order, [{
		key: 'getThString',
		value: function getThString($table, thVisible) {
			return '<th th-name="' + this.key + '" th-visible="' + thVisible + '" gm-order="true" gm-create="true">' + _I18n2.default.i18nText($table, 'order-text') + '</th>';
		}

		/**
   * 获取 td 的字符串节点
   * @param orderText
      */
		// getTdString(orderText) {
		// 	return `<td gm-order="true" gm-create="true">${orderText}</td>`;
		// }

		/**
   * 获取序号列对象
   * @param $table
   * @param language
   * @returns {{key: string, name: (*|string), isShow: boolean, width: string, align: string}}
      */

	}, {
		key: 'getColumn',
		value: function getColumn($table, language) {
			return {
				key: this.key,
				text: _I18n2.default.getText($table, 'order-text', language),
				isAutoCreate: true,
				isShow: true,
				width: '50px',
				align: 'center',
				template: function template(nodeData) {
					return '<td gm-order="true" gm-create="true">' + nodeData + '</td>';
				}
			};
		}

		/**
   * 生成序号DOM
   * @param $table
   * @returns {boolean}
      */

	}, {
		key: 'initDOM',
		value: function initDOM($table) {
			var orderHtml = '<th th-name="' + Order.key + '" gm-order="true" gm-create="true">' + _I18n2.default.i18nText($table, 'order-text') + '</th>';
			(0, _Base.jTool)('thead tr', $table).prepend(orderHtml);
			if ((0, _Base.jTool)('th[th-name="' + Order.key + '"]', $table).length === 0) {
				return false;
			}
			return true;
		}
	}]);

	return Order;
}();

exports.default = new Order();

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Remind: 表头提醒
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * */


var _Base = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Remind = function () {
	function Remind() {
		_classCallCheck(this, Remind);
	}

	_createClass(Remind, [{
		key: 'bindRemindEvent',


		/**
   * 绑定表头提醒功能
   * @param table
      */
		value: function bindRemindEvent(table) {
			var remindAction = (0, _Base.$)('.remind-action', table);
			remindAction.unbind('mouseenter');
			remindAction.bind('mouseenter', function () {
				var raArea = (0, _Base.$)(this).find('.ra-area');
				var tableDiv = (0, _Base.$)(this).closest('.table-div');
				raArea.show();
				var theLeft = tableDiv.get(0).offsetWidth - ((0, _Base.$)(this).offset().left - tableDiv.offset().left) > raArea.get(0).offsetWidth;
				raArea.css({
					left: theLeft ? '0px' : 'auto',
					right: theLeft ? 'auto' : '0px'
				});
			});
			remindAction.unbind('mouseleave');
			remindAction.bind('mouseleave', function () {
				var raArea = (0, _Base.$)(this).find('.ra-area');
				raArea.hide();
			});
		}
	}, {
		key: 'html',

		/**
   * 获取表头提醒所需HTML
   * @returns {string}
      */
		get: function get() {
			var html = '<div class="remind-action">\n\t\t\t\t\t\t<i class="ra-help iconfont icon-icon"></i>\n\t\t\t\t\t\t<div class="ra-area">\n\t\t\t\t\t\t\t<span class="ra-title"></span>\n\t\t\t\t\t\t\t<span class="ra-con"></span>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>';
			return html;
		}
	}]);

	return Remind;
}();

exports.default = new Remind();

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     * Sort: 排序
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     * */


var _Base = __webpack_require__(0);

var _Core = __webpack_require__(3);

var _Core2 = _interopRequireDefault(_Core);

var _Cache = __webpack_require__(1);

var _Cache2 = _interopRequireDefault(_Cache);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Sort = function () {
	function Sort() {
		_classCallCheck(this, Sort);
	}

	_createClass(Sort, [{
		key: '__setSort',


		/*
   * 手动设置排序
   * @param sortJson: 需要排序的json串 如:{th-name:'down'} value需要与参数sortUpText 或 sortDownText值相同
   * @param callback: 回调函数[function]
   * @param refresh: 是否执行完成后对表格进行自动刷新[boolean, 默认为true]
   *
   * 排序json串示例:
   * sortJson => {name: 'ASC}
   * */
		value: function __setSort($table, sortJson, callback, refresh) {
			var settings = _Cache2.default.getSettings($table);
			if (!sortJson || _Base.$.type(sortJson) !== 'object' || _Base.$.isEmptyObject(sortJson)) {
				return false;
			}
			_Base.$.extend(settings.sortData, sortJson);
			_Cache2.default.setSettings($table, settings);

			// 默认执行完后进行刷新列表操作
			if (typeof refresh === 'undefined') {
				refresh = true;
			}
			var _th = null;
			var _sortAction = null;
			var _sortType = null;
			for (var s in sortJson) {
				_th = (0, _Base.$)('[th-name="' + s + '"]', $table);
				_sortType = sortJson[s];
				_sortAction = (0, _Base.$)('.sorting-action', _th);
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

	}, {
		key: 'bindSortingEvent',
		value: function bindSortingEvent($table) {
			var _this = this;
			var settings = _Cache2.default.getSettings($table);

			// 向上或向下事件源
			var action = null;

			// 事件源所在的th
			var th = null;

			// 事件源所在的table
			var table = null;

			// th对应的名称
			var thName = null;

			// 绑定排序事件
			$table.off('mouseup', '.sorting-action');
			$table.on('mouseup', '.sorting-action', function () {
				action = (0, _Base.$)(this);
				th = action.closest('th');
				table = th.closest('table');
				thName = th.attr('th-name');
				if (!thName || _Base.$.trim(thName) === '') {
					_Base.Base.outLog('排序必要的参数丢失', 'error');
					return false;
				}

				// 根据组合排序配置项判定：是否清除原排序及排序样式
				if (!settings.isCombSorting) {
					_Base.$.each((0, _Base.$)('.sorting-action', table), function (i, v) {
						// action.get(0) 当前事件源的DOM
						if (v !== action.get(0)) {
							(0, _Base.$)(v).removeClass('sorting-up sorting-down');
							(0, _Base.$)(v).closest('th').attr('sorting', '');
						}
					});
				}

				// 更新排序样式
				_this.updateSortStyle(action, th, settings);

				// 当前触发项为置顶表头时, 同步更新至原样式
				if (th.closest('thead[grid-manager-mock-thead]').length === 1) {
					var _th = (0, _Base.$)('thead[grid-manager-thead] th[th-name="' + thName + '"]', table);
					var _action = (0, _Base.$)('.sorting-action', _th);
					_this.updateSortStyle(_action, _th, settings);
				}
				// 拼装排序数据: 单列排序
				settings.sortData = {};
				if (!settings.isCombSorting) {
					settings.sortData[th.attr('th-name')] = th.attr('sorting');
					// 拼装排序数据: 组合排序
				} else {
					_Base.$.each((0, _Base.$)('thead[grid-manager-thead] th[th-name][sorting]', table), function (i, v) {
						if (v.getAttribute('sorting') !== '') {
							settings.sortData[v.getAttribute('th-name')] = v.getAttribute('sorting');
						}
					});
				}
				// 调用事件、渲染tbody
				_Cache2.default.setSettings($table, settings);
				console.log(2222);
				var query = _Base.$.extend({}, settings.query, settings.sortData, settings.pageData);
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

	}, {
		key: 'updateSortStyle',
		value: function updateSortStyle(sortAction, th, settings) {
			// 排序操作：升序
			if (sortAction.hasClass('sorting-down')) {
				sortAction.addClass('sorting-up');
				sortAction.removeClass('sorting-down');
				th.attr('sorting', settings.sortUpText);
				// 排序操作：降序
			} else {
				sortAction.addClass('sorting-down');
				sortAction.removeClass('sorting-up');
				th.attr('sorting', settings.sortDownText);
			}
		}
	}, {
		key: 'html',

		/**
   * 获取排序所需HTML
   * @returns {string}
      */
		get: function get() {
			var html = '<div class="sorting-action">\n\t\t\t\t\t\t<i class="sa-icon sa-up iconfont icon-sanjiao2"></i>\n\t\t\t\t\t\t<i class="sa-icon sa-down iconfont icon-sanjiao1"></i>\n\t\t\t\t\t</div>';
			return html;
		}
	}]);

	return Sort;
}();

exports.default = new Sort();

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
/**
 * Created by baukh on 17/10/24.
 * 实例化数据的存储对象
 */

var Store = {
	// 版本号
	version: '2.3.17',

	// GM实例
	gridManager: {},

	// GM使用的数据
	responseData: {},

	// 表渲染前的th
	originalTh: {},

	// 表配置信息存储器
	settings: {
		// columnData: 表配置项, 在宽度\位置等信息变化后 会 即时更新
		// columnMap: 是在GridManager.js中通过columnData生成的, 在宽度\位置等信息变化后 会 即时更新
		// 其它配置项...
	}
};

exports.default = Store;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.publishMethodArray = exports.PublishMethod = undefined;

var _GridManager = __webpack_require__(7);

var _GridManager2 = _interopRequireDefault(_GridManager);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } /**
                                                                                                                                                           * Created by baukh on 17/4/14.
                                                                                                                                                           * 公开方法
                                                                                                                                                           * 参数中的table, 将由组件自动添加
                                                                                                                                                           */


var PublishMethodClass = function PublishMethodClass() {
	_classCallCheck(this, PublishMethodClass);

	/*
  * 通过jTool实例获取GridManager
  * */
	this.get = function (table) {
		return _GridManager2.default.get(table);
	};

	/*
  * 获取指定表格的本地存储数据
  * */
	this.getLocalStorage = function (table) {
		return _GridManager2.default.getLocalStorage(table);
	};

	/*
  * 清除指定表的表格记忆数据
  * */
	this.clear = function (table) {
		return _GridManager2.default.clear(table);
	};

	/*
  * @获取当前行渲染时使用的数据
  * */
	this.getRowData = function (table, target) {
		return _GridManager2.default.getRowData(table, target);
	};

	/*
  * 手动设置排序
  * */
	this.setSort = function (table, sortJson, callback, refresh) {
		_GridManager2.default.setSort(table, sortJson, callback, refresh);
	};

	/*
  * 显示Th及对应的TD项
  * */
	this.showTh = function (table, target) {
		_GridManager2.default.showTh(table, target);
	};

	/*
  * 隐藏Th及对应的TD项
  * */
	this.hideTh = function (table, target) {
		_GridManager2.default.hideTh(table, target);
	};

	/*
  * 导出表格 .xls
  * */
	this.exportGridToXls = function (table, fileName, onlyChecked) {
		return _GridManager2.default.exportGridToXls(table, fileName, onlyChecked);
	};

	/**
  * 设置查询条件
  */
	this.setQuery = function (table, query, isGotoFirstPage, callback) {
		_GridManager2.default.setQuery(table, query, isGotoFirstPage, callback);
	};

	/**
  * 配置静态数ajaxData
  */
	this.setAjaxData = function (table, ajaxData) {
		_GridManager2.default.setAjaxData(table, ajaxData);
	};

	/*
  * 刷新表格 使用现有参数重新获取数据，对表格数据区域进行渲染
  * */
	this.refreshGrid = function (table, isGotoFirstPage, callback) {
		_GridManager2.default.refreshGrid(table, isGotoFirstPage, callback);
	};

	/*
  * 获取当前选中的行
  * */
	this.getCheckedTr = function (table) {
		return _GridManager2.default.getCheckedTr(table);
	};

	/*
  * 获取当前选中行渲染时使用的数据
  * */
	this.getCheckedData = function (table) {
		return _GridManager2.default.getCheckedData(table);
	};
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


var PublishMethod = new PublishMethodClass();
var publishMethodArray = ['init'];
for (var key in PublishMethod) {
	publishMethodArray.push(key);
}
exports.PublishMethod = PublishMethod;
exports.publishMethodArray = publishMethodArray;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Drag: 拖拽
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * */


var _Base = __webpack_require__(0);

var _Adjust = __webpack_require__(2);

var _Adjust2 = _interopRequireDefault(_Adjust);

var _Cache = __webpack_require__(1);

var _Cache2 = _interopRequireDefault(_Cache);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Drag = function () {
	function Drag() {
		_classCallCheck(this, Drag);
	}

	_createClass(Drag, [{
		key: 'bindDragEvent',

		/**
   * 绑定拖拽换位事件
   * @param $table
   */
		value: function bindDragEvent($table) {
			var _this = this;

			// 指定拖拽换位事件源,配置拖拽样式
			$table.off('mousedown', '.drag-action');
			$table.on('mousedown', '.drag-action', function (event) {
				var $body = (0, _Base.$)('body');

				// 获取设置项
				var settings = _Cache2.default.getSettings($table);

				// 事件源th
				var _th = (0, _Base.$)(this).closest('th');

				// 事件源的上一个th
				var prevTh = null;

				// 事件源的下一个th
				var nextTh = null;

				// 事件源所在的tr
				var _tr = _th.parent();

				// 事件源同层级下的所有可视th
				var _allTh = _tr.find('th[th-visible="visible"]');

				// 事件源所在的table
				var _table = _tr.closest('table');

				// 事件源所在的DIV
				var tableDiv = _table.closest('.table-div');

				// 事件源所在的容器
				var _tableWrap = _table.closest('.table-wrap');

				// 与事件源同列的所有td
				var colTd = _Base.Base.getColTd(_th);

				// 列拖拽触发回调事件
				settings.dragBefore(event);

				// 禁用文字选中效果
				$body.addClass('no-select-text');

				// 更新界面交互标识
				_Base.Base.updateInteractive(_table, 'Drag');

				// 增加拖拽中样式
				_th.addClass('drag-ongoing opacityChange');
				colTd.addClass('drag-ongoing opacityChange');

				// 增加临时展示DOM
				_tableWrap.append('<div class="dreamland-div"></div>');
				var dreamlandDIV = (0, _Base.$)('.dreamland-div', _tableWrap);
				dreamlandDIV.get(0).innerHTML = '<table class="dreamland-table ' + _table.attr('class') + '"></table>';

				// tbody内容：将原tr与td上的属性一并带上，解决一部分样式问题
				var _tbodyHtml = '';
				var _cloneTr = null;
				var _cloneTd = null;
				_Base.$.each(colTd, function (i, v) {
					_cloneTd = v.cloneNode(true);
					_cloneTd.style.height = v.offsetHeight + 'px';
					_cloneTr = (0, _Base.$)(v).closest('tr').clone();
					_tbodyHtml += _cloneTr.html(_cloneTd.outerHTML).get(0).outerHTML;
				});
				var tmpHtml = '<thead>\n\t\t\t\t\t\t\t\t<tr>\n\t\t\t\t\t\t\t\t<th style="height:' + _th.height() + 'px">\n\t\t\t\t\t\t\t\t' + (0, _Base.$)('.drag-action', _th).get(0).outerHTML + '\n\t\t\t\t\t\t\t\t</th>\n\t\t\t\t\t\t\t\t</tr>\n\t\t\t\t\t\t\t</thead>\n\t\t\t\t\t\t\t<tbody>\n\t\t\t\t\t\t\t\t' + _tbodyHtml + '\n\t\t\t\t\t\t\t</tbody>';
				(0, _Base.$)('.dreamland-table', dreamlandDIV).html(tmpHtml);

				// 存储移动时的th所处的位置
				var _thIndex = 0;

				// 绑定拖拽滑动事件
				$body.unbind('mousemove');
				$body.bind('mousemove', function (e2) {
					_thIndex = _th.index(_allTh);
					prevTh = undefined;

					// 当前移动的非第一列
					if (_thIndex > 0) {
						prevTh = _allTh.eq(_thIndex - 1);
					}
					nextTh = undefined;

					// 当前移动的非最后一列
					if (_thIndex < _allTh.length) {
						nextTh = _allTh.eq(_thIndex + 1);
					}
					// 插件自动创建的项,不允许移动
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
					_this.updateDrag(_table, prevTh, nextTh, _th, colTd, dreamlandDIV, haveMockThead);

					// 重置TH对象数据
					_allTh = _tr.find('th');
				});

				// 绑定拖拽停止事件
				$body.unbind('mouseup');
				$body.bind('mouseup', function (event) {
					var settings = _Cache2.default.getSettings($table);
					$body.unbind('mousemove');
					$body.unbind('mouseup');
					// 清除临时展示被移动的列
					dreamlandDIV = (0, _Base.$)('.dreamland-div');
					if (dreamlandDIV.length !== 0) {
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

					// 更新表格列Map
					_Base.$.each(settings.columnMap, function (key, col) {
						col.index = (0, _Base.$)('th[th-name="' + col.key + '"]', $table).index();
					});
					_Cache2.default.setSettings($table, settings);

					// 存储用户记忆
					_Cache2.default.saveUserMemory(_table);

					// 重置调整宽度事件源
					if (settings.supportAdjust) {
						_Adjust2.default.resetAdjust(_table);
					}
					// 开启文字选中效果
					$body.removeClass('no-select-text');

					// 更新界面交互标识
					_Base.Base.updateInteractive(_table);
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
   * @param haveMockThead
   */

	}, {
		key: 'updateDrag',
		value: function updateDrag(_table, prevTh, nextTh, _th, colTd, dreamlandDIV, haveMockThead) {
			// 事件源对应的上一组td
			var prevTd = null;

			// 事件源对应的下一组td
			var nextTd = null;

			// 处理向左拖拽
			if (prevTh && prevTh.length !== 0 && dreamlandDIV.offset().left < prevTh.offset().left) {
				prevTd = _Base.Base.getColTd(prevTh);
				prevTh.before(_th);
				_Base.$.each(colTd, function (i, v) {
					prevTd.eq(i).before(v);
				});

				if (haveMockThead) {
					var _prevTh = (0, _Base.$)('thead[grid-manager-thead] th[th-name="' + prevTh.attr('th-name') + '"]', _table);
					var __th = (0, _Base.$)('thead[grid-manager-thead] th[th-name="' + _th.attr('th-name') + '"]', _table);
					_prevTh.before(__th);
				}
				// 处理向右拖拽
			} else if (nextTh && nextTh.length !== 0 && dreamlandDIV.offset().left + dreamlandDIV.width() > nextTh.offset().left) {
				nextTd = _Base.Base.getColTd(nextTh);
				nextTh.after(_th);
				_Base.$.each(colTd, function (i, v) {
					nextTd.eq(i).after(v);
				});

				if (haveMockThead) {
					var _nextTh = (0, _Base.$)('thead[grid-manager-thead] th[th-name="' + nextTh.attr('th-name') + '"]', _table);
					var _th2 = (0, _Base.$)('thead[grid-manager-thead] th[th-name="' + _th.attr('th-name') + '"]', _table);
					_nextTh.after(_th2);
				}
			}
		}
	}]);

	return Drag;
}();

exports.default = new Drag();

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Created by baukh on 17/3/3.
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * 鼠标hover 高亮
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


var _Base = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Hover = function () {
	function Hover() {
		_classCallCheck(this, Hover);
	}

	_createClass(Hover, [{
		key: 'onTbodyHover',
		value: function onTbodyHover($table) {
			var $td = null;
			var $tr = null;
			$table.off('mousemove', 'td');
			$table.on('mousemove', 'td', function () {
				$td = (0, _Base.$)(this);
				$tr = $td.parent();

				// row col 并未发生变化
				if ($td.attr('col-hover') === 'true' && $tr.attr('row-hover') === 'true') {
					return;
				}

				// row 发生变化
				if ($tr.attr('row-hover') !== 'true') {
					(0, _Base.$)('tr[row-hover="true"]', $table).removeAttr('row-hover');
					$tr.attr('row-hover', 'true');
				}

				// col 发生变化
				if ($tr.attr('col-hover') !== 'true') {
					(0, _Base.$)('td[col-hover="true"]', $table).removeAttr('col-hover');
					_Base.Base.getColTd($td).attr('col-hover', 'true');
				}
			});
		}
	}]);

	return Hover;
}();

exports.default = new Hover();

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /*
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Scroll: 滚动轴
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * */


var _Base = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Scroll = function () {
	function Scroll() {
		_classCallCheck(this, Scroll);
	}

	_createClass(Scroll, [{
		key: 'bindScrollFunction',

		/**
   * 绑定表格滚动轴功能
   * @param table
      */
		value: function bindScrollFunction(table) {
			var tableDIV = table.closest('.table-div');

			// 绑定resize事件: 对表头吸顶的列宽度进行修正
			window.addEventListener('resize', function () {
				// 吸顶元素
				var _setTopHead = (0, _Base.$)('.set-top', table);
				if (_setTopHead && _setTopHead.length === 1) {
					_setTopHead.remove();
					table.closest('.table-div').trigger('scroll');
				}
			});

			// 绑定滚动条事件
			tableDIV.unbind('scroll');
			tableDIV.bind('scroll', function (e, _isWindowResize_) {
				var _scrollDOMTop = (0, _Base.$)(this).scrollTop();

				// 列表head
				var _thead = (0, _Base.$)('thead[grid-manager-thead]', table);

				// 列表body
				var _tbody = (0, _Base.$)('tbody', table);

				// 吸顶元素
				var _setTopHead = (0, _Base.$)('.set-top', table);

				// 当前列表数据为空
				if ((0, _Base.$)('tr', _tbody).length === 0) {
					return true;
				}

				// 配置吸顶区的宽度
				if (_setTopHead.length === 0 || _isWindowResize_) {
					_setTopHead.length === 0 ? table.append(_thead.clone(true).addClass('set-top')) : '';
					_setTopHead = (0, _Base.$)('.set-top', table);
					_setTopHead.removeAttr('grid-manager-thead');
					_setTopHead.attr('grid-manager-mock-thead', '');
					_setTopHead.removeClass('scrolling');
					_setTopHead.css({
						width: _thead.width(),
						left: -table.closest('.table-div').scrollLeft() + 'px'
					});

					// 防止window.resize事件后导致的吸顶宽度错误. 可以优化
					_Base.$.each((0, _Base.$)('th', _thead), function (i, v) {
						(0, _Base.$)('th', _setTopHead).eq(i).width((0, _Base.$)(v).width());
					});
				}
				if (_setTopHead.length === 0) {
					return;
				}

				// 删除表头置顶
				if (_scrollDOMTop === 0) {
					_thead.removeClass('scrolling');
					_setTopHead.remove();
					// 显示表头置顶
				} else {
					_thead.addClass('scrolling');
					_setTopHead.css({
						left: -table.closest('.table-div').scrollLeft() + 'px'
					});
				}
				return true;
			});
		}
	}]);

	return Scroll;
}();

exports.default = new Scroll();

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.TextSettings = exports.Settings = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _Base = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } } /**
                                                                                                                                                           * Settings: 配置项
                                                                                                                                                           */


var Settings = function Settings() {
	_classCallCheck(this, Settings);

	/**
  * 拖拽
  */
	var drag = {
		// 是否支持拖拽功能
		supportDrag: true,

		// 拖拽前事件
		dragBefore: _Base.$.noop,

		// 拖拽后事件
		dragAfter: _Base.$.noop
	};

	/**
  * 宽度调整
  */
	var adjust = {
		// 是否支持宽度调整功能
		supportAdjust: true,

		// 宽度调整前事件
		adjustBefore: _Base.$.noop,

		// 宽度调整后事件
		adjustAfter: _Base.$.noop
	};

	/**
  * 表头提醒
  */
	var remind = {
		// 是否支持表头提示信息[需在地应的TH上增加属性remind]
		supportRemind: false
	};

	/**
  * 配置列表
  */
	var config = {
		// 是否支持配置列表功能[操作列是否可见]
		supportConfig: true
	};

	/**
  * 样式
  */
	var gridStyle = {
		// 宽度配置
		width: '100%',

		// 高度配置, 可配置的最小宽度为300px
		height: '300px',

		// 文本对齐方式
		// textAlign: '',       // v2.3.15弃用

		// 动画效果时长
		animateTime: 300
	};

	/**
  * 本地缓存
  */
	var cache = {
		// 是否禁用本地缓存
		disableCache: false
	};

	/**
  * 排序
  */
	var sort = {
		// 排序：是否支持排序功能
		supportSorting: false,

		// 是否为组合排序[只有在支持排序的情况下生效
		isCombSorting: false,

		// 排序字段前缀, 示例: 列名='date', sortKey='sort_', 排序参数则为sort_date
		sortKey: 'sort_',

		// 存储排序数据[不对外公开参数]
		sortData: {},

		// 排序：升序标识[该标识将会传至数据接口]
		sortUpText: 'ASC',

		// 排序：降序标识[该标识将会传至数据接口]
		sortDownText: 'DESC',

		// 排序事件发生前
		sortingBefore: _Base.$.noop,

		// 排序事件发生后
		sortingAfter: _Base.$.noop
	};

	/**
  * 分页
  */
	var ajaxPage = {
		// 是否支持配置列表ajxa分页
		supportAjaxPage: false,

		// 用于配置列表每页展示条数选择框
		sizeData: [10, 20, 30, 50, 100],

		// 每页显示条数，如果使用缓存且存在缓存数据，那么该值将失效
		pageSize: 20,

		// 存储分页数据[不对外公开参数]
		pageData: {},

		// 其它需要带入的参数，该参数中设置的数据会在分页或排序事件中以参数形式传递
		query: {},

		// 分页事件发生前
		pagingBefore: _Base.$.noop,

		// 分页事件发生后
		pagingAfter: _Base.$.noop
	};

	/**
  * 序号
  */
	var autoOrder = {
		// 是否支持自动序号
		supportAutoOrder: true
	};

	/**
  * 选择与反选
  */
	var checkbox = {
		// 是否支持选择与反选
		supportCheckbox: true
	};

	/**
  * 国际化
  */
	var i18n = {
		// 选择使用哪种语言，暂时支持[zh-cn:简体中文，en-us:美式英语] 默认zh-cn
		i18n: 'zh-cn'
	};

	/**
  * 数据交互相关项
  */
	var gridData = {
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
  	 // 列所占宽度, 字符串类型，非必设项
   // 需要注意的是:
   // 1.如果当前列的th内文本实际占用宽度大于该参数指定的宽度时， GridManager会自动进行适配。
   // 2.建议不要将所有的列都进行宽度设置，而留一个进行自动适应
   width: '100px',
  	 // 列文本对齐信息，字符串类型，非必设项
   // 三种值: 'left', 'center', 'right'
   align: '',
  	 // 列的排序类型，字符串类型，非必设项
   // 在初始化参数supportSorting=true时生效。有三种值:
   // 1、'': 该列支持排序，但初始化时不指定排序类型
   // 2、'DESC': 该列支持排序，并在初始化时指定排序类型为降序。可通过参数[sortDownText]来指定降序所使用的字符串
   // 3、'ASC': 该列支持排序，并在初始化时指定排序类型为升序。可通过参数[sortUpText]来指定升序所使用的字符串
   sorting: 'DESC',
  	 // 列的表头提醒内容,字符串类型，非必设项
   // 在初始化参数supportRemind=true时生效
   remind: '文本介绍',
  	 // 自定义列模板，函数类型，非必设项
   // 通过返回的字符串对列进行重绘
   // nodeData: 当前单元格的渲染数据
   // rowData: 当前单元格所在行的渲染数据, 本例中: 参数nodeData=== rowData.url
   template: function(nodeData, rowData){
   return '<a href="'+nodeData+'">'+rowData.url+'</a>';
   }
   }]
  */
		columnData: [],

		// 表格grid-manager所对应的值[可在html中配置]
		gridManagerName: '',

		// 获取表格数据地址，配置该参数后，将会动态获取数据
		ajax_url: '',

		// ajax请求类型['GET', 'POST']默认GET
		ajax_type: 'GET',

		// ajax请求头信息
		ajax_headers: {},

		// @v2.4.0
		// 设置XHR对象, ajax_xhrFields 中的属性将追加至实例化后的XHR对象上
		// 示例 -> ajax_xhrFields: {withCredentials: true}, 那么将会配置跨域访问时协带cookies, authorization headers(头部授权)
		ajax_xhrFields: {},

		// ajax请求之前,与jTool的beforeSend使用方法相同
		ajax_beforeSend: _Base.$.noop,

		// ajax成功后,与jTool的success使用方法相同
		ajax_success: _Base.$.noop,

		// ajax完成后,与jTool的complete使用方法相同
		ajax_complete: _Base.$.noop,

		// ajax失败后,与jTool的error使用方法相同
		ajax_error: _Base.$.noop,

		// ajax静态数据,配置后ajax_url将无效
		ajax_data: undefined,

		// 请求前处理程序, 可以通过该方法修改全部的请求参数 @v2.3.14
		requestHandler: _Base.$.noop,

		// 执行请求后执行程序, 通过该程序可以修改返回值格式. 仅有成功后该函数才会执行 @v2.3.14
		responseHandler: _Base.$.noop,

		// ajax请求返回的列表数据key键值,默认为data
		dataKey: 'data',

		// ajax请求返回的数据总条数key键值,默认为totals
		totalsKey: 'totals'
	};

	/**
  * 表格导出
  */
	var gridExport = {
		// 支持导出表格数据
		supportExport: true
	};

	var settings = _extends({}, drag, adjust, remind, config, gridStyle, cache, sort, ajaxPage, autoOrder, checkbox, i18n, gridData, gridExport);
	_Base.$.extend(true, this, settings);
};

// 表格中使用到的国际化文本信息


var TextSettings = function TextSettings() {
	_classCallCheck(this, TextSettings);

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
	this['config-grid'] = {
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
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _Base = __webpack_require__(0);

var _GridManager = __webpack_require__(7);

var _GridManager2 = _interopRequireDefault(_GridManager);

var _Publish = __webpack_require__(15);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
*  捆绑至选择器对象
* */
(function (jTool) {
	Element.prototype.GM = Element.prototype.GridManager = function () {
		// 特殊情况处理：单组tr进行操作，如resetTd()方法
		if (this.nodeName === 'TR') {
			return;
		}
		// 方法名
		var name = null;

		// 参数
		var settings = null;

		// 回调函数
		var callback = null;

		// 条件
		var condition = null;

		// 格式化参数
		// ex: document.querySelector('table').GridManager()
		if (arguments.length === 0) {
			name = 'init';
			settings = {};
			callback = undefined;
		} else if (jTool.type(arguments[0]) !== 'string') {
			// ex: document.querySelector('table').GridManager({settings}, callback)
			name = 'init';
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

		if (_Publish.publishMethodArray.indexOf(name) === -1) {
			throw new Error('GridManager Error:\u65B9\u6CD5\u8C03\u7528\u9519\u8BEF\uFF0C\u8BF7\u786E\u5B9A\u65B9\u6CD5\u540D[' + name + ']\u662F\u5426\u6B63\u786E');
		}

		// let gmObj;
		// 当前为初始化方法
		if (name === 'init') {
			var _GM = new _GridManager2.default();
			_GM.init(this, settings, callback);
			return _GM;
			// 当前为其它方法
		} else if (name !== 'init') {
			// gmObj = $table.data('gridManager');
			// console.log(gmObj);
			var gmData = _Publish.PublishMethod[name](this, settings, callback, condition);

			// 如果方法存在返回值则返回，如果没有返回dom, 用于链式操作
			return typeof gmData === 'undefined' ? this : gmData;
		}
	};
})(_Base.jTool);

/**
 * 将GridManager 对象映射至window
 */
/*
 *  GridManager: 入口
 * */
(function () {
	window.GridManager = window.GM = _GridManager2.default;
})();

/*
* 兼容jquery
* */
(function (jQuery) {
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
})(window.jQuery);

// 恢复jTool占用的$变量
(function (jQuery) {
	window.$ = jQuery || undefined;
})(window.jQuery);

/***/ }),
/* 21 */
/***/ (function(module, exports) {

// removed by extract-text-webpack-plugin

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

var require;var require;!function t(e,n,o){function i(s,a){if(!n[s]){if(!e[s]){var u="function"==typeof require&&require;if(!a&&u)return require(s,!0);if(r)return r(s,!0);var c=new Error("Cannot find module '"+s+"'");throw c.code="MODULE_NOT_FOUND",c}var l=n[s]={exports:{}};e[s][0].call(l.exports,function(t){var n=e[s][1][t];return i(n||t)},l,l.exports,t,e,n,o)}return n[s].exports}for(var r="function"==typeof require&&require,s=0;s<o.length;s++)i(o[s]);return i}({1:[function(t,e,n){var o=t("./utilities"),i=t("../src/Css"),r={show:function(){return o.each(this.DOMList,function(t,e){var n="",o=["SPAN","A","FONT","I"];if(-1!==e.nodeName.indexOf(o))return e.style.display="inline-block",this;switch(e.nodeName){case"TABLE":n="table";break;case"THEAD":n="table-header-group";break;case"TBODY":n="table-row-group";break;case"TR":n="table-row";break;case"TH":case"TD":n="table-cell";break;default:n="block"}e.style.display=n}),this},hide:function(){return o.each(this.DOMList,function(t,e){e.style.display="none"}),this},animate:function(t,e,n){var r=this,s="",a="",u=r.DOMList[0];if(t){"undefined"===o.type(n)&&"function"===o.type(e)&&(n=e,e=0),"undefined"===o.type(n)&&(n=o.noop),"undefined"===o.type(e)&&(e=0),o.each(t,function(t,e){t=o.toHyphen(t),s+=t+":"+o.getStyle(u,t)+";",a+=t+":"+e+";"});var c="@keyframes jToolAnimate {from {"+s+"}to {"+a+"}}",l=document.createElement("style");l.className="jTool-animate-style",l.type="text/css",document.head.appendChild(l),l.textContent=l.textContent+c,u.style.animation="jToolAnimate "+e/1e3+"s ease-in-out forwards",window.setTimeout(function(){i.css.call(r,t),u.style.animation="",l.remove(),n()},e)}}};e.exports=r},{"../src/Css":3,"./utilities":13}],2:[function(t,e,n){var o=t("./utilities"),i={addClass:function(t){return this.changeClass(t,"add")},removeClass:function(t){return this.changeClass(t,"remove")},toggleClass:function(t){return this.changeClass(t,"toggle")},hasClass:function(t){return[].some.call(this.DOMList,function(e){return e.classList.contains(t)})},parseClassName:function(t){return t.indexOf(" ")?t.split(" "):[t]},changeClass:function(t,e){var n=this.parseClassName(t);return o.each(this.DOMList,function(t,i){o.each(n,function(t,n){i.classList[e](n)})}),this}};e.exports=i},{"./utilities":13}],3:[function(t,e,n){var o=t("./utilities"),i={css:function(t,e){function n(t,e){"number"===o.type(e)&&(e=e.toString()),-1!==r.indexOf(t)&&-1===e.indexOf("px")&&(e+="px"),o.each(i.DOMList,function(n,o){o.style[t]=e})}var i=this,r=["width","height","min-width","max-width","min-height","min-height","top","left","right","bottom","padding-top","padding-right","padding-bottom","padding-left","margin-top","margin-right","margin-bottom","margin-left","border-width","border-top-width","border-left-width","border-right-width","border-bottom-width"];if("string"===o.type(t)&&!e&&0!==e)return-1!==r.indexOf(t)?parseInt(o.getStyle(this.DOMList[0],t),10):o.getStyle(this.DOMList[0],t);if("object"===o.type(t)){var s=t;for(var a in s)n(a,s[a])}else n(t,e);return this},width:function(t){return this.css("width",t)},height:function(t){return this.css("height",t)}};e.exports=i},{"./utilities":13}],4:[function(t,e,n){var o=t("./utilities"),i={dataKey:"jTool"+o.version,data:function(t,e){var n=this,i={};if(void 0===t&&void 0===e)return n.DOMList[0][n.dataKey];if(void 0!==e){var r=o.type(e);return"string"!==r&&"number"!==r||n.attr(t,e),o.each(n.DOMList,function(o,r){i=r[n.dataKey]||{},i[t]=e,r[n.dataKey]=i}),this}return i=n.DOMList[0][n.dataKey]||{},this.transformValue(i[t]||n.attr(t))},removeData:function(t){var e,n=this;void 0!==t&&(o.each(n.DOMList,function(o,i){e=i[n.dataKey]||{},delete e[t]}),n.removeAttr(t))},attr:function(t,e){return void 0===t&&void 0===e?"":void 0!==e?(o.each(this.DOMList,function(n,o){o.setAttribute(t,e)}),this):this.transformValue(this.DOMList[0].getAttribute(t))},removeAttr:function(t){void 0!==t&&o.each(this.DOMList,function(e,n){n.removeAttribute(t)})},prop:function(t,e){return void 0===t&&void 0===e?"":void 0!==e?(o.each(this.DOMList,function(n,o){o[t]=e}),this):this.transformValue(this.DOMList[0][t])},removeProp:function(t){void 0!==t&&o.each(this.DOMList,function(e,n){delete n[t]})},val:function(t){return this.prop("value",t)||""},transformValue:function(t){return"null"===o.type(t)&&(t=void 0),t}};e.exports=i},{"./utilities":13}],5:[function(t,e,n){var o=t("./utilities"),i=t("./Sizzle"),r={append:function(t){return this.html(t,"append")},prepend:function(t){return this.html(t,"prepend")},before:function(t){t.jTool&&(t=t.DOMList[0]);var e=this.DOMList[0];return e.parentNode.insertBefore(t,e),this},after:function(t){t.jTool&&(t=t.DOMList[0]);var e=this.DOMList[0],n=e.parentNode;n.lastChild==e?n.appendChild(t):n.insertBefore(t,e.nextSibling)},text:function(t){return void 0!==t?(o.each(this.DOMList,function(e,n){n.textContent=t}),this):this.DOMList[0].textContent},html:function(t,e){if(void 0===t&&void 0===e)return this.DOMList[0].innerHTML;var n=this,i=o.type(t);t.jTool?t=t.DOMList:"string"===i?t=o.createDOM(t||""):"element"===i&&(t=[t]);var r;return o.each(n.DOMList,function(n,i){e?"prepend"===e&&(r=i.firstChild):i.innerHTML="",o.each(t,function(t,e){e=e.cloneNode(!0),e.nodeType||(e=document.createTextNode(e)),r?i.insertBefore(e,r):i.appendChild(e),i.normalize()})}),this},wrap:function(t){var e;return o.each(this.DOMList,function(n,o){e=o.parentNode;var r=new i(t,o.ownerDocument).get(0);e.insertBefore(r,o),r.querySelector(":empty").appendChild(o)}),this},closest:function(t){function e(){if(!n||0===o.length||1!==n.nodeType)return void(n=null);-1===[].indexOf.call(o,n)&&(n=n.parentNode,e())}var n=this.DOMList[0].parentNode;if(void 0===t)return new i(n);var o=document.querySelectorAll(t);return e(),new i(n)},parent:function(){return this.closest()},clone:function(t){return new i(this.DOMList[0].cloneNode(t||!1))},remove:function(){o.each(this.DOMList,function(t,e){e.remove()})}};e.exports=r},{"./Sizzle":9,"./utilities":13}],6:[function(t,e,n){var o=t("./Sizzle"),i={get:function(t){return this.DOMList[t]},eq:function(t){return new o(this.DOMList[t])},find:function(t){return new o(t,this)},index:function(t){var e=this.DOMList[0];return t?t.jTool&&(t=t.DOMList):t=e.parentNode.childNodes,t?[].indexOf.call(t,e):-1}};e.exports=i},{"./Sizzle":9}],7:[function(t,e,n){var o=t("./utilities"),i={on:function(t,e,n,o){return this.addEvent(this.getEventObject(t,e,n,o))},off:function(t,e){return this.removeEvent(this.getEventObject(t,e))},bind:function(t,e,n){return this.on(t,void 0,e,n)},unbind:function(t){return this.removeEvent(this.getEventObject(t))},trigger:function(t){return o.each(this.DOMList,function(e,n){try{if(n.jToolEvent&&n.jToolEvent[t].length>0){var i=new Event(t);n.dispatchEvent(i)}else"click"!==t?o.error("预绑定的事件只有click事件可以通过trigger进行调用"):"click"===t&&n[t]()}catch(e){o.error("事件:["+t+"]未能正确执行, 请确定方法已经绑定成功")}}),this},getEventObject:function(t,e,n,i){if("function"==typeof e&&(i=n||!1,n=e,e=void 0),!t)return o.error("事件绑定失败,原因: 参数中缺失事件类型"),this;if(e&&"element"===o.type(this.DOMList[0])||(e=""),""!==e){var r=n;n=function(t){for(var n=t.target;n!==this;){if(-1!==[].indexOf.call(this.querySelectorAll(e),n)){r.apply(n,arguments);break}n=n.parentNode}}}var s,a,u=t.split(" "),c=[];return o.each(u,function(t,r){if(""===r.trim())return!0;s=r.split("."),a={eventName:r+e,type:s[0],querySelector:e,callback:n||o.noop,useCapture:i||!1,nameScope:s[1]||void 0},c.push(a)}),c},addEvent:function(t){var e=this;return o.each(t,function(t,n){o.each(e.DOMList,function(t,e){e.jToolEvent=e.jToolEvent||{},e.jToolEvent[n.eventName]=e.jToolEvent[n.eventName]||[],e.jToolEvent[n.eventName].push(n),e.addEventListener(n.type,n.callback,n.useCapture)})}),e},removeEvent:function(t){var e,n=this;return o.each(t,function(t,i){o.each(n.DOMList,function(t,n){n.jToolEvent&&(e=n.jToolEvent[i.eventName])&&(o.each(e,function(t,e){n.removeEventListener(e.type,e.callback)}),n.jToolEvent[i.eventName]=void 0)})}),n}};e.exports=i},{"./utilities":13}],8:[function(t,e,n){var o=t("./utilities"),i={offset:function(){var t={top:0,left:0},e=this.DOMList[0];if(!e.getClientRects().length)return t;if("none"===o.getStyle(e,"display"))return t;t=e.getBoundingClientRect();var n=e.ownerDocument.documentElement;return{top:t.top+window.pageYOffset-n.clientTop,left:t.left+window.pageXOffset-n.clientLeft}},scrollTop:function(t){return this.scrollFN(t,"top")},scrollLeft:function(t){return this.scrollFN(t,"left")},scrollFN:function(t,e){var n=this.DOMList[0];return t||0===t?(this.setScrollFN(n,e,t),this):this.getScrollFN(n,e)},getScrollFN:function(t,e){return o.isWindow(t)?"top"===e?t.pageYOffset:t.pageXOffset:9===t.nodeType?"top"===e?t.body.scrollTop:t.body.scrollLeft:1===t.nodeType?"top"===e?t.scrollTop:t.scrollLeft:void 0},setScrollFN:function(t,e,n){return o.isWindow(t)?"top"===e?t.document.body.scrollTop=n:t.document.body.scrollLeft=n:9===t.nodeType?"top"===e?t.body.scrollTop=n:t.body.scrollLeft=n:1===t.nodeType?"top"===e?t.scrollTop=n:t.scrollLeft=n:void 0}};e.exports=i},{"./utilities":13}],9:[function(t,e,n){var o=t("./utilities"),i=function(t,e){var n;return t?o.isWindow(t)?(n=[t],e=void 0):t===document?(n=[document],e=void 0):t instanceof HTMLElement?(n=[t],e=void 0):t instanceof NodeList||t instanceof Array?(n=t,e=void 0):t.jTool?(n=t.DOMList,e=void 0):/<.+>/.test(t)?(n=o.createDOM(t),e=void 0):(e?e="string"==typeof e?document.querySelectorAll(e):e instanceof HTMLElement?[e]:e instanceof NodeList?e:e.jTool?e.DOMList:void 0:n=document.querySelectorAll(t),e&&(n=[],o.each(e,function(e,i){o.each(i.querySelectorAll(t),function(t,e){e&&n.push(e)})}))):t=null,n&&0!==n.length||(n=void 0),this.jTool=!0,this.DOMList=n,this.length=this.DOMList?this.DOMList.length:0,this.querySelector=t,this};e.exports=i},{"./utilities":13}],10:[function(t,e,n){function o(t){var e={url:null,type:"GET",data:null,headers:{},async:!0,xhrFields:{},beforeSend:a.noop,complete:a.noop,success:a.noop,error:a.noop};if(t=s(e,t),!t.url)return void a.error("jTool ajax: url不能为空");var n=new XMLHttpRequest,o="";"object"===a.type(t.data)?a.each(t.data,function(t,e){""!==o&&(o+="&"),o+=t+"="+e}):o=t.data,"GET"===t.type.toUpperCase()&&o&&(t.url=t.url+(-1===t.url.indexOf("?")?"?":"&")+o,o=null),n.open(t.type,t.url,t.async);for(var i in t.xhrFields)n[i]=t.xhrFields[i];for(var r in t.headers)n.setRequestHeader(r,t.headers[r]);t.beforeSend(n),n.onload=function(){t.complete(n,n.status)},n.onreadystatechange=function(){4===n.readyState&&(n.status>=200&&n.status<300||304===n.status?t.success(n.response,n.status):t.error(n,n.status,n.statusText))},n.send(o)}function i(t,e,n){o({url:t,type:"POST",data:e,success:n})}function r(t,e,n){o({url:t,type:"GET",data:e,success:n})}var s=t("./extend"),a=t("./utilities");e.exports={ajax:o,post:i,get:r}},{"./extend":11,"./utilities":13}],11:[function(t,e,n){function o(){function t(e,o){for(var r in e)e.hasOwnProperty(r)&&(n&&"object"===i.type(e[r])?("object"!==i.type(o[r])&&(o[r]={}),t(e[r],o[r])):o[r]=e[r])}if(0===arguments.length)return{};var e,n=!1,o=1,r=arguments[0];for(1===arguments.length&&"object"==typeof arguments[0]?(r=this,o=0):2===arguments.length&&"boolean"==typeof arguments[0]?(n=arguments[0],r=this,o=1):arguments.length>2&&"boolean"==typeof arguments[0]&&(n=arguments[0],r=arguments[1]||{},o=2);o<arguments.length;o++)e=arguments[o]||{},t(e,r);return r}var i=t("./utilities");e.exports=o},{"./utilities":13}],12:[function(t,e,n){var o=t("./Sizzle"),i=t("./extend"),r=t("./utilities"),s=t("./ajax"),a=t("./Event"),u=t("./Css"),c=t("./Class"),l=t("./Document"),d=t("./Offset"),f=t("./Element"),h=t("./Animate"),p=t("./Data"),v=function(t,e){return new o(t,e)};o.prototype=v.prototype={},v.extend=v.prototype.extend=i,v.extend(r),v.extend(s),v.prototype.extend(a),v.prototype.extend(u),v.prototype.extend(c),v.prototype.extend(l),v.prototype.extend(d),v.prototype.extend(f),v.prototype.extend(h),v.prototype.extend(p),void 0!==window.$&&(window._$=$),window.jTool=window.$=v,e.exports=v},{"./Animate":1,"./Class":2,"./Css":3,"./Data":4,"./Document":5,"./Element":6,"./Event":7,"./Offset":8,"./Sizzle":9,"./ajax":10,"./extend":11,"./utilities":13}],13:[function(t,e,n){function o(){return-1!=navigator.userAgent.indexOf("Chrome")}function i(t){return null!==t&&t===t.window}function r(t){return Array.isArray(t)}function s(t){return g[y.call(t)]||(t instanceof Element?"element":"")}function a(){}function u(t,e){t&&t.jTool&&(t=t.DOMList);var n=s(t);if("array"===n||"nodeList"===n||"arguments"===n)[].every.call(t,function(t,n){i(t)?a():t.jTool?t=t.get(0):a();return!1!==e.call(t,n,t)});else if("object"===n)for(var o in t)if(!1===e.call(t[o],o,t[o]))break}function c(t){return t.trim()}function l(t){throw new Error("[jTool Error: "+t+"]")}function d(t){var e=!0;for(var n in t)t.hasOwnProperty(n)&&(e=!1);return e}function f(t,e){return e?window.getComputedStyle(t)[e]:window.getComputedStyle(t)}function h(t){var e=["px","vem","em","%"],n="";return"number"==typeof t?n:(u(e,function(e,o){if(-1!==t.indexOf(o))return n=o,!1}),n)}function p(t){return t.replace(/-\w/g,function(t){return t.split("-")[1].toUpperCase()})}function v(t){return t.replace(/([A-Z])/g,"-$1").toLowerCase()}function m(t){var e=document.querySelector("#jTool-create-dom");if(!e||0===e.length){var n=document.createElement("table");n.id="jTool-create-dom",n.style.display="none",document.body.appendChild(n),e=document.querySelector("#jTool-create-dom")}e.innerHTML=t||"";var o=e.childNodes;return 1!=o.length||/<tbody|<TBODY/.test(t)||"TBODY"!==o[0].nodeName||(o=o[0].childNodes),1!=o.length||/<thead|<THEAD/.test(t)||"THEAD"!==o[0].nodeName||(o=o[0].childNodes),1!=o.length||/<tr|<TR/.test(t)||"TR"!==o[0].nodeName||(o=o[0].childNodes),1!=o.length||/<td|<TD/.test(t)||"TD"!==o[0].nodeName||(o=o[0].childNodes),1!=o.length||/<th|<TH/.test(t)||"TH"!==o[0].nodeName||(o=o[0].childNodes),e.remove(),o}var y=Object.prototype.toString,g={"[object String]":"string","[object Boolean]":"boolean","[object Undefined]":"undefined","[object Number]":"number","[object Object]":"object","[object Error]":"error","[object Function]":"function","[object Date]":"date","[object Array]":"array","[object RegExp]":"regexp","[object Null]":"null","[object NodeList]":"nodeList","[object Arguments]":"arguments","[object Window]":"window","[object HTMLDocument]":"document"};e.exports={isWindow:i,isChrome:o,isArray:r,noop:a,type:s,toHyphen:v,toHump:p,getStyleUnit:h,getStyle:f,isEmptyObject:d,trim:c,error:l,each:u,createDOM:m,version:"1.2.21"}},{}]},{},[12]);


/***/ })
/******/ ]);
//# sourceMappingURL=GridManager.js.map