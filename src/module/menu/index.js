/*
 * GridManager: 右键菜单
 */
import jTool from '@common/jTool';
import base from '@common/base';
import cache from '@common/cache';
import { MENU_KEY } from '@common/constants';
import { parseTpl } from '@common/parse';
import i18n from '../i18n';
import exportFile from '../exportFile';
import ajaxPage from '../ajaxPage';
import config from '../config';
import menuTpl from './menu.tpl.html';
import ajaxPageTpl from './ajaxPage.tpl.html';
import configTpl from './config.tpl.html';
import exportTpl from './export.tpl.html';
import getMenuEvent from './event';
import './style.less';

class Menu {
    eventMap = {};

    /**
     * 初始化
     * @param gridManagerName
     */
    init(gridManagerName) {
        const settings = cache.getSettings(gridManagerName);
        this.eventMap[gridManagerName] = getMenuEvent(gridManagerName, this.getQuerySelector(gridManagerName));

        // 创建menu DOM
        const $menu = jTool(this.getQuerySelector(gridManagerName));
        if($menu.length === 0) {
            jTool('body').append(this.createMenuHtml({settings}));
        }

        // 绑定右键菜单事件
        this.bindRightMenuEvent(gridManagerName, settings);
    }

    /**
     * 获取指定key的menu选择器
     * @param gridManagerName
     * @returns {string}
     */
	getQuerySelector(gridManagerName) {
	    return `.grid-menu[${MENU_KEY}="${gridManagerName}"]`;
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
     * @param params
     */
    @parseTpl(menuTpl)
    createMenuHtml(params) {
        const settings = params.settings;
        const { gridManagerName, supportAjaxPage, supportExport, supportConfig } = settings;
        return {
            gridManagerName: gridManagerName,
            keyName: MENU_KEY,
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
	 * @param gridManagerName
	 * @param settings
     */
	bindRightMenuEvent(gridManagerName, settings) {
		const _this = this;

		const $menu = this.getMenuByJtool(gridManagerName);

		const { openMenu, closeMenu, refresh, exportExcel, openConfig } = this.eventMap[gridManagerName];
        const $closeTarget = jTool(closeMenu.target);
        const closeEvents =  closeMenu.events;
		// 绑定打开右键菜单栏
        jTool(openMenu.target).on(openMenu.events, function (e) {
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
				top: top + this.scrollTop + (document.body.scrollTop || document.documentElement.scrollTop),
				left: left + this.scrollLeft + (document.body.scrollLeft || document.documentElement.scrollLeft)
			});

			// 隐藏非当前展示表格的菜单项
			jTool(`[${MENU_KEY}]`).hide();
			$menu.show();

			// 点击空处关闭
            $closeTarget.off(closeEvents);
            $closeTarget.on(closeEvents, function (e) {
                $closeTarget.off(closeEvents);
                const eventSource = jTool(e.target);
				if (eventSource.hasClass('grid-menu') || eventSource.closest('.grid-menu').length === 1) {
					return;
				}
				$menu.hide();
			});
		});

        // 绑定事件：上一页、下一页、重新加载
        jTool(refresh.target).on(refresh.events, refresh.selector, function (e) {
			if (_this.isDisabled(this, e)) {
				return false;
			}
			const refreshType = this.getAttribute('refresh-type');
			let _settings = cache.getSettings(gridManagerName);
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

			ajaxPage.gotoPage(_settings, cPage);
            $closeTarget.off(closeEvents);
			$menu.hide();
		});

		// 绑定事件：另存为EXCEL、已选中表格另存为Excel
		settings.supportExport && (() => {
            jTool(exportExcel.target).on(exportExcel.events, exportExcel.selector, function (e) {
				if (_this.isDisabled(this, e)) {
					return false;
				}
				let onlyChecked = false;
				if (this.getAttribute('only-checked') === 'true') {
					onlyChecked = true;
				}
                exportFile.__exportGridToXls(gridManagerName, undefined, onlyChecked);
                $closeTarget.off(closeEvents);
                $menu.hide();
			});
		})();

		// 绑定事件：打开配置区域
		settings.supportConfig && (() => {
            jTool(openConfig.target).on(openConfig.events, openConfig.selector, function (e) {
				if (_this.isDisabled(this, e)) {
					return false;
				}
				config.toggle(gridManagerName);
                $closeTarget.off(closeEvents);
				$menu.hide();
			});
		})();
	}

	/**
	 * 更新菜单区域分页相关操作可用状态
	 * @param settings
	 */
	updateMenuPageStatus(settings) {
		// 右键菜单区上下页限制
		const gridMenu = jTool(`[${MENU_KEY}="${settings.gridManagerName}"]`);
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
	    // 清除事件
        base.clearBodyEvent(this.eventMap[gridManagerName]);

        // 删除DOM节点
        jTool(`[${MENU_KEY}="${gridManagerName}"]`).remove();
	}
}
export default new Menu();
