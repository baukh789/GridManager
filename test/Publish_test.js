/**
 * Created by baukh on 17/4/17.
 * 注意: 公开方法在实际调用时 与 测试时方法不同, document.querySelector('table').GM('get');
 */
'use strict';
import {PublishMethod, publishMethodArray} from '../src/js/Publish';
import testData from '../src/data/testData';

describe('publishMethodArray', function() {
	it('公开方法列表', function () {
		expect(publishMethodArray).toEqual(['init', 'get', 'getLocalStorage', 'clear', 'getRowData', 'setSort', 'showTh', 'hideTh', 'exportGridToXls', 'setQuery', 'setAjaxData', 'refreshGrid', 'getCheckedTr', 'getCheckedData']);
	});
});

/**
 * 验证类的属性及方法总量
 */
describe('Publish 验证类的属性及方法总量', function() {
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
		expect(getPropertyCount(Object.getOwnPropertyNames(Object.getPrototypeOf(PublishMethod)))).toBe(14 + 1);
	});
});

describe('PublishMethod.init(table, settings, callback)', function() {
	let table = null;
	let arg = null;
	beforeEach(function(){
		// 存储console, 用于在测方式完成后原还console对象
		console._error = console.error;
		console.error = jasmine.createSpy("error");

		table = document.createElement('table');
		document.body.appendChild(table);
		arg = null;
	});

	afterEach(function(){
		console.error = console._error;
		document.body.innerHTML = '';
		table = null;
		arg = null;
	});

	it('基础验证', function () {
		expect(PublishMethod.init).toBeDefined();
		expect(PublishMethod.init.length).toBe(3);
	});

	it('配置参为空', function () {
		PublishMethod.init(table);
		expect(console.error).toHaveBeenCalledWith('GridManager Error: ', 'init()方法中未发现有效的参数');
	});

	it('columnData 为空', function () {
		arg = {
			gridManagerName: 'test-publish'
		};
		PublishMethod.init(table, arg);
		expect(console.error).toHaveBeenCalledWith('GridManager Error: ', '请对参数columnData进行有效的配置');
	});

	// gridManagerName 为空
	it('gridManagerName 为空', function () {
		arg = {
			columnData: [{
				key: 'url',
				text: '链接'
			}]
		};
		PublishMethod.init(table, arg);
		expect(console.error).toHaveBeenCalledWith('GridManager Error: ', '请在html标签中为属性[grid-manager]赋值或在配置项中配置gridManagerName');
	});

	it('当前表格已经渲染', function () {
		arg = {
			gridManagerName: 'test-publish',
			columnData: [{
				key: 'url',
				text: '链接'
			}]
		};
		table.className = 'GridManager-ready';
		PublishMethod.init(table, arg);
		expect(console.error).toHaveBeenCalledWith('GridManager Error: ', '渲染失败,可能该表格已经渲染或正在渲染');
	});

	it('当前表格正在渲染', function () {
		arg = {
			gridManagerName: 'test-publish',
			columnData: [{
				key: 'url',
				text: '链接'
			}]
		};
		table.className = 'GridManager-loading';
		PublishMethod.init(table, arg);
		expect(console.error).toHaveBeenCalledWith('GridManager Error: ', '渲染失败,可能该表格已经渲染或正在渲染');
	});

	it('回调函数是否调用', function () {
		table.className = '';
		arg = {
			ajax_data: testData,
			gridManagerName: 'test-publish',
			columnData: [
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

		let callback = jasmine.createSpy('callback');
		PublishMethod.init(table, arg, callback);
		expect(callback).toHaveBeenCalled();
	});
});


describe('PublishMethod.get(table)', function() {
	let table = null;
	let arg = null;
	beforeEach(function(){
		table = document.createElement('table');
		document.body.appendChild(table);
		arg = null;
	});

	afterEach(function(){
		table = null;
		arg = null;
		document.body.innerHTML = '';
	});

	it('基础验证', function () {
		expect(PublishMethod.get).toBeDefined();
		expect(PublishMethod.get.length).toBe(1);
	});

	it('参数为空', function () {
		expect(PublishMethod.get()).toEqual({});
	});

	it('验证返回值', function () {
		// 抽取两个值进行较验
		expect(PublishMethod.get(table).gridManagerName).toBe('');
		expect(PublishMethod.get(table).sortKey).toBe('sort_');
	});
});


describe('PublishMethod.getLocalStorage(table)', function() {
	let table = null;
	let arg = null;
	beforeEach(function(){
		table = document.createElement('table');
		document.body.appendChild(table);
		arg = null;
	});

	afterEach(function(){
		table = null;
		arg = null;
		document.body.innerHTML = '';
	});

	it('基础验证', function () {
		expect(PublishMethod.getLocalStorage).toBeDefined();
		expect(PublishMethod.getLocalStorage.length).toBe(1);
	});

	it('参数为空', function () {
		expect(PublishMethod.getLocalStorage()).toEqual({});
	});

	it('验证返回值', function () {
		// 当前表格并不存在本地存储, 所以返回为空对象
		expect(PublishMethod.getLocalStorage(table)).toEqual({});
	});
});

describe('PublishMethod.clear(table)', function() {
	let table = null;
	let arg = null;
	beforeEach(function () {
		// 存储console, 用于在测方式完成后原还console对象
		console._warn = console.warn;
		console.warn = jasmine.createSpy("warn");

		table = document.createElement('table');
		document.body.appendChild(table);
		arg = null;
	});

	afterEach(function () {
		console.error = console._error;
		document.body.innerHTML = '';
		table = null;
		arg = null;
	});

	it('基础验证', function () {
		expect(PublishMethod.clear).toBeDefined();
		expect(PublishMethod.clear.length).toBe(1);
	});

	it('console提示文本', function () {
		PublishMethod.clear(table);
		expect(console.warn).toHaveBeenCalledWith('GridManager Warn: ', '用户记忆被清除: 通过clear()方法清除');
	});
});


describe('PublishMethod.getRowData(table, target)', function() {
	let table = null;
	let arg = null;
	let trList = null;
	beforeEach(function () {
		table = document.createElement('table');
		document.body.appendChild(table);
		arg = {
			ajax_data: testData,
			gridManagerName: 'test-publish-getRowData',
			columnData: [
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
		PublishMethod.init(table, arg);
		trList = document.querySelectorAll('tbody tr');
	});

	afterEach(function () {
		table = null;
		arg = null;
		trList = null;
	});

	it('基础验证', function () {
		expect(PublishMethod.getRowData).toBeDefined();
		expect(PublishMethod.getRowData.length).toBe(2);
	});

	it('target为空', function () {
		expect(PublishMethod.getRowData(table)).toEqual({});
	});

	it('参数完整', function () {
		expect(PublishMethod.getRowData(table, trList[0])).toEqual(testData.data[0]);
		expect(PublishMethod.getRowData(table, trList[2])).toEqual(testData.data[2]);
	});
});

describe('PublishMethod.setSort(table, sortJson, callback, refresh)', function() {
	it('基础验证', function () {
		expect(PublishMethod.setSort).toBeDefined();
		expect(PublishMethod.setSort.length).toBe(4);
	});
});

describe('PublishMethod.showTh(table, target)', function() {
	it('基础验证', function () {
		expect(PublishMethod.showTh).toBeDefined();
		expect(PublishMethod.showTh.length).toBe(2);
	});
});

describe('PublishMethod.hideTh(table, target)', function() {
	it('基础验证', function () {
		expect(PublishMethod.hideTh).toBeDefined();
		expect(PublishMethod.hideTh.length).toBe(2);
	});
});

describe('PublishMethod.exportGridToXls(table, fileName, onlyChecked)', function() {
	it('基础验证', function () {
		expect(PublishMethod.exportGridToXls).toBeDefined();
		expect(PublishMethod.exportGridToXls.length).toBe(3);
	});
});

describe('PublishMethod.setQuery(table, query, isGotoFirstPage, callback)', function() {
	it('基础验证', function () {
		expect(PublishMethod.setQuery).toBeDefined();
		expect(PublishMethod.setQuery.length).toBe(4);
	});
});

describe('PublishMethod.setAjaxData(table, ajaxData)', function() {
	it('基础验证', function () {
		expect(PublishMethod.setAjaxData).toBeDefined();
		expect(PublishMethod.setAjaxData.length).toBe(2);
	});
});

describe('PublishMethod.refreshGrid(table, isGotoFirstPage, callback)', function() {
	it('基础验证', function () {
		expect(PublishMethod.refreshGrid).toBeDefined();
		expect(PublishMethod.refreshGrid.length).toBe(3);
	});
});

describe('PublishMethod.getCheckedTr(table)', function() {
	it('基础验证', function () {
		expect(PublishMethod.getCheckedTr).toBeDefined();
		expect(PublishMethod.getCheckedTr.length).toBe(1);
	});
});

describe('PublishMethod.getCheckedTr(table)', function() {
	it('基础验证', function () {
		expect(PublishMethod.getCheckedData).toBeDefined();
		expect(PublishMethod.getCheckedData.length).toBe(1);
	});
});
