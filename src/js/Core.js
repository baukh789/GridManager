/*
* Core: 核心方法
* 1.刷新
* 2.渲染GM DOM
* 3.重置tbody
* */
import { $, Base } from './Base';
import Menu from './Menu';
import Adjust from './Adjust';
import AjaxPage from './AjaxPage';
import Cache from './Cache';
import Config from './Config';
import Checkbox from './Checkbox';
import Export from './Export';
import Order from './Order';
import Remind from './Remind';
import Sort from './Sort';
class Core {

	/**
	 * 刷新表格 使用现有参数重新获取数据，对表格数据区域进行渲染
	 * @param $table
	 * @param callback
     * @private
     */
	__refreshGrid($table, callback) {

		const settings = Cache.getSettings($table);

		const tableWrap = $table.closest('.table-wrap');

		// 刷新按纽
		const refreshAction = $('.page-toolbar .refresh-action', tableWrap);

		// 增加刷新中标识
		refreshAction.addClass('refreshing');

		// 使用配置数据
		// 如果存在配置数据ajax_data,将不再通过ajax_rul进行数据请求
		// 且ajax_beforeSend、ajax_error、ajax_complete将失效，仅有ajax_success会被执行
		if (settings.ajax_data) {
			this.driveDomForSuccessAfter($table, settings, settings.ajax_data, callback);
			settings.ajax_success(settings.ajax_data);
			this.removeRefreshingClass(tableWrap);
			return;
		}
		if (typeof (settings.ajax_url) !== 'string' || settings.ajax_url === '') {
			settings.outLog('请求表格数据失败！参数[ajax_url]配制错误', 'error');
			this.removeRefreshingClass(tableWrap);
			typeof callback === 'function' ? callback() : '';
			return;
		}
		let pram = $.extend(true, {}, settings.query);

		// 合并分页信息至请求参
		if (settings.supportAjaxPage) {
			$.extend(pram, settings.pageData);
		}

		// 合并排序信息至请求参
		if (settings.supportSorting) {
			$.each(settings.sortData, (key, value) => {
				// 增加sort_前缀,防止与搜索时的条件重叠
				pram[`sort_${key}`] = value;
			});
		}
		// 当前页不存在,或者小于1时, 修正为1
		if (!pram.cPage || pram.cPage < 1) {
			pram.cPage = 1;

			// 当前页大于总页数时, 修正为总页数
		} else if (pram.cPage > pram.tPage) {
			pram.cPage = pram.tPage;
		}

		// settings.query = pram;
		Cache.updateSettings($table, settings);

		Base.showLoading(tableWrap);

		// 当前为POST请求 且 Content-Type 未进行配置时, 默认使用 application/x-www-form-urlencoded
		// 说明|备注:
		// 1. Content-Type = application/x-www-form-urlencoded 的数据形式为 form data
		// 2. Content-Type = text/plain;charset=UTF-8 的数据形式为 request payload
		if (settings.ajax_type.toUpperCase() === 'POST' && !settings.ajax_headers['Content-Type']) {
			settings.ajax_headers['Content-Type'] = 'application/x-www-form-urlencoded';
		}

		// 请求前处理程序, 可以通过该方法修改全部的请求参数
		settings.requestHandler(pram);

		// 执行ajax
		$.ajax({
			url: settings.ajax_url,
			type: settings.ajax_type,
			data: pram,
			headers: settings.ajax_headers,
			cache: true,
			beforeSend: XMLHttpRequest => {
				settings.ajax_beforeSend(XMLHttpRequest);
			},
			success: response => {
				this.driveDomForSuccessAfter($table, settings, response, callback);
				settings.ajax_success(response);
			},
			error: (XMLHttpRequest, textStatus, errorThrown) => {
				settings.ajax_error(XMLHttpRequest, textStatus, errorThrown);
			},
			complete: (XMLHttpRequest, textStatus) => {
				settings.ajax_complete(XMLHttpRequest, textStatus);
				this.removeRefreshingClass(tableWrap);
				Base.hideLoading(tableWrap);
			}
		});
	}

	/**
	 * tableWrap
	 * @param tableWrap
     */
	removeRefreshingClass($tableWrap) {
		// 刷新按纽
		const refreshAction = $('.page-toolbar .refresh-action', $tableWrap);
		window.setTimeout(() => {
			refreshAction.removeClass('refreshing');
		}, 2000);
	};
	/**
	 * 执行ajax成功后重新渲染DOM
	 * @param $table
	 * @param settings
	 * @param response
	 * @param callback
     */
	driveDomForSuccessAfter($table, settings, response, callback) {
		// tbody dom
		const tbodyDOM = $('tbody', $table);
		const gmName = $table.attr('grid-manager');

		if (!response) {
			Base.outLog('请求数据失败！请查看配置参数[ajax_url或ajax_data]是否配置正确，并查看通过该地址返回的数据格式是否正确', 'error');
			return;
		}

		// 用于拼接tbody的HTML结构
		let tbodyTmpHTML = '';
		let parseRes = typeof (response) === 'string' ? JSON.parse(response) : response;

		// 执行请求后执行程序, 通过该程序可以修改返回值格式
		settings.responseHandler(parseRes);

		let _data = parseRes[settings.dataKey];

		// 数据索引
		let key = null;

		// 文本对齐属性
		let	alignAttr = null;

		// 数据模板
		let	template = null;

		// 数据模板导出的html
		let	templateHTML = null;

		// 数据为空时
		if (!_data || _data.length === 0) {
			tbodyTmpHTML = `<tr emptyTemplate>
										<td colspan="${$('th[th-visible="visible"]', $table).length}">
										${settings.emptyTemplate || '<div class="gm-emptyTemplate">数据为空</div>'}
										</td>
									</tr>`;
			parseRes.totals = 0;
			tbodyDOM.html(tbodyTmpHTML);
		} else {
			$.each(_data, (i, v) => {
				Cache.setRowData(gmName, i, v);
				tbodyTmpHTML += `<tr cache-key="${i}">`;
				$.each(settings.columnData, (i2, v2) => {
					key = v2.key;
					template = v2.template;
					templateHTML = typeof template === 'function' ? template(v[key], v) : v[key];
					alignAttr = v2.align ? `align="${v2.align}"` : '';
					tbodyTmpHTML += `<td gm-create="false" ${alignAttr}>${templateHTML}</td>`;
				});
				tbodyTmpHTML += '</tr>';
			});
			tbodyDOM.html(tbodyTmpHTML);
			this.resetTd($table, false);
		}
		// 渲染分页
		if (settings.supportAjaxPage) {
			AjaxPage.resetPageData($table, parseRes[settings.totalsKey]);
			Menu.checkMenuPageAction($table);
		}
		typeof callback === 'function' ? callback() : '';
	};


	/**
	 * 渲染HTML，根据配置嵌入所需的事件源DOM
	 * @param $table
     */
	createDOM($table) {
		let settings = Cache.getSettings($table);
		// TODO table或者tablewarp 需要使用 父节点的绝对值宽度 或者 通过父节点的宽度来对th进行分配
		$table.attr('width', '100%').attr('cellspacing', 1).attr('cellpadding', 0).attr('grid-manager', settings.gridManagerName);
		let theadHtml = '<thead grid-manager-thead>';
		let	tbodyHtml = '<tbody></tbody>';

		// 文本对齐属性
		let	alignAttr = '';

		// 宽度对应的html片段
		let	widthHtml = '';

		// 提醒对应的html片段
		let	remindHtml = '';

		// 排序对应的html片段
		let	sortingHtml	= '';

		// 通过配置项[columnData]生成thead
		$.each(settings.columnData, (i, v) => {
			// 表头提醒
			if (settings.supportRemind && typeof (v.remind) === 'string' && v.remind !== '') {
				remindHtml = `remind="${v.remind}"`;
			}

			// 排序
			sortingHtml = '';
			if (settings.supportSorting && typeof (v.sorting) === 'string') {
				if (v.sorting === settings.sortDownText) {
					sortingHtml = `sorting="${settings.sortDownText}"`;
					settings.sortData[v.key] = settings.sortDownText;
					Cache.updateSettings($table, settings);
				} else if (v.sorting === settings.sortUpText) {
					sortingHtml = `sorting="${settings.sortUpText}"`;
					settings.sortData[v.key] = settings.sortUpText;
					Cache.updateSettings($table, settings);
				} else {
					sortingHtml = 'sorting=""';
				}
			}
			if (v.width) {
				widthHtml = `width="${v.width}"`;
			} else {
				widthHtml = '';
			}
			alignAttr = v.align ? `align="${v.align}"` : '';
			theadHtml += `<th gm-create="false" th-name="${v.key}" ${remindHtml} ${sortingHtml} ${widthHtml} ${alignAttr}>${v.text}</th>`;
		});
		theadHtml += '</thead>';
		$table.html(theadHtml + tbodyHtml);

		// 嵌入序号DOM
		if (settings.supportAutoOrder) {
			Order.initDOM($table);
		}
		// 嵌入选择返选DOM
		if (settings.supportCheckbox) {
			Checkbox.initCheckbox($table);
		}
		// 存储原始th DOM
		Cache.setOriginalThDOM($table);

		// 表头提醒HTML
		const _remindHtml = Remind.html;

		// 配置列表HTML
		const _configHtml = Config.html;

		// 宽度调整HTML
		const _adjustHtml = Adjust.html;

		// 排序HTML
		const _sortingHtml = Sort.html;

		// 导出表格数据所需的事件源DOM
		const exportActionHtml = Export.html;

		// AJAX分页HTML
		const _ajaxPageHtml = AjaxPage.createHtml($table);

		// 外围的html片段
		let	wrapHtml = null;

		// 单个table所在的DIV容器
		let	tableWarp = null;

		// 单个table下的thead
		let	onlyThead = null;

		// 单个table下的TH
		let	onlyThList = null;

		// 单个TH
		let	onlyTH = null;

		// 单个TH下的上层DIV
		let	onlyThWarp = null;

		// 表头提醒DOM
		let	remindDOM = null;

		// 调整宽度DOM
		let	adjustDOM = null;

		// 排序DOM
		let	sortingDom = null;

		// 排序类形
		let	sortType = null;

		// 是否为插件自动生成的序号列
		let	isLmOrder = null;

		// 是否为插件自动生成的选择列
		let	isLmCheckbox = null;

		onlyThead = $('thead[grid-manager-thead]', $table);
		onlyThList = $('th', onlyThead);
		wrapHtml = `<div class="table-wrap">
						<div class="table-div" style="height:calc(${settings.height} - 40px)"></div>
						<span class="text-dreamland"></span>
					</div>`;
		$table.wrap(wrapHtml);
		tableWarp = $table.closest('.table-wrap');

		// 嵌入配置列表DOM
		if (settings.supportConfig) {
			tableWarp.append(_configHtml);
		}

		// 嵌入Ajax分页DOM
		if (settings.supportAjaxPage) {
			tableWarp.append(_ajaxPageHtml);
			AjaxPage.initAjaxPage($table);
		}

		// 嵌入导出表格数据事件源
		if (settings.supportExport) {
			tableWarp.append(exportActionHtml);
		}
		const configList = $('.config-list', tableWarp);
		let onlyWidth;
		onlyThWarp = $('<div class="th-wrap"></div>');
		$.each(onlyThList, (i2, v2) => {
			onlyTH = $(v2);
			onlyTH.attr('th-visible', 'visible');

			// 是否为自动生成的序号列
			if (settings.supportAutoOrder && onlyTH.attr('gm-order') === 'true') {
				isLmOrder = true;
			} else {
				isLmOrder = false;
			}

			// 是否为自动生成的选择列
			if (settings.supportCheckbox && onlyTH.attr('gm-checkbox') === 'true') {
				isLmCheckbox = true;
			} else {
				isLmCheckbox = false;
			}

			// 嵌入配置列表项
			if (settings.supportConfig) {
				configList
					.append(`<li th-name="${onlyTH.attr('th-name')}" class="checked-li">
								<input type="checkbox" checked="checked"/>
								<label>
									<span class="fake-checkbox"></span>
									${onlyTH.text()}
								</label>
							</li>`);
			}

			// 嵌入拖拽事件源
			// 插件自动生成的排序与选择列不做事件绑定
			if (settings.supportDrag && !isLmOrder && !isLmCheckbox) {
				onlyThWarp.html(`<span class="th-text drag-action">${onlyTH.html()}</span>`);
			} else {
				onlyThWarp.html(`<span class="th-text">${onlyTH.html()}</span>`);
			}
			let onlyThWarpPaddingTop = onlyThWarp.css('padding-top');

			// 嵌入表头提醒事件源
			// 插件自动生成的排序与选择列不做事件绑定
			if (settings.supportRemind && onlyTH.attr('remind') !== undefined && !isLmOrder && !isLmCheckbox) {
				remindDOM = $(_remindHtml);
				remindDOM.find('.ra-title').text(onlyTH.text());
				remindDOM.find('.ra-con').text(onlyTH.attr('remind') || onlyTH.text());
				if (onlyThWarpPaddingTop !== '' && onlyThWarpPaddingTop !== '0px') {
					remindDOM.css('top', onlyThWarpPaddingTop);
				}
				onlyThWarp.append(remindDOM);
			}

			// 嵌入排序事件源
			// 插件自动生成的排序与选择列不做事件绑定
			sortType = onlyTH.attr('sorting');
			if (settings.supportSorting && sortType !== undefined && !isLmOrder && !isLmCheckbox) {
				sortingDom = $(_sortingHtml);

				// 依据 sortType 进行初始显示
				switch (sortType) {
					case settings.sortUpText:
						sortingDom.addClass('sorting-up');
						break;
					case settings.sortDownText:
						sortingDom.addClass('sorting-down');
						break;
					default :
						break;
				}
				if (onlyThWarpPaddingTop !== '' && onlyThWarpPaddingTop !== '0px') {
					sortingDom.css('top', onlyThWarpPaddingTop);
				}
				onlyThWarp.append(sortingDom);
			}
			// 嵌入宽度调整事件源,插件自动生成的选择列不做事件绑定
			if (settings.supportAdjust && !isLmOrder && !isLmCheckbox) {
				adjustDOM = $(_adjustHtml);
				// 最后一列不支持调整宽度
				if (i2 === onlyThList.length - 1) {
					adjustDOM.hide();
				}
				onlyThWarp.append(adjustDOM);
			}
			onlyTH.html(onlyThWarp);

			// 宽度配置: GM自动创建为固定宽度
			if (isLmOrder || isLmCheckbox) {
				onlyWidth = 50;

				// 宽度配置: 非GM自动创建的列
			} else {
				// 当前th文本所占宽度大于设置的宽度
				let _minWidth = Base.getTextWidth(onlyTH);
				let _oldWidth = onlyTH.width();
				onlyWidth = _oldWidth > _minWidth ? _oldWidth : _minWidth;
			}

			// 清除width属性, 使用style.width进行宽度控制
			onlyTH.removeAttr('width');
			onlyTH.width(onlyWidth);
		});

		// 删除渲染中标识、增加渲染完成标识
		$table.removeClass('GridManager-loading');
		$table.addClass('GridManager-ready');
	}

	/**
	 * 重置列表, 处理局部刷新、分页事件之后的td排序
	 * @param dom: able 或者 tr
	 * @param isSingleRow: 指定DOM节点是否为tr[布尔值]
     */
	resetTd(dom, isSingleRow) {
		let _table = null;
		let	_tr = null;
		if (isSingleRow) {
			_tr = $(dom);
			_table = _tr.closest('table');
		} else {
			_table = $(dom);
			_tr	= _table.find('tbody tr');
		}

		if (!_tr || _tr.length === 0) {
			return false;
		}
		let settings = Cache.getSettings(_table);

		// 重置表格序号
		if (settings.supportAutoOrder) {
			let _pageData = settings.pageData;
			let onlyOrderTd = null;
			let	_orderBaseNumber = 1;
			let	_orderText;

			// 验证是否存在分页数据
			if (_pageData && _pageData['pSize'] && _pageData['cPage']) {
				_orderBaseNumber = _pageData.pSize * (_pageData.cPage - 1) + 1;
			}
			$.each(_tr, (i, v) => {
				_orderText = _orderBaseNumber + i;
				onlyOrderTd = $('td[gm-order="true"]', v);
				if (onlyOrderTd.length === 0) {
					$(v).prepend(`<td gm-order="true" gm-create="true">${_orderText}</td>`);
				} else {
					onlyOrderTd.text(_orderText);
				}
			});
		}

		// 重置表格选择 checkbox
		if (settings.supportCheckbox) {
			let onlyCheckTd = null;
			$.each(_tr, (i, v) => {
				onlyCheckTd = $('td[gm-checkbox="true"]', v);
				if (onlyCheckTd.length === 0) {
					$(v).prepend(`<td gm-checkbox="true" gm-create="true"><input type="checkbox"/></td>`);
				} else {
					$('[type="checkbox"]', onlyCheckTd).prop('checked', false);
				}
			});
		}

		// 依据存储数据重置td顺序
		if (settings.supportDrag) {
			const _thCacheList = Cache.getOriginalThDOM(_table);
			let	_td = null;
			if (!_thCacheList || _thCacheList.length === 0) {
				Base.outLog('resetTdForCache:列位置重置所必须的原TH DOM获取失败', 'error');
				return false;
			}
			let _tdArray = [];
			$.each(_tr, (i, v) => {
				_tdArray = [];
				_td = $('td', v);
				$.each(_td, (i2, v2) => {
					_tdArray[_thCacheList.eq(i2).index()] = v2.outerHTML;
				});
				v.innerHTML = _tdArray.join('');
			});
		}

		// 依据配置对列表进行隐藏、显示
		if (settings.supportConfig) {
			Base.initVisible(_table);
		}
	}
}
export default new Core();
