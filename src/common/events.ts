import { EventObj } from 'typings/types';

// 事件: click
export const MOUSE_CLICK = 'click';

// 事件: dbclick
export const MOUSE_DBCLICK = 'dblclick';

// 事件: mousedown
export const MOUSE_DOWN = 'mousedown';

// 事件: mousemove
export const MOUSE_MOVE = 'mousemove';

// 事件: mouseup
export const MOUSE_UP = 'mouseup';

// 事件: mouseleave
export const MOUSE_LEAVE = 'mouseleave';

// 事件: mouseover
export const MOUSE_OVER = 'mouseover';

// 事件: contextmenu
export const CONTEXT_MENU = 'contextmenu';

// 事件: resize
export const RESIZE = 'resize';

// 事件: scroll
export const SCROLL = 'scroll';

// 事件: keyup
export const KEY_UP = 'keyup';

// 事件名
export const EVENTS = 'events';

// 事件绑定对像
export const TARGET = 'target';

// 事件选择器
export const SELECTOR = 'selector';

// 获取事件对像
export const createEventsObj = (events: string, target: string, selector?: string): EventObj => {
    return {
        [EVENTS]: events,
        [TARGET]: target,
        [SELECTOR]: selector
    };
};
