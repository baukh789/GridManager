/**
 * 排序功能所需的事件项
 * @param gridManagerName
 * @param scope: querySelector 域
 */
import { SORT_CLASS } from '@common/constants';
export const getEvent = (gridManagerName, scope) => {
    return {
        // 触发 #001
        sortAction: {events: 'mouseup', target: scope, selector: `.${SORT_CLASS}`}
    };
};

export const eventMap = {};
