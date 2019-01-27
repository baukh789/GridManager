/**
 * Created by baukh on 18/7/11.
 * 表头的筛选菜单
 */
import { jTool, base, cache, parseTpl } from '../../common';
import core from '../core';
import checkbox from '../checkbox';
import i18n from '../i18n';
import filterTpl from './filter.tpl.html';
class Filter {
    // 启用状态
    enable = false;

    /**
     * 初始化
     * @param $table
     */
    init($table) {
        this.__bindFilterEvent($table);
    }

    /**
     * 表头的筛选菜单HTML
     * @param params
     * @returns {parseData}
     */
    @parseTpl(filterTpl)
    createHtml(params) {
        const { settings, columnFilter, $tableWarp } = params;
        const tableWarpHeight = $tableWarp.height();
        let listHtml = '';
        columnFilter.selected = columnFilter.selected || '';
        columnFilter.option.forEach(item => {
            let selectedList = columnFilter.selected.split(',');
            selectedList = selectedList.map(item => {
                return item.trim();
            });
            if (columnFilter.isMultiple) {
                const parseData = {
                    checked: selectedList.indexOf(item.value) !== -1 ? 'checked' : 'unchecked',
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
        }
    }

    /**
     * 更新filter选中状态
     * @param $th
     * @param filter
     */
    update($th, filter) {
        const $filterCon = jTool('.fa-con', $th);
        const $filterIcon = jTool('.fa-icon', $th);
        const $filters = jTool('.gm-radio-checkbox-input', $filterCon);
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
     * 绑定筛选菜单事件
     * @param $table
     * @private
     */
    __bindFilterEvent($table) {
        // 事件: 显示筛选区域
        const _this = this;
        $table.off('mousedown', '.fa-icon');
        $table.on('mousedown', '.fa-icon', function (e) {
            e.stopPropagation();
            e.preventDefault();
            const $allFilterCon = jTool('.fa-con', $table);
            const $action = jTool(this);
            const $filterAction = $action.closest('.filter-action');
            const $th = $action.closest('th[th-name]');
            const thName = $th.attr('th-name');
            const $filterCon = $filterAction.find('.fa-con');

            // 清除事件源的其它过滤体
            jTool.each($allFilterCon, (index, item) => {
                $filterCon.get(0) !== item ? item.style.display = 'none' : '';
            });

            // 更新当前表格下所有表过滤体的状态
            const settings = cache.getSettings($table);
            _this.update($th, settings.columnMap[thName].filter);

            const isShow = $filterCon.css('display') !== 'none';
            isShow ? $filterCon.hide() : $filterCon.show();
            if ($filterCon.offset().left + $filterCon.width() > $action.closest('.table-div').width()) {
                $filterCon.addClass('direction-right');
                $filterCon.removeClass('direction-left');
            } else {
                $filterCon.addClass('direction-left');
                $filterCon.removeClass('direction-right');
            }
            const $body = jTool('body');
            $body.unbind('mousedown');
            $body.bind('mousedown', function (e) {
                if (e.target.className === 'fa-con' || jTool(e.target).closest('.fa-con').length === 1) {
                    return false;
                }
                const $filterCon = $body.find('.fa-con');
                $filterCon.hide();
            });
        });

        // 事件: 提交选中结果
        $table.off('mouseup', '.filter-submit');
        $table.on('mouseup', '.filter-submit', function () {
            const $action = jTool(this);
            const $filterCon = $action.closest('.fa-con');
            const $filters = jTool('.gm-radio-checkbox-input', $filterCon);
            const $th = $filterCon.closest('th');
            const thName = $th.attr('th-name');
            const checkedList = [];
            jTool.each($filters, (index, item) => {
                item.checked && checkedList.push(item.value);
            });

            const settings = cache.getSettings($table);
            const checkedStr = checkedList.join(',');
            settings.columnMap[thName].filter.selected = checkedStr;
            jTool.extend(settings.query, {[thName]: checkedStr});
            cache.setSettings(settings);

            _this.update($th, settings.columnMap[thName].filter);
            core.refresh($table);
            $filterCon.hide();
        });

        // 事件: 清空选中结果
        $table.off('mouseup', '.filter-reset');
        $table.on('mouseup', '.filter-reset', function () {
            const $action = jTool(this);
            const $filterCon = $action.closest('.fa-con');
            const $th = jTool(this).closest('th[th-name]');
            const thName = $th.attr('th-name');

            const settings = cache.getSettings($table);
            delete settings.query[thName];
            settings.columnMap[thName].filter.selected = '';
            cache.setSettings(settings);

            _this.update($th, settings.columnMap[thName].filter);
            core.refresh($table);
            $filterCon.hide();
        });

        // 事件: 复选框事件
        $table.off('click', '.gm-checkbox-input');
        $table.on('click', '.gm-checkbox-input', function () {
            const $checkbox = jTool(this).closest('.filter-checkbox').find('.gm-checkbox');
            checkbox.updateCheckboxState($checkbox, this.checked ? 'checked' : 'unchecked');
        });

        // 事件: 单选框事件
        $table.off('click', '.gm-radio-input');
        $table.on('click', '.gm-radio-input', function (e) {
            const $filterRadio = jTool(this).closest('.filter-list').find('.filter-radio');
            jTool.each($filterRadio, (index, item) => {
                checkbox.updateRadioState(jTool(item).find('.gm-radio'), this === item.querySelector('.gm-radio-input'));
            });
        });
    }
    /**
     * 消毁
     * @param $table
     */
    destroy($table) {
        // 清理: 排序事件
        $table.off('mouseup', '.filter-action');
        $table.off('mouseup', '.filter-submit');
        $table.off('mouseup', '.filter-reset');
    }
}
export default new Filter();

