/*
 * Adjust: 宽度调整
 * */
import $ from './jTool';
import Cache from './Cache';
import Base from './Base';
import Settings from './Settings';
var Adjust = {
	html: function () {
		var html = '<span class="adjust-action"></span>';
		return html;
	}
	/*
	 @绑定宽度调整事件
	 $.table: table [jTool object]
	 */
	,bindAdjustEvent: function(table){
		var thList 	= $('thead th', table);	//table下的TH
		//监听鼠标调整列宽度
		thList.off('mousedown', '.adjust-action');
		thList.on('mousedown', '.adjust-action', function(event){
			var _dragAction 	= $(this);
			var _th 			= _dragAction.closest('th'),		        //事件源所在的th
				_tr 			= _th.parent(),								//事件源所在的tr
				_table 			= _tr.closest('table'),			            //事件源所在的table
				_tableDiv 		= _table.closest('.table-div'),	            //事件源所在的DIV
				_allTh 			= _tr.find('th[th-visible="visible"]'),		//事件源同层级下的所有th
				_nextTh			= _allTh.eq(_th.index() + 1),				//事件源下一个可视th
				_last 			= _allTh.eq(_allTh.length - 1), 			//事件源同层级倒数第一个th
				_lastButOne 	= _allTh.eq(_allTh.length - 2), 			//事件源同层级倒数第二个th
				_td 	    	= Base.getRowTd(_th);                           //存储与事件源同列的所有td
			// 宽度调整触发回调事件
			Settings.adjustBefore(event);
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
			var _w,
				_w2;
			var _realWidthForThText = Base.getTextWidth(_th);
			_table.unbind('mousemove');
			_table.bind('mousemove',function(e){
				_w = e.clientX -
					_th.offset().left -
					_th.css('padding-left') -
					_th.css('padding-right');
				//限定最小值
				if(_w < _realWidthForThText){
					_w = _realWidthForThText;
				}
				//触发源为倒数第二列时 缩小倒数第一列
				if(_th.index() == _lastButOne.index()){
					_w2 = _th.width() - _w + _last.width();
					_last.width(Math.ceil(_w2 < _realWidthForThText ? _realWidthForThText : _w2));
				}
				_th.css('width', Math.ceil(_w));
				//_isSame:table的宽度与table-div宽度是否相同
				//Chrome下 宽度会精确至小数点后三位 且 使用width时会进行四舍五入，需要对其进行特殊处理 宽度允许相差1px
				var _isSame  = $.isChrome() ?
					(_table.get(0).offsetWidth == _tableDiv.width() || _table.get(0).offsetWidth == _tableDiv.width() + 1 || _table.get(0).offsetWidth == _tableDiv.width() - 1)
					: _table.get(0).offsetWidth == _tableDiv.width();
				//table宽度与table-div宽度相同 且 当前处理缩小HT宽度操作时
				if(_isSame && _th.width() > _w){
					_nextTh.width(Math.ceil(_nextTh.width() + _th.width() - _w))
				}
				//重置镜像滚动条的宽度
				// if(Settings.supportScroll){
				// 	$(Settings.scrollDOM).trigger('scroll');
				// }
			});

			//绑定鼠标放开、移出事件
			_table.unbind('mouseup mouseleave');
			_table.bind('mouseup mouseleave',function(){
				_table.unbind('mousemove mouseleave');
				_th.removeClass('adjust-selected');
				_td.removeClass('adjust-selected');
				//重置镜像滚动条的宽度
				// if(Settings.supportScroll){
				// 	$(Settings.scrollDOM).trigger('scroll');
				// }
				//缓存列表宽度信息
				Cache.setToLocalStorage(_table);
				// 宽度调整成功回调事件
				Settings.adjustAfter(event);
			});
			return false;
		});
	}
	/*
	 @通过缓存配置成功后, 重置宽度调整事件源dom
	 用于禁用最后一列调整宽度事件
	 $.table:table
	 */
	,resetAdjust: function(table){
		var _table = $(table),
			_thList = $('thead [th-visible="visible"]', _table),
			_adjustAction = $('.adjust-action', _thList);
		if(!_adjustAction || _adjustAction.length == 0){
			return false;
		}
		_adjustAction.show();
		_adjustAction.eq(_adjustAction.length - 1).hide();
	}
};
export default Adjust;
