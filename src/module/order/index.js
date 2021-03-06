/*
 * order: 序号
 * */
import { ORDER_KEY, GM_CREATE } from '@common/constants';
import i18n from '../i18n';
import './style.less';
class Order {
	/**
	 * 获取序号列对象
	 * @param $table
	 * @param language
	 * @returns {{key: string, name: (*|string), isShow: boolean, width: string, align: string}}
     */
	getColumn(settings) {
	    const { autoOrderConfig } = settings;
		return {
			key: ORDER_KEY,
			text: i18n(settings, 'order-text'),
			isAutoCreate: true,
			isShow: true,
            disableCustomize: true,
			width: autoOrderConfig.width,
            fixed: autoOrderConfig.fixed,
			// align: 'center',  // 调整为由样式控制
			template: (order, row, index, isTop) => {
				return `<td ${GM_CREATE} gm-order>${isTop ? order : ''}</td>`;
			}
		};
	}
}
export default new Order();
