/*
 * scroll: 滚动轴
 *
 * #001:
 * scroll事件虽然不同于mouseenter、mouseleave，可以冒泡。
 * 但是滚动事件的父级并未出现滚动, 所以无法进行事件委托。
 * 且该事件可能在消毁的时候失败， 所以在注册事件时需要进行unbind。
 * */
import jTool from '@jTool';
import {
    getWrap,
    getDiv,
    getTable,
    getThead,
    getFakeThead,
    updateThWidth,
    updateFakeThead,
    updateScrollStatus,
    getScrollBarWidth
} from '@common/base';
import { getSettings, setSettings } from '@common/cache';
import { TABLE_HEAD_KEY, FAKE_TABLE_HEAD_KEY } from '@common/constants';
import { compileFakeThead } from '@common/framework';
import { updateConfigListHeight } from '@module/config';
import fixed from '@module/fixed';
import { removeTooltip } from '@module/remind';
import { RESIZE, SCROLL } from '@common/events';
import './style.less';

// 存储容器监听器，用于消除时
const resizeObserverMap = {};

// 容器宽度存储，用于减少性能消耗
const wrapWidthMap = {};
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
        getTable(_).append(getThead(_).clone(true).attr(FAKE_TABLE_HEAD_KEY, _));

        const $setTopHead = getFakeThead(_);
        $setTopHead.removeAttr(TABLE_HEAD_KEY);

        const settings = getSettings(_);
        compileFakeThead(settings, $setTopHead.get(0));
    }

    update(_) {
        const $tableWrap = getWrap(_);
        let oldWrapWidth = wrapWidthMap[_];
        let settings = getSettings(_);
        if ($tableWrap.length !== 1) {
            return;
        }
        // 在执行前暂停 resize 与 ResizeObserver，原因是在window的webkit内核下会触发该事件
        this.pauseResizeEventMap[_] = true;

        try {
            // 当可视宽度变化时，更新表头宽度
            const wrapWidth = $tableWrap.width();
            if (oldWrapWidth && wrapWidth !== oldWrapWidth) {
                updateThWidth(settings);
                setSettings(settings);
            }
            wrapWidthMap[_] = wrapWidth;
            updateScrollStatus(_);

            updateFakeThead(settings);
            fixed.update(_);

            removeTooltip(_);

            settings.supportConfig && updateConfigListHeight(_);
        } catch (e) {
            // 表格所在容器大小发生变化后，DOM节点被其它程序销毁所引发的控制台报错。可忽略
        }

        setTimeout(() => {
            delete this.pauseResizeEventMap[_];
        });
    }

    // 控制 resize 事件是否暂停执行，在resetLayout会触发暂停
    pauseResizeEventMap = {};
    /**
	 * 为单个table绑定resize事件
	 * @param _
     * 存在多次渲染时, 将会存在多个resize事件. 每个事件对应处理一个table. 这样做的好处是, 多个表之间无关联. 保持了相对独立性
     */
	bindResizeToTable(_) {
		const $tableWrap = getWrap(_);
		const $tableParent = $tableWrap.parent(); // 父容器，渲染之后离的最近的那一层
		const ResizeObserver = window.ResizeObserver;
		// 支持ResizeObserver: 通过监听外部容器的大小来更新DOM
		if (ResizeObserver) {
            // 监听外部容器变化
            const resizeObserver = new ResizeObserver(() => {
                // 当前事件未被暂停时执行update, 在resetLayout会触发暂停
                if (!this.pauseResizeEventMap[_]) {
                    this.update(_);
                }
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

		// 不支持ResizeObserver: 通过reset事件来更新DOM, [safari]
        // 绑定resize事件: 对表头吸顶的列宽度进行修正
        jTool(window).bind(`${RESIZE}.${_}`, () => {
            // 当前事件未被暂停时执行update, 在resetLayout会触发暂停
            if (this.pauseResizeEventMap[_]) {
                this.update(_);
            }
        });

        // ResizeObserver 在初始时触发，window resize 在初始时不触发，所有手动进行触发
        setTimeout(() => {
            this.update(_);
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
            updateFakeThead(getSettings(_), true);
            fixed.update(_);
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
