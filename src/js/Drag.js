/*
 * Drag: 拖拽
 * */
import { jTool, Base } from './Base';
import Adjust from './Adjust';
import Cache from './Cache';
import Config from './Config';
class Drag {
	/**
	 * 初始化拖拽
	 * @param $table
     */
	init($table) {
		this.__bindDragEvent($table);
	}

	/**
	 * 绑定拖拽换位事件
	 * @param $table
	 */
	__bindDragEvent($table) {
		const _this = this;

		// 指定拖拽换位事件源,配置拖拽样式
		$table.off('mousedown', '.drag-action');
		$table.on('mousedown', '.drag-action', function (event) {
			const $body = jTool('body');

			// 获取设置项
			let settings = Cache.getSettings($table);

            const {columnMap, dragBefore} = settings;

			// 事件源th
			let _th = jTool(this).closest('th');

			// 事件源所在的tr
			let _tr = _th.parent();

			// 事件源同层级下的所有可视th
			let _allTh = jTool('th[th-visible="visible"]', _tr);

			// 事件源所在的table
			const _table = _tr.closest('table');

			// 事件源所在的DIV
			const tableDiv = _table.closest('.table-div');

			// 事件源所在的容器
			const _tableWrap = _table.closest('.table-wrap');

			// 与事件源同列的所有td
			const colTd = Base.getColTd(_th);

			// 列拖拽触发回调事件
            dragBefore(event);

			// 禁用文字选中效果
			$body.addClass('no-select-text');

			// 更新界面交互标识
			Base.updateInteractive(_table, 'Drag');

			// 增加拖拽中样式
			_th.addClass('drag-ongoing opacityChange');
			colTd.addClass('drag-ongoing opacityChange');

			// 增加临时展示DOM
			_tableWrap.append('<div class="dreamland-div"></div>');
			let dreamlandDIV = jTool('.dreamland-div', _tableWrap);
			dreamlandDIV.get(0).innerHTML = `<table class="dreamland-table ${_table.attr('class')}"></table>`;

			// tbody内容：将原tr与td上的属性一并带上，解决一部分样式问题
			let _tbodyHtml = '';
			let _cloneTr = null;
			let _cloneTd = null;
			jTool.each(colTd, (i, v) => {
				_cloneTd = v.cloneNode(true);
				_cloneTd.style.height = v.offsetHeight + 'px';
				_cloneTr = jTool(v).closest('tr').clone();
				_tbodyHtml += _cloneTr.html(_cloneTd.outerHTML).get(0).outerHTML;
			});
			let tmpHtml = `<thead>
								<tr>
								<th style="height:${_th.height()}px">
								${jTool('.drag-action', _th).get(0).outerHTML}
								</th>
								</tr>
							</thead>
							<tbody>
								${_tbodyHtml}
							</tbody>`;
			jTool('.dreamland-table', dreamlandDIV).html(tmpHtml);

			// 存储移动时的th所处的位置
			let _thIndex = 0;

			// 绑定拖拽滑动事件
			$body.unbind('mousemove');
			$body.bind('mousemove', function (e2) {
				_thIndex = _th.index(_allTh);
                // 事件源的上一个th
				let prevTh = null;
				let prevThName = null;

				// 当前移动的非第一列
				if (_thIndex > 0) {
					prevTh = _allTh.eq(_thIndex - 1);
                    prevThName = prevTh.attr('th-name');
				}

                // 事件源的下一个th
				let nextTh = null;
				let nextThName = null;

				// 当前移动的非最后一列
				if (_thIndex < _allTh.length) {
					nextTh = _allTh.eq(_thIndex + 1);
                    nextThName = nextTh.attr('th-name');
				}

				// 禁用配置的列,不允许移动
				if (prevTh && prevTh.length !== 0 && columnMap[prevThName].disableCustomize) {
					prevTh = undefined;
				} else if (nextTh && nextTh.length !== 0 && columnMap[nextThName].disableCustomize) {
					nextTh = undefined;
				}

				dreamlandDIV.show();
				dreamlandDIV.css({
					width: _th.get(0).offsetWidth,
					height: _table.get(0).offsetHeight,
					left: e2.clientX - _tableWrap.offset().left + window.pageXOffset - _th.get(0).offsetWidth / 2,
					top: e2.clientY - _tableWrap.offset().top + window.pageYOffset - dreamlandDIV.find('th').get(0).offsetHeight / 2
				});

				// 当前触发项为置顶表头时, 同步更新至原样式
				let haveMockThead = false;  // 当前是否包含置顶表头
				if (_th.closest(`thead[${Base.fakeTheadAttr}]`).length === 1) {
					haveMockThead = true;
				}

				_this.updateDrag(_table, prevTh, nextTh, _th, colTd, dreamlandDIV, haveMockThead);

                // 更新最后一项可视列的标识
                Base.updateVisibleLast(_table);

				// 重置TH对象数据
				_allTh = jTool('th[th-visible="visible"]', _tr);
			});

			// 绑定拖拽停止事件
			$body.unbind('mouseup');
			$body.bind('mouseup', function (event) {
				let settings = Cache.getSettings($table);
				$body.unbind('mousemove');
				$body.unbind('mouseup');
				// 清除临时展示被移动的列
				dreamlandDIV = jTool('.dreamland-div');
				if (dreamlandDIV.length !== 0) {
					dreamlandDIV.animate({
						top: `${_table.get(0).offsetTop}px`,
						left: `${_th.get(0).offsetLeft - tableDiv.get(0).scrollLeft}px`
					}, settings.animateTime, () => {
						// tableDiv.css('position',_divPosition);
						_th.removeClass('drag-ongoing');
						colTd.removeClass('drag-ongoing');
						dreamlandDIV.remove();

						// 列拖拽成功回调事件
						settings.dragAfter(event);
					});
				}

                // 更新存储信息
                Cache.update($table, settings);

				// 重置调整宽度事件源
				if (settings.supportAdjust) {
					Adjust.resetAdjust(_table);
				}

				// 重置配置区域
                if (settings.supportConfig) {
                    Config.updateConfigList(_table, settings);
                }

				// 开启文字选中效果
				$body.removeClass('no-select-text');

				// 更新界面交互标识
				Base.updateInteractive(_table);
			});
		});
	}

	/**
	 * 拖拽触发后更新DOM
	 * @param _table
	 * @param prevTh
	 * @param nextTh
	 * @param _th
	 * @param colTd
	 * @param dreamlandDIV
	 * @param haveMockThead
	 */
	updateDrag(_table, prevTh, nextTh, _th, colTd, dreamlandDIV, haveMockThead) {
		// 事件源对应的上一组td
		let prevTd = null;

		// 事件源对应的下一组td
		let	nextTd = null;

		// 处理向左拖拽
		if (prevTh && prevTh.length !== 0 && dreamlandDIV.offset().left < prevTh.offset().left) {
			prevTd = Base.getColTd(prevTh);
			prevTh.before(_th);
			jTool.each(colTd, (i, v) => {
				prevTd.eq(i).before(v);
			});

			if (haveMockThead) {
				let _prevTh = jTool(`thead[grid-manager-thead] th[th-name="${prevTh.attr('th-name')}"]`, _table);
				let __th = jTool(`thead[grid-manager-thead] th[th-name="${_th.attr('th-name')}"]`, _table);
				_prevTh.before(__th);
			}
			// 处理向右拖拽
		} else if (nextTh && nextTh.length !== 0 && dreamlandDIV.offset().left + dreamlandDIV.width() > nextTh.offset().left) {
			nextTd = Base.getColTd(nextTh);
			nextTh.after(_th);
			jTool.each(colTd, (i, v) => {
				nextTd.eq(i).after(v);
			});

			if (haveMockThead) {
				let _nextTh = jTool(`thead[grid-manager-thead] th[th-name="${nextTh.attr('th-name')}"]`, _table);
				let __th = jTool(`thead[grid-manager-thead] th[th-name="${_th.attr('th-name')}"]`, _table);
				_nextTh.after(__th);
			}
		}
	}

	/**
	 * 消毁
	 * @param $table
	 */
	destroy($table) {
		const $body = jTool('body');
		// 清理: 拖拽换位事件
		$table.off('mousedown', '.drag-action');

		// 清理: 拖拽滑动事件
		$body.unbind('mousemove');

		// 清理: 拖拽停止事件
		$body.unbind('mouseup');
	}
}
export default new Drag();
