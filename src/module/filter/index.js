/**
 * Created by baukh on 18/7/11.
 * 表头的筛选菜单
 */
import './style.less';
import jTool from '@jTool';
import extend from '@jTool/extend';
import { each } from '@jTool/utils';
import { getSettings, setSettings } from '@common/cache';
import { getQuerySelector, getWrap, getDiv, getThName, clearTargetEvent } from '@common/base';
import { CHECKED, UNCHECKED, TH_NAME } from '@common/constants';
import { parseTpl } from '@common/parse';
import core from '../core';
import checkbox from '../checkbox';
import i18n from '../i18n';
import filterTpl from './filter.tpl.html';
import { getEvent, eventMap } from './event';
import { CLASS_FILTER, CLASS_FILTER_SELECTED, CLASS_FILTER_CONTENT } from './constants';

class Filter {
    // 存储启用状态
    enable = {};

    /**
     * 初始化
     * @param gridManagerName
     */
    init(gridManagerName) {
        if (!this.enable[gridManagerName]) {
            return;
        }
        const _this = this;
        const $body = jTool('body');
        const tableSelector = getQuerySelector(gridManagerName);

        eventMap[gridManagerName] = getEvent(gridManagerName, tableSelector);
        const { toggle, close, submit, reset, checkboxAction, radioAction } = eventMap[gridManagerName];

        // 事件: 切换可视状态
        jTool(toggle.target).on(toggle.events, toggle.selector, function (e) {
            e.stopPropagation();
            e.preventDefault();
            const $allFilterCon = jTool(`${tableSelector} .${CLASS_FILTER_CONTENT}`);
            const $action = jTool(this);
            const $filterAction = $action.closest(`.${CLASS_FILTER}`);
            const $th = $action.closest(`th[${TH_NAME}]`);
            const thName = getThName($th);
            const $filterCon = $filterAction.find(`.${CLASS_FILTER_CONTENT}`);

            // 清除事件源的其它过滤体
            each($allFilterCon, (index, item) => {
                $filterCon.get(0) !== item ? item.style.display = 'none' : '';
            });

            // 更新当前表格下所有表过滤体的状态
            const settings = getSettings(gridManagerName);
            _this.update($th, settings.columnMap[thName].filter);

            const isShow = $filterCon.css('display') !== 'none';
            isShow ? $filterCon.hide() : $filterCon.show();
            const leftClass = 'direction-left';
            const rigthClass = 'direction-right';
            if ($filterCon.offset().left + $filterCon.width() > getDiv(gridManagerName).width()) {
                $filterCon.addClass(rigthClass);
                $filterCon.removeClass(leftClass);
            } else {
                $filterCon.addClass(leftClass);
                $filterCon.removeClass(rigthClass);
            }

            // 点击空处关闭
            jTool(close.target).on(close.events, function (e) {
                const eventSource = jTool(e.target);
                if (eventSource.hasClass(CLASS_FILTER_CONTENT) || jTool(e.target).closest(`.${CLASS_FILTER_CONTENT}`).length === 1) {
                    return false;
                }
                const $filterCon = $body.find(`.${CLASS_FILTER_CONTENT}`);
                $filterCon.hide();
                jTool(close.target).off(close.events);
            });
        });

        // 事件: 提交选中结果
        jTool(submit.target).on(submit.events, submit.selector, function () {
            const $action = jTool(this);
            const $filterCon = $action.closest(`.${CLASS_FILTER_CONTENT}`);
            const $filters = jTool('.gm-radio-checkbox-input', $filterCon);
            const $th = $filterCon.closest('th');
            const thName = getThName($th);
            const checkedList = [];
            each($filters, (index, item) => {
                item.checked && checkedList.push(item.value);
            });

            const settings = getSettings(gridManagerName);
            const checkedStr = checkedList.join(',');
            settings.columnMap[thName].filter.selected = checkedStr;
            settings.pageData[settings.currentPageKey] = 1;
            extend(settings.query, {[thName]: checkedStr});
            setSettings(settings);

            _this.update($th, settings.columnMap[thName].filter);
            core.refresh(gridManagerName);
            $filterCon.hide();
            jTool(close.target).off(close.events);
        });

        // 事件: 清空选中结果
        jTool(reset.target).on(reset.events, reset.selector, function () {
            const $action = jTool(this);
            const $filterCon = $action.closest(`.${CLASS_FILTER_CONTENT}`);
            const $th = jTool(this).closest(`th[${TH_NAME}]`);
            const thName = getThName($th);

            const settings = getSettings(gridManagerName);
            delete settings.query[thName];
            settings.columnMap[thName].filter.selected = '';
            settings.pageData[settings.currentPageKey] = 1;
            setSettings(settings);

            _this.update($th, settings.columnMap[thName].filter);
            core.refresh(gridManagerName);
            $filterCon.hide();
            jTool(close.target).off(close.events);
        });

        // 事件: 复选框事件
        jTool(checkboxAction.target).on(checkboxAction.events, checkboxAction.selector, function () {
            const $checkbox = jTool(this).closest('.filter-checkbox').find('.gm-checkbox');
            checkbox.updateCheckboxState($checkbox, this.checked ? CHECKED : UNCHECKED);
        });

        // 事件: 单选框事件
        jTool(radioAction.target).on(radioAction.events, radioAction.selector, function () {
            const $filterRadio = jTool(this).closest('.filter-list').find('.filter-radio');
            each($filterRadio, (index, item) => {
                checkbox.updateRadioState(jTool(item).find('.gm-radio'), this === item.querySelector('.gm-radio-input'));
            });
        });
    }

    /**
     * 表头的筛选菜单HTML
     * @param params
     * @returns {parseData}
     */
    @parseTpl(filterTpl)
    createHtml(params) {
        const { settings, columnFilter } = params;
        const tableWarpHeight = getWrap(settings.gridManagerName).height();
        let listHtml = '';
        columnFilter.selected = columnFilter.selected || '';
        columnFilter.option.forEach(item => {
            let selectedList = columnFilter.selected.split(',');
            selectedList = selectedList.map(item => {
                return item.trim();
            });
            if (columnFilter.isMultiple) {
                const parseData = {
                    checked: selectedList.indexOf(item.value) !== -1,
                    label: item.text,
                    value: item.value
                };
                listHtml += `<li class="filter-checkbox">${checkbox.getCheckboxTpl(parseData)}</li>`;
            } else {
                const parseData = {
                    checked: selectedList.indexOf(item.value) !== -1,
                    label: item.text,
                    value: item.value
                };
                listHtml += `<li class="filter-radio">${checkbox.getRadioTpl(parseData)}</li>`;
            }
        });
        return {
            iconClass: columnFilter.selected ? ` ${CLASS_FILTER_SELECTED}` : '',
            listStyle: `max-height: ${tableWarpHeight - 100 + 'px'}`,
            okText: i18n(settings, 'ok'),
            resetText: i18n(settings, 'reset'),
            listHtml: listHtml
        };
    }

    /**
     * 更新filter选中状态
     * @param $th
     * @param filter
     */
    update($th, filter) {
        const $filterIcon = jTool('.fa-icon', $th);
        const $filters = jTool(`.${CLASS_FILTER_CONTENT} .gm-radio-checkbox-input`, $th);
        each($filters, (index, item) => {
            let $radioOrCheckbox = jTool(item).closest('.gm-radio-checkbox');
            if (filter.isMultiple) {
                checkbox.updateCheckboxState($radioOrCheckbox, filter.selected.indexOf(item.value)  >= 0 ? CHECKED : UNCHECKED);
            } else {
                checkbox.updateRadioState($radioOrCheckbox, item.value === filter.selected);
            }
        });

        filter.selected ? $filterIcon.addClass(CLASS_FILTER_SELECTED) : $filterIcon.removeClass(CLASS_FILTER_SELECTED);
    }

    /**
     * 消毁
     * @param gridManagerName
     */
    destroy(gridManagerName) {
        clearTargetEvent(eventMap[gridManagerName]);
    }
}
export default new Filter();

