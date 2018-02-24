/**
 * Created by baukh on 17/3/3.
 * 鼠标hover 高亮
 */
import { $, Base } from './Base';
class Hover {
	onTbodyHover($table) {
		const _this = this;
		$table.off('mousemove', 'td');
		$table.on('mousemove', 'td', function () {
			_this.updateHover(this);
		});
	}

	/**
	 * 更新hover样式
	 * @param td
     */
	updateHover(td) {
		const $td = $(td);
		const $tr = $td.parent();
		const $table = $td.closest('table[grid-manager]');

		// row col 并未发生变化
		if ($td.attr('col-hover') === 'true' && $tr.attr('row-hover') === 'true') {
			return;
		}

		// row 发生变化
		if ($tr.attr('row-hover') !== 'true') {
			$('tr[row-hover="true"]', $table).removeAttr('row-hover');
			$tr.attr('row-hover', 'true');
		}

		// col 发生变化
		if ($td.attr('col-hover') !== 'true') {
			$('td[col-hover="true"]', $table).removeAttr('col-hover');
			Base.getColTd($td).attr('col-hover', 'true');
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

