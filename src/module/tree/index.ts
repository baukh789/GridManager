/**
 * 树结构
 */
import './style.less';
import jTool from '@jTool';
import { isUndefined, isString, each, rootDocument } from '@jTool/utils';
import { getQuerySelector, getTable, getTbody, getTh, getColTd, clearTargetEvent } from '@common/base';
import { TR_PARENT_KEY, TR_CACHE_KEY, TR_CHILDREN_STATE, GM_CREATE, PX } from '@common/constants';
import { getEvent, eventMap } from './event';
import { treeElementKey, getTreeCache, addTreeCache, clearTreeCache, getIconClass } from './tool';
import { TARGET, EVENTS, SELECTOR } from '@common/events';
import fixed from '@module/fixed';
import { JTool } from 'typings/types';

// 树配置项
interface TreeConfig {
	// 指定树展开操作按键所属容器
	insertTo?: string;

	// 层级关键字段
	treeElementKey?: string;

	// 初始打开状态
	openState?: boolean;
}

/**
 * 树功能
 * 当树功能开启后，行移动功能将失效
 * 当通栏功能开启后，树功能将失效
 */
class Tree {
    /**
     * add map
     * @param _
     * @param cacheKey
     * @param level
     * @param hasChildren
     * @param state
     */
    add(_: string, cacheKey: string, level: number, hasChildren: boolean, state: boolean): void {
        addTreeCache(_, {
            cacheKey,
            level,
			state,
            hasChildren
        });
    }

    init(_: string): void {
        const _this = this;
        // 绑定事件
        eventMap[_] = getEvent(getQuerySelector(_), treeElementKey);
        const { toggle } = eventMap[_];

        getTbody(_).addClass('tree-tbody');

        jTool(toggle[TARGET]).on(toggle[EVENTS], toggle[SELECTOR], function () {
            const $tr = jTool(this).closest('tr');
            _this.updateDOM(_, undefined, $tr);
        });
    }

    /**
     * 更新树DOM
     * @param _
     * @param state: 打开状态
     * @param $tr: 更新的tr节点，未指定时将对tbody下所有节点进行更新(对外公开方法中，不包含该参数)
     */
    updateDOM(_: string, state: boolean, $tr?: JTool): void {
        const $tbody = getTbody(_);

        const updateState = ($tr: JTool, openState: boolean): void => {
            const $treeEle = jTool(`[${treeElementKey}]`, $tr);
            const $action = jTool('i', $treeEle);
            const cacheKey = $tr.attr(TR_CACHE_KEY);
            if (isUndefined(openState)) {
                openState = !($treeEle.attr(treeElementKey) === 'true');
            }

            $action.removeClass(getIconClass(!openState));
            $action.addClass(getIconClass(openState));
            $treeEle.attr(treeElementKey, openState);

            const $childrenTr = $tbody.find(`[${TR_PARENT_KEY}="${cacheKey}"]`);
            if ($childrenTr.length === 0) {
                return;
            }
            $childrenTr.attr(TR_CHILDREN_STATE, openState);

            // 折叠时，需要将所有的子集全部折叠
            if (!openState) {
                each($childrenTr, (tr: HTMLTableRowElement) => {
                    updateState(jTool(tr), false);
                });
            }
        };

        const updateAllState = (openState: boolean): void => {
            const $treeEle = jTool(`[${treeElementKey}]`, $tbody);
            const $action = jTool('i', $treeEle);
            $action.removeClass(getIconClass(!openState));
            $action.addClass(getIconClass(openState));
            $treeEle.attr(treeElementKey, openState);
            const $childrenTr = $tbody.find(`[${TR_PARENT_KEY}]`);
            $childrenTr.attr(TR_CHILDREN_STATE, openState);
        };

        $tr ? updateState($tr, state) : updateAllState(state);

        fixed.update(_);
    }

    /**
     * 插入树事件DOM
     * @param _
     * @param config
     */
    insertDOM(_: string, config: TreeConfig) {
        const { openState, insertTo } = config;
        const $table = getTable(_);
        const parentKeyList = [];
        each(jTool(`tr[${TR_PARENT_KEY}]`, $table), (item: HTMLTableRowElement) => {
            parentKeyList.push(item.getAttribute(TR_PARENT_KEY));
        });

        const insetList = getTreeCache(_);
        if (!insetList || insetList.length === 0) {
            return;
        }

        insetList.forEach(item => {
            let { cacheKey, level, hasChildren, state } = item;
            if (isUndefined(state)) {
				state = openState;
			}

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

            // 添加层级所需空格，验证存在是在数据更新时不需要再次创建
			const treeDOM = rootDocument.createElement('span');
			treeDOM.setAttribute(treeElementKey, state + '');
			treeDOM.style.width = (level + 1) * 14 + PX;

			if (hasChildren) {
				treeDOM.innerHTML = `<i class="gm-icon ${getIconClass(state)}"></i>`;
			}
			$insertTd.prepend(treeDOM);
        });

        clearTreeCache(_);
    }

    /**
     * 消毁
     * @param _
     */
    destroy(_: string): void {
        clearTargetEvent(eventMap[_]);
        clearTreeCache(_);
    }
}

export default new Tree();
