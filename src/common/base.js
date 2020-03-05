/**
 * 项目中的一些基础方法
 */
import jTool from '@jTool';
import { isString, each, extend } from '@jTool/utils';
import {
    FAKE_TABLE_HEAD_KEY,
    TABLE_HEAD_KEY,
    TABLE_KEY,
    WRAP_KEY,
    DIV_KEY,
    CONFIG_KEY,
    EMPTY_TPL_KEY,
    TOOLBAR_KEY,
    ROW_DISABLED_CHECKBOX,
    TR_CACHE_KEY,
    TR_LEVEL_KEY,
    LOADING_CLASS_NAME,
    LAST_VISIBLE,
    CELL_HIDDEN,
    GM_CREATE,
    TH_NAME,
    REMIND_CLASS,
    ROW_CLASS_NAME,
    SORT_CLASS
} from './constants';
import { CLASS_FILTER } from '@module/filter/constants';

/**
 * 获取clone行数据匹配，修改它并不会污染原数据。
 * @param columnMap
 * @param obj
 * @param cleanKeyList: 指定从clone数据中清除字段列表
 */
export const getCloneRowData = (columnMap, obj, cleanKeyList) => {
    let cloneObj = extend(true, {}, obj);

    // 删除自定义参数: 通过columnMap设置的项
    for (let key in columnMap) {
        if (columnMap[key].isAutoCreate) {
            delete cloneObj[key];
        }
    }

    // 删除自定义参数: 行禁用标识
    delete cloneObj[ROW_DISABLED_CHECKBOX];

    // 删除自定义参数: 行唯一标识
    delete cloneObj[TR_CACHE_KEY];

    // 删除自定义参数: 行层级标识
    delete cloneObj[TR_LEVEL_KEY];

    // 删除自定义参数: 为当前行增加一个calssName
    delete cloneObj[ROW_CLASS_NAME];

    // 清除指定字段
    cleanKeyList && cleanKeyList.forEach(item => delete cloneObj[item]);
    return cloneObj;
};

/**
 * 显示加载中动画
 * @param gridManagerName
 * @param loadingTemplate
 */
export const showLoading = (gridManagerName, loadingTemplate) => {
    const $tableWrap = getWrap(gridManagerName);

    const $loading = $tableWrap.find(`.${LOADING_CLASS_NAME}`);
    if ($loading.length > 0) {
        $loading.remove();
    }

    const $loadingDom = jTool(loadingTemplate);
    $loadingDom.addClass(LOADING_CLASS_NAME);
    $tableWrap.append($loadingDom);
};

/**
 * 隐藏加载中动画
 * @param gridManagerName
 */
export const hideLoading = gridManagerName => {
    window.setTimeout(() => {
        jTool(`.${LOADING_CLASS_NAME}`, getWrap(gridManagerName)).remove();
    }, 500);
};

/**
 * 获取表的GM 唯一标识
 * @param target
 * @returns {*|string}
 */
export const getKey = target => {
    if (isString(target)) {
        return target;
    }
    return target.getAttribute(TABLE_KEY);
};

/**
 * 获取表格的选择器
 * @param gridManagerName
 * @returns {string}
 */
export const getQuerySelector = gridManagerName => {
    return `[${TABLE_KEY}="${gridManagerName}"]`;
};

/**
 * get table
 * @param $dom: 父级或子级jTool对象，或者是gridManagerName。如果是gridManagerName，则第二个参数无效。
 * @param isSelectUp: 是否为向上查找模式
 * @returns {*}
 */
export const getTable = ($dom, isSelectUp) => {
    if (isString($dom)) {
        return jTool(`[${TABLE_KEY}="${$dom}"]`);
    }
    return isSelectUp ? $dom.closest(`[${TABLE_KEY}]`) : jTool(`[${TABLE_KEY}]`, $dom);
};

/**
 * get table div
 * @param gridManagerName
 * @returns {*}
 */
export const getDiv = gridManagerName => {
    return jTool(`[${DIV_KEY}="${gridManagerName}"]`);
};

/**
 * get table wrap
 * @param gridManagerName
 * @returns {*}
 */
export const getWrap = gridManagerName => {
    return jTool(`[${WRAP_KEY}="${gridManagerName}"]`);
};

/**
 * get table head
 * @param gridManagerName
 * @returns {*}
 */
export const getThead = gridManagerName => {
    return jTool(`[${TABLE_HEAD_KEY}="${gridManagerName}"]`);
};

/**
 * get fake head
 * @param gridManagerName
 * @returns {*}
 */
export const getFakeThead = gridManagerName => {
    return jTool(`[${FAKE_TABLE_HEAD_KEY}="${gridManagerName}"]`);
};

/**
 * get tbody
 * @param gridManagerName
 */
export const getTbody = gridManagerName => {
    return jTool(`[${TABLE_KEY}="${gridManagerName}"] tbody`);
};

/**
 * get head th
 * @param gridManagerName
 * @param thName: 1.thName 2.fake th
 * @returns {*}
 */
export const getTh = (gridManagerName, thName) => {
    // jTool object
    if (thName.jTool) {
        thName = getThName(thName);
    }
    return jTool(`[${TABLE_HEAD_KEY}="${gridManagerName}"] th[${TH_NAME}="${thName}"]`);
};

/**
 * get fake th
 * @param gridManagerName
 * @param thName
 * @returns {*}
 */
export const getFakeTh = (gridManagerName, thName) => {
    return jTool(`[${FAKE_TABLE_HEAD_KEY}="${gridManagerName}"] th[${TH_NAME}="${thName}"]`);
};

/**
 * get all th
 * @param $table
 * @returns {*}
 */
export const getAllTh = gridManagerName => {
    return jTool(`[${TABLE_HEAD_KEY}="${gridManagerName}"] th`);
};

/**
 * get visible th
 * @param $table
 * @returns {*}
 */
export const getVisibleTh = gridManagerName => {
    return jTool(`[${TABLE_HEAD_KEY}="${gridManagerName}"] th:not(${CELL_HIDDEN})`);
};

/**
 * get fake visible th
 * @param gridManagerName
 * @param isExcludeGmCreate: 是否排除自动创建的列
 * @returns {*}
 */
export const getFakeVisibleTh = (gridManagerName, isExcludeGmCreate) => {
    return jTool(`[${FAKE_TABLE_HEAD_KEY}="${gridManagerName}"] th:not([${CELL_HIDDEN}])${isExcludeGmCreate ? `:not([${GM_CREATE}])` : ''}`);
};

/**
 * get th name
 * @param $dom: $th or $td
 * @returns {*}
 */
export const getThName = $dom => {
    return $dom.attr(TH_NAME);
};

/**
 * 获取空模版jTool对像
 * @param gridManagerName
 */
export const getEmpty = gridManagerName => {
    return jTool(`[${EMPTY_TPL_KEY}="${gridManagerName}"]`);
};

/**
 * 更新数据为空显示DOM所占的列数
 * @param gridManagerName
 */
export const updateEmptyCol = gridManagerName => {
    const emptyDOM = getEmpty(gridManagerName);
    if (emptyDOM.length === 0) {
        return;
    }
    const visibleNum = getVisibleTh(gridManagerName).length;
    jTool('td', emptyDOM).attr('colspan', visibleNum);
};

/**
 * 获取同列的 td jTool 对象
 * @param $dom: $th || $td
 * @param $context: $tr || tr
 * @returns {jTool}
 */
export const getColTd = ($dom, $context) => {
    // 获取tbody下全部匹配的td
    if (!$context) {
        return jTool(`tbody tr td:nth-child(${$dom.index() + 1})`, getTable($dom, true));
    }

    // 获取指定$context下匹配的td
    return jTool(`td:nth-child(${$dom.index() + 1})`, $context);
};

/**
 * 根据参数设置列是否可见(th 和 td)
 * @param gridManagerName
 * @param thNameList: Array [thName]
 * @param isVisible: 是否可见
 */
export const setAreVisible = (gridManagerName, thNameList, isVisible) => {
    each(thNameList, (i, thName) => {
        const $th = getTh(gridManagerName, thName);
        const $fakeTh = getFakeTh(gridManagerName, thName);
        const $td = getColTd($th);

        // 可视状态值
        const fn = isVisible ? 'removeAttr' : 'attr';
        // th
        $th[fn](CELL_HIDDEN, '');

        // fake th
        $fakeTh[fn](CELL_HIDDEN, '');

        // td
        $td[fn](CELL_HIDDEN, '');

        // config
        // 所对应的显示隐藏所在的li
        const $checkLi = jTool(`[${CONFIG_KEY}="${gridManagerName}"] li[${TH_NAME}="${thName}"]`);

        isVisible ? $checkLi.addClass('checked-li') : $checkLi.removeClass('checked-li');
        jTool('input[type="checkbox"]', $checkLi).prop('checked', isVisible);

        updateEmptyCol(gridManagerName);
    });
};

/**
 * 更新最后一项可视列的标识
 * @param gridManagerName
 */
export const updateVisibleLast = gridManagerName => {
    const $fakeVisibleThList = getFakeVisibleTh(gridManagerName);
    const index = $fakeVisibleThList.length - 1;
    const $lastFakeTh = $fakeVisibleThList.eq(index);

    // 清除所有列
    jTool(`${getQuerySelector(gridManagerName)} [${LAST_VISIBLE}]`).removeAttr(LAST_VISIBLE);

    // fake th 最后一项增加标识
    $lastFakeTh.attr(LAST_VISIBLE, '');

    // th 最后一项增加标识
    getVisibleTh(gridManagerName).eq(index).attr(LAST_VISIBLE, '');

    // td 最后一项增加标识
    getColTd($lastFakeTh).attr(LAST_VISIBLE, '');
};

/**
 * 更新列宽
 * @param settings
 * @param isInit: 是否为init调用
 */
export const updateThWidth = (settings, isInit) => {
    const { gridManagerName, columnMap, isIconFollowText } = settings;
    let totalWidth = getDiv(gridManagerName).width();
    let usedTotalWidth = 0;

    const autoList = [];

    // 存储首列
    let firstCol = null;
    each(columnMap, (key, col) => {
        const { __width, width, isShow, disableCustomize } = col;

        // 不可见列: 不处理
        if (!isShow) {
            return;
        }

        // 禁用定制列: 仅统计总宽，不进行宽度处理
        if (disableCustomize) {
            totalWidth -= parseInt(width, 10);
            return;
        }

        // 自适应列: 更新为最小宽度，统计总宽，收录自适应列数组
        if ((isInit && (!width || width === 'auto')) ||
            (!isInit && (!__width || __width === 'auto'))) {
            col.width = getThTextWidth(gridManagerName, getFakeTh(gridManagerName, key), isIconFollowText);
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
    const autoLen = autoList.length;

    // 剩余的值
    let overage = totalWidth - usedTotalWidth;

    // 未存在自动列 且 存在剩余的值: 将第一个可定制列宽度强制与剩余宽度相加
    if (autoLen === 0 && overage > 0) {
        firstCol.width = `${parseInt(firstCol.width, 10) + overage}px`;
    }

    // 存在自动列 且 存在剩余宽度: 平分剩余的宽度
    if (autoLen && overage > 0) {
        const splitVal = Math.floor(overage / autoLen);
        each(autoList, (index, col) => {
            // 最后一项自动列: 将余值全部赋予
            if (index === autoLen - 1) {
                col.width = `${parseInt(col.width, 10) + overage}px`;
                return;
            }
            col.width = `${parseInt(col.width, 10) + splitVal}px`;
            overage = overage - splitVal;
        });
    }

    // 绘制th宽度
    each(columnMap, (key, col) => {
        // 可见 且 禁用定制列 不处理
        if (col.isShow && col.disableCustomize) {
            return;
        }
        getTh(gridManagerName, key).width(col.width);
    });
};

/**
 * 获取TH中文本的宽度. 该宽度指的是文本所实际占用的宽度
 * @param $th: fake-th
 * @param isIconFollowText: 表头的icon图标是否跟随文本, 如果根随则需要加上两个icon所占的空间
 * @returns {*}
 */
export const getThTextWidth = (gridManagerName, $th, isIconFollowText) => {
    // th下的GridManager包裹容器
    const $thWarp = jTool('.th-wrap', $th);

    // 文本所在容器
    const thText = jTool('.th-text', $th);

    // 获取文本长度
    const textWidth = getTextWidth(gridManagerName, thText.html(), {
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
        const remindAction = jTool(`.${REMIND_CLASS}`, $th);
        remindAction.length && (iconWidth += remindAction.width());

        // 排序
        const sortingAction = jTool(`.${SORT_CLASS}`, $th);
        sortingAction.length && (iconWidth += sortingAction.width());

        // 筛选
        const filterAction = jTool(`.${CLASS_FILTER}`, $th);
        filterAction.length && (iconWidth += filterAction.width());
    }

    // 返回宽度值
    // 文本所占宽度 + icon所占的空间 + 左内间距 + 右内间距 + (由于使用 table属性: border-collapse: collapse; 和th: border-right引发的table宽度计算容错) + th-wrap减去的1px
    return textWidth + iconWidth + (thPaddingLeft || 0) + (thPaddingRight || 0) + 2 + 1;
};

/**
 * 获取文本宽度
 * @param gridManagerName
 * @param content
 * @param cssObj: 样式对像，示例: {fontSize: '12px', ...}
 * @returns {*}
 */
export const getTextWidth = (gridManagerName, content, cssObj) => {
    const $textDreamland = jTool(`[${WRAP_KEY}="${gridManagerName}"] .text-dreamland`);
    $textDreamland.html(content);
    $textDreamland.css(cssObj);
    return $textDreamland.width();
};

/**
 * 更新滚动轴显示状态
 * @param gridManagerName
 */
export const updateScrollStatus = gridManagerName => {
    const $tableDiv = getDiv(gridManagerName);
    // 宽度: table的宽度大于 tableDiv的宽度时，显示滚动条
    $tableDiv.attr('gm-overflow-x', getTable(gridManagerName).width() > $tableDiv.width());
};

/**
 * 计算表格布局
 * @param gridManagerName
 * @param width
 * @param height
 * @param supportAjaxPage
 */
export const calcLayout = (gridManagerName, width, height, supportAjaxPage) => {
    const tableWrap = getWrap(gridManagerName).get(0);
    const theadHeight = getThead(gridManagerName).height();

    // 包含calc的样式，无法通过jTool对像进行赋值，所以需要通过.style的方式赋值
    tableWrap.style.width = `calc(${width})`;
    tableWrap.style.height = `calc(${height})`;
    tableWrap.style.paddingTop = theadHeight + 'px';

    getDiv(gridManagerName).get(0).style.height = supportAjaxPage ? `calc(100% - ${jTool(`[${TOOLBAR_KEY}="${gridManagerName}"]`).height()}px)` : '100%';
    jTool('.table-header', tableWrap).height(theadHeight);
    getTable(gridManagerName).css('margin-top',  -theadHeight);
};

/**
 * 清除目标元素上的事件，该事件在各个模块调用
 * @param eventMap
 */
export const clearTargetEvent = eventMap => {
    for (let key in eventMap) {
        const eve = eventMap[key];
        const $target = jTool(eve.target);
        $target.length && $target.off(eve.events, eve.selector);
    }
};
