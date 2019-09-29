/**
 * 选择框功能所需的事件项
 * @param gridManagerName
 * @param scope: querySelector 域
 */
export default function getCheckboxEvent(gridManagerName, scope) {
    return {
        // 全选框点击
        allChange: {events: 'click', target: scope, selector: 'th[gm-checkbox="true"] .gm-checkbox-wrapper'},

        // 复选框点击
        checkboxChange: {events: 'click', target: scope, selector: 'td[gm-checkbox="true"] .gm-checkbox-wrapper'},

        // 单选框点击
        radioChange: {events: 'click', target: scope, selector: 'td[gm-checkbox="true"] .gm-radio-wrapper'},

        // tr 点击选中
        trChange: {events: 'click', target: scope, selector: 'tbody > tr'}
    };
}
