import jTool from '@jTool';
import { compileFullColumn } from '@common/framework';
import { isElement, isFunction, isNumber } from '@jTool/utils';
import { clearTargetEvent, getDiv, getQuerySelector } from '@common/base';
import { getSettings } from '@common/cache';
import { getEvent, eventMap } from './event';
import './style.less';
import {EVENTS, SELECTOR, TARGET} from '@common/events';
import { TR_CACHE_KEY, PX } from '@common/constants';

// 获取通栏
const getFullObject = (settings, colspan, template, useFold, openState, row, index, model) => {
    // 通栏tr
    let { text, compileAttr } = compileFullColumn(settings, row, index, template, model);
    text = isElement(text) ? text.outerHTML : text;

    // 仅在useFold开启时会使用到的属性
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

// 获取icon class name
export const getIconClass = state => {
    return state ? 'gm-icon-sub' : 'gm-icon-add';
};

class FullColumn {
    init(_) {
        const { useFold } = getSettings(_).fullColumn;

        // interval 用于在css内区分边框线的显示逻辑
        getDiv(_).attr('gm-full-column', '');

        if (useFold) {
            eventMap[_] = getEvent(_, `${getQuerySelector(_)} tbody`);
            const { fold } = eventMap[_];
            jTool(fold[TARGET]).on(fold[EVENTS], fold[SELECTOR], function () {
                const $onlyFold = jTool(this);
                const $tr = $onlyFold.closest('tr');
                const cacheKey = $tr.attr(TR_CACHE_KEY);
                const $fullColumn = jTool(`${getQuerySelector(_)} tbody [full-column-key="${cacheKey}"]`);
                const openState = !($onlyFold.attr('full-column-fold') === 'true');
                $onlyFold.attr('full-column-fold', openState);
                $fullColumn.attr('full-column-state', openState);
                $tr.attr('full-column-state', openState);

                $onlyFold.removeClass(getIconClass(!openState));
                $onlyFold.addClass(getIconClass(openState));
            });
        }
    }

    /**
     * 为trObjectList添加通栏对象
     * @param settings
     * @param row
     * @param index
     * @param trObjectList
     * @param model
     */
    add(settings, row, index, trObjectList, model) {
        const { columnMap, fullColumn } = settings;
        let { topTemplate, bottomTemplate, useFold, interval } = fullColumn;

        let openState = true;

        // 未使用折叠功能时，状态强制更新为关闭
        if (useFold) {
            openState = false;
        }
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
    }

    /**
     * 增加顶部通栏: 与底部的一起在coreDOM中调用
     * @param settings
     * @param row
     * @param index
     * @param trObjectList
     */
    addTop(settings, row, index, trObjectList) {
        this.add(settings, row, index, trObjectList, 'top');
    }

    /**
     * 增加底部通栏: 与顶部的一起在coreDOM中调用
     * @param settings
     * @param row
     * @param index
     * @param trObjectList
     */
    addBottom(settings, row, index, trObjectList) {
        this.add(settings, row, index, trObjectList, 'bottom');
    }

    /**
     * 获取TD: 选择列对象
     * @param conf
     * @returns {parseData}
     */
    getColumn(conf) {
        return {
            key: 'gm-full-column',
            text: '',
            isAutoCreate: true,
            isShow: true,
            disableCustomize: true,
            width: '40px',
            align: 'center',
            template: () => {
                return '<td gm-create gm-fold><span full-column-fold><i class="gm-icon gm-icon-add"></i></span></td>';
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
