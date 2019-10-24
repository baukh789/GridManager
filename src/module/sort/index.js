/*
 * sort: 排序
 */
import './style.less';
import jTool from '@common/jTool';
import { getQuerySelector, getThName, clearTargetEvent, getTh } from '@common/base';
import { outWarn, isUndefined } from '@common/utils';
import { getSettings, setSettings } from '@common/cache';
import { parseTpl } from '@common/parse';
import core from '../core';
import sortTpl from './sort.tpl.html';
import { getEvent, eventMap } from './event';
class Sort {
    // 存储启用状态
    enable = {};

    /**
     * 初始化排序
     * @param gridManagerName
     */
    init(gridManagerName) {
        if (!this.enable[gridManagerName]) {
            return;
        }
        eventMap[gridManagerName] = getEvent(gridManagerName, getQuerySelector(gridManagerName));
        const { target, events, selector } = eventMap[gridManagerName].sortAction;
        const _this = this;

        // 绑定排序事件
        jTool(target).on(events, selector, function (e) {
            // th对应的名称
            const thName = getThName(jTool(this).closest('th'));
            const settings = getSettings(gridManagerName);

            const oldSort = settings.sortData[thName];
            const sortMode = settings.sortMode;

            let newSort = '';
            // 升降序单一触发
            if (sortMode === 'single') {
                if ([].includes.call(e.target.classList, 'sa-up')) {
                    newSort = oldSort === settings.sortUpText ? '' : settings.sortUpText;
                }
                if ([].includes.call(e.target.classList, 'sa-down')) {
                    newSort = oldSort === settings.sortDownText ? '' : settings.sortDownText;
                }
            }

            // 升降序整体触发
            if (sortMode === 'overall') {
                newSort = oldSort === settings.sortDownText ? settings.sortUpText : settings.sortDownText;
            }
            const sortJson = {
                [thName]: newSort
            };

            _this.__setSort(gridManagerName, sortJson);
        });
    }

    /**
	 * 获取排序所需HTML
	 * @returns {parseData}
     */
	@parseTpl(sortTpl)
	createHtml() {
		return {};
	}

	/*
	 * 手动设置排序
	 * @param gridManagerName
	 * @param sortJson: 排序信息
	 * 格式: {key: value} key 需要与参数 columnData 中的 key匹配, value  为参数 sortUpText 或 sortDownText 的值
	 * 示例: sortJson => {name: 'ASC}
	 * @param callback: 回调函数[function]
	 * @param refresh: 是否执行完成后对表格进行自动刷新[boolean, 默认为true]
	 * */
	__setSort(gridManagerName, sortJson, callback, refresh) {
		if (!sortJson || jTool.type(sortJson) !== 'object' || jTool.isEmptyObject(sortJson)) {
			outWarn('sortJson unavailable');
			return false;
		}

        let settings = getSettings(gridManagerName);

		// 单例排序: 清空原有排序数据
        if (!settings.isCombSorting) {
            settings.sortData = {};
        }

        jTool.extend(settings.sortData, sortJson);
		setSettings(settings);

		// 回调函数为空时赋值空方法
		if (typeof (callback) !== 'function') {
			callback = () => {};
		}

		// 默认执行完后进行刷新列表操作
		if (isUndefined(refresh)) {
			refresh = true;
		}

        // 合并排序请求
        const query = jTool.extend({}, settings.query, settings.sortData, settings.pageData);

        // 执行排序前事件
        settings.sortingBefore(query);

		// 执行更新
		if (refresh) {
			core.refresh(gridManagerName, response => {
				// 更新排序样式
				this.updateSortStyle(gridManagerName);

				// 执行回调函数
				callback(response);

                // 排行排序后事件
                settings.sortingAfter(query);
			});
		} else {
			// 执行回调函数
			callback();

            // 排行排序后事件
            settings.sortingAfter(query);
		}
	}

	/**
	 * 更新排序样式
	 * @param gridManagerName
     */
	updateSortStyle(gridManagerName) {
		const { sortData, sortUpText, sortDownText } = getSettings(gridManagerName);

		const upClass = 'sorting-up';
		const downClass = 'sorting-down';
		const thAttr = 'sorting';

		// 重置排序样式
        jTool.each(jTool(`${getQuerySelector(gridManagerName)} .sorting-action`), (i, v) => {
            jTool(v).removeClass(`${upClass} ${downClass}`);
            jTool(v).closest('th').attr(thAttr, '');
		});

		// 根据排序数据更新排序
        jTool.each(sortData, (key, value) => {
			const $th = getTh(gridManagerName, key);
            const $sortAction = jTool('.sorting-action', $th);

			// 排序操作：升序
			if (value === sortUpText) {
				$sortAction.addClass(upClass);
				$sortAction.removeClass(downClass);
				$th.attr(thAttr, sortUpText);
			}

			// 排序操作：降序
			if (value === sortDownText) {
				$sortAction.addClass(downClass);
				$sortAction.removeClass(upClass);
				$th.attr(thAttr, sortDownText);
			}
		});
	}

	/**
	 * 消毁
	 * @param gridManagerName
	 */
	destroy(gridManagerName) {
	    clearTargetEvent(eventMap[gridManagerName]);
	}
}
export default new Sort();
