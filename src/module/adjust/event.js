/**
 * 宽度调整功能所需的事件项
 * @param gridManagerName
 * @param scope: querySelector 域
 *
 * #001:adjustAbort事件中使用到了两个事件类型，1.mouseup 2.mouseleave
 * 其中mouseleave的事件范围超出了querySelector的区域，所以该事件不再代理。
 */
import { DIV_KEY, FAKE_TABLE_HEAD_KEY } from '@common/constants';
export default function getAdjustEvent(gridManagerName, scope) {
    return {
        // 宽度调整触发
        adjustStart: {events: 'mousedown', target: scope, selector: `[${FAKE_TABLE_HEAD_KEY}="${gridManagerName}"] .adjust-action`},

        // 宽度调整中
        adjusting: {events: 'mousemove', target: `[${DIV_KEY}="${gridManagerName}"]`, selector: scope},

        // 宽度调整停止 #001
        adjustAbort: {events: 'mouseup mouseleave', target: scope}
    };
}
