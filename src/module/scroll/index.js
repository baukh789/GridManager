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
import { getDiv, getTable, getThead, getFakeThead, updateThWidth, updateScrollStatus, getAllTh, getAllFakeTh } from '@common/base';
import { getSettings, updateCache } from '@common/cache';
import { TABLE_HEAD_KEY, FAKE_TABLE_HEAD_KEY, PX } from '@common/constants';
import { compileFakeThead } from '@common/framework';
import { updateConfigListHeight } from '../config';
import fixed from '../fixed';
import { RESIZE, SCROLL } from '@common/events';
import './style.less';
class Scroll {
    /**
     * 初始化
     * @param _
     */
	init(_) {
        this.render(_);
        this.bindResizeToTable(_);
        this.bindScrollToTableDiv(_);
	}

    /**
     * 生成表头置顶DOM
     * @param _
     */
    render(_) {
        let $setTopHead = getFakeThead(_);
        $setTopHead.length && $setTopHead.remove();

        getTable(_).append(getThead(_).clone(true).attr(FAKE_TABLE_HEAD_KEY, _));

        $setTopHead = getFakeThead(_);
        $setTopHead.removeAttr(TABLE_HEAD_KEY);

        const settings = getSettings(_);
        compileFakeThead(settings, $setTopHead.get(0).querySelector('tr'));
    }

    /**
     * 更新表头置顶
     * @param _
     * @returns {boolean}
     */
    update(_) {
        const $tableDiv = getDiv(_);
        if (!$tableDiv.length) {
            return;
        }

        // 重置thead的宽度和位置
        getFakeThead(_).css({
            width: getThead(_).width(),
            left: -$tableDiv.scrollLeft() + PX
        });

        // 重置th的宽度
        each(getAllTh(_), (th, i) => {
            getAllFakeTh(_).eq(i).width(jTool(th).width());
        });

        fixed.updateFakeThead(_);
    }

	/**
	 * 为单个table绑定resize事件
	 * @param _
     * 存在多次渲染时, 将会存在多个resize事件. 每个事件对应处理一个table. 这样做的好处是, 多个表之间无关联. 保持了相对独立性
     */
	bindResizeToTable(_) {
		const $tableDiv = getDiv(_);
		const $body = jTool('body');
		let oldBodyWidth = $body.width();

		// 绑定resize事件: 对表头吸顶的列宽度进行修正
		jTool(window).bind(`${RESIZE}.${_}`, () => {
            const settings = getSettings(_);
            if ($tableDiv.length !== 1) {
                return;
            }

            // 当可视宽度变化时，更新表头宽度
            const bodyWidth = $body.width();
            if (bodyWidth !== oldBodyWidth) {
                updateThWidth(settings);
                oldBodyWidth = bodyWidth;
                updateCache(_);
            }
            updateScrollStatus(_);

            this.update(_);

            settings.supportConfig && updateConfigListHeight(_);
		});
	}

	/**
	 * 绑定表格滚动轴功能
	 * @param _
     */
	bindScrollToTableDiv(_) {
		const tableDIV = getDiv(_);
		// 绑定滚动条事件 #001
		tableDIV.unbind(SCROLL);
		tableDIV.bind(SCROLL, () => {
            this.update(_);
		});
	}

	/**
	 * 消毁
	 * @param _
	 */
	destroy(_) {
		// 清理: resize事件. 该事件并不干扰其它resize事件
		jTool(window).unbind(`${RESIZE}.${_}`);

		// 清理: 表格滚动轴功能
        getDiv(_).unbind(SCROLL);
	}
}
export default new Scroll();
