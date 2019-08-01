import remind from '../remind';
import order from '../order';
import jTool from '@common/jTool';
import base from '@common/base';
import { TABLE_PURE_LIST, TR_CACHE_KEY, TR_PARENT_KEY, TR_CHILDREN_STATE } from '@common/constants';
import cache from '@common/cache';
import filter from '../filter';
import sort from '../sort';
import checkbox from '../checkbox';
import adjust from '../adjust';
import tree from '../tree';
import render from './render';
import getCoreEvent from './event';
import framework from '@common/framework';
/**
 * core dom
 */
class Dom {
    eventMap = {};

    init($table, settings) {
        const { gridManagerName, width, height, supportAjaxPage } = settings;
        // add wrap div
        $table.wrap(render.createWrapTpl({ settings }), '.table-div');

        // append thead
        $table.append(render.createTheadTpl({settings}));

        // 计算布局
        base.calcLayout(gridManagerName, width, height, supportAjaxPage);

        // append tbody
        $table.append(document.createElement('tbody'));

        // 绑定事件
        this.bindEvent(gridManagerName);
    }

    /**
     * 重绘thead
     * @param settings
     */
    redrawThead(settings) {
        const { gridManagerName, columnMap, sortUpText, sortDownText, supportAdjust } = settings;
        // 单个table下的TH
        const $thList = base.getAllTh(gridManagerName);

        // 由于部分操作需要在th已经存在于dom的情况下执行, 所以存在以下循环
        // 单个TH下的上层DIV
        jTool.each($thList, (index, item) => {
            const onlyTH = jTool(item);
            const onlyThWarp = jTool('.th-wrap', onlyTH);
            const thName = onlyTH.attr('th-name');
            const column = columnMap[thName];

            // 是否为GM自动添加的列
            const isAutoCol = column.isAutoCreate;

            // 嵌入表头提醒事件源
            if (!isAutoCol && column.remind) {
                onlyThWarp.append(jTool(remind.createHtml({ remind: column.remind })));
            }

            // 嵌入排序事件源
            if (!isAutoCol && jTool.type(column.sorting) === 'string') {
                const sortingDom = jTool(sort.createHtml());

                // 依据 column.sorting 进行初始显示
                switch (column.sorting) {
                    case sortUpText:
                        sortingDom.addClass('sorting-up');
                        break;
                    case sortDownText:
                        sortingDom.addClass('sorting-down');
                        break;
                    default :
                        break;
                }
                onlyThWarp.append(sortingDom);
            }

            // 嵌入表头的筛选事件源
            // 插件自动生成的序号列与选择列不做事件绑定
            if (!isAutoCol && column.filter && jTool.type(column.filter) === 'object') {
                const filterDom = jTool(filter.createHtml({settings, columnFilter: column.filter}));
                onlyThWarp.append(filterDom);
            }

            // 嵌入宽度调整事件源,以下情况除外
            // 1.插件自动生成的选择列不做事件绑定
            // 2.禁止使用个性配置功能的列
            if (supportAdjust && !isAutoCol && !column.disableCustomize) {
                const adjustDOM = jTool(adjust.html);

                // 最后一列不支持调整宽度
                if (index === $thList.length - 1) {
                    adjustDOM.hide();
                }

                onlyThWarp.append(adjustDOM);
            }
        });

        // 更新列宽
        base.updateThWidth(settings, true);
    }

    /**
     * 重新组装table body
     * @param settings
     * @param data
     */
    renderTableBody(settings, data) {
        const {
            gridManagerName,
            rowRenderHandler,
            pageData,
            supportAutoOrder,
            supportCheckbox,
            pageSizeKey,
            currentPageKey,
            columnData,
            columnMap,
            topFullColumn,
            supportTreeData,
            treeConfig
        } = settings;

        const { treeKey, openState, insertTo } = treeConfig;
        const resetData = data => {
            return data.map((row, index) => {
                // add order
                if (supportAutoOrder) {
                    let	orderBaseNumber = 1;

                    // 验证是否存在分页数据
                    if (pageData && pageData[pageSizeKey] && pageData[currentPageKey]) {
                        orderBaseNumber = pageData[pageSizeKey] * (pageData[currentPageKey] - 1) + 1;
                    }
                    row[order.key] = orderBaseNumber + index;
                }

                // add checkbox
                if (supportCheckbox) {
                    row[checkbox.key] = cache.getCheckedData(gridManagerName).some(item => {
                        return base.equal(base.getCloneRowData(columnMap, item), base.getCloneRowData(columnMap, row));
                    });
                    row[checkbox.disabledKey] = false;
                }

                // 单行数据渲染时执行程序
                return rowRenderHandler(row, index);
            });
        };
        data = resetData(data);

        // 存储表格数据
        cache.setTableData(gridManagerName, data);
        cache.setCheckedData(gridManagerName, data);

        // tbody dom
        const _tbody = document.querySelector(`${base.getQuerySelector(gridManagerName)} tbody`);

        // 清空 tbody
        _tbody.innerHTML = '';

        // 插入通栏: top-full-column
        const installTopFull = (trNode, row, index) => {
            // 通栏tr
            const topTrNode = document.createElement('tr');
            topTrNode.setAttribute('top-full-column', 'true');

            // 通栏用于向上的间隔的tr
            const intervalTrNode = document.createElement('tr');
            intervalTrNode.setAttribute('top-full-column-interval', 'true');
            intervalTrNode.innerHTML = `<td colspan="${columnData.length}"><div></div></td>`;
            _tbody.appendChild(intervalTrNode);

            // 为非通栏tr的添加标识
            trNode.setAttribute('top-full-column', 'false');

            topTrNode.innerHTML = `<td colspan="${columnData.length}"><div class="full-column-td"></div></td>`;

            const fullColumnNode = topTrNode.querySelector('.full-column-td');
            const tdTemplate = framework.compileFullColumn(settings, fullColumnNode, row, index, topFullColumn.template);
            jTool.type(tdTemplate) === 'element' ? fullColumnNode.appendChild(tdTemplate) : fullColumnNode.innerHTML = (typeof tdTemplate === 'undefined' ? '' : tdTemplate);

            _tbody.appendChild(topTrNode);
        };

        // 插入正常的TR
        const installNormal = (trNode, row, index, isTop) => {
            // 与当前位置信息匹配的td列表
            const tdList = [];
            // td模板
            let	tdTemplate = null;
            jTool.each(columnMap, (key, col) => {
                tdTemplate = col.template;
                // 插件自带列(序号,全选) 的 templateHTML会包含, 所以需要特殊处理一下
                let tdNode = null;
                if (col.isAutoCreate) {
                    tdNode = jTool(tdTemplate(row[col.key], row, index, isTop)).get(0);
                } else {
                    tdNode = jTool('<td gm-create="false"></td>').get(0);

                    tdTemplate = framework.compileTd(settings, tdNode, tdTemplate, row, index, key);
                    jTool.type(tdTemplate) === 'element' ? tdNode.appendChild(tdTemplate) : tdNode.innerHTML = (typeof tdTemplate === 'undefined' ? '' : tdTemplate);
                }

                // td 文本对齐方向
                col.align && tdNode.setAttribute('align', col.align);

                tdList[col.index] = tdNode;
            });

            tdList.forEach(td => {
                trNode.appendChild(td);
            });

            _tbody.appendChild(trNode);
        };

        try {
            const installTr = (list, level, pIndex) => {
                const isTop = typeof pIndex === 'undefined';
                jTool.each(list, (index, row) => {
                    const trNode = document.createElement('tr');
                    let cacheKey = index;

                    // 非顶层
                    if (!isTop) {
                        trNode.setAttribute(TR_PARENT_KEY, pIndex);
                        cacheKey = `${pIndex}-${index}`;
                        trNode.setAttribute(TR_CHILDREN_STATE, openState);
                    }

                    // 顶层
                    if (isTop) {
                        index % 2 === 0 && trNode.setAttribute('odd', ''); // 不直接使用css odd是由于存在层级数据时无法排除折叠元素
                    }

                    trNode.setAttribute(TR_CACHE_KEY, cacheKey);

                    // 插入通栏: top-full-column
                    if (typeof topFullColumn.template !== 'undefined') {
                        installTopFull(trNode, row, index);
                    }

                    // 插入正常的TR
                    installNormal(trNode, row, index, isTop);

                    // 处理层级结构
                    if (supportTreeData) {
                        const children = row[treeKey];

                        // 插入tree dom
                        tree.insertDOM(gridManagerName, openState, insertTo, trNode, level, children);

                        // 递归处理层极结构
                        if (children && children.length) {
                            installTr(children, level + 1, cacheKey);
                        }
                    }
                });
            };
            installTr(data, 0);

        } catch (e) {
            base.outError('render tbody error');
        }

        this.initVisible(gridManagerName, columnMap);

        // 解析框架
        framework.send(settings);
    }

    /**
     * 根据配置项初始化列显示|隐藏 (th 和 td)
     * @param gridManagerName
     * @param columnMap
     */
    initVisible(gridManagerName, columnMap) {
        jTool.each(columnMap, (index, col) => {
            base.setAreVisible(gridManagerName, [col.key], col.isShow);
        });
    }

    /**
     * 为新增的单元格绑定事件
     * @param gridManagerName
     */
    bindEvent(gridManagerName) {
        const settings = cache.getSettings(gridManagerName);

        // 未设置该事件钩子时，不再进行事件绑定
        if (typeof settings.cellHover !== 'function') {
            return;
        }

        this.eventMap[gridManagerName] = getCoreEvent(gridManagerName, base.getQuerySelector(gridManagerName));
        const { target, events, selector } = this.eventMap[gridManagerName].tdMousemove;

        // 绑定td移入事件
        let hoverTd = null;
        jTool(target).on(events, selector, function () {
            if (hoverTd === this) {
                return;
            }
            hoverTd = this;
            const tr = hoverTd.parentNode;
            const colIndex = hoverTd.cellIndex;
            const rowIndex = parseInt(tr.getAttribute(TR_CACHE_KEY), 10);

            // cellHover: 单个td的hover事件
            settings.cellHover(cache.getRowData(gridManagerName, tr), rowIndex, colIndex);
        });
    }

    /**
     * 消毁
     * @param gridManagerName
     */
    destroy(gridManagerName) {
        base.clearBodyEvent(this.eventMap[gridManagerName]);

        try {
            const $table = base.getTable(gridManagerName);
            const $tableWrap = base.getWrap(gridManagerName);
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
