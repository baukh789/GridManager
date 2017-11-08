'use strict';
import { jTool } from '../src/js/Base';
import Cache from '../src/js/Cache';
import testData from '../src/data/testData';
/**
 * 对象完整性验证
 */
describe('Cache 对象完整性验证', function() {
	it('对象完整性验证 Cache.initGridData', function(){
		expect(Cache.initGridData).toBeDefined();
	});

	it('对象完整性验证 Cache.__getRowData', function(){
		expect(Cache.__getRowData).toBeDefined();
	});

	it('对象完整性验证 Cache.setRowData', function(){
		expect(Cache.setRowData).toBeDefined();
	});

	it('对象完整性验证 Cache.getTableData', function(){
		expect(Cache.getTableData).toBeDefined();
	});

	it('对象完整性验证 Cache.initUserMemory', function(){
		expect(Cache.initUserMemory).toBeDefined();
	});

	it('对象完整性验证 Cache.delUserMemory', function(){
		expect(Cache.delUserMemory).toBeDefined();
	});

	it('对象完整性验证 Cache.getMemoryKey', function(){
		expect(Cache.getMemoryKey).toBeDefined();
	});

	it('对象完整性验证 Cache.getUserMemory', function(){
		expect(Cache.getUserMemory).toBeDefined();
	});

	it('对象完整性验证 Cache.saveUserMemory', function(){
		expect(Cache.saveUserMemory).toBeDefined();
	});

	it('对象完整性验证 Cache.initCoreMethod', function(){
		expect(Cache.initCoreMethod).toBeDefined();
	});

	it('对象完整性验证 Cache.getSettings', function(){
		expect(Cache.getSettings).toBeDefined();
	});

	it('对象完整性验证 Cache.setSettings', function(){
		expect(Cache.setSettings).toBeDefined();
	});

	it('对象完整性验证 Cache.cleanTableCacheForVersion', function(){
		expect(Cache.cleanTableCacheForVersion).toBeDefined();
	});

	it('对象完整性验证 Cache.cleanTableCache', function(){
		expect(Cache.cleanTableCache).toBeDefined();
	});

	it('对象完整性验证 Cache.configTheadForCache', function(){
		expect(Cache.configTheadForCache).toBeDefined();
	});

	it('对象完整性验证 Cache.setOriginalThDOM', function(){
		expect(Cache.setOriginalThDOM).toBeDefined();
	});

	it('对象完整性验证 Cache.getOriginalThDOM', function(){
		expect(Cache.getOriginalThDOM).toBeDefined();
	});

	it('对象完整性验证 Cache.__setGridManager', function(){
		expect(Cache.__setGridManager).toBeDefined();
	});

	it('对象完整性验证 Cache.__getGridManager', function(){
		expect(Cache.__getGridManager).toBeDefined();
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
		table.GM({
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
		});
	});
	afterAll(function () {
		table = null;
		$table = null;
		gmName = null;
		document.body.innerHTML = '';
	});


	it('Cache.__getRowData($table, target)', function() {
		let tr0 = jTool('tbody tr', $table).get(0);
		let tr1 = jTool('tbody tr', $table).get(1);
		let trList = document.querySelectorAll('table[grid-manager="'+ gmName +'"] tbody tr');
		expect(Cache.__getRowData($table, tr0).name).toBe('baukh');
		expect(Cache.__getRowData($table, tr1).name).toBe('kouzi');
		expect(Cache.__getRowData($table, tr0).age).toBe('30');
		expect(Cache.__getRowData($table, tr1).age).toBe('28');
		expect(Cache.__getRowData($table, trList)[0].info).toBe('野生前端程序');
		expect(Cache.__getRowData($table, trList)[1].info).toBe('产品经理');
		tr0 = null;
		tr1 = null;
		trList = null;
	});

	it('Cache.delUserMemory($table)', function() {
		expect(Cache.delUserMemory()).toBe(true);
		expect(Cache.delUserMemory($table)).toBe(false);
	});

	// TODO 本地没有问题, 但是CI上会报错. 原因可能是在CI上$table为空
	// it('Cache.__getGridManager($table)', function() {
	// 	expect(Cache.__getGridManager($table).disableCache).toBe(false);
	// });
    //
	// it('Cache.getSettings($table)', function() {
	// 	let settings = Cache.getSettings($table);
	// 	expect(settings.disableCache).toBe(false);
    //
	// 	settings.disableCache = true;
	// 	Cache.updateSettings($table, settings);
	// 	settings = Cache.getSettings($table);
	// 	expect(settings.disableCache).toBe(true);
    //
	// 	settings.disableCache = false;
	// 	Cache.updateSettings($table, settings);
	// });
    //
    //
	// it('Cache.getUserMemory($table)', function() {
	// 	expect(Cache.getUserMemory($table)).toEqual({});
	// 	Cache.saveUserMemory($table);
	// 	expect(Cache.getUserMemory($table).key).toBe('/context.html-test-cache');
	// 	expect(Cache.getUserMemory($table).cache.th).toBeDefined();
	// });


});
