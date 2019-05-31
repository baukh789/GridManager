/**
 * 树结构
 */
import './style.less';
import { parseTpl } from '@common/parse';
import treeTpl from './tree.tpl.html';
class Tree {
    get key() {
        return 'gm_tree';
    }

    /**
     * 表格配置区域HTML
     * @param params{configInfo}
     * @returns {parseData}
     */
    @parseTpl(treeTpl)
    createHtml(params) {
        return params;
    }

    /**
     * 获取TD: 树折叠对象
     * @param settings
     * @returns {parseData}
     */
    getColumn(settings) {
        const { level, openState } = settings.treeConfig;
        return {
            key: this.key,
            text: openState ? '-' : '+',
            isAutoCreate: true,
            isShow: true,
            disableCustomize: true,
            width: (level - 1) * 30 + 'px',
            align: 'left',
            template: (level, row) => {
                const param = {
                    sign: openState ? '-' : '+',
                    style: `margin-left: ${(level - 1) * 30}px`
                };
                return `<td gm-order="true" gm-create="true">${row.children && row.children.length ? this.createHtml(param) : ''}</td>`;
            }
        };
    }
}

export default new Tree();
