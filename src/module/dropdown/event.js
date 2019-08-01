/**
 * dropdown events
 * @param gridManagerName
 * @param scope: querySelector 域
 */
export default function getEvent(gridManagerName, scope) {
    return {
        // 切换展示状态
        open: {events: 'click', target: scope, selector: '.gm-dropdown .gm-dropdown-text'},

        // body关闭事件
        close: {events: 'click', target: 'body'},

        // 点选事件
        selected: {events: 'click', target: scope, selector: '.gm-dropdown .gm-dropdown-list >li'}
    };
}
