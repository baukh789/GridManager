'use strict';
import jTool from '../src/js/jTool';
import Cache from '../src/js/Cache';
describe('Cache.js', function() {

	let table = null;
	let $table = null;
	let ajaxData = null;
	beforeAll(function(){
		// 引入组件, 实例化 Element.prototype.GM
		require('../src/js/GridManager').default;

		// 使用静态数据进行渲染
		ajaxData = {
			"data":[
				{
					"name": "baukh",
					"age": "30",
					"createDate": "2015-03-12",
					"info": "野生前端程序",
					"operation": "修改"
				},
				{
					"name": "kouzi",
					"age": "28",
					"createDate": "2015-03-12",
					"info": "产品经理",
					"operation": "修改"
				},
				{
					"name": "baukh",
					"age": "28",
					"createDate": "2015-03-12",
					"info": "野生前端程序",
					"operation": "修改"
				},
				{
					"name": "baukh",
					"age": "28",
					"createDate": "2015-03-12",
					"info": "野生前端程序",
					"operation": "修改"
				},
				{
					"name": "baukh",
					"age": "28",
					"createDate": "2015-03-12",
					"info": "野生前端程序",
					"operation": "修改"
				},{
					"name": "baukh",
					"age": "28",
					"createDate": "2015-03-12",
					"info": "野生前端程序",
					"operation": "修改"
				},
				{
					"name": "baukh",
					"age": "28",
					"createDate": "2015-03-12",
					"info": "野生前端程序",
					"operation": "修改"
				},
				{
					"name": "baukh",
					"age": "28",
					"createDate": "2015-03-12",
					"info": "野生前端程序",
					"operation": "修改"
				}
			],
			"totals": 8
		};

		table = document.createElement('table');
		table.setAttribute('grid-manager', 'test-cache');
		document.querySelector('body').appendChild(table);
		$table = jTool('table[grid-manager="test-cache"]');
		document.querySelector('table[grid-manager="test-cache"]').GM({
			ajax_data: ajaxData
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
		document.querySelector('body').innerHTML = '';
		table = null;
		$table = null;
		Element.prototype.GM = Element.prototype.GridManager = null;
	});
	it('Cache.cacheData', function() {
		expect(Cache.cacheData['test-cache']).toBeDefined();
		expect(Cache.cacheData['test-cache'][0].name).toBe('baukh');
		expect(Cache.cacheData['test-cache'][1].name).toBe('kouzi');
		expect(Cache.cacheData['test-cache'][0].age).toBe('30');
		expect(Cache.cacheData['test-cache'][1].age).toBe('28');
	});

	it('Cache.getRowData($table, tr)', function() {
		let tr0 = jTool('tbody tr', $table).get(0);
		let tr1 = jTool('tbody tr', $table).get(1);
		let trList = document.querySelectorAll('table[grid-manager="test-cache"] tbody tr');
		expect(Cache.getRowData($table, tr0).name).toBe('baukh');
		expect(Cache.getRowData($table, tr1).name).toBe('kouzi');
		expect(Cache.getRowData($table, tr0).age).toBe('30');
		expect(Cache.getRowData($table, tr1).age).toBe('28');
		expect(Cache.getRowData($table, trList)[0].info).toBe('野生前端程序');
		expect(Cache.getRowData($table, trList)[1].info).toBe('产品经理');
		tr0 = null;
		tr1 = null;
		trList = null;
	});

	it('Cache.clear($table)', function() {
		expect(Cache.clear()).toBe(false);
		expect(Cache.clear($table)).toBe(true);
	});

	it('Cache.get($table)', function() {
		expect(Cache.get($table).disableCache).toBe(false);
	});

	it('Cache.getSettings($table)', function() {
		let settings = Cache.getSettings($table);
		expect(settings.disableCache).toBe(false);
		settings.disableCache = true;
		settings = Cache.getSettings($table);
		expect(settings.disableCache).toBe(true);
		settings.disableCache = false;
	});


	it('Cache.getLocalStorage($table)', function() {
		expect(Cache.getLocalStorage($table)).toEqual({});
		Cache.setToLocalStorage($table);
		expect(Cache.getLocalStorage($table).key).toBe('/context.html-test-cache');
		expect(Cache.getLocalStorage($table).cache.th).toBeDefined();
	});


});
