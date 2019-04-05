/**
 * Created by baukh on 18/7/11.
 * 表头的筛选菜单
 */
import './style.less';
import jTool from '@common/jTool';
import cache from '@common/cache';
import base from '@common/base';
import { parseTpl } from '@common/parse';
import core from '../core';
import checkbox from '../checkbox';
import i18n from '../i18n';
import filterTpl from './filter.tpl.html';
import getFilterEvent from './event';

// 在body上绑定的关闭事件名
const closeEvent = 'mousedown.gmFilter';
class Filter {
    eventMap = {};

    // 启用状态
    enable = false;

    /**
     * 初始化
     * @param gridManagerName
     */
    init(gridManagerName) {
        const _this = this;
        const $body = jTool('body');
        const scopeQuerySelector = `${base.getQuerySelector(gridManagerName)} .filter-area`;

        this.eventMap[gridManagerName] = getFilterEvent(gridManagerName, scopeQuerySelector);
        const { toggle, close, submit, reset, checkboxAction, radioAction } = this.eventMap[gridManagerName];

        // 事件: 切换可视状态
        $body.on(toggle.events, toggle.selector, function (e) {
            e.stopPropagation();
            e.preventDefault();
            const $allFilterCon = jTool(`${scopeQuerySelector} .fa-con`);
            const $action = jTool(this);
            const $filterAction = $action.closest('.filter-area');
            const $th = $action.closest('th[th-name]');
            const thName = base.getThName($th);
            const $filterCon = $filterAction.find('.fa-con');

            // 清除事件源的其它过滤体
            jTool.each($allFilterCon, (index, item) => {
                $filterCon.get(0) !== item ? item.style.display = 'none' : '';
            });

            // 更新当前表格下所有表过滤体的状态
            const settings = cache.getSettings(gridManagerName);
            _this.update($th, settings.columnMap[thName].filter);

            const isShow = $filterCon.css('display') !== 'none';
            isShow ? $filterCon.hide() : $filterCon.show();
            const leftClass = 'direction-left';
            const rigthClass = 'direction-right';
            if ($filterCon.offset().left + $filterCon.width() > base.getDiv(gridManagerName).width()) {
                $filterCon.addClass(rigthClass);
                $filterCon.removeClass(leftClass);
            } else {
                $filterCon.addClass(leftClass);
                $filterCon.removeClass(rigthClass);
            }

            // 点击空处关闭
            $body.off(close.events);
            $body.on(close.events, function (e) {
                const eventSource = jTool(e.target);
                if (eventSource.hasClass('fa-con') || jTool(e.target).closest('.fa-con').length === 1) {
                    return false;
                }
                const $filterCon = $body.find('.fa-con');
                $filterCon.hide();
                $body.off(closeEvent);
            });
        });

        // 事件: 提交选中结果
        $body.on(submit.events, submit.selector, function () {
            const $action = jTool(this);
            const $filterCon = $action.closest('.fa-con');
            const $filters = jTool('.gm-radio-checkbox-input', $filterCon);
            const $th = $filterCon.closest('th');
            const thName = base.getThName($th);
            const checkedList = [];
            jTool.each($filters, (index, item) => {
                item.checked && checkedList.push(item.value);
            });

            const settings = cache.getSettings(gridManagerName);
            const checkedStr = checkedList.join(',');
            settings.columnMap[thName].filter.selected = checkedStr;
            jTool.extend(settings.query, {[thName]: checkedStr});
            cache.setSettings(settings);

            _this.update($th, settings.columnMap[thName].filter);
            core.refresh(gridManagerName);
            $filterCon.hide();
            $body.unbind(closeEvent);
        });

        // 事件: 清空选中结果
        $body.on(reset.events, reset.selector, function () {
            const $action = jTool(this);
            const $filterCon = $action.closest('.fa-con');
            const $th = jTool(this).closest('th[th-name]');
            const thName = base.getThName($th);

            const settings = cache.getSettings(gridManagerName);
            delete settings.query[thName];
            settings.columnMap[thName].filter.selected = '';
            cache.setSettings(settings);

            _this.update($th, settings.columnMap[thName].filter);
            core.refresh(gridManagerName);
            $filterCon.hide();
            $body.unbind(closeEvent);
        });

        // 事件: 复选框事件
        $body.on(checkboxAction.events, checkboxAction.selector, function () {
            const $checkbox = jTool(this).closest('.filter-checkbox').find('.gm-checkbox');
            checkbox.updateCheckboxState($checkbox, this.checked ? 'checked' : 'unchecked');
        });

        // 事件: 单选框事件
        $body.on(radioAction.events, radioAction.selector, function () {
            const $filterRadio = jTool(this).closest('.filter-list').find('.filter-radio');
            jTool.each($filterRadio, (index, item) => {
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
        const tableWarpHeight = base.getWrap(settings.gridManagerName).height();
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
            iconClass: columnFilter.selected ? ' filter-selected' : '',
            listStyle: `max-height: ${tableWarpHeight - 100 + 'px'}`,
            okText: i18n.i18nText(settings, 'filter-ok'),
            resetText: i18n.i18nText(settings, 'filter-reset'),
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
        const $filters = jTool('.fa-con .gm-radio-checkbox-input', $th);
        jTool.each($filters, (index, item) => {
            let $radioOrCheckbox = jTool(item).closest('.gm-radio-checkbox');
            if (filter.isMultiple) {
                checkbox.updateCheckboxState($radioOrCheckbox, filter.selected.indexOf(item.value)  >= 0 ? 'checked' : 'unchecked');
            } else {
                checkbox.updateRadioState($radioOrCheckbox, item.value === filter.selected);
            }
        });

        filter.selected ? $filterIcon.addClass('filter-selected') : $filterIcon.removeClass('filter-selected');
    }

    /**
     * 消毁
     * @param gridManagerName
     */
    destroy(gridManagerName) {
        base.clearBodyEvent(this.eventMap[gridManagerName]);
    }
}
export default new Filter();

