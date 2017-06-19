'use strict';
import jTool from '../src/js/jTool';
import Order from '../src/js/Order';
describe('Order', function() {
	let table = null;
	let $table = null;

	beforeAll(function(){
		// 引入组件, 实例化 Element.prototype.GM
		require('../src/js/GridManager').default;

		table = document.createElement('table');
		table.setAttribute('grid-manager', 'test-adjust');
		document.querySelector('body').appendChild(table);
		$table = jTool('table[grid-manager="test-adjust"]');
		document.querySelector('table[grid-manager="test-adjust"]').GM({
			ajax_url: 'http://www.lovejavascript.com/learnLinkManager/getLearnLinkList'
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
		document.querySelector('body').innerHTML = '';
		table = null;
		$table = null;
		Element.prototype.GM = Element.prototype.GridManager = null;
		document.querySelector('.table-wrap').forEach(item => {
			document.querySelector('body').removeChild(item);
		});
	});

	it('验证自动生成列[序号,全选]宽度', function(){
		let autoCreateCheckbox = jTool('th[th-name="gm_checkbox"]').width();
		let autoCreateOrder = jTool('th[th-name="gm_order"]').width();
		expect(autoCreateCheckbox).toBe(50);
		expect(autoCreateOrder).toBe(50);
		autoCreateCheckbox = null;
		autoCreateOrder = null;
	});
});
