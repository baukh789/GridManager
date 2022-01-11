/*
 * sort: 排序
 */
import './style.less';
import jTool from '@jTool';
import { extend, isUndefined, isFunction, isObject, each, isEmptyObject } from '@jTool/utils';
import { outWarn } from '@common/utils';
import { getQuerySelector, getThName, clearTargetEvent } from '@common/base';
import { getSettings, setSettings } from '@common/cache';
import { TH_NAME, SORT_CLASS } from '@common/constants';
import { parseTpl } from '@common/parse';
import core from '../core';
import sortTpl from './sort.tpl.html';
import { getEvent, eventMap } from './event';
import { TARGET, EVENTS, SELECTOR } from '@common/events';
import { SortData } from 'typings/types';


/**
 * 更新排序样式
 * @param _
 */
const updateSortStyle = (_: string): void => {
    const { sortData, sortUpText, sortDownText } = getSettings(_);
    const upClass = 'sorting-up';
    const downClass = 'sorting-down';
    const thAttr = 'sorting';

    // 重置排序样式
    each(jTool(`${getQuerySelector(_)} .${SORT_CLASS}`), (v: HTMLElement) => {
        jTool(v).removeClass(`${upClass} ${downClass}`);
        jTool(v).closest('th').attr(thAttr, '');
    });

    // 根据排序数据更新排序
    each(sortData, (key: string, value: string) => {
        // 这里未用getTh的原因: getTh方法只能获取th, 这里需要同时对th和 fake-th进行操作
        const $th = jTool(`${getQuerySelector(_)} th[${TH_NAME}="${key}"]`);
        const $sortAction = jTool(`.${SORT_CLASS}`, $th);

        // 排序操作：升序
        if (value === sortUpText) {
            $sortAction.addClass(upClass);
            $sortAction.removeClass(downClass);
            $th.attr(thAttr, sortUpText);
        }

        // 排序操作：降序
        if (value === sortDownText) {
            $sortAction.addClass(downClass);
            $sortAction.removeClass(upClass);
            $th.attr(thAttr, sortDownText);
        }
    });
};

/*
 * 手动设置排序
 * @param _
 * @param sortJson: 排序信息
 * 格式: {key: value} key 需要与参数 columnData 中的 key匹配, value  为参数 sortUpText 或 sortDownText 的值
 * 示例: sortJson => {name: 'ASC}
 * @param callback: 回调函数[function]
 * @param refresh: 是否执行完成后对表格进行自动刷新[boolean, 默认为true]
 * */
export const updateSort = (_: string, sortJson: SortData, callback?: any, refresh?: boolean): void => {
    if (!isObject(sortJson) || isEmptyObject(sortJson)) {
        outWarn('sortJson unavailable');
        return;
    }

    const settings = getSettings(_);

    // 单例排序: 清空原有排序数据
    if (!settings.isCombSorting) {
        settings.sortData = {};
    }

    extend(settings.sortData, sortJson);
    setSettings(settings);

    // 回调函数为空时赋值空方法
    if (!isFunction(callback)) {
        callback = () => {};
    }

    // 默认执行完后进行刷新列表操作
    if (isUndefined(refresh)) {
        refresh = true;
    }

    // 合并排序请求
    const query = extend({}, settings.query, settings.sortData, settings.pageData);

    // 执行排序前事件
    settings.sortingBefore(query);

    // 执行更新
    if (refresh) {
        core.refresh(_, (response: object) => {
            // 更新排序样式
            updateSortStyle(_);

            // 执行回调函数
            callback(response);

            // 排行排序后事件
            settings.sortingAfter(query);
        });
    } else {
        // 执行回调函数
        callback();

        // 排行排序后事件
        settings.sortingAfter(query);
    }
};

class Sort {
    /**
     * 初始化排序
     * @param _
     */
    init(_: string): void {
        eventMap[_] = getEvent(_, getQuerySelector(_));
        const { start } = eventMap[_];

        // 绑定排序事件
        jTool(start[TARGET]).on(start[EVENTS], start[SELECTOR], function (e: MouseEvent) {
            // th对应的名称
            const thName = getThName(jTool(this).closest('th'));
            const { sortData, sortMode, sortUpText, sortDownText } = getSettings(_);

            const oldSort = sortData[thName];

            let newSort = '';

            // 升降序单一触发(点击同一个小箭头可取消)
            if (sortMode === 'single') {
                const $i = jTool(<HTMLElement>e.target);
                // 触发源: 向上小箭头
                if ($i.hasClass('sa-up')) {
                    newSort = oldSort === sortUpText ? '' : sortUpText;
                }
                // 触发源: 向下小箭头
                if ($i.hasClass('sa-down')) {
                    newSort = oldSort === sortDownText ? '' : sortDownText;
                }
            }

            // 升降序整体触发
            if (sortMode === 'overall') {
                newSort = oldSort === sortDownText ? sortUpText : sortDownText;
            }
            const sortJson = {
                [thName]: newSort
            };

            updateSort(_, sortJson);
        });
    }

    /**
	 * 获取排序所需HTML
	 * @returns {parseData}
     */
	@parseTpl(sortTpl)
	createHtml(params: any): string {
		const { type, sortUpText, sortDownText } = params;
		let typeClass = '';
		switch (type) {
			case sortUpText:
				typeClass = ' sorting-up';
				break;
			case sortDownText:
				typeClass = ' sorting-down';
				break;
		}
		// @ts-ignore
		return {
			typeClass: typeClass
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
export default new Sort();
