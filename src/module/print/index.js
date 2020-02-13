/**
 * 打印功能
 * @param gridManagerName
 */
import { getTable } from '@common/base';
import { FAKE_TABLE_HEAD_KEY, GM_CREATE, TH_VISIBLE, TD_VISIBLE } from '@common/constants';
import { MERGE_TD } from '@module/merge/constants';
import { jEach } from '@common/utils';
export default function print(gridManagerName) {
    const $table = getTable(gridManagerName).clone(true);
    const style = `
        <style>
            table{width: 100%;border-collapse: collapse;border-spacing: 0;}
            th,td{height: 18px;padding:11px;border: 1px solid #999;font-size: 12px;color: #666;}
            th{color: #333}
            a{color: #666; text-decoration:none;}
            tr[empty-template] td{text-align: center}
        </style>
    `;
    const printWindow = window.open();
    // 清除mock thhead
    $table.find(`[${FAKE_TABLE_HEAD_KEY}]`).remove();

    // 清除隐藏项
    $table.find(`[${TH_VISIBLE}="none"]`).remove();
    $table.find(`[${TD_VISIBLE}="none"]`).remove();
    $table.find(`[${MERGE_TD}]`).remove();

    // 清除表格自动创建项
    $table.find(`[${GM_CREATE}="true"]`).remove();

    // 清除表格样式
    const $th = $table.find('th');
    $th.removeAttr('style');
    jEach($th, (i, th) => {
        th.innerHTML = th.querySelector('.th-text').innerHTML;
    });
    $table.removeAttr('style');

    printWindow.document.write(style + $table.get(0).outerHTML);
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
}
