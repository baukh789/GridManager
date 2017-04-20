/**
 * Created by baukh on 17/4/17.
 */

'use strict';
import jTool from '../src/js/jTool';
import {PublishMethod, publishMethodArray} from '../src/js/Publish';
import Cache from '../src/js/Cache';
import testData from '../src/data/testData';
describe('Publish.js', function() {
	let table = null;
	let $table = null;
	beforeAll(function(){
		// 引入组件, 实例化 Element.prototype.GM
		require('../src/js/GridManager').default;

		table = document.createElement('table');
		table.setAttribute('grid-manager', 'test-publish');
		document.querySelector('body').appendChild(table);
		$table = jTool('table[grid-manager="test-publish"]');
		document.querySelector('table[grid-manager="test-publish"]').GM({
			ajax_data: testData
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

	it('核对对外公开方法总数 及 方法名匹配', function(){
		expect(publishMethodArray.length).toBe(14);
		let list = [
			'init',					// 初始化方法
			'setSort',				// 手动设置排序
			'get',					//通过jTool实例获取GridManager
			'showTh',				//显示Th及对应的TD项
			'hideTh',				//隐藏Th及对应的TD项
			'exportGridToXls',		//导出表格 .xls
			'getLocalStorage',		//获取指定表格的本地存储数据
			'setQuery',				//配置query 该参数会在分页触发后返回至pagingAfter(query)方法
			'setAjaxData',          //用于再次配置ajax_data数据, 配置后会根据配置的数据即刻刷新表格
			'refreshGrid',			//刷新表格 使用现有参数重新获取数据，对表格数据区域进行渲染
			'getCheckedTr',			//获取当前选中的行
			'getRowData',			//获取当前行渲染时使用的数据
			'getCheckedData',		//获取当前选中行渲染时使用的数据
			'clear'					//清除指定表的表格记忆数据
			];
		publishMethodArray.forEach(function(v, i){
			expect(list.indexOf(v)).not.toBe(-1);
		});
		list = null;
	});

	it('PublishMethod.get($table)', function(){
		let gm = PublishMethod.get($table);
		expect(gm).toBeDefined();
		expect(gm['supportDrag']).toBe(true);
		expect(gm['sortData']).toEqual({});
		expect(gm['sortUpText']).toBe('ASC');
		expect(gm['width']).toBe('100%');
		expect(gm['height']).toBe('300px');

		gm = null;
	});

	it('PublishMethod.getLocalStorage($table)', function(){
		let userMemory = PublishMethod.getLocalStorage($table);
		expect(userMemory).toEqual({});
		Cache.saveUserMemory($table);
		userMemory = PublishMethod.getLocalStorage($table);
		expect(userMemory.key).toBeDefined();
		expect(userMemory.cache).toBeDefined();

		userMemory = null;
	});

	it('PublishMethod.clear($table)', function(){
		PublishMethod.clear($table);
		let userMemory = PublishMethod.getLocalStorage($table);
		expect(userMemory).toEqual({});

		userMemory = null;
	});

	it('PublishMethod.getRowData($table, target)', function(){
		let tr = table.querySelector('tbody tr:first-child');
		let trList = table.querySelectorAll('tbody tr');
		let rowData = null;
		// Element 返回Object形式数据
		rowData = PublishMethod.getRowData($table, tr);
		expect(rowData.createDate).toBe('2015-03-12');
		// NodeList 返回数组
		rowData = PublishMethod.getRowData($table, trList);
		expect(rowData.length).toBe(trList.length);

		tr = null;
		trList = null;
		rowData = null;
	});

	it('PublishMethod.setSort($table, sortJson, callback, refresh)', function(){
		let settings = Cache.getSettings($table);
		let sortJson = {name:'DESC', createDate:'ASC'};
		let callback = jasmine.createSpy('callback');
		expect(settings.sortData).toEqual({});
		PublishMethod.setSort($table, sortJson, callback, false);

		settings = Cache.getSettings($table);
		expect(settings.sortData).toEqual(sortJson);

		expect(jTool('th[th-name="name"]', $table).attr('sorting')).toBe('DESC');
		expect(jTool('th[th-name="createDate"]', $table).attr('sorting')).toBe('ASC');

		settings = null;
		sortJson = null;
		callback = null;
	});

});
