/**
 * 拖拽功能所需的事件项
 * @param scope: querySelector 域
 */
export const getEvent = scope => {
    return {
        // 开始
        dragStart: {events: 'mousedown.gmLineDrag', target: scope, selector: 'tr'},

        // 调整中
        dragging: {events: 'mousemove.gmLineDrag', target: 'body'},

        // 停止
        dragAbort: {events: 'mouseup.gmLineDrag', target: 'body'}
    };
};

export const eventMap = {};
