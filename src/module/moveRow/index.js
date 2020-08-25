import './style.less';
import jTool from '@jTool';
import { each, isFunction, isString, getStyle } from '@jTool/utils';
import { equal } from '@common/utils';
import { getTable, getTbody, getQuerySelector, getWrap, getDiv, clearTargetEvent, getCloneRowData } from '@common/base';
import { getTableData, setTableData, getSettings, getCheckedData, setCheckedData } from '@common/cache';
import { parseTpl } from '@common/parse';
import { mergeRow, clearMergeRow } from '../merge';
import { TR_CACHE_KEY, NO_SELECT_CLASS_NAME, PX } from '@common/constants';
import dreamlandTpl from './dreamland.tpl.html';
import { getEvent, eventMap } from './event';
import { CLASS_DRAG_ING, CLASS_DREAMLAND, DISABLE_MOVE } from './constants';
import { coreDOM } from '../core';
import { TARGET, EVENTS, SELECTOR } from '@common/events';

/**
 * 更新移动
 * @param _
 * @param key
 * @param $tbody
 * @param $dreamlandDIV
 * @param $prevTr
 * @param $nextTr
 * @param $tr
 * @param tableData
 */
const update = (_, key, $tbody, $dreamlandDIV, $prevTr, $nextTr, $tr, tableData) => {
    const oldCacheKey = $tr.attr(TR_CACHE_KEY);
    let $target;
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
    }
    // 返回更新后的tr列表
    return jTool('tr', $tbody);
};

/**
 * 将移动后的字段更新合并至已选中存储
 * @param _
 * @param checkboxKey
 * @param key
 * @param columnMap
 * @param changeList
 */
const mergeToCheckedData = (_, checkboxKey, key, columnMap, changeList) => {
    if (!isString(key)) {
        return;
    }

    const checkedData = getCheckedData(_);

    if (!checkedData.length) {
        return;
    }

    checkedData.forEach(checked => {
        changeList.forEach(change => {
            if (equal(getCloneRowData(columnMap, checked, [key]), getCloneRowData(columnMap, change, [key]), checkboxKey)) {
                checked[key] = change[key];
            }
        });
    });

    setCheckedData(_, checkedData, true);
};

class MoveRow {
    init(_) {
        const _this = this;
        const { supportAutoOrder, supportCheckbox, checkboxConfig, moveRowConfig, animateTime, columnMap } = getSettings(_);
        const { key, handler } = moveRowConfig;

        const $body = jTool('body');
        const table = getTable(_).get(0);
        eventMap[_] = getEvent(`${getQuerySelector(_)} tbody`);
        const { start, doing, abort } = eventMap[_];

        const $tbody = getTbody(_);

        const $tableWrap = getWrap(_);
        const tableDiv = getDiv(_).get(0);

        $tbody.addClass('move-row');

        let oldData;
        // 事件: 行移动触发
        jTool(start[TARGET]).on(start[EVENTS], start[SELECTOR], function (e) {
            // 不用e.button的原因: 1.兼容问题, 2.buttons可以在同时按下左键与其它键时依旧跳出
            if (e.buttons !== 1) {
                return;
            }
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

            const tableData = getTableData(_);
            oldData = [...tableData];

            let $dreamlandDIV = jTool(`.${CLASS_DREAMLAND}`, $tableWrap);

            // 防止频繁触发事件
            if ($dreamlandDIV.length) {
                return;
            }
            $tableWrap.append(`<div class="${CLASS_DREAMLAND}"></div>`);
            $dreamlandDIV = jTool(`.${CLASS_DREAMLAND}`, $tableWrap);

            // 先清除再添加合并列，是为了达到mousedown时可以获取到一个完整的且列可对齐的行
            clearMergeRow(_);
            $dreamlandDIV.get(0).innerHTML = _this.createHtml({ table, tr });

            mergeRow(_, columnMap);
            clearMergeRow(_, $dreamlandDIV);

            let trIndex = 0;
            // 事件: 行移动进行中
            const $doing = jTool(doing[TARGET]);
            const doingEvents = doing[EVENTS];
            $doing.off(doingEvents);
            $doing.on(doingEvents, function (e2) {
                trIndex = $tr.index();

                // 事件源的上一个tr
                let $prevTr;

                // 当前移动的非第一列
                if (trIndex > 0) {
                    $prevTr = $allTr.eq(trIndex - 1);
                }

                // 事件源的下一个th
                let $nextTr;

                // 当前移动的非最后一列
                if (trIndex < $allTr.length - 1) {
                    $nextTr = $allTr.eq(trIndex + 1);
                }

                $dreamlandDIV.show().css({
                    // width: tr.offsetWidth,
                    // height: tr.offsetHeight + 2, // 2为$dreamlandDIV的边框宽度
                    top: e2.clientY - $tableWrap.offset().top + pageYOffset - $dreamlandDIV.height() / 2,
                    left: 0 - tableDiv.scrollLeft
                });

                $allTr = update(_, key, $tbody, $dreamlandDIV, $prevTr, $nextTr, $tr, tableData);

                // 合并行数据相同的单元格
                mergeRow(_, columnMap);
            });

            // 事件: 行移动结束
            const $abort = jTool(abort[TARGET]);
            const abortEvents = abort[EVENTS];
            $abort.off(abortEvents);
            $abort.on(abortEvents, function () {
                $doing.off(doingEvents);
                $abort.off(abortEvents);

                $dreamlandDIV.animate({
                    top: `${tr.offsetTop - tableDiv.scrollTop + PX}`
                }, animateTime, () => {
                    $tr.removeClass(CLASS_DRAG_ING);
                    $dreamlandDIV.remove();
                });

                // 存储表格数据
                setTableData(_, tableData);

                // 更新序号
                if (supportAutoOrder) {
                    const $orderDOM = jTool('[gm-order]', $allTr);
                    const orderList = [];
                    each($orderDOM, order => {
                        orderList.push(parseInt(order.innerText, 10));
                    });
                    orderList.sort((a, b) => a - b);
                    each($orderDOM, (order, index) => {
                        order.innerText = orderList[index];
                    });
                }

                // 合并行数据相同的单元格
                mergeRow(_, columnMap);

                // 遍历被修改的项
                const changeList = tableData.filter((item, index) => {
                    return !equal(item, oldData[index]);
                });
                isFunction(handler) && handler(changeList, tableData);

                // 更新变更项DOM
                coreDOM.updateTrDOM(getSettings(_), changeList);

                // 将更新后的数据合并至已选中存储器
                supportCheckbox && mergeToCheckedData(_, checkboxConfig.key, key, columnMap, changeList);

                // 开启文字选中效果
                $body.removeClass(NO_SELECT_CLASS_NAME);
            });
        });
    }

    /**
     * 增加行移动标识
     * @param col
     */
    addSign(col) {
        return col.disableMoveRow ? DISABLE_MOVE : '';
    }

    /**
     * 生成拖拽区域html片段
     * @param params
     * @returns htmlStr
     */
    @parseTpl(dreamlandTpl)
    createHtml(params) {
        const { table, tr } = params;
        const cloneTr = tr.cloneNode(true);
        cloneTr.style.height = getStyle(tr, 'height');

        const cloneTd = cloneTr.querySelectorAll('td');
        each(jTool('td', tr), (td, index) => {
            cloneTd[index].width = jTool(td).width() || 0;
        });
        return {
            class: table.className,
            tbody: cloneTr.outerHTML
        };
    }

    /**
     * 消毁
     * @param _
     */
    destroy(_) {
        clearTargetEvent(eventMap[_]);
    }
}

export default new MoveRow();
