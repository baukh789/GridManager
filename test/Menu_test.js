/**
 * Created by baukh on 17/9/30.
 */
import { jTool } from '../src/js/Base';
import Menu from '../src/js/Menu';
import testData from '../src/data/testData';
import GridManager from '../src/js/GridManager';
describe('Menu.js', function() {
	let gmName = 'test-menu';
	let table = document.createElement('table');
	table.setAttribute('grid-manager', gmName);
	let $table = jTool(table);
	beforeAll(function(){
		document.querySelector('body').appendChild(table);
		var arg = {
			ajax_data: testData
			,query: {name: 'baukh'}
			,supportAjaxPage: true
			,supportExport: true
			,supportConfig: false
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

	it('验证操作项在右键菜单项中是否存在', function(){
		// 上一页
		const previousDOM = document.querySelector('[grid-action="refresh-page"][refresh-type="previous"]');
		expect(previousDOM).toBeDefined();
		// 下一页
		const nextDOM = document.querySelector('[grid-action="refresh-page"][refresh-type="next"]');
		expect(nextDOM).toBeDefined();

		// 刷新
		const refreshDOM = document.querySelector('[grid-action="refresh-page"][refresh-type="refresh"]');
		expect(refreshDOM).toBeDefined();

		// 另存为EXCEL
		const exportAllDOM = document.querySelector('[grid-action="export-excel"][only-checked="false"]');
		expect(exportAllDOM).toBeDefined();

		// 已选中项另存为EXCEL
		const exportCheckDOM = document.querySelector('[grid-action="export-excel"][only-checked="true"]');
		expect(exportCheckDOM).toBeDefined();

		// 配置
		const configDOM = document.querySelector('[grid-action="config-grid"]');
		expect(configDOM).toBeNull();
	});

	it('Menu.isDisabled(dom, events) 获取右键菜单中的某项 是为禁用状态', function(){
		var eventMock = {
			stopPropagation: function(){},
			preventDefault: function(){}
		};
		// 上一页
		const previousDOM = document.querySelector('[grid-action="refresh-page"][refresh-type="previous"]');
		expect(Menu.isDisabled(previousDOM, eventMock)).toBe(true);

		// 下一页
		const nextDOM = document.querySelector('[grid-action="refresh-page"][refresh-type="next"]');
		expect(Menu.isDisabled(nextDOM, eventMock)).toBe(true);

		// 刷新
		const refreshDOM = document.querySelector('[grid-action="refresh-page"][refresh-type="refresh"]');
		expect(Menu.isDisabled(refreshDOM, eventMock)).toBe(false);

		// 另存为EXCEL
		const exportAllDOM = document.querySelector('[grid-action="export-excel"][only-checked="false"]');
		expect(Menu.isDisabled(exportAllDOM, eventMock)).toBe(false);

		// 已选中项另存为EXCEL 这里非禁用是由于并未打开菜单栏, 只有打开菜单栏时才会通过已选中的行更新禁用状态
		const exportCheckDOM = document.querySelector('[grid-action="export-excel"][only-checked="true"]');
		expect(Menu.isDisabled(exportCheckDOM, eventMock)).toBe(false);

		eventMock = null;
	});

});
