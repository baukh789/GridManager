/**
 * 拖拽功能所需的事件项
 * @param gridManagerName
 * @param scope: querySelector 域
 */
import { FAKE_TABLE_HEAD_KEY } from '@common/constants';
import { MOUSE_DOWN, MOUSE_MOVE, MOUSE_UP, createEventsObj } from '@common/events';
import { CLASS_DRAG_ACTION } from './constants';
import { EventMap } from 'typings/types';
export const getEvent = (_: string, scope: string): EventMap => {
    return {
        // 开始
        start: createEventsObj(MOUSE_DOWN, scope, `[${FAKE_TABLE_HEAD_KEY}="${_}"] .${CLASS_DRAG_ACTION}`),

        // 调整中
        doing: createEventsObj(`${MOUSE_MOVE}.gmDrag`, 'body'),

        // 停止
        abort: createEventsObj(`${MOUSE_UP}.gmDrag`, 'body')
    };
};

export const eventMap = {};
