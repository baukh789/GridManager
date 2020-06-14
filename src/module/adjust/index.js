/**
 * adjust[宽度调整]
 * 参数说明:
 *  - supportAdjust: 指定列表是否开启宽度调整
 *      - type: Boolean
 *      - default: true
 *
 * 以下情况宽度调整将失效:
 *  - 配置项中存在topFullColumn
 *
 * 以下情况单一列的宽度调整功能将被禁用:
 *  - 自动生成的选择列、序号列
 *  - columnData[disableCustomize] === true的列
 *
 * 交互规则:
 *  - 拖动时出现虚线，当拖动结束时宽度生效、虚线消失
 *  - 向右调整时当前列增大，下一列不变，表格总宽增大，超出容器时出现X轴滚动条
 *  - 向左调整时分两种情况:
 *      - 表格宽度 > 容器宽度: 当前列减小，下一列不变，表格总宽减小；
 *      - 表格宽度 <= 容器宽度: 当前列宽减小，下一列增大，表格总宽不变；
 */
import './style.less';
import jTool from '@jTool';
import {
    getQuerySelector,
    getDiv,
    getTable,
    getFakeThead,
    getFakeVisibleTh,
    getColTd,
    getThTextWidth,
    updateScrollStatus,
    clearTargetEvent,
    getAllTh, getAllFakeTh
} from '@common/base';
import { NO_SELECT_CLASS_NAME } from '@common/constants';
import { getSettings, updateCache } from '@common/cache';
import { EVENTS, TARGET, SELECTOR } from '@common/events';
import fixed from '@module/fixed';
import { getEvent, eventMap } from './event';
import { CLASS_ADJUST_ACTION, CLASS_ADJUST_ING } from './constants';
import { getStyle, each } from '@jTool/utils';
import { DOM_LIST } from '@jTool/constants';

/**
 * 执行移动事件
 * @param _
 * @param allTh: fake all th
 * @param $th: fake th
 * @param $nextTh: fake th
 * @param thMinWidth: 当前th所允许的最小宽度
 * @param beforeThWidth: 当前th在移动前的宽度
 * @private
 */
const runMoveEvent = (_, allTh, $th, $nextTh, thMinWidth, beforeThWidth) => {
    let afterThWidth; // 变更后的宽度, 宽度调整中每一次调整都会更新一次这个值
    let nextThWidth = $nextTh.width(); // 位于触发宽度调整th下一个th
    const $div = getDiv(_);
    const divWidth = $div.width(); // 容器宽度
    const { doing } = eventMap[_];
    const $fakeThead = getFakeThead(_);
    let fakeTheadWidth = $fakeThead.width();
    fakeTheadWidth = fakeTheadWidth - nextThWidth - $th.width();
    jTool(doing[TARGET]).on(doing[EVENTS], doing[SELECTOR], function (event) {
        afterThWidth = Math.ceil(event.clientX - $th.offset().left);
        // 验证是否更改
        const nowThWidth = $th.width();
        if (afterThWidth === nowThWidth) {
            return;
        }

        // 当前th缩小
        if (beforeThWidth > afterThWidth) {
            // 缩小: th达到渲染所需的最小宽度
            if (afterThWidth < thMinWidth) {
                return;
            }

            // 缩小: 表格宽度达到容器的最小宽度
            const allWidth = [].reduce.call(allTh, (sum, item) => {
                return sum + parseInt(getStyle(item, 'width'), 10);
            }, 0);

            // 当前总宽度小于等于容器宽度: 将th减去的宽移至nextTh
            if (allWidth <= divWidth) {
                const nowNextWidth = $nextTh.width();
                nextThWidth = Math.ceil(nowNextWidth + nowThWidth - afterThWidth) + (divWidth - allWidth);
                // 验证宽度是否匹配
                if (afterThWidth + nextThWidth < nowThWidth + nowNextWidth) {
                    nextThWidth = nowThWidth + nowNextWidth - afterThWidth;
                }
            }
        } else {
            nextThWidth = $nextTh.width();
        }

        $fakeThead.width(fakeTheadWidth + afterThWidth + nextThWidth);
        $th.width(afterThWidth);
        $nextTh.width(nextThWidth);

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

        // 修改与置顶thead 对应的 thead
        each(getAllFakeTh(_), (th, i) => {
            getAllTh(_).eq(i).width(jTool(th).width());
        });

        // 更新滚动轴状态
        updateScrollStatus(_);

        adjustAfter(event);
        $table.removeClass(NO_SELECT_CLASS_NAME);

        // 删除移动中的虚线标识
        $th.find(`.${CLASS_ADJUST_ING}`).remove();

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
            const $thWrap = $th.find('.th-wrap');

            // 添加虚线标识及样式
            let $adjusting = $th.find(`.${CLASS_ADJUST_ING}`);
            if (!$adjusting.length) {
                const adjustingDOM = document.createElement('span');
                adjustingDOM.className = CLASS_ADJUST_ING;
                $thWrap.append(adjustingDOM);
                $adjusting = $th.find(`.${CLASS_ADJUST_ING}`);
            }
            const thHeight = $th.height();
            $adjusting.css({
                top: -(thHeight - $thWrap.height()) / 2,
                right: -($th.width() - $thWrap.width() + 1) / 2,
                height: getDiv(_).height() + thHeight
            });

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

            // 禁用文本选中
            $table.addClass(NO_SELECT_CLASS_NAME);

            // 执行移动事件
            runMoveEvent(_, $allTh[DOM_LIST], $th, $nextTh, getThTextWidth(_, $th, isIconFollowText), Math.ceil(event.clientX - $th.offset().left));

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
