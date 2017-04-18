/**
 * Created by baukh on 17/3/12.
 */
'use strict';
import jTool from '../src/js/jTool';
import Checkbox from '../src/js/Checkbox';
describe('Checkbox', function() {

	let table = null;
	let $table = null;
	let ajaxData = null;
	beforeAll(function(){
		// 引入组件, 实例化 Element.prototype.GM
		require('../src/js/GridManager').default;

		// 使用静态数据进行渲染
		ajaxData = {
			"data":[
				{
					"name": "baukh",
					"age": "30",
					"createDate": "2015-03-12",
					"info": "野生前端程序",
					"operation": "修改"
				},
				{
					"name": "kouzi",
					"age": "28",
					"createDate": "2015-03-12",
					"info": "产品经理",
					"operation": "修改"
				},
				{
					"name": "baukh",
					"age": "28",
					"createDate": "2015-03-12",
					"info": "野生前端程序",
					"operation": "修改"
				},
				{
					"name": "baukh",
					"age": "28",
					"createDate": "2015-03-12",
					"info": "野生前端程序",
					"operation": "修改"
				},
				{
					"name": "baukh",
					"age": "28",
					"createDate": "2015-03-12",
					"info": "野生前端程序",
					"operation": "修改"
				},{
					"name": "baukh",
					"age": "28",
					"createDate": "2015-03-12",
					"info": "野生前端程序",
					"operation": "修改"
				},
				{
					"name": "baukh",
					"age": "28",
					"createDate": "2015-03-12",
					"info": "野生前端程序",
					"operation": "修改"
				},
				{
					"name": "baukh",
					"age": "28",
					"createDate": "2015-03-12",
					"info": "野生前端程序",
					"operation": "修改"
				}
			],
			"totals": 8
		};

		table = document.createElement('table');
		table.setAttribute('grid-manager', 'test-cache');
		document.querySelector('body').appendChild(table);
		$table = jTool('table[grid-manager="test-cache"]');
		document.querySelector('table[grid-manager="test-cache"]').GM({
			ajax_data: ajaxData
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

	it('Checkbox.html($table)', function(){
		let checkboxHtml = `<th th-name="gm_checkbox" gm-checkbox="true" gm-create="true">
								<input type="checkbox"/>
								<span style="display: none">
									全选
								</span>
							</th>`;
		expect(Checkbox.html($table).replace(/\s/g, '')).toBe(checkboxHtml.replace(/\s/g, ''));
		checkboxHtml = null;
	});

	it('测试checkbox事件', function(){
		// 索引为0 所对应的是全选, 其它的为单选
		let cList = jTool('input[type="checkbox"]', $table);
		expect(cList.get(0).checked).toBe(false);
		cList.eq(0).trigger('click');
		expect(cList.get(0).checked).toBe(true);
		expect(cList.get(1).checked).toBe(true);
		expect(cList.get(2).checked).toBe(true);

		cList = null;
	});
});
