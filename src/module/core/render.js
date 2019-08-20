import remind from '../remind';
import order from '../order';
import ajaxPage from '../ajaxPage';
import jTool from '@common/jTool';
import { WRAP_KEY, DIV_KEY, TABLE_HEAD_KEY, ORDER_KEY, CHECKBOX_KEY } from '@common/constants';
import base from '@common/base';
import framework from '@common/framework';
import { parseTpl } from '../../common/parse';
import filter from '../filter';
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
        const { gridManagerName, skinClassName, isIconFollowText, disableBorder, supportConfig, supportAjaxPage, configInfo, ajaxPageTemplate } = settings;
        const wrapClassList = [];
        // 根据参数增加皮肤标识
        if (skinClassName && typeof skinClassName === 'string' && skinClassName.trim()) {
            wrapClassList.push(skinClassName);
        }

        // 根据参数，增加表头的icon图标是否跟随文本class
        if (isIconFollowText) {
            wrapClassList.push('icon-follow-text');
        }

        // 根据参数增加禁用禁用边框线标识
        if (disableBorder) {
            wrapClassList.push('disable-border');
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

        jTool.each(columnMap, (key, col) => {
            columnList[col.index] = col;
        });

        // 将表头提醒启用状态重置
        remind.enable[gridManagerName] = false;

        // 将排序启用状态重置
        sort.enable[gridManagerName] = false;

        // 将筛选条件重置
        filter.enable[gridManagerName] = false;

        let thListTpl = '';
        // columnList 生成thead
        jTool.each(columnList, (index, col) => {
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
        const { gridManagerName, sortUpText, sortDownText } = settings;

        // 表头提醒
        let remindAttr = '';
        if (col.remind) {
            remindAttr = 'remind';
            remind.enable[gridManagerName] = true;
        }

        // 排序
        let sortingAttr = '';
        if (typeof (col.sorting) === 'string') {
            sort.enable[gridManagerName] = true;
            if (col.sorting === sortDownText) {
                sortingAttr = `sorting="${sortDownText}"`;
                settings.sortData[col.key] = sortDownText;
            } else if (col.sorting === sortUpText) {
                sortingAttr = `sorting="${sortUpText}"`;
                settings.sortData[col.key] = sortUpText;
            } else {
                sortingAttr = 'sorting=""';
            }
        }

        // 过滤
        let filterAttr = '';
        if (jTool.type(col.filter) === 'object') {
            filter.enable[gridManagerName] = true;
            filterAttr = 'filter=""';
            if (typeof (col.filter.selected) === 'undefined') {
                col.filter.selected = settings.query[col.key];
            } else {
                settings.query[col.key] = col.filter.selected;
            }
        }

        // 文本对齐
        const alignAttr = col.align ? `align="${col.align}"` : '';

        // th可视状态值
        let thVisible = base.getVisibleState(col.isShow);

        let gmCreateAttr = '';
        let thName = '';
        let thText = '';
        let compileAttr = '';
        switch (col.key) {
            // 插件自动生成序号列
            case ORDER_KEY:
                gmCreateAttr = 'gm-create="true" gm-order';
                thName = ORDER_KEY;
                thText = order.getThContent(settings);
                break;
            // 插件自动生成选择列
            case CHECKBOX_KEY:
                gmCreateAttr = 'gm-create="true" gm-checkbox="true"';  // TODO 需要将true进行移除
                thName = CHECKBOX_KEY;
                thText = checkbox.getThContent(settings.useRadio);
                break;
            // 普通列
            default:
                gmCreateAttr = 'gm-create="false"';
                thName = col.key;
                thText = col.text;
                compileAttr = framework.compileTh(settings, thText);
                break;
        }

        // 嵌入拖拽事件标识, 以下情况除外
        // 1.插件自动生成列
        // 2.禁止使用个性配置功能的列
        let dragClassName = '';
        if (settings.supportDrag && !col.isAutoCreate && !col.disableCustomize) {
            dragClassName = 'drag-action';
        }

        return {
            thName,
            thText,
            compileAttr,
            sortingAttr,
            alignAttr,
            filterAttr,
            remindAttr,
            dragClassName,
            thVisible,
            gmCreateAttr,
            thStyle: `style="width:${col.width || 'auto'}"`
        };
    }
}
export default new Render();
