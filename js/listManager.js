/*	
	http://www.lovejavascript.com/#!plugIn/listManager/index.html
	@baukh:listManager 列表管理插件	
	当前版本：v1.8.5
	
	开发完成的任务：
	移除分页，排序的_listManager变量
	处理文本配置无法单个配置的BUG【已修复】
	resetPageData不再对外公开
	移除方法:pageCallback，使用事件pagingBefore与pagingAfter替代
	移除方法:sortingCallback，使用事件sortingBefore与sortingAfter替代
	增加ajaxUrl参数，用于自动获取数据，无需再在分页及排序时手动处理
	
	
	开发中的任务：
	增加全选、反选功能
	增加删除列功能 提供删除操作回调函数
	增加字段可编辑功能
	支持快捷键 选择列
	当前页的搜索 匹配高亮
	弹出框状态下的吸顶，需要将分页信息一直展现
	排序增加前端当前页排序方式,增加配置当前页排序还是总数据排序标识
	所有html中的标识均可通过js进行配置
	提供现有功能的事件函数 如 宽度被调整后的事件
	文档增加常见问题及解决方案	
	可通过配置参进行表格渲染，无需在HTML中存在DOM节点
	序列宽度优化
	不再支持多表同时渲染
	移除icon-fong
	增加鼠标右键功能菜单(行与列同时高亮)[1、删除本行；2、隐藏本列；3、下一页；4、上一页；5、配置列；6、表数据另存为]
	移除Log方法，改用原始的console.log();
*/
;(function(){
	'use strict';	
	function listManager( settings ){
		typeof(settings) == 'undefined' ? settings = {} : '';		
		this.version			= '1.8.5';					//版本号
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
	//	this.sortingCallback	= {};						//排序触发后的回调函数集合，该函数一般需指向搜索事件[不建议使用，用sortingAfter替代]
		this.sortingBefore		= $.noop;					//排序事件发生前
		this.sortingAfter		= $.noop;					//排序事件发生后
		
		//分页 ajaxPag
		this.supportAjaxPage	= false;					//是否支持配置列表ajxa分页
		this.sizeData 			= [10,20,30,50,100]; 		//用于配置列表每页展示条数选择框
		this.pageSize			= 20;						//每页显示条数，如果使用缓存且存在缓存数据，那么该值将失效
		this.pageData 			= {};						//存储分页数据[不对外公开参数]
		this.query 				= {};						//其它需要带入的参数，该参数中设置的数据会在分页或排序事件中以参数形式传递
	//	this.pageCallback 		= {};						//分页触发后的回调函数集合，该函数一般需指向搜索事件[不建议使用，用pagingAfter替代]
		this.pagingBefore		= $.noop;					//分页事件发生前
		this.pagingAfter		= $.noop;					//分页事件发生后
		this.pageCssFile 		= '';						//分页样式文件路径[用户自定义分页样式]

	    //序号
		this.supportAutoOrder	= true;						//是否支持自动序号
		this.orderThName		= 'order';					//序号列所使用的th-name
		//国际化
		this.i18n	 			= 'zh-cn';					//选择使用哪种语言，暂时支持[zh-cn:简体中文，en-us:美式英语] 默认zh-cn

		//用于支持通过数据渲染DOM
		this.listManagerName   	= '';						//表格list-manager所对应的值
//		this.thList    			= {};						//表格通过数据渲染所需数据
		this.ajaxUrl			= '';						//获取表格数据地址，配置该参数后，将会动态获取数据
		//用于支持全局属性配置  于v1.8 中将listManagerConfig弱化且不再建议使用。
		
		var textConfig = {};
		if( typeof( listManagerConfig ) == 'object' ){
			$.extend(textConfig, this.textConfig, listManagerConfig.textConfig)
			$.extend( this,listManagerConfig );
		}
		$.extend(textConfig, this.textConfig, settings.textConfig)
		$.extend( this, settings, {textConfig: textConfig});
	}
	listManager.prototype = {
		/*
			@当前浏览器是否为谷歌[内部参数]
		*/
		isChrome : function(){
			return navigator.userAgent.indexOf('Chrome') == -1 ? false : true;
		} 
		/*
			@配置随机参数
		*/
		,getRandom: function(){
			return this.version + Math.random();
		}
		/*
			[对外公开方法]	
			@初始化方法
			$.callback:回调
			$.jQueryObj: jquery选择器对象[内部参数]
		*/
		,init: function( jQueryObj, callback ){
			var _this = this;
			//通过版本较验 清理缓存
			_this.cleanTableCacheForVersion( jQueryObj );

			_this.listManagerName = jQueryObj.attr('list-manager');	//存储listManagerName值	

			var tmpListDOM = jQueryObj || $( 'table[list-manager]' );  //临时存储需要实例化的jquery对象
			//防止重复实例化
			var listDOM = [];
			var $v;
			$.each( tmpListDOM ,function( i, v ){
				$v = $(v);
			//	$(v).hasClass('listManager-ready') ? v.style.visibility = 'hidden' : listDOM.push(v);
				$v.hasClass('listManager-ready') || $v.hasClass('listManager-loading')? '' : listDOM.push(v);
			});
			if( !listDOM || listDOM.length == 0 ){
				_this.outLog( '获取初始化列表失败,可能原因:1、标识错误;2、该表格已经渲染' );
				return false;
			}
			listDOM = $(listDOM);
			//根据本地缓存配置每页显示条数
			if( _this.supportAjaxPage){
				_this.configPageForCache(listDOM);
			}
			var query = $.extend(true, {}, _this.query, _this.pageData);
			//增加渲染中标注
			listDOM.addClass('listManager-loading');
			//加载所需资源
			_this.loadListManagerFile(function(){
				_this.initTable( listDOM );
				window.setTimeout(function(){
					//如果初始获取缓存失败，则在mousedown时，首先存储一次数据
					var cacheErrorTable = $('[list-manager-cache]');
					if(cacheErrorTable && cacheErrorTable.length > 0 ){
						$.each(cacheErrorTable, function(i, v){
							_this.setToLocalStorage( v, true );
							$(v).removeAttr( 'list-manager-cache' );
						});
					}
				},1000);
				
				//重置tbody存在数据的列表
				$.each(listDOM, function(i, v){
				//	alert(v.getAttribute('list-manager')+'=='+$('tbody tr', v).length);
					$('tbody tr', v).length > 0 ? _this.resetTd( v, false ) : '';
				});
				//启用回调
				typeof( callback ) == 'function' ? callback(query) :'';	
			});
			return _this.getListManager(jQueryObj);
		}
		/*
			@存储对外实例至JQuery
			$.element:当前被实例化的table[数组]
		*/
		,setListManagerToJQuery: function( element ){
			var _this = this;
			var _data = {},
				_resetData = {},
				_t,			//单个table
				_tName;		//table list-manager
			
			//处理对象中的组数据  提取与当前dom对应的数据
			$.each( element , function( i, v ){
				_t = $(v);
				_tName = v.getAttribute('list-manager');
				//复制this 用于规避对 当前this的污染
				_data = $.extend(true,{}, _this);   
				_resetData = {		
					listManager		: _tName,		
					//列表存储数据
					sizeData		:  $.isArray(_this.sizeData) ? _this.sizeData : _this.sizeData[_tName],
					pageData		: _this.pageData[_tName] ? _this.pageData[_tName] : _this.pageData,
					query			: _this.query[_tName] ? _this.query[_tName] : _this.query
					/*,
					sortingCallback	: typeof(_this.sortingCallback) == 'function' ? _this.sortingCallback : _this.sortingCallback[_tName],
					pageCallback	: typeof(_this.pageCallback) == 'function' ? _this.pageCallback : _this.pageCallback[_tName]					
					*/

				}
				$.extend( true, _data, _resetData );
				_t.data( 'listManager', _data );
			});
		}
		/*
			[对外公开方法]
			@手动设置排序 
			$.element: table  [单个table或jquery实例]
			$._sortJson_: 需要排序的json串 
			$.callback:回调函数		
			ex: _sortJson_
			_sortJson_ = {
				th-name:up/down 	//其中up/down 需要与参数 sortUpText、sortDownText值相同
			}
		*/
		,setSort: function( element, _sortJson_, callback ){
			var table = $( element );
			if( table.length == 0 || !_sortJson_ || $.isEmptyObject(_sortJson_) ){
				return false;
			}
			var _th,
				_sortAction,
				_sortType;
			var listManager = table.data('listManager');
			for( var s in _sortJson_ ){
				_th = $('[th-name="'+ s +'"]', table);
				_sortType = _sortJson_[s];
				_sortAction = $( '.sorting-action', _th );
				if( _sortType == listManager.sortUpText ){
					_th.attr( 'sorting', listManager.sortUpText );			
					_sortAction.removeClass( 'sorting-' + listManager.sortDownText );	
					_sortAction.addClass( 'sorting-' + listManager.sortUpText );	
				}
				else if( _sortType == listManager.sortDownText ){
					_th.attr( 'sorting', listManager.sortDownText );
					_sortAction.removeClass( 'sorting-' + listManager.sortUpText );	
					_sortAction.addClass( 'sorting-' + listManager.sortDownText );			
				}
			}
			typeof(callback) == 'function' ? callback() : '';
		}
		/*
			[对外公开方法]
			@通过JQuery实例获取listManager
			$.element:当前将要获取数据的table[数组]
		*/
		,getListManager: function( element ){
			var listManagerArray = [],
				listManager;
			var table = $(element);
			$.each(table, function(i, v){
				listManager = $(v).data( 'listManager');
				listManagerArray.push(listManager);
			});
			if( listManagerArray.length == 1){
				return listManagerArray[0];
			}else{
				return listManagerArray;
			}
		}
		/*
			@加载所需文件
		*/
		,loadListManagerFile: function(callback){
			var _this = this;
			var loadIConfont = false,
				loadListCss  = false,
				loadPageCss  = false;
			//加载列表样式文件
			if( $( 'link#listManager-css' ).length == 0 && _this.autoLoadCss){
				var listManagerCss  = document.createElement( 'link' );
				listManagerCss.id   = 'listManager-css';
				listManagerCss.rel  = 'stylesheet';
				listManagerCss.type = 'text/css';
				listManagerCss.href = _this.basePath + 'css/listManager.css';
				document.head.appendChild( listManagerCss );
				listManagerCss.addEventListener( 'load', function( event ) {
					_this.outLog( 'listManager-css load OK' );
					loadListCss = true;
					gotoCallback();
				});
				listManagerCss.addEventListener( 'error', function(){
					_this.outLog( 'listManager-css load error' );
					loadListCss = false;
				});	
			}else{
				loadListCss = true;
			}
			//加载用户自定义分页样式文件
			if( _this.supportAjaxPage &&
				$( 'link#listManager-ajaxPage-css' ).length == 0 && 			
				_this.pageCssFile && _this.pageCssFile != ''){
				var ajaxPageCss  = document.createElement( 'link' );
				ajaxPageCss.id   = 'listManager-ajaxPage-css';
				ajaxPageCss.rel  = 'stylesheet';
				ajaxPageCss.type = 'text/css';
				ajaxPageCss.href = _this.pageCssFile;
				document.head.appendChild( ajaxPageCss );
				ajaxPageCss.addEventListener( 'load', function( event ) {
					_this.outLog( 'listManager-ajaxPage-css load OK' );
					loadPageCss = true;
					gotoCallback();
				});
				ajaxPageCss.addEventListener( 'error', function(){
					_this.outLog( 'listManager-ajaxPage-css load error' );
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
			};
		}
		/*
			@初始化列表
		*/
		,initTable: function( listDOM ){
			var _this = this;
			//嵌入序号DOM
			if(_this.supportAutoOrder){
				_this.initOrderDOM( listDOM );
			}
			//存储原始th DOM
			_this.setOriginalThDOM(listDOM);
			
			//渲染HTML，嵌入所需的事件源DOM
			_this.embeddedDom( listDOM );
			
			//绑定监听DOM节点变化事件[保留方法，暂时不使用]
		//	_this.bindDomInseredEvent( listDOM );
			
			//获取本地缓存并对列表进行配置
			if( !_this.disableCache ){
				_this.configTheadForCache( listDOM );
			}
			//绑定宽度调整事件
			if( _this.supportAdjust ){
				_this.bindAdjustEvent( listDOM );
			}
			//绑定拖拽换位事件
			if( _this.supportDrag ){
				_this.bindDragEvent( listDOM );
			}
			//绑定排序事件
			if( _this.supportSorting ){
				_this.bindSortingEvent( listDOM );
			}
			//绑定表头提示事件
			if( _this.supportRemind ){
				_this.bindRemindEvent( listDOM );
			}
			//绑定配置列表事件
			if( _this.supportConfig ){
				_this.bindConfigEvent( listDOM );
			}
			//绑定表头吸顶功能
			if( _this.supportSetTop ){
				_this.bindSetTopFunction( listDOM );
			}
			//渲梁tbodyDOM
			_this.renderTbody();
			//将listManager实例化对象存放于jquery data
			_this.setListManagerToJQuery( listDOM );
			
		}
		/*
			@渲梁tbodyDOM
			$.callback: 回调函数
		*/
		,renderTbody: function(callback){
			var _this = this;
			if( typeof(_this.ajaxUrl) != 'string' || _this.ajaxUrl === ''){
				typeof callback === 'function' ? callback() : '';
				return;
			}
			var tableDOM = $('[list-manager="'+ _this.listManagerName +'"]'),		//table dom
				tbodyDOM = $('tbody', tableDOM);	//tbody dom
			if(!tbodyDOM || tbodyDOM.length === 0){
				tableDOM.append('<tbody></tbody>');
				tbodyDOM = $('tbody', tableDOM);
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
			
			var tbodyTmpHTML = '';	//用于拼接tbody的HTML结构
			$.get(_this.ajaxUrl, parme, function(data){
				if( !data || !Array.isArray(data.list)){
					console.error('ListManager Error: 请查看配置参数[ajaxUrl]是否配置正确，并查看通过该地址返回的数据格式是否正确。');
					return;
				}
				$.each(data.list, function(i, v){
					tbodyTmpHTML += '<tr>';
					$.each(v, function(i2, v2){
						tbodyTmpHTML += '<td>'+ v2 +'</td>';
					});
					tbodyTmpHTML += '</tr>';
				});
				tbodyDOM.html(tbodyTmpHTML);
				//重置表格结构
				_this.resetTd(tableDOM, false);
				//渲染分页
				if( _this.supportAjaxPage ){
					_this.resetPageData(tableDOM, data.totals);
				}
				typeof callback === 'function' ? callback() : '';
			});
		}
		/*
			@生成序号DOM
			$.element: table数组[jquery对象]
		*/
		,initOrderDOM: function( element ){
			var _this = this;
			
			var orderHtml = '<th th-name="'+ _this.orderThName +'" lm-order="true" width="50px">'+ _this.i18nText('order-text') +'</th>';		
			$('thead tr', element).prepend(orderHtml);		
		}
		/*
			@渲染HTML，根据配置嵌入所需的事件源DOM
			$.element: table数组[jquery对象]
		*/
		,embeddedDom: function( element ){
			var _this = this;
			
			//表头提醒HTML
			var _remindHtml  = '<div class="remind-action">'
							 + '<i class="ra-help iconfont icon-help"></i>'
							 + '<div class="ra-area">'
							 + '<span class="ra-title"></span>'
							 + '<span class="ra-con"></span>'
							 + '</div>'
							 + '</div>';
			//配置列表HTML			 
			var	_configHtml	 = '<div class="config-area"><span class="config-action" title="'+ _this.i18nText("config-action") +'"><i class="iconfont icon-set"></i></span>'
							 + '<ul class="config-list"></ul></div>';
			//宽度调整HTML
			var	_adjustHtml	 = '<span class="adjust-action"></span>';
			//排序HTML
			var	_sortingHtml = '<div class="sorting-action">'
							 + '<i class="sa-icon sa-up iconfont icon-up"></i>'
							 + '<i class="sa-icon sa-down iconfont icon-down"></i>'
							 + '</div>';
			//AJAX分页HTML
			if( _this.supportAjaxPage ){
				var	_ajaxPageHtml= '<div class="page-toolbar">'
								 + '<div class="dataTables_info"></div>'
							 	 + '<div class="change-size"><select name="pSizeArea"></select></div>'
								 + '<div class="goto-page">'+ _this.i18nText("goto-first-text") 
								 + '<input type="text" class="gp-input"/>'+ _this.i18nText("goto-last-text") 
								 + '<span class="gp-action">'+ _this.i18nText('page-go') +'</span></div>'
							  	 + '<div class="ajax-page"><ul class="pagination"></ul></div>'
							  	 + '</div>';	
			}
			var	tableWarp,						//单个table所在的DIV容器
				tName,							//table的listManager属性值
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
				unLmOrder;						//是否为插件自动生成的序号列
			$.each( element,function( i1, v1 ){
				v1 = $( v1 );
				//校验table的必要参数
				_this.checkTable( v1 );
				
				//根据配置使用默认的表格样式
				if( _this.useDefaultStyle ){
					v1.addClass( 'list-manager-default' );
				}
				onlyThead = $('thead', v1);
				onlyThList = onlyThead.find( 'th' );
				v1.wrap( '<div class="table-warp"><div class="table-div"></div><span class="text-dreamland"></span></div>' );
				tableWarp = v1.parents( '.table-warp' ).eq( 0 );
				tableDiv = $( '.table-div', tableWarp );
				//嵌入配置列表DOM
				if( _this.supportConfig ){
					tableWarp.append( _configHtml );					
				}
				tName = v1.attr( 'list-manager' );
				//嵌入Ajax分页DOM
				if( _this.supportAjaxPage){	
					tableWarp.append( _ajaxPageHtml );
					_this.initAjaxPage(v1);
				}
				//表头置顶
				if( _this.supportSetTop ){
					//<thead class="set-top"></thead>表头镜像[.set-top] 在滚动时实时增删
					tableDiv.after( '<div class="scroll-area"><div class="sa-inner"></div></div>' );
				}
				
				$.each( onlyThList, function( i2,v2 ){
					onlyTH = $( v2 );
					onlyTH.attr( 'th-visible','visible' );
					
					//当前非序号列
					if(_this.supportAutoOrder && onlyTH.attr('lm-order') == 'true'){				
						unLmOrder = false;
					}else{			
						unLmOrder = true;		
					}
					
					//嵌入th下外层div
					onlyThWarp = $( '<div class="th-warp"></div>' );
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
					if( _this.supportConfig ){
						$( '.config-list', tableWarp )
						.append( '<li th-name="'+ onlyTH.attr( 'th-name' ) +'" class="checked-li">'
								+ '<input type="checkbox" checked="checked"/>'
								+ '<label>'
								+ '<span class="fake-checkbox"></span>'
								+ onlyTH.text()
								+ '</label>'
								+ '</li>' );
					}
					//嵌入拖拽事件源
					if( _this.supportDrag && unLmOrder){
						onlyThWarp.html( '<span class="th-text drag-action">'+onlyTH.html()+'</span>' );
					}else{
						onlyThWarp.html('<span class="th-text">'+ onlyTH.html() +'</span>');
					}
					var onlyThWarpPaddingTop = onlyThWarp.css('padding-top');
					//嵌入表头提醒事件源
					if( _this.supportRemind && onlyTH.attr( 'remind' ) != undefined && unLmOrder){						
						remindDOM = $( _remindHtml );
						remindDOM.find( '.ra-title' ).text( onlyTH.text() );
						remindDOM.find( '.ra-con' ).text( onlyTH.attr( 'remind' ) || onlyTH.text() );
						if( onlyThWarpPaddingTop != '' && onlyThWarpPaddingTop != '0px'){
							remindDOM.css('top', onlyThWarpPaddingTop);
						}
						onlyThWarp.append( remindDOM );
					}		
					//嵌入排序事件源
					sortType = onlyTH.attr( 'sorting' );
					if( _this.supportSorting &&  sortType!= undefined && unLmOrder){
						sortingDom = $( _sortingHtml );
						//依据 sortType 进行初始显示
						switch( sortType ){
							case _this.sortUpText : sortingDom.addClass('sorting-up');
							break;						
							case _this.sortDownText : sortingDom.addClass('sorting-down');
							break;
						}
						if( onlyThWarpPaddingTop != ''  && onlyThWarpPaddingTop != '0px'){
							sortingDom.css('top', onlyThWarpPaddingTop);
						}
						onlyThWarp.append( sortingDom );
					}
					//嵌入宽度调整事件源
					if( _this.supportAdjust ){								
						adjustDOM = $( _adjustHtml );
						//最后一列不支持调整宽度
						if( i2 == onlyThList.length - 1 ){
							adjustDOM.hide();
						}
						onlyThWarp.append( adjustDOM );
					}
					onlyTH.html( onlyThWarp );
						
					//当前th文本所占宽度大于设置的宽度
					var _realWidthForThText = _this.getTextWidth(onlyTH);
					if(onlyTH.width() < _realWidthForThText){
						onlyTH.width(_realWidthForThText);
					}
				} );		
				//删除渲染中标识、增加渲染完成标识
				v1.removeClass('listManager-loading');
				v1.addClass( 'listManager-ready' );	
			} );
		}
		/*
			@校验table的必要参数[th-name]
			必要参数不完整时将进行自动添加，但被添加的表将关闭缓存功能
			$.element: table
		*/
		,checkTable: function(element){
			var _this = this;
			var table 	= $(element),			//当前表
				thList 	= $('thead th', table); //当前表的所有th
			var noCache = false;				//是否禁用缓存
			//校验[list-manager]
			/*
			if( !table.attr('list-manager') ){
				table.attr('list-manager', 'auto-table-' + _this.getRandom());
				noCache = true;
			}
			*/
			//校验[th-name]
			$.each(thList, function(i, v){
				if( !v.getAttribute('th-name') ){
					noCache ? '' : noCache = true;
					v.setAttribute('th-name', 'auto-th-' + _this.getRandom());
				}
			});
			//判断是否禁用缓存
			if(noCache){
				table.attr('no-cache', 'true');
			}
		}
		/*
			@绑定配置列表事件[隐藏展示列]
			$.element: table数组[jquery对象]		
		*/
		,bindConfigEvent: function( element ){
			var _this = this;
			//打开/关闭设置区域
			var tableWarp = $( element ).parents('div.table-warp');
			var configAction = $( '.config-action', tableWarp );
			configAction.unbind( 'click' );
			configAction.bind( 'click', function(){
				var _configAction = $( this ),		//展示事件源
					_configArea = _configAction.parents('.config-area').eq(0),	//设置区域
					_configList = $( '.config-list',_configArea );//设置列表
				//关闭
				if( _configList.css( 'display' ) == 'block' ){ 
					_configList.animate( {
						width: '0px'
					}, _this.animateTime, function(){
						_configList.hide();
					} );
					return false;
				}
				//打开
				var _tableWarp = _configAction.parents( '.table-warp' ).eq( 0 ),//当前事件源所在的div
					_table	= $( '[list-manager]', _tableWarp ),				//对应的table
					_thList = $( 'thead th', _table ),							//所有的th
					_trList = $( 'tbody tr', _table ),							//tbody下的tr
					_td;														//与单个th对应的td	
				$.each( _thList, function( i, v ){
					v = $( v );
					$.each( _trList, function( i2, v2 ){
						_td = $( 'td', v2 ).eq( v.index() );
						_td.css( 'display', v.css( 'display' ) );
					} );					
				} );
				//验证当前是否只有一列处于显示状态 并根据结果进行设置是否可以取消显示
				var checkedLi = $('.checked-li', _configArea);
				checkedLi.length == 1 ? checkedLi.addClass('no-click') : checkedLi.removeClass('no-click');
				
				_configList.css( 'width','auto' );
				_configList.fadeIn( _this.animateTime );
			} );
			//鼠标离开列表区域事件
			tableWarp.unbind( 'mouseleave' );
			tableWarp.bind( 'mouseleave', function(){
				var _configList = $( '.config-list', this );//设置列表
				_configList.width(0)
				_configList.hide();
			});
			//设置事件
			$( '.config-list li', tableWarp ).unbind( 'click' );
			$( '.config-list li', tableWarp ).bind( 'click', function(){
				var _only = $( this ),		//单个的设置项
					_configArea 	= _only.closest( '.config-area' ),					//事件源所在的区域
					_thName 		= _only.attr( 'th-name' ),							//单个设置项的thName
					_checkbox 		= _only.find( 'input[type="checkbox"]' ),			//事件下的checkbox
					_tableWarp  	= _only.closest( '.table-warp' ), 					//所在的大容器
					_tableDiv	  	= $('.table-div', _tableWarp), 						//所在的table-div
					_table	 		= $( '[list-manager]', _tableWarp ),				//所对应的table					
					_th				= $( 'thead th[th-name="'+_thName +'"]', _table ), 	//所对应的th
					_checkedList;		//当前处于选中状态的展示项
				if( _only.hasClass( 'no-click' ) ){
					return false;
				}
				_only.closest( '.config-list' ).find( '.no-click' ).removeClass( 'no-click' );
				var isVisible = !_checkbox.get( 0 ).checked;
				//设置与当前td同列的td是否可见
				_tableDiv.addClass('config-editing')
				_this.setAreVisible( _th, isVisible, false, function(){	
					_tableDiv.removeClass('config-editing');
				} );
				//最后一项禁止取消
				_checkedList =  $( '.config-area input[type="checkbox"]:checked', _tableWarp );
				if( _checkedList.length == 1 ){
					_checkedList.parent().addClass( 'no-click' );
				}
				
				//处理调整宽度方法中的事件
				if( _this.supportAdjust ){
					_this.resetAdjust( _table );	
				}
				
				//重置镜像滚动条的宽度
				if( _this.supportSetTop ){
					$( '.sa-inner', _tableWarp ).width( '100%' );
				}
				
				//重置宽度为当前显示总列的平均数
				/*
				var _visibleTh = $( 'thead th[th-visible="visible"]', _table ),				//当前所有可视的TH
					_borderSpacing 		= _table.css( 'border-spacing' ),					//table 间隔宽度
					_borderLeftWidth 	= _table.css( 'border-left-width' ),				//table 左边框宽度
					_borderRightWidth 	= _table.css( 'border-right-width' ),				//table 右边框宽度
					_spacingValue 		= _borderSpacing ? _borderSpacing.split( 'px' )[0] : 0,//table 间隔值
								
					//table 边框值
					_widthValue			= Number(_borderLeftWidth ? _borderLeftWidth.split('px')[0] : 0)
										+ Number(_borderRightWidth ? _borderRightWidth.split('px')[0] : 0),
					//th平均宽度
					_averageWidth = ( _tableWarp.width() - _widthValue - _spacingValue *  ( _visibleTh.length + 1 ) ) / _visibleTh.length;
				_visibleTh.css( 'width', _averageWidth );
				*/
				//重置当前可视th的宽度
				var _visibleTh = $( 'thead th[th-visible="visible"]', _table );
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
				_this.setToLocalStorage( _table );	//缓存信息
			} );
		}
		/*
			[对外公开方法]
			@显示Th及对应的TD项
			$.element:th
		*/
		,showTh: function(th){
			var _this = this;
			_this.setAreVisible($(th), true);
		}
		/*
			[对外公开方法]
			@隐藏Th及对应的TD项
			$.element:th
		*/
		,hideTh: function(th){
			var _this = this;
			_this.setAreVisible($(th), false);
		}
		/*
			@设置列是否可见
			$._thList_	： 即将配置的列所对应的th[jquery对像，可以是多个]
			$._visible_	: 是否可见[Boolean]
			$._isInit_	: 是否初始加载[通过缓存进行的初始修改]
			$.cb		: 回调函数
		*/
		,setAreVisible: function( _thList_, _visible_, _isInit_ ,cb ){
			var _this = $( this );
			var _table,			//当前所在的table
				_tableWarp, 	//当前所在的容器
				_th,			//当前操作的th
				_trList, 		//当前tbody下所有的tr
				_tdList = [], 	//所对应的td
				_checkLi,		//所对应的显示隐藏所在的li
				_checkbox;		//所对应的显示隐藏事件
			var fadeTime = _isInit_ ? 0 : _this.animateTime;
			$.each( _thList_, function( i, v ){
				_th = $( v );
				_table = _th.closest( 'table' );
				_tableWarp = _table.closest( '.table-warp' );
				_trList = $( 'tbody tr', _table );
				_checkLi = $( '.config-area li[th-name="'+ _th.attr( 'th-name' ) +'"]', _tableWarp );
				_checkbox = _checkLi.find( 'input[type="checkbox"]' );
				if( _checkbox.length == 0 ){
					return;
				}
				$.each( _trList, function( i, v ){
					_tdList.push( $( v ).find( 'td' ).eq( _th.index() ) );
				} );
				//显示
				if( _visible_ ){
					_th.attr( 'th-visible','visible' );
					$.each( _tdList, function( i2, v2 ){
						_isInit_ ? $( v2 ).show() : $( v2 ).fadeIn( fadeTime );
					} );
					_checkLi.addClass( 'checked-li' );
					_checkbox.get( 0 ).checked = true;
				//隐藏
				}else{
					_th.attr( 'th-visible','none' );
					$.each( _tdList, function( i, v2 ){
						$( v2 ).hide();
					} );
					_checkLi.removeClass( 'checked-li' )
					_checkbox.get( 0 ).checked = false;
				}
				typeof( cb ) == 'function' ? cb() : '';
			} );
		}
		/*
			@绑定表头提醒功能
			$.dom: table数组[jquery对象]
		*/
		,bindRemindEvent: function( dom ){
			var _this = this;
		//	_this.outLog('bindRemindEvent:V1.8版本中移除，使用CSS进行控制')
		//	return false;
			var raArea,
				tableDiv,
				theLeft;
			var remindAction = $('.remind-action');
		//	$( dom ).off( 'mouseenter', '.remind-action' );
		//	$( dom ).on( 'mouseenter', '.remind-action', function(e){
			remindAction.unbind('mouseenter');
			remindAction.bind('mouseenter', function(){
				raArea = $( this ).find( '.ra-area' );
				tableDiv = $(this).closest('.table-div');
				raArea.show();
				theLeft = (tableDiv.get(0).offsetWidth - ($(this).offset().left - tableDiv.offset().left)) > raArea.get(0).offsetWidth;
				raArea.css( {
				//	right: this.offsetLeft < raArea.get( 0 ).offsetWidth ? Number( '-'+raArea.get( 0 ).offsetWidth ) : $( this ).width()
					left: theLeft ? '0px' : 'auto',
					right: theLeft ? 'auto' : '0px'
				} )
			} );
		//	$( dom ).off( 'mouseleave', '.remind-action' );
		//	$( dom ).on( 'mouseleave', '.remind-action', function(){
			remindAction.unbind('mouseleave');
			remindAction.bind('mouseleave', function(){
				raArea = $( this ).find( '.ra-area' );
				raArea.hide();
			} );
			
		}
		/*
			@绑定排序事件
			$.dom: table数组[jquery对象]
		*/
		,bindSortingEvent: function( dom ){
			var _this = this;
			var _thList = dom.find( 'th[sorting]' ),	//所有包含排序的列
				_action,		//向上或向下事件源
				_th,			//事件源所在的th
				_table,			//事件源所在的table
				_tName,			//table list-manager
				_thName;		//th对应的名称
				
			//绑定排序事件
			$( '.sorting-action', _thList ).unbind( 'mouseup' );
			$( '.sorting-action', _thList ).bind( 'mouseup', function(){
				_action = $( this );
				_th 	= _action.closest('th');
				_table 	= _th.closest( 'table' );
				_tName  = _table.attr( 'list-manager' );
				_thName = _th.attr( 'th-name' );
		//		var	_listManager = _table.listManager('getListManager');
				if( !_thName || $.trim( _thName ) == '' ){
					_this.outLog( '排序必要的参数丢失' );
					return false;
				}
				//根据组合排序配置项判定：是否清除原排序及排序样式			
				if( !_this.isCombSorting ){
					$.each( $( '.sorting-action', _table ), function( i, v ){
						if( v != _action.get(0) ){   //_action.get(0) 当前事件源的DOM
							$(v).removeClass( 'sorting-up sorting-down' );
							$(v).closest('th').attr('sorting', '');
						}
					} );
				}
				//排序操作：升序
				if( _action.hasClass( 'sorting-down' ) ){
					_action.addClass( 'sorting-up' );
					_action.removeClass( 'sorting-down' );
					_th.attr('sorting', _this.sortUpText);
				}
				//排序操作：降序
				else {
					_action.addClass( 'sorting-down' );
					_action.removeClass( 'sorting-up' );
					_th.attr('sorting', _this.sortDownText);
				}
				//生成排序数据
				if( !_this.isCombSorting ){
					_this.sortData = {};
					_this.sortData[_th.attr('th-name')] = _th.attr('sorting');
				}else{
					$.each( $( 'th[th-name][sorting]', _table ), function( i, v ){
						if(v.getAttribute('sorting') != ''){ 
							_this.sortData[v.getAttribute('th-name')] = v.getAttribute('sorting');
						}
					});	
				}
//				_table.data( 'listManager' , _listManager );
				//调用事件、渲染tbody
		//		$.extend(_this.query, _listManager.query, _listManager.pageData, _listManager.sortData);
				var query = $.extend({}, _this.query, _this.sortData, _this.pageData);
				_this.sortingBefore(query);
				_this.renderTbody(function(){
					_this.sortingAfter(query,  _th);
				//	_this.sortCallback(_this.query,  _th);  //#建议更换为sortAfter
				});
				
			} );
			
		}
		/*
			@绑定拖拽换位事件
			$.dom: table数组[jquery对象]
		*/
		,bindDragEvent: function( dom ){
			var _this = this;
			var thList = dom.find( 'th' ),	//匹配页面下所有的TH
				dragAction	= thList.find( '.drag-action' );
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
			dragAction.unbind( 'mousedown' );	
			dragAction.bind( 'mousedown',function(){
				_th 			= $( this ).closest( 'th' ),				//事件源所在的th
				_prevTh			= undefined,								//事件源的上一个th
				_nextTh			= undefined,								//事件源的下一个th
				_prevTd			= undefined,								//事件源对应的上一组td
				_nextTd			= undefined,								//事件源对应的下一组td
				_tr 			= _th.parent(),								//事件源所在的tr
				_allTh 			= _tr.find( 'th' ), 						//事件源同层级下的所有th
				_table 			= _tr.parents( 'table' ).eq( 0 ),			//事件源所在的table
				_tableDiv 		= _table.parents( '.table-div' ).eq( 0 ),	//事件源所在的DIV
				_td 			= _table.find( 'tbody' )
								  .find( 'tr' )
								  .find( 'td:eq( '+_th.index()+' )' ); 		//与事件源同列的所有td
					
				//禁用文字选中效果
				$( 'body' ).addClass( 'no-select-text' );
				
				//父级DIV使用相对定位				  
				_divPosition = _tableDiv.css( 'position' );
				if( _divPosition != 'relative' && _divPosition != 'absolute' ){
					_tableDiv.css( 'position','relative' );
				}
				
				//处理时实刷新造成的列表错乱				
				if( _this.isRealTime){
					_th.addClass( 'drag-ongoing' );
					_td.addClass( 'drag-ongoing' );
					window.clearInterval( SIV_td );
					SIV_td = window.setInterval( function(){
						_td = _table.find( 'tbody tr' )
							.find( 'td:eq( '+_th.index()+' )' ); 	//与事件源同列的所有td						
						_td.addClass( 'drag-ongoing' );
					},100 );
				}else{
					_th.addClass( 'drag-ongoing opacityChange' );
					_td.addClass( 'drag-ongoing opacityChange' );
				}
				//增加临时展示DOM
				_dreamlandDIV = $( '<div class="dreamland-div"></div>' );
				_tableDiv.parent().append( _dreamlandDIV );
				var tmpHtml = '<table class="dreamland-table '+ _table.attr( 'class' ) +'">'				
							+ '<thead>'
							+ '<tr>'
						//	+ '<th style="height:'+_th.height()+'px">'
							+ '<th style="height:'+_th.get(0).offsetHeight+'px">'
							+ _th.find( '.drag-action' ).get( 0 ).outerHTML
							+ '</th>'
							+ '</tr>'
							+ '</thead>'
							+ '<tbody>';
				//tbody内容：将原tr与td上的属性一并带上，解决一部分样式问题
				var _cloneTr,_cloneTd;
				$.each( _td, function( i, v){
					_cloneTd = v.cloneNode(true);
					_cloneTd.style.height = v.offsetHeight + 'px';
					_cloneTr = $( v ).closest( 'tr' ).clone();
					tmpHtml += _cloneTr.html( _cloneTd.outerHTML ).get( 0 ).outerHTML;
				} );
				tmpHtml += '</tbody>'
						+ '</table>';
				_dreamlandDIV.html( tmpHtml );
				//绑定拖拽滑动事件
				//@baukh20151106:_tableDiv
				//#151106 根据@Mortal反馈 将原有的拖拽不超出table-div容器更换为body
				$('body').unbind( 'mousemove' );
				$('body').bind( 'mousemove', function( e2 ){
					_prevTh = undefined;
					if( _th.index() != 0 ){ //当前移动的非第一列
						_prevTh = _allTh.eq( _th.index() - 1 );
					}
					_nextTh = undefined;
					if( _th.index() != _allTh.length -1 ){//当前移动的非最后一列
						_nextTh = _allTh.eq( _th.index() + 1 );
					}
					_dreamlandDIV.show();
					_dreamlandDIV.css( {
						width	: _th.get( 0 ).offsetWidth,
						height	: _table.get( 0 ).offsetHeight,
						left	: e2.clientX - _tableDiv.offset().left 
							//	  + _tableDiv.get( 0 ).scrollLeft 
								  + $( 'html' ).get( 0 ).scrollLeft
								  - _th.get( 0 ).offsetWidth / 2,
						top		: e2.clientY - _tableDiv.offset().top  
								  + _tableDiv.get( 0 ).scrollTop + document.body.scrollTop + document.documentElement.scrollTop 
								  - _dreamlandDIV.find( 'th' ).get( 0 ).offsetHeight / 2
					} );
					/*
				//@baukh20151106:
					if( _dreamlandDIV.get( 0 ).offsetTop < 0 ){
						console.log(1111111);
						_dreamlandDIV.css( 'top', 0 );
					}
					*/
					//处理向左拖拽
					if( _prevTh && _prevTh.length != 0 
					   && _dreamlandDIV.get(0).offsetLeft < _prevTh.get(0).offsetLeft){
						_prevTd = _table.find( 'tbody' ).find( 'tr' ).find( 'td:eq( '+_prevTh.index()+' )' );
						_prevTh.before( _th );												  
						$.each( _td,function( i, v ){
							_prevTd.eq( i ).before( v );
						} );
						_allTh = _tr.find( 'th' ); //重置TH对象数据
					}
					//处理向右拖拽
					if( _nextTh && _nextTh.length != 0 
						&& _dreamlandDIV.get(0).offsetLeft > _nextTh.get(0).offsetLeft - _dreamlandDIV.get(0).offsetWidth / 2){
						_nextTd = _table.find( 'tbody' ).find( 'tr' ).find( 'td:eq( '+_nextTh.index()+' )' );
						_nextTh.after( _th );					
						$.each( _td,function( i, v ){
							_nextTd.eq( i ).after( v );
						} )	
						_allTh = _tr.find( 'th' ); //重置TH对象数据
					}		
				} );
				//绑定拖拽停止事件
				//@baukh20151106:_tableDiv
				$('body').unbind( 'mouseup' );
				$('body').bind( 'mouseup',function(){
				//@baukh20151106:_tableDiv
					$('body').unbind( 'mousemove' );				
					//清除临时展示被移动的列
					_dreamlandDIV = $( '.dreamland-div' );
					if( _dreamlandDIV.length != 0 ){

						_dreamlandDIV.animate( {
							top	: _table.get( 0 ).offsetTop,
							left: _th.get( 0 ).offsetLeft - _tableDiv.get( 0 ).scrollLeft 
						//	left: _th.offset().left
						},_this.animateTime,function(){
							_tableDiv.css( 'position',_divPosition );
							_th.removeClass( 'drag-ongoing' );	
							_td.removeClass( 'drag-ongoing' );							
							_dreamlandDIV.remove();	
						} );					
					}
					//缓存列表位置信息
					if( !_this.disableCache ){
						_this.setToLocalStorage( _table );
					}				
					//重置调整宽度事件源
					if( _this.supportAdjust ){
						_this.resetAdjust( _table );	
					}
					//开启文字选中效果
					$( 'body' ).removeClass( 'no-select-text' );
					if( _this.isRealTime ){
						window.clearInterval( SIV_td );
					}
				} );
			} );
		}
		/*
			@绑定宽度调整事件
			$.dom: table数组[jquery对象]
		*/
		,bindAdjustEvent: function( dom ){
			var _this = this;
			var thList 	= dom.find( 'th' );	//页面下所有的TH
			//监听鼠标调整列宽度
			thList.off( 'mousedown', '.adjust-action' );
			thList.on( 'mousedown', '.adjust-action', function( event ){
				var _dragAction 	= $( this );
				var _th 			= _dragAction.parents( 'th' ).eq( 0 ),		//事件源所在的th
					_tr 			= _th.parent(),								//事件源所在的tr
					_table 			= _tr.parents( 'table' ).eq( 0 ),			//事件源所在的table
					_tableDiv 		= _table.parents( '.table-div' ).eq( 0 ),	//事件源所在的DIV
					_tableWarp		= _tableDiv.parents('.table-warp'),			//table外围DIV
					_thWarp			= $( '.th-warp', _th ),						//th下所有内容的外围容器
					_dragAction		= $('.drag-action', _thWarp),				//th文本在渲染后所在的容器
			//		_textDreamland	= $('.text-dreamland', _tableWarp),			//文本镜象 用于处理实时获取文本长度	
					_allTh 			= _tr.find( 'th[th-visible!=none]' ),		//事件源同层级下的所有th
					_nextTh			= _allTh.eq( _th.index() + 1 ),				//事件源下一个可视th
					_last 			= _allTh.eq( _allTh.length - 1 ), 			//事件源同层级倒数第一个th
					_lastButOne 	= _allTh.eq( _allTh.length - 2 ), 			//事件源同层级倒数第二个th
					_td 			= _table.find( 'tbody' )
									  .find( 'tr' )
									  .find( 'td:eq( '+_th.index()+' )' ), 		//与事件源同列的所在td
					adjustActionToTr= $( '.adjust-action',_tr );				//事件源所在的TR下的全部调整宽度节点
				//重置width 防止auto现象
				$.each(_allTh, function(i, v){
					if(v.style.width == 'auto' || v.style.width == ''){
					//	$(v).css('width',$(v).width());
						$(v).width($(v).width());
					}
				});
				/*
				_th.width
				//将th文本嵌入文本镜象 用于获取文本实时宽度
				_textDreamland.text( _dragAction.text() );
				_textDreamland.css({
					fontSize 	: _dragAction.css('font-size'),
					fontWeight	: _dragAction.css('font-weight')
				});
	*/
				//增加宽度调整中样式
				_th.addClass( 'adjust-selected' );
				_td.addClass( 'adjust-selected' );
				//绑定鼠标拖动事件
				var _X = event.clientX, //记录鼠标落下的横向坐标
					_w,
					_w2;
				/*
				var _thPaddingLeft = _thWarp.css('padding-left').split('px')[0],
					_thPaddingRight = _thWarp.css('padding-right').split('px')[0],
					_remindAction	= $('.remind-action', _thWarp),
					_sortingAction	= $('.sorting-action', _thWarp);
				var _realWidthForThText = _textDreamland.width() 
										+ (Number(_thPaddingLeft) ? Number(_thPaddingLeft) : 0) 
										+ (Number(_thPaddingRight) ? Number(_thPaddingRight) : 0)
										+ (_remindAction.length == 1 ? _remindAction.width() : 20 )
										+ (_sortingAction.length == 1 ? _sortingAction.width() : 20);
				*/
				//baukh20151203:_th.index() == _lastButOne.index() ? _last : _th  修正为 _th
				var _realWidthForThText = _this.getTextWidth(_th);
				_table.unbind( 'mousemove' );
				_table.bind( 'mousemove',function( e ){
					_w = e.clientX - 
						_th.offset().left - 
						_th.css( 'padding-left' ).split( 'px' )[0] - 
						_th.css( 'padding-right' ).split( 'px' )[0];
					//限定最小值
					if( _w < _realWidthForThText){
						_w = _realWidthForThText;
					}	
					//触发源为倒数第二列时 缩小倒数第一列
					if( _th.index() == _lastButOne.index() ){
						_w2 = _th.width() - _w + _last.width();		
						_last.width(Math.ceil( _w2 < _realWidthForThText ? _realWidthForThText : _w2 ));
					}
					_th.width(Math.ceil( _w ));
					//_isSame:table的宽度与table-div宽度是否相同
					//Chrome下 宽度会精确至小数点后三位 且 使用width时会进行四舍五入，需要对其进行特殊处理 宽度允许相差1px
					var _isSame  = _this.isChrome() ? 
					    (_table.get(0).offsetWidth == _tableDiv.width() || _table.get(0).offsetWidth == _tableDiv.width() + 1 || _table.get(0).offsetWidth == _tableDiv.width() - 1)
						: _table.get(0).offsetWidth == _tableDiv.width();
					//table宽度与table-div宽度相同 且 当前处理缩小HT宽度操作时
					if( _isSame && _th.width() > _w ){
						_nextTh.width(Math.ceil( _nextTh.width() + _th.width() - _w ))
					}
					//重置镜像滚动条的宽度
					if( _this.supportSetTop ){
						$( _this.scrollDOM ).trigger( 'scroll' );
					}
				} );
				
				//绑定鼠标放开、移出事件
				_table.unbind( 'mouseup mouseleave' );
				_table.bind( 'mouseup mouseleave',function(){
					_table.unbind( 'mousemove mouseleave' );
					_th.removeClass( 'adjust-selected' );
					_td.removeClass( 'adjust-selected' );
					//重置镜像滚动条的宽度
					if( _this.supportSetTop ){
						$( _this.scrollDOM ).trigger( 'scroll' );
					}
					//缓存列表宽度信息
					if( !_this.disableCache ){
						_this.setToLocalStorage( _table );
					}
				} );
				return false;
			} );
			
		}
		/*
			@获取TH所占宽度
			$.element: th
		*/
		,getTextWidth: function(element){
			var _this = this;
			var th 				= $(element),   				//th
				thWarp 			= $('.th-warp', th),  		//th下的listManager包裹容器
				thText	 		= $('.th-text', th),		//文本所在容器
				remindAction	= $('.remind-action', thWarp),	//提醒所在容器
				sortingAction	= $('.sorting-action', thWarp);	//排序所在容器
			//文本镜象 用于处理实时获取文本长度	
			var textDreamland	= $('.text-dreamland', th.parents('.table-warp'));

			//将th文本嵌入文本镜象 用于获取文本实时宽度
			textDreamland.text( thText.text() );
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
						+ (remindAction.length == 1 ? /*remindAction.width()*/ 20 : 5)
						+ (sortingAction.length == 1 ? /*sortingAction.width()*/ 20 : 5);
			return thWidth;
		}
		/*
			@绑定表头吸顶功能
			$.dom: table数组[jquery对象]
		*/
		,bindSetTopFunction: function( dom ){
			var _this = this;
			//抽取固定值存储
			/*
				@baukh20151111:_tableOffsetTop值在使用时再进行获取，此段代码已无用
			var _t;
			$.each( dom, function( i, v ){
				_t = $( v );
				_t.attr( 'table-offset-top', v.offsetTop );			
			} );
			*/
			//绑定窗口变化事件
			$( window ).resize( function() {
				_this.outLog( 'winodw resize event' );
				$( _this.scrollDOM ).trigger( 'scroll', [true]);
			} );
			//绑定模拟X轴滚动条
			$( '.scroll-area' ).unbind( 'scroll' );
			$( '.scroll-area' ).bind( 'scroll', function(){
				$( this ).parents( '.table-div' ).scrollLeft(this.scrollLeft);
				this.style.left = this.scrollLeft + 'px';
			} );
			//_this.scrollDOM != window 时 清除_this.scrollDOM 的padding值
			if(_this.scrollDOM != window){
				$(_this.scrollDOM).css('padding','0px');
			}

			//绑定滚动条事件  
			//$._isWindowResize_:是否为window.resize事件调用
			$( _this.scrollDOM ).unbind( 'scroll' );
			$( _this.scrollDOM ).bind( 'scroll', function(e, _isWindowResize_){
	//		window.requestAnimationFrame(function(time){
				var _scrollDOM = $( this ),
				//	_tableList  = $(dom),
					_theadBackground,		//列表头的底色
					_tableDIV,				//列表所在的DIV,该DIV的class标识为table-div
					_tableWarp,				//列表所在的外围容器
					_setTopHead,			//吸顶元素
					_tableOffsetTop,		//列表与_tableDIV之间的间隙，如marin-top,padding-top
					_table,					//列表
					_thead,					//列表head
					_thList,				//列表下的th
					_tbody;					//列表body
				var _listManagerName = '';	
				var _scrollDOMTop = _scrollDOM.scrollTop(),
					_tDIVTop = 0;
					/*
					console.log(_tableList.length)	
				if( !_tableList || _tableList.length == 0 ){
					return true;
				}
				*/
				var// _tDivHeight = undefined, //吸顶触发后，table所在div的高度
					_tWarpMB	= undefined; //吸顶触发后,table所在外围容器的margin-bottom值
				
				$.each( dom, function( i, v ){
					_table 			= $( v );
					_tableDIV 		= _table.parents( '.table-div' ).eq( 0 );
					_tableWarp 		= _tableDIV.parents( '.table-warp' ).eq( 0 );
					_thead 			= $( '> thead[class!="set-top"]', _table );
					_tbody 			= $( 'tbody', _table );
					_listManagerName= v.getAttribute('list-manager');
					if( !_tableDIV || _tableDIV.length == 0 ){
						return true;
					}
					_tDIVTop 		= _this.scrollDOM == window ? _tableDIV.offset().top : 0; //_scrollDOM.offset().top;
					
					_tableOffsetTop = v.offsetTop //parseInt( _table.attr( 'table-offset-top' ) );
					_setTopHead 	= $( '.set-top', _table );
					//当前列表数据为空
					if( $( 'tr', _tbody ).length == 0 ){
						return true;
					}
					//配置X轴滚动条
					var scrollArea = $( '.scroll-area', _tableWarp );
					if( _tableDIV.width() < _table.width() ){  //首先验证宽度是否超出了父级DIV
						if(_this.scrollDOM == window){
							_tWarpMB = Number( _tableDIV.height() ) 
									 + Number( _tableWarp.css( 'margin-bottom' ).split( 'px' )[0] )
							//		 - Number( _tableWarp.css( 'padding-bottom' ).split( 'px' )[0] )
								//	 - window.scrollY   
								//	 #151010 该属性不是通用属性 虽然在高版本的火狐或谷歌中可以实现，考虑后还是使用scrollTop
								//   IE 支持  document.documentElement.scrollTop
								//   firebox 支持 document.documentElement.scrollTop  window.scrollY
								//	 Chrome 支持 document.body.scrollTop window.scrollY
									 - (document.body.scrollTop || document.documentElement.scrollTop || window.scrollY)
									 - ( window.innerHeight - _tableDIV.offset().top );
						//	_tDivHeight = window.innerHeight - _tableDIV.offset().top + window.scrollY;	 //_tDivHeight 可能无用
						}else{
							_tWarpMB = Number( _tableDIV.height() ) 
									 + Number( _tableWarp.css( 'margin-bottom' ).split( 'px' )[0] )
							//		 - Number( _tableWarp.css( 'padding-bottom' ).split( 'px' )[0] )
									 - _scrollDOM.scrollTop()
									 - _scrollDOM.height();
						}			
						
						if( _tWarpMB < 0 ){
							_tWarpMB = 0;
						//	_tDivHeight = 'auto'
						}
						$( '.sa-inner', scrollArea ).css( {
							width : _table.width()
						} );
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
					if( _this.scrollDOM == window ? (_tDIVTop - _scrollDOMTop >= -_tableOffsetTop) : (_scrollDOMTop == 0) ){
						if( _thead.hasClass( 'scrolling' ) ){
							_thead.removeClass( 'scrolling' );
						}
						_setTopHead.remove();
						return true;
					}	
					//表完全不可见
					if( _this.scrollDOM == window ? (_tDIVTop - _scrollDOMTop < 0 &&
						Math.abs( _tDIVTop - _scrollDOMTop ) + _thead.height() - _tableOffsetTop > _tableDIV.height()) : false ){
						_setTopHead.show();					
						_setTopHead.css( {
							top		: 'auto',
							bottom	: '0px'
						} );
						return true;
					}			
					//配置表头镜像
					//当前表未插入吸顶区域 或 事件触发事件为window.resize
					
					//配置吸顶区的宽度
					if( _setTopHead.length == 0 || _isWindowResize_){
						_setTopHead.length == 0 ? _table.append( _thead.clone( false ).addClass( 'set-top' ) ) : '';
						_setTopHead = $( '.set-top', _table );
						_setTopHead.css({						
							width : _thead.width() 
								  + Number(_thead.css('border-left-width').split('px')[0] || 0)
								  + Number(_thead.css('border-right-width').split('px')[0] || 0)
							,left: _table.css('border-left-width')
						});
						//$( v ).width( _thList.get( i ).offsetWidth )  获取值只能精确到整数
						//$( v ).width( _thList.eq( i ).width() ) 取不到宽
						//调整吸顶表头下每一个th的宽度[存在性能问题，后期需优化]
						
						_thList = $( 'th', _thead );
						$.each( $( 'th', _setTopHead ), function( i, v ){
							$(v).css({
								width : _thList.eq(i).width()
									  + Number(_thList.eq(i).css('border-left-width').split('px')[0] || 0)
									  + Number(_thList.eq(i).css('border-right-width').split('px')[0] || 0)
							});
							/*
							$(v).css('width', _thList.get(i).offsetWidth);
							*/
						} );
					}
					//当前吸引thead 没有背景时 添加默认背景
					if( !_setTopHead.css( 'background' ) ||
						_setTopHead.css( 'background' ) == '' ||
						_setTopHead.css( 'background' ) == 'none' ){
						_setTopHead.css( 'background', '#f5f5f5' );
					}
					
					//表部分可见
					if(  _this.scrollDOM == window ? (_tDIVTop - _scrollDOMTop < 0 &&
						Math.abs( _tDIVTop - _scrollDOMTop ) <= _tableDIV.height() +_tableOffsetTop) : true ){
						if( !_thead.hasClass( 'scrolling' ) ){
							_thead.addClass( 'scrolling' );
						}
						_setTopHead.css( {
							top		: _scrollDOMTop  - _tDIVTop + _this.topValue,
							bottom	: 'auto'
						} );
						_setTopHead.show();
						return true;
					}
				} );	
				return true;	
			//	});
			} );
			$( _this.scrollDOM ).trigger( 'scroll' );
		}
		/*		
			@重置宽度调整事件源DOM
			用于禁用最后一列调整宽度事件
			$.element:table
		*/
		,resetAdjust: function( element ){
			var _this = this;
			var _table = $( element ),
				_thList = $( 'thead [th-visible="visible"]', _table ),
				_adjustAction = $( '.adjust-action', _thList );
			if( !_adjustAction || _adjustAction.length == 0 ){
				return false;
			}
			_adjustAction.show();
			_adjustAction.eq( _adjustAction.length - 1 ).hide();
		}
		/*
			@保存至本地缓存
			$.element:table对象[jquery对象]
			$.isInit: 是否为初始存储缓存[用于处理宽度在特定情况下发生异常]
		*/
		,setToLocalStorage: function( element, isInit ){
			var _this = this;
			var _table = $(element);
			//当前表是否禁用缓存  被禁用原因是用户缺失了必要的参数
			var noCache = _table.attr('no-cache');
			if( noCache && noCache== 'true' ){
				_this.outLog( '缓存已被禁用：当前表缺失必要html标签属性[list-manager或th-name]' );
				return false;
			}
			if( !window.localStorage ){
				_this.outLog( '当前浏览器不支持：localStorage' );
				return false;
			}
			if( !_table || _table.length == 0 ){
				_this.outLog( 'setToLocalStorage:无效的table' );
				return false;
			}
			var _tableListManager = _table.attr( 'list-manager' );
			//验证当前表是否为listManager
			if( !_tableListManager || $.trim( _tableListManager ) == '' ){
				_this.outLog( 'setToLocalStorage:无效的list-manager' );
				return false;
			}
			var _cache 		= {},
				_cacheString= '',
				_pageCache 	= {},
				_thCache	= new Array(),
				_thData 	= {};
			var thList = $( 'thead[class!="set-top"] th', _table );
			if( !thList || thList.length == 0 ){
				_this.outLog( 'setToLocalStorage:无效的thList,请检查是否正确配置table,thead,th' );
				return false;
			}
					
			//key 由pathcname + hash + 唯一标识list-manager + 表列数 [用于规避同页面下存在list-manager相同的表格]
			var _key = window.location.pathname +  window.location.hash + '-' +  _tableListManager + '-' + thList.length;
			var $v;
			$.each( thList, function( i, v ){
				$v = $( v );
				_thData = {};
				_thData.th_name = v.getAttribute( 'th-name' );
				if( _this.supportDrag ){
					_thData.th_index = $v.index();
				}
				if( _this.supportAdjust ){
					//用于处理宽度在特定情况下发生异常
					isInit ? $v.css( 'width', $v.css( 'width' ) ) : '';
					_thData.th_width = v.offsetWidth;
				}
				if( _this.supportConfig ){
					_thData.isShow = $( '.config-area li[th-name="'+ _thData.th_name +'"]', _table.parents( '.table-warp' )
									.eq( 0 ) ).find( 'input[type="checkbox"]' ).get( 0 ).checked;
				}
				_thCache.push( _thData );
			} );
			_cache.th = _thCache;
			//存储分页
			if( _this.supportAjaxPage ){
				_pageCache.pSize = $('select[name="pSizeArea"]', _table.closest('.table-warp')).val();
				_cache.page = _pageCache;
			}
		//	_data = _array.join( '__' );
			_cacheString = JSON.stringify(_cache);
			window.localStorage.setItem( _key,_cacheString );
			return _cacheString;
		}
		/*
			[对外公开方法]
			@获取本地缓存
			$.element:table
		*/
		,getLocalStorage: function( element ){
			var _this = this;
			var _table = $(element);
			//当前表是否禁用缓存  被禁用原因是用户缺失了必要的参数
			var noCache = _table.attr('no-cache');
			if( noCache && noCache== 'true' ){
				_this.outLog( '缓存已被禁用：当前表缺失必要html标签属性[list-manager或th-name]' );
				return false;
			}
			if( !window.localStorage ){
				_this.outLog( '当前浏览器不支持：localStorage' );
				return false;
			}
			if( !_table || _table.length == 0 ){
				_this.outLog( 'getLocalStorage:无效的table' );
				return false;
			}
			var _tableListManager = _table.attr( 'list-manager' );	
			//验证当前表是否为listManager
			if( !_tableListManager || $.trim( _tableListManager ) == '' ){
				_this.outLog( 'getLocalStorage:无效的list-manager' );
				return false;
			}
			var thList = $( 'thead[class!="set-top"] th', _table );
			var _key = window.location.pathname +  window.location.hash + '-'+ _tableListManager + '-' + thList.length;
			
			var _data = {},
				_array = new Array(),
				_localStorage = window.localStorage.getItem( _key );
			//如无数据，增加属性标识：list-manager-cache
			if( !_localStorage ){
				_table.attr( 'list-manager-cache','error' );
				return false;
			}
		//	_array = _localStorage.split( '__' );
			_data.key = _key;
			_data.cache = JSON.parse(_localStorage);
			return _data;
		}
		/*
			@根据本地缓存配置分页
			$.element: table数组[jquery对象]
			配置当前页显示数
		*/
		,configPageForCache: function( element ){
			var _this = this;
			var _data,		//本地缓存的数据
				_cache,		//缓存对应
				_table,		//单一的table
				_tName,		//list-manager
				_pageCache, //分页相关缓存
				_query;		//init 后的callback中的query参数
			$.each( element, function( i, v ){
				_data = _this.getLocalStorage( v );
				_tName = v.getAttribute('list-manager');
				if(!_tName){
					return;
				}
				_cache = _data.cache;
				//验证是否存在每页显示条数缓存数据
				if(!_cache || !_cache.page){
					_pageCache =  {
						pSize: _this.pageSize[_tName] ? _this.pageSize[_tName] : _this.pageSize
					};
				}
				else{
					_pageCache = _cache.page;
				}
				//验证当前分页采用的是简易模式还是标准模式
				//验证条件为是否存在与当前对应的pageCallback函数
				//if 标准模式
		//		if(typeof(_this.pageCallback[_tName]) == 'function'){ 
			//		_this.pageData[_tName] = {
				//		pSize : _pageCache.pSize,
						cPage : 1
			//		};
				//	_this.pageData[_tName].pSize = _pageCache.pSize;
					
				//else 简易模式
		//		}else{  
					_this.pageData = {
						pSize : _pageCache.pSize,
						cPage : 1
					};		
		//		}
			});
		}
		/*
			@存储原Th DOM至table data
			$.element: table数组[jquery对象]
		*/
		,setOriginalThDOM: function( element ){
			$.each( element, function( i, v ){
				$(v).data('originalThDOM', $('thead th', v));
			});
		}
		/*
			@获取原Th DOM至table data
			$.element: table数组[jquery对象]
		*/
		,getOriginalThDOM: function( element ){
			return $(element).data('originalThDOM');
		}
		/*
			@根据本地缓存配置列表[thead]
			$.element: table数组[jquery对象]
			获取本地缓存
			存储原位置顺序
			根据本地缓存进行配置
		*/
		,configTheadForCache: function( element ){
			var _this = this;
			var _data,		//本地缓存的数据
				_table,		//单一的table
				_th,		//单一的th
				_td,		//单列的td，与_th对应
				_cache,		//列表的缓存数据			
				_thCache,	//th相关 缓存
				_thJson,	//th的缓存json
				_thArray,
				_tbodyArray,
				_domArray;
			$.each( element, function( i, v ){
				_domArray = [];
				_table = $( v );
				_data = _this.getLocalStorage( _table );
				//验证：当前table 没有缓存数据
				if( !_data || $.isEmptyObject( _data ) ){
					_this.outLog( 'configTheadForCache:当前table没有缓存数据' );
					return;
				}
				_cache = _data.cache;
				_thCache=_cache.th;
				//验证：缓存数据与当前列表是否匹配
				if(!_thCache || _thCache.length != $( 'thead th', _table ).length ){
					_this.cleanTableCache(_table, '缓存数据与当前列表不匹配');
					return;
				}
				//验证：缓存数据与当前列表项是否匹配
				var _thNameTmpList = [],
					_dataAvailable = true;
				$.each( _thCache, function( i2, v2 ){
					_thJson = v2;
					_th = $( 'th[th-name='+ _thJson.th_name +']', _table );
					if(_th.length == 0 || _thNameTmpList.indexOf(_thJson.th_name) != -1){
						_this.cleanTableCache(_table, '缓存数据与当前列表不匹配');
						_dataAvailable = false;
						return false;
					}
					_thNameTmpList.push(_thJson.th_name);
				});
				//数据可用，进行列的配置
				if(_dataAvailable){
					$.each( _thCache, function( i2, v2 ){
						_thJson = v2;
						_th = $( 'th[th-name='+ _thJson.th_name +']', _table );
						//配置列的宽度
						if( _this.supportAdjust ){
							_th.css( 'width',_thJson.th_width );
						}
						//配置列排序数据
						if( _this.supportDrag && typeof(_thJson.th_index) !== 'undefined'){
							_domArray[_thJson.th_index] = _th;
						}else{
							_domArray[i2] = _th;
						}
						//配置列的可见
						if( _this.supportConfig ){
							_this.setAreVisible( _th, typeof( _thJson.isShow ) == 'undefined' ? true : _thJson.isShow, true );
						}
					} );
				//	console.log(_table.attr('list-manager'),_domArray)
					//配置列的顺序
					if( _this.supportDrag ){
						_table.find( 'thead tr' ).html( _domArray );
					//	_this.resetTd( _table, false );
					}
					//重置调整宽度事件源
					if( _this.supportAdjust ){
						_this.resetAdjust( _table );	
					}	
				}					
			} );
		}
		/*
			@bindDomInseredEvent[保留方法，暂时不使用]
			绑定DOM节点变更监听事件
			在DOM节点发生变化时，对listManager所管理的列表进行调整		。
		*/
		,bindDomInseredEvent: function( dom ){
			return false;
			var _this = this;	
			var	_dom = $( dom );//the element I want to monitor
			
			var _dniSTO,
				_table;
			_dom.unbind( 'DOMNodeInserted' );
			_dom.bind( 'DOMNodeInserted', function( e ){
				_table = $( this );
				window.clearTimeout( _dniSTO );
				_dniSTO = window.setTimeout( function(){
					//重置调整宽度事件源
					if( _this.supportAdjust ){
						_this.resetAdjust( _table );	
					}
					//重置显示隐藏
					if( _this.supportConfig ){
						var _th = $( 'th:hidden', _table );
						_this.setAreVisible( _th, false, true );
					}
				},50 );	
			} );			 
		}
		/*
			[对外公开方法]	
			@重置列表[tbody]
			这个方法对外可以直接调用
			作用：处理局部刷新、分页事件之后的tb排序
			$.dom: table数组[jquery对象]
			$.isSingleRow: 指定DOM节点是否为tr[布尔值]
		*/
		,resetTd: function( dom, isSingleRow ){
			var _this = this;
			if( isSingleRow ){
				var _tr = $( dom ),
					_table= _tr.parents( 'table' ).eq( 0 );
			}else{
				var _table = $( dom ),
					_tr	= _table.find( 'tbody tr' );
			}
			if( !_tr || _tr.length == 0 ){
				return false;
			}
			//重置表格序号
			if(_this.supportAutoOrder){
				var _pageData = _this.pageData;
				var _orderBaseNumber = 1,
					_orderText;
				//验证是否存在分页数据
				if(_pageData && _pageData['pSize'] && _pageData['cPage']){
					_orderBaseNumber = _pageData.pSize * (_pageData.cPage - 1) + 1;
				}
				$.each( _tr, function( i, v ){
					_orderText = _orderBaseNumber + i;
					if($('td[lm-order="true"]', v).length == 0){
						$(v).prepend('<td lm-order="true">'+ _orderText +'</td>');
					}else{
						$('td[lm-order="true"]', v).text(_orderText);
					}
				});
			}
			//依据存储顺序重置td顺序
			if( _this.supportAdjust){			
				var _thList = _this.getOriginalThDOM(_table),
					_td;
				if( !_thList || _thList.length == 0  ){
					_this.outLog( 'resetTdForCache:td顺序重置所必须的原TH DOM获取失败' );
					return false;
				}
				var _tmpHtml = [],
					_tdArray = [];
					
				$.each( _tr, function( i, v ){
					_tmpHtml[i] = $( v );
					_td = $( v ).find( 'td' );
					$.each( _td, function( i2, v2 ){
						_tdArray[_thList.index(_thList.eq( $( v2 ).index() ))] = v2;	
					} );
					_tmpHtml[i].html( _tdArray );
				});
			}
			//依据配置对列表进行隐藏、显示
			if( _this.supportConfig ){
				_this.setAreVisible( $('[th-visible="none"]'), false ,true);
			}	
			//重置吸顶事件
			if( _this.supportSetTop ){
				var _tableDIV 	= _table.parents( '.table-div' ).eq( 0 );
				var _tableWarp 	= _tableDIV.parents( '.table-warp' ).eq( 0 );
				_tableDIV.css( {
					height:'auto'
				} );
				_tableWarp.css( {
					marginBottom: 0
				} );
			}
		}
		/*
			@依据版本清除列表缓存
			$.element: table[jquery对象]
			依据版本号判断 如果版本不符 则对缓存进行清理
		*/
		,cleanTableCacheForVersion: function( element ){
			var _this = this;
			var locationVersion = window.localStorage.getItem('listManagerVersion');
			//版本相符 直接跳出
			if(locationVersion && locationVersion == _this.version){
				return;
			}
			_this.cleanTableCache( element, '插件版本已更新' );
		}
		/*
			@清除列表缓存
			$.element: table[jquery对象]
			$.cleanText: 清除缓存的原因
		*/
		,cleanTableCache: function( element, cleanText ){
			var _this = this;
			$.each(element, function(i, v){
				window.localStorage.removeItem( v.getAttribute('list-manager') );
				window.localStorage.removeItem( v.getAttribute('list-manager') + '-' + $('th', v).length);
				console.log('%c'+v.getAttribute('list-manager') + '清除缓存成功,原因：'+ cleanText, 'color:red;');
			});
			window.localStorage.setItem('listManagerVersion', _this.version );
		}
		/*
			@初始化分页
			$.element:table
		*/
		,initAjaxPage: function( element){
			var _this = this;		
			var table 		= $(element),
				tName		= table.attr('list-manager'),
				tableWarp 	= table.closest('.table-warp'),
				pageToolbar = $('.page-toolbar', tableWarp);	//分页工具条
			//生成分页存储器
			_this.query.pageData = {
				tPage: undefined,		//总页数
				cPage: undefined,		//当前页	
				pSize: undefined,		//每页显示条数
				tSize: undefined		//总条数
			};
			var	sizeData = $.isArray(_this.sizeData) ? _this.sizeData : _this.sizeData[tName];
			pageToolbar.hide();
			//生成分页DOM节点
		//	_this.createPageDOM(element, pageData);
			//生成每页显示条数选择框
			_this.createPageSizeDOM(element, sizeData);
			
			//绑定页面跳转事件
			_this.bindPageJumpEvent(element);	
			
			//绑定设置显示条数切换事件
			_this.bindSetPageSizeEvent(element);
			
			//重置当前页显示条数
		//	_this.resetPSize(element, pageData);
			
		//	pageToolbar.show();
		}
		/*
			@生成分页DOM节点据
			$._tableDOM_: table的juqery实例化对象
			$._pageData_:分页数据格式
		*/
		,createPageDOM:function( _tableDOM_, _pageData_){
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
		,createPageSizeDOM: function( _tableDOM_, _sizeData_){
			var _this = this;
			var table		= $(_tableDOM_),
				tableWarp	= table.closest('.table-warp'),
				pageToolbar = $('.page-toolbar', tableWarp),				//分页工具条
				pSizeArea	= $('select[name="pSizeArea"]', pageToolbar);	//分页区域	
			//error
			if( !_sizeData_ || !$.isArray(_sizeData_) ){
				$.error('参数:[sizeData]配置错误');
			}
			
			var _ajaxPageHtml = '';
			$.each( _sizeData_, function( i, v ){				
				_ajaxPageHtml += '<option value="'+ v +'">' + v + '</option>';
			});
			pSizeArea.html(_ajaxPageHtml);
		}
		/*
			@绑定页面跳转事件
			$._tableDOM_: table的juqery实例化对象
		*/
		,bindPageJumpEvent:function( _tableDOM_){
			var _this = this;		
			var table		= $(_tableDOM_),
				tableWarp	= table.closest('.table-warp'),
				pageToolbar = $('.page-toolbar', tableWarp),		//分页工具条
				pagination	= $('.pagination', pageToolbar),		//分页区域
				gp_action	= $('.gp-action', pageToolbar);			//快捷跳转提交事件源
			//绑定分页点击事件
			pageToolbar.off('click', 'li');
			pageToolbar.on('click', 'li', function(){
				var _page 		= $(this),
					_tableWarp 	= _page.closest('.table-warp');
				var cPage = _page.attr('cPage');	//分页页码
				if(!cPage || !Number(cPage) || _page.hasClass('disabled')){
					_this.outLog('指向页无法跳转,已停止。原因:1、可能是当前页已处于选中状态; 2、所指向的页不存在');
					return false;
				}
				gotoPage(_tableWarp, cPage);
			});
			//绑定快捷跳转事件
			gp_action.unbind('click');
			gp_action.bind('click', function(){
				var _tableWarp = $(this).closest('.table-warp'),
					_pageToolbar = $('.page-toolbar', _tableWarp),
					_input	= $('.gp-input', _pageToolbar),
					_inputValue = _input.val().trim();
				if(_inputValue == '' || /\D+/.test(_inputValue) || _inputValue < 1){
					_input.focus();
					return;
				}
				gotoPage(_tableWarp, _inputValue);
				_input.val('');
			});
			//跳转至指定页
			function gotoPage(_tableWarp, _cPage){
				var _table		= $('table[list-manager]', _tableWarp),
					_size 		= $('select[name="pSizeArea"]', _tableWarp);
			//	var _listManager= _table.listManager('getListManager');
				/*
				if(!_listManager.pageCallback || typeof(_listManager.pageCallback) != 'function'){
					_this.outLog('参数pageCallback配置错误');
					return false;
				}
				*/
				//跳转的指定页大于总页数
				if(_cPage > _this.pageData.tPage){
					_cPage = _this.pageData.tPage;
				}
				//替换被更改的值
				_this.pageData.cPage = _cPage;
				_this.pageData.pSize = _this.pageData.pSize || _this.pageSize;
			//	_table.data( 'listManager' , _listManager );

				//调用事件、渲染DOM
				var query = $.extend( {}, _this.query, _this.sortData, _this.pageData );
				_this.pagingBefore( query );
				_this.renderTbody( function() {
					_this.pagingAfter( query );
				//	_listManager.pageCallback($.extend(true, {}, _listManager.query, _listManager.sortData, _listManager.pageData)); //#需移除，用pagingAfter替代
				});
			}
		}
		/*
			@绑定设置当前页显示数事件
			$._tableDOM_: table的juqery实例化对象
		*/
		,bindSetPageSizeEvent:function( _tableDOM_){
			var _this = this;
			var table 		=  $(_tableDOM_),
				tableWarp 	= table.parents('.table-warp').eq(0),
				pageToolbar = $('.page-toolbar', tableWarp),	//分页工具条
				sizeArea	= $('select[name=pSizeArea]', pageToolbar);	//切换条数区域	
			if(!sizeArea || sizeArea.length == 0){
				_this.outLog('未找到单页显示数切换区域，停止该事件绑定');
				return false;
			}
			sizeArea.unbind('change');
			sizeArea.change(function(){
				var _size = $(this);
				var _tableWarp  = _size.parents('.table-warp').eq(0),
					_table		= $('table[list-manager]', _tableWarp),
			//		_listManager= _table.data( 'listManager' ),
					_tName 		= $('table', _tableWarp).attr('list-manager'); //当前与分页同容器下的列表名称
				_this.pageData = {
					cPage : 1,
					pSize : _size.val()
				}
			//	_this.query.pageData.cPage = 1;
			//	_this.query.pageData.pSize = _size.val();
			//	_table.data( 'listManager', _listManager);
				
				_this.setToLocalStorage(_table);
				/*
				if(!_listManager.pageCallback || typeof(_listManager.pageCallback) != 'function'){
					_this.outLog('参数pageCallback配置错误');
					return false;
				}
				*/
				//调用事件、渲染tbody
				var query = $.extend( {}, _this.query, _this.sortData, _this.pageData );
				_this.pagingBefore( query );
				_this.renderTbody( function(){
					_this.pagingAfter( query );
				//	_listManager.pageCallback($.extend(_listManager.query, _listManager.pageData)); //#需移除，用pagingAfter替代
				});
				
			});
		}
		/*
			@重置当前页显示条数据
			$.element: table的juqery实例化对象
			$._pageData_:分页数据格式
		*/
		,resetPSize: function( element, _pageData_ ){
			var _this = this;
			var table 		=  $(element),
				tableWarp 	= table.parents('.table-warp').eq(0),
				toolBar   = $('.page-toolbar', tableWarp),
				pSizeArea = $('select[name="pSizeArea"]', toolBar),
				pSizeInfo = $('.dataTables_info', toolBar);
			if(!pSizeArea || pSizeArea.length == 0){
				_this.outLog('未找到条数切换区域，停止该事件绑定');
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
			$.element: table
			$.totals: 总条数
		*/
		,resetPageData: function( element, totals ){
			var _this = this;
			
			var _pageData = getPageData( totals );
			//生成分页DOM节点
			_this.createPageDOM( element, _pageData );
			//重置当前页显示条数
			_this.resetPSize( element, _pageData);	
			
			var table 		= $( element ),
				tableWarp 	= table.parents( '.table-warp' ).eq(0),
				pageToolbar = $( '.page-toolbar', tableWarp );	//分页工具条
			$.extend( _this.pageData, _pageData ); //存储pageData信息
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
				_lg = _lg.replace(/{\d+}/g, function( word ){
					return intrusion[word.match(/\d+/)];
				});
				return _lg;
			}catch (e){
				console.warn('未找到与'+ key +'相匹配的'+ _this.i18n +'语言');
				return '';
			}
		}
		/*
		* 	@插件存在文本配置
		* */
		,textConfig: {
			'config-action': {
				'zh-cn':'配置表格',
				'en-us':'The configuration form'
			}
			,'order-text': {
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
			,'page-go':{
				'zh-cn':'确定',
				'en-us':'Go '
			}
		}
		/*
			[对外公开方法]
			@配置query 该参数会在分页触发后返回至pagingAfter(query)方法
			$.element: table
			$._pageQuery_:配置的数据
		*/
		,setQuery: function( element, _pageQuery_ ){
			var _this = this;
			var table = $(element),
				listManager = table.listManager('getListManager');	
			listManager['query'] = 	_pageQuery_;
		}
		/*
			@输出日志
		*/
		,outLog: function( msg ){
			if( this.isDevelopMode ){
				console.log( msg );
			}
		}
	}
	/*
		@提供多态化调用方式
		$._name_: listManager下的方法名
		$._settings_: 方法所对应的参数，可为空
		$._callback_: 方法所对应的回调,可为空
	*/
	$.fn.listManager = function( _name_, _settings_, _callback_){
		var _this = $(this);
		var name,
			settings,
			callback;
		//处理参数	
		//ex: $(table).listManager()
		if( arguments.length === 0){
			name	 = 'init';
			settings = {};
			callback = undefined;
		}
		//ex: $(table).listManager('init')
		else if( arguments.length === 1 && typeof(arguments[0]) === 'string' && typeof(arguments[0]) === 'init'){
			name	 = arguments[0];
			settings = {};
			callback = undefined;
		}
		//ex: $(table).listManager('getListManager')
		else if( arguments.length === 1 && typeof(arguments[0]) === 'string' && typeof(arguments[0]) !== 'init'){
			name	 = arguments[0];
			settings = undefined;
			callback = undefined;
		}
		//ex: $(table).listManager({settings})
		else if( arguments.length === 1 && $.isPlainObject(arguments[0])){
			name	 = 'init';
			settings = arguments[0];
			callback = undefined;
		}
		//ex: $(table).listManager([{'getListManager':settings},{'resetTd':settings}])
		//ex: $(table).listManager(['getListManager', 'getLocalStorage'])
		else if( arguments.length === 1 && $.isArray(arguments[0])){
			name	 = arguments[0];
			settings = undefined;
			callback = undefined;
		}
		//ex: $(table).listManager('init', callback)
		else if( arguments.length === 2 && typeof(arguments[0]) === 'string' && typeof(arguments[1]) === 'function'){
			name	 = arguments[0];
			settings = {};
			callback = arguments[1];
		}
		//ex: $(table).listManager('init', {settings})
		else if( arguments.length === 2 && typeof(arguments[0]) === 'string' && $.isPlainObject(arguments[1])){
			name	 = arguments[0];
			settings = arguments[1];
			callback = undefined;
		}
		//ex: $(table).listManager({settings}, callback)
		else if( arguments.length === 2 && $.isPlainObject(arguments[0]) && typeof(arguments[1]) === 'function'){
			name	 = 'init';
			settings = arguments[0];
			callback = arguments[1];
		}
		//ex: $(table).listManager('resetTd', false)
		else if( arguments.length === 2 && typeof(arguments[0]) === 'string' && typeof(arguments[1]) === 'boolean'){
			name	 = arguments[0];
			settings = arguments[1];
			callback = undefined;
		}
		//ex: $(table).listManager('init', {settings}, callback)
		else if( arguments.length === 3 ){
			name	 = arguments[0];
			settings = arguments[1];
			callback = arguments[2];
		}
		else{
			console.info('listManager:参数异常');
		}
		var lmObj;
		//当前初始化方法 且 当前data不存在或为空
		if( name == 'init') {		
			var options = $.extend( {}, $.fn.listManager.defaults, settings );
		//	try{
				lmObj = new listManager(options);
				return 	lmObj.init( _this, callback );
			//	lmObj.jQueryObj = _this;
		//	}catch(e){
		//		console.info('参数[init]异常:'+ e );
		//	}
		//	return;
		}
		if(name != 'init'){
			var results,
				resultsList = [];
	//		try{
				$.each(_this, function( i, v ){ 
					//parents('table')  用于  resetTd  单行tr进行操作时
					lmObj = $(v).data('listManager') || $(v).closest('table').data('listManager');
					//name type = array
					if( $.isArray(name) ){
						$.each(name, function( i2, v2 ){						
							//ex: $(table).listManager(['getListManager', 'getLocalStorage'])
							if(typeof( v2 ) == 'string'){
								results = lmObj[v2]( v );
								results ? resultsList.push( results ) : '';		
							}
							//ex: $(table).listManager([{'getListManager':options },{'resetTd':options }])
							else if( $.isPlainObject(v2) ){
								for( var l in v2 ){
									results = lmObj[l]( v ,v2[l]);
									results ? resultsList.push( results ) : '';		
								}
							}
						});
					//ex: $(table).listManager('getListManager')
					//ex: $(tableList).listManager('resetPageData', {'demoOne':{pSize:1,...},'demoTwo':{pSize:1,...}})
					}else{
						results = lmObj[name]( v, $.isPlainObject(settings) ? settings [v.getAttribute('list-manager')] || settings : settings);
						results ? resultsList.push( results ) : '';		
					}		
				});
				if(resultsList.length > 1){
					return resultsList;
				}else if(resultsList.length == 1){
					return results;
				}
		//	}catch(e){
		//		console.info( '参数['+ name + ']异常:'+ e );
		//	}
		}
		
	}

})();