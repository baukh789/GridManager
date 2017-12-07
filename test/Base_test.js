'use strict';
import { jTool, Base } from '../src/js/Base';
/**
 * 验证类的属性及方法总量
 */
describe('Base 验证类的属性及方法总量', function() {
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
		expect(getPropertyCount(Object.getOwnPropertyNames(Object.getPrototypeOf(Base)))).toBe(10 + 1);
	});
});

/**
 * 属性及方法验证
 */
describe('Base 属性及方法验证', function() {
	it('Base.outLog(msg, type)', function(){
		expect(Base.outLog).toBeDefined();
		expect(Base.outLog.length).toBe(2);

		// 存储console, 用于在测方式完成后原还conole对象
		console._info = console.info;
		console._warn = console.warn;
		console._error = console.error;
		console._log = console.log;

		// 验证 type = 'info'
		console.info = jasmine.createSpy("info");
		Base.outLog('hello GridManager', 'info');
		expect(console.info).toHaveBeenCalledWith('GridManager Info: ', 'hello GridManager');

		// 验证 type = 'warn'
		console.warn = jasmine.createSpy("warn");
		Base.outLog('hello GridManager', 'warn');
		expect(console.warn).toHaveBeenCalledWith('GridManager Warn: ', 'hello GridManager');

		// 验证 type = 'warn'
		console.error = jasmine.createSpy("error");
		Base.outLog('hello GridManager', 'error');
		expect(console.error).toHaveBeenCalledWith('GridManager Error: ', 'hello GridManager');

		// 验证 type = 'log'
		console.log = jasmine.createSpy("log");
		Base.outLog('hello GridManager', 'log');
		expect(console.log).toHaveBeenCalledWith('GridManager: ', 'hello GridManager');

		// 验证 type = undefined
		Base.outLog('hello GridManager');
		expect(console.log).toHaveBeenCalledWith('GridManager: ', 'hello GridManager');

		// 还原console
		console.info = console._info;
		console.warn = console._warn;
		console.error = console._error;
		console.log = console._log;
	});

	it('Base.getKey($table)', function(){
		expect(Base.getKey).toBeDefined();
		expect(Base.getKey.length).toBe(1);

		let table = document.createElement('table');
		table.setAttribute('grid-manager', 'hello-gm');
		expect(Base.getKey(jTool(table))).toBe('hello-gm');
		table = null;
	});

	it('Base.getColTd', function(){
		expect(Base.getColTd).toBeDefined();
		expect(Base.getColTd.length).toBe(1);
	});

	it('Base.setAreVisible', function(){
		expect(Base.setAreVisible).toBeDefined();
		expect(Base.setAreVisible.length).toBe(3);
	});

	it('Base.getTextWidth', function(){
		expect(Base.getTextWidth).toBeDefined();
		expect(Base.getTextWidth.length).toBe(1);
	});

	it('Base.showLoading', function(){
		expect(Base.showLoading).toBeDefined();
		expect(Base.showLoading.length).toBe(2);
	});

	it('Base.hideLoading', function(){
		expect(Base.hideLoading).toBeDefined();
		expect(Base.hideLoading.length).toBe(2);
	});

	it('Base.updateInteractive', function(){
		expect(Base.updateInteractive).toBeDefined();
		expect(Base.updateInteractive.length).toBe(2);
	});

	it('Base.updateScrollStatus', function(){
		expect(Base.updateScrollStatus).toBeDefined();
		expect(Base.updateScrollStatus.length).toBe(1);
	});

});
