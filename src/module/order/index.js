/*
 * order: 序号
 * */
import { ORDER_WIDTH } from '../../common/constants';
import i18n from '../i18n';
class Order {
	// 序号的唯一标识
	get key() {
		return 'gm_order';
	}

	/**
	 * 获取TH内容
	 * @param settings
	 * @returns {string}
	 */
    getThContent(settings) {
		return i18n.i18nText(settings, 'order-text');
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
			text: i18n.getText(settings, 'order-text'),
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
