/**
 * 打印功能
 * @param gridManagerName
 */
import { getTable } from '@common/base';
import { FAKE_TABLE_HEAD_KEY, REMIND_CLASS, SORT_CLASS, GM_CREATE, TH_VISIBLE, TD_VISIBLE } from '@common/constants';
import { CLASS_ADJUST_ACTION } from '@module/adjust/constants';
import { CLASS_FILTER } from '@module/filter/constants';
import { MERGE_TD } from '@module/merge/constants';
export default function print(gridManagerName) {
    const $table = getTable(gridManagerName).clone(true);
    const style = `
        <style>
            body{font-size: 12px; color: #666;}
            table{width: 100%; border-collapse: collapse; border-spacing: 0;}
            th,td{line-height: 20px; padding: 9px 15px; border: 1px solid #666; text-align: left; font-size: 12px; color: #666;}
            th{color: #333}
            a{color: #666; text-decoration:none;}
        </style>
    `;
    const printWindow = window.open();
    // 清除mock thhead
    $table.find(`[${FAKE_TABLE_HEAD_KEY}]`).remove();

    // 清除表头提醒
    $table.find(`.${REMIND_CLASS}`).remove();

    // 清除排序
    $table.find(`.${SORT_CLASS}`).remove();

    // 清除过滤
    $table.find(`.${CLASS_FILTER}`).remove();

    // 清除宽度调整
    $table.find(`.${CLASS_ADJUST_ACTION}`).remove();

    // 清除隐藏项
    $table.find(`[${TH_VISIBLE}="none"]`).remove();
    $table.find(`[${TD_VISIBLE}="none"]`).remove();
    $table.find(`[${MERGE_TD}]`).remove();

    // 清除表格自动创建项
    $table.find(`[${GM_CREATE}="true"]`).remove();

    // 清除表格样式
    $table.find('th').removeAttr('style');
    $table.removeAttr('style');

    printWindow.document.write(style + $table.get(0).outerHTML);
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
}
