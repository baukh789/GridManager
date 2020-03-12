/*
 * ajaxPage: 分页
**/
import './style.less';
import jTool from '@jTool';
import { extend } from '@jTool/utils';
import { clearTargetEvent } from '@common/base';
import { getSettings, setSettings, getUserMemory, saveUserMemory, getCheckedData } from '@common/cache';
import { parseTpl } from '@common/parse';
import { TOOLBAR_KEY, DISABLED_CLASS_NAME } from '@common/constants';
import core from '../core';
import { getParams } from '../core/tool';
import i18n from '../i18n';
import dropdown from '../dropdown';
import ajaxPageTpl from './ajax-page.tpl.html';
import { getQuerySelector, getPageData, joinPaginationNumber } from './tool';
import { getEvent, eventMap } from './event';

/**
 * 修改分页描述信息
 * @param $footerToolbar
 * @param settings
 * @param pageData
 * @param asyncTotalText: 异步总页loading文本
 * @private
 */
const resetPageInfo = ($footerToolbar, settings, pageData, asyncTotalText) => {
    const { currentPageKey, pageSizeKey } = settings;
    // 从多少开始
    const fromNum = pageData[currentPageKey] === 1 ? 1 : (pageData[currentPageKey] - 1) * pageData[pageSizeKey] + 1;

    // 到多少结束
    const toNum = pageData[currentPageKey] * pageData[pageSizeKey];

    // 总共条数
    let totalNum = pageData.tSize;

    // 当前页
    const cPage = pageData[currentPageKey];

    // 总页数
    let tPage = pageData.tPage;

    // 当前没有总条数 且 存在异步加载文本: 使用异步加载文本填充总条数与总页数
    if (!totalNum && asyncTotalText) {
        totalNum = tPage = asyncTotalText;
    }

    const $pageInfo = jTool('.page-info', $footerToolbar);
    if ($pageInfo.length) {
        const info = i18n(settings, 'page-info', [fromNum, toNum, totalNum, cPage, tPage]);
        $pageInfo.html(info);
    }

    // #001
    // 更新实时更新数据: 当前页从多少条开始显示
    const $beginNumber = jTool('[begin-number-info]', $footerToolbar);
    if ($beginNumber.length) {
        $beginNumber.html(fromNum);
        $beginNumber.val(fromNum);
    }

    // 更新实时更新数据: 当前页到多少条结束显示
    const $endNumber = jTool('[end-number-info]', $footerToolbar);
    if ($endNumber.length) {
        $endNumber.html(toNum);
        $endNumber.val(toNum);
    }

    // 更新实时更新数据: 当前页
    const $currentPage = jTool('[current-page-info]', $footerToolbar);
    if ($currentPage.length) {
        $currentPage.html(cPage);
        $currentPage.val(cPage);
    }

    // 更新实时更新数据: 总条数
    const $totalsNumber = jTool('[totals-number-info]', $footerToolbar);
    if ($totalsNumber.length) {
        $totalsNumber.html(totalNum);
        $totalsNumber.val(totalNum);
    }

    // 更新实时更新数据: 总页数
    const $totalsPage = jTool('[totals-page-info]', $footerToolbar);
    if ($totalsPage.length) {
        $totalsPage.html(tPage);
        $totalsPage.val(tPage);
    }
};

/**
 * 更新底部DOM节点
 * @param $footerToolbar
 * @param settings
 * @param pageData 分页数据格式
 * @private
 */
const updateFooterDOM = ($footerToolbar, settings, pageData) => {
    const { useNoTotalsMode, currentPageKey } = settings;
    useNoTotalsMode && $footerToolbar.attr('no-totals-mode', 'true');

    // 分页码区域
    const $paginationNumber = jTool('[pagination-number]', $footerToolbar);

    // 重置分页码
    $paginationNumber.html(joinPaginationNumber(currentPageKey, pageData));

    // 更新分页禁用状态
    const toPage = pageData[currentPageKey];
    const $firstPage = jTool('[pagination-before] .first-page', $footerToolbar);
    const $previousPage = jTool('[pagination-before] .previous-page', $footerToolbar);
    const $nextPage = jTool('[pagination-after] .next-page', $footerToolbar);
    const $lastPage = jTool('[pagination-after] .last-page', $footerToolbar);

    const firstUsable = Boolean($firstPage.length);
    const previousUsable = Boolean($previousPage.length);
    const nextUsable = Boolean($nextPage.length);
    const lastUsable = Boolean($lastPage.length);
    if (toPage === 1) {
        firstUsable && $firstPage.addClass(DISABLED_CLASS_NAME);
        previousUsable && $previousPage.addClass(DISABLED_CLASS_NAME);
    } else {
        firstUsable && $firstPage.removeClass(DISABLED_CLASS_NAME);
        previousUsable && $previousPage.removeClass(DISABLED_CLASS_NAME);
    }

    if (toPage >= pageData.tPage) {
        nextUsable && $nextPage.addClass(DISABLED_CLASS_NAME);
        lastUsable && $lastPage.addClass(DISABLED_CLASS_NAME);
    } else {
        nextUsable && $nextPage.removeClass(DISABLED_CLASS_NAME);
        lastUsable && $lastPage.removeClass(DISABLED_CLASS_NAME);
    }
};

class AjaxPage {

    /**
	 * 初始化分页
	 * @param _
     */
	init(_) {
        const settings = getSettings(_);
        const { disableCache, pageSizeKey, pageSize, currentPageKey, useNoTotalsMode } = settings;
        eventMap[_] = getEvent(_);

        // 每页显示条数
        let	pSize = pageSize || 10;
        // 根据本地缓存配置每页显示条数
		if (!disableCache) {
            const userMemory = getUserMemory(_);

            // 验证是否存在每页显示条数缓存数据
            if (userMemory && userMemory.page && userMemory.page[pageSizeKey]) {
                pSize = userMemory.page[pageSizeKey];
            }
		}

        extend(settings, {
            pageData: {
                [pageSizeKey]: pSize,
                [currentPageKey]: 1
            }
        });

		// 当useNoTotalsMode:true 时，异步获取总页模式失效
        if (useNoTotalsMode) {
            settings.asyncTotals = null;
        }
        setSettings(settings);

        // 初始化dropdown
        const dropwownArg = {
            _,
            defaultValue: settings.pageData[pageSizeKey],
            onChange: value => {
                // 事件中的settings需要重新获取最新数据
                const settings = getSettings(_);
                settings.pageData = {
                    [currentPageKey]: 1,
                    [pageSizeKey]: value
                };

                saveUserMemory(settings);

                // 更新缓存
                setSettings(settings);

                // 调用事件、渲染tbody
                const query = extend({}, settings.query, settings.sortData, settings.pageData);
                settings.pagingBefore(query);
                core.refresh(_, () => {
                    settings.pagingAfter(query);
                });
            }
        };
        dropdown.init(dropwownArg);

		// 绑定事件
        this.initEvent(_);
	}

    /**
     * 绑定分页事件
     * @param _
     */
	initEvent(_) {
	    const _this = this;
	    // 事件: 首页
        const { firstPage, previousPage, nextPage, lastPage, numberPage, refresh, gotoPage } = eventMap[_];
        jTool(firstPage.target).on(firstPage.events, firstPage.selector, function () {
            _this.gotoPage(getSettings(_), 1);
        });

        // 事件: 上一页
        jTool(previousPage.target).on(previousPage.events, previousPage.selector, function () {
            const settings = getSettings(_);
            const cPage = settings.pageData[settings.currentPageKey];
            const toPage = cPage - 1;
            _this.gotoPage(settings, toPage < 1 ? 1 : toPage);
        });

        // 事件: 下一页
        jTool(nextPage.target).on(nextPage.events, nextPage.selector, function () {
            const settings = getSettings(_);
            const cPage = settings.pageData[settings.currentPageKey];
            const tPage = settings.pageData.tPage;
            const toPage = cPage + 1;
            _this.gotoPage(settings, toPage > tPage ? tPage : toPage);
        });

        // 事件: 尾页
        jTool(lastPage.target).on(lastPage.events, lastPage.selector, function () {
            const settings = getSettings(_);
            _this.gotoPage(settings, settings.pageData.tPage);
        });

        // 事件: 页码
        jTool(numberPage.target).on(numberPage.events, numberPage.selector, function () {
            const settings = getSettings(_);
            const pageAction = jTool(this);

            // 分页页码
            let toPage = pageAction.attr('to-page');
            if (!toPage || !Number(toPage) || pageAction.hasClass(DISABLED_CLASS_NAME)) {
                return false;
            }
            _this.gotoPage(settings, parseInt(toPage, 10));
        });

        // 事件: 刷新
        jTool(refresh.target).on(refresh.events, refresh.selector, function () {
            const settings = getSettings(_);
            _this.gotoPage(settings, settings.pageData[settings.currentPageKey]);
        });

        // 事件: 快捷跳转
        jTool(gotoPage.target).on(gotoPage.events, gotoPage.selector, function (event) {
            if (event.which !== 13) {
                return;
            }
            _this.gotoPage(getSettings(_), parseInt(this.value, 10));
        });
    }

    /**
     * 分页所需HTML
     * @param params
     * @returns {parseData}
     */
    @parseTpl(ajaxPageTpl)
    createHtml(params) {
        const { settings } = params;
        return {
            gridManagerName: settings._,
            keyName: TOOLBAR_KEY,
            gotoFirstText: i18n(settings, 'goto-first-text'),
            gotoLastText: i18n(settings, 'goto-last-text'),
            firstPageText: i18n(settings, 'first-page'),
            previousPageText: i18n(settings, 'previous-page'),
            nextPageText: i18n(settings, 'next-page'),
            lastPageText: i18n(settings, 'last-page'),
            pageSizeOptionTpl: dropdown.createHtml(settings)
        };
    }

	/**
	 * 重置分页数据
	 * @param settings
	 * @param totals 总条数
	 * @param len 本次请求返回的总条数，该参数仅在totals为空时使用
	 */
	resetPageData(settings, totals, len) {
	    const { _, useNoTotalsMode, currentPageKey, pageData, asyncTotals, pageSizeKey, pageSize } = settings;
        const $footerToolbar = jTool(getQuerySelector(_));
        const cPage = pageData[currentPageKey] || 1;
        const pSize = pageData[pageSizeKey] || pageSize;

        const update = (totals, asyncTotalsText) => {
            const pageData = getPageData(settings, totals, len);

            // 更新底部DOM节点
            updateFooterDOM($footerToolbar, settings, pageData);

            // 修改分页描述信息
            resetPageInfo($footerToolbar, settings, pageData, asyncTotalsText);

            // 更新Cache
            setSettings(extend(true, settings, {pageData}));

            // 显示底部工具条
            $footerToolbar.css('visibility', 'visible');
        };

        // 异步总条数
        if (asyncTotals) {
            if (len < pSize) {
                update((cPage - 1) * pSize + len);
                return;
            }

            // 正在使用异步总条数的情况下，不再使用接口返回的totals字段
            update(null, asyncTotals.text);
            asyncTotals.handler(settings, getParams(settings)).then(totals => {
                update(totals);
            });
            return;
        }

        // 无总条数
        if (useNoTotalsMode) {
            update();
            return;
        }

        // 正常
        update(totals);
	}

    /**
     * 更新刷新图标状态
     * @param _
     * @param isRefresh: 是否刷新
     */
    updateRefreshIconState(_, isRefresh) {
        // 刷新按纽
        const refreshAction = jTool(`${getQuerySelector(_)} .refresh-action`);

        // 当前刷新图标不存在
        if (refreshAction.length === 0) {
            return;
        }

        const refreshClass = 'refreshing';
        // 启动刷新
	    if (isRefresh) {
            refreshAction.addClass(refreshClass);
            return;
        }

        // 停止刷新
        setTimeout(() => {
            refreshAction.removeClass(refreshClass);
        }, 3000);
    }

    /**
     * 更新选中信息
     * @param settings
     */
    updateCheckedInfo(_) {
        const checkedInfo = jTool(`${getQuerySelector(_)} .toolbar-info.checked-info`);
        if (checkedInfo.length === 0) {
            return;
        }
        checkedInfo.html(i18n(getSettings(_), 'checked-info', getCheckedData(_).length));
    }

	/**
	 * 跳转至指定页
	 * @param settings
	 * @param toPage 跳转页
	 */
	gotoPage(settings, toPage) {
		if (!toPage || toPage < 1) {
			toPage = 1;
		}

		const { _, useNoTotalsMode, currentPageKey, pageData, pageSize, pageSizeKey, sortData, query, pagingBefore, pagingAfter } = settings;
		const { tPage } = pageData;
		// 未使用使用无总条数模式 且 跳转的指定页大于总页数时，强制跳转至最后一页
		if (!useNoTotalsMode && toPage > tPage) {
			toPage = tPage;
		}

		// 替换被更改的值
		pageData[currentPageKey] = toPage;
		pageData[pageSizeKey] = pageData[pageSizeKey] || pageSize;

		// 更新缓存
		setSettings(settings);

		// 调用事件、渲染DOM
		const newQuery = extend({}, query, sortData, pageData);
		pagingBefore(newQuery);
		core.refresh(_, () => {
			pagingAfter(newQuery);
		});
	}

	/**
	 * 消毁
	 * @param _
	 */
	destroy(_) {
        clearTargetEvent(eventMap[_]);
	}
}
export default new AjaxPage();
