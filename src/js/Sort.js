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

	/*
	 * 手动设置排序
	 * @param sortJson: 需要排序的json串 如:{th-name:'down'} value需要与参数sortUpText 或 sortDownText值相同
	 * @param callback: 回调函数[function]
	 * @param refresh: 是否执行完成后对表格进行自动刷新[boolean, 默认为true]
	 *
	 * 排序json串示例:
	 * sortJson => {name: 'ASC}
	 * */
	__setSort($table, sortJson, callback, refresh) {
		let settings = Cache.getSettings($table);
		if (!sortJson || $.type(sortJson) !== 'object' || $.isEmptyObject(sortJson)) {
			return false;
		}
		$.extend(settings.sortData, sortJson);
		Cache.setSettings($table, settings);

		// 默认执行完后进行刷新列表操作
		if (typeof (refresh) === 'undefined') {
			refresh = true;
		}
		let _th = null;
		let	_sortAction = null;
		let	_sortType = null;
		for (let s in sortJson) {
			_th = $(`[th-name="${s}"]`, $table);
			_sortType = sortJson[s];
			_sortAction = $('.sorting-action', _th);
			if (_sortType === settings.sortUpText) {
				_th.attr('sorting', settings.sortUpText);
				_sortAction.removeClass('sorting-down');
				_sortAction.addClass('sorting-up');
			} else if (_sortType === settings.sortDownText) {
				_th.attr('sorting', settings.sortDownText);
				_sortAction.removeClass('sorting-up');
				_sortAction.addClass('sorting-down');
			}
		}
		refresh ? Core.__refreshGrid($table, callback) : (typeof (callback) === 'function' ? callback() : '');
	}

	/**
	 * 绑定排序事件
	 * @param $table
     */
	bindSortingEvent($table) {
		const _this = this;
		let settings = Cache.getSettings($table);

		// 向上或向下事件源
		let	action = null;

		// 事件源所在的th
		let	th = null;

		// 事件源所在的table
		let	table = null;

		// th对应的名称
		let	thName = null;

		// 绑定排序事件
		$table.off('mouseup', '.sorting-action');
		$table.on('mouseup', '.sorting-action', function () {
			action = $(this);
			th = action.closest('th');
			table = th.closest('table');
			thName = th.attr('th-name');
			if (!thName || $.trim(thName) === '') {
				Base.outLog('排序必要的参数丢失', 'error');
				return false;
			}

			// 根据组合排序配置项判定：是否清除原排序及排序样式
			if (!settings.isCombSorting) {
				$.each($('.sorting-action', table), (i, v) => {
					// action.get(0) 当前事件源的DOM
					if (v !== action.get(0)) {
						$(v).removeClass('sorting-up sorting-down');
						$(v).closest('th').attr('sorting', '');
					}
				});
			}

			// 更新排序样式
			_this.updateSortStyle(action, th, settings);

			// 当前触发项为置顶表头时, 同步更新至原样式
			if (th.closest('thead[grid-manager-mock-thead]').length === 1) {
				const _th = $(`thead[grid-manager-thead] th[th-name="${thName}"]`, table);
				const _action = $('.sorting-action', _th);
				_this.updateSortStyle(_action, _th, settings);
			}
			// 拼装排序数据: 单列排序
			settings.sortData = {};
			if (!settings.isCombSorting) {
				settings.sortData[th.attr('th-name')] = th.attr('sorting');
			// 拼装排序数据: 组合排序
			} else {
				$.each($('thead[grid-manager-thead] th[th-name][sorting]', table), function (i, v) {
					if (v.getAttribute('sorting') !== '') {
						settings.sortData[v.getAttribute('th-name')] = v.getAttribute('sorting');
					}
				});
			}
			// 调用事件、渲染tbody
			Cache.setSettings($table, settings);
			console.log(2222);
			const query = $.extend({}, settings.query, settings.sortData, settings.pageData);
			settings.sortingBefore(query);
			Core.__refreshGrid($table, () => {
				settings.sortingAfter(query, th);
			});

		});
	}

	/**
	 * 更新排序样式
	 * @param sortAction
	 * @param th
	 * @param settings
     */
	updateSortStyle(sortAction, th, settings) {
		// 排序操作：升序
		if (sortAction.hasClass('sorting-down')) {
			sortAction.addClass('sorting-up');
			sortAction.removeClass('sorting-down');
			th.attr('sorting', settings.sortUpText);
			// 排序操作：降序
		} else {
			sortAction.addClass('sorting-down');
			sortAction.removeClass('sorting-up');
			th.attr('sorting', settings.sortDownText);
		}
	}
}
export default new Sort();
