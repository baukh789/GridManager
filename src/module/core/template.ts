import ajaxPage from '../ajaxPage';
import { CLASS_DRAG_ACTION } from '../drag/constants';
import { PX, WRAP_KEY, DIV_KEY, ORDER_KEY, CHECKBOX_KEY, FOLD_KEY, GM_CREATE, CELL_HIDDEN, DISABLE_CUSTOMIZE, MOVEROW_KEY } from '@common/constants';
import { isUndefined, isString, isObject } from '@jTool/utils';
import { compileTh } from '@common/framework';
import { parseTpl } from '@common/parse';
import config from '../config';
import wrapTpl from './wrap.tpl.html';
import thTpl from './th.tpl.html';
import remind from '@module/remind';
import sort from '@module/sort';
import filter from '@module/filter';
import adjust from '@module/adjust';
import { Column, SettingObj, ThTemplate } from 'typings/types';

/**
 * 生成构建时所需要的模板
 */
class Template {
    /**
     * 生成table wrap 模板
     * @param params
     * @returns {}
     */
    @parseTpl(wrapTpl)
    getWrapTpl(params: { settings: SettingObj }): string {
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

		// @ts-ignore
        return {
            wrapKey: `${WRAP_KEY}="${_}"`,
            divKey: `${DIV_KEY}="${_}"`,
            classNames: wrapClassList.join(' '),
            configTpl: supportConfig ? config.createHtml({_, configInfo}) : '',
            ajaxPageTpl: supportAjaxPage ? ajaxPage.createHtml({ settings, tpl: ajaxPageTemplate }) : ''
        };
    }

    /**
     * 获取table th 模板
     * @param params
     * @returns {}
     */
    @parseTpl(thTpl)
    getThTpl(params: { settings: SettingObj, col: Column }): string {
        const { settings, col } = params;
        const { query, supportDrag, sortData, sortUpText, sortDownText, supportAdjust } = settings;

        // 表头提醒
        let remindAttr = '';
        let remindHtml = '';
        if (col.remind) {
            remindAttr = 'remind';
			remindHtml = remind.createHtml({ remind: col.remind });
        }

        // 排序
        let sortAttr = '';
        let sortHtml = '';
        if (isString(col.sorting)) {
            if (col.sorting === sortDownText) {
                sortAttr = `sorting="${sortDownText}"`;
                sortData[col.key] = sortDownText;
            } else if (col.sorting === sortUpText) {
                sortAttr = `sorting="${sortUpText}"`;
                sortData[col.key] = sortUpText;
            } else {
                sortAttr = 'sorting';
            }
			sortHtml = sort.createHtml({ type: col.sorting, sortUpText, sortDownText });
        }

        // 过滤
        let filterAttr = '';
        let filterHtml = '';
        if (isObject(col.filter)) {
            filterAttr = 'filter';
            if (isUndefined(col.filter.selected)) {
                col.filter.selected = query[col.key];
            } else {
                query[col.key] = col.filter.selected;
            }
			filterHtml = filter.createHtml({settings, columnFilter: col.filter});
        }

		// 嵌入宽度调整事件源,以下情况除外
		// 1.插件自动生成的选择列和序号列不做事件绑定
		// 2.禁止使用个性配置功能的列
		let adjustHtml = '';
		if (supportAdjust && !col[DISABLE_CUSTOMIZE]) {
			adjustHtml = adjust.html;
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
        let thText = <string>col.text;
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
            // 插件自动移动行列
            case MOVEROW_KEY:
                gmCreateAttr = GM_CREATE;
                break;
            // 普通列
            default:
                const obj = compileTh(settings, thName, <ThTemplate>col.text);
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
        let width = 'auto';
        if (col.width) {
            width = col.width + PX;
        }

		// @ts-ignore
        return {
            thAttr: `th-name="${thName}" ${colspanAttr} ${rowspanAttr} style="width:${width}" ${cellHiddenAttr} ${alignAttr} ${sortAttr} ${filterAttr} ${fixedAttr} ${remindAttr} ${gmCreateAttr}`,
            thTextClassName,
            thText,
            compileAttr,
			remindHtml,
			sortHtml,
			filterHtml,
			adjustHtml
        };
    }
}
export default new Template();
