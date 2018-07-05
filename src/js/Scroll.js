/*
 * Scroll: 滚动轴
 * #001: 存在多次渲染时, 将会存在多个resize事件. 每个事件对应处理一个table. 这样做的好处是, 多个表之间无关联. 保持了相对独立性
 * */
import { jTool, Base } from './Base';
import Cache from './Cache';
class Scroll {
    /**
     * 初始化
     * @param $table
     */
	init($table) {
		this.bindResizeToTable($table);
		this.bindScrollToTableDiv($table);
	}

	/**
	 * 为单个table绑定resize事件
	 * #001
	 * @param $table
     */
	bindResizeToTable($table) {
		const settings = Cache.getSettings($table);
		// 绑定resize事件: 对表头吸顶的列宽度进行修正
		jTool(window).bind(`resize.${settings.gridManagerName}`, () => {
			// 吸顶元素
			const _setTopHead = jTool(`thead[${Base.getSetTopAttr()}]`, $table);
			if (_setTopHead && _setTopHead.length === 1) {
				_setTopHead.remove();
				$table.closest('.table-div').trigger('scroll');
			}
		});
	}

	/**
	 * 绑定表格滚动轴功能
	 * @param table
     */
	bindScrollToTableDiv($table) {
		const tableDIV = $table.closest('.table-div');

		// 绑定滚动条事件
		tableDIV.unbind('scroll');
		tableDIV.bind('scroll', function (e, _isWindowResize_) {
			const _scrollDOMTop = jTool(this).scrollTop();

			// 列表head
			const _thead = jTool('thead[grid-manager-thead]', $table);

			// 列表body
			const _tbody = jTool('tbody', $table);

			// 吸顶元素
			let _setTopHead = jTool(`thead[${Base.getSetTopAttr()}]`, $table);

			// 当前列表数据为空
			if (jTool('tr', _tbody).length === 0) {
				return true;
			}

			// 配置吸顶区的宽度
			if (_setTopHead.length === 0 || _isWindowResize_) {
				_setTopHead.length === 0 ? $table.append(_thead.clone(true).attr(Base.getSetTopAttr(), '')) : '';
				_setTopHead = jTool(`thead[${Base.getSetTopAttr()}]`, $table);
				_setTopHead.removeAttr('grid-manager-thead');
				_setTopHead.removeClass('scrolling');
				_setTopHead.css({
					width: _thead.width(),
					left: -$table.closest('.table-div').scrollLeft() + 'px'
				});

				// 防止window.resize事件后导致的吸顶宽度错误. 可以优化
				jTool.each(jTool('th', _thead), (i, v) => {
					jTool('th', _setTopHead).eq(i).width(jTool(v).width());
				});
			}
			if (_setTopHead.length === 0) {
				return;
			}

			// 删除表头置顶
			if (_scrollDOMTop === 0) {
				_thead.removeClass('scrolling');
				_setTopHead.remove();
				// 显示表头置顶
			} else {
				_thead.addClass('scrolling');
				_setTopHead.css({
					left: -$table.closest('.table-div').scrollLeft() + 'px'
				});
			}
			return true;
		});
	}

	/**
	 * 消毁
	 * @param $table
	 */
	destroy($table) {
		const tableDIV = $table.closest('.table-div');
		const settings = Cache.getSettings($table);
		// 清理: resize事件. 该事件并不干扰其它resize事件
		jTool(window).unbind(`resize.${settings.gridManagerName}`);

		// 清理: 表格滚动轴功能
		tableDIV.unbind('scroll');
	}
}
export default new Scroll();
