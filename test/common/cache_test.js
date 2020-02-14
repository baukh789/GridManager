'use strict';
import jTool from '@jTool';
import {CACHE_ERROR_KEY, CONSOLE_STYLE, CONSOLE_INFO, CONSOLE_ERROR, MEMORY_KEY, VERSION_KEY, CHECKBOX_WIDTH, ORDER_WIDTH, CHECKBOX_DISABLED_KEY} from '@common/constants';
import { SIV_waitContainerAvailable, SIV_waitTableAvailable, getVersion, verifyVersion, initSettings, getSettings, setSettings, setScope, getUserMemory, saveUserMemory, delUserMemory, getRowData, getMemoryKey, getTableData, resetTableData, setTableData, updateTemplate, getCheckedData, setCheckedData, updateCheckedData, updateRowData, clearCache, updateCache } from '@common/cache';
import store from '@common/Store';
import { version } from '@package.json';
import tableTpl from '@test/table-test.tpl.html';
import getTableTestData from '@test/table-test.data.js';
import { getColumnMap, getColumnData } from '@test/table-config';
import i18n from '@module/i18n';
import {CHECKBOX_KEY, ORDER_KEY, TR_CACHE_KEY, TR_LEVEL_KEY} from '@common/constants';

// 清除空格
const tableTestTpl = tableTpl;

describe('SIV_waitContainerAvailable', () => {
    it('基础验证', () => {
        expect(SIV_waitContainerAvailable).toBeDefined();
        expect(SIV_waitContainerAvailable).toEqual({});
    });
});

describe('SIV_waitTableAvailable', () => {
    it('基础验证', () => {
        expect(SIV_waitTableAvailable).toBeDefined();
        expect(SIV_waitTableAvailable).toEqual({});
    });
});

describe('getVersion()', () => {
    it('基础验证', () => {
        expect(getVersion).toBeDefined();
        expect(getVersion.length).toBe(0);
    });

    it('验证返回值', () => {
        expect(getVersion()).toBe(version);
    });
});

describe('getScope and setScope', () => {
    let scope = null;
    beforeEach(() => {
        document.body.innerHTML = tableTestTpl;
    });
    afterEach(() => {
        document.body.innerHTML = '';
        scope = null;
        store.scope = {};
    });

    it('基础验证', () => {
        expect(setScope).toBeDefined();
        expect(setScope.length).toBe(2);
    });

    it('验证值', () => {
        scope = {
            name: 'ccc'
        };
        setScope('test', scope);
        expect(store.scope['test']).toEqual(scope);
    });
});

describe('getRowData', () => {
    let tableData = null;
    let tr = null;
    beforeEach(() => {
        tableData = getTableTestData().data;
        tableData[8].gm_checkbox = true;
        tableData[8].gm_checkbox_disabled = true;
        tableData[8].gm_order = 9;
        document.body.innerHTML = tableTestTpl;
        tr = document.querySelectorAll('tbody tr');
        store.settings = {
            test: {
                gridManagerName: 'test',
                columnMap: getColumnMap()
            }
        };
    });
    afterEach(() => {
        tableData = null;
        tr = null;
        document.body.innerHTML = '';
        store.responseData = {};
        store.settings = {};
    });

    it('基础验证', () => {
        expect(getRowData).toBeDefined();
        expect(getRowData.length).toBe(3);
    });

    it('未存在数据时', () => {
        expect(getRowData('test', tr[0])).toEqual({});
    });

    it('参数为element', () => {
        store.responseData['test'] = tableData;
        expect(getRowData('test', tr[8])).toEqual(getTableTestData().data[8]);
    });

    it('参数为NodeList', () => {
        expect(getRowData('test', tr).length).toBe(10);
    });

    it('使用原数据', () => {
        store.responseData['test'] = tableData;
        expect(getRowData('test', tr[8], true)).toEqual(tableData[8]);
    });

    it('使用树型数据', () => {
        store.settings.supportTreeData = true;
        store.settings.treeConfig = {
            insertTo: null,
            treeKey: 'children',
            openState: false
        };
        store.responseData['test'] = tableData;
        expect(getRowData('test', tr[8], true)).toEqual(tableData[8]);
    });

    it('参数异常', () => {
        expect(getRowData('test', 'aa')).toEqual({});
    });
});

describe('updateRowData(gridManagerName, key, rowDataList)', () => {
    beforeEach(() => {
        store.responseData['test'] = getTableTestData().data;
        store.settings = {
            test: {
                gridManagerName: 'test',
                supportTreeData: false,
                treeConfig: {
                    treeKey: 'children'
                }
            }
        };
        document.body.innerHTML = tableTestTpl;
    });
    afterEach(() => {
        document.body.innerHTML = '';
        store.responseData = {};
        store.settings = {};
    });

    it('基础验证', () => {
        expect(updateRowData).toBeDefined();
        expect(updateRowData.length).toBe(3);
    });

    it('执行验证: 常规数据', () => {
        let { tableData, updateCacheList } = updateRowData('test', 'id', [{id: 90, title: 'test updateRowData'}]);
        expect(tableData.length).toBe(10);
        expect(tableData[1].title).toBe('test updateRowData');

        expect(updateCacheList.length).toBe(1);
        expect(updateCacheList[0].id).toBe(90);
        tableData = null;
        updateCacheList = null;
    });

    it('执行验证: 树型数据', () => {
        store.settings.test.supportTreeData = true;
        let { tableData, updateCacheList } = updateRowData('test', 'id', [{id: 92, title: 'test updateRowData'}, {id: 921, title: 'test updateRowData'}]);

        expect(tableData.length).toBe(10);
        expect(tableData[0].title).toBe('test updateRowData');
        expect(tableData[0].children[0].title).toBe('test updateRowData');

        expect(updateCacheList.length).toBe(2);
        expect(updateCacheList[0].id).toBe(92);
        expect(updateCacheList[1].id).toBe(921);
        tableData = null;
        updateCacheList = null;
    });
});

describe('getTableData and setTableData', () => {
    let tableData = null;
    beforeEach(() => {
        tableData = getTableTestData();
    });
    afterEach(() => {
        tableData = null;
        store.responseData = {};
    });

    it('基础验证', () => {
        expect(getTableData).toBeDefined();
        expect(getTableData.length).toBe(1);
        expect(setTableData).toBeDefined();
        expect(setTableData.length).toBe(2);
    });

    it('执行验证', () => {
        expect(getTableData('test')).toEqual([]);
        setTableData('test', tableData.data);
        expect(getTableData('test')).toEqual(tableData.data);
    });
});

describe('resetTableData', () => {
    let tableData = null;
    let resetData = null;
    beforeEach(() => {
        tableData = getTableTestData().data;
    });
    afterEach(() => {
        tableData = null;
        resetData = null;
        store.responseData = {};
        store.settings = {};
        store.checkedData = {};
    });

    it('基础验证', () => {
        expect(resetTableData).toBeDefined();
        expect(resetTableData.length).toBe(2);
    });

    it('执行验证: 无重置项', () => {
        store.settings = {
            test: {
                gridManagerName: 'test',
                columnMap: getColumnMap(),
                rowRenderHandler: row => row,
                pageData: {},
                supportAutoOrder: false,
                supportCheckbox: false,
                pageSizeKey: 'pSize',
                currentPageKey: 'cPage'
            }
        };
        resetData = resetTableData('test', tableData);
        expect(resetData).toEqual(tableData);
    });

    it('执行验证: supportAutoOrder=true', () => {
        store.settings = {
            test: {
                gridManagerName: 'test',
                columnMap: getColumnMap(),
                rowRenderHandler: row => row,
                pageData: {
                    pSize: 30,
                    cPage: 2
                },
                supportAutoOrder: true,
                supportCheckbox: false,
                pageSizeKey: 'pSize',
                currentPageKey: 'cPage'
            }
        };
        resetData = resetTableData('test', tableData);
        expect(resetData[0][ORDER_KEY]).toBe(31);
        expect(resetData[0][TR_CACHE_KEY]).toBe('0');
        expect(resetData[0][TR_LEVEL_KEY]).toBe(0);
    });

    it('执行验证: supportCheckbox=true', () => {
        store.settings = {
            test: {
                gridManagerName: 'test',
                columnMap: getColumnMap(),
                rowRenderHandler: row => row,
                supportAutoOrder: false,
                supportCheckbox: true,
                pageSizeKey: 'pSize',
                currentPageKey: 'cPage'
            }
        };
        store.checkedData = {
            test: [
                tableData[0], tableData[2]
            ]
        };
        resetData = resetTableData('test', tableData);
        expect(resetData[0][CHECKBOX_KEY]).toBe(true);
        expect(resetData[0][CHECKBOX_DISABLED_KEY]).toBe(false);
        expect(resetData[0][TR_CACHE_KEY]).toBe('0');
        expect(resetData[0][TR_LEVEL_KEY]).toBe(0);

        expect(resetData[0].children[0][CHECKBOX_KEY]).toBeUndefined();
        expect(resetData[0].children[0][CHECKBOX_DISABLED_KEY]).toBeUndefined();
        expect(resetData[0].children[0][TR_CACHE_KEY]).toBeUndefined();
        expect(resetData[0].children[0][TR_LEVEL_KEY]).toBeUndefined();

        expect(resetData[1][CHECKBOX_KEY]).toBe(false);
        expect(resetData[1][CHECKBOX_DISABLED_KEY]).toBe(false);
        expect(resetData[1][TR_CACHE_KEY]).toBe('1');
        expect(resetData[1][TR_LEVEL_KEY]).toBe(0);

        expect(resetData[2][CHECKBOX_KEY]).toBe(true);
        expect(resetData[2][CHECKBOX_DISABLED_KEY]).toBe(false);
        expect(resetData[2][TR_CACHE_KEY]).toBe('2');
        expect(resetData[2][TR_LEVEL_KEY]).toBe(0);
    });


    it('执行验证: supportTreeData=true', () => {
        store.settings = {
            test: {
                gridManagerName: 'test',
                columnMap: getColumnMap(),
                rowRenderHandler: row => row,
                supportAutoOrder: false,
                supportCheckbox: false,
                supportTreeData: true,
                treeConfig: {
                    // 树展开操作按键所属容器，此处配置columnData的key值。未配置时，将默认选择columnData的第一项
                    insertTo: null,

                    // 层级关键字段
                    treeKey: 'children',

                    // 初始打开状态
                    openState: false
                }
            }
        };
        store.checkedData = {
            test: [
                tableData[0], tableData[2]
            ]
        };
        resetData = resetTableData('test', tableData);
        expect(resetData[0][ORDER_KEY]).toBeUndefined();
        expect(resetData[0][CHECKBOX_KEY]).toBeUndefined();
        expect(resetData[0][CHECKBOX_DISABLED_KEY]).toBeUndefined();
        expect(resetData[0][TR_CACHE_KEY]).toBe('0');
        expect(resetData[0][TR_LEVEL_KEY]).toBe(0);

        expect(resetData[0].children[0][ORDER_KEY]).toBeUndefined();
        expect(resetData[0].children[0][CHECKBOX_KEY]).toBeUndefined();
        expect(resetData[0].children[0][CHECKBOX_DISABLED_KEY]).toBeUndefined();
        expect(resetData[0].children[0][TR_CACHE_KEY]).toBe('0-0');
        expect(resetData[0].children[0][TR_LEVEL_KEY]).toBe(1);

        expect(resetData[1][ORDER_KEY]).toBeUndefined();
        expect(resetData[1][CHECKBOX_KEY]).toBeUndefined();
        expect(resetData[1][CHECKBOX_DISABLED_KEY]).toBeUndefined();
        expect(resetData[1][TR_CACHE_KEY]).toBe('1');
        expect(resetData[1][TR_LEVEL_KEY]).toBe(0);

        expect(resetData[2][ORDER_KEY]).toBeUndefined();
        expect(resetData[2][CHECKBOX_KEY]).toBeUndefined();
        expect(resetData[2][CHECKBOX_DISABLED_KEY]).toBeUndefined();
        expect(resetData[2][TR_CACHE_KEY]).toBe('2');
        expect(resetData[2][TR_LEVEL_KEY]).toBe(0);
    });
});

describe('getCheckedData and setCheckedData', () => {
    let dataList = null;
    let tableData = null;
    beforeEach(() => {
        tableData = getTableTestData();
        dataList = [];
        store.checkedData = {};
        store.settings = {
            test: {
                gridManagerName: 'test',
                columnMap: getColumnMap()
            }
        };
    });
    afterEach(() => {
        tableData = null;
        delete store.checkedData.test;
        delete store.settings.test;
        dataList = null;
    });

    it('基础验证', () => {
        expect(getCheckedData).toBeDefined();
        expect(getCheckedData.length).toBe(1);
        expect(setCheckedData).toBeDefined();
        expect(setCheckedData.length).toBe(3);
    });

    it('设置一组全部未选中的数据', () => {
        expect(getCheckedData('test').length).toBe(0);

        setCheckedData('test', tableData.data);
        expect(getCheckedData('test').length).toBe(0);
    });

    it('设置一组全部选中的数据', () => {
        dataList = [tableData.data[0], tableData.data[2]];
        setCheckedData('test', dataList, true);  // 第三个参数为true时， checkedList默认为全部选中的数据
        expect(getCheckedData('test').length).toBe(2);
        expect(getCheckedData('test')[0].id).toBe(92);
        expect(getCheckedData('test')[1].id).toBe(89);
    });

    it('设置一组存在两种状态的数据', () => {
        dataList = [];
        dataList.push(jTool.extend(tableData.data[0], {gm_checkbox: true}));
        dataList.push(jTool.extend(tableData.data[1], {gm_checkbox: false}));
        dataList.push(jTool.extend(tableData.data[2], {gm_checkbox: true}));
        dataList.push(jTool.extend(tableData.data[3], {gm_checkbox: false}));
        setCheckedData('test', dataList);

        expect(getCheckedData('test').length).toBe(2);
        expect(getCheckedData('test')[0].id).toBe(92);
        expect(getCheckedData('test')[1].id).toBe(89);

        // 将已存储的值修改为未选中状态
        dataList[2].gm_checkbox = false;
        setCheckedData('test', dataList);
        expect(getCheckedData('test').length).toBe(1);
        expect(getCheckedData('test')[0].id).toBe(92);

        // 清空
        setCheckedData('test', [], true);
        expect(getCheckedData('test').length).toBe(0);
    });
});

describe('updateCheckedData', () => {
    let tableData = null;
    let columnMap = null;
    beforeEach(() => {
        columnMap = getColumnMap();
        tableData = getTableTestData().data;
    });
    afterEach(() => {
        tableData = null;
        columnMap = null;
        delete store.checkedData.test;
    });

    it('基础验证', () => {
        expect(updateCheckedData).toBeDefined();
        expect(updateCheckedData.length).toBe(4);
    });

    it('未存在选中数据时', () => {
        expect(store.checkedData['test']).toBeUndefined();
        updateCheckedData('test', columnMap, 'id', [{id: 92, title: 'this is new title'}]);
        expect(store.checkedData['test']).toBeUndefined();
    });

    it('存在选中数据时', () => {
        store.checkedData = {
            test: [tableData[0], tableData[5]]
        };

        expect(store.checkedData['test'].length).toBe(2);
        expect(store.checkedData['test'][0].title).toBe('Content-Type 对照表');
        expect(store.checkedData['test'][1].title).toBe('js捕获错误信息');

        updateCheckedData('test', columnMap, 'id', [{id: 92, title: 'this is new title'}]);
        expect(store.checkedData['test'].length).toBe(2);
        expect(store.checkedData['test'][0].title).toBe('this is new title');
        expect(store.checkedData['test'][1].title).toBe('js捕获错误信息');
    });
});

describe('getMemoryKey', () => {
    beforeEach(() => {
        // 在测试中不能对pathname进行修改，该值默认为/context.html， 如果修改的话将会报出如下错误: Some of your tests did a full page reload!
        // window.location.pathname = '/context.html';
        window.location.hash = '#userList';
    });
    afterEach(() => {
        // window.location.pathname = null;
        window.location.hash = null;
    });

    it('基础验证', () => {
        expect(getMemoryKey).toBeDefined();
        expect(getMemoryKey.length).toBe(1);
    });

    it('执行验证', () => {
        expect(getMemoryKey('test')).toBe('/context.html#userList-test');
    });
});

describe('getUserMemory', () => {
    beforeEach(() => {
        // 在测试中不能对pathname进行修改，该值默认为/context.html， 如果修改的话将会报出如下错误: Some of your tests did a full page reload!
        // window.location.pathname = '/context.html';
        window.location.hash = '#userList';
        window.localStorage.removeItem(MEMORY_KEY);
        document.body.innerHTML = tableTestTpl;
    });
    afterEach(() => {
        // window.location.pathname = null;
        window.location.hash = null;
        window.localStorage.removeItem(MEMORY_KEY);
        document.body.innerHTML = null;
    });

    it('基础验证', () => {
        expect(getUserMemory).toBeDefined();
        expect(getUserMemory.length).toBe(1);
    });

    it('当前key值无效', () => {
        expect(getUserMemory('undefined')).toEqual({});
    });

    it('当前无存储字段', () => {
        expect(getUserMemory('test')).toEqual({});
        expect(document.querySelector('table').getAttribute(CACHE_ERROR_KEY)).toBe('error');
    });

    it('当前有存储字段，但当前表无存储', () => {
        window.localStorage.setItem(MEMORY_KEY, JSON.stringify({
            otherTable: JSON.stringify({column: getColumnMap(), page: {pSize: 20}})
        }));
        expect(getUserMemory('test')).toEqual({});
    });
});

describe('saveUserMemory', () => {
    let settings = null;
    beforeEach(() => {
        // 在测试中不能对pathname进行修改，该值默认为/context.html， 如果修改的话将会报出如下错误: Some of your tests did a full page reload!
        // window.location.pathname = '/context.html';
        window.location.hash = '#userList';
        window.localStorage.removeItem(MEMORY_KEY);
        document.body.innerHTML = tableTestTpl;
        settings = {
            disableCache: false,
            gridManagerName: 'test',
            columnMap: getColumnMap(),
            supportAjaxPage: true,
            pageData: {
                cPage: 1,
                pSize: 20,
                tPage: 3,
                tSize: 54
            },
            pageSizeKey: 'pSize'
        };
    });
    afterEach(() => {
        // window.location.pathname = null;
        window.location.hash = null;
        window.localStorage.removeItem(MEMORY_KEY);
        document.body.innerHTML = null;
        settings = null;
        store.settings = {};
    });

    it('基础验证', () => {
        expect(saveUserMemory).toBeDefined();
        expect(saveUserMemory.length).toBe(1);
    });

    it('缓存被禁用', () => {
        settings.disableCache = true;
        expect(saveUserMemory(settings)).toBeUndefined();
        expect(getUserMemory('test')).toEqual({});
    });

    it('当前未存在其它存储', () => {
        saveUserMemory(settings);
        expect(getUserMemory('test')).toEqual({column: getColumnMap(), page: {pSize: 20}});
    });

    it('当前已存在其它存储', () => {
        window.localStorage.setItem(MEMORY_KEY, JSON.stringify({
            '/context.html#userList-otherTable': JSON.stringify({column: getColumnMap(), page: {pSize: 20}})
        }));
        saveUserMemory(settings);
        expect(getUserMemory('test')).toEqual({column: getColumnMap(), page: {pSize: 20}});
    });

    it('type === undefined', () => {
        settings.columnMap.title.remind = undefined;
        saveUserMemory(settings);
        expect(getUserMemory('test').column.title.remind).toBeUndefined();
    });

    it('type === function', () => {
        settings.columnMap.title.template = () => {};
        saveUserMemory(settings);
        expect(getUserMemory('test').column.title.template).toBeUndefined();
    });

    it('type === object', () => {
        settings.columnMap.title.template = {};
        saveUserMemory(settings);
        expect(getUserMemory('test').column.title.template).toBeUndefined();
    });
});

describe('delUserMemory', () => {
    let settings = null;
    beforeEach(() => {
        // 在测试中不能对pathname进行修改，该值默认为/context.html， 如果修改的话将会报出如下错误: Some of your tests did a full page reload!
        // window.location.pathname = '/context.html';
        window.location.hash = '#userList';
        window.localStorage.removeItem(MEMORY_KEY);
        document.body.innerHTML = tableTestTpl;
        settings = {
            disableCache: false,
            gridManagerName: 'test',
            columnMap: getColumnMap(),
            supportAjaxPage: true,
            pageData: {
                cPage: 1,
                pSize: 20,
                tPage: 3,
                tSize: 54
            },
            pageSizeKey: 'pSize'
        };
        console._log = console.log;
        console.log = jasmine.createSpy('log');
    });
    afterEach(() => {
        // window.location.pathname = null;
        window.location.hash = null;
        window.localStorage.removeItem(MEMORY_KEY);
        document.body.innerHTML = null;
        store.settings = {};
        // 还原console
        console.log = console._log;
        settings = null;
    });

    it('基础验证', () => {
        expect(delUserMemory).toBeDefined();
        expect(delUserMemory.length).toBe(1);
    });

    it('当前无用户记忆', () => {
        expect(delUserMemory('test')).toBe(false);
    });

    it('定点清除', () => {
        window.localStorage.setItem(MEMORY_KEY, JSON.stringify({
            '/context.html#userList-otherTable': JSON.stringify({column: getColumnMap(), page: {pSize: 20}}),
            '/context.html#userList-test': JSON.stringify({column: getColumnMap(), page: {pSize: 20}})
        }));
        saveUserMemory(settings);
        expect(delUserMemory('test')).toBe(true);
        expect(JSON.parse(window.localStorage.getItem(MEMORY_KEY))['/context.html#userList-otherTable']).toBe(JSON.stringify({column: getColumnMap(), page: {pSize: 20}}));
        expect(JSON.parse(window.localStorage.getItem(MEMORY_KEY))['/context.html#userList-test']).toBeUndefined();

        expect(console.log).toHaveBeenCalledWith('%c GridManager Info %c delete user memory of test ', ...CONSOLE_STYLE[CONSOLE_INFO]);
    });

    it('清除所有', () => {
        window.localStorage.setItem(MEMORY_KEY, JSON.stringify({
            '/context.html#userList-otherTable': JSON.stringify({column: getColumnMap(), page: {pSize: 20}}),
            '/context.html#userList-test': JSON.stringify({column: getColumnMap(), page: {pSize: 20}})
        }));
        saveUserMemory(settings);
        expect(delUserMemory()).toBe(true);
        expect(window.localStorage.getItem(MEMORY_KEY)).toBe(null);

        expect(console.log).toHaveBeenCalledWith('%c GridManager Info %c delete user memory of all ', ...CONSOLE_STYLE[CONSOLE_INFO]);
    });
});

describe('updateTemplate', () => {
    let arg = null;
    beforeEach(() => {
        arg = {
            disableCache: false,
            emptyTemplate: 'test',
            columnData: [
                {
                    key: 'one',
                    text: 'one'
                },
                {
                    key: 'two',
                    text: 'two',
                    template: 'two'
                },
                {
                    key: 'three',
                    text: 'three',
                    template: () => {
                        return 'three';
                    }
                },
                {
                    key: 'four',
                    text: () => {
                        return 'four';
                    },
                    template: 'four'
                }
            ]
        };
    });
    afterEach(() => {
        arg = null;
    });

    it('基础验证', () => {
        expect(updateTemplate).toBeDefined();
        expect(updateTemplate.length).toBe(1);
    });

    it('执行验证', () => {
        arg =  updateTemplate(arg);
        expect(arg.disableCache).toBe(false);
        expect(arg.emptyTemplate()).toEqual('test');

        expect(arg.columnData[0].text()).toEqual('one');
        expect(arg.columnData[0].template).toBeUndefined();

        expect(arg.columnData[1].text()).toEqual('two');
        expect(arg.columnData[1].template()).toEqual('two');

        expect(arg.columnData[2].text()).toEqual('three');
        expect(arg.columnData[2].template()).toEqual('three');

        expect(arg.columnData[3].text()).toEqual('four');
        expect(arg.columnData[3].template()).toEqual('four');
    });

});

describe('initSettings', () => {
    let arg = null;
    let settings = null;
    let columnData = null;
    let columnMap = null;
    let checkboxColumnFn = null;
    let orderColumnFn = null;
    beforeEach(() => {
        // 在测试中不能对pathname进行修改，该值默认为/context.html， 如果修改的话将会报出如下错误: Some of your tests did a full page reload!
        // window.location.pathname = '/context.html';
        window.location.hash = '#userList';
        window.localStorage.removeItem(MEMORY_KEY);
        document.body.innerHTML = tableTestTpl;
        columnData = getColumnData();
        columnMap = getColumnMap();
        arg = {
            gridManagerName: 'test',
            ajaxData: 'https://www.lovejavascript.com/blogManager/getBlogList',
            ajaxType: 'POST',
            columnData: columnData
        };
        console._log = console.log;
        console.log = jasmine.createSpy('log');

        checkboxColumnFn = settings => {
            return {
                key: 'gm_checkbox',
                text: '',
                isAutoCreate: true,
                isShow: true,
                disableCustomize: true,
                width: CHECKBOX_WIDTH,
                align: 'center',
                template: checked => {
                    return this.getColumnTemplate({checked, useRadio: settings.useRadio});
                }
            };
        };
        orderColumnFn = settings => {
            return {
                key: 'gm_order',
                text: i18n(settings, 'order-text'),
                isAutoCreate: true,
                isShow: true,
                disableCustomize: true,
                width: ORDER_WIDTH,
                align: 'center',
                template: nodeData => {
                    return `<td gm-order="true" gm-create="true">${nodeData}</td>`;
                }
            };
        };
    });
    afterEach(() => {
        window.location.hash = null;
        window.localStorage.removeItem(MEMORY_KEY);
        document.body.innerHTML = null;
        arg = null;
        settings = null;
        store.settings = {};
        columnData = null;
        columnMap = null;
        // 还原console
        console.log = console._log;
        checkboxColumnFn = null;
        orderColumnFn = null;
    });

    it('基础验证', () => {
        expect(initSettings).toBeDefined();
        expect(initSettings.length).toBe(3);
    });

    it('默认配置', () => {
        // settings 中对默认值都已经测试过了，这里只挑部分项进行测试
        settings = initSettings(arg, checkboxColumnFn, orderColumnFn);
        expect(settings.gridManagerName).toBe('test');
        expect(settings.supportAdjust).toBe(true);
        expect(settings.supportAjaxPage).toBe(false);

        expect(settings.columnData).toEqual(columnData);

        // columnMap中存在template，该项未在这里进行测试
        expect(Object.keys(settings.columnMap)).toEqual(Object.keys(columnMap));
    });

    it('异常配置: 丢失key', () => {
        arg.supportAutoOrder = false;
        arg.supportCheckbox = false;
        delete arg.columnData[0].key;
        settings = initSettings(arg, checkboxColumnFn, orderColumnFn);
        expect(settings).toBe(false);
        expect(console.log).toHaveBeenCalledWith('%c GridManager Error %c columnData[0].key undefined ', ...CONSOLE_STYLE[CONSOLE_ERROR]);
    });

    it('异常配置: 存在disableCustomize但无width', () => {
        // 第8行数据存在disableCustomize配置
        delete arg.columnData[7].width;
        expect(initSettings(arg, checkboxColumnFn, orderColumnFn)).toBe(false);
        expect(console.log).toHaveBeenCalledWith('%c GridManager Error %c column action: when disableCustomize exists, width must be set ', ...CONSOLE_STYLE[CONSOLE_ERROR]);
    });

    it('开启缓存:当前无用户记忆', () => {
        // 当前无用户记忆
        arg.disableCache = false;
        settings = initSettings(arg, checkboxColumnFn, orderColumnFn);
        expect(settings.columnMap.pic.width).toBe('110px');
    });

    it('开启缓存: 当前有用户记忆', () => {
        columnMap.pic.width = '120px';
        window.localStorage.setItem(MEMORY_KEY, JSON.stringify({
            '/context.html#userList-test': JSON.stringify({column: columnMap, page: {pSize: 20}})
        }));

        arg.disableCache = false;
        settings = initSettings(arg, checkboxColumnFn, orderColumnFn);
        expect(settings.columnMap.pic.width).toBe('120px');
    });

    it('开启缓存: 与用户记忆数量不匹配', () => {
        delete columnMap.pic;
        window.localStorage.setItem(MEMORY_KEY, JSON.stringify({
            '/context.html#userList-test': JSON.stringify({column: columnMap, page: {pSize: 20}})
        }));

        arg.disableCache = false;
        settings = initSettings(arg, checkboxColumnFn, orderColumnFn);
        expect(console.log).toHaveBeenCalledWith('%c GridManager Info %c delete user memory of test ', ...CONSOLE_STYLE[CONSOLE_INFO]);
    });

    it('开启缓存: 与用户记忆项不匹配', () => {
        columnMap.pic.__width = '120px';
        window.localStorage.setItem(MEMORY_KEY, JSON.stringify({
            '/context.html#userList-test': JSON.stringify({column: columnMap, page: {pSize: 20}})
        }));

        arg.disableCache = false;
        settings = initSettings(arg, checkboxColumnFn, orderColumnFn);
        expect(console.log).toHaveBeenCalledWith('%c GridManager Info %c delete user memory of test ', ...CONSOLE_STYLE[CONSOLE_INFO]);
    });
});

describe('getSettings or setSettings', () => {
    let settings = null;
    beforeEach(() => {
        document.body.innerHTML = tableTestTpl;
        settings = {
            disableCache: false,
            gridManagerName: 'test',
            columnMap: getColumnMap(),
            supportAjaxPage: true,
            pageData: {
                cPage: 1,
                pSize: 20,
                tPage: 3,
                tSize: 54
            },
            pageSizeKey: 'pSize'
        };
    });
    afterEach(() => {
        store.settings = {};
        settings = null;
        document.body.innerHTML = null;
    });

    it('基础验证', () => {
        expect(getSettings).toBeDefined();
        expect(getSettings.length).toBe(1);

        expect(setSettings).toBeDefined();
        expect(setSettings.length).toBe(1);
    });

    it('settings 无值的情况', () => {
        expect(getSettings('test')).toEqual({});
    });

    it('设置 settings，后再获取', () => {
        expect(setSettings(settings)).toBeUndefined();

        expect(getSettings('test')).toEqual(settings);
    });
});

describe('update', () => {
    let settings = null;
    let _settings = null;
    beforeEach(() => {
        document.body.innerHTML = tableTestTpl;
        settings = {
            disableCache: false,
            gridManagerName: 'test',
            columnMap: getColumnMap(),
            supportAjaxPage: true,
            pageData: {
                cPage: 1,
                pSize: 20,
                tPage: 3,
                tSize: 54
            },
            pageSizeKey: 'pSize'
        };
        store.settings['test'] = settings;
    });
    afterEach(() => {
        store.settings = {};
        settings = null;
        _settings = null;
        document.body.innerHTML = null;
    });

    it('基础验证', () => {
        expect(updateCache).toBeDefined();
        expect(updateCache.length).toBe(1);
    });

    it('执行验证', () => {
        _settings = updateCache('test');
        expect(_settings.gridManagerName).toBe(settings.gridManagerName);
        expect(_settings.supportAjaxPage).toBe(settings.supportAjaxPage);
        expect(_settings.pageSizeKey).toBe(settings.pageSizeKey);
        expect(_settings.pageData).toEqual(settings.pageData);

        // todo 单元测试中，对dom的验证存在问题
        // expect(_settings.columnMap).toEqual(settings.columnMap);
    });
});


describe('verifyVersion', () => {
    beforeEach(() => {
        console._log = console.log;
        console.log = jasmine.createSpy('log');
    });
    afterEach(() => {
        console.log = console._log;
        console._log = null;
    });

    it('基础验证', () => {
        expect(verifyVersion).toBeDefined();
        expect(verifyVersion.length).toBe(0);
    });

    it('当前为第一次渲染', () => {
        // 当前为第一次渲染
        window.localStorage.removeItem(VERSION_KEY);
        expect(window.localStorage.getItem(VERSION_KEY)).toBeNull();
        verifyVersion();
        expect(window.localStorage.getItem(VERSION_KEY)).toBe(store.version);

        // 版本变更
        localStorage.setItem(VERSION_KEY, -1);
        verifyVersion();
        expect(localStorage.getItem(VERSION_KEY)).toBe(store.version);
        expect(console.log).toHaveBeenCalledWith('%c GridManager Info %c delete user memory of all ', ...CONSOLE_STYLE[CONSOLE_INFO]);

        window.localStorage.removeItem(VERSION_KEY);
    });
});


describe('clear', () => {
    beforeEach(() => {
        store.scope['test'] = {};
        store.responseData['test'] = {};
        store.checkedData['test'] = {};
        store.settings['test'] = {};
    });
    afterEach(() => {
        store.scope = {};
        store.responseData = {};
        store.checkedData = {};
        store.settings = {};
    });

    it('基础验证', () => {
        expect(clearCache).toBeDefined();
        expect(clearCache.length).toBe(1);
    });

    it('执行验证', () => {
        expect(store.scope['test']).toEqual({});
        expect(store.responseData['test']).toEqual({});
        expect(store.checkedData['test']).toEqual({});
        expect(store.settings['test']).toEqual({});

        clearCache('test');
        expect(store.scope['test']).toBeUndefined();
        expect(store.responseData['test']).toBeUndefined();
        expect(store.checkedData['test']).toBeUndefined();
        expect(store.settings['test']).toBeUndefined();
    });
});
