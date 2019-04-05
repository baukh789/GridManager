/**
 * 过滤功能所需的事件项
 * @param gridManagerName
 * @param scope: querySelector 域
 */
export default function getFilterEvent(gridManagerName, scope) {
    return {
        // 切换可视状态
        toggle: {events: 'mousedown', selector: `${scope} .fa-icon`},

        // 关闭
        close: {events: 'mousedown.closeFitler'},

        // 提交
        submit: {events: 'mouseup', selector: `${scope} .filter-submit`},

        // 重置
        reset: {events: 'mouseup', selector: `${scope} .filter-reset`},

        // 复选框点选
        checkboxAction: {events: 'click', selector: `${scope} .gm-checkbox-input`},

        // 单选框点选
        radioAction: {events: 'click', selector: `${scope} .gm-radio-input`}
    };
}
