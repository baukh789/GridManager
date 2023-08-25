import { ROW_HIDE_KEY, TR_CACHE_KEY, TR_PARENT_KEY } from '@common/constants';
import { mergeRow } from '@module/merge';
import './style.less';
import jTool from '@jTool';
import { isUndefined } from '@jTool/utils';
import { JTool, SettingObj } from 'typings/types';

// 获取TR列表: cacheKey相匹配的普通行及通栏行、树结构行
const getTrList = (cacheKey: string | number): JTool => {
    return jTool(`[${TR_CACHE_KEY}="${cacheKey}"], [${TR_PARENT_KEY}="${cacheKey}"], [${TR_PARENT_KEY}^="${cacheKey}-"]`);
};

/**
 * 显示已隐藏的行
 * @param settings
 * @param cacheKey: 行的索引，为空时将显示所有已隐藏的行
 */
export const showRow = (settings: SettingObj, cacheKey: string | number): void => {
    let $trList: JTool;
    // 为空时将显示所有已隐藏的行
    if (isUndefined(cacheKey)) {
        $trList = jTool(`[${ROW_HIDE_KEY}]`);
    } else {
        $trList = getTrList(cacheKey);
    }

    $trList.attr(ROW_HIDE_KEY, 'out');
    setTimeout(() => {
        $trList.removeAttr(ROW_HIDE_KEY);
        mergeRow(settings._, settings.columnMap);
    }, 500);
};

/**
 * 隐藏行
 * @param settings
 * @param cacheKey: 行的索引，为空时将不执行
 */
export const hideRow = (settings: SettingObj, cacheKey: string | number): void => {
    const $trList = getTrList(cacheKey);
    $trList.attr(ROW_HIDE_KEY, 'ing');
    setTimeout(() => {
        $trList.attr(ROW_HIDE_KEY, 'true');
        mergeRow(settings._, settings.columnMap);
    }, 500);
};
