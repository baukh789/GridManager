/*
* @Cache: 本地缓存
* */
import $ from './jTool';
import Base from './Base';
const Cache = {
	/*
	* @存储渲染表格使用的数据
	* 通过每个tr上的cache-key进行获取
	* */
	responseData: {}
	/*
	 * [对外公开方法]
	 * @获取当前行渲染时使用的数据
	 * $table: 当前操作的grid,由插件自动传入
	 * tr: 将要获取数据所对应的tr[Element or NodeList]
	 * */
	,getRowData: function($table, tr) {
		// tr 为 Element 元素时, 返回数据对象; 为 NodeList 类型时, 返回数组
		const gmName = $table.attr('grid-manager');
		if(!gmName){
			return;
		}
		if(!this.responseData[gmName]){
			return;
		}
		// Element 无length属性, NodeList 会有length属性.
		// 所以这里通过 .length进行区别. 如果为NodeList 且 length == 0 时,采用与 Element同样的返回类型
		if(!tr.length){
			return this.responseData[gmName][tr.getAttribute('cache-key')];
		}
		const _this = this;
		let rodData = [];
		$.each(tr, function(i, v){
			rodData.push(_this.responseData[gmName][v.getAttribute('cache-key')])
		});
		return rodData;
	}
	/*
	 * 存储行数据
	 * */
	,setRowData: function(gmName, key, value) {
		if(!this.responseData[gmName]){
			this.responseData[gmName] = {};
		}
		this.responseData[gmName][key] = value;
	}
	/*
	 * [对外公开方法]
	 * @清除指定表的缓存数据
	 * $table: table [jTool Object]
	 * return 成功或者失败的布尔值
	 * */
	,clear: function($table) {
		if(!$table || $table.length === 0) {
			return false;
		}
		const _key = this.getLocalStorageKey($table);
		if (!_key) {
			return false;
		}
		window.localStorage.removeItem(_key);
		return true;
	}
	/*
	 [对外公开方法]
	 @获取 GridManager 实例
	 $table:table [jTool object]
	 */
	,get: function($table) {
		return this.__getGridManager($table);
	}
	/*
	 [对外公开方法]
	 * 获取配置项
	 * $table:table [jTool object]
	 * */
	,getSettings: function($table) {
		// 这里返回的是clone 对象而非对象本身
		return $.extend(true, {}, $table.data('settings'));
	}
	,cloneSettings: function(){

	}
	/*
	* 更新配置项
	* $table:table [jTool object]
	* */
	,updateSettings:  function($table, settings) {
		const data = $.extend(true, {}, settings);
		$table.data('settings', data);
	}
	/*
	*  @验证版本号清除列表缓存
	*  $.table: jTool table
	*  $.version: 版本号
	* */
	,cleanTableCacheForVersion: function(table, version) {
		const cacheVersion = window.localStorage.getItem('GridManagerVersion');
		// 当前为第一次渲染
		if(!cacheVersion) {
			window.localStorage.setItem('GridManagerVersion', version);
		}
		// 版本变更
		if(cacheVersion && cacheVersion !== version) {
			this.cleanTableCache(table, '版本已升级,原缓存被自动清除');
			window.localStorage.setItem('GridManagerVersion', version);
		}
	}
	/*
	* @清除列表缓存
	* $.table: table [jTool object]
	* $.cleanText: 清除缓存的原因
	* */
	,cleanTableCache: function(table, cleanText) {
		const Settings = Cache.getSettings(table);
		this.clear(table);
		Base.outLog(Settings.gridManagerName + '清除缓存成功,清除原因：'+ cleanText, 'info');
	}
	/*
	 * 获取指定表格本地存储所使用的key
	 * table: table jTool
	 * */
	,getLocalStorageKey: function(table) {
		const Settings = Cache.getSettings(table);
		// 验证table是否有效
		if(!table || table.length === 0) {
			Base.outLog('getLocalStorage:无效的table', 'error');
			return false;
		}
		//当前表是否禁用缓存  被禁用原因是用户缺失了必要的参数
		const noCache = table.attr('no-cache');
		if(noCache && noCache== 'true') {
			Base.outLog('缓存已被禁用：当前表缺失必要html标签属性[grid-manager或th-name]', 'info');
			return false;
		}
		if(!window.localStorage){
			Base.outLog('当前浏览器不支持：localStorage，缓存功能失效', 'info');
			return false;
		}
		return window.location.pathname +  window.location.hash + '-'+ Settings.gridManagerName;
	}
	/*
	* @根据本地缓存thead配置列表: 获取本地缓存, 存储原位置顺序, 根据本地缓存进行配置
	* $.table: table [jTool object]
	* */
	,configTheadForCache: function(table) {
		let Settings = Cache.getSettings(table);
		const _this = this;
		const _data = _this.getLocalStorage(table),		//本地缓存的数据
			_domArray = [];

		//验证：当前table 没有缓存数据
		if(!_data || $.isEmptyObject(_data)) {
			Base.outLog('configTheadForCache:当前table没有缓存数据', 'info');
			return;
		}
		// 列表的缓存数据
		let _cache = _data.cache;
		// th相关 缓存
		let _thCache=_cache.th;
		//验证：缓存数据与当前列表项是否匹配
		let _thNameTmpList = [];
		let	_dataAvailable = true;
		// 单一的th
		let	_th;
		// th的缓存json
		let	_thJson;
		//验证：缓存数据与当前列表是否匹配
		if(!_thCache || _thCache.length != $('thead th', table).length){
			_this.cleanTableCache(table, '缓存数据与当前列表不匹配');
			return;
		}
		$.each(_thCache, (i2, v2) => {
			_thJson = v2;
			_th = $('th[th-name='+ _thJson.th_name +']', table);
			if(_th.length == 0 || _thNameTmpList.indexOf(_thJson.th_name) != -1){
				_this.cleanTableCache(table, '缓存数据与当前列表不匹配');
				_dataAvailable = false;
				return false;
			}
			_thNameTmpList.push(_thJson.th_name);
		});
		//数据可用，进行列的配置
		if(_dataAvailable){
			$.each(_thCache, (i2, v2) => {
				_thJson = v2;
				_th = $('th[th-name='+ _thJson.th_name +']', table);
				//配置列的宽度
				if(Settings.supportAdjust && _th.attr('gm-create') !== 'true'){
					_th.css('width',_thJson.th_width);
				}
				//配置列排序数据
				if(Settings.supportDrag && typeof(_thJson.th_index) !== 'undefined'){
					_domArray[_thJson.th_index] = _th;
				}else{
					_domArray[i2] = _th;
				}
				//配置列的可见
				if(Settings.supportConfig){
					Base.setAreVisible(_th, typeof(_thJson.isShow) == 'undefined' ? true : _thJson.isShow, true);
				}
			});
			//配置列的顺序
			if(Settings.supportDrag){
				table.find('thead tr').html(_domArray);
			}
		}
	}
	/*
	 [对外公开方法]
	 @获取指定表格的本地存储数据
	 $.table:table
	 成功则返回本地存储数据,失败则返回空对象
	 */
	,getLocalStorage: function($table) {
		const _key = this.getLocalStorageKey($table);
		if(!_key) {
			return {};
		}
		const _localStorage = window.localStorage.getItem(_key);
		//如无数据，增加属性标识：grid-manager-cache-error
		if(!_localStorage){
			$table.attr('grid-manager-cache-error','error');
			return {};
		}
		const _data = {
			key: _key,
			cache: JSON.parse(_localStorage)
		};
		return _data;
	}
	/*
	 @保存至本地缓存
	 $table:table [jTool object]
	 isInit: 是否为初始存储缓存[用于处理宽度在特定情况下发生异常]
	 */
	// TODO @baukh20170414: 参数isInit 已经废弃, 之后可以删除
	,setToLocalStorage: function(table, isInit){
		const Settings = Cache.getSettings(table);
		const _this = this;
		//当前为禁用缓存模式，直接跳出
		if (Settings.disableCache) {
			return false;
		}
		const _table = $(table);
		//当前表是否禁用缓存  被禁用原因是用户缺失了必要的参数
		const noCache = _table.attr('no-cache');
		if(!_table || _table.length == 0){
			Base.outLog('setToLocalStorage:无效的table', 'error');
			return false;
		}
		if(noCache && noCache== 'true'){
			Base.outLog('缓存功能已被禁用：当前表缺失必要参数', 'info');
			return false;
		}
		if(!window.localStorage) {
			Base.outLog('当前浏览器不支持：localStorage，缓存功能失效。', 'error');
			return false;
		}
		const thList = $('thead[grid-manager-thead] th', _table);
		if(!thList || thList.length == 0){
			Base.outLog('setToLocalStorage:无效的thList,请检查是否正确配置table,thead,th', 'error');
			return false;
		}

		let _cache   	= {},
			_pageCache 	= {},
			_thCache	= [],
			_thData 	= {};

		let $v;
		$.each(thList, (i, v) => {
			$v = $(v);
			_thData = {};
			_thData.th_name = $v.attr('th-name');
			if(Settings.supportDrag){
				_thData.th_index = $v.index();
			}
			if(Settings.supportAdjust){
				//用于处理宽度在特定情况下发生异常
				// isInit ? $v.css('width', $v.css('width')) : '';
				_thData.th_width = $v.width();
			}
			if(Settings.supportConfig){
				_thData.isShow = $('.config-area li[th-name="'+ _thData.th_name +'"]', _table.closest('.table-wrap')).find('input[type="checkbox"]').get(0).checked;
			}
			_thCache.push(_thData);
		});
		_cache.th = _thCache;
		//存储分页
		if(Settings.supportAjaxPage){
			_pageCache.pSize = parseInt($('select[name="pSizeArea"]', _table.closest('.table-wrap')).val());
			_cache.page = _pageCache;
		}
		const _cacheString = JSON.stringify(_cache);
		window.localStorage.setItem(_this.getLocalStorageKey(_table), _cacheString);
		return _cacheString;
	}
	/*
	 @存储原Th DOM至table data
	 $.table: table [jTool object]
	 */
	,setOriginalThDOM: function(table) {
		const _thList = [];
		const _thDOM = $('thead[grid-manager-thead] th', table);

		$.each(_thDOM,  (i, v) => {
			_thList.push(v.getAttribute('th-name'));
		});
		table.data('originalThList', _thList);
	}
	/*
	 @获取原Th DOM至table data
	 $.table: table [jTool object]
	 */
	,getOriginalThDOM: function(table) {
		const _thArray = [];
		const _thList = $(table).data('originalThList');

		$.each(_thList, (i, v) => {
			_thArray.push($('thead[grid-manager-thead] th[th-name="'+ v +'"]', table).get(0));
		});
		return $(_thArray);
	}
	/*
	 @存储对外实例
	 $.table:当前被实例化的table
	 */
	,setGridManagerToJTool: function($table) {
		$table.data('gridManager', this);
	}
	/*
	 @获取gridManager
	 $.table:table [jTool object]
	 */
	,__getGridManager: function($table) {
		return $table.data('gridManager');
	}
};
export default Cache;
