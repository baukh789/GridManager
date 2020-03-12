/**
 * 拖拽功能所需的事件项
 * @param gridManagerName
 * @param scope: querySelector 域
 */
import { FAKE_TABLE_HEAD_KEY } from '@common/constants';
import { CLASS_DRAG_ACTION } from './constants';
export const getEvent = (_, scope) => {
    return {
        // 开始
        dragStart: {events: 'mousedown', target: scope, selector: `[${FAKE_TABLE_HEAD_KEY}="${_}"] .${CLASS_DRAG_ACTION}`},

        // 调整中
        dragging: {events: 'mousemove.gmDrag', target: 'body'},

        // 停止
        dragAbort: {events: 'mouseup.gmDrag', target: 'body'}
    };
};

export const eventMap = {};
