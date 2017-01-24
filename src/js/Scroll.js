/*
 * Scroll: 滚动轴
 * */
import $ from './jTool';
const Scroll = {
	/*
	 @绑定表格滚动轴功能
	 $.table: table [jTool object]
	 */
	bindScrollFunction: function(table){
		var _tableDIV = table.closest('.table-div'),	//列表所在的DIV,该DIV的class标识为table-div
			_tableWarp = _tableDIV.closest('.table-wrap');//列表所在的外围容器
		// 绑定resize事件: 对表头吸顶的列宽度进行修正
		window.addEventListener('resize', function(){
			var _setTopHead = $('.set-top', table); //吸顶元素
			if(_setTopHead && _setTopHead.length === 1){
				_setTopHead.remove();
				_tableDIV.trigger('scroll');
			}
		});
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
				_setTopHead.removeClass('scrolling');
				_setTopHead.css({
					width : _thead.width()
					,left: table.css('border-left-width') + 'px'
				});
				// 防止window.resize事件后导致的吸顶宽度错误. 可以优化
				$.each($('th', _thead), function (i, v) {
					$('th', _setTopHead).eq(i).width($(v).width());
				});
			}
			if(_setTopHead.length === 0){
				return;
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
	}
};
export default Scroll;
