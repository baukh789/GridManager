/**
 * 配置功能所需的事件项
 * @param gridManagerName
 * @param scope: querySelector 域
 */
import { CONFIG_KEY } from '@common/constants';
import { MOUSE_CLICK, MOUSE_DOWN, createEventsObj } from '@common/events';
import { EventMap } from 'typings/types';
export const getEvent = (_: string): EventMap => {
    const target = `[${CONFIG_KEY}="${_}"]`;
    return {
        // 关闭
        closeConfig: createEventsObj(MOUSE_CLICK, target, '.config-action'),

        // 设置
        liChange: createEventsObj(MOUSE_CLICK, target, '.config-list li'),

        // 菜单
        closeConfigByBody: createEventsObj(`${MOUSE_DOWN}.closeConfig`, 'body')
    };
};

export const eventMap = {};
