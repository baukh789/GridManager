/**
 * Created by baukh on 17/4/21.
 */

import jTool from '../src/js/jTool';
import testData from '../src/data/testData';
import '../src/css/GridManager.css';
describe('Drag', function() {
	let table = null;
	let $table = null;
	beforeAll(function () {
		// 引入组件, 实例化 Element.prototype.GM
		require('../src/js/GridManager').default;

		table = document.createElement('table');
		table.setAttribute('grid-manager', 'test-cache');
		document.querySelector('body').appendChild(table);
		$table = jTool('table[grid-manager="test-cache"]');
		document.querySelector('table[grid-manager="test-cache"]').GM({
			ajax_data: testData
			, columnData: [
				{
					key: 'name',
					width: '100px',
					text: '名称'
				}, {
					key: 'info',
					text: '使用说明'
				}, {
					key: 'url',
					text: 'url'
				}, {
					key: 'createDate',
					text: '创建时间'
				}, {
					key: 'lastDate',
					text: '最后修改时间'
				}, {
					key: 'action',
					text: '操作',
					template: function (action, rowObject) {
						return '<span class="plugin-action edit-action" learnLink-id="' + rowObject.id + '">编辑</span>'
							+ '<span class="plugin-action del-action" learnLink-id="' + rowObject.id + '">删除</span>';
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

	it('禁用文字选择效果', function(){
		let _body = null;
		let dragAction = null;
		jasmine.clock().install();
		_body = jTool('body');
		expect(_body.hasClass('no-select-text')).toBe(false);

		dragAction = jTool('th[th-name="name"] .drag-action', $table);
		dragAction.trigger('mousedown');
		expect(_body.hasClass('no-select-text')).toBe(true);

		_body.trigger('mouseup');
		expect(_body.hasClass('no-select-text')).toBe(false);

		jasmine.clock().uninstall();
		_body = null;
		dragAction = null;
	});
});
