/**
 * 菜单功能所需的事件项
 * @param _
 */
import { WRAP_KEY, MENU_KEY } from '@common/constants';
import { MOUSE_CLICK, MOUSE_DOWN, CONTEXT_MENU, createEventsObj } from '@common/events';

export const getEvent = _ => {
    const menuTarget = `[${MENU_KEY}="${_}"]`;
    const menuSelector = type => `[menu-action="${type}"]`;
    return {
        // 打开菜单
        openMenu: createEventsObj(CONTEXT_MENU, `[${WRAP_KEY}="${_}"]`),

        // 关闭菜单
        closeMenu: createEventsObj(`${MOUSE_DOWN}.closeMenu`, 'body'),

        // 上一页、下一页、重新加载
        refresh: createEventsObj(MOUSE_CLICK, menuTarget, menuSelector('refresh')),

        // 导出、导出已选中
        exportPage: createEventsObj(MOUSE_CLICK, menuTarget, menuSelector('export')),

        // 打印
        printPage: createEventsObj(MOUSE_CLICK, menuTarget, menuSelector('print')),

        // 打开配置区域
        openConfig: createEventsObj(MOUSE_CLICK, menuTarget, menuSelector('config'))
    };
};

export const eventMap = {};
