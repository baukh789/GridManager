/*
 * adjust: 宽度调整
 * 宽度调整是通过 jTool 进行的事件绑定
 */
import './style.less';
import jTool from '@jTool';
import { getQuerySelector, getDiv, getTable, getTh, getFakeThead, getThead, getFakeVisibleTh, getColTd, getThTextWidth, updateScrollStatus, clearTargetEvent } from '@common/base';
import { NO_SELECT_CLASS_NAME } from '@common/constants';
import { CLASS_ADJUST_ACTION, CLASS_ADJUST_SELECT } from './constants';
import { getSettings, updateCache } from '@common/cache';
import { getEvent, eventMap } from './event';
import { EVENTS, TARGET, SELECTOR } from '@common/events';
import fixed from '@module/fixed';
import {getStyle} from '../../jTool/utils';

/**
 * 执行移动事件
 * @param _
 * @param $th: fake th
 * @param $nextTh: fake th
 * @param isIconFollowText: 表头的icon图标是否跟随文本
 * @private
 */
const runMoveEvent = (_, $allTh, $th, $nextTh, isIconFollowText) => {
    let _thWidth;
    let _nextWidth = $nextTh.width();
    let _thMinWidth = getThTextWidth(_, $th, isIconFollowText);
    // let	_NextThMinWidth = getThTextWidth(_, $nextTh, isIconFollowText);
    const minWidth = getDiv(_).width();
    const { doing } = eventMap[_];
    const initWidth = Math.ceil(event.clientX - $th.offset().left);

    jTool(doing[TARGET]).on(doing[EVENTS], doing[SELECTOR], function (event) {
        _thWidth = Math.ceil(event.clientX - $th.offset().left);
        // _nextWidth = Math.ceil($nextTh.width() + $th.width() - _thWidth);
        // 验证是否更改
        if (_thWidth === $th.width()) {
            return;
        }

        // 当前th缩小
        if (initWidth > _thWidth) {
            // 缩小: th达到渲染所需的最小宽度
            if (_thWidth < _thMinWidth) {
                return;
            }

            // 缩小: 表格宽度达到容器的最小宽度
            const allWidth = [].reduce.call($allTh.DOMList, (acont, item) => {
                return acont + parseInt(getStyle(item, 'width'), 10);
            }, 0);
            if (allWidth <= minWidth) {
                const nowThWidth = $th.width();
                const nowNextWidth = $nextTh.width();
                _nextWidth = Math.ceil(nowNextWidth + nowThWidth - _thWidth) + (minWidth - allWidth);
                // 验证宽度是否匹配
                if (_thWidth + _nextWidth < nowThWidth + nowNextWidth) {
                    _nextWidth = nowThWidth + nowNextWidth - _thWidth;
                }
                $nextTh.width(_nextWidth);
            }
        }

        $th.width(_thWidth);

        // 修改与置顶thead 对应的 thead
        getTh(_, $th).width(_thWidth);
        getTh(_, $nextTh).width(_nextWidth);
        getFakeThead(_).width(getThead(_).width());

        // 更新滚动轴状态
        updateScrollStatus(_);

        // 更新固定列
        fixed.updateFakeThead(_);
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
            runMoveEvent(_, $allTh, $th, $nextTh, isIconFollowText);

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
