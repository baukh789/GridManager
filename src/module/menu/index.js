/*
 * GridManager: 右键菜单
 */
import jTool from '@common/jTool';
import { getTbody, clearTargetEvent } from '@common/base';
import { getSettings } from '@common/cache';
import { MENU_KEY, DISABLED_CLASS_NAME } from '@common/constants';
import { parseTpl } from '@common/parse';
import i18n from '../i18n';
import exportFile from '../exportFile';
import print from '../print';
import ajaxPage from '../ajaxPage';
import config from '../config';
import menuTpl from './menu.tpl.html';
import ajaxPageTpl from './ajaxPage.tpl.html';
import configTpl from './config.tpl.html';
import exportTpl from './export.tpl.html';
import { getEvent, eventMap } from './event';
import './style.less';

/**
 * 获取右键菜单中的某项 是为禁用状态. 若为禁用状态清除事件默认行为
 * @param dom
 * @param events
 * @returns {boolean}
 */
const isDisabled = (dom, events) => {
    if (jTool(dom).hasClass(DISABLED_CLASS_NAME)) {
        events.stopPropagation();
        events.preventDefault();
        return true;
    }
};

class Menu {
    /**
     * 初始化
     * @param gridManagerName
     */
    init(gridManagerName) {
        const settings = getSettings(gridManagerName);
        eventMap[gridManagerName] = getEvent(gridManagerName, this.getQuerySelector(gridManagerName));

        // 创建menu DOM
        const $menu = jTool(this.getQuerySelector(gridManagerName));
        if($menu.length === 0) {
            jTool('body').append(this.createMenuHtml({settings}));
        }

        // 绑定右键菜单事件
        this.bindRightMenuEvent(gridManagerName, settings.supportExport, settings.supportConfig);
    }

    /**
     * 获取指定key的menu选择器
     * @param gridManagerName
     * @returns {string}
     */
	getQuerySelector(gridManagerName) {
	    return `[${MENU_KEY}="${gridManagerName}"]`;
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
            refresh: i18n(settings, 'refresh'),
            print: i18n(settings, 'print'),
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
            previous: i18n(settings, 'previous-page'),
            next: i18n(settings, 'next-page')
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
            export: i18n(settings, 'export'),
            exportChecked: i18n(settings, 'export-checked')
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
            config: i18n(settings, 'config')
        };
    }

	/**
	 * 绑定右键菜单事件
	 * @param gridManagerName
	 * @param supportExport
	 * @param supportConfig
     */
	bindRightMenuEvent(gridManagerName, supportExport, supportConfig) {
		const $menu = this.getMenuByJtool(gridManagerName);

		const { openMenu, closeMenu, refresh, exportPage, openConfig, printPage } = eventMap[gridManagerName];
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
			const exportPageOfChecked = jTool('[menu-action="export"][only-checked="true"]', $menu);
			if (jTool('tr[checked="true"]', getTbody(gridManagerName)).length === 0) {
                exportPageOfChecked.addClass(DISABLED_CLASS_NAME);
			} else {
                exportPageOfChecked.removeClass(DISABLED_CLASS_NAME);
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
                if (eventSource.attr(MENU_KEY) || eventSource.closest(`[${MENU_KEY}]`).length === 1) {
					return;
				}
				$menu.hide();
			});
		});

        // 绑定事件：上一页、下一页、重新加载
        jTool(refresh.target).on(refresh.events, refresh.selector, function (e) {
			if (isDisabled(this, e)) {
				return false;
			}
			const refreshType = this.getAttribute('refresh-type');
            const settings = getSettings(gridManagerName);
			const { currentPageKey, pageData } = settings;
			let cPage = pageData[currentPageKey];

			switch (refreshType) {
                // 上一页
                case 'previous': {
                    cPage = cPage > 1 ? cPage - 1 : cPage;
                    break;
                }

                // 下一页
                case 'next': {
                    cPage = cPage < pageData.tPage ? cPage + 1 : cPage;
                    break;
                }
            }

			ajaxPage.gotoPage(settings, cPage);
            $closeTarget.off(closeEvents);
			$menu.hide();
		});

		// 绑定事件：另存为EXCEL、已选中表格另存为Excel
		supportExport && (() => {
            jTool(exportPage.target).on(exportPage.events, exportPage.selector, function (e) {
				if (isDisabled(this, e)) {
					return false;
				}
				let onlyChecked = false;
				if (this.getAttribute('only-checked') === 'true') {
					onlyChecked = true;
				}
                exportFile.exportGrid(gridManagerName, undefined, onlyChecked);
                $closeTarget.off(closeEvents);
                $menu.hide();
			});
		})();

        // 绑定事件：打印功能
        jTool(printPage.target).on(printPage.events, printPage.selector, function (e) {
            if (isDisabled(this, e)) {
                return false;
            }
            print(gridManagerName);
            $closeTarget.off(closeEvents);
            $menu.hide();
        });

        // 绑定事件：打开配置区域
		supportConfig && (() => {
            jTool(openConfig.target).on(openConfig.events, openConfig.selector, function (e) {
				if (isDisabled(this, e)) {
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
	    const { gridManagerName, pageData, currentPageKey } = settings;
		// 右键菜单区上下页限制
		const gridMenu = jTool(`[${MENU_KEY}="${gridManagerName}"]`);
		if (!gridMenu || gridMenu.length === 0) {
			return;
		}
		const previousPage = jTool('[refresh-type="previous"]', gridMenu);
		const nextPage = jTool('[refresh-type="next"]', gridMenu);
		const cPage = pageData[currentPageKey];
		const tPage = pageData.tPage;
		if (cPage === 1 || tPage === 0) {
			previousPage.addClass(DISABLED_CLASS_NAME);
		} else {
			previousPage.removeClass(DISABLED_CLASS_NAME);
		}
		if (cPage === tPage || tPage === 0) {
			nextPage.addClass(DISABLED_CLASS_NAME);
		} else {
			nextPage.removeClass(DISABLED_CLASS_NAME);
		}
	}

	/**
	 * 消毁
	 * @param gridManagerName
	 */
	destroy(gridManagerName) {
	    // 清除事件
        clearTargetEvent(eventMap[gridManagerName]);

        // 删除DOM节点
        jTool(`[${MENU_KEY}="${gridManagerName}"]`).remove();
	}
}
export default new Menu();
