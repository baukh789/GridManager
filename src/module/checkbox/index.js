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
import jTool from '@common/jTool';
import { getQuerySelector, getTable, clearTargetEvent } from '@common/base';
import { getSettings, getCheckedData, getRowData } from '@common/cache';
import { parseTpl } from '@common/parse';
import ajaxPage from '../ajaxPage';
import columnTpl from './column.tpl.html';
import checkboxTpl from './checkbox.tpl.html';
import radioTpl from './radio.tpl.html';
import { getEvent, eventMap } from './event';
import { resetData } from './tool';
import './style.less';
import {jEach} from '../../common/utils';

class Checkbox {
	/**
     * 初始化选择框事件
     * @param gridManagerName
     */
    init(gridManagerName) {
        eventMap[gridManagerName] = getEvent(gridManagerName, getQuerySelector(gridManagerName));

        const _this = this;
        const { allChange, checkboxChange, radioChange, trChange } = eventMap[gridManagerName];
        const { checkboxConfig, checkedBefore, checkedAllBefore, checkedAfter, checkedAllAfter } = getSettings(gridManagerName);
        const { max, useRowCheck } = checkboxConfig;

        // th内的全选
        jTool(allChange.target).on(allChange.events, allChange.selector, function () {
            let checkedData = getCheckedData(gridManagerName);
            const input = this.querySelector('.gm-checkbox-input');
            const checked = input.checked;
            checkedBefore(checkedData, !checked);
            if (checkedAllBefore(checkedData, !checked) === false) {
                input.checked = !checked;
                return;
            }
            const tableData = resetData(gridManagerName, checked, true);
            _this.resetDOM(gridManagerName, tableData);
            checkedData = getCheckedData(gridManagerName);

            checkedAfter(checkedData, checked);
            checkedAllAfter(checkedData, checked);
        });

        // td内的多选
        jTool(checkboxChange.target).on(checkboxChange.events, checkboxChange.selector, function () {
            const tr = jTool(this).closest('tr').get(0);
            const input = this.querySelector('.gm-checkbox-input');
            const checked = input.checked;

            if (checkedBefore(getCheckedData(gridManagerName), !checked, getRowData(gridManagerName, tr)) === false) {
                input.checked = !checked;
                return;
            }
            const cacheKey = tr.getAttribute(TR_CACHE_KEY);
            const tableData = resetData(gridManagerName, checked, false, cacheKey);
            _this.resetDOM(gridManagerName, tableData, false, max);
            checkedAfter(getCheckedData(gridManagerName), checked, getRowData(gridManagerName, tr));
        });

        // td内的单选
        jTool(radioChange.target).on(radioChange.events, radioChange.selector, function () {
            const tr = jTool(this).closest('tr').get(0);
            const input = this.querySelector('.gm-radio-input');
            const checked = input.checked;

            if (checkedBefore(getCheckedData(gridManagerName), !checked, getRowData(gridManagerName, tr)) === false) {
                input.checked = !checked;
                return;
            }
            const cacheKey = tr.getAttribute(TR_CACHE_KEY);
            const tableData = resetData(gridManagerName, undefined, false, cacheKey, true);
            _this.resetDOM(gridManagerName, tableData, true);

            checkedAfter(getCheckedData(gridManagerName), true, getRowData(gridManagerName, tr));
        });

        // tr点击选中
        if (useRowCheck) {
            jTool(trChange.target).on(trChange.events, trChange.selector, function (e) {
                const rowData = getRowData(gridManagerName, this, true);

                // 触发选中事件: 1.当前行非禁止选中 2.当前事件源非单选框或多选框;
                if (!rowData[ROW_DISABLED_CHECKBOX] && [].indexOf.call(e.target.classList, 'gm-radio-checkbox-input') === -1) {
                    this.querySelector('td[gm-checkbox] input.gm-radio-checkbox-input').click();
                }
            });
        }
    }

	/**
	 * 获取当前页选中的行
	 * @param gridManagerName
	 * @returns {NodeListOf<Element>}
	 */
	getCheckedTr(gridManagerName) {
		return document.querySelectorAll(`${getQuerySelector(gridManagerName)} tbody tr[checked="true"]`);
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
			align: 'center',
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
	 * 重置选择框DOM
	 * @param gridManagerName
	 * @param tableData
	 * @param useRadio: 当前事件源为单选
     */
	resetDOM(gridManagerName, tableData, useRadio, max) {
	    const $table = getTable(gridManagerName);

	    // 更改tbody区域选中状态
        let checkedNum = 0;
        let usableLen = tableData.length;
		tableData && tableData.forEach((row, index) => {
		    const isChecked = row[CHECKBOX_KEY];
			const $tr = jTool(`tbody tr[${TR_CACHE_KEY}="${index}"]`, $table);
            const $checkSpan = jTool('td[gm-checkbox] .gm-radio-checkbox', $tr);
			$tr.attr(CHECKED, isChecked);
            useRadio ? this.updateRadioState($checkSpan, isChecked) : this.updateCheckboxState($checkSpan, isChecked ? CHECKED : UNCHECKED);

            row[ROW_DISABLED_CHECKBOX] && usableLen--;
            (!row[ROW_DISABLED_CHECKBOX] && isChecked) && checkedNum++;
		});

		// 更新thead区域选中状态
        const $allCheck = jTool('thead tr th[gm-checkbox] .gm-checkbox-wrapper', $table);
        const $allCheckSpan = jTool('.gm-checkbox ', $allCheck);

        // [checked: 选中, indeterminate: 半选中, unchecked: 未选中]
        !useRadio && this.updateCheckboxState($allCheckSpan, checkedNum === 0 ? UNCHECKED : (checkedNum === usableLen ? CHECKED : INDETERMINATE));

		// 更新底部工具条选中描述信息
        ajaxPage.updateCheckedInfo(gridManagerName);

        if (!useRadio && max) {
            const $tbodyCheckWrap = jTool('tbody .gm-checkbox-wrapper ', $table);
            const disabled = 'disabled-selected';
            jEach($tbodyCheckWrap, (index, wrap) => {
                const $wrap = jTool(wrap);
                const checkbox = jTool('.gm-checkbox', $wrap);
                if (!checkbox.hasClass('gm-checkbox-checked')) {
                    getCheckedData(gridManagerName).length >= max  ? $wrap.addClass(disabled) : $wrap.removeClass(disabled);
                }
            });
            $tbodyCheckWrap.length > max ? $allCheck.addClass(disabled) : $allCheck.removeClass(disabled);
        }
	}

    /**
     * 更新单选框状态
     * @param $radio
     * @param state Boolean
     */
    updateRadioState($radio, state) {
        const $input = jTool('input[type="radio"]', $radio);
        if (state) {
            $radio.addClass('gm-radio-checked');
        } else {
            $radio.removeClass('gm-radio-checked');
        }
        $input.prop(CHECKED, state);
    }

    /**
     * 更新checkbox选中状态
     * @param $checkbox: '<span class="gm-checkbox"></span>'
     * @param state: [checked: 选中, indeterminate: 半选中, uncheck: 未选中]
     */
    updateCheckboxState($checkbox, state) {
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
    }

	/**
	 * 消毁
	 * @param gridManagerName
	 */
	destroy(gridManagerName) {
		clearTargetEvent(eventMap[gridManagerName]);
	}
}
export default new Checkbox();
