/**
 * 过滤功能所需的事件项
 * @param gridManagerName
 * @param scope: querySelector 域
 */
export default function getFilterEvent(gridManagerName, scope) {
    return {
        // 切换可视状态
        toggleAction: {eventName: 'mousedown', eventQuerySelector: `${scope} .fa-icon`},

        // 关闭
        closeFitler: {eventName: 'mousedown.closeFitler'},

        // 提交
        submitAction: {eventName: 'mouseup', eventQuerySelector: `${scope} .filter-submit`},

        // 重置
        resetAction: {eventName: 'mouseup', eventQuerySelector: `${scope} .filter-reset`},

        // 复选框点选
        checkboxAction: {eventName: 'click', eventQuerySelector: `${scope} .gm-checkbox-input`},

        // 单选框点选
        radioAction: {eventName: 'click', eventQuerySelector: `${scope} .gm-radio-input`}
    };
}
