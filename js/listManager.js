/*	
	列表页管理
	@baukh20150210: 调整列表宽度功能开发
	@baukh20150211: 列表拖拽换列功能开发
	@baukh20150212: 列表宽度、列排序本地存储功能开发
	@baukh20150215: 兼容分页、单列刷新
	@baukh20150216: 列表排序功能开发
	@baukh20150304: 进行全面测试、优化
	@baukh20150318: 配置列表功能开发
	@baukh20150428: 列表排序增加单列、多列配置项
	@baukh20150504: 列表增加ajax分页[暂时使用外链引入JS]
	@baukh20150506: 列表增加页码切换功能
	@baukh20150511: 插件引入模块化管理
	@baukh20150514: 增加表头吸顶功能
	@baukh20150607: 排序优化，表头吸顶增加X轴卷轴根随
	@baukh20150702: 优化吸顶、优化宽度调整、优化性能
	注意事项：
	1、JS: 如使用拖拽功能，需在列表页渲染之前进行导入
	2、JS: 如使用拖拽功能：渲染数据时需依据列标识进行匹配渲染
	3、JS：如使用拖拽功能：在分页或单条刷新事件触发后，需调用resetTd()方法，该方法需要两个参数[所操作的dom节点，是否是单列]
	4、HTML: 暂时只支持的DOM类型为table
	5、HTML: table上需必须存在属性[list-manager]
	6、HTML: th上需必须存在属性[th-name]，且同一table下不能有重复的
	7、HTML: th的DOM节点需遵从[table->thead->tr->th]的完整格式
	8、HTML:如使用排序功能，在th上需增加属性[sorting]
	9、HTML:如使用表头提醒功能，在th上需增加属性[remind]
	
	*:有些样式是基于bootstrap、smartadmin实现的。如不引入，需对应调整css文件
*/ 
//define(["jquery"], function($) {  //如果使用require.js则放开
'use strict';	
function listManager(settings){
	this.isDevelopMode  = false;					//是否为开发模式，为true时将打印事件日志
	this.basePath		= '';						//当前基本路径[用于加载分页所需文件]
	this.useDefaultStyle= true,						//是否使用默认的table样式
	this.minNum 		= 40; 						//宽度允许调整的的最小值
	this.supportDrag 	= true; 					//是否支持拖拽功能
	this.isRealTime		= false;					//列表内是否存在实时刷新[平时尽量不要设置为true，以免消耗资源]
	this.supportAdjust 	= true; 					//是否支持宽度调整功能
	this.supportSorting	= false; 					//是否支持排序功能
	this.isCombSorting	= false;					//是否为组合排序[只有在支持排序的情况下生效]
	this.supportRemind  = false;					//是否支持表头提示信息[需在地应的TH上增加属性remind]
	this.supportConfig	= true;						//是否支持配置列表功能[操作列是否可见]
	this.supportSetTop  = true;						//是否支持表头置顶
	this.scrollDOM		= window;					//表头置顶所对应的容器[jquery选择器或jquery对象]
	this.sortingCallback  = {						//排序触发后的回调函数集合，该函数一般需指向搜索事件
		//key:function(){
		//},k2:f2,
		//...
		//key:需与talble上的list-manager相同
		//function:排序后的数据操作，建意直接调用搜索事件
	};						
	this.animateTime    = 300;						//动画效果时长
	this.disableCache	= false;					//是否禁用本地缓存
	
	
	this.supportAjaxPage= false;					//是否支持配置列表ajxa分页	
	this.sizeArray = [10,20,30,50,100]; //用于配置当前页显示条数
	this.pageJson = {				//分页数据
//			tPage: 10,				//总页数
//			cPage: 1,				//当前页	
//			pSize: 10,				//每页显示条数
//			tSize: 100				//总条数
	};
	this.pageQuery = {};			//其它需要带入的参数，该参数会在分页触发后返回至searchAction方法
	this.pageCallback ={			//分页触发后的回调函数集合，该函数一般需指向搜索事件
		//key:function(query){
		//},k2:f2,
		//...
		//key:需与talble上的list-manager相同
		//function:排序后的数据操作，建意直接调用搜索事件				
	};
	this.pageCssFile = '';			//分页样式文件路径[用户自定义分页样式]
	if(typeof(listManagerConfig) == 'object'){
		$.extend(this,listManagerConfig);
	}
	$.extend(this,settings);
	
}
listManager.prototype = {
	/*
		@初始化方法
		@baukh20150504:新增ajax分页，将原init拆分，目的是为了区别对待分页
	*/
	init: function(callback){
		var _this = this;
		var listDOM = $('[list-manager]');
		if(!listDOM || listDOM.length == 0){
			_this.outLog('获取初始化列表失败：原因可能是标识错误或者是该页面没有需要初始化的列表');
			return false;
		}
		if(_this.supportAjaxPage){
			_this.initAjaxPage(function(){		
				_this.ajaxPage = ajaxPage;
				_this.initTable(listDOM);
				typeof(callback) == 'function' ? callback() :'';
			});
		}else{
			_this.initTable(listDOM);
			typeof(callback) == 'function' ? callback() :'';
		}
		_this.loadIconfont();
	}
	/*
		@加载所需图标库
	*/
	,loadIconfont: function(){
		var _this = this;
		if($('link#listManager-iconfont').length > 0){
			return false;
		}
		var iconfontCss  = document.createElement('link');
		iconfontCss.id   = 'listManager-iconfont';
		iconfontCss.rel  = 'stylesheet';
		iconfontCss.type = 'text/css';
		iconfontCss.href = _this.basePath + 'iconfont/iconfont.css';
		document.head.appendChild(iconfontCss);
		iconfontCss.addEventListener('load', function(event) {
			_this.outLog('listManager-iconfont load OK');
		});
		iconfontCss.addEventListener('error', function(){
			_this.outLog('listManager-iconfont load error');
		});
	}
	/*
		@绑定AJAX分页
	*/
	,initAjaxPage: function(cb){
		var _this = this;
		var loadJsOk = false,
			loadCssOk= false;
		//加载分页样式		
		if($('link#ajaxPage-css').length == 0){
			var ajaxPageCss  = document.createElement('link');
			ajaxPageCss.id   = 'ajaxPage-css';
			ajaxPageCss.rel  = 'stylesheet';
			ajaxPageCss.type = 'text/css';
			if(_this.pageCssFile && _this.pageCssFile != ''){
				ajaxPageCss.href = _this.pageCssFile;
			}else{
				ajaxPageCss.href = _this.basePath + 'css/ajaxPage.css';
			}
			document.head.appendChild(ajaxPageCss);
			ajaxPageCss.addEventListener('load', function(event) {
				if(loadJsOk){
					typeof(cb) == 'function' ? cb() : '';
				}
				loadCssOk = true;
			});
			ajaxPageCss.addEventListener('error', function(){
				_this.outLog('所指向的分页样式文件导入失败');
				return false;
			});
		}else{
			loadCssOk = true;
		}
		
		//加载分页脚本
		$.getScript(_this.basePath + 'js/ajaxPage.js', function(){
			if(loadCssOk){
				typeof(cb) == 'function' ? cb() : '';
			}
			loadJsOk = true;
		});
	}
	/*
		@初始化列表
	*/
	,initTable: function(listDOM){
		var _this = this;
		//渲染HTML，嵌入所需的事件源
		_this.embeddedDom(listDOM);
		
		//绑定监听DOM节点变化事件
		_this.bindDomInseredEvent(listDOM);
		
		//获取本地缓存并对列表进行配置
		if(!_this.disableCache){
			_this.configurationListForCache(listDOM);
		}
		//绑定宽度调整事件
		if(_this.supportAdjust){
			_this.bindAdjustEvent(listDOM);
		}
		//绑定拖拽换位事件
		if(_this.supportDrag){
			_this.bindDragEvent(listDOM);
		}
		//绑定排序事件
		if(_this.supportSorting){
			_this.bindSortingEvent(listDOM);
		}
		//绑定表头提示事件
		if(_this.supportRemind){
			_this.bindRemindEvent(listDOM);
		}
		//绑定配置列表事件
		if(_this.supportConfig){
			_this.bindConfigEvent(listDOM);
		}
		//绑定表头置顶功能
		if(_this.supportSetTop){
			_this.bindSetTopFunction(listDOM);
		}
		
	}
	/*
		@渲染HTML，根据配置嵌入所需的事件源
		$.dom: table数组[jquery对象]
		@baukh20150216:该方法可进行优化。将多次操作DOM进行合并
	*/
	,embeddedDom: function(dom){
		var _this = this;
		//表头提醒HTML
		var _remindHtml  = '<div class="remind-action">'
						 + '<i class="ra-help iconfont icon-help"></i>'
						 + '<div class="ra-area" style="display:none">'
						 + '<span class="ra-title"></span>'
						 + '<span class="ra-con"></span>'
						 + '</div>'
						 + '</div>';
		//配置列表HTML			 
		var	_configHtml	 = '<div class="config-area"><span class="config-action" title="配置列表"><i class="iconfont icon-set"></i></span>'
						 + '<ul class="config-list"></ul></div>';
		//宽度调整HTML
		var	_adjustHtml	 = '<span class="adjust-action"></span>';
		//排序HTML
		var	_sortingHtml = '<div class="sorting-action">'
						 + '<i class="sa-icon sa-up iconfont icon-up"></i>'
						 + '<i class="sa-icon sa-down iconfont icon-down"></i>'
						 + '</div>';
		//AJAX分页HTML
		if(_this.supportAjaxPage){
			var	_ajaxPageHtml= '<div class="page-toolbar">'
						 	 + '<div class="change-size"><span class="dataTables_info"></span><select name="pSizeArea">';
			$.each(_this.sizeArray, function(i, v){				
				_ajaxPageHtml += '<option value="'+ v +'">' + v + '</option>';
			});
			_ajaxPageHtml += '</select></div>'
						  + '<div class="ajax-page"><ul class="pagination"></ul></div>'
						  + '</div>';	
		}							 
		
		//嵌入宽度调整事件源、并初始化宽度		
		var	tableWarp,						//单个table所在的DIV容器
			tName,							//table的listManager属性值
			_div,							//单个table所在的父级DIV
			onlyThList,						//单个table下的TH
			onlyTH,							//单个TH
			thHeight,						//TH的高
			paddingRight,					//TH当前的padding值
			marginRigth,					//调整宽度节点所需要右移的数值
			remindDOM,						//表头提醒DOM
			adjustDOM,						//调整宽度DOM
			sortingDom;						//排序DOM
		$.each(dom,function(i1, v1){
			v1 = $(v1);	
			//根据配置使用默认的表格样式
			if(_this.useDefaultStyle){
				v1.addClass('list-manager-default');
			}
			onlyThList = v1.find('th');
			
			v1.wrap('<div class="table-warp"><div class="table-div"></div></div>');
			tableWarp = v1.parents('.table-warp').eq(0);
			_div = $('.table-div', tableWarp);
			//嵌入配置列表DOM
			if(_this.supportConfig){
				tableWarp.append(_configHtml);					
			}
			tName = v1.attr('list-manager');
			//嵌入Ajax分页DOM
			if(_this.supportAjaxPage && _this.pageJson[tName] && !$.isEmptyObject(_this.pageJson[tName])){	
				tableWarp.append(_ajaxPageHtml);
				var _par = {
					pageJson 		: _this.pageJson,
					query 			: _this.pageQuery,
					tableWarp		: tableWarp, 
					pageCallback	: _this.pageCallback,
					isDevelopMode	: _this.isDevelopMode,
					disableCache	: _this.disableCache
				}
				_this.ajaxPage.init(_par);
			}else{
				_this.outLog('pageJson['+ tName +']:undefined');	
			}
			//嵌入吸顶所需DOM
			if(_this.supportSetTop){
				//表头镜像[.set-top] 在滚动时实时增删
				_div.append('<div class="scroll-area"><div class="sa-inner"></div></div>');
			}
			$.each(onlyThList, function(i2,v2){
				onlyTH = $(v2);
				onlyTH.attr('th-visible','visible');
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
				if(_this.supportDrag){
					onlyTH.html('<span class="drag-action">'+onlyTH.html()+'</span>');
				}	
				//嵌入表头提醒事件源
				if(_this.supportRemind && onlyTH.attr('remind') != undefined){						
					remindDOM = $(_remindHtml);
					remindDOM.find('.ra-title').text(onlyTH.text());
					remindDOM.find('.ra-con').text(onlyTH.attr('remind') || onlyTH.text());
					onlyTH.append(remindDOM);
				}		
				//嵌入排序事件源
				if(_this.supportSorting && onlyTH.attr('sorting') != undefined){						
					sortingDom = $(_sortingHtml);//.css({height:onlyTH.height() || 18});
					onlyTH.prepend(sortingDom);
				}
				//嵌入宽度调整事件源
				if(_this.supportAdjust){				
				//	onlyTH.width(onlyTH.width() || _this.minNum);			
					thHeight =  18;
				//	thHeight < 18 ? thHeight = 18 : '';
					paddingRight = onlyTH.css('padding-right');
					marginRigth = Number(paddingRight.split('px')[0]) + 2;						
					adjustDOM = $(_adjustHtml);
					if(i2 == onlyThList.length - 1){ //最后一列不支持调整宽度
						adjustDOM.hide();
					}
					adjustDOM.css({
						height:thHeight,
						marginRight:'-'+marginRigth+'px'
					});
					onlyTH.prepend(adjustDOM);
				}
			});				
		});
	}
	/*
		@绑定配置列表事件[列是否可见]
		$.dom: table数组[jquery对象]
		隐藏展示列
	*/
	,bindConfigEvent: function(dom){
		var _this = this;
		//打开/关闭设置区域
		$('.config-action').unbind('click');
		$('.config-action').bind('click', function(){
			var _configAction = $(this),		//展示事件源
				_configArea = _configAction.parent(),	//设置区域
				_configList = _configArea.find('.config-list');//设置列表
			//关闭
			if(_configList.css('display') == 'block'){ 
				_configList.animate({
					width: '0px'
				}, _this.animateTime, function(){
					_configList.hide();
				});
				return false;
			}
			//打开
			var _tableWarp = _configAction.parents('.table-warp').eq(0),//当前事件源所在的div
				_table	= $('[list-manager]', _tableWarp),			//对应的table
				_thList = $('thead th', _table),			//所有的th
				_trList = $('tbody tr', _table),		//tbody下的tr
				_td;			//与单个th对应的td	
			$.each(_thList, function(i, v){
				v = $(v);
				$.each(_trList, function(i2, v2){
					_td = $('td', v2).eq(v.index());
					_td.css('display', v.css('display'));
				});					
			});
			_configList.css('width','auto');
			_configList.fadeIn(_this.animateTime);
				
			
		});
		
		//设置事件
		$('.config-list li').unbind('click');
		$('.config-list li').bind('click', function(){
			var _only = $(this),		//单个的设置项
				_configArea 	= _only.parents('.config-area').eq(0),		//事件源所在的区域
				_thName 		= _only.attr('th-name'),					//单个设置项的thName
				_checkbox 		= _only.find('input[type="checkbox"]'),		//事件下的checkbox
				_tableWarp  	= _only.parents('.table-warp').eq(0), 	//所在的大容器
				_table	 		= $('[list-manager]', _tableWarp),				//所对应的table					
				_th				= $('thead th[th-name="'+_thName +'"]', _table), //所对应的th
				_checkedList;		//当前处于选中状态的展示项
			if(_only.hasClass('no-click')){
				return false;
			}	
			_only.parents('.config-list').eq(0).find('.no-click').removeClass('no-click');
			var isVisible = !_checkbox.get(0).checked;
			//设置列是否可见
			_this.setAreVisible(_th, isVisible, false, function(){	
				_this.setToLocalStorage(_table);	//缓存信息
			});
			
			//最后一项禁止取消
			_checkedList =  $('.config-area input[type="checkbox"]:checked', _tableWarp);
			if(_checkedList.length == 1){
				_checkedList.parent().addClass('no-click');
			}
			
			//处理调整宽度方法中的事件
			if(_this.supportAdjust){
				_this.resetAdjust(_table);	
			}
			var _visibleTh = $('thead th:visible');
			_visibleTh.css('width', (_tableWarp.width() / _visibleTh.length));
		});
	}
	/*
		@设置列是否可见
		$._thList_： 即将配置的列所对应的th[array]
		$._visible_: 是否可见[Boolean]
		$._isInit_: 是否初始加载[通过缓存进行的初始修改]
		$.cb: 回调函数
	*/
	,setAreVisible: function(_thList_, _visible_, _isInit_ ,cb){
		var _this = $(this);
		var _table,	//当前所在的table
			_tableWarp, //当前所在的容器
			_th,	//当前操作的th
			_trList, //当前tbody下所有的tr
			_tdList = [], //所对应的td
			_checkLi,		//所对应的显示隐藏所在的li
			_checkbox;	//所对应的显示隐藏事件
		$.each(_thList_, function(i, v){
			_th = $(v);
			_table = _th.parents('table').eq(0);
			_tableWarp = _table.parents('.table-warp').eq(0);
			_trList = $('tbody tr', _table);
			_checkLi = $('.config-area li[th-name="'+ _th.attr('th-name') +'"]', _tableWarp);
			_checkbox = _checkLi.find('input[type="checkbox"]');
			if(_checkbox.length == 0){
				return;
			}
			$.each(_trList, function(i, v){
				_tdList.push($(v).find('td').eq(_th.index()));
			});
			if(_visible_){
				_isInit_ ? _th.show() : _th.fadeIn(_this.animateTime, function(){
					typeof(cb) == 'function' ? cb() : '';
				});
				$.each(_tdList, function(i2, v2){
					_isInit_ ? $(v2).show() : $(v2).fadeIn(_this.animateTime);
				});
				_checkLi.addClass('checked-li');
				_checkbox.get(0).checked = true;
				_th.attr('th-visible','visible');
			}else{
				_isInit_ ? _th.hide() : _th.fadeOut(_this.animateTime, function(){
					typeof(cb) == 'function' ? cb() : '';
				});
				$.each(_tdList, function(i, v2){
					_isInit_ ? $(v2).hide() : $(v2).fadeOut(_this.animateTime);
				});
				_checkLi.removeClass('checked-li')
				_checkbox.get(0).checked = false;
				_th.attr('th-visible','none');
			}
		});
	}
	/*
		@绑定表头提醒功能
		$.dom: table数组[jquery对象]
	*/
	,bindRemindEvent: function(dom){
		var _this = this;
		var raArea;
		$(dom).off('mouseenter', '.remind-action');
		$(dom).on('mouseenter', '.remind-action', function(){
			raArea = $(this).find('.ra-area');
			raArea.show().css({
				right: this.offsetLeft < raArea.get(0).offsetWidth ? Number('-'+raArea.get(0).offsetWidth) : $(this).width()
			})
		});
		$(dom).off('mouseleave', '.remind-action');
		$(dom).on('mouseleave', '.remind-action', function(){
			raArea = $(this).find('.ra-area');
			raArea.hide();
		});
	}
	/*
		@绑定排序事件
		$.dom: table数组[jquery对象]
	*/
	,bindSortingEvent: function(dom){
		var _this = this;
		var _thList = dom.find('th[sorting]'),	//所有包含排序的列
			_actionArea,	//事件源容器
			_action,		//向上或向下事件源
			_th,			//事件源所在的th
			_table,			//事件源所在的table
			_thName;		//th对应的名称
		//绑定排序事件
		$('.sorting-action', _thList).unbind('click');
		$('.sorting-action', _thList).bind('click', function(){
			_action 		= $(this);
		//	_actionArea		= _action.parent(),
			_th 	= _action.parents('th').eq(0);
			_table 	= _th.parents('table').eq(0);
			_thName 		= _th.attr('th-name');
			if(!_thName || $.trim(_thName) == ''){
				_this.outLog('排序必要的参数丢失');
				return false;
			}
			//根据组合排序配置项判定：是否清除原排序样式
			if(!_this.isCombSorting){
				$.each($('.sorting-action', _table), function(i, v){
					if(v != _action.get(0)){
						$(v).removeClass('sorting-up sorting-down');
					}
				});
			}
			
			//排序操作：升序
			if(_action.hasClass('sorting-down')){
				_this.sortingCallback[_table.attr('list-manager')]({
					orderType	: 'up',
					orderFiled	: _thName
				});
				_action.addClass('sorting-up');
				_action.removeClass('sorting-down');
				_action.removeAttr('init-sorting');
				return;
			}
			//排序操作：降序
			if(!_action.hasClass('sorting-down')){
				_this.sortingCallback[_table.attr('list-manager')]({
					orderType	: 'down',
					orderFiled	: _thName
				});
				_action.addClass('sorting-down');
				_action.removeClass('sorting-up');
				return;
			}
		});
		
	}
	/*
		@绑定拖拽换位事件
		$.dom: table数组[jquery对象]
	*/
	,bindDragEvent: function(dom){
		var _this = this;
		var thList = dom.find('th'),	//匹配页面下所有的TH
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
			_divArea,		//事件源所在的DIV
			_td,			//与事件源同列的所在td
			_divPosition,	//所在DIV使用定位方式
			_dreamlandDIV;	//临时展示被移动的列
		var SIV_td;			//用于处理时实刷新造成的列表错乱
		dragAction.unbind('mousedown');	
		dragAction.bind('mousedown',function(){
			_th 			= $(this).parents('th').eq(0),		//事件源所在的th
			_prevTh			= undefined,						//事件源的上一个th
			_nextTh			= undefined,						//事件源的下一个th
			_prevTd			= undefined,						//事件源对应的上一组td
			_nextTd			= undefined,						//事件源对应的下一组td
			_tr 			= _th.parent(),						//事件源所在的tr
			_allTh 			= _tr.find('th'), 					//事件源同层级下的所有th
			_table 			= _tr.parents('table').eq(0),		//事件源所在的table
			_divArea 		= _table.parents('div').eq(0),		//事件源所在的DIV
			_td 			= _table.find('tbody')
							  .find('tr')
							  .find('td:eq('+_th.index()+')'); 	//与事件源同列的所有td
				
			//禁用文字选中效果
			$('body').addClass('no-select-text');
			
			//父级DIV使用相对定位				  
			_divPosition = _divArea.css('position');
			if(_divPosition != 'relative' && _divPosition != 'absolute'){
				_divArea.css('position','relative');
			}
			
			//处理时实刷新造成的列表错乱				
			if(_this.isRealTime){					
				_th.addClass('drag-ongoing');
				_td.addClass('drag-ongoing');
				window.clearInterval(SIV_td);
				SIV_td = window.setInterval(function(){
					_td = _table.find('tbody')
						.find('tr')
						.find('td:eq('+_th.index()+')'); 	//与事件源同列的所有td						
					_td.addClass('drag-ongoing');
				},100);
			}else{
				_th.addClass('drag-ongoing opacityChange');
				_td.addClass('drag-ongoing opacityChange');
			}
			//增加临时展示DOM
			_dreamlandDIV = $('<div class="dreamland-div"></div>');
			_divArea.append(_dreamlandDIV);
			//table table-striped smart-form为框架样式，不引用框架的情况下这些样式可以清除
			var tmpHtml = '<table class="dreamland-table '+ _table.attr('class') +'">'				
						+ '<thead>'
						+ '<tr>'
						+ '<th style="height:'+_th.height()+'px">'
						+ _th.find('.drag-action').get(0).outerHTML
						+ '</th>'
						+ '</tr>'
						+ '</thead>'
						+ '<tbody>';
			//tbody内容：将原tr与td上的属性一并带上，解决一部分样式问题			
			$.each(_td, function(i,v){
				tmpHtml += $(v).parents('tr').clone().html(v.outerHTML).get(0).outerHTML;
			});
			tmpHtml += '</tbody>'
					+ '</table>';
			_dreamlandDIV.append(tmpHtml);
			//绑定拖拽滑动事件
			_divArea.unbind('mousemove');
			_divArea.bind('mousemove', function(e2){	
				if(_th.index() != 0){ //当前移动的非第一列
					_prevTh = _allTh.eq(_th.index() - 1);
				}
				if(_th.index() != _allTh.length -1){//当前移动的非最后一列
					_nextTh = _allTh.eq(_th.index() + 1);
				}
				_dreamlandDIV.show();
				_dreamlandDIV.css({
					width	: _th.get(0).offsetWidth,
					height	: _table.get(0).offsetHeight,
					left	: e2.clientX - _divArea.offset().left 
							  + _divArea.get(0).scrollLeft 
							  + $('html').get(0).scrollLeft
							  - _th.get(0).offsetWidth / 2,
					top		: e2.clientY - _divArea.offset().top  
							  + _divArea.get(0).scrollTop + document.body.scrollTop + document.documentElement.scrollTop 
							  - _dreamlandDIV.find('th').get(0).offsetHeight / 2
				});
				if(_dreamlandDIV.get(0).offsetTop < 0){
					_dreamlandDIV.css('top', 0)
				}
				//处理向左拖拽
				if(_prevTh && _prevTh.length != 0 && _dreamlandDIV.get(0).offsetLeft < _prevTh.get(0).offsetLeft){
					_prevTd = _table.find('tbody').find('tr').find('td:eq('+_prevTh.index()+')');
					_prevTh.before(_th);
												  
					$.each(_td,function(i, v){
						_prevTd.eq(i).before(v);
					});
					_allTh = _tr.find('th'); //重置TH对象数据
				}
				//处理向右拖拽
				if(_nextTh && _nextTh.length != 0 && _dreamlandDIV.get(0).offsetLeft > _nextTh.get(0).offsetLeft){
					_nextTd = _table.find('tbody').find('tr').find('td:eq('+_nextTh.index()+')');
					_nextTh.after(_th);

					
					$.each(_td,function(i, v){
						_nextTd.eq(i).after(v);
					})	
					_allTh = _tr.find('th'); //重置TH对象数据
				}		
			});
			//绑定拖拽停止事件
			_divArea.unbind('mouseup');
			_divArea.bind('mouseup',function(){
				_divArea.unbind('mousemove');
				
				//清除临时展示被移动的列
				_dreamlandDIV = $('.dreamland-div');
				if(_dreamlandDIV.length != 0){

					_dreamlandDIV.animate({
						top	: _table.get(0).offsetTop,
						left: _th.get(0).offsetLeft
					},_this.animateTime,function(){
						_divArea.css('position',_divPosition);
						_th.removeClass('drag-ongoing');	
						_td.removeClass('drag-ongoing');							
						_dreamlandDIV.remove();	
					})
					
				}
				//缓存列表位置信息
				if(!_this.disableCache){
					_this.setToLocalStorage(_table);
				}				
				//重置调整宽度事件源
				if(_this.supportAdjust){
					_this.resetAdjust(_table);	
				}
				//重置吸顶镜像
				if(_this.supportSetTop){
				}
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
		$.dom: table数组[jquery对象]
	*/
	,bindAdjustEvent: function(dom){
		var _this = this;
		var thList 	= dom.find('th');	//页面下所有的TH
		//监听鼠标调整列宽度
		thList.off('mousedown', '.adjust-action');
		thList.on('mousedown', '.adjust-action', function(event){
			var _dragAction 	= $(this);
			var _th 			= _dragAction.parent(),				//事件源所在的th
				_tr 			= _th.parent(),						//事件源所在的tr
				_allTh 			= _tr.find('th'), 			//事件源同层级下的所有th
				_last 			= _allTh.eq(_allTh.length - 1), 	//事件源同层级倒数第一个th
				_lastButOne 	= _allTh.eq(_allTh.length - 2), 	//事件源同层级倒数第二个th
				_table 			= _tr.parents('table').eq(0),		//事件源所在的table
				_divArea 		= _table.parents('div').eq(0),		//事件源所在的DIV
				_td 			= _table.find('tbody')
								  .find('tr')
								  .find('td:eq('+_th.index()+')'), 	//与事件源同列的所在td
				adjustActionToTr= $('.adjust-action',_tr);				//事件源所在的TR下的全部调整宽度节点
			_th.addClass('adjust-selected');
			_td.addClass('adjust-selected');
			//如果初始获取缓存失败，则在mousedown时，首先存储一次数据
			if(_table.attr('cacheInitError')){
				_this.setToLocalStorage(_table, true);
				_table.removeAttr('cacheInitError');
			}
			//绑定鼠标拖动事件
			var _X = event.clientX, //记录鼠标落下的横向坐标
				_w,
				_w2,
				_nextTh;
			_tr.unbind('mousemove');
			_tr.bind('mousemove',function(e){
				_w = e.clientX - 
					_th.offset().left - 
					_th.css('padding-left').split('px')[0] - 
					_th.css('padding-right').split('px')[0];
				//限定最小值
				if(_w < _this.minNum){
					_w = _this.minNum;
				}	
				//触发源为倒数第二列时					
				if(_th.index() == _lastButOne.index()){
					_w2 = _th.width() - _w + _last.width();						 
					_last.width(_w2 < _this.minNum ? _this.minNum : _w2);
				}
				//列表总宽度小于等于容器宽度，且当前列宽度大于将要更改的宽度
				if(_table.get(0).offsetWidth == _divArea.width() && _th.width() > _w){
					_nextTh = _table.find('th').eq(_th.index() + 1);		
					_nextTh.width(_nextTh.width() + _th.width() - _w)
				}
				_th.width(_w);		
				//解决随着宽度调整，table特性会导致高度发生变化
				adjustActionToTr.hide();
				adjustActionToTr.height(_th.height());	
				adjustActionToTr.show();	
				adjustActionToTr.eq(adjustActionToTr.length - 1).hide();
			});
			
			//绑定鼠标放开、移出事件
			_tr.unbind('mouseup mouseleave');
			_tr.bind('mouseup mouseleave',function(){
				_tr.unbind('mousemove mouseleave');
				_th.removeClass('adjust-selected');
				_td.removeClass('adjust-selected');
				
				//解决随着宽度调整，table特性会导致高度发生变化
				adjustActionToTr.hide();
				adjustActionToTr.height(_th.height());	
				adjustActionToTr.show();
				adjustActionToTr.eq(adjustActionToTr.length - 1).hide();
				//缓存列表宽度信息
				if(!_this.disableCache){
					_this.setToLocalStorage(_table);
				}
			});
			return false;
		});
		
	}
	/*
		@绑定表头吸顶功能
		$.dom: table数组[jquery对象]
	*/
	,bindSetTopFunction: function(dom){
		var _this = this;
		//抽取固定值存储	
		var _t;
		$.each(dom, function(i, v){
			_t = $(v);
			_t.attr('table-offset-top', v.offsetTop);			
		});
		//绑定窗口变化事件
		$(window).resize(function() {
			console.log('winodw resize event');
			$(_this.scrollDOM).trigger('scroll');
		});
		//绑定模拟X轴滚动条
		$('.scroll-area').unbind('scroll');
		$('.scroll-area').bind('scroll', function(){
			$(this).parents('.table-div').get(0).scrollLeft = this.scrollLeft;
			this.style.left = this.scrollLeft + 'px';
		});
		//绑定滚动条事件
		$(_this.scrollDOM).bind('scroll', function(){
			var _scrollDOM = $(this),
				_tableList  = $('[list-manager]', this == window ? 'body' : _scrollDOM),
				_theadBackground,		//列表头的底色
				_tableDIV,				//列表所在的DIV,该DIV的class标识为table-div
				_tableWarp,				//列表所在的外围容器
				_setTopHead,			//吸顶元素
				_tableOffsetTop,		//列表与_tableDIV之间的间隙，如marin-top,padding-top
				_table,					//列表
				_thead,					//列表head
				_thList,				//列表下的th
				_tbody;					//列表body
			var _scrollDOMTop = _scrollDOM.scrollTop(),
				_tDIVTop = 0;
				
			if(!_tableList || _tableList.length == 0){
				return true;
			}
			var _tDivHeight = undefined, //吸顶触发后，table所在div的高度
				_tWarpMB	= undefined; //吸顶触发后,table所在外围容器的margin-bottom值
			$.each(_tableList, function(i, v){
				_table 			= $(v);
				_tableDIV 		= _table.parents('.table-div').eq(0);
				_tableWarp 		= _tableDIV.parents('.table-warp').eq(0);
				_thead 			= $('thead[class!="set-top"]', v);
				_tbody 			= $('tbody', v);
				if(!_tableDIV || _tableDIV.length == 0){
					return true;
				}
				_tDIVTop 		= _tableDIV.offset().top;
				_tableOffsetTop = parseInt(_table.attr('table-offset-top'));
				_setTopHead 	= $('.set-top', _table);
				//当前列表数据为空
				if($('tr', _tbody).length == 0){
					return true;
				}
				
				//配置X轴滚动条浮动: 计算 table-div 的 marginBottom 与table-warp 的height
				var scrollArea = $('.scroll-area', _tableWarp);
				_tWarpMB = Number(_tableDIV.height()) + Number(_tableWarp.css('margin-bottom').split('px')[0]) 
						  - window.scrollY - (window.innerHeight - _tableDIV.offset().top);
				_tDivHeight = window.innerHeight - _tableDIV.offset().top + window.scrollY; 
				if(_tWarpMB < 0){
					_tWarpMB = 0;
					_tDivHeight = 'auto'
				}
				$('.sa-inner', scrollArea).css({
					width:_table.width()
				});
				scrollArea.css('bottom', _tWarpMB - 18);
				
				//表头完全可见
				if(_tDIVTop - _scrollDOMTop >= -_tableOffsetTop){		
					if(_thead.hasClass('scrolling')){
						_thead.removeClass('scrolling');
					}
					_setTopHead.remove();
					return true;
				}	
				//表完全不可见
				if(_tDIVTop - _scrollDOMTop < 0 
					&& Math.abs(_tDIVTop - _scrollDOMTop) + _thead.height() - _tableOffsetTop 
					> _tableDIV.height()){		
					_setTopHead.show();
					_setTopHead.css({
						top:'auto',
						bottom:'0px'
					});
					return true;
				}			
				//配置表头镜像
				if(_setTopHead.length == 0){
					_table.append(_thead.clone(false).addClass('set-top'));
					_setTopHead = $('.set-top', _table);
					_setTopHead.css({
						width:_table.width()
					});
						
					//调整吸顶表头下每一个th的宽度[存在性能问题，后期需优化]	
					_thList = $('th', _thead);
					$.each($('th', _setTopHead), function(i, v){
						$(v).width(_thList.eq(i).width());
					});
				}
				if(!_setTopHead.css('background') ||
					_setTopHead.css('background') == '' ||
					_setTopHead.css('background') == 'none'){
					_setTopHead.css('background', '#f5f5f5');
				}
				
				//表部分可见
				if(_tDIVTop - _scrollDOMTop < 0 
					&& Math.abs(_tDIVTop - _scrollDOMTop) <= _tableDIV.height() +_tableOffsetTop){		
					if(!_thead.hasClass('scrolling')){
						_thead.addClass('scrolling');
					}
					_setTopHead.css({
						top:_scrollDOMTop - _tDIVTop,
						bottom:'auto'
					});
					_setTopHead.show();
					return true;
				}
			});	
			return true;		
		});
		$(_this.scrollDOM).trigger('scroll');
	}
	/*
		@重置宽度调整事件源
		用于禁用最后一列调整宽度事件
		$._table_:table对象[jquery对象]
	*/
	,resetAdjust: function(_table_,aa){
		var _this = this;
		var _table = $(_table_),
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
		$._table_:table对象[jquery对象]
		$.isInit: 是否为初始存储缓存[用于处理宽度在特定情况下发生异常]
	*/
	,setToLocalStorage: function(_table_, isInit){
		var _this = this;
		if(!window.localStorage){
			_this.outLog('当前浏览器不支持：localStorage');
			return false;
		}
		if(!_table_ || _table_.length == 0){
			_this.outLog('setToLocalStorage:无效的table');
			return false;
		}
		var key = _table_.attr('list-manager');
		if(!key || $.trim(key) == ''){
			_this.outLog('setToLocalStorage:无效的key');
			return false;
		}
		var _data = '',
			_array	= new Array(),
			_onlyTh = new Object();
		var thList = $('thead th', _table_);
		if(!thList || thList.length == 0){
			_this.outLog('setToLocalStorage:无效的thList,请检查是否正确配置table,thead,th');
			return false;
		}
		$.each(thList, function(i, v){
			v = $(v);
			_onlyTh = new Object();
			_onlyTh.th_name = v.attr('th-name');
			if(_this.supportDrag){
				_onlyTh.th_index = v.index();
			}
			if(_this.supportAdjust){
				isInit ? v.css('width',v.css('width')) : '';   //用于处理宽度在特定情况下发生异常
				_onlyTh.th_width = v.css('width');
			}
			if(_this.supportConfig){
				_onlyTh.isShow = $('.config-area li[th-name="'+ _onlyTh.th_name +'"]', _table_.parents('.table-warp')
								.eq(0)).find('input[type="checkbox"]').get(0).checked;
			}
			_array.push(JSON.stringify(_onlyTh));
		});
		_data = _array.join('__');
		window.localStorage.setItem(key,_data);
		return _data;
	}
	/*
		@获取本地缓存
		$._table_:table对象[jquery对象]
	*/
	,getLocalStorage: function(_table_){
		var _this = this;
		if(!window.localStorage){
			_this.outLog('当前浏览器不支持：localStorage');
			return false;
		}
		if(!_table_ || _table_.length == 0){
			_this.outLog('getLocalStorage:无效的table');
			return false;
		}
		var _table = $(_table_);
		var _key = _table.attr('list-manager');
		if(!_key || $.trim(_key) == ''){ //key为空或无效
			_this.outLog('getLocalStorage:无效的key');
			return false;
		}
		var _data = new Object(),
			_array = new Array(),
			_localStorage = window.localStorage.getItem(_key);
		 //如无数据，增加属性标识：cacheInitError
		if(!_localStorage){
			_table.attr('cacheInitError','error');
			return false;
		}
		_array = _localStorage.split('__');
		_data.key = _key;
		_data.cache = _array;
		return _data;
	}
	/*
		@根据本地缓存配置列表[thead]
		$.dom: table数组[jquery对象]
		获取本地缓存
		存储原位置顺序
		根据本地缓存进行配置
	*/
	,configurationListForCache: function(dom){
		var _this = this;
		var _data,	//本地缓存的数据
			_table,		//单一的table
			_th,		//单一的th
			_td,		//单列的td，与_th对应
			_thList,	//同table下的所有th
			_cache,		//列表的缓存数据
			_thJson,	//th的缓存json
			_thArray,
			_tbodyArray,
			_domArray;
		$.each(dom, function(i, v){
			_domArray = [];
			_table = $(v);
			_data = _this.getLocalStorage(_table);
			_thList = _table.find('thead').find('th');
			//存储原HTML排序
			_table.data('original', _thList);	
			if(!_data || $.isEmptyObject(_data)){
				_this.outLog('configurationListForCache:获取的本地缓存信息失败，如果该列表未曾做过调整，那这是正常的');
				return false;
			}
			_cache = _data.cache;
			if(_cache.length != _table.find('thead th').length){
				_this.outLog('configurationListForCache:缓存数据与HTML结构不符，停止使用该缓存');
				window.localStorage.removeItem(_table.attr('list-manager'));
				return false;
			}
			$.each(_cache, function(i2, v2){
				_thJson = $.parseJSON(v2);
				_th = $('th[th-name='+ _thJson.th_name +']', _table);
				//配置列的宽度
				if(_this.supportAdjust){
					_th.css('width',_thJson.th_width);
				}
				//配置列排序数据
				if(_this.supportDrag){
					_domArray[_thJson.th_index]	 = _th;
				}
				//配置列的可见
				if(_this.supportConfig){
					_this.setAreVisible(_th, typeof(_thJson.isShow) == 'undefined' ? true : _thJson.isShow, true);
				}
			});
			//配置列的排序
			if(_this.supportDrag){
				_table.find('thead tr').html(_domArray);
				_this.resetTd(_table, false);
			}
			//重置调整宽度事件源
			if(_this.supportAdjust){
				_this.resetAdjust(_table, 1);	
			}
		});
	}
	/*
		@bindDomInseredEvent
		绑定DOM节点变更监听事件
		在DOM节点发生变化时，对listManager所管理的列表进行调整		
		@baukh20150403:该方法之后应该将resetTd方法内置于listManager中。将resetTd在用户代码中清除。
	*/
	,bindDomInseredEvent: function(dom){	
		var _this = this;	
		var	_dom = $(dom);//the element I want to monitor
		
		var _dniSTO,
			_table;
		_dom.unbind('DOMNodeInserted');
		_dom.bind('DOMNodeInserted', function(e){
			_table = $(this);
			window.clearTimeout(_dniSTO);
			_dniSTO = window.setTimeout(function(){
				//重置调整宽度事件源
				if(_this.supportAdjust){
					_this.resetAdjust(_table);	
				}
				//重置显示隐藏
				if(_this.supportConfig){
					var _th = $('th:hidden', _table);
					_this.setAreVisible(_th, false, true);
				}
			},50);	
		});			 
	}
	/*
		@根据本地缓存重置列表[tbody]
		这个方法对外可以直接调用
		作用：处理局部刷新、分页事件之后的tb排序
		$.dom: table数组[jquery对象]
		$.isSingleRow: 指定是否是tr节点[布尔值]
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
		var _thList = _table.data('original'),
			_td,
			_tmpHtml = [],
			_tdArray = [];
		if(!_thList || _thList.length == 0 ){
			_this.outLog('resetTdForCache:td排序所必须的原序列数据获取失败');
			return false;
		}
		if(!_tr || _tr.length == 0){
			return false;
		}
		$.each(_tr, function(i, v){
			_tmpHtml[i] = $(v);
			_td = $(v).find('td');
			$.each(_td, function(i2, v2){				
				_tdArray[_thList.eq($(v2).index()).index()] = v2;
			});
			_tmpHtml[i].html(_tdArray);
		});	
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
		@输出日志
	*/
	,outLog: function(msg){
		if(this.isDevelopMode){
			console.log(msg);
		}
	}
}
//	return listManager;
//});