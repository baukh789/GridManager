/**
 * 排序功能所需的事件项
 * @param gridManagerName
 * @param scope: querySelector 域
 */
export default function getSortEvent(gridManagerName, scope) {
    return {
        // 触发 #001
        sortAction: {events: 'mouseup', target: scope, selector: '.sorting-action'}
    };
}
