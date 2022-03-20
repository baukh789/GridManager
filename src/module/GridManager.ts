/**
 * Created by baukh on 17/10/26.
 * 构造类
 */
import jTool from '@jTool';
import {
    extend,
    isUndefined,
    isString,
    isFunction,
    isNumber,
    isBoolean,
    isObject,
    isArray,
    each,
    isEmptyObject,
    getStyle,
    isValidArray
} from '@jTool/utils';
import { TABLE_KEY, CACHE_ERROR_KEY, TABLE_PURE_LIST, CHECKBOX_KEY, READY_CLASS_NAME, PX } from '@common/constants';
import {
    showLoading,
    hideLoading,
    getCloneRowData,
    getKey,
    getThead,
    getFakeThead,
    getAllTh,
    calcLayout,
    updateThWidth,
    setAreVisible,
    getFakeTh,
    updateVisibleLast,
    updateScrollStatus,
    getTable,
    setLineHeightValue
} from '@common/base';
import { outWarn, outError, equal } from '@common/utils';
import { getVersion, verifyVersion, initSettings, getSettings, setSettings, getUserMemory, saveUserMemory, delUserMemory, getRowData, getTableData, setTableData, updateTemplate, getCheckedData, setCheckedData, updateCheckedData, clearCache, SIV_waitTableAvailable, updateCache, formatColumnData, resetColumn } from '@common/cache';
import { clearCacheDOM } from '@common/domCache';
import adjust from './adjust';
import ajaxPage from './ajaxPage';
import dropdown from './dropdown';
import order from './order';
import checkbox, { resetCheckboxDOM } from './checkbox';
import tree from './tree';
import config from './config';
import core from './core';
import { renderEmptyTbody, renderThead } from './core/render';
import drag from './drag';
import moveRow from './moveRow';
import exportFile from './exportFile';
import menu from './menu';
import { clearMenuDOM } from './menu/tool';
import remind from './remind';
import nested from './nested';
import scroll from './scroll';
import fullColumn from './fullColumn';
import sort, { updateSort } from './sort';
import filter from './filter';
import fixed from './fixed';
import print from './print';
import { showRow, hideRow } from './rowVisible';
import { Column, ArgColumn, SettingObj, JTool, ArgObj, SortData, Row } from 'typings/types';

const isRendered = (_: string, settings?: SettingObj): boolean => {
    // 部分静态方法自身不使用settings， 所以这个参数可能为空
    if (!settings) {
        settings = getSettings(_);
    }

    if (settings.rendered) {
        return true;
    }
    outWarn(`run failed，please check ${_} had been init`);
};

// 存储默认配置
let defaultOption = {};

// 渲染队列存储器
const RENDER_QUEUE = {};
export default class GridManager {
    /**
     * [对外公开方法]
     * @param table
     * @param arg: 参数
     * @param callback: 回调
     * @returns {*}
     */
    constructor(table: HTMLTableElement, arg: ArgObj, callback?: any) {
        // 验证当前Element是否为table
        if (table.nodeName !== 'TABLE') {
            outError('nodeName !== "TABLE"');
            return;
        }

        // 存储class style， 在消毁实例时使用
        TABLE_PURE_LIST.forEach(item => {
            table['__' + item] = table.getAttribute(item);
        });

        let $table = jTool(table);
        arg = <ArgObj>extend(true, {}, GridManager.defaultOption, arg);

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
        if (settings.rendered) {
            // outWarn(`${gridManagerName} had been used`);

            // 如果已经存在，则清除之前的数据。#001
            GridManager.destroy(gridManagerName);
        }

        // 渲染队列: 当前队列已存在 且 已经开始渲染
        if (RENDER_QUEUE[gridManagerName] && !SIV_waitTableAvailable[gridManagerName]) {
            return;
        }

        // 渲染队列: 当前队列已存在 且 未进行渲染
        if (RENDER_QUEUE[gridManagerName] && SIV_waitTableAvailable[gridManagerName]) {
            clearInterval(SIV_waitTableAvailable[gridManagerName]);
            delete SIV_waitTableAvailable[gridManagerName];
        }
        // 渲染队列: 新增(暂时不需要存储有用的数据，使用)
        RENDER_QUEUE[gridManagerName] = true;

        // 校验: 初始参
        if (!arg || isEmptyObject(arg)) {
            outError('init method params error');
            return;
        }

        // 校验: columnData
        if (!isValidArray(arg.columnData)) {
            outError('columnData invalid');
            return;
        }

        // 校验: ajaxData
        if (!arg.ajaxData) {
            outError('ajaxData undefined');
            return;
        }

        // 相互冲突的参数项处理: 通栏
        if (isObject(arg.fullColumn) && (isFunction(arg.fullColumn.topTemplate) || isFunction(arg.fullColumn.bottomTemplate))) {
            // 不使用配置功能
            arg.supportConfig = false;

            // 不使用自动序号
            // arg.supportAutoOrder = false;

            // 不使用全选功能
            // arg.supportCheckbox = false;

            // 不使用拖拽功能
            arg.supportDrag = false;

            // 不使用宽度调整功能
            // arg.supportAdjust = false;

            // 不使用行移动功能
            arg.supportMoveRow = false;

            // 不使用树型数据
            arg.supportTreeData = false;

            // 禁用分割线
            // arg.disableLine = true;

            // 增加通栏标识
            arg.__isFullColumn = true;

            // 不使用虚拟滚动
			delete arg.virtualScroll;
        }

        // 相互冲突的参数项处理: 树型
        if (arg.supportTreeData) {

            // 不使用行移动功能
            arg.supportMoveRow = false;

            // 不使用通栏
            arg.__isFullColumn = false;

            // 不使用虚拟滚动
			delete arg.virtualScroll;
        }

        // 相互冲突的参数项处理: 多层嵌套表头
        if (arg.columnData.some((item: ArgColumn) => isValidArray(item.children))) {
            // 不使用配置功能
            arg.supportConfig = false;

            // 不使用拖拽功能
            arg.supportDrag = false;

            // 不使用宽度调整功能
            arg.supportAdjust = false;

            // 不使用禁止分割线
            arg.disableLine = false;

            // 不使用行移动
            arg.supportMoveRow = false;

            // 增加多层嵌套标识
            arg.__isNested = true;
        }

        // 通过版本较验 清理缓存
        verifyVersion();

        // 初始化设置相关: 合并, 存储
        settings = initSettings(arg, moveRow.getColumn.bind(moveRow), checkbox.getColumn.bind(checkbox), order.getColumn.bind(order), fullColumn.getColumn.bind(fullColumn));

        // 清除DOM缓存，用于防止上一次清除失败
        clearCacheDOM(settings._);

        const initTableAfter = () => {
            // 如果初始获取缓存失败，在渲染完成后首先存储一次数据
            if (!isUndefined($table.attr(CACHE_ERROR_KEY))) {
                setTimeout(() => {
                    saveUserMemory(settings);
                    $table.removeAttr(CACHE_ERROR_KEY);
                }, 1000);
            }

            settings = getSettings(gridManagerName);

            // 渲染队列: 清除已完成项
            delete RENDER_QUEUE[gridManagerName];

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
				renderEmptyTbody(settings, true);
                runCallback();
            })();

            // table实例完成后，重置表头[angular 中必须要这么做]
            scroll.update(settings._);
        };

        // 初始化表格函数
        const runInit = () => {
            // 重新获取dom: 在react框架版本中，参数table会在gm-react componentDidUpdate时出现变更的情况
            $table = getTable(gridManagerName);
            table = $table.get(0);
            if (getStyle(table, 'width').indexOf(PX) === -1) {
                return true;
            }

            clearInterval(SIV_waitTableAvailable[gridManagerName]);
            delete SIV_waitTableAvailable[gridManagerName];

            // 初始化表格, setInterval未停止前 initTable并不会执行
            this.initTable($table, settings).then(initTableAfter);
        };

        // 在setInterval之前，先执行一次: 如当前表格不可用则等待, 并且对相同gridManagerName的表格进行覆盖以保证只渲染一次
        if (runInit()) {
            clearInterval(SIV_waitTableAvailable[gridManagerName]);
            SIV_waitTableAvailable[gridManagerName] = setInterval(() => {
                runInit();
            }, 50);
        }
    }

    /**
	 * @静态方法
	 * 版本号
	 * GridManager.version || GM.version
	 * @returns {string}
	 */
	static get version(): string {
		return getVersion();
	}

	/**
     * 获取默认配置项
     */
    static get defaultOption(): object {
	    return defaultOption;
    }

    /**
     * 配置默认配置项
     */
	static set defaultOption(conf: object) {
        defaultOption = conf;
    }

    /**
     * 合并默认配置项，用于追加全局通用配置项
     * @param conf
     */
    static mergeDefaultOption(conf: object): void {
        defaultOption = extend(defaultOption, conf);
    }

	/**
	 * @静态方法
	 * 获取Table 对应 GridManager的实例
	 * @param table
	 * @returns {*}
	 */
	static get(table: string | HTMLTableElement): SettingObj {
        return getSettings(getKey(table));
	}

	/**
	 * @静态方法
	 * 获取指定表格的本地存储数据
	 * 成功后返回本地存储数据,失败则返回空对象
	 * @param table
	 * @returns {{}}
     */
	static getLocalStorage(table: string | HTMLTableElement): object {
		return getUserMemory(getKey(table));
	}

    /**
     * @静态方法
     * 重置表格布局
     * @param table
     * @param width
     * @param height
     */
	static resetLayout(table: string | HTMLTableElement, width: string, height: string): void {
        const _ = getKey(table);
        const settings = getSettings(_);
        if (isRendered(_, settings)) {
			settings.width = width;
			settings.height = height;
			setSettings(settings);
            calcLayout(settings);

            scroll.update(_);
        }
    }

	/**
	 * @静态方法
	 * 清除指定表的表格记忆数据, 如果未指定删除的table, 则全部清除
	 * @param table
	 * @returns {boolean}
     */
	static clear(table: string | HTMLTableElement): boolean {
	    const _ = getKey(table);
        return isRendered(_) && delUserMemory(_);
	}

    /**
     * @静态方法
     * 获取当前渲染时使用的数据
     * @param table
     * @returns {{}}
     */
    static getTableData(table: string | HTMLTableElement): Array<object> {
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
	static getRowData(table: string | HTMLTableElement, target: NodeList | HTMLTableRowElement): object {
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
	static setSort(table: string | HTMLTableElement, sortJson: SortData, callback: any, refresh: boolean): void {
        const _ = getKey(table);
        isRendered(_) && updateSort(_, sortJson, callback, refresh);
	}

    /**
     * 设置表头配置区域可视状态
     * @param table
     * @param visible
     */
    static setConfigVisible(table: string | HTMLTableElement, visible: boolean): void {
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
	static showTh(table: string | HTMLTableElement, thName: string | Array<string>): void {
        const _ = getKey(table);
        if (isRendered(_) && getSettings(_).supportConfig) {
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
	static hideTh(table: string | HTMLTableElement, thName: string | Array<string>): void {
        const _ = getKey(table);
        if (isRendered(_) && getSettings(_).supportConfig) {
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
	static exportGrid(table: string | HTMLTableElement, fileName: string, onlyChecked: boolean): Promise<any> {
        const _ = getKey(table);
        return isRendered(_) && exportFile.exportGrid(_, fileName, onlyChecked);
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
     * - setQuery() 执行后不会清除已选中的数据，如需清除可以在callback中执行setCheckedData(table, [])
	 */
	static setQuery(table: string | HTMLTableElement, query: object, gotoPage: boolean | number, callback: any): void {
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
        settings._filter && each(columnMap, (key: string, col: Column) => {
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
	static setAjaxData(table: string | HTMLTableElement, ajaxData: any, callback: any): void {
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
	static refreshGrid(table: string | HTMLTableElement, isGotoFirstPage: boolean, callback: any): void {
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
    static async renderGrid(table: string | HTMLTableElement, columnData?: Array<ArgColumn>): Promise<void> {
        const _ = getKey(table);
		let settings = getSettings(_);
        if (isRendered(_, settings)) {
			if (isValidArray(columnData)) {
				columnData = formatColumnData(columnData);
				// 设置渲染完成标识
				// settings.rendered = true;
				const arg = updateTemplate({ columnData } as ArgObj);
				extend(true, settings, arg);
				resetColumn(settings, moveRow.getColumn.bind(moveRow), checkbox.getColumn.bind(checkbox), order.getColumn.bind(order), fullColumn.getColumn.bind(fullColumn));

				// render thead
				await renderThead(settings);

				// 计算布局
				calcLayout(settings);

				updateThWidth(settings, true);

				// todo 0123 进行的调式，需要确认是否可以移到renderThead内，如果可以在第一次渲染时也要移动
				if (settings._fixed) {
					fixed.init(settings);
				}

				// init时仅需要这一次存储
				setSettings(settings);
				scroll.update(_);
				// setSettings(settings);
			}


			// render tbody
            const { dataKey, totalsKey, pageData } = settings;
			const response = {
				[dataKey]: getTableData(_),
				[totalsKey]: pageData.tSize || 0 // renderGrid执行于初次数据并未返回的情况时，将总数进行归零
			};

			// 清除数据，防止命中tbody的 diff规则。如命中，则tbody区域不再更新
			setTableData(_, []);

            core.driveDomForSuccessAfter(settings, response);
        }
    }

    /**
     * @静态方法
     * 重置settings [比较危险的操作，会改变当前实例中的基础配置。只在处理特殊情况时使用,现仅在react版本中使用到]
     * @param table
     * @param settings
     */
	static resetSettings(table: string | HTMLTableElement, settings: SettingObj): void {
        const _ = getKey(table);
        isRendered(_, settings) && setSettings(settings);
    }

    /**
     * @静态方法
     * 更新模板 [现仅在react版本中使用到]
     * @param arg
     */
    static updateTemplate(arg: ArgObj): ArgObj {
        return updateTemplate(arg);
    }

    /**
	 * @静态方法
	 * 获取当前选中的行
	 * @param table
	 * @returns {NodeList} 当前选中的行
     */
	static getCheckedTr(table: string | HTMLTableElement): NodeList {
        const _ = getKey(table);
        return isRendered(_) && checkbox.getCheckedTr(_);
	};

	/**
	 * @静态方法
	 * 获取当前选中行渲染时使用的数据
	 * @param table
	 * @returns {{}}
     */
	static getCheckedData(table: string | HTMLTableElement): object {
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
    static setCheckedData(table: string | HTMLTableElement, checkedData: Array<object>): void {
        const _ = getKey(table);
        const settings = getSettings(_);
        if (isRendered(_, settings)) {
            const checkedList = isArray(checkedData) ? checkedData : [checkedData];
            const { columnMap, checkboxConfig, treeConfig, supportMenu } = settings;
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

            // 右键菜单
            if (supportMenu) {
                clearMenuDOM(_);
            }
            resetCheckboxDOM(_, tableData, useRadio, max);
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
    static updateRowData(table: string | HTMLTableElement, key: string, rowData: object | Array<object>): Array<object> {
        const _ = getKey(table);
        const settings = getSettings(_);
        if (isRendered(_, settings)) {
            const { columnMap, supportCheckbox, supportTreeData, treeConfig, rowRenderHandler } = settings;
            const rowDataList = isArray(rowData) ? <Array<object>>rowData : [rowData];

            const tableData = getTableData(_);
			const treeKey = treeConfig.treeKey;

			// 当前正在展示的被更新项getRowData
			// let updateCacheList: Array<Row> = [];
			const updateData = (list: Array<Row>, newItem: Row): void => {
				list.some((item, index) => {
					if (item[key] === newItem[key]) {
						extend(item, rowRenderHandler(extend(item, newItem), index));
						return true;
					}

					// 树型数据
					if (supportTreeData) {
						const children = item[treeKey];
						if (children && children.length) {
							return updateData(children, newItem);
						}
					}
				});
			};

			rowDataList.forEach(newItem => {
				updateData(tableData, newItem);
			});

            // 更新选中数据
            if (supportCheckbox) {
                updateCheckedData(_, columnMap, key, rowDataList);
            }

            // 触发更新
			core.changeTableData(_, tableData);
            return tableData;
        }
    }

    /**
     * @静态方法
     * 更新树的展开状态
     * @param table
     * @param state
     */
    static updateTreeState(table: string | HTMLTableElement, state: boolean): void {
        const _ = getKey(table);
        isRendered(_) && tree.updateDOM(_, state);
    }

    /**
     * @静态方法
     * 清空表格数据
     * @param table
     * @returns {*|void}
     */
	static cleanData(table: string | HTMLTableElement): void {
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
    static print(table: string | HTMLTableElement): void {
        const _ = getKey(table);
        isRendered(_) && print(_);
    }

    /**
     * @静态方法
     * 显示加载框
     * @param table
     */
    static showLoading(table: string | HTMLTableElement): void {
        const _ = getKey(table);
        const settings = getSettings(_);
        isRendered(_, settings) && showLoading(_, settings.loadingTemplate);
    }

    /**
     * @静态方法
     * 隐藏加载框
     * @param table
     * @param delayTime: 延迟隐藏时间
     */
    static hideLoading(table: string | HTMLTableElement, delayTime: number): void {
        const _ = getKey(table);
        isRendered(_) && hideLoading(_, delayTime);
    }

    /**
     * @静态方法
     * 显示行
     * @param table
     * @param index: 行的索引，为空时将显示所有已隐藏的行
     */
    static showRow(table: string | HTMLTableElement, index: number): void {
        const _ = getKey(table);
        if (isRendered(_)) {
            showRow(getSettings(_), index);
        }
    }

    /**
     * @静态方法
     * 隐藏行
     * @param table
     * @param index: 行的索引，为空时将不执行
     */
    static hideRow(table: string | HTMLTableElement, index: number): void {
        const _ = getKey(table);
        if (isRendered(_) && isNumber(index)) {
            hideRow(getSettings(_), index);
        }
    }

    /**
     * @静态方法
     * 设置行高度 v2.17.0
     * @param table
     * @param height
     */
    static setLineHeight(table: string | HTMLTableElement, height: string) {
        const _ = getKey(table);
        if (isRendered(_) && isString(height)) {
            setLineHeightValue(_, height);
        }
    }

    /**
	 * 初始化表格
	 * @param $table
	 * @param settings
     */
	async initTable($table: JTool, settings: SettingObj): Promise<any> {
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

        // 初始化Ajax分页: init内修改了settings
        if (settings.supportAjaxPage) {
            ajaxPage.init(settings);
        }

        // 初始化树形结构
        if (settings.supportTreeData) {
            tree.init(_);
        }
        if (settings.__isFullColumn) {
            fullColumn.init(_);
        }

        // 配置固定列功能: init内修改了settings
        if (settings._fixed) {
            fixed.init(settings);
        }

        updateThWidth(settings, true);

        // init时仅需要这一次存储
        setSettings(settings);

        // 更新最后一项可视列的标识: 嵌套模式不需要处理
        if (settings.__isNested) {
            nested.addSign(_);
        } else {
            updateVisibleLast(_);
        }

        // 更新滚动轴显示状态
        updateScrollStatus(_);

        // thead 下的 th 到这一步只存在控制列宽的作用，所以在这里将内容清除。并在清除前锁死高度值
        const $theadTr = getThead(_).find('tr');
        const trHeight = $theadTr.height();
        $theadTr.height(trHeight);
        getFakeThead(_).find('tr').height(trHeight);

        each(getAllTh(_), (item: HTMLTableCellElement) => {
            item.innerHTML = '';
        });

        // 更新存储信息
        updateCache(_);
    }

    /**
     * @静态方法
     * 消毁当前实例
     * @param table
     */
    static destroy(table: string | HTMLTableElement): void {
        const _ = getKey(table);

        try {
            // 清除各模块中的事件及部分DOM
            adjust.destroy(_);
            ajaxPage.destroy(_);
            checkbox.destroy(_);
            config.destroy(_);
            core.destroy(_);
            drag.destroy(_);
            dropdown.destroy(_);
            filter.destroy(_);
            menu.destroy(_);
            moveRow.destroy(_);
            remind.destroy(_);
            scroll.destroy(_);
            sort.destroy(_);
            tree.destroy(_);
            fixed.destroy(_);
            fullColumn.destroy(_);
        } catch (e) {
            console.error(e);
        }
        // 渲染队列: 无论完成与否都清除
        delete RENDER_QUEUE[_];

        // 清除实例及数据
        clearCache(_);

        // 清除dom缓存
        clearCacheDOM(_);
    }
}
