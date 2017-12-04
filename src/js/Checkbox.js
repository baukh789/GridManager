/*
 * Checkbox: 数据选择/全选/返选
 * */
import { $ } from './Base';
import I18n from './I18n';
class Checkbox {
	constructor() {
		// 序号的唯一标识
		this.key = 'gm_checkbox';
	}

	/**
	 * 获取 th 的字符串节点
	 * @param $table
	 * @returns {string}
     */
	getThString($table, thVisible) {
		let checkboxHtml = `<th th-name="${this.key}" th-visible="${thVisible}" gm-checkbox="true" gm-create="true">
								<input type="checkbox"/>
								<span style="display: none">
									${ I18n.i18nText($table, 'checkall-text') }
								</span>
							</th>`;
		return checkboxHtml;
	}
	/**
	 * 获取选择列对象
	 * @param $table
	 * @param language
	 * @returns {{key: string, name: (*|string), isShow: boolean, width: string, align: string}}
	 */
	getColumn($table, language) {
		return {
			key: this.key,
			name: I18n.getText($table, 'checkall-text', language),
			isAutoCreate: true,
			isShow: true,
			width: '50px',
			align: 'center',
			template: nodeData => {
				return `<td gm-checkbox="true" gm-create="true"><input type="checkbox" ${nodeData ? 'checked="checked"' : ''}/></td>`;
			}
		};
	}

	/**
	 * 绑定选择框事件
	 * @param $table
     */
	bindCheckboxEvent($table) {
		const _this = this;
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
			if (_checkAction.closest(`th[th-name="${_this.key}"]`).length === 1) {
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
