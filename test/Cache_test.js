'use strict';
import jTool from '../src/js/jTool';
import Cache from '../src/js/Cache';
import testData from '../src/data/testData';
describe('Cache.js', function() {

	let table = null;
	let $table = null;
	let gmName = 'test-cache';
	beforeAll(function(){
		// 引入组件, 实例化 Element.prototype.GM
		require('../src/js/GridManager').default;

		table = document.createElement('table');
		table.setAttribute('grid-manager', gmName);
		document.querySelector('body').appendChild(table);
		$table = jTool('table[grid-manager="'+ gmName +'"]');
		document.querySelector('table[grid-manager="'+ gmName +'"]').GM({
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
		Element.prototype.GM = Element.prototype.GridManager = null;
		document.body.innerHTML = '';
	});
	it('Cache.responseData', function() {
		expect(Cache.responseData['test-cache']).toBeDefined();
		expect(Cache.responseData['test-cache'][0].name).toBe('baukh');
		expect(Cache.responseData['test-cache'][1].name).toBe('kouzi');
		expect(Cache.responseData['test-cache'][0].age).toBe('30');
		expect(Cache.responseData['test-cache'][1].age).toBe('28');
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


});
