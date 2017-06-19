'use strict';
import jTool from '../src/js/jTool';
import Adjust from '../src/js/Adjust';
describe('Adjust.js', function() {
	let table = null;
	let $table = null;
	let gmName = 'test-adjust';
	beforeAll(function(){
		// 引入组件, 实例化 Element.prototype.GM
		require('../src/js/GridManager').default;

		table = document.createElement('table');
		table.setAttribute('grid-manager', gmName);
		document.querySelector('body').appendChild(table);
		$table = jTool('table[grid-manager="'+ gmName +'"]');
		document.querySelector('table[grid-manager="'+ gmName +'"]').GM({
			ajax_url: 'http://www.lovejavascript.com/learnLinkManager/getLearnLinkList'
			,disableCache: true
			,i18n: 'en-us'
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
		Element.prototype.GM = Element.prototype.GridManager = null;
		document.body.innerHTML = '';
	});
	it('验证获取html', function() {
		expect(Adjust.html()).toBe('<span class="adjust-action"></span>');
	});

	it('验证方法[resetAdjust]返回值', function () {
		expect(Adjust.resetAdjust()).toBe(false);
		expect(Adjust.resetAdjust($table)).toBe(undefined);
	});

});
