import jTool from './jTool';
import {FAKE_TABLE_HEAD_KEY, TABLE_HEAD_KEY, TABLE_KEY} from './constants';

class Base{

    // 定时器: 等待容器可用, 在core.js中使用
    SIV_waitContainerAvailable = {};

    // 定时器: 等待表格可用，在index.js中使用
    SIV_waitTableAvailable = {};


    /**
     * 输出日志
     * @param msg 输出文本
     * @param type 输出分类[info,warn,error]
     * @returns {*}
     */
    outLog(msg, type) {
        switch (type) {
            case 'info':
                console.log(`%c GridManager Info %c ${msg} `, ...CONSOLE_STYLE.INFO);
                break;
            case 'warn':
                console.log(`%c GridManager Warn %c ${msg} `, ...CONSOLE_STYLE.WARN);
                break;
            case 'error':
                console.log(`%c GridManager Error %c ${msg} `, ...CONSOLE_STYLE.ERROR);
                break;
            default:
                console.log(`%c GridManager Log %c ${msg} `, ...CONSOLE_STYLE.INFO);
                break;
        }
    }

    /**
     * 验证两个Object是否相同
     * @param obj1
     * @param obj2
     * @returns {boolean}
     */
    equal(obj1, obj2) {
        return JSON.stringify(obj1) === JSON.stringify(obj2);
    }

    /**
     * 获取与ColumnMap匹配的clone数据
     * @param columnMap
     * @param obj
     */
    getDataForColumnMap(columnMap, obj) {
        let cloneObj = jTool.extend(true, {}, obj);
        let cloneData = {};
        for (let key in columnMap) {
            if (!columnMap[key].isAutoCreate) {
                cloneData[key] = cloneObj[key];
            }
        }
        return cloneData;
    }

    /**
     * 获取Array中Object的索引
     * @param arr
     * @param obj
     * @returns {number}
     */
    getObjectIndexToArray(arr, obj) {
        let index = -1;
        let isInclude = false;
        arr.some((item, i) => {
            isInclude = this.equal(item, obj);
            if (isInclude) {
                index = i;
            }
            return this.equal(item, obj);
        });
        return index;
    }

    /**
     * 显示加载中动画
     * @param $dom 加载动画的容器
     * @param loadingTemplate
     * @param cb 回调函数
     */
    showLoading($dom, loadingTemplate, cb) {
        if (!$dom || $dom.length === 0) {
            return false;
        }
        const loading = $dom.find('.gm-load-area');
        if (loading.length > 0) {
            loading.remove();
        }

        const loadingDom = jTool(loadingTemplate);
        loadingDom.addClass('gm-load-area');
        $dom.append(loadingDom);
        window.setTimeout(() => {
            typeof cb === 'function' ? cb() : '';
        }, 100);

        return true;
    }

    /**
     * clone 对象, 对 JSON.stringify 存在丢失的类型(如function)不作处理。因为GM中不存在这种情况
     * @param object
     * @returns {any}
     */
    cloneObject(object) {
        return JSON.parse(JSON.stringify(object));
    }

    /**
     * 根据不同的框架解析指定节点
     * @param settings:
     * @param compile: 将要解析的节点, 对象或对象数组
     * @returns {promise}
     */
    async compileFramework(settings, compile) {
        try {
            const compileList = Array.isArray(compile) ? compile : [compile];

            // 解析框架: Vue
            if (typeof settings.compileVue === 'function' && compileList.length > 0) {
                await settings.compileVue(compileList);
            }

            // 解析框架: Angular 1.x
            if (typeof settings.compileAngularjs === 'function' && compileList.length > 0) {
                await settings.compileAngularjs(compileList);
            }

            // 解析框架: React
            // ...
        } catch (err) {
            this.outLog(`框架模板解析异常。${err}`, 'error');
        }
    }

    /**
     * 表格唯一key
     * @returns {string}
     */
    get key() {
        return TABLE_KEY;
    }

    /**
     * 获取表头所使用的attr
     * @returns {string}
     */
    get tableHeadKey() {
        return TABLE_HEAD_KEY;
    }

    /**
     * 获取表头吸顶所使用的attr
     * @returns {string}
     */
    get fakeTableHeadKey() {
        return FAKE_TABLE_HEAD_KEY;
    }

    /**
     * 获取表的GM 唯一标识
     * @param $table
     * @returns {*|string}
     */
    getKey($table) {
        return $table.attr(this.key) || '';
    }
    /**
     * get table
     * @param $dom: 父级或子级jTool对象，或者是gridManagerName
     * @param noParent: 是否为非父级元素查找，如果不是将从下向上查找
     * @returns {*}
     */
    getTable($dom, noParent) {
        if (typeof $dom === 'string') {
            return jTool(`table[${this.key}="${$dom}"]`);
        }
        return noParent ? $dom.closest(`table[${this.key}]`) : jTool(`table[${this.key}]`, $dom);
    }

    /**
     * get table head
     * @param $table
     * @returns {*}
     */
    getHead($table) {
        return jTool(`thead[${this.tableHeadKey}]`, $table);
    }

    /**
     * get fake head
     * @param $table
     * @returns {*}
     */
    getFakeHead($table) {
        return jTool(`thead[${this.fakeTableHeadKey}]`, $table);
    }

    /**
     * get head tr
     * @param $table
     * @returns {*}
     */
    getHeadTr($table) {
        return jTool(`thead[${this.tableHeadKey}] tr`, $table);
    }

    /**
     * get fake head tr
     * @param $table
     * @returns {*}
     */
    getFakeHeadTr($table) {
        return jTool(`thead[${this.tableHeadKey}] tr`, $table);
    }

    /**
     * get head th
     * @param $table
     * @param thName: 1.thName 2.jTool object
     * @returns {*}
     */
    getTh($table, thName) {
        // jTool object
        if (thName.jTool === true) {
            thName = this.getThName(thName);
        }
        return jTool(`thead[${this.tableHeadKey}] th[th-name="${thName}"]`, $table);
    }

    /**
     * get all th
     * @param $table
     * @returns {*}
     */
    getAllTh($table) {
        return jTool(`thead[${this.tableHeadKey}] th`, $table);
    }

    /**
     * get visible th
     * @param $table
     * @param isGmCreate
     * @returns {*}
     */
    getVisibleTh($table, isGmCreate) {
        let gmCreateStr = '';
        switch (isGmCreate) {
            case true: {
                gmCreateStr = '[gm-create="true"]';
                break;
            }
            case false: {
                gmCreateStr = '[gm-create="false"]';
                break;
            }
            default: {
                gmCreateStr = '';
                break
            }
        }
        return jTool(`thead[${this.tableHeadKey}] th[th-visible="visible"]${gmCreateStr}`, $table);
    }

    /**
     * get fake all th
     * @returns {*}
     */
    getFakeAllTh() {
        return jTool(`thead[${this.fakeTableHeadKey}] th`, $table);
    }

    /**
     * get fake th
     * @param $table
     * @param thName
     * @returns {*}
     */
    getFakeTh($table, thName) {
        return jTool(`thead[${this.fakeTableHeadKey}] th[th-name="${thName}"]`, $table);
    }

    /**
     * get fake visible th
     * @param $table
     * @returns {*}
     */
    getFakeVisibleTh($table) {
        return jTool(`thead[${this.fakeTableHeadKey}] th[th-visible="visible"]`, $table);
    }

    /**
     * get th name
     * @param $th
     * @returns {*}
     */
    getThName($th) {
        return $th.attr('th-name');
    }

    /**
     * 获取数据为空时的html
     * @param visibleNum: 可视状态TH的数据
     * @param emptyTemplate: 自定义的为空显示模版
     * @returns {string}
     */
    getEmptyHtml(visibleNum, emptyTemplate) {
        return `<tr emptyTemplate>
					<td colspan="${visibleNum || 1}">
					${emptyTemplate || ''}
					</td>
				</tr>`;
    }

    /**
     * 更新数据为空显示DOM所占的列数
     * @param $table
     */
    updateEmptyCol($table) {
        const emptyDOM = jTool('tbody tr[emptyTemplate]', $table);
        if (emptyDOM.length === 0) {
            return;
        }
        const visibleNum = this.getVisibleTh($table).length;
        jTool('td', emptyDOM).attr('colspan', visibleNum);
    }

    /**
     * 获取同列的 td jTool 对象
     * @param $dom: $th 或 $td
     * @returns {*|HTMLElement|jTool}
     */
    getColTd($dom) {
        const $table = this.getTable($dom, true);
        const domIndex = $dom.index();
        const trList = jTool('tbody tr', $table);
        let tdList = [];
        let _td = null;

        jTool.each(trList, (i, v) => {
            _td = jTool('td', v).get(domIndex);
            if (_td) {
                tdList.push(_td);
            }
        });
        return jTool(tdList);
    }

    /**
     * 根据参数设置列是否可见(th 和 td)
     * @param $thList 即将配置的列所对应的th[jTool object，可以是多个]
     * @param isVisible 是否可见
     * @param cb
     */
    setAreVisible($thList, isVisible, cb) {
        // 当前所在的table
        let $table = null;

        // 当前所在的容器
        let	_tableWarp;

        // 当前操作的th
        let	_th = null;

        // 当前tbody下所有的tr
        let	_trList = null;

        // 所对应的td
        let	_tdList = [];

        // 所对应的显示隐藏所在的li
        let	_checkLi = null;

        // 所对应的显示隐藏事件
        let	_checkbox = null;
        jTool.each($thList, (i, v) => {
            _th = jTool(v);
            $table = _th.closest('table');
            _tableWarp = $table.closest('.table-wrap');
            _trList = jTool('tbody tr[cache-key]', $table);
            _checkLi = jTool(`.config-area li[th-name="${_th.attr('th-name')}"]`, _tableWarp);
            _checkbox = jTool('input[type="checkbox"]', _checkLi);

            jTool.each(_trList, (i2, v2) => {
                _tdList.push(jTool(v2).find('td').get(_th.index()));
            });

            // 显示
            if (isVisible) {
                _th.attr('th-visible', 'visible');
                jTool.each(_tdList, (i2, v2) => {
                    v2.setAttribute('td-visible', 'visible');
                });
                _checkLi.addClass('checked-li');
                _checkbox.prop('checked', true);
            } else {
                // 隐藏
                _th.attr('th-visible', 'none');
                jTool.each(_tdList, (i2, v2) => {
                    v2.setAttribute('td-visible', 'none');
                });
                _checkLi.removeClass('checked-li');
                _checkbox.prop('checked', false);
            }
            this.updateEmptyCol($table);
            typeof cb === 'function' ? cb() : '';
        });
    }

    /**
     * 更新最后一项可视列的标识
     * @param $table
     */
    updateVisibleLast($table) {
        const $visibleThList = this.getVisibleTh($table);

        const $fakeVisibleThList = this.getFakeVisibleTh($table);
        const lastIndex = $fakeVisibleThList.length - 1;
        let isLastVisible = null;
        jTool.each($fakeVisibleThList, (index, item) => {
            isLastVisible = index === lastIndex;
            item.setAttribute('last-visible', isLastVisible);
            $visibleThList.get(index).setAttribute('last-visible', isLastVisible);
            this.getColTd(jTool(item)).attr('last-visible', isLastVisible);
        });
    }

    /**
     * 更新列宽
     * @param $table
     * @param settings
     * @param isInit: 是否为init调用
     */
    updateThWidth($table, settings, isInit) {
        const { columnMap, isIconFollowText } = settings;
        const updateColumnList = [];
        let toltalWidth = $table.closest('.table-div').width();

        jTool.each(columnMap, (index, col) => {
            // 需要更新宽度的列
            if (col.isShow && !col.disableCustomize) {
                updateColumnList.push(col);
            }

            // 汇总不可更新但可见的列宽
            if (col.isShow && col.disableCustomize) {
                toltalWidth += col.__width;
            }
        });

        // jTool(`thead[grid-manager-thead]`, $table);
        const $thead = this.getHead($table);
        let autoLen = 0;
        let lastIndex = updateColumnList.length - 1;

        // 通过 th.style.width 来进行表格宽度 设置
        jTool.each(updateColumnList, (i, col) => {
            const {__width, width} = col;
            const th = $thead.find(`th[th-name="${col.key}"]`).get(0);

            // 非init情况下，设置自动适应列，并统计当前可视项中自动宽度列的总数
            if (!isInit && (!__width || __width === 'auto')) {
                autoLen++;
                th.style.width = 'auto';
                return;
            }

            // 当前为init情况，需要使用在core.js中配置的width
            if (isInit && (!width || width === 'auto')) {
                autoLen++;
                th.style.width = 'auto';
                return;
            }

            // 当设置至最后一列 且 已经设置的列未存在自动适应列
            if (i === lastIndex && autoLen === 0) {
                th.style.width = 'auto';
                return;
            }

            // 非init的情况下，清除缓存使用原始宽度
            if (!isInit) {
                th.style.width = __width;
            } else {
                th.style.width = width;
            }
        });

        // 当前th文本所占宽度大于设置的宽度
        // 需要在上一个each执行完后,才可以获取到准确的值
        let usedTotalWidth = 0;
        jTool.each(updateColumnList, (i, col) => {
            const $th = $thead.find(`th[th-name="${col.key}"]`);
            let thWidth = jTool($th).width();
            let minWidth = this.getTextWidth($th, isIconFollowText);
            let newWidth = thWidth < minWidth ? minWidth : thWidth;

            // 最后一列使用剩余的宽度
            if (i === lastIndex) {
                newWidth = toltalWidth > usedTotalWidth + newWidth ? toltalWidth - usedTotalWidth : newWidth;
            }

            $th.width(newWidth);
            usedTotalWidth += newWidth;
        });
    }

    /**
     * 获取TH中文本的宽度. 该宽度指的是文本所实际占用的宽度
     * @param th
     * @param isIconFollowText: 表头的icon图标是否跟随文本, 如果根随则需要加上两个icon所占的空间
     * @returns {*}
     */
    getTextWidth(th, isIconFollowText) {
        const $th = jTool(th);

        // th下的GridManager包裹容器
        const thWarp = jTool('.th-wrap', $th);

        // 文本所在容器
        const thText = jTool('.th-text', $th);

        // 文本镜象 用于处理实时获取文本长度
        const tableWrap = $th.closest('.table-wrap');
        const textDreamland	= jTool('.text-dreamland', tableWrap);

        // 将th-text内容嵌入文本镜象 用于获取文本实时宽度
        textDreamland.html(thText.html());
        textDreamland.css({
            fontSize: thText.css('font-size'),
            fontWeight: thText.css('font-weight'),
            fontFamily: thText.css('font-family')
        });
        const thPaddingLeft = thWarp.css('padding-left');
        const thPaddingRight = thWarp.css('padding-right');

        // 计算icon所占的空间
        // 仅在isIconFollowText === true时进行计算。
        // isIconFollowText === false时，icon使用的是padding-right，所以无需进行计算
        let iconWidth = 0;
        if (isIconFollowText) {
            // 排序
            const sortingAction = jTool('.sorting-action', $th);
            sortingAction.length !== 0 ? iconWidth += sortingAction.width() : '';

            // 筛选
            const filterAction = jTool('.filter-action', $th);
            filterAction.length !== 0 ? iconWidth += filterAction.width() : '';
        }

        // 返回宽度值
        // 文本所占宽度 + icon所占的空间 + 左内间距 + 右内间距 + (由于使用 table属性: border-collapse: collapse; 和th: border-right引发的table宽度计算容错) + th-wrap减去的1px
        return textDreamland.width() + iconWidth + (thPaddingLeft || 0) + (thPaddingRight || 0) + 2 + 1;
    }
    /**
     * 隐藏加载中动画
     * @param dom
     * @param cb
     */
    hideLoading(dom, cb) {
        if (!dom || dom.length === 0) {
            return false;
        }
        window.setTimeout(() => {
            jTool('.gm-load-area', dom).remove();
            typeof cb === 'function' ? cb() : '';
        }, 500);
        return true;
    }

    /**
     * 更新当前用户交互状态, 用于优化置顶状态下进行[拖拽, 宽度调整]操作时,页面出现滚动的问题
     * @param $table
     * @param interactive: 如果不存在于interactiveList内, 将删除属性[user-interactive]
     */
    updateInteractive($table, interactive) {
        const interactiveList = ['adjust', 'drag'];
        // 事件源所在的容器
        let	tableWrap = $table.closest('.table-wrap');
        if (!interactive || interactiveList.indexOf(interactive) === -1) {
            tableWrap.removeAttr('user-interactive');
        } else {
            tableWrap.attr('user-interactive', interactive);
        }
    }

    /**
     * 更新滚动轴显示状态
     * @param $table
     */
    updateScrollStatus($table) {
        const $tableDiv = $table.closest('.table-div');
        // 宽度: table的宽度大于 tableDiv的宽度时，显示滚动条
        if ($table.width() > $tableDiv.width()) {
            $tableDiv.css('overflow-x', 'auto');
            return 'auto';
        } else {
            $tableDiv.css('overflow-x', 'hidden');
            return 'hidden';
        }
    }

    /**
     * 通过配置项columnData 获取指定列的可视信息
     * @param col 列的配置信息
     * @returns {string}
     */
    getVisibleForColumn(col) {
        return col.isShow ? 'visible' : 'none';
    }

    /**
     * 计算表格布局
     * @param $table
     * @param width
     * @param height
     * @param supportAjaxPage
     */
    calcLayout($table, width = '100%', height = '100%', supportAjaxPage = true) {
        const tableWrap = $table.closest('.table-wrap').get(0);
        const tableDiv = tableWrap.querySelector('.table-div');
        tableWrap.style.width = `calc(${width})`;
        tableWrap.style.height = `calc(${height})`;
        tableDiv.style.height = `calc(100% - ${supportAjaxPage ? '40px' : '0px'})`;
    }
}

export default new Base();
