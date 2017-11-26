/**
 * Created by baukh on 17/3/12.
 */
'use strict';
import { jTool } from '../src/js/Base';
import Checkbox from '../src/js/Checkbox';
import testData from '../src/data/testData';
import GridManager from '../src/js/GridManager';
/**
 * 对象完整性验证
 */
describe('Checkbox 对象完整性验证', function() {
	it('对象完整性验证 Checkbox.html', function () {
		expect(Checkbox.html).toBeDefined();
	});

	it('对象完整性验证 Checkbox.initCheckbox', function () {
		expect(Checkbox.initCheckbox).toBeDefined();
		expect(Checkbox.initCheckbox.length).toBe(1);
	});

	it('对象完整性验证 Checkbox.bindCheckboxEvent', function () {
		expect(Checkbox.bindCheckboxEvent).toBeDefined();
		expect(Checkbox.bindCheckboxEvent.length).toBe(1);
	});
});
/**
 * 验证原型方法总数
 */
describe('Checkbox 验证原型方法总数', function() {
	var getPropertyCount = null;
	beforeEach(function() {
		getPropertyCount = function(o){
			var n, count = 0;
			for(n in o){
				if(o.hasOwnProperty(n)){
					count++;
				}
			}
			return count;
		}
	});
	afterEach(function(){
		getPropertyCount = null;
	});
	it('Function count', function() {
		// es6 中 constructor 也会算做为对象的属性, 所以总量上会增加1
		expect(getPropertyCount(Object.getOwnPropertyNames(Object.getPrototypeOf(Checkbox)))).toBe(3 + 1);
	});
});

describe('Checkbox', function() {

	let table = null;
	let $table = null;
	let gmName = 'test-checkbox';
	beforeAll(function(){
		table = document.createElement('table');
		table.setAttribute('grid-manager', gmName);
		document.querySelector('body').appendChild(table);
		$table = jTool('table[grid-manager="'+ gmName +'"]');
		var arg = {
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
		};
		new GridManager().init(table, arg);
	});
	afterAll(function () {
		table = null;
		$table = null;
		gmName = null;
		document.body.innerHTML = '';
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

	it('验证自动生成列[checkout]宽度', function(){
		let autoCreateCheckbox = jTool('th[th-name="gm_checkbox"]').width();
		expect(autoCreateCheckbox).toBe(50);
		autoCreateCheckbox = null;
	});
});
