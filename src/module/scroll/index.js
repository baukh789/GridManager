/*
 * scroll: 滚动轴
 *
 * #001:
 * scroll事件虽然不同于mouseenter、mouseleave，可以冒泡。
 * 但是滚动事件的父级并未出现滚动, 所以无法进行事件委托。
 * 且该事件可能在消毁的时候失败， 所以在注册事件时需要进行unbind。
 * */
import jTool from '@jTool';
import { each } from '@jTool/utils';
import { getDiv, getTable, getThead, getFakeThead, updateThWidth, updateScrollStatus } from '@common/base';
import { getSettings, updateCache } from '@common/cache';
import { TABLE_HEAD_KEY, FAKE_TABLE_HEAD_KEY } from '@common/constants';
import { compileFakeThead } from '@common/framework';
import config from '../config';
import fixed from '../fixed';
import './style.less';
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
        let $setTopHead = getFakeThead(gridManagerName);
        $setTopHead.length && $setTopHead.remove();
        const $thead = getThead(gridManagerName);

        getTable(gridManagerName).append($thead.clone(true).attr(FAKE_TABLE_HEAD_KEY, gridManagerName));

        $setTopHead = getFakeThead(gridManagerName);
        $setTopHead.removeAttr(TABLE_HEAD_KEY);

        const settings = getSettings(gridManagerName);
        compileFakeThead(settings, $setTopHead.get(0).querySelector('tr'));
    }

    /**
     * 更新表头置顶
     * @param gridManagerName
     * @returns {boolean}
     */
    update(gridManagerName) {
        const $tableDiv = getDiv(gridManagerName);
        if ($tableDiv.length === 0) {
            return;
        }
        const $thead = getThead(gridManagerName);
        const theadWidth = $thead.width();

        // 吸顶元素
        const $setTopHead = getFakeThead(gridManagerName);

        // 重置thead的宽度和位置
        $setTopHead.css({
            width: theadWidth,
            left: -$tableDiv.scrollLeft() + 'px'
        });

        // 重置th的宽度
        each(jTool('th', $thead), (i, th) => {
            jTool('th', $setTopHead).eq(i).width(jTool(th).width());
        });

        fixed.updateFakeThead(gridManagerName);
    }

	/**
	 * 为单个table绑定resize事件
	 * @param gridManagerName
     * 存在多次渲染时, 将会存在多个resize事件. 每个事件对应处理一个table. 这样做的好处是, 多个表之间无关联. 保持了相对独立性
     */
	bindResizeToTable(gridManagerName) {
		const $tableDiv = getDiv(gridManagerName);
		let oldBodyWidth = document.querySelector('body').offsetWidth;

		// 绑定resize事件: 对表头吸顶的列宽度进行修正
		jTool(window).bind(`resize.${gridManagerName}`, () => {
            const settings = getSettings(gridManagerName);
            if ($tableDiv.length !== 1) {
                return;
            }

            // 当可视宽度变化时，更新表头宽度
            const bodyWidth = document.querySelector('body').offsetWidth;
            if (bodyWidth !== oldBodyWidth) {
                updateThWidth(settings);
                oldBodyWidth = bodyWidth;
                updateCache(gridManagerName);
            }
            updateScrollStatus(gridManagerName);

            this.update(gridManagerName);

            settings.supportConfig && config.updateConfigListHeight(gridManagerName);
		});
	}

	/**
	 * 绑定表格滚动轴功能
	 * @param gridManagerName
     */
	bindScrollToTableDiv(gridManagerName) {
		const tableDIV = getDiv(gridManagerName);
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
        getDiv(gridManagerName).unbind('scroll');
	}
}
export default new Scroll();
