/*
 * Scroll: 滚动轴
 * */
import $ from './jTool';
const Scroll = {
	initDOM: function () {
		return '';
		// return '<div class="scroll-area"><div class="sa-inner"></div></div>';
	}
	/*
	 @绑定表格滚动轴功能
	 $.table: table [jTool object]
	 */
	,bindScrollFunction: function(table){
		var _tableDIV = table.closest('.table-div'),	//列表所在的DIV,该DIV的class标识为table-div
			_tableWarp = _tableDIV.closest('.table-wrap');//列表所在的外围容器
		//绑定窗口变化事件
		// window.onresize = function () {
		// 	$('.table-div').trigger('scroll', [true]);
		// };

		//绑定滚动条事件
		_tableDIV.unbind('scroll');
		_tableDIV.bind('scroll', function(e, _isWindowResize_){
			var _scrollDOMTop = $(this).scrollTop();
			_tableDIV 		= table.closest('.table-div');
			_tableWarp 		= _tableDIV.closest('.table-wrap');
			var _thead 		= $('thead[grid-manager-thead]', table);  //列表head
			var _tbody 		= $('tbody', table); //列表body
			var _setTopHead = $('.set-top', table); //吸顶元素
			//当前列表数据为空
			if($('tr', _tbody).length == 0){
				return true;
			}

			//配置吸顶区的宽度
			if(_setTopHead.length == 0 || _isWindowResize_){
				_setTopHead.length == 0 ? table.append(_thead.clone(true).addClass('set-top')) : '';
				_setTopHead = $('.set-top', table);
				_setTopHead.removeAttr('grid-manager-thead');
				_setTopHead.css({
					width : _thead.width()
							+ _thead.css('border-left-width')
							+ _thead.css('border-right-width')
					,left: table.css('border-left-width') + 'px'
				});
			}
			if(_setTopHead.length === 0){
				return;
			}
			//当前吸引thead 没有背景时 添加默认背景
			if(!_setTopHead.css('background') ||
				_setTopHead.css('background') == '' ||
				_setTopHead.css('background') == 'none'){
				_setTopHead.css('background', '#f5f5f5');
			}
			// 删除表头置顶
			if(_scrollDOMTop === 0){
				_thead.removeClass('scrolling');
				_setTopHead.remove();
			}
			// 显示表头置顶
			else {
				_thead.addClass('scrolling');
				_setTopHead.css({
					top		: _scrollDOMTop
				});
			}
			return true;
		});
   //     $(Settings.scrollDOM).trigger('scroll');
	}
};
export default Scroll;
