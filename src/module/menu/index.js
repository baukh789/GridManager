/**
 * Menu[右键菜单]
 * 参数说明:
 *  - supportMenu: 是否开启右键菜单
 *  - menuHandler: 菜单处理程序
 *      - type: Function
 *      - default: list => list
 *      - arguments
 *          - list: 菜单在实例化时生成的菜单list, 在menuHandler内将修改后的list返回可自定义菜单项。
 *
 * GridManager自带以下菜单项:
 * - 上一页
 * - 下一页
 * - 导出
 * - 导出选中项
 * - 重新加载
 * - 打印
 * - 配置表
 *
 * 每个菜单对像都有以下属性:
 * - content: String 显示文本
 * - line: Boolean 是否显示分割线
 * - run(gridManagerName, $dom): 每次打开菜单前的执行函数
 * - onClick(gridManagerName): 菜单项点击事件
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
