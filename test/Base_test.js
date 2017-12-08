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

	it('Base.getColTd($th)', function(){
		expect(Base.getColTd).toBeDefined();
		expect(Base.getColTd.length).toBe(1);
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
		expect(Base.getColTd(jTool('#th2')).get(0)).toBe(document.querySelector('#td2'));
		document.body.innerHTML = '';
		table = null;
	});

	it('Base.setAreVisible($thList, isVisible, cb)', function(){
		expect(Base.setAreVisible).toBeDefined();
		expect(Base.setAreVisible.length).toBe(3);
	});

	it('Base.getTextWidth(th)', function(){
		expect(Base.getTextWidth).toBeDefined();
		expect(Base.getTextWidth.length).toBe(1);
	});

	it('Base.showLoading(dom, cb)', function(){
		expect(Base.showLoading).toBeDefined();
		expect(Base.showLoading.length).toBe(2);

		jasmine.clock().install();
		let callback = jasmine.createSpy('callback');
		Base.showLoading(jTool('body'), callback);
		jasmine.clock().tick(100);
		expect(callback).toHaveBeenCalled();
		jasmine.clock().uninstall();

	});

	it('Base.hideLoading(dom, cb)', function(){
		expect(Base.hideLoading).toBeDefined();
		expect(Base.hideLoading.length).toBe(2);

		jasmine.clock().install();
		let callback = jasmine.createSpy('callback');
		Base.hideLoading(jTool('body'), callback);
		jasmine.clock().tick(500);
		expect(callback).toHaveBeenCalled();
		jasmine.clock().uninstall();
	});

	it('Base.updateInteractive($table, interactive)', function(){
		expect(Base.updateInteractive).toBeDefined();
		expect(Base.updateInteractive.length).toBe(2);

		document.body.innerHTML = '<div class="table-wrap"><table></table></div>';
		let $table = jTool('table');
		let	tableWrap = $table.closest('.table-wrap');
		Base.updateInteractive($table, 'Adjust');
		expect(tableWrap.attr('user-interactive')).toBe('Adjust');

		Base.updateInteractive($table, 'Drag');
		expect(tableWrap.attr('user-interactive')).toBe('Drag');

		Base.updateInteractive($table);
		expect(tableWrap.attr('user-interactive')).toBeUndefined();

		document.body.innerHTML = '';
		$table = null;
		tableWrap = null;
	});

	it('Base.updateScrollStatus($table)', function(){
		expect(Base.updateScrollStatus).toBeDefined();
		expect(Base.updateScrollStatus.length).toBe(1);

		let $table = null;
		let tableDiv = null;

		document.body.innerHTML = '<div class="table-div"><table style="width: 100%"></table></div>';
		$table = jTool('table');
		tableDiv = $table.closest('.table-div');
		expect(Base.updateScrollStatus($table)).toBe('hidden');

		document.body.innerHTML = '<div class="table-div"><table style="width: 90%"></table></div>';
		$table = jTool('table');
		tableDiv = $table.closest('.table-div');
		expect(Base.updateScrollStatus($table)).toBe('auto');

		document.body.innerHTML = '';
		$table = null;
		tableDiv = null;
	});

	it('Base.getVisibleForColumn(col)', function(){
		expect(Base.getVisibleForColumn).toBeDefined();
		expect(Base.getVisibleForColumn.length).toBe(1);

		let col = null;

		col = {isShow: true};
		expect(Base.getVisibleForColumn(col)).toBe('visible');

		col = {isShow: false};
		expect(Base.getVisibleForColumn(col)).toBe('none');

		col = null;
	});

});
