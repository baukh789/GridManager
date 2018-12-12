/*
 * GridManager: 右键菜单
 * */
import { jTool } from './Base';
import Cache from './Cache';
import I18n from './I18n';
import Export from './Export';
import AjaxPage from './AjaxPage';
import Config from './Config';
class Menu {
	// 唯一标识名
	get keyName() {
		return 'grid-master';
	}

	init($table) {
		let settings = Cache.getSettings($table);

		// 创建menu DOM
		this.createMenuDOM(settings);

		// 绑定右键菜单事件
		this.bindRightMenuEvent($table, settings);
	}

	/**
	 * 创建menu DOM
	 * @param $table
	 * @param settings
     */
	createMenuDOM(settings) {
		// menu DOM
		let menuHTML = `<div class="grid-menu" ${this.keyName}="${settings.gridManagerName}">`;

		// 分页类操作
		if (settings.supportAjaxPage) {
			menuHTML += `<span grid-action="refresh-page" refresh-type="previous">
							${I18n.i18nText(settings, 'menu-previous-page')}
							<i class="iconfont icon-up"></i>
						</span>
						<span grid-action="refresh-page" refresh-type="next">
							${I18n.i18nText(settings, 'menu-next-page')}
							<i class="iconfont icon-down"></i>
						</span>`;
		}

		// 重新加载当前页
		menuHTML += `<span grid-action="refresh-page" refresh-type="refresh">
						${I18n.i18nText(settings, 'menu-refresh')}
						<i class="iconfont icon-refresh"></i>
					</span>`;

		// 导出
		if (settings.supportExport) {
			menuHTML += `<span class="grid-line"></span>
						<span grid-action="export-excel" only-checked="false">
							${I18n.i18nText(settings, 'menu-save-as-excel')}
							<i class="iconfont icon-xls"></i>
						</span>
						<span grid-action="export-excel" only-checked="true">
							${I18n.i18nText(settings, 'menu-save-as-excel-for-checked')}
							<i class="iconfont icon-xls"></i>
						</span>`;
		}

		// 配置
		if (settings.supportConfig) {
			menuHTML += `<span class="grid-line"></span>
						<span grid-action="config-grid">
							${I18n.i18nText(settings, 'menu-config-grid')}
							<i class="iconfont icon-config"></i>
						</span>`;
		}
		menuHTML += `</div>`;
		const _body = jTool('body');
		_body.append(menuHTML);
	}

	/**
	 * 绑定右键菜单事件
	 * @param $table
     */
	bindRightMenuEvent($table, settings) {
		const _this = this;
		const tableWarp = $table.closest('.table-wrap');

		const menuDOM = jTool(`.grid-menu[${_this.keyName}="${settings.gridManagerName}"]`);

		const _body = jTool('body');

		// 绑定打开右键菜单栏
		tableWarp.unbind('contextmenu');
		tableWarp.bind('contextmenu', function (e) {
			e.preventDefault();
			e.stopPropagation();

			// 验证：如果不是tbdoy或者是tbody的子元素，直接跳出
			if (e.target.nodeName !== 'TBODY' && jTool(e.target).closest('tbody').length === 0) {
				return;
			}

			// 验证：当前是否存在已选中的项
			const exportExcelOfChecked = jTool('[grid-action="export-excel"][only-checked="true"]');
			if (jTool('tbody tr[checked="true"]', jTool(`table[grid-manager="${ settings.gridManagerName }"]`)).length === 0) {
				exportExcelOfChecked.addClass('disabled');
			} else {
				exportExcelOfChecked.removeClass('disabled');
			}

			// 定位
			const menuWidth = menuDOM.width();
			const menuHeight = menuDOM.height();
			const offsetHeight = document.documentElement.offsetHeight;
			const offsetWidth = document.documentElement.offsetWidth;
			const top = offsetHeight < e.clientY + menuHeight ? e.clientY - menuHeight : e.clientY;
			const left = offsetWidth < e.clientX + menuWidth ? e.clientX - menuWidth : e.clientX;
			menuDOM.css({
				top: top + tableWarp.get(0).scrollTop + (document.body.scrollTop || document.documentElement.scrollTop),
				left: left + tableWarp.get(0).scrollLeft + (document.body.scrollLeft || document.documentElement.scrollLeft)
			});

			// 隐藏非当前展示表格的菜单项
			jTool(`.grid-menu[${_this.keyName}]`).hide();
			menuDOM.show();
			_body.off('mousedown.gridMenu');
			_body.on('mousedown.gridMenu', function (e) {
				const eventSource = jTool(e.target);
				if (eventSource.hasClass('.grid-menu') || eventSource.closest('.grid-menu').length === 1) {
					return;
				}
				_body.off('mousedown.gridMenu');
				menuDOM.hide();
			});
		});

		// 绑定事件：上一页、下一页、重新加载
		const refreshPage = jTool('[grid-action="refresh-page"]');
		refreshPage.unbind('click');
		refreshPage.bind('click', function (e) {
			if (_this.isDisabled(this, e)) {
				return false;
			}
			const _gridMenu = jTool(this).closest('.grid-menu');
			const _table = jTool(`table[grid-manager="${_gridMenu.attr(_this.keyName)}"]`);
			const refreshType = this.getAttribute('refresh-type');
			let settings = Cache.getSettings(_table);
			let cPage = settings.pageData[settings.currentPageKey];

			// 上一页
			if (refreshType === 'previous' && cPage > 1) {
				cPage = cPage - 1;
				// 下一页
			} else if (refreshType === 'next' && cPage < settings.pageData.tPage) {
				cPage = cPage + 1;
				// 重新加载
			} else if (refreshType === 'refresh') {
				cPage = cPage;
			}

			AjaxPage.gotoPage(_table, settings, cPage);
			_body.off('mousedown.gridMenu');
			_gridMenu.hide();
		});

		// 绑定事件：另存为EXCEL、已选中表格另存为Excel
		settings.supportExport && (() => {
			const exportExcel = jTool('[grid-action="export-excel"]');
			exportExcel.unbind('click');
			exportExcel.bind('click', function (e) {
				if (_this.isDisabled(this, e)) {
					return false;
				}
				const _gridMenu = jTool(this).closest('.grid-menu');
				const _table = jTool(`table[grid-manager="${_gridMenu.attr(_this.keyName)}"]`);
				let onlyChecked = false;
				if (this.getAttribute('only-checked') === 'true') {
					onlyChecked = true;
				}
				Export.__exportGridToXls(_table, undefined, onlyChecked);
				_body.off('mousedown.gridMenu');
				_gridMenu.hide();
			});
		})();

		// 绑定事件：配置表
		settings.supportConfig && (() => {
			const settingGrid = jTool('[grid-action="config-grid"]');
			settingGrid.unbind('click');
			settingGrid.bind('click', function (e) {
				if (_this.isDisabled(this, e)) {
					return false;
				}
				const _gridMenu = jTool(this).closest('.grid-menu');
				const _table = jTool(`table[grid-manager="${_gridMenu.attr(_this.keyName)}"]`);
				Config.toggle(_table);
				_body.off('mousedown.gridMenu');
				_gridMenu.hide();
			});
		})();
	}

	/**
	 * 更新菜单区域分页相关操作可用状态
	 * @param gridManagerName
	 * @param settings
	 */
	updateMenuPageStatus(gridManagerName, settings) {
		// 右键菜单区上下页限制
		const gridMenu = jTool(`.grid-menu[${this.keyName}="${gridManagerName}"]`);
		if (!gridMenu || gridMenu.length === 0) {
			return;
		}
		const previousPage = jTool('[refresh-type="previous"]', gridMenu);
		const nextPage = jTool('[refresh-type="next"]', gridMenu);
		const cPage = settings.pageData[settings.currentPageKey];
		const tPage = settings.pageData.tPage;
		if (cPage === 1 || tPage === 0) {
			previousPage.addClass('disabled');
		} else {
			previousPage.removeClass('disabled');
		}
		if (cPage === tPage || tPage === 0) {
			nextPage.addClass('disabled');
		} else {
			nextPage.removeClass('disabled');
		}
	}

	/**
	 * 获取右键菜单中的某项 是为禁用状态. 若为禁用状态清除事件默认行为
	 * @param dom
	 * @param events
	 * @returns {boolean}
     */
	isDisabled(dom, events) {
		if (jTool(dom).hasClass('disabled')) {
			events.stopPropagation();
			events.preventDefault();
			return true;
		} else {
			return false;
		}
	}

	/**
	 * 消毁
	 * @param $table
	 */
	destroy($table) {
		const tableWarp = $table.closest('.table-wrap');
		const settings = Cache.getSettings($table);
		const menuDOM = jTool(`.grid-menu[${this.keyName}="${settings.gridManagerName}"]`);
		const _body = jTool('body');

		// 清理: 打开右键菜单栏事件
		tableWarp.unbind('contextmenu');

		// 清理：上一页、下一页、重新加载
		jTool('[grid-action="refresh-page"]').unbind('click');

		// 清理：另存为EXCEL、已选中表格另存为Excel
		jTool('[grid-action="export-excel"]').unbind('click');

		// 清理：配置表
		jTool('[grid-action="config-grid"]').unbind('click');


		// 清理：隐藏非当前展示表格的菜单项
		_body.off('mousedown.gridMenu');

		// 删除DOM节点
		menuDOM.remove();
	}
}
export default new Menu();
