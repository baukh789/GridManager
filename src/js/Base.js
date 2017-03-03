/*
 * Base: 基础方法
 * */
import $ from './jTool';
const Base = {
	/*
	 @输出日志
	 type: 输出分类[info,warn,error]
	 */
	outLog: function(msg, type){
		if(!type){
			console.log('GridManager:', msg);
		}
		else if(type === 'info'){
			console.info('GridManager Info: ', msg);
		}
		else if(type === 'warn'){
			console.warn('GridManager Warn: ', msg);
		}
		else if(type === 'error'){
			console.error('GridManager Error: ', msg);
		}
		return msg;
	}
	/*
	 [对外公开方法]
	 @显示Th及对应的TD项
	 table: table [jTool Object]
	 th: th
	 */
	,showTh: function(table, th){
		this.setAreVisible($(th), true);
	}
	/*
	 [对外公开方法]
	 @隐藏Th及对应的TD项
	 table: table
	 th:th
	 */
	,hideTh: function(table, th){
		this.setAreVisible($(th), false);
	}
	/*
	 * @获取与 th 同列的 td jTool 对象, 该方法的调用者只允许为 Th
	 * $.th: jTool th
	 * */
	,getColTd: function(th) {
		const tableWrap = th.closest('.table-wrap'),
			    thIndex = th.index(),
			     trList = $('tbody tr', tableWrap);

		let tdList = [],
		    _td;
		$.each(trList, (i, v) => {
			_td = $('td', v).get(thIndex);
			if(_td){
				tdList.push(_td);
			}
		});
		return $(tdList);
	}
	/*
	 @设置列是否可见
	 $._thList_	： 即将配置的列所对应的th[jTool object，可以是多个]
	 $._visible_: 是否可见[Boolean]
	 $.cb		: 回调函数
	 */
	,setAreVisible: function(_thList_, _visible_ ,cb){
		let _table,			//当前所在的table
			_tableWarp, 	//当前所在的容器
			_th,			//当前操作的th
			_trList, 		//当前tbody下所有的tr
			_tdList = [], 	//所对应的td
			_checkLi,		//所对应的显示隐藏所在的li
			_checkbox;		//所对应的显示隐藏事件
		$.each(_thList_, (i, v) => {
			_th = $(v);
			_table = _th.closest('table');
			_tableWarp = _table.closest('.table-wrap');
			_trList = $('tbody tr', _table);
			_checkLi = $('.config-area li[th-name="'+ _th.attr('th-name') +'"]', _tableWarp);
			_checkbox = _checkLi.find('input[type="checkbox"]');
			if(_checkbox.length == 0){
				return;
			}
			$.each(_trList, (i2, v2) => {
				_tdList.push($(v2).find('td').get(_th.index()));
			});
			//显示
			if(_visible_){
				_th.attr('th-visible','visible');
				$.each(_tdList, (i2, v2) => {
					$(v2).show();
				});
				_checkLi.addClass('checked-li');
				_checkbox.prop('checked', true);
			}
			//隐藏
			else{
				_th.attr('th-visible','none');
				$.each(_tdList, (i2, v2) => {
					$(v2).hide();
				});
				_checkLi.removeClass('checked-li');
				_checkbox.prop('checked', false);
			}
			typeof(cb) == 'function' ? cb() : '';
		});
	}

	/*
	 @获取TH宽度
	 $.element: th
	 */
	,getTextWidth: function(element){
		const th 	= $(element);
		const thWarp 		= $('.th-wrap', th),  			//th下的GridManager包裹容器
			thText	 		= $('.th-text', th),			//文本所在容器
			remindAction	= $('.remind-action', thWarp),	//提醒所在容器
			sortingAction	= $('.sorting-action', thWarp);	//排序所在容器

		//文本镜象 用于处理实时获取文本长度
		const tableWrap = th.closest('.table-wrap');
		const textDreamland	= $('.text-dreamland', tableWrap);
		//将th文本嵌入文本镜象 用于获取文本实时宽度
		textDreamland.text(thText.text());
		textDreamland.css({
			fontSize 	: thText.css('font-size'),
			fontWeight	: thText.css('font-weight'),
			fontFamily	: thText.css('font-family')
		});
		const thPaddingLeft = thWarp.css('padding-left'),
			thPaddingRight = thWarp.css('padding-right');
		const thWidth = textDreamland.width()
			+ (thPaddingLeft ? thPaddingLeft : 0)
			+ (thPaddingRight ? thPaddingRight : 0)
			+ (remindAction.length == 1 ? 20 : 5)
			+ (sortingAction.length == 1 ? 20 : 5);
		return thWidth;
	}
	,showLoading: function (dom ,cb) {
		if (!dom || dom.length === 0) {
			return;
		}
		const loading = dom.find('.load-area');
		if (loading.length > 0) {
			loading.remove();
		}
		const loadingDom= $('<div class="load-area loading"><div class="loadInner kernel"></div></div>');
		dom.append(loadingDom);

		//进行loading图标居中显示
		const loadInner = dom.find('.load-area').find('.loadInner');
		const domHeight = dom.height(),
			loadInnerHeight = loadInner.height();
		loadInner.css('margin-top', (domHeight - loadInnerHeight) / 2);
		window.setTimeout(function(){
			typeof(cb) === 'function' ? cb() : '';
		}, 100);
	},
	hideLoading: function (dom, cb) {
		if (!dom || dom.length === 0) {
			return;
		}
		window.setTimeout(function(){
			$('.load-area', dom).remove();
			typeof(cb) === 'function' ? cb() : '';
		}, 500);
	}
};
export default Base;
