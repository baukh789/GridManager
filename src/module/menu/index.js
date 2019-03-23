/*
 * GridManager: 右键菜单
 */
import './style.less';
import jTool from '@common/jTool';
import base from '@common/base';
import cache from '@common/cache';
import { parseTpl } from '@common/parse';
import i18n from '../i18n';
import exportFile from '../exportFile';
import ajaxPage from '../ajaxPage';
import config from '../config';
import menuTpl from './menu.tpl.html';
import ajaxPageTpl from './ajaxPage.tpl.html';
import configTpl from './config.tpl.html';
import exportTpl from './export.tpl.html';

// 在body上绑定的关闭事件名
const closeEvent = 'mousedown.gridMenu';
class Menu {
    // 事件map
    eventMap = {
        close: 'mousedown'
    };

    /**
     * 初始化
     * @param $table
     */
    init($table) {
        const settings = cache.getSettings($table);

        // 创建menu DOM
        const $menu = jTool(this.getQuerySelector(settings.gridManagerName));
        if($menu.length === 0) {
            jTool('body').append(this.createMenuHtml({settings}));
        }

        // 绑定右键菜单事件
        this.bindRightMenuEvent($table, settings);
    }

    // 唯一标识名
	get keyName() {
		return 'grid-master';
	}

    /**
     * 获取指定key的menu选择器
     * @param gridManagerName
     * @returns {string}
     */
	getQuerySelector(gridManagerName) {
	    return `.grid-menu[${this.keyName}="${gridManagerName}"]`;
    }

    /**
     * 获取menu 的 jtool对像
     * @param gridManagerName
     */
    getMenuByJtool(gridManagerName) {
	    return jTool(this.getQuerySelector(gridManagerName));
    }

    /**
     * 创建menu DOM
     * @param $table
     * @param settings
     */
    @parseTpl(menuTpl)
    createMenuHtml(params) {
        const settings = params.settings;
        const { gridManagerName, supportAjaxPage, supportExport, supportConfig } = settings;
        return {
            gridManagerName: gridManagerName,
            keyName: this.keyName,
            menuRefreshText: i18n.i18nText(settings, 'menu-refresh'),
            ajaxPageHtml: supportAjaxPage ? this.createAjaxPageHtml({settings}) : '',
            exportHtml: supportExport ? this.createExportHtml({settings}) : '',
            configHtml: supportConfig ? this.createConfigHtml({settings}) : ''
        };
    }

    /**
     * 分页类操作
     * @param params
     */
    @parseTpl(ajaxPageTpl)
    createAjaxPageHtml(params) {
        const settings = params.settings;
        return {
            menuPreviousPageText: i18n.i18nText(settings, 'menu-previous-page'),
            menuNextPageText: i18n.i18nText(settings, 'menu-next-page')
        };
    }

    /**
     * 导出类操作
     * @param params
     */
    @parseTpl(exportTpl)
    createExportHtml(params) {
        const settings = params.settings;
        return {
            menuSaveAsExcelText: i18n.i18nText(settings, 'menu-save-as-excel'),
            menuSaveAsExcelForCheckedText: i18n.i18nText(settings, 'menu-save-as-excel-for-checked')
        };
    }

    /**
     * 配置类操作
     * @param params
     */
    @parseTpl(configTpl)
    createConfigHtml(params) {
        const settings = params.settings;
        return {
            menuConfigGridText: i18n.i18nText(settings, 'menu-config-grid')
        };
    }

	/**
	 * 绑定右键菜单事件
	 * @param $table
     */
	bindRightMenuEvent($table, settings) {
		const _this = this;
		const tableWarp = $table.closest('.table-wrap');

		const gridManagerName = settings.gridManagerName;
		const $menu = this.getMenuByJtool(gridManagerName);
		// const menuQuerySelector = `.grid-menu[${_this.keyName}="${gridManagerName}"]`;
		const $body = jTool('body');

		// 绑定打开右键菜单栏
        $body.off('contextmenu', `.table-wrap[wrap-key="${gridManagerName}"]`);
        $body.on('contextmenu', `.table-wrap[wrap-key="${gridManagerName}"]`, function (e) {
			e.preventDefault();
			e.stopPropagation();

			// 验证：如果不是tbdoy或者是tbody的子元素，直接跳出
			if (e.target.nodeName !== 'TBODY' && jTool(e.target).closest('tbody').length === 0) {
				return;
			}

			// 验证：当前是否存在已选中的项
			const exportExcelOfChecked = jTool('[grid-action="export-excel"][only-checked="true"]');
			if (jTool('tbody tr[checked="true"]', base.getTable(gridManagerName)).length === 0) {
				exportExcelOfChecked.addClass('disabled');
			} else {
				exportExcelOfChecked.removeClass('disabled');
			}

			// 定位
			const menuWidth = $menu.width();
			const menuHeight = $menu.height();
			const offsetHeight = document.documentElement.offsetHeight;
			const offsetWidth = document.documentElement.offsetWidth;
			const top = offsetHeight < e.clientY + menuHeight ? e.clientY - menuHeight : e.clientY;
			const left = offsetWidth < e.clientX + menuWidth ? e.clientX - menuWidth : e.clientX;
			$menu.css({
				top: top + tableWarp.get(0).scrollTop + (document.body.scrollTop || document.documentElement.scrollTop),
				left: left + tableWarp.get(0).scrollLeft + (document.body.scrollLeft || document.documentElement.scrollLeft)
			});

			// 隐藏非当前展示表格的菜单项
			jTool(`.grid-menu[${_this.keyName}]`).hide();
			$menu.show();

			// 点击空处关闭
			$body.off(closeEvent);
			$body.on(closeEvent, function (e) {
				const eventSource = jTool(e.target);
				if (eventSource.hasClass('grid-menu') || eventSource.closest('.grid-menu').length === 1) {
					return;
				}
				$body.off(closeEvent);
				$menu.hide();
			});
		});

		// 绑定事件：上一页、下一页、重新加载
        $body.off('click', `${this.getQuerySelector(gridManagerName)} [grid-action="refresh-page"]`);
        $body.on('click', `${this.getQuerySelector(gridManagerName)}  [grid-action="refresh-page"]`, function (e) {
			if (_this.isDisabled(this, e)) {
				return false;
			}
			const _gridMenu = jTool(this).closest('.grid-menu');
			const _table = base.getTable(_gridMenu.attr(_this.keyName));
			const refreshType = this.getAttribute('refresh-type');
			let _settings = cache.getSettings(_table);
			let cPage = _settings.pageData[_settings.currentPageKey];

			// 上一页
			if (refreshType === 'previous' && cPage > 1) {
				cPage = cPage - 1;
				// 下一页
			} else if (refreshType === 'next' && cPage < _settings.pageData.tPage) {
				cPage = cPage + 1;
				// 重新加载
			} else if (refreshType === 'refresh') {
				cPage = cPage;
			}

			ajaxPage.gotoPage(_table, _settings, cPage);
			$body.off(closeEvent);
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
				const _table = base.getTable(_gridMenu.attr(_this.keyName));
				let onlyChecked = false;
				if (this.getAttribute('only-checked') === 'true') {
					onlyChecked = true;
				}
                exportFile.__exportGridToXls(_table, undefined, onlyChecked);
				$body.off(closeEvent);
				_gridMenu.hide();
			});
		})();

		// 绑定事件：配置表
		settings.supportConfig && (() => {
			$menu.off('click', '[grid-action="config-grid"]');
            $menu.on('click', '[grid-action="config-grid"]', function (e) {
				if (_this.isDisabled(this, e)) {
					return false;
				}
				const _gridMenu = jTool(this).closest('.grid-menu');
				const _table = base.getTable(_gridMenu.attr(_this.keyName));
				config.toggle(_table);
				$body.off(closeEvent);
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
	 * @param gridManagerName
	 */
	destroy(gridManagerName) {
		const $menu = jTool(`.grid-menu[${this.keyName}="${gridManagerName}"]`);
        const $tableWarp = $menu.closest('.table-wrap');
		const $body = jTool('body');

		// 清理: 打开右键菜单栏事件
        $tableWarp.unbind('contextmenu');

		// 清理：上一页、下一页、重新加载
		jTool('[grid-action="refresh-page"]').unbind('click');

		// 清理：另存为EXCEL、已选中表格另存为Excel
		jTool('[grid-action="export-excel"]').unbind('click');

		// 清理：配置表
		jTool('[grid-action="config-grid"]').unbind('click');

		// 清理：隐藏非当前展示表格的菜单项
        $body.off(closeEvent);

		// 删除DOM节点
        $menu.remove();
	}
}
export default new Menu();
