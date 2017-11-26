/**
 * Created by baukh on 17/10/26.
 */
// import '../build/css/GridManager.css';
// import { jTool } from '../src/js/Base';
// import GridManager from '../src/js/GridManager';
// import testData from '../src/data/testData';
//
// describe('GridManager.js', function() {
// 	let table = null;
// 	let $table = null;
// 	let gmName = 'test-gridmanager';
// 	beforeAll(function(){
// 		table = document.createElement('table');
// 		table.setAttribute('grid-manager', gmName);
// 		document.querySelector('body').appendChild(table);
// 		$table = jTool(table);
// 	});
// 	afterAll(function () {
// 		table = null;
// 		$table = null;
// 		gmName = null;
// 		document.body.innerHTML = '';
// 	});
//
// 	// 测试init方法
// 	it('GridManager.init($table, arg, callback)', function() {
// 		let callbackFN = jasmine.createSpy('callback');
// 		var arg = {
// 			ajax_data: testData
// 			,disableCache: true
// 			,i18n: 'en-us'
// 			,columnData: [
// 				{
// 					key: 'name',
// 					width: '100px',
// 					text: '名称'
// 				},{
// 					key: 'info',
// 					text: '使用说明'
// 				},{
// 					key: 'url',
// 					text: 'url'
// 				},{
// 					key: 'createDate',
// 					text: '创建时间'
// 				},{
// 					key: 'lastDate',
// 					text: '最后修改时间'
// 				},{
// 					key: 'action',
// 					text: '操作',
// 					template: function(action, rowObject){
// 						return '<span class="plugin-action edit-action" learnLink-id="'+rowObject.id+'">编辑</span>'
// 							+'<span class="plugin-action del-action" learnLink-id="'+rowObject.id+'">删除</span>';
// 					}
// 				}
// 			]
// 		};
// 		new GridManager().init(table, arg, callbackFN);
// 		expect(callbackFN).toHaveBeenCalled();
//
// 		arg = null;
// 		callbackFN = null;
// 	});
// });
