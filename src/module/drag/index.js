/*
 * drag: 拖拽
 *
 * #001: 这里使用get(0).innerHTML 而不直接使用.html()的原因是: jTool中的html直接添加table标签存在BUG
 */
import './style.less';
import jTool from '@common/jTool';
import base from '@common/base';
import cache from '@common/cache';
import { parseTpl } from '@common/parse';
import { FAKE_TABLE_HEAD_KEY, NO_SELECT_CLASS_NAME } from '@common/constants';
import adjust from '../adjust';
import config from '../config';
import dreamlandTpl from './dreamland.tpl.html';
import getDragEvent from '../drag/event';

const draggingClassName = 'drag-ongoing';
class Drag {
    eventMap = {};

    /**
	 * 初始化拖拽
	 * @param gridManagerName
     */
	init(gridManagerName) {
        const _this = this;
        const $table = base.getTable(gridManagerName);
        const table = $table.get(0);
        const $body = jTool('body');
        this.eventMap[gridManagerName] = getDragEvent(gridManagerName, `${base.getQuerySelector(gridManagerName)} [${FAKE_TABLE_HEAD_KEY}]`);
        const { dragStart, dragging, dragAbort } = this.eventMap[gridManagerName];

        // 拖拽事件仅绑在fake head th
        jTool(dragStart.target).on(dragStart.events, dragStart.selector, function (event) {
            // 获取设置项
            let settings = cache.getSettings(gridManagerName);

            const { columnMap, dragBefore, animateTime, dragAfter, supportAdjust, supportConfig } = settings;

            // 事件源th
            const $th = jTool(this).closest('th');
            const th = $th.get(0);

            // fake thead 下所有的 th
            let $allFakeVisibleTh = base.getFakeVisibleTh(gridManagerName);

            // 事件源所在的容器
            const $tableWrap = base.getWrap(gridManagerName);

            // 与事件源同列的所有td
            const $colTd = base.getColTd($th);

            // 列拖拽触发回调事件
            dragBefore(event);

            // 禁用文字选中效果
            $body.addClass(NO_SELECT_CLASS_NAME);

            // 增加拖拽中样式
            $th.addClass(draggingClassName);
            $colTd.addClass(draggingClassName);

            let $dreamlandDIV = jTool('.dreamland-div', $tableWrap);
            if ($dreamlandDIV.length === 0) {
                $tableWrap.append('<div class="dreamland-div"></div>');
                $dreamlandDIV = jTool('.dreamland-div', $tableWrap);
            }
            // #001
            $dreamlandDIV.get(0).innerHTML = _this.createDreamlandHtml({ $table,  $th, $colTd });

            // 存储移动时的th所处的位置
            let _thIndex = 0;

            // 绑定拖拽滑动事件
            jTool(dragging.target).off(dragging.events);
            jTool(dragging.target).on(dragging.events, function (e2) {
                _thIndex = $th.index($allFakeVisibleTh);
                // 事件源的上一个th
                let $prevTh = null;
                let prevThName = null;

                // 当前移动的非第一列
                if (_thIndex > 0) {
                    $prevTh = $allFakeVisibleTh.eq(_thIndex - 1);
                    prevThName = base.getThName($prevTh);
                }

                // 事件源的下一个th
                let $nextTh = null;
                let nextThName = null;

                // 当前移动的非最后一列
                if (_thIndex < $allFakeVisibleTh.length - 1) {
                    $nextTh = $allFakeVisibleTh.eq(_thIndex + 1);
                    nextThName = $nextTh.attr('th-name');
                }

                // 禁用配置的列,不允许移动
                if ($prevTh && $prevTh.length !== 0 && columnMap[prevThName].disableCustomize) {
                    $prevTh = undefined;
                } else if ($nextTh && $nextTh.length !== 0 && columnMap[nextThName].disableCustomize) {
                    $nextTh = undefined;
                }

                $dreamlandDIV.show();
                $dreamlandDIV.css({
                    width: th.offsetWidth,
                    height: table.offsetHeight,
                    left: e2.clientX - $tableWrap.offset().left + window.pageXOffset - th.offsetWidth / 2,
                    top: e2.clientY - $tableWrap.offset().top + window.pageYOffset - $dreamlandDIV.find('th').get(0).offsetHeight / 2
                });

                $allFakeVisibleTh = _this.updateDrag(gridManagerName, $prevTh, $nextTh, $th, $colTd, $dreamlandDIV, $allFakeVisibleTh);
            });

            // 绑定拖拽停止事件
            jTool(dragAbort.target).off(dragAbort.events);
            jTool(dragAbort.target).on(dragAbort.events, function (event) {
                jTool(dragging.target).off(dragging.events);
                jTool(dragAbort.target).off(dragAbort.events);

                // 清除临时展示被移动的列
                if ($dreamlandDIV.length !== 0) {
                    $dreamlandDIV.animate({
                        top: `${table.offsetTop}px`,
                        left: `${th.offsetLeft - base.getDiv(gridManagerName).get(0).scrollLeft}px`
                    }, animateTime, () => {
                        $th.removeClass(draggingClassName);
                        $colTd.removeClass(draggingClassName);

                        $dreamlandDIV.hide();

                        // 列拖拽成功回调事件
                        dragAfter(event);
                    });
                }

                // 更新存储信息
                cache.update(gridManagerName);

                // 重置调整宽度事件源
                if (supportAdjust) {
                    adjust.resetAdjust(gridManagerName);
                }

                // 重置配置区域
                if (supportConfig) {
                    config.updateConfigList(gridManagerName);
                }

                // 更新滚动轴状态
                base.updateScrollStatus(gridManagerName);

                // 开启文字选中效果
                $body.removeClass(NO_SELECT_CLASS_NAME);
            });
        });
	}

    /**
     * 生成拖拽区域html片段
     * @param params
     * @returns {parseData}
     */
	@parseTpl(dreamlandTpl)
	createDreamlandHtml(params) {
	    const { $table, $th, $colTd } = params;

        // tbody内容：将原tr与td上的属性一并带上，解决一部分样式问题
        let tbodyHtml = '';
        jTool.each($colTd, (i, v) => {
            let _cloneTd = v.cloneNode(true);
            _cloneTd.style.height = v.offsetHeight + 'px';
            let _cloneTr = jTool(v).closest('tr').clone();
            tbodyHtml += _cloneTr.html(_cloneTd.outerHTML).get(0).outerHTML;
        });

        return {
            tableClassName: $table.attr('class'),
            thOuterHtml: jTool('.drag-action', $th).get(0).outerHTML,
            thStyle: `style="height:${$th.height()}px"`,
            tbodyHtml: tbodyHtml
        };
    }

	/**
	 * 拖拽触发后更新DOM
	 * @param gridManagerName
	 * @param $prevTh
	 * @param $nextTh
	 * @param $th
	 * @param $colTd
	 * @param $dreamlandDIV
	 * @param $allFakeVisibleTh
	 */
	updateDrag(gridManagerName, $prevTh, $nextTh, $th, $colTd, $dreamlandDIV, $allFakeVisibleTh) {
		// 处理向左拖拽
		if ($prevTh && $prevTh.length !== 0 && $dreamlandDIV.offset().left < $prevTh.offset().left) {
            // 事件源对应的上一组td
		    let prevTd = base.getColTd($prevTh);
            $prevTh.before($th);
			jTool.each($colTd, (i, v) => {
				prevTd.eq(i).before(v);
			});

			// 同步 head
            base.getTh(gridManagerName, $prevTh).before(base.getTh(gridManagerName, $th));

            // 更新最后一项可视列的标识
            base.updateVisibleLast(gridManagerName);
            $allFakeVisibleTh = base.getFakeVisibleTh(gridManagerName);
		}

		// 处理向右拖拽
		if ($nextTh && $nextTh.length !== 0 && $dreamlandDIV.offset().left + $dreamlandDIV.width() > $nextTh.offset().left) {
            // 事件源对应的下一组td
		    let nextTd = base.getColTd($nextTh);
			$nextTh.after($th);
			jTool.each($colTd, (i, v) => {
				nextTd.eq(i).after(v);
			});

            // 同步 head
            base.getTh(gridManagerName, $nextTh).after(base.getTh(gridManagerName, $th));

            // 更新最后一项可视列的标识
            base.updateVisibleLast(gridManagerName);
            $allFakeVisibleTh = base.getFakeVisibleTh(gridManagerName);
		}

		// 返回新的可视fake th列
		return $allFakeVisibleTh;
	}

	/**
	 * 消毁
	 * @param gridManagerName
	 */
	destroy(gridManagerName) {
        base.clearBodyEvent(this.eventMap[gridManagerName]);
	}
}
export default new Drag();
