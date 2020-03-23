/**
 * 树折叠功能所需的事件项
 */
import { MOUSE_CLICK, createEventsObj } from '@common/events';

export const getEvent = (scope, key) => {
    return {
        // 折叠事件
        toggle: createEventsObj(MOUSE_CLICK, scope, `[${key}] i`)
    };
};

export const eventMap = {};
