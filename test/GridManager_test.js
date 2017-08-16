/**
 * Created by baukh on 17/6/20.
 */
import jTool from '../src/js/jTool';
import testData from '../src/data/testData';

describe('GridManager.js', function() {
	let table = null;
	let $table = null;
	let gmName = 'test-gridmanager';
	beforeAll(function(){
		// 引入组件, 实例化 Element.prototype.GM
		require('../src/js/GridManager').default;
		table = document.createElement('table');
		table.setAttribute('grid-manager', gmName);
		document.querySelector('body').appendChild(table);
		$table = jTool(table);
	});
	afterAll(function () {
		table = null;
		$table = null;
		gmName = null;
		Element.prototype.GM = Element.prototype.GridManager = null;
		document.body.innerHTML = '';
	});

	// 测试init方法
	it('GridManager.init($table, arg, callback)', function() {
		let callbackFN = jasmine.createSpy('callback');
		var arg = {
			ajax_data: testData
			,disableCache: true
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
		};
		table.GridManager(arg, callbackFN);
        expect(callbackFN).toHaveBeenCalled();

		arg = null;
		callbackFN = null;
	});

	// 验证Element.prototype 是否绑定成功
	it('验证Element.prototype 是否绑定成功', function(){
		expect(Element.prototype.GridManager).toBeDefined();
		expect(Element.prototype.GM).toBeDefined();
		expect(Element.prototype.GridManager).toBe(Element.prototype.GM);
	});

	// 验证各模块是否捆绑至GridManager上, 方法是验证生成的实例内是否存在指定模块中的某一个属性
	it('验证 Adjust 模块是否捆绑至GridManager', function(){
		expect(table[`jTool${jTool.version}`].gridManager.html).toBeDefined();
	});

	it('验证 AjaxPage 模块是否捆绑至GridManager', function(){
		expect(table[`jTool${jTool.version}`].gridManager.html).toBeDefined();
	});

	it('验证 Base 模块是否捆绑至GridManager', function(){
		expect(table[`jTool${jTool.version}`].gridManager.outLog).toBeDefined();
	});

	it('验证 Cache 模块是否捆绑至GridManager', function(){
		expect(table[`jTool${jTool.version}`].gridManager.getSettings).toBeDefined();
	});

	it('验证 Checkbox 模块是否捆绑至GridManager', function(){
		expect(table[`jTool${jTool.version}`].gridManager.html).toBeDefined();
	});

	it('验证 Config 模块是否捆绑至GridManager', function(){
		expect(table[`jTool${jTool.version}`].gridManager.html).toBeDefined();
	});

	it('验证 Core 模块是否捆绑至GridManager', function(){
		expect(table[`jTool${jTool.version}`].gridManager.__refreshGrid).toBeDefined();
	});

	it('验证 Drag 模块是否捆绑至GridManager', function(){
		expect(table[`jTool${jTool.version}`].gridManager.bindDragEvent).toBeDefined();
	});

	it('验证 Export 模块是否捆绑至GridManager', function(){
		expect(table[`jTool${jTool.version}`].gridManager.html).toBeDefined();
	});

	it('验证 Hover 模块是否捆绑至GridManager', function(){
		expect(table[`jTool${jTool.version}`].gridManager.onTbodyHover).toBeDefined();
	});

	it('验证 I18N 模块是否捆绑至GridManager', function(){
		expect(table[`jTool${jTool.version}`].gridManager.getLanguage).toBeDefined();
	});

	it('验证 Menu 模块是否捆绑至GridManager', function(){
		expect(table[`jTool${jTool.version}`].gridManager.checkMenuPageAction).toBeDefined();
	});

	it('验证 Order 模块是否捆绑至GridManager', function(){
		expect(table[`jTool${jTool.version}`].gridManager.initDOM).toBeDefined();
	});

	it('验证 Publish 模块是否捆绑至GridManager', function(){
		expect(table[`jTool${jTool.version}`].gridManager.get).toBeDefined();
	});

	it('验证 Remind 模块是否捆绑至GridManager', function(){
		expect(table[`jTool${jTool.version}`].gridManager.html).toBeDefined();
	});

	it('验证 Scroll 模块是否捆绑至GridManager', function(){
		expect(table[`jTool${jTool.version}`].gridManager.bindScrollFunction).toBeDefined();
	});

	it('验证 Settings 模块是否捆绑至GridManager', function(){
		expect(table[`jTool${jTool.version}`].gridManager.supportDrag).toBeDefined();
	});

	it('验证 Sort 模块是否捆绑至GridManager', function(){
		expect(table[`jTool${jTool.version}`].gridManager.html).toBeDefined();
	});
});
