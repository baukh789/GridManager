/**
 * 固定列功能所需的事件项
 * @param _
 * @param scope: querySelector 域
 */
import { MOUSE_DOWN, createEventsObj } from '@common/events';

export const getEvent = (_: string, scope: string): object => {
    return {
        // 触焦事件
        fixedFocus: createEventsObj(MOUSE_DOWN, scope, 'td[fixed]')
    };
};

export const eventMap = {};
