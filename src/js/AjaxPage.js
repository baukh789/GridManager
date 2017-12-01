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
	createHtml($table) {
		const html = `<div class="page-toolbar">
						<div class="refresh-action"><i class="iconfont icon-shuaxin"></i></div>
						<div class="goto-page">
							${ I18n.i18nText($table, 'goto-first-text') }
							<input type="text" class="gp-input"/>
							${ I18n.i18nText($table, 'goto-last-text') }
						</div>
						<div class="change-size"><select name="pSizeArea"></select></div>
						<div class="dataTables_info"></div>
						<div class="ajax-page"><ul class="pagination"></ul></div>
					</div>`;
		return html;
	}

	// cache dom object, void multi dom find
	cacheDomObject($table) {
		this.$table = $table;
		this.tableWarp = $table.closest('.table-wrap');
		this.pageToolbar = $('.page-toolbar', this.tableWarp);
	}

	/**
	 * 初始化分页
	 * @param $table
     */
	initAjaxPage($table) {
		this.cacheDomObject($table);

		const settings = Cache.getSettings($table);
		// 分页工具条
		this.pageToolbar.hide();
		const sizeData = settings.sizeData;
		// 生成每页显示条数选择框
		this.createPageSizeDOM(sizeData);
		// 绑定页面跳转事件
		this.bindPageJumpEvent();
		// 绑定设置显示条数切换事件
		this.bindSetPageSizeEvent();
	}

	/**
	 * 生成页码DOM节点
	 * @param pageData 分页数据格式
     */
	createPaginationDOM(pageData) {
		// 分页区域
		const pagination = $('.pagination', this.pageToolbar);

		pagination.html(this.joinPagination(pageData));
	}

	/**
	 * 拼接页码字符串
	 * @param pageData 分页数据格式
     */
	joinPagination(pageData) {
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
					${I18n.i18nText(this.$table, 'first-page')}
				</li>
				<li c-page="${cPage - 1}" class="${previousClassName}">
					${I18n.i18nText(this.$table, 'previous-page')}
				</li>`;
		// 循环开始数
		let i = 1;

		// 循环结束数
		let	maxI = tPage;

		// 配置first端省略符
		if (cPage > 4) {
			tHtml += `<li c-page="1">
						1
					</li>
					<li class="disabled">
						...
					</li>`;
			i = cPage - 2;
		}
		// 配置last端省略符
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
					${ I18n.i18nText(this.$table, 'next-page') }
				</li>
				<li c-page="${ tPage }" class="${ lastClassName }">
					${ I18n.i18nText(this.$table, 'last-page') }
				</li>`;
		return tHtml;
	}

	/**
	 * 生成每页显示条数选择框据
	 * @param _sizeData_ 选择框自定义条数
     */
	createPageSizeDOM(_sizeData_) {
		// 分页区域
		const pSizeArea	= $('select[name="pSizeArea"]', this.pageToolbar);

		// error
		if (!_sizeData_ || _sizeData_.length === 0) {
			Base.outLog('渲染失败：参数[sizeData]配置错误', 'error');
			return;
		}

		let _ajaxPageHtml = '';
		$.each(_sizeData_, (i, v) => {
			_ajaxPageHtml += `<option value="${ v }">${ v }</option>`;
		});
		pSizeArea.html(_ajaxPageHtml);
	}

	/**
	 * 绑定页面跳转事件
     */
	bindPageJumpEvent() {
		this.bindClickPageEvent();
		this.bindGoInputEvent();
		this.bindRefreshEvent();
	}
	// 绑定刷新界面事件
	bindRefreshEvent() {
		const _this = this;
		const refreshAction	= $('.refresh-action', this.pageToolbar);
		refreshAction.unbind('click');
		refreshAction.bind('click', function () {
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
			_this.gotoPage(_inputValue);
			_input.val('');
		});
	}
	// 绑定快捷跳转事件
	bindGoInputEvent() {
		const _this = this;
		// 快捷跳转
		const gp_input = $('.gp-input', this.pageToolbar);
		gp_input.unbind('keyup');
		gp_input.bind('keyup', function (e) {
			if (e.which !== 13) {
				return;
			}
			const _inputValue = parseInt(this.value, 10);
			if (!_inputValue) {
				this.focus();
				return;
			}
			_this.gotoPage(_inputValue);
			this.value = '';
		});
	}
	// 绑定分页点击事件
	bindClickPageEvent() {
		const _this = this;
		this.pageToolbar.off('click', 'li');
		this.pageToolbar.on('click', 'li', function () {
			const pageAction = $(this);
			// 分页页码
			let cPage = pageAction.attr('c-page');
			if (!cPage || !Number(cPage) || pageAction.hasClass('disabled')) {
				Base.outLog('指定页码无法跳转,已停止。原因:1、可能是当前页已处于选中状态; 2、所指向的页不存在', 'info');
				return false;
			}
			cPage = window.parseInt(cPage);
			_this.gotoPage(cPage);
		});
	}
	/**
	 * 跳转至指定页
	 * @param _cPage 指定页
     */
	gotoPage(_cPage) {
		const settings = Cache.getSettings(this.$table);

		// 跳转的指定页大于总页数
		if (_cPage > settings.pageData.tPage) {
			_cPage = settings.pageData.tPage;
		}

		// 替换被更改的值
		settings.pageData.cPage = _cPage;
		settings.pageData.pSize = settings.pageData.pSize || settings.pageSize;

		// 更新缓存
		Cache.setSettings(this.$table, settings);

		// 调用事件、渲染DOM
		const query = $.extend({}, settings.query, settings.sortData, settings.pageData);
		settings.pagingBefore(query);
		Core.__refreshGrid(this.$table, () => {
			settings.pagingAfter(query);
		});
	}

	/**
	 * 绑定设置当前页显示数事件
     */
	bindSetPageSizeEvent() {
		const _this = this;
		// 切换条数区域
		const sizeArea = $('select[name=pSizeArea]', this.pageToolbar);

		if (!sizeArea || sizeArea.length === 0) {
			Base.outLog('未找到单页显示数切换区域，停止该事件绑定', 'info');
			return false;
		}
		sizeArea.unbind('change');
		sizeArea.bind('change', function () {
			const _size = $(this);
			const _tableWarp = _size.closest('.table-wrap');
			const _table = $('table[grid-manager]', _tableWarp);
			const settings = Cache.getSettings(_this.$table);
			settings.pageData = {
				cPage: 1,
				pSize: window.parseInt(_size.val())
			};

			Cache.saveUserMemory(_table);

			// 更新缓存
			Cache.setSettings(_this.$table, settings);

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
	 * @param _pageData_ 分页数据格式
	 * @returns {boolean}
     */
	resetPSize(_pageData_) {
		const pSizeArea = $('select[name="pSizeArea"]', this.pageToolbar);
		const pSizeInfo = $('.dataTables_info', this.pageToolbar);

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

		const tmpHtml = I18n.i18nText(this.$table, 'dataTablesInfo', [fromNum, toNum, totalNum]);

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
		this.cacheDomObject($table);
		const settings = Cache.getSettings($table);
		const _this = this;
		if (isNaN(parseInt(totals, 10))) {
			return;
		}
		const _pageData = getPageData(totals);

		// 生成页码DOM节点
		_this.createPaginationDOM(_pageData);

		// 重置当前页显示条数
		_this.resetPSize(_pageData);

		// 更新Cache
		Cache.setSettings($table, $.extend(true, settings, {pageData: _pageData}));

		this.pageToolbar.show();

		// 计算分页数据
		function getPageData(tSize) {
			const _pSize = settings.pageData.pSize || settings.pageSize;
			const _tSize = tSize;
			const _cPage = settings.pageData.cPage || 1;
			return {
				tPage: Math.ceil(_tSize / _pSize),		// 总页数
				cPage: _cPage,							// 当前页
				pSize: _pSize,							// 每页显示条数
				tSize: _tSize							// 总条路
			};
		}
	}

	/**
	 * 根据本地缓存配置分页数据
	 * @param $table
     */
	configPageForCache($table) {
		this.cacheDomObject($table);
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
