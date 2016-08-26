/*
 http://www.lovejavascript.com/#!plugIn/GridManager/index.html
 @baukh:GridManager 表格管理插件
 当前版本：v2.0
 */
;(function(){
	'use strict';
	function GridManager(settings){
		typeof(settings) == 'undefined' ? settings = {} : '';
		this.version			= '2.0';					//版本号
		this.isDevelopMode  	= false;					//是否为开发模式，为true时将打印事件日志
		this.basePath			= '';						//当前基本路径[用于加载分页所需样式文件]
		this.useDefaultStyle	= true,						//是否使用默认的table样式
		this.supportDrag 		= true; 					//是否支持拖拽功能
		this.isRealTime			= false;					//列表内是否存在实时刷新[平时尽量不要设置为true，以免消耗资源]
		this.supportAdjust 		= true; 					//是否支持宽度调整功能]
		this.supportRemind  	= false;					//是否支持表头提示信息[需在地应的TH上增加属性remind]
		this.supportConfig		= true;						//是否支持配置列表功能[操作列是否可见]
		this.supportSetTop  	= true;						//是否支持表头置顶
		this.scrollDOM			= window;					//表头置顶所对应的容器[jquery选择器或jquery对象]
		this.topValue		  	= 0;						//特殊情况下才进行设置，在有悬浮物遮挡住表头置顶区域时进行使用，配置值为遮挡的高度
		this.animateTime    	= 300;						//动画效果时长
		this.disableCache		= false;					//是否禁用本地缓存
		this.autoLoadCss		= false;					//是否自动加载CSS文件
		//排序 sort
		this.supportSorting		= false; 					//排序：是否支持排序功能
		this.isCombSorting		= false;					//是否为组合排序[只有在支持排序的情况下生效
		this.sortData 			= {};						//存储排序数据[不对外公开参数]
		this.sortUpText			= 'up';						//排序：升序标识[该标识将会传至数据接口]
		this.sortDownText		= 'down';					//排序：降序标识[该标识将会传至数据接口]
		this.sortingBefore		= $.noop;					//排序事件发生前
		this.sortingAfter		= $.noop;					//排序事件发生后

		//分页 ajaxPag
		this.supportAjaxPage	= false;					//是否支持配置列表ajxa分页
		this.sizeData 			= [10,20,30,50,100]; 		//用于配置列表每页展示条数选择框
		this.pageSize			= 20;						//每页显示条数，如果使用缓存且存在缓存数据，那么该值将失效
		this.pageData 			= {};						//存储分页数据[不对外公开参数]
		this.query 				= {};						//其它需要带入的参数，该参数中设置的数据会在分页或排序事件中以参数形式传递
		this.pagingBefore		= $.noop;					//分页事件发生前
		this.pagingAfter		= $.noop;					//分页事件发生后
		this.pageCssFile 		= '';						//分页样式文件路径[用户自定义分页样式]

		//序号
		this.supportAutoOrder	= true;						//是否支持自动序号
		this.orderThName		= 'order';					//序号列所使用的th-name

		//选择、反选
		this.supportCheckbox	= true;						//是否支持选择与反选
		this.checkboxThName		= 'gm-checkbox';			//选择与反选列所使用的th-name
		//国际化
		this.i18n	 			= 'zh-cn';					//选择使用哪种语言，暂时支持[zh-cn:简体中文，en-us:美式英语] 默认zh-cn

		//用于支持通过数据渲染DOM
		this.columnData			= [];						//表格列数据配置项
		this.gridManagerName   	= '';						//表格grid-manager所对应的值[可在html中配置]
		this.ajax_url			= '';						//获取表格数据地址，配置该参数后，将会动态获取数据
		this.ajax_type			= 'GET';					//ajax请求类型['GET', 'POST']默认GET
		this.ajax_beforeSend	= $.noop;					//ajax请求之前,与jquery的beforeSend使用方法相同
		this.ajax_success		= $.noop;					//ajax成功后,与jquery的success使用方法相同
		this.ajax_complete		= $.noop;					//ajax完成后,与jquery的complete使用方法相同
		this.ajax_error			= $.noop;					//ajax失败后,与jquery的error使用方法相同
		this.ajax_data			= undefined;				//ajax静态数据,配置后ajax_url将无效
		this.dataKey			= 'data';					//ajax请求返回的列表数据key键值,默认为data
		this.totalsKey			= 'totals';					//ajax请求返回的数据总条数key键值,默认为totals
		//数据导出
		this.supportExport		= true;						//支持导出表格数据
		//用于支持全局属性配置  于v1.8 中将GridManagerConfig弱化且不再建议使用。

		var textConfig = {};
		if(typeof(gridManagerConfig) == 'object'){
			$.extend(true, textConfig, this.textConfig, gridManagerConfig.textConfig)
			$.extend(true, this, gridManagerConfig);
		}
		$.extend(true, textConfig, this.textConfig, settings.textConfig)
		$.extend(this, settings, {textConfig: textConfig});
	}
	GridManager.prototype = {
		/*
		 @当前浏览器是否为谷歌[内部参数]
		 */
		isChrome: function(){
			return navigator.userAgent.indexOf('Chrome') == -1 ? false : true;
		}
		/*
		 @获取随机参数
		 */
		,getRandom: function(){
			return this.version + Math.random();
		}
		/*
		 [对外公开方法]
		 @初始化方法
		 $.callback:回调
		 $.jQueryObj: table [jquery object]
		 */
		,init: function(jQueryObj, callback){
			var _this = this;
			//通过版本较验 清理缓存
			_this.cleanTableCacheForVersion(jQueryObj);
			if(typeof _this.gridManagerName !== 'string' || _this.gridManagerName.trim() === ''){
				_this.gridManagerName = jQueryObj.attr('grid-manager');	//存储gridManagerName值
			}
			if(_this.gridManagerName.trim() === ''){
				_this.outLog('请在html标签中为属性[grid-manager]赋值或在配置项中配置gridManagerName', 'error');
				return false;
			}

			if(jQueryObj.hasClass('GridManager-ready') || jQueryObj.hasClass('GridManager-loading')){
				_this.outLog('渲染失败：可能该表格已经渲染或正在渲染' , 'error');
				return false;
			}
			//根据本地缓存配置每页显示条数
			if(_this.supportAjaxPage){
				_this.configPageForCache(jQueryObj);
			}
			var query = $.extend({}, _this.query, _this.pageData);
			//增加渲染中标注
			jQueryObj.addClass('GridManager-loading');
			//加载所需资源
			_this.loadGridManagerFile(function(){  //baukh20160705:加载资源应该移除
				_this.initTable(jQueryObj);

				//如果初始获取缓存失败，则在mousedown时，首先存储一次数据
				if(typeof jQueryObj.attr('grid-manager-cache-error') !== 'undefined'){
					window.setTimeout(function(){
						_this.setToLocalStorage(jQueryObj, true);
						jQueryObj.removeAttr('grid-manager-cache-error');
					},1000);
				}

				//重置tbody存在数据的列表 @20160717:的2.0版本中，重置已在其它位置执行，该处已无用
				//$('tbody tr', jQueryObj).length > 0 ? _this.resetTd(v, false) : '';
				//启用回调
				typeof(callback) == 'function' ? callback(query) :'';
			});
			return jQueryObj;
		}
		/*
		 @存储对外实例至JQuery
		 $.table:当前被实例化的table
		 */
		,setGridManagerToJQuery: function(table){
			table.data('gridManager', this);
		}
		/*
		 [对外公开方法]
		 @通过JQuery实例获取gridManager
		 $.table:table [jquery object]
		 */
		,get: function(table){
			return this.__getGridManager(table);
		}
		/*
		 @通过JQuery实例获取gridManager
		 $.table:table [jquery object]
		 */
		,__getGridManager: function(table){
			return table.data('gridManager');
		}
		/*
		 [对外公开方法]
		 @手动设置排序
		 $.table: table [jquery object]
		 $.sortJson: 需要排序的json串
		 $.callback: 回调函数
		 $.refresh: 是否执行完成后对表格进行自动刷新[boolean]
		 ex: sortJson
		 sortJson = {
		 th-name:up/down 	//其中up/down 需要与参数 sortUpText、sortDownText值相同
		 }
		 */
		,setSort: function(table, sortJson, callback, refresh){
			var _this = this;
			if(table.length == 0 || !sortJson || $.isEmptyObject(sortJson)){
				return false;
			}
			//默认执行完后进行刷新列表操作
			if(typeof(refresh) === 'undefined'){
				refresh = true;
			}
			var _th,
				_sortAction,
				_sortType;
			for(var s in sortJson){
				_th = $('[th-name="'+ s +'"]', table);
				_sortType = sortJson[s];
				_sortAction = $('.sorting-action', _th);
				if(_sortType == _this.sortUpText){
					_th.attr('sorting', _this.sortUpText);
					_sortAction.removeClass('sorting-down');
					_sortAction.addClass('sorting-up');
				}
				else if(_sortType == _this.sortDownText){
					_th.attr('sorting', _this.sortDownText);
					_sortAction.removeClass('sorting-up');
					_sortAction.addClass('sorting-down');
				}
			}
			refresh ? _this.__refreshGrid(callback) : (typeof(callback) === 'function' ? callback() : '');
			return table;
		}
		/*
		 @加载所需文件
		 */
		,loadGridManagerFile: function(callback){
			var _this = this;
			var loadIConfont = false,
				loadListCss  = false,
				loadPageCss  = false;
			//加载列表样式文件
			if($('link#GridManager-css').length == 0 && _this.autoLoadCss){
				var GridManagerCss  = document.createElement('link');
				GridManagerCss.id   = 'GridManager-css';
				GridManagerCss.rel  = 'stylesheet';
				GridManagerCss.type = 'text/css';
				GridManagerCss.href = _this.basePath + 'css/GridManager.css';
				document.head.appendChild(GridManagerCss);
				GridManagerCss.addEventListener('load', function(event) {
					_this.outLog('GridManager-css load OK' , 'info');
					loadListCss = true;
					gotoCallback();
				});
				GridManagerCss.addEventListener('error', function(){
					_this.outLog('GridManager-css load error' , 'error');
					loadListCss = false;
				});
			}else{
				loadListCss = true;
			}
			//加载用户自定义分页样式文件
			if(_this.supportAjaxPage &&
				$('link#GridManager-ajaxPage-css').length == 0 &&
				_this.pageCssFile && _this.pageCssFile != ''){
				var ajaxPageCss  = document.createElement('link');
				ajaxPageCss.id   = 'GridManager-ajaxPage-css';
				ajaxPageCss.rel  = 'stylesheet';
				ajaxPageCss.type = 'text/css';
				ajaxPageCss.href = _this.pageCssFile;
				document.head.appendChild(ajaxPageCss);
				ajaxPageCss.addEventListener('load', function(event) {
					_this.outLog('GridManager-ajaxPage-css load OK', 'info');
					loadPageCss = true;
					gotoCallback();
				});
				ajaxPageCss.addEventListener('error', function(){
					_this.outLog('GridManager-ajaxPage-css load error', 'error');
					loadPageCss = false;
				});
			}else{
				loadPageCss = true;
			}
			gotoCallback();
			function gotoCallback(){
				if(/*loadIConfont && */loadListCss && loadPageCss){
					callback();
				}
			}
		}
		/*
		 @初始化列表
		 $.table: table[jquery object]
		 */
		,initTable: function(table){
			var _this = this;

			//渲染HTML，嵌入所需的事件源DOM
			_this.createDOM(table);
			//获取本地缓存并对列表进行配置
			if(!_this.disableCache){
				_this.configTheadForCache(table);
			}
			//绑定宽度调整事件
			if(_this.supportAdjust){
				_this.bindAdjustEvent(table);
			}
			//绑定拖拽换位事件
			if(_this.supportDrag){
				_this.bindDragEvent(table);
			}
			//绑定排序事件
			if(_this.supportSorting){
				_this.bindSortingEvent(table);
			}
			//绑定表头提示事件
			if(_this.supportRemind){
				_this.bindRemindEvent(table);
			}
			//绑定配置列表事件
			if(_this.supportConfig){
				_this.bindConfigEvent(table);
			}
			//绑定表头吸顶功能
			if(_this.supportSetTop){
				_this.bindSetTopFunction(table);
			}
			//绑定右键菜单事件
			_this.bindRightMenuEvent(table);
			//渲梁tbodyDOM
			_this.__refreshGrid();
			//将GridManager实例化对象存放于jquery data
			_this.setGridManagerToJQuery(table);

		}
		/*
		 * @缓存数据
		 * 用于存储当前渲染表格的数据
		 * 通过每个tr上的cache-key进行获取
		 * */
		,cacheData: {}
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
				refreshAction = $('.page-toolbar .refresh-action', tableDOM.closest('.table-warp')); //刷新按纽
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
			/*
			 @baukh20160717:2。0版本中该验证将无用
			 if(!tbodyDOM || tbodyDOM.length === 0){
			 tableDOM.append('<tbody></tbody>');
			 tbodyDOM = $('tbody', tableDOM);
			 }
			 */
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
				_this.cacheData = {};
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
						_this.cacheData[i] = v;
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
		 @验证菜单区域: 禁用、开启分页操作
		 */
		,checkMenuPageAction: function(){
			var _this = this;
			//右键菜单区上下页限制
			var gridMenu = $('.grid-menu[grid-master="'+ _this.gridManagerName +'"]');
			if(!gridMenu || gridMenu.length === 0){
				return;
			}
			var previousPage = $('[refresh-type="previous"]', gridMenu),
				nextPage = $('[refresh-type="next"]', gridMenu);
			if(_this.pageData.cPage === 1 || _this.pageData.tPage === 0){
				previousPage.addClass('disabled');
			}else{
				previousPage.removeClass('disabled');
			}
			if(_this.pageData.cPage === _this.pageData.tPage || _this.pageData.tPage === 0){
				nextPage.addClass('disabled');
			}else{
				nextPage.removeClass('disabled');
			}
		}
		/*
		 @生成序号DOM
		 $.table: table [jquery object]
		 */
		,initOrderDOM: function(table) {
			var _this = this;
			var orderHtml = '<th th-name="'+ _this.orderThName +'" gm-order="true" gm-create="true">'+ _this.i18nText('order-text') +'</th>';
			$('thead tr', table).prepend(orderHtml);
		}
		/*
		 @初始化选择与反选DOM
		 $.table: table DOM
		 */
		,initCheckboxDOM: function(table) {
			var _this = this;
			var checkboxHtml = '<th th-name="'+ _this.checkboxThName +'" gm-checkbox="true" gm-create="true"><input type="checkbox"/><span style="display: none">'+ _this.i18nText('checkall-text') +'</span></th>';
			$('thead tr', table).prepend(checkboxHtml);
			//绑定选择事件
			table.off('click','input[type="checkbox"]');
			table.on('click','input[type="checkbox"]', function(){
				var _checkAction = $(this),	//全选键事件源
					_thChecked	= true,		//存储th中的checkbox的选中状态
					_thCheckbox = $('thead th[gm-checkbox] input[type="checkbox"]', table),	//th中的选择框
					_tdCheckbox = $('tbody td[gm-checkbox] input[type="checkbox"]', table);	//td中的选择框
				//当前为全选事件源
				if(_checkAction.closest('th[th-name="'+ _this.checkboxThName +'"]').length === 1){
					$.each(_tdCheckbox, function(i, v){
						v.checked = _checkAction.prop('checked');
						$(v).closest('tr').attr('checked', v.checked);
					});
					//当前为单个选择
				}else{
					$.each(_tdCheckbox, function(i, v){
						if(v.checked === false) {
							_thChecked = false;
						}
						$(v).closest('tr').attr('checked', v.checked);
					});
					_thCheckbox.prop('checked', _thChecked);
				}
			});
		}
		/*
		 [对外公开方法]
		 @获取当前选中的列
		 $.table:当前操作的grid,由插件自动传入
		 */
		,getCheckedTr: function(table) {
			return $('tbody td[gm-checkbox] input[type="checkbox"]:checked', table).closest('tr');
		}
		/*
		 @渲染HTML，根据配置嵌入所需的事件源DOM
		 $.table: table[JQuery对象]
		 */
		,createDOM: function(table){
			var _this = this;
			table.attr({width: '100%', cellspacing: 1, cellpadding:0, 'grid-manager': _this.gridManagerName});
			var theadHtml = '<thead>',
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
				theadHtml += '<th th-name="'+ v.key +'" '+remindHtml+' '+sortingHtml+' '+widthHtml+' '+alignAttr+'>'+ v.text +'</th>';
			});
			theadHtml += '</thead>';
			table.html(theadHtml + tbodyHtml);

			//嵌入序号DOM
			if(_this.supportAutoOrder){
				_this.initOrderDOM(table);
			}
			//嵌入选择返选DOM
			if(_this.supportCheckbox){
				_this.initCheckboxDOM(table);
			}
			//存储原始th DOM
			_this.setOriginalThDOM(table);
			//表头提醒HTML
			var _remindHtml  = '<div class="remind-action">'
				+ '<i class="ra-help iconfont icon-icon"></i>'
				+ '<div class="ra-area">'
				+ '<span class="ra-title"></span>'
				+ '<span class="ra-con"></span>'
				+ '</div>'
				+ '</div>';
			//配置列表HTML
			var	_configHtml	 = '<div class="config-area"><span class="config-action"><i class="iconfont icon-31xingdongdian"></i></span>'
				+ '<ul class="config-list"></ul></div>';
			//宽度调整HTML
			var	_adjustHtml	 = '<span class="adjust-action"></span>';
			//排序HTML
			var	_sortingHtml = '<div class="sorting-action">'
				+ '<i class="sa-icon sa-up iconfont icon-sanjiao2"></i>'
				+ '<i class="sa-icon sa-down iconfont icon-sanjiao1"></i>'
				+ '</div>';
			//导出表格数据所需的事件源DOM
			var exportActionHtml = '<a href="" download="" id="gm-export-action"></a>';
			//AJAX分页HTML
			if(_this.supportAjaxPage){
				var	_ajaxPageHtml= '<div class="page-toolbar">'
					+ '<div class="dataTables_info"></div>'
					+ '<div class="change-size"><select name="pSizeArea"></select></div>'
					+ '<div class="goto-page">'+ _this.i18nText("goto-first-text")
					+ '<input type="text" class="gp-input"/>'+ _this.i18nText("goto-last-text")
					+ '</div>'
					+ '<div class="refresh-action"><i class="iconfont icon-shuaxin"></i></div>'
					+ '<div class="ajax-page"><ul class="pagination"></ul></div>'
					+ '</div>';
			}
			var	tableWarp,						//单个table所在的DIV容器
				tName,							//table的GridManager属性值
				tableDiv,						//单个table所在的父级DIV
				onlyThead,						//单个table下的thead
				onlyThList,						//单个table下的TH
				onlyTH,							//单个TH
				onlyThWarp,						//单个TH下的上层DIV
				thHeight,						//TH的高
				thPadding,						//TH当前的padding值
				marginRigth,					//调整宽度节点所需要右移的数值
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
			onlyThList = onlyThead.find('th');
			table.wrap('<div class="table-warp"><div class="table-div"></div><span class="text-dreamland"></span></div>');
			tableWarp = table.parents('.table-warp').eq(0);
			tableDiv = $('.table-div', tableWarp);
			//嵌入配置列表DOM
			if(_this.supportConfig){
				tableWarp.append(_configHtml);
			}
			tName = table.attr('grid-manager');
			//嵌入Ajax分页DOM
			if(_this.supportAjaxPage){
				tableWarp.append(_ajaxPageHtml);
				_this.initAjaxPage(table);
			}
			//嵌入导出表格数据事件源
			if(_this.supportExport){
				tableWarp.append(exportActionHtml);
			}
			//表头置顶
			if(_this.supportSetTop){
				tableDiv.after('<div class="scroll-area"><div class="sa-inner"></div></div>');
			}

			$.each(onlyThList, function(i2,v2){
				onlyTH = $(v2);
				onlyTH.attr('th-visible','visible');

				//是否为自动生成的序号列
				if(_this.supportAutoOrder && onlyTH.attr('gm-order') == 'true'){
					isLmOrder = true;
				}else{
					isLmOrder = false;
				}

				//是否为自动生成的选择列
				if(_this.supportCheckbox && onlyTH.attr('gm-checkbox') == 'true'){
					isLmCheckbox = true;
				}else{
					isLmCheckbox = false;
				}

				//嵌入th下外层div
				onlyThWarp = $('<div class="th-warp"></div>');
				//th存在padding时 转移至th-warp
				if(_this.isChrome()){
					thPadding = onlyTH.css('padding');  //firefox 不兼容
				}else{
					thPadding = onlyTH.css('padding-top') + ' '
						+ onlyTH.css('padding-right') + ' '
						+ onlyTH.css('padding-bottom') + ' '
						+ onlyTH.css('padding-left');
				}
				thPadding = $.trim(thPadding);
				if(thPadding != '' && thPadding != '0px' && thPadding != '0px 0px 0px 0px'){
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
				var thWidthForConfig = onlyTH.prop('width');
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
		,checkTable: function(table){
			var _this = this;
			var table 	= $(table),			//当前表
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
		 @绑定配置列表事件[隐藏展示列]
		 $.table: table [jquery object]
		 */
		,bindConfigEvent: function(table){
			var _this = this;
			//打开/关闭设置区域
			var tableWarp = $(table).parents('div.table-warp');
			var configAction = $('.config-action', tableWarp);
			configAction.unbind('click');
			configAction.bind('click', function(){
				var _configAction = $(this),		//展示事件源
					_configArea = _configAction.closest('.config-area'),	//设置区域
					_configList = $('.config-list',_configArea);//设置列表
				//关闭
				if(_configArea.css('display') == 'block'){
					_configArea.hide();
					return false;
				}
				//打开
				_configArea.show();
				var _tableWarp = _configAction.parents('.table-warp').eq(0),//当前事件源所在的div
					_table	= $('[grid-manager]', _tableWarp),				//对应的table
					_thList = $('thead th', _table),							//所有的th
					_trList = $('tbody tr', _table),							//tbody下的tr
					_td;														//与单个th对应的td
				$.each(_thList, function(i, v){
					v = $(v);
					$.each(_trList, function(i2, v2){
						_td = $('td', v2).eq(v.index());
						_td.css('display', v.css('display'));
					});
				});
				//验证当前是否只有一列处于显示状态 并根据结果进行设置是否可以取消显示
				var checkedLi = $('.checked-li', _configArea);
				checkedLi.length == 1 ? checkedLi.addClass('no-click') : checkedLi.removeClass('no-click');
			});
			//设置事件
			$('.config-list li', tableWarp).unbind('click');
			$('.config-list li', tableWarp).bind('click', function(){
				var _only = $(this),		//单个的设置项
					_configArea 	= _only.closest('.config-area'),					//事件源所在的区域
					_thName 		= _only.attr('th-name'),							//单个设置项的thName
					_checkbox 		= _only.find('input[type="checkbox"]'),			//事件下的checkbox
					_tableWarp  	= _only.closest('.table-warp'), 					//所在的大容器
					_tableDiv	  	= $('.table-div', _tableWarp), 						//所在的table-div
					_table	 		= $('[grid-manager]', _tableWarp),				//所对应的table
					_th				= $('thead th[th-name="'+_thName +'"]', _table), 	//所对应的th
					_checkedList;		//当前处于选中状态的展示项
				if(_only.hasClass('no-click')){
					return false;
				}
				_only.closest('.config-list').find('.no-click').removeClass('no-click');
				var isVisible = !_checkbox.get(0).checked;
				//设置与当前td同列的td是否可见
				_tableDiv.addClass('config-editing')
				_this.setAreVisible(_th, isVisible, false, function(){
					_tableDiv.removeClass('config-editing');
				});
				//最后一项禁止取消
				_checkedList =  $('.config-area input[type="checkbox"]:checked', _tableWarp);
				if(_checkedList.length == 1){
					_checkedList.parent().addClass('no-click');
				}

				//重置调整宽度事件源
				_this.resetAdjust(_table);

				//重置镜像滚动条的宽度
				if(_this.supportSetTop){
					$('.sa-inner', _tableWarp).width('100%');
				}
				//重置当前可视th的宽度
				var _visibleTh = $('thead th[th-visible="visible"]', _table);
				$.each(_visibleTh, function(i, v){
					v.style.width = 'auto';
				});
				//当前th文本所占宽度大于设置的宽度
				//需要在上一个each执行完后才可以获取到准确的值
				$.each(_visibleTh, function(i, v){
					var _realWidthForThText = _this.getTextWidth(v),
						_thWidth = $(v).width();
					if(_thWidth < _realWidthForThText){
						$(v).width(_realWidthForThText);
					}else{
						$(v).width(_thWidth);
					}
				});
				_this.setToLocalStorage(_table);	//缓存信息
			});
		}
		/*
		 [对外公开方法]
		 @显示Th及对应的TD项
		 $.table: table
		 $.th:th
		 */
		,showTh: function(table, th){
			var _this = this;
			_this.setAreVisible($(th), true);
		}
		/*
		 [对外公开方法]
		 @隐藏Th及对应的TD项
		 $.table: table
		 $.th:th
		 */
		,hideTh: function(table, th){
			var _this = this;
			_this.setAreVisible($(th), false);
		}
		/*
		 @设置列是否可见
		 $._thList_	： 即将配置的列所对应的th[jquery object，可以是多个]
		 $._visible_	: 是否可见[Boolean]
		 $._isInit_	: 是否初始加载[通过缓存进行的初始修改]
		 $.cb		: 回调函数
		 */
		,setAreVisible: function(_thList_, _visible_, _isInit_ ,cb){
			var _this = $(this);
			var _table,			//当前所在的table
				_tableWarp, 	//当前所在的容器
				_th,			//当前操作的th
				_trList, 		//当前tbody下所有的tr
				_tdList = [], 	//所对应的td
				_checkLi,		//所对应的显示隐藏所在的li
				_checkbox;		//所对应的显示隐藏事件
			var fadeTime = _isInit_ ? 0 : _this.animateTime;
			$.each(_thList_, function(i, v){
				_th = $(v);
				_table = _th.closest('table');
				_tableWarp = _table.closest('.table-warp');
				_trList = $('tbody tr', _table);
				_checkLi = $('.config-area li[th-name="'+ _th.attr('th-name') +'"]', _tableWarp);
				_checkbox = _checkLi.find('input[type="checkbox"]');
				if(_checkbox.length == 0){
					return;
				}
				$.each(_trList, function(i, v){
					_tdList.push($(v).find('td').eq(_th.index()));
				});
				//显示
				if(_visible_){
					_th.attr('th-visible','visible');
					$.each(_tdList, function(i2, v2){
						_isInit_ ? $(v2).show() : $(v2).fadeIn(fadeTime);
					});
					_checkLi.addClass('checked-li');
					_checkbox.get(0).checked = true;
					//隐藏
				}else{
					_th.attr('th-visible','none');
					$.each(_tdList, function(i, v2){
						$(v2).hide();
					});
					_checkLi.removeClass('checked-li')
					_checkbox.get(0).checked = false;
				}
				typeof(cb) == 'function' ? cb() : '';
			});
		}
		/*
		 @绑定表头提醒功能
		 $.table: table [jquery object]
		 */
		,bindRemindEvent: function(table){
			var _this = this;
			var raArea,
				tableDiv,
				theLeft;
			var remindAction = $('.remind-action', table);
			remindAction.unbind('mouseenter');
			remindAction.bind('mouseenter', function(){
				raArea = $(this).find('.ra-area');
				tableDiv = $(this).closest('.table-div');
				raArea.show();
				theLeft = (tableDiv.get(0).offsetWidth - ($(this).offset().left - tableDiv.offset().left)) > raArea.get(0).offsetWidth;
				raArea.css({
					left: theLeft ? '0px' : 'auto',
					right: theLeft ? 'auto' : '0px'
				})
			});
			remindAction.unbind('mouseleave');
			remindAction.bind('mouseleave', function(){
				raArea = $(this).find('.ra-area');
				raArea.hide();
			});

		}
		/*
		 @绑定排序事件
		 $.table: table [jquery object]
		 */
		,bindSortingEvent: function(table){
			var _this = this;
			var _thList = $('th[sorting]', table),	//所有包含排序的列
				_action,		//向上或向下事件源
				_th,			//事件源所在的th
				_table,			//事件源所在的table
				_tName,			//table grid-manager
				_thName;		//th对应的名称

			//绑定排序事件
			$('.sorting-action', _thList).unbind('mouseup');
			$('.sorting-action', _thList).bind('mouseup', function(){
				_action = $(this);
				_th 	= _action.closest('th');
				_table 	= _th.closest('table');
				_tName  = _table.attr('grid-manager');
				_thName = _th.attr('th-name');
				if(!_thName || $.trim(_thName) == ''){
					_this.outLog('排序必要的参数丢失', 'error');
					return false;
				}
				//根据组合排序配置项判定：是否清除原排序及排序样式
				if(!_this.isCombSorting){
					$.each($('.sorting-action', _table), function(i, v){
						if(v != _action.get(0)){   //_action.get(0) 当前事件源的DOM
							$(v).removeClass('sorting-up sorting-down');
							$(v).closest('th').attr('sorting', '');
						}
					});
				}
				//排序操作：升序
				if(_action.hasClass('sorting-down')){
					_action.addClass('sorting-up');
					_action.removeClass('sorting-down');
					_th.attr('sorting', _this.sortUpText);
				}
				//排序操作：降序
				else {
					_action.addClass('sorting-down');
					_action.removeClass('sorting-up');
					_th.attr('sorting', _this.sortDownText);
				}
				//生成排序数据
				if(!_this.isCombSorting){
					_this.sortData = {};
					_this.sortData[_th.attr('th-name')] = _th.attr('sorting');
				}else{
					$.each($('th[th-name][sorting]', _table), function(i, v){
						if(v.getAttribute('sorting') != ''){
							_this.sortData[v.getAttribute('th-name')] = v.getAttribute('sorting');
						}
					});
				}
				//调用事件、渲染tbody
				var query = $.extend({}, _this.query, _this.sortData, _this.pageData);
				_this.sortingBefore(query);
				_this.__refreshGrid(function(){
					_this.sortingAfter(query,  _th);
				});

			});

		}
		/*
		 @绑定拖拽换位事件
		 $.table: table [jquery object]
		 */
		,bindDragEvent: function(table){
			var _this = this;
			var thList = $('thead th', table),	//匹配页面下所有的TH
				dragAction	= thList.find('.drag-action');
			//指定拖拽换位事件源,配置拖拽样式
			var _th,			//事件源th
				_prevTh,		//事件源的上一个th
				_nextTh,		//事件源的下一个th
				_prevTd,		//事件源对应的上一组td
				_nextTd,		//事件源对应的下一组td
				_tr,			//事件源所在的tr
				_allTh,			//事件源同层级下的所有th
				_table,			//事件源所在的table
				_tableDiv,		//事件源所在的DIV
				_td,			//与事件源同列的所在td
				_divPosition,	//所在DIV使用定位方式
				_dreamlandDIV;	//临时展示被移动的列
			var SIV_td;			//用于处理时实刷新造成的列表错乱
			dragAction.unbind('mousedown');
			dragAction.bind('mousedown',function(){
				_th 			= $(this).closest('th'),					//事件源所在的th
					_prevTh			= undefined,							//事件源的上一个th
					_nextTh			= undefined,							//事件源的下一个th
					_prevTd			= undefined,							//事件源对应的上一组td
					_nextTd			= undefined,							//事件源对应的下一组td
					_tr 			= _th.parent(),							//事件源所在的tr
					_allTh 			= _tr.find('th'), 						//事件源同层级下的所有th
					_table 			= _tr.parents('table').eq(0),			//事件源所在的table
					_tableDiv 		= _table.parents('.table-div').eq(0),	//事件源所在的DIV
					_td 			= _table.find('tbody')
									.find('tr')
									.find('td:eq('+_th.index()+')'); 		//与事件源同列的所有td

				//禁用文字选中效果
				$('body').addClass('no-select-text');

				//父级DIV使用相对定位
				_divPosition = _tableDiv.css('position');
				if(_divPosition != 'relative' && _divPosition != 'absolute'){
					_tableDiv.css('position','relative');
				}
				//处理时实刷新造成的列表错乱
				if(_this.isRealTime){
					_th.addClass('drag-ongoing');
					_td.addClass('drag-ongoing');
					window.clearInterval(SIV_td);
					SIV_td = window.setInterval(function(){
						_td = _table.find('tbody tr').find('td:eq('+_th.index()+')'); 	//与事件源同列的所有td
						_td.addClass('drag-ongoing');
					},100);
				}else{
					_th.addClass('drag-ongoing opacityChange');
					_td.addClass('drag-ongoing opacityChange');
				}
				//增加临时展示DOM
				_dreamlandDIV = $('<div class="dreamland-div"></div>');
				_tableDiv.parent().append(_dreamlandDIV);
				var tmpHtml = '<table class="dreamland-table '+ _table.attr('class') +'">'
					+ '<thead>'
					+ '<tr>'
					+ '<th style="height:'+_th.get(0).offsetHeight+'px">'
					+ _th.find('.drag-action').get(0).outerHTML
					+ '</th>'
					+ '</tr>'
					+ '</thead>'
					+ '<tbody>';
				//tbody内容：将原tr与td上的属性一并带上，解决一部分样式问题
				var _cloneTr,_cloneTd;
				$.each(_td, function(i, v){
					_cloneTd = v.cloneNode(true);
					_cloneTd.style.height = v.offsetHeight + 'px';
					_cloneTr = $(v).closest('tr').clone();
					tmpHtml += _cloneTr.html(_cloneTd.outerHTML).get(0).outerHTML;
				});
				tmpHtml += '</tbody>'
					+ '</table>';
				_dreamlandDIV.html(tmpHtml);
				//绑定拖拽滑动事件
				$('body').unbind('mousemove');
				$('body').bind('mousemove', function(e2){
					_prevTh = undefined;
					//当前移动的非第一列
					if(_th.index() != 0){
						_prevTh = _allTh.eq(_th.index() - 1);
					}
					_nextTh = undefined;
					//当前移动的非最后一列
					if(_th.index() != _allTh.length -1){
						_nextTh = _allTh.eq(_th.index() + 1);
					}
					//插件自动创建的项,不允许移动
					if(_prevTh && _prevTh.attr('gm-create') === 'true'){
						_prevTh = undefined;
					}
					else if(_nextTh && _nextTh.attr('gm-create') === 'true'){
						_nextTh = undefined;
					}
					_dreamlandDIV.show();
					_dreamlandDIV.css({
						width	: _th.get(0).offsetWidth,
						height	: _table.get(0).offsetHeight,
						left	: e2.clientX - _tableDiv.offset().left
								//  + $('html').get(0).scrollLeft
								+ _tableDiv.get(0).scrollLeft + (document.body.scrollLeft || document.documentElement.scrollLeft)
								- _th.get(0).offsetWidth / 2,
						top		: e2.clientY - _tableDiv.offset().top
								+ _tableDiv.get(0).scrollTop + (document.body.scrollTop || document.documentElement.scrollTop)
								- _dreamlandDIV.find('th').get(0).offsetHeight / 2
					});
					//处理向左拖拽
					if(_prevTh && _prevTh.length != 0
						&& _dreamlandDIV.get(0).offsetLeft < _prevTh.get(0).offsetLeft){
						_prevTd = _table.find('tbody').find('tr').find('td:eq('+_prevTh.index()+')');
						_prevTh.before(_th);
						$.each(_td,function(i, v){
							_prevTd.eq(i).before(v);
						});
						_allTh = _tr.find('th'); //重置TH对象数据
					}
					//处理向右拖拽
					if(_nextTh && _nextTh.length != 0
						&& _dreamlandDIV.get(0).offsetLeft > _nextTh.get(0).offsetLeft - _dreamlandDIV.get(0).offsetWidth / 2){
						_nextTd = _table.find('tbody').find('tr').find('td:eq('+_nextTh.index()+')');
						_nextTh.after(_th);
						$.each(_td,function(i, v){
							_nextTd.eq(i).after(v);
						})
						_allTh = _tr.find('th'); //重置TH对象数据
					}
				});
				//绑定拖拽停止事件
				$('body').unbind('mouseup');
				$('body').bind('mouseup',function(){
					$('body').unbind('mousemove');
					//清除临时展示被移动的列
					_dreamlandDIV = $('.dreamland-div');
					if(_dreamlandDIV.length != 0){

						_dreamlandDIV.animate({
							top	: _table.get(0).offsetTop,
							left: _th.get(0).offsetLeft - _tableDiv.get(0).scrollLeft
						},_this.animateTime,function(){
							_tableDiv.css('position',_divPosition);
							_th.removeClass('drag-ongoing');
							_td.removeClass('drag-ongoing');
							_dreamlandDIV.remove();
						});
					}
					//缓存列表位置信息
					_this.setToLocalStorage(_table);

					//重置调整宽度事件源
					_this.resetAdjust(_table);
					//开启文字选中效果
					$('body').removeClass('no-select-text');
					if(_this.isRealTime){
						window.clearInterval(SIV_td);
					}
				});
			});
		}
		/*
		 @绑定宽度调整事件
		 $.table: table [jquery object]
		 */
		,bindAdjustEvent: function(table){
			var _this = this;
			var thList 	= $('thead th', table);	//页面下所有的TH
			//监听鼠标调整列宽度
			thList.off('mousedown', '.adjust-action');
			thList.on('mousedown', '.adjust-action', function(event){
				var _dragAction 	= $(this);
				var _th 			= _dragAction.parents('th').eq(0),		//事件源所在的th
					_tr 			= _th.parent(),								//事件源所在的tr
					_table 			= _tr.parents('table').eq(0),			//事件源所在的table
					_tableDiv 		= _table.parents('.table-div').eq(0),	//事件源所在的DIV
					_tableWarp		= _tableDiv.parents('.table-warp'),			//table外围DIV
					_thWarp			= $('.th-warp', _th),						//th下所有内容的外围容器
					_dragAction		= $('.drag-action', _thWarp),				//th文本在渲染后所在的容器
					_allTh 			= _tr.find('th[th-visible!=none]'),		//事件源同层级下的所有th
					_nextTh			= _allTh.eq(_th.index() + 1),				//事件源下一个可视th
					_last 			= _allTh.eq(_allTh.length - 1), 			//事件源同层级倒数第一个th
					_lastButOne 	= _allTh.eq(_allTh.length - 2), 			//事件源同层级倒数第二个th
					_td 			= _table.find('tbody')
						.find('tr')
						.find('td:eq('+_th.index()+')'); 		//与事件源同列的所在td
				//	adjustActionToTr= $('.adjust-action',_tr);				//事件源所在的TR下的全部调整宽度节点
				//重置width 防止auto现象
				$.each(_allTh, function(i, v){
					if(v.style.width == 'auto' || v.style.width == ''){
						//	$(v).css('width',$(v).width());
						$(v).width($(v).width());
					}
				});
				//增加宽度调整中样式
				_th.addClass('adjust-selected');
				_td.addClass('adjust-selected');
				//绑定鼠标拖动事件
				var _X = event.clientX, //记录鼠标落下的横向坐标
					_w,
					_w2;
				var _realWidthForThText = _this.getTextWidth(_th);
				_table.unbind('mousemove');
				_table.bind('mousemove',function(e){
					_w = e.clientX -
						_th.offset().left -
						_th.css('padding-left').split('px')[0] -
						_th.css('padding-right').split('px')[0];
					//限定最小值
					if(_w < _realWidthForThText){
						_w = _realWidthForThText;
					}
					//触发源为倒数第二列时 缩小倒数第一列
					if(_th.index() == _lastButOne.index()){
						_w2 = _th.width() - _w + _last.width();
						_last.width(Math.ceil(_w2 < _realWidthForThText ? _realWidthForThText : _w2));
					}
					_th.width(Math.ceil(_w));
					//_isSame:table的宽度与table-div宽度是否相同
					//Chrome下 宽度会精确至小数点后三位 且 使用width时会进行四舍五入，需要对其进行特殊处理 宽度允许相差1px
					var _isSame  = _this.isChrome() ?
						(_table.get(0).offsetWidth == _tableDiv.width() || _table.get(0).offsetWidth == _tableDiv.width() + 1 || _table.get(0).offsetWidth == _tableDiv.width() - 1)
						: _table.get(0).offsetWidth == _tableDiv.width();
					//table宽度与table-div宽度相同 且 当前处理缩小HT宽度操作时
					if(_isSame && _th.width() > _w){
						_nextTh.width(Math.ceil(_nextTh.width() + _th.width() - _w))
					}
					//重置镜像滚动条的宽度
					if(_this.supportSetTop){
						$(_this.scrollDOM).trigger('scroll');
					}
				});

				//绑定鼠标放开、移出事件
				_table.unbind('mouseup mouseleave');
				_table.bind('mouseup mouseleave',function(){
					_table.unbind('mousemove mouseleave');
					_th.removeClass('adjust-selected');
					_td.removeClass('adjust-selected');
					//重置镜像滚动条的宽度
					if(_this.supportSetTop){
						$(_this.scrollDOM).trigger('scroll');
					}
					//缓存列表宽度信息
					_this.setToLocalStorage(_table);
				});
				return false;
			});

		}
		/*
		 @获取TH宽度
		 $.element: th
		 */
		,getTextWidth: function(element){
			var _this = this;
			var th 				= $(element),   				//th
				thWarp 			= $('.th-warp', th),  			//th下的GridManager包裹容器
				thText	 		= $('.th-text', th),			//文本所在容器
				remindAction	= $('.remind-action', thWarp),	//提醒所在容器
				sortingAction	= $('.sorting-action', thWarp);	//排序所在容器
			//文本镜象 用于处理实时获取文本长度
			var textDreamland	= $('.text-dreamland', th.parents('.table-warp'));

			//将th文本嵌入文本镜象 用于获取文本实时宽度
			textDreamland.text(thText.text());
			textDreamland.css({
				fontSize 	: thText.css('font-size'),
				fontWeight	: thText.css('font-weight'),
				fontFamily	: thText.css('font-family')
			});
			var thPaddingLeft = thWarp.css('padding-left').split('px')[0] || 0,
				thPaddingRight = thWarp.css('padding-right').split('px')[0] || 0;
			var thWidth = textDreamland.width()
				+ (Number(thPaddingLeft) ? Number(thPaddingLeft) : 0)
				+ (Number(thPaddingRight) ? Number(thPaddingRight) : 0)
				+ (remindAction.length == 1 ? 20 : 5)
				+ (sortingAction.length == 1 ? 20 : 5);
			return thWidth;
		}
		/*
		 @绑定表头吸顶功能
		 $.table: table [jquery object]
		 */
		,bindSetTopFunction: function(table){
			var _this = this;
			//绑定窗口变化事件
			$(window).resize(function() {
				$(_this.scrollDOM).trigger('scroll', [true]);
			});
			//绑定模拟X轴滚动条
			$('.scroll-area').unbind('scroll');
			$('.scroll-area').bind('scroll', function(){
				$(this).parents('.table-div').scrollLeft(this.scrollLeft);
				this.style.left = this.scrollLeft + 'px';
			});
			//_this.scrollDOM != window 时 清除_this.scrollDOM 的padding值
			if(_this.scrollDOM != window){
				$(_this.scrollDOM).css('padding','0px');
			}

			//绑定滚动条事件
			//$._isWindowResize_:是否为window.resize事件调用
			$(_this.scrollDOM).unbind('scroll');
			$(_this.scrollDOM).bind('scroll', function(e, _isWindowResize_){
				var _scrollDOM = $(this),
					_theadBackground,		//列表头的底色
					_tableDIV,				//列表所在的DIV,该DIV的class标识为table-div
					_tableWarp,				//列表所在的外围容器
					_setTopHead,			//吸顶元素
					_tableOffsetTop,		//列表与_tableDIV之间的间隙，如marin-top,padding-top
					_table,					//原生table
					_thead,					//列表head
					_thList,				//列表下的th
					_tbody;					//列表body
				var _scrollDOMTop = _scrollDOM.scrollTop(),
					_tDIVTop = 0;
				var _tWarpMB	= undefined; //吸顶触发后,table所在外围容器的margin-bottom值

				_tableDIV 		= table.parents('.table-div').eq(0);
				_tableWarp 		= _tableDIV.parents('.table-warp').eq(0);
				_table			= table.get(0);
				_thead 			= $('> thead[class!="set-top"]', table);
				_tbody 			= $('tbody', table);

				if(!_tableDIV || _tableDIV.length == 0){
					return true;
				}
				_tDIVTop 		= _this.scrollDOM == window ? _tableDIV.offset().top : 0;

				_tableOffsetTop = _table.offsetTop;
				_setTopHead 	= $('.set-top', table);
				//当前列表数据为空
				if($('tr', _tbody).length == 0){
					return true;
				}
				//配置X轴滚动条
				var scrollArea = $('.scroll-area', _tableWarp);
				if(_tableDIV.width() < table.width()){  //首先验证宽度是否超出了父级DIV
					if(_this.scrollDOM == window){
						_tWarpMB = Number(_tableDIV.height())
							+ Number(_tableWarp.css('margin-bottom').split('px')[0])
							//		 - Number(_tableWarp.css('padding-bottom').split('px')[0])
							//	 - window.scrollY
							//	 #151010 该属性不是通用属性 虽然在高版本的火狐或谷歌中可以实现，考虑后还是使用scrollTop
							//   IE 支持  document.documentElement.scrollTop
							//   firebox 支持 document.documentElement.scrollTop  window.scrollY
							//	 Chrome 支持 document.body.scrollTop window.scrollY
							- (document.body.scrollTop || document.documentElement.scrollTop || window.scrollY)
							- (window.innerHeight - _tableDIV.offset().top);
					}else{
						_tWarpMB = Number(_tableDIV.height())
							+ Number(_tableWarp.css('margin-bottom').split('px')[0])
							- _scrollDOM.scrollTop()
							- _scrollDOM.height();
					}

					if(_tWarpMB < 0){
						_tWarpMB = 0;
					}
					$('.sa-inner', scrollArea).css({
						width : table.width()
					});
					scrollArea.css({
						bottom	: _tWarpMB - 18,
						left	: _tableDIV.scrollLeft()
					});
					scrollArea.scrollLeft(_tableDIV.scrollLeft());
					scrollArea.show();
				}else{
					scrollArea.hide();
				}

				//表头完全可见 分两种情况 scrollDOM 为 window 或自定义容器
				if(_this.scrollDOM == window ? (_tDIVTop - _scrollDOMTop >= -_tableOffsetTop) : (_scrollDOMTop == 0)){
					if(_thead.hasClass('scrolling')){
						_thead.removeClass('scrolling');
					}
					_setTopHead.remove();
					return true;
				}
				//表完全不可见
				if(_this.scrollDOM == window ? (_tDIVTop - _scrollDOMTop < 0 &&
					Math.abs(_tDIVTop - _scrollDOMTop) + _thead.height() - _tableOffsetTop > _tableDIV.height()) : false){
					_setTopHead.show();
					_setTopHead.css({
						top		: 'auto',
						bottom	: '0px'
					});
					return true;
				}
				//配置表头镜像
				//当前表未插入吸顶区域 或 事件触发事件为window.resize

				//配置吸顶区的宽度
				if(_setTopHead.length == 0 || _isWindowResize_){
					_setTopHead.length == 0 ? table.append(_thead.clone(false).addClass('set-top')) : '';
					_setTopHead = $('.set-top', table);
					_setTopHead.css({
						width : _thead.width()
						+ Number(_thead.css('border-left-width').split('px')[0] || 0)
						+ Number(_thead.css('border-right-width').split('px')[0] || 0)
						,left: table.css('border-left-width')
					});
					//$(v).width(_thList.get(i).offsetWidth)  获取值只能精确到整数
					//$(v).width(_thList.eq(i).width()) 取不到宽
					//调整吸顶表头下每一个th的宽度[存在性能问题，后期需优化]
					_thList = $('th', _thead);
					$.each($('th', _setTopHead), function(i, v){
						$(v).css({
							width : _thList.eq(i).width()
							+ Number(_thList.eq(i).css('border-left-width').split('px')[0] || 0)
							+ Number(_thList.eq(i).css('border-right-width').split('px')[0] || 0)
						});
					});
				}
				//当前吸引thead 没有背景时 添加默认背景
				if(!_setTopHead.css('background') ||
					_setTopHead.css('background') == '' ||
					_setTopHead.css('background') == 'none'){
					_setTopHead.css('background', '#f5f5f5');
				}

				//表部分可见
				if( _this.scrollDOM == window ? (_tDIVTop - _scrollDOMTop < 0 &&
					Math.abs(_tDIVTop - _scrollDOMTop) <= _tableDIV.height() +_tableOffsetTop) : true){
					if(!_thead.hasClass('scrolling')){
						_thead.addClass('scrolling');
					}
					_setTopHead.css({
						top		: _scrollDOMTop  - _tDIVTop + _this.topValue,
						bottom	: 'auto'
					});
					_setTopHead.show();
					return true;
				}
				return true;
			});
			$(_this.scrollDOM).trigger('scroll');
		}
		/*
		 @绑定右键菜单事件
		 $.table:table
		 */
		,bindRightMenuEvent: function(table){
			var _this = this;
			var tableWarp = $(table).closest('.table-warp'),
				tbody = $('tbody', tableWarp);
			//刷新当前表格
			var menuHTML = '<div class="grid-menu" grid-master="'+ _this.gridManagerName +'">';
			//分页类操作
			if(_this.supportAjaxPage){
				menuHTML+= '<span grid-action="refresh-page" refresh-type="previous">'
					+ _this.i18nText("previous-page")
					+ '<i class="iconfont icon-sanjiao2"></i></span>'
					+ '<span grid-action="refresh-page" refresh-type="next">'
					+ _this.i18nText("next-page")
					+ '<i class="iconfont icon-sanjiao1"></i></span>';
			}
			menuHTML    += '<span grid-action="refresh-page" refresh-type="refresh">'
				+ _this.i18nText("refresh")
				+ '<i class="iconfont icon-31shuaxin"></i></span>';
			//导出类
			if(_this.supportExport){
				menuHTML+='<span class="grid-line"></span>'
					+ '<span grid-action="export-excel" only-checked="false">'
					+ _this.i18nText("save-as-excel")
					+ '<i class="iconfont icon-baocun"></i></span>'
					+ '<span grid-action="export-excel" only-checked="true">'
					+ _this.i18nText("save-as-excel-for-checked")
					+ '<i class="iconfont icon-saveas24"></i></span>';
			}
			//配置类
			if(_this.supportConfig){
				menuHTML+= '<span class="grid-line"></span>'
					+ '<span grid-action="setting-grid">'
					+ _this.i18nText("setting-grid")
					+ '<i class="iconfont icon-shezhi"></i></span>';
			}
			menuHTML+= '</div>';
			var _body = $('body');
			_body.append(menuHTML);
			//绑定打开右键菜单栏
			var menuDOM = $('.grid-menu[grid-master="'+ _this.gridManagerName +'"]');
			tableWarp.unbind('contextmenu');
			tableWarp.bind('contextmenu', function(e){
				e.preventDefault();
				e.stopPropagation();
				//验证：如果不是tbdoy或者是tbody的子元素，直接跳出
				if(e.target.nodeName !== 'TBODY' && $(e.target).closest('tbody').length === 0){
					return;
				}
				//验证：当前是否存在已选中的项
				var exportExcelOfChecked = $('[grid-action="export-excel"][only-checked="true"]');
				if($('tbody tr[checked="checked"]', 'table[grid-manager="'+ _this.gridManagerName +'"]').length === 0){
					exportExcelOfChecked.addClass('disabled');
				}else{
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
				$('.grid-menu[grid-master]').hide();
				menuDOM.show();
				_body.off('mousedown.gridMenu');
				_body.on('mousedown.gridMenu', function(e){
					var eventSource = $(e.target);
					if(eventSource.hasClass('.grid-menu') || eventSource.closest('.grid-menu').length === 1){
						return;
					}
					_body.off('mousedown.gridMenu');
					menuDOM.hide();
				});
			});

			//绑定事件：上一页、下一页、重新加载
			var refreshPage = $('[grid-action="refresh-page"]');
			refreshPage.unbind('click');
			refreshPage.bind('click', function(e){
				if(isDisabled(this, e)){
					return false;
				}
				var _gridMenu = $(this).closest('.grid-menu'),
					_table = $('table[grid-manager="'+_gridMenu.attr('grid-master')+'"]');
				_this = _this.__getGridManager(_table);
				var refreshType = this.getAttribute('refresh-type');
				//上一页
				if(refreshType === 'previous' && _this.pageData.cPage > 1){
					_this.pageData.cPage = _this.pageData.cPage - 1;
				}
				//下一页
				else if(refreshType === 'next' && _this.pageData.cPage < _this.pageData.tPage){
					_this.pageData.cPage = _this.pageData.cPage + 1;
				}
				//重新加载
				else if(refreshType === 'refresh'){
				}
				var query = $.extend({}, _this.query, _this.sortData, _this.pageData);
				_this.pagingBefore(query);
				_this.__refreshGrid(function() {
					_this.pagingAfter(query);
				});
				_body.off('mousedown.gridMenu');
				_gridMenu.hide();
			});
			//绑定事件：另存为EXCEL、已选中表格另存为Excel
			var exportExcel = $('[grid-action="export-excel"]');
			exportExcel.unbind('click');
			exportExcel.bind('click', function(e){
				if(isDisabled(this, e)){
					return false;
				}
				var _gridMenu = $(this).closest('.grid-menu'),
					_table = $('table[grid-manager="'+_gridMenu.attr('grid-master')+'"]');
				var onlyChecked = false;
				if(this.getAttribute('only-checked') === 'true'){
					onlyChecked = true;
				}
				_this.exportGridToXls(_table, undefined, onlyChecked);
				_body.off('mousedown.gridMenu');
				_gridMenu.hide();
			});
			//绑定事件：配置表
			var settingGrid = $('[grid-action="setting-grid"]');
			settingGrid.unbind('click');
			settingGrid.bind('click', function(e){
				if(isDisabled(this, e)){
					return false;
				}
				var _gridMenu = $(this).closest('.grid-menu'),
					_table = $('table[grid-manager="'+_gridMenu.attr('grid-master')+'"]');
				var configArea = $('.config-area', _table.closest('.table-warp'));
				$('.config-action', configArea).trigger('click');
				_body.off('mousedown.gridMenu');
				_gridMenu.hide();
			});
			//验证当前是否禁用
			function isDisabled(dom, events){
				if($(dom).hasClass('disabled')){
					events.stopPropagation();
					events.preventDefault();
					return true;
				}else{
					return false;
				}
			}
		}
		/*
		 [对外公开方法]
		 @导出表格 .xls
		 $.table:当前操作的grid,由插件自动传入
		 $.fileName: 导出后的文件名
		 $.onlyChecked: 是否只导出已选中的表格
		 */
		,exportGridToXls: function(table, fileName, onlyChecked){
			var _this = this;
			var gmExportAction = $('#gm-export-action'); //createDOM内添加
			if(!_this.supportExport || gmExportAction.length === 0){
				_this.outLog('导出失败，请查看配置项:supportExport是否配置正确', 'error');
				return;
			}

			var uri = 'data:application/vnd.ms-excel;base64,',
				exportHTML = '',	//要导出html格式数据
				theadHTML= '',	//存储导出的thead数据
				tbodyHTML ='', //存储导出的tbody下的数据
				tableDOM = $(table);	//当前要导出的table
			var thDOM = $('thead[class!="set-top"] th[th-visible="visible"][gm-create!="true"]', tableDOM),
				trDOM,
				tdDOM;
			//验证：是否只导出已选中的表格
			if(_this.supportCheckbox && onlyChecked){
				trDOM = $('tbody tr[checked="checked"]', tableDOM);
			}else{
				trDOM = $('tbody tr', tableDOM);
			}
			$.each(thDOM, function(i, v){
				theadHTML += '<th>'
					+ v.getElementsByClassName('th-text')[0].textContent
					+ '</th>';
			});
			$.each(trDOM, function(i, v){
				tdDOM = $('td[gm-create!="true"]', v);
				tbodyHTML += '<tr>';
				$.each(tdDOM, function(i2, v2){
					tbodyHTML += v2.outerHTML
				});
				tbodyHTML += '</tr>';
			});
			exportHTML  = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">'
				+ '<head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"></head>'
				+ '<body><table>'
				+ '<thead>'
				+ theadHTML
				+ '</thead>'
				+ '<tbody>'
				+ tbodyHTML
				+ '</tbody>'
				+ '</table></body>'
				+ '</html>';
			gmExportAction.prop('href', uri + base64(exportHTML));
			gmExportAction.prop('download', (fileName || tableDOM.attr('grid-manager')) +'.xls');
			gmExportAction.get(0).click();

			function base64(s) {
				return window.btoa(unescape(encodeURIComponent(s)))
			}
		}
		/*
		 @重置宽度调整事件源DOM
		 用于禁用最后一列调整宽度事件
		 $.table:table
		 */
		,resetAdjust: function(table){
			var _this = this;
			//当前不支持宽度调整，直接跳出
			if(!_this.supportAdjust){
				return false;
			}
			var _table = $(table),
				_thList = $('thead [th-visible="visible"]', _table),
				_adjustAction = $('.adjust-action', _thList);
			if(!_adjustAction || _adjustAction.length == 0){
				return false;
			}
			_adjustAction.show();
			_adjustAction.eq(_adjustAction.length - 1).hide();
		}
		/*
		 @保存至本地缓存
		 $.table:table [jquery object]
		 $.isInit: 是否为初始存储缓存[用于处理宽度在特定情况下发生异常]
		 */
		,setToLocalStorage: function(table, isInit){
			var _this = this;
			//当前为禁用缓存模式，直接跳出
			if(_this.disableCache){
				return;
			}
			var _table = $(table);
			//当前表是否禁用缓存  被禁用原因是用户缺失了必要的参数
			var noCache = _table.attr('no-cache');
			if(noCache && noCache== 'true'){
				_this.outLog('缓存已被禁用：当前表缺失必要html标签属性[grid-manager或th-name]', 'info');
				return false;
			}
			if(!window.localStorage){
				_this.outLog('当前浏览器不支持：localStorage，缓存功能失效。', 'error');
				return false;
			}
			if(!_table || _table.length == 0){
				_this.outLog('setToLocalStorage:无效的table', 'error');
				return false;
			}
			var _gridKey = _table.attr('grid-manager');
			//验证当前表是否为GridManager
			if(!_gridKey || $.trim(_gridKey) == ''){
				_this.outLog('setToLocalStorage:无效的grid-manager', 'error');
				return false;
			}
			var _cache 		= {},
				_cacheString= '',
				_pageCache 	= {},
				_thCache	= new Array(),
				_thData 	= {};
			var thList = $('thead[class!="set-top"] th', _table);
			if(!thList || thList.length == 0){
				_this.outLog('setToLocalStorage:无效的thList,请检查是否正确配置table,thead,th', 'error');
				return false;
			}

			//key 由pathcname + hash + 唯一标识grid-manager + 表列数 [用于规避同页面下存在grid-manager相同的表格]
			var _key = window.location.pathname +  window.location.hash + '-' +  _gridKey;
			var $v;
			$.each(thList, function(i, v){
				$v = $(v);
				_thData = {};
				_thData.th_name = v.getAttribute('th-name');
				if(_this.supportDrag){
					_thData.th_index = $v.index();
				}
				if(_this.supportAdjust){
					//用于处理宽度在特定情况下发生异常
					isInit ? $v.css('width', $v.css('width')) : '';
					_thData.th_width = v.offsetWidth;
				}
				if(_this.supportConfig){
					_thData.isShow = $('.config-area li[th-name="'+ _thData.th_name +'"]', _table.parents('.table-warp')
						.eq(0)).find('input[type="checkbox"]').get(0).checked;
				}
				_thCache.push(_thData);
			});
			_cache.th = _thCache;
			//存储分页
			if(_this.supportAjaxPage){
				_pageCache.pSize = $('select[name="pSizeArea"]', _table.closest('.table-warp')).val();
				_cache.page = _pageCache;
			}
			_cacheString = JSON.stringify(_cache);
			window.localStorage.setItem(_key,_cacheString);
			return _cacheString;
		}
		/*
		 [对外公开方法]
		 @获取指定表格的本地存储数据
		 $.table:table
		 成功则返回本地存储数据,失败则返回空对象
		 */
		,getLocalStorage: function(table){
			var _this = this;
			var _table = $(table);
			var _key = _this.getLocalStorageKey(_table);
			if(!_key){
				return {};
			}
			var _data = {},
				_array = new Array(),
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
		 [对外公开方法]
		 @清除指定表的表格记忆数据
		 $.table:table
		 返回成功或者失败的布尔值
		 * */
		,clear: function(table){
			var _this = this;
			var _table = $(table);
			var _key = _this.getLocalStorageKey(_table);
			if(!_key){
				return false;
			}
			window.localStorage.removeItem(_key);
			return true;
		}
		/*
		 * 获取指定表格本地存储所使用的key
		 * $table: table jquery
		 * */
		,getLocalStorageKey: function($table){
			var _this = this;
			//当前表是否禁用缓存  被禁用原因是用户缺失了必要的参数
			var noCache = $table.attr('no-cache');
			if(noCache && noCache== 'true'){
				_this.outLog('缓存已被禁用：当前表缺失必要html标签属性[grid-manager或th-name]', 'info');
				return false;
			}
			if(!window.localStorage){
				_this.outLog('当前浏览器不支持：localStorage，缓存功能失效', 'info');
				return false;
			}
			if(!$table || $table.length == 0){
				_this.outLog('getLocalStorage:无效的table', 'error');
				return false;
			}
			var _gridKey = $table.attr('grid-manager');
			//验证当前表是否为GridManager
			if(!_gridKey || $.trim(_gridKey) == ''){
				_this.outLog('getLocalStorage:无效的grid-manager', 'error');
				return false;
			}
			var thList = $('thead[class!="set-top"] th', $table);
			return window.location.pathname +  window.location.hash + '-'+ _gridKey;
		}
		/*
		 @根据本地缓存配置分页
		 $.table: table[jquery object]
		 配置当前页显示数
		 */
		,configPageForCache: function(table){
			var _this = this;
			var _data = _this.getLocalStorage(table),		//本地缓存的数据
				_cache = _data.cache,		//缓存对应
				_pSize,			 //每页显示条数
				_query;			 //init 后的callback中的query参数
			//验证是否存在每页显示条数缓存数据
			if(!_cache || !_cache.page || !_cache.page.pSize){
				_pSize = _this.pageSize || 10.
			}
			else{
				_pSize = _cache.page.pSize;
			}
			_this.pageData = {
				pSize : _pSize,
				cPage : 1
			};
		}
		/*
		 @存储原Th DOM至table data
		 $.table: table [jquery object]
		 */
		,setOriginalThDOM: function(table){
			table.data('originalThDOM', $('thead th', table));
		}
		/*
		 @获取原Th DOM至table data
		 $.table: table [jquery object]
		 */
		,getOriginalThDOM: function(table){
			return $(table).data('originalThDOM');
		}
		/*
		 @根据本地缓存thead配置列表
		 $.table: table [jquery object]
		 获取本地缓存
		 存储原位置顺序
		 根据本地缓存进行配置
		 */
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
				_this.outLog('configTheadForCache:当前table没有缓存数据', 'info');
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
					if(_this.supportAdjust){
						_th.css('width',_thJson.th_width);
					}
					//配置列排序数据
					if(_this.supportDrag && typeof(_thJson.th_index) !== 'undefined'){
						_domArray[_thJson.th_index] = _th;
					}else{
						_domArray[i2] = _th;
					}
					//配置列的可见
					if(_this.supportConfig){
						_this.setAreVisible(_th, typeof(_thJson.isShow) == 'undefined' ? true : _thJson.isShow, true);
					}
				});
				//配置列的顺序
				if(_this.supportDrag){
					table.find('thead tr').html(_domArray);
				}
				//重置调整宽度事件源
				_this.resetAdjust(table);
			}
		}
		/*
		 [对外公开方法]
		 @重置列表[tbody]
		 这个方法对外可以直接调用
		 作用：处理局部刷新、分页事件之后的tb排序
		 $.table: table [jquery object]
		 $.isSingleRow: 指定DOM节点是否为tr[布尔值]
		 */
		,resetTd: function(dom, isSingleRow){
			var _this = this;
			if(isSingleRow){
				var _tr = $(dom),
					_table= _tr.parents('table').eq(0);
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
			if(_this.supportAdjust){
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
						//	console.log(_thList.eq($(v2).index()).index())
						//		console.log(_thList.index(_thList.eq($(v2).index())))
						//		console.log('-------------------')
						//baukh20160703:#注：这块被简化了，可能存在问题，需要验证
						_tdArray[_thList.eq(i2).index()] = v2;
					});
					_tmpHtml[i].html(_tdArray);
				});
			}
			//依据配置对列表进行隐藏、显示
			if(_this.supportConfig){
				_this.setAreVisible($('[th-visible="none"]'), false ,true);
			}
			//重置吸顶事件
			if(_this.supportSetTop){
				var _tableDIV 	= _table.parents('.table-div').eq(0);
				var _tableWarp 	= _tableDIV.parents('.table-warp').eq(0);
				_tableDIV.css({
					height:'auto'
				});
				_tableWarp.css({
					marginBottom: 0
				});
			}
		}
		/*
		 @依据版本清除列表缓存
		 $.table: table [jquery object]
		 依据版本号判断 如果版本不符 则对缓存进行清理
		 */
		,cleanTableCacheForVersion: function(table){
			var _this = this;
			var locationVersion = window.localStorage.getItem('GridManagerVersion');
			//版本相符 直接跳出
			if(locationVersion && locationVersion == _this.version){
				return;
			}
			_this.cleanTableCache(table, '插件版本已更新');
		}
		/*
		 @清除列表缓存
		 $.table: table [jquery object]
		 $.cleanText: 清除缓存的原因
		 */
		,cleanTableCache: function(table, cleanText){
			var _this = this;
			$.each(table, function(i, v){
				window.localStorage.removeItem(v.getAttribute('grid-manager'));
				window.localStorage.removeItem(v.getAttribute('grid-manager') + '-' + $('th', v).length);
				_this.outLog(v.getAttribute('grid-manager') + '清除缓存成功,原因：'+ cleanText, 'info');
			});
			window.localStorage.setItem('GridManagerVersion', _this.version);
		}
		/*
		 @初始化分页
		 $.table:table
		 */
		,initAjaxPage: function(table){
			var _this = this;
			var table 		= $(table),
				tName		= table.attr('grid-manager'),
				tableWarp 	= table.closest('.table-warp'),
				pageToolbar = $('.page-toolbar', tableWarp);	//分页工具条
			/*
			 //生成分页存储器
			 _this.query.pageData = {
			 tPage: undefined,		//总页数
			 cPage: undefined,		//当前页
			 pSize: undefined,		//每页显示条数
			 tSize: undefined		//总条数
			 };
			 */
			var	sizeData = $.isArray(_this.sizeData) ? _this.sizeData : _this.sizeData[tName];
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
		,createPageDOM:function(_tableDOM_, _pageData_){
			var _this = this;
			var table 		= $(_tableDOM_),
				tableWarp 	= table.parents('.table-warp').eq(0),
				pageToolbar = $('.page-toolbar', tableWarp),	//分页工具条
				pagination	= $('.pagination', pageToolbar);		//分页区域
			var cPage = Number(_pageData_.cPage || 0),		//当前页
				tPage = Number(_pageData_.tPage || 0),		//总页数
				tHtml = '',					//临时存储分页HTML片段
				lHtml = '';					//临时存储末尾页码THML片段
			//配置首页
			var firstClassName = 'first-page',
				previousClassName = 'previous-page';
			if(cPage == 1){
				firstClassName += ' disabled';
				previousClassName += ' disabled';
			}
			tHtml += '<li cPage="1" class="'+ firstClassName +'">'
				+  '<a href="javascript:void(0);">'+ _this.i18nText("first-page") +'</a>'
				+  '</li>'
				+  '<li cPage="'+(cPage-1)+'" class="'+ previousClassName +'">'
				+  '<a href="javascript:void(0);">'+ _this.i18nText("previous-page") +'</a>'
				+  '</li>';
			var i 	 = 1,		//循环开始数
				maxI = tPage;	//循环结束数
			//配置first端省略符
			if(cPage > 4){
				tHtml += '<li cPage="1">'
					+  '<a href="javascript:void(0);">1</a>'
					+  '</li>'
					+  '<li class="disabled">'
					+	 '<a href="javascript:void(0);">...</a>'
					+  '</li>';
				i = cPage - 2;
			}
			//配置last端省略符
			if((tPage - cPage) > 4){
				maxI = cPage + 2;
				lHtml += '<li class="disabled">'
					+	 '<a href="javascript:void(0);">...</a>'
					+  '</li>'
					+  '<li cPage="'+tPage+'">'
					+  '<a href="javascript:void(0);">'+ tPage +'</a>'
					+  '</li>';
			}
			// 配置页码
			for(i; i<= maxI;i++){
				if(i == cPage){
					tHtml += '<li class="active">'
						+  '<a href="javascript:void(0);">'+ cPage +'</a>'
						+  '</li>';
					continue;
				}
				tHtml += '<li cPage="'+i+'">'
					+  '<a href="javascript:void(0);">'+ i +'</a>'
					+  '</li>';
			}
			tHtml += lHtml;
			//配置下一页与尾页
			var nextClassName = 'next-page',
				lastClassName = 'last-page';
			if(cPage >= tPage){
				nextClassName += ' disabled';
				lastClassName += ' disabled';
			}
			tHtml += '<li cPage="'+(cPage+1)+'" class="'+ nextClassName +'">'
				+  '<a href="javascript:void(0);">'+ _this.i18nText("next-page") +'</a>'
				+  '</li>'
				+  '<li cPage="'+tPage+'" class="'+ lastClassName +'">'
				+  '<a href="javascript:void(0);">'+ _this.i18nText("last-page") +'</a>'
				+  '</li>';
			pagination.html(tHtml);
		}
		/*
		 @生成每页显示条数选择框据
		 $._tableDOM_: table的juqery实例化对象
		 $._sizeData_: 选择框自定义条数
		 */
		,createPageSizeDOM: function(_tableDOM_, _sizeData_){
			var _this = this;
			var table		= $(_tableDOM_),
				tableWarp	= table.closest('.table-warp'),
				pageToolbar = $('.page-toolbar', tableWarp),				//分页工具条
				pSizeArea	= $('select[name="pSizeArea"]', pageToolbar);	//分页区域
			//error
			if(!_sizeData_ || !$.isArray(_sizeData_)){
				_this.outLog('渲染失败：参数[sizeData]配置错误' , 'error');
				return;
			}

			var _ajaxPageHtml = '';
			$.each(_sizeData_, function(i, v){
				_ajaxPageHtml += '<option value="'+ v +'">' + v + '</option>';
			});
			pSizeArea.html(_ajaxPageHtml);
		}
		/*
		 @绑定页面跳转事件
		 $._tableDOM_: table的juqery实例化对象
		 */
		,bindPageJumpEvent:function(_tableDOM_){
			var _this = this;
			var table		= $(_tableDOM_),
				tableWarp	= table.closest('.table-warp'),
				pageToolbar = $('.page-toolbar', tableWarp),		//分页工具条
				pagination	= $('.pagination', pageToolbar),		//分页区域
				gp_input	= $('.gp-input', pageToolbar),			//快捷跳转
				refreshAction	= $('.refresh-action', pageToolbar);//快捷跳转
			//绑定分页点击事件
			pageToolbar.off('click', 'li');
			pageToolbar.on('click', 'li', function(){
				var _page 		= $(this),
					_tableWarp 	= _page.closest('.table-warp');
				var cPage = _page.attr('cPage');	//分页页码
				if(!cPage || !Number(cPage) || _page.hasClass('disabled')){
					_this.outLog('指定页码无法跳转,已停止。原因:1、可能是当前页已处于选中状态; 2、所指向的页不存在', 'info');
					return false;
				}
				cPage = parseInt(cPage);
				gotoPage(_tableWarp, cPage);
			});
			//绑定快捷跳转事件
			gp_input.unbind('keyup');
			gp_input.bind('keyup', function(e){
				if(e.which !== 13){
					return;
				}
				var _tableWarp = $(this).closest('.table-warp'),
					_inputValue = parseInt(this.value, 10);
				if(!_inputValue){
					this.focus();
					return;
				}
				gotoPage(_tableWarp, _inputValue);
				this.value = '';
			});
			//绑定刷新界面事件
			refreshAction.unbind('click');
			refreshAction.bind('click', function() {
				var _action = $(this);
				var _tableWarp = $(this).closest('.table-warp'),
					_input = $('.page-toolbar .gp-input', _tableWarp),
					_value = _input.val();
				//跳转输入框为空时: 刷新当前菜
				if(_value.trim() === ''){
					_this.__refreshGrid();
					return;
				}
				//跳转输入框不为空时: 验证输入值是否有效,如果有效跳转至指定页,如果无效对输入框进行聚焦
				var _inputValue = parseInt(_input.val(), 10);
				if(!_inputValue){
					_input.focus();
					return;
				}
				gotoPage(_tableWarp, _inputValue);
				_input.val('');
			});
			//跳转至指定页
			function gotoPage(_tableWarp, _cPage){
				var _table		= $('table[grid-manager]', _tableWarp),
					_size 		= $('select[name="pSizeArea"]', _tableWarp);
				//跳转的指定页大于总页数
				if(_cPage > _this.pageData.tPage){
					_cPage = _this.pageData.tPage;
				}
				//替换被更改的值
				_this.pageData.cPage = _cPage;
				_this.pageData.pSize = _this.pageData.pSize || _this.pageSize;

				//调用事件、渲染DOM
				var query = $.extend({}, _this.query, _this.sortData, _this.pageData);
				_this.pagingBefore(query);
				_this.__refreshGrid(function() {
					_this.pagingAfter(query);
				});
			}
		}
		/*
		 @绑定设置当前页显示数事件
		 $._tableDOM_: table的juqery实例化对象
		 */
		,bindSetPageSizeEvent:function(_tableDOM_){
			var _this = this;
			var table 		=  $(_tableDOM_),
				tableWarp 	= table.parents('.table-warp').eq(0),
				pageToolbar = $('.page-toolbar', tableWarp),	//分页工具条
				sizeArea	= $('select[name=pSizeArea]', pageToolbar);	//切换条数区域
			if(!sizeArea || sizeArea.length == 0){
				_this.outLog('未找到单页显示数切换区域，停止该事件绑定', 'info');
				return false;
			}
			sizeArea.unbind('change');
			sizeArea.change(function(){
				var _size = $(this);
				var _tableWarp  = _size.parents('.table-warp').eq(0),
					_table		= $('table[grid-manager]', _tableWarp),
					_tName 		= $('table', _tableWarp).attr('grid-manager'); //当前与分页同容器下的列表名称
				_this.pageData = {
					cPage : 1,
					pSize : _size.val()
				}

				_this.setToLocalStorage(_table);
				//调用事件、渲染tbody
				var query = $.extend({}, _this.query, _this.sortData, _this.pageData);
				_this.pagingBefore(query);
				_this.__refreshGrid(function(){
					_this.pagingAfter(query);
				});

			});
		}
		/*
		 @重置当前页显示条数据
		 $.table: table的juqery实例化对象
		 $._pageData_:分页数据格式
		 */
		,resetPSize: function(table, _pageData_){
			var _this = this;
			var table 		=  $(table),
				tableWarp 	= table.parents('.table-warp').eq(0),
				toolBar   = $('.page-toolbar', tableWarp),
				pSizeArea = $('select[name="pSizeArea"]', toolBar),
				pSizeInfo = $('.dataTables_info', toolBar);
			if(!pSizeArea || pSizeArea.length == 0){
				_this.outLog('未找到条数切换区域，停止该事件绑定', 'info');
				return false;
			}
			var fromNum = _pageData_.cPage == 1 ? 1 : (_pageData_.cPage-1) * _pageData_.pSize + 1,	//从多少开始
				toNum	= _pageData_.cPage * _pageData_.pSize,	//到多少结束
				totalNum= _pageData_.tSize;			//总共条数
			var tmpHtml = _this.i18nText('dataTablesInfo', [fromNum, toNum, totalNum]);
			//根据返回值修正单页条数显示值
			pSizeArea.val(_pageData_.pSize || 10);
			//修改单页条数文字信息
			pSizeInfo.html(tmpHtml);
			pSizeArea.show();
		}
		/*
		 [对外公开方法] @baukh20160629:不再对外公开，传参格式也变化
		 @重置分页数据
		 $.table: table
		 $.totals: 总条数
		 */
		,resetPageData: function(table, totals){
			var _this = this;
			if(isNaN(parseInt(totals, 10))){
				return;
			}
			var _pageData = getPageData(totals);
			//生成分页DOM节点
			_this.createPageDOM(table, _pageData);
			//重置当前页显示条数
			_this.resetPSize(table, _pageData);

			var table 		= $(table),
				tableWarp 	= table.parents('.table-warp').eq(0),
				pageToolbar = $('.page-toolbar', tableWarp);	//分页工具条
			$.extend(_this.pageData, _pageData); //存储pageData信息
			pageToolbar.show();

			//计算分页数据
			function getPageData(tSize){
				var _pSize = _this.pageData.pSize || _this.pageSize,
					_tSize = tSize,
					_cPage = _this.pageData.cPage;
				return {
					tPage: Math.ceil(_tSize / _pSize),		//总页数
					cPage: _cPage,							//当前页
					pSize: _pSize,							//每页显示条数
					tSize: _tSize							//总条路
				}
			}
		}

		/*
		 * @获取与当前配置国际化匹配的文本
		 *  $.key: 指向的文本索引
		 *  v1,v2,v3:可为空，也存在一至3项，只存在一项时可为数组
		 * */
		,i18nText: function(key, v1, v2, v3){
			var _this = this;
			var intrusion = [];
			//处理参数，实现多态化
			if(arguments.length == 2 && typeof(arguments[1]) == 'object'){
				intrusion = arguments[1];
			}
			else if(arguments.length > 1){
				for(var i=1; i< arguments.length; i++){
					intrusion.push(arguments[i]);
				}
			}
			var _lg = '';
			try{
				_lg = _this.textConfig[key][_this.i18n] || '';
				if(!intrusion || intrusion.length == 0){
					return _lg;
				}
				_lg = _lg.replace(/{\d+}/g, function(word){
					return intrusion[word.match(/\d+/)];
				});
				return _lg;
			}catch (e){
				_this.outLog('未找到与'+ key +'相匹配的'+ _this.i18n +'语言', 'warn');
				return '';
			}
		}
		/*
		 * 	@插件存在文本配置
		 * */
		,textConfig: {
			'order-text': {
				'zh-cn':'序号',
				'en-us':'order'
			}
			,'first-page': {
				'zh-cn':'首页',
				'en-us':'first'
			}
			,'previous-page': {
				'zh-cn':'上一页',
				'en-us':'previous'
			}
			,'next-page': {
				'zh-cn':'下一页',
				'en-us':'next '
			}
			,'last-page': {
				'zh-cn':'尾页',
				'en-us':'last '
			}
			,'dataTablesInfo':{
				'zh-cn':'此页显示 {0}-{1} 共{2}条',
				'en-us':'this page show {0}-{1} count {2}'
			}
			,'goto-first-text':{
				'zh-cn':'跳转至',
				'en-us':'goto '
			}
			,'goto-last-text':{
				'zh-cn':'页',
				'en-us':'page '
			}
			,'refresh':{
				'zh-cn':'重新加载',
				'en-us':'Refresh '
			}
			,'save-as-excel':{
				'zh-cn':'另存为Excel',
				'en-us':'Save as Excel '
			}
			,'save-as-excel-for-checked':{
				'zh-cn':'已选中项另存为Excel',
				'en-us':'Save as Excel of Checked'
			}
			,'setting-grid':{
				'zh-cn':'配置表',
				'en-us':'Setting Grid'
			}
			,'checkall-text':{
				'zh-cn':'全选',
				'en-us':'All'
			}

		}
		/*
		 [对外公开方法]
		 @配置query 该参数会在分页触发后返回至pagingAfter(query)方法
		 $.table: table [jquery object]
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
	}
	/*
	 @提供多态化调用方式
	 $._name_: GridManager下的方法名
	 $._settings_: 方法所对应的参数，可为空
	 $._callback_: 方法所对应的回调,可为空
	 */
	$.fn.GM = $.fn.GridManager = function(_name_, _settings_, _callback_){
		if(this.length == 0){
			throw new Error('GridManager Error:JQuery对象为空，请确定选择器匹配是否正确');
			return false;
		}
		var _jqTable = this.eq(0);  //与jquery相同，配置时只配置第一个匹配的元素
		// 特殊情况处理：单组tr进行操作，如resetTd()方法
		if(_jqTable.get(0).nodeName === 'TR'){
			_jqTable = _jqTable.closest('table[grid-manager]');
		}
		var name,
			settings,
			callback;
		//处理参数
		//ex: $(table).GridManager()
		if(arguments.length === 0){
			name	 = 'init';
			settings = {};
			callback = undefined;
		}
		//ex: $(table).GridManager('init')
		else if(arguments.length === 1 && typeof(arguments[0]) === 'string' && typeof(arguments[0]) === 'init'){
			name	 = arguments[0];
			settings = {};
			callback = undefined;
		}
		//ex: $(table).GridManager('get')
		else if(arguments.length === 1 && typeof(arguments[0]) === 'string' && typeof(arguments[0]) !== 'init'){
			name	 = arguments[0];
			settings = undefined;
			callback = undefined;
		}
		//ex: $(table).GridManager({settings})
		else if(arguments.length === 1 && $.isPlainObject(arguments[0])){
			name	 = 'init';
			settings = arguments[0];
			callback = undefined;
		}
		//ex: $(table).GridManager(callback)
		else if(arguments.length === 1 && typeof(arguments[0]) === 'function'){
			name	 = 'init';
			settings = undefined;
			callback = arguments[0];
		}
		//ex: $(table).GridManager('init', callback)
		else if(arguments.length === 2 && typeof(arguments[0]) === 'string' && typeof(arguments[1]) === 'function'){
			name	 = arguments[0];
			settings = arguments[1];
			callback = undefined;
		}
		//ex: $(table).GridManager('init', {settings})
		//ex: $(table).GridManager('resetTd', false)
		//ex: $(table).GridManager('exportGridToXls', 'fileName')
		else if(arguments.length === 2 && typeof(arguments[0]) === 'string' && typeof(arguments[1]) !== 'function'){
			name	 = arguments[0];
			settings = arguments[1];
			callback = undefined;
		}
		//ex: $(table).GridManager({settings}, callback)
		else if(arguments.length === 2 && $.isPlainObject(arguments[0]) && typeof(arguments[1]) === 'function'){
			name	 = 'init';
			settings = arguments[0];
			callback = arguments[1];
		}
		//ex: $(table).GridManager('resetTd', false)
		else if(arguments.length === 2 && typeof(arguments[0]) === 'string' && typeof(arguments[1]) === 'boolean'){
			name	 = arguments[0];
			settings = arguments[1];
			callback = undefined;
		}
		//ex: $(table).GridManager('init', {settings}, callback)
		else if(arguments.length === 3){
			name	 = arguments[0];
			settings = arguments[1];
			callback = arguments[2];
		}

		//验证当前调用的方法是否为对外公开方法
		var exposedMethodList = [
			'init',					//初始化 1
			'setSort',				//手动设置排序 1
			'get',					//通过JQuery实例获取GridManager  1
			'getCheckedTr',			//获取当前选中的列 1
			'showTh',				//显示Th及对应的TD项 1
			'hideTh',				//隐藏Th及对应的TD项 1
			'exportGridToXls',		//导出表格 .xls 1
			'getLocalStorage',		//获取指定表格的本地存储数据 1
			'resetTd',				//重置列表[tbody]  1
			'setQuery',				//配置query 该参数会在分页触发后返回至pagingAfter(query)方法 1
			'refreshGrid',			//刷新表格 使用现有参数重新获取数据，对表格数据区域进行渲染 1
			'getRowData',			//获取当前行渲染时使用的数据 1
			'clear'					//清除指定表的表格记忆数据 1
		];
		if(exposedMethodList.indexOf(name) === -1){
			throw new Error('GridManager Error:方法调用错误，请确定方法名['+ name +']是否正确');
			return false;
		}
		var gmObj;
		//当前为初始化方法
		if(name == 'init') {
			var options = $.extend({}, $.fn.GridManager.defaults, settings);
			gmObj = new GridManager(options);
			gmObj.init(_jqTable, callback);
			return _jqTable;
		}
		//当前为其它方法
		else if(name != 'init'){
			gmObj = _jqTable.data('gridManager');
			var gmData = gmObj[name](_jqTable, settings, callback);
			//如果方法存在返回值则返回，如果没有返回jquery object用于链式操作
			return typeof(gmData) === 'undefined' ? _jqTable : gmData;
		}
	}
})();