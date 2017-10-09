/**
 * Created by baukh on 17/6/19.
 */
'use strict';
import { jTool } from '../src/js/Base';
import Export from '../src/js/Export';
import testData from '../src/data/testData';
describe('Export', function() {
	let table = null;
	let $table = null;
	let gmName = 'test-export';
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

	it('Export.html()', function(){
		let html = '<a href="" download="" id="gm-export-action"></a>';
		expect(Export.html()).toBe(html);
		html = null;
	});

	it('Export.__exportGridToXls()', function(){
		expect(Export.__exportGridToXls($table, 'exportName')).toBe(true);
	});

	it('Export.createExportHTML(theadHTML, tbodyHTML)', function(){
		const theadHTML = '<tr><th>th1</th><th>th1</th></tr>';
		const tbodyHTML = '<tr><td>td1</td><td>td2</td></tr>';
		const exportHTML = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
								<head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"></head>
								<body>
									<table>
										<thead>
											${theadHTML}
										</thead>
										<tbody>
											${tbodyHTML}
										</tbody>
									</table>
								</body>
							</html>`;
		expect(Export.createExportHTML(theadHTML, tbodyHTML).replace(/\s/g, '')).toBe(exportHTML.replace(/\s/g, ''));
	});

});
