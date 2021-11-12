/*
 * order: 序号
 * */
import { ORDER_KEY, GM_CREATE } from '@common/constants';
import i18n from '../i18n';
import './style.less';
class Order {
	/**
	 * 获取序号列对象
	 * @param settings
     */
	getColumn(settings: any): object {
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
			template: (order: string, row: object, index: number, isTop: boolean) => {
				return `<td ${GM_CREATE} gm-order>${isTop ? order : ''}</td>`;
			}
		};
	}
}
export default new Order();
