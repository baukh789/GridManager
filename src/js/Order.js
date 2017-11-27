/*
 * Order: 序号
 * */
import { $ } from './Base';
import I18n from './I18n';
class Order {
	/**
	 * 生成序号DOM
	 * @param $table
	 * @returns {boolean}
     */
	initDOM($table) {
		const orderHtml = `<th th-name="gm_order" gm-order="true" gm-create="true">${I18n.i18nText($table, 'order-text')}</th>`;
		$('thead tr', $table).prepend(orderHtml);
		if ($('th[th-name="gm_order"]', $table).length === 0) {
			return false;
		}
		return true;
	}
}
export default new Order();
