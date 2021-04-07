import { isElement, isEmptyObject, isNull, isUndefined, each } from '@jTool/utils';
import { compileTd } from '@common/framework';
import { getDiv, getThead } from '@common/base';
import { DISABLE_MOVE } from '@module/moveRow/constants';
import { SUMMARY_FLAG, SUMMARY_ROW } from './constants';
import './style.less';

export const installSummary = (settings, columnList, tableData, trObjectList) => {
    const { _, summaryHandler, browser } = settings;
    const summaryMap = summaryHandler(tableData);

    // 未设置汇总行执行函数: 默认返回的为空对像
    if (isEmptyObject(summaryMap)) {
        getDiv(_).removeAttr(SUMMARY_FLAG);
        return;
    }
    getDiv(_).attr(SUMMARY_FLAG, '');
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

        let style = '';
        // 兼容性处理: safari 在处理sticky时，需要减去thead的高度
        if (browser === 'safari') {
            style = `style="bottom: ${getThead(_).height()}px"`;
        }
        tdList.push(`<td ${compileAttr} ${alignAttr} ${DISABLE_MOVE} ${style}>${text}</td>`);
    });
    trObjectList.push({
        className: [],
        attribute: [SUMMARY_ROW],
        tdList
    });
};
