import { getColTd, getTh, getTable } from '@common/base';
import jTool from '@jTool';
import { each } from '@jTool/utils';
import './style.less';

import { ROW_SPAN, MERGE_TD } from './constants';
/**
 * 根据配置项[merge]合并行数据相同的单元格
 * @param _
 * @param columnMap
 */
export const mergeRow = (_, columnMap) => {
    each(columnMap, (key, col) => {
        let merge = col.merge;
        if (!merge || (merge !== 'text' &&  merge !== 'html')) {
            return true;
        }

        const $tdList = getColTd(getTh(_, key));

        let len = $tdList.length;
        let mergeSum = 1;
        // 倒序进行处理: 添加rowspan需要增加至第一行的单元格，使用倒序可以很好的处理这个问题
        while (len) {
            const $td = $tdList.eq(len - 1);
            $td.removeAttr(ROW_SPAN);
            $td.removeAttr(MERGE_TD);
            len--;
            if (len === 0) {
                if (mergeSum > 1) {
                    $td.attr(ROW_SPAN, mergeSum);
                    mergeSum = 1;
                }
                return;
            }
            const $prve = $tdList.eq(len - 1);

            // 这里比较html而不比较数据的原因: 当前单元格所展示文本可能在template中未完全使用数据
            if ($prve[merge]() === $td[merge]()) {
                $td.attr(MERGE_TD, '');
                mergeSum++;
            } else {
                if (mergeSum > 1) {
                    $td.attr(ROW_SPAN, mergeSum);
                    mergeSum = 1;
                }
            }
        }
    });
};

/**
 * 清除合并行数据相同的单元格
 * @param _
 * @param $context
 */
export const clearMergeRow = (_, $context) => {
    $context = $context || getTable(_);
    jTool(`[${ROW_SPAN}]`, $context).removeAttr(ROW_SPAN);
    jTool(`[${MERGE_TD}]`, $context).removeAttr(MERGE_TD);
};
