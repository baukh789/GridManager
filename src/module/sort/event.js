/**
 * 排序功能所需的事件项
 * @param gridManagerName
 * @param scope: querySelector 域
 */
import { SORT_CLASS, FAKE_TABLE_HEAD_KEY } from '@common/constants';
export const getEvent = (gridManagerName, scope) => {
    return {
        // 触发 #001
        sortAction: {events: 'mouseup', target: scope, selector: `[${FAKE_TABLE_HEAD_KEY}="${gridManagerName}"] .${SORT_CLASS}`}
    };
};

export const eventMap = {};
