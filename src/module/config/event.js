/**
 * 配置功能所需的事件项
 * @param gridManagerName
 * @param scope: querySelector 域
 */
import { CONFIG_KEY } from '@common/constants';
export default function getConfigEvent(gridManagerName, scope) {
    return {
        // 关闭
        closeConfig: {events: 'click', target: `[${CONFIG_KEY}="${gridManagerName}"]`, selector: '.config-action'},

        // 设置
        liChange: {events: 'click', target: `[${CONFIG_KEY}="${gridManagerName}"]`, selector: '.config-list li'},

        // 菜单
        closeConfigByBody: {events: 'mousedown.closeConfig', target: 'body'}
    };
}
