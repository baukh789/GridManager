/*
 * checkbox: 数据选择/全选/返选
 * */
import './style.less';
import { CHECKBOX_WIDTH, TR_CACHE_KEY } from '@common/constants';
import jTool from '@common/jTool';
import base from '@common/base';
import cache from '@common/cache';
import { parseTpl } from '@common/parse';
import ajaxPage from '../ajaxPage';
import columnTpl from './column.tpl.html';
import checkboxTpl from './checkbox.tpl.html';
import radioTpl from './radio.tpl.html';
import getCheckboxEvent from './event';
import { TABLE_KEY } from '../../common/constants';

class Checkbox {
    eventMap = {};

    // 全选的唯一标识
	get key() {
		return 'gm_checkbox';
	}

    // 选中ClassName
	get checkedClassName() {
	    return 'gm-checkbox-checked';
    }

    // 半选中ClassName
    get indeterminateClassName() {
        return 'gm-checkbox-indeterminate';
    }

	/**
     * 初始化选择框事件
     * @param gridManagerName
     * @param useRowCheck: tr点击选中
     */
    init(gridManagerName, useRowCheck) {
        const _this = this;
        this.eventMap[gridManagerName] = getCheckboxEvent(gridManagerName, base.getQuerySelector(gridManagerName));
        const { allChange, checkboxChange, radioChange, trChange } = this.eventMap[gridManagerName];

        // th内的全选
        jTool(allChange.target).on(allChange.events, allChange.selector, function () {
            const settings = cache.getSettings(gridManagerName);
            let checkedData = cache.getCheckedData(gridManagerName);
            settings.checkedBefore(checkedData);
            settings.checkedAllBefore(checkedData);
            const tableData = _this.resetData(gridManagerName, this.checked, true);
            _this.resetDOM(settings, tableData);
            checkedData = cache.getCheckedData(gridManagerName);
            settings.checkedAfter(checkedData);
            settings.checkedAllAfter(checkedData);
        });

        // td内的多选
        jTool(checkboxChange.target).on(checkboxChange.events, checkboxChange.selector, function (e) {
            const settings = cache.getSettings(gridManagerName);

            settings.checkedBefore(cache.getCheckedData(gridManagerName));
            const tableData = _this.resetData(gridManagerName, this.checked, false, jTool(this).closest('tr').attr(TR_CACHE_KEY));
            _this.resetDOM(settings, tableData);
            settings.checkedAfter(cache.getCheckedData(gridManagerName));
        });

        // td内的单选
        jTool(radioChange.target).on(radioChange.events, radioChange.selector, function (e) {
            const settings = cache.getSettings(gridManagerName);

            settings.checkedBefore(cache.getCheckedData(gridManagerName));
            const tableData = _this.resetData(gridManagerName, undefined, false, jTool(this).closest('tr').attr(TR_CACHE_KEY), true);
            _this.resetDOM(settings, tableData, true);
            settings.checkedAfter(cache.getCheckedData(gridManagerName));
        });

        // tr点击选中
        if (useRowCheck) {
            jTool(trChange.target).on(trChange.events, trChange.selector, function (e) {
                // 当前事件源为非单选框或多选框时，触发选中事件
                if ([].indexOf.call(e.target.classList, 'gm-radio-checkbox-input') === -1) {
                    this.querySelector('td[gm-checkbox="true"] input.gm-radio-checkbox-input').click();
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
		return document.querySelectorAll(`[${TABLE_KEY}="${gridManagerName}"] tbody tr[checked="true"]`);
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
	 * @param settings
	 * @returns {parseData}
	 */
	getColumn(settings) {
		return {
			key: this.key,
			text: '',
			isAutoCreate: true,
			isShow: true,
            disableCustomize: true,
			width: CHECKBOX_WIDTH,
			align: 'center',
			template: checked => {
                return this.getColumnTemplate({checked, useRadio: settings.useRadio});
			}
		};
	}

    /**
     * 获取选行模板
     * @param params
     * @returns {parseData}
     */
    @parseTpl(columnTpl)
	getColumnTemplate(params) {
	    const { checked, useRadio } = params;
	    const template = useRadio ? this.getRadioTpl({checked}) : this.getCheckboxTpl({checked});
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
        const { checked, label, value } = params;
        return {
            checked: checked ? 'checked' : 'unchecked',
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
        const { checked, label, value } = params;
        return {
            checked,
            label,
            value
        };
    }

	/**
	 * 重置当前渲染数据中的选择状态
	 * @param gridManagerName
	 * @param status: 要变更的状态
	 * @param isAllCheck: 触发源是否为全选操作
	 * @param cacheKey: 所在行的key
	 * @param isRadio: 当前事件源为单选
     * @returns {*}
     */
	resetData(gridManagerName, status, isAllCheck, cacheKey, isRadio) {
		const tableData = cache.getTableData(gridManagerName);
		// 多选-全选
		if (isAllCheck && !cacheKey) {
			tableData.forEach(row => {
				row[this.key] = status;
			});
		}

		// 多选-单个操作
		if (!isAllCheck && cacheKey) {
			tableData[cacheKey][this.key] = status;
		}

		// 单选
        if (isRadio) {
            tableData.forEach((row, index) => {
                row[this.key] = index === parseInt(cacheKey, 10);
            });
        }

		// 存储数据
		cache.setTableData(gridManagerName, tableData);

		// 更新选中数据
		cache.setCheckedData(gridManagerName, tableData);

		return tableData;
	}

	/**
	 * 重置选择框DOM
	 * @param settings
	 * @param tableData
	 * @param useRadio: 当前事件源为单选
     */
	resetDOM(settings, tableData, useRadio) {
	    const $table = base.getTable(settings.gridManagerName);
		// 更改tbody区域选中状态
        let checkedNum = 0;
		tableData && tableData.forEach((row, index) => {
			const $tr = jTool(`tbody tr[${TR_CACHE_KEY}="${index}"]`, $table);
            const $checkSpan = jTool('td[gm-checkbox="true"] .gm-radio-checkbox', $tr);
			$tr.attr('checked', row[this.key]);
            useRadio ? this.updateRadioState($checkSpan, row[this.key]) : this.updateCheckboxState($checkSpan, row[this.key] ? 'checked' : 'unchecked');
            row[this.key] && checkedNum++;
		});

		// 更新thead区域选中状态
        const $allCheckSpan = jTool('thead tr th[gm-checkbox="true"] .gm-checkbox ', $table);

        // [checked: 选中, indeterminate: 半选中, unchecked: 未选中]
        !useRadio && this.updateCheckboxState($allCheckSpan, checkedNum === 0 ? 'unchecked' : (checkedNum === tableData.length ? 'checked' : 'indeterminate'));

		// 更新底部工具条选中描述信息
        ajaxPage.updateCheckedInfo(settings);
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
        $input.prop('checked', state);
    }

    /**
     * 更新checkbox选中状态
     * @param $checkbox: '<span class="gm-checkbox"></span>'
     * @param state: [checked: 选中, indeterminate: 半选中, uncheck: 未选中]
     */
    updateCheckboxState($checkbox, state) {
        const $input = jTool('input[type="checkbox"]', $checkbox);
        switch (state) {
            case 'checked': {
                $checkbox.addClass(this.checkedClassName);
                $checkbox.removeClass(this.indeterminateClassName);
                $input.prop('checked', true);
                break;
            }
            case 'indeterminate': {
                $checkbox.removeClass(this.checkedClassName);
                $checkbox.addClass(this.indeterminateClassName);
                $input.prop('checked', false);
                break;
            }
            case 'unchecked': {
                $checkbox.removeClass(this.checkedClassName);
                $checkbox.removeClass(this.indeterminateClassName);
                $input.prop('checked', false);
                break;
            }
        }
    }

	/**
	 * 消毁
	 * @param gridManagerName
	 */
	destroy(gridManagerName) {
		base.clearBodyEvent(this.eventMap[gridManagerName]);
	}
}
export default new Checkbox();
