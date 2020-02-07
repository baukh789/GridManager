import './style.less';
import jTool from '@jTool';
import { each, isUndefined, isFunction, isString } from '@jTool/utils';
import { equal } from '@common/utils';
import { getTable, getTbody, getQuerySelector, getWrap, getDiv, clearTargetEvent, getCloneRowData } from '@common/base';
import { getTableData, setTableData, getSettings, getCheckedData, setCheckedData } from '@common/cache';
import { parseTpl } from '@common/parse';
import { mergeRow, clearMergeRow } from '../merge';
import { TR_CACHE_KEY, NO_SELECT_CLASS_NAME, ODD } from '@common/constants';
import dreamlandTpl from './dreamland.tpl.html';
import { getEvent, eventMap } from './event';
import { CLASS_DRAG_ING, CLASS_DREAMLAND, DISABLE_MOVE } from './constants';
import { coreDOM } from '../core';

/**
 * 更新移动
 * @param gridManagerName
 * @param key
 * @param $tbody
 * @param $dreamlandDIV
 * @param $prevTr
 * @param $nextTr
 * @param $tr
 * @param tableData
 */
const update = (gridManagerName, key, $tbody, $dreamlandDIV, $prevTr, $nextTr, $tr, tableData) => {
    const oldCacheKey = $tr.attr(TR_CACHE_KEY);
    let $target = null;
    // 处理向上移动
    if ($prevTr && $dreamlandDIV.offset().top < $prevTr.offset().top) {
        $prevTr.before($tr);

        $target = $prevTr;
    }

    // 处理向下移动
    if ($nextTr && $dreamlandDIV.offset().top + $dreamlandDIV.height() / 2 > $nextTr.offset().top) {
        $nextTr.after($tr);
        $target = $nextTr;
    }

    // 当前为有效移动
    if ($target) {
        const targetCacheKey = $target.attr(TR_CACHE_KEY);

        // 替换数据唯一标识
        $target.attr(TR_CACHE_KEY, oldCacheKey);
        $tr.attr(TR_CACHE_KEY, targetCacheKey);

        // 替换数据
        const oldCache = tableData[oldCacheKey];
        const targetCache = tableData[targetCacheKey];
        oldCache[TR_CACHE_KEY] = targetCacheKey;
        targetCache[TR_CACHE_KEY] = oldCacheKey;

        // 当前未配置行排序字段时，仅处理前端展示，而不更新数据
        if (isString(key)) {
            const oldKey = oldCache[key];
            const targetKey = targetCache[key];
            oldCache[key] = targetKey;
            targetCache[key] = oldKey;
        }
        tableData[oldCacheKey] = targetCache;
        tableData[targetCacheKey] = oldCache;


        // 替换odd, todo 这里使用odd是对树级的兼容，具体代码在coreDOM.js内。 行移动功能与树功能是冲突的，后续需要调整odd
        const targetOdd = $target.attr(ODD);
        const trOdd = $tr.attr(ODD);
        isUndefined(targetOdd) ? $tr.removeAttr(ODD) : $tr.attr(ODD, '');
        isUndefined(trOdd) ? $target.removeAttr(ODD) : $target.attr(ODD, '');
    }
    // 返回更新后的tr列表
    return jTool('tr', $tbody);
};

/**
 * 将移动后的字段更新合并至已选中存储
 * @param gridManagerName
 * @param supportCheckbox
 * @param key
 * @param columnMap
 * @param changeList
 */
const mergeToCheckedData = (gridManagerName, supportCheckbox, key, columnMap, changeList) => {
    if (!supportCheckbox || !isString(key)) {
        return;
    }

    const checkedData = getCheckedData(gridManagerName);

    if (checkedData.length === 0) {
        return;
    }

    checkedData.forEach(checked => {
        changeList.forEach(change => {
            if (equal(getCloneRowData(columnMap, checked, [key]), getCloneRowData(columnMap, change, [key]))) {
                checked[key] = change[key];
            }
        });
    });

    setCheckedData(gridManagerName, checkedData, true);
};

class MoveRow {
    init(gridManagerName) {
        const _this = this;
        const { supportAutoOrder, supportCheckbox, moveRowConfig, animateTime, columnMap } = getSettings(gridManagerName);
        const { key, handler } = moveRowConfig;

        const $body = jTool('body');
        const table = getTable(gridManagerName).get(0);
        eventMap[gridManagerName] = getEvent(`${getQuerySelector(gridManagerName)} tbody`);
        const { dragStart, dragging, dragAbort } = eventMap[gridManagerName];

        const $tbody = getTbody(gridManagerName);

        const $tableWrap = getWrap(gridManagerName);
        const tableDiv = getDiv(gridManagerName).get(0);

        $tbody.addClass('move-row');

        let oldData = null;
        // 事件: 行移动触发
        jTool(dragStart.target).on(dragStart.events, dragStart.selector, function (e) {
            // 当前事件源为模板内节点
            if (e.target.nodeName !== 'TD') {
                return;
            }

            // 当前事件源所在的列为禁止触发移动的列
            if (isString(e.target.getAttribute(DISABLE_MOVE))) {
                return;
            }
            const tr = this;
            const $tr = jTool(tr);
            let $allTr = jTool('tr', $tbody);

            // 禁用文字选中效果
            $body.addClass(NO_SELECT_CLASS_NAME);

            // 增加移动中样式
            $tr.addClass(CLASS_DRAG_ING);

            const tableData = getTableData(gridManagerName);
            oldData = [...tableData];

            let $dreamlandDIV = jTool(`.${CLASS_DREAMLAND}`, $tableWrap);

            // 防止频繁触发事件
            if ($dreamlandDIV.length) {
                return;
            }
            $tableWrap.append(`<div class="${CLASS_DREAMLAND}"></div>`);
            $dreamlandDIV = jTool(`.${CLASS_DREAMLAND}`, $tableWrap);

            // 先清除再添加合并列，是为了达到mousedown时可以获取到一个完整的且列可对齐的行
            clearMergeRow(gridManagerName);
            $dreamlandDIV.get(0).innerHTML = _this.createDreamlandHtml({ table, tr });

            mergeRow(gridManagerName, columnMap);
            clearMergeRow(gridManagerName, $dreamlandDIV);

            let trIndex = 0;
            // 事件: 行移动进行中
            jTool(dragging.target).off(dragging.events);
            jTool(dragging.target).on(dragging.events, function (e2) {
                trIndex = $tr.index();

                // 事件源的上一个tr
                let $prevTr = null;

                // 当前移动的非第一列
                if (trIndex > 0) {
                    $prevTr = $allTr.eq(trIndex - 1);
                }

                // 事件源的下一个th
                let $nextTr = null;

                // 当前移动的非最后一列
                if (trIndex < $allTr.length - 1) {
                    $nextTr = $allTr.eq(trIndex + 1);
                }

                $dreamlandDIV.show().css({
                    width: tr.offsetWidth,
                    height: tr.offsetHeight + 2, // 2为$dreamlandDIV的边框宽度
                    top: e2.clientY - $tableWrap.offset().top + window.pageYOffset - $dreamlandDIV.height() / 2,
                    left: 0 - tableDiv.scrollLeft
                });

                $allTr = update(gridManagerName, key, $tbody, $dreamlandDIV, $prevTr, $nextTr, $tr, tableData);

                // 合并行数据相同的单元格
                mergeRow(gridManagerName, columnMap);
            });

            // 事件: 行移动结束
            jTool(dragAbort.target).off(dragAbort.events);
            jTool(dragAbort.target).on(dragAbort.events, function () {
                jTool(dragging.target).off(dragging.events);
                jTool(dragAbort.target).off(dragAbort.events);

                $dreamlandDIV.animate({
                    top: `${tr.offsetTop - tableDiv.scrollTop}px`
                }, animateTime, () => {
                    $tr.removeClass(CLASS_DRAG_ING);
                    $dreamlandDIV.remove();
                });

                // 存储表格数据
                setTableData(gridManagerName, tableData);

                // 更新序号
                if (supportAutoOrder) {
                    const $orderDOM = jTool('[gm-order]', $allTr);
                    const orderList = [];
                    each($orderDOM, (index, order) => {
                        orderList.push(parseInt(order.innerText, 10));
                    });
                    orderList.sort((a, b) => a - b);
                    each($orderDOM, (index, order) => {
                        order.innerText = orderList[index];
                    });
                }

                // 合并行数据相同的单元格
                mergeRow(gridManagerName, columnMap);

                // 遍历被修改的项
                const changeList = tableData.filter((item, index) => {
                    return !equal(item, oldData[index]);
                });
                isFunction(handler) && handler(changeList, tableData);

                // 更新变更项DOM
                coreDOM.updateTrDOM(getSettings(gridManagerName), changeList);

                // 将更新后的数据合并至已选中存储器
                mergeToCheckedData(gridManagerName, supportCheckbox, key, columnMap, changeList);

                // 开启文字选中效果
                $body.removeClass(NO_SELECT_CLASS_NAME);
            });
        });
    }

    /**
     * 增加行移动标识
     * @param td
     * @param col
     */
    addSign(td, col) {
        col.disableMoveRow && td.setAttribute(DISABLE_MOVE, '');
    }

    /**
     * 生成拖拽区域html片段
     * @param params
     * @returns {parseData}
     */
    @parseTpl(dreamlandTpl)
    createDreamlandHtml(params) {
        const { table, tr } = params;
        const cloneTr = tr.cloneNode(true);

        const cloneTd = cloneTr.querySelectorAll('td');
        each(jTool('td', tr), (index, td) => {
            cloneTd[index].width = jTool(td).width();
        });

        return {
            tableClassName: table.className,
            tbodyHtml: cloneTr.outerHTML
        };
    }

    /**
     * 消毁
     * @param gridManagerName
     */
    destroy(gridManagerName) {
        clearTargetEvent(eventMap[gridManagerName]);
    }
}

export default new MoveRow();
