/**
 * Created by baukh on 17/4/17.
 * 注意: 公开方法在实际调用时 与 测试时方法不同, document.querySelector('table').GM('get');
 */

// 'use strict';
// import '../build/css/GridManager.css';
// import { jTool } from '../src/js/Base';
// import {PublishMethod, publishMethodArray} from '../src/js/Publish';
// import Cache from '../src/js/Cache';
// import Export from '../src/js/Export';
// import testData from '../src/data/testData';
// import testData2 from '../src/data/testData2';
// import GridManager from '../src/js/GridManager';
// describe('Publish.js', function() {
// 	let gmName = 'test-publish';
// 	let table = document.createElement('table');
// 	table.setAttribute('grid-manager', gmName);
// 	let $table = jTool(table);
// 	beforeAll(function(){
// 		document.querySelector('body').appendChild(table);
// 		var arg = {
// 			ajax_data: testData
// 			,query: {name: 'baukh'}
// 			,supportAjaxPage: true
// 			,columnData: [
// 				{
// 					key: 'name',
// 					width: '100px',
// 					text: '名称'
// 				},{
// 					key: 'info',
// 					text: '使用说明'
// 				},{
// 					key: 'url',
// 					text: 'url'
// 				},{
// 					key: 'createDate',
// 					text: '创建时间'
// 				},{
// 					key: 'lastDate',
// 					text: '最后修改时间'
// 				},{
// 					key: 'action',
// 					text: '操作',
// 					template: function(action, rowObject){
// 						return '<span class="plugin-action edit-action" learnLink-id="'+rowObject.id+'">编辑</span>'
// 							+'<span class="plugin-action del-action" learnLink-id="'+rowObject.id+'">删除</span>';
// 					}
// 				}
// 			]
// 		};
// 		new GridManager().init(table, arg);
// 	});
// 	afterAll(function () {
// 		table = null;
// 		$table = null;
// 		gmName = null;
// 		document.body.innerHTML = '';
// 	});
//
// 	it('核对对外公开方法总数 及 方法名匹配', function(){
// 		expect(publishMethodArray.length).toBe(14);
// 		let list = [
// 			'init',					// 初始化方法
// 			'setSort',				// 手动设置排序
// 			'get',					//通过jTool实例获取GridManager
// 			'showTh',				//显示Th及对应的TD项
// 			'hideTh',				//隐藏Th及对应的TD项
// 			'exportGridToXls',		//导出表格 .xls
// 			'getLocalStorage',		//获取指定表格的本地存储数据
// 			'setQuery',				//配置query 该参数会在分页触发后返回至pagingAfter(query)方法
// 			'setAjaxData',          //用于再次配置ajax_data数据, 配置后会根据配置的数据即刻刷新表格
// 			'refreshGrid',			//刷新表格 使用现有参数重新获取数据，对表格数据区域进行渲染
// 			'getCheckedTr',			//获取当前选中的行
// 			'getRowData',			//获取当前行渲染时使用的数据
// 			'getCheckedData',		//获取当前选中行渲染时使用的数据
// 			'clear'					//清除指定表的表格记忆数据
// 			];
// 		publishMethodArray.forEach(function(v, i){
// 			expect(list.indexOf(v)).not.toBe(-1);
// 		});
// 		list = null;
// 	});
//
// 	it('PublishMethod.get($table)', function(){
// 		let gm = null;
// 		gm = PublishMethod.get($table);
// 		expect(gm).toBeDefined();
// 		expect(gm['supportDrag']).toBe(true);
// 		expect(gm['sortData']).toEqual({});
// 		expect(gm['sortUpText']).toBe('ASC');
// 		expect(gm['width']).toBe('100%');
// 		expect(gm['height']).toBe('300px');
//
// 		gm = null;
// 	});
//
// 	it('PublishMethod.getLocalStorage($table)', function(){
// 		let userMemory = null;
// 		userMemory = PublishMethod.getLocalStorage($table);
// 		expect(userMemory.key).toEqual('/context.html-test-publish');
// 		Cache.saveUserMemory($table);
// 		userMemory = PublishMethod.getLocalStorage($table);
// 		expect(userMemory.key).toBeDefined();
// 		expect(userMemory.cache).toBeDefined();
//
// 		userMemory = null;
// 	});
//
// 	it('PublishMethod.clear($table)', function(){
// 		// expect($table.attr('grid-manager')).toBe('test-publish');
//
// 		let userMemory = null;
// 		PublishMethod.clear($table);
// 		userMemory = PublishMethod.getLocalStorage($table);
// 		expect(userMemory.cache).toEqual({});
// 		userMemory = null;
// 	});
//
// 	it('PublishMethod.getRowData($table, target)', function(){
// 		let tr = null;
// 		let trList = null;
// 		let rowData = null;
// 		tr = table.querySelector('tbody tr:first-child');
// 		trList = table.querySelectorAll('tbody tr');
//
// 		// Element 返回Object形式数据
// 		rowData = PublishMethod.getRowData($table, tr);
// 		expect(rowData.createDate).toBe('2015-03-12');
// 		// NodeList 返回数组
// 		rowData = PublishMethod.getRowData($table, trList);
// 		expect(rowData.length).toBe(trList.length);
//
// 		tr = null;
// 		trList = null;
// 		rowData = null;
// 	});
//
// 	it('PublishMethod.setSort($table, sortJson, callback, refresh)', function(){
// 		let settings = null;
// 		let sortJson = null;
// 		let callback = null;
// 		settings = Cache.getSettings($table);
// 		sortJson = {name:'DESC', createDate:'ASC'};
// 		callback = jasmine.createSpy('callback');
// 		expect(settings.sortData).toEqual({});
// 		PublishMethod.setSort($table, sortJson, callback, false);
//
// 		settings = Cache.getSettings($table);
// 		expect(settings.sortData).toEqual(sortJson);
//
// 		expect(jTool('th[th-name="name"]', $table).attr('sorting')).toBe('DESC');
// 		expect(jTool('th[th-name="createDate"]', $table).attr('sorting')).toBe('ASC');
//
// 		settings = null;
// 		sortJson = null;
// 		callback = null;
// 	});
//
// 	it('PublishMethod.hideTh($table, th)', function(){
// 		let visibleTh = null;
// 		let th = null;
// 		let thList = null;
// 		// 以下操作将自动生成列排除在外
// 		visibleTh = jTool('th[th-visible="visible"][gm-create="false"]', $table);
// 		expect(visibleTh.length).toBe(6);
//
// 		// 隐藏一列
// 		th = jTool('th[th-name="name"]', $table);
// 		PublishMethod.hideTh($table, th);
// 		visibleTh = jTool('th[th-visible="visible"][gm-create="false"]', $table);
// 		expect(visibleTh.length).toBe(5);
//
// 		// 隐藏全部
// 		thList = jTool('th[gm-create="false"]', $table);
// 		PublishMethod.hideTh($table, thList);
// 		visibleTh = jTool('th[th-visible="visible"][gm-create="false"]', $table);
// 		expect(visibleTh.length).toBe(0);
//
// 		visibleTh = null;
// 		th = null;
// 		thList = null;
// 	});
//
// 	it('PublishMethod.showTh($table, th)', function(){
// 		let visibleTh = null;
// 		let th = null;
// 		let thList = null;
// 		// 以下操作将自动生成列排除在外
// 		visibleTh = jTool('th[th-visible="visible"][gm-create="false"]', $table);
// 		expect(visibleTh.length).toBe(0);
//
// 		// 显示一列
// 		th = jTool('th[th-name="name"]', $table);
// 		PublishMethod.showTh($table, th);
// 		visibleTh = jTool('th[th-visible="visible"][gm-create="false"]', $table);
// 		expect(visibleTh.length).toBe(1);
//
// 		// 显示全部
// 		thList = jTool('th[gm-create="false"]', $table);
// 		PublishMethod.showTh($table, thList);
// 		visibleTh = jTool('th[th-visible="visible"][gm-create="false"]', $table);
// 		expect(visibleTh.length).toBe(6);
//
// 		visibleTh = null;
// 		th = null;
// 		thList = null;
// 	});
//
// 	it('PublishMethod.exportGridToXls($table, fileName, onlyChecked)', function(){
// 		expect(PublishMethod.exportGridToXls($table, 'test', true)).toBe(Export.__exportGridToXls($table, 'test', true));
// 	});
//
// 	it('PublishMethod.setQuery($table, query)', function(){
// 		let query = null;
// 		let settings = null;
//
// 		// 未执行setQuery时, 使用init时配置的query
// 		settings = Cache.getSettings($table);
// 		expect(settings.query).toEqual({name: 'baukh'});
//
// 		query = {
// 			testKey: 'love javascript'
// 		};
// 		PublishMethod.setQuery($table, query);
// 		settings = Cache.getSettings($table);
// 		expect(settings.query).toEqual({testKey: 'love javascript'});
//
// 		query = {
// 			testName: 'baukh'
// 		};
//
// 		PublishMethod.setQuery($table, query);
// 		settings = Cache.getSettings($table);
// 		expect(settings.query).toEqual({testName: 'baukh'});
//
// 		query = null;
// 		settings = null;
// 	});
//
// 	it('PublishMethod.setAjaxData($table, ajaxData)', function(){
// 		let settings = null;
// 		settings = Cache.getSettings($table);
// 		expect(settings.pageData.tSize).toBe(8);
//
// 		PublishMethod.setAjaxData($table, testData2);
// 		settings = Cache.getSettings($table);
// 		expect(settings.pageData.tSize).toBe(5);
//
// 		settings = null;
// 	});
//
// 	it('PublishMethod.refreshGrid($table, callback)', function(){
// 		let callback = null;
// 		callback = jasmine.createSpy('callback');
// 		PublishMethod.refreshGrid($table, callback);
// 		expect(callback).toHaveBeenCalled();
//
// 		callback = null;
// 	});
//
// 	it('PublishMethod.getCheckedTr(table)', function(){
// 		let checkedList = null;
// 		let checkboxList = null;
// 		checkedList = PublishMethod.getCheckedTr(table);
// 		expect(jTool.type(checkedList)).toBe('nodeList');
// 		expect(checkedList.length).toBe(0);
//
// 		checkboxList = jTool('tr td[gm-checkbox="true"] input', table);
// 		checkboxList.eq(0).trigger('click');
// 		checkedList = PublishMethod.getCheckedTr(table);
// 		expect(checkedList.length).toBe(1);
//
// 		checkboxList.eq(1).trigger('click');
// 		checkedList = PublishMethod.getCheckedTr(table);
// 		expect(checkedList.length).toBe(2);
//
// 		checkedList = null;
// 		checkboxList = null;
// 	});
//
// 	it('PublishMethod.getCheckedData(table)', function () {
// 		let checkedData = null;
// 		checkedData = PublishMethod.getCheckedData(table);
// 		expect(checkedData.length).toBe(2);
// 		expect(checkedData[0].name).toBe('baukh');
// 		expect(checkedData[1].name).toBe('kouzi');
//
// 		checkedData = null;
// 	});
//
// });
