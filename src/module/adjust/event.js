/**
 * 宽度调整功能所需的事件项
 * @param gridManagerName
 * @param scope: querySelector 域
 *
 * #001: adjusted事件中使用到了两个事件类型，1.mouseup 2.mouseleave
 * 其中mouseleave的事件范围超出了querySelector的区域，所以该事件不再交由body代理。
 * 这里的querySelector指向的是table element。
 * 该事件在消毁的时候无需清除，原因是在mousedown之后才会创建，且在创建前会再次进行清除。
 */
export default function getAdjustEvent(gridManagerName, scope) {
    return {
        // 宽度调整触发
        adjustStart: {events: 'mousedown', selector: `${scope} .adjust-action`},

        // 宽度调整中
        adjusting: {events: 'mousemove', selector: scope}

        // 宽度调整停止, 不在这里使用是由于用到了mouseleave #001
        // adjustAbort: {events: 'mouseup mouseleave', selector: scope}
    };
}
