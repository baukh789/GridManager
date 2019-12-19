/*
* @cache: 数据存储
* 缓存类型分为:
* 1.Store: 渲染表格时所使用的json数据 [存储在GM实例]
* 2.UserMemory: 用户记忆 [存储在localStorage]
* */
import { getCloneRowData, getTable, getTh } from '@common/base';
import { outInfo, outError, equal, getObjectIndexToArray, isUndefined, isFunction, isObject, isElement, jEach, jExtend, isNodeList, cloneObject } from '@common/utils';
import { Settings, TextSettings } from '@common/Settings';
import store from '@common/Store';
import {
    CACHE_ERROR_KEY,
    MEMORY_KEY,
    VERSION_KEY,
    ORDER_KEY,
    CHECKBOX_KEY,
    CHECKBOX_DISABLED_KEY,
    TR_CACHE_KEY,
    TR_LEVEL_KEY,
    TH_VISIBLE
} from './constants';

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
export const getVersion = () => {
    return store.version;
};

/**
 * 存储当前GM所在的域, 当前
 * @param gridManagerName
 * @param scope
 */
export const setScope = (gridManagerName, scope) => {
    store.scope[gridManagerName] = scope;
};

/**
 * 获取当前行使用的数据
 * @param gridManagerName
 * @param target: 将要获取数据所对应的tr[Element or NodeList]
 * @param useGmProp: 是否使用gm自定义的属性
 * @returns {*}
 */
export const getRowData = (gridManagerName, target, useGmProp) => {
    const columnMap = getSettings(gridManagerName).columnMap;
    const tableData = getTableData(gridManagerName);
    const getTrData = tr => {
        const rowData = tableData[tr.getAttribute(TR_CACHE_KEY)] || {};
        return useGmProp ? rowData : getCloneRowData(columnMap, rowData);
    };

    // target type = Element 元素时, 返回单条数据对象;
    if (isElement(target)) {
        return getTrData(target);
    }

    // target type =  NodeList 类型时, 返回数组
    if (isNodeList(target)) {
        let rodData = [];
        jEach(target, (i, tr) => {
            rodData.push(getTrData(tr));
        });
        return rodData;
    }

    // 不为Element 和 NodeList时, 返回空对象
    return {};
};

/**
 * 更新行数据
 * @param gridManagerName
 * @param key: 列数据的主键
 * @param rowDataList: 需要更新的数据列表
 * @returns tableData: 更新后的表格数据
 */
export const updateRowData = (gridManagerName, key, rowDataList) => {
    const tableData = getTableData(gridManagerName);
    const settings = getSettings(gridManagerName);
    const supportTreeData = settings.supportTreeData;
    const treeKey = settings.treeConfig.treeKey;

    // 当前正在展示的被更新项
    const updateCacheList = [];
    const updateData = (list, newItem) => {
        list.some(item => {
            if (item[key] === newItem[key]) {
                jExtend(item, newItem);
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

    setTableData(gridManagerName, tableData);
    return {
        tableData,
        updateCacheList
    };
};

/**
 * 获取表格数据
 * @param gridManagerName
 */
export const getTableData = gridManagerName => {
    return cloneObject(store.responseData[gridManagerName] || []);
};

/**
 * 存储表格数据
 * @param gridManagerName
 * @param data
 */
export const setTableData = (gridManagerName, data) => {
    store.responseData[gridManagerName] = data;
};

/**
 * 重置 table data 格式
 * @param gridManagerName
 * @param data
 * @returns {*}
 */
export const resetTableData = (gridManagerName, data) => {

    const {
        columnMap,
        rowRenderHandler,
        pageData,
        supportAutoOrder,
        supportCheckbox,
        pageSizeKey,
        currentPageKey,
        supportTreeData,
        treeConfig
    } = getSettings(gridManagerName);

    // 为每一行数据增加唯一标识
    const addCacheKey = (row, level, index, pIndex) => {
        let cacheKey = index.toString();
        if (!isUndefined(pIndex)) {
            cacheKey = `${pIndex}-${index}`;
        }

        if (supportTreeData) {
            const children = row[treeConfig.treeKey];
            const hasChildren = children && children.length;

            // 递归处理层极结构
            if (hasChildren) {
                children.forEach((item, index) => {
                    addCacheKey(item, level + 1, index, cacheKey);
                });
            }

        }

        // 为每一行数据增加唯一标识
        row[TR_CACHE_KEY] = cacheKey;

        // 为每一行数据增加层级
        row[TR_LEVEL_KEY] = level;
    };

    const newData =  data.map((row, index) => {
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
            row[CHECKBOX_KEY] = getCheckedData(gridManagerName).some(item => {
                return equal(getCloneRowData(columnMap, item), getCloneRowData(columnMap, row));
            });
            row[CHECKBOX_DISABLED_KEY] = false;
        }

        // add cache key
        addCacheKey(row, 0, index);

        // 单行数据渲染时执行程序
        return rowRenderHandler(row, index);
    });

    // 存储表格数据
    setTableData(gridManagerName, newData);
    setCheckedData(gridManagerName, newData);
    return newData;
};

/**
 * 获取选中的数据
 * @param gridManagerName
 * @returns {*|Array}
 */
export const getCheckedData = gridManagerName => {
    const checkedList = store.checkedData[gridManagerName] || [];

    // 返回clone后的数组，以防止在外部操作导致数据错误。
    return checkedList.map(item => jExtend(true, {}, item));
};

/**
 * 设置选中的数据: 覆盖操作，会将原有的选中值清除
 * @param gridManagerName
 * @param dataList: 数据列表， isClear===true时该项只能为选中的数据
 * @param isClear: 是否清空原有的选中项 (该参数不公开)
 */
export const setCheckedData = (gridManagerName, dataList, isClear) => {
    const { columnMap } = getSettings(gridManagerName);
    // 覆盖操作，清空原有的选中数据。 并且 dataList 将会按选中状态进行处理
    if (isClear) {
        store.checkedData[gridManagerName] = dataList.map(item => getCloneRowData(columnMap, item));
        return;
    }

    // 合并操作，不清空原有的选中数据
    if (!store.checkedData[gridManagerName]) {
        store.checkedData[gridManagerName] = [];
    }
    const tableCheckedList = store.checkedData[gridManagerName];

    dataList.forEach(item => {
        let cloneObj = getCloneRowData(columnMap, item);
        let checked = item[CHECKBOX_KEY];
        let index = getObjectIndexToArray(tableCheckedList, cloneObj);

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
 * @param gridManagerName
 * @param columnMap
 * @param key
 * @param rowDataList
 */
export const updateCheckedData = (gridManagerName, columnMap, key, rowDataList) => {
    if (!store.checkedData[gridManagerName]) {
        return;
    }
    store.checkedData[gridManagerName] = store.checkedData[gridManagerName].map(item => {
        rowDataList.forEach(newItem => {
            if (item[key] === newItem[key]) {
                jExtend(item, getCloneRowData(columnMap, newItem));
            }
        });
        return item;
    });
};

/**
 * 获取表格的用户记忆标识码
 * @param gridManagerName
 * @returns {*}
 */
export const getMemoryKey = gridManagerName => {
    return window.location.pathname + window.location.hash + '-' + gridManagerName;
};

/**
 * 获取用户记忆
 * @param gridManagerName
 * @returns {*} 成功则返回本地存储数据,失败则返回空对象
 */
export const getUserMemory = gridManagerName => {
    const memoryKey = getMemoryKey(gridManagerName);

    let memory = window.localStorage.getItem(MEMORY_KEY);
    // 如无数据，增加缓存错误标识
    if (!memory || memory === '{}') {
        getTable(gridManagerName).attr(CACHE_ERROR_KEY, 'error');
        return {};
    }
    memory = JSON.parse(memory);
    return JSON.parse(memory[memoryKey] || '{}');
};

/**
 * 存储用户记忆
 * @param settings
 * @returns {boolean}
 */
export const saveUserMemory = settings => {
    const { disableCache, gridManagerName, columnMap, supportAjaxPage, pageData, pageSizeKey } = settings;
    // 当前为禁用缓存模式，直接跳出
    if (disableCache) {
        return;
    }

    let _cache = {};
    const cloneMap = jExtend(true, {}, columnMap);
    const useTemplate = ['template', 'text'];

    // 清除指定类型的字段
    jEach(cloneMap, (undefind, col) => {
        jEach(col, (key, item) => {
            // 清除: undefined
            if (isUndefined(col[key])) {
                delete col[key];
            }

            // 未使用模板的字段直接跳出
            if (useTemplate.indexOf(key) === -1) {
                return;
            }

            // delete template of function type
            if (isFunction(item)) {
                delete col[key];
            }

            // delete template of object type
            if (isObject(item)) {
                delete col[key];
            }
        });
    });

    _cache.column = cloneMap;

    // 存储分页
    if (supportAjaxPage) {
        const _pageCache = {};
        _pageCache[pageSizeKey] = pageData[pageSizeKey];
        _cache.page = _pageCache;
    }

    const cacheString = JSON.stringify(_cache);
    let memory = window.localStorage.getItem(MEMORY_KEY);
    if (!memory) {
        memory = {};
    } else {
        memory = JSON.parse(memory);
    }
    memory[getMemoryKey(gridManagerName)] = cacheString;
    window.localStorage.setItem(MEMORY_KEY, JSON.stringify(memory));
};

/**
 * 删除用户记忆
 * @param gridManagerName
 * @returns {boolean}
 */
export const delUserMemory = gridManagerName => {
    // 如果未指定删除的table, 则全部清除
    if (!gridManagerName) {
        window.localStorage.removeItem(MEMORY_KEY);
        outInfo('delete user memory of all');
        return true;
    }

    let memory = window.localStorage.getItem(MEMORY_KEY);
    if (!memory) {
        return false;
    }
    memory = JSON.parse(memory);

    // 指定删除的table, 则定点清除
    const _key = getMemoryKey(gridManagerName);
    delete memory[_key];

    // 清除后, 重新存储
    window.localStorage.setItem(MEMORY_KEY, JSON.stringify(memory));
    outInfo(`delete user memory of ${gridManagerName}`);
    return true;
};

/**
 * 更新模板，将非函数类型的模板转换为函数类型
 * @param arg
 * @returns {*}
 */
export const updateTemplate = arg => {
    const { columnData, emptyTemplate } = arg;

    // 强制转换模板为函数: emptyTemplate
    if (emptyTemplate && !isFunction(emptyTemplate)) {
        arg.emptyTemplate = () => emptyTemplate;
    }
    columnData.forEach(col => {
        // 强制转换模板为函数: text
        const text = col.text;
        if (text && !isFunction(text)) {
            col.text = () => text;
        }

        // 强制转换模板为函数: template
        const template = col.template;
        if (template && !isFunction(template)) {
            col.template = () => template;
        }
    });
    return arg;
};

/**
 * 初始化设置相关: 合并, 存储
 * @param arg
 * @param checkboxColumnFn
 * @param orderColumnFn
 */
export const initSettings = (arg, checkboxColumnFn, orderColumnFn) => {
    // 更新模板，将非函数类型的模板转换为函数类型
    arg = updateTemplate(arg);

    // 合并参数
    const settings = new Settings();
    settings.textConfig = new TextSettings();
    jExtend(true, settings, arg);

    // 存储初始配置项
    setSettings(settings);

    const { gridManagerName, columnData, supportAutoOrder, supportCheckbox, checkboxConfig } = settings;
    // 自动增加: 序号列
    if (supportAutoOrder) {
        columnData.unshift(orderColumnFn(settings));
    }

    // 自动增加: 选择列
    if (supportCheckbox) {
        columnData.unshift(checkboxColumnFn(checkboxConfig));
    }

    // 为 columnData 提供锚 => columnMap
    // columnData 在此之后, 将不再被使用到
    // columnData 与 columnMap 已经过特殊处理, 不会彼此影响
    const columnMap = {};

    let isError = false;
    columnData.forEach((col, index) => {
        const colKey = col.key;
        // key字段不允许为空
        if (!colKey) {
            outError(`columnData[${index}].key undefined`);
            isError = true;
            return;
        }

        // 存在disableCustomize时，必须设置width
        if (col.disableCustomize && !col.width) {
            outError(`column ${colKey}: when disableCustomize exists, width must be set`);
            isError = true;
            return;
        }
        columnMap[colKey] = col;

        // 如果未设定, 设置默认值为true
        columnMap[colKey].isShow = col.isShow || isUndefined(col.isShow);

        // 为列Map 增加索引
        columnMap[colKey].index = index;

        // 存储由用户配置的列宽度值, 该值不随着之后的操作变更
        columnMap[colKey].__width = col.width;

        // 存储由用户配置的列显示状态, 该值不随着之后的操作变更
        columnMap[colKey].__isShow = col.isShow;

    });

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
        const userMemory = getUserMemory(gridManagerName);
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
        isUsable && jEach(columnMap, (key, col) => {
            if (!columnCache[key]
                // 宽度
                || columnCache[key].__width !== col.width

                // 显示状态
                || columnCache[key].__isShow !== col.isShow

                // 文本排列方向
                || columnCache[key].align !== col.align

                // 数据排序
                || columnCache[key].sorting !== col.sorting

                // 字段描述
                || JSON.stringify(columnCache[key].remind) !== JSON.stringify(col.remind)

                // 禁止使用个性配置功能
                || columnCache[key].disableCustomize !== col.disableCustomize

                // 相同数据列合并功能
                || columnCache[key].merge !== col.merge

                || JSON.stringify(columnCache[key].filter) !== JSON.stringify(col.filter)) {
                isUsable = false;
                return false;
            }
        });

        // 将用户记忆并入 columnMap 内
        if (isUsable) {
            jExtend(true, columnMap, columnCache);
        } else {
            // 清除用户记忆
            delUserMemory(gridManagerName);
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
 * @param gridManagerName
 * @returns {*}
 */
export const getSettings = gridManagerName => {
    // 返回的是 clone 对象 而非对象本身
    return jExtend(true, {}, store.settings[gridManagerName] || {});
};
/**
 * 设置配置项
 * @param settings
 */
export const setSettings = settings => {
    store.settings[settings.gridManagerName] = jExtend(true, {}, settings);
};

/**
 * 更新Cache, 包含[更新表格列Map, 重置settings, 存储用户记忆]
 * @param gridManagerName
 */
export const updateCache = gridManagerName => {
    const settings = getSettings(gridManagerName);
    const columnMap = settings.columnMap;

    // 更新 columnMap , 适用操作[宽度调整, 位置调整, 可视状态调整]
    jEach(columnMap, (key, col) => {
        // 禁用定制列: 不处理
        if (col.disableCustomize) {
            return;
        }

        let th = getTh(gridManagerName, col.key);
        // 宽度
        col.width = th.width() + 'px';

        // 位置索引
        col.index = th.index();

        // 可视状态
        col.isShow = th.attr(TH_VISIBLE) === 'visible';
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
    const cacheVersion = window.localStorage.getItem(VERSION_KEY);
    // 当前为第一次渲染, 存储版本号
    if (!cacheVersion) {
        window.localStorage.setItem(VERSION_KEY, store.version);
    }
    // 版本变更, 清除所有的用户记忆
    if (cacheVersion && cacheVersion !== store.version) {
        delUserMemory();
        window.localStorage.setItem(VERSION_KEY, store.version);
    }
};

/**
 * 清空缓存
 * @param gridManagerName
 */
export const clearCache = gridManagerName => {
    delete store.scope[gridManagerName];
    delete store.responseData[gridManagerName];
    delete store.checkedData[gridManagerName];
    delete store.settings[gridManagerName];

    // 清除setInterval
    clearInterval(SIV_waitTableAvailable[gridManagerName]);
    clearInterval(SIV_waitContainerAvailable[gridManagerName]);
    delete SIV_waitTableAvailable[gridManagerName];
    delete SIV_waitContainerAvailable[gridManagerName];
};
