/**
 * 核心功能所需的事件项
 * @param gridManagerName
 * @param scope: querySelector 域
 */
export const getEvent = (gridManagerName, scope) => {
    return {
        // 行 hover
        rowHover: {events: 'mousemove', target: scope, selector: 'tbody tr'},

        // 行 click
        rowClick: {events: 'click', target: scope, selector: 'tbody tr'},

        // 单元格 hover
        cellHover: {events: 'mousemove', target: scope, selector: 'tbody td'},

        // 单元格 click
        cellClick: {events: 'click', target: scope, selector: 'tbody td'}
    };
};

export const eventMap = {};
