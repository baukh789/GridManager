/**
 * Created by baukh on 17/4/21.
 */

import jTool from '../src/js/jTool';
import testData from '../src/data/testData';
describe('Drag', function() {
	let table = null;
	let $table = null;
	let gmName = 'test-drag';
	beforeAll(function () {
		// 引入组件, 实例化 Element.prototype.GM
		require('../src/js/index').default;

		table = document.createElement('table');
		table.setAttribute('grid-manager', gmName);
		document.querySelector('body').appendChild(table);
		$table = jTool('table[grid-manager="'+ gmName +'"]');
		document.querySelector('table[grid-manager="'+ gmName +'"]').GM({
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
		table = null;
		$table = null;
		gmName = null;
		Element.prototype.GM = Element.prototype.GridManager = null;
		document.body.innerHTML = '';
	});

	it('禁用文字选择效果', function(){
		let _body = null;
		let dragAction = null;
		jasmine.clock().install();
		_body = jTool('body');
		expect(_body.hasClass('no-select-text')).toBe(false);
	});
});
