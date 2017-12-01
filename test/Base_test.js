'use strict';
import '../build/css/GridManager.css';
import { jTool, Base } from '../src/js/Base';
// import testData from '../src/data/testData';
// import GridManager from '../src/js/GridManager';
/**
 * 对象完整性验证
 */
describe('Base 对象完整性验证', function() {
	it('对象完整性验证 Base.outLog', function(){
		expect(Base.outLog).toBeDefined();
		expect(Base.outLog.length).toBe(2);
	});

	it('对象完整性验证 Base.getKey', function(){
		expect(Base.getKey).toBeDefined();
		expect(Base.getKey.length).toBe(1);
	});

	it('对象完整性验证 Base.getColTd', function(){
		expect(Base.getColTd).toBeDefined();
		expect(Base.getColTd.length).toBe(1);
	});

	it('对象完整性验证 Base.setAreVisible', function(){
		expect(Base.setAreVisible).toBeDefined();
		expect(Base.setAreVisible.length).toBe(3);
	});

	it('对象完整性验证 Base.getTextWidth', function(){
		expect(Base.getTextWidth).toBeDefined();
		expect(Base.getTextWidth.length).toBe(1);
	});

	it('对象完整性验证 Base.showLoading', function(){
		expect(Base.showLoading).toBeDefined();
		expect(Base.showLoading.length).toBe(2);
	});

	it('对象完整性验证 Base.hideLoading', function(){
		expect(Base.hideLoading).toBeDefined();
		expect(Base.hideLoading.length).toBe(2);
	});

	it('对象完整性验证 Base.updateInteractive', function(){
		expect(Base.updateInteractive).toBeDefined();
		expect(Base.updateInteractive.length).toBe(2);
	});

	it('对象完整性验证 Base.updateScrollStatus', function(){
		expect(Base.updateScrollStatus).toBeDefined();
		expect(Base.updateScrollStatus.length).toBe(1);
	});

});

/**
 * 验证原型方法总数
 */
describe('Base 验证原型方法总数', function() {
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
		expect(getPropertyCount(Object.getOwnPropertyNames(Object.getPrototypeOf(Base)))).toBe(9 + 1);
	});
});
// describe('Base.js', function() {
// 	let table = null;
// 	let $table = null;
// 	let gmName = 'test-base';
// 	beforeAll(function(){
//
// 		table = document.createElement('table');
// 		table.setAttribute('grid-manager', gmName);
// 		document.querySelector('body').appendChild(table);
// 		$table = jTool('table[grid-manager="'+ gmName +'"]');
// 		var arg = {
// 			ajax_data: testData
// 			,disableCache: true
// 			,i18n: 'en-us'
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
// 	it('Base.getColTd($th)', function(){
// 		let $th = jTool('th[th-name="name"]', $table);
// 		expect(Base.getColTd($th).length).toBe(8);
// 	});
//
// 	// 验证获取th内文本的最低宽度
// 	// it('Base.getTextWidth(th)', function(){
// 	// 	let $th = jTool('th[th-name="name"]', $table);
// 	// 	expect(Base.getTextWidth($th)).toBe(36);
// 	// });
//
// 	it('Base.showLoading(dom ,cb)', function(){
// 		jasmine.clock().install();
// 		let tableWrap = $table.closest('.table-wrap');
// 		let callbackFN = jasmine.createSpy('callback');
// 		expect(jTool('.load-area', tableWrap).length).toBe(0);
// 		Base.showLoading(tableWrap, callbackFN);
// 		expect(jTool('.load-area', tableWrap).length).toBe(1);
// 		jasmine.clock().tick(101);
// 		expect(callbackFN).toHaveBeenCalled();
//
// 		jasmine.clock().uninstall();
// 		tableWrap = null;
// 		callbackFN = null;
// 	});
//
// 	it('Base.hideLoading(dom ,cb)', function(){
// 		jasmine.clock().install();
// 		let tableWrap = $table.closest('.table-wrap');
// 		let callbackFN = jasmine.createSpy('callback');
// 		expect(jTool('.load-area', tableWrap).length).toBe(1);
// 		Base.hideLoading(tableWrap, callbackFN);
// 		jasmine.clock().tick(501);
// 		expect(jTool('.load-area', tableWrap).length).toBe(0);
// 		expect(callbackFN).toHaveBeenCalled();
//
// 		jasmine.clock().uninstall();
// 		tableWrap = null;
// 		callbackFN = null;
// 	});
//
// 	it('Base.updateInteractive($table, interactive)', function(){
// 		let	tableWrap = $table.closest('.table-wrap');
// 		expect(tableWrap.attr('user-interactive') === 'undefined');
// 		Base.updateInteractive($table, 'Drag');
// 		expect(tableWrap.attr('user-interactive') === 'Drag');
//
// 		Base.updateInteractive($table, 'Adjust');
// 		expect(tableWrap.attr('user-interactive') === 'Adjust');
//
// 		Base.updateInteractive($table);
// 		expect(tableWrap.attr('user-interactive') === 'undefined');
// 		tableWrap = null;
// 	});
//
// 	it('Base.updateScrollStatus($table)', function(){
// 		expect(Base.updateScrollStatus($table)).toBe('hidden');
// 	});
//
// });
