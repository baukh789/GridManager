/**
 * 核心功能所需的事件项
 * @param scope: querySelector 域
 */
import { MOUSE_MOVE, MOUSE_CLICK, createEventsObj, MOUSE_DOWN } from '@common/events';
import { TR_CACHE_KEY } from '@common/constants';
import { EventMap } from 'typings/types';

export const getEvent = (scope: string): EventMap => {
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
        cellClick: createEventsObj(MOUSE_CLICK, scope, td),

        // 单元格触焦 mousedown
        cellFocus: createEventsObj(MOUSE_DOWN, scope, 'td')
    };
};

export const eventMap = {};
