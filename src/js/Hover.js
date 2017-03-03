/**
 * Created by baukh on 17/3/3.
 * 事件类
 */
import $ from './jTool'
import Base from './Base'
export const Hover = {
	onTbodyHover: function ($table) {
		let $td = null,
			$tr = null;
		$table.on('mousemove', 'td', function (e) {
			$td = $(this);
			$tr = $td.parent();
			// row col 并未发生变化
			if($td.attr('col-hover') === 'true' && $tr.attr('row-hover') === 'true') {
				return;
			}
			// row 发生变化
			if($tr.attr('row-hover') !== 'true'){
				$('tr[row-hover="true"]', $table).removeAttr('row-hover');
				$tr.attr('row-hover', 'true');
			}

			// col 发生变化
			if($tr.attr('col-hover') !== 'true'){
				$('td[col-hover="true"]', $table).removeAttr('col-hover');
				Base.getColTd($td).attr('col-hover', 'true');
			}
		});
	}
};

