'use strict';
import { jTool } from '../src/js/Base';
import Cache from '../src/js/Cache';

/**
 * 验证类的属性及方法总量
 */
describe('Cache 验证类的属性及方法总量', function() {
	var getPropertyCount = null;
	beforeEach(function() {
		getPropertyCount = function(o){
			var n, count = 0;
			for(n in o){
				if(o.hasOwnProperty(n)){
					count++;
				}
			}
			return count;
		}
	});
	afterEach(function(){
		getPropertyCount = null;
	});
	it('Function count', function() {
		// es6 中 constructor 也会算做为对象的属性, 所以总量上会增加1
		expect(getPropertyCount(Object.getOwnPropertyNames(Object.getPrototypeOf(Cache)))).toBe(21 + 1);
	});
});

describe('Cache.getVersion()', function() {
	it('基础验证', function(){
		expect(Cache.getVersion).toBeDefined();
		expect(Cache.getVersion.length).toBe(0);
	});

	it('验证返回值', function(){
		expect(typeof(Cache.getVersion())).toBe('string');
	});
});

describe('Cache.getScope($table)', function() {
    var $table = null;
    beforeEach(function() {
        document.body.innerHTML = '<table grid-manager="test-getScope"></table>';
        $table = jTool('table[grid-manager="test-getScope"]');
    });
    afterEach(function(){
        document.body.innerHTML = '';
    });

    it('基础验证', function(){
        expect(Cache.getScope).toBeDefined();
        expect(Cache.getScope.length).toBe(1);
    });

    it('验证值', function(){
        expect(Cache.getScope($table)).toBeUndefined();
    });
});

describe('Cache.setScope($table, scope)', function() {
    var $table = null;
    var scope = null;
    beforeEach(function() {
        document.body.innerHTML = '<table grid-manager="test-setScope"></table>';
        $table = jTool('table[grid-manager="test-setScope"]');
    });
    afterEach(function(){
        document.body.innerHTML = '';
        scope = null;
    });

    it('基础验证', function(){
        expect(Cache.setScope).toBeDefined();
        expect(Cache.setScope.length).toBe(2);
    });

    it('验证值', function(){
        expect(Cache.getScope($table)).toBeUndefined();
        scope = {
            name: 'ccc'
        };
        Cache.setScope($table, scope);
        expect(Cache.getScope($table)).toEqual(scope);
    });
});

describe('Cache.getRowData($table, target)', function() {
	it('基础验证', function(){
		expect(Cache.getRowData).toBeDefined();
		expect(Cache.getRowData.length).toBe(2);
	});
});

describe('Cache.setRowData($table, index, rowData)', function() {
	it('基础验证', function(){
		expect(Cache.setRowData).toBeDefined();
		expect(Cache.setRowData.length).toBe(3);
	});
});

describe('Cache.getTableData($table)', function() {
	it('基础验证', function(){
		expect(Cache.getTableData).toBeDefined();
		expect(Cache.getTableData.length).toBe(1);
	});
});

describe('Cache.setTableData($table, data)', function() {
	it('基础验证', function(){
		expect(Cache.setTableData).toBeDefined();
		expect(Cache.setTableData.length).toBe(2);
	});
});

describe('Cache.getCheckedData($table)', function() {
    it('基础验证', function(){
        expect(Cache.getCheckedData).toBeDefined();
        expect(Cache.getCheckedData.length).toBe(1);
    });
});
describe('Cache.setCheckedData($table, checkedList, isClear)', function() {
    it('基础验证', function(){
        expect(Cache.setCheckedData).toBeDefined();
        expect(Cache.setCheckedData.length).toBe(3);
    });
});

describe('Cache.updateRowData($table, key, rowDataList)', function() {
    it('基础验证', function(){
        expect(Cache.updateRowData).toBeDefined();
        expect(Cache.updateRowData.length).toBe(3);
    });
});

describe('Cache.delUserMemory($table, cleanText)', function() {
	it('基础验证', function(){
		expect(Cache.delUserMemory).toBeDefined();
		expect(Cache.delUserMemory.length).toBe(2);
	});
});

describe('Cache.(getMemoryKey(settings)', function() {
	it('基础验证', function(){
		expect(Cache.getMemoryKey).toBeDefined();
		expect(Cache.getMemoryKey.length).toBe(1);
	});
});

describe('Cache.getUserMemory($table)', function() {
	it('基础验证', function(){
		expect(Cache.getUserMemory).toBeDefined();
		expect(Cache.getUserMemory.length).toBe(1);
	});
});

describe('Cache.saveUserMemory($table, settings)', function() {
	it('基础验证', function(){
		expect(Cache.saveUserMemory).toBeDefined();
		expect(Cache.saveUserMemory.length).toBe(2);
	});
});

describe('Cache.initSettings($table, arg)', function() {
	it('基础验证', function(){
		expect(Cache.initSettings).toBeDefined();
		expect(Cache.initSettings.length).toBe(2);
	});
});

describe('Cache.getSettings($table)', function() {
	it('基础验证', function(){
		expect(Cache.getSettings).toBeDefined();
		expect(Cache.getSettings.length).toBe(1);
	});
});

describe('Cache.setSettings($table, settings)', function() {
	it('基础验证', function(){
		expect(Cache.setSettings).toBeDefined();
		expect(Cache.setSettings.length).toBe(2);
	});
});

describe('Cache.update($table, settings)', function() {
    it('基础验证', function(){
        expect(Cache.update).toBeDefined();
        expect(Cache.update.length).toBe(2);
    });
});

describe('Cache.reworkColumnMap($table, columnMap)', function() {
	it('基础验证', function(){
		expect(Cache.reworkColumnMap).toBeDefined();
		expect(Cache.reworkColumnMap.length).toBe(2);
	});
});

describe('Cache.cleanTableCacheForVersion()', function() {
	it('基础验证', function(){
		expect(Cache.cleanTableCacheForVersion).toBeDefined();
		expect(Cache.cleanTableCacheForVersion.length).toBe(0);
	});
});

describe('Cache.cleanTable(gridManagerName)', function() {
    it('基础验证', function(){
        expect(Cache.cleanTable).toBeDefined();
        expect(Cache.cleanTable.length).toBe(1);
    });
});
