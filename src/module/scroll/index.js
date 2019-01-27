/*
 * scroll: 滚动轴
 * */
import { jTool, base, cache } from '../../common';
import config from '../config';
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
        let $setTopHead = jTool(`thead[${base.fakeTableHeadKey}]`, $table);
        $setTopHead.length && $setTopHead.remove();
        const $thead = base.getHead($table);

        $table.append($thead.clone(true).attr(base.fakeTableHeadKey, ''));

        $setTopHead = jTool(`thead[${base.fakeTableHeadKey}]`, $table);
        $setTopHead.removeAttr(base.tableHeadKey);

        // 解析框架: fake thead区域
        base.compileFramework(cache.getSettings($table), {el: $setTopHead.get(0).querySelector('tr')});
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
        const $thead = base.getHead($table);
        const theadWidth = $thead.width();
        const tableDivWidth = $tableDiv.width();

        // 吸顶元素
        const $setTopHead = base.getFakeHead($table);

        // 重置thead的宽度和位置
        $setTopHead.css({
            width: tableDivWidth < theadWidth ? theadWidth + 10 : tableDivWidth,
            left: -$tableDiv.scrollLeft() + 'px'
        });

        // 重置th的宽度
        jTool.each(jTool('th', $thead), (i, th) => {
            jTool('th', $setTopHead).eq(i).width(jTool(th).width());
        });
    }

	/**
	 * 为单个table绑定resize事件
	 * @param $table
     * 存在多次渲染时, 将会存在多个resize事件. 每个事件对应处理一个table. 这样做的好处是, 多个表之间无关联. 保持了相对独立性
     */
	bindResizeToTable($table) {
		const settings = cache.getSettings($table);
		let oldBodyWidth = document.querySelector('body').offsetWidth;

		// 绑定resize事件: 对表头吸顶的列宽度进行修正
        jTool(window).unbind(`resize.${settings.gridManagerName}`);
		jTool(window).bind(`resize.${settings.gridManagerName}`, () => {
            if ($table.closest('.table-div').length !== 1) {
                return;
            }

            // 当可视宽度变化时，更新表头宽度
            const _bodyWidth = document.querySelector('body').offsetWidth;
            if (_bodyWidth !== oldBodyWidth) {
                base.updateThWidth($table, settings);
                oldBodyWidth = _bodyWidth;
                cache.update($table, settings);
            }
            base.updateScrollStatus($table);

            this.update($table);

            settings.supportConfig && config.updateConfigListHeight($table);
		});
	}

	/**
	 * 绑定表格滚动轴功能
	 * @param $table
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
		const settings = cache.getSettings($table);
		// 清理: resize事件. 该事件并不干扰其它resize事件
		jTool(window).unbind(`resize.${settings.gridManagerName}`);

		// 清理: 表格滚动轴功能
        $table.closest('.table-div').unbind('scroll');
	}
}
export default new Scroll();
