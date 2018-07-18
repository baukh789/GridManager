/*
 * Order: 序号
 * */
import I18n from './I18n';
class Order {
	// 序号的唯一标识
	get key() {
		return 'gm_order';
	}
	/**
	 * 获取 序号字符串
	 * @param settings
	 * @returns {string}
	 */
	getThString(settings) {  // TODO getThString要改名
		return I18n.i18nText(settings, 'order-text');
	}

	/**
	 * 获取 td 的字符串节点
	 * @param orderText
     */
	// getTdString(orderText) {
	// 	return `<td gm-order="true" gm-create="true">${orderText}</td>`;
	// }

	/**
	 * 获取序号列对象
	 * @param $table
	 * @param language
	 * @returns {{key: string, name: (*|string), isShow: boolean, width: string, align: string}}
     */
	getColumn(settings) {
		return {
			key: this.key,
			text: I18n.getText(settings, 'order-text'),
			isAutoCreate: true,
			isShow: true,
			width: '50px',
			align: 'center',
			template: nodeData => {
				return `<td gm-order="true" gm-create="true">${nodeData}</td>`;
			}
		};
	}

	/**
	 * 生成序号DOM
	 * @param $table
	 * @returns {boolean}
     */
	// initDOM($table) {
	// 	const orderHtml = `<th th-name="${Order.key}" gm-order="true" gm-create="true">${I18n.i18nText($table, 'order-text')}</th>`;
	// 	jTool('thead tr', $table).prepend(orderHtml);
	// 	if (jTool(`th[th-name="${Order.key}"]`, $table).length === 0) {
	// 		return false;
	// 	}
	// 	return true;
	// }
}
export default new Order();
