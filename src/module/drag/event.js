/**
 * 拖拽功能所需的事件项
 * @param gridManagerName
 * @param scope: querySelector 域
 */
export default function getDragEvent(gridManagerName, scope) {
    return {
        // 开始
        dragStart: {events: 'mousedown', selector: `${scope} .drag-action`},

        // 调整中
        dragging: {events: 'mousemove.gmDrag'},

        // 停止
        dragAbort: {events: 'mouseup'}
    };
}
