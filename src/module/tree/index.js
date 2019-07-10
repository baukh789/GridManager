/**
 * 树结构
 */
import './style.less';
import jTool from '@common/jTool';
import { parseTpl } from '@common/parse';
import treeTpl from './tree.tpl.html';
class Tree {
    get key() {
        return 'gm_tree';
    }

    init(gridManagerName) {
        jTool('table').on('click', '.tree-action', function (e) {
            const $action = jTool(this);
            const openState = $action.attr('open-state') === 'true';
            const cacheKey = $action.closest('tr').attr('cache-key');
            jTool(`tr[father-cache-key="${cacheKey}"]`).attr('children-open-state', !openState);
            $action.attr('open-state', !openState);
            $action.removeClass(!openState ? 'icon-add' : 'icon-jianhao');
            $action.addClass(!openState ? 'icon-jianhao' : 'icon-add');
        });
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
        const { treeKey, openState } = settings.treeConfig;
        return {
            key: this.key,
            text: '',
            isAutoCreate: true,
            isShow: true,
            disableCustomize: true,
            width: '25px',
            align: 'center',
            template: (tree, row) => {
                const children = row[treeKey];
                const span = children && children.length ? this.createHtml({openState}) : '';
                return `<td gm-create="true" gm-tree>${span}</td>`;
            }
        };
    }
}

export default new Tree();
