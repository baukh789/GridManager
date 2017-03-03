/*
* DOM: 表格DOM相关操作
* */
import $ from './jTool';
import Adjust from './Adjust';
import AjaxPage from './AjaxPage';
import Cache from './Cache';
import Config from './Config';
import Checkbox from './Checkbox';
import Base from './Base';
import Export from './Export';
import Order from './Order';
import Remind from './Remind';
import Sort from './Sort';
const DOM = {
	/*
	 @渲染HTML，根据配置嵌入所需的事件源DOM
	 $.table: table[jTool对象]
	 */
	createDOM: function(table){
		let Settings = Cache.getSettings(table);
		table.attr('width', '100%').attr('cellspacing', 1).attr('cellpadding', 0).attr('grid-manager', Settings.gridManagerName);
		var theadHtml = '<thead grid-manager-thead>',
			tbodyHtml = '<tbody></tbody>',
			alignAttr = '', 				//文本对齐属性
			widthHtml = '',					//宽度对应的html片段
			remindHtml = '',				//提醒对应的html片段
			sortingHtml	= '';				//排序对应的html片段
		//通过配置项[columnData]生成thead
		$.each(Settings.columnData, function(i, v){
			// 表头提醒
			if(Settings.supportRemind && typeof(v.remind) === 'string' && v.remind !== ''){
				remindHtml = 'remind="' + v.remind +'"';
			}
			// 排序
			sortingHtml = '';
			if(Settings.supportSorting && typeof(v.sorting) === 'string'){
				if(v.sorting === Settings.sortDownText){
					sortingHtml = 'sorting="' + Settings.sortDownText +'"';
					Settings.sortData[v.key] = Settings.sortDownText
				}
				else if(v.sorting === Settings.sortUpText){
					sortingHtml = 'sorting="' + Settings.sortUpText +'"';
					Settings.sortData[v.key] = Settings.sortUpText
				}else {
					sortingHtml = 'sorting=""';
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
		if(Settings.supportAutoOrder){
			Order.initDOM(table);
		}
		//嵌入选择返选DOM
		if(Settings.supportCheckbox){
			Checkbox.initDOM(table);
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
		if(Settings.supportAjaxPage){
			var	_ajaxPageHtml= AjaxPage.html();
		}
		var	wrapHtml,                       //外围的html片段
			tableWarp,						//单个table所在的DIV容器
			onlyThead,						//单个table下的thead
			onlyThList,						//单个table下的TH
			onlyTH,							//单个TH
			onlyThWarp,						//单个TH下的上层DIV
			remindDOM,						//表头提醒DOM
			adjustDOM,						//调整宽度DOM
			sortingDom,						//排序DOM
			sortType,						//排序类形
			isLmOrder,						//是否为插件自动生成的序号列
			isLmCheckbox;					//是否为插件自动生成的选择列

		//根据配置使用默认的表格样式
		if(Settings.useDefaultStyle){
			table.addClass('grid-manager-default');
		}
		onlyThead = $('thead', table);
		onlyThList = $('th', onlyThead);
		wrapHtml = `<div class="table-wrap"><div class="table-div" style="height: ${Settings.height}"></div><span class="text-dreamland"></span></div>`;
		table.wrap(wrapHtml);
		tableWarp = table.closest('.table-wrap');
		//嵌入配置列表DOM
		if(Settings.supportConfig){
			tableWarp.append(_configHtml);
		}
		//嵌入Ajax分页DOM
		if(Settings.supportAjaxPage){
			tableWarp.append(_ajaxPageHtml);
			AjaxPage.initAjaxPage(table);
		}
		//嵌入导出表格数据事件源
		if(Settings.supportExport){
			tableWarp.append(exportActionHtml);
		}
		$.each(onlyThList, function(i2,v2){
			onlyTH = $(v2);
			onlyTH.attr('th-visible','visible');
			//是否为自动生成的序号列
			if(Settings.supportAutoOrder && onlyTH.attr('gm-order') === 'true') {
				isLmOrder = true;
			}
			else{
				isLmOrder = false;
			}

			//是否为自动生成的选择列
			if(Settings.supportCheckbox && onlyTH.attr('gm-checkbox') === 'true') {
				isLmCheckbox = true;
			}else{
				isLmCheckbox = false;
			}

			onlyThWarp = $('<div class="th-wrap"></div>');
			//嵌入配置列表项
			if(Settings.supportConfig){
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
			if(Settings.supportDrag && !isLmOrder && !isLmCheckbox){
				onlyThWarp.html('<span class="th-text drag-action">'+onlyTH.html()+'</span>');
			}else{
				onlyThWarp.html('<span class="th-text">'+ onlyTH.html() +'</span>');
			}
			var onlyThWarpPaddingTop = onlyThWarp.css('padding-top');
			//嵌入表头提醒事件源
			//插件自动生成的排序与选择列不做事件绑定
			if(Settings.supportRemind && onlyTH.attr('remind') != undefined && !isLmOrder && !isLmCheckbox){
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
			if(Settings.supportSorting && sortType!= undefined && !isLmOrder && !isLmCheckbox){
				sortingDom = $(_sortingHtml);
				//依据 sortType 进行初始显示
				switch(sortType){
					case Settings.sortUpText:
						sortingDom.addClass('sorting-up');
						break;
					case Settings.sortDownText:
						sortingDom.addClass('sorting-down');
						break;
					default :
						break;
				}
				if(onlyThWarpPaddingTop != ''  && onlyThWarpPaddingTop != '0px'){
					sortingDom.css('top', onlyThWarpPaddingTop);
				}
				onlyThWarp.append(sortingDom);
			}
			//嵌入宽度调整事件源,插件自动生成的选择列不做事件绑定
			if(Settings.supportAdjust && !isLmOrder && !isLmCheckbox){
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
			// 宽度配置: GM自动创建为固定宽度
			if(isLmOrder || isLmCheckbox){
				onlyTH.width(50);
			}
			// 宽度配置: 非GM自动创建的列
			else {
				// 当前列被手动配置了宽度
				if(thWidthForConfig && thWidthForConfig !== ''){
					onlyTH.width(thWidthForConfig);
					onlyTH.removeAttr('width');
				}
				// 当前列宽度未进行手动配置
				else{
					var _minWidth = Base.getTextWidth(onlyTH); //当前th文本所占宽度大于设置的宽度
					//重置width 防止auto现象
					var _oldWidth = onlyTH.width();
					onlyTH.width(_oldWidth > _minWidth ? _oldWidth : _minWidth);
				}
			}
		});
		//删除渲染中标识、增加渲染完成标识
		table.removeClass('GridManager-loading');
		table.addClass('GridManager-ready');
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
		let Settings = Cache.getSettings(_table);
		//重置表格序号
		if(Settings.supportAutoOrder){
			var _pageData = Settings.pageData;
			var onlyOrderTd = undefined,
				_orderBaseNumber = 1,
				_orderText;
			//验证是否存在分页数据
			if(_pageData && _pageData['pSize'] && _pageData['cPage']){
				_orderBaseNumber = _pageData.pSize * (_pageData.cPage - 1) + 1;
			}
			$.each(_tr, function(i, v){
				_orderText = _orderBaseNumber + i;
				onlyOrderTd = $('td[gm-order="true"]', v);
				if(onlyOrderTd.length == 0){
					$(v).prepend('<td gm-order="true" gm-create="true">'+ _orderText +'</td>');
				}else{
					onlyOrderTd.text(_orderText);
				}
			});
		}
		//重置表格选择 checkbox
		if(Settings.supportCheckbox){
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
		//依据存储数据重置td顺序
		if(Settings.supportDrag){
			var _thCacheList = Cache.getOriginalThDOM(_table),
				_td;
			if(!_thCacheList || _thCacheList.length == 0 ){
				Base.outLog('resetTdForCache:列位置重置所必须的原TH DOM获取失败', 'error');
				return false;
			}
			var _tdArray = [];
			$.each(_tr, function(i, v){
				_tdArray = [];
				_td = $('td', v);
				$.each(_td, function(i2, v2){
					_tdArray[_thCacheList.eq(i2).index()] = v2.outerHTML;
				});
				v.innerHTML = _tdArray.join('');
			});
		}
		//依据配置对列表进行隐藏、显示
		if(Settings.supportConfig){
			Base.setAreVisible($('[th-visible="none"]'), false ,true);
		}
	}
};
export default DOM;
