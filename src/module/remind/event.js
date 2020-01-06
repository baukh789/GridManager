/**
 * 表头提醒功能所需的事件项
 * @param gridManagerName
 * @param scope: querySelector 域
 *
 * #001: 这里不使用onmouseenter的原因： onmouseenter不支持事件冒泡，无法进行事件委托
 */
import { REMIND_CLASS } from '@common/constants';
export const getEvent = (gridManagerName, scope) => {
    return {
        // 触发 #001
        remindStart: {events: 'mouseover', target: scope, selector: `.${REMIND_CLASS}`}
    };
};

export const eventMap = {};
