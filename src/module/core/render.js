import ajaxPage from '../ajaxPage';
import { CLASS_DRAG_ACTION } from '../drag/constants';
import { WRAP_KEY, DIV_KEY, TABLE_HEAD_KEY, ORDER_KEY, CHECKBOX_KEY, FOLD_KEY, GM_CREATE, CELL_HIDDEN, DISABLE_CUSTOMIZE } from '@common/constants';
import { isUndefined, isString, isObject, each } from '@jTool/utils';
import { compileTh } from '@common/framework';
import { parseTpl } from '@common/parse';
import config from '../config';
import nested from '../nested';
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
     * @returns {}
     */
    @parseTpl(wrapTpl)
    createWrapTpl(params) {
        const settings = params.settings;
        const { _, skinClassName, isIconFollowText, disableBorder, disableLine, supportConfig, supportAjaxPage, configInfo, ajaxPageTemplate } = settings;
        const wrapClassList = ['table-wrap'];

        // 根据参数增加皮肤标识
        if (skinClassName && isString(skinClassName) && skinClassName.trim()) {
            wrapClassList.push(skinClassName);
        }

        // 根据参数，增加表头的icon图标是否跟随文本class
        if (isIconFollowText) {
            wrapClassList.push('gm-icon-follow-text');
        }

        // 根据参数增加禁用边框线标识
        if (disableBorder) {
            wrapClassList.push('disable-border');
        }
        // 根据参数增加禁用单元格分割线标识
        if (disableLine) {
            wrapClassList.push('disable-line');
        }
        return {
            wrapKey: `${WRAP_KEY}="${_}"`,
            divKey: `${DIV_KEY}="${_}"`,
            classNames: wrapClassList.join(' '),
            configTpl: supportConfig ? config.createHtml({_, configInfo}) : '',
            ajaxPageTpl: supportAjaxPage ? ajaxPage.createHtml({settings, tpl: ajaxPageTemplate}) : ''
        };
    }

    /**
     * 生成table head 模板
     * @param params
     * @returns {}
     */
    @parseTpl(theadTpl)
    createTheadTpl(params) {
        const settings = params.settings;
        const { columnMap, _, __isNested } = settings;

        const columnList = [[]];
        const topList = columnList[0];

        // 多层嵌套，进行递归处理
        if (__isNested) {
            nested.push(columnMap, columnList);
        } else {
            each(columnMap, (key, col) => {
                topList[col.index] = col;
            });
        }

        let thListTpl = '';
        // columnList 生成thead
        each(columnList, list => {
            thListTpl += '<tr>';
            each(list, col => {
                thListTpl += this.createThTpl({settings, col});
            });
            thListTpl += '</tr>';
        });

        return {
            key: `${TABLE_HEAD_KEY}="${_}"`,
            thListTpl
        };
    }

    /**
     * 生成table th 模板
     * @param params
     * @returns {}
     */
    @parseTpl(thTpl)
    createThTpl(params) {
        const { settings, col } = params;
        const { query, supportDrag, sortData, sortUpText, sortDownText } = settings;

        // 表头提醒
        let remindAttr = '';
        if (col.remind) {
            remindAttr = 'remind';
        }

        // 排序
        let sortingAttr = '';
        if (isString(col.sorting)) {
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
            fixedAttr = `fixed="${col.fixed}"`;
        }
        // 文本对齐
        const alignAttr = col.align ? `align="${col.align}"` : '';

        // th不可见状态值
        const cellHiddenAttr = col.isShow ? '' : CELL_HIDDEN;

        let gmCreateAttr = '';
        let thName = col.key;
        let thText = col.text;
        let compileAttr = '';
        switch (col.key) {
            // 插件自动生成序号列
            case ORDER_KEY:
                gmCreateAttr = `${GM_CREATE} gm-order`;
                break;
            // 插件自动生成选择列
            case CHECKBOX_KEY:
                gmCreateAttr = `${GM_CREATE} gm-checkbox`;
                break;
            // 插件自动生成折叠列
            case FOLD_KEY:
                gmCreateAttr = GM_CREATE;
                break;
            // 普通列
            default:
                const obj = compileTh(settings, thName, col.text);
                thText = obj.text;
                compileAttr = obj.compileAttr;
                break;
        }

        // 嵌入拖拽事件标识, 以下情况除外
        // 1.组件自动生成列
        // 2.禁止使用个性配置功能的列
        let thTextClassName = 'th-text';
        if (supportDrag && !col.isAutoCreate && !col[DISABLE_CUSTOMIZE]) {
            thTextClassName = `${thTextClassName} ${CLASS_DRAG_ACTION}`;
        }

        // 嵌入colspan rowspan
        const colspanAttr = isUndefined(col.colspan) ? '' : `colspan="${col.colspan}"`;
        const rowspanAttr = isUndefined(col.rowspan) ? '' : `rowspan="${col.rowspan}"`;
        return {
            thAttr: `th-name="${thName}" ${colspanAttr} ${rowspanAttr} style="width:${col.width || 'auto'}" ${cellHiddenAttr} ${alignAttr} ${sortingAttr} ${filterAttr} ${fixedAttr} ${remindAttr} ${gmCreateAttr}`,
            thTextClassName,
            thText,
            compileAttr
        };
    }
}
export default new Render();
