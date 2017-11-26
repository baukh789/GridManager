/**
 * Created by baukh on 17/4/21.
 */

import '../build/css/GridManager.css';
import { jTool } from '../src/js/Base';
import testData from '../src/data/testData';
import GridManager from '../src/js/GridManager';
describe('Drag', function() {
	let table = null;
	let $table = null;
	let gmName = 'test-drag';
	beforeAll(function () {
		table = document.createElement('table');
		table.setAttribute('grid-manager', gmName);
		document.querySelector('body').appendChild(table);
		$table = jTool('table[grid-manager="'+ gmName +'"]');
		var arg = {
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
		};
		new GridManager().init(table, arg);
	});
	afterAll(function () {
		table = null;
		$table = null;
		gmName = null;
		document.body.innerHTML = '';
	});

	it('禁用文字选择效果', function(){
		let _body = null;
		let dragAction = null;
		// jasmine.clock().install();
		_body = jTool('body');
		expect(_body.hasClass('no-select-text')).toBe(false);
	});
});
