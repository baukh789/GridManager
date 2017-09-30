/**
 * Created by baukh on 17/3/3.
 * 鼠标hover 高亮
 */
import $ from './jTool';
import Base from './Base';
class Hover {
	onTbodyHover($table) {
		let $td = null;
		let	$tr = null;
		$table.off('mousemove', 'td');
		$table.on('mousemove', 'td', function () {
			$td = $(this);
			$tr = $td.parent();

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
			if ($tr.attr('col-hover') !== 'true') {
				$('td[col-hover="true"]', $table).removeAttr('col-hover');
				Base.getColTd($td).attr('col-hover', 'true');
			}
		});
	}
}
export default new Hover();

