/*
* Core: 核心方法
* */
var Adjust = require('./Adjust');
var AjaxPage = require('./AjaxPage');
var Cache = require('./Cache');
var Checkbox = require('./Checkbox');
var Config = require('./Config');
var Drag = require('./Drag');
var Export = require('./Export');
var I18n = require('./I18n');
var Menu = require('./Menu');
var Order = require('./Order');
var Remind = require('./Remind');
var Sort = require('./Sort');
var SetTop = require('./SetTop');
var Core= {
	/*
	* @版本号
	* */
	version: '2.0'
	/*
	* @ 获取随机参数
	* */
	, getRandom: function(){
		return this.version + Math.random();
	}
	/*
	* [对外公开方法]
	* @初始化方法
	* $.jToolObj: table [jTool object]
	* $.settings: 参数
	* $.callback:回调
	* */
	,init: function(jToolObj, settings, callback){
		var _this = this;
		// 参数
		$.extend(this, settings);

		//通过版本较验 清理缓存
		Cache.cleanTableCacheForVersion(jToolObj, this.version);
		if(typeof _this.gridManagerName !== 'string' || _this.gridManagerName.trim() === ''){
			_this.gridManagerName = jToolObj.attr('grid-manager');	//存储gridManagerName值
		}
		if(_this.gridManagerName.trim() === ''){
			_this.outLog('请在html标签中为属性[grid-manager]赋值或在配置项中配置gridManagerName', 'error');
			return false;
		}

		if(jToolObj.hasClass('GridManager-ready') || jToolObj.hasClass('GridManager-loading')){
			_this.outLog('渲染失败：可能该表格已经渲染或正在渲染' , 'error');
			return false;
		}
		//根据本地缓存配置每页显示条数
		if(_this.supportAjaxPage){
			AjaxPage.configPageForCache(jToolObj);
		}
		var query = $.extend({}, _this.query, _this.pageData);
		//增加渲染中标注
		jToolObj.addClass('GridManager-loading');
		_this.initTable(jToolObj);

		//如果初始获取缓存失败，则在mousedown时，首先存储一次数据
		console.log(jToolObj.attr('grid-manager-cache-error'));
		if(typeof jToolObj.attr('grid-manager-cache-error') !== 'undefined'){
			window.setTimeout(function(){
				Cache.setToLocalStorage(jToolObj, true);
				jToolObj.removeAttr('grid-manager-cache-error');
			},1000);
		}

		//重置tbody存在数据的列表 @20160717:的2.0版本中，重置已在其它位置执行，该处已无用
		//$('tbody tr', jToolObj).length > 0 ? _this.resetTd(v, false) : '';
		//启用回调
		typeof(callback) == 'function' ? callback(query) :'';
		return jToolObj;
	}
	/*
	 @初始化列表
	 $.table: table[jTool object]
	 */
	,initTable: function(table){
		var _this = this;

		//渲染HTML，嵌入所需的事件源DOM
		_this.createDOM(table);
		//获取本地缓存并对列表进行配置
		if(!_this.disableCache){
			Cache.configTheadForCache(table);
		}
		//绑定宽度调整事件
		if(_this.supportAdjust){
			Adjust.bindAdjustEvent(table);
		}
		//绑定拖拽换位事件
		if(_this.supportDrag){
			Drag.bindDragEvent(table);
		}
		//绑定排序事件
		if(_this.supportSorting){
			Sort.bindSortingEvent(table);
		}
		//绑定表头提示事件
		if(_this.supportRemind){
			Remind.bindRemindEvent(table);
		}
		//绑定配置列表事件
		if(_this.supportConfig){
			Config.bindConfigEvent(table);
		}
		//绑定表头吸顶功能
		if(_this.supportSetTop){
			SetTop.bindSetTopFunction(table);
		}
		//绑定右键菜单事件
		Menu.bindRightMenuEvent(table);
		//渲梁tbodyDOM
		_this.__refreshGrid();
		//将GridManager实例化对象存放于jTool data
		_this.setGridManagerToJTool(table);

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
	/*
	 [对外公开方法]
	 @刷新表格 使用现有参数重新获取数据，对表格数据区域进行渲染
	 $.table:当前操作的grid,由插件自动传入
	 $.gotoFirstPage:  是否刷新时跳转至第一页
	 $.callback: 回调函数
	 */
	,refreshGrid: function(table, gotoFirstPage, callback){
		var _this = this;
		if(typeof(gotoFirstPage) !== 'boolean'){
			callback = gotoFirstPage;
			gotoFirstPage = false;
		}
		if(gotoFirstPage){
			_this.pageData['cPage'] = 1;
		}
		_this.__refreshGrid(callback);
	}
	/*
	 @刷新表格 使用现有参数重新获取数据，对表格数据区域进行渲染
	 $.callback: 回调函数
	 */
	,__refreshGrid: function(callback){
		var _this = this;
		var tableDOM = $('table[grid-manager="'+ _this.gridManagerName +'"]'),		//table dom
			tbodyDOM = $('tbody', tableDOM),	//tbody dom
			refreshAction = $('.page-toolbar .refresh-action', tableDOM.closest('.table-wrap')); //刷新按纽
		//增加刷新中标识
		refreshAction.addClass('refreshing');
		/*
		 使用配置数据
		 如果存在配置数据ajax_data,将不再通过ajax_rul进行数据请求
		 且ajax_beforeSend、ajax_error、ajax_complete将失效，仅有ajax_success会被执行
		 */
		if(_this.ajax_data){
			driveDomForSuccessAfter(_this.ajax_data);
			_this.ajax_success(_this.ajax_data);
			removeRefreshingClass();
			typeof callback === 'function' ? callback() : '';
			return;
		}
		if(typeof(_this.ajax_url) != 'string' || _this.ajax_url === ''){
			_this.outLog('请求表格数据失败！参数[ajax_url]配制错误', 'error');
			removeRefreshingClass();
			typeof callback === 'function' ? callback() : '';
			return;
		}
		var parme = $.extend({}, _this.query);
		//合并分页信息至请求参
		if(_this.supportAjaxPage){
			$.extend(parme, _this.pageData);
		}
		//合并排序信息至请求参
		if(_this.supportSorting){
			$.extend(parme, _this.sortData);
		}
		//当前页小于1时, 修正为1
		if(parme.cPage < 1){
			parme.cPage = 1;
			//当前页大于总页数时, 修正为总页数
		}else if(parme.cPage > parme.tPage){
			parme.cPage = parme.tPage
		}
		//执行ajax前事件
		$.ajax({
			url: _this.ajax_url,
			type: _this.ajax_type,
			data: parme,
			cache: true,
			beforeSend: function(XMLHttpRequest){
				_this.ajax_beforeSend(XMLHttpRequest);
			},
			success: function(response){
				driveDomForSuccessAfter(response);
				_this.ajax_success(response);
			},
			error: function(XMLHttpRequest, textStatus, errorThrown){
				_this.ajax_error(XMLHttpRequest, textStatus, errorThrown);
			},
			complete: function(XMLHttpRequest, textStatus){
				_this.ajax_complete(XMLHttpRequest, textStatus);
				removeRefreshingClass();
			}
		});
		//移除刷新中样式
		function removeRefreshingClass(){
			window.setTimeout(function(){
				refreshAction.removeClass('refreshing');
			}, 2000);
		}
		//执行ajax成功后重新渲染DOM
		function driveDomForSuccessAfter(response) {
			if(!response){
				_this.outLog('请求数据失败！请查看配置参数[ajax_url或ajax_data]是否配置正确，并查看通过该地址返回的数据格式是否正确', 'error');
				return;
			}

			var tbodyTmpHTML = '';	//用于拼接tbody的HTML结构
			var parseRes = typeof(response) === 'string' ? JSON.parse(response) : response;
			var _data = parseRes[_this.dataKey];
			var key,	//数据索引
				alignAttr, //文本对齐属性
				template,//数据模板
				templateHTML;//数据模板导出的html
			Cache.cacheData = {};
			//数据为空时
			if(!_data ||_data.length === 0){
				tbodyTmpHTML = '<tr emptyTemplate>'
					+ '<td colspan="'+$('th[th-visible="visible"]', tableDOM).length+'">'
					+ (_this.emptyTemplate || '<div class="gm-emptyTemplate">数据为空</div>')
					+ '</td>'
					+ '</tr>';
				parseRes.totals = 0;
				tbodyDOM.html(tbodyTmpHTML);
			}else {
				$.each(_data, function(i, v){
					Cache.cacheData[i] = v;
					tbodyTmpHTML += '<tr cache-key="'+ i +'">';
					$.each(_this.columnData, function(i2, v2){
						key = v2.key;
						template = v2.template;
						templateHTML = typeof template === 'function' ? template(v[key], v) : v[key];
						alignAttr = v2.align ? 'align="'+v2.align+'"' : '';
						tbodyTmpHTML += '<td '+ alignAttr +'>'+ templateHTML +'</td>';
					});
					tbodyTmpHTML += '</tr>';
				});
				tbodyDOM.html(tbodyTmpHTML);
				_this.resetTd(tableDOM, false);
			}
			//渲染分页
			if(_this.supportAjaxPage){
				_this.resetPageData(tableDOM, parseRes[_this.totalsKey]);
				_this.checkMenuPageAction();
			}
			typeof callback === 'function' ? callback() : '';
		}
	}

	/*
	 @渲染HTML，根据配置嵌入所需的事件源DOM
	 $.table: table[jTool对象]
	 */
	,createDOM: function(table){
		var _this = this;
		table.attr('width', '100%').attr('cellspacing', 1).attr('cellpadding', 0).attr('grid-manager', _this.gridManagerName);
		var theadHtml = '<thead grid-manager-thead>',
			tbodyHtml = '<tbody></tbody>',
			alignAttr = '', 				//文本对齐属性
			widthHtml = '',					//宽度对应的html片段
			remindHtml = '',				//提醒对应的html片段
			sortingHtml	= '';				//排序对应的html片段
		//通过配置项[columnData]生成thead
		$.each(_this.columnData, function(i, v){
			if(_this.supportRemind && typeof(v.remind) === 'string' && v.remind !== ''){
				remindHtml = 'remind="' + v.remind +'"';
			}
			sortingHtml = '';
			if(_this.supportSorting && typeof(v.sorting) === 'string'){
				if(v.sorting === _this.sortDownText){
					sortingHtml = 'sorting="' + _this.sortDownText +'"';
					_this.sortData[v.key] = _this.sortDownText
				}
				else if(v.sorting === _this.sortUpText){
					sortingHtml = 'sorting="' + _this.sortUpText +'"';
					_this.sortData[v.key] = _this.sortUpText
				}else {
					sortingHtml = 'sorting';
				}
			}
			if(v.width){
				widthHtml = 'width="'+ v.width +'"';
			}else{
				widthHtml = '';
			}
			alignAttr = v.align ? 'align="'+v.align+'"' : '';
			theadHtml += '<th gm-create="false" th-name="'+ v.key +'" '+remindHtml+' '+sortingHtml+' '+widthHtml+' '+alignAttr+'>'+ v.text +'</th>';
		});
		theadHtml += '</thead>';
		table.html(theadHtml + tbodyHtml);
		//嵌入序号DOM
		if(_this.supportAutoOrder){
			console.log(Cache)
			Order.initOrderDOM(table);
		}
		//嵌入选择返选DOM
		if(_this.supportCheckbox){
			Checkbox.initCheckboxDOM(table);
		}
		//存储原始th DOM
		Cache.setOriginalThDOM(table);
		//表头提醒HTML
		var _remindHtml  = Remind.html();
		//配置列表HTML
		var	_configHtml	 = Config.html();
		//宽度调整HTML
		var	_adjustHtml	 = Adjust.html();
		//排序HTML
		var	_sortingHtml = Sort.html();
		//导出表格数据所需的事件源DOM
		var exportActionHtml = Export.html();
		//AJAX分页HTML
		if(_this.supportAjaxPage){
			var	_ajaxPageHtml= AjaxPage.html();
		}
		var	wrapHtml,                       //外围的html片段
			setTopHtml = '',                     //表头置顶html片段
			tableWarp,						//单个table所在的DIV容器
			onlyThead,						//单个table下的thead
			onlyThList,						//单个table下的TH
			onlyTH,							//单个TH
			onlyThWarp,						//单个TH下的上层DIV
			thPadding,						//TH当前的padding值
			remindDOM,						//表头提醒DOM
			adjustDOM,						//调整宽度DOM
			sortingDom,						//排序DOM
			sortType,						//排序类形
			isLmOrder,						//是否为插件自动生成的序号列
			isLmCheckbox;					//是否为插件自动生成的选择列
		//校验table的必要参数
		_this.checkTable(table);   //@baukh20160705:这个后期可以移除了，2.0版本中将没有什么作用了

		//根据配置使用默认的表格样式
		if(_this.useDefaultStyle){
			table.addClass('grid-manager-default');
		}
		onlyThead = $('thead', table);
		onlyThList = $('th', onlyThead);
		//表头置顶
		if(_this.supportSetTop){
			setTopHtml = '<div class="scroll-area"><div class="sa-inner"></div></div>';
		}
		wrapHtml = '<div class="table-wrap"><div class="table-div"></div>'+ setTopHtml +'<span class="text-dreamland"></span></div>';
		table.wrap(wrapHtml);
		tableWarp = table.closest('.table-wrap');
		//嵌入配置列表DOM
		if(_this.supportConfig){
			tableWarp.append(_configHtml);
		}
		//嵌入Ajax分页DOM
		if(_this.supportAjaxPage){
			tableWarp.append(_ajaxPageHtml);
			_this.initAjaxPage(table);
		}
		//嵌入导出表格数据事件源
		if(_this.supportExport){
			tableWarp.append(exportActionHtml);
		}
		$.each(onlyThList, function(i2,v2){
			onlyTH = $(v2);
			onlyTH.attr('th-visible','visible');
			//是否为自动生成的序号列
			if(_this.supportAutoOrder && onlyTH.attr('gm-order') === 'true'){
				isLmOrder = true;
			}else{
				isLmOrder = false;
			}

			//是否为自动生成的选择列
			if(_this.supportCheckbox && onlyTH.attr('gm-checkbox') === 'true'){
				isLmCheckbox = true;
			}else{
				isLmCheckbox = false;
			}

			onlyThWarp = $('<div class="th-wrap"></div>');
			//th存在padding时 转移至th-wrap
			thPadding = onlyTH.css('padding-top')
				+ onlyTH.css('padding-right')
				+ onlyTH.css('padding-bottom')
				+ onlyTH.css('padding-left');
			if(thPadding !== 0 ){
				onlyThWarp.css('padding', thPadding);
				onlyTH.css('cssText','padding:0px!important');
			}
			//嵌入配置列表项
			if(_this.supportConfig){
				$('.config-list', tableWarp)
					.append('<li th-name="'+ onlyTH.attr('th-name') +'" class="checked-li">'
						+ '<input type="checkbox" checked="checked"/>'
						+ '<label>'
						+ '<span class="fake-checkbox"></span>'
						+ onlyTH.text()
						+ '</label>'
						+ '</li>');
			}
			//嵌入拖拽事件源
			//插件自动生成的排序与选择列不做事件绑定
			if(_this.supportDrag && !isLmOrder && !isLmCheckbox){
				onlyThWarp.html('<span class="th-text drag-action">'+onlyTH.html()+'</span>');
			}else{
				onlyThWarp.html('<span class="th-text">'+ onlyTH.html() +'</span>');
			}
			var onlyThWarpPaddingTop = onlyThWarp.css('padding-top');
			//嵌入表头提醒事件源
			//插件自动生成的排序与选择列不做事件绑定
			if(_this.supportRemind && onlyTH.attr('remind') != undefined && !isLmOrder && !isLmCheckbox){
				remindDOM = $(_remindHtml);
				remindDOM.find('.ra-title').text(onlyTH.text());
				remindDOM.find('.ra-con').text(onlyTH.attr('remind') || onlyTH.text());
				if(onlyThWarpPaddingTop != '' && onlyThWarpPaddingTop != '0px'){
					remindDOM.css('top', onlyThWarpPaddingTop);
				}
				onlyThWarp.append(remindDOM);
			}
			//嵌入排序事件源
			//插件自动生成的排序与选择列不做事件绑定
			sortType = onlyTH.attr('sorting');
			if(_this.supportSorting &&  sortType!= undefined && !isLmOrder && !isLmCheckbox){
				sortingDom = $(_sortingHtml);
				//依据 sortType 进行初始显示
				switch(sortType){
					case _this.sortUpText : sortingDom.addClass('sorting-up');
						break;
					case _this.sortDownText : sortingDom.addClass('sorting-down');
						break;
				}
				if(onlyThWarpPaddingTop != ''  && onlyThWarpPaddingTop != '0px'){
					sortingDom.css('top', onlyThWarpPaddingTop);
				}
				onlyThWarp.append(sortingDom);
			}
			//嵌入宽度调整事件源
			//插件自动生成的选择列不做事件绑定
			if(_this.supportAdjust && !isLmCheckbox){
				adjustDOM = $(_adjustHtml);
				//最后一列不支持调整宽度
				if(i2 == onlyThList.length - 1){
					adjustDOM.hide();
				}
				onlyThWarp.append(adjustDOM);
			}
			onlyTH.html(onlyThWarp);
			//如果th上存在width属性，则表明配置项中存在该项配置；
			//验证当前列是否存在宽度配置，如果存在，则直接使用配置项中的宽度，如果不存在则使用getTextWidth方法进行计算
			var thWidthForConfig = onlyTH.attr('width');
			if(thWidthForConfig && thWidthForConfig !== ''){
				onlyTH.width(thWidthForConfig);
				onlyTH.removeAttr('width');  //直接使用removeProp 无效
			}else{
				var _realWidthForThText = _this.getTextWidth(onlyTH); //当前th文本所占宽度大于设置的宽度
				onlyTH.css('min-width', _realWidthForThText);
			}
		});
		//删除渲染中标识、增加渲染完成标识
		table.removeClass('GridManager-loading');
		table.addClass('GridManager-ready');
	}
	/*
	 @校验table的必要参数[th-name]
	 必要参数不完整时将进行自动添加，但被添加的表将关闭缓存功能
	 $.table: table
	 */
	//@baukh20160705:这个后期可以移除了，2.0版本中将没有什么作用了
	,checkTable: function(table){
		var _this = this;
		var table 	= $(table),				//当前表
			thList 	= $('thead th', table); //当前表的所有th
		var noCache = false;				//是否禁用缓存
		//校验[th-name]
		$.each(thList, function(i, v){
			if(!v.getAttribute('th-name')){
				noCache ? '' : noCache = true;
				v.setAttribute('th-name', 'auto-th-' + _this.getRandom());
			}
		});
		//通过验证后确定是否禁用缓存
		if(noCache){
			table.attr('no-cache', 'true');
		}
	}
	/*
	 [对外公开方法]
	 @重置列表[tbody]
	 这个方法对外可以直接调用
	 作用：处理局部刷新、分页事件之后的tb排序
	 $.table: table [jTool object]
	 $.isSingleRow: 指定DOM节点是否为tr[布尔值]
	 */
	,resetTd: function(dom, isSingleRow){
		var _this = this;
		if(isSingleRow){
			var _tr = $(dom),
				_table= _tr.closest('table');
		}else{
			var _table = $(dom),
				_tr	= _table.find('tbody tr');
		}
		if(!_tr || _tr.length == 0){
			return false;
		}
		//重置表格序号
		if(_this.supportAutoOrder){
			var _pageData = _this.pageData;
			var onlyOrderTd = undefined,
				_orderBaseNumber = 1,
				_orderText;
			//验证是否存在分页数据
			if(_pageData && _pageData['pSize'] && _pageData['cPage']){
				_orderBaseNumber = _pageData.pSize * (_pageData.cPage - 1) + 1;
			}
			$.each(_tr, function(i, v){
				_orderText = _orderBaseNumber + i;
				onlyOrderTd = $('td[gm-order="true"]', v)
				if(onlyOrderTd.length == 0){
					$(v).prepend('<td gm-order="true" gm-create="true">'+ _orderText +'</td>');
				}else{
					onlyOrderTd.text(_orderText);
				}
			});
		}
		//重置表格选择 checkbox
		if(_this.supportCheckbox){
			var onlyCheckTd = undefined;
			$.each(_tr, function(i, v){
				onlyCheckTd = $('td[gm-checkbox="true"]', v);
				if(onlyCheckTd.length == 0){
					$(v).prepend('<td gm-checkbox="true" gm-create="true"><input type="checkbox"/></td>');
				}else{
					$('[type="checkbox"]', onlyCheckTd).prop('checked', false);
				}
			});
		}
		//依据顺序存储重置td顺序
		if(_this.supportAdjust){  // 这里应该是验证换位而不是宽度调整
			return;
			var _thList = _this.getOriginalThDOM(_table),
				_td;
			if(!_thList || _thList.length == 0 ){
				_this.outLog('resetTdForCache:列位置重置所必须的原TH DOM获取失败', 'error');
				return false;
			}
			var _tmpHtml = [],
				_tdArray = [];
			//		console.log(_thList.eq(4).index())
			$.each(_tr, function(i, v){
				_tmpHtml[i] = $(v);
				_td = $(v).find('td');
				$.each(_td, function(i2, v2){
					_tdArray[_thList.eq(i2).index()] = v2.outerHTML;
				});
				_tmpHtml[i].html(_tdArray.join(''));
			});
		}
		//依据配置对列表进行隐藏、显示
		if(_this.supportConfig){
			_this.setAreVisible($('[th-visible="none"]'), false ,true);
		}
		//重置吸顶事件
		if(_this.supportSetTop){
			var _tableDIV 	= _table.closest('.table-div');
			var _tableWarp 	= _tableDIV.closest('.table-wrap');
			_tableDIV.css({
				height:'auto'
			});
			_tableWarp.css({
				marginBottom: 0
			});
		}
	}
	/*
	 [对外公开方法]
	 @配置query 该参数会在分页触发后返回至pagingAfter(query)方法
	 $.table: table [jTool object]
	 $.query:配置的数据
	 */
	,setQuery: function(table, query){
		var _this = this;
		table.GridManager('get')['query'] = query;
	}
	/*
	 @输出日志
	 $.type: 输出分类[info,warn,error]
	 */
	,outLog: function(msg, type){
		if(!this.isDevelopMode && !type){
			return console.log('GridManager:', msg);
		}
		else if(!this.isDevelopMode && type === 'info'){
			return console.info('GridManager Info: ', msg);
		}
		else if(!this.isDevelopMode && type === 'warn'){
			return console.warn('GridManager Warn: ', msg);
		}
		else if(type === 'error'){
			return console.error('GridManager Error: ', msg);
		}
	}
};

module.exports = Core;
