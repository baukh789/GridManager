/*
* @cache: 数据存储
* 缓存类型分为:
* 1.Store: 渲染表格时所使用的json数据 [存储在GM实例]
* 2.UserMemory: 用户记忆 [存储在localStorage]
* */
import { getCloneRowData, getFakeTh, getTable, getTh } from '@common/base';
import {
    isUndefined,
    isFunction,
    isObject,
    isString,
    isValidArray,
    isElement,
    each,
    isNodeList,
    extend,
    getBrowser,
    isNumber
} from '@jTool/utils';
import { outInfo, outError, equal, getObjectIndexToArray, cloneObject } from '@common/utils';
import { DISABLE_CUSTOMIZE } from '@common/constants';
import { Settings } from '@common/Settings';
import TextConfig from '@module/i18n/config';
import store from '@common/Store';
import { CACHE_ERROR_KEY, MEMORY_KEY, VERSION_KEY, ORDER_KEY, CHECKBOX_KEY, CHECKBOX_DISABLED_KEY, TR_CACHE_KEY, TR_LEVEL_KEY, CELL_HIDDEN } from './constants';

// 用户记忆所存储的字段
const MEMORY_COLUMN_KEY_LIST = ['width', '__width', 'isShow', '__isShow', 'index', '__index'];

// 用户记忆是否清除所验证的字段
const MEMORY_CHECK_COLUMN_KEY_LIST = ['__width', '__isShow', '__index'];

const getStorage = (key: string): string => {
    return localStorage.getItem(key);
};

const setStorage = (key: string, memory: string): void => {
    localStorage.setItem(key, memory);
};

const removeStorage = (key: string): void => {
    localStorage.removeItem(key);
};

/**
 * 等待table-warp可用, 不可用时不进行表头重绘
 */
export const SIV_waitContainerAvailable = {};

/**
 * 等待table可用，不可用时不触发init方法
 */
export const SIV_waitTableAvailable =  {};

/**
 * 版本信息
 * @returns {*}
 */
export const getVersion = (): string => {
    return store.version;
};

/**
 * 获取当前行使用的数据
 * @param _
 * @param target: 将要获取数据所对应的tr
 * @param useSourceData: 使用原数据 或 克隆数据
 * @returns {*}
 */
export const getRowData = (_: string, target: HTMLTableElement, useSourceData: boolean): object => {
    const settings = getSettings(_);
    const tableData = getTableData(_);
    const getTrData = (tr: HTMLTableElement): object => {
        const cacheKey = tr.getAttribute(TR_CACHE_KEY);
        let rowData = tableData[cacheKey] || {};

        // 树型结构的数据
        if (settings.supportTreeData && cacheKey.indexOf('-') !== -1) {
            const treeKey = settings.treeConfig.treeKey;
            cacheKey.split('-').forEach((key, index) => {
                if (index === 0) {
                    rowData = tableData[key];
                } else {
                    rowData = rowData[treeKey][key];
                }
            });
        }

        return useSourceData ? rowData : getCloneRowData(settings.columnMap, rowData);
    };

    // target type = Element 元素时, 返回单条数据对象;
    if (isElement(target)) {
        return getTrData(target);
    }

    // target type =  NodeList 类型时, 返回数组
    if (isNodeList(target)) {
        let rodData: Array<object> = [];
        each(target, (tr: HTMLTableElement) => {
            rodData.push(getTrData(tr));
        });
        return rodData;
    }

    // 不为Element 和 NodeList时, 返回空对象
    return {};
};

/**
 * 更新行数据
 * @param _
 * @param key: 列数据的主键
 * @param rowDataList: 需要更新的数据列表
 * @returns tableData: 更新后的表格数据
 */
export const updateRowData = (_: string, key: string, rowDataList: Array<object>) => {
    const tableData = getTableData(_);
    const settings = getSettings(_);
    const supportTreeData = settings.supportTreeData;
    const treeKey = settings.treeConfig.treeKey;

    // 当前正在展示的被更新项getRowData
    const updateCacheList: Array<object> = [];
    const updateData = (list: Array<any>, newItem: any): void => {
        list.some(item => {
            if (item[key] === newItem[key]) {
                extend(item, newItem);
                updateCacheList.push(item);
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

    setTableData(_, tableData);
    return {
        tableData,
        updateCacheList
    };
};

/**
 * 获取表格数据
 * @param _
 */
export const getTableData = (_: string): Array<any> => {
    return cloneObject(store.responseData[_] || []);
};

/**
 * 存储表格数据
 * @param _
 * @param data
 */
export const setTableData = (_: string, data: Array<any>): void => {
    store.responseData[_] = data;
};

/**
 * 重置 table data 格式化
 * @param _
 * @param data
 * @returns {*}
 */
export const resetTableData = (_: string, data: Array<object>): Array<object> => {

    const {
        columnMap,
        rowRenderHandler,
        pageData,
        supportAutoOrder,
        supportCheckbox,
        checkboxConfig,
        pageSizeKey,
        currentPageKey,
        supportTreeData,
        treeConfig
    } = getSettings(_);

    const checkboxKey = checkboxConfig.key;
    // 为每一行数据增加唯一标识
    const addCacheKey = (row: object, level: number, index: number, pIndex?: string): void => {
        let cacheKey = index.toString();
        if (!isUndefined(pIndex)) {
            cacheKey = `${pIndex}-${index}`;
        }

        if (supportTreeData) {
            const children = row[treeConfig.treeKey];
            const hasChildren = children && children.length;

            // 递归处理层极结构
            if (hasChildren) {
                children.forEach((item: object, index: number) => {
                    addCacheKey(item, level + 1, index, cacheKey);
                });
            }

        }

        // 为每一行数据增加唯一标识
        row[TR_CACHE_KEY] = cacheKey;

        // 为每一行数据增加层级
        row[TR_LEVEL_KEY] = level;
    };

    const newData = data.map((row, index): object => {
        // add order
        if (supportAutoOrder) {
            let	orderBaseNumber = 1;

            // 验证是否存在分页数据
            if (pageData && pageData[pageSizeKey] && pageData[currentPageKey]) {
                orderBaseNumber = pageData[pageSizeKey] * (pageData[currentPageKey] - 1) + 1;
            }
            row[ORDER_KEY] = orderBaseNumber + index;
        }

        // add checkbox
        if (supportCheckbox) {
            row[CHECKBOX_KEY] = getCheckedData(_).some((item: object) => {
                return equal(getCloneRowData(columnMap, item), getCloneRowData(columnMap, row), checkboxKey);
            });
            row[CHECKBOX_DISABLED_KEY] = false;
        }

        // add cache key
        addCacheKey(row, 0, index);

        // 单行数据渲染时执行程序
        return rowRenderHandler(row, index);
    });

    // 存储表格数据
    setTableData(_, newData);
    setCheckedData(_, newData);
    return newData;
};

/**
 * 获取选中的数据
 * @param _
 * @returns {*|Array}
 */
export const getCheckedData = (_: string): Array<object> => {
    const checkedList = store.checkedData[_] || [];

    // 返回clone后的数组，以防止在外部操作导致数据错误。
    return checkedList.map((item: object) => extend(true, {}, item));
};

/**
 * 设置选中的数据: 覆盖操作，会将原有的选中值清除
 * @param _
 * @param dataList: 数据列表， isClear===true时该项只能为选中的数据
 * @param isClear: 是否清空原有的选中项 (该参数不公开)
 */
export const setCheckedData = (_: string, dataList: Array<object>, isClear?: boolean): void => {
    const { columnMap, checkboxConfig } = getSettings(_);
    // 覆盖操作，清空原有的选中数据。 并且 dataList 将会按选中状态进行处理
    if (isClear) {
        store.checkedData[_] = dataList.map(item => getCloneRowData(columnMap, item));
        return;
    }

    // 合并操作，不清空原有的选中数据
    if (!store.checkedData[_]) {
        store.checkedData[_] = [];
    }
    const tableCheckedList = store.checkedData[_];
    const key = checkboxConfig.key;

    dataList.forEach(item => {
        const cloneObj = getCloneRowData(columnMap, item);
        const checked = item[CHECKBOX_KEY];
        const index = getObjectIndexToArray(tableCheckedList, cloneObj, key);

        // 新增: 已选中 且 未存储
        if (checked && index === -1) {
            tableCheckedList.push(cloneObj);
            return;
        }

        // 删除: 未选中 且 已存储
        if (!checked && index !== -1) {
            tableCheckedList.splice(index, 1);
        }
    });
};

/**
 * 更新选中的数据
 * @param _
 * @param columnMap
 * @param key
 * @param rowDataList
 */
export const updateCheckedData = (_: string, columnMap: object, key: string, rowDataList: Array<object>): void => {
    if (!store.checkedData[_]) {
        return;
    }
    store.checkedData[_] = store.checkedData[_].map((item: object): object => {
        rowDataList.forEach(newItem => {
            if (item[key] === newItem[key]) {
                extend(item, getCloneRowData(columnMap, newItem));
            }
        });
        return item;
    });
};

/**
 * 获取表格的用户记忆标识码
 * @param _
 * @returns {*}
 */
export const getMemoryKey = (_: string): string => {
    return location.pathname + location.hash + '-' + _;
};

/**
 * 获取用户记忆
 * @param _
 * @returns {*} 成功则返回本地存储数据,失败则返回空对象
 */
interface UserMemory {
    column?: object;
}
export const getUserMemory = (_: string): UserMemory => {
    let memory = getStorage(MEMORY_KEY);
    // 如无数据，增加缓存错误标识
    if (!memory || memory === '{}') {
        getTable(_).attr(CACHE_ERROR_KEY, 'error'); // todo 这里应该考虑存储在settings上
        return {};
    }
    memory = JSON.parse(memory);
    return JSON.parse(memory[getMemoryKey(_)] || '{}');
};

/**
 * 存储用户记忆
 * @param settings
 * @returns {boolean}
 */
export const saveUserMemory = (settings: any): void => {
    const { disableCache, _, columnMap, supportAjaxPage, pageData, pageSizeKey } = settings;
    // 当前为禁用缓存模式，直接跳出
    if (disableCache) {
        return;
    }

    const column = {};
    each(columnMap, (key: string, item: object): void => {
        const col = {};
        MEMORY_COLUMN_KEY_LIST.forEach(memory => {
            col[memory] = item[memory];
        });
        column[key] = col;
    });

    const _cache: UserMemory = {
        column
    };

    // 存储分页
    if (supportAjaxPage) {
        _cache[pageSizeKey] = pageData[pageSizeKey];
    }

    const cacheString = JSON.stringify(_cache);
    const memory = JSON.parse(getStorage(MEMORY_KEY) || '{}');
    memory[getMemoryKey(_)] = cacheString;
    setStorage(MEMORY_KEY, JSON.stringify(memory));
};

/**
 * 删除用户记忆
 * @param _
 * @returns {boolean}
 */
export const delUserMemory = (_?: string): boolean => {
    // 如果未指定删除的table, 则全部清除
    if (!_) {
        removeStorage(MEMORY_KEY);
        outInfo('delete user memory of all');
        return true;
    }

    let memory = getStorage(MEMORY_KEY);
    if (!memory) {
        return false;
    }
    memory = JSON.parse(memory);

    // 指定删除的table, 则定点清除
    delete memory[getMemoryKey(_)];

    // 清除后, 重新存储
    setStorage(MEMORY_KEY, JSON.stringify(memory));
    outInfo(`delete user memory of ${_}`);
    return true;
};

/**
 * 更新模板，将非函数类型的模板转换为函数类型
 * @param arg
 * @returns {*}
 */
export const updateTemplate = (arg: any): any => {
    const { columnData, emptyTemplate } = arg;

    // 强制转换模板为函数: emptyTemplate
    if (emptyTemplate && !isFunction(emptyTemplate)) {
        arg.emptyTemplate = () => emptyTemplate;
    }
    const resetTemplate = (list: Array<any>) => {
        list.forEach(col => {
            // 强制转换模板为函数: text
            const text = col.text;
            if (text && !isFunction(text)) {
                col.text = () => text;
            }

            // 当前存列存在嵌套子项: 进行递归转换， 并清除当前列模板
            if (isValidArray(col.children)) {
                resetTemplate(col.children);
                delete col.template;
                return;
            }

            // 强制转换模板为函数: template
            const template = col.template;
            if (template && !isFunction(template)) {
                col.template = () => template;
            }
        });
    };
    resetTemplate(columnData);
    return arg;
};

/**
 * 初始化设置相关: 合并, 存储
 * @param arg
 * @param moveColumnRowFn
 * @param checkboxColumnFn
 * @param orderColumnFn
 * @param fullColumnFn
 */
export const initSettings = (arg: any, moveColumnRowFn: any, checkboxColumnFn: any, orderColumnFn: any, fullColumnFn: any): any => {
    // 转换简易列: ['key1'] => [{key, text}]
    if (isString(arg.columnData[0])) {
        arg.columnData = arg.columnData.map((item: string): object => {
           return {
               key: item,
               text: item
           };
        });
    }

    // 更新模板，将非函数类型的模板转换为函数类型
    arg = updateTemplate(arg);

    // 合并参数
    // @ts-ignore
    let settings = new Settings();
    settings.textConfig = new TextConfig();

    extend(true, settings, arg);

    // 将_配置简写方式, 方便内部使用
    settings._ = settings.gridManagerName;

    // 存储当前使用的浏览器
    settings.browser = getBrowser();

    // 存储初始配置项
    // setSettings(settings);

    const { _, columnData, supportMoveRow, moveRowConfig, supportAutoOrder, __isNested, __isFullColumn, fullColumn, supportCheckbox, checkboxConfig } = settings;

    const list = [];
    // 自动增加: 行移动列
    if (supportMoveRow && moveRowConfig.useSingleMode) {
        list.push(moveColumnRowFn(moveRowConfig));
    }

    // 自动增加: 选择列
    if (supportCheckbox) {
        list.push(checkboxColumnFn(checkboxConfig));
    }

    // 自动增加: 序号列
    if (supportAutoOrder) {
        list.push(orderColumnFn(settings));
    }

    // 自动增加: 折叠操作列
    if (__isFullColumn && fullColumn.useFold) {
        list.push(fullColumnFn(settings));
    }

    // 为 columnData 提供锚 => columnMap
    // columnData 在此之后, 将不再被使用到
    // columnData 与 columnMap 已经过特殊处理, 不会彼此影响
    const columnMap = {};

    let isError = false;

    // 固定列规则: 当前为嵌套表头 并且 列数大于1
    const supportFixed = !__isNested && columnData.length > 1;

    const resetData = (data: Array<any>, level: number, parentKey?: string): void => {
        data.forEach((col, index) => {
            col = extend(true, {}, col);
            const key = col.key;
            // key字段不允许为空
            if (!key) {
                outError(`columnData[${index}].key undefined`);
                isError = true;
                return;
            }

            // 宽度转换: 100px => 100
            // 不使用isString的原因: 存在'30'类型的数据
            if (col.width && !isNumber(col.width)) {
                col.width = parseInt(col.width, 10);
            }

            // 属性: 表头提醒
            if (col.remind) {
                settings._remind = true;
            }

            // 属性: 排序
            if (isString(col.sorting)) {
                settings._sort = true;
            }

            // 属性: 过滤
            if (isObject(col.filter)) {
                settings._filter = true;
            }

            // 属性: 固定列
            if (supportFixed && isString(col.fixed)) {
                settings._fixed = true;

                // 使用后 disableCustomize 将强制变更为true
                col[DISABLE_CUSTOMIZE] = true;
            } else {
                delete col.fixed;
            }

            // 存在disableCustomize时，必须设置width
            if (col[DISABLE_CUSTOMIZE] && !col.width) {
                outError(`column ${key}: width must be set`);
                isError = true;
                return;
            }
            columnMap[key] = col;

            // 如果未设定, 设置默认值为true
            columnMap[key].isShow = col.isShow || isUndefined(col.isShow);

            // 为列Map 增加索引
            columnMap[key].index = index;

            // 存储由用户配置的列索引, 该值不随着之后的操作变更
            columnMap[key].__index = index;

            // 存储由用户配置的列宽度值, 该值不随着之后的操作变更
            columnMap[key].__width = col.width;

            // 存储由用户配置的列显示状态, 该值不随着之后的操作变更
            columnMap[key].__isShow = col.isShow;

            // 存在多层嵌套时，递归增加标识: columnMap中的数据会保持平铺
            if (__isNested) {
                if (isValidArray(col.children)) {
                    // delete columnMap[key].width;
                    // delete columnMap[key].__width;
                    resetData(col.children, level + 1, col.key);
                }
                columnMap[key].pk = parentKey;
                columnMap[key].level = level;
            }
        });
    };
    resetData(list.concat(columnData), 0);

    if (isError) {
        return false;
    }
    settings.columnMap = columnMap;

    // 合并用户记忆至 settings, 每页显示条数记忆不在此处
    const mergeUserMemory = () => {
        // 当前为禁用状态
        if (settings.disableCache) {
            return;
        }

        const columnMap = settings.columnMap;
        const userMemory = getUserMemory(_);
        const columnCache = userMemory.column || {};
        const columnCacheKeys = Object.keys(columnCache);
        const columnMapKeys = Object.keys(columnMap);

        // 无用户记忆
        if (columnCacheKeys.length === 0) {
            return;
        }

        // 是否为有效的用户记忆
        let isUsable = true;

        // 与用户记忆数量不匹配
        if (columnCacheKeys.length !== columnMapKeys.length) {
            isUsable = false;
        }

        // 与用户记忆项不匹配
        isUsable && each(columnMap, (key: string, col: object) => {
            if (!columnCache[key]
                || MEMORY_CHECK_COLUMN_KEY_LIST.some(memoryKey => {
                    const memory = columnCache[key][memoryKey];
                    const item = col[memoryKey];
                    if (isObject(memory)) {
                        return JSON.stringify(memory) !== JSON.stringify(item);
                    }
                    return memory !== item;
                })
            ) {
                isUsable = false;
                return false;
            }
        });

        // 将用户记忆并入 columnMap 内
        if (isUsable) {
            extend(true, columnMap, columnCache);
        } else {
            // 清除用户记忆
            delUserMemory(_);
        }
    };

    // 合并用户记忆
    mergeUserMemory();

    // 更新存储配置项
    setSettings(settings);
    return settings;
};

/**
 * 获取配置项
 * @param _
 * @returns {*}
 */
export const getSettings = (_: string): any => {
    // 返回的是 clone 对象 而非对象本身
    return extend(true, {}, store.settings[_] || {});
};
/**
 * 设置配置项
 * @param settings
 */
export const setSettings = (settings: any): void => {
    store.settings[settings._] = extend(true, {}, settings);
};

/**
 * 更新Cache, 包含[更新表格列Map, 重置settings, 存储用户记忆]
 * @param _
 * @param useFakeTh: 是否使用fake th
 */
export const updateCache = (_: string, useFakeTh: boolean): any => {
    const settings = getSettings(_);
    const columnMap = settings.columnMap;

    const getThFn = (_: string, key: string) => {
        if (useFakeTh) {
            return getFakeTh(_, key);
        }
        return getTh(_, key);
    };
    // 更新 columnMap, 适用顶层表头操作[宽度调整, 位置调整, 可视状态调整]
    each(columnMap, (key: string, col: any) => {
        // 禁用定制列: 不处理
        if (col[DISABLE_CUSTOMIZE]) {
            return;
        }

        let th = getThFn(_, col.key);

        // 宽度
        col.width = th.width();

        // 位置索引
        col.index = th.index();

        // 可视状态
        col.isShow = !isString(th.attr(CELL_HIDDEN));
    });

    // 重置settings
    setSettings(settings);

    // 存储用户记忆
    saveUserMemory(settings);

    return settings;
};

/**
 * 验证版本号,如果版本号变更清除用户记忆
 */
export const verifyVersion = () => {
    const cacheVersion = getStorage(VERSION_KEY);
    const storeVersion = store.version;
    // 当前为第一次渲染, 存储版本号
    if (!cacheVersion) {
        setStorage(VERSION_KEY, storeVersion);
    }
    // 版本变更, 清除所有的用户记忆
    if (cacheVersion && cacheVersion !== storeVersion) {
        delUserMemory();
        setStorage(VERSION_KEY, storeVersion);
    }
};

/**
 * 清空缓存
 * @param _
 */
export const clearCache = (_: string) => {
    delete store.responseData[_];
    delete store.checkedData[_];
    delete store.settings[_];

    // 清除setInterval
    clearInterval(SIV_waitTableAvailable[_]);
    clearInterval(SIV_waitContainerAvailable[_]);
    delete SIV_waitTableAvailable[_];
    delete SIV_waitContainerAvailable[_];
};
