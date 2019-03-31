/**
 * 拖拽功能所需的事件项
 * @param gridManagerName
 * @param scope: querySelector 域
 */
export default function getDragEvent(gridManagerName, scope) {
    return {
        // 开始
        dragStart: {eventName: 'mousedown', eventQuerySelector: `${scope} .drag-action`},

        // 调整中
        dragging: {eventName: 'mousemove.gmDrag'},

        // 停止
        dragAbort: {eventName: 'mouseup'}
    };
}
