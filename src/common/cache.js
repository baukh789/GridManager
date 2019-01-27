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
     * @param $table
     * @returns {*}
     */
    getScope($table) {
        return store.scope[base.getKey($table)];
    }

    /**
     * 存储当前GM所在的域, 当前
     * @param $table
     * @param scope
     */
    setScope($table, scope) {
        store.scope[base.getKey($table)] = scope;
    }

    /**
     * 获取当前行使用的数据
     * @param $table 当前操作的grid,由插件自动传入
     * @param target 将要获取数据所对应的tr[Element or NodeList]
     * @returns {*}
     */
    getRowData($table, target) {
        const gmName = base.getKey($table);
        if (!store.responseData[gmName]) {
            return;
        }
        // target type = Element 元素时, 返回单条数据对象;
        if (jTool.type(target) === 'element') {
            return store.responseData[gmName][target.getAttribute('cache-key')];
        } else if (jTool.type(target) === 'nodeList') {
            // target type =  NodeList 类型时, 返回数组
            let rodData = [];
            jTool.each(target, function (i, v) {
                rodData.push(store.responseData[gmName][v.getAttribute('cache-key')]);
            });
            return rodData;
        } else {
            // 不为Element NodeList时, 返回空对象
            return {};
        }
    }

    /**
     * 更新列数据
     * @param $table
     * @param key: 列数据的主键
     * @param rowDataList: 需要更新的数据列表
     * @returns tableData: 更新后的表格数据
     */
    updateRowData($table, key, rowDataList) {
        const tableData = this.getTableData($table);
        const { supportCheckbox } = this.getSettings($table);
        tableData.forEach(item => {
            rowDataList.forEach(newItem => {
                if (newItem[key] === item[key]) {
                    Object.assign(item, newItem);
                }
            });
        });
        // 存储表格数据
        this.setTableData($table, tableData);

        // 更新选中数据
        supportCheckbox && this.setCheckedData($table, tableData);
        return tableData;
    }

    /**
     * 获取表格数据
     * @param $table
     */
    getTableData($table) {
        return store.responseData[base.getKey($table)] || [];
    }

    /**
     * 存储表格数据
     * @param $table
     * @param data
     */
    setTableData($table, data) {
        store.responseData[base.getKey($table)] = data;
    }

    /**
     * 获取选中的数据
     * @param $table
     * @returns {*|Array}
     */
    getCheckedData($table) {
        const checkedList = store.checkedData[base.getKey($table)] || [];

        // 返回clone后的数组，以防止在外部操作导致数据错误。
        return checkedList.map(item => jTool.extend(true, {}, item));
    }

    /**
     * 设置选中的数据: 覆盖操作，会将原有的选中值清除
     * @param $table
     * @param dataList: 数据列表， isClear===true时该项只能为选中的数据
     * @param isClear: 是否清空原有的选中项 (该参数不公开)
     */
    setCheckedData($table, dataList, isClear) {
        const gmName = base.getKey($table);
        const { columnMap } = this.getSettings($table);

        // 覆盖操作，清空原有的选中数据
        if (isClear) {
            store.checkedData[gmName] = dataList.map(item => base.getDataForColumnMap(columnMap, item));
            return;
        }

        // 合并操作，不清空原有的选中数据
        if (!store.checkedData[gmName]) {
            store.checkedData[gmName] = [];
        }
        let tableCheckedList = store.checkedData[gmName];

        dataList.forEach(item => {
            let cloneObj = base.getDataForColumnMap(columnMap, item);
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
        store.checkedData[gmName] = tableCheckedList;
    }

    /**
     * 删除用户记忆
     * @param $table
     * @param cleanText
     * @returns {boolean}
     */
    delUserMemory($table, cleanText) {
        // 如果未指定删除的table, 则全部清除
        if (!$table || $table.length === 0) {
            window.localStorage.removeItem('GridManagerMemory');
            base.outLog(`用户记忆被全部清除: ${cleanText}`, 'warn');
            return true;
        }

        // 指定table, 定点清除
        const settings = this.getSettings($table);
        base.outLog(`${settings.gridManagerName}用户记忆被清除: ${cleanText}`, 'warn');

        let GridManagerMemory = window.localStorage.getItem('GridManagerMemory');
        if (!GridManagerMemory) {
            return false;
        }
        GridManagerMemory = JSON.parse(GridManagerMemory);

        // 指定删除的table, 则定点清除
        const _key = this.getMemoryKey(settings);
        delete GridManagerMemory[_key];

        // 清除后, 重新存储
        window.localStorage.setItem('GridManagerMemory', JSON.stringify(GridManagerMemory));
        return true;
    }

    /**
     * 获取表格的用户记忆标识码
     * @param settings
     * @returns {*}
     */
    getMemoryKey(settings) {
        return window.location.pathname + window.location.hash + '-' + settings.gridManagerName;
    }

    /**
     * 获取用户记忆
     * @param $table
     * @returns {*} 成功则返回本地存储数据,失败则返回空对象
     */
    getUserMemory($table) {
        if (!$table || $table.length === 0) {
            return {};
        }
        const _key = this.getMemoryKey(this.getSettings($table));
        if (!_key) {
            return {};
        }
        let GridManagerMemory = window.localStorage.getItem('GridManagerMemory');
        // 如无数据，增加属性标识：grid-manager-cache-error
        if (!GridManagerMemory || GridManagerMemory === '{}') {
            $table.attr('grid-manager-cache-error', 'error');
            return {};
        }
        GridManagerMemory = JSON.parse(GridManagerMemory);
        return JSON.parse(GridManagerMemory[_key] || '{}');
    }

    /**
     * 存储用户记忆
     * @param $table
     * @param settings
     * @returns {boolean}
     */
    saveUserMemory($table, settings) {
        // 当前为禁用缓存模式，直接跳出
        if (settings.disableCache) {
            return false;
        }

        // jTool(`thead[${base.tableHeadKey}] th`, $table)
        const thList = base.getAllTh($table);
        if (!thList || thList.length === 0) {
            base.outLog('saveUserMemory:无效的thList,请检查是否正确配置table,thead,th', 'error');
            return false;
        }

        let _cache = {};
        _cache.column = settings.columnMap;

        // 存储分页
        if (settings.supportAjaxPage) {
	        const _pageCache = {};
            _pageCache[settings.pageSizeKey] = settings.pageData[settings.pageSizeKey];
            _cache.page = _pageCache;
        }

        // 注意: 这行代码会将columnMap中以下情况的字段清除:
        // 1.函数类型的模板
        // 2.值为undefined
        const cacheString = JSON.stringify(_cache);
        let GridManagerMemory = window.localStorage.getItem('GridManagerMemory');
        if (!GridManagerMemory) {
            GridManagerMemory = {};
        } else {
            GridManagerMemory = JSON.parse(GridManagerMemory);
        }
        GridManagerMemory[this.getMemoryKey(settings)] = cacheString;
        window.localStorage.setItem('GridManagerMemory', JSON.stringify(GridManagerMemory));
        return cacheString;
    }

    /**
     * 初始化设置相关: 合并, 存储
     * @param $table
     * @param arg
     * @param checkbox
     * @param order
     */
    initSettings($table, arg, checkbox, order) {
        // TODO 在弱化 $table的使用范围操作时，可以使用getSetting方法进行替换。详情查看2.7.x.md
        if (store.settings[base.getKey($table)]) {
            base.outLog('gridManagerName在之前已被使用。为防止异常发生, 请更换gridManagerName为不重复的值', 'warn');
        }

        // 合并参数
        const _settings = new Settings();
        _settings.textConfig = new TextSettings();
        jTool.extend(true, _settings, arg);

        // 存储初始配置项
        this.setSettings(_settings);

        // 为 columnData 增加 序号列
        if (_settings.supportAutoOrder) {
            _settings.columnData.unshift(order.getColumn(_settings));
        }

        // 为 columnData 增加 选择列
        if (_settings.supportCheckbox) {
            _settings.columnData.unshift(checkbox.getColumn(_settings));
        }

        // 为 columnData 提供锚 => columnMap
        // columnData 在此之后, 将不再被使用到
        // columnData 与 columnMap 已经过特殊处理, 不会彼此影响
        _settings.columnMap = {};
        _settings.columnData.forEach((col, index) => {
            _settings.columnMap[col.key] = col;

            // 如果未设定, 设置默认值为true
            _settings.columnMap[col.key].isShow = col.isShow || typeof (col.isShow) === 'undefined';

            // 为列Map 增加索引
            _settings.columnMap[col.key].index = index;

            // 存储由用户配置的列宽度值, 该值不随着之后的操作变更
            _settings.columnMap[col.key].__width = col.width;

            // 存储由用户配置的列显示状态, 该值不随着之后的操作变更
            _settings.columnMap[col.key].__isShow = col.isShow;
        });

	    // 合并用户记忆至 settings, 每页显示条数记忆不在此处
        const mergeUserMemory = () => {
            // 当前为禁用状态
            if (_settings.disableCache) {
                return;
            }

            const userMemory = this.getUserMemory($table);
            const columnCache = userMemory.column || {};
            const columnCacheKeys = Object.keys(columnCache);
            const columnMapKeys = Object.keys(_settings.columnMap);

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
            isUsable && jTool.each(_settings.columnMap, (key, col) => {
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

		            // 字段模版
		            || (columnCache[key].template && columnCache[key].template !== col.template)) {
		            isUsable = false;
		            return false;
	            }
            });

            // 将用户记忆并入 columnMap 内
            if (isUsable) {
                jTool.extend(true, _settings.columnMap, columnCache);
            } else {
                // 清除用户记忆
                this.delUserMemory($table, '存储记忆项与配置项[columnData]不匹配');
            }
        };

        // 合并用户记忆
        mergeUserMemory();

        // 更新存储配置项
        this.setSettings(_settings);
        return _settings;
    }

    /**
     * 获取配置项
     * @param $table
     * @returns {*}
     */
    getSettings($table) {
        if (typeof $table === 'string') {
            // 返回的是 clone 对象 而非对象本身
            return jTool.extend(true, {}, store.settings[$table] || {});
        }

        // TODO @baukh20190122: 以下通过$table的方式正在用gridManagerName的方式替换，替换完成之后就可以清除了
        if (!$table || $table.length === 0) {
            return {};
        }
        // 返回的是 clone 对象 而非对象本身
        return jTool.extend(true, {}, store.settings[base.getKey($table)] || {});
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
     * @param $table
     * @param settings
     */
    update($table, settings) {
        if (!settings) {
            settings = this.getSettings($table);
        }
        // 更新表格列Map
        settings.columnMap = this.reworkColumnMap($table, settings.columnMap);

        // 重置settings
        this.setSettings(settings);

        // 存储用户记忆
        this.saveUserMemory($table, settings);
    }

    /**
     * 将 columnMap 返厂回修, 并返回最新的值, 适用操作[宽度调整, 位置调整, 可视状态调整]
     * @param $table
     * @param columnMap
     * @returns {*}
     */
    reworkColumnMap($table, columnMap) {
        // columnMap 为无效数据, 跳出
        if (!columnMap || jTool.isEmptyObject(columnMap)) {
            base.outLog('columnMap 为无效数据', 'error');
            return;
        }
        let th = null;
        jTool.each(columnMap, (key, col) => {
            th = base.getTh($table, col.key);
            // 宽度
            col.width = th.width() + 'px';

            // 位置索引
            col.index = th.index();

            // 可视状态
            col.isShow = th.attr('th-visible') === 'visible';
        });
        return columnMap;
    }

    /**
     * 验证版本号,如果版本号变更清除用户记忆
     * @param $table
     * @param version 版本号
     */
    cleanTableCacheForVersion() {
        const cacheVersion = window.localStorage.getItem('GridManagerVersion');
        // 当前为第一次渲染
        if (!cacheVersion) {
            window.localStorage.setItem('GridManagerVersion', store.version);
        }
        // 版本变更, 清除所有的用户记忆
        if (cacheVersion && cacheVersion !== store.version) {
            this.delUserMemory(null, '版本已升级,原全部缓存被自动清除');
            window.localStorage.setItem('GridManagerVersion', store.version);
        }
    }

    /**
     * 销毁实例store
     * @param gridManagerName
     */
    cleanTable(gridManagerName) {
        delete store.scope[gridManagerName];
        delete store.responseData[gridManagerName];
        delete store.checkedData[gridManagerName];
        delete store.settings[gridManagerName];
    }
}
export default new Cache();
