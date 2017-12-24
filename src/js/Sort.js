/*
* Sort: 排序
* */
import { $, Base } from './Base';
import Core from './Core';
import Cache from './Cache';
class Sort {
	/**
	 * 获取排序所需HTML
	 * @returns {string}
     */
	get html() {
		const html = `<div class="sorting-action">
						<i class="sa-icon sa-up iconfont icon-sanjiao2"></i>
						<i class="sa-icon sa-down iconfont icon-sanjiao1"></i>
					</div>`;
		return html;
	}

	// TODO @baukh20171211: 需要确认下手动执行排序是否要调 sortingBefore 与 sortingAfter. 如果要调用, 需要解决th为空的问题
	// TODO @baukh20171211: 需要处理setSort执行时与配置项 isCombSorting 的关联
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
		let settings = Cache.getSettings($table);
		if (!sortJson || $.type(sortJson) !== 'object' || $.isEmptyObject(sortJson)) {
			Base.outLog('排序数据不可用', 'warn');
			return false;
		}
		$.extend(settings.sortData, sortJson);
		Cache.setSettings($table, settings);

		// 回调函数为空时赋值空方法
		if (typeof (callback) !== 'function') {
			callback = () => {};
		}

		// 默认执行完后进行刷新列表操作
		if (typeof (refresh) === 'undefined') {
			refresh = true;
		}

		// 执行更新
		if (refresh) {
			Core.__refreshGrid($table, () => {
				// 更新排序样式
				this.updateSortStyle($table);

				// 执行回调函数
				callback();
			});
		} else {
			// 执行回调函数
			callback();
		}
	}

	/**
	 * 绑定排序事件
	 * @param $table
     */
	bindSortingEvent($table) {
		const _this = this;

		// 绑定排序事件
		$table.off('mouseup', '.sorting-action');
		$table.on('mouseup', '.sorting-action', function () {
			// 向上或向下事件源
			const action = $(this);

			// 事件源所在的th
			const th = action.closest('th');

			// 事件源所在的table
			const _$table = th.closest('table');

			// th对应的名称
			const thName = th.attr('th-name');
			const settings = Cache.getSettings(_$table);

			if (!thName || $.trim(thName) === '') {
				Base.outLog('排序必要的参数丢失', 'error');
				return false;
			}

			const oldSort = settings.sortData[th.attr('th-name')];

			// 单例排序: 清空原有排序数据
			if (!settings.isCombSorting) {
				settings.sortData = {};
			}

			settings.sortData[th.attr('th-name')] = oldSort === settings.sortDownText ? settings.sortUpText : settings.sortDownText;

			// 调用事件、渲染tbody
			Cache.setSettings(_$table, settings);

			// 合并排序请求
			const query = $.extend({}, settings.query, settings.sortData, settings.pageData);

			// 执行排序前事件
			settings.sortingBefore(query);
			Core.__refreshGrid(_$table, () => {
				// 更新排序样式
				_this.updateSortStyle(_$table);

				// 排行排序后事件
				settings.sortingAfter(query, th);
			});
		});
	}

	/**
	 * 更新排序样式
	 * @param $table
     */
	updateSortStyle($table) {
		const settings = Cache.getSettings($table);
		let $th = null;
		let $sortAction = null;

		// 重置排序样式
		$.each($('.sorting-action', $table), (i, v) => {
			$(v).removeClass('sorting-up sorting-down');
			$(v).closest('th').attr('sorting', '');
		});

		// 根据排序数据更新排序
		$.each(settings.sortData, (key, value) => {
			$th = $(`thead th[th-name="${key}"]`, $table);
			$sortAction = $('.sorting-action', $th);

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
}
export default new Sort();
