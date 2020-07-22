/**
 * 通栏功能所需的事件项
 * @param gridManagerName
 * @param scope: querySelector 域
 */
import { createEventsObj, MOUSE_CLICK } from '@common/events';

export const getEvent = (gridManagerName, scope) => {
    return {
        // 触发 #001
        fold: createEventsObj(MOUSE_CLICK, scope, '[full-column-fold] i')
    };
};

export const eventMap = {};
