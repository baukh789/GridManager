'use strict';
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
		expect(getPropertyCount(Object.getOwnPropertyNames(Object.getPrototypeOf(Cache)))).toBe(3 + 1);
	});
});

/**
 * 表格渲染数据
 */
describe('Cache.initGridData()', function() {
	it('基础验证', function(){
		expect(Cache.initGridData).toBeDefined();
		expect(Cache.initGridData.length).toBe(0);
	});
});

describe('Cache.__getRowData($table, target)', function() {
	it('基础验证', function(){
		expect(Cache.__getRowData).toBeDefined();
		expect(Cache.__getRowData.length).toBe(2);
	});
});

describe('Cache.setRowData(gmName, key, value)', function() {
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

/**
 * 用户记忆
 */
describe('Cache.initUserMemory()', function() {
	it('基础验证', function(){
		expect(Cache.initUserMemory).toBeDefined();
		expect(Cache.initUserMemory.length).toBe(0);
	});
});

describe('Cache.delUserMemory', function() {
	it('基础验证', function(){
		expect(Cache.delUserMemory).toBeDefined();
		expect(Cache.delUserMemory.length).toBe(1);
	});
});

describe('Cache.getMemoryKey', function() {
	it('基础验证', function(){
		expect(Cache.getMemoryKey).toBeDefined();
		expect(Cache.getMemoryKey.length).toBe(1);
	});
});

describe('Cache.getUserMemory', function() {
	it('基础验证', function(){
		expect(Cache.getUserMemory).toBeDefined();
		expect(Cache.getUserMemory.length).toBe(1);
	});
});

describe('Cache.saveUserMemory', function() {
	it('基础验证', function(){
		expect(Cache.saveUserMemory).toBeDefined();
		expect(Cache.saveUserMemory.length).toBe(1);
	});
});

/**
 * 核心方法
 */
describe('Cache.initCoreMethod()', function() {
	it('基础验证', function(){
		expect(Cache.initCoreMethod).toBeDefined();
		expect(Cache.initCoreMethod.length).toBe(0);
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

describe('Cache.cleanTableCache($table, cleanText)', function() {
	it('基础验证', function(){
		expect(Cache.cleanTableCache).toBeDefined();
		expect(Cache.cleanTableCache.length).toBe(2);
	});
});

describe('Cache.setOriginalThDOM($table)', function() {
	it('基础验证', function(){
		expect(Cache.setOriginalThDOM).toBeDefined();
		expect(Cache.setOriginalThDOM.length).toBe(1);
	});
});

describe('Cache.getOriginalThDOM($table)', function() {
	it('基础验证', function(){
		expect(Cache.getOriginalThDOM).toBeDefined();
		expect(Cache.getOriginalThDOM.length).toBe(1);
	});
});
