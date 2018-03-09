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
		expect(getPropertyCount(Object.getOwnPropertyNames(Object.getPrototypeOf(Cache)))).toBe(14 + 1);
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

describe('Cache.getRowData($table, target)', function() {
	it('基础验证', function(){
		expect(Cache.getRowData).toBeDefined();
		expect(Cache.getRowData.length).toBe(2);
	});
});

describe('Cache.setRowData(gmName, key, value)', function() {
	it('基础验证', function(){
		expect(Cache.setRowData).toBeDefined();
		expect(Cache.setRowData.length).toBe(3);
	});
});

describe('Cache.delUserMemory($table, cleanText)', function() {
	it('基础验证', function(){
		expect(Cache.delUserMemory).toBeDefined();
		expect(Cache.delUserMemory.length).toBe(2);
	});
});

describe('Cache.(getMemoryKey($table)', function() {
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

describe('Cache.saveUserMemory($table)', function() {
	it('基础验证', function(){
		expect(Cache.saveUserMemory).toBeDefined();
		expect(Cache.saveUserMemory.length).toBe(1);
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
