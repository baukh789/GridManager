import { CHECKBOX_KEY, ROW_DISABLED_CHECKBOX, TR_CACHE_KEY } from '@common/constants';
import { getTableData, setTableData, setCheckedData } from '@common/cache';
import { Row } from 'typings/types';

/**
 * 重置当前渲染数据中的选择状态
 * @param _
 * @param status: 要变更的状态, 单选操作该值无需传递，因为在单选情况下该值永远为true
 * @param isAllCheck: 触发源是否为全选操作
 * @param cacheKey: 所在行的key
 * @param isRadio: 当前事件源为单选
 * @returns {*}
 */
export const resetData = (_: string, status: boolean, isAllCheck: boolean, cacheKey?: string | number, isRadio?: boolean): Array<Row> => {
    const tableData = getTableData(_);
    const diffList = [];
    // 复选-全选
    if (isAllCheck && !cacheKey) {
        tableData.forEach(row => {
            // 仅选中未禁用的项
            if (!row[ROW_DISABLED_CHECKBOX]) {
				if (row[CHECKBOX_KEY] !== status) {
					diffList.push(row);
				}
				row[CHECKBOX_KEY] = status;
            }
        });
    }

    // 复选-单个操作
    if (!isAllCheck && !isRadio && cacheKey) {
        tableData[cacheKey][CHECKBOX_KEY] = status;
		diffList.push(tableData[cacheKey]);
    }

    // 单选
    if (isRadio) {
        tableData.forEach(row => {
            if (row[TR_CACHE_KEY] === cacheKey) {
				row[CHECKBOX_KEY] = true;
				diffList.push(row);
			} else {
            	// 单选状态下会清空原先的数据, 所以单选时不需要将未选中的行数据归类于diffList内
				row[CHECKBOX_KEY] = false;
			}
        });
    }

    // 存储数据
    setTableData(_, tableData);

    // 更新选中数据: 单选状态下会清空原先的数据
    setCheckedData(_, diffList, isRadio);

    return tableData;
};
