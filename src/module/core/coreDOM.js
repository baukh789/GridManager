import remind from '../remind';
import order from '../order';
import jTool from '@common/jTool';
import base from '@common/base';
import cache from '@common/cache';
import filter from '../filter';
import sort from '../sort';
// import fixed from '../fixed';
import checkbox from '../checkbox';
import adjust from '../adjust';
import render from './render';
/**
 * core dom
 */
class Dom {
    init($table, settings) {
        // add wrap div
        $table.wrap(render.createWrapTpl({ settings }), '.table-div');

        // 计算布局
        base.calcLayout($table, settings.width, settings.height, settings.supportAjaxPage);

        // append thead
        $table.append(render.createTheadTpl({settings}));

        // append tbody
        $table.append(document.createElement('tbody'));

        // TODO 定位效果下个版本进行开发
        // fixed.init($table, settings);
    }

    /**
     * 重绘thead
     * @param $table
     * @param $tableWarp
     * @param $thList
     * @param settings
     */
    redrawThead($table, $tableWarp, $thList, settings) {
        // 由于部分操作需要在th已经存在于dom的情况下执行, 所以存在以下循环
        // 单个TH下的上层DIV
        jTool.each($thList, (index, item) => {
            let onlyTH = jTool(item);
            const onlyThWarp = jTool('.th-wrap', onlyTH);
            const thName = onlyTH.attr('th-name');
            const onlyThText = onlyTH.text();
            const column = settings.columnMap[thName];

            // 是否为GM自动添加的列
            const isAutoCol = column.isAutoCreate;

            // 嵌入表头提醒事件源
            // 插件自动生成的序号与选择列不做事件绑定
            if (!isAutoCol && jTool.type(column.remind) === 'string') {
                onlyThWarp.append(jTool(remind.createHtml(onlyThText, column.remind)));
            }

            // 嵌入排序事件源
            // 插件自动生成的序号列与选择列不做事件绑定
            // 排序类型
            if (!isAutoCol && jTool.type(column.sorting) === 'string') {
                const sortingDom = jTool(sort.createHtml());

                // 依据 column.sorting 进行初始显示
                switch (column.sorting) {
                    case settings.sortUpText:
                        sortingDom.addClass('sorting-up');
                        break;
                    case settings.sortDownText:
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
                const filterDom = jTool(filter.createHtml({settings, columnFilter: column.filter, $tableWarp}));
                onlyThWarp.append(filterDom);
            }

            // 嵌入宽度调整事件源,以下情况除外
            // 1.插件自动生成的选择列不做事件绑定
            // 2.禁止使用个性配置功能的列
            if (settings.supportAdjust && !isAutoCol && !column.disableCustomize) {
                const adjustDOM = jTool(adjust.html);

                // 最后一列不支持调整宽度
                if (index === $thList.length - 1) {
                    adjustDOM.hide();
                }

                onlyThWarp.append(adjustDOM);
            }
        });

        // 更新列宽
        base.updateThWidth($table, settings, true);
    }

    /**
     * 重新组装table body
     * @param $table
     * @param settings
     * @param data
     */
    renderTableBody($table, settings, data) {
        // td模板
        let	tdTemplate = null;

        // add order
        if (settings.supportAutoOrder) {
            let _pageData = settings.pageData;
            let	_orderBaseNumber = 1;

            // 验证是否存在分页数据
            if (_pageData && _pageData[settings.pageSizeKey] && _pageData[settings.currentPageKey]) {
                _orderBaseNumber = _pageData[settings.pageSizeKey] * (_pageData[settings.currentPageKey] - 1) + 1;
            }
            data = data.map((item, index) => {
                item[order.key] = _orderBaseNumber + index;
                return item;
            });
        }

        // add checkbox
        if (settings.supportCheckbox) {
            const checkedData = cache.getCheckedData($table);
            data = data.map(rowData => {
                let checked = checkedData.some(item => {
                    let cloneRow = base.getDataForColumnMap(settings.columnMap, item);
                    let cloneItem = base.getDataForColumnMap(settings.columnMap, rowData);
                    return base.equal(cloneRow, cloneItem);
                });
                rowData[checkbox.key] = checked || Boolean(rowData[checkbox.key]);
                return rowData;
            });
            cache.setCheckedData($table, data);
        }

        // 存储表格数据
        cache.setTableData($table, data);

        // tbody dom
        const _tbody = jTool('tbody', $table).get(0);

        // 清空 tbody
        _tbody.innerHTML = '';

        // 组装 tbody
        const compileList = []; // 需要通过框架解析td数据
        try {
            jTool.each(data, (index, row) => {
                const trNode = document.createElement('tr');
                trNode.setAttribute('cache-key', index);

                // 插入通栏: top-full-column
                if (typeof settings.topFullColumn.template !== 'undefined') {
                    // 通栏tr
                    const topTrNode = document.createElement('tr');
                    topTrNode.setAttribute('top-full-column', 'true');

                    // 通栏用于向上的间隔的tr
                    const intervalTrNode = document.createElement('tr');
                    intervalTrNode.setAttribute('top-full-column-interval', 'true');
                    intervalTrNode.innerHTML = `<td colspan="${settings.columnData.length}"><div></div></td>`;
                    _tbody.appendChild(intervalTrNode);

                    // 为非通栏tr的添加标识
                    trNode.setAttribute('top-full-column', 'false');

                    let _template = settings.topFullColumn.template;
                    _template = typeof _template === 'function' ? _template(row) : _template;

                    topTrNode.innerHTML = `<td colspan="${settings.columnData.length}"><div class="full-column-td">${_template}</div></td>`;
                    compileList.push({el: topTrNode, row: row, index: index});
                    _tbody.appendChild(topTrNode);
                }

                // 与当前位置信息匹配的td列表
                const tdList = [];
                jTool.each(settings.columnMap, (key, col) => {
                    tdTemplate = col.template;
                    // td 模板
                    tdTemplate = typeof tdTemplate === 'function' ? tdTemplate(row[col.key], row, index) : (typeof tdTemplate === 'string' ? tdTemplate : row[col.key]);

                    // 插件自带列(序号,全选) 的 templateHTML会包含, 所以需要特殊处理一下
                    let tdNode = null;
                    if (col.isAutoCreate) {
                        tdNode = jTool(tdTemplate).get(0);
                    } else {
                        tdNode = jTool('<td gm-create="false"></td>').get(0);
                        jTool.type(tdTemplate) === 'element' ? tdNode.appendChild(tdTemplate) : tdNode.innerHTML = (typeof tdTemplate === 'undefined' ? '' : tdTemplate);
                    }

                    // td 文本对齐方向
                    col.align && tdNode.setAttribute('align', col.align);

                    tdList[col.index] = tdNode;
                });

                tdList.forEach(td => {
                    trNode.appendChild(td);
                });

                compileList.push({el: trNode, row: row, index: index});

                _tbody.appendChild(trNode);
            });
        } catch (e) {
            base.outLog(e, 'error');
        }
        // 为新生成的tbody 的内容绑定 gm-事件
        this.bindEvent($table);

        this.initVisible($table, settings.columnMap);

        // 解析框架
        base.compileFramework(settings, compileList);
    }

    /**
     * 为新增的单元格绑定事件
     * @param $table
     */
    bindEvent($table) {
        jTool('[gm-click]', $table).unbind('click');
        jTool('[gm-click]', $table).bind('click', function () {
            const row = cache.getRowData($table, this.parentNode.parentNode);
            const scope = cache.getScope($table) || window;
            const fun = scope[this.getAttribute('gm-click')];
            typeof fun === 'function' && fun.call(scope, row);
        });
    }

    /**
     * 根据配置项初始化列显示|隐藏 (th 和 td)
     * @param columnMap
     */
    initVisible($table, columnMap) {
        jTool.each(columnMap, (index, col) => {
            base.setAreVisible($table, [col.key], col.isShow);
        });
    }
}
export default new Dom();
