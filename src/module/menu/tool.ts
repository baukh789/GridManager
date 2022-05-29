import jTool from '@jTool';
import { rootDocument } from '@jTool/utils';
import { eventMap } from '@module/menu/event';
import { EVENTS, TARGET } from '@common/events';
import { DISABLED_CLASS_NAME, MENU_KEY, TD_FOCUS, TR_CACHE_KEY, TR_PARENT_KEY } from '@common/constants';
import i18n from '@module/i18n';
import { getSettings } from '@common/cache';
import { toPage } from '@module/ajaxPage';
import exportFile from '@module/exportFile';
import { hideRow } from '@module/rowVisible';
import { getTbody } from '@common/base';
import print from '@module/print';
import config from '@module/config';
import { SettingObj } from 'typings/types';

// 菜单项对象
interface MenuItemObject {
	content: string;
	onClick(_: string, target?: HTMLTableCellElement): void;
	run?(_: string, $dom: any, target?: HTMLTableCellElement): void;
	line?: boolean;
}
/**
 * 获取右键菜单中的某项 是为禁用状态. 若为禁用状态清除事件默认行为
 * @param dom
 * @param events
 * @returns {boolean}
 */
const isDisabled = (dom: HTMLElement, events: MouseEvent): boolean => {
    if (jTool(dom).hasClass(DISABLED_CLASS_NAME)) {
        events.stopPropagation();
        events.preventDefault();
        return true;
    }
};

/**
 * 菜单项: 上一页
 * @param settings
 * @returns {{onClick: onClick, run: run, content: string}}
 */
const getPreviousPage = (settings: SettingObj): MenuItemObject => {
    return {
        content: `${i18n(settings, 'previous-page')}<i class="gm-icon gm-icon-up"></i>`,
        onClick: (_: string) => {
            const settings = getSettings(_);
            const { currentPageKey, pageData } = settings;
            const cPage = pageData[currentPageKey];

            toPage(settings, cPage > 1 ? cPage - 1 : cPage);
        },
        run: (_: string, $dom: any) => {
            const settings = getSettings(_);
            const { pageData, currentPageKey } = settings;
            const cPage = pageData[currentPageKey];
            const tPage = pageData.tPage;
            if (cPage === 1 || tPage === 0) {
                $dom.addClass(DISABLED_CLASS_NAME);
            } else {
                $dom.removeClass(DISABLED_CLASS_NAME);
            }
        }
    };
};

/**
 * 菜单项: 下一页
 * @param settings
 * @returns {{onClick: onClick, run: run, content: string}}
 */
const getNextPage = (settings: SettingObj): MenuItemObject => {
    return {
        content: `${i18n(settings, 'next-page')}<i class="gm-icon gm-icon-down"></i>`,
        line: true,
        onClick: (_: string) => {
            const settings = getSettings(_);
            const { currentPageKey, pageData } = settings;
            const cPage = pageData[currentPageKey];
            toPage(settings, cPage < pageData.tPage ? cPage + 1 : cPage);
        },
        run: (_: string, $dom: any) => {
            const settings = getSettings(_);
            const { pageData, currentPageKey } = settings;
            const cPage = pageData[currentPageKey];
            const tPage = pageData.tPage;
            if (cPage === tPage || tPage === 0) {
                $dom.addClass(DISABLED_CLASS_NAME);
            } else {
                $dom.removeClass(DISABLED_CLASS_NAME);
            }
        }
    };
};

/**
 * 菜单项: 重新加载
 * @param settings
 * @returns {{onClick: onClick, content: string}}
 */
const getRefreshPage = (settings: SettingObj): MenuItemObject => {
    return {
        content: `${i18n(settings, 'refresh')}<i class="gm-icon gm-icon-refresh"></i>`,
        onClick: (_: string) => {
            const settings = getSettings(_);
            const { currentPageKey, pageData } = settings;
            toPage(settings, pageData[currentPageKey]);
        }
    };
};

/**
 * 菜单项: 导出
 * @param settings
 * @returns {{onClick: onClick, content: string}}
 */
const getExportPage = (settings: SettingObj): MenuItemObject => {
    return {
        content: `${i18n(settings, 'export')}<i class="gm-icon gm-icon-export"></i>`,
        onClick: (_: string) => {
            exportFile.exportGrid(_, undefined, false);
        }
    };
};

/**
 * 菜单项: 导出选中项
 * @param settings
 * @returns {{onClick: onClick, run: run, content: string}}
 */
const getExportCheckedPage = (settings: SettingObj): MenuItemObject => {
    return {
        content: `${i18n(settings, 'export-checked')}<i class="gm-icon gm-icon-export-checked"></i>`,
        onClick: (_: string) => {
            exportFile.exportGrid(_, undefined, true);
        },
        run: (_: string, $dom: any) => {
            // 验证：当前是否存在已选中的项
            if (jTool('tr[checked="true"]', getTbody(_)).length === 0) {
                $dom.addClass(DISABLED_CLASS_NAME);
            } else {
                $dom.removeClass(DISABLED_CLASS_NAME);
            }
        }
    };
};

/**
 * 菜单项: 打印
 * @param settings
 * @returns {{onClick: onClick, content: string}}
 */
const getPrint = (settings: SettingObj): MenuItemObject => {
    return {
        content: `${i18n(settings, 'print')}<i class="gm-icon gm-icon-print"></i>`,
        onClick: (_: string) => {
            print(_);
        }
    };
};

/**
 * 菜单项: 复制单元格
 * @param settings
 * @returns {{onClick: onClick, content: string}}
 */
const getCopyCell = (settings: SettingObj): MenuItemObject => {
    const fakeCopyAttr = 'gm-fake-copy';
    return {
        content: `${i18n(settings, 'copy')}<i class="gm-icon gm-icon-copy"></i><input ${fakeCopyAttr}="${settings._}"/>`,
        onClick: (_: string) => {
            const fakeCopy = rootDocument.querySelector(`[${fakeCopyAttr}=${_}]`) as HTMLInputElement;
            fakeCopy.value = getTbody(_).find(`td[${TD_FOCUS}]`).text();
            fakeCopy.select();
            rootDocument.execCommand('Copy');
        },
		run: (_: string, $dom: any, target?: HTMLTableCellElement) => {
			if (target.nodeName !== 'td' && jTool(target).closest('td').length === 0) {
				$dom.addClass(DISABLED_CLASS_NAME);
			} else {
				$dom.removeClass(DISABLED_CLASS_NAME);
			}
		}
    };
};

/**
 * 菜单项: 隐藏行
 * @param settings
 * @returns {{onClick: onClick, content: string}}
 */
const getHideRow = (settings: SettingObj): MenuItemObject => {
    return {
        content: `${i18n(settings, 'hide-row')}<i class="gm-icon gm-icon-hide"></i>`,
        onClick: (_: string, target: HTMLTableCellElement) => {
            const $tr = jTool(target).closest('tr');
            // 存在TR_CACHE_KEY: 当前为普通tr
            // 不存在TR_CACHE_KEY: 当前为通栏行或树的子行
            hideRow(getSettings(_), $tr.attr(TR_CACHE_KEY) || $tr.attr(TR_PARENT_KEY));
        },
		run: (_: string, $dom: any, target: HTMLTableCellElement) => {
			if (target.nodeName !== 'tr' && jTool(target).closest('tr[gm-cache-key]').length === 0) {
				$dom.addClass(DISABLED_CLASS_NAME);
			} else {
				$dom.removeClass(DISABLED_CLASS_NAME);
			}
		}
    };
};

/**
 * 菜单项: 配置
 * @param settings
 * @returns {{onClick: onClick, content: string}}
 */
const getConfig = (settings: SettingObj): MenuItemObject => {
    return {
        content: `${i18n(settings, 'config')}<i class="gm-icon gm-icon-config"></i>`,
        onClick: (_: string) => {
            config.toggle(_);
        }
    };
};

/**
 * 获取指定key的menu选择器
 * @param _
 * @returns {string}
 */
export const getMenuQuerySelector = (_: string): string => {
    return `[${MENU_KEY}="${_}"]`;
};

/**
 * 关闭菜单
 * @param _
 */
export const clearMenuDOM = (_: string): void => {
    const { closeMenu } = eventMap[_];
    // 清除body上的事件
    jTool(closeMenu[TARGET]).off(closeMenu[EVENTS]);

    // 删除已生成的menu dom
    jTool(getMenuQuerySelector(_)).remove();
};

/**
 * 生成菜单DOM，并绑定事件
 * @param _
 * @param target: 触发菜单打开时的元素，在部分事件中会使用到
 */
export const createMenuDom = (_: string, target: HTMLTableCellElement): any => {
    const settings = getSettings(_);
    const { supportAjaxPage, supportExport, supportConfig, supportPrint, menuHandler, useCellFocus, useHideRow } = settings;
    let menuList = [];
    // 分页类
    if (supportAjaxPage) {
        menuList.push(getPreviousPage(settings), getNextPage(settings));
    }

    // 导出类
    if (supportExport) {
        menuList.push(getExportPage(settings), getExportCheckedPage(settings));
    }

    // 刷新
    menuList.push(getRefreshPage(settings));

    // 复制
    if (useCellFocus) {
        menuList.push(getCopyCell(settings));
    }

    // 打印
    if (supportPrint) {
        menuList.push(getPrint(settings));
    }

    // 隐藏行
    if (useHideRow) {
        menuList.push(getHideRow(settings));
    }

    // 配置列
    if (supportConfig) {
        menuList.push(getConfig(settings));
    }

    // 处理函数
    menuList = menuHandler(menuList);

    // 生成菜单html string
    let menuContent = '';
    const len = menuList.length;
    menuList.forEach((item: any, index: number) => {
        menuContent += `<span menu-action>${item.content}</span>`;

        // 根据配置项，增加分割线: 如果为最后一项则不进行配置
        if (item.line && index !== len - 1) {
            menuContent += '<span class="menu-line"></span>';
        }
    });

    // 删除所有菜单DOM，该操作用于容错
    jTool(`[${MENU_KEY}]`).remove();

    // 创建menu DOM
    jTool('body').append(`<div class="gm-menu" ${MENU_KEY}="${_}">${menuContent}</div>`);
    const $menu = jTool(getMenuQuerySelector(_));

    // 执行run函数、绑定点击事件
    const menuActionList = $menu.find('[menu-action]');
    menuList.forEach((item: MenuItemObject, index: number) => {
        const { run, onClick } = item;
        const $dom = menuActionList.eq(index);

        // 如果存在运行函数，则执行
        if (run) {
            run(_, $dom, target);
        }

        // 绑定点击事件
        $dom.bind('click', function (e: MouseEvent) {
            if (isDisabled(this, e)) {
                return false;
            }
            onClick(_, target);
            clearMenuDOM(_);
        });
    });
    return $menu;
};

/**
 * 获取定位信息
 * @param width: 需要定位容器的宽度
 * @param height: 需要定位容器的高度
 * @param clientX: 鼠标X轴坐标
 * @param clientY: 鼠标Y轴禁标
 * @returns {{top: *, left: *}}
 */
export const getMenuPosition = (width: number, height: number, clientX: number, clientY: number): object => {
    const documentElement = rootDocument.documentElement;
    const body = rootDocument.body;

    // 使用html而非body是因为鼠标事件的坐标是以html为准
    const offsetHeight = documentElement.offsetHeight;
    const offsetWidth = documentElement.offsetWidth;

    // body或html滚轴
    const scrollTop = body.scrollTop || documentElement.scrollTop;
    const scrollLeft = body.scrollLeft || documentElement.scrollLeft;

    // 默认朝向为鼠标右下方，当位置不足时修正为反方向
    const top = offsetHeight - scrollTop < clientY + height ? clientY - height : clientY;
    const left = offsetWidth - scrollLeft < clientX + width ? clientX - width : clientX;
    return {
        top: top + scrollTop,
        left: left + scrollLeft
    };
};
