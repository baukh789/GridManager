/**
 * 固定列功能所需的事件项
 * @param _
 * @param scope: querySelector 域
 */
import { MOUSE_DOWN, createEventsObj } from '@common/events';
import { EventMap } from 'typings/types';

export const getEvent = (_: string, scope: string): EventMap => {
    return {
        // 触焦事件
        fixedFocus: createEventsObj(MOUSE_DOWN, scope, 'td[fixed]')
    };
};

export const eventMap = {};
