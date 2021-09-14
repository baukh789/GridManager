/**
 * checkbox[数据选择/全选/返选]
 * 支持单选与复选，其中复选支持三种选中状态: 选中、未选中、半选中。
 * /src/module/config中使用到的部分复选功能也来自于这里。
 *
 * 参数说明:
 *  - supportCheckbox: 配置是否支持选择与反选
 *      - type: Boolean
 *      - default: true
 *  - checkboxConfig: 选择功能配置
 *      - type: Object
 *      - default: {
 *          // 是否通过点击行来进行选中
 *          useRowCheck: false,
 *
 *          // 当前选中操作是否使用单选
 *          useRadio: false,
 *
 *          // 指定选中操作精准匹配字段，该值需保证每条数据的唯一性。默认不指定，对整条数据进行匹配。
 *          key: undefined, // 配置此项可提升选中操作性能, 数据量越大越明显。
 *
 *          // 复选时最大可选数，生效条件: supportCheckbox === true && useRadio === false
 *          max:undefined,
 *
 *          // 是否使用固定列, 默认为undefined
 *          // 接收两种值: 'left', 'right'
 *          fixed: undefined
 *       }
 *
 * 事件说明:
 *  - checkedBefore: 选中/取消选中行, 执行前事件。
 *      - note: 该事件会接收返回值，当返回false时将中止选中事件，该返回值对全选事件无效。
 *      - arguments:
 *          - checkedList: 已选中行数据,数组类型
 *          - isChecked: 当前的选中状态
 *          - rowData: 当前行数据
 *  - checkedAfter: 选中/取消选中行, 执行后事件
 *      - arguments:
 *          - checkedList: 已选中行数据,数组类型
 *          - isChecked: 当前的选中状态
 *          - rowData: 当前行数据
 *  - checkedAllBefore: 全选/反选, 执行前事件。
 *      - note: 该事件会接收返回值，当返回false时将中止全选事件。
 *      - arguments:
 *          - checkedList: 已选中行数据,数组类型
 *          - isChecked: 当前的选中状态
 *  - checkedAllAfter: 全选/反选, 执行后事件
 *      - arguments:
 *          - checkedList: 已选中行数据,数组类型
 *          - isChecked: 当前的选中状态
 */
import {
    TR_CACHE_KEY,
    CHECKBOX_KEY,
    ROW_DISABLED_CHECKBOX,
    CHECKBOX_DISABLED_KEY,
    CHECKED,
    INDETERMINATE,
    UNCHECKED,
    CHECKED_CLASS,
    TR_PARENT_KEY,
    INDETERMINATE_CLASS } from '@common/constants';
import jTool from '@jTool';
import { each, isNumber, isString } from '@jTool/utils';
import { getQuerySelector, getTable, clearTargetEvent } from '@common/base';
import { getSettings, getCheckedData, getRowData } from '@common/cache';
import { parseTpl } from '@common/parse';
import ajaxPage from '../ajaxPage';
import columnTpl from './column.tpl.html';
import checkboxTpl from './checkbox.tpl.html';
import radioTpl from './radio.tpl.html';
import { getEvent, eventMap } from './event';
import { EVENTS, TARGET, SELECTOR } from '@common/events';
import { resetData } from './tool';
import './style.less';

// 禁止选择标识
const DISABLED_SELECTED = 'disabled-selected';

/**
 * 更新单选框状态
 * @param $radio
 * @param state Boolean
 */
export const updateRadioState = ($radio, state) => {
    const $input = jTool('input[type="radio"]', $radio);
    const className = 'gm-radio-checked';
    if (state) {
        $radio.addClass(className);
    } else {
        $radio.removeClass(className);
    }
    $input.prop(CHECKED, state);
};

/**
 * 更新checkbox选中状态
 * @param $checkbox: '<span class="gm-checkbox"></span>'
 * @param state: [checked: 选中, indeterminate: 半选中, uncheck: 未选中]
 */
export const updateCheckboxState = ($checkbox, state) => {
    const $input = jTool('input[type="checkbox"]', $checkbox);
    switch (state) {
        case CHECKED: {
            $checkbox.addClass(CHECKED_CLASS);
            $checkbox.removeClass(INDETERMINATE_CLASS);
            $input.prop(CHECKED, true);
            break;
        }
        case INDETERMINATE: {
            $checkbox.removeClass(CHECKED_CLASS);
            $checkbox.addClass(INDETERMINATE_CLASS);
            $input.prop(CHECKED, false);
            break;
        }
        case UNCHECKED: {
            $checkbox.removeClass(CHECKED_CLASS);
            $checkbox.removeClass(INDETERMINATE_CLASS);
            $input.prop(CHECKED, false);
            break;
        }
    }
};

/**
 * 重置选择框DOM
 * @param _
 * @param tableData
 * @param useRadio: 当前事件源为单选
 * @param max: 最大选择数
 */
export const resetCheckboxDOM = (_, tableData, useRadio, max) => {
    const $table = getTable(_);

    // 更改tbody区域选中状态
    let checkedNum = 0;
    let usableLen = tableData.length;
    tableData && tableData.forEach((row, index) => {
        const isChecked = row[CHECKBOX_KEY];
        const $tr = jTool(`tbody tr[${TR_CACHE_KEY}="${index}"]`, $table);
        const $checkSpan = jTool('td[gm-checkbox] .gm-radio-checkbox', $tr);
        $tr.attr(CHECKED, isChecked);
        useRadio ? updateRadioState($checkSpan, isChecked) : updateCheckboxState($checkSpan, isChecked ? CHECKED : UNCHECKED);

        row[ROW_DISABLED_CHECKBOX] && usableLen--;
        (!row[ROW_DISABLED_CHECKBOX] && isChecked) && checkedNum++;
    });

    // 更新thead区域选中状态
    const $allCheck = jTool('thead tr th[gm-checkbox] .gm-checkbox-wrapper', $table);
    const $allCheckSpan = jTool('.gm-checkbox ', $allCheck);

    // [checked: 选中, indeterminate: 半选中, unchecked: 未选中]
    !useRadio && updateCheckboxState($allCheckSpan, checkedNum === 0 ? UNCHECKED : (checkedNum === usableLen ? CHECKED : INDETERMINATE));

    // 更新底部工具条选中描述信息
    ajaxPage.updateCheckedInfo(_);

    if (!useRadio && isNumber(max)) {
        const $tbodyCheckWrap = jTool('tbody .gm-checkbox-wrapper ', $table);
        each($tbodyCheckWrap, wrap => {
            const $wrap = jTool(wrap);
            const checkbox = jTool('.gm-checkbox', $wrap);
            if (!checkbox.hasClass('gm-checkbox-checked')) {
                getCheckedData(_).length >= max  ? $wrap.addClass(DISABLED_SELECTED) : $wrap.removeClass(DISABLED_SELECTED);
            }
        });

        // 设置全选禁用状态
        $tbodyCheckWrap.length > max ? $allCheck.addClass(DISABLED_SELECTED) : $allCheck.removeClass(DISABLED_SELECTED);
    }
};

class Checkbox {
	/**
     * 初始化选择框事件
     * @param _
     */
    init(_) {
        eventMap[_] = getEvent(_, getQuerySelector(_));

        const { allChange, checkboxChange, radioChange, trChange } = eventMap[_];
        const { checkboxConfig, checkedBefore, checkedAllBefore, checkedAfter, checkedAllAfter } = getSettings(_);
        const { max, useRowCheck } = checkboxConfig;

        // th内的全选
        jTool(allChange[TARGET]).on(allChange[EVENTS], allChange[SELECTOR], function () {
            let checkedData = getCheckedData(_);
            const input = this.querySelector('.gm-checkbox-input');
            const checked = input.checked;
            checkedBefore(checkedData, !checked);
            if (checkedAllBefore(checkedData, !checked) === false) {
                input.checked = !checked;
                return;
            }
            const tableData = resetData(_, checked, true);
            resetCheckboxDOM(_, tableData);
            checkedData = getCheckedData(_);

            checkedAfter(checkedData, checked);
            checkedAllAfter(checkedData, checked);
        });

        // td内的多选
        jTool(checkboxChange[TARGET]).on(checkboxChange[EVENTS], checkboxChange[SELECTOR], function () {
            const tr = jTool(this).closest('tr').get(0);
            const input = this.querySelector('.gm-checkbox-input');
            const checked = input.checked;

            if (checkedBefore(getCheckedData(_), !checked, getRowData(_, tr)) === false) {
                input.checked = !checked;
                return;
            }
            const cacheKey = tr.getAttribute(TR_CACHE_KEY);
            const tableData = resetData(_, checked, false, cacheKey);
            resetCheckboxDOM(_, tableData, false, max);
            checkedAfter(getCheckedData(_), checked, getRowData(_, tr));
        });

        // td内的单选
        jTool(radioChange[TARGET]).on(radioChange[EVENTS], radioChange[SELECTOR], function () {
            const tr = jTool(this).closest('tr').get(0);
            const input = this.querySelector('.gm-radio-input');
            const checked = input.checked;

            // 未使用 checked 而用 tr.getAttribute('checked') === 'true'的原因: 单选取到的checked值永远为true
            if (checkedBefore(getCheckedData(_), tr.getAttribute('checked') === 'true', getRowData(_, tr)) === false) {
                input.checked = !checked;
                return;
            }
            const cacheKey = tr.getAttribute(TR_CACHE_KEY);
            const tableData = resetData(_, undefined, false, cacheKey, true);
            resetCheckboxDOM(_, tableData, true);

            checkedAfter(getCheckedData(_), true, getRowData(_, tr));
        });

        // tr点击选中
        if (useRowCheck) {
            jTool(trChange[TARGET]).on(trChange[EVENTS], trChange[SELECTOR], function (e) {
                // 当前为子项: 子项不支持点击选中
                if (this.getAttribute(TR_PARENT_KEY)) {
                    return;
                }
                const rowData = getRowData(_, this, true);
                const $checkboxWrap = jTool('td[gm-checkbox] label', this);
                let $td = jTool(e.target);
                if (e.target.nodeName !== 'TD') {
                    $td = $td.closest('td');
                }

                if (
                    // 当前行数据未指定禁止选中
                    !rowData[ROW_DISABLED_CHECKBOX] &&

                    !isString($td.attr(DISABLED_SELECTED)) &&

                    // 当前选择框DOM上未被指定禁止选中
                    !$checkboxWrap.hasClass(DISABLED_SELECTED) &&

                    // 当前事件源非单选框或多选框(防止多次触发);
                    [].indexOf.call(e[TARGET].classList, 'gm-radio-checkbox-input') === -1) {
                    $checkboxWrap.find('input').trigger('click');
                }
            });
        }
    }

    /**
     * 增加行行选中标识
     * @param col
     */
    addSign(col) {
        return col.disableRowCheck ? DISABLED_SELECTED : '';
    }

    /**
	 * 获取当前页选中的行
	 * @param _
	 * @returns {NodeListOf<Element>}
	 */
	getCheckedTr(_) {
		return document.querySelectorAll(`${getQuerySelector(_)} tbody tr[checked="true"]`);
	}

	/**
	 * 获取col对象
	 * @param conf
	 * @returns {}
	 */
	getColumn(conf) {
		return {
			key: CHECKBOX_KEY,
			text: conf.useRadio ? '' : this.getCheckboxTpl({}),
			isAutoCreate: true,
			isShow: true,
            disableCustomize: true,
			width: conf.width,
            fixed: conf.fixed,
            // align: 'center',  // 调整为由样式控制
			template: (checked, row, index, isTop) => {
                return this.getColumnTemplate({checked, disabled: row[CHECKBOX_DISABLED_KEY], useRadio: conf.useRadio, isTop});
			}
		};
	}

    /**
     * 获取模板
     * @param params
     * params.isTop: 树型结构时该值将为false
     * @returns {}
     */
    @parseTpl(columnTpl)
	getColumnTemplate(params) {
	    const { checked, disabled, useRadio, isTop } = params;
	    const template = isTop ? (useRadio ? this.getRadioTpl({checked, disabled}) : this.getCheckboxTpl({checked, disabled})) : '';
        return {
            template
        };
    }

    /**
     * 获取checkbox模板
     * @param params
     * @returns {}
     */
    @parseTpl(checkboxTpl)
    getCheckboxTpl(params) {
        // 在th渲染时，params为空对像，选中状态由updateCheckboxState方法修改
        const { checked, disabled, label, value } = params;
        return {
            checked: checked ? CHECKED : UNCHECKED,
            disabled,
            label,
            value
        };
    }

    /**
     * 获取radio模板
     * @param params
     * @returns {}
     */
    @parseTpl(radioTpl)
    getRadioTpl(params) {
        const { checked, disabled, label, value } = params;
        return {
            checked,
            disabled,
            label,
            value
        };
    }

	/**
	 * 消毁
	 * @param _
	 */
	destroy(_) {
		clearTargetEvent(eventMap[_]);
	}
}
export default new Checkbox();
