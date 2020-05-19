/**
 * Created by baukh on 17/10/26.
 * 构造类
 */
import jTool from '@jTool';
import { extend, isUndefined, isString, isFunction, isNumber, isBoolean, isObject, isArray, each, isEmptyObject, getStyle } from '@jTool/utils';
import { TABLE_KEY, CACHE_ERROR_KEY, TABLE_PURE_LIST, CHECKBOX_KEY, RENDERING_KEY, READY_CLASS_NAME, PX } from '@common/constants';
import { getCloneRowData, getKey, calcLayout, updateThWidth, setAreVisible, getFakeTh, updateVisibleLast, updateScrollStatus } from '@common/base';
import { outWarn, outError, equal } from '@common/utils';
import { getVersion, verifyVersion, initSettings, getSettings, setSettings, getUserMemory, saveUserMemory, delUserMemory, getRowData, getTableData, setTableData, updateTemplate, getCheckedData, setCheckedData, updateCheckedData, updateRowData, clearCache, SIV_waitTableAvailable } from '@common/cache';
import adjust from './adjust';
import ajaxPage from './ajaxPage';
import dropdown from './dropdown';
import order from './order';
import checkbox, { resetCheckboxDOM } from './checkbox';
import tree from './tree';
import config from './config';
import core, { coreDOM } from './core';
import drag from './drag';
import moveRow from './moveRow';
import exportFile from './exportFile';
import menu from './menu';
import remind from './remind';
import scroll from './scroll';
import sort, { updateSort } from './sort';
import filter from './filter';
import print from './print';

const isRendered = (_, settings) => {
    // 部分静态方法自身不使用settings， 所以这个参数可能为空
    if (!settings) {
        settings = getSettings(_);
    }

    if (settings.rendered) {
        return true;
    }
    outError(`run failed，please check ${_} had been init`);
};

// 存储默认配置
let defaultOption = {};
export default class GridManager {
    /**
     * [对外公开方法]
     * @param table
     * @param arg: 参数
     * @param callback: 回调
     * @returns {*}
     */
    constructor(table, arg, callback) {
        // 验证并设置正在渲染中标识，防止同时触发多次。渲染完成后将移除该标识
        if (table[RENDERING_KEY]) {
            return;
        }
        table[RENDERING_KEY] = true;

        // 存储class style， 在消毁实例时使用
        TABLE_PURE_LIST.forEach(item => {
            table['__' + item] = table.getAttribute(item);
        });

        const $table = jTool(table);
        arg = extend({}, GridManager.defaultOption, arg);

        let gridManagerName = arg.gridManagerName;
        // 参数中未存在配置项 gridManagerName: 使用table DOM 上的 grid-manager属性
        if (!isString(gridManagerName)) {
            // 存储gridManagerName值
            gridManagerName = arg.gridManagerName = getKey(table);
            // 参数中存在配置项 gridManagerName: 更新table DOM 的 grid-manager属性
        } else {
            $table.attr(TABLE_KEY, gridManagerName);
        }

        // 校验: gridManagerName
        if (!isString(gridManagerName)) {
            outError('gridManagerName undefined');
            return;
        }

        let settings = GridManager.get(gridManagerName);

        // init: 当前已经实例化
        if (settings && settings.rendered) {
            outWarn(`${gridManagerName} had been used`);

            // 如果已经存在，则清除之前的数据。#001
            GridManager.destroy(gridManagerName);
        }

        // 校验: 初始参
        if (!arg || isEmptyObject(arg)) {
            outError('init method params error');
            return;
        }

        // 校验: columnData
        if (!isArray(arg.columnData) || !arg.columnData.length) {
            outError('columnData invalid');
            return;
        }

        // 向下兼容: ajax类的参数向下兼容下划线形式
        Object.keys(arg).forEach(key => {
            if (/ajax_/g.test(key)) {
                arg[key.replace(/_\w/g, str => str.split('_')[1].toUpperCase())] = arg[key];
                delete arg[key];
            }
        });

        // 向下兼容: useRowCheck, useRadio
        if (!arg.checkboxConfig && (arg.useRowCheck || arg.useRadio)) {
            outWarn('useRowCheck and useRadio will be deprecated later, please use checkboxConfig instead');
            arg.checkboxConfig = {
                useRowCheck: arg.useRowCheck || false,
                useRadio: arg.useRadio || false
            };
        }

        // 参数变更提醒
        if (arg.ajaxUrl) {
            outWarn('ajax_url will be deprecated later, please use ajaxData instead');
            arg.ajaxData = arg.ajaxUrl;
        }

        // 校验: ajaxData
        if (!arg.ajaxData) {
            outError('ajaxData undefined');
            return;
        }

        // 相互冲突的参数项处理: 通栏
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

            // 不使用行移动功能
            arg.supportMoveRow = false;

            // 不使用树型数据
            arg.supportTreeData = false;
        }

        // 相互冲突的参数项处理: 树型
        if (arg.supportTreeData) {

            // 不使用行移动功能
            arg.supportMoveRow = false;
        }

        // 通过版本较验 清理缓存
        verifyVersion();

        // 初始化设置相关: 合并, 存储
        settings = initSettings(arg, checkbox.getColumn.bind(checkbox), order.getColumn.bind(order));

        const initTableAfter = () => {
            // 如果初始获取缓存失败，在渲染完成后首先存储一次数据
            if (!isUndefined($table.attr(CACHE_ERROR_KEY))) {
                setTimeout(() => {
                    saveUserMemory(settings);
                    $table.removeAttr(CACHE_ERROR_KEY);
                }, 1000);
            }

            settings = getSettings(gridManagerName);

            // 删除dom渲染中标识
            delete table[RENDERING_KEY];

            // 增加渲染完成 class name
            $table.addClass(READY_CLASS_NAME);

            // 设置渲染完成标识
            settings.rendered = true;
            setSettings(settings);

            const runCallback = () => {
                isFunction(callback) ? callback(settings.query) : '';
            };

            // 渲染tbodyDOM
            settings.firstLoading ? core.refresh(gridManagerName, () => {
                // 启用回调
                runCallback();
            }) : (() => {
                core.insertEmptyTemplate(settings, true);
                runCallback();
            })();
        };

        // todo 应该在渲染前检查下是否存在渲染中的表格，如果存在应该停止
        // 初始化表格
        // 表格不可用时进行等待, 并且对相同gridManagerName的表格进行覆盖以保证只渲染一次
        SIV_waitTableAvailable[gridManagerName] = setInterval(() => {
            if (getStyle(table, 'width').indexOf(PX) === -1) {
                return;
            }

            clearInterval(SIV_waitTableAvailable[gridManagerName]);
            SIV_waitTableAvailable[gridManagerName] = null;

            // 初始化表格, setInterval未停止前 initTable并不会执行
            this.initTable($table, settings).then(initTableAfter);
        }, 50);
    }

    /**
	 * @静态方法
	 * 版本号
	 * GridManager.version || GM.version
	 * @returns {string}
	 */
	static
	get version() {
		return getVersion();
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
        defaultOption = conf;
    }

    /**
     * 合并默认配置项，用于追加全局通用配置项
     * @param conf
     */
    static
    mergeDefaultOption(conf) {
        defaultOption = extend(defaultOption, conf);
    }

	/**
	 * @静态方法
	 * 获取Table 对应 GridManager的实例
	 * @param table
	 * @returns {*}
	 */
	static
	get(table) {
        return getSettings(getKey(table));
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
		return getUserMemory(getKey(table));
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
        const _ = getKey(table);
        const settings = getSettings(_);
        if (isRendered(_, settings)) {
            calcLayout(_, width, height, settings.supportAjaxPage);
            updateThWidth(settings);
            updateScrollStatus(_);
            scroll.update(_);
        }
    }

	/**
	 * @静态方法
	 * 清除指定表的表格记忆数据, 如果未指定删除的table, 则全部清除
	 * @param table
	 * @returns {boolean}
     */
	static
	clear(table) {
	    const _ = getKey(table);
        return isRendered(_) && delUserMemory(_);
	}

    /**
     * @静态方法
     * 获取当前渲染时使用的数据
     * @param table
     * @returns {{}}
     */
    static
    getTableData(table) {
        const _ = getKey(table);
        return isRendered(_) && getTableData(_);
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
        const _ = getKey(table);
        return isRendered(_) && getRowData(_, target);
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
        const _ = getKey(table);
        isRendered(_) && updateSort(_, sortJson, callback, refresh);
	}

    /**
     * 设置表头配置区域可视状态
     * @param table
     * @param visible
     */
    static
    setConfigVisible(table, visible) {
        const _ = getKey(table);
        const settings = getSettings(_);
        if (!isRendered(_, settings)) {
            return;
        }

        if (!settings.supportConfig) {
            outError('supportConfig!==true');
            return;
        }

        switch (visible) {
            case true: {
                config.show(_);
                break;
            }
            case false: {
                config.hide(_);
                break;
            }
            case undefined: {
                config.toggle(_);
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
        const _ = getKey(table);
        if (isRendered(_)) {
            setAreVisible(_, thName, true);
            config.update(_);
        }
	}

	/**
	 * @静态方法
	 * 隐藏Th及对应的TD项
	 * @param table
     * @param thName or thNameList
     */
	static
	hideTh(table, thName) {
        const _ = getKey(table);
        if (isRendered(_)) {
            setAreVisible(_, thName, false);
            config.update(_);
        }
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
	exportGrid(table, fileName, onlyChecked) {
        const _ = getKey(table);
        return isRendered(_) && exportFile.exportGrid(_, fileName, onlyChecked);
	}

	// TODO 临时方案，exportGridToXls 下个版本将清除，使用exportGrid替代
    static
    exportGridToXls(table, fileName, onlyChecked) {
	    outWarn('exportGridToXls下个版本将移除，请使用exportGrid进行替换');
        return GridManager.exportGrid(table, fileName, onlyChecked);
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
        const _ = getKey(table);
        const settings = getSettings(_);
        if (!isRendered(_, settings)) {
            return;
        }

		const { columnMap, pageData, currentPageKey } = settings;
		if (!isObject(query)) {
            query = {};
        }

        // 无第三个参数时，将callback前移
        if (!isBoolean(gotoPage) && !isNumber(gotoPage)) {
			callback = gotoPage;
			gotoPage = true;
		}

		// 更新过滤相关字段
        settings._filter && each(columnMap, (key, col) => {
            if (col.filter) {
                col.filter.selected = isString(query[key]) ? query[key] : '';
                // 这里不使用base.getTh的原因: 需要同时更新thead 和 fake-thead
                filter.update(getFakeTh(_, key), col.filter);
            }
        });

		// 更新settings.query
		extend(settings, {query: query});

		// 返回第一页
		if (gotoPage === true) {
			pageData[currentPageKey] = 1;
		}

		// 返回指定页
		if (isNumber(gotoPage)) {
            pageData[currentPageKey] = gotoPage;
        }
		setSettings(settings);
		core.refresh(_, callback);
	}

	/**
	 * @静态方法
	 * 配置静态数ajaxData; 用于再次配置ajaxData数据, 配置后会根据参数ajaxData即时刷新表格
	 * @param table
	 * @param ajaxData: 配置的数据
	 */
	static
	setAjaxData(table, ajaxData, callback) {
	    const _ = getKey(table);
        const settings = getSettings(_);
        if (isRendered(_, settings)) {
            extend(settings, { ajaxData });
            setTableData(_, []);
            setSettings(settings);
            core.refresh(_, callback);
        }
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
        const _ = getKey(table);
        const settings = getSettings(_);
	    if (isRendered(_, settings)) {
            if (!isBoolean(isGotoFirstPage)) {
                callback = isGotoFirstPage;
                isGotoFirstPage = false;
            }
            if (isGotoFirstPage) {
                settings.pageData[settings.currentPageKey] = 1;
                setSettings(settings);
            }
            core.refresh(_, callback);
        }
	};

    /**
     * @静态方法
     * 渲染表格 使用现有数据，对表格进行渲染
     * @param table
     */
    static
	renderGrid(table) {
        const _ = getKey(table);
        const settings = getSettings(_);
        if (isRendered(_, settings)) {
            const { dataKey, totalsKey, pageData } = settings;
            const response = {
                [dataKey]: getTableData(_),
                [totalsKey]: pageData.tSize
            };
            core.driveDomForSuccessAfter(settings, response);
        }
    }

    /**
     * @静态方法
     * 重置settings [比较危险的操作，会改变当前实例中的基础配置。只在处理特殊情况时使用,现仅在react版本中使用到]
     * @param table
     * @param settings
     */
	static
    resetSettings(table, settings) {
        const _ = getKey(table);
        isRendered(_, settings) && setSettings(settings);
    }

    /**
     * @静态方法
     * 更新模板 [现仅在react版本中使用到]
     * @param arg
     */
    static
    updateTemplate(arg) {
        return updateTemplate(arg);
    }

    /**
	 * @静态方法
	 * 获取当前选中的行
	 * @param table
	 * @returns {NodeList} 当前选中的行
     */
	static
	getCheckedTr(table) {
        const _ = getKey(table);
        return isRendered(_) && checkbox.getCheckedTr(_);
	};

	/**
	 * @静态方法
	 * 获取当前选中行渲染时使用的数据
	 * @param table
	 * @returns {{}}
     */
	static
	getCheckedData(table) {
        const _ = getKey(table);
        return isRendered(_) && getCheckedData(_);
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
        const _ = getKey(table);
        const settings = getSettings(_);
        if (isRendered(_, settings)) {
            const checkedList = isArray(checkedData) ? checkedData : [checkedData];
            const { columnMap, checkboxConfig, treeConfig } = settings;
            const treeKey = treeConfig.treeKey;
            const tableData = getTableData(_);
            const { key, useRadio, max } = checkboxConfig;
            tableData.forEach(rowData => {
                // 获取比对数据时，需要清除子数据
                let cloneRow = getCloneRowData(columnMap, rowData, [treeKey]);
                rowData[CHECKBOX_KEY] = checkedList.some(item => equal(cloneRow, getCloneRowData(columnMap, item, [treeKey]), key));
            });

            setTableData(_, tableData);
            setCheckedData(_, checkedList, true);
            return resetCheckboxDOM(_, tableData, useRadio, max);
        }
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
        const _ = getKey(table);
        const settings = getSettings(_);
        if (isRendered(_, settings)) {
            const { columnMap, supportCheckbox } = settings;
            const rowDataList = isArray(rowData) ? rowData : [rowData];
            const { tableData, updateCacheList } = updateRowData(_, key, rowDataList);

            // 更新选中数据
            if (supportCheckbox) {
                updateCheckedData(_, columnMap, key, rowDataList);
            }

            // 更新DOM
            coreDOM.updateTrDOM(settings, updateCacheList);
            return tableData;
        }
    }

    /**
     * @静态方法
     * 更新树的展开状态
     * @param table
     * @param state
     */
    static updateTreeState(table, state) {
        const _ = getKey(table);
        isRendered(_) && tree.updateDOM(_, state);
    }

    /**
     * @静态方法
     * 清空表格数据
     * @param table
     * @returns {*|void}
     */
	static
	cleanData(table) {
        const _ = getKey(table);
        if (isRendered(_)) {
            setTableData(_, []);
            this.renderGrid(_);
        }
	}

    /**
     * @静态方法
     * 打印
     * @param table
     */
    static
    print(table) {
        const _ = getKey(table);
        isRendered(_) && print(_);
    }

    /**
	 * 初始化表格
	 * @param $table
	 * @param settings
     */
	async initTable($table, settings) {
		// 渲染HTML，嵌入所需的事件源DOM
        await core.createDOM($table, settings);

        const { _ } = settings;

        // init adjust
        if (settings.supportAdjust) {
            adjust.init(_);
        }

        // init drag
        if (settings.supportDrag) {
            drag.init(_);
        }

        // init moveRow
        if (settings.supportMoveRow) {
            moveRow.init(_);
        }

        // init checkbox
        if (settings.supportCheckbox) {
            checkbox.init(_);
        }

        // init sort
        if (settings._sort) {
            sort.init(_);
        }

        // init remind
        if (settings._remind) {
            remind.init(_);
        }

        // init filter
        if (settings._filter) {
            filter.init(_);
        }

        // init config
        if (settings.supportConfig) {
            config.init(_);
        }

        // 初始化右键菜单事件
        if (settings.supportMenu) {
            menu.init(_);
        }

        // 初始化Ajax分页
        if (settings.supportAjaxPage) {
            ajaxPage.init(_);
        }

        // 初始化树形结构
        if (settings.supportTreeData) {
            tree.init(_);
        }

        updateThWidth(settings, true);

        // 更新fake header
        scroll.update(_);

        // 更新最后一项可视列的标识
        updateVisibleLast(_);

        // 更新滚动轴显示状态
        updateScrollStatus(_);
	}

    /**
     * @静态方法
     * 消毁当前实例
     * @param table
     */
    static
    destroy(table) {
        const _ = getKey(table);

        try {
            // 清除各模块中的事件及部分DOM
            adjust.destroy(_);
            ajaxPage.destroy(_);
            checkbox.destroy(_);
            config.destroy(_);
            coreDOM.destroy(_);
            drag.destroy(_);
            dropdown.destroy(_);
            filter.destroy(_);
            menu.destroy(_);
            moveRow.destroy(_);
            remind.destroy(_);
            scroll.destroy(_);
            sort.destroy(_);
            tree.destroy(_);
        } catch (e) {
            console.error(e);
        }

        // 清除实例及数据
        clearCache(_);
    }
}
