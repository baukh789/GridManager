import jTool from '@jTool';
import { compileFullColumn } from '@common/framework';
import { isElement, isFunction, isNumber } from '@jTool/utils';
import { clearTargetEvent, getDiv, getQuerySelector } from '@common/base';
import { getSettings } from '@common/cache';
import { getEvent, eventMap } from './event';
import './style.less';
import {EVENTS, SELECTOR, TARGET} from '@common/events';
import { TR_CACHE_KEY, PX, FOLD_KEY, TR_PARENT_KEY } from '@common/constants';
import { SettingObj, Row, FullColumnTemplate, TrObject } from 'typings/types';

// 折叠事件区域
const FOLD_ACTION = 'full-column-fold';

// 通栏状态标识
const FULL_COLUMN_STATE = 'full-column-state';

// 获取通栏
const getFullObject = (settings: SettingObj, colspan: number, template: FullColumnTemplate, useFold: boolean, openState: boolean, row: Row, index: number, model: string): TrObject => {
    // 通栏tr
    let { text, compileAttr } = compileFullColumn(settings, row, index, template, model);
    text = isElement(text) ? (text as HTMLTableElement).outerHTML : text;

    // 在useFold开启时添加特定属性
    let foldAttr: Array<Array<string>> = [];
    if (useFold) {
        foldAttr = [
        	[FULL_COLUMN_STATE, openState + '']
		];
    }

    return {
        className: [],
        attribute: [
        	['full-column', model],
			[TR_PARENT_KEY, index + '']
		].concat(foldAttr),
		querySelector: `[full-column][${TR_PARENT_KEY}="${index}"]`,
        tdList: [`<td colspan="${colspan}"><div class="full-column-div" ${compileAttr}>${text}</div></td>`]
    };
};

// 获取通栏间隔
const getIntervalObject = (colspan: number, index: number, interval: number | string = 0): TrObject => {
    // 对于数字类型的间隔增加单位 todo 需要验证interval是否存在string的情况
    if (isNumber(interval)) {
        interval = interval + PX;
    }
    return {
        className: [],
        attribute: [['full-column-interval', interval + ''], [TR_PARENT_KEY, index + '']],
		querySelector: `[full-column-interval][${TR_PARENT_KEY}="${index}"]`,
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
const addObject = (settings: SettingObj, row: Row, index: number, trObjectList: Array<TrObject>, model: string): void => {
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
        trObjectList.push(getIntervalObject(colspan, index, interval));
    }
};
// 获取icon class name
const getIconClass = (state: boolean): string => {
    return state ? 'gm-icon-sub' : 'gm-icon-add';
};

// 获取容器内指定的通栏节点 todo 未进行单元测试
export const getFullColumnTr = (dom: Element | DocumentFragment, type:string, cacheKey: string) => {
	return dom.querySelector(`[full-column="${type}"][${TR_PARENT_KEY}="${cacheKey}"]`);
};

// 获取容器内指定的分割节点 todo 未进行单元测试
export const getFullColumnInterval = (dom: Element | DocumentFragment, cacheKey: string) => {
	return dom.querySelector(`[full-column-interval][${TR_PARENT_KEY}="${cacheKey}"]`);
};

class FullColumn {
    init(_: string): void {
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
                const $fullColumn = jTool(`${getQuerySelector(_)} tbody [${TR_PARENT_KEY}="${cacheKey}"]`);
                const openState = !($onlyFold.attr(FOLD_ACTION) === 'true');
                $onlyFold.attr(FOLD_ACTION, openState);
                $fullColumn.attr(FULL_COLUMN_STATE, openState);
                $tr.attr(FULL_COLUMN_STATE, openState);

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
    addTop(settings: SettingObj, row: Row, index: number, trObjectList: Array<TrObject>): void {
        addObject(settings, row, index, trObjectList, 'top');
    }

    /**
     * 增加底部通栏: 与顶部的一起在coreDOM中调用
     * @param settings
     * @param row
     * @param index
     * @param trObjectList
     */
    addBottom(settings: SettingObj, row: Row, index: number, trObjectList: Array<TrObject>): void {
        addObject(settings, row, index, trObjectList, 'bottom');
    }

    /**
     * 获取TD: 选择列对象
     * @param settings
     * @returns {}
     */
    getColumn(settings: SettingObj): object {
        const { openState = false, fixed, text = '', width = '40px', align = '', remind } = settings.fullColumn;
        return {
            key: FOLD_KEY,
            text,
            isAutoCreate: true,
            isShow: true,
            disableCustomize: true,
			align,
			remind,
            width,
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
    destroy(_: string): void {
        clearTargetEvent(eventMap[_]);
    }
}
export default new FullColumn();
