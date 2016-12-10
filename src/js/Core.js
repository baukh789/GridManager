/*
* Core: 核心方法
* */
import Base from './Base';
import DOM from './DOM';
import Cache from './Cache';
import Settings from './Settings';
import AjaxPage from './AjaxPage';
import Menu from './Menu';
const Core= {
	/*
	 [对外公开方法]
	 @刷新表格 使用现有参数重新获取数据，对表格数据区域进行渲染
	 $.table:当前操作的grid,由插件自动传入
	 $.gotoFirstPage:  是否刷新时跳转至第一页
	 $.callback: 回调函数
	 */
	refreshGrid: function(table, gotoFirstPage, callback){
		var _this = this;
		if(typeof(gotoFirstPage) !== 'boolean'){
			callback = gotoFirstPage;
			gotoFirstPage = false;
		}
		if(gotoFirstPage){
			Settings.pageData['cPage'] = 1;
		}
		_this.__refreshGrid(callback);
	}
	/*
	 @刷新表格 使用现有参数重新获取数据，对表格数据区域进行渲染
	 $.callback: 回调函数
	 */
	,__refreshGrid: function(callback){
		var _this = this;
		var tableDOM = $('table[grid-manager="'+ Settings.gridManagerName +'"]'),		//table dom
			tbodyDOM = $('tbody', tableDOM),	//tbody dom
			refreshAction = $('.page-toolbar .refresh-action', tableDOM.closest('.table-wrap')); //刷新按纽
		//增加刷新中标识
		refreshAction.addClass('refreshing');
		/*
		 使用配置数据
		 如果存在配置数据ajax_data,将不再通过ajax_rul进行数据请求
		 且ajax_beforeSend、ajax_error、ajax_complete将失效，仅有ajax_success会被执行
		 */
		if(Settings.ajax_data){
			driveDomForSuccessAfter(Settings.ajax_data);
			Settings.ajax_success(Settings.ajax_data);
			removeRefreshingClass();
			typeof callback === 'function' ? callback() : '';
			return;
		}
		if(typeof(Settings.ajax_url) != 'string' || Settings.ajax_url === ''){
			Settings.outLog('请求表格数据失败！参数[ajax_url]配制错误', 'error');
			removeRefreshingClass();
			typeof callback === 'function' ? callback() : '';
			return;
		}
		var parme = $.extend({}, Settings.query);
		//合并分页信息至请求参
		if(Settings.supportAjaxPage){
			$.extend(parme, Settings.pageData);
		}
		//合并排序信息至请求参
		if(Settings.supportSorting){
			$.extend(parme, Settings.sortData);
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
			url: Settings.ajax_url,
			type: Settings.ajax_type,
			data: parme,
			cache: true,
			beforeSend: function(XMLHttpRequest){
				Settings.ajax_beforeSend(XMLHttpRequest);
			},
			success: function(response){
				driveDomForSuccessAfter(response);
				Settings.ajax_success(response);
			},
			error: function(XMLHttpRequest, textStatus, errorThrown){
				Settings.ajax_error(XMLHttpRequest, textStatus, errorThrown);
			},
			complete: function(XMLHttpRequest, textStatus){
				Settings.ajax_complete(XMLHttpRequest, textStatus);
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
				Base.outLog('请求数据失败！请查看配置参数[ajax_url或ajax_data]是否配置正确，并查看通过该地址返回的数据格式是否正确', 'error');
				return;
			}

			var tbodyTmpHTML = '';	//用于拼接tbody的HTML结构
			var parseRes = typeof(response) === 'string' ? JSON.parse(response) : response;
			var _data = parseRes[Settings.dataKey];
			var key,	//数据索引
				alignAttr, //文本对齐属性
				template,//数据模板
				templateHTML;//数据模板导出的html
			Cache.cacheData = {};
			//数据为空时
			if(!_data ||_data.length === 0){
				tbodyTmpHTML = '<tr emptyTemplate>'
					+ '<td colspan="'+$('th[th-visible="visible"]', tableDOM).length+'">'
					+ (Settings.emptyTemplate || '<div class="gm-emptyTemplate">数据为空</div>')
					+ '</td>'
					+ '</tr>';
				parseRes.totals = 0;
				tbodyDOM.html(tbodyTmpHTML);
			}else {
				$.each(_data, function(i, v){
					Cache.cacheData[i] = v;
					tbodyTmpHTML += '<tr cache-key="'+ i +'">';
					$.each(Settings.columnData, function(i2, v2){
						key = v2.key;
						template = v2.template;
						templateHTML = typeof template === 'function' ? template(v[key], v) : v[key];
						alignAttr = v2.align ? 'align="'+v2.align+'"' : '';
						tbodyTmpHTML += '<td '+ alignAttr +'>'+ templateHTML +'</td>';
					});
					tbodyTmpHTML += '</tr>';
				});
				tbodyDOM.html(tbodyTmpHTML);
				DOM.resetTd(tableDOM, false);
			}
			//渲染分页
			if(Settings.supportAjaxPage){
				AjaxPage.resetPageData(tableDOM, parseRes[Settings.totalsKey]);
				Menu.checkMenuPageAction();
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
	,setQuery: function(table, query){
		table.GridManager('get')['query'] = query;
	}

};
export default Core;
