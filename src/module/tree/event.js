/**
 * 树折叠功能所需的事件项
 */
export const getEvent = (gridManagerName, scope, key) => {
    return {
        // 折叠事件
        toggleState: {events: 'click', target: scope, selector: `[${key}] .tree-action`}
    };
};

export const eventMap = {};
