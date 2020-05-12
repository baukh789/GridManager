/**
 * 树结构
 */
import './style.less';
import jTool from '@jTool';
import { isUndefined, isString, each } from '@jTool/utils';
import { getQuerySelector, getTable, getTbody, getTh, getColTd, clearTargetEvent } from '@common/base';
import { TR_PARENT_KEY, TR_CACHE_KEY, TR_CHILDREN_STATE, GM_CREATE, PX } from '@common/constants';
import { getEvent, eventMap } from './event';
import { treeKey, getTreeCache, addTreeCache, clearTreeCache, getIconClass } from './tool';
import { TARGET, EVENTS, SELECTOR } from '@common/events';
import fixed from '@module/fixed';

class Tree {
    /**
     * add map
     * @param _
     * @param cacheKey
     * @param level
     * @param hasChildren
     */
    add(_, cacheKey, level, hasChildren) {
        addTreeCache(_, {
            cacheKey,
            level,
            hasChildren
        });
    }

    init(_) {
        const _this = this;
        // 绑定事件
        eventMap[_] = getEvent(getQuerySelector(_), treeKey);
        const { toggle } = eventMap[_];

        jTool(toggle[TARGET]).on(toggle[EVENTS], toggle[SELECTOR], function () {
            const $tr = jTool(this).closest('tr');
            _this.updateDOM(_, undefined, $tr);
        });
    }

    /**
     * 更新树DOM
     * @param _
     * @param state: 打开状态
     * @param $tr: 更新的tr节点，未指定时将对tbody下所有节点进行更新(对外公开方法中，不包含开参数)
     */
    updateDOM(_, state, $tr) {
        const $tbody = getTbody(_);

        const updateState = ($tr, openState) => {
            const $treeEle = jTool(`[${treeKey}]`, $tr);
            const $action = jTool('i', $treeEle);
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
                each($childrenTr, tr => {
                    updateState(jTool(tr), false);
                });
            }
        };

        const updateAllState = openState => {
            const $treeEle = jTool(`[${treeKey}]`, $tbody);
            const $action = jTool('i', $treeEle);
            $action.removeClass(getIconClass(!openState));
            $action.addClass(getIconClass(openState));
            $treeEle.attr(treeKey, openState);
            const $childrenTr = $tbody.find(`[${TR_PARENT_KEY}]`);
            $childrenTr.attr(TR_CHILDREN_STATE, openState);
        };

        $tr ? updateState($tr, state) : updateAllState(state);

        fixed.updateFakeThead(_);
    }

    /**
     * 插入树事件DOM
     * @param _
     * @param config
     */
    insertDOM(_, config) {
        const { openState, insertTo } = config;
        const $table = getTable(_);
        const parentKeyList = [];
        each(jTool(`tr[${TR_PARENT_KEY}]`, $table), item => {
            parentKeyList.push(item.getAttribute(TR_PARENT_KEY));
        });

        const insetList = getTreeCache(_);
        if (!insetList || insetList.length === 0) {
            return;
        }

        insetList.forEach(item => {
            const { cacheKey, level, hasChildren } = item;

            const $trNode = jTool(`tr[${TR_CACHE_KEY}="${cacheKey}"]`, $table);

            // 第一个非自动创建 且 可视的td
            let $insertTd;
            if (isString(insertTo)) {
                $insertTd = getColTd(getTh(_, insertTo), $trNode);
            }

            // 未设置 insertTo 或 通过 insertTo 未找到dom时: 使用第一个非自动创建的TD
            if (!$insertTd) {
                $insertTd = jTool(`td:not([${GM_CREATE}])`, $trNode).eq(0);
            }
            const treeDOM = document.createElement('span');
            treeDOM.setAttribute(treeKey, openState);
            treeDOM.style.width = (level + 1) * 14 + PX;

            if (hasChildren) {
                treeDOM.innerHTML = `<i class="gm-icon ${getIconClass(openState)}"></i>`;
            }
            $insertTd.prepend(treeDOM);
        });

        clearTreeCache(_);
    }

    /**
     * 消毁
     * @param _
     */
    destroy(_) {
        clearTargetEvent(eventMap[_]);
        clearTreeCache(_);
    }
}

export default new Tree();
