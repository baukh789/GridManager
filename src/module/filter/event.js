/**
 * 过滤功能所需的事件项
 * @param gridManagerName
 * @param scope: querySelector 域
 */
export const getEvent = (gridManagerName, scope) => {
    return {
        // 切换可视状态
        toggle: {events: 'mousedown', target: scope, selector: '.filter-area .fa-icon'},

        // 关闭
        close: {events: 'mousedown.closeFitler', target: 'body'},

        // 提交
        submit: {events: 'mouseup', target: scope, selector: '.filter-area .filter-submit'},

        // 重置
        reset: {events: 'mouseup', target: scope, selector: '.filter-area .filter-reset'},

        // 复选框点选
        checkboxAction: {events: 'click', target: scope, selector: '.filter-area .gm-checkbox-input'},

        // 单选框点选
        radioAction: {events: 'click', target: scope, selector: '.filter-area .gm-radio-input'}
    };
};

export const eventMap = {};
