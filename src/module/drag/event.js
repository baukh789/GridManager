/**
 * 拖拽功能所需的事件项
 * @param gridManagerName
 * @param scope: querySelector 域
 */
import { FAKE_TABLE_HEAD_KEY } from '@common/constants';
export default function getDragEvent(gridManagerName, scope) {
    return {
        // 开始
        dragStart: {events: 'mousedown', target: scope, selector: `[${FAKE_TABLE_HEAD_KEY}="${gridManagerName}"] .drag-action`},

        // 调整中
        dragging: {events: 'mousemove.gmDrag', target: 'body'},

        // 停止
        dragAbort: {events: 'mouseup', target: 'body'}
    };
}
