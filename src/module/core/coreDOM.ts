import jTool from '@jTool';
import { rootDocument } from '@jTool/utils';
import {
	calcLayout,
	getTable,
	getWrap,
	getTbody,
	getQuerySelector,
	clearTargetEvent,
	setLineHeightValue
} from '@common/base';
import {
	TABLE_PURE_LIST,
	TABLE_BODY_KEY,
	TR_CACHE_KEY,
	TD_FOCUS
} from '@common/constants';
import { getRowData, getSettings } from '@common/cache';
import { tooltip } from '../remind';
import template from './template';
import { getEvent, eventMap } from './event';
import { TARGET, EVENTS, SELECTOR } from '@common/events';
import { JTool, SettingObj } from 'typings/types';

/**
 * core dom
 */
class Dom {
    init($table: JTool, settings: SettingObj): void {
        const { _, useWordBreak, lineHeight } = settings;
        // add wrap div
        $table.wrap(template.getWrapTpl({ settings }), '.table-div');

        // append thead
        $table.append(template.getTheadTpl({settings}));

        // 存储行高css变量
        setLineHeightValue(_, lineHeight);

        // 计算布局
        calcLayout(settings);

        // append tbody
        const tbody = rootDocument.createElement('tbody');
        tbody.setAttribute(TABLE_BODY_KEY, _);
        // 根据参数增加td断字标识
        if (useWordBreak) {
            tbody.setAttribute('word-break', '');
        }
        $table.append(tbody);

        // 绑定事件
        this.bindEvent(_);
    }

    /**
     * 为新生成的table下属元素绑定事件
     * @param _
     */
    bindEvent(_: string): void {
        const { rowHover, rowClick, cellHover, cellClick, useCellFocus } = getSettings(_);

        eventMap[_] = getEvent(getQuerySelector(_));
        const event = eventMap[_];

        // 行事件透出参数
        const getRowParams = (tr: HTMLTableRowElement) => {
            return [
                // row
                getRowData(_, tr),

                // rowIndex
                parseInt(tr.getAttribute(TR_CACHE_KEY), 10)
            ];
        };

        // 行事件: hover
        rowHover && (() => {
            let hoverTr: HTMLTableElement;
            const rowHoverEvent = event.rowHover;
            jTool(rowHoverEvent[TARGET]).on(rowHoverEvent[EVENTS], rowHoverEvent[SELECTOR], function () {
                // 防止hover在同一个行内多次触发
                if (hoverTr === this) {
                    return;
                }
                hoverTr = this;
                tooltip(_, this, rowHover(...getRowParams(this), this), () => {
                    hoverTr = null;
                });
            });

        })();

        // 行事件: click
        rowClick && (() => {
            const rowClickEvent = event.rowClick;
            jTool(rowClickEvent[TARGET]).on(rowClickEvent[EVENTS], rowClickEvent[SELECTOR], function () {
				tooltip(_, this, rowClick(...getRowParams(this), this));
            });
        })();

        // 单元格透出参数
        const getCellParams = (td: HTMLTableCellElement) => {
            const tr = td.parentNode as HTMLTableRowElement;
            return [
                // row
                getRowData(_, tr),

                // rowIndex
                parseInt(tr.getAttribute(TR_CACHE_KEY), 10),

                // colIndex
                td.cellIndex
            ];
        };

        // 单元格事件: hover
        cellHover && (() => {
            let hoverTd: HTMLTableCellElement;
            const cellHoverEvent = event.cellHover;
            jTool(cellHoverEvent[TARGET]).on(cellHoverEvent[EVENTS], cellHoverEvent[SELECTOR], function () {
                // 防止hover在同一个单元格内多次触发
                if (hoverTd === this) {
                    return;
                }
                hoverTd = this;
                tooltip(_, this, cellHover(...getCellParams(hoverTd), this), () => {
                    hoverTd = null;
                });
            });
        })();

        // 单元格事件: click
        cellClick && (() => {
            const cellClickEvent = event.cellClick;
            jTool(cellClickEvent[TARGET]).on(cellClickEvent[EVENTS], cellClickEvent[SELECTOR], function () {
                tooltip(_, this, cellClick(...getCellParams(this), this));
            });
        })();

        // 单元格触焦事件: mousedown
        useCellFocus && (() => {
            const cellFocusEvent = event.cellFocus;
            jTool(cellFocusEvent[TARGET]).on(cellFocusEvent[EVENTS], cellFocusEvent[SELECTOR], function () {
                getTbody(_).find(`[${TD_FOCUS}]`).removeAttr(TD_FOCUS);
                this.setAttribute(TD_FOCUS, '');
            });
        })();
    }

    /**
     * 消毁
     * @param _
     */
    destroy(_: string): void {
        clearTargetEvent(eventMap[_]);

        try {
            const $table = getTable(_);
            const $tableWrap = getWrap(_);
            // DOM有可能在执行到这里时, 已经被框架中的消毁机制清除
            if (!$table.length || !$tableWrap.length) {
                return;
            }

            // 清除因为实例而修改的属性
            const table = $table.get(0);
            TABLE_PURE_LIST.forEach(item => {
                let itemProp = table['__' + item];
                itemProp ? $table.attr(item, itemProp) : $table.removeAttr(item);
                delete table['__' + item];
            });

            // 还原table
            $table.html('');
            $tableWrap.after($table);
            $tableWrap.remove();
        } catch (e) {
            // '在清除GridManager实例的过程时, table被移除'
        }
    }
}
export default new Dom();
