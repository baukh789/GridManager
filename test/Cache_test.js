'use strict';
import { jTool } from '../src/js/Base';
import Cache from '../src/js/Cache';
import testData from '../src/data/testData';
import GridManager from '../src/js/GridManager';
/**
 * 对象完整性验证
 */
describe('Cache 对象完整性验证', function() {
	it('对象完整性验证 Cache.initGridData', function(){
		expect(Cache.initGridData).toBeDefined();
		expect(Cache.initGridData.length).toBe(0);
	});

	it('对象完整性验证 Cache.__getRowData', function(){
		expect(Cache.__getRowData).toBeDefined();
		expect(Cache.__getRowData.length).toBe(2);
	});

	it('对象完整性验证 Cache.setRowData', function(){
		expect(Cache.setRowData).toBeDefined();
		expect(Cache.setRowData.length).toBe(3);
	});

	it('对象完整性验证 Cache.getTableData', function(){
		expect(Cache.getTableData).toBeDefined();
		expect(Cache.getTableData.length).toBe(1);
	});

	it('对象完整性验证 Cache.initUserMemory', function(){
		expect(Cache.initUserMemory).toBeDefined();
		expect(Cache.initUserMemory.length).toBe(0);
	});

	it('对象完整性验证 Cache.delUserMemory', function(){
		expect(Cache.delUserMemory).toBeDefined();
		expect(Cache.delUserMemory.length).toBe(1);
	});

	it('对象完整性验证 Cache.getMemoryKey', function(){
		expect(Cache.getMemoryKey).toBeDefined();
		expect(Cache.getMemoryKey.length).toBe(1);
	});

	it('对象完整性验证 Cache.getUserMemory', function(){
		expect(Cache.getUserMemory).toBeDefined();
		expect(Cache.getUserMemory.length).toBe(1);
	});

	it('对象完整性验证 Cache.saveUserMemory', function(){
		expect(Cache.saveUserMemory).toBeDefined();
		expect(Cache.saveUserMemory.length).toBe(1);
	});

	it('对象完整性验证 Cache.initCoreMethod', function(){
		expect(Cache.initCoreMethod).toBeDefined();
		expect(Cache.initCoreMethod.length).toBe(0);
	});

	it('对象完整性验证 Cache.getSettings', function(){
		expect(Cache.getSettings).toBeDefined();
		expect(Cache.getSettings.length).toBe(1);
	});

	it('对象完整性验证 Cache.setSettings', function(){
		expect(Cache.setSettings).toBeDefined();
		expect(Cache.setSettings.length).toBe(2);
	});

	it('对象完整性验证 Cache.cleanTableCacheForVersion', function(){
		expect(Cache.cleanTableCacheForVersion).toBeDefined();
		expect(Cache.cleanTableCacheForVersion.length).toBe(0);
	});

	it('对象完整性验证 Cache.cleanTableCache', function(){
		expect(Cache.cleanTableCache).toBeDefined();
		expect(Cache.cleanTableCache.length).toBe(2);
	});

	it('对象完整性验证 Cache.configTheadForCache', function(){
		expect(Cache.configTheadForCache).toBeDefined();
		expect(Cache.configTheadForCache.length).toBe(1);
	});

	it('对象完整性验证 Cache.setOriginalThDOM', function(){
		expect(Cache.setOriginalThDOM).toBeDefined();
		expect(Cache.setOriginalThDOM.length).toBe(1);
	});

	it('对象完整性验证 Cache.getOriginalThDOM', function(){
		expect(Cache.getOriginalThDOM).toBeDefined();
		expect(Cache.getOriginalThDOM.length).toBe(1);
	});

	it('对象完整性验证 Cache.__setGridManager', function(){
		expect(Cache.__setGridManager).toBeDefined();
		expect(Cache.__setGridManager.length).toBe(2);
	});

	it('对象完整性验证 Cache.__getGridManager', function(){
		expect(Cache.__getGridManager).toBeDefined();
		expect(Cache.__getGridManager.length).toBe(1);
	});
});

/**
 * 验证原型方法总数
 */
describe('Cache 验证原型方法总数', function() {
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
describe('Cache.js', function() {

	let table = null;
	let $table = null;
	let gmName = 'test-cache';
	beforeAll(function(){

		table = document.createElement('table');
		table.setAttribute('grid-manager', gmName);
		document.querySelector('body').appendChild(table);
		$table = jTool(table);
		var arg = {
			ajax_data: testData
			,disableCache: false
			,query:{tool: 'jasmine'}
			,i18n: 'en-us'
			,columnData: [
				{
					key: 'name',
					width: '100px',
					text: '名称'
				},{
					key: 'info',
					text: '使用说明'
				},{
					key: 'url',
					text: 'url'
				},{
					key: 'createDate',
					text: '创建时间'
				},{
					key: 'lastDate',
					text: '最后修改时间'
				},{
					key: 'action',
					text: '操作',
					template: function(action, rowObject){
						return '<span class="plugin-action edit-action" learnLink-id="'+rowObject.id+'">编辑</span>'
							+'<span class="plugin-action del-action" learnLink-id="'+rowObject.id+'">删除</span>';
					}
				}
			]
		};
		new GridManager().init(table, arg);
	});
	afterAll(function () {
		table = null;
		$table = null;
		gmName = null;
		document.body.innerHTML = '';
	});


	// it('Cache.__getRowData($table, target)', function() {
	// 	let tr0 = jTool('tbody tr', $table).get(0);
	// 	let tr1 = jTool('tbody tr', $table).get(1);
	// 	let trList = document.querySelectorAll('table[grid-manager="'+ gmName +'"] tbody tr');
	// 	expect(Cache.__getRowData($table, tr0).name).toBe('baukh');
	// 	expect(Cache.__getRowData($table, tr1).name).toBe('kouzi');
	// 	expect(Cache.__getRowData($table, tr0).age).toBe('30');
	// 	expect(Cache.__getRowData($table, tr1).age).toBe('28');
	// 	expect(Cache.__getRowData($table, trList)[0].info).toBe('野生前端程序');
	// 	expect(Cache.__getRowData($table, trList)[1].info).toBe('产品经理');
	// 	tr0 = null;
	// 	tr1 = null;
	// 	trList = null;
	// });

	it('Cache.delUserMemory($table)', function() {
		expect(Cache.delUserMemory()).toBe(true);
		expect(Cache.delUserMemory($table)).toBe(false);
	});

	// TODO 本地没有问题, 但是CI上会报错. 原因可能是在CI上$table为空
	it('Cache.__getGridManager($table)', function() {
		expect(Cache.__getGridManager($table).disableCache).toBe(false);
	});

	it('Cache.getSettings($table)', function() {
		let settings = Cache.getSettings($table);
		expect(settings.disableCache).toBe(false);

		settings.disableCache = true;
		Cache.setSettings($table, settings);
		settings = Cache.getSettings($table);
		expect(settings.disableCache).toBe(true);

		settings.disableCache = false;
		Cache.setSettings($table, settings);
	});


	it('Cache.getUserMemory($table)', function() {
		expect(Cache.getUserMemory($table)).toEqual({});
		Cache.saveUserMemory($table);
		expect(Cache.getUserMemory($table).key).toBe('/context.html-test-cache');
		expect(Cache.getUserMemory($table).cache.th).toBeDefined();
	});


});
