import { compileFullColumn } from '@common/framework';
import { isUndefined, isElement } from '@jTool/utils';
import './style.less';
// 获取通栏: top-full-column
export const getTopFull = (settings, row, index, callback) => {
    const { columnData, topFullColumn } = settings;

    const template = topFullColumn.template;
    const columnDataLen = columnData.length;

    // 未存在有效的通栏模板
    if (isUndefined(template)) {
        return [];
    }

    // 通栏用于向上的间隔的tr
    const intervalTrObject = {
        className: [],
        attribute: ['top-full-column-interval="true"'],
        tdList: [`<td colspan="${columnDataLen}"><div></div></td>`]
    };

    // 通栏tr
    let { text, compileAttr } = compileFullColumn(settings, row, index, template);
    text = isElement(text) ? text.outerHTML : text;
    const topTrObject = {
        className: [],
        attribute: ['top-full-column="true"'],
        tdList: [`<td colspan="${columnDataLen}"><div class="full-column-td" ${compileAttr}>${text}</div></td>`]
    };
    callback();
    return [intervalTrObject, topTrObject];
};
