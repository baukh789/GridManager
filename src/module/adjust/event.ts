/**
 * 宽度调整功能所需的事件项
 * @param gridManagerName
 * @param scope: querySelector 域
 *
 * #001:adjustAbort事件中使用到了两个事件类型，1.mouseup 2.mouseleave
 * 其中mouseleave的事件范围超出了querySelector的区域，所以该事件不再代理。
 */
import { DIV_KEY, FAKE_TABLE_HEAD_KEY } from '@common/constants';
import { CLASS_ADJUST_ACTION } from './constants';
import { MOUSE_DOWN, MOUSE_MOVE, MOUSE_UP, MOUSE_LEAVE, createEventsObj } from '@common/events';
export function getEvent(_: string, scope: string) {
    return {
        // 宽度调整触发
        start: createEventsObj(MOUSE_DOWN, scope, `[${FAKE_TABLE_HEAD_KEY}="${_}"] .${CLASS_ADJUST_ACTION}`),

        // 宽度调整中
        doing: createEventsObj(MOUSE_MOVE, `[${DIV_KEY}="${_}"]`, scope),

        // 宽度调整停止 #001
        abort: createEventsObj(`${MOUSE_UP} ${MOUSE_LEAVE}`, scope)
    };
}

export const eventMap = {};
