/*
 * scroll: 滚动轴
 *
 * #001:
 * scroll事件虽然不同于mouseenter、mouseleave，可以冒泡。
 * 但是滚动事件的父级并未出现滚动, 所以无法进行事件委托。
 * 且该事件可能在消毁的时候失败， 所以在注册事件时需要进行unbind。
 * */
import jTool from '@common/jTool';
import base from '@common/base';
import cache from '@common/cache';
import config from '../config';
import { TABLE_HEAD_KEY, FAKE_TABLE_HEAD_KEY } from '../../common/constants';
class Scroll {
    /**
     * 初始化
     * @param gridManagerName
     */
	init(gridManagerName) {
        this.render(gridManagerName);
        this.bindResizeToTable(gridManagerName);
        this.bindScrollToTableDiv(gridManagerName);
	}

    /**
     * 生成表头置顶DOM
     * @param gridManagerName
     */
    render(gridManagerName) {
        let $setTopHead = base.getFakeThead(gridManagerName);
        $setTopHead.length && $setTopHead.remove();
        const $thead = base.getThead(gridManagerName);

        base.getTable(gridManagerName).append($thead.clone(true).attr(FAKE_TABLE_HEAD_KEY, gridManagerName));

        $setTopHead = base.getFakeThead(gridManagerName);
        $setTopHead.removeAttr(TABLE_HEAD_KEY);
    }

    /**
     * 更新表头置顶
     * @param gridManagerName
     * @returns {boolean}
     */
    update(gridManagerName) {
        const $tableDiv = base.getDiv(gridManagerName);
        if ($tableDiv.length === 0) {
            return;
        }
        const $thead = base.getThead(gridManagerName);
        const theadWidth = $thead.width();
        // const tableDivWidth = $tableDiv.width();

        // 吸顶元素
        const $setTopHead = base.getFakeThead(gridManagerName);

        // 重置thead的宽度和位置
        $setTopHead.css({
            width: theadWidth,
            left: -$tableDiv.scrollLeft() + 'px'
        });

        // 重置th的宽度
        jTool.each(jTool('th', $thead), (i, th) => {
            jTool('th', $setTopHead).eq(i).width(jTool(th).width());
        });
    }

	/**
	 * 为单个table绑定resize事件
	 * @param gridManagerName
     * 存在多次渲染时, 将会存在多个resize事件. 每个事件对应处理一个table. 这样做的好处是, 多个表之间无关联. 保持了相对独立性
     */
	bindResizeToTable(gridManagerName) {
		const $tableDiv = base.getDiv(gridManagerName);
		let oldBodyWidth = document.querySelector('body').offsetWidth;

		// 绑定resize事件: 对表头吸顶的列宽度进行修正
		jTool(window).bind(`resize.${gridManagerName}`, () => {
            const settings = cache.getSettings(gridManagerName);
            if ($tableDiv.length !== 1) {
                return;
            }

            // 当可视宽度变化时，更新表头宽度
            const bodyWidth = document.querySelector('body').offsetWidth;
            if (bodyWidth !== oldBodyWidth) {
                base.updateThWidth(settings);
                oldBodyWidth = bodyWidth;
                cache.update(gridManagerName);
            }
            base.updateScrollStatus(gridManagerName);

            this.update(gridManagerName);

            settings.supportConfig && config.updateConfigListHeight(gridManagerName);
		});
	}

	/**
	 * 绑定表格滚动轴功能
	 * @param gridManagerName
     */
	bindScrollToTableDiv(gridManagerName) {
		const tableDIV = base.getDiv(gridManagerName);
		// 绑定滚动条事件 #001
		tableDIV.unbind('scroll');
		tableDIV.bind('scroll', () => {
            this.update(gridManagerName);
		});
	}

	/**
	 * 消毁
	 * @param gridManagerName
	 */
	destroy(gridManagerName) {
		// 清理: resize事件. 该事件并不干扰其它resize事件
		jTool(window).unbind(`resize.${gridManagerName}`);

		// 清理: 表格滚动轴功能
        base.getDiv(gridManagerName).unbind('scroll');
	}
}
export default new Scroll();
