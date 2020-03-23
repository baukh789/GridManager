/*
 * checkbox: 数据选择/全选/返选
 * */
import { CHECKBOX_WIDTH,
    TR_CACHE_KEY,
    CHECKBOX_KEY,
    ROW_DISABLED_CHECKBOX,
    CHECKBOX_DISABLED_KEY,
    CHECKED,
    INDETERMINATE,
    UNCHECKED,
    CHECKED_CLASS,
    INDETERMINATE_CLASS } from '@common/constants';
import jTool from '@jTool';
import { each, isNumber } from '@jTool/utils';
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

// 禁止选择class
const disabledClass = 'disabled-selected';


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
        each($tbodyCheckWrap, (index, wrap) => {
            const $wrap = jTool(wrap);
            const checkbox = jTool('.gm-checkbox', $wrap);
            if (!checkbox.hasClass('gm-checkbox-checked')) {
                getCheckedData(_).length >= max  ? $wrap.addClass(disabledClass) : $wrap.removeClass(disabledClass);
            }
        });

        // 设置全选禁用状态
        $tbodyCheckWrap.length > max ? $allCheck.addClass(disabledClass) : $allCheck.removeClass(disabledClass);
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
                const rowData = getRowData(_, this, true);
                const $checkboxWrap = jTool('td[gm-checkbox] label', this);

                if (
                    // 当前行数据未指定禁止选中
                    !rowData[ROW_DISABLED_CHECKBOX] &&

                    // 当前选择框DOM上未被指定禁止选中
                    !$checkboxWrap.hasClass(disabledClass) &&

                    // 当前事件源非单选框或多选框(防止多次触发);
                    [].indexOf.call(e[TARGET].classList, 'gm-radio-checkbox-input') === -1) {
                    $checkboxWrap.find('input').trigger('click');
                }
            });
        }
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
	 * 获取Th内容
	 * @param useRadio: 是否使用单选
	 * @returns {string}
     */
    getThContent(useRadio) {
        return useRadio ? '' : this.getCheckboxTpl({});
	}

	/**
	 * 获取TD: 选择列对象
	 * @param conf
	 * @returns {parseData}
	 */
	getColumn(conf) {
		return {
			key: CHECKBOX_KEY,
			text: '',
			isAutoCreate: true,
			isShow: true,
            disableCustomize: true,
			width: CHECKBOX_WIDTH,
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
     * @returns {parseData}
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
     * @returns {parseData}
     */
    @parseTpl(checkboxTpl)
    getCheckboxTpl(params) {
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
     * @returns {parseData}
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
