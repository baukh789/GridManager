/*
* sort: 排序
* */
import { jTool, base, cache, parseTpl } from '../../common';
import core from '../core';
import sortTpl from './sort.tpl.html';
class Sort {
    // 启用状态
    enable = false;

	/**
	 * 获取排序所需HTML
	 * @returns {parseData}
     */
	@parseTpl(sortTpl)
	createHtml() {
		return {};
	}

	/**
	 * 初始化排序
	 * @param $table
     */
	init($table) {
		this.__bindSortingEvent($table);
	}

	/*
	 * 手动设置排序
	 * @param $table: table jTool
	 * @param sortJson: 排序信息
	 * 格式: {key: value} key 需要与参数 columnData 中的 key匹配, value  为参数 sortUpText 或 sortDownText 的值
	 * 示例: sortJson => {name: 'ASC}
	 * @param callback: 回调函数[function]
	 * @param refresh: 是否执行完成后对表格进行自动刷新[boolean, 默认为true]
	 * */
	__setSort($table, sortJson, callback, refresh) {
		let settings = cache.getSettings($table);
		if (!sortJson || jTool.type(sortJson) !== 'object' || jTool.isEmptyObject(sortJson)) {
			base.outLog('排序数据不可用', 'warn');
			return false;
		}

        // 单例排序: 清空原有排序数据
        if (!settings.isCombSorting) {
            settings.sortData = {};
        }

        jTool.extend(settings.sortData, sortJson);
		cache.setSettings(settings);

		// 回调函数为空时赋值空方法
		if (typeof (callback) !== 'function') {
			callback = () => {};
		}

		// 默认执行完后进行刷新列表操作
		if (typeof (refresh) === 'undefined') {
			refresh = true;
		}

        // 合并排序请求
        const query = jTool.extend({}, settings.query, settings.sortData, settings.pageData);

        // 执行排序前事件
        settings.sortingBefore(query);

		// 执行更新
		if (refresh) {
			core.refresh($table, response => {
				// 更新排序样式
				this.updateSortStyle($table);

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
	 * 绑定排序事件
	 * @param $table
     */
	__bindSortingEvent($table) {
		const _this = this;

		// 绑定排序事件
		$table.off('mouseup', '.sorting-action');
		$table.on('mouseup', '.sorting-action', function () {
			// 向上或向下事件源
			const action = jTool(this);

			// 事件源所在的th
			const th = action.closest('th');

			// 事件源所在的table
			const _$table = th.closest('table');

			// th对应的名称
			const thName = th.attr('th-name');
			const settings = cache.getSettings(_$table);

			if (!thName || jTool.trim(thName) === '') {
				base.outLog('排序必要的参数丢失', 'error');
				return false;
			}

			const oldSort = settings.sortData[thName];

			const sortJson = {
                [thName]: oldSort === settings.sortDownText ? settings.sortUpText : settings.sortDownText
            };

			_this.__setSort($table, sortJson);
		});
	}

	/**
	 * 更新排序样式
	 * @param $table
     */
	updateSortStyle($table) {
		const settings = cache.getSettings($table);
		let $th = null;
		let $sortAction = null;

		// 重置排序样式
        jTool.each(jTool('.sorting-action', $table), (i, v) => {
            jTool(v).removeClass('sorting-up sorting-down');
            jTool(v).closest('th').attr('sorting', '');
		});

		// 根据排序数据更新排序
        jTool.each(settings.sortData, (key, value) => {
			$th = jTool(`thead th[th-name="${key}"]`, $table);
			$sortAction = jTool('.sorting-action', $th);

			// 排序操作：升序
			if (value === settings.sortUpText) {
				$sortAction.addClass('sorting-up');
				$sortAction.removeClass('sorting-down');
				$th.attr('sorting', settings.sortUpText);
			}

			// 排序操作：降序
			if (value === settings.sortDownText) {
				$sortAction.addClass('sorting-down');
				$sortAction.removeClass('sorting-up');
				$th.attr('sorting', settings.sortDownText);
			}
		});
	}

	/**
	 * 消毁
	 * @param $table
	 */
	destroy($table) {
		// 清理: 排序事件
		$table.off('mouseup', '.sorting-action');
	}
}
export default new Sort();
