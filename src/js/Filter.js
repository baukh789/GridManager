/**
 * Created by baukh on 18/7/11.
 * 表头的筛选菜单  TODO no test
 */
import { jTool, Base } from './Base';
import Core from './Core';
import Cache from './Cache';
import I18n from './I18n';
class Filter {
    // 启用状态
    enable = false;

    /**
     * 表头的筛选菜单HTML
     * @param settings
     * @param filter: 当前列的筛选条件对象
     * @param tableWarpHeight: tableWarp的高度
     * @returns {string}
     */
    createHtml(settings, filter, tableWarpHeight) {
        let listHtml = '';
        filter.selected = filter.selected || '';
        filter.option.forEach(item => {
            let selectedList = filter.selected.split(',');
            selectedList = selectedList.map(item => {
                return item.trim();
            });
            if (filter.isMultiple) {
                listHtml += `<li class="filter-checkbox">${Base.getCheckboxString(selectedList.indexOf(item.value) !== -1 ? 'checked' : 'unchecked', item.text, item.value)}</li>`;
            } else {
                listHtml += `<li class="filter-radio">${Base.getRadioString(selectedList.indexOf(item.value) !== -1, item.text, item.value)}</li>`;
            }
        });

        return `<div class="filter-action">
                    <i class="fa-icon iconfont icon-filter${filter.selected && ' filter-selected'}"></i>
                    <div class="fa-con">
                        <ul class="filter-list" style="max-height: ${tableWarpHeight - 100 + 'px'}">
                            ${listHtml}
                        </ul>
                        <div class="filter-bottom">
                            <span class="filter-button filter-submit">${I18n.i18nText(settings, 'filter-ok')}</span>
                            <span class="filter-button filter-reset">${I18n.i18nText(settings, 'filter-reset')}</span>
                        </div>
                    </div>
                </div>`;
    }

    /**
     * 初始化
     * @param $table
     */
    init($table) {
        this.__bindFilterEvent($table);
    }

    /**
     * 绑定筛选菜单事件
     * @param $table
     * @private
     */
    __bindFilterEvent($table) {
        // 事件: 显示筛选区域
        $table.off('mousedown', '.fa-icon');
        $table.on('mousedown', '.fa-icon', function (e) {
            e.stopPropagation();
            e.preventDefault();
            const $action = jTool(this);
            const $filterAction = $action.closest('.filter-action');
            const $filterCon = $filterAction.find('.fa-con');
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
            const $filterIcon = jTool('.fa-icon', $filterCon.closest('.filter-action'));
            const $filters = jTool('.gm-radio-checkbox-input', $filterCon);
            const $th = $filterCon.closest('th');
            const thName = $th.attr('th-name');
            const checkedList = [];
            jTool.each($filters, (index, item) => {
                item.checked && checkedList.push(item.value);
            });
            checkedList.length ? $filterIcon.addClass('filter-selected') : $filterIcon.removeClass('filter-selected');
            const settings = Cache.getSettings($table);
            jTool.extend(settings.query, {[thName]: checkedList.join(',')});
            Cache.setSettings($table, settings);

            Core.refresh($table);
            $filterCon.hide();
        });

        // 事件: 重置选中结果
        $table.off('mouseup', '.filter-reset');
        $table.on('mouseup', '.filter-reset', function () {
            const $action = jTool(this);
            const $filterCon = $action.closest('.fa-con');
            const $filterIcon = jTool('.fa-icon', $filterCon.closest('.filter-action'));
            const $filters = jTool('.gm-radio-checkbox-input', $filterCon);
            const $th = $filterCon.closest('th');
            const thName = $th.attr('th-name');
            jTool.each($filters, (index, item) => {
                if (item.type === 'radio') {
                    Base.updateRadioState(jTool(item).closest('.gm-radio-checkbox'), false);
                } else {
                    Base.updateCheckboxState(jTool(item).closest('.gm-radio-checkbox'), 'unchecked');
                }
            });

            const settings = Cache.getSettings($table);
            delete settings.query[thName];
            Cache.setSettings($table, settings);
            $filterIcon.removeClass('filter-selected');
            Core.refresh($table);
            $filterCon.hide();
        });

        // 事件: 复选框事件
        $table.off('click', '.gm-checkbox-input');
        $table.on('click', '.gm-checkbox-input', function () {
            const $checkbox = jTool(this).closest('.filter-checkbox').find('.gm-checkbox');
            Base.updateCheckboxState($checkbox, this.checked ? 'checked' : 'unchecked');
        });

        // 事件: 单选框事件
        $table.off('click', '.gm-radio-input');
        $table.on('click', '.gm-radio-input', function (e) {
            const $filterRadio = jTool(this).closest('.filter-list').find('.filter-radio');
            jTool.each($filterRadio, (index, item) => {
                Base.updateRadioState(jTool(item).find('.gm-radio'), this === item.querySelector('.gm-radio-input'));
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

