/**
 * 拖拽功能所需的事件项
 * @param scope: querySelector 域
 */
import { EMPTY_TPL_KEY } from '@common/constants';
export const getEvent = scope => {
    return {
        // 开始
        dragStart: {events: 'mousedown.gmLineDrag', target: scope, selector: `tr:not([${EMPTY_TPL_KEY}])`},

        // 调整中
        dragging: {events: 'mousemove.gmLineDrag', target: 'body'},

        // 停止
        dragAbort: {events: 'mouseup.gmLineDrag', target: 'body'}
    };
};

export const eventMap = {};
