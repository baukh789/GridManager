/*
* @Cache: 本地缓存
* 缓存分为三部分:
* 1.GridData: 渲染表格时所使用的json数据 [存储在GM实例]
* 2.Cache: 核心缓存数据 [存储在DOM上]
* 3.UserMemory: 用户记忆 [存储在localStorage]
* */
import { $, Base } from './Base';
class Cache {
	constructor() {
		this.initCoreMethod();
		this.initGridData();
		this.initUserMemory();
	}

	/**
	 * 渲染表格使用的json数据 通过每个tr上的cache-key进行获取
	 */
	initGridData() {
		this.responseData = {};
		/**
		 * 获取当前行渲染时使用的数据
		 * @param $table 当前操作的grid,由插件自动传入
		 * @param target 将要获取数据所对应的tr[Element or NodeList]
		 * @returns {*}
         * @private
         */
		this.__getRowData = function ($table, target) {
			const gmName = $table.attr('grid-manager');
			if (!gmName) {
				return;
			}
			if (!this.responseData[gmName]) {
				return;
			}
			// target type = Element 元素时, 返回单条数据对象;
			if ($.type(target) === 'element') {
				return this.responseData[gmName][target.getAttribute('cache-key')];
			} else if ($.type(target) === 'nodeList') {
				// target type =  NodeList 类型时, 返回数组
				const _this = this;
				let rodData = [];
				$.each(target, function (i, v) {
					rodData.push(_this.responseData[gmName][v.getAttribute('cache-key')]);
				});
				return rodData;
			}
		};

		/**
		 * 存储行数据
		 * @param gmName
		 * @param key
         * @param value
         */
		this.setRowData = function (gmName, key, value) {
			if (!this.responseData[gmName]) {
				this.responseData[gmName] = {};
			}
			this.responseData[gmName][key] = value;
		};
	}

	// TODO 需要处理项: 将所有的记忆信息放至一个字段, 不再使用一个表一个字段.
	/**
	 * 用户记忆
	 */
	initUserMemory() {

		/**
		 * 删除用户记忆
		 * @param $table
		 * @returns {boolean}
         */
		this.delUserMemory = $table => {
			// 如果未指定删除的table, 则全部清除
			if (!$table || $table.length === 0) {
				window.localStorage.removeItem('GridManagerMemory');
				return true;
			}
			let GridManagerMemory = window.localStorage.getItem('GridManagerMemory');
			if (!GridManagerMemory) {
				return false;
			}
			GridManagerMemory = JSON.parse(GridManagerMemory);

			// 指定删除的table, 则定点清除
			const _key = this.getMemoryKey($table);
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
		this.getMemoryKey = $table => {
			const settings = this.getSettings($table);
			// 验证table是否有效
			if (!$table || $table.length === 0) {
				Base.outLog('getUserMemory:无效的table', 'error');
				return false;
			}
			// 当前表是否禁用缓存  被禁用原因是用户缺失了必要的参数
			const noCache = $table.attr('no-cache');
			if (noCache && noCache === 'true') {
				Base.outLog('缓存已被禁用：当前表缺失必要html标签属性[grid-manager或th-name]', 'info');
				return false;
			}
			if (!window.localStorage) {
				Base.outLog('当前浏览器不支持：localStorage，缓存功能失效', 'info');
				return false;
			}
			return window.location.pathname + window.location.hash + '-' + settings.gridManagerName;
		};

		/**
		 * 获取用户记忆
		 * @param $table
		 * @returns {*} 成功则返回本地存储数据,失败则返回空对象
		 */
		this.getUserMemory = $table => {
			if (!$table || $table.length === 0) {
				return {};
			}
			const _key = this.getMemoryKey($table);
			if (!_key) {
				return {};
			}
			let GridManagerMemory = window.localStorage.getItem('GridManagerMemory');
			// 如无数据，增加属性标识：grid-manager-cache-error
			if (!GridManagerMemory || GridManagerMemory === '{}') {
				$table.attr('grid-manager-cache-error', 'error');
				return {};
			}
			GridManagerMemory = JSON.parse(GridManagerMemory);
			const _data = {
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
		this.saveUserMemory = $table => {
			const Settings = this.getSettings($table);
			const _this = this;

			// 当前为禁用缓存模式，直接跳出
			if (Settings.disableCache) {
				return false;
			}
			// 当前表是否禁用缓存  被禁用原因是用户缺失了必要的参数
			const noCache = $table.attr('no-cache');
			if (!$table || $table.length === 0) {
				Base.outLog('saveUserMemory:无效的table', 'error');
				return false;
			}
			if (noCache && noCache === 'true') {
				Base.outLog('缓存功能已被禁用：当前表缺失必要参数', 'info');
				return false;
			}
			if (!window.localStorage) {
				Base.outLog('当前浏览器不支持：localStorage，缓存功能失效。', 'error');
				return false;
			}
			const thList = $('thead[grid-manager-thead] th', $table);
			if (!thList || thList.length === 0) {
				Base.outLog('saveUserMemory:无效的thList,请检查是否正确配置table,thead,th', 'error');
				return false;
			}

			let _cache = {};
			let _pageCache = {};
			let _thCache = [];
			let _thData = {};

			let $v;
			$.each(thList, (i, v) => {
				$v = $(v);
				_thData = {};
				_thData.th_name = $v.attr('th-name');
				if (Settings.supportDrag) {
					_thData.th_index = $v.index();
				}
				if (Settings.supportAdjust) {
					// 用于处理宽度在特定情况下发生异常
					_thData.th_width = $v.width();
				}
				if (Settings.supportConfig) {
					_thData.isShow = $(`.config-area li[th-name="${_thData.th_name}"]`, $table.closest('.table-wrap')).find('input[type="checkbox"]').get(0).checked;
				}
				_thCache.push(_thData);
			});
			_cache.th = _thCache;

			// 存储分页
			if (Settings.supportAjaxPage) {
				_pageCache.pSize = parseInt($('select[name="pSizeArea"]', $table.closest('.table-wrap')).val(), 10);
				_cache.page = _pageCache;
			}
			const _cacheString = JSON.stringify(_cache);
			let GridManagerMemory = window.localStorage.getItem('GridManagerMemory');
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
	initCoreMethod() {
		/**
		 * 获取配置项
		 * @param $table
		 * @returns {*}
		 */
		this.getSettings = $table => {
			if (!$table || $table.length === 0) {
				return {};
			}
			// 这里返回的是clone对象 而非对象本身
			return $.extend(true, {}, $table.data('settings'));
		};

		/**
		 * 更新配置项
		 * @param $table
		 * @param settings
		 */
		this.updateSettings = ($table, settings) => {
			const data = $.extend(true, {}, settings);
			$table.data('settings', data);
		};

		/**
		 * 验证版本号清除列表缓存
		 * @param $table
		 * @param version 版本号
		 */
		this.cleanTableCacheForVersion = ($table, version) => {
			const cacheVersion = window.localStorage.getItem('GridManagerVersion');
			// 当前为第一次渲染
			if (!cacheVersion) {
				window.localStorage.setItem('GridManagerVersion', version);
			}
			// 版本变更, 清除所有的用户记忆
			if (cacheVersion && cacheVersion !== version) {
				this.cleanTableCache(null, '版本已升级,原全部缓存被自动清除');
				window.localStorage.setItem('GridManagerVersion', version);
			}
		};

		/**
		 * 清除列表缓存
		 * @param $table
		 * @param cleanText
		 */
		this.cleanTableCache = ($table, cleanText) => {
			// 不指定table, 清除全部
			if ($table === null) {
				this.delUserMemory();
				Base.outLog(`清除缓存成功,清除原因：${cleanText}`, 'info');
				// 指定table, 定点清除
			} else {
				const Settings = this.getSettings($table);
				this.delUserMemory($table);
				Base.outLog(`${Settings.gridManagerName}清除缓存成功,清除原因：${cleanText}`, 'info');
			}
		};


		/**
		 * 根据本地缓存thead配置列表: 获取本地缓存, 存储原位置顺序, 根据本地缓存进行配置
		 * @param $table
		 */
		this.configTheadForCache = $table => {
			let Settings = this.getSettings($table);
			const _this = this;
			// 本地缓存的数据
			const _data = _this.getUserMemory($table);
			const _domArray = [];

			// 验证：当前$table 没有缓存数据
			if (!_data || $.isEmptyObject(_data) || !_data.cache || $.isEmptyObject(_data.cache)) {
				return;
			}

			// 列表的缓存数据
			let _cache = _data.cache;

			// th相关 缓存
			let _thCache = _cache.th;

			// 验证：缓存数据与当前列表项是否匹配
			let _thNameTmpList = [];
			let _dataAvailable = true;

			// 单一的th
			let _th;

			// th的缓存json
			let _thJson;

			// 验证：缓存数据与当前列表是否匹配
			if (!_thCache || _thCache.length !== $('thead th', $table).length) {
				_this.cleanTableCache($table, '缓存数据与当前列表不匹配');
				return;
			}
			$.each(_thCache, (i2, v2) => {
				_thJson = v2;
				_th = $('th[th-name=' + _thJson.th_name + ']', $table);
				if (_th.length === 0 || _thNameTmpList.indexOf(_thJson.th_name) !== -1) {
					_this.cleanTableCache($table, '缓存数据与当前列表不匹配');
					_dataAvailable = false;
					return false;
				}
				_thNameTmpList.push(_thJson.th_name);
			});

			// 数据可用，进行列的配置
			if (_dataAvailable) {
				$.each(_thCache, (i2, v2) => {
					_thJson = v2;
					_th = $('th[th-name=' + _thJson.th_name + ']', $table);
					// 配置列的宽度
					if (Settings.supportAdjust && _th.attr('gm-create') !== 'true') {
						_th.css('width', _thJson.th_width);
					}
					// 配置列排序数据
					if (Settings.supportDrag && typeof _thJson.th_index !== 'undefined') {
						_domArray[_thJson.th_index] = _th;
					} else {
						_domArray[i2] = _th;
					}
					// 配置列的可见
					if (Settings.supportConfig) {
						Base.setAreVisible(_th, typeof _thJson.isShow === 'undefined' ? true : _thJson.isShow, true);
					}
				});

				// 配置列的顺序
				if (Settings.supportDrag) {
					$table.find('thead tr').html(_domArray);
				}
			}
		};

		/**
		 * 存储原Th DOM至table data
		 * @param $table
		 */
		this.setOriginalThDOM = $table => {
			const _thList = [];
			const _thDOM = $('thead[grid-manager-thead] th', $table);

			$.each(_thDOM, (i, v) => {
				_thList.push(v.getAttribute('th-name'));
			});
			$table.data('originalThList', _thList);
		};

		/**
		 * 获取原Th DOM至table data
		 * @param $table
		 * @returns {*|HTMLElement|jQuery}
		 */
		this.getOriginalThDOM = $table => {
			const _thArray = [];
			const _thList = $table.data('originalThList');

			$.each(_thList, (i, v) => {
				_thArray.push($(`thead[grid-manager-thead] th[th-name="${v}"]`, $table).get(0));
			});
			return $(_thArray);
		};

		/**
		 * 存储对外实例
		 * @param $table
		 */
		this.setGridManagerToJTool = ($table, GM) => {
			// 调用的地方需要使用call 更改 this指向
			$table.data('gridManager', GM);
		};

		/**
		 * 获取gridManager
		 * @param $table
		 * @returns {*}
		 * @private
		 */
		this.__getGridManager = $table => {
			if (!$table || $table.length === 0) {
				return {};
			}
			const settings = this.getSettings($table);
			const gridManager = $table.data('gridManager');

			// 会一并被修改 $table.data('gridManager') 指向的 Object
			$.extend(gridManager, settings);
			return gridManager;
		};
	}
}
export default new Cache();
