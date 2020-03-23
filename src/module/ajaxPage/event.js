/**
 * 分页功能所需的事件项
 * @param gridManagerName
 * @param scope: querySelector 域
 */
import { TOOLBAR_KEY } from '@common/constants';
import { KEY_UP, MOUSE_CLICK, createEventsObj } from '@common/events';
export const getEvent = gridManagerName => {
    const target = `[${TOOLBAR_KEY}="${gridManagerName}"]`;
    return {
        // 快捷跳转
        input: createEventsObj(KEY_UP, target, '.gp-input'),

        // 第一页
        first: createEventsObj(MOUSE_CLICK, target, '[pagination-before] .first-page'),

        // 上一页
        previous: createEventsObj(MOUSE_CLICK, target, '[pagination-before] .previous-page'),

        // 下一页
        next: createEventsObj(MOUSE_CLICK, target, '[pagination-after] .next-page'),

        // 尾页
        last: createEventsObj(MOUSE_CLICK, target, '[pagination-after] .last-page'),

        // 页码
        num: createEventsObj(MOUSE_CLICK, target, '[pagination-number] li'),

        // 刷新
        refresh: createEventsObj(MOUSE_CLICK, target, '.refresh-action')
    };
};

export const eventMap = {};
