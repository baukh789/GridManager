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
import Order from './Order';
import Remind from './Remind';
import Sort from './Sort';
import Filter from './Filter';
import Scroll from './Scroll';
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
		const refreshAction = jTool('.footer-toolbar .refresh-action', tableWrap);

		// 增加刷新中标识
		refreshAction.addClass('refreshing');
		Base.showLoading(tableWrap, settings.loadingTemplate);

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
	    const params = getParams();
        // 将 requestHandler 内修改的分页参数合并至 settings.pageData
        if (settings.supportAjaxPage) {
            jTool.each(settings.pageData, (key, value) => {
                settings.pageData[key] = params[key] || value;
            });
        }

        // 将 requestHandler 内修改的排序参数合并至 settings.sortData
        jTool.each(settings.sortData, (key, value) => {
            settings.sortData[key] = params[`${settings.sortKey}${key}`] || value;
        });
        Cache.setSettings($table, settings);

		let ajaxData = typeof settings.ajax_data === 'function' ? settings.ajax_data(settings, params) : settings.ajax_data;

		// ajaxData === string url
		if (typeof ajaxData === 'string') {
			return getPromiseByUrl(params);
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

		// 获取参数信息
		function getParams() {
            let _params = jTool.extend(true, {}, settings.query);

            // 合并分页信息至请求参
            if (settings.supportAjaxPage) {
                _params[settings.currentPageKey] = settings.pageData[settings.currentPageKey];
                _params[settings.pageSizeKey] = settings.pageData[settings.pageSizeKey];
            }

            // 合并排序信息至请求参, 排序数据为空时则忽略
            if (!jTool.isEmptyObject(settings.sortData)) {
                // settings.mergeSort: 是否合并排序字段
                // false: {sort_createDate: 'DESC', sort_title: 'ASC'}
                // true: sort: {createDate: 'DESC'}
                if (settings.mergeSort) {
                    _params[settings.sortKey] = '';
                    jTool.each(settings.sortData, (key, value) => {
                        _params[settings.sortKey] = `${_params[settings.sortKey]}${_params[settings.sortKey] ? ',' : ''}${key}:${value}`;
                    });
                } else {
                    jTool.each(settings.sortData, (key, value) => {
                        // 增加sort_前缀,防止与搜索时的条件重叠
                        _params[`${settings.sortKey}${key}`] = value;
                    });
                }
            }

            // 请求前处理程序, 可以通过该方法增加 或 修改全部的请求参数
            // requestHandler方法内需返回修改后的参数
            _params = settings.requestHandler(Base.cloneObject(_params));
            return _params;
        }

        // 获取Promise, 条件: ajax_data 为 url
		function getPromiseByUrl(Params) {
            // 当前为POST请求 且 Content-Type 未进行配置时, 默认使用 application/x-www-form-urlencoded
            // 说明|备注:
            // 1. Content-Type = application/x-www-form-urlencoded 的数据形式为 form data
            // 2. Content-Type = text/plain;charset=UTF-8 的数据形式为 request payload
            if (settings.ajax_type.toUpperCase() === 'POST' && !settings.ajax_headers['Content-Type']) {
                settings.ajax_headers['Content-Type'] = 'application/x-www-form-urlencoded';
            }

            return new Promise((resolve, reject) => {
				jTool.ajax({
					url: ajaxData,
					type: settings.ajax_type,
					data: Params,
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
	 * 移除刷新中class
	 * @param tableWrap
     */
	removeRefreshingClass($tableWrap) {
		// 刷新按纽
		const refreshAction = jTool('.footer-toolbar .refresh-action', $tableWrap);
		window.setTimeout(() => {
			refreshAction.removeClass('refreshing');
		}, 3000);
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
			Checkbox.resetDOM($table, settings, []);
		}

		// 渲染分页
		if (settings.supportAjaxPage) {
			AjaxPage.resetPageData($table, settings, 0);
			Menu.updateMenuPageStatus(settings.gridManagerName, settings);
		}
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
		let totals = parseRes[settings.totalsKey];

		// 数据校验: 数据异常
		if (!_data || !Array.isArray(_data)) {
            Base.outLog(`请求数据失败！response中的${settings.dataKey}必须为数组类型，可通过配置项[dataKey]修改字段名。`, 'error');
            return;
        }

        // 数据校验: 未使用无总条数模式 且 总条数无效时直接跳出
        if (settings.supportAjaxPage && !settings.useNoTotalsMode && isNaN(parseInt(totals, 10))) {
            Base.outLog('分页错误，请确认返回数据中是否存在totals字段(或配置项totalsKey所指定的字段)。', 'error');
            return;
        }

		// 数据为空时
		if (_data.length === 0) {
			this.insertEmptyTemplate($table, settings);
			parseRes[settings.totalsKey] = 0;
		} else {
		    this.renderTableBody($table, settings, _data);
		}

		// 渲染选择框
		if (settings.supportCheckbox) {
            Checkbox.resetDOM($table, settings, _data, settings.useRadio);
		}

		// 渲染分页
		if (settings.supportAjaxPage) {
			AjaxPage.resetPageData($table, settings, parseRes[settings.totalsKey], _data.length);
			Menu.updateMenuPageStatus(settings.gridManagerName, settings);
		}

		typeof callback === 'function' ? callback(parseRes) : '';
	};

	/**
	 * 插入空数据模板
	 * @param $table
	 * @param settings
	 * @param isInit: 是否为初始化时调用
	 */
	insertEmptyTemplate($table, settings, isInit) {
	    // 当前为第一次加载 且 已经执行过setQuery 时，不再插入空数据模板
        // 用于解决容器为不可见时，触发了setQuery的情况
	    if (isInit && Cache.getTableData($table).length !== 0) {
	        return;
        }
		let visibleNum = jTool('thead[grid-manager-thead] th[th-visible="visible"]', $table).length;
		const $tbody = jTool('tbody', $table);
		const $tableDiv = $table.closest('.table-div');
        $tbody.html(Base.getEmptyHtml(visibleNum, settings.emptyTemplate));
        const emptyDOM = $tbody.get(0).querySelector('tr[emptyTemplate]');
        emptyDOM.style.height = $tableDiv.height() + 'px';
        Base.compileFramework(settings, {el: emptyDOM});
	}

    /**
     * 重新组装table body
     * @param $table
     * @param settings
     * @param data
     */
	renderTableBody($table, settings, data) {
        // td模板
        let	tdTemplate = null;

        // add order
        if (settings.supportAutoOrder) {
            let _pageData = settings.pageData;
            let	_orderBaseNumber = 1;

            // 验证是否存在分页数据
            if (_pageData && _pageData[settings.pageSizeKey] && _pageData[settings.currentPageKey]) {
                _orderBaseNumber = _pageData[settings.pageSizeKey] * (_pageData[settings.currentPageKey] - 1) + 1;
            }
            data = data.map((item, index) => {
                item[Order.key] = _orderBaseNumber + index;
                return item;
            });
        }

        // add checkbox
        if (settings.supportCheckbox) {
            const checkedData = Cache.getCheckedData($table);
            data = data.map(rowData => {
                let checked = checkedData.some(item => {
                    let cloneRow = Base.getDataForColumnMap(settings.columnMap, item);
                    let cloneItem = Base.getDataForColumnMap(settings.columnMap, rowData);
                    return Base.equal(cloneRow, cloneItem);
                });
                rowData[Checkbox.key] = checked || Boolean(rowData[Checkbox.key]);
                return rowData;
            });
            Cache.setCheckedData($table, data);
        }

        // 存储表格数据
        Cache.setTableData($table, data);

        // tbody dom
        const _tbody = jTool('tbody', $table).get(0);

        // 清空 tbody
        _tbody.innerHTML = '';

        // 组装 tbody
        const compileList = []; // 需要通过框架解析td数据
        try {
            jTool.each(data, (index, row) => {
                const trNode = document.createElement('tr');
                trNode.setAttribute('cache-key', index);

                // 插入通栏: top-full-column
                if (typeof settings.topFullColumn.template !== 'undefined') {
                    // 通栏tr
                    const topTrNode = document.createElement('tr');
                    topTrNode.setAttribute('top-full-column', 'true');

                    // 通栏用于向上的间隔的tr
                    const intervalTrNode = document.createElement('tr');
                    intervalTrNode.setAttribute('top-full-column-interval', 'true');
                    intervalTrNode.innerHTML = `<td colspan="${settings.columnData.length}"><div></div></td>`;
                    _tbody.appendChild(intervalTrNode);

                    // 为非通栏tr的添加标识
                    trNode.setAttribute('top-full-column', 'false');

                    let _template = settings.topFullColumn.template;
                    _template = typeof _template === 'function' ? _template(row) : _template;

                    topTrNode.innerHTML = `<td colspan="${settings.columnData.length}"><div class="full-column-td">${_template}</div></td>`;
                    compileList.push({el: topTrNode, row: row, index: index});
                    _tbody.appendChild(topTrNode);
                }

                // 与当前位置信息匹配的td列表
                const tdList = [];
                jTool.each(settings.columnMap, (key, col) => {
                    tdTemplate = col.template;
                    // td 模板
                    tdTemplate = typeof tdTemplate === 'function' ? tdTemplate(row[col.key], row, index) : (typeof tdTemplate === 'string' ? tdTemplate : row[col.key]);

                    // 插件自带列(序号,全选) 的 templateHTML会包含, 所以需要特殊处理一下
                    let tdNode = null;
                    if (col.isAutoCreate) {
                        tdNode = jTool(tdTemplate).get(0);
                    } else {
                        tdNode = jTool('<td gm-create="false"></td>').get(0);
                        jTool.type(tdTemplate) === 'element' ? tdNode.appendChild(tdTemplate) : tdNode.innerHTML = (typeof tdTemplate === 'undefined' ? '' : tdTemplate);
                    }

                    // td 文本对齐方向
                    col.align && tdNode.setAttribute('align', col.align);

                    tdList[col.index] = tdNode;
                });

                tdList.forEach(td => {
                    trNode.appendChild(td);
                });

                compileList.push({el: trNode, row: row, index: index});

                _tbody.appendChild(trNode);
            });
        } catch (e) {
            Base.outLog(e, 'error');
        }
        // 为新生成的tbody 的内容绑定 gm-事件
        this.bindEvent($table);

        this.initVisible($table);

        // 解析框架
        Base.compileFramework(settings, compileList);
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
     * @param settings
     * @returns {Promise<any>}
     */
    async createDOM($table, settings) {
        // 外围的html片段
        const wrapHtml = `<div class="table-wrap">
                            <div class="table-div"></div>
                            <span class="text-dreamland"></span>
                        </div>`;
        $table.wrap(wrapHtml);

        // 计算布局
        Base.calcLayout($table, settings.width, settings.height, settings.supportAjaxPage);

        const thead = document.createElement('thead');
        thead.setAttribute('grid-manager-thead', '');
        thead.appendChild(document.createElement('tr'));
        $table.append(thead);
        const $tr = $table.find('thead[grid-manager-thead] tr');

		// th显示状态
		let thVisible = '';

		// 将 columnMap 转换为 数组
		// 转换的原因是为了处理用户记忆
		const columnList = [];
		if (settings.disableCache) {
			jTool.each(settings.columnMap, (key, col) => {
				columnList.push(col);
			});
		} else {
			jTool.each(settings.columnMap, (key, col) => {
				columnList[col.index] = col;
			});
		}

		// 将表头提醒启用状态重置
        Remind.enable = false;

        // 将排序启用状态重置
        Sort.enable = false;

        // 将筛选条件重置
        Filter.enable = false;

		// columnList 生成thead
		jTool.each(columnList, (index, col) => {
		    const th = document.createElement('th');
		    const thWrap = document.createElement('div');
            thWrap.className = 'th-wrap';
            const thText = document.createElement('span');
            thText.className = 'th-text';

			// 表头提醒
			if (typeof (col.remind) === 'string' && col.remind !== '') {
                th.setAttribute('remind', col.remind);
                Remind.enable = true;
			}

			// 排序
			if (typeof (col.sorting) === 'string') {
                Sort.enable = true;
				if (col.sorting === settings.sortDownText) {
                    th.setAttribute('sorting', settings.sortDownText);
					settings.sortData[col.key] = settings.sortDownText;
				} else if (col.sorting === settings.sortUpText) {
                    th.setAttribute('sorting', settings.sortUpText);
					settings.sortData[col.key] = settings.sortUpText;
				} else {
                    th.setAttribute('sorting', '');
				}
			}

			// 过滤
            if (jTool.type(col.filter) === 'object') {
                Filter.enable = true;
                th.setAttribute('filter', '');
                if (typeof (col.filter.selected) === 'undefined') {
                    col.filter.selected = settings.query[col.key];
                } else {
                    settings.query[col.key] = col.filter.selected;
                }
            }

			// th宽度
            // col.width && th.setAttribute('width', col.width);
            th.style.width = col.width || 'auto';

			// 文本对齐
            col.align && th.setAttribute('align', col.align);

			// th可视状态值
			thVisible = Base.getVisibleForColumn(col);

			// 拼接th
			switch (col.key) {
				// 插件自动生成序号列
				case Order.key:
                    // thWrap
                    th.setAttribute('gm-create', 'true');
                    th.setAttribute('th-name', Order.key);
                    th.setAttribute('th-visible', thVisible);
                    th.setAttribute('gm-order', 'true');
                    thText.innerHTML = Order.getThString(settings);
					break;
				// 插件自动生成选择列
				case Checkbox.key:
                    th.setAttribute('gm-create', 'true');
                    th.setAttribute('th-name', Checkbox.key);
                    th.setAttribute('th-visible', thVisible);
                    th.setAttribute('gm-checkbox', 'true');
                    thText.innerHTML = Checkbox.getThString(settings.useRadio);
					break;
				// 普通列
				default:
                    th.setAttribute('gm-create', 'false');
                    th.setAttribute('th-name', col.key);
                    th.setAttribute('th-visible', thVisible);
                    thText.innerHTML = col.text;
					break;
			}

            // 嵌入拖拽事件标识, 以下情况除外
            // 1.插件自动生成列
            // 2.禁止使用个性配置功能的列
            if (settings.supportDrag && !col.isAutoCreate && !col.disableCustomize) {
                thText.classList.add('drag-action');
            }

            thWrap.appendChild(thText);
            th.appendChild(thWrap);
            $tr.append(th);
		});

        const tbody = document.createElement('tbody');
        $table.append(tbody);

        Cache.setSettings($table, settings);

		// 绑定选择框事件
		if (settings.supportCheckbox) {
			Checkbox.bindCheckboxEvent($table, settings);
		}

		// 单个table下的thead
		const $thead = jTool('thead[grid-manager-thead]', $table);

		// 单个table下的TH
		const $thList = jTool('th', $thead);

		// 单个table所在的DIV容器
		const $tableWarp = $table.closest('.table-wrap');

        // 根据参数增加皮肤标识
        if (settings.skinClassName && typeof settings.skinClassName === 'string' && settings.skinClassName.trim()) {
            $tableWarp.addClass(settings.skinClassName);
        }

        // 根据参数，增加表头的icon图标是否跟随文本class
        if (settings.isIconFollowText) {
            $tableWarp.addClass('icon-follow-text');
        }

        // 根据参数增加禁用禁用边框线标识
        if (settings.disableBorder) {
            $tableWarp.addClass('disable-border');
        }

		// 嵌入配置列表DOM
		if (settings.supportConfig) {
			$tableWarp.append(Config.createHtml(settings));
		}

		// 嵌入Ajax分页DOM
		if (settings.supportAjaxPage) {
			$tableWarp.append(AjaxPage.createHtml(settings));
			AjaxPage.initAjaxPage($table, settings);
		}

		// 等待容器可用
        await this.waitContainerAvailable(settings.gridManagerName, $tableWarp.get(0));

        // 重绘thead
        this.redrawThead($table, $tableWarp, $thList, settings);

        // 初始化fake thead
        Scroll.init($table);

        // 解析框架: thead区域
        await Base.compileFramework(settings, [{el: $thead.get(0).querySelector('tr')}]);

        // 删除渲染中标识、增加渲染完成标识
        $table.removeClass('GridManager-loading');
        $table.addClass('GridManager-ready');
	}

    /**
     * 等待容器可用
     * @param gridManagerName
     * @param tableWarp
     */
    waitContainerAvailable(gridManagerName, tableWarp) {
        return new Promise(resolve => {
            Base.SIV_waitContainerAvailable[gridManagerName] = setInterval(() => {
                let tableWarpWidth = window.getComputedStyle(tableWarp).width;
                if (tableWarpWidth !== '100%') {
                    clearInterval(Base.SIV_waitContainerAvailable[gridManagerName]);
                    Base.SIV_waitContainerAvailable[gridManagerName] = null;
                    resolve();
                }
            }, 50);
        });
    }

    /**
     * 重绘thead
     * @param $table
     * @param $tableWarp
     * @param $thList
     * @param settings
     */
    redrawThead($table, $tableWarp, $thList, settings) {
        // const configList = jTool('.config-list', $tableWarp);

        // 由于部分操作需要在th已经存在于dom的情况下执行, 所以存在以下循环
        // 单个TH下的上层DIV
        jTool.each($thList, (index, item) => {
            let onlyTH = jTool(item);
            const onlyThWarp = jTool('.th-wrap', onlyTH);
            const thName = onlyTH.attr('th-name');
            const onlyThText = onlyTH.text();
            const column = settings.columnMap[thName];

            // 是否为GM自动添加的列
            const isAutoCol = column.isAutoCreate;

            // 嵌入配置列表项
            // if (settings.supportConfig && !column.disableCustomize) {
            //     configList.append(Config.createColumn(thName, onlyThText));
            // }

            // 嵌入表头提醒事件源
            // 插件自动生成的序号与选择列不做事件绑定
            if (!isAutoCol && jTool.type(column.remind) === 'string') {
                onlyThWarp.append(jTool(Remind.createHtml(onlyThText, column.remind)));
            }

            // 嵌入排序事件源
            // 插件自动生成的序号列与选择列不做事件绑定
            // 排序类型
            if (!isAutoCol && jTool.type(column.sorting) === 'string') {
                const sortingDom = jTool(Sort.html);

                // 依据 column.sorting 进行初始显示
                switch (column.sorting) {
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
            if (!isAutoCol && column.filter && jTool.type(column.filter) === 'object') {
                const filterDom = jTool(Filter.createHtml(settings, column.filter, $tableWarp.height()));
                onlyThWarp.append(filterDom);
            }

            // 嵌入宽度调整事件源,以下情况除外
            // 1.插件自动生成的选择列不做事件绑定
            // 2.禁止使用个性配置功能的列
            if (settings.supportAdjust && !isAutoCol && !column.disableCustomize) {
                const adjustDOM = jTool(Adjust.html);

                // 最后一列不支持调整宽度
                if (index === $thList.length - 1) {
                    adjustDOM.hide();
                }

                onlyThWarp.append(adjustDOM);
            }
        });

        // 更新列宽
        Base.updateThWidth($table, settings, true);
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
