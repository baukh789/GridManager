/**
 * Created by baukh on 17/3/3.
 * 鼠标hover 高亮
 */
import { jTool, base, cache } from '../../common';
class Hover {
	onTbodyHover($table) {
		const _this = this;
		// mouseenter在预绑定模式下不生效，所以用mousemove替代
        let hoverTd = null;
		$table.off('mousemove', 'td');
		$table.on('mousemove', 'td', function () {
		    if (hoverTd === this) {
		        return;
            }
            const settings = cache.getSettings($table);
            hoverTd = this;
		    const tr = hoverTd.parentNode;
		    const colIndex = hoverTd.cellIndex;
		    const rowIndex = parseInt(tr.getAttribute('cache-key'), 10);

		    // cellHover: 单个td的hover事件
            settings.cellHover(cache.getRowData($table, tr), rowIndex, colIndex);

			_this.updateHover(hoverTd);
		});
	}

	/**
	 * 更新hover样式
	 * @param td
     */
	updateHover(td) {
		const $td = jTool(td);
		const $tr = $td.parent();
		const $table = base.getTable($td, true);

		// row col 并未发生变化
		if ($td.attr('col-hover') === 'true' && $tr.attr('row-hover') === 'true') {
			return;
		}

		// row 发生变化
		if ($tr.attr('row-hover') !== 'true') {
            jTool('tr[row-hover="true"]', $table).removeAttr('row-hover');
			$tr.attr('row-hover', 'true');
		}

		// col 发生变化
		if ($td.attr('col-hover') !== 'true') {
            jTool('td[col-hover="true"]', $table).removeAttr('col-hover');
			base.getColTd($td).attr('col-hover', 'true');
		}
	}

	/**
	 * 消毁
	 * @param $table
	 */
	destroy($table) {
		// 清理: 鼠标移动事件
		$table.off('mousemove', 'td');
	}
}
export default new Hover();

