/*
 * Drag: 拖拽
 * */
import $ from './jTool';
import Base from './Base';
import Adjust from './Adjust';
import Cache from './Cache';

const bindMouseupEvent = function ($table) {

};
const Drag = {
	/**
	 * 绑定拖拽换位事件
	 * @param $table [jTool Object]
     */
	bindDragEvent: function($table){
		const dragAction = $('thead th .drag-action', $table);
		const DragArea = $table.closest('body');
		// 指定拖拽换位事件源,配置拖拽样式
		dragAction.unbind('mousedown');
		dragAction.bind('mousedown',function(event){
			// 事件源th
			let _th = $(this).closest('th');
			// 事件源所在的tr
			let _tr = _th.parent();
			// 事件源同层级下的所有可视th
			let allTh = _tr.find('th[th-visible="visible"]');
			// 事件源所在的table
			const _table = _tr.closest('table');
			// 事件源所在的DIV
			const tableDiv = _table.closest('.table-div');
			// 与事件源同列的所在td
			const _td = Base.getColTd(_th);
			
			// 获取设置项
			let settings = Cache.getSettings(_table);

			// 列拖拽触发回调事件
			settings.dragBefore(event);

			// 禁用文字选中效果
			DragArea.addClass('no-select-text');
			// 父级DIV使用相对定位
			// 所在DIV使用定位方式
			const _divPosition = tableDiv.css('position');
			if(_divPosition != 'relative' && _divPosition != 'absolute'){
				tableDiv.css('position','relative');
			}
			// 增加拖拽中样式
			_th.addClass('drag-ongoing opacityChange');
			_td.addClass('drag-ongoing opacityChange');

			// 生成拖拽镜象
			let dreamlandDIV = Drag.createDreamland($table, _th, _td);

			// 绑定拖拽滑动事件
			let _thIndex = 0;  // 存储移动时的th所处的位置
			DragArea.unbind('mousemove');
			DragArea.bind('mousemove', function(event){
				Drag.startDrag($table, event, dreamlandDIV, tableDiv, allTh, _tr, _th, _td, _thIndex);
			});

			// 绑定拖拽停止事件
			DragArea.unbind('mouseup');
			DragArea.bind('mouseup',function(event){
				Drag.stopDrag($table, event, _th, _td, DragArea);
			});
		});
	}
	/**
	 * 生成拖拽镜象
	 * @param $table
	 * @param $th
	 * @param $td
	 * @returns {*|HTMLElement|jTool}
     */
	,createDreamland: function($table, $th, $td){
		let tableWrap = $table.closest('.table-wrap');
		tableWrap.append('<div class="dreamland-div"></div>');
		let dreamlandDIV = $('.dreamland-div', tableWrap);
		dreamlandDIV.get(0).innerHTML = `<table class="dreamland-table ${ $table.attr('class') }"></table>`;
		// tbody内容：将原tr与td上的属性一并带上，解决一部分样式问题
		let _tbodyHtml='';
		let _cloneTr, _cloneTd;
		$.each($td, function(i, v){
			_cloneTd = v.cloneNode(true);
			_cloneTd.style.height = v.offsetHeight + 'px';
			_cloneTr = $(v).closest('tr').clone();
			_tbodyHtml += _cloneTr.html(_cloneTd.outerHTML).get(0).outerHTML;
		});
		let tmpHtml=   `<thead>
								<tr>
								<th style="height:${$th.height()}px">
								${$('.drag-action', $th).get(0).outerHTML}
								</th>
								</tr>
							</thead>
							<tbody>
								${_tbodyHtml}
							</tbody>`;
		$('.dreamland-table', dreamlandDIV).html(tmpHtml);
		return dreamlandDIV;
	}
	,startDrag: function($table, event, dreamlandDIV, tableDiv, allTh, _tr, _th, _td, _thIndex){
		_thIndex = _th.index(allTh);
		let _prevTh = null; // 事件源的上一个th
		let _nextTh = null; // 事件源的下一个th

		// 当前移动的非第一列
		if(_thIndex > 0){
			_prevTh = allTh.eq(_thIndex - 1);
		}
		// 当前移动的非最后一列
		if(_thIndex < allTh.length){
			_nextTh = allTh.eq(_thIndex + 1);
		}
		// 插件自动创建的项,不允许移动
		if(_prevTh && _prevTh.length !== 0 && _prevTh.attr('gm-create') === 'true'){
			_prevTh = null;
		}
		else if(_nextTh && _nextTh.length !== 0 && _nextTh.attr('gm-create') === 'true'){
			_nextTh = null;
		}

		// 移动境象
		dreamlandDIV.show();
		dreamlandDIV.css({
			width	: _th.get(0).offsetWidth,
			height	: $table.get(0).offsetHeight,
			left	: event.clientX - tableDiv.offset().left
			+ tableDiv.get(0).scrollLeft + (document.body.scrollLeft || document.documentElement.scrollLeft)
			- _th.get(0).offsetWidth / 2 + 'px',
			top		: event.clientY - tableDiv.offset().top
			+ tableDiv.get(0).scrollTop + (document.body.scrollTop || document.documentElement.scrollTop)
			- dreamlandDIV.find('th').get(0).offsetHeight / 2
		});

		// 处理向左拖拽
		if(_prevTh && _prevTh.length != 0
			&& dreamlandDIV.get(0).offsetLeft < _prevTh.get(0).offsetLeft){
			let _prevTd = Base.getColTd(_prevTh); // 事件源对应的上一组td
			_prevTh.before(_th);
			$.each(_td,function(i, v){
				_prevTd.eq(i).before(v);
			});
			allTh = _tr.find('th'); // 重置TH对象数据
		}

		// 处理向右拖拽
		if(_nextTh && _nextTh.length != 0
			&& dreamlandDIV.get(0).offsetLeft > _nextTh.get(0).offsetLeft - dreamlandDIV.get(0).offsetWidth / 2){
			let _nextTd = Base.getColTd(_nextTh); // 事件源对应的下一组td
			_nextTh.after(_th);
			$.each(_td,function(i, v){
				_nextTd.eq(i).after(v);
			});
			allTh = _tr.find('th'); // 重置TH对象数据
		}
	}
	/**
	 * 停止拖拽
	 * @param $table
	 * @param event
	 * @param $th
	 * @param $td
	 * @param $DragArea: 拖拽范围
     * @param divPosition: 所在DIV使用定位方式
     */
	,stopDrag: function ($table, event, $th, $td, $DragArea, divPosition) {
		$DragArea.unbind('mousemove');
		let settings = Cache.getSettings($table);
		// 清除所有拖拽镜象
		let dreamlandDIV = $('.dreamland-div');
		const tableDiv = $table.closest('.table-div');
		if(dreamlandDIV.length != 0){
			dreamlandDIV.animate({
				top	: $table.get(0).offsetTop + 'px',
				left: $th.get(0).offsetLeft - tableDiv.get(0).scrollLeft  + 'px'
			}, settings.animateTime, function(){
				tableDiv.css('position', divPosition);
				$th.removeClass('drag-ongoing');
				$td.removeClass('drag-ongoing');
				dreamlandDIV.remove();

				// 列拖拽成功回调事件
				settings.dragAfter(event);
			});
		}
		// 存储用户记忆
		Cache.saveUserMemory($table);

		// 重置调整宽度事件源
		if(settings.supportAdjust){
			Adjust.resetAdjust($table);
		}
		// 开启文字选中效果
		$DragArea.removeClass('no-select-text');
	}
};
export default Drag;

