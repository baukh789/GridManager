/*
 * AjaxPage: 分页
 * */
import { $, Base } from './Base';
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
		const html = `<div class="page-toolbar">
						<div class="refresh-action"><i class="iconfont icon-shuaxin"></i></div>
						<div class="goto-page">
							${ I18n.i18nText(settings, 'goto-first-text') }
							<input type="text" class="gp-input"/>
							${ I18n.i18nText(settings, 'goto-last-text') }
						</div>
						<div class="change-size"><select name="pSizeArea"></select></div>
						<div class="dataTables_info"></div>
						<div class="ajax-page"><ul class="pagination"></ul></div>
					</div>`;
		return html;
	}

	/**
	 * 初始化分页
	 * @param $table
     */
	initAjaxPage($table) {
		const settings = Cache.getSettings($table);

		const sizeData = settings.sizeData;
		// error
		if (!sizeData || sizeData.length === 0) {
			Base.outLog('渲染失败：参数[sizeData]配置错误', 'error');
			return;
		}

		// 根据本地缓存配置每页显示条数
		if (!settings.disableCache) {
			this.configPageForCache($table);
		}

		const tableWarp = $table.closest('.table-wrap');

		// 分页工具条
		const pageToolbar = $('.page-toolbar', tableWarp);

		// 分页区域
		const pSizeArea	= $('select[name="pSizeArea"]', pageToolbar);

		pageToolbar.hide();

		// 生成每页显示条数选择框
		pSizeArea.html(this.getPageSizeHtml(sizeData));

		// 绑定页面跳转事件
		this.bindPageJumpEvent($table);

		// 绑定设置显示条数切换事件
		this.bindSetPageSizeEvent($table);
	}

	/**
	 * 生成页码DOM节点
	 * @param $table
	 * @param settings
	 * @param pageData 分页数据格式
     */
	createPaginationDOM($table, settings, pageData) {
		const tableWarp = $table.closest('.table-wrap');

		// 分页工具条
		const pageToolbar = $('.page-toolbar', tableWarp);

		// 分页区域
		const pagination = $('.pagination', pageToolbar);

		pagination.html(this.joinPagination(settings, pageData));
	}

	/**
	 * 拼接页码字符串
	 * @param settings
	 * @param pageData 分页数据格式
     */
	joinPagination(settings, pageData) {
		// 当前页
		let cPage = Number(pageData.cPage || 0);

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
		for (i; i <= maxI; i++) {
			if (i === cPage) {
				tHtml += `<li class="active">${ cPage }</li>`;
				continue;
			}
			tHtml += `<li c-page="${ i }">${ i }</li>`;
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
	 * @param sizeData 选择框自定义条数
     */
	getPageSizeHtml(sizeData) {
		let pageSizeHtml = '';
		$.each(sizeData, (index, value) => {
			pageSizeHtml += `<option value="${value}">${value}</option>`;
		});
		return pageSizeHtml;
	}

	/**
	 * 绑定页面跳转事件
	 * @param $table
     */
	bindPageJumpEvent($table) {
		const tableWarp	= $table.closest('.table-wrap');

		// 分页工具条
		const pageToolbar = $('.page-toolbar', tableWarp);

		this.bindPageClick($table, pageToolbar);
		this.bindInputEvent($table, pageToolbar);
		this.bindRefreshEvent($table, pageToolbar);

	}

	/**
	 * 绑定分页点击事件
	 * @param $table
	 * @param pageToolbar
     */
	bindPageClick($table, pageToolbar) {
		const _this = this;

		pageToolbar.off('click', 'li').on('click', 'li', function () {
			const pageAction = $(this);

			// 分页页码
			let cPage = pageAction.attr('c-page');
			if (!cPage || !Number(cPage) || pageAction.hasClass('disabled')) {
				Base.outLog('指定页码无法跳转,已停止。原因:1、可能是当前页已处于选中状态; 2、所指向的页不存在', 'info');
				return false;
			}
			cPage = window.parseInt(cPage);
			_this.gotoPage($table, cPage);
		});
	}

	/**
	 * 绑定快捷跳转事件
	 * @param $table
	 * @param pageToolbar
     */
	bindInputEvent($table, pageToolbar) {
		const _this = this;
		const gp_input = $('.gp-input', pageToolbar);

		gp_input.unbind('keyup').bind('keyup', function (e) {
			if (e.which !== 13) {
				return;
			}
			const _inputValue = parseInt(this.value, 10);
			if (!_inputValue) {
				this.focus();
				return;
			}
			_this.gotoPage($table, _inputValue);
			this.value = '';
		});
	}

	/**
	 * 绑定刷新界面事件
	 * @param $table
	 * @param pageToolbar
     */
	bindRefreshEvent($table, pageToolbar) {
		const _this = this;
		const refreshAction	= $('.refresh-action', pageToolbar);

		refreshAction.unbind('click').bind('click', function () {
			const _tableWarp = $(this).closest('.table-wrap');
			const _table = $('table[grid-manager]', _tableWarp);
			const _input = $('.page-toolbar .gp-input', _tableWarp);
			const _value = _input.val();

			// 跳转输入框为空时: 刷新当前页
			if (_value.trim() === '') {
				Core.__refreshGrid(_table);
				return;
			}

			// 跳转输入框不为空时: 验证输入值是否有效,如果有效跳转至指定页,如果无效对输入框进行聚焦
			const _inputValue = parseInt(_input.val(), 10);
			if (!_inputValue) {
				_input.focus();
				return;
			}
			_this.gotoPage($table, _inputValue);
			_input.val('');
		});
	}

	/**
	 * 跳转至指定页
	 * @param $table
	 * @param _cPage 指定页
     */
	gotoPage($table, _cPage) {
		const settings = Cache.getSettings($table);

		// 跳转的指定页大于总页数
		if (_cPage > settings.pageData.tPage) {
			_cPage = settings.pageData.tPage;
		}

		// 替换被更改的值
		settings.pageData.cPage = _cPage;
		settings.pageData.pSize = settings.pageData.pSize || settings.pageSize;

		// 更新缓存
		Cache.setSettings($table, settings);

		// 调用事件、渲染DOM
		const query = $.extend({}, settings.query, settings.sortData, settings.pageData);
		settings.pagingBefore(query);
		Core.__refreshGrid($table, () => {
			settings.pagingAfter(query);
		});
	}

	/**
	 * 绑定设置当前页显示数事件
	 * @param $table
     */
	bindSetPageSizeEvent($table) {
		const tableWarp = $table.closest('.table-wrap');

		// 分页工具条
		const pageToolbar = $('.page-toolbar', tableWarp);

		// 切换条数区域
		const sizeArea = $('select[name=pSizeArea]', pageToolbar);

		if (!sizeArea || sizeArea.length === 0) {
			Base.outLog('未找到单页显示数切换区域，停止该事件绑定', 'info');
			return false;
		}
		sizeArea.unbind('change');
		sizeArea.bind('change', function () {
			const _size = $(this);
			const _tableWarp = _size.closest('.table-wrap');
			const _table = $('table[grid-manager]', _tableWarp);
			const settings = Cache.getSettings($table);
			settings.pageData = {
				cPage: 1,
				pSize: window.parseInt(_size.val())
			};

			Cache.saveUserMemory(_table);

			// 更新缓存
			Cache.setSettings($table, settings);

			// 调用事件、渲染tbody
			const query = $.extend({}, settings.query, settings.sortData, settings.pageData);
			settings.pagingBefore(query);
			Core.__refreshGrid(_table, () => {
				settings.pagingAfter(query);
			});
		});
	}

	/**
	 * 重置每页显示条数, 重置条数文字信息 [注: 这个方法只做显示更新, 不操作Cache 数据]
	 * @param $table
	 * @param settings
	 * @param _pageData_ 分页数据格式
	 * @returns {boolean}
     */
	resetPSize($table, settings, _pageData_) {
		const tableWarp = $table.closest('.table-wrap');
		const toolBar = $('.page-toolbar', tableWarp);
		const pSizeArea = $('select[name="pSizeArea"]', toolBar);
		const pSizeInfo = $('.dataTables_info', toolBar);
		if (!pSizeArea || pSizeArea.length === 0) {
			Base.outLog('未找到条数切换区域，停止该事件绑定', 'info');
			return false;
		}

		// 从多少开始
		const fromNum = _pageData_.cPage === 1 ? 1 : (_pageData_.cPage - 1) * _pageData_.pSize + 1;

		// 到多少结束
		const toNum = _pageData_.cPage * _pageData_.pSize;

		// 总共条数
		const totalNum = _pageData_.tSize;

		const tmpHtml = I18n.i18nText(settings, 'dataTablesInfo', [fromNum, toNum, totalNum]);

		// 根据返回值修正单页条数显示值
		pSizeArea.val(_pageData_.pSize || 10);

		// 修改条数文字信息
		pSizeInfo.html(tmpHtml);
		pSizeArea.show();
		return true;
	}

	/**
	 * 重置分页数据
	 * @param $table
	 * @param totals 总条数
     */
	resetPageData($table, totals) {
		const settings = Cache.getSettings($table);
		const _this = this;
		if (isNaN(parseInt(totals, 10))) {
			return;
		}
		const _pageData = this.getPageData(settings, totals);

		// 生成页码DOM节点
		_this.createPaginationDOM($table, settings, _pageData);

		// 重置当前页显示条数
		_this.resetPSize($table, settings, _pageData);

		// 更新Cache
		Cache.setSettings($table, $.extend(true, settings, {pageData: _pageData}));

		const tableWarp = $table.closest('.table-wrap');

		// 分页工具条
		const pageToolbar = $('.page-toolbar', tableWarp);
		pageToolbar.show();
	}

	/**
	 * 计算并返回分页数据
	 * @param settings
	 * @param totals
	 * @returns {{tPage: number, cPage: *, pSize: *, tSize: *}}
     */
	getPageData(settings, totals) {
		const _pSize = settings.pageData.pSize || settings.pageSize;
		const _cPage = settings.pageData.cPage || 1;
		return {
			tPage: Math.ceil(totals / _pSize),		// 总页数
			cPage: _cPage,							// 当前页
			pSize: _pSize,							// 每页显示条数
			tSize: totals							// 总条路
		};
	}

	/**
	 * 根据本地缓存配置分页数据
	 * @param $table
     */
	configPageForCache($table) {
		const settings = Cache.getSettings($table);
		let _data = Cache.getUserMemory($table);

		// 缓存对应
		let	_cache = _data.cache;

		// 每页显示条数
		let	_pSize = null;

		// 验证是否存在每页显示条数缓存数据
		if (!_cache || !_cache.page || !_cache.page.pSize) {
			_pSize = settings.pageSize || 10;
		} else {
			_pSize = _cache.page.pSize;
		}
		const pageData = {
			pSize: _pSize,
			cPage: 1
		};
		$.extend(settings, {pageData: pageData});
		Cache.setSettings($table, settings);
	}
}
export default new AjaxPage();
