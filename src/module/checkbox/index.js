/*
 * checkbox: 数据选择/全选/返选
 * */
import './style.less';
import { CHECKBOX_WIDTH } from '../../common/constants';
import { jTool, base, cache, parseTpl } from '../../common';
import ajaxPage from '../ajaxPage';
import columnTpl from './column.tpl.html';
import checkboxTpl from './checkbox.tpl.html';
import radioTpl from './radio.tpl.html';

class Checkbox {
	// 全选的唯一标识
	get key() {
		return 'gm_checkbox';
	}

    /**
     * 初始化选择框事件
     * @param $table
     * @param useRowCheck: tr点击选中
     */
    init($table, useRowCheck) {
        const _this = this;
        // th内的全选
        $table.off('click', 'th[gm-checkbox="true"] input[type="checkbox"]');
        $table.on('click', 'th[gm-checkbox="true"] input[type="checkbox"]', function () {
            const settings = cache.getSettings(base.getKey($table));

            settings.checkedBefore(cache.getCheckedData($table));
            settings.checkedAllBefore(cache.getCheckedData($table));
            const tableData = _this.resetData($table, this.checked, true);
            _this.resetDOM($table, settings, tableData);
            settings.checkedAfter(cache.getCheckedData($table));
            settings.checkedAllAfter(cache.getCheckedData($table));
        });

        // td内的多选
        $table.off('click', 'td[gm-checkbox="true"] input[type="checkbox"]');
        $table.on('click', 'td[gm-checkbox="true"] input[type="checkbox"]', function (e) {
            const settings = cache.getSettings(base.getKey($table));

            settings.checkedBefore(cache.getCheckedData($table));
            const tableData = _this.resetData($table, this.checked, false, jTool(this).closest('tr').attr('cache-key'));
            _this.resetDOM($table, settings, tableData);
            settings.checkedAfter(cache.getCheckedData($table));
        });

        // td内的单选
        $table.off('click', 'td[gm-checkbox="true"] input[type="radio"]');
        $table.on('click', 'td[gm-checkbox="true"] input[type="radio"]', function (e) {
            const settings = cache.getSettings(base.getKey($table));

            settings.checkedBefore(cache.getCheckedData($table));
            const tableData = _this.resetData($table, undefined, false, jTool(this).closest('tr').attr('cache-key'), true);
            _this.resetDOM($table, settings, tableData, true);
            settings.checkedAfter(cache.getCheckedData($table));
        });

        // tr点击选中
        if (useRowCheck) {
            $table.off('click', 'tbody > tr');
            $table.on('click', 'tbody > tr', function (e) {
                // 当前事件源为非单选框或多选框时，触发选中事件
                if ([].indexOf.call(e.target.classList, 'gm-radio-checkbox-input') === -1) {
                    this.querySelector('td[gm-checkbox="true"] input.gm-radio-checkbox-input').click();
                }
            });
        }
    }

	/**
	 * 获取当前页选中的行
	 * @param table
	 * @returns {NodeListOf<Element>}
	 */
	getCheckedTr($table) {
		return $table.get(0).querySelectorAll('tbody tr[checked="true"]');
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
	 * @param language
	 * @returns {{key: string, name: (*|string), isShow: boolean, width: string, align: string}}
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
     * @returns {{template: {checked}}}
     */
    @parseTpl(columnTpl)
	getColumnTemplate(params) {
	    const { checked, useRadio } = params;
	    const template = useRadio ? this.getRadioTpl({checked: checked}) : this.getCheckboxTpl({checked: checked ? 'checked' : 'unchecked'});
        return {
            template
        };
    }

    /**
     * 获取checkbox模板
     * @param params
     * @returns {{checked: string}}
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
     * @returns {{checked: *}}
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
	 * @param $table
	 * @param status: 要变更的状态
	 * @param isAllCheck: 触发源是否为全选操作
	 * @param cacheKey: 所在行的key
	 * @param isRadio: 当前事件源为单选
     * @returns {*}
     */
	resetData($table, status, isAllCheck, cacheKey, isRadio) {
		const tableData = cache.getTableData($table);
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
		cache.setTableData($table, tableData);

		// 更新选中数据
		cache.setCheckedData($table, tableData);

		return tableData;
	}

	/**
	 * 重置选择框DOM
	 * @param $table
	 * @param settings
	 * @param tableData
	 * @param isRadio: 当前事件源为单选
     */
	resetDOM($table, settings, tableData, isRadio) {
		// 更改tbody区域选中状态
        let checkedNum = 0;
		tableData && tableData.forEach((row, index) => {
			const $tr = jTool(`tbody tr[cache-key="${index}"]`, $table);
            const $checkSpan = jTool(`td[gm-checkbox="true"] .gm-radio-checkbox`, $tr);
			$tr.attr('checked', row[this.key]);
            isRadio ? this.updateRadioState($checkSpan, row[this.key]) : this.updateCheckboxState($checkSpan, row[this.key] ? 'checked' : 'unchecked');
            row[this.key] && checkedNum++;
		});

		// 更新thead区域选中状态
        const $allCheckSpan = jTool(`thead tr th[gm-checkbox="true"] .gm-checkbox `, $table);

        // [checked: 选中, indeterminate: 半选中, unchecked: 未选中]
        !isRadio && this.updateCheckboxState($allCheckSpan, checkedNum === 0 ? 'unchecked' : (checkedNum === tableData.length ? 'checked' : 'indeterminate'));

		// 更新底部工具条选中描述信息
        ajaxPage.updateCheckedInfo($table, settings);
	}

    /**
     * 更新单选框状态
     * @param $radio
     * @param state Boolean
     */
    updateRadioState($radio, state) {
        const $input = jTool(`input[type="radio"]`, $radio);
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
        const $input = jTool(`input[type="checkbox"]`, $checkbox);
        switch (state) {
            case 'checked': {
                $checkbox.addClass('gm-checkbox-checked');
                $checkbox.removeClass('gm-checkbox-indeterminate');
                $input.prop('checked', true);
                break;
            }
            case 'indeterminate': {
                $checkbox.removeClass('gm-checkbox-checked');
                $checkbox.addClass('gm-checkbox-indeterminate');
                $input.prop('checked', false);
                break;
            }
            case 'unchecked': {
                $checkbox.removeClass('gm-checkbox-checked');
                $checkbox.removeClass('gm-checkbox-indeterminate');
                $input.prop('checked', false);
                break;
            }
        }
    }

	/**
	 * 消毁
	 * @param $table
	 */
	destroy($table) {
		// 清理: 选择框事件
		$table.off('click', 'th[gm-checkbox="true"] input[type="checkbox"]');
		$table.off('click', 'td[gm-checkbox="true"] input[type="checkbox"]');
	}
}
export default new Checkbox();
