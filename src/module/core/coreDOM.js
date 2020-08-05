import jTool from '@jTool';
import { isUndefined, isString, isObject, isElement, isValidArray, each } from '@jTool/utils';
import {
    calcLayout,
    getTable,
    getWrap,
    getTbody,
    getTh,
    getAllTh,
    getColTd,
    setAreVisible,
    getQuerySelector,
    clearTargetEvent
} from '@common/base';
import { outError } from '@common/utils';
import { TABLE_PURE_LIST, TABLE_BODY_KEY, TR_CACHE_KEY, TR_PARENT_KEY, TR_LEVEL_KEY, TR_CHILDREN_STATE, TH_NAME, ROW_CLASS_NAME, ODD, DISABLE_CUSTOMIZE } from '@common/constants';
import { resetTableData, getRowData, getSettings } from '@common/cache';
import { mergeRow } from '../merge';
import filter from '../filter';
import sort from '../sort';
import adjust from '../adjust';
import tree from '../tree';
import checkbox from '../checkbox';
import remind, { tooltip } from '../remind';
import render from './render';
import fixed from '@module/fixed';
import moveRow from '../moveRow';
import fullColumn from '../fullColumn';
import { getEvent, eventMap } from './event';
import { TARGET, EVENTS, SELECTOR } from '@common/events';
import { sendCompile, compileTd } from '@common/framework';
/**
 * core dom
 */
class Dom {
    init($table, settings) {
        const { _, width, height, supportAjaxPage, useWordBreak } = settings;
        // add wrap div
        $table.wrap(render.createWrapTpl({ settings }), '.table-div');

        // append thead
        $table.append(render.createTheadTpl({settings}));

        // 计算布局
        calcLayout(_, width, height, supportAjaxPage);

        // append tbody
        const tbody = document.createElement('tbody');
        tbody.setAttribute(TABLE_BODY_KEY, _);
        // 根据参数增加td断字标识
        if (useWordBreak) {
            tbody.setAttribute('word-break', '');
        }
        $table.append(tbody);

        // 绑定事件
        this.bindEvent(_);
    }

    /**
     * 重绘thead
     * @param settings
     */
    redrawThead(settings) {
        const { _, columnMap, sortUpText, sortDownText, supportAdjust } = settings;
        // 单个table下的TH
        const $thList = getAllTh(_);

        // 由于部分操作需要在th已经存在于dom的情况下执行, 所以存在以下循环
        // 单个TH下的上层DIV
        each($thList, item => {
            const onlyTH = jTool(item);
            const onlyThWarp = jTool('.th-wrap', onlyTH);
            const thName = onlyTH.attr(TH_NAME);
            const column = columnMap[thName];

            // 是否为GM自动添加的列
            const isAutoCol = column.isAutoCreate;

            // 嵌入表头提醒事件源
            if (!isAutoCol && column.remind) {
                onlyThWarp.append(jTool(remind.createHtml({ remind: column.remind })));
            }

            // 嵌入排序事件源
            if (!isAutoCol && isString(column.sorting)) {
                const sortingDom = jTool(sort.createHtml());

                // 依据 column.sorting 进行初始显示
                switch (column.sorting) {
                    case sortUpText:
                        sortingDom.addClass('sorting-up');
                        break;
                    case sortDownText:
                        sortingDom.addClass('sorting-down');
                        break;
                }
                onlyThWarp.append(sortingDom);
            }

            // 嵌入表头的筛选事件源
            // 插件自动生成的序号列与选择列不做事件绑定
            if (!isAutoCol && column.filter && isObject(column.filter)) {
                const filterDom = jTool(filter.createHtml({settings, columnFilter: column.filter}));
                onlyThWarp.append(filterDom);
            }

            // 嵌入宽度调整事件源,以下情况除外
            // 1.插件自动生成的选择列和序号列不做事件绑定
            // 2.禁止使用个性配置功能的列
            if (supportAdjust && !isAutoCol && !column[DISABLE_CUSTOMIZE]) {
                onlyThWarp.append(jTool(adjust.html));
            }
        });
    }

    /**
     * 重新组装table body
     * @param settings
     * @param data
     */
    renderTableBody(settings, data) {
        const {
            _,
            columnMap,
            supportTreeData,
            supportCheckbox,
            supportMoveRow,
            treeConfig,
            __isNested,
            __isFullColumn
        } = settings;

        const { treeKey, openState } = treeConfig;

        data = resetTableData(_, data);

        // tbody dom
        const tbody = getTbody(_).get(0);

        // 清空 tbody
        tbody.innerHTML = '';

        // 存储tr对像列表
        let trObjectList = [];

        // 通过index对columnMap进行排序
        const topList = [];
        const columnList = [];
        each(columnMap, (key, col) => {
            if (!col.pk) {
                topList[col.index] = col;
            }
        });

        const pushList = list => {
            each(list, col => {
                if (!isValidArray(col.children)) {
                    columnList.push(col);
                    return;
                }
                pushList(col.children);
            });
        };
        pushList(topList);

        // 插入常规的TR
        const installNormal = (trObject, row, rowIndex, isTop) => {
            // 与当前位置信息匹配的td列表

            const tdList = trObject.tdList;
            each(columnList, col => {
                const tdTemplate = col.template;

                if (col.isAutoCreate) {
                    tdList.push(tdTemplate(row[col.key], row, rowIndex, isTop));
                    return;
                }

                let { text, compileAttr } = compileTd(settings, tdTemplate, row, rowIndex, col.key);
                const alignAttr = col.align ? `align=${col.align}` : '';
                const moveRowAttr = supportMoveRow ? moveRow.addSign(col) : '';
                const useRowCheckAttr = supportCheckbox ? checkbox.addSign(col) : '';
                text = isElement(text) ? text.outerHTML : text;
                tdList.push(`<td ${compileAttr} ${alignAttr} ${moveRowAttr} ${useRowCheckAttr}>${text}</td>`);
            });
        };

        try {
            const installTr = (list, level, pIndex) => {
                const isTop = isUndefined(pIndex);
                each(list, (row, index) => {
                    const className = [];
                    const attribute = [];
                    const tdList = [];
                    const cacheKey = row[TR_CACHE_KEY];

                    // 增加行 class name
                    if (row[ROW_CLASS_NAME]) {
                        className.push(row[ROW_CLASS_NAME]);
                    }

                    // 非顶层
                    if (!isTop) {
                        attribute.push(`${TR_PARENT_KEY}="${pIndex}"`);
                        attribute.push(`${TR_CHILDREN_STATE}="${openState}"`);
                    }

                    // 顶层 且当前为树形结构
                    if (isTop && supportTreeData) {
                        // 不直接使用css odd是由于存在层级数据时无法排除折叠元素
                        index % 2 === 0 && attribute.push(ODD);
                    }

                    attribute.push(`${TR_CACHE_KEY}="${cacheKey}"`);

                    const trObject = {
                        className,
                        attribute,
                        tdList
                    };

                    // 顶层结构: 通栏-top
                    if (isTop && __isFullColumn) {
                        fullColumn.addTop(settings, row, index, trObjectList);
                    }

                    // 插入正常的TR
                    installNormal(trObject, row, index, isTop);

                    trObjectList.push(trObject);

                    // 顶层结构: 通栏-bottom
                    if (isTop && __isFullColumn) {
                        fullColumn.addBottom(settings, row, index, trObjectList);
                    }

                    // 处理层级结构
                    if (supportTreeData) {
                        const children = row[treeKey];
                        const hasChildren = children && children.length;

                        // 添加tree map
                        tree.add(_, cacheKey, level, hasChildren);

                        // 递归处理层极结构
                        if (hasChildren) {
                            installTr(children, level + 1, cacheKey);
                        }
                    }
                });
            };

            installTr(data, 0);
            let tbodyStr = '';
            trObjectList.forEach(item => {
                const { className, attribute, tdList } = item;
                let classStr = '';
                if (className.length) {
                    classStr = `class="${className.join(' ')}"`;
                }

                const attrStr = attribute.join(' ');
                const tdStr = tdList.join('');
                tbodyStr = `${tbodyStr}<tr ${classStr} ${attrStr}>${tdStr}</tr>`;
            });
            tbody.innerHTML = tbodyStr;
        } catch (e) {
            outError('render tbody error');
            console.error(e);
        }

        // 非多层嵌套初始化显示状态: 多层嵌套不支持显示、隐藏操作
        !__isNested && this.initVisible(_, columnMap);

        // 解析框架
        sendCompile(settings).then(() => {
            // 插入tree dom
            supportTreeData && tree.insertDOM(_, treeConfig);

            // 合并单元格
            mergeRow(_, columnMap);

            fixed.updateFakeThead(_);
        });
    }

    /**
     * 更新 Tr DOM
     * @param settings
     * @param updateCacheList
     */
    updateTrDOM(settings, updateCacheList) {
        const { _, columnMap, supportTreeData, treeConfig } = settings;
        const { treeKey } = treeConfig;
        updateCacheList.forEach(row => {
            const cacheKey = row[TR_CACHE_KEY];
            const level = row[TR_LEVEL_KEY];
            let index = parseInt(cacheKey.split('-').pop(), 10);

            const trNode = getTbody(_).find(`[${TR_CACHE_KEY}="${cacheKey}"]`).get(0);

            if (!trNode) {
                return;
            }

            // 添加tree map
            const children = row[treeKey];
            const hasChildren = children && children.length;
            tree.add(_, cacheKey, level, hasChildren);

            each(columnMap, (key, col) => {
                // 不处理项: 自动添加列
                if (col.isAutoCreate) {
                    return;
                }

                let tdTemplate = col.template;
                const tdNode = getColTd(getTh(_, key), trNode).get(0);

                // 不直接操作tdNode的原因: react不允许直接操作已经关联过框架的DOM
                const tdCloneNode = tdNode.cloneNode(true);

                let { text, compileAttr } = compileTd(settings, tdTemplate, row, index, key);
                text = isElement(text) ? text.outerHTML : text;
                if (compileAttr) {
                    tdCloneNode.setAttribute(compileAttr.split('=')[0], compileAttr.split('=')[1]);
                }
                tdCloneNode.innerHTML = text;
                trNode.replaceChild(tdCloneNode, tdNode);
            });
        });


        // 解析框架
        sendCompile(settings).then(() => {
            // 插入tree dom
            supportTreeData && tree.insertDOM(_, treeConfig);

            // 合并单元格
            mergeRow(_, columnMap);
        });
    }

    /**
     * 根据配置项初始化列显示|隐藏 (th 和 td)
     * @param _
     * @param columnMap
     */
    initVisible(_, columnMap) {
        each(columnMap, (key, col) => {
            setAreVisible(_, key, col.isShow);
        });
    }

    /**
     * 为新生成的table下属元素绑定事件
     * @param _
     */
    bindEvent(_) {
        const { rowHover, rowClick, cellHover, cellClick } = getSettings(_);

        eventMap[_] = getEvent(getQuerySelector(_));
        const event = eventMap[_];

        // 行事件透出参数
        const getRowParams = tr => {
            return [
                // row
                getRowData(_, tr),

                // rowIndex
                parseInt(tr.getAttribute(TR_CACHE_KEY), 10)
            ];
        };

        // 行事件: hover
        rowHover && (() => {
            let hoverTr;
            const rowHoverEvent = event.rowHover;
            jTool(rowHoverEvent[TARGET]).on(rowHoverEvent[EVENTS], rowHoverEvent[SELECTOR], function () {
                // 防止hover在同一个行内多次触发
                if (hoverTr === this) {
                    return;
                }
                hoverTr = this;
                tooltip(_, this, rowHover(...getRowParams(this)), () => {
                    hoverTr = null;
                });
            });

        })();

        // 行事件: click
        rowClick && (() => {
            const rowClickEvent = event.rowClick;
            jTool(rowClickEvent[TARGET]).on(rowClickEvent[EVENTS], rowClickEvent[SELECTOR], function () {
                tooltip(_, this, rowClick(...getRowParams(this)));
            });
        })();

        // 单元格透出参数
        const getCellParams = td => {
            const tr = td.parentNode;
            return [
                // row
                getRowData(_, tr),

                // rowIndex
                parseInt(tr.getAttribute(TR_CACHE_KEY), 10),

                // colIndex
                td.cellIndex
            ];
        };

        // 单元格事件: hover
        cellHover && (() => {
            let hoverTd;
            const cellHoverEvent = event.cellHover;
            jTool(cellHoverEvent[TARGET]).on(cellHoverEvent[EVENTS], cellHoverEvent[SELECTOR], function () {
                // 防止hover在同一个单元格内多次触发
                if (hoverTd === this) {
                    return;
                }
                hoverTd = this;
                tooltip(_, this, cellHover(...getCellParams(hoverTd)), () => {
                    hoverTd = null;
                });
            });
        })();

        // 单元格事件: click
        cellClick && (() => {
            const cellClickEvent = event.cellClick;
            jTool(cellClickEvent[TARGET]).on(cellClickEvent[EVENTS], cellClickEvent[SELECTOR], function () {
                tooltip(_, this, cellClick(...getCellParams(this)));
            });
        })();
    }

    /**
     * 消毁
     * @param _
     */
    destroy(_) {
        clearTargetEvent(eventMap[_]);

        try {
            const $table = getTable(_);
            const $tableWrap = getWrap(_);
            // DOM有可能在执行到这里时, 已经被框架中的消毁机制清除
            if (!$table.length || !$tableWrap.length) {
                return;
            }

            // 清除因为实例而修改的属性
            const table = $table.get(0);
            TABLE_PURE_LIST.forEach(item => {
                let itemProp = table['__' + item];
                itemProp ? $table.attr(item, itemProp) : $table.removeAttr(item);
                delete table['__' + item];
            });

            // 还原table
            $table.html('');
            $tableWrap.after($table);
            $tableWrap.remove();
        } catch (e) {
            // '在清除GridManager实例的过程时, table被移除'
        }
    }
}
export default new Dom();
