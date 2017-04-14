/*
 * Adjust: 宽度调整
 * */
import $ from './jTool';
import Cache from './Cache';
import Base from './Base';
const Adjust = {
	html: function () {
		return '<span class="adjust-action"></span>';
	}
	/*
	 @绑定宽度调整事件
	 $table: table [jTool object]
	 */
	,bindAdjustEvent: function($table){
		// table下的TH
		const thList 	= $('thead th', $table);
		// 监听鼠标调整列宽度
		thList.off('mousedown', '.adjust-action');
		thList.on('mousedown', '.adjust-action', function(event) {
			const Settings = Cache.getSettings($table);
			const _dragAction = $(this);
			// 事件源所在的th
			let _th = _dragAction.closest('th');

			// 事件源所在的tr
			let _tr = _th.parent();

			// 事件源所在的table
			let	_table = _tr.closest('table');

			// 事件源同层级下的所有th
			let	_allTh = _tr.find('th[th-visible="visible"]');

			// 事件源下一个可视th
			let	_nextTh = _allTh.eq(_th.index(_allTh) + 1);

			// 存储与事件源同列的所有td
			let	_td = Base.getColTd(_th);

			// 宽度调整触发回调事件
			Settings.adjustBefore(event);

			//增加宽度调整中样式
			_th.addClass('adjust-selected');
			_td.addClass('adjust-selected');

			//绑定鼠标拖动事件
			let _thWidth,
				_NextWidth;
			let _thMinWidth = Base.getTextWidth(_th),
				_NextThMinWidth = Base.getTextWidth(_nextTh);
			_table.unbind('mousemove');
			_table.bind('mousemove', function(event) {
				_thWidth = event.clientX -
					_th.offset().left -
					_th.css('padding-left') -
					_th.css('padding-right');
				_thWidth = Math.ceil(_thWidth);
				_NextWidth = _nextTh.width() + _th.width() - _thWidth;
				_NextWidth = Math.ceil(_NextWidth);
				//限定最小值
				if(_thWidth < _thMinWidth){
					_thWidth = _thMinWidth;
				}
				if(_NextWidth < _NextThMinWidth){
					_NextWidth = _NextThMinWidth;
				}
				// 验证是否更改
				if(_thWidth === _th.width()){
					return;
				}
				// 验证宽度是否匹配
				if(_thWidth + _NextWidth < _th.width() + _nextTh.width()){
					_NextWidth = _th.width() + _nextTh.width() - _thWidth;
				}
				_th.width(_thWidth);
				_nextTh.width(_NextWidth);
			});

			// 绑定鼠标放开、移出事件
			_table.unbind('mouseup mouseleave');
			_table.bind('mouseup mouseleave', function(event) {
				const Settings = Cache.getSettings($table);
				_table.unbind('mousemove mouseleave');
				// 存储用户记忆
				Cache.saveUserMemory(_table);
				if(_th.hasClass('adjust-selected')) {  // 其它操作也在table以该事件进行绑定,所以通过class进行区别
					// 宽度调整成功回调事件
					Settings.adjustAfter(event);
				}
				_th.removeClass('adjust-selected');
				_td.removeClass('adjust-selected');
			});
			return false;
		});
		return this;
	}
	/*
	 @通过缓存配置成功后, 重置宽度调整事件源dom
	 用于禁用最后一列调整宽度事件
	 $.table: table[jTool Object]
	 */
	,resetAdjust: function($table){
		if(!$table || $table.length == 0){
			return false;
		}
		let _thList = $('thead [th-visible="visible"]', $table),
			_adjustAction = $('.adjust-action', _thList);
		if(!_adjustAction || _adjustAction.length == 0){
			return false;
		}
		_adjustAction.show();
		_adjustAction.eq(_adjustAction.length - 1).hide();
	}
};
export default Adjust;
