import { isElement, isEmptyObject, isNull, isUndefined, each } from '@jTool/utils';
import { compileTd } from '@common/framework';
import { DISABLE_MOVE } from '@module/moveRow/constants';
import './style.less';
export const installSummary = (settings, columnList, tableData, trObjectList) => {
    const { summaryHandler } = settings;
    const summaryMap = summaryHandler(tableData);

    // 未设置汇总行执行函数: 默认返回的为空对像
    if (isEmptyObject(summaryMap)) {
        return;
    }
    const tdList = [];
    each(columnList, col => {
        const { key, align } = col;
        let summary = summaryMap[key];
        if (isNull(summary) || isUndefined(summary)) {
            summary = '';
        }

        const alignAttr = align ? `align="${align}"` : '';
        let { text, compileAttr } = compileTd(settings, () => summary, {}, undefined, key);
        text = isElement(text) ? text.outerHTML : text;
        tdList.push(`<td ${compileAttr} ${alignAttr} ${DISABLE_MOVE}>${text}</td>`);
    });
    trObjectList.push({
        className: [],
        attribute: ['gm-summary'],
        tdList
    });
};
