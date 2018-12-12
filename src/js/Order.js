/*
 * Order: 序号
 * */
import { ORDER_WIDTH } from '../common/constants';
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
            disableCustomize: true,
			width: ORDER_WIDTH,
			align: 'center',
			template: nodeData => {
				return `<td gm-order="true" gm-create="true">${nodeData}</td>`;
			}
		};
	}
}
export default new Order();
