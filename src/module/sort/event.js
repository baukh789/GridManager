/**
 * 排序功能所需的事件项
 * @param gridManagerName
 * @param scope: querySelector 域
 */
import { SORT_CLASS, FAKE_TABLE_HEAD_KEY } from '@common/constants';
import { MOUSE_UP, createEventsObj } from '@common/events';

export const getEvent = (_, scope) => {
    return {
        // 触发 #001
        start: createEventsObj(MOUSE_UP, scope, `[${FAKE_TABLE_HEAD_KEY}="${_}"] .${SORT_CLASS}`)
    };
};

export const eventMap = {};
