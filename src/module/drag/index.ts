/**
 * drag[拖拽]
 * 参数说明:
 *  - supportDrag: 指定列表是否开启拖拽
 *      - type: Boolean
 *      - default: true
 *
 * 以下情况拖拽功能将失效:
 *  - 配置项中存在fullColumn
 *
 * 以下情况单一列的拖拽功能将被禁用:
 *  - 自动生成的选择列、序号列
 *  - columnData[disableCustomize] === true的列
 *
 * 交互规则:
 *  - 与左侧互换位置: 向左移动至前一列的最左处
 *  - 与右侧互换位置: 向右移动至后一列所在区域的任一位置
 */
import './style.less';
import jTool from '@jTool';
import { each } from '@jTool/utils';
import { getTable, getQuerySelector, getFakeVisibleTh, getWrap, getColTd, getThName, getDiv, getTh, updateVisibleLast, updateScrollStatus, clearTargetEvent } from '@common/base';
import { updateCache, getSettings } from '@common/cache';
import { parseTpl } from '@common/parse';
import { FAKE_TABLE_HEAD_KEY, NO_SELECT_CLASS_NAME, DISABLE_CUSTOMIZE, PX, TR_CHILDREN_STATE } from '@common/constants';
import { TARGET, EVENTS, SELECTOR } from '@common/events';
import config from '@module/config';
import fixed from '@module/fixed';
import dreamlandTpl from './dreamland.tpl.html';
import { getEvent, eventMap } from './event';
import { CLASS_DRAG_ING, CLASS_DREAMLAND } from './constants';
import { JTool } from 'typings/types';

class Drag {
    /**
	 * 初始化拖拽
	 * @param _
     */
	init(_: string): void {
        const _this = this;
        const $table = getTable(_);
        const $body = jTool('body');
        eventMap[_] = getEvent(_, `${getQuerySelector(_)} [${FAKE_TABLE_HEAD_KEY}]`);
        const { start, doing, abort } = eventMap[_];

        // 拖拽事件仅绑在fake head th
        jTool(start[TARGET]).on(start[EVENTS], start[SELECTOR], function (event: MouseEvent) {
            // 获取设置项
            let settings = getSettings(_);

            const { columnMap, dragBefore, animateTime, dragAfter, supportConfig } = settings;

            // 事件源th
            const $th = jTool(this).closest('th');
            const th = $th.get(0);

            // fake thead 下所有的 th
            let $allFakeVisibleTh = getFakeVisibleTh(_);

            // 事件源所在的容器
            const $tableWrap = getWrap(_);

            // 与事件源同列的所有td
            const $colTd = getColTd($th, _);

            // 列拖拽触发回调事件
            dragBefore(event);

            // 禁用文字选中效果
            $body.addClass(NO_SELECT_CLASS_NAME);

            // 增加拖拽中样式
            $th.addClass(CLASS_DRAG_ING);
            $colTd.addClass(CLASS_DRAG_ING);
            let $dreamlandDIV = jTool(`.${CLASS_DREAMLAND}`, $tableWrap);

            // 防止频繁触发事件
            if ($dreamlandDIV.length) {
                return;
            }
            $tableWrap.append(`<div class="${CLASS_DREAMLAND}"></div>`);
            $dreamlandDIV = jTool(`.${CLASS_DREAMLAND}`, $tableWrap);

            // 这里使用get(0).innerHTML 而不直接使用.html()的原因是: jTool中的html直接添加table标签存在BUG
            $dreamlandDIV.get(0).innerHTML = _this.createHtml({ $table,  $th });

            // 存储移动时的th所处的位置
            let thIndex = 0;

            // 境像所需要的样式: 这些样式不会随移动而改变
            const thWidth = $th.width();
            const thHeight = $th.height();
            const tableHeight = $table.height();
            const WrapOffset = $tableWrap.offset();

            const baseLeft =  pageXOffset - WrapOffset.left - thWidth / 2;
            const baseTop = pageYOffset - WrapOffset.top - thHeight / 2;

            // 提前设置width, height: 可以不用在移动中每次进行设置
            $dreamlandDIV.css({
                width: thWidth + 2, // 2为边框
                height: tableHeight + 2
            });

            // 绑定拖拽滑动事件
            const $doing = jTool(doing[TARGET]);
            $doing.off(doing[EVENTS]);
            $doing.on(doing[EVENTS], function (e2: MouseEvent) {
                $dreamlandDIV.show(); // 放在mousemove中是为了解决仅双击不移动时列从底部闪现问题
                thIndex = $th.index($allFakeVisibleTh);
                // 事件源的上一个th
                let $prevTh,
                    prevThName;

                // 当前移动的非第一列
                if (thIndex > 0) {
                    $prevTh = $allFakeVisibleTh.eq(thIndex - 1);
                    prevThName = getThName($prevTh);
                }

                // 事件源的下一个th
                let $nextTh,
                    nextThName;

                // 当前移动的非最后一列
                if (thIndex < $allFakeVisibleTh.length - 1) {
                    $nextTh = $allFakeVisibleTh.eq(thIndex + 1);
                    nextThName = getThName($nextTh);
                }

                // 禁用配置的列,不允许移动
                if ($prevTh && $prevTh.length && columnMap[prevThName][DISABLE_CUSTOMIZE]) {
                    $prevTh = undefined;
                } else if ($nextTh && $nextTh.length && columnMap[nextThName][DISABLE_CUSTOMIZE]) {
                    $nextTh = undefined;
                }

                $dreamlandDIV.css({
                    left: e2.clientX + baseLeft,
                    top: e2.clientY + baseTop
                });

                $allFakeVisibleTh = _this.updateDrag(_, $prevTh, $nextTh, $th, $colTd, $dreamlandDIV, $allFakeVisibleTh);
            });

            // 绑定拖拽停止事件
            const abortEvents = abort[EVENTS];
            const $abort = jTool(abort[TARGET]);
            $abort.off(abortEvents);
            $abort.on(abortEvents, function (event: MouseEvent) {
                jTool(doing[TARGET]).off(doing[EVENTS]);
                $abort.off(abortEvents);

                // 清除镜像
                $dreamlandDIV.animate({
                    top: $table.get(0).offsetTop + PX,
                    left: `${th.offsetLeft - getDiv(_).get(0).scrollLeft + PX}`
                }, animateTime, () => {
                    $th.removeClass(CLASS_DRAG_ING);
                    $colTd.removeClass(CLASS_DRAG_ING);

                    $dreamlandDIV.remove();

                    // 列拖拽成功回调事件
                    dragAfter(event);
                });

                // 更新存储信息
                updateCache(_);

                // 重置配置区域
                if (supportConfig) {
                    config.updateConfigList(_);
                }

                // 更新滚动轴状态
                updateScrollStatus(_);

                fixed.resetFlag(_);

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
    createHtml(params: any): string {
	    const { $table, $th } = params;

	    // 这里获取的tdList排除了tree children
	    const $colTd = getColTd($th, $table.find(`tbody tr:not([${TR_CHILDREN_STATE}])`));

	    // tbody内容：将原tr与td上的属性一并带上，解决一部分样式问题
        let tbodyHtml = '';
        each($colTd, (v: HTMLTableCellElement) => {
            tbodyHtml += `<tr style="height: ${v.offsetHeight + PX}">${v.outerHTML}</tr>`;
        });

		// @ts-ignore
        return {
            class: $table.get(0).className,
            th: $th.get(0).outerHTML,
            tbody: tbodyHtml
        };
    }

	/**
	 * 拖拽触发后更新DOM
	 * @param _
	 * @param $prevTh
	 * @param $nextTh
	 * @param $th
	 * @param $colTd
	 * @param $dreamlandDIV
	 * @param $allFakeVisibleTh
	 */
	updateDrag(_: string, $prevTh: JTool, $nextTh: JTool, $th: JTool, $colTd: JTool, $dreamlandDIV: JTool, $allFakeVisibleTh: JTool): JTool {
		// 处理向左拖拽
		if ($prevTh && $dreamlandDIV.offset().left < $prevTh.offset().left) {
            // 事件源对应的上一组td
		    let prevTd = getColTd($prevTh, _);
            $prevTh.before($th);
			each($colTd, (v: HTMLTableCellElement, i: number) => {
				prevTd.eq(i).before(v);
			});

			// 同步 head
            getTh(_, $prevTh).before(getTh(_, $th));

            // 更新最后一项可视列的标识
            updateVisibleLast(_);
            $allFakeVisibleTh = getFakeVisibleTh(_);
		}

		// 处理向右拖拽
		if ($nextTh && $dreamlandDIV.offset().left + $dreamlandDIV.width() > $nextTh.offset().left) {
            // 事件源对应的下一组td
		    let nextTd = getColTd($nextTh, _);
			$nextTh.after($th);
			each($colTd, (v: HTMLTableCellElement, i: number) => {
				nextTd.eq(i).after(v);
			});

            // 同步 head
            getTh(_, $nextTh).after(getTh(_, $th));

            // 更新最后一项可视列的标识
            updateVisibleLast(_);
            $allFakeVisibleTh = getFakeVisibleTh(_);
		}

		// 返回新的可视fake th列
		return $allFakeVisibleTh;
	}

	/**
	 * 消毁
	 * @param _
	 */
	destroy(_: string): void {
        clearTargetEvent(eventMap[_]);
	}
}
export default new Drag();
