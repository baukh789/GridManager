/**
 * 核心功能所需的事件项
 * @param scope: querySelector 域
 */
import { MOUSE_MOVE, MOUSE_CLICK, createEventsObj } from '@common/events';
import { TR_CACHE_KEY } from '@common/constants';

export const getEvent = scope => {
    const tr = `tr[${TR_CACHE_KEY}]`;
    const td = `tr[${TR_CACHE_KEY}] td`;
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
