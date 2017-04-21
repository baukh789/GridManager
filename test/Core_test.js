/**
 * Created by baukh on 17/4/19.
 */
'use strict';
import jTool from '../src/js/jTool';
import Core from '../src/js/Core';
import testData from '../src/data/testData';
import '../src/css/GridManager.css';
describe('Core', function() {
	let table = null;
	let $table = null;
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

	it('Core.__refreshGrid($table, callback)', function(){
		let callback = jasmine.createSpy('callback');
		Core.__refreshGrid($table, callback);
		expect(callback).toHaveBeenCalled();

		callback = null;
	});

	// TODO 暂时没想到怎么测这个方法
	it('Core.createDOM($table)', function(){

	});

	it('Core.resetTd(dom, isSingleRow)', function(){
		Core.resetTd($table, false);
		Core.resetTd($table.find('tbody tr:first-child'), true);
	});
});
