/**
 * 核心功能所需的事件项
 * @param scope: querySelector 域
 */
import { MOUSE_MOVE, MOUSE_CLICK, createEventsObj } from '@common/events';

export const getEvent = scope => {
    const tr = 'tbody tr';
    const td = 'tbody td';
    return {
        // 行 hover
        rowHover: createEventsObj(MOUSE_MOVE, scope, tr),

        // 行 click
        rowClick: createEventsObj(MOUSE_CLICK, scope, tr),

        // 单元格 hover
        cellHover: createEventsObj(MOUSE_MOVE, scope, td),

        // 单元格 click
        cellClick: createEventsObj(MOUSE_CLICK, scope, td)
    };
};

export const eventMap = {};
