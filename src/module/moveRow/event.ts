/**
 * 拖拽功能所需的事件项
 * @param scope: querySelector 域
 */
import { EMPTY_TPL_KEY } from '@common/constants';
import { MOUSE_DOWN, MOUSE_MOVE, MOUSE_UP, createEventsObj } from '@common/events';
import { EventMap } from 'typings/types';

export const getEvent = (scope: string): EventMap => {
    const name = 'gmLineDrag';
    return {
        // 开始
        start: createEventsObj(`${MOUSE_DOWN}.${name}`, scope, `tr:not([${EMPTY_TPL_KEY}])`),

        // 调整中
        doing: createEventsObj(`${MOUSE_MOVE}.${name}`, 'body'),

        // 停止
        abort: createEventsObj(`${MOUSE_UP}.${name}`, 'body')
    };
};

export const eventMap = {};
