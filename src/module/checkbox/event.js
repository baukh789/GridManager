/**
 * 选择框功能所需的事件项
 * @param gridManagerName
 * @param scope: querySelector 域
 */
export default function getCheckboxEvent(gridManagerName, scope) {
    return {
        // 全选框点击
        allChange: {eventName: 'click', eventQuerySelector: `${scope} th[gm-checkbox="true"] input[type="checkbox"]`},

        // 复选框点击
        checkboxChange: {eventName: 'click', eventQuerySelector: `${scope} td[gm-checkbox="true"] input[type="checkbox"]`},

        // 单选框点击
        radioChange: {eventName: 'click', eventQuerySelector: `${scope} td[gm-checkbox="true"] input[type="radio"]`},

        // tr 点击选中
        trChange: {eventName: 'click', eventQuerySelector: `${scope} tbody > tr`}
    };
}
