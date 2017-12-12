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

describe('Base.outLog(msg, type)', function() {
	let table = null;
	let arg = null;
	beforeEach(function(){
		// 存储console, 用于在测方式完成后原还console对象
		console._info = console.info;
		console._warn = console.warn;
		console._error = console.error;
		console._log = console.log;
		console.info = jasmine.createSpy("info");
		console.warn = jasmine.createSpy("warn");
		console.error = jasmine.createSpy("error");
		console.log = jasmine.createSpy("log");

		table = document.createElement('table');
		document.body.appendChild(table);
		arg = null;
	});

	afterEach(function(){
		// 还原console
		console.info = console._info;
		console.warn = console._warn;
		console.error = console._error;
		console.log = console._log;

		document.body.innerHTML = '';
		table = null;
		arg = null;
	});

	it('基础验证', function(){
		expect(Base.outLog).toBeDefined();
		expect(Base.outLog.length).toBe(2);
	});

	it('info', function(){
		Base.outLog('hello GridManager', 'info');
		expect(console.info).toHaveBeenCalledWith('GridManager Info: ', 'hello GridManager');
	});

	it('warn', function(){
		Base.outLog('hello GridManager', 'warn');
		expect(console.warn).toHaveBeenCalledWith('GridManager Warn: ', 'hello GridManager');
	});

	it('error', function(){
		Base.outLog('hello GridManager', 'error');
		expect(console.error).toHaveBeenCalledWith('GridManager Error: ', 'hello GridManager');
	});

	it('log', function(){
		Base.outLog('hello GridManager', 'log');
		expect(console.log).toHaveBeenCalledWith('GridManager: ', 'hello GridManager');
	});

	it('undefined', function(){
		Base.outLog('hello GridManager');
		expect(console.log).toHaveBeenCalledWith('GridManager: ', 'hello GridManager');
	});
});

describe('Base.getKey($table)', function() {
	let table = null;
	beforeEach(function(){
		table = document.createElement('table');
	});

	afterEach(function(){
		table = null;
	});

	it('基础验证', function () {
		expect(Base.getKey).toBeDefined();
		expect(Base.getKey.length).toBe(1);
	});

	it('返回值验证', function () {
		table.setAttribute('grid-manager', 'hello-gm');
		expect(Base.getKey(jTool(table))).toBe('hello-gm');
	});
});

describe('Base.getColTd($th)', function() {
	let table = null;
	beforeEach(function(){
		// 注意: phatomejs 会将模版字符串中的字行编译为 Text(nodeType: 3), 所以在这里需要将th及td间的空格去除
		let table = `
				<table grid-manager="test-get-col-td">
					<thead>
						<tr><th id="th1">th1</th><th id="th2">th2</th></tr>
					</thead>
					<tbody>
						<tr><td id="td1">td1</td><td id="td2">td2</td></tr>
					</tbody>
				</table>
			`;
		document.body.innerHTML = table;
	});

	afterEach(function(){
		table = null;
		document.body.innerHTML = '';
	});

	it('基础验证', function () {
		expect(Base.getColTd).toBeDefined();
		expect(Base.getColTd.length).toBe(1);
	});

	it('返回值验证', function () {
		expect(Base.getColTd(jTool('#th2')).get(0)).toBe(document.querySelector('#td2'));
	});
});

describe('Base.setAreVisible($thList, isVisible, cb)', function() {
	it('基础验证', function () {
		expect(Base.setAreVisible).toBeDefined();
		expect(Base.setAreVisible.length).toBe(3);
	});
});

describe('Base.getTextWidth(th)', function() {
	it('基础验证', function () {
		expect(Base.getTextWidth).toBeDefined();
		expect(Base.getTextWidth.length).toBe(1);
	});
});

describe('Base.showLoading(dom, cb)', function() {
	it('基础验证', function () {
		expect(Base.showLoading).toBeDefined();
		expect(Base.showLoading.length).toBe(2);
	});

	it('回调函数是否执行', function () {
		jasmine.clock().install();
		let callback = jasmine.createSpy('callback');
		Base.showLoading(jTool('body'), callback);
		jasmine.clock().tick(100);
		expect(callback).toHaveBeenCalled();
		jasmine.clock().uninstall();
		callback = null;
	});
});

describe('Base.hideLoading(dom, cb)', function() {
	it('基础验证', function () {
		expect(Base.hideLoading).toBeDefined();
		expect(Base.hideLoading.length).toBe(2);
	});

	it('回调函数是否执行', function () {
		jasmine.clock().install();
		let callback = jasmine.createSpy('callback');
		Base.hideLoading(jTool('body'), callback);
		jasmine.clock().tick(500);
		expect(callback).toHaveBeenCalled();
		jasmine.clock().uninstall();
		callback = null;
	});
});

describe('Base.updateInteractive($table, interactive)', function() {
	let $table = null;
	let $tableWrap = null;
	beforeEach(function(){
		document.body.innerHTML = '<div class="table-wrap"><table></table></div>';
		$table = jTool('table');
		$tableWrap = $table.closest('.table-wrap');
	});

	afterEach(function(){
		document.body.innerHTML = '';
		$table = null;
		$tableWrap = null;
	});

	it('基础验证', function () {
		expect(Base.updateInteractive).toBeDefined();
		expect(Base.updateInteractive.length).toBe(2);
	});

	it('宽度交互', function () {
		Base.updateInteractive($table, 'Adjust');
		expect($tableWrap.attr('user-interactive')).toBe('Adjust');
	});

	it('位置交互', function () {
		Base.updateInteractive($table, 'Drag');
		expect($tableWrap.attr('user-interactive')).toBe('Drag');
	});

	it('无交互', function () {
		Base.updateInteractive($table);
		expect($tableWrap.attr('user-interactive')).toBeUndefined();
	});
});


describe('Base.updateScrollStatus($table)', function() {
	let $table = null;
	beforeEach(function(){
	});

	afterEach(function(){
		document.body.innerHTML = '';
		$table = null;
	});

	it('基础验证', function () {
		expect(Base.updateScrollStatus).toBeDefined();
		expect(Base.updateScrollStatus.length).toBe(1);
	});

	it('100%宽度', function () {
		document.body.innerHTML = '<div class="table-div"><table style="width: 100%"></table></div>';
		$table = jTool('table');
		expect(Base.updateScrollStatus($table)).toBe('hidden');
	});

	it('90%宽度', function () {
		document.body.innerHTML = '<div class="table-div"><table style="width: 90%"></table></div>';
		$table = jTool('table');
		expect(Base.updateScrollStatus($table)).toBe('auto');
	});
});

describe('Base.getVisibleForColumn(col)', function() {
	let col = null;
	beforeEach(function(){
	});

	afterEach(function(){
		document.body.innerHTML = '';
		col = null;
	});

	it('基础验证', function () {
		expect(Base.getVisibleForColumn).toBeDefined();
		expect(Base.getVisibleForColumn.length).toBe(1);
	});

	it('isShow= true', function(){
		col = {isShow: true};
		expect(Base.getVisibleForColumn(col)).toBe('visible');
	});

	it('isShow= false', function(){
		col = {isShow: false};
		expect(Base.getVisibleForColumn(col)).toBe('none');
	});
});
