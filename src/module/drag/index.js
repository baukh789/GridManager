/*
 * drag: 拖拽
 * */
import { jTool, base, cache, parseTpl } from '../../common';
import adjust from '../adjust';
import config from '../config';
import dreamlandTpl from './dreamland.tpl.html';
class Drag {
	/**
	 * 初始化拖拽
	 * @param $table
     */
	init($table) {
		this.__bindDragEvent($table);
	}

    /**
     * 生成拖拽区域html片段
     * @param params
     * @returns {parseData}
     */
	@parseTpl(dreamlandTpl)
	createDreamlandHtml(params) {
	    const { _table,  _th, colTd } = params;

        // tbody内容：将原tr与td上的属性一并带上，解决一部分样式问题
        let tbodyHtml = '';
        jTool.each(colTd, (i, v) => {
            let _cloneTd = v.cloneNode(true);
            _cloneTd.style.height = v.offsetHeight + 'px';
            let _cloneTr = jTool(v).closest('tr').clone();
            tbodyHtml += _cloneTr.html(_cloneTd.outerHTML).get(0).outerHTML;
        });

        return {
            tableClassName: _table.attr('class'),
            thOuterHtml: jTool('.drag-action', _th).get(0).outerHTML,
            thStyle: `style="height:${_th.height()}px"`,
            tbodyHtml: tbodyHtml
        };
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
			let settings = cache.getSettings($table);

            const { columnMap, dragBefore } = settings;

			// 事件源th
			let _th = jTool(this).closest('th');

			// 事件源所在的tr
			let _tr = _th.parent();

			// 事件源所在的table
			const _table = base.getTable(_tr, true);

            // 事件源同层级下的所有可视th
            let _allTh = base.getFakeVisibleTh(_table);

			// 事件源所在的DIV
			const tableDiv = _table.closest('.table-div');

			// 事件源所在的容器
			const _tableWrap = _table.closest('.table-wrap');

			// 与事件源同列的所有td
			const colTd = base.getColTd(_th);

			// 列拖拽触发回调事件
            dragBefore(event);

			// 禁用文字选中效果
			$body.addClass('no-select-text');

			// 更新界面交互标识
			base.updateInteractive(_table, 'drag');

			// 增加拖拽中样式
			_th.addClass('drag-ongoing opacityChange');
			colTd.addClass('drag-ongoing opacityChange');

			_tableWrap.append('<div class="dreamland-div"></div>');
			let dreamlandDIV = jTool('.dreamland-div', _tableWrap);
			dreamlandDIV.get(0).innerHTML = _this.createDreamlandHtml({_table,  _th, colTd});

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

				_this.updateDrag(_table, prevTh, nextTh, _th, colTd, dreamlandDIV);

                // 更新最后一项可视列的标识
                base.updateVisibleLast(_table);

				// 重置TH对象数据
				_allTh = jTool('th[th-visible="visible"]', _tr);
			});

			// 绑定拖拽停止事件
			$body.unbind('mouseup');
			$body.bind('mouseup', function (event) {
				let settings = cache.getSettings($table);
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
                cache.update($table, settings);

				// 重置调整宽度事件源
				if (settings.supportAdjust) {
					adjust.resetAdjust(_table);
				}

				// 重置配置区域
                if (settings.supportConfig) {
                    config.updateConfigList(_table, settings);
                }

				// 开启文字选中效果
				$body.removeClass('no-select-text');

				// 更新界面交互标识
				base.updateInteractive(_table);
			});
		});
	}

	/**
	 * 拖拽触发后更新DOM
	 * @param $table
	 * @param $prevTh
	 * @param $nextTh
	 * @param $th
	 * @param $colTd
	 * @param $dreamlandDIV
	 */
	updateDrag($table, $prevTh, $nextTh, $th, $colTd, $dreamlandDIV) {
		// 处理向左拖拽
		if ($prevTh && $prevTh.length !== 0 && $dreamlandDIV.offset().left < $prevTh.offset().left) {
            // 事件源对应的上一组td
		    let prevTd = base.getColTd($prevTh);
            $prevTh.before($th);
			jTool.each($colTd, (i, v) => {
				prevTd.eq(i).before(v);
			});

			// 同步 head
            let _prevTh = base.getTh($table, $prevTh);
            let __th = base.getTh($table, $th);
            _prevTh.before(__th);

			// 处理向右拖拽
		} else if ($nextTh && $nextTh.length !== 0 && $dreamlandDIV.offset().left + $dreamlandDIV.width() > $nextTh.offset().left) {
            // 事件源对应的下一组td
		    let nextTd = base.getColTd($nextTh);
			$nextTh.after($th);
			jTool.each($colTd, (i, v) => {
				nextTd.eq(i).after(v);
			});

            // 同步 head
            let _nextTh = base.getTh($table, $nextTh);
            let __th = base.getTh($table, $th);
            _nextTh.after(__th);
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
