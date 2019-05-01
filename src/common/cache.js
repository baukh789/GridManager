/*
* @cache: 数据存储
* 缓存类型分为:
* 1.Store: 渲染表格时所使用的json数据 [存储在GM实例]
* 2.UserMemory: 用户记忆 [存储在localStorage]
* */
import jTool from './jTool';
import base from './base';
import { Settings, TextSettings } from './Settings';
import store from './Store';
import { TR_CACHE_KEY, CACHE_ERROR_KEY, MEMORY_KEY, VERSION_KEY } from './constants';

class Cache {
    /**
     * 版本信息
     * @returns {*}
     */
    getVersion() {
        return store.version;
    }

    /**
     * 获取当前GM所在的域
     * @param gridManagerName
     * @returns {*}
     */
    getScope(gridManagerName) {
        return store.scope[gridManagerName];
    }

    /**
     * 存储当前GM所在的域, 当前
     * @param gridManagerName
     * @param scope
     */
    setScope(gridManagerName, scope) {
        store.scope[gridManagerName] = scope;
    }

    /**
     * 获取当前行使用的数据
     * @param gridManagerName
     * @param target 将要获取数据所对应的tr[Element or NodeList]
     * @returns {*}
     */
    getRowData(gridManagerName, target) {
        const tableData = this.getTableData(gridManagerName);
        // target type = Element 元素时, 返回单条数据对象;
        if (jTool.type(target) === 'element') {
            return tableData[target.getAttribute(TR_CACHE_KEY)];
        }

        // target type =  NodeList 类型时, 返回数组
        if (jTool.type(target) === 'nodeList') {
            let rodData = [];
            jTool.each(target, function (i, v) {
                rodData.push(tableData[v.getAttribute(TR_CACHE_KEY)]);
            });
            return rodData;
        }

        // 不为Element 和 NodeList时, 返回空对象
        return {};
    }

    /**
     * 更新列数据
     * @param gridManagerName
     * @param key: 列数据的主键
     * @param rowDataList: 需要更新的数据列表
     * @returns tableData: 更新后的表格数据
     */
    updateRowData(gridManagerName, key, rowDataList) {
        const tableData = this.getTableData(gridManagerName);
        tableData.forEach(item => {
            rowDataList.forEach(newItem => {
                if (newItem[key] === item[key]) {
                    jTool.extend(item, newItem);
                }
            });
        });
        // 存储表格数据
        this.setTableData(gridManagerName, tableData);
        return tableData;
    }

    /**
     * 获取表格数据
     * @param gridManagerName
     */
    getTableData(gridManagerName) {
        return store.responseData[gridManagerName] || [];
    }

    /**
     * 存储表格数据
     * @param gridManagerName
     * @param data
     */
    setTableData(gridManagerName, data) {
        store.responseData[gridManagerName] = data;
    }

    /**
     * 获取选中的数据
     * @param gridManagerName
     * @returns {*|Array}
     */
    getCheckedData(gridManagerName) {
        const checkedList = store.checkedData[gridManagerName] || [];

        // 返回clone后的数组，以防止在外部操作导致数据错误。
        return checkedList.map(item => jTool.extend(true, {}, item));
    }

    /**
     * 设置选中的数据: 覆盖操作，会将原有的选中值清除
     * @param gridManagerName
     * @param dataList: 数据列表， isClear===true时该项只能为选中的数据
     * @param isClear: 是否清空原有的选中项 (该参数不公开)
     */
    setCheckedData(gridManagerName, dataList, isClear) {
        const { columnMap } = this.getSettings(gridManagerName);
        // 覆盖操作，清空原有的选中数据。 并且 dataList 将会按选中状态进行处理
        if (isClear) {
            store.checkedData[gridManagerName] = dataList.map(item => base.getCloneRowData(columnMap, item));
            return;
        }

        // 合并操作，不清空原有的选中数据
        if (!store.checkedData[gridManagerName]) {
            store.checkedData[gridManagerName] = [];
        }
        const tableCheckedList = store.checkedData[gridManagerName];

        dataList.forEach(item => {
            let cloneObj = base.getCloneRowData(columnMap, item);
            let checked = item['gm_checkbox'];
            let index = base.getObjectIndexToArray(tableCheckedList, cloneObj);

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
    }

    /**
     * 更新选中的数据
     * @param gridManagerName
     * @param columnMap
     * @param key
     * @param rowDataList
     */
    updateCheckedData(gridManagerName, columnMap, key, rowDataList) {
        store.checkedData[gridManagerName] = store.checkedData[gridManagerName].map(item => {
            rowDataList.forEach(newItem => {
                if (item[key] === newItem[key]) {
                    jTool.extend(item, base.getCloneRowData(columnMap, newItem));
                }
            });
            return item;
        });
    }

    /**
     * 获取表格的用户记忆标识码
     * @param gridManagerName
     * @returns {*}
     */
    getMemoryKey(gridManagerName) {
        return window.location.pathname + window.location.hash + '-' + gridManagerName;
    }

    /**
     * 获取用户记忆
     * @param gridManagerName
     * @returns {*} 成功则返回本地存储数据,失败则返回空对象
     */
    getUserMemory(gridManagerName) {
        const memoryKey = this.getMemoryKey(gridManagerName);

        let GridManagerMemory = window.localStorage.getItem(MEMORY_KEY);
        // 如无数据，增加缓存错误标识
        if (!GridManagerMemory || GridManagerMemory === '{}') {
            base.getTable(gridManagerName).attr(CACHE_ERROR_KEY, 'error');
            return {};
        }
        GridManagerMemory = JSON.parse(GridManagerMemory);
        return JSON.parse(GridManagerMemory[memoryKey] || '{}');
    }

    /**
     * 存储用户记忆
     * @param settings
     * @returns {boolean}
     */
    saveUserMemory(settings) {
        const { disableCache, gridManagerName, columnMap, supportAjaxPage, pageData, pageSizeKey } = settings;
        // 当前为禁用缓存模式，直接跳出
        if (disableCache) {
            return;
        }

        let _cache = {};
        _cache.column = columnMap;

        // 存储分页
        if (supportAjaxPage) {
	        const _pageCache = {};
            _pageCache[pageSizeKey] = pageData[pageSizeKey];
            _cache.page = _pageCache;
        }

        // 注意: 这行代码会将columnMap中以下情况的字段清除:
        // 1.函数类型的模板
        // 2.值为undefined
        const cacheString = JSON.stringify(_cache);
        let GridManagerMemory = window.localStorage.getItem(MEMORY_KEY);
        if (!GridManagerMemory) {
            GridManagerMemory = {};
        } else {
            GridManagerMemory = JSON.parse(GridManagerMemory);
        }
        GridManagerMemory[this.getMemoryKey(gridManagerName)] = cacheString;
        window.localStorage.setItem(MEMORY_KEY, JSON.stringify(GridManagerMemory));
    }

    /**
     * 删除用户记忆
     * @param gridManagerName
     * @param cleanText
     * @returns {boolean}
     */
    delUserMemory(gridManagerName, cleanText) {
        // 如果未指定删除的table, 则全部清除
        if (!gridManagerName) {
            window.localStorage.removeItem(MEMORY_KEY);
            base.outLog(`用户记忆被全部清除: ${cleanText}`, 'warn');
            return true;
        }

        let GridManagerMemory = window.localStorage.getItem(MEMORY_KEY);
        if (!GridManagerMemory) {
            base.outLog(`${gridManagerName}: 当前无用户记忆`, 'warn');
            return false;
        }
        GridManagerMemory = JSON.parse(GridManagerMemory);

        // 指定删除的table, 则定点清除
        const _key = this.getMemoryKey(gridManagerName);
        delete GridManagerMemory[_key];

        // 清除后, 重新存储
        window.localStorage.setItem(MEMORY_KEY, JSON.stringify(GridManagerMemory));
        base.outLog(`${gridManagerName}用户记忆被清除: ${cleanText}`, 'warn');
        return true;
    }

    /**
     * 初始化设置相关: 合并, 存储
     * @param arg
     * @param checkbox
     * @param order
     */
    initSettings(arg, checkbox, order) {
        // 合并参数
        const settings = new Settings();
        settings.textConfig = new TextSettings();
        jTool.extend(true, settings, arg);

        // 存储初始配置项
        this.setSettings(settings);

        // 为 columnData 增加 序号列
        if (settings.supportAutoOrder) {
            settings.columnData.unshift(order.getColumn(settings));
        }

        // 为 columnData 增加 选择列
        if (settings.supportCheckbox) {
            settings.columnData.unshift(checkbox.getColumn(settings));
        }

        // 为 columnData 提供锚 => columnMap
        // columnData 在此之后, 将不再被使用到
        // columnData 与 columnMap 已经过特殊处理, 不会彼此影响
        const columnMap = {};
        // const columnLeftMap = {};
        // const columnRightMap = {};

        let isError = false;
        settings.columnData.forEach((col, index) => {
            if (!col.key) {
                base.outLog(`配置项columnData内，索引为${index}的key字段未定义`, 'error');
                isError = true;
                return;
            }
            columnMap[col.key] = col;

            // 如果未设定, 设置默认值为true
            columnMap[col.key].isShow = col.isShow || typeof (col.isShow) === 'undefined';

            // 为列Map 增加索引
            columnMap[col.key].index = index;

            // 存储由用户配置的列宽度值, 该值不随着之后的操作变更
            columnMap[col.key].__width = col.width;

            // 存储由用户配置的列显示状态, 该值不随着之后的操作变更
            columnMap[col.key].__isShow = col.isShow;

            // TODO fixed 暂时先不做
            // if (col.fixed === 'left') {
            //     columnLeftMap[col.key] = Object.assign(columnMap[col.key], {disableCustomize: true});
            // }
            // if (col.fixed === 'right') {
            //     columnRightMap[col.key] = Object.assign(columnMap[col.key], {disableCustomize: true});
            // }
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

            const { gridManagerName, columnMap } = settings;
            const userMemory = this.getUserMemory(gridManagerName);
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
            isUsable && jTool.each(columnMap, (key, col) => {
                if (!columnCache[key]
                    // 显示文本
                    || columnCache[key].text !== col.text

                    // 宽度
                    || columnCache[key].__width !== col.width

                    // 显示状态
                    || columnCache[key].__isShow !== col.isShow

                    // 文本排列方向
                    || columnCache[key].align !== col.align

                    // 数据排序
                    || columnCache[key].sorting !== col.sorting

                    // 字段描述
                    || columnCache[key].remind !== col.remind

                    // 禁止使用个性配置功能
                    || columnCache[key].disableCustomize !== col.disableCustomize

                    || JSON.stringify(columnCache[key].filter) !== JSON.stringify(col.filter)

                    // 字段模版: 仅对非函数类型的模板进行验证
                    || (columnCache[key].template && columnCache[key].template !== col.template)) {
                    isUsable = false;
                    return false;
                }
            });

            // 将用户记忆并入 columnMap 内
            if (isUsable) {
                jTool.extend(true, columnMap, columnCache);
            } else {
                // 清除用户记忆
                this.delUserMemory(gridManagerName, '存储记忆项与配置项[columnData]不匹配');
            }
        };

        // 合并用户记忆
        mergeUserMemory();

        // 更新存储配置项
        this.setSettings(settings);
        return settings;
    }

    /**
     * 获取配置项
     * @param gridManagerName
     * @returns {*}
     */
    getSettings(gridManagerName) {
        // 当前传入的为 $table
        if (gridManagerName.jTool) {
            alert('getSettings: 不应该存在通过jtool获取的情况');
        }

        // 返回的是 clone 对象 而非对象本身
        return jTool.extend(true, {}, store.settings[gridManagerName] || {});
    }

    /**
     * 重置配置项
     * @param settings
     */
    setSettings(settings) {
        store.settings[settings.gridManagerName] = jTool.extend(true, {}, settings);
    }

    /**
     * 更新Cache, 包含[更新表格列Map, 重置settings, 存储用户记忆]
     * @param gridManagerName
     */
    update(gridManagerName) {
        const settings = this.getSettings(gridManagerName);
        const columnMap = settings.columnMap;

        // 更新 columnMap , 适用操作[宽度调整, 位置调整, 可视状态调整]
        jTool.each(columnMap, (key, col) => {
            // 禁用定制列: 不处理
            if (col.disableCustomize) {
                return;
            }

            let th = base.getTh(gridManagerName, col.key);
            // 宽度
            col.width = th.width() + 'px';

            // 位置索引
            col.index = th.index();

            // 可视状态
            col.isShow = th.attr('th-visible') === 'visible';
        });

        // 重置settings
        this.setSettings(settings);

        // 存储用户记忆
        this.saveUserMemory(settings);

        return settings;
    }

    /**
     * 验证版本号,如果版本号变更清除用户记忆
     */
    verifyVersion() {
        const cacheVersion = window.localStorage.getItem(VERSION_KEY);
        // 当前为第一次渲染, 存储版本号
        if (!cacheVersion) {
            window.localStorage.setItem(VERSION_KEY, store.version);
        }
        // 版本变更, 清除所有的用户记忆
        if (cacheVersion && cacheVersion !== store.version) {
            this.delUserMemory(null, '版本已升级,原全部缓存被自动清除');
            window.localStorage.setItem(VERSION_KEY, store.version);
        }
    }

    /**
     * 销毁实例store
     * @param gridManagerName
     */
    clear(gridManagerName) {
        delete store.scope[gridManagerName];
        delete store.responseData[gridManagerName];
        delete store.checkedData[gridManagerName];
        delete store.settings[gridManagerName];
    }
}
export default new Cache();
