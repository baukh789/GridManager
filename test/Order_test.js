// 'use strict';
// import '../build/css/GridManager.css';
// import { jTool } from '../src/js/Base';
// import Order from '../src/js/Order';
// import testData from '../src/data/testData';
// import GridManager from '../src/js/GridManager';
// describe('Order', function() {
// 	let table = null;
// 	let $table = null;
// 	let gmName = 'test-order';
//
// 	beforeAll(function(){
// 		table = document.createElement('table');
// 		table.setAttribute('grid-manager', gmName);
// 		document.querySelector('body').appendChild(table);
// 		$table = jTool('table[grid-manager="'+ gmName +'"]');
// 		var arg = {
// 			ajax_data: testData
// 			,disableCache: true
// 			,columnData: [
// 				{
// 					key: 'name',
// 					remind: 'the name',
// 					width: '100px',
// 					text: '名称',
// 					sorting: ''
// 				},{
// 					key: 'info',
// 					remind: 'the info',
// 					text: '使用说明'
// 				},{
// 					key: 'url',
// 					remind: 'the url',
// 					text: 'url'
// 				}
// 			]
// 		};
// 		new GridManager().init(table, arg);
// 	});
// 	afterAll(function () {
// 		table = null;
// 		$table = null;
// 		gmName = null;
// 		document.body.innerHTML = '';
// 	});
//
// 	it('Order.initDOM($table)', function(){
// 		expect(Order.initDOM($table)).toBe(true);
// 	});
//
// 	it('验证自动生成列[序号]宽度', function(){
// 		let autoCreateOrder = jTool('th[th-name="gm_order"]').width();
// 		expect(autoCreateOrder).toBe(50);
// 		autoCreateOrder = null;
// 	});
// });
