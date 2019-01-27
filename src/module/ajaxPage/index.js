/*
 * ajaxPage: 分页
 * */
import './style.less';
import { jTool, base, cache, parseTpl } from '../../common';
import core from '../core';
import i18n from '../i18n';
import ajaxPageTpl from './ajax-page.tpl.html';
class AjaxPage {
	/**
	 * 初始化分页
	 * @param $table
	 * @param $tableWarp
	 * @param settings
     */
	initAjaxPage($table, $tableWarp, settings) {
        $tableWarp.append(this.createHtml({settings, i18n, tpl: settings.ajaxPageTemplate}));

		// 根据本地缓存配置每页显示条数
		if (!settings.disableCache) {
			this.__configPageForCache($table, settings);
		} else {
            const pageData = {
                [settings.pageSizeKey]: settings.pageSize || 10,
                [settings.currentPageKey]: 1
            };
            jTool.extend(settings, {pageData: pageData});
            cache.setSettings(settings);
        }

		// 绑定页面跳转事件
		this.__bindPageJumpEvent($table, $tableWarp);

		// 绑定设置显示条数切换事件
		this.__bindSetPageSizeEvent($table, $tableWarp);
	}

    /**
     * 分页所需HTML
     * @param params
     * @returns {parseData}
     */
    @parseTpl(ajaxPageTpl)
    createHtml(params) {
        const { settings, i18n } = params;
        return {
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
	 * @param $table
	 * @param settings
	 * @param totals 总条数
	 * @param len 本次请求返回的总条数，该参数仅在totals为空时使用
	 */
	resetPageData($table, settings, totals, len) {
		const _pageData = this.__getPageData(settings, totals, len);
        const $tableWrap = $table.closest('.table-wrap');
        const $footerToolbar = jTool('.footer-toolbar', $tableWrap);

		// 更新底部DOM节点
		this.__updateFooterDOM($footerToolbar, settings, _pageData);

		// 重置当前页显示条数
        this.__resetPSize($footerToolbar, settings, _pageData);

		// 修改分页描述信息
        this.__resetPageInfo($footerToolbar, settings, _pageData);

		// 更新Cache
		cache.setSettings(jTool.extend(true, settings, {pageData: _pageData}));

		// 显示底部工具条
        $footerToolbar.css('visibility', 'visible');
	}

    /**
     * 更新刷新图标状态
     * @param $table
     * @param isRefresh: 是否刷新
     */
    updateRefreshIconState($table, isRefresh) {
        const tableWrap = $table.closest('.table-wrap');

        // 刷新按纽
        const refreshAction = jTool('.footer-toolbar .refresh-action', tableWrap);

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
     * @param $table
     * @param settings
     */
    updateCheckedInfo($table, settings) {
        const checkedInfo = jTool('.footer-toolbar .toolbar-info.checked-info', $table.closest('.table-wrap'));
        if (checkedInfo.length === 0) {
            return;
        }
        checkedInfo.html(i18n.i18nText(settings, 'checked-info', cache.getCheckedData($table).length));
    }

	/**
	 * 跳转至指定页
	 * @param $table
	 * @param settings
	 * @param toPage 跳转页
	 */
	gotoPage($table, settings, toPage) {
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
		core.refresh($table, () => {
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
	 * 绑定页面跳转事件
	 * @param $table
	 * @param $tableWarp
	 * @private
     */
	__bindPageJumpEvent($table, $tableWarp) {
		// 分页工具条
		const $footerToolbar = jTool('.footer-toolbar', $tableWarp);

		this.__bindPageClick($table, $footerToolbar);
		this.__bindInputEvent($table, $footerToolbar);
		this.__bindRefreshEvent($table, $footerToolbar);
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
	 * @param $table
	 * @param $footerToolbar
	 * @private
     */
	__bindPageClick($table, $footerToolbar) {
		const _this = this;
		const key = base.getKey($table);

		// 事件: 首页
        const $firstPage = jTool('[pagination-before] .first-page', $footerToolbar);
        if ($firstPage.length) {
            $firstPage.bind('click', () => {
                _this.gotoPage($table, cache.getSettings(key), 1);
            });
        }

        // 事件: 上一页
        const $previousPage = jTool('[pagination-before] .previous-page', $footerToolbar);
        if ($previousPage.length) {
            $previousPage.bind('click', () => {
                const settings = cache.getSettings(key);
                const cPage = settings.pageData[settings.currentPageKey];
                const toPage = cPage - 1;
                _this.gotoPage($table, settings, toPage < 1 ? 1 : toPage);
            });
        }

        // 事件: 下一页
        const $nextPage = jTool('[pagination-after] .next-page', $footerToolbar);
        if ($nextPage.length) {
            $nextPage.bind('click', () => {
                const settings = cache.getSettings(key);
                const cPage = settings.pageData[settings.currentPageKey];
                const tPage = settings.pageData.tPage;
                const toPage = cPage + 1;
                _this.gotoPage($table, settings, toPage > tPage ? tPage : toPage);
            });
        }

        // 事件: 尾页
        const $lastPage = jTool('[pagination-after] .last-page', $footerToolbar);
        if ($lastPage.length) {
            $lastPage.bind('click', () => {
                const settings = cache.getSettings(key);
                _this.gotoPage($table, settings, settings.pageData.tPage);
            });
        }

        // 事件: 页码
        const $paginationNumber = jTool('[pagination-number]', $footerToolbar);
        if ($paginationNumber.length) {
            $paginationNumber.on('click', 'li', function () {
                const settings = cache.getSettings(key);
                const pageAction = jTool(this);

                // 分页页码
                let toPage = pageAction.attr('to-page');
                if (!toPage || !Number(toPage) || pageAction.hasClass('disabled')) {
                    base.outLog('指定页码无法跳转,已停止。原因:1、可能是当前页已处于选中状态; 2、所指向的页不存在', 'info');
                    return false;
                }
                toPage = window.parseInt(toPage);
                _this.gotoPage($table, settings, toPage);
            });
        }
	}

	/**
	 * 绑定快捷跳转事件
	 * @param $table
	 * @param $footerToolbar
	 * @private
     */
	__bindInputEvent($table, $footerToolbar) {
		const _this = this;
        $footerToolbar.off('keyup', '.gp-input');
        $footerToolbar.on('keyup', '.gp-input', function (event) {
			if (event.which !== 13) {
				return;
			}
			let _cPage = parseInt(this.value, 10);
			_this.gotoPage($table, cache.getSettings(base.getKey($table)), _cPage);
			this.value = '';
		});
	}

	/**
	 * 绑定刷新界面事件
	 * @param $table
	 * @param $footerToolbar
	 * @private
     */
	__bindRefreshEvent($table, $footerToolbar) {
		const refreshAction	= jTool('.refresh-action', $footerToolbar);

		refreshAction.unbind('click');
		refreshAction.bind('click', () => {
			core.refresh($table);
		});
	}

	/**
	 * 绑定设置当前页显示数事件
	 * @param $table
	 * @param $tableWarp
	 * @private
     */
	__bindSetPageSizeEvent($table, $tableWarp) {
		// 切换条数区域
		const $sizeArea = jTool('select[name=pSizeArea]', jTool('.footer-toolbar', $tableWarp));

		// 未找到单页显示数切换区域，停止该事件绑定
		if (!$sizeArea || $sizeArea.length === 0) {
			return false;
		}
        $sizeArea.unbind('change');
        $sizeArea.bind('change', event => {
			const _size = jTool(event.target);
			const settings = cache.getSettings($table);
			settings.pageData = {};
			settings.pageData[settings.currentPageKey] = 1;
			settings.pageData[settings.pageSizeKey] = window.parseInt(_size.val());

			cache.saveUserMemory($table, settings);

			// 更新缓存
			cache.setSettings(settings);

			// 调用事件、渲染tbody
			const query = jTool.extend({}, settings.query, settings.sortData, settings.pageData);
			settings.pagingBefore(query);
			core.refresh($table, () => {
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

        // 重置分页附属显示信息: 当前页从多少条开始显示
        const $beginNumber = jTool('[begin-number-info]', $footerToolbar);
        if ($beginNumber.length) {
            $beginNumber.text(fromNum).val(fromNum);
        }

        // 重置分页附属显示信息: 当前页到多少条结束显示
        const $endNumber = jTool('[end-number-info]', $footerToolbar);
        if ($endNumber.length) {
            $endNumber.text(toNum).val(toNum);
        }

        // 重置分页附属显示信息: 当前页
        const $currentPage = jTool('[current-page-info]', $footerToolbar);
        if ($currentPage.length) {
            $currentPage.text(cPage).val(cPage);
        }

        // 重置分页附属显示信息: 总条数
        const $totalsNumber = jTool('[totals-number-info]', $footerToolbar);
        if ($totalsNumber.length) {
            $totalsNumber.text(totalNum).val(totalNum);
        }

        // 重置分页附属显示信息: 总页数
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
		pageData['tPage'] = _tPage;

		// 当前页
		pageData[settings.currentPageKey] = _cPage > _tPage ? 1 : _cPage;

		// 每页显示条数
		pageData[settings.pageSizeKey] = _pSize;

		// 总条路
		pageData['tSize'] = totals;

		return pageData;
	}

	/**
	 * 根据本地缓存配置分页数据
	 * @param $table
	 * @param settings
	 * @private
     */
	__configPageForCache($table, settings) {
		// 缓存对应
		let	userMemory = cache.getUserMemory($table);

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
	 * @param $table
	 */
	destroy($table) {
		const $tableWarp = $table.closest('.table-wrap');
		const $footerToolbar = jTool('.footer-toolbar', $tableWarp);

		// 清理: 快捷跳转事件
        jTool('.gp-input', $footerToolbar).unbind('keyup');

		// 清理: 刷新界面事件
        jTool('.refresh-action', $footerToolbar).unbind('click');

		// 清理: 设置当前页显示数事件
        jTool('select[name=pSizeArea]', $footerToolbar).unbind('change');

		// 清理: 首页事件
        jTool('[pagination-before] .first-page', $footerToolbar).unbind('click');

        // 清理: 上一页事件
        jTool('[pagination-before] .previous-page', $footerToolbar).unbind('click');

        // 清理: 下一页事件
        jTool('[pagination-after] .next-page', $footerToolbar).unbind('click');

        // 清理: 尾页事件
        jTool('[pagination-after] .last-page', $footerToolbar).unbind('click');

        // 清理: 页码事件
        jTool('[pagination-number]', $footerToolbar).off('click', 'li');
	}
}
export default new AjaxPage();
