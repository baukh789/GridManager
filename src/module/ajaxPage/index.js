/*
 * ajaxPage: 分页
**/
/**
 * #001:
 * 关于ajax-page.tpl.html 文件中的实时更新
 * 有效区域: <div class="footer-toolbar">标签内
 * 触发条件: 以下属性的标签将会触发实时更新，共有以下属性:
 * 1. begin-number-info: 当前页从多少条开始显示
 * 2. end-number-info: 当前页到多少条结束显示
 * 3. current-page-info: 当前页
 * 4. totals-number-info: 总条数
 * 5. totals-page-info: 总页数
 */
import './style.less';
import jTool from '@common/jTool';
import { clearTargetEvent } from '@common/base';
import cache from '@common/cache';
import { parseTpl } from '@common/parse';
import { TOOLBAR_KEY, DISABLED_CLASS_NAME } from '@common/constants';
import core from '../core';
import { getParams } from '../core/tool';
import i18n from '../i18n';
import dropdown from '../dropdown';
import ajaxPageTpl from './ajax-page.tpl.html';
import getAjaxEvent from './event';
class AjaxPage {
    eventMap = {};

    /**
	 * 初始化分页
	 * @param gridManagerName
     */
	init(gridManagerName) {
        const settings = cache.getSettings(gridManagerName);
        const { disableCache, pageSizeKey, pageSize, currentPageKey, useNoTotalsMode } = settings;
        this.eventMap[gridManagerName] = getAjaxEvent(gridManagerName);

		// 根据本地缓存配置每页显示条数
		if (!disableCache) {
			this.__configPageForCache(settings);
		} else {
            jTool.extend(settings, {
                pageData: {
                    [pageSizeKey]: pageSize || 10,
                    [currentPageKey]: 1
                }
            });
            cache.setSettings(settings);
        }

        // 当useNoTotalsMode:true 时，异步获取总页模式失效
        if (useNoTotalsMode) {
            settings.asyncTotals = null;
            cache.setSettings(settings);
        }

        // 初始化dropdown
        const dropwownArg = {
            gridManagerName,
            defaultValue: settings.pageData[pageSizeKey],
            onChange: value => {
                // 事件中的settings需要重新获取最新数据
                const settings = cache.getSettings(gridManagerName);
                settings.pageData = {
                    [currentPageKey]: 1,
                    [pageSizeKey]: parseInt(value, 10)
                };

                cache.saveUserMemory(settings);

                // 更新缓存
                cache.setSettings(settings);

                // 调用事件、渲染tbody
                const query = jTool.extend({}, settings.query, settings.sortData, settings.pageData);
                settings.pagingBefore(query);
                core.refresh(gridManagerName, () => {
                    settings.pagingAfter(query);
                });
            }
        };
        dropdown.init(dropwownArg);

		// 绑定事件
		this.__bindPageEvent(gridManagerName);
	}

    /**
     * 获取指定key的menu选择器
     * @param gridManagerName
     * @returns {string}
     */
    getQuerySelector(gridManagerName) {
        return `[${TOOLBAR_KEY}="${gridManagerName}"]`;
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
            gridManagerName: settings.gridManagerName,
            keyName: TOOLBAR_KEY,
            refreshActionText: i18n(settings, 'refresh-action'),
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
	    const { gridManagerName, useNoTotalsMode, asyncTotals } = settings;
        const $footerToolbar = jTool(this.getQuerySelector(gridManagerName));
        const cPage = settings.pageData[settings.currentPageKey] || 1;
        const pSize = settings.pageData[settings.pageSizeKey] || settings.pageSize;

        const update = (totals, asyncTotalsText) => {
            const pageData = this.__getPageData(settings, totals, len);

            // 更新底部DOM节点
            this.__updateFooterDOM($footerToolbar, settings, pageData);

            // 修改分页描述信息
            this.__resetPageInfo($footerToolbar, settings, pageData, asyncTotalsText);

            // 更新Cache
            cache.setSettings(jTool.extend(true, settings, {pageData}));

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
     * @param gridManagerName
     * @param isRefresh: 是否刷新
     */
    updateRefreshIconState(gridManagerName, isRefresh) {
        // 刷新按纽
        const refreshAction = jTool(`${this.getQuerySelector(gridManagerName)} .refresh-action`);

        // 当前刷新图标不存在
        if (refreshAction.length === 0) {
            return;
        }

        // 启动刷新
	    if (isRefresh) {
            refreshAction.addClass('refreshing');
            return;
        }

        // 停止刷新
        window.setTimeout(() => {
            refreshAction.removeClass('refreshing');
        }, 3000);
    }

    /**
     * 更新选中信息
     * @param settings
     */
    updateCheckedInfo(gridManagerName) {
        const checkedInfo = jTool(`${this.getQuerySelector(gridManagerName)} .toolbar-info.checked-info`);
        if (checkedInfo.length === 0) {
            return;
        }
        checkedInfo.html(i18n(cache.getSettings(gridManagerName), 'checked-info', cache.getCheckedData(gridManagerName).length));
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

		const { gridManagerName, useNoTotalsMode, currentPageKey, pageData, pageSize, pageSizeKey, sortData, query, pagingBefore, pagingAfter } = settings;
		const { tPage } = pageData;
		// 未使用使用无总条数模式 且 跳转的指定页大于总页数时，强制跳转至最后一页
		if (!useNoTotalsMode && toPage > tPage) {
			toPage = tPage;
		}

		// 替换被更改的值
		pageData[currentPageKey] = toPage;
		pageData[pageSizeKey] = pageData[pageSizeKey] || pageSize;

		// 更新缓存
		cache.setSettings(settings);

		// 调用事件、渲染DOM
		const newQuery = jTool.extend({}, query, sortData, pageData);
		pagingBefore(newQuery);
		core.refresh(gridManagerName, () => {
			pagingAfter(newQuery);
		});
	}

	/**
	 * 更新底部DOM节点
	 * @param $footerToolbar
	 * @param settings
	 * @param pageData 分页数据格式
	 * @private
     */
    __updateFooterDOM($footerToolbar, settings, pageData) {
        settings.useNoTotalsMode && $footerToolbar.attr('no-totals-mode', 'true');

		// 分页码区域
		const $paginationNumber = jTool('[pagination-number]', $footerToolbar);

		// 重置分页码
        $paginationNumber.html(this.__joinPaginationNumber(settings, pageData));

        // 更新分页禁用状态
        this.__updatePageDisabledState($footerToolbar, pageData[settings.currentPageKey], pageData.tPage);
	}

	/**
	 * 拼接页码字符串
	 * @param settings
	 * @param pageData 分页数据格式
	 * @private
     */
    __joinPaginationNumber(settings, pageData) {
		// 当前页
		let cPage = Number(pageData[settings.currentPageKey] || 0);

		// 总页数
		let tPage = Number(pageData.tPage || 0);

		// 临时存储分页HTML片段
		let	tHtml = '';

		// 临时存储末尾页码THML片段
		let	lHtml = '';
		// 循环开始数
		let i = 1;

		// 循环结束数
		let	maxI = tPage;

		// 配置 first端省略符
		if (cPage > 4) {
			tHtml += `<li to-page="1">
						1
					</li>
					<li class="disabled">
						...
					</li>`;
			i = cPage - 2;
		}
		// 配置 last端省略符
		if ((tPage - cPage) > 4) {
			maxI = cPage + 2;
			lHtml += `<li class="disabled">
						...
					</li>
					<li to-page="${ tPage }">
						${ tPage }
					</li>`;
		}

		// 配置页码
        if (pageData.tSize) {
            for (i; i <= maxI; i++) {
                if (i === cPage) {
                    tHtml += `<li class="active">${ cPage }</li>`;
                    continue;
                }
                tHtml += `<li to-page="${ i }">${ i }</li>`;
            }
        }
		tHtml += lHtml;

		return tHtml;
	}

    /**
     * 更新分页禁用状态
     * @param $footerToolbar
     * @param toPage
     * @param tPage
     * @private
     */
	__updatePageDisabledState($footerToolbar, toPage, tPage) {
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

        if (toPage >= tPage) {
            nextUsable && $nextPage.addClass(DISABLED_CLASS_NAME);
            lastUsable && $lastPage.addClass(DISABLED_CLASS_NAME);
        } else {
            nextUsable && $nextPage.removeClass(DISABLED_CLASS_NAME);
            lastUsable && $lastPage.removeClass(DISABLED_CLASS_NAME);
        }
    }

	/**
	 * 绑定分页点击事件
	 * @param gridManagerName
	 * @private
     */
    __bindPageEvent(gridManagerName) {
		const _this = this;

		// 事件: 首页
        const { firstPage, previousPage, nextPage, lastPage, numberPage, refresh, gotoPage } = this.eventMap[gridManagerName];
        jTool(firstPage.target).on(firstPage.events, firstPage.selector, function () {
            _this.gotoPage(cache.getSettings(gridManagerName), 1);
        });

        // 事件: 上一页
        jTool(previousPage.target).on(previousPage.events, previousPage.selector, function () {
            const settings = cache.getSettings(gridManagerName);
            const cPage = settings.pageData[settings.currentPageKey];
            const toPage = cPage - 1;
            _this.gotoPage(settings, toPage < 1 ? 1 : toPage);
        });

        // 事件: 下一页
        jTool(nextPage.target).on(nextPage.events, nextPage.selector, function () {
            const settings = cache.getSettings(gridManagerName);
            const cPage = settings.pageData[settings.currentPageKey];
            const tPage = settings.pageData.tPage;
            const toPage = cPage + 1;
            _this.gotoPage(settings, toPage > tPage ? tPage : toPage);
        });

        // 事件: 尾页
        jTool(lastPage.target).on(lastPage.events, lastPage.selector, function () {
            const settings = cache.getSettings(gridManagerName);
            _this.gotoPage(settings, settings.pageData.tPage);
        });

        // 事件: 页码
        jTool(numberPage.target).on(numberPage.events, numberPage.selector, function () {
            const settings = cache.getSettings(gridManagerName);
            const pageAction = jTool(this);

            // 分页页码
            let toPage = pageAction.attr('to-page');
            if (!toPage || !Number(toPage) || pageAction.hasClass(DISABLED_CLASS_NAME)) {
                return false;
            }
            toPage = parseInt(toPage, 10);
            _this.gotoPage(settings, toPage);
        });

        // 事件: 刷新
        jTool(refresh.target).on(refresh.events, refresh.selector, function () {
            core.refresh(gridManagerName);
        });

        // 事件: 快捷跳转
        jTool(gotoPage.target).on(gotoPage.events, gotoPage.selector, function (event) {
            if (event.which !== 13) {
                return;
            }
            let _cPage = parseInt(this.value, 10);
            _this.gotoPage(cache.getSettings(gridManagerName), _cPage);
        });
	}

    /**
     * 修改分页描述信息
     * @param $footerToolbar
     * @param settings
     * @param pageData
     * @param asyncTotalText: 异步总页loading文本
     * @private
     */
	__resetPageInfo($footerToolbar, settings, pageData, asyncTotalText) {

        // 从多少开始
        const fromNum = pageData[settings.currentPageKey] === 1 ? 1 : (pageData[settings.currentPageKey] - 1) * pageData[settings.pageSizeKey] + 1;

        // 到多少结束
        const toNum = pageData[settings.currentPageKey] * pageData[settings.pageSizeKey];

        // 总共条数
        let totalNum = pageData.tSize;

        // 当前页
        const cPage = pageData[settings.currentPageKey];

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
    }

	/**
	 * 计算并返回分页数据
	 * @param settings
	 * @param totals
     * @param len 本次请求返回的总条数，该参数仅在totals为空时使用
	 * @returns {{tPage: number, cPage: *, pSize: *, tSize: *}}
	 * @private
     */
	__getPageData(settings, totals, len) {
		const _pSize = settings.pageData[settings.pageSizeKey] || settings.pageSize;
		const _cPage = settings.pageData[settings.currentPageKey] || 1;

        let _tPage = null;
        if (!totals) {
            _tPage = len < _pSize ? _cPage : _cPage + 1;
        } else {
            _tPage = Math.ceil(totals / _pSize);
        }
		const pageData = {};

		// 总页数
		pageData['tPage'] = _tPage || 1;

		// 当前页
		pageData[settings.currentPageKey] = _cPage > _tPage ? 1 : _cPage;

		// 每页显示条数
		pageData[settings.pageSizeKey] = _pSize;

		// 总条数
		pageData['tSize'] = totals;

		return pageData;
	}

	/**
	 * 根据本地缓存配置分页数据
	 * @param settings
	 * @private
     */
	__configPageForCache(settings) {
		// 缓存对应
		let	userMemory = cache.getUserMemory(settings.gridManagerName);

		// 每页显示条数
		let	_pSize = null;

		// 验证是否存在每页显示条数缓存数据
		if (!userMemory || !userMemory.page || !userMemory.page[settings.pageSizeKey]) {
			_pSize = settings.pageSize || 10;
		} else {
			_pSize = userMemory.page[settings.pageSizeKey];
		}
		const pageData = {};
		pageData[settings.pageSizeKey] = _pSize;
		pageData[settings.currentPageKey] = 1;
		jTool.extend(settings, {pageData: pageData});
		cache.setSettings(settings);
	}

	/**
	 * 消毁
	 * @param gridManagerName
	 */
	destroy(gridManagerName) {
        clearTargetEvent(this.eventMap[gridManagerName]);
	}
}
export default new AjaxPage();
