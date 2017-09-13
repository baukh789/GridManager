'use strict';
import jTool from '../src/js/jTool';
import Config from '../src/js/Config';
import testData from '../src/data/testData';
describe('Config', function() {

	let table = null;
	let $table = null;
	let gmName = 'test-config';
	beforeAll(function(){
		// 引入组件, 实例化 Element.prototype.GM
		require('../src/js/index').default;

		table = document.createElement('table');
		table.setAttribute('grid-manager', gmName);
		document.querySelector('body').appendChild(table);
		$table = jTool('table[grid-manager="'+ gmName +'"]');
		document.querySelector('table[grid-manager="'+ gmName +'"]').GM({
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
		table = null;
		$table = null;
		gmName = null;
		Element.prototype.GM = Element.prototype.GridManager = null;
		document.body.innerHTML = '';
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

	it('测试展示隐藏配置区域事件', function(){
		jasmine.clock().install();
		jasmine.clock().tick(1000);
		let tableWarp = $table.closest('div.table-wrap');
		let configAction = jTool('.config-action', tableWarp);
		let configArea = configAction.closest('.config-area');
		expect(configArea.css('display')).toBe('none');
		configAction.trigger('click');
		expect(configArea.css('display')).toBe('block');

		jasmine.clock().uninstall();
		tableWarp = null;
		configAction = null;
		configArea = null;
	});

	it('测试展示隐藏第一列事件', function(){
		let tableWarp = $table.closest('div.table-wrap');
		let firstTh = $table.find('th').eq(0);
		let firstConfig = jTool('.config-list li[th-name='+ firstTh.attr('th-name') +']', tableWarp);
		// 未进行操作时,默认为显示.(由于是table类标签,使用的display = table-cell)
		expect(firstTh.css('display')).toBe('table-cell');

		// 触发针对第一列的配置事件, 成功后第一列将隐藏
		firstConfig.trigger('click');
		expect(firstTh.css('display')).toBe('none');

		// 再次触发针对第一列的配置事件, 成功后第一列将显示
		firstConfig.trigger('click');
		expect(firstTh.css('display')).toBe('table-cell');

		tableWarp = null;
		firstTh = null;
	});

	// TODO 此时获取不到对应节点  pagination.length = 0
	// it('Core.reset(dom, isSingleRow)', function(){
	// 	var pagination = $table.closest('.table-wrap').find('.page-toolbar');
	// 	expect(jTool('li.active', pagination).text()).toBe('1');
	// });
});
