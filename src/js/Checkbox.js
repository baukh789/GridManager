/*
 * Checkbox: 数据选择/全选/返选
 * */
import { CHECKBOX_WIDTH } from '../common/constants';
import { jTool, Base } from './Base';
import I18n from './I18n';
import Cache from './Cache';

class Checkbox {
	// 全选的唯一标识
	get key() {
		return 'gm_checkbox';
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
	 * 获取Th: 全选字符串
	 * @param useRadio: 是否使用单选
	 * @returns {string}
     */
	getThString(useRadio) {
        return useRadio ? '' : Base.getCheckboxString();
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
				return `<td gm-checkbox="true" gm-create="true">${settings.useRadio ? Base.getRadioString(checked) : Base.getCheckboxString(checked ? 'checked' : 'unchecked')}</td>`;
			}
		};
	}

	/**
	 * 绑定选择框事件
	 * @param $table
	 * @param settings
     */
	bindCheckboxEvent($table, settings) {
		const _this = this;
		// th内的全选
		$table.off('click', 'th[gm-checkbox="true"] input[type="checkbox"]');
		$table.on('click', 'th[gm-checkbox="true"] input[type="checkbox"]', function () {
			settings.checkedBefore(Cache.getCheckedData($table));
			settings.checkedAllBefore(Cache.getCheckedData($table));
			const tableData = _this.resetData($table, this.checked, true);
			_this.resetDOM($table, settings, tableData);
			settings.checkedAfter(Cache.getCheckedData($table));
			settings.checkedAllAfter(Cache.getCheckedData($table));
		});

		// td内的多选
		$table.off('click', 'td[gm-checkbox="true"] input[type="checkbox"]');
		$table.on('click', 'td[gm-checkbox="true"] input[type="checkbox"]', function (e) {
			settings.checkedBefore(Cache.getCheckedData($table));
			const tableData = _this.resetData($table, this.checked, false, jTool(this).closest('tr').attr('cache-key'));
            _this.resetDOM($table, settings, tableData);
			settings.checkedAfter(Cache.getCheckedData($table));
		});

        // td内的单选
        $table.off('click', 'td[gm-checkbox="true"] input[type="radio"]');
        $table.on('click', 'td[gm-checkbox="true"] input[type="radio"]', function (e) {
            settings.checkedBefore(Cache.getCheckedData($table));
            const tableData = _this.resetData($table, undefined, false, jTool(this).closest('tr').attr('cache-key'), true);
            _this.resetDOM($table, settings, tableData, true);
            settings.checkedAfter(Cache.getCheckedData($table));
        });

        // tr点击选中
        if (settings.useRowCheck) {
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
	 * 重置当前渲染数据中的选择状态
	 * @param $table
	 * @param status: 要变更的状态
	 * @param isAllCheck: 触发源是否为全选操作
	 * @param cacheKey: 所在行的key
	 * @param isRadio: 当前事件源为单选
     * @returns {*}
     */
	resetData($table, status, isAllCheck, cacheKey, isRadio) {
		const tableData = Cache.getTableData($table);
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
		Cache.setTableData($table, tableData);

		// 更新选中数据
		Cache.setCheckedData($table, tableData);

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
            isRadio ? Base.updateRadioState($checkSpan, row[this.key]) : Base.updateCheckboxState($checkSpan, row[this.key] ? 'checked' : 'unchecked');
            row[this.key] && checkedNum++;
		});

		// 更新thead区域选中状态
        const $allCheckSpan = jTool(`thead tr th[gm-checkbox="true"] .gm-checkbox `, $table);

        // [checked: 选中, indeterminate: 半选中, unchecked: 未选中]
        !isRadio && Base.updateCheckboxState($allCheckSpan, checkedNum === 0 ? 'unchecked' : (checkedNum === tableData.length ? 'checked' : 'indeterminate'));

		// 更新底部工具条选中描述信息
        const checkedInfo = jTool('.footer-toolbar .toolbar-info.checked-info', $table.closest('.table-wrap'));
        checkedInfo.html(I18n.i18nText(settings, 'checked-info', Cache.getCheckedData($table).length));
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
