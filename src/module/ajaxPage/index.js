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
import base from '@common/base';
import cache from '@common/cache';
import { parseTpl } from '@common/parse';
import { TOOLBAR_KEY } from '@common/constants';
import core from '../core';
import i18n from '../i18n';
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
	    this.$body = jTool('body');
        this.eventMap[gridManagerName] = getAjaxEvent(gridManagerName, this.getQuerySelector(gridManagerName));

		// 根据本地缓存配置每页显示条数
		if (!settings.disableCache) {
			this.__configPageForCache(settings);
		} else {
            const pageData = {
                [settings.pageSizeKey]: settings.pageSize || 10,
                [settings.currentPageKey]: 1
            };
            jTool.extend(settings, {pageData: pageData});
            cache.setSettings(settings);
        }

		// 绑定事件
		this.__bindPageEvent(gridManagerName);
	}

    /**
     * 获取指定key的menu选择器
     * @param gridManagerName
     * @returns {string}
     */
    getQuerySelector(gridManagerName) {
        return `.footer-toolbar[${TOOLBAR_KEY}="${gridManagerName}"]`;
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
            refreshActionText: i18n.i18nText(settings, 'refresh-action'),
            gotoFirstText: i18n.i18nText(settings, 'goto-first-text'),
            gotoLastText: i18n.i18nText(settings, 'goto-last-text'),
            firstPageText: i18n.i18nText(settings, 'first-page'),
            previousPageText: i18n.i18nText(settings, 'previous-page'),
            nextPageText: i18n.i18nText(settings, 'next-page'),
            lastPageText: i18n.i18nText(settings, 'last-page'),
            pageSizeOptionTpl: this.__getPageSizeOptionStr(settings.sizeData)
        };
    }

	/**
	 * 重置分页数据
	 * @param settings
	 * @param totals 总条数
	 * @param len 本次请求返回的总条数，该参数仅在totals为空时使用
	 */
	resetPageData(settings, totals, len) {
		const pageData = this.__getPageData(settings, totals, len);
        const $footerToolbar = jTool(this.getQuerySelector(settings.gridManagerName));

		// 更新底部DOM节点
		this.__updateFooterDOM($footerToolbar, settings, pageData);

		// 重置当前页显示条数
        this.__resetPSize($footerToolbar, settings, pageData);

		// 修改分页描述信息
        this.__resetPageInfo($footerToolbar, settings, pageData);

		// 更新Cache
		cache.setSettings(jTool.extend(true, settings, {pageData}));

		// 显示底部工具条
        $footerToolbar.css('visibility', 'visible');
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
    updateCheckedInfo(settings) {
        const gridManagerName = settings.gridManagerName;
        const checkedInfo = jTool(`${this.getQuerySelector(gridManagerName)} .toolbar-info.checked-info`);
        if (checkedInfo.length === 0) {
            return;
        }
        checkedInfo.html(i18n.i18nText(settings, 'checked-info', cache.getCheckedData(gridManagerName).length));
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

		// 未使用使用无总条数模式 且 跳转的指定页大于总页数时，强制跳转至最后一页
		if (!settings.useNoTotalsMode && toPage > settings.pageData.tPage) {
			toPage = settings.pageData.tPage;
		}

		// 替换被更改的值
		settings.pageData[settings.currentPageKey] = toPage;
		settings.pageData[settings.pageSizeKey] = settings.pageData[settings.pageSizeKey] || settings.pageSize;

		// 更新缓存
		cache.setSettings(settings);

		// 调用事件、渲染DOM
		const query = jTool.extend({}, settings.query, settings.sortData, settings.pageData);
		settings.pagingBefore(query);
		core.refresh(settings.gridManagerName, () => {
			settings.pagingAfter(query);
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
        if (!settings.useNoTotalsMode) {
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
	 * 生成每页显示条数选择框据
	 * @param sizeData
	 * @private
     */
	__getPageSizeOptionStr(sizeData) {
        // error
        if (!sizeData || sizeData.length === 0) {
            base.outLog('渲染失败：参数[sizeData]配置错误', 'error');
            return '';
        }
		let pageSizeOptionStr = '';
		jTool.each(sizeData, (index, value) => {
            pageSizeOptionStr += `<option value="${value}">${value}</option>`;
		});
		return pageSizeOptionStr;
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
            firstUsable && $firstPage.addClass('disabled');
            previousUsable && $previousPage.addClass('disabled');
        } else {
            firstUsable && $firstPage.removeClass('disabled');
            previousUsable && $previousPage.removeClass('disabled');
        }

        if (toPage >= tPage) {
            nextUsable && $nextPage.addClass('disabled');
            lastUsable && $lastPage.addClass('disabled');
        } else {
            nextUsable && $nextPage.removeClass('disabled');
            lastUsable && $lastPage.removeClass('disabled');
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
        const { firstPage, previousPage, nextPage, lastPage, numberPage, refresh, gotoPage, changePageSize } = this.eventMap[gridManagerName];
        this.$body.on(firstPage.events, firstPage.selector, function () {
            _this.gotoPage(cache.getSettings(gridManagerName), 1);
        });

        // 事件: 上一页
        this.$body.on(previousPage.events, previousPage.selector, function () {
            const settings = cache.getSettings(gridManagerName);
            const cPage = settings.pageData[settings.currentPageKey];
            const toPage = cPage - 1;
            _this.gotoPage(settings, toPage < 1 ? 1 : toPage);
        });

        // 事件: 下一页
        this.$body.on(nextPage.events, nextPage.selector, function () {
            const settings = cache.getSettings(gridManagerName);
            const cPage = settings.pageData[settings.currentPageKey];
            const tPage = settings.pageData.tPage;
            const toPage = cPage + 1;
            _this.gotoPage(settings, toPage > tPage ? tPage : toPage);
        });

        // 事件: 尾页
        this.$body.on(lastPage.events, lastPage.selector, function () {
            const settings = cache.getSettings(gridManagerName);
            _this.gotoPage(settings, settings.pageData.tPage);
        });

        // 事件: 页码
        this.$body.on(numberPage.events, numberPage.selector, function () {
            const settings = cache.getSettings(gridManagerName);
            const pageAction = jTool(this);

            // 分页页码
            let toPage = pageAction.attr('to-page');
            if (!toPage || !Number(toPage) || pageAction.hasClass('disabled')) {
                base.outLog('指定页码无法跳转,已停止。原因:1、可能是当前页已处于选中状态; 2、所指向的页不存在', 'info');
                return false;
            }
            toPage = window.parseInt(toPage);
            _this.gotoPage(settings, toPage);
        });

        // 事件: 刷新
        this.$body.on(refresh.events, refresh.selector, function () {
            core.refresh(gridManagerName);
        });

        // 事件: 快捷跳转
        this.$body.on(gotoPage.events, gotoPage.selector, function (event) {
            if (event.which !== 13) {
                return;
            }
            let _cPage = parseInt(this.value, 10);
            _this.gotoPage(cache.getSettings(gridManagerName), _cPage);
        });

        // 事件: 切换每页显示条数
        this.$body.on(changePageSize.events, changePageSize.selector, function (event) {
            const _size = jTool(event.target);
            const settings = cache.getSettings(gridManagerName);
            settings.pageData = {};
            settings.pageData[settings.currentPageKey] = 1;
            settings.pageData[settings.pageSizeKey] = window.parseInt(_size.val());

            cache.saveUserMemory(settings);

            // 更新缓存
            cache.setSettings(settings);

            // 调用事件、渲染tbody
            const query = jTool.extend({}, settings.query, settings.sortData, settings.pageData);
            settings.pagingBefore(query);
            core.refresh(gridManagerName, () => {
                settings.pagingAfter(query);
            });
        });
	}

	/**
	 * 重置每页显示条数, 重置条数文字信息 [注: 这个方法只做显示更新, 不操作Cache 数据]
	 * @param $footerToolbar
	 * @param settings
	 * @param pageData 分页数据格式
	 * @returns {boolean}
	 * @private
     */
	__resetPSize($footerToolbar, settings, pageData) {
		const pSizeArea = jTool('select[name="pSizeArea"]', $footerToolbar);
		if (!pSizeArea || pSizeArea.length === 0) {
			return false;
		}

		// 根据返回值修正单页条数显示值
		pSizeArea.val(pageData[settings.pageSizeKey] || 10);

		pSizeArea.show();
		return true;
	}

    /**
     * 修改分页描述信息
     * @param $footerToolbar
     * @param settings
     * @param pageData
     * @private
     */
	__resetPageInfo($footerToolbar, settings, pageData) {

        // 从多少开始
        const fromNum = pageData[settings.currentPageKey] === 1 ? 1 : (pageData[settings.currentPageKey] - 1) * pageData[settings.pageSizeKey] + 1;

        // 到多少结束
        const toNum = pageData[settings.currentPageKey] * pageData[settings.pageSizeKey];

        // 总共条数
        const totalNum = pageData.tSize;

        // 当前页
        const cPage = pageData[settings.currentPageKey];

        // 总页数
        const tPage = pageData.tPage;

        const $pageInfo = jTool('.page-info', $footerToolbar);
        if ($pageInfo.length) {
            const info = i18n.i18nText(settings, 'page-info', [fromNum, toNum, totalNum, cPage, tPage]);
            $pageInfo.html(info);
        }

        // #001
        // 更新实时更新数据: 当前页从多少条开始显示
        const $beginNumber = jTool('[begin-number-info]', $footerToolbar);
        if ($beginNumber.length) {
            $beginNumber.text(fromNum);
            $beginNumber.val(fromNum);
        }

        // 更新实时更新数据: 当前页到多少条结束显示
        const $endNumber = jTool('[end-number-info]', $footerToolbar);
        if ($endNumber.length) {
            $endNumber.text(toNum);
            $endNumber.val(toNum);
        }

        // 更新实时更新数据: 当前页
        const $currentPage = jTool('[current-page-info]', $footerToolbar);
        if ($currentPage.length) {
            $currentPage.text(cPage);
            $currentPage.val(cPage);
        }

        // 更新实时更新数据: 总条数
        const $totalsNumber = jTool('[totals-number-info]', $footerToolbar);
        if ($totalsNumber.length) {
            $totalsNumber.text(totalNum);
            $totalsNumber.val(totalNum);
        }

        // 更新实时更新数据: 总页数
        const $totalsPage = jTool('[totals-page-info]', $footerToolbar);
        if ($totalsPage.length) {
            $totalsPage.text(tPage).val(tPage);
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
        if (settings.useNoTotalsMode) {
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
        base.clearBodyEvent(this.eventMap[gridManagerName]);
	}
}
export default new AjaxPage();
