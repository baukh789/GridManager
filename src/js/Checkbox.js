/*
 * Checkbox: 数据选择/全选/返选
 * */
import { jTool, Base } from './Base';
import I18n from './I18n';
import Cache from './Cache';

class Checkbox {
	// 全选的唯一标识
	get key() {
		return 'gm_checkbox';
	}

	/**
	 * 获取当前选中的行
	 * @param table
	 * @returns {NodeListOf<SVGElementTagNameMap[string]> | NodeListOf<HTMLElementTagNameMap[string]> | NodeListOf<Element>}
	 */
	getCheckedTr($table) {
		return $table.get(0).querySelectorAll('tbody tr[checked="true"]');
	}

	/**
	 * 获取当前选中行渲染时使用的数据
	 * @param table
	 * @returns {{}|*}
	 */
	getCheckedData($table) {
		return Cache.getRowData($table, this.getCheckedTr($table));
	};

	/**
	 * 获取Th: 全选字符串
	 * @param settings
	 * @returns {string}
     */
	getThString(settings) {
        return `${Base.getCheckboxString()}
                <span style="display: none">
                    ${ I18n.i18nText(settings, 'checkall-text') }
                </span>`;
	}

	/**
	 * 获取TD: 选择列对象
	 * @param settings
	 * @param language
	 * @returns {{key: string, name: (*|string), isShow: boolean, width: string, align: string}}
	 */
	getColumn(settings) {
		return {
			key: this.key,
			text: I18n.getText(settings, 'checkall-text'),
			isAutoCreate: true,
			isShow: true,
			width: '50px',
			align: 'center',
			template: checked => {
				return `<td gm-checkbox="true" gm-create="true">${Base.getCheckboxString(checked ? 'checked' : 'unchecked')}</td>`;
			}
		};
	}

	/**
	 * 绑定选择框事件
	 * @param $table
     */
	bindCheckboxEvent($table) {
		const _this = this;
		const settings = Cache.getSettings($table);
		// th内的全选
		$table.off('click', 'th[gm-checkbox="true"] input[type="checkbox"]');
		$table.on('click', 'th[gm-checkbox="true"] input[type="checkbox"]', function (e) {
			settings.checkedBefore(_this.getCheckedData($table));
			settings.checkedAllBefore(_this.getCheckedData($table));
			const tableData = _this.resetData($table, this.checked, true);
			_this.resetDOM($table, settings, tableData);
			settings.checkedAfter(_this.getCheckedData($table));
			settings.checkedAllAfter(_this.getCheckedData($table));
		});

		// td内的单选
		$table.off('click', 'td[gm-checkbox="true"] input[type="checkbox"]');
		$table.on('click', 'td[gm-checkbox="true"] input[type="checkbox"]', function () {
			settings.checkedBefore(_this.getCheckedData($table));
			const tableData = _this.resetData($table, this.checked, false, jTool(this).closest('tr').attr('cache-key'));
            _this.resetDOM($table, settings, tableData);
			settings.checkedAfter(_this.getCheckedData($table));
		});
	}

	/**
	 * 重置当前渲染数据中的选择状态
	 * @param $table
	 * @param status
	 * @param isAllCheck
	 * @param cacheKey
     * @returns {*}
     */
	resetData($table, status, isAllCheck, cacheKey) {
		const tableData = Cache.getTableData($table);
		// 全选
		if (isAllCheck && !cacheKey) {
			tableData.forEach(row => {
				row[this.key] = status;
			});
		}

		// 单选
		if (!isAllCheck && cacheKey) {
			tableData[cacheKey][this.key] = status;
		}

		// 存储数据
		Cache.setTableData($table, tableData);
		return tableData;
	}

	/**
	 * 重置选择框DOM
	 * @param $table
	 * @param settings
	 * @param tableData
     */
	resetDOM($table, settings, tableData) {
		// 更改th区域选中状态
        let checkedNum = 0;
		tableData && tableData.forEach((row, index) => {
			const $tr = jTool(`tbody tr[cache-key="${index}"]`, $table);
            const $checkSpan = jTool(`td[gm-checkbox="true"] .gm-checkbox`, $tr);
			$tr.attr('checked', row[this.key]);
            Base.updateCheckboxState($checkSpan, row[this.key] ? 'checked' : 'unchecked');
            row[this.key] && checkedNum++;
		});

		// 更新th区域选中状态
        const $allCheckSpan = jTool(`thead tr th[gm-checkbox="true"] .gm-checkbox `, $table);

        // [checked: 选中, indeterminate: 半选中, unchecked: 未选中]
        Base.updateCheckboxState($allCheckSpan, checkedNum === 0 ? 'unchecked' : (checkedNum === tableData.length ? 'checked' : 'indeterminate'));

		// 更新底部工具条选中描述信息
        const checkedInfo = jTool('.footer-toolbar .toolbar-info.checked-info', $table.closest('.table-wrap'));
        checkedInfo.html(I18n.i18nText(settings, 'checked-info', checkedNum));
	}

	/**
	 * 消毁
	 * @param $table
	 */
	destroy($table) {
		// 清理: 选择框事件
		$table.off('click', 'th[gm-checkbox="true"] input[type="checkbox"]');
		$table.off('click', 'td[gm-checkbox="true"] input[type="checkbox"]');
	}
}
export default new Checkbox();
