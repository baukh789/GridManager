/*
* @Cache: 本地缓存
* */
import $ from './jTool';
import Base from './Base';
import Settings from './Settings';
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
	,getRowData: function(table, tr) {
		return this.cacheData[$(tr).attr('cache-key')];
	}
	/*
	*  @验证版本号清除列表缓存
	*  $.table: jTool table
	*  $.version: 版本号
	* */
	,cleanTableCacheForVersion: function(table, version){
		this.clear(table);
		window.localStorage.setItem('GridManagerVersion', version);
	}
	/*
	* @清除列表缓存
	* $.table: table [jTool object]
	* $.cleanText: 清除缓存的原因
	* */
	,cleanTableCache: function(table, cleanText){
		this.clear(table);
		this.outLog(v.getAttribute('grid-manager') + '清除缓存成功,清除原因：'+ cleanText, 'info');
	}
	/*
	* [对外公开方法]
	* @清除指定表的缓存数据
	* $.table:table
	* return 成功或者失败的布尔值
	* */
	,clear: function(table){
		var _table = $(table);
		var _key = this.getLocalStorageKey(_table);
		if(!_key){
			return false;
		}
		window.localStorage.removeItem(_key);
		return true;
	}

	/*
	 * 获取指定表格本地存储所使用的key
	 * $table: table jTool
	 * */
	,getLocalStorageKey: function($table){
		//当前表是否禁用缓存  被禁用原因是用户缺失了必要的参数
		var noCache = $table.attr('no-cache');
		if(noCache && noCache== 'true'){
			Base.outLog('缓存已被禁用：当前表缺失必要html标签属性[grid-manager或th-name]', 'info');
			return false;
		}
		if(!window.localStorage){
			Base.outLog('当前浏览器不支持：localStorage，缓存功能失效', 'info');
			return false;
		}
		if(!$table || $table.length === 0){
			Base.outLog('getLocalStorage:无效的table', 'error');
			return false;
		}
		var _gridKey = $table.attr('grid-manager');
		//验证当前表是否为GridManager
		if(!_gridKey || $.trim(_gridKey) == ''){
			Base.outLog('getLocalStorage:无效的grid-manager', 'error');
			return false;
		}
		return window.location.pathname +  window.location.hash + '-'+ _gridKey;
	}
	/*
	* @根据本地缓存thead配置列表: 获取本地缓存, 存储原位置顺序, 根据本地缓存进行配置
	* $.table: table [jTool object]
	* */
	,configTheadForCache: function(table){
		var _this = this;
		var _data = _this.getLocalStorage(table),		//本地缓存的数据
			_domArray = [];
		var	_th,		//单一的th
			_td,		//单列的td，与_th对应
			_cache,		//列表的缓存数据
			_thCache,	//th相关 缓存
			_thJson,	//th的缓存json
			_thArray,
			_tbodyArray;
		//验证：当前table 没有缓存数据
		if(!_data || $.isEmptyObject(_data)){
			Base.outLog('configTheadForCache:当前table没有缓存数据', 'info');
			return;
		}
		_cache = _data.cache;
		_thCache=_cache.th;
		//验证：缓存数据与当前列表是否匹配
		if(!_thCache || _thCache.length != $('thead th', table).length){
			_this.cleanTableCache(table, '缓存数据与当前列表不匹配');
			return;
		}
		//验证：缓存数据与当前列表项是否匹配
		var _thNameTmpList = [],
			_dataAvailable = true;
		$.each(_thCache, function(i2, v2){
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
			$.each(_thCache, function(i2, v2){
				_thJson = v2;
				_th = $('th[th-name='+ _thJson.th_name +']', table);
				//配置列的宽度
				if(Settings.supportAdjust){
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
	 @保存至本地缓存
	 $.table:table [jTool object]
	 $.isInit: 是否为初始存储缓存[用于处理宽度在特定情况下发生异常]
	 */
	,setToLocalStorage: function(table, isInit){
		var _this = this;
		//当前为禁用缓存模式，直接跳出
		if(Settings.disableCache){
			return;
		}
		var _table = $(table);
		//当前表是否禁用缓存  被禁用原因是用户缺失了必要的参数
		var noCache = _table.attr('no-cache');
		if(noCache && noCache== 'true'){
			Base.outLog('缓存已被禁用：当前表缺失必要html标签属性[grid-manager或th-name]', 'info');
			return false;
		}
		if(!window.localStorage){
			Base.outLog('当前浏览器不支持：localStorage，缓存功能失效。', 'error');
			return false;
		}
		if(!_table || _table.length == 0){
			Base.outLog('setToLocalStorage:无效的table', 'error');
			return false;
		}
		var _gridKey = _table.attr('grid-manager');
		//验证当前表是否为GridManager
		if(!_gridKey || $.trim(_gridKey) == ''){
			Base.outLog('setToLocalStorage:无效的grid-manager', 'error');
			return false;
		}
		var _cache 		= {},
			_cacheString= '',
			_pageCache 	= {},
			_thCache	= new Array(),
			_thData 	= {};
		var thList = $('thead[grid-manager-thead] th', _table);
		if(!thList || thList.length == 0){
			Base.outLog('setToLocalStorage:无效的thList,请检查是否正确配置table,thead,th', 'error');
			return false;
		}

		var $v;
		$.each(thList, function(i, v){
			$v = $(v);
			_thData = {};
			_thData.th_name = v.getAttribute('th-name');
			if(Settings.supportDrag){
				_thData.th_index = $v.index();
			}
			if(Settings.supportAdjust){
				//用于处理宽度在特定情况下发生异常
				isInit ? $v.css('width', $v.css('width')) : '';
				_thData.th_width = v.offsetWidth;
			}
			if(Settings.supportConfig){
				_thData.isShow = $('.config-area li[th-name="'+ _thData.th_name +'"]', _table.closest('.table-wrap')).find('input[type="checkbox"]').get(0).checked;
			}
			_thCache.push(_thData);
		});
		_cache.th = _thCache;
		//存储分页
		if(Settings.supportAjaxPage){
			_pageCache.pSize = $('select[name="pSizeArea"]', _table.closest('.table-wrap')).val();
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
	,getLocalStorage: function(table){
		var _table = $(table);
		var _key = Cache.getLocalStorageKey(_table);
		if(!_key){
			return {};
		}
		var _data = {},
			_localStorage = window.localStorage.getItem(_key);
		//如无数据，增加属性标识：grid-manager-cache-error
		if(!_localStorage){
			_table.attr('grid-manager-cache-error','error');
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
	,setOriginalThDOM: function(table){
		table.data('originalThDOM', $('thead th', table));
	}
	/*
	 @获取原Th DOM至table data
	 $.table: table [jTool object]
	 */
	,getOriginalThDOM: function(table){
		return $(table).data('originalThDOM');
	}

	/*
	 @存储对外实例
	 $.table:当前被实例化的table
	 */
	,setGridManagerToJTool: function(table){
		table.data('gridManager', this);
	}
	/*
	 [对外公开方法]
	 @通过jTool实例获取gridManager
	 $.table:table [jTool object]
	 */
	,get: function(table){
		return this.__getGridManager(table);
	}
	/*
	 @获取gridManager
	 $.table:table [jTool object]
	 */
	,__getGridManager: function(table){
		return table.data('gridManager');
	}
};
export default Cache;
