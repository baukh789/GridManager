import { compileFullColumn } from '@common/framework';
import { isUndefined, isElement } from '@common/utils';
import './style.less';
// 插入通栏: top-full-column
export const installTopFull = (settings, tbody, row, index, callback) => {
    const { columnData, topFullColumn } = settings;

    const template = topFullColumn.template;

    // 未存在有效的通栏模板
    if (isUndefined(template)) {
        return false;
    }

    // 通栏用于向上的间隔的tr
    const intervalTrNode = document.createElement('tr');
    intervalTrNode.setAttribute('top-full-column-interval', 'true');
    intervalTrNode.innerHTML = `<td colspan="${columnData.length}"><div></div></td>`;
    tbody.appendChild(intervalTrNode);

    // 通栏tr
    const topTrNode = document.createElement('tr');
    topTrNode.setAttribute('top-full-column', 'true');

    topTrNode.innerHTML = `<td colspan="${columnData.length}"><div class="full-column-td"></div></td>`;

    const fullColumnNode = topTrNode.querySelector('.full-column-td');
    const tdTemplate = compileFullColumn(settings, fullColumnNode, row, index, template);
    isElement(tdTemplate) ? fullColumnNode.appendChild(tdTemplate) : fullColumnNode.innerHTML = tdTemplate;

    tbody.appendChild(topTrNode);
    callback();
};
