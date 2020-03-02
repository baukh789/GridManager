import remind from '../remind';
import order from '../order';
import ajaxPage from '../ajaxPage';
import { CLASS_DRAG_ACTION } from '../drag/constants';
import { WRAP_KEY, DIV_KEY, TABLE_HEAD_KEY, ORDER_KEY, CHECKBOX_KEY, GM_CREATE, TH_VISIBLE } from '@common/constants';
import { isUndefined, isString, isObject, each } from '@jTool/utils';
import { getVisibleState } from '@common/utils';
import { compileTh } from '@common/framework';
import { parseTpl } from '@common/parse';
import filter from '../filter';
import fixed from '../fixed';
import config from '../config';
import sort from '../sort';
import checkbox from '../checkbox';
import wrapTpl from './wrap.tpl.html';
import theadTpl from './thead.tpl.html';
import thTpl from './th.tpl.html';

/**
 * 生成构建时所需要的模板
 */
class Render {
    /**
     * 生成table wrap 模板
     * @param params
     * @returns {parseData}
     */
    @parseTpl(wrapTpl)
    createWrapTpl(params) {
        const settings = params.settings;
        const { gridManagerName, skinClassName, isIconFollowText, disableBorder, disableLine, supportConfig, supportAjaxPage, configInfo, ajaxPageTemplate } = settings;
        const wrapClassList = [];
        // 根据参数增加皮肤标识
        if (skinClassName && isString(skinClassName) && skinClassName.trim()) {
            wrapClassList.push(skinClassName);
        }

        // 根据参数，增加表头的icon图标是否跟随文本class
        if (isIconFollowText) {
            wrapClassList.push('gm-icon-follow-text');
        }

        // 根据参数增加禁用禁用边框线标识
        if (disableBorder) {
            wrapClassList.push('disable-border');
        }
        // 根据参数增加禁用单元格分割线标识
        if (disableLine) {
            wrapClassList.push('disable-line');
        }
        return {
            wrapKey: WRAP_KEY,
            divKey: DIV_KEY,
            gridManagerName: gridManagerName,
            classNames: wrapClassList.join(' '),
            configTpl: supportConfig ? config.createHtml({gridManagerName, configInfo}) : '',
            ajaxPageTpl: supportAjaxPage ? ajaxPage.createHtml({settings, tpl: ajaxPageTemplate}) : ''
        };
    }

    /**
     * 生成table head 模板
     * @param params
     * @returns {parseData}
     */
    @parseTpl(theadTpl)
    createTheadTpl(params) {
        const settings = params.settings;
        const { columnMap, gridManagerName } = settings;

        const columnList = [];

        each(columnMap, (key, col) => {
            columnList[col.index] = col;
        });

        // 将表头提醒启用状态重置
        remind.enable[gridManagerName] = false;

        // 将排序启用状态重置
        sort.enable[gridManagerName] = false;

        // 将筛选条件重置
        filter.enable[gridManagerName] = false;

        // 将列固定重置
        fixed.enable[gridManagerName] = false;

        let thListTpl = '';
        // columnList 生成thead
        each(columnList, (index, col) => {
            thListTpl += this.createThTpl({settings, col});
        });

        return {
            tableHeadKey: TABLE_HEAD_KEY,
            gridManagerName,
            thListTpl
        };
    }

    /**
     * 生成table th 模板
     * @param params
     * @returns {parseData}
     */
    @parseTpl(thTpl)
    createThTpl(params) {
        const { settings, col } = params;
        const { gridManagerName, query, supportDrag, sortData, sortUpText, sortDownText, checkboxConfig } = settings;

        // 表头提醒
        let remindAttr = '';
        if (col.remind) {
            remindAttr = 'remind';
            remind.enable[gridManagerName] = true;
        }

        // 排序
        let sortingAttr = '';
        if (isString(col.sorting)) {
            sort.enable[gridManagerName] = true;
            if (col.sorting === sortDownText) {
                sortingAttr = `sorting="${sortDownText}"`;
                sortData[col.key] = sortDownText;
            } else if (col.sorting === sortUpText) {
                sortingAttr = `sorting="${sortUpText}"`;
                sortData[col.key] = sortUpText;
            } else {
                sortingAttr = 'sorting';
            }
        }

        // 过滤
        let filterAttr = '';
        if (isObject(col.filter)) {
            filter.enable[gridManagerName] = true;
            filterAttr = 'filter';
            if (isUndefined(col.filter.selected)) {
                col.filter.selected = query[col.key];
            } else {
                query[col.key] = col.filter.selected;
            }
        }

        // 固定列
        let fixedAttr = '';
        if (col.fixed === 'left' || col.fixed === 'right') {
            fixed.enable[gridManagerName] = true;
            fixedAttr = `fixed="${col.fixed}"`;
        }
        // 文本对齐
        const alignAttr = col.align ? `align="${col.align}"` : '';

        // th可视状态值
        const thVisibleAttr = `${TH_VISIBLE}=${getVisibleState(col.isShow)}`;

        let gmCreateAttr = '';
        let thName = '';
        let thText = '';
        let compileAttr = '';
        switch (col.key) {
            // 插件自动生成序号列
            case ORDER_KEY:
                gmCreateAttr = `${GM_CREATE}="true" gm-order`;
                thName = ORDER_KEY;
                thText = order.getThContent(settings);
                break;
            // 插件自动生成选择列
            case CHECKBOX_KEY:
                gmCreateAttr = `${GM_CREATE}="true" gm-checkbox`;
                thName = CHECKBOX_KEY;
                thText = checkbox.getThContent(checkboxConfig.useRadio);
                break;
            // 普通列
            default:
                gmCreateAttr = `${GM_CREATE}="false"`;
                thName = col.key;
                const obj = compileTh(settings, thName, col.text);
                thText = obj.text;
                compileAttr = obj.compileAttr;
                break;
        }

        // 嵌入拖拽事件标识, 以下情况除外
        // 1.插件自动生成列
        // 2.禁止使用个性配置功能的列
        let dragClassName = '';
        if (supportDrag && !col.isAutoCreate && !col.disableCustomize) {
            dragClassName = CLASS_DRAG_ACTION;
        }

        return {
            thName,
            thText,
            compileAttr,
            sortingAttr,
            alignAttr,
            filterAttr,
            fixedAttr,
            remindAttr,
            dragClassName,
            thVisibleAttr,
            gmCreateAttr,
            thStyle: `style="width:${col.width || 'auto'}"`
        };
    }
}
export default new Render();
