import { CHECKBOX_KEY, ROW_DISABLED_CHECKBOX } from '@common/constants';
import { getTableData, setTableData, setCheckedData } from '@common/cache';
/**
 * 重置当前渲染数据中的选择状态
 * @param _
 * @param status: 要变更的状态, 单选操作该值无需传递，因为在单选情况下该值永远为true
 * @param isAllCheck: 触发源是否为全选操作
 * @param cacheKey: 所在行的key
 * @param isRadio: 当前事件源为单选
 * @returns {*}
 */
export const resetData = (_: string, status: boolean, isAllCheck: boolean, cacheKey?: any, isRadio?: boolean): Array<any> => {
    const tableData = getTableData(_);
    // 复选-全选
    if (isAllCheck && !cacheKey) {
        tableData.forEach(row => {
            // 仅选中未禁用的项
            if (!row[ROW_DISABLED_CHECKBOX]) {
                row[CHECKBOX_KEY] = status;
            }
        });
    }

    // 复选-单个操作
    if (!isAllCheck && cacheKey) {
        tableData[cacheKey][CHECKBOX_KEY] = status;
    }

    // 单选
    if (isRadio) {
        tableData.forEach((row, index) => {
            row[CHECKBOX_KEY] = index === parseInt(cacheKey, 10);
        });

        // 清空当前选中项
        setCheckedData(_, [], true);
    }

    // 存储数据
    setTableData(_, tableData);

    // 更新选中数据
    setCheckedData(_, tableData);

    return tableData;
};
