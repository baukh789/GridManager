/**
 * 表头提醒功能所需的事件项
 * @param gridManagerName
 * @param scope: querySelector 域
 *
 * #001: 这里不使用onmouseenter的原因： onmouseenter不支持事件冒泡，无法进行事件委托
 */
import { REMIND_CLASS, FAKE_TABLE_HEAD_KEY } from '@common/constants';
import { MOUSE_OVER, MOUSE_LEAVE, createEventsObj } from '@common/events';
import { EventMap } from 'typings/types';

export const getEvent = (_: string, scope: string): EventMap => {
    return {
        // 触发 #001
        start: createEventsObj(MOUSE_OVER, scope, `[${FAKE_TABLE_HEAD_KEY}="${_}"] .${REMIND_CLASS}`),

        tooltipLeave: createEventsObj(MOUSE_LEAVE, scope, `[${FAKE_TABLE_HEAD_KEY}="${_}"] .${REMIND_CLASS}`)
    };
};

export const eventMap = {};
