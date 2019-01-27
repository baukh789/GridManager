/**
 * Created by baukh on 17/10/26.
 * 构造类
 */
import '../css/index.less';
import { jTool, base, cache } from '../common';
import adjust from './adjust';
import ajaxPage from './ajaxPage';
import order from './order';
import checkbox from './checkbox';
import config from './config';
import core from './core';
import drag from './drag';
import exportFile from './exportFile';
import menu from './menu';
import remind from './remind';
import scroll from './scroll';
import sort from './sort';
import hover from './hover';
import filter from './filter';

/**
 * 通过不同的形式获取 jTool table
 * @param table
 * @returns {*}
 */
const __jTable = table => {
    let $table = null;
    // undefined
    if (!table) {
        return undefined;
    }

    // dom
    if (table.nodeType) {
        return jTool(table);
    }

    // talbe[grid-manager="gridManagerName"]
    if (jTool.type(table) === 'string') {
        $table = jTool(table);
    }

    // gridManagerName
    if ($table.length === 0) {
        $table = jTool(`table[${base.key}="${table}"]`);
    }

    // undefined
    if ($table.length === 0) {
        base.outLog(`未能找到对应的DOM节点，${table}`, 'error');
    }
    return $table;
};

// 存储默认配置
let defaultOption = {};
export default class GridManager {
	/**
	 * @静态方法
	 * 版本号
	 * GridManager.version || GM.version
	 * @returns {string}
	 */
	static
	get version() {
		return cache.getVersion();
	}

    /**
     * 获取默认配置项
     */
    static
    get defaultOption() {
	    return defaultOption;
    }

    /**
     * 配置默认配置项
     */
	static
    set defaultOption(conf) {
	    if (jTool.type(conf) !== 'object') {
	        base.outLog('defaultOption配置失败，配置的值只允许为object', 'error');
	        return;
        }
        defaultOption = conf;
    }

	/**
	 * @静态方法
	 * 获取Table 对应 GridManager的实例
	 * @param table
	 * @returns {*}
	 */
	static
	get(table) {
		return cache.getSettings(__jTable(table));
	}

    /**
     * 合并默认配置项，用于追加全局通用配置项
     * @param conf
     */
    static
    mergeDefaultOption(conf) {
        if (jTool.type(conf) !== 'object') {
            base.outLog('mergeDefaultOption配置失败，配置的值只允许为object', 'error');
            return;
        }
        defaultOption = Object.assign(defaultOption, conf);
    }

    /**
     * @静态方法
     * 存储表格渲染所在的域
     * @param table
     * @returns {*}
     */
    static
    setScope(table, scope) {
        return cache.setScope(__jTable(table), scope);
    }

	/**
	 * @静态方法
	 * 获取指定表格的本地存储数据
	 * 成功后返回本地存储数据,失败则返回空对象
	 * @param table
	 * @returns {{}}
     */
	static
	getLocalStorage(table) {
		return cache.getUserMemory(__jTable(table));
	}

    /**
     * @静态方法
     * 重置表格布局
     * @param table
     * @param width
     * @param height
     * @returns {string}
     */
	static
    resetLayout(table, width, height) {
	    const $table = __jTable(table);
        const settings = cache.getSettings($table);
        base.calcLayout($table, width, height, settings.supportAjaxPage);
        return base.updateScrollStatus($table);
    }

	/**
	 * @静态方法
	 * 清除指定表的表格记忆数据, 如果未指定删除的table, 则全部清除
	 * @param table
	 * @returns {boolean}
     */
	static
	clear(table) {
		return cache.delUserMemory(__jTable(table), '通过clear()方法清除');
	}

	/**
	 * @静态方法
	 * 获取当前行渲染时使用的数据
	 * @param table
	 * @param target 将要获取数据所对应的tr[Element or NodeList]
	 * @returns {{}}
     */
	static
	getRowData(table, target) {
		return cache.getRowData(__jTable(table), target);
	}

	/**
	 * @静态方法
	 * 手动设置排序
	 * @param table
	 * @param sortJson 需要排序的json串 如:{th-name:'down'} value需要与参数sortUpText 或 sortDownText值相同
	 * @param callback 回调函数[function]
     * @param refresh 是否执行完成后对表格进行自动刷新[boolean, 默认为true]
     */
	static
	setSort(table, sortJson, callback, refresh) {
		sort.__setSort(__jTable(table), sortJson, callback, refresh);
	}

    /**
     * 设置表头配置区域可视状态
     * @param table
     * @param visible
     */
    static
    setConfigVisible(table, visible) {
        const $table = __jTable(table);
        const settings = cache.getSettings($table);
        if (!settings.supportConfig) {
            base.outLog('supportConfig未配置，setConfigVisible不可用', 'error');
            return;
        }

        switch (visible) {
            case true: {
                config.show($table, settings);
                break;
            }
            case false: {
                config.hide($table, settings);
                break;
            }
            case undefined: {
                config.toggle($table);
                break;
            }
            default: {
                break;
            }
        }

    }

    /**
	 * @静态方法
	 * 显示Th及对应的TD项
	 * @param table
	 * @param target
     */
	static
	showTh(table, target) {
		base.setAreVisible(jTool(target), true);
        // 更新存储信息
        cache.update(__jTable(table));
	}

	/**
	 * @静态方法
	 * 隐藏Th及对应的TD项
	 * @param table
	 * @param target
     */
	static
	hideTh(table, target) {
		base.setAreVisible(jTool(target), false);
        // 更新存储信息
        cache.update(__jTable(table));
	}

	/**
	 * @静态方法
	 * 导出.xls格式文件
	 * @param table
	 * @param fileName 导出后的文件名
	 * @param onlyChecked 是否只导出已选中的表格
	 * @returns {boolean}
     */
	static
	exportGridToXls(table, fileName, onlyChecked) {
		return exportFile.__exportGridToXls(__jTable(table), fileName, onlyChecked);
	}

	/**
	 * @静态方法
	 * 设置查询条件
	 * @param table
	 * @param query: 配置的数据 [Object]
	 * @param callback: 回调函数
	 * @param isGotoFirstPage: 是否返回第一页[Boolean default=true]
	 * 注意事项:
	 * - 当query的key与分页及排序等字段冲突时将会被忽略.
	 * - setQuery() 执行后会立即触发刷新操作
	 * - 在此配置的query在分页事件触发时, 会以参数形式传递至pagingAfter(query)事件内
	 * - setQuery方法中对query字段执行的操作是覆盖而不是合并, query参数位传递的任意值都会将原来的值覆盖.
	 */
	static
	setQuery(table, query, isGotoFirstPage, callback) {
		const $table = __jTable(table);
		const settings = cache.getSettings($table);

		if (!settings.pageData) {
		    base.outLog('setQuery失败，当前实例可能已被消毁', 'warn');
		    return;
        }

		if (jTool.type(query) !== 'object') {
            query = {};
        }

        if (typeof (isGotoFirstPage) !== 'boolean') {
			callback = isGotoFirstPage;
			isGotoFirstPage = true;
		}

		// 更新过滤相关字段
        filter.enable && jTool.each(settings.columnMap, (index, column) => {
            if (typeof query[column.key] === 'string' && column.filter) {
                column.filter.selected = query[column.key];
                filter.update(jTool(`th[th-name=${column.key}]`, $table), column.filter);
            }
        });

		// 更新settings.query
		jTool.extend(settings, {query: query});
		if (isGotoFirstPage) {
			settings.pageData[settings.currentPageKey] = 1;
		}
		cache.setSettings(settings);
		core.refresh($table, callback);
	}

	/**
	 * @静态方法
	 * 配置静态数ajaxData; 用于再次配置ajax_data数据, 配置后会根据参数ajaxData即时刷新表格
	 * @param table
	 * @param ajaxData: 配置的数据
	 */
	static
	setAjaxData(table, ajaxData, callback) {
		const $table = __jTable(table);
		const settings = cache.getSettings($table);
		jTool.extend(settings, {ajax_data: ajaxData});
		cache.setSettings(settings);
		core.refresh($table, callback);
	}

	/**
	 * @静态方法
	 * 刷新表格 使用现有参数重新获取数据，对表格数据区域进行渲染
	 * @param table
	 * @param isGotoFirstPage:  是否刷新时跳转至第一页[boolean类型, 默认false]
	 * @param callback: 回调函数
	 */
	static
	refreshGrid(table, isGotoFirstPage, callback) {
		const $table = __jTable(table);
		const settings = cache.getSettings($table);
		if (typeof (isGotoFirstPage) !== 'boolean') {
			callback = isGotoFirstPage;
			isGotoFirstPage = false;
		}
		if (isGotoFirstPage) {
			settings.pageData['cPage'] = 1;
			cache.setSettings(settings);
		}
		core.refresh($table, callback);
	};

	/**
	 * @静态方法
	 * 获取当前选中的行
	 * @param table
	 * @returns {NodeList} 当前选中的行
     */
	static
	getCheckedTr(table) {
		return checkbox.getCheckedTr(__jTable(table));
	};

	/**
	 * @静态方法
	 * 获取当前选中行渲染时使用的数据
	 * @param table
	 * @returns {{}}
     */
	static
	getCheckedData(table) {
		return cache.getCheckedData(__jTable(table));
	};

    /**
     * @静态方法
     * 设置选中的数据
     * @param table
     * @param checkedData: 选中的数据列表
     * @returns {{}}
     */
    static
    setCheckedData(table, checkedData) {
        const $table = __jTable(table);
        const checkedList = Array.isArray(checkedData) ? checkedData : [checkedData];
        let tableData = cache.getTableData($table);
        const settings = cache.getSettings($table);
        const { columnMap, isRadio } = settings;

        tableData = tableData.map(rowData => {
            let checked = checkedList.some(item => {
                let cloneRow = base.getDataForColumnMap(columnMap, item);
                let cloneItem = base.getDataForColumnMap(columnMap, rowData);
                return base.equal(cloneRow, cloneItem);
            });
            rowData[checkbox.key] = checked;
            return rowData;
        });
        cache.setTableData($table, tableData);
        cache.setCheckedData($table, checkedList, true);
        return checkbox.resetDOM($table, settings, tableData, isRadio);
    };

    /**
     * @静态方法
     * 更新列数据
     * @param table
     * @param key: 列数据的主键
     * @param rowData: 需要更新的数据列表
     * @returns tableData: 更新后的表格数据
     */
    static
    updateRowData(table, key, rowData) {
        const $table = __jTable(table);
        const settings = cache.getSettings($table);
        const rowDataList = Array.isArray(rowData) ? rowData : [rowData];
        const tableData = cache.updateRowData($table, key, rowDataList);

        // 更新DOM
        core.renderTableBody($table, settings, tableData);
        return tableData;
    }

    /**
     * @静态方法
     * 清空表格数据
     * @param table
     * @returns {*|void}
     */
	static
	cleanData(table) {
		return core.cleanData(__jTable(table));
	}

	/**
	 * @静态方法
	 * 消毁当前实例
	 * @param $table
	 */
	static
	destroy(table) {
        if (!table) {
            return;
        }

        const gridManagerName = table.getAttribute(base.key);

        // 清除实例及数据
        cache.cleanTable(gridManagerName);

        // 清除setInterval
        base.SIV_waitTableAvailable[gridManagerName] && clearInterval(base.SIV_waitTableAvailable[gridManagerName]);
        base.SIV_waitContainerAvailable[gridManagerName] && clearInterval(base.SIV_waitContainerAvailable[gridManagerName]);
        base.SIV_waitTableAvailable[gridManagerName] = null;
        base.SIV_waitContainerAvailable[gridManagerName] = null;

        // TODO 这里所有的消毁方法都应该使用gridManagerName，以防止$table在这里已经被消毁的问题
        try {
            const $table = __jTable(table);
            // 清除各模块中的事件及部分DOM
            adjust.destroy($table);
            ajaxPage.destroy($table);
            checkbox.destroy($table);
            config.destroy($table);
            drag.destroy($table);
            hover.destroy($table);
            menu.destroy($table);
            remind.destroy($table);
            scroll.destroy($table);
            sort.destroy($table);

            // 清除DOM属性及节点
            const $tableWrap = $table.closest('.table-wrap');
            $table.removeClass('GridManager-ready');
            $table.html('');
            $tableWrap.after($table);
            $tableWrap.remove();
        } catch (e) {
            // '在清除GridManager实例的过程时, table被移除'
        }
	}

	/**
	 * [对外公开方法]
	 * @param table
	 * @param arg: 参数
	 * @param callback: 回调
	 * @returns {*}
	 */
    async init(table, arg, callback) {
		const $table = __jTable(table);
		arg = jTool.extend({}, GridManager.defaultOption, arg);

		// 校验: 初始参
		if (!arg || jTool.isEmptyObject(arg)) {
			base.outLog('init()方法中未发现有效的参数', 'error');
			return;
		}

		// 校验: columnData
		if (!arg.columnData || arg.columnData.length === 0) {
			base.outLog('请对参数columnData进行有效的配置', 'error');
			return;
		}

		// 参数变更提醒
		if (arg.ajax_url) {
			base.outLog('ajax_url在之后将被废弃, 请使用ajax_data替代', 'warn');
			arg.ajax_data = arg.ajax_url;
		}

		// 相互冲突的参数项处理 TODO 这个功能为试点功能，现在与被禁用项冲突，后期还是想把这些冲突点解决掉
        if (arg.topFullColumn && arg.topFullColumn.template) {
		    // 是否禁用hover选中样式
            arg.disableHover = true;

            // 不使用配置功能
            arg.supportConfig = false;

            // 不使用自动序号
            arg.supportAutoOrder = false;

            // 不使用全选功能
            arg.supportCheckbox = false;

            // 不使用拖拽功能
            arg.supportDrag = false;

            // 不使用宽度调整功能
            arg.supportAdjust = false;
        }

		// 通过版本较验 清理缓存
		cache.cleanTableCacheForVersion();

		// 初始化设置相关: 合并, 存储
		const settings = cache.initSettings($table, arg, checkbox, order);

		// 校验: gridManagerName
		if (settings.gridManagerName.trim() === '') {
			base.outLog(`请在html标签中为属性[${base.key}]赋值或在配置项中配置gridManagerName`, 'error');
			return;
		}

		// 校验: 当前表格是否已经渲染
		if ($table.hasClass('GridManager-ready') || $table.hasClass('GridManager-loading')) {
			base.outLog('渲染失败,可能该表格已经渲染或正在渲染', 'error');
			return;
		}

		// 增加渲染中标注
		$table.addClass('GridManager-loading');

		// 根据参数增加禁用单元格分割线标识
        if (settings.disableLine) {
            $table.addClass('disable-line');
        }

        // 初始化表格
        await this.initTable($table, settings);

        // 如果初始获取缓存失败，在渲染完成后首先存储一次数据
        if (typeof $table.attr('grid-manager-cache-error') !== 'undefined') {
            window.setTimeout(() => {
                cache.saveUserMemory($table, settings);
                $table.removeAttr('grid-manager-cache-error');
            }, 1000);
        }
        // 启用回调
        typeof (callback) === 'function' ? callback(settings.query) : '';
	}

	/**
	 * 初始化表格
	 * @param $table
	 * @param settings
     */
	async initTable($table, settings) {
		// 渲染HTML，嵌入所需的事件源DOM
        await core.createDOM($table, settings);

        // 更新滚动轴显示状态
        base.updateScrollStatus($table);

        // 通过缓存配置成功后, 重置宽度调整事件源dom
        settings.supportAdjust ? adjust.resetAdjust($table) : '';

        // init adjust
        if (settings.supportAdjust) {
            adjust.init($table);
        }

        // init drag
        if (settings.supportDrag) {
            drag.init($table);
        }

        // init checkbox
        if (settings.supportCheckbox) {
            checkbox.init($table, settings.useRowCheck);
        }

        // init sort
        if (sort.enable) {
            sort.init($table);
        }

        // init remind
        if (remind.enable) {
            remind.init($table);
        }

        // init filter
        if (filter.enable) {
            filter.init($table);
        }

        // init config
        if (settings.supportConfig) {
            config.init($table);
        }

        // 绑定$table区域hover事件
        if (!settings.disableHover) {
            hover.onTbodyHover($table);
        }

        // 初始化右键菜单事件
        if (settings.supportMenu) {
            menu.init($table);
        }

        // 更新fake header
        scroll.update($table);

        // 更新最后一项可视列的标识
        base.updateVisibleLast($table);

        // 渲染tbodyDOM
        settings.firstLoading ? core.refresh($table) : core.insertEmptyTemplate($table, settings, true);
	}
}
