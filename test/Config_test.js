'use strict';
import jTool from '../src/js/jTool';
import Config from '../src/js/Config';
import testData from '../src/data/testData';
import '../src/css/GridManager.css';
describe('Config', function() {

	let table = null;
	let $table = null;
	let css = null;
	beforeAll(function(){
		// 引入组件, 实例化 Element.prototype.GM
		require('../src/js/GridManager').default;

		table = document.createElement('table');
		table.setAttribute('grid-manager', 'test-cache');
		document.querySelector('body').appendChild(table);
		$table = jTool('table[grid-manager="test-cache"]');
		document.querySelector('table[grid-manager="test-cache"]').GM({
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

	it('Config.html()', function() {
		let html= `<div class="config-area">
					<span class="config-action">
						<i class="iconfont icon-31xingdongdian"></i>
					</span>
					<ul class="config-list"></ul>
				</div>`;
		expect(Config.html().replace(/\s/g, '')).toBe(html.replace(/\s/g, ''));
	});

	it('测试Config事件', function(){
		jasmine.clock().install();
		jasmine.clock().tick(1000);
		let tableWarp = $table.closest('div.table-wrap');
		let configAction = jTool('.config-action', tableWarp);
		let configArea = configAction.closest('.config-area');
		// TODO 可以写个相关的博文: 如何测试包含css的karma配置. 跳入karma.conf.js -> module -> loaders
		expect(configArea.css('display')).toBe('none');
		configAction.trigger('click');
		expect(configArea.css('display')).toBe('block');

		jasmine.clock().uninstall();
		tableWarp = null;
		configAction = null;
		configArea = null;
	});
});
