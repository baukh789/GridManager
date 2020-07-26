/**
 * 嵌套表头
 * - 触发条件: columnData中存在有效的children字段
 * - DOM标识: 存在嵌套表头的表格将在 table-div 上增加 gm-nested 属性
 */
import { each, isValidArray } from '@jTool/utils';
import { getDiv } from '@common/base';
import './style.less';

// 更新父级
const updateParent = (columnMap, col) => {
    const parentCol = columnMap[col.pk];
    if (parentCol) {
        if (!parentCol.colspan || parentCol.colspan === 1) {
            // 存在四级及以上时才会调用
            parentCol.colspan = col.colspan;
        } else {
            parentCol.colspan = parentCol.children.length + col.colspan - 1;
        }
        if (parentCol.pk) {
            updateParent(columnMap, parentCol);
        }
    }
};
const pushList = (columnMap, columnList, list, rowspan) => {
    each(list, item => {
        // 这里不直接使用item而用columnMap的原因: item的children中存储的是初始时的数据，缺失level字段
        const col = columnMap[item.key];
        const { level } = col;
        if (!columnList[level]) {
            columnList[level] = [];
        }
        if (isValidArray(col.children)) {
            col.rowspan = 1;
            col.colspan = col.children.length;
            updateParent(columnMap, col);
            pushList(columnMap, columnList, col.children, rowspan - 1);
        } else {
            col.rowspan = rowspan;
            col.colspan = 1;
        }

        if (level > 0) {
            columnList[level].push(col);
        }
    });
};
class Nested {
    /**
     * 增加嵌套表头标识: 用于样式文件
     * @param _
     */
    addSign(_) {
        getDiv(_).attr('gm-nested', '');
    }

    /**
     * 生成嵌套数据
     * @param columnMap
     * @param columnList
     */
    push(columnMap, columnList) {
        let maxLevel = 0;
        const topList = columnList[0];
        each(columnMap, (key, col) => {
            const { level, index } = col;
            // 生成最上层数组
            if (level === 0) {
                topList[index] = col;
            }

            // 最大层层级值
            if (maxLevel < level) {
                maxLevel = level;
            }
        });
        pushList(columnMap, columnList, topList, maxLevel + 1);
    }
}
export default new Nested();
