/*
 * adjust: 宽度调整
 * 宽度调整是通过 jTool 进行的事件绑定
 */
import './style.less';
import jTool from '@jTool';
import { getQuerySelector, getTable, getTh, getFakeThead, getThead, getFakeVisibleTh, getColTd, getThTextWidth, updateScrollStatus, clearTargetEvent } from '@common/base';
import { FAKE_TABLE_HEAD_KEY, NO_SELECT_CLASS_NAME, TH_VISIBLE } from '@common/constants';
import { CLASS_ADJUST_ACTION, CLASS_ADJUST_SELECT } from './constants';
import { getSettings, updateCache } from '@common/cache';
import { getEvent, eventMap } from './event';

/**
 * 执行移动事件
 * @param gridManagerName
 * @param $th
 * @param $nextTh
 * @param isIconFollowText: 表头的icon图标是否跟随文本
 * @private
 */
const runMoveEvent = (gridManagerName, $th, $nextTh, isIconFollowText) => {
    let _thWidth = null;
    let	_NextWidth = null;
    let _thMinWidth = getThTextWidth(gridManagerName, $th, isIconFollowText);
    let	_NextThMinWidth = getThTextWidth(gridManagerName, $nextTh, isIconFollowText);
    const { target, events, selector } = eventMap[gridManagerName].adjusting;
    jTool(target).on(events, selector, function (event) {
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
            getTh(gridManagerName, $th).width(_thWidth);
            getTh(gridManagerName, $nextTh).width(_NextWidth);
            getFakeThead(gridManagerName).width(getThead(gridManagerName).width());
        }
    });
};

/**
 * 绑定鼠标放开、移出事件
 * @param gridManagerName
 * @param $table
 * @param $th
 * @param $td
 * @param adjustAfter
 * @private
 */
const runStopEvent = (gridManagerName, $table, $th, $td, adjustAfter) => {
    const { adjusting, adjustAbort } = eventMap[gridManagerName];
    jTool(adjustAbort.target).on(adjustAbort.events, event => {
        jTool(adjustAbort.target).off(adjustAbort.events);
        jTool(adjusting.target).off(adjusting.events, adjusting.selector);

        // 宽度调整成功回调事件
        if ($th.hasClass(CLASS_ADJUST_SELECT)) {
            adjustAfter(event);
        }
        $th.removeClass(CLASS_ADJUST_SELECT);
        $td.removeClass(CLASS_ADJUST_SELECT);
        $table.removeClass(NO_SELECT_CLASS_NAME);

        // 更新滚动轴状态
        updateScrollStatus(gridManagerName);

        // 更新存储信息
        updateCache(gridManagerName);
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
     * @param: gridManagerName
     */
    init(gridManagerName) {
        // 监听鼠标调整列宽度
        eventMap[gridManagerName] = getEvent(gridManagerName, getQuerySelector(gridManagerName));

        const { target, events, selector } = eventMap[gridManagerName].adjustStart;

        jTool(target).on(events, selector, function (event) {
            // 事件源所在的th
            const $th = jTool(this).closest('th');

            // 事件源所在的table
            const $table = getTable(gridManagerName);

            // 当前存储属性
            const { adjustBefore, adjustAfter, isIconFollowText } = getSettings(gridManagerName);

            // 事件源同层级下的所有th
            const $allTh = getFakeVisibleTh(gridManagerName);

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
            runMoveEvent(gridManagerName, $th, $nextTh, isIconFollowText);

            // 绑定停止事件
            runStopEvent(gridManagerName, $table, $th, $td, adjustAfter);
            return false;
        });

        this.resetAdjust(gridManagerName);
    }

    /**
     * 通过缓存配置成功后, 重置宽度调整事件源dom 用于禁用最后一列调整宽度事件
     * @param gridManagerName
     * @returns {boolean}
     */
    resetAdjust(gridManagerName) {
        let _thList = jTool(`[${FAKE_TABLE_HEAD_KEY}="${gridManagerName}"] [${TH_VISIBLE}="visible"]`);
        let	_adjustAction = jTool(`.${CLASS_ADJUST_ACTION}`, _thList);
        if (!_adjustAction || _adjustAction.length === 0) {
            return false;
        }
        _adjustAction.show();
        _adjustAction.eq(_adjustAction.length - 1).hide();
    }

    /**
     * 消毁
     * @param gridManagerName
     */
    destroy(gridManagerName) {
        clearTargetEvent(eventMap[gridManagerName]);
    }
}
export default new Adjust();
