import { getColTd, getTh, getTable, getTbody } from '@common/base';
import { ROW_HIDE_KEY } from '@common/constants';
import jTool from '@jTool';
import { each } from '@jTool/utils';
import { ROW_SPAN, MERGE_TD, ROW_LAST } from './constants';
import { Column, ColumnMap } from 'typings/types';
import './style.less';

/**
 * 根据配置项[merge]合并行数据相同的单元格
 * @param _
 * @param columnMap
 */
export const mergeRow = (_: string, columnMap: ColumnMap): void => {
    each(columnMap, (key: string, col: Column) => {
        let merge = col.merge;
        if (!merge || (merge !== 'text' &&  merge !== 'html')) {
            return true;
        }

        // 排除: 汇总行 和 隐藏行
        const $tdList = getColTd(getTh(_, key), getTbody(_).find(`tr:not([gm-summary-row]):not([${ROW_HIDE_KEY}])`));

        let len = $tdList.length;
        let index = len;
        let mergeSum = 1;
        // 倒序进行处理: 添加rowspan需要增加至第一行的单元格，使用倒序可以很好的处理这个问题
        while (index) {
            const $td = $tdList.eq(index - 1);
            $td.removeAttr(ROW_SPAN);
            $td.removeAttr(MERGE_TD);
            $td.removeAttr(ROW_LAST);
            index--;
            if (index === 0) {
                if (mergeSum > 1) {
                    $td.attr(ROW_SPAN, mergeSum);
                    mergeSum = 1;
                }
                return;
            }
            const $prve = $tdList.eq(index - 1);

            // 这里比较html而不比较数据的原因: 当前单元格所展示文本可能在template中未完全使用数据
            if ($prve[merge]() === $td[merge]()) {
                $td.attr(MERGE_TD, '');
                mergeSum++;
            } else {
                if (mergeSum > 1) {
                    $td.attr(ROW_SPAN, mergeSum);
                    // 当前td的rowspan 到达到最后一行
                    if (index + mergeSum === len) {
                        $td.attr(ROW_LAST, '');
                    }
                    mergeSum = 1;
                }
            }
        }
    });
};

/**
 * 清除合并行数据相同的单元格
 * @param _
 */
export const clearMergeRow = (_: string): void => {
    const $table = getTable(_);
    jTool(`[${ROW_SPAN}]`, $table).removeAttr(ROW_SPAN);
    jTool(`[${MERGE_TD}]`, $table).removeAttr(MERGE_TD);
};
