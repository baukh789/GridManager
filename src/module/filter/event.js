/**
 * 过滤功能所需的事件项
 * @param _
 * @param scope: querySelector 域
 */
import { FAKE_TABLE_HEAD_KEY } from '@common/constants';
import { CLASS_FILTER } from './constants';
export const getEvent = (_, scope) => {
    const filterSign = `[${FAKE_TABLE_HEAD_KEY}="${_}"] .${CLASS_FILTER}`;
    return {
        // 切换可视状态
        toggle: {events: 'mousedown', target: scope, selector: `${filterSign} .fa-icon`},

        // 关闭
        close: {events: 'mousedown.closeFitler', target: 'body'},

        // 提交
        submit: {events: 'mouseup', target: scope, selector: `${filterSign} .filter-submit`},

        // 重置
        reset: {events: 'mouseup', target: scope, selector: `${filterSign} .filter-reset`},

        // 复选框点选
        checkboxAction: {events: 'click', target: scope, selector: `${filterSign} .gm-checkbox-input`},

        // 单选框点选
        radioAction: {events: 'click', target: scope, selector: `${filterSign} .gm-radio-input`}
    };
};

export const eventMap = {};
