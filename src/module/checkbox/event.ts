/**
 * 选择框功能所需的事件项
 * @param gridManagerName
 * @param scope: querySelector 域
 */
import { MOUSE_CLICK, createEventsObj } from '@common/events';
import { TR_CACHE_KEY } from '@common/constants';
export const getEvent = (_: string, scope: string) => {
    return {
        // 全选框点击
        allChange: createEventsObj(MOUSE_CLICK, scope, 'th[gm-checkbox] .gm-checkbox-wrapper'),

        // 复选框点击
        checkboxChange: createEventsObj(MOUSE_CLICK, scope, 'td[gm-checkbox] .gm-checkbox-wrapper'),

        // 单选框点击
        radioChange: createEventsObj(MOUSE_CLICK, scope, 'td[gm-checkbox] .gm-radio-wrapper'),

        // tr 点击选中
        trChange: createEventsObj(MOUSE_CLICK, scope, `tbody > tr[${TR_CACHE_KEY}]`)
    };
};

export const eventMap = {};
