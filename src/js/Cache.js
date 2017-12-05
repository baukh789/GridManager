/*
* @Cache: 本地缓存
* 缓存分为三部分:
* 1.GridData: 渲染表格时所使用的json数据 [存储在GM实例]
* 2.Cache: 核心缓存数据 [存储在DOM上]
* 3.UserMemory: 用户记忆 [存储在localStorage]
* */
import { jTool, Base } from './Base';
import { Settings, TextSettings } from './Settings';
import Checkbox from './Checkbox';
import Order from './Order';
import store from './Store';
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
		/**
		 * 获取当前行渲染时使用的数据
		 * @param $table 当前操作的grid,由插件自动传入
		 * @param target 将要获取数据所对应的tr[Element or NodeList]
		 * @returns {*}
         * @private
         */
		this.__getRowData = ($table, target) => {
			const gmName = Base.getKey($table);
			if (!store.responseData[gmName]) {
				return;
			}
			// target type = Element 元素时, 返回单条数据对象;
			if (jTool.type(target) === 'element') {
				return store.responseData[gmName][target.getAttribute('cache-key')];
			} else if (jTool.type(target) === 'nodeList') {
				// target type =  NodeList 类型时, 返回数组
				let rodData = [];
				jTool.each(target, function (i, v) {
					rodData.push(store.responseData[gmName][v.getAttribute('cache-key')]);
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
		this.setRowData = (gmName, key, value) => {
			if (!store.responseData[gmName]) {
				store.responseData[gmName] = {};
			}
			store.responseData[gmName][key] = value;
		};

		/**
		 * 获取完整的渲染时使用的数据
		 * @param $table
         */
		this.getTableData = $table => {
			return store.responseData[Base.getKey($table)] || {};
		};
	}

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
			const thList = jTool('thead[grid-manager-thead] th', $table);
			if (!thList || thList.length === 0) {
				Base.outLog('saveUserMemory:无效的thList,请检查是否正确配置table,thead,th', 'error');
				return false;
			}

			let _cache = {};
			let _pageCache = {};
			_cache.column = Settings.columnMap;

			// 存储分页
			if (Settings.supportAjaxPage) {
				_pageCache.pSize = parseInt(jTool('select[name="pSizeArea"]', $table.closest('.table-wrap')).val(), 10);
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
		 * 初始化设置相关: 合并, 存储
		 * @param $table
		 * @param arg
		 */
		this.initSettings = ($table, arg) => {
			// 合并参数
			const _settings = new Settings();
			_settings.textConfig = new TextSettings();

			// 将默认项与配置项
			jTool.extend(true, _settings, arg);

			// 存储配置项
			this.setSettings($table, _settings);

			// 校验 columnData
			if (!_settings.columnData || _settings.columnData.length === 0) {
				Base.outLog('请对参数columnData进行有效的配置', 'error');
				return;
			}

			// 为 columnMap columnData 增加 序号列
			if (_settings.supportAutoOrder) {
				_settings.columnData.unshift(Order.getColumn($table, _settings.i18n));
			}

			// 为 columnMap columnData 增加 选择列
			if (_settings.supportCheckbox) {
				_settings.columnData.unshift(Checkbox.getColumn($table, _settings.i18n));
			}

			// 为 columnData 提供锚 => columnMap
			// columnData 在此之后, 将不再被使用到
			// columnData 与 columnMap 已经过特殊处理, 不会彼此影响
			_settings.columnMap = {};
			_settings.columnData.forEach((col, index) => {
				_settings.columnMap[col.key] = col;

				// 如果未设定, 设置默认值为true
				_settings.columnMap[col.key].isShow = col.isShow || typeof (col.isShow) === 'undefined';

				// 为列Map 增加索引
				_settings.columnMap[col.key].index = index;
			});

			// 获取本地缓存并对列表进行配置
			if (!_settings.disableCache) {
				const userMemory = this.getUserMemory($table);

				userMemory.cache && jTool.extend(true, _settings.columnMap, userMemory.cache.column || {});
			}

			// 更新存储配置项
			this.setSettings($table, _settings);
			return _settings;
		};

		/**
		 * 获取配置项
		 * @param $table
		 * @returns {*}
		 */
		this.getSettings = $table => {
			if (!$table || $table.length === 0) {
				return {};
			}
			// 返回的是 clone 对象 而非对象本身
			return jTool.extend(true, {}, store.settings[Base.getKey($table)] || {});
		};

		/**
		 * 更新配置项
		 * @param $table
		 * @param settings
		 */
		this.setSettings = ($table, settings) => {
			store.settings[Base.getKey($table)] = jTool.extend(true, {}, settings);
		};

		/**
		 * 验证版本号清除列表缓存
		 * @param $table
		 * @param version 版本号
		 */
		this.cleanTableCacheForVersion = () => {
			const cacheVersion = window.localStorage.getItem('GridManagerVersion');
			// 当前为第一次渲染
			if (!cacheVersion) {
				window.localStorage.setItem('GridManagerVersion', store.version);
			}
			// 版本变更, 清除所有的用户记忆
			if (cacheVersion && cacheVersion !== store.version) {
				this.cleanTableCache(null, '版本已升级,原全部缓存被自动清除');
				window.localStorage.setItem('GridManagerVersion', store.version);
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
		 * 存储原Th DOM至table data
		 * @param $table
		 */
		this.setOriginalThDOM = $table => {
			const _thList = [];
			const _thDOM = jTool('thead[grid-manager-thead] th', $table);

			jTool.each(_thDOM, (i, v) => {
				_thList.push(v.getAttribute('th-name'));
			});
			store.originalTh[Base.getKey($table)] = _thList;
			$table.data('originalThList', _thList);
		};

		/**
		 * 获取原Th DOM至table data
		 * @param $table
		 * @returns {*|HTMLElement|jTool}
		 */
		this.getOriginalThDOM = $table => {
			const _thArray = [];
			const _thList = store.originalTh[Base.getKey($table)];
			jTool.each(_thList, (i, v) => {
				_thArray.push(jTool(`thead[grid-manager-thead] th[th-name="${v}"]`, $table).get(0));
			});
			return jTool(_thArray);
		};
	}
}
export default new Cache();
