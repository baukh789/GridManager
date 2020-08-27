import jTool from '@jTool';
import { compileFullColumn } from '@common/framework';
import { isElement, isFunction, isNumber } from '@jTool/utils';
import { clearTargetEvent, getDiv, getQuerySelector } from '@common/base';
import { getSettings } from '@common/cache';
import { getEvent, eventMap } from './event';
import './style.less';
import {EVENTS, SELECTOR, TARGET} from '@common/events';
import { TR_CACHE_KEY, PX, FOLD_KEY } from '@common/constants';

// 折叠事件区域
const FOLD_ACTION = 'full-column-fold';

// 获取通栏
const getFullObject = (settings, colspan, template, useFold, openState, row, index, model) => {
    // 通栏tr
    let { text, compileAttr } = compileFullColumn(settings, row, index, template, model);
    text = isElement(text) ? text.outerHTML : text;

    // 在useFold开启时添加特定属性
    let foldAttr = [];
    if (useFold) {
        foldAttr = [`full-column-state="${openState}"`, `full-column-key=${index}`];
    }

    return {
        className: [],
        attribute: [`full-column="${model}"`].concat(foldAttr),
        tdList: [`<td colspan="${colspan}"><div class="full-column-div" ${compileAttr}>${text}</div></td>`]
    };
};

// 获取通栏间隔
const getIntervalObject = (colspan, interval = 0) => {
    // 对于数字类型的间隔增加单位
    if (isNumber(interval)) {
        interval = interval + PX;
    }
    return {
        className: [],
        attribute: [`full-column-interval="${interval}"`],
        tdList: [`<td colspan="${colspan}"><div style="height: ${interval}"></div></td>`]
    };
};

/**
 * 为trObjectList添加通栏对象
 * @param settings
 * @param row
 * @param index
 * @param trObjectList
 * @param model
 */
const addObject = (settings, row, index, trObjectList, model) => {
    const { columnMap, fullColumn } = settings;
    const { topTemplate, bottomTemplate, useFold, interval, openState = false } = fullColumn;
    const colspan = Object.keys(columnMap).length;
    if (model === 'top' && isFunction(topTemplate)) {
        const topFull = getFullObject(settings, colspan, topTemplate, useFold, openState, row, index, model);
        if (topFull) {
            trObjectList.push(topFull);
        }
    }
    if (model === 'bottom' && isFunction(bottomTemplate)) {
        const bottomFull = getFullObject(settings, colspan, bottomTemplate, useFold, openState, row, index, model);
        if (bottomFull) {
            trObjectList.push(bottomFull);
        }
    }
    if (model === 'bottom' && (isFunction(topTemplate) || isFunction(bottomTemplate))) {
        trObjectList.push(getIntervalObject(colspan, interval));
    }
};
// 获取icon class name
const getIconClass = state => {
    return state ? 'gm-icon-sub' : 'gm-icon-add';
};

class FullColumn {
    init(_) {
        const { useFold } = getSettings(_).fullColumn;

        // interval 用于在css内区分边框线的显示逻辑
        getDiv(_).attr('gm-full-column', '');

        if (useFold) {
            eventMap[_] = getEvent(`${getQuerySelector(_)} tbody`, FOLD_ACTION);
            const fold = eventMap[_].fold;
            jTool(fold[TARGET]).on(fold[EVENTS], fold[SELECTOR], function () {
                const $onlyFold = jTool(this);
                const $tr = $onlyFold.closest('tr');
                const cacheKey = $tr.attr(TR_CACHE_KEY);
                const $fullColumn = jTool(`${getQuerySelector(_)} tbody [full-column-key="${cacheKey}"]`);
                const openState = !($onlyFold.attr(FOLD_ACTION) === 'true');
                $onlyFold.attr(FOLD_ACTION, openState);
                $fullColumn.attr('full-column-state', openState);
                $tr.attr('full-column-state', openState);

                $onlyFold.removeClass(getIconClass(!openState));
                $onlyFold.addClass(getIconClass(openState));
            });
        }
    }

    /**
     * 增加顶部通栏: 与底部的一起在coreDOM中调用
     * @param settings
     * @param row
     * @param index
     * @param trObjectList
     */
    addTop(settings, row, index, trObjectList) {
        addObject(settings, row, index, trObjectList, 'top');
    }

    /**
     * 增加底部通栏: 与顶部的一起在coreDOM中调用
     * @param settings
     * @param row
     * @param index
     * @param trObjectList
     */
    addBottom(settings, row, index, trObjectList) {
        addObject(settings, row, index, trObjectList, 'bottom');
    }

    /**
     * 获取TD: 选择列对象
     * @param settings
     * @returns {}
     */
    getColumn(settings) {
        const { openState = false, fixed } = settings.fullColumn;
        return {
            key: FOLD_KEY,
            text: '',
            isAutoCreate: true,
            isShow: true,
            disableCustomize: true,
            width: '40px',
            fixed,
            template: () => {
                return `<td gm-create gm-fold><i class="gm-icon ${getIconClass(openState)}" ${FOLD_ACTION}="${openState}"></i></td>`;
            }
        };
    }

    /**
     * 消毁
     * @param _
     */
    destroy(_) {
        clearTargetEvent(eventMap[_]);
    }
}
export default new FullColumn();
