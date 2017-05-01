/*
 * Drag: 拖拽
 * */
import $ from './jTool';
import Base from './Base';
import Adjust from './Adjust';
import Cache from './Cache';
const Drag = {
	/**
	 * 绑定拖拽换位事件
	 * @param $table
     */
	bindDragEvent: function($table){
		const _this = this;
		//指定拖拽换位事件源,配置拖拽样式
		$table.off('mousedown', '.drag-action');
		$table.on('mousedown', '.drag-action',function(event){
			const $body = $('body');
			// 获取设置项
			let settings = Cache.getSettings($table);

			// 事件源th
			let _th = $(this).closest('th');

			// 事件源的上一个th
			let prevTh	= null;

			//事件源的下一个th
			let nextTh	= null;


			//事件源所在的tr
			let _tr = _th.parent();

			//事件源同层级下的所有可视th
			let _allTh = _tr.find('th[th-visible="visible"]');

			//事件源所在的table
			const _table = _tr.closest('table');

			//事件源所在的DIV
			const tableDiv = _table.closest('.table-div');

			//事件源所在的容器
			const _tableWrap  = _table.closest('.table-wrap');

			//与事件源同列的所有td
			const colTd = Base.getColTd(_th);

			// 列拖拽触发回调事件
			settings.dragBefore(event);

			//禁用文字选中效果
			$body.addClass('no-select-text');
			//父级DIV使用相对定位
			//所在DIV使用定位方式
			// const _divPosition = tableDiv.css('position');
			// if(_divPosition != 'relative' && _divPosition != 'absolute'){
			// 	tableDiv.css('position','relative');
			// }
			//增加拖拽中样式
			_th.addClass('drag-ongoing opacityChange');
			colTd.addClass('drag-ongoing opacityChange');

			//增加临时展示DOM
			_tableWrap.append('<div class="dreamland-div"></div>');
			let dreamlandDIV = $('.dreamland-div', _tableWrap);
			dreamlandDIV.get(0).innerHTML = `<table class="dreamland-table ${_table.attr('class')}"></table>`;
			//tbody内容：将原tr与td上的属性一并带上，解决一部分样式问题
			let _tbodyHtml='';
			let _cloneTr, _cloneTd;
			$.each(colTd, function(i, v){
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
			$('.dreamland-table', dreamlandDIV).html(tmpHtml);
			//绑定拖拽滑动事件
			let _thIndex = 0;  //存储移动时的th所处的位置
			$body.unbind('mousemove');
			$body.bind('mousemove', function(e2){
				_thIndex = _th.index(_allTh);
				prevTh = undefined;
				//当前移动的非第一列
				if(_thIndex > 0){
					prevTh = _allTh.eq(_thIndex - 1);
				}
				nextTh = undefined;
				//当前移动的非最后一列
				if(_thIndex < _allTh.length){
					nextTh = _allTh.eq(_thIndex + 1);
				}
				//插件自动创建的项,不允许移动
				if(prevTh && prevTh.length !== 0 && prevTh.attr('gm-create') === 'true'){
					prevTh = undefined;
				}
				else if(nextTh && nextTh.length !== 0 && nextTh.attr('gm-create') === 'true'){
					nextTh = undefined;
				}
				dreamlandDIV.show();
				dreamlandDIV.css({
					width	: _th.get(0).offsetWidth,
					height	: _table.get(0).offsetHeight,
					left	: e2.clientX
							- _tableWrap.offset().left
							+(document.body.scrollLeft || document.documentElement.scrollLeft)
							- _th.get(0).offsetWidth / 2 + 'px',
					top		: e2.clientY
							- _tableWrap.offset().top
							+(document.body.scrollTop || document.documentElement.scrollTop)
							- dreamlandDIV.find('th').get(0).offsetHeight / 2
				});
				// 当前触发项为置顶表头时, 同步更新至原样式
				let haveMockThead = false;  // 当前是否包含置顶表头
				if (_th.closest('thead[grid-manager-mock-thead]').length === 1) {
					haveMockThead = true;
				}
				_this.updateDrag(_table, prevTh, nextTh, _th, colTd, dreamlandDIV, tableDiv, haveMockThead);
				_allTh = _tr.find('th'); //重置TH对象数据
			});
			//绑定拖拽停止事件
			$body.unbind('mouseup');
			$body.bind('mouseup',function(event){
				let settings = Cache.getSettings($table);
				$body.unbind('mousemove');
				$body.unbind('mouseup');
				//清除临时展示被移动的列
				dreamlandDIV = $('.dreamland-div');
				if(dreamlandDIV.length != 0){
					dreamlandDIV.animate({
						top	: _table.get(0).offsetTop + 'px',
						left: _th.get(0).offsetLeft - tableDiv.get(0).scrollLeft  + 'px'
					}, settings.animateTime, function(){
						// tableDiv.css('position',_divPosition);
						_th.removeClass('drag-ongoing');
						colTd.removeClass('drag-ongoing');
						dreamlandDIV.remove();

						// 列拖拽成功回调事件
						settings.dragAfter(event);
					});
				}
				// 存储用户记忆
				Cache.saveUserMemory(_table);

				//重置调整宽度事件源
				if(settings.supportAdjust){
					Adjust.resetAdjust(_table);
				}
				//开启文字选中效果
				$body.removeClass('no-select-text');
			});
		});
	}
	,updateDrag: function(_table, prevTh, nextTh, _th, colTd, dreamlandDIV, tableDiv, haveMockThead){
		// 事件源对应的上一组td
		let prevTd	= null;
		//事件源对应的下一组td
		let	nextTd	= null;
		// 处理向左拖拽
		// 向左拖拽时, 如果显示的表头为置顶表头时, 不将tableDiv.get(0).scrollLeft 的值做为计算的项
		if(prevTh && prevTh.length != 0
			&& dreamlandDIV.get(0).offsetLeft < prevTh.offset().left - (haveMockThead ? 0 : tableDiv.get(0).scrollLeft)){
			prevTd = Base.getColTd(prevTh);
			prevTh.before(_th);
			$.each(colTd,function(i, v){
				prevTd.eq(i).before(v);
			});
			if(haveMockThead){
				let _prevTh = $('thead[grid-manager-thead] th[th-name="'+ prevTh.attr('th-name') +'"]', _table);
				let __th = $('thead[grid-manager-thead] th[th-name="'+ _th.attr('th-name') +'"]', _table);
				_prevTh.before(__th);
			}
		}
		//处理向右拖拽
		if(nextTh && nextTh.length != 0
			&& dreamlandDIV.get(0).offsetLeft + dreamlandDIV.get(0).offsetWidth > nextTh.get(0).offsetLeft - tableDiv.get(0).scrollLeft){
			nextTd = Base.getColTd(nextTh);
			nextTh.after(_th);
			$.each(colTd,function(i, v){
				nextTd.eq(i).after(v);
			});
			if(haveMockThead){
				let _nextTh = $('thead[grid-manager-thead] th[th-name="'+ nextTh.attr('th-name') +'"]', _table);
				let __th = $('thead[grid-manager-thead] th[th-name="'+ _th.attr('th-name') +'"]', _table);
				_nextTh.after(__th);
			}
		}
	}
};
export default Drag;
