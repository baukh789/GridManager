/**
 * 排序功能所需的事件项
 * @param gridManagerName
 * @param scope: querySelector 域
 */
export default function getSortEvent(gridManagerName, scope) {
    return {
        // 触发 #001
        sortAction: {eventName: 'mouseup', eventQuerySelector: `${scope} .sorting-action`}
    };
}
