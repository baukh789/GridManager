/*
 * Drag: 拖拽
 * */
import $ from './jTool';
import Base from './Base';
import Adjust from './Adjust';
import Cache from './Cache';
const Drag = {
	/*
	 @绑定拖拽换位事件
	 $.table: table [jTool object]
	 */
	bindDragEvent: function(table){
		const thList = $('thead th', table),	//匹配页面下所有的TH
			dragAction	= thList.find('.drag-action');

		//指定拖拽换位事件源,配置拖拽样式
		dragAction.unbind('mousedown');
		dragAction.bind('mousedown',function(event){
			// 获取设置项
			let Settings = Cache.getSettings(table);

			// 事件源th
			let _th = $(this).closest('th');

			// 事件源的上一个th
			let _prevTh	= null;

			//事件源的下一个th
			let _nextTh	= null;

			// 事件源对应的上一组td
			let _prevTd	= null;

			//事件源对应的下一组td
			let	_nextTd	= null;

			//事件源所在的tr
			let _tr = _th.parent();

			//事件源同层级下的所有可视th
			let _allTh = _tr.find('th[th-visible="visible"]');

			//事件源所在的table
			const _table = _tr.closest('table');

			//事件源所在的DIV
			const _tableDiv = _table.closest('.table-div');

			//事件源所在的容器
			const _tableWrap  = _table.closest('.table-wrap');

			//与事件源同列的所在td
			const _td = Base.getColTd(_th);

			// 列拖拽触发回调事件
			Settings.dragBefore(event);

			//禁用文字选中效果
			$('body').addClass('no-select-text');
			//父级DIV使用相对定位
			//所在DIV使用定位方式
			const _divPosition = _tableDiv.css('position');
			if(_divPosition != 'relative' && _divPosition != 'absolute'){
				_tableDiv.css('position','relative');
			}
			//增加拖拽中样式
			_th.addClass('drag-ongoing opacityChange');
			_td.addClass('drag-ongoing opacityChange');

			//增加临时展示DOM
			_tableWrap.append('<div class="dreamland-div"></div>');
			let _dreamlandDIV = $('.dreamland-div', _tableWrap);
			_dreamlandDIV.get(0).innerHTML = `<table class="dreamland-table ${_table.attr('class')}"></table>`;
			//tbody内容：将原tr与td上的属性一并带上，解决一部分样式问题
			let _tbodyHtml='';
			let _cloneTr, _cloneTd;
			$.each(_td, function(i, v){
				_cloneTd = v.cloneNode(true);
				_cloneTd.style.height = v.offsetHeight + 'px';
				_cloneTr = $(v).closest('tr').clone();
				_tbodyHtml += _cloneTr.html(_cloneTd.outerHTML).get(0).outerHTML;
			});
			let tmpHtml=   `<thead>
								<tr>
								<th style="height:${_th.height()}px">
								${$('.drag-action', _th).get(0).outerHTML}
								</th>
								</tr>
							</thead>
							<tbody>
								${_tbodyHtml}
							</tbody>`;
			$('.dreamland-table', _dreamlandDIV).html(tmpHtml);
			//绑定拖拽滑动事件
			let _thIndex = 0;  //存储移动时的th所处的位置
			$('body').unbind('mousemove');
			$('body').bind('mousemove', function(e2){
				_thIndex = _th.index(_allTh);
				_prevTh = undefined;
				//当前移动的非第一列
				if(_thIndex > 0){
					_prevTh = _allTh.eq(_thIndex - 1);
				}
				_nextTh = undefined;
				//当前移动的非最后一列
				if(_thIndex < _allTh.length){
					_nextTh = _allTh.eq(_thIndex + 1);
				}
				//插件自动创建的项,不允许移动
				if(_prevTh && _prevTh.length !== 0 && _prevTh.attr('gm-create') === 'true'){
					_prevTh = undefined;
				}
				else if(_nextTh && _nextTh.length !== 0 && _nextTh.attr('gm-create') === 'true'){
					_nextTh = undefined;
				}
				_dreamlandDIV.show();
				_dreamlandDIV.css({
					width	: _th.get(0).offsetWidth,
					height	: _table.get(0).offsetHeight,
					left	: e2.clientX - _tableDiv.offset().left
					//  + $('html').get(0).scrollLeft
							+ _tableDiv.get(0).scrollLeft + (document.body.scrollLeft || document.documentElement.scrollLeft)
							- _th.get(0).offsetWidth / 2 + 'px',
					top		: e2.clientY - _tableDiv.offset().top
							+ _tableDiv.get(0).scrollTop + (document.body.scrollTop || document.documentElement.scrollTop)
							- _dreamlandDIV.find('th').get(0).offsetHeight / 2
				});
				//处理向左拖拽
				if(_prevTh && _prevTh.length != 0
					&& _dreamlandDIV.get(0).offsetLeft < _prevTh.get(0).offsetLeft){
					_prevTd = Base.getColTd(_prevTh);
					_prevTh.before(_th);
					$.each(_td,function(i, v){
						_prevTd.eq(i).before(v);
					});
					_allTh = _tr.find('th'); //重置TH对象数据
				}
				//处理向右拖拽
				if(_nextTh && _nextTh.length != 0
					&& _dreamlandDIV.get(0).offsetLeft > _nextTh.get(0).offsetLeft - _dreamlandDIV.get(0).offsetWidth / 2){
					_nextTd = Base.getColTd(_nextTh);
					_nextTh.after(_th);
					$.each(_td,function(i, v){
						_nextTd.eq(i).after(v);
					});
					_allTh = _tr.find('th'); //重置TH对象数据
				}
			});
			//绑定拖拽停止事件
			$('body').unbind('mouseup');
			$('body').bind('mouseup',function(event){
				let Settings = Cache.getSettings(table);
				$('body').unbind('mousemove');
				//清除临时展示被移动的列
				_dreamlandDIV = $('.dreamland-div');
				if(_dreamlandDIV.length != 0){
					_dreamlandDIV.animate({
						top	: _table.get(0).offsetTop + 'px',
						left: _th.get(0).offsetLeft - _tableDiv.get(0).scrollLeft  + 'px'
					}, Settings.animateTime, function(){
						_tableDiv.css('position',_divPosition);
						_th.removeClass('drag-ongoing');
						_td.removeClass('drag-ongoing');
						_dreamlandDIV.remove();

						// 列拖拽成功回调事件
						Settings.dragAfter(event);
					});
				}
				// 存储用户记忆
				Cache.saveUserMemory(_table);

				//重置调整宽度事件源
				if(Settings.supportAdjust){
					Adjust.resetAdjust(_table);
				}
				//开启文字选中效果
				$('body').removeClass('no-select-text');
			});
		});
	}
};
export default Drag;
