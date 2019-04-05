/**
 * 菜单功能所需的事件项
 * @param gridManagerName
 * @param scope: querySelector 域
 */
import { WRAP_KEY } from '@common/constants';
export default function getMenuEvent(gridManagerName, scope) {
    return {
        // 打开菜单
        openMenu: {events: 'contextmenu', selector: `.table-wrap[${WRAP_KEY}="${gridManagerName}"]`},

        // 关闭菜单
        closeMenu: {events: 'mousedown.closeMenu'},

        // 上一页、下一页、重新加载
        refresh: {events: 'click', selector: `${scope} [grid-action="refresh-page"]`},

        // 导出、导出已选中
        exportExcel: {events: 'click', selector: `${scope} [grid-action="export-excel"]`},

        // 打开配置区域
        openConfig: {events: 'click', selector: `${scope} [grid-action="config-grid"]`}
    };
}
