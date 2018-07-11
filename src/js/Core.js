/*
* Core: 核心方法
* 1.刷新
* 2.渲染GM DOM
* 3.重置tbody
* */
import { jTool, Base } from './Base';
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
import Filter from './Filter';
class Core {
	/**
	 * 刷新表格 使用现有参数重新获取数据，对表格数据区域进行渲染
	 * @param $table
	 * @param callback
     * @private
     */
	refresh($table, callback) {
		const settings = Cache.getSettings($table);

		const tableWrap = $table.closest('.table-wrap');

		// 刷新按纽
		const refreshAction = jTool('.page-toolbar .refresh-action', tableWrap);

		// 增加刷新中标识
		refreshAction.addClass('refreshing');
		Base.showLoading(tableWrap);

		let ajaxPromise = this.transformToPromise($table, settings);

		settings.ajax_beforeSend(ajaxPromise);
		ajaxPromise
			.then(response => {
				this.driveDomForSuccessAfter($table, settings, response, callback);
				settings.ajax_success(response);
				settings.ajax_complete(response);
				Base.hideLoading(tableWrap);
				this.removeRefreshingClass(tableWrap);
			})
			.catch(error => {
				settings.ajax_error(error);
				settings.ajax_complete(error);
				Base.hideLoading(tableWrap);
				this.removeRefreshingClass(tableWrap);
			});
	}

	/**
	 * 将不同类型的ajax_data转换为promise
	 * @param $table
	 * @param settings
	 * @returns promise
	 */
	transformToPromise($table, settings) {
		let ajaxData = typeof settings.ajax_data === 'function' ? settings.ajax_data(settings) : settings.ajax_data;

		// ajaxData === string url
		if (typeof ajaxData === 'string') {
			return getPromiseByUrl($table, settings, ajaxData);
		}

		// ajaxData === Promise
		if (typeof ajaxData.then === 'function') {
			return ajaxData;
		}

		// 	ajaxData === 静态数据
		if (jTool.type(ajaxData) === 'object' || jTool.type(ajaxData) === 'array') {
			return new Promise(resolve => {
				resolve(ajaxData);
			});
		}

		function getPromiseByUrl() {
			let pram = jTool.extend(true, {}, settings.query);

			// 合并分页信息至请求参
			if (settings.supportAjaxPage) {
				pram[settings.currentPageKey] = settings.pageData[settings.currentPageKey];
				pram[settings.pageSizeKey] = settings.pageData[settings.pageSizeKey];
			}

			// 合并排序信息至请求参
            jTool.each(settings.sortData, (key, value) => {
                // 增加sort_前缀,防止与搜索时的条件重叠
                pram[`${settings.sortKey}${key}`] = value;
            });

			// 当前为POST请求 且 Content-Type 未进行配置时, 默认使用 application/x-www-form-urlencoded
			// 说明|备注:
			// 1. Content-Type = application/x-www-form-urlencoded 的数据形式为 form data
			// 2. Content-Type = text/plain;charset=UTF-8 的数据形式为 request payload
			if (settings.ajax_type.toUpperCase() === 'POST' && !settings.ajax_headers['Content-Type']) {
				settings.ajax_headers['Content-Type'] = 'application/x-www-form-urlencoded';
			}

			// 请求前处理程序, 可以通过该方法增加 或 修改全部的请求参数
			// requestHandler方法内需返回修改后的参数
			pram = settings.requestHandler(Base.cloneObject(pram));

			// 将 requestHandler 内修改的分页参数合并至 settings.pageData
			if (settings.supportAjaxPage) {
				jTool.each(settings.pageData, (key, value) => {
					settings.pageData[key] = pram[key] || value;
				});
			}

			// 将 requestHandler 内修改的排序参数合并至 settings.sortData
            jTool.each(settings.sortData, (key, value) => {
                settings.sortData[key] = pram[`${settings.sortKey}${key}`] || value;
            });
			Cache.setSettings($table, settings);

			return new Promise((resolve, reject) => {
				jTool.ajax({
					url: ajaxData,
					type: settings.ajax_type,
					data: pram,
					headers: settings.ajax_headers,
					xhrFields: settings.ajax_xhrFields,
					cache: true,
					success: response => {
						resolve(response);
					},
					error: (XMLHttpRequest, textStatus, errorThrown) => {
						reject(XMLHttpRequest, textStatus, errorThrown);
					}
				});
			});
		}
	}

	/**
	 * tableWrap
	 * @param tableWrap
     */
	removeRefreshingClass($tableWrap) {
		// 刷新按纽
		const refreshAction = jTool('.page-toolbar .refresh-action', $tableWrap);
		window.setTimeout(() => {
			refreshAction.removeClass('refreshing');
		}, 2000);
	}

	/**
	 * 清空当前表格数据
	 * @param $table
	 */
	cleanData($table) {
		const settings = Cache.getSettings($table);
		this.insertEmptyTemplate($table, settings);

		// 渲染选择框
		if (settings.supportCheckbox) {
			Checkbox.resetDOM($table, []);
		}

		// 渲染分页
		if (settings.supportAjaxPage) {
			AjaxPage.resetPageData($table, settings, 0);
			Menu.updateMenuPageStatus(settings.gridManagerName, settings);
		}

		// this.driveDomForSuccessAfter($table, settings, response, callbakc);
	}

	/**
	 * 执行ajax成功后重新渲染DOM
	 * @param $table
	 * @param settings
	 * @param response
	 * @param callback
     */
	driveDomForSuccessAfter($table, settings, response, callback) {
		if (!response) {
			Base.outLog('请求数据失败！请查看配置参数[ajax_data]是否配置正确，并查看通过该地址返回的数据格式是否正确', 'error');
			return;
		}

		let parseRes = typeof (response) === 'string' ? JSON.parse(response) : response;

		// 执行请求后执行程序, 通过该程序可以修改返回值格式
		parseRes = settings.responseHandler(Base.cloneObject(parseRes));

		let _data = parseRes[settings.dataKey];

		// td模板
		let	tdTemplate = null;

		// 数据为空时
		if (!_data || _data.length === 0) {
			this.insertEmptyTemplate($table, settings);
			parseRes[settings.totalsKey] = 0;
		} else {
			// add order
			if (settings.supportAutoOrder) {
				let _pageData = settings.pageData;
				let	_orderBaseNumber = 1;

				// 验证是否存在分页数据
				if (_pageData && _pageData[settings.pageSizeKey] && _pageData[settings.currentPageKey]) {
					_orderBaseNumber = _pageData[settings.pageSizeKey] * (_pageData[settings.currentPageKey] - 1) + 1;
				}
				_data = _data.map((item, index) => {
					item[Order.key] = _orderBaseNumber + index;
					return item;
				});
			}

			// add checkbox
			if (settings.supportCheckbox) {
				_data = _data.map(rowData => {
					rowData[Checkbox.key] = false;
					return rowData;
				});
			}

			// 存储表格数据
			Cache.setTableData($table, _data);

			// tbody dom
			const _tbody = jTool('tbody', $table).get(0);

			// 清空 tbody
			_tbody.innerHTML = '';

            // 组装 tbody
			const compileList = []; // 需要通过框架解析td
			jTool.each(_data, (index, row) => {
				const trNode = document.createElement('tr');
				trNode.setAttribute('cache-key', index);

				// 与当前位置信息匹配的td列表
				const tdList = [];
				jTool.each(settings.columnMap, (key, col) => {
					tdTemplate = col.template;
					// td 模板
					tdTemplate = typeof tdTemplate === 'function' ? tdTemplate(row[col.key], row) : (typeof tdTemplate === 'string' ? tdTemplate : row[col.key]);

					// 插件自带列(序号,全选) 的 templateHTML会包含, 所以需要特殊处理一下
					let tdNode = null;
					if (col.isAutoCreate) {
						tdNode = jTool(tdTemplate).get(0);
					} else {
						tdNode = jTool('<td gm-create="false"></td>').get(0);
						jTool.type(tdTemplate) === 'element' ? tdNode.appendChild(tdTemplate) : tdNode.innerHTML = tdTemplate || '';
					}

					// td 文本对齐方向
					col.align && tdNode.setAttribute('align', col.align);

					tdList[col.index] = tdNode;

					col.useCompile && compileList.push({td: tdNode, row: row});
				});

				tdList.forEach(td => {
					trNode.appendChild(td);
				});

				_tbody.appendChild(trNode);
			});

			// 为新生成的tbody 的内容绑定 gm-事件
			this.bindEvent($table);

			this.initVisible($table);

			try {
				// 解析框架: Vue
				if (typeof settings.compileVue === 'function' && compileList.length > 0) {
					settings.compileVue(compileList);
				}

				// 解析框架: Angular
				// ....

				// 解析框架: React
				// ...
			} catch (e) {
				Base.outLog('框架模板解析异常, 请查看template配置项', 'error');
			}
		}

		// 渲染选择框
		if (settings.supportCheckbox) {
			Checkbox.resetDOM($table, _data);
		}

		// 渲染分页
		if (settings.supportAjaxPage) {
			AjaxPage.resetPageData($table, settings, parseRes[settings.totalsKey]);
			Menu.updateMenuPageStatus(settings.gridManagerName, settings);
		}

		typeof callback === 'function' ? callback(parseRes) : '';
	};

	/**
	 * 插入空数据模版
	 * @param $table
	 * @param settings
	 */
	insertEmptyTemplate($table, settings) {
		let visibleNum = jTool('th[th-visible="visible"]', $table).length;
		jTool('tbody', $table).html(Base.getEmptyHtml(visibleNum, settings.emptyTemplate));
	}

    /**
     * 为新增的单元格绑定事件
     * @param $table
     */
	bindEvent($table) {
	    jTool('[gm-click]', $table).unbind('click');
        jTool('[gm-click]', $table).bind('click', function () {
            const row = Cache.getRowData($table, this.parentNode.parentNode);
            const scope = Cache.getScope($table) || window;
            const fun = scope[this.getAttribute('gm-click')];
            typeof fun === 'function' && fun.call(scope, row);
        });
    }

	/**
	 * 渲染HTML，根据配置嵌入所需的事件源DOM
	 * @param $table
     */
	createDOM($table) {
		let settings = Cache.getSettings($table);
		let theadHtml = '<thead grid-manager-thead>';
		let	tbodyHtml = '<tbody></tbody>';

		// 文本对齐属性
		let	alignAttr = '';

		// 宽度信息
		let	widthInfo = '';

		// 提醒对应的html片段
		let	remindHtml = '';

		// 排序对应的html片段
		let	sortingHtml	= '';

		// 过滤对应的html片段
		let	filterHtml	= '';

		// th显示状态
		let thVisible = '';

		// 将 columnMap 转换为 数组
		// 转换的原因是为了处理用户记忆
		const thList = [];
		if (settings.disableCache) {
			jTool.each(settings.columnMap, (key, col) => {
				thList.push(col);
			});
		} else {
			jTool.each(settings.columnMap, (key, col) => {
				thList[col.index] = col;
			});
		}

		// 将表头提醒启用状态重置
        Remind.enable = false;

        // 将排序启用状态重置
        Sort.enable = false;

        // 将筛选条件重置
        Filter.enable = false;

		// thList 生成thead
		jTool.each(thList, (index, col) => {
			// 表头提醒
            remindHtml = '';
			if (typeof (col.remind) === 'string' && col.remind !== '') {
				remindHtml = `remind="${col.remind}"`;
                Remind.enable = true;
			}

			// 排序
			sortingHtml = '';
			if (typeof (col.sorting) === 'string') {
                Sort.enable = true;
				if (col.sorting === settings.sortDownText) {
					sortingHtml = `sorting="${settings.sortDownText}"`;
					settings.sortData[col.key] = settings.sortDownText;
				} else if (col.sorting === settings.sortUpText) {
					sortingHtml = `sorting="${settings.sortUpText}"`;
					settings.sortData[col.key] = settings.sortUpText;
				} else {
					sortingHtml = 'sorting=""';
				}
			}

			// 过滤
            filterHtml = '';
            if (jTool.type(col.filter) === 'object') {
                Filter.enable = true;
                filterHtml = `filter`;
                if (typeof (col.filter.selected) === 'undefined') {
                    col.filter.selected = settings.query[col.key];
                } else {
                    settings.query[col.key] = col.filter.selected;
                }
            }

			// 宽度文本
			widthInfo = col.width ? `width="${col.width}"` : '';

			// 文本对齐
			alignAttr = col.align ? `align="${col.align}"` : '';

			// th可视状态值
			thVisible = Base.getVisibleForColumn(col);

			// 拼接th
			switch (col.key) {
				// 插件自动生成序号列
				case Order.key:
					theadHtml += Order.getThString(settings, thVisible);
					break;
				// 插件自动生成选择列
				case Checkbox.key:
					theadHtml += Checkbox.getThString(settings, thVisible);
					break;
				// 普通列
				default:
					theadHtml += `<th gm-create="false" th-name="${col.key}" th-visible="${thVisible}" ${remindHtml} ${sortingHtml} ${filterHtml} ${widthInfo} ${alignAttr}>${col.text}</th>`;
					break;
			}
		});
		// TODO 20180711将排序及过滤的setSettings移到了这里，原因是这两项都在each内。
        Cache.setSettings($table, settings);

		theadHtml += '</thead>';
		$table.html(theadHtml + tbodyHtml);

		// 绑定选择框事件
		if (settings.supportCheckbox) {
			Checkbox.bindCheckboxEvent($table);
		}

		// 是否为插件自动生成的序号列
		let	isLmOrder = null;

		// 是否为插件自动生成的选择列
		let	isLmCheckbox = null;

		// 单个table下的thead
		const onlyThead = jTool('thead[grid-manager-thead]', $table);

		// 单个table下的TH
		const onlyThList = jTool('th', onlyThead);

		// 外围的html片段
		const wrapHtml = `<div class="table-wrap">
						<div class="table-div" style="height:calc(${settings.height} - 40px)"></div>
						<span class="text-dreamland"></span>
					</div>`;
		$table.wrap(wrapHtml);

		// 单个table所在的DIV容器
		const tableWarp = $table.closest('.table-wrap');

        // 根据参数增加禁用禁用边框线标识
        if (settings.disableBorder) {
            tableWarp.addClass('disable-border');
        }

		// 嵌入配置列表DOM
		if (settings.supportConfig) {
			tableWarp.append(Config.html);
		}

		// 嵌入Ajax分页DOM
		if (settings.supportAjaxPage) {
			tableWarp.append(AjaxPage.createHtml(settings));
			AjaxPage.initAjaxPage($table, settings);
		}

		// 嵌入导出表格数据事件源
		if (settings.supportExport) {
			tableWarp.append(Export.html);
		}
		const configList = jTool('.config-list', tableWarp);

		// 单个TH
		let onlyTH = null;

		// 单个TH所占宽度
		let onlyWidth = 0;

		// 单个TH下的上层DIV
		const onlyThWarp = jTool('<div class="th-wrap"></div>');
		jTool.each(onlyThList, (index, item) => {
			onlyTH = jTool(item);

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
					.append(`<li th-name="${onlyTH.attr('th-name')}">
								<input type="checkbox"/>
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

			// 嵌入表头提醒事件源
			// 插件自动生成的排序与选择列不做事件绑定
			if (onlyTH.attr('remind') !== undefined && !isLmOrder && !isLmCheckbox) {
				const remindDOM = jTool(Remind.html);
				remindDOM.find('.ra-title').text(onlyTH.text());
				remindDOM.find('.ra-con').text(onlyTH.attr('remind') || onlyTH.text());
				onlyThWarp.append(remindDOM);
			}

			// 嵌入排序事件源
			// 插件自动生成的序号列与选择列不做事件绑定
			// 排序类型
			const sortType = onlyTH.attr('sorting');
			if (sortType !== undefined && !isLmOrder && !isLmCheckbox) {
				const sortingDom = jTool(Sort.html);

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
				onlyThWarp.append(sortingDom);
			}

			// 嵌入表头的筛选事件源
            // 插件自动生成的序号列与选择列不做事件绑定
            const filterType = onlyTH.attr('filter');
			const column = settings.columnMap[onlyTH.attr('th-name')];
            if (filterType !== undefined && !isLmOrder && !isLmCheckbox && column && column.filter) {
                const filterDom = jTool(Filter.createHtml(column.filter));
                onlyThWarp.append(filterDom);
            }

			// 嵌入宽度调整事件源,插件自动生成的选择列不做事件绑定
			if (settings.supportAdjust && !isLmOrder && !isLmCheckbox) {
				const adjustDOM = jTool(Adjust.html);
				// 最后一列不支持调整宽度
				if (index === onlyThList.length - 1) {
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
	 * 根据配置项初始化列显示|隐藏 (th 和 td)
	 * @param $table
	 */
	initVisible($table) {
		// tbody下的tr
		const _trList = jTool('tbody tr', $table);
		let	_th = null;
		let	_td = null;
		let _visible = 'visible';
		const settings = Cache.getSettings($table);
		jTool.each(settings.columnMap, (index, col) => {
			_th = jTool(`th[th-name="${col.key}"]`, $table);
			_visible = Base.getVisibleForColumn(col);
			_th.attr('th-visible', _visible);
			jTool.each(_trList, (i2, v2) => {
				_td = jTool('td', v2).eq(_th.index());
				_td.attr('td-visible', _visible);
			});
		});
	}
}
export default new Core();
