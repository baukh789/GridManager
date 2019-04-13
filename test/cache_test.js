'use strict';
import jTool from '../src/common/jTool';
import { trimTpl } from '../src/common/parse';
import cache from '../src/common/cache';
import store from '../src/common/Store';
import { version } from '../package.json';
import tableTpl from './table-test.tpl.html';
import getTableData from './table-test.data.js';
import { getColumnMap } from './table-config';

// 清除空格
const tableTestTpl = trimTpl(tableTpl);

/**
 * 验证类的属性及方法总量
 */
describe('cache 验证类的属性及方法总量', () => {
    let getPropertyCount = null;
    beforeEach(() => {
        getPropertyCount = o => {
            let count = 0;
            for (let n in o) {
                if (o.hasOwnProperty(n)) {
                    count++;
                }
            }
            return count;
        };
    });
    afterEach(() => {
        getPropertyCount = null;
    });
    it('Function count', () => {
        // es6 中 constructor 也会算做为对象的属性, 所以总量上会增加1
        expect(getPropertyCount(Object.getOwnPropertyNames(Object.getPrototypeOf(cache)))).toBe(21 + 1);
    });
});

describe('cache.getVersion()', () => {
    it('基础验证', () => {
        expect(cache.getVersion).toBeDefined();
        expect(cache.getVersion.length).toBe(0);
    });

    it('验证返回值', () => {
        expect(cache.getVersion()).toBe(version);
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
    });

    it('基础验证', () => {
        expect(cache.getScope).toBeDefined();
        expect(cache.getScope.length).toBe(1);
        expect(cache.setScope).toBeDefined();
        expect(cache.setScope.length).toBe(2);
    });

    it('验证值', () => {
        expect(cache.getScope('test')).toBeUndefined();
        scope = {
            name: 'ccc'
        };
        cache.setScope('test', scope);
        expect(cache.getScope('test')).toEqual(scope);
    });
});

describe('getRowData(gridManagerName, target)', () => {
    let tableData = null;
    beforeEach(() => {
        tableData = getTableData();
        document.body.innerHTML = tableTestTpl;
    });
    afterEach(() => {
        tableData = null;
        document.body.innerHTML = '';
        store.responseData = {};
    });

    it('基础验证', () => {
        expect(cache.getRowData).toBeDefined();
        expect(cache.getRowData.length).toBe(2);
    });

    it('未存在数据时', () => {
        expect(cache.getRowData('test', document.querySelector('tr[cache-key="9"]'))).toBeUndefined();
    });

    it('参数为element', () => {
        store.responseData['test'] = tableData.data;
        expect(cache.getRowData('test', document.querySelector('tr[cache-key="9"]'))).toEqual(tableData.data[9]);
    });

    it('参数为NodeList', () => {
        store.responseData['test'] = tableData.data;
        expect(cache.getRowData('test', document.querySelectorAll('tr[cache-key]')).length).toBe(10);
    });

    it('参数异常', () => {
        store.responseData['test'] = tableData.data;
        expect(cache.getRowData('test', 'aa')).toEqual({});
    });
});

describe('updateRowData(gridManagerName, key, rowDataList)', () => {
    let tableData = null;
    beforeEach(() => {
        tableData = getTableData();
        store.responseData['test'] = tableData.data;
        document.body.innerHTML = tableTestTpl;
    });
    afterEach(() => {
        tableData = null;
        document.body.innerHTML = '';
        store.responseData = {};
    });

    it('基础验证', () => {
        expect(cache.updateRowData).toBeDefined();
        expect(cache.updateRowData.length).toBe(3);
    });

    it('执行验证', () => {
        expect(cache.updateRowData('test', 'id', [{id: 90, title: 'test updateRowData'}]).length).toBe(10);
        expect(cache.updateRowData('test', 'id', [{id: 90, title: 'test updateRowData'}])[1].title).toBe('test updateRowData');
    });
});

describe('getTableData and setTableData', () => {
    let tableData = null;
    beforeEach(() => {
        tableData = getTableData();
    });
    afterEach(() => {
        tableData = null;
        store.responseData = {};
    });

    it('基础验证', () => {
        expect(cache.getTableData).toBeDefined();
        expect(cache.getTableData.length).toBe(1);
        expect(cache.setTableData).toBeDefined();
        expect(cache.setTableData.length).toBe(2);
    });

    it('执行验证', () => {
        expect(cache.getTableData('test')).toEqual([]);
        cache.setTableData('test', tableData.data);
        expect(cache.getTableData('test')).toEqual(tableData.data);
    });
});

describe('getCheckedData and setCheckedData', () => {
    let dataList = null;
    let tableData = null;
    beforeEach(() => {
        tableData = getTableData();
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
        expect(cache.getCheckedData).toBeDefined();
        expect(cache.getCheckedData.length).toBe(1);
        expect(cache.setCheckedData).toBeDefined();
        expect(cache.setCheckedData.length).toBe(3);
    });

    it('设置一组全部未选中的数据', () => {
        expect(cache.getCheckedData('test').length).toBe(0);

        cache.setCheckedData('test', tableData.data);
        expect(cache.getCheckedData('test').length).toBe(0);
    });

    it('设置一组全部选中的数据', () => {
        dataList = [tableData.data[0], tableData.data[2]];
        cache.setCheckedData('test', dataList, true);  // 第三个参数为true时， checkedList默认为全部选中的数据
        expect(cache.getCheckedData('test').length).toBe(2);
        expect(cache.getCheckedData('test')[0].id).toBe(92);
        expect(cache.getCheckedData('test')[1].id).toBe(89);
    });

    it('设置一组存在两种状态的数据', () => {
        dataList = [];
        dataList.push(jTool.extend(tableData.data[0], {gm_checkbox: true}));
        dataList.push(jTool.extend(tableData.data[1], {gm_checkbox: false}));
        dataList.push(jTool.extend(tableData.data[2], {gm_checkbox: true}));
        dataList.push(jTool.extend(tableData.data[3], {gm_checkbox: false}));
        cache.setCheckedData('test', dataList);

        expect(cache.getCheckedData('test').length).toBe(2);
        expect(cache.getCheckedData('test')[0].id).toBe(92);
        expect(cache.getCheckedData('test')[1].id).toBe(89);

        // 将已存储的值修改为未选中状态
        dataList[2].gm_checkbox = false;
        cache.setCheckedData('test', dataList);
        expect(cache.getCheckedData('test').length).toBe(1);
        expect(cache.getCheckedData('test')[0].id).toBe(92);

        // 清空
        cache.setCheckedData('test', [], true);
        expect(cache.getCheckedData('test').length).toBe(0);
    });
});
