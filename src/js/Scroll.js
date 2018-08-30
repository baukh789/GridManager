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
	    this.render($table);
		this.bindResizeToTable($table);
		this.bindScrollToTableDiv($table);
	}

    /**
     * 生成表头置顶DOM
     * @param $table
     */
    render($table) {
        let $setTopHead = jTool(`thead[${Base.getSetTopAttr()}]`, $table);
        $setTopHead.remove();
        const $thead = jTool('thead[grid-manager-thead]', $table);
        $table.append($thead.clone(true).attr(Base.getSetTopAttr(), ''));

        $setTopHead = jTool(`thead[${Base.getSetTopAttr()}]`, $table);
        $setTopHead.removeAttr('grid-manager-thead');
        this.update($table);
    }

    /**
     * 更新表头置顶
     * @param $table
     * @returns {boolean}
     */
    update($table) {
        const $thead = jTool('thead[grid-manager-thead]', $table);

        // 列表body
        const $tbody = jTool('tbody', $table);

        // 吸顶元素
        const $setTopHead = jTool(`thead[${Base.getSetTopAttr()}]`, $table);

        // 当前列表数据为空
        if (jTool('tr', $tbody).length === 0) {
            return true;
        }

        $setTopHead.css({
            width: $thead.width(),
            left: -$table.closest('.table-div').scrollLeft() + 'px'
        });

        // TODO 触发resize之后，thead宽度会将滚动轴减去，需要处理
        // 防止window.resize事件后导致的吸顶宽度错误. 可以优化
        jTool.each(jTool('th', $thead), (i, th) => {
            jTool('th', $setTopHead).eq(i).width(jTool(th).width());
        });
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
			// const _setTopHead = jTool(`thead[${Base.getSetTopAttr()}]`, $table);
			// if (_setTopHead && _setTopHead.length === 1) {
			// 	_setTopHead.remove();
			// 	$table.closest('.table-div').trigger('scroll');
			// }
            Base.updateScrollStatus($table);
            this.render($table);
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
		tableDIV.bind('scroll', () => {
		    this.update($table);
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
