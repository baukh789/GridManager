/*
 * AjaxPage: 分页
 * */
import { jTool, Base } from './Base';
import Core from './Core';
import Cache from './Cache';
import I18n from './I18n';
class AjaxPage {
	/**
	 * 分页所需HTML
	 * @param $table
	 * @returns {string}
     */
	createHtml(settings) {
	    // 刷新按纽
	    const refreshHtml = settings.showFooterRefresh ? `<span class="refresh-action">${ I18n.i18nText(settings, 'refresh-action') }</span>` : '';

	    // 快捷跳转
	    const gotoHtml = settings.showFooterGoTo ? `<div class="goto-page">
							${ I18n.i18nText(settings, 'goto-first-text') }
							<input type="text" class="gp-input"/>
							${ I18n.i18nText(settings, 'goto-last-text') }
						</div>` : '';

	    // 每页显示条数
	    const pageSizeHtml = settings.showFooterPageSize ? this.__getPageSizeHtml(settings) : '';

	    // 选中项描述信息
        const checkedInfoHtml = settings.showFooterCheckedInfo ? `<div class="toolbar-info checked-info"></div>` : '';

	    // 分页描述信息
	    const pageInfoHtml = settings.showFooterPageInfo ? `<div class="toolbar-info page-info"></div>` : '';

	    // 页码
	    const paginationHtml = `<div class="ajax-page"><ul class="pagination"></ul></div>`;

		const html = `<div class="footer-toolbar">
						${refreshHtml}
						${gotoHtml}
						${pageSizeHtml}
						${checkedInfoHtml}
						${pageInfoHtml}
						${paginationHtml}
					</div>`;
		return html;
	}

	/**
	 * 初始化分页
	 * @param $table
	 * @param settings
     */
	initAjaxPage($table, settings) {
		// 根据本地缓存配置每页显示条数
		if (!settings.disableCache) {
			this.__configPageForCache($table, settings);
		} else {
            const pageData = {
                [settings.pageSizeKey]: settings.pageSize || 10,
                [settings.currentPageKey]: 1
            };
            jTool.extend(settings, {pageData: pageData});
            Cache.setSettings($table, settings);
        }

		// 绑定页面跳转事件
		this.__bindPageJumpEvent($table);

		// 绑定设置显示条数切换事件
		this.__bindSetPageSizeEvent($table);
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

		// 生成页码DOM节点
		this.__createPaginationDOM($table, settings, _pageData);

		// 重置当前页显示条数
        this.__resetPSize($table, settings, _pageData);

		// 修改分页描述信息
        this.__resetPageInfo($table, settings, _pageData);

		// 更新Cache
		Cache.setSettings($table, jTool.extend(true, settings, {pageData: _pageData}));

		const tableWarp = $table.closest('.table-wrap');

		// 分页工具条
		const footerToolbar = jTool('.footer-toolbar', tableWarp);
        footerToolbar.css('visibility', 'visible');
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
		Cache.setSettings($table, settings);

		// 调用事件、渲染DOM
		const query = jTool.extend({}, settings.query, settings.sortData, settings.pageData);
		settings.pagingBefore(query);
		Core.refresh($table, () => {
			settings.pagingAfter(query);
		});
	}

	/**
	 * 生成页码DOM节点
	 * @param $table
	 * @param settings
	 * @param pageData 分页数据格式
	 * @private
     */
	__createPaginationDOM($table, settings, pageData) {
		const tableWarp = $table.closest('.table-wrap');

		// 分页工具条
		const footerToolbar = jTool('.footer-toolbar', tableWarp);
        settings.useNoTotalsMode && footerToolbar.attr('no-totals-mode', 'true');

		// 分页区域
		const pagination = jTool('.pagination', footerToolbar);

		pagination.html(this.__joinPagination(settings, pageData));
	}

	/**
	 * 拼接页码字符串
	 * @param settings
	 * @param pageData 分页数据格式
	 * @private
     */
	__joinPagination(settings, pageData) {
		// 当前页
		let cPage = Number(pageData[settings.currentPageKey] || 0);

		// 总页数
		let tPage = Number(pageData.tPage || 0);

		// 临时存储分页HTML片段
		let	tHtml = '';

		// 临时存储末尾页码THML片段
		let	lHtml = '';

		// 配置首页
		let firstClassName = 'first-page';
		let	previousClassName = 'previous-page';

		if (cPage === 1) {
			firstClassName += ' disabled';
			previousClassName += ' disabled';
		}
		tHtml += `<li c-page="1" class="${firstClassName}">
					${I18n.i18nText(settings, 'first-page')}
				</li>
				<li c-page="${cPage - 1}" class="${previousClassName}">
					${I18n.i18nText(settings, 'previous-page')}
				</li>`;
		// 循环开始数
		let i = 1;

		// 循环结束数
		let	maxI = tPage;

		// 配置 first端省略符
		if (cPage > 4) {
			tHtml += `<li c-page="1">
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
					<li c-page="${ tPage }">
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
                tHtml += `<li c-page="${ i }">${ i }</li>`;
            }
        }
		tHtml += lHtml;

		// 配置下一页与尾页
		let nextClassName = 'next-page';
		let	lastClassName = 'last-page';
		if (cPage >= tPage) {
			nextClassName += ' disabled';
			lastClassName += ' disabled';
		}
		tHtml += `<li c-page="${ cPage + 1 }" class="${ nextClassName }">
					${ I18n.i18nText(settings, 'next-page') }
				</li>
				<li c-page="${ tPage }" class="${ lastClassName }">
					${ I18n.i18nText(settings, 'last-page') }
				</li>`;
		return tHtml;
	}

	/**
	 * 生成每页显示条数选择框据
	 * @param settings
	 * @private
     */
	__getPageSizeHtml(settings) {
        const sizeData = settings.sizeData;
        // error
        if (!sizeData || sizeData.length === 0) {
            Base.outLog('渲染失败：参数[sizeData]配置错误', 'error');
            return '';
        }
		let pageSizeHtml = '<div class="change-size"><select name="pSizeArea">';
		jTool.each(sizeData, (index, value) => {
			pageSizeHtml += `<option value="${value}">${value}</option>`;
		});
        pageSizeHtml = `${pageSizeHtml}</select></div>`;
		return pageSizeHtml;
	}

	/**
	 * 绑定页面跳转事件
	 * @param $table
	 * @private
     */
	__bindPageJumpEvent($table) {
		const tableWarp	= $table.closest('.table-wrap');

		// 分页工具条
		const footerToolbar = jTool('.footer-toolbar', tableWarp);

		this.__bindPageClick($table, footerToolbar);
		this.__bindInputEvent($table, footerToolbar);
		this.__bindRefreshEvent(footerToolbar);
	}

	/**
	 * 绑定分页点击事件
	 * @param $table
	 * @param footerToolbar
	 * @private
     */
	__bindPageClick($table, footerToolbar) {
		const _this = this;
		footerToolbar.off('click', 'li');
		footerToolbar.on('click', 'li', function () {
			const pageAction = jTool(this);

			// 分页页码
			let cPage = pageAction.attr('c-page');
			if (!cPage || !Number(cPage) || pageAction.hasClass('disabled')) {
				Base.outLog('指定页码无法跳转,已停止。原因:1、可能是当前页已处于选中状态; 2、所指向的页不存在', 'info');
				return false;
			}
			cPage = window.parseInt(cPage);
			_this.gotoPage($table, Cache.getSettings($table), cPage);
		});
	}

	/**
	 * 绑定快捷跳转事件
	 * @param $table
	 * @param footerToolbar
	 * @private
     */
	__bindInputEvent($table, footerToolbar) {
		const _this = this;
        footerToolbar.off('keyup', '.gp-input');
        footerToolbar.on('keyup', '.gp-input', function (event) {
			if (event.which !== 13) {
				return;
			}
			let _cPage = parseInt(this.value, 10);
			_this.gotoPage($table, Cache.getSettings($table), _cPage);
			this.value = '';
		});
	}

	/**
	 * 绑定刷新界面事件
	 * @param footerToolbar
	 * @private
     */
	__bindRefreshEvent(footerToolbar) {
		const refreshAction	= jTool('.refresh-action', footerToolbar);

		refreshAction.unbind('click');
		refreshAction.bind('click', event => {
			const _tableWarp = jTool(event.target).closest('.table-wrap');
			const _table = jTool('table[grid-manager]', _tableWarp);

			Core.refresh(_table);
		});
	}

	/**
	 * 绑定设置当前页显示数事件
	 * @param $table
	 * @private
     */
	__bindSetPageSizeEvent($table) {
		const tableWarp = $table.closest('.table-wrap');

		// 分页工具条
		const footerToolbar = jTool('.footer-toolbar', tableWarp);

		// 切换条数区域
		const sizeArea = jTool('select[name=pSizeArea]', footerToolbar);

		// 未找到单页显示数切换区域，停止该事件绑定
		if (!sizeArea || sizeArea.length === 0) {
			return false;
		}
		sizeArea.unbind('change');
		sizeArea.bind('change', event => {
			const _size = jTool(event.target);
			const _tableWarp = _size.closest('.table-wrap');
			const _table = jTool('table[grid-manager]', _tableWarp);
			const settings = Cache.getSettings($table);
			settings.pageData = {};
			settings.pageData[settings.currentPageKey] = 1;
			settings.pageData[settings.pageSizeKey] = window.parseInt(_size.val());

			Cache.saveUserMemory(_table, settings);

			// 更新缓存
			Cache.setSettings($table, settings);

			// 调用事件、渲染tbody
			const query = jTool.extend({}, settings.query, settings.sortData, settings.pageData);
			settings.pagingBefore(query);
			Core.refresh(_table, () => {
				settings.pagingAfter(query);
			});
		});
	}

	/**
	 * 重置每页显示条数, 重置条数文字信息 [注: 这个方法只做显示更新, 不操作Cache 数据]
	 * @param $table
	 * @param settings
	 * @param pageData 分页数据格式
	 * @returns {boolean}
	 * @private
     */
	__resetPSize($table, settings, pageData) {
		const tableWarp = $table.closest('.table-wrap');
		const toolBar = jTool('.footer-toolbar', tableWarp);
		const pSizeArea = jTool('select[name="pSizeArea"]', toolBar);
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
     * @param $table
     * @param settings
     * @param pageData
     * @private
     */
	__resetPageInfo($table, settings, pageData) {
        const pageInfo = jTool('.footer-toolbar .page-info', $table.closest('.table-wrap'));
        // 从多少开始
        const fromNum = pageData[settings.currentPageKey] === 1 ? 1 : (pageData[settings.currentPageKey] - 1) * pageData[settings.pageSizeKey] + 1;

        // 到多少结束
        const toNum = pageData[settings.currentPageKey] * pageData[settings.pageSizeKey];

        // 总共条数
        const totalNum = pageData.tSize;

        const tmpHtml = I18n.i18nText(settings, 'page-info', [fromNum, toNum, totalNum, pageData[settings.currentPageKey], pageData.tPage]);
        pageInfo.html(tmpHtml);
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
		let	userMemory = Cache.getUserMemory($table);

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
		Cache.setSettings($table, settings);
	}

	/**
	 * 消毁
	 * @param $table
	 */
	destroy($table) {
		const tableWarp = $table.closest('.table-wrap');
		const footerToolbar = jTool('.footer-toolbar', tableWarp);
		const gp_input = jTool('.gp-input', footerToolbar);
		const refreshAction	= jTool('.refresh-action', footerToolbar);
		const sizeArea = jTool('select[name=pSizeArea]', footerToolbar);

		// 清理: 分页点击事件
		footerToolbar.off('click', 'li');

		// 清理: 快捷跳转事件
		gp_input.unbind('keyup');

		// 清理: 刷新界面事件
		refreshAction.unbind('click');

		// 清理: 设置当前页显示数事件
		sizeArea.unbind('change');
	}
}
export default new AjaxPage();
