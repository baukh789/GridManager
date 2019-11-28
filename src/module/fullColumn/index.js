import { compileFullColumn } from '@common/framework';
import { isUndefined, isElement } from '@common/utils';
import './style.less';
// 插入通栏: top-full-column
export const installTopFull = (settings, columnData, tbody, template, trNode, row, index) => {
    // 通栏tr
    const topTrNode = document.createElement('tr');
    topTrNode.setAttribute('top-full-column', 'true');

    // 通栏用于向上的间隔的tr
    const intervalTrNode = document.createElement('tr');
    intervalTrNode.setAttribute('top-full-column-interval', 'true');
    intervalTrNode.innerHTML = `<td colspan="${columnData.length}"><div></div></td>`;
    tbody.appendChild(intervalTrNode);

    // 为非通栏tr的添加标识
    trNode.setAttribute('top-full-column', 'false');

    topTrNode.innerHTML = `<td colspan="${columnData.length}"><div class="full-column-td"></div></td>`;

    const fullColumnNode = topTrNode.querySelector('.full-column-td');
    const tdTemplate = compileFullColumn(settings, fullColumnNode, row, index, template);
    isElement(tdTemplate) ? fullColumnNode.appendChild(tdTemplate) : fullColumnNode.innerHTML = (isUndefined(tdTemplate) ? '' : tdTemplate);

    tbody.appendChild(topTrNode);
};
