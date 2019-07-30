/**
 * 项目中的一些基础方法
 */
import jTool from './jTool';
import { CONSOLE_INFO, CONSOLE_WARN, CONSOLE_ERROR, FAKE_TABLE_HEAD_KEY, TABLE_HEAD_KEY, TABLE_KEY, CONSOLE_STYLE, WRAP_KEY, DIV_KEY, CONFIG_KEY, EMPTY_TPL_KEY, TOOLBAR_KEY, COL_PROP_DISABLED } from './constants';

/**
 * 输出日志
 * @param msg 输出文本
 * @param type 输出分类[info,warn,error]
 * @returns {*}
 */
const OUT_LOG = (msg, type) => {
    console.log(`%c GridManager ${type} %c ${msg} `, ...CONSOLE_STYLE[type]);
};

class Base {

    // 定时器: 等待容器可用, 在core.js中使用
    SIV_waitContainerAvailable = {};

    // 定时器: 等待表格可用，在index.js中使用
    SIV_waitTableAvailable = {};

    /**
     * 输出信息
     * @param msg 输出文本
     * @returns {*}
     */
    outInfo(msg) {
        OUT_LOG(msg, CONSOLE_INFO);
    }

    /**
     * 输出警告
     * @param msg 输出文本
     * @returns {*}
     */
    outWarn(msg) {
        OUT_LOG(msg, CONSOLE_WARN);
    }

    /**
     * 输出错误
     * @param msg 输出文本
     * @returns {*}
     */
    outError(msg) {
        OUT_LOG(msg, CONSOLE_ERROR);
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
     * 获取clone行数据匹配，修改它并不会污染原数据。
     * @param columnMap
     * @param obj
     * @param cleanKeyList: 指定从clone数据中清除字段列表
     */
    getCloneRowData(columnMap, obj, cleanKeyList) {
        let cloneObj = jTool.extend(true, {}, obj);

        // 删除自定义参数: 通过columnMap设置的项
        for (let key in columnMap) {
            if (columnMap[key].isAutoCreate) {
                delete cloneObj[key];
            }
        }

        // 删除自定义参数: 非columnMap设置的项
        delete cloneObj[COL_PROP_DISABLED];

        // 清除指定字段
        cleanKeyList && cleanKeyList.forEach(item => delete cloneObj[item]);
        return cloneObj;
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
     * 获取表的GM 唯一标识
     * @param target
     * @returns {*|string}
     */
    getKey(target) {
        // undefined
        if (!target) {
            return;
        }

        // gridManagerName
        if (typeof target === 'string') {
            return target;
        }

        // jTool table
        if (target.jTool && target.length) {
            return target.attr(TABLE_KEY);
        }

        // table element
        if (target.nodeName === 'TABLE') {
            return target.getAttribute(TABLE_KEY);
        }
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
    getThead(gridManagerName) {
        return jTool(`thead[${TABLE_HEAD_KEY}="${gridManagerName}"]`);
    }

    /**
     * get fake head
     * @param gridManagerName
     * @returns {*}
     */
    getFakeThead(gridManagerName) {
        return jTool(`thead[${FAKE_TABLE_HEAD_KEY}="${gridManagerName}"]`);
    }

    /**
     * get tbody
     * @param gridManagerName
     */
    getTbody(gridManagerName) {
        return jTool(`table[${TABLE_KEY}="${gridManagerName}"] tbody`);
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
     * 获取空模版html
     * @param gridManagerName
     * @param visibleNum: 可视状态TH的数据
     * @param emptyTemplate: 自定义的为空显示模版
     * @param style: 模版自定义样式
     * @returns {string}
     */
    getEmptyHtml(gridManagerName, visibleNum, emptyTemplate, style) {
        return `<tr ${EMPTY_TPL_KEY}="${gridManagerName}" style="${style}">
					<td colspan="${visibleNum}">
					${emptyTemplate}
					</td>
				</tr>`;
    }

    /**
     * 获取空模版jTool对像
     * @param gridManagerName
     */
    getEmpty(gridManagerName) {
        return jTool(`tr[${EMPTY_TPL_KEY}="${gridManagerName}"]`);
    }

    /**
     * 更新数据为空显示DOM所占的列数
     * @param gridManagerName
     */
    updateEmptyCol(gridManagerName) {
        const emptyDOM = this.getEmpty(gridManagerName);
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
     * @param settings
     * @param isInit: 是否为init调用
     */
    updateThWidth(settings, isInit) {
        const { gridManagerName, columnMap, isIconFollowText } = settings;
        let toltalWidth = this.getDiv(gridManagerName).width();
        let usedTotalWidth = 0;

        const autoList = [];

        // 存储首列
        let firstCol = null;
        jTool.each(columnMap, (key, col) => {
            const { __width, width, isShow, disableCustomize } = col;

            // 不可见列: 不处理
            if (!isShow) {
                return;
            }

            // 禁用定制列: 仅统计总宽，不进行宽度处理
            if (disableCustomize) {
                toltalWidth -= parseInt(width, 10);
                return;
            }

            // 自适应列: 更新为最小宽度，统计总宽，收录自适应列数组
            if ((isInit && (!width || width === 'auto')) ||
                (!isInit && (!__width || __width === 'auto'))) {
                col.width = this.getThTextWidth(gridManagerName, this.getTh(gridManagerName, key), isIconFollowText);
                usedTotalWidth += parseInt(col.width, 10);
                autoList.push(col);
                return;
            }

            // init
            if (isInit) {
                usedTotalWidth += parseInt(width, 10);
            }

            // not init
            if (!isInit) {
                col.width = __width;
                usedTotalWidth += parseInt(__width, 10);
            }

            // 通过col.index更新首列
            if (!firstCol || firstCol.index > col.index) {
                firstCol = col;
            }
        });
        const autolen = autoList.length;

        // 剩余的值
        let overage = toltalWidth - usedTotalWidth;

        // 未存在自动列 且 存在剩余的值: 将第一个可定制列宽度强制与剩余宽度相加
        if (autolen === 0 && overage > 0) {
            firstCol.width = `${parseInt(firstCol.width, 10) + overage}px`;
        }

        // 存在自动列 且 存在剩余宽度: 平分剩余的宽度
        if (autolen && overage > 0) {
            const splitVal = Math.floor(overage / autolen);
            jTool.each(autoList, (index, col) => {
                // 最后一项自动列: 将余值全部赋予
                if (index === autolen - 1) {
                    col.width = `${parseInt(col.width, 10) + overage}px`;
                    return;
                }
                col.width = `${parseInt(col.width, 10) + splitVal}px`;
                overage = overage - splitVal;
            });
        }

        // 绘制th宽度
        jTool.each(columnMap, (key, col) => {
            // 可见 且 禁用定制列 不处理
            if (col.isShow && col.disableCustomize) {
                return;
            }
            this.getTh(gridManagerName, key).width(col.width);
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
            // 表头提醒
            const remindAction = jTool('.remind-action', $th);
            remindAction.length && (iconWidth += remindAction.width());

            // 排序
            const sortingAction = jTool('.sorting-action', $th);
            sortingAction.length && (iconWidth += sortingAction.width());

            // 筛选
            const filterAction = jTool('.filter-area', $th);
            filterAction.length && (iconWidth += filterAction.width());
        }

        // 返回宽度值
        // 文本所占宽度 + icon所占的空间 + 左内间距 + 右内间距 + (由于使用 table属性: border-collapse: collapse; 和th: border-right引发的table宽度计算容错) + th-wrap减去的1px
        return textWidth + iconWidth + (thPaddingLeft || 0) + (thPaddingRight || 0) + 2 + 1;
    }

    /**
     * 获取文本宽度
     * @param gridManagerName
     * @param content
     * @param cssObj: 样式对像，允许为空。示例: {fontSize: '12px', ...}
     * @returns {*}
     */
    getTextWidth(gridManagerName, content, cssObj) {
        const $textDreamland = jTool(`.table-wrap[${WRAP_KEY}="${gridManagerName}"] .text-dreamland`);
        $textDreamland.html(content);
        cssObj && $textDreamland.css(cssObj);
        return $textDreamland.width();
    }

    /**
     * 更新滚动轴显示状态
     * @param gridManagerName
     */
    updateScrollStatus(gridManagerName) {
        const $tableDiv = this.getDiv(gridManagerName);
        // 宽度: table的宽度大于 tableDiv的宽度时，显示滚动条
        $tableDiv.css('overflow-x', this.getTable(gridManagerName).width() > $tableDiv.width() ? 'auto' : 'hidden');
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
     * @param gridManagerName
     * @param width
     * @param height
     * @param supportAjaxPage
     */
    calcLayout(gridManagerName, width, height, supportAjaxPage) {
        const tableWrap = this.getWrap(gridManagerName).get(0);
        const theadHeight = this.getThead(gridManagerName).height();

        // 包含calc的样式，无法通过jTool对像进行赋值，所以需要通过.style的方式赋值
        tableWrap.style.width = `calc(${width})`;
        tableWrap.style.height = `calc(${height})`;
        tableWrap.style.paddingTop = theadHeight + 'px';

        this.getDiv(gridManagerName).get(0).style.height = supportAjaxPage ? `calc(100% - ${jTool(`[${TOOLBAR_KEY}="${gridManagerName}"]`).height()}px)` : '100%';
        jTool('.table-header', tableWrap).height(theadHeight);
        this.getTable(gridManagerName).css('margin-top',  -theadHeight);
    }

    /**
     * 清除body上的事件，该事件在各个模块注册
     * @param eventMap
     */
    clearBodyEvent(eventMap) {
        for (let key in eventMap) {
            const eve = eventMap[key];
            const $target = jTool(eve.target);
            $target.length && $target.off(eve.events, eve.selector);
        }
    }
}

export default new Base();
