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
import { getWrap, getDiv, getTable, getThead, getFakeThead, updateThWidth, updateScrollStatus, getAllTh, getAllFakeTh, getScrollBarWidth } from '@common/base';
import { getSettings, updateCache } from '@common/cache';
import { TABLE_HEAD_KEY, FAKE_TABLE_HEAD_KEY, PX } from '@common/constants';
import { compileFakeThead } from '@common/framework';
import { updateConfigListHeight } from '@module/config';
import fixed from '@module/fixed';
import { removeTooltip } from '@module/remind';
import { RESIZE, SCROLL } from '@common/events';
import './style.less';

// 存储容器监听器，用于消除时
const resizeObserverMap = {};
class Scroll {
    // 当前Y滚动轴的宽度
    width = 0;

    /**
     * 初始化
     * @param _
     */
	init(_) {
        this.render(_);
        this.bindResizeToTable(_);
        this.bindScrollToTableDiv(_);
        this.width = getScrollBarWidth(_);
	}

    /**
     * 生成表头置顶DOM
     * @param _
     */
    render(_) {
        // let $setTopHead = getFakeThead(_);
        // console.log('$setTopHead.length', $setTopHead.length);
        // $setTopHead.length && $setTopHead.remove();

        getTable(_).append(getThead(_).clone(true).attr(FAKE_TABLE_HEAD_KEY, _));

        const $setTopHead = getFakeThead(_);
        $setTopHead.removeAttr(TABLE_HEAD_KEY);

        const settings = getSettings(_);
        compileFakeThead(settings, $setTopHead.get(0));
    }

    /**
     * 更新表头置顶
     * @param _
     * @param isResetWidth: 是否重置宽度
     * @returns {}
     */
    update(_, isResetWidth) {
        const $tableDiv = getDiv(_);
        if (!$tableDiv.length) {
            return;
        }

        // 重置位置
        const $fakeThead = getFakeThead(_);
        $fakeThead.css('left', -$tableDiv.scrollLeft() + PX);

        // 重置宽度
        if (isResetWidth) {
            $fakeThead.width(getThead(_).width());
            let width;
            const allFakeTh = getAllFakeTh(_);
            each(getAllTh(_), (th, i) => {
                width = jTool(th).width();
                allFakeTh.eq(i).css({
                    width: width,
                    'max-width': width
                });
            });
        }

        fixed.updateFakeThead(_);
    }

	/**
	 * 为单个table绑定resize事件
	 * @param _
     * 存在多次渲染时, 将会存在多个resize事件. 每个事件对应处理一个table. 这样做的好处是, 多个表之间无关联. 保持了相对独立性
     */
	bindResizeToTable(_) {
		const $tableWrap = getWrap(_);
		const $tableParent = $tableWrap.parent(); // 父容器，渲染之后离的最近的那一层
		let oldParentWidth = $tableParent.width();

		// reset 执行函数
		const resetFN = () => {
            const settings = getSettings(_);
            if ($tableWrap.length !== 1) {
                return;
            }

            try {
                // 当可视宽度变化时，更新表头宽度
                const parentWidth = $tableParent.width();
                if (parentWidth !== oldParentWidth) {
                    updateThWidth(settings);
                    oldParentWidth = parentWidth;
                    updateCache(_);
                }
                updateScrollStatus(_);

                this.update(_, true);

                removeTooltip(_);

                settings.supportConfig && updateConfigListHeight(_);
            } catch (e) {
                // 表格所在容器大小发生变化后，DOM节点被其它程序销毁所引发的控制台报错。可忽略
            }
        };

		const ResizeObserver = window.ResizeObserver;
		// 支持ResizeObserver: 通过监听外部容器的大小来更新DOM
		if (ResizeObserver) {
            // 监听外部容器变化
            const resizeObserver = new ResizeObserver(() => {
                resetFN();
            });
            const el = $tableParent.get(0);
            resizeObserver.observe(el);

            // 存储监听器，用于消除时
            resizeObserverMap[_] = {
                observer: resizeObserver,
                el
            };
		    return;
        }

		// 不支持ResizeObserver: 通过reset事件来更新DOM
        // 绑定resize事件: 对表头吸顶的列宽度进行修正
        jTool(window).bind(`${RESIZE}.${_}`, () => {
            resetFN();
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
            removeTooltip(_);
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

        // 清除存储容器监听器，不支持ResizeObserver的浏览器resizeObserverMap[_]将为空
        const obs = resizeObserverMap[_];
        if (obs && obs.el && obs.observer) {
            obs.observer.unobserve(obs.el);
            delete resizeObserverMap[_];
        }
	}
}
export default new Scroll();
