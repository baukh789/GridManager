/**
 * 打印功能
 * @param _
 */
import { getTable } from '@common/base';
import { TABLE_HEAD_KEY, FAKE_TABLE_HEAD_KEY, GM_CREATE, CELL_HIDDEN } from '@common/constants';
import { MERGE_TD } from '@module/merge/constants';
import { each } from '@jTool/utils';
export default function print(_: string): void {
    const $table = getTable(_).clone(true);
    const style = '<style>\n'
            + 'table{width: 100%;border-collapse: collapse;border-spacing: 0;}\n'
            + 'th,td{height: 18px;padding:11px;border: 1px solid #999;font-size: 12px;color: #666;}\n'
            + 'th{color: #333}\n'
            + 'a{color: #666; text-decoration:none;}\n'
            + 'tr[empty-template] td{text-align: center}\n'
        + '</style>';
    const printWindow = open();
    // 清除隐藏项
    $table.find(`[${CELL_HIDDEN}]`).remove();
    $table.find(`[${MERGE_TD}]`).remove();

    // 清除表格自动创建项
    $table.find(`[${GM_CREATE}]`).remove();

    const fakeTh = $table.find(`[${FAKE_TABLE_HEAD_KEY}] th`);
    // 清除表格样式
    const $th = $table.find(`[${TABLE_HEAD_KEY}] th`);
    $th.removeAttr('style');
    each($th, (th: HTMLTableCellElement, i: number) => {
        th.innerHTML = fakeTh.eq(i).find('.th-text').html();
    });
    $table.removeAttr('style');

    // 清除mock thhead
    $table.find(`[${FAKE_TABLE_HEAD_KEY}]`).remove();

    printWindow.document.write(style + $table.get(0).outerHTML);
    printWindow.document.close();
    printWindow.print();
    printWindow.close();
}
