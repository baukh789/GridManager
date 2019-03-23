import remind from '../remind';
import order from '../order';
import ajaxPage from '../ajaxPage';
import jTool from '@common/jTool';
import base from '@common/base';
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

        // 将 columnMap 转换为 数组
        // 转换的原因是为了处理用户记忆
        const columnList = [];
        if (settings.disableCache) {
            jTool.each(settings.columnMap, (key, col) => {
                columnList.push(col);
            });
        } else {
            jTool.each(settings.columnMap, (key, col) => {
                columnList[col.index] = col;
            });
        }

        // 将表头提醒启用状态重置
        remind.enable = false;

        // 将排序启用状态重置
        sort.enable = false;

        // 将筛选条件重置
        filter.enable = false;

        let thListTpl = '';
        // columnList 生成thead
        jTool.each(columnList, (index, col) => {
            thListTpl += this.createThTpl({settings, col});
        });

        return {
            tableHeadKey: base.tableHeadKey,
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

        // 表头提醒
        let remindAttr = '';
        if (typeof (col.remind) === 'string' && col.remind !== '') {
            remindAttr = `remind=${col.remind}`;
            remind.enable = true;
        }

        // 排序
        let sortingAttr = '';
        if (typeof (col.sorting) === 'string') {
            sort.enable = true;
            if (col.sorting === settings.sortDownText) {
                // th.setAttribute('sorting', settings.sortDownText);
                sortingAttr = `sorting="${settings.sortDownText}"`;
                settings.sortData[col.key] = settings.sortDownText;
            } else if (col.sorting === settings.sortUpText) {
                // th.setAttribute('sorting', settings.sortUpText);
                sortingAttr = `sorting="${settings.sortUpText}"`;
                settings.sortData[col.key] = settings.sortUpText;
            } else {
                sortingAttr = 'sorting=""';
            }
        }

        // 过滤
        let filterAttr = '';
        if (jTool.type(col.filter) === 'object') {
            filter.enable = true;
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
        let checkboxAttr = '';
        let orderAttr = '';
        switch (col.key) {
            // 插件自动生成序号列
            case order.key:
                gmCreateAttr = 'gm-create="true"';
                thName = order.key;
                orderAttr = 'gm-order="true"';
                thText = order.getThContent(settings);
                break;
            // 插件自动生成选择列
            case checkbox.key:
                gmCreateAttr = 'gm-create="true"';
                thName = checkbox.key;
                checkboxAttr = 'gm-checkbox="true"';
                thText = checkbox.getThContent(settings.useRadio);
                break;
            // 普通列
            default:
                gmCreateAttr = 'gm-create="false"';
                thName = col.key;
                thText = col.text;
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
            checkboxAttr,
            orderAttr,
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
