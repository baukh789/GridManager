/*
* @cache: 数据存储
* 缓存类型分为:
* 1.Store: 渲染表格时所使用的json数据 [存储在GM实例]
* 2.UserMemory: 用户记忆 [存储在localStorage]
* */
import { getCloneRowData, getTable, getTh } from '@common/base';
import { isUndefined, isFunction, isObject, isString, isNumber, isValidArray, isElement, each, isNodeList, extend, getBrowser } from '@jTool/utils';
import { outInfo, outError, equal, getObjectIndexToArray, cloneObject } from '@common/utils';
import { DISABLE_CUSTOMIZE, PX } from '@common/constants';
import { Settings } from '@common/Settings';
import TextConfig from '@module/i18n/config';
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
    CELL_HIDDEN
} from './constants';

const getStorage = key => {
    return localStorage.getItem(key);
};

const setStorage = (key, memory) => {
    localStorage.setItem(key, memory);
};

const removeStorage = key => {
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
export const getVersion = () => {
    return store.version;
};

/**
 * 获取当前行使用的数据
 * @param _
 * @param target: 将要获取数据所对应的tr[Element or NodeList]
 * @param useSourceData: 使用原数据 或 克隆数据
 * @returns {*}
 */
export const getRowData = (_, target, useSourceData) => {
    const settings = getSettings(_);
    const tableData = getTableData(_);
    const getTrData = tr => {
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
        let rodData = [];
        each(target, tr => {
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
export const updateRowData = (_, key, rowDataList) => {
    const tableData = getTableData(_);
    const settings = getSettings(_);
    const supportTreeData = settings.supportTreeData;
    const treeKey = settings.treeConfig.treeKey;

    // 当前正在展示的被更新项getRowData
    const updateCacheList = [];
    const updateData = (list, newItem) => {
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
export const getTableData = _ => {
    return cloneObject(store.responseData[_] || []);
};

/**
 * 存储表格数据
 * @param _
 * @param data
 */
export const setTableData = (_, data) => {
    store.responseData[_] = data;
};

/**
 * 重置 table data 格式化
 * @param _
 * @param data
 * @returns {*}
 */
export const resetTableData = (_, data) => {

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
            row[CHECKBOX_KEY] = getCheckedData(_).some(item => {
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
export const getCheckedData = _ => {
    const checkedList = store.checkedData[_] || [];

    // 返回clone后的数组，以防止在外部操作导致数据错误。
    return checkedList.map(item => extend(true, {}, item));
};

/**
 * 设置选中的数据: 覆盖操作，会将原有的选中值清除
 * @param _
 * @param dataList: 数据列表， isClear===true时该项只能为选中的数据
 * @param isClear: 是否清空原有的选中项 (该参数不公开)
 */
export const setCheckedData = (_, dataList, isClear) => {
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
export const updateCheckedData = (_, columnMap, key, rowDataList) => {
    if (!store.checkedData[_]) {
        return;
    }
    store.checkedData[_] = store.checkedData[_].map(item => {
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
export const getMemoryKey = _ => {
    return location.pathname + location.hash + '-' + _;
};

/**
 * 获取用户记忆
 * @param _
 * @returns {*} 成功则返回本地存储数据,失败则返回空对象
 */
export const getUserMemory = _ => {
    const memoryKey = getMemoryKey(_);

    let memory = getStorage(MEMORY_KEY);
    // 如无数据，增加缓存错误标识
    if (!memory || memory === '{}') {
        getTable(_).attr(CACHE_ERROR_KEY, 'error');
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
    const { disableCache, _, columnMap, supportAjaxPage, pageData, pageSizeKey } = settings;
    // 当前为禁用缓存模式，直接跳出
    if (disableCache) {
        return;
    }

    let _cache = {};
    const cloneMap = extend(true, {}, columnMap);
    const useTemplate = ['template', 'text'];

    // 清除指定类型的字段
    each(cloneMap, (undefind, col) => {
        each(col, (key, item) => {
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
    let memory = getStorage(MEMORY_KEY);
    if (!memory) {
        memory = {};
    } else {
        memory = JSON.parse(memory);
    }
    memory[getMemoryKey(_)] = cacheString;
    setStorage(MEMORY_KEY, JSON.stringify(memory));
};

/**
 * 删除用户记忆
 * @param _
 * @returns {boolean}
 */
export const delUserMemory = _ => {
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
    const _key = getMemoryKey(_);
    delete memory[_key];

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
export const updateTemplate = arg => {
    const { columnData, emptyTemplate } = arg;

    // 强制转换模板为函数: emptyTemplate
    if (emptyTemplate && !isFunction(emptyTemplate)) {
        arg.emptyTemplate = () => emptyTemplate;
    }
    const resetTemplate = list => {
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
 * @param checkboxColumnFn
 * @param orderColumnFn
 */
export const initSettings = (arg, checkboxColumnFn, orderColumnFn, fullColumnFn) => {
    // 更新模板，将非函数类型的模板转换为函数类型
    arg = updateTemplate(arg);

    // 合并参数
    let settings = new Settings();
    settings.textConfig = new TextConfig();

    extend(true, settings, arg);

    // 将_配置简写方式, 方便内部使用
    settings._ = settings.gridManagerName;

    // 存储当前使用的浏览器
    settings.browser = getBrowser();

    // 存储初始配置项
    // setSettings(settings);

    const { _, columnData, supportAutoOrder, __isNested, __isFullColumn, fullColumn, supportCheckbox, checkboxConfig } = settings;

    const list = [];
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

    const resetData = (data, level, parentKey) => {
        data.forEach((col, index) => {
            col = extend(true, {}, col);
            const key = col.key;
            // key字段不允许为空
            if (!key) {
                outError(`columnData[${index}].key undefined`);
                isError = true;
                return;
            }

            // 宽度转换: 100 => 100px
            if (isNumber(col.width)) {
                col.width = `${col.width}px`;
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

            // 存储由用户配置的列宽度值, 该值不随着之后的操作变更
            columnMap[key].__width = col.width;

            // 存储由用户配置的列显示状态, 该值不随着之后的操作变更
            columnMap[key].__isShow = col.isShow;

            // 存在多层嵌套时，递归增加标识
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
        isUsable && each(columnMap, (key, col) => {
            if (!columnCache[key]
                // 宽度
                || columnCache[key].__width !== col.width

                // 显示状态
                || columnCache[key].__isShow !== col.isShow

                // 文本排列方向
                || columnCache[key].align !== col.align

                // 数据排序
                || columnCache[key].sorting !== col.sorting

                // 禁止使用个性配置功能
                || columnCache[key][DISABLE_CUSTOMIZE] !== col[DISABLE_CUSTOMIZE]

                // 禁止使用行移动
                || columnCache[key].disableMoveRow !== col.disableMoveRow

                // 相同数据列合并功能
                || columnCache[key].merge !== col.merge

                // 固定列
                || columnCache[key].fixed !== col.fixed

                // 字段描述
                || JSON.stringify(columnCache[key].remind) !== JSON.stringify(col.remind)

                // 过滤
                || JSON.stringify(columnCache[key].filter) !== JSON.stringify(col.filter)) {
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
export const getSettings = _ => {
    // 返回的是 clone 对象 而非对象本身
    return extend(true, {}, store.settings[_] || {});
};
/**
 * 设置配置项
 * @param settings
 */
export const setSettings = settings => {
    store.settings[settings._] = extend(true, {}, settings);
};

/**
 * 更新Cache, 包含[更新表格列Map, 重置settings, 存储用户记忆]
 * @param _
 */
export const updateCache = _ => {
    const settings = getSettings(_);
    const columnMap = settings.columnMap;

    // 更新 columnMap , 适用操作[宽度调整, 位置调整, 可视状态调整]
    each(columnMap, (key, col) => {
        // 禁用定制列: 不处理
        if (col[DISABLE_CUSTOMIZE]) {
            return;
        }

        let th = getTh(_, col.key);
        // 宽度
        col.width = th.width() + PX;

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
export const clearCache = _ => {
    delete store.responseData[_];
    delete store.checkedData[_];
    delete store.settings[_];

    // 清除setInterval
    clearInterval(SIV_waitTableAvailable[_]);
    clearInterval(SIV_waitContainerAvailable[_]);
    delete SIV_waitTableAvailable[_];
    delete SIV_waitContainerAvailable[_];
};
