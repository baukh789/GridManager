/**
 * 菜单功能所需的事件项
 * @param _
 */
import { WRAP_KEY, MENU_KEY } from '@common/constants';
export const getEvent = _ => {
    const menuTarget = `[${MENU_KEY}="${_}"]`;
    const menuSelector = type => `[menu-action="${type}"]`;
    return {
        // 打开菜单
        openMenu: {events: 'contextmenu', target: `[${WRAP_KEY}="${_}"]`},

        // 关闭菜单
        closeMenu: {events: 'mousedown.closeMenu', target: 'body'},

        // 上一页、下一页、重新加载
        refresh: {events: 'click', target: menuTarget, selector: menuSelector('refresh')},

        // 导出、导出已选中
        exportPage: {events: 'click', target: menuTarget, selector: menuSelector('export')},

        // 打印
        printPage: {events: 'click', target: menuTarget, selector: menuSelector('print')},

        // 打开配置区域
        openConfig: {events: 'click', target: menuTarget, selector: menuSelector('config')}
    };
};

export const eventMap = {};
