/**
 * 配置功能所需的事件项
 * @param gridManagerName
 * @param scope: querySelector 域
 */
export default function getConfigEvent(gridManagerName, scope) {
    return {
        // 关闭
        closeConfig: {eventName: 'click', eventQuerySelector: `${scope} .config-action`},

        // 设置
        liChange: {eventName: 'click', eventQuerySelector: `${scope} .config-list li`},

        // 菜单
        closeConfigByBody: {eventName: 'mousedown.closeConfig'}
    };
}
