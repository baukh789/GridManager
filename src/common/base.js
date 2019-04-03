/**
 * 项目中的一些基础方法
 *
 * #001: getDataForColumnMap(columnMap, data)
 * 获取与ColumnMap匹配的clone数据, 仅会返回data中与ColumnMap相匹配且col.isAutoCreate !== true的字段。
 * 返回的是clone对象，修改它并不会污染原数据。
 *
 */
import jTool from './jTool';
import { FAKE_TABLE_HEAD_KEY, TABLE_HEAD_KEY, TABLE_KEY, CONSOLE_STYLE, WRAP_KEY, DIV_KEY, CONFIG_KEY } from './constants';

class Base {

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
     * #001
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
     * @param gridManagerName
     * @param loadingTemplate
     */
    showLoading(gridManagerName, loadingTemplate) {
        const $tableWrap = this.getWrap(gridManagerName);

        const $loading = $tableWrap.find('.gm-load-area');
        if ($loading.length > 0) {
            $loading.remove();
        }

        const $loadingDom = jTool(loadingTemplate);
        $loadingDom.addClass('gm-load-area');
        $tableWrap.append($loadingDom);
        return true;
    }

    /**
     * 隐藏加载中动画
     * @param gridManagerName
     */
    hideLoading(gridManagerName) {
        const $tableWrap = this.getWrap(gridManagerName);
        window.setTimeout(() => {
            jTool('.gm-load-area', $tableWrap).remove();
        }, 500);
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
     * 获取表的GM 唯一标识
     * @param $table
     * @returns {*|string}
     */
    getKey($table) {
        if (!$table || !$table.jTool || $table.length === 0) {
            return '';
        }
        return $table.attr(TABLE_KEY);
    }

    /**
     * 获取表格的选择器
     * @param gridManagerName
     * @returns {string}
     */
    getQuerySelector(gridManagerName) {
        return `table[${TABLE_KEY}="${gridManagerName}"]`;
    }

    /**
     * get table
     * @param $dom: 父级或子级jTool对象，或者是gridManagerName。如果是gridManagerName，则第二个参数无效。
     * @param isSelectUp: 是否为向上查找模式
     * @returns {*}
     */
    getTable($dom, isSelectUp) {
        if (typeof $dom === 'string') {
            return jTool(`table[${TABLE_KEY}="${$dom}"]`);
        }
        return isSelectUp ? $dom.closest(`table[${TABLE_KEY}]`) : jTool(`table[${TABLE_KEY}]`, $dom);
    }

    /**
     * get table wrap
     * @param $dom: 父级或子级jTool对象，或者是gridManagerName。如果是gridManagerName，则第二个参数无效。
     * @param isSelectUp: 是否为向上查找模式
     * @returns {*}
     */
    getWrap($dom, isSelectUp) {
        if (typeof $dom === 'string') {
            return jTool(`.table-wrap[${WRAP_KEY}="${$dom}"]`);
        }
        return isSelectUp ? $dom.closest(`.table-wrap[${WRAP_KEY}]`) : jTool(`.table-wrap[${WRAP_KEY}]`, $dom);
    }

    /**
     * get table div
     * @param $dom: 父级或子级jTool对象，或者是gridManagerName。如果是gridManagerName，则第二个参数无效。
     * @param isSelectUp: 是否为向上查找模式
     * @returns {*}
     */
    getDiv($dom, isSelectUp) {
        if (typeof $dom === 'string') {
            return jTool(`.table-div[${DIV_KEY}="${$dom}"]`);
        }
        return isSelectUp ? $dom.closest(`.table-div[${DIV_KEY}]`) : jTool(`.table-div[${DIV_KEY}]`, $dom);
    }

    /**
     * get table head
     * @param gridManagerName
     * @returns {*}
     */
    getHead(gridManagerName) {
        return jTool(`${this.getQuerySelector(gridManagerName)} thead[${TABLE_HEAD_KEY}]`);
    }

    /**
     * get fake head
     * @param gridManagerName
     * @returns {*}
     */
    getFakeHead(gridManagerName) {
        return jTool(`${this.getQuerySelector(gridManagerName)} thead[${FAKE_TABLE_HEAD_KEY}]`);
    }

    /**
     * get head th
     * @param gridManagerName
     * @param thName: 1.thName 2.fake th
     * @returns {*}
     */
    getTh(gridManagerName, thName) {
        // jTool object
        if (thName.jTool) {
            thName = this.getThName(thName);
        }
        return jTool(`${this.getQuerySelector(gridManagerName)} thead[${TABLE_HEAD_KEY}] th[th-name="${thName}"]`);
    }

    /**
     * get all th
     * @param $table
     * @returns {*}
     */
    getAllTh(gridManagerName) {
        return jTool(`${this.getQuerySelector(gridManagerName)} thead[${TABLE_HEAD_KEY}] th`);
    }

    /**
     * get visible th
     * @param $table
     * @param isGmCreate
     * @returns {*}
     */
    getVisibleTh(gridManagerName, isGmCreate) {
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
                break;
            }
        }
        return jTool(`${this.getQuerySelector(gridManagerName)} thead[${TABLE_HEAD_KEY}] th[th-visible="visible"]${gmCreateStr}`);
    }

    /**
     * get fake th
     * @param gridManagerName
     * @param thName
     * @returns {*}
     */
    getFakeTh(gridManagerName, thName) {
        // jTool object
        if (thName.jTool) {
            thName = this.getThName(thName);
        }
        return jTool(`${this.getQuerySelector(gridManagerName)} thead[${FAKE_TABLE_HEAD_KEY}] th[th-name="${thName}"]`);
    }

    /**
     * get fake visible th
     * @param gridManagerName
     * @returns {*}
     */
    getFakeVisibleTh(gridManagerName) {
        return jTool(`${this.getQuerySelector(gridManagerName)} thead[${FAKE_TABLE_HEAD_KEY}] th[th-visible="visible"]`);
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
     * @param style: 模版自定义样式
     * @returns {string}
     */
    getEmptyHtml(visibleNum, emptyTemplate, style) {
        return `<tr emptyTemplate style="${style}">
					<td colspan="${visibleNum}">
					${emptyTemplate}
					</td>
				</tr>`;
    }

    /**
     * 更新数据为空显示DOM所占的列数
     * @param gridManagerName
     */
    updateEmptyCol(gridManagerName) {
        const emptyDOM = jTool(`${this.getQuerySelector(gridManagerName)} tbody tr[emptyTemplate]`);
        if (emptyDOM.length === 0) {
            return;
        }
        const visibleNum = this.getVisibleTh(gridManagerName).length;
        jTool('td', emptyDOM).attr('colspan', visibleNum);
    }

    /**
     * 获取同列的 td jTool 对象
     * @param $th
     * @returns {jTool}
     */
    getColTd($th) {
        return jTool(`tbody tr td:nth-child(${$th.index() + 1})`, this.getTable($th, true));
    }

    /**
     * 根据参数设置列是否可见(th 和 td)
     * @param gridManagerName
     * @param thNameList: Array [thName]
     * @param isVisible: 是否可见
     */
    setAreVisible(gridManagerName, thNameList, isVisible) {
        jTool.each(thNameList, (i, thName) => {
            const $th = this.getTh(gridManagerName, thName);

            // 可视状态值
            const visibleState = this.getVisibleState(isVisible);

            // th
            $th.attr('th-visible', visibleState);

            // fake th
            this.getFakeTh(gridManagerName, thName).attr('th-visible', visibleState);

            // 所对应的td
            const $td = this.getColTd($th);
            jTool.each($td, (index, td) => {
                td.setAttribute('td-visible', visibleState);
            });

            // config
            // 所对应的显示隐藏所在的li
            const $checkLi = jTool(`.config-area[${CONFIG_KEY}="${gridManagerName}"] li[th-name="${thName}"]`);

            isVisible ? $checkLi.addClass('checked-li') : $checkLi.removeClass('checked-li');
            jTool('input[type="checkbox"]', $checkLi).prop('checked', isVisible);

            this.updateEmptyCol(gridManagerName);
        });
    }

    /**
     * 更新最后一项可视列的标识
     * @param gridManagerName
     */
    updateVisibleLast(gridManagerName) {
        const $fakeVisibleThList = this.getFakeVisibleTh(gridManagerName);
        const index = $fakeVisibleThList.length - 1;
        const $lastFakeTh = $fakeVisibleThList.eq(index);

        // 清除所有列
        jTool(`${this.getQuerySelector(gridManagerName)} [last-visible="true"]`).attr('last-visible', false);

        // fake th 最后一项增加标识
        $lastFakeTh.attr('last-visible', true);

        // th 最后一项增加标识
        this.getVisibleTh(gridManagerName).eq(index).attr('last-visible', true);

        // td 最后一项增加标识
        this.getColTd($lastFakeTh).attr('last-visible', true);
    }

    /**
     * 更新列宽
     * @param $table
     * @param settings
     * @param isInit: 是否为init调用
     */
    updateThWidth($table, settings, isInit) {
        const { gridManagerName, columnMap, isIconFollowText } = settings;
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
        const $thead = this.getHead(gridManagerName);
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
            let minWidth = this.getThTextWidth(gridManagerName, $th, isIconFollowText);
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
     * @param $th
     * @param isIconFollowText: 表头的icon图标是否跟随文本, 如果根随则需要加上两个icon所占的空间
     * @returns {*}
     */
    getThTextWidth(gridManagerName, $th, isIconFollowText) {
        // th下的GridManager包裹容器
        const $thWarp = jTool('.th-wrap', $th);

        // 文本所在容器
        const thText = jTool('.th-text', $th);

        // 获取文本长度
        const textWidth = this.getTextWidth(gridManagerName, thText.html(), {
            fontSize: thText.css('font-size'),
            fontWeight: thText.css('font-weight'),
            fontFamily: thText.css('font-family')
        });
        const thPaddingLeft = $thWarp.css('padding-left');
        const thPaddingRight = $thWarp.css('padding-right');

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
        return textWidth + iconWidth + (thPaddingLeft || 0) + (thPaddingRight || 0) + 2 + 1;
    }

    /**
     * 获取文本宽度
     * @param gridManagerName
     * @param text
     * @param cssObj: 样式对像，允许为空。示例: {fontSize: '12px', ...}
     * @returns {*}
     */
    getTextWidth(gridManagerName, text, cssObj) {
        const $textDreamland = jTool(`.table-wrap[${WRAP_KEY}="${gridManagerName}"] .text-dreamland`);
        $textDreamland.html(text);
        cssObj && $textDreamland.css(cssObj);
        return $textDreamland.width();
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
     * 获取visible状态
     * @param isShow: 是否显示
     * @returns {string}
     */
    getVisibleState(isShow) {
        return isShow ? 'visible' : 'none';
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

    /**
     * 清除body上的事件，该事件在各个模块注册
     * @param eventMap
     */
    clearBodyEvent(eventMap) {
        const $body = jTool('body');
        for (let key in eventMap) {
            const { eventName, eventQuerySelector } = eventMap[key];
            if (eventQuerySelector) {
                $body.off(eventName, eventQuerySelector);
                continue;
            }
            $body.off(eventName);
        }
    }
}

export default new Base();
