/**
 * 排序功能所需的事件项
 * @param gridManagerName
 * @param scope: querySelector 域
 */
export const getEvent = (gridManagerName, scope) => {
    return {
        // 触发 #001
        sortAction: {events: 'mouseup', target: scope, selector: '.sorting-action'}
    };
};

export const eventMap = {};
