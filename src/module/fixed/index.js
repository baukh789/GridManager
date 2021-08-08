/**
 * fixed[固定列]
 * 参数说明:
 *  - columnData[fixed]: 配置后同列的disableCustomize属性将强制变更为true;
 *      - type: String
 *      - value: ['left', 'right']
 *      - default: undefined
 *
 * 实现原理:
 * thead区域的固定th使用 absolute 定位，不使用sticky的原因是Firefox在设置了position: absolute的父容器内定位异常;
 * tbody区域的固定td使用 sticky 定位，通过脚本动态生成style标签;
 */
import {
    getTh,
    getFakeTh,
    getDiv,
    getThead,
    getFakeThead,
    getTbody,
    getFakeVisibleTh,
    getQuerySelector, clearTargetEvent
} from '@common/base';
import { DIV_KEY, EMPTY_TPL_KEY, PX } from '@common/constants';
import jTool from '@jTool';
import { each } from '@jTool/utils';
import scroll from '@module/scroll';
import { getEvent, eventMap } from './event';
import { TARGET, EVENTS, SELECTOR } from '@common/events';
import './style.less';

const LEFT = 'left';
const RIGHT = 'right';
const SHADOW_COLOR = '#e8e8e8';
/**
 * 动态设置td的stick left 或 right: 浏览器缩放时该值需要重置
 * @param _
 * @param style
 * @param index
 * @param directionValue
 */
const setDirectionValue = (_, style, index, directionValue) => {
    style.setProperty(`--gm-${_}-${index}-sticky-value`, directionValue + PX);
};

/**
 * 获取sticky所需的css
 * @param _
 * @param index
 * @param direction
 * @param shadowValue
 * @returns {string}
 */
const getStickyCss = (_, index, direction, shadowValue) => {
    return `[${DIV_KEY}="${_}"][gm-overflow-x="true"] tr:not([${EMPTY_TPL_KEY}]) td:nth-of-type(${index + 1}){`
           + 'position: sticky;\n'
           + 'position: -webkit-sticky;\n' // 解决safari兼容问题
           + `${direction}: var(--gm-${_}-${index}-sticky-value);\n`
           + 'z-index: 3;\n'
           + `box-shadow: ${shadowValue};`
        + '}';
};

// 存储DOM节点，用于节省DOM查询操作(在scroll和adjust中操作会很频繁)
const FIXED_LEFT_MAP = {};
const FIXED_RIGHT_MAP = {};

// 存储当前实例部分属性，用于减少DOM操作: 当该值不变时, 不执行更新操作
const FIXED_CACHE_MAP = {};

// 固定列td触焦标识
const FIXED_FOCUS_FLAG = 'fixed-focus';
class Fixed {
    /**
     * 生成td固定列样式: 通过添加style的方式比修改td的dom性能会高
     * @param _
     */
    init(settings) {
        const { _, browser, columnMap } = settings;

        const $tableDiv = getDiv(_);
        const styleId = `fixed-style-${_}`;
        let styleLink = document.getElementById(styleId);

        if (!styleLink) {
            styleLink = document.createElement('style');
            styleLink.id = styleId;
        }

        // 绑定固定列td触焦事件
        const tableSelector = getQuerySelector(_);
        eventMap[_] = getEvent(_, tableSelector);
        const { fixedFocus } = eventMap[_];
        jTool(fixedFocus[TARGET]).on(fixedFocus[EVENTS], fixedFocus[SELECTOR], function () {
            getTbody(_).find(`[${FIXED_FOCUS_FLAG}]`).removeAttr(FIXED_FOCUS_FLAG);
            this.setAttribute(FIXED_FOCUS_FLAG, '');
        });
        const $fakeThead = getFakeThead(_);

        // theadHeight: 这里使用thead 而不是 fakeThead的原因是因为这样可以获取更准确的值，不至于在框架中出现错误
        const theadHeight = getThead(_).height() + PX;
        let styleStr = '';

        let pl = 0;
        let pr = 0;
        const leftList = [];
        const rightList = [];
        each(columnMap, (key, col) => {
            if (col.fixed === 'left') {
               leftList.push(col);
           }
            if (col.fixed === 'right') {
                rightList.push(col);
            }
        });
        const leftLen = leftList.length;
        let shadowValue = 'none';
        FIXED_LEFT_MAP[_] = leftList.sort((a, b) => a.index - b.index);
        each(FIXED_LEFT_MAP[_], (col, index) => {
            const $fakeTh = getFakeTh(_, col.key);
            if (index === leftLen - 1) {
                shadowValue = `2px 0 4px ${SHADOW_COLOR}`;
            }
            styleStr += getStickyCss(_, col.index, LEFT, shadowValue);
            col.pl = pl;
            pl += col.width;
            $fakeTh.css({
                height: theadHeight,
                lineHeight: theadHeight,
                boxShadow: shadowValue
            });
        });

        // 兼容性处理: safari 需要-1
        if (browser === 'safari') {
            pl--;
        }
        $fakeThead.css('padding-left', pl);

        shadowValue = 'none';
        const rightLen = rightList.length;
        FIXED_RIGHT_MAP[_] = rightList.sort((a, b) => b.index - a.index);
        FIXED_RIGHT_MAP[_].forEach((col, index) => {
            const $fakeTh = getFakeTh(_, col.key);
            if (index === rightLen - 1) {
                shadowValue = `-2px 0 4px ${SHADOW_COLOR}`;
            }
            $fakeTh.css({
                height: theadHeight,
                lineHeight: theadHeight,
                boxShadow: shadowValue
            });
            styleStr += getStickyCss(_, col.index, RIGHT, shadowValue);
            col.pr = pr;
            pr += col.width;
        });
        $fakeThead.css('padding-right', pr);

        styleLink.innerHTML = styleStr;
        $tableDiv.append(styleLink);

        this.resetFlag(_);
    }

    /**
     * 渲染fake thead: 是fake thead使用了绝对定位，在th使用sticky时，需要实时修正left | right值
     * @param _
     */
    update(_) {
        const $tableDiv = getDiv(_);
        const tableDivStyle = $tableDiv.get(0).style;
        const scrollLeft = $tableDiv.scrollLeft();
        const divWidth = $tableDiv.width();
        const theadWidth = getFakeThead(_).width();
        const tbodyHeight = getTbody(_).height();

        // 性能: 当属性未变更时，不再执行DOM操作
        if (FIXED_CACHE_MAP[_]
            && FIXED_CACHE_MAP[_].divWidth === divWidth
            && FIXED_CACHE_MAP[_].scrollLeft === scrollLeft
            && FIXED_CACHE_MAP[_].theadWidth === theadWidth
            && FIXED_CACHE_MAP[_].tbodyHeight === tbodyHeight) {
            return;
        }
        FIXED_CACHE_MAP[_] = {
            divWidth,
            scrollLeft,
            theadWidth,
            tbodyHeight
        };

        const overFlow = getDiv(_).attr('gm-overflow-x') === 'true';
        const getThWidth = (_, col) => {
            if (overFlow) {
                return getTh(_, col.key).width();
            }
            return col.width;
        };

        // left fixed
        if (FIXED_LEFT_MAP[_] && FIXED_LEFT_MAP[_].length) {
            let pl = 0;
            let width;
            each(FIXED_LEFT_MAP[_], col => {
                // 不直接使用col的原因: 浏览器缩放时，固定列不会跟随变更
                width = getThWidth(_, col);
                getFakeTh(_, col.key).css({
                    width,
                    'left': pl + scrollLeft
                });

                setDirectionValue(_, tableDivStyle, col.index, pl);
                pl += width;
            });
            getFakeThead(_).css('padding-left', pl);
        }

        // right fixed
        if (FIXED_RIGHT_MAP[_] && FIXED_RIGHT_MAP[_].length) {
            let scrollRight = theadWidth - $tableDiv.width() - scrollLeft;

            // 存在Y轴滚动轴
            if (getTbody(_).height() > $tableDiv.get(0).clientHeight) {
                scrollRight += scroll.width;
            }

            let pr = 0;
            let width;
            FIXED_RIGHT_MAP[_].forEach(col => {
                // 不直接使用col的原因: 浏览器缩放时，固定列不会跟随变更
                width = getThWidth(_, col);
                getFakeTh(_, col.key).css({
                    width,
                    'right': pr + scrollRight
                });
                setDirectionValue(_, tableDivStyle, col.index, pr);
                pr += width;
            });
            getFakeThead(_).css('padding-right', pr);
        }
    }

    /**
     * 更新right fixed previous标识
     * @param _
     */
    resetFlag(_) {
        // 当前不存在 right fixed
        if (!FIXED_RIGHT_MAP[_] || !FIXED_RIGHT_MAP[_].length) {
            return;
        }

        const fixedPrevious = 'fixed-previous';
        const $firstFixedFakeTh = getFakeThead(_).find('th[fixed="right"]').eq(0);
        const $allVisibleTh = getFakeVisibleTh(_);
        const index = $firstFixedFakeTh.index($allVisibleTh);

        $allVisibleTh.removeAttr(fixedPrevious);
        $allVisibleTh.eq(index - 1).attr(fixedPrevious, '');
    }

    /**
     * 消毁
     * @param _
     */
    destroy(_) {
        delete FIXED_LEFT_MAP[_];
        delete FIXED_RIGHT_MAP[_];
        clearTargetEvent(eventMap[_]);
    }
}

export default new Fixed();
