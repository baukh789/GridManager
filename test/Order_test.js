'use strict';
import { jTool } from '../src/js/Base';
import Order from '../src/js/Order';
import testData from '../src/data/testData';
describe('Order', function() {
	let table = null;
	let $table = null;
	let gmName = 'test-order';

	beforeAll(function(){
		table = document.createElement('table');
		table.setAttribute('grid-manager', gmName);
		document.querySelector('body').appendChild(table);
		$table = jTool('table[grid-manager="'+ gmName +'"]');
		document.querySelector('table[grid-manager="'+ gmName +'"]').GM({
			ajax_data: testData
			,disableCache: true
			,columnData: [
				{
					key: 'name',
					remind: 'the name',
					width: '100px',
					text: '名称',
					sorting: ''
				},{
					key: 'info',
					remind: 'the info',
					text: '使用说明'
				},{
					key: 'url',
					remind: 'the url',
					text: 'url'
				}
			]
		});
	});
	afterAll(function () {
		table = null;
		$table = null;
		gmName = null;
		document.body.innerHTML = '';
	});

	it('Order.initDOM($table)', function(){
		expect(Order.initDOM($table)).toBe(true);
	});

	it('验证自动生成列[序号]宽度', function(){
		let autoCreateOrder = jTool('th[th-name="gm_order"]').width();
		expect(autoCreateOrder).toBe(50);
		autoCreateOrder = null;
	});
});
