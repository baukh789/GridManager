/**
 * 菜单功能所需的事件项
 * @param gridManagerName
 * @param scope: querySelector 域
 */
export default function getMenuEvent(gridManagerName, scope) {
    return {
        // 右键打开菜单
        openMenu: {eventName: 'contextmenu', eventQuerySelector: `.table-wrap[wrap-key="${gridManagerName}"]`},

        // 关闭菜单
        closeMenu: {eventName: `mousedown.${gridManagerName}`},

        // 上一页、下一页、重新加载
        refresh: {eventName: 'click', eventQuerySelector: `${scope} [grid-action="refresh-page"]`},

        // 导出、导出已选中
        exportExcel: {eventName: 'click', eventQuerySelector: `${scope} [grid-action="export-excel"]`},

        // 打开配置区域
        openConfig: {eventName: 'click', eventQuerySelector: `${scope} [grid-action="config-grid"]`}
    };
}
