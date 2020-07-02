/*
 * GridManager: 右键菜单
 */
import jTool from '@jTool';
import { clearTargetEvent } from '@common/base';
import { MENU_KEY } from '@common/constants';
import { getEvent, eventMap } from './event';
import { TARGET, EVENTS } from '@common/events';
import { getMenuQuerySelector, createMenuDom, clearMenuDOM, getMenuPosition } from './tool';
import './style.less';

class Menu {
    /**
     * 初始化
     * @param _
     */
    init(_) {
        eventMap[_] = getEvent(_);

        const { openMenu, closeMenu } = eventMap[_];

        // 绑定打开右键菜单栏
        jTool(openMenu[TARGET]).on(openMenu[EVENTS], function (e) {
            e.preventDefault();
            e.stopPropagation();

            // 验证：如果不是tbdoy或者是tbody的子元素，直接跳出
            if (e.target.nodeName !== 'TBODY' && jTool(e.target).closest('tbody').length === 0) {
                return;
            }
            const $menu = createMenuDom(_);

            $menu.show();

            // 定位
            $menu.css(getMenuPosition($menu.width(), $menu.height(), e.clientX, e.clientY));

            // 禁用菜单自身的右键
            $menu.on(openMenu[EVENTS], function (e1) {
                e1.preventDefault();
                e1.stopPropagation();
            });

            // 点击空处关闭
            const $closeTarget = jTool(closeMenu[TARGET]);
            const closeEvents = closeMenu[EVENTS];
            $closeTarget.off(closeEvents);
            $closeTarget.on(closeEvents, function (e2) {
                const eventSource = jTool(e2.target);
                // 当前为menu自身
                if (eventSource.attr(MENU_KEY) || eventSource.closest(`[${MENU_KEY}]`).length === 1) {
                    return;
                }
                clearMenuDOM(_);
            });
        });

    }

    /**
	 * 消毁
	 * @param _
	 */
	destroy(_) {
	    // 清除事件
        clearTargetEvent(eventMap[_]);

        // 删除DOM节点
        jTool(getMenuQuerySelector(_)).remove();
	}
}
export default new Menu();
