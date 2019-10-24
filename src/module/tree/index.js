/**
 * 树结构
 */
import './style.less';
import jTool from '@common/jTool';
import { getQuerySelector, getTable, getTbody, getTh, getColTd, clearTargetEvent } from '@common/base';
import { TR_PARENT_KEY, TR_CACHE_KEY, TR_CHILDREN_STATE, GM_CREATE } from '@common/constants';
import { isUndefined } from '@common/utils';
import { getEvent, eventMap } from './event';
import { treeKey, treeCacheMap, getIconClass } from './tool';

class Tree {
    /**
     * add map
     * @param gridManagerName
     * @param trNode
     * @param level
     * @param hasChildren
     */
    add(gridManagerName, trNode, level, hasChildren) {
        if (!treeCacheMap[gridManagerName]) {
            treeCacheMap[gridManagerName] = [];
        }
        treeCacheMap[gridManagerName].push({
            trNode,
            level,
            hasChildren
        });
    }

    /**
     * clear map
     * @param gridManagerName
     */
    clear(gridManagerName) {
        delete treeCacheMap[gridManagerName];
    }

    init(gridManagerName) {
        const _this = this;
        // 绑定事件
        eventMap[gridManagerName] = getEvent(gridManagerName, getQuerySelector(gridManagerName), treeKey);
        const { target, events, selector } = eventMap[gridManagerName].toggleState;

        jTool(target).on(events, selector, function () {
            const $tr = jTool(this).closest('tr');
            _this.updateDOM(gridManagerName, undefined, $tr);
        });
    }

    /**
     * 更新树DOM
     * @param gridManagerName
     * @param state: 打开状态
     * @param $tr: 更新的tr节点，未指定时将对tbody下所有节点进行更新(对外公开方法中，不包含开参数)
     */
    updateDOM(gridManagerName, state, $tr) {
        const $tbody = getTbody(gridManagerName);

        const updateState = ($tr, openState) => {
            const $treeEle = jTool(`[${treeKey}]`, $tr);
            const $action = jTool('.tree-action', $treeEle);
            const cacheKey = $tr.attr(TR_CACHE_KEY);
            if (isUndefined(openState)) {
                openState = !($treeEle.attr(treeKey) === 'true');
            }

            $action.removeClass(getIconClass(!openState));
            $action.addClass(getIconClass(openState));
            $treeEle.attr(treeKey, openState);

            const $childrenTr = $tbody.find(`[${TR_PARENT_KEY}="${cacheKey}"]`);
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

        const updateAllState = openState => {
            const $treeEle = jTool(`[${treeKey}]`, $tbody);
            const $action = jTool('.tree-action', $treeEle);
            $action.removeClass(getIconClass(!openState));
            $action.addClass(getIconClass(openState));
            $treeEle.attr(treeKey, openState);
            const $childrenTr = $tbody.find(`[${TR_PARENT_KEY}]`);
            $childrenTr.attr(TR_CHILDREN_STATE, openState);
        };

        $tr ? updateState($tr, state) : updateAllState(state);
    }

    /**
     * 插入树事件DOM
     * @param gridManagerName
     * @param config
     */
    insertDOM(gridManagerName, config) {
        const { openState, insertTo } = config;
        const $table = getTable(gridManagerName);
        let parentKeyList = [];
        jTool.each(jTool(`tr[${TR_PARENT_KEY}]`, $table), (index, item) => {
            parentKeyList.push(item.getAttribute(TR_PARENT_KEY));
        });

        const insetList = treeCacheMap[gridManagerName];
        if (!insetList || insetList.length === 0) {
            return;
        }

        insetList.forEach(item => {
            const { trNode, level, hasChildren } = item;
            // 第一个非自动创建 且 可视的td
            let $insertTd = null;
            if (typeof insertTo === 'string') {
                $insertTd = getColTd(getTh(gridManagerName, insertTo), trNode);
            }

            // 未设置 insertTo 或 通过 insertTo 未找到dom时: 使用第一个非自动创建的TD
            if (!$insertTd) {
                $insertTd = jTool(`td[${GM_CREATE}="false"]`, trNode).eq(0);
            }
            const treeDOM = document.createElement('span');
            treeDOM.setAttribute(treeKey, openState);
            treeDOM.style.width = (level + 1) * 14 + 'px';

            if (hasChildren) {
                treeDOM.innerHTML = `<i class="tree-action iconfont ${getIconClass(openState)}"></i>`;
            }
            $insertTd.prepend(treeDOM);
        });

        this.clear(gridManagerName);
    }

    /**
     * 消毁
     * @param gridManagerName
     */
    destroy(gridManagerName) {
        clearTargetEvent(eventMap[gridManagerName]);
        this.clear(gridManagerName);
    }
}

export default new Tree();
