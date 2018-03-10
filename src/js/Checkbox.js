/*
 * Checkbox: 数据选择/全选/返选
 * */
import { jTool } from './Base';
import I18n from './I18n';
class Checkbox {
	// 全选的唯一标识
	get key() {
		return 'gm_checkbox'
	}

	/**
	 * 获取 全选字符串
	 * @param settings
	 * @returns {string}
     */
	getThString(settings, thVisible) {
		let checkboxHtml = `<th th-name="${this.key}" th-visible="${thVisible}" gm-checkbox="true" gm-create="true">
								<input type="checkbox"/>
								<span style="display: none">
									${ I18n.i18nText(settings, 'checkall-text') }
								</span>
							</th>`;
		return checkboxHtml;
	}

	/**
	 * 获取选择列对象
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
		$table.on('click', 'input[type="checkbox"]', function() {
			// 存储th中的checkbox的选中状态
			let _thChecked = true;

			// 全选键事件源
			const _checkAction = jTool(this);

			// th中的选择框
			const _thCheckbox = jTool('thead th[gm-checkbox] input[type="checkbox"]', $table);

			// td中的选择框
			const _tdCheckbox = jTool('tbody td[gm-checkbox] input[type="checkbox"]', $table);

			// 当前为全选事件源
			if (_checkAction.closest(`th[th-name="${_this.key}"]`).length === 1) {
				jTool.each(_tdCheckbox, (index, item) => {
					item.checked = _checkAction.prop('checked');
					jTool(item).closest('tr').attr('checked', item.checked);
				});
			} else {
				// 当前为单个选择
				jTool.each(_tdCheckbox, (index, item) => {
					if (item.checked === false) {
						_thChecked = false;
					}
					jTool(item).closest('tr').attr('checked', item.checked);
				});
				_thCheckbox.prop('checked', _thChecked);
			}
		});
	}

	/**
	 * 消毁
	 * @param $table
	 */
	destroy($table) {
		// 清理: 选择框事件
		$table.off('click', 'input[type="checkbox"]');
	}
}
export default new Checkbox();
