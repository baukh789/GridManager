/**
 * 核心功能所需的事件项
 * @param gridManagerName
 * @param scope: querySelector 域
 */
export const getEvent = (gridManagerName, scope) => {
    return {
        // td移入
        tdMousemove: {events: 'mousemove', target: scope, selector: 'tbody td'}
    };
};

export const eventMap = {};
