/**
 * Created by baukh on 17/10/26.
 * 构造类
 */
import jTool from '@common/jTool';
import { TABLE_KEY, CACHE_ERROR_KEY, TABLE_PURE_LIST } from '@common/constants';
import base from '@common/base';
import cache from '@common/cache';
import adjust from './adjust';
import ajaxPage from './ajaxPage';
import order from './order';
import checkbox from './checkbox';
import tree from './tree';
import config from './config';
import core, { coreDOM } from './core';
import drag from './drag';
import exportFile from './exportFile';
import menu from './menu';
import remind from './remind';
import scroll from './scroll';
import sort from './sort';
import filter from './filter';

const isRendered = (table, fnName) => {
    const settings = cache.getSettings(base.getKey(table));
    // fnName !== 'destroy' &&
    if (!settings.rendered) {
        base.outError(`${fnName} failed，please check your table had been init`);
        return false;
    }
    return true;
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
	        base.outError('value type is not object');
	        return;
        }
        defaultOption = conf;
    }

    /**
     * 合并默认配置项，用于追加全局通用配置项
     * @param conf
     */
    static
    mergeDefaultOption(conf) {
        if (jTool.type(conf) !== 'object') {
            base.outError('value type is not object');
            return;
        }
        defaultOption = jTool.extend(defaultOption, conf);
    }

	/**
	 * @静态方法
	 * 获取Table 对应 GridManager的实例
	 * @param table
	 * @returns {*}
	 */
	static
	get(table) {
        return cache.getSettings(base.getKey(table));
	}

    /**
     * @静态方法
     * 存储表格渲染所在的域
     * @param table
     * @returns {*}
     */
    static
    setScope(table, scope) {
        return cache.setScope(base.getKey(table), scope);
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
        if (!isRendered(table, 'getLocalStorage')) {
            return;
        }
		return cache.getUserMemory(base.getKey(table));
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
        if (!isRendered(table, 'resetLayout')) {
            return;
        }
        const { gridManagerName, supportAjaxPage } = cache.getSettings(base.getKey(table));
        base.calcLayout(gridManagerName, width, height, supportAjaxPage);
        base.updateScrollStatus(gridManagerName);
        scroll.update(gridManagerName);
    }

	/**
	 * @静态方法
	 * 清除指定表的表格记忆数据, 如果未指定删除的table, 则全部清除
	 * @param table
	 * @returns {boolean}
     */
	static
	clear(table) {
        if (table && !isRendered(table, 'clear')) {
            return;
        }
		return cache.delUserMemory(base.getKey(table));
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
        if (!isRendered(table, 'getRowData')) {
            return;
        }
		return cache.getRowData(base.getKey(table), target);
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
	    if (!isRendered(table, 'setSort')) {
	        return;
        }
		sort.__setSort(base.getKey(table), sortJson, callback, refresh);
	}

    /**
     * 设置表头配置区域可视状态
     * @param table
     * @param visible
     */
    static
    setConfigVisible(table, visible) {
        if (!isRendered(table, 'setConfigVisible')) {
            return;
        }
        const gridManagerName = base.getKey(table);

        if (!cache.getSettings(gridManagerName).supportConfig) {
            base.outError('supportConfig not open, please set supportConfig into true');
            return;
        }

        switch (visible) {
            case true: {
                config.show(gridManagerName);
                break;
            }
            case false: {
                config.hide(gridManagerName);
                break;
            }
            case undefined: {
                config.toggle(gridManagerName);
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
	 * @param thName or thNameList
     */
	static
	showTh(table, thName) {
        if (!isRendered(table, 'showTh')) {
            return;
        }
        const gridManagerName = base.getKey(table);
		base.setAreVisible(gridManagerName, Array.isArray(thName) ? thName : [thName], true);
        config.noticeUpdate(gridManagerName);
	}

	/**
	 * @静态方法
	 * 隐藏Th及对应的TD项
	 * @param table
     * @param thName or thNameList
     */
	static
	hideTh(table, thName) {
        if (!isRendered(table, 'hideTh')) {
            return;
        }
        const gridManagerName = base.getKey(table);
        base.setAreVisible(gridManagerName, Array.isArray(thName) ? thName : [thName], false);
        config.noticeUpdate(gridManagerName);
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
        if (!isRendered(table, 'exportGridToXls')) {
            return;
        }
		return exportFile.__exportGridToXls(base.getKey(table), fileName, onlyChecked);
	}

	/**
	 * @静态方法
	 * 设置查询条件
	 * @param table
	 * @param query: 配置的数据 [Object]
	 * @param callback: 回调函数
	 * @param gotoPage: [Boolean 是否跳转到第一页] or [Number 跳转的页码]，默认值=true
	 * 注意事项:
	 * - 当query的key与分页及排序等字段冲突时将会被忽略.
	 * - setQuery() 执行后会立即触发刷新操作
	 * - 在此配置的query在分页事件触发时, 会以参数形式传递至pagingAfter(query)事件内
	 * - setQuery方法中对query字段执行的操作是覆盖而不是合并, query参数位传递的任意值都会将原来的值覆盖.
	 */
	static
	setQuery(table, query, gotoPage, callback) {
        if (!isRendered(table, 'setQuery')) {
            return;
        }

        const gridManagerName = base.getKey(table);
		const settings = cache.getSettings(gridManagerName);

		if (jTool.type(query) !== 'object') {
            query = {};
        }

        // 无第三个参数时，将callback前移
        if (typeof (gotoPage) !== 'boolean' && typeof (gotoPage) !== 'number') {
			callback = gotoPage;
			gotoPage = true;
		}

		// 更新过滤相关字段
        filter.enable[gridManagerName] && jTool.each(settings.columnMap, (index, column) => {
            if (column.filter) {
                column.filter.selected = typeof query[column.key] === 'string' ? query[column.key] : '';
                filter.update(jTool(`${base.getQuerySelector(gridManagerName)} th[th-name=${column.key}]`), column.filter);
            }
        });

		// 更新settings.query
		jTool.extend(settings, {query: query});

		// 返回第一页
		if (gotoPage === true) {
			settings.pageData[settings.currentPageKey] = 1;
		}

		// 返回指定页
		if (typeof (gotoPage) === 'number') {
            settings.pageData[settings.currentPageKey] = gotoPage;
        }
		cache.setSettings(settings);
		core.refresh(gridManagerName, callback);
	}

	/**
	 * @静态方法
	 * 配置静态数ajaxData; 用于再次配置ajaxData数据, 配置后会根据参数ajaxData即时刷新表格
	 * @param table
	 * @param ajaxData: 配置的数据
	 */
	static
	setAjaxData(table, ajaxData, callback) {
        if (!isRendered(table, 'setAjaxData')) {
            return;
        }
		const settings = cache.getSettings(base.getKey(table));
		jTool.extend(settings, { ajaxData });
		cache.setSettings(settings);
		core.refresh(settings.gridManagerName, callback);
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
	    if (!isRendered(table, 'refreshGrid')) {
	        return;
        }
		const settings = cache.getSettings(base.getKey(table));
		if (typeof (isGotoFirstPage) !== 'boolean') {
			callback = isGotoFirstPage;
			isGotoFirstPage = false;
		}
		if (isGotoFirstPage) {
			settings.pageData['cPage'] = 1;
			cache.setSettings(settings);
		}
		core.refresh(settings.gridManagerName, callback);
	};

	/**
	 * @静态方法
	 * 获取当前选中的行
	 * @param table
	 * @returns {NodeList} 当前选中的行
     */
	static
	getCheckedTr(table) {
        if (!isRendered(table, 'getCheckedTr')) {
            return;
        }
		return checkbox.getCheckedTr(base.getKey(table));
	};

	/**
	 * @静态方法
	 * 获取当前选中行渲染时使用的数据
	 * @param table
	 * @returns {{}}
     */
	static
	getCheckedData(table) {
        if (!isRendered(table, 'getCheckedData')) {
            return;
        }
		return cache.getCheckedData(base.getKey(table));
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
        if (!isRendered(table, 'setCheckedData')) {
            return;
        }
        const checkedList = Array.isArray(checkedData) ? checkedData : [checkedData];
        const settings = cache.getSettings(base.getKey(table));
        const { columnMap, useRadio, gridManagerName, treeConfig } = settings;
        const treeKey = treeConfig.treeKey;
        const tableData = cache.getTableData(gridManagerName);
        tableData.forEach(rowData => {
            let cloneRow = base.getCloneRowData(columnMap, rowData, [treeKey]);
            rowData[checkbox.key] = checkedList.some(item => base.equal(cloneRow, base.getCloneRowData(columnMap, item, [treeKey])));
        });

        cache.setCheckedData(gridManagerName, checkedList, true);
        return checkbox.resetDOM(settings, tableData, useRadio);
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
        if (!isRendered(table, 'updateRowData')) {
            return;
        }
        const settings = cache.getSettings(base.getKey(table));
        const { gridManagerName, columnMap, supportCheckbox } = settings;
        const rowDataList = Array.isArray(rowData) ? rowData : [rowData];
        const tableData = cache.updateRowData(gridManagerName, key, rowDataList);

        // 更新选中数据
        if (supportCheckbox) {
            cache.updateCheckedData(gridManagerName, columnMap, key, rowDataList);
        }

        // 更新DOM
        coreDOM.renderTableBody(settings, tableData);
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
        if (!isRendered(table, 'cleanData')) {
            return;
        }
		return core.cleanData(base.getKey(table));
	}

	/**
	 * [对外公开方法]
	 * @param table
	 * @param arg: 参数
	 * @param callback: 回调
	 * @returns {*}
	 */
    async init(table, arg, callback) {
        // 存储class style， 在消毁实例时使用
        TABLE_PURE_LIST.forEach(item => {
            table['__' + item] = table.getAttribute(item);
        });

        const $table = jTool(table);
		arg = jTool.extend({}, GridManager.defaultOption, arg);

		// 校验: 初始参
		if (!arg || jTool.isEmptyObject(arg)) {
			base.outError('init method params error');
			return;
		}

		// 校验: columnData
		if (!arg.columnData || arg.columnData.length === 0) {
			base.outError('columnData invalid');
			return;
		}

		// ajax类的参数向下兼容下划线形式
        Object.keys(arg).forEach(key => {
            if (/ajax_/g.test(key)) {
                arg[key.replace(/_\w/g, str => str.split('_')[1].toUpperCase())] = arg[key];
                delete arg[key];
            }
        });

		// 参数变更提醒
		if (arg.ajaxUrl) {
			base.outWarn('ajax_url will be deprecated later, please use ajaxData instead');
			arg.ajaxData = arg.ajaxUrl;
		}

		// 相互冲突的参数项处理
        if (arg.topFullColumn && arg.topFullColumn.template) {
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
		cache.verifyVersion();

		// 初始化设置相关: 合并, 存储
		let settings = cache.initSettings(arg, checkbox.getColumn.bind(checkbox), order.getColumn.bind(order));
		const gridManagerName = settings.gridManagerName;

		// 校验: gridManagerName
		if (gridManagerName.trim() === '') {
			base.outError('gridManagerName undefined');
			return;
		}

		// 根据参数增加禁用单元格分割线标识
        if (settings.disableLine) {
            $table.addClass('disable-line');
        }

        // 初始化表格
        await this.initTable($table, settings);

        // 如果初始获取缓存失败，在渲染完成后首先存储一次数据
        if (typeof $table.attr(CACHE_ERROR_KEY) !== 'undefined') {
            window.setTimeout(() => {
                cache.saveUserMemory(settings);
                $table.removeAttr(CACHE_ERROR_KEY);
            }, 1000);
        }

        settings = cache.getSettings(gridManagerName);

        // 设置渲染完成标识
        settings.rendered = true;
        cache.setSettings(settings);

        const runCallback = () => {
            typeof (callback) === 'function' ? callback(settings.query) : '';
        };

        // 渲染tbodyDOM
        settings.firstLoading ? core.refresh(gridManagerName, () => {
            // 启用回调
            runCallback();
        }) : (() => {
            core.insertEmptyTemplate(settings, true);
            runCallback();
        })();
	}

	/**
	 * 初始化表格
	 * @param $table
	 * @param settings
     */
	async initTable($table, settings) {
		// 渲染HTML，嵌入所需的事件源DOM
        await core.createDOM($table, settings);

        const gridManagerName = settings.gridManagerName;

        // init adjust
        if (settings.supportAdjust) {
            adjust.init(gridManagerName);
        }

        // init drag
        if (settings.supportDrag) {
            drag.init(gridManagerName);
        }

        // init checkbox
        if (settings.supportCheckbox) {
            checkbox.init(gridManagerName, settings.useRowCheck);
        }

        // init sort
        sort.init(gridManagerName);

        // init remind
        remind.init(gridManagerName);

        // init filter
        filter.init(gridManagerName);

        // init config
        if (settings.supportConfig) {
            config.init(gridManagerName);
        }

        // 初始化右键菜单事件
        if (settings.supportMenu) {
            menu.init(gridManagerName);
        }

        // 初始化Ajax分页
        if (settings.supportAjaxPage) {
            ajaxPage.init(gridManagerName);
        }

        // 初始化树形结构
        if (settings.supportTreeData) {
            tree.init(gridManagerName);
        }

        // 更新fake header
        scroll.update(gridManagerName);

        // 更新最后一项可视列的标识
        base.updateVisibleLast(gridManagerName);

        // 更新滚动轴显示状态
        base.updateScrollStatus(gridManagerName);
	}

    /**
     * @静态方法
     * 消毁当前实例
     * @param table
     */
    static
    destroy(table) {
        // if (!isRendered(table, 'destroy')) {
        //     return;
        // }
        let gridManagerName = '';

        // gridManagerName
        if (jTool.type(table) === 'string') {
            gridManagerName = table;
        }

        // table dom
        if(table.nodeName === 'TABLE') {
            gridManagerName = table.getAttribute(TABLE_KEY);
        }

        // 清除setInterval
        base.SIV_waitTableAvailable[gridManagerName] && clearInterval(base.SIV_waitTableAvailable[gridManagerName]);
        base.SIV_waitContainerAvailable[gridManagerName] && clearInterval(base.SIV_waitContainerAvailable[gridManagerName]);
        base.SIV_waitTableAvailable[gridManagerName] = null;
        base.SIV_waitContainerAvailable[gridManagerName] = null;

        try {
            // 清除各模块中的事件及部分DOM
            adjust.destroy(gridManagerName);
            ajaxPage.destroy(gridManagerName);
            checkbox.destroy(gridManagerName);
            config.destroy(gridManagerName);
            drag.destroy(gridManagerName);
            menu.destroy(gridManagerName);
            remind.destroy(gridManagerName);
            scroll.destroy(gridManagerName);
            sort.destroy(gridManagerName);
            filter.destroy(gridManagerName);
            coreDOM.destroy(gridManagerName);
            tree.destroy(gridManagerName);
        } catch (e) {
            console.error(e);
        }

        // 清除实例及数据
        cache.clear(gridManagerName);

        console.log('destroy:' + gridManagerName);
    }
}
