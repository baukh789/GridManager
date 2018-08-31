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
		this.update($table);
	}

    /**
     * 生成表头置顶DOM
     * @param $table
     */
    render($table) {
        let $setTopHead = jTool(`thead[${Base.getSetTopAttr()}]`, $table);
        $setTopHead.length && $setTopHead.remove();
        const $thead = jTool('thead[grid-manager-thead]', $table);
        $table.append($thead.clone(true).attr(Base.getSetTopAttr(), ''));

        $setTopHead = jTool(`thead[${Base.getSetTopAttr()}]`, $table);
        $setTopHead.removeAttr('grid-manager-thead');
    }

    /**
     * 更新表头置顶
     * @param $table
     * @returns {boolean}
     */
    update($table) {
        const $tableDiv = $table.closest('.table-div');
        if ($tableDiv.length === 0) {
            return;
        }
        const $thead = jTool('thead[grid-manager-thead]', $table);

        // 吸顶元素
        const $setTopHead = jTool(`thead[${Base.getSetTopAttr()}]`, $table);

        // 隐藏$tableDiv的y轴滚动轴，以确保置顶区域宽度的准确性
        $tableDiv.css({'overflow-y': 'hidden'});
        $setTopHead.css({
            width: $thead.width(),
            left: -$tableDiv.scrollLeft() + 'px'
        });
        $tableDiv.css({'overflow-y': 'auto'});

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
        jTool(window).unbind(`resize.${settings.gridManagerName}`);
		jTool(window).bind(`resize.${settings.gridManagerName}`, () => {
            if ($table.closest('.table-div').length) {
                Base.updateScrollStatus($table);
                this.render($table);
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
		tableDIV.bind('scroll', () => {
		    this.update($table);
		});
	}

	/**
	 * 消毁
	 * @param $table
	 */
	destroy($table) {
		const settings = Cache.getSettings($table);
		// 清理: resize事件. 该事件并不干扰其它resize事件
		jTool(window).unbind(`resize.${settings.gridManagerName}`);

		// 清理: 表格滚动轴功能
        $table.closest('.table-div').unbind('scroll');
	}
}
export default new Scroll();
