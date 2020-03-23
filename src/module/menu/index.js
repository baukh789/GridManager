/*
 * GridManager: 右键菜单
 */
import jTool from '@jTool';
import { getTbody, clearTargetEvent } from '@common/base';
import { getSettings } from '@common/cache';
import { MENU_KEY, DISABLED_CLASS_NAME } from '@common/constants';
import { parseTpl } from '@common/parse';
import i18n from '../i18n';
import exportFile from '../exportFile';
import print from '../print';
import { toPage } from '../ajaxPage';
import config from '../config';
import menuTpl from './menu.tpl.html';
import ajaxPageTpl from './ajaxPage.tpl.html';
import configTpl from './config.tpl.html';
import exportTpl from './export.tpl.html';
import printTpl from './print.tpl.html';
import { getEvent, eventMap } from './event';
import { TARGET, EVENTS, SELECTOR } from '@common/events';
import './style.less';

const REFRESH_TYPE = 'refresh-type';

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

/**
 * 获取指定key的menu选择器
 * @param _
 * @returns {string}
 */
const getQuerySelector = _ => {
    return `[${MENU_KEY}="${_}"]`;
};
class Menu {
    /**
     * 初始化
     * @param _
     */
    init(_) {
        const settings = getSettings(_);
        eventMap[_] = getEvent(_, getQuerySelector(_));

        // 创建menu DOM
        const $menu = jTool(getQuerySelector(_));
        if($menu.length === 0) {
            jTool('body').append(this.createMenuHtml({settings}));
        }

        // 绑定右键菜单事件
        this.bindRightMenuEvent(_, settings.supportExport, settings.supportConfig);
    }

    /**
     * 获取menu 的 jtool对像
     * @param _
     */
    getMenuByJtool(_) {
	    return jTool(getQuerySelector(_));
    }

    /**
     * 创建menu DOM
     * @param params
     */
    @parseTpl(menuTpl)
    createMenuHtml(params) {
        const settings = params.settings;
        const { _, supportAjaxPage, supportExport, supportConfig, supportPrint } = settings;
        return {
            key: `${MENU_KEY}="${_}"`,
            refresh: i18n(settings, 'refresh'),
            print: supportPrint ? this.createPrintHtml({settings}) : '',
            page: supportAjaxPage ? this.createAjaxPageHtml({settings}) : '',
            export: supportExport ? this.createExportHtml({settings}) : '',
            config: supportConfig ? this.createConfigHtml({settings}) : ''
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
     * 打印类操作
     * @param params
     */
    @parseTpl(printTpl)
    createPrintHtml(params) {
        const settings = params.settings;
        return {
            print: i18n(settings, 'print')
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
	 * @param _
	 * @param supportExport
	 * @param supportConfig
     */
	bindRightMenuEvent(_, supportExport, supportConfig) {
		const $menu = this.getMenuByJtool(_);

		const { openMenu, closeMenu, refresh, exportPage, openConfig, printPage } = eventMap[_];
        const $closeTarget = jTool(closeMenu[TARGET]);
        const closeEvents =  closeMenu[EVENTS];

        // 禁用菜单自身的右键
        $menu.on(openMenu[EVENTS], function (e) {
            e.preventDefault();
            e.stopPropagation();
        });

        // 绑定打开右键菜单栏
        jTool(openMenu[TARGET]).on(openMenu[EVENTS], function (e) {
			e.preventDefault();
			e.stopPropagation();

			// 验证：如果不是tbdoy或者是tbody的子元素，直接跳出
			if (e.target.nodeName !== 'TBODY' && jTool(e.target).closest('tbody').length === 0) {
				return;
			}

			// 验证：当前是否存在已选中的项
			const exportPageOfChecked = jTool(`${exportPage[SELECTOR]}[only-checked="true"]`, $menu);
			if (jTool('tr[checked="true"]', getTbody(_)).length === 0) {
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
                const eventSource = jTool(e.target);
                if (eventSource.attr(MENU_KEY) || eventSource.closest(`[${MENU_KEY}]`).length === 1) {
					return;
				}
                $closeTarget.off(closeEvents);
				$menu.hide();
			});
		});

        // 绑定事件：上一页、下一页、重新加载
        jTool(refresh[TARGET]).on(refresh[EVENTS], refresh[SELECTOR], function (e) {
			if (isDisabled(this, e)) {
				return false;
			}
			const refreshType = this.getAttribute(REFRESH_TYPE);
            const settings = getSettings(_);
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

			toPage(settings, cPage);
            $closeTarget.off(closeEvents);
			$menu.hide();
		});

		// 绑定事件：另存为EXCEL、已选中表格另存为Excel
		supportExport && (() => {
            jTool(exportPage[TARGET]).on(exportPage[EVENTS], exportPage[SELECTOR], function (e) {
				if (isDisabled(this, e)) {
					return false;
				}
				let onlyChecked = false;
				if (this.getAttribute('only-checked') === 'true') {
					onlyChecked = true;
				}
                exportFile.exportGrid(_, undefined, onlyChecked);
                $closeTarget.off(closeEvents);
                $menu.hide();
			});
		})();

        // 绑定事件：打印功能
        jTool(printPage[TARGET]).on(printPage[EVENTS], printPage[SELECTOR], function (e) {
            if (isDisabled(this, e)) {
                return false;
            }
            print(_);
            $closeTarget.off(closeEvents);
            $menu.hide();
        });

        // 绑定事件：打开配置区域
		supportConfig && (() => {
            jTool(openConfig[TARGET]).on(openConfig[EVENTS], openConfig[SELECTOR], function (e) {
				if (isDisabled(this, e)) {
					return false;
				}
				config.toggle(_);
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
	    const { _, pageData, currentPageKey } = settings;
		// 右键菜单区上下页限制
		const gridMenu = jTool(getQuerySelector(_));
		if (!gridMenu || gridMenu.length === 0) {
			return;
		}
		const previousPage = jTool(`[${REFRESH_TYPE}="previous"]`, gridMenu);
		const nextPage = jTool(`[${REFRESH_TYPE}="next"]`, gridMenu);
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
	 * @param _
	 */
	destroy(_) {
	    // 清除事件
        clearTargetEvent(eventMap[_]);

        // 删除DOM节点
        jTool(getQuerySelector(_)).remove();
	}
}
export default new Menu();
