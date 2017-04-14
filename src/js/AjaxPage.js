/*
 * AjaxPage: 分页
 * */
import $ from './jTool';
import Base from './Base';
import Core from './Core';
import Cache from './Cache';
import I18n from './I18n';
const AjaxPage = {
	html: function ($table) {
		const html= `<div class="page-toolbar">
						<div class="refresh-action"><i class="iconfont icon-shuaxin"></i></div>
						<div class="goto-page">
							${ I18n.i18nText($table, "goto-first-text") }
							<input type="text" class="gp-input"/>
							${ I18n.i18nText($table, "goto-last-text") }
						</div>
						<div class="change-size"><select name="pSizeArea"></select></div>
						<div class="dataTables_info"></div>
						<div class="ajax-page"><ul class="pagination"></ul></div>
					</div>`;
		return html;
	}
	/**
	 * 初始化分页
	 * @param $table：[jTool object]
	 */
	,initAjaxPage: function($table){
		const Settings = Cache.getSettings($table);
		const _this = this;
		let tableWarp 	= $table.closest('.table-wrap'),
			pageToolbar = $('.page-toolbar', tableWarp);	//分页工具条
		const sizeData = Settings.sizeData ;
		pageToolbar.hide();
		//生成每页显示条数选择框
		_this.createPageSizeDOM($table, sizeData);

		//绑定页面跳转事件
		_this.bindPageJumpEvent($table);

		//绑定设置显示条数切换事件
		_this.bindSetPageSizeEvent($table);
	}
	/**
	 * 生成页码DOM节点
	 * @param $table [jTool object]
	 * @param pageData  分页数据格式
	 */
	,createPaginationDOM: function($table, pageData){
		const tableWarp = $table.closest('.table-wrap'),
			pageToolbar = $('.page-toolbar', tableWarp),	//分页工具条
			pagination	= $('.pagination', pageToolbar);		//分页区域
		pagination.html( this.joinPagination($table, pageData) );
	}
	/*
	* 拼接页码字符串
	 * @param $table: [table jTool object]
	 * @param cPage: 当前页码
	 * @param pageData  分页数据格式
	* */
	,joinPagination: function($table, pageData){
		let cPage = Number(pageData.cPage || 0),		//当前页
			tPage = Number(pageData.tPage || 0),		//总页数
			tHtml = '',					//临时存储分页HTML片段
			lHtml = '';					//临时存储末尾页码THML片段
		//配置首页
		let firstClassName    = 'first-page',
			previousClassName = 'previous-page';
		if(cPage == 1){
			firstClassName += ' disabled';
			previousClassName += ' disabled';
		}
		tHtml+= `<li c-page="1" class="${ firstClassName }">
					${ I18n.i18nText($table, "first-page") }
				</li>
				<li c-page="${cPage-1}" class="${ previousClassName }">
					${ I18n.i18nText($table, "previous-page") }
				</li>`;
		// 循环开始数
		let i = 1;
		// 循环结束数
		let	maxI = tPage;

		//配置first端省略符
		if(cPage > 4){
			tHtml+= `<li c-page="1">
						1
					</li>
					<li class="disabled">
						...
					</li>`;
			i = cPage - 2;
		}
		//配置last端省略符
		if((tPage - cPage) > 4){
			maxI = cPage + 2;
			lHtml+= `<li class="disabled">
						...
					</li>
					<li c-page="${ tPage }">
						${ tPage }
					</li>`;
		}
		// 配置页码
		for(i; i<= maxI;i++){
			if(i == cPage){
				tHtml+= `<li class="active">
							${ cPage }
						</li>`;
				continue;
			}
			tHtml+= `<li c-page="${ i }">
						${ i }
					</li>`;
		}
		tHtml += lHtml;
		//配置下一页与尾页
		let nextClassName = 'next-page',
			lastClassName = 'last-page';
		if(cPage >= tPage){
			nextClassName += ' disabled';
			lastClassName += ' disabled';
		}
		tHtml += `<li c-page="${ cPage + 1 }" class="${ nextClassName }">
					${ I18n.i18nText($table, "next-page") }
				</li>
				<li c-page="${ tPage }" class="${ lastClassName }">
					${ I18n.i18nText($table, "last-page") }
				</li>`;
		return tHtml;
	}
	/**
	 * 生成每页显示条数选择框据
	 * @param $table: [table jTool object]
	 * @param _sizeData: _选择框自定义条数
	 */
	,createPageSizeDOM: function($table, _sizeData_){
		const tableWarp	= $table.closest('.table-wrap'),
			pageToolbar = $('.page-toolbar', tableWarp),				//分页工具条
			pSizeArea	= $('select[name="pSizeArea"]', pageToolbar);	//分页区域
		//error
		if(!_sizeData_ || _sizeData_.length === 0){
			Base.outLog('渲染失败：参数[sizeData]配置错误' , 'error');
			return;
		}

		let _ajaxPageHtml = '';
		$.each(_sizeData_, (i, v) => {
			_ajaxPageHtml+= `<option value="${ v }">
								${ v }
							</option>`;
		});
		pSizeArea.html(_ajaxPageHtml);
	}
	/**
	 * 绑定页面跳转事件
	 * @param $table: [table jTool object]
	 */
	,bindPageJumpEvent:function($table){
		const _this = this;
		const tableWarp	= $table.closest('.table-wrap'),
			pageToolbar = $('.page-toolbar', tableWarp),		//分页工具条
			pagination	= $('.pagination', pageToolbar),		//分页区域
			gp_input	= $('.gp-input', pageToolbar),			//快捷跳转
			refreshAction	= $('.refresh-action', pageToolbar);//快捷跳转
		//绑定分页点击事件
		pageToolbar.off('click', 'li');
		pageToolbar.on('click', 'li', function() {
			const pageAction = $(this);
			let cPage = pageAction.attr('c-page');	//分页页码
			if(!cPage || !Number(cPage) || pageAction.hasClass('disabled')){
				Base.outLog('指定页码无法跳转,已停止。原因:1、可能是当前页已处于选中状态; 2、所指向的页不存在', 'info');
				return false;
			}
			cPage = parseInt(cPage);
			_this.gotoPage($table, cPage);
		});
		//绑定快捷跳转事件
		gp_input.unbind('keyup');
		gp_input.bind('keyup', function(e) {
			if(e.which !== 13){
				return;
			}
			const _inputValue = parseInt(this.value, 10);
			if(!_inputValue){
				this.focus();
				return;
			}
			_this.gotoPage($table, _inputValue);
			this.value = '';
		});
		//绑定刷新界面事件
		refreshAction.unbind('click');
		refreshAction.bind('click', function() {
			const _tableWarp = $(this).closest('.table-wrap'),
				  _table = $('table[grid-manager]', _tableWarp),
				  _input = $('.page-toolbar .gp-input', _tableWarp),
				  _value = _input.val();
			//跳转输入框为空时: 刷新当前页
			if(_value.trim() === ''){
				Core.__refreshGrid(_table);
				return;
			}
			//跳转输入框不为空时: 验证输入值是否有效,如果有效跳转至指定页,如果无效对输入框进行聚焦
			const _inputValue = parseInt(_input.val(), 10);
			if(!_inputValue){
				_input.focus();
				return;
			}
			_this.gotoPage($table, _inputValue);
			_input.val('');
		});
	}

	/**
	 * 跳转至指定页
	 * @param $table: [table jTool object]
	 * @param _cPage: 指定页
	 */
	,gotoPage: function ($table, _cPage) {
		const settings = Cache.getSettings($table);
		//跳转的指定页大于总页数
		if(_cPage > settings.pageData.tPage){
			_cPage = settings.pageData.tPage;
		}
		//替换被更改的值
		settings.pageData.cPage = _cPage;
		settings.pageData.pSize = settings.pageData.pSize || settings.pageSize;
		// 更新缓存
		Cache.updateSettings($table, settings);

		//调用事件、渲染DOM
		const query = $.extend({}, settings.query, settings.sortData, settings.pageData);
		settings.pagingBefore(query);
		Core.__refreshGrid($table, () => {
			settings.pagingAfter(query);
		});
	}

	/**
	 * 绑定设置当前页显示数事件
	 * @param $table: [table jTool object]
	 * @returns {boolean}
	 */
	,bindSetPageSizeEvent: function($table){
		const tableWarp = $table.closest('.table-wrap'),
			pageToolbar = $('.page-toolbar', tableWarp),	//分页工具条
			sizeArea	= $('select[name=pSizeArea]', pageToolbar);	//切换条数区域
		if(!sizeArea || sizeArea.length == 0){
			Base.outLog('未找到单页显示数切换区域，停止该事件绑定', 'info');
			return false;
		}
		sizeArea.unbind('change');
		sizeArea.bind('change', function(){
			const _size = $(this);
			const _tableWarp  = _size.closest('.table-wrap'),
				  _table	  = $('table[grid-manager]', _tableWarp);
			const settings = Cache.getSettings($table);
			settings.pageData = {
				cPage : 1,
				pSize : parseInt(_size.val())
			};

			Cache.saveUserMemory(_table);
			// 更新缓存
			Cache.updateSettings($table, settings);
			//调用事件、渲染tbody
			const query = $.extend({}, settings.query, settings.sortData, settings.pageData);
			settings.pagingBefore(query);
			Core.__refreshGrid(_table, () => {
				settings.pagingAfter(query);
			});

		});
	}

	/**
	 * 重置每页显示条数, 重置条数文字信息 [注: 这个方法只做显示更新, 不操作Cache 数据]
	 * @param $table: [table jTool object]
	 * @param _pageData_: 分页数据格式
	 * @returns {boolean}
	 */
	,resetPSize: function($table, _pageData_){
		const tableWarp = $table.closest('.table-wrap'),
			toolBar   = $('.page-toolbar', tableWarp),
			pSizeArea = $('select[name="pSizeArea"]', toolBar),
			pSizeInfo = $('.dataTables_info', toolBar);
		if(!pSizeArea || pSizeArea.length == 0){
			Base.outLog('未找到条数切换区域，停止该事件绑定', 'info');
			return false;
		}
		const fromNum   = _pageData_.cPage == 1 ? 1 : (_pageData_.cPage-1) * _pageData_.pSize + 1,	//从多少开始
			  toNum	    = _pageData_.cPage * _pageData_.pSize,	//到多少结束
			  totalNum  = _pageData_.tSize;			//总共条数
		const tmpHtml = I18n.i18nText($table, 'dataTablesInfo', [fromNum, toNum, totalNum]);
		//根据返回值修正单页条数显示值
		pSizeArea.val(_pageData_.pSize || 10);

		//修改条数文字信息
		pSizeInfo.html(tmpHtml);
		pSizeArea.show();
	}
	/**
	 * 重置分页数据
	 * @param $table: [table jTool object]
	 * @param totals: 总条数
	 */
	,resetPageData: function($table, totals){
		const Settings = Cache.getSettings($table);
		const _this = this;
		if(isNaN(parseInt(totals, 10))){
			return;
		}
		const _pageData = getPageData(totals);
		// 生成页码DOM节点
		_this.createPaginationDOM($table, _pageData);

		// 重置当前页显示条数
		_this.resetPSize($table, _pageData);

		// 更新Cache
		Cache.updateSettings($table, $.extend(true, Settings, {pageData: _pageData}));

		const tableWarp = $table.closest('.table-wrap');
		//分页工具条
		const pageToolbar = $('.page-toolbar', tableWarp);
		pageToolbar.show();

		// 计算分页数据
		function getPageData(tSize){
			const _pSize = Settings.pageData.pSize || Settings.pageSize,
				  _tSize = tSize,
				  _cPage = Settings.pageData.cPage || 1;
			return {
				tPage: Math.ceil(_tSize / _pSize),		// 总页数
				cPage: _cPage,							// 当前页
				pSize: _pSize,							// 每页显示条数
				tSize: _tSize							// 总条路
			}
		}
	}
	/**
	 * 根据本地缓存配置分页数据
	 * @param $table: [table jTool object]
	 */
	,configPageForCache: function($table){
		const Settings = Cache.getSettings($table);
		let _data = Cache.getUserMemory($table);
		// 缓存对应
		let	_cache = _data.cache;
		// 每页显示条数
		let	_pSize = null;

		// 验证是否存在每页显示条数缓存数据
		if(!_cache || !_cache.page || !_cache.page.pSize){
			_pSize = Settings.pageSize || 10.
		}
		else{
			_pSize = _cache.page.pSize;
		}
		const pageData = {
			pSize : _pSize,
			cPage : 1
		};
		$.extend(Settings, {pageData: pageData});
		Cache.updateSettings($table, Settings);
	}
};
export default AjaxPage;
