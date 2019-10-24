/**
 * 选择框功能所需的事件项
 * @param gridManagerName
 * @param scope: querySelector 域
 */
export const getEvent = (gridManagerName, scope) => {
    return {
        // 全选框点击
        allChange: {events: 'click', target: scope, selector: 'th[gm-checkbox] .gm-checkbox-wrapper'},

        // 复选框点击
        checkboxChange: {events: 'click', target: scope, selector: 'td[gm-checkbox] .gm-checkbox-wrapper'},

        // 单选框点击
        radioChange: {events: 'click', target: scope, selector: 'td[gm-checkbox] .gm-radio-wrapper'},

        // tr 点击选中
        trChange: {events: 'click', target: scope, selector: 'tbody > tr'}
    };
};

export const eventMap = {};
