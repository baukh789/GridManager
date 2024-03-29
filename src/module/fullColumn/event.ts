/**
 * 通栏功能所需的事件项
 * @param scope: querySelector 域
 */
import { createEventsObj, MOUSE_CLICK } from '@common/events';
import { EventMap } from 'typings/types';

export const getEvent = (scope: string, key: string): EventMap => {
    return {
        // 触发 #001
        fold: createEventsObj(MOUSE_CLICK, scope, `i[${key}]`)
    };
};

export const eventMap = {};
