/**
 * Created by baukh on 18/7/11.
 * 表头的筛选菜单
 */
import './style.less';
import jTool from '@jTool';
import { each, extend } from '@jTool/utils';
import { getSettings, setSettings } from '@common/cache';
import { getQuerySelector, getWrap, getDiv, getThName, clearTargetEvent } from '@common/base';
import { CHECKED, UNCHECKED, TH_NAME, PX } from '@common/constants';
import { parseTpl } from '@common/parse';
import core from '../core';
import checkbox, { updateRadioState, updateCheckboxState } from '../checkbox';
import i18n from '../i18n';
import filterTpl from './filter.tpl.html';
import { getEvent, eventMap } from './event';
import { CLASS_FILTER, CLASS_FILTER_SELECTED, CLASS_FILTER_CONTENT } from './constants';
import { TARGET, EVENTS, SELECTOR } from '@common/events';
import { JTool, SettingObj, FilterObject } from 'typings/types';

// 选中数据使用的分隔符
const FILTER_SELECTED_FLAG = ',';
class Filter {
    /**
     * 初始化
     * @param _
     */
    init(_: string): void {
        const _this = this;
        const $body = jTool('body');
        const tableSelector = getQuerySelector(_);

        eventMap[_] = getEvent(_, tableSelector);
        const { toggle, close, submit, reset, checkboxAction, radioAction } = eventMap[_];

        // 事件: 切换可视状态
        jTool(toggle[TARGET]).on(toggle[EVENTS], toggle[SELECTOR], function (e: MouseEvent) {
            e.stopPropagation();
            e.preventDefault();
            const $allFilterCon = jTool(`${tableSelector} .${CLASS_FILTER_CONTENT}`);
            const $action = jTool(this);
            const $filterAction = $action.closest(`.${CLASS_FILTER}`);
            const $th = $action.closest(`th[${TH_NAME}]`);
            const thName = getThName($th);
            const $filterCon = $filterAction.find(`.${CLASS_FILTER_CONTENT}`);

            // 清除事件源的其它过滤体
            each($allFilterCon, (item: HTMLElement) => {
                $filterCon.get(0) !== item ? item.style.display = 'none' : '';
            });

            // 更新当前表格下所有表过滤体的状态
            const settings = getSettings(_);
            _this.update($th, settings.columnMap[thName].filter);

            const isShow = $filterCon.css('display') !== 'none';
            isShow ? $filterCon.hide() : $filterCon.show();
            const leftClass = 'direction-left';
            const rigthClass = 'direction-right';
            if ($filterAction.offset().left + $filterCon.width() > getDiv(_).width()) {
                $filterCon.addClass(rigthClass);
                $filterCon.removeClass(leftClass);
            } else {
                $filterCon.addClass(leftClass);
                $filterCon.removeClass(rigthClass);
            }

            // 点击空处关闭
            jTool(close[TARGET]).on(close[EVENTS], function (e: MouseEvent) {
                const eventSource = jTool(<HTMLElement>e.target);
                if (eventSource.hasClass(CLASS_FILTER_CONTENT) || eventSource.closest(`.${CLASS_FILTER_CONTENT}`).length === 1) {
                    return false;
                }
                const $filterCon = $body.find(`.${CLASS_FILTER_CONTENT}`);
                $filterCon.hide();
                jTool(close[TARGET]).off(close[EVENTS]);
            });
        });

        // 事件: 提交选中结果
        jTool(submit[TARGET]).on(submit[EVENTS], submit[SELECTOR], function () {
            const $action = jTool(this);
            const $filterCon = $action.closest(`.${CLASS_FILTER_CONTENT}`);
            const $filters = jTool('.gm-radio-checkbox-input', $filterCon);
            const $th = $filterCon.closest('th');
            const thName = getThName($th);
            const checkedList: Array<string> = [];
            each($filters, (item: HTMLInputElement) => {
                item.checked && checkedList.push(item.value);
            });

            const settings = getSettings(_);
            const checkedStr = checkedList.join(FILTER_SELECTED_FLAG);
            settings.columnMap[thName].filter.selected = checkedStr;
            settings.pageData[settings.currentPageKey] = 1;
            extend(settings.query, {[thName]: checkedStr});
            setSettings(settings);

            _this.update($th, settings.columnMap[thName].filter);
            core.refresh(_);
            $filterCon.hide();
            jTool(close[TARGET]).off(close[EVENTS]);
        });

        // 事件: 清空选中结果
        jTool(reset[TARGET]).on(reset[EVENTS], reset[SELECTOR], function () {
            const $action = jTool(this);
            const $filterCon = $action.closest(`.${CLASS_FILTER_CONTENT}`);
            const $th = jTool(this).closest(`th[${TH_NAME}]`);
            const thName = getThName($th);

            const settings = getSettings(_);
            delete settings.query[thName];
            settings.columnMap[thName].filter.selected = '';
            settings.pageData[settings.currentPageKey] = 1;
            setSettings(settings);

            _this.update($th, settings.columnMap[thName].filter);
            core.refresh(_);
            $filterCon.hide();
            jTool(close[TARGET]).off(close[EVENTS]);
        });

        // 事件: 复选框事件
        jTool(checkboxAction[TARGET]).on(checkboxAction[EVENTS], checkboxAction[SELECTOR], function () {
            const $checkbox = jTool(this).closest('.filter-checkbox').find('.gm-checkbox');
            updateCheckboxState($checkbox, this.checked ? CHECKED : UNCHECKED);
        });

        // 事件: 单选框事件
        jTool(radioAction[TARGET]).on(radioAction[EVENTS], radioAction[SELECTOR], function () {
            const $filterRadio = jTool(this).closest('.filter-list').find('.filter-radio');
            each($filterRadio, (item: HTMLInputElement) => {
                updateRadioState(jTool(item).find('.gm-radio'), this === item.querySelector('.gm-radio-input'));
            });
        });
    }

    /**
     * 表头的筛选菜单HTML
     * @param params
     * @returns {object}
     */
    @parseTpl(filterTpl)
    createHtml(params: { settings: SettingObj, columnFilter: FilterObject }): string {
        const { settings, columnFilter } = params;
        const tableWrapHeight = getWrap(settings._).height();
        let listHtml = '';
        columnFilter.selected = columnFilter.selected || '';
        columnFilter.option.forEach(item => {
            let selectedList = columnFilter.selected.split(FILTER_SELECTED_FLAG);
            selectedList = selectedList.map((s: string) => {
                return s.trim();
            });

            const parseData = {
                checked: selectedList.indexOf(item.value) !== -1,
                label: item.text,
                value: item.value
            };

            if (columnFilter.isMultiple) {
                listHtml += `<li class="filter-checkbox">${checkbox.getCheckboxTpl(parseData)}</li>`;
            } else {
                listHtml += `<li class="filter-radio">${checkbox.getRadioTpl(parseData)}</li>`;
            }
        });

		// @ts-ignore
        return {
            icon: columnFilter.selected ? ` ${CLASS_FILTER_SELECTED}` : '',
            style: `style="max-height: ${tableWrapHeight - 100 + PX}"`,
            ok: i18n(settings, 'ok'),
            reset: i18n(settings, 'reset'),
            list: listHtml
        };
    }

    /**
     * 更新filter选中状态
     * @param $th: fake-th
     * @param filter
     */
    update($th: JTool, filter: FilterObject): void {
        const $filterIcon = jTool('.fa-icon', $th);
        const $filters = jTool(`.${CLASS_FILTER_CONTENT} .gm-radio-checkbox-input`, $th);
        each($filters, (item: HTMLInputElement) => {
            let $radioOrCheckbox = jTool(item).closest('.gm-radio-checkbox');
            if (filter.isMultiple) {
                updateCheckboxState($radioOrCheckbox, filter.selected.split(FILTER_SELECTED_FLAG).includes(item.value) ? CHECKED : UNCHECKED);
            } else {
                updateRadioState($radioOrCheckbox, item.value === filter.selected);
            }
        });

        filter.selected ? $filterIcon.addClass(CLASS_FILTER_SELECTED) : $filterIcon.removeClass(CLASS_FILTER_SELECTED);
    }

    /**
     * 消毁
     * @param _
     */
    destroy(_: string): void {
        clearTargetEvent(eventMap[_]);
    }
}
export default new Filter();

