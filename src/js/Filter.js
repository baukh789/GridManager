/**
 * Created by baukh on 18/7/11.
 * 表头的筛选菜单  TODO no test
 */
import { jTool } from './Base';
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
     * @returns {string}
     */
    createHtml(settings, filter) {
        let listHtml = '';
        filter.selected = filter.selected || '';
        filter.option.forEach(item => {
            let selectedList = filter.selected.split(',');
            selectedList = selectedList.map(item => {
                return item.trim();
            });
            listHtml += `<li>
                            <label>
                                <input class="filter-value" name="filter-value" type="${filter.isMultiple ? 'checkbox' : 'radio'}" ${selectedList.indexOf(item.value) !== -1 ? 'checked="true"' : ''} value="${item.value}"/>
                                <span class="filter-text">${item.text}</span>
                            </label>
                        </li>`;
        });

        return `<div class="filter-action">
                    <i class="fa-icon iconfont icon-filter"></i>
                    <div class="fa-con">
                        <ul class="filter-list">
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
            const $falterCon = $filterAction.find('.fa-con');
            const isShow = $falterCon.css('display') !== 'none';
            isShow ? $falterCon.hide() : $falterCon.show();
            const $body = jTool('body');
            $body.unbind('mousedown');
            $body.bind('mousedown', function (e) {
                if (e.target.className === 'fa-con' || jTool(e.target).closest('.fa-con').length === 1) {
                    return false;
                }
                const $falterCon = $body.find('.fa-con');
                $falterCon.hide();
            });
        });

        // 事件: 提交选中结果
        $table.off('mouseup', '.filter-submit');
        $table.on('mouseup', '.filter-submit', function () {
            const $action = jTool(this);
            const $falterCon = $action.closest('.fa-con');
            const $filters = jTool('.filter-value', $falterCon);
            const $th = $falterCon.closest('th');
            const thName = $th.attr('th-name');
            const checkedList = [];
            jTool.each($filters, (index, item) => {
                item.checked && checkedList.push(item.value);
            });

            const settings = Cache.getSettings($table);
            jTool.extend(settings.query, {[thName]: checkedList.join(',')});
            Cache.setSettings($table, settings);

            Core.refresh($table);
            $falterCon.hide();
        });

        // 事件: 重置选中结果
        $table.off('mouseup', '.filter-reset');
        $table.on('mouseup', '.filter-reset', function () {
            const $action = jTool(this);
            const $falterCon = $action.closest('.fa-con');
            const $filters = jTool('.filter-value', $falterCon);
            const $th = $falterCon.closest('th');
            const thName = $th.attr('th-name');
            jTool.each($filters, (index, item) => {
                item.checked = false;
            });

            const settings = Cache.getSettings($table);
            delete settings.query[thName];
            Cache.setSettings($table, settings);

            Core.refresh($table);
            $falterCon.hide();
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

