/**
 * Created by baukh on 17/6/20.
 */
import '../src/js/index';
import testData from '../src/data/testData';

describe('index.js Element.prototype.GM', function() {
	let table = null;
	let div = null;
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
		div = document.createElement('div');
		document.body.appendChild(table);
		document.body.appendChild(div);
	});

	afterEach(function(){
		// 还原console
		console.info = console._info;
		console.warn = console._warn;
		console.error = console._error;
		console.log = console._log;

		document.body.innerHTML = '';
		table = null;
		div = null;
		arg = null;
	});
	it('验证Element.prototype 是否绑定成功', function(){
		expect(Element.prototype.GridManager).toBeDefined();
		expect(Element.prototype.GM).toBeDefined();
		expect(Element.prototype.GridManager).toBe(Element.prototype.GM);
	});

	it('验证GridManager 挂载至window 是否成功', function(){
		expect(window.GridManager).toBeDefined();
		expect(window.GM).toBeDefined();
		expect(window.GridManager).toBe(window.GM);
	});

	it('GM() 与 GridManager()', function(){
		expect(table.GM === table.GridManager).toBe(true);
	});

	it('非 table 的Element', function(){
		expect(div.GM()).toBeUndefined();
		expect(console.error).toHaveBeenCalledWith('GridManager Error: ', '不支持对非table标签实例化');
	});

	it('GM() 参数为空', function(){
		expect(table.GM()).toBeDefined();
	});

	it('未传递方法名参数', function(){
		expect(table.GM({'name': 'cc'})).toBeDefined();
	});

	it('未存在回调函数', function(){
		expect(table.GM('init', {})).toBeDefined();
	});

	it('完整参数', function(){
		arg = {
			ajax_data: testData,
			gridManagerName: 'test-index',
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
		expect(table.GM('init', arg, callback)).toBeDefined();
		expect(callback).toHaveBeenCalled();
		callback = null;
	});

	it('错误的方法名', function(){
		expect(table.GM('errorFnName', {'name': 'cc'})).toBeUndefined();
		expect(console.error).toHaveBeenCalledWith('GridManager Error: ', '方法调用错误，请确定方法名[errorFnName]是否正确');
	});

	it('非init方法, 且当前并未实例化', function(){
		table.GM('destroy');
		expect(table.GM('get', {'name': 'cc'})).toBeUndefined();
		expect(console.error).toHaveBeenCalledWith('GridManager Error: ', '方法调用错误，请确定表格已实例化');
	});
});
