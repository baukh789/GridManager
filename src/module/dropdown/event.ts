/**
 * dropdown events
 * @param scope: querySelector 域
 */
import { MOUSE_CLICK, createEventsObj } from '@common/events';

export const getEvent = (scope: string): object => {
    return {
        // 切换展示状态
        open: createEventsObj(MOUSE_CLICK, scope, '.gm-dropdown .gm-dropdown-text'),

        // body关闭事件
        close: createEventsObj(MOUSE_CLICK, 'body'),

        // 点选事件
        selected: createEventsObj(MOUSE_CLICK, scope, '.gm-dropdown .gm-dropdown-list >li')
    };
};

export const eventMap = {};
