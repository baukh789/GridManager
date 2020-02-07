/*
 * sort: 排序
 */
import './style.less';
import jTool from '@jTool';
import { isUndefined, isFunction, isObject, each, isEmptyObject } from '@jTool/utils';
import extend from '@jTool/extend';
import { outWarn } from '@common/utils';
import { getQuerySelector, getThName, clearTargetEvent } from '@common/base';
import { getSettings, setSettings } from '@common/cache';
import { TH_NAME } from '@common/constants';
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
            const { sortData, sortMode, sortUpText, sortDownText } = getSettings(gridManagerName);

            const oldSort = sortData[thName];

            let newSort = '';

            // 升降序单一触发(点击同一个小箭头可取消)
            if (sortMode === 'single') {
                const $i = jTool(e.target);
                // 触发源: 向上小箭头
                if ($i.hasClass('sa-up')) {
                    newSort = oldSort === sortUpText ? '' : sortUpText;
                }
                // 触发源: 向下小箭头
                if ($i.hasClass('sa-down')) {
                    newSort = oldSort === sortDownText ? '' : sortDownText;
                }
            }

            // 升降序整体触发
            if (sortMode === 'overall') {
                newSort = oldSort === sortDownText ? sortUpText : sortDownText;
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
		if (!sortJson || !isObject(sortJson) || isEmptyObject(sortJson)) {
			outWarn('sortJson unavailable');
			return false;
		}

        const settings = getSettings(gridManagerName);

		// 单例排序: 清空原有排序数据
        if (!settings.isCombSorting) {
            settings.sortData = {};
        }

        extend(settings.sortData, sortJson);
		setSettings(settings);

		// 回调函数为空时赋值空方法
		if (!isFunction(callback)) {
			callback = () => {};
		}

		// 默认执行完后进行刷新列表操作
		if (isUndefined(refresh)) {
			refresh = true;
		}

        // 合并排序请求
        const query = extend({}, settings.query, settings.sortData, settings.pageData);

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
        each(jTool(`${getQuerySelector(gridManagerName)} .gm-sorting-action`), (i, v) => {
            jTool(v).removeClass(`${upClass} ${downClass}`);
            jTool(v).closest('th').attr(thAttr, '');
		});

		// 根据排序数据更新排序
        each(sortData, (key, value) => {
            // 这里未用getTh的原因: getTh方法只能获取th, 这里需要同时对th和 fake-th进行操作
            const $th = jTool(`${getQuerySelector(gridManagerName)} th[${TH_NAME}="${key}"]`);
            const $sortAction = jTool('.gm-sorting-action', $th);

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
