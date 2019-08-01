/**
 * 树结构
 */
import './style.less';
import jTool from '@common/jTool';
import base from '@common/base';
import { TR_PARENT_KEY, TR_CACHE_KEY, TR_CHILDREN_STATE } from '@common/constants';
import getTreeEvent from './event';
const getIconClass = state => {
    return state ? 'icon-jianhao' : 'icon-add';
};

class Tree {
    eventMap = {};

    get key() {
        return 'tree-element';
    }

    init(gridManagerName) {
        // 由于存在递归操作，所以将事件执行内容从事件中抽取
        const updateState = ($tr, openState) => {
            const $treeEle = jTool(`[${this.key}]`, $tr);
            const $action = jTool('.tree-action', $treeEle);
            const cacheKey = $tr.attr(TR_CACHE_KEY);
            if (typeof openState === 'undefined') {
                openState = !($treeEle.attr(this.key) === 'true');
            }

            $action.removeClass(getIconClass(!openState));
            $action.addClass(getIconClass(openState));
            $treeEle.attr(this.key, openState);

            const $childrenTr = $tr.closest('tbody').find(`tr[${TR_PARENT_KEY}="${cacheKey}"]`);
            if ($childrenTr.length === 0) {
                return;
            }
            $childrenTr.attr(TR_CHILDREN_STATE, openState);

            // 折叠时，需要将所有的子集全部折叠
            if (!openState) {
                jTool.each($childrenTr, (index, tr) => {

                    updateState(jTool(tr), false);
                });
            }
        };

        // 绑定事件
        this.eventMap[gridManagerName] = getTreeEvent(gridManagerName, base.getQuerySelector(gridManagerName), this.key);
        const { target, events, selector } = this.eventMap[gridManagerName].toggleState;

        jTool(target).on(events, selector, function () {
            const $tr = jTool(this).closest('tr');
            updateState($tr);
        });
    }

    /**
     * 插入树事件DOM
     * @param gridManagerName
     * @param openState
     * @param insertTo
     * @param trNode
     * @param level
     * @param children
     */
    insertDOM(gridManagerName, openState, insertTo, trNode, level, children) {
        // 第一个非自动创建 且 可视的td
        let $insertTd = null;
        if (typeof insertTo === 'string') {
            $insertTd = base.getColTd(base.getTh(gridManagerName, insertTo), trNode);
        }

        // 未设置 insertTo 或 通过 insertTo 未找到dom时: 使用第一个非自动创建的TD
        if (!$insertTd) {
            $insertTd = jTool('td[gm-create="false"]', trNode);
        }
        const treeDOM = document.createElement('span');
        treeDOM.setAttribute(this.key, openState);
        treeDOM.style.width = (level + 1) * 14 + 'px';

        if (children && children.length) {
            treeDOM.innerHTML = `<i class="tree-action iconfont ${getIconClass(openState)}"></i>`;
        }
        $insertTd.prepend(treeDOM);
    }

    /**
     * 消毁
     * @param gridManagerName
     */
    destroy(gridManagerName) {
        base.clearBodyEvent(this.eventMap[gridManagerName]);
    }
}

export default new Tree();
