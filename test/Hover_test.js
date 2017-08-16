/**
 * Created by baukh on 17/8/16.
 */

import jTool from '../src/js/jTool';
import testData from '../src/data/testData';
describe('Hover.js', function() {
	let gmName = 'test-hover';
	let table = document.createElement('table');
	table.setAttribute('grid-manager', gmName);
	let $table = jTool(table);
	beforeAll(function(){
		// 引入组件, 实例化 Element.prototype.GM
		require('../src/js/GridManager').default;

		document.querySelector('body').appendChild(table);
		document.querySelector('table[grid-manager="'+ gmName +'"]').GM({
			ajax_data: testData
			,query: {name: 'baukh'}
			,supportAjaxPage: true
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
	
	it('验证Hover.onTbodyHover($table)方法中的事件是否绑定成功', function(){
		expect(table.jToolEvent.mousemovetd.length).toBe(1);
	});

});
