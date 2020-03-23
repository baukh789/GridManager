/*
 * adjust: 宽度调整
 * 宽度调整是通过 jTool 进行的事件绑定
 */
import './style.less';
import jTool from '@jTool';
import { getQuerySelector, getTable, getTh, getFakeThead, getThead, getFakeVisibleTh, getColTd, getThTextWidth, updateScrollStatus, clearTargetEvent } from '@common/base';
import { FAKE_TABLE_HEAD_KEY, NO_SELECT_CLASS_NAME } from '@common/constants';
import { CLASS_ADJUST_ACTION, CLASS_ADJUST_SELECT } from './constants';
import { getSettings, updateCache } from '@common/cache';
import { getEvent, eventMap } from './event';
import { EVENTS, TARGET, SELECTOR } from '@common/events';

/**
 * 执行移动事件
 * @param _
 * @param $th: fake th
 * @param $nextTh: fake th
 * @param isIconFollowText: 表头的icon图标是否跟随文本
 * @private
 */
const runMoveEvent = (_, $th, $nextTh, isIconFollowText) => {
    let _thWidth = null;
    let	_NextWidth = null;
    let _thMinWidth = getThTextWidth(_, $th, isIconFollowText);
    let	_NextThMinWidth = getThTextWidth(_, $nextTh, isIconFollowText);
    const { doing } = eventMap[_];
    jTool(doing[TARGET]).on(doing[EVENTS], doing[SELECTOR], function (event) {
        _thWidth = event.clientX - $th.offset().left;
        _thWidth = Math.ceil(_thWidth);
        _NextWidth = $nextTh.width() + $th.width() - _thWidth;
        _NextWidth = Math.ceil(_NextWidth);
        // 达到最小值后不再执行后续操作
        if (_thWidth < _thMinWidth) {
            return;
        }
        if (_NextWidth < _NextThMinWidth) {
            _NextWidth = _NextThMinWidth;
        }

        // 验证是否更改
        if (_thWidth === $th.width()) {
            return;
        }

        // 验证宽度是否匹配
        if (_thWidth + _NextWidth < $th.width() + $nextTh.width()) {
            _NextWidth = $th.width() + $nextTh.width() - _thWidth;
        }
        $th.width(_thWidth);
        $nextTh.width(_NextWidth);

        // 当前宽度调整的事件原为表头置顶的thead th
        // 修改与置顶thead 对应的 thead
        if ($th.closest(`[${FAKE_TABLE_HEAD_KEY}]`).length === 1) {
            getTh(_, $th).width(_thWidth);
            getTh(_, $nextTh).width(_NextWidth);
            getFakeThead(_).width(getThead(_).width());
        }
    });
};

/**
 * 绑定鼠标放开、移出事件
 * @param _
 * @param $table
 * @param $th
 * @param $td
 * @param adjustAfter
 * @private
 */
const runStopEvent = (_, $table, $th, $td, adjustAfter) => {
    const { doing, abort } = eventMap[_];
    jTool(abort[TARGET]).on(abort[EVENTS], event => {
        jTool(abort[TARGET]).off(abort[EVENTS]);
        jTool(doing[TARGET]).off(doing[EVENTS], doing[SELECTOR]);

        // 宽度调整成功回调事件
        if ($th.hasClass(CLASS_ADJUST_SELECT)) {
            adjustAfter(event);
        }
        $th.removeClass(CLASS_ADJUST_SELECT);
        $td.removeClass(CLASS_ADJUST_SELECT);
        $table.removeClass(NO_SELECT_CLASS_NAME);

        // 更新滚动轴状态
        updateScrollStatus(_);

        // 更新存储信息
        updateCache(_);
    });
};
class Adjust {
    /**
     * 宽度调整HTML
     * @returns {string}
     */
    get html() {
        return `<span class="${CLASS_ADJUST_ACTION}"></span>`;
    }

    /**
     * init
     * 绑定宽度调整事件
     * @param: _
     */
    init(_) {
        // 监听鼠标调整列宽度
        eventMap[_] = getEvent(_, getQuerySelector(_));
        const { start } = eventMap[_];

        jTool(start[TARGET]).on(start[EVENTS], start[SELECTOR], function (event) {
            // 事件源所在的th
            const $th = jTool(this).closest('th');

            // 事件源所在的table
            const $table = getTable(_);

            // 当前存储属性
            const { adjustBefore, adjustAfter, isIconFollowText } = getSettings(_);

            // 事件源同层级下的所有th
            const $allTh = getFakeVisibleTh(_);

            // 事件源下一个可视th
            const $nextTh = $allTh.eq($th.index($allTh) + 1);

            // 存储与事件源同列的所有td
            const $td = getColTd($th);

            // 宽度调整触发回调事件
            adjustBefore(event);

            // 增加宽度调整中样式
            $th.addClass(CLASS_ADJUST_SELECT);
            $td.addClass(CLASS_ADJUST_SELECT);

            // 禁用文本选中
            $table.addClass(NO_SELECT_CLASS_NAME);

            // 执行移动事件
            runMoveEvent(_, $th, $nextTh, isIconFollowText);

            // 绑定停止事件
            runStopEvent(_, $table, $th, $td, adjustAfter);
            return false;
        });
    }

    /**
     * 消毁
     * @param _
     */
    destroy(_) {
        clearTargetEvent(eventMap[_]);
    }
}
export default new Adjust();
