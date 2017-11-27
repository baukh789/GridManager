/*
 * Checkbox: 数据选择/全选/返选
 * */
import { $ } from './Base';
import I18n from './I18n';
class Checkbox {
	/**
	 * checkbox 拼接字符串
	 * @param $table
	 * @returns {string}
     */
	html($table) {
		let checkboxHtml = `<th th-name="gm_checkbox" gm-checkbox="true" gm-create="true">
								<input type="checkbox"/>
								<span style="display: none">
									${ I18n.i18nText($table, 'checkall-text') }
								</span>
							</th>`;
		return checkboxHtml;
	};

	/**
	 * 初始化选择与反选DOM
	 * @param $table
     */
	initCheckbox($table) {
		// 插入选择DOM
		$('thead tr', $table).prepend(this.html($table));

		// 绑定选择框事件
		this.bindCheckboxEvent($table);
	};

	/**
	 * 绑定选择框事件
	 * @param $table
     */
	bindCheckboxEvent($table) {
		$table.off('click', 'input[type="checkbox"]');
		$table.on('click', 'input[type="checkbox"]', function () {

			// 存储th中的checkbox的选中状态
			let _thChecked = true;

			// 全选键事件源
			const _checkAction = $(this);

			// th中的选择框
			const _thCheckbox = $('thead th[gm-checkbox] input[type="checkbox"]', $table);

			// td中的选择框
			const _tdCheckbox = $('tbody td[gm-checkbox] input[type="checkbox"]', $table);

			// 当前为全选事件源
			if (_checkAction.closest('th[th-name="gm_checkbox"]').length === 1) {
				$.each(_tdCheckbox, (i, v) => {
					v.checked = _checkAction.prop('checked');
					$(v).closest('tr').attr('checked', v.checked);
				});
			} else {
				// 当前为单个选择
				$.each(_tdCheckbox, (i, v) => {
					if (v.checked === false) {
						_thChecked = false;
					}
					$(v).closest('tr').attr('checked', v.checked);
				});
				_thCheckbox.prop('checked', _thChecked);
			}
		});
	};
}
export default new Checkbox();
