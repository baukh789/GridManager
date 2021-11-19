/**
 * 菜单功能所需的事件项
 * @param _
 */
import { WRAP_KEY } from '@common/constants';
import { MOUSE_DOWN, CONTEXT_MENU, createEventsObj } from '@common/events';
import { EventMap } from 'typings/types';

export const getEvent = (_: string): EventMap => {
    return {
        // 打开菜单
        openMenu: createEventsObj(CONTEXT_MENU, `[${WRAP_KEY}="${_}"]`),

        // 关闭菜单
        closeMenu: createEventsObj(`${MOUSE_DOWN}.closeMenu`, 'body')
    };
};

export const eventMap = {};
