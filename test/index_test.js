/**
 * Created by baukh on 17/6/20.
 */
import { jTool } from '../src/js/Base';
import '../build/css/GridManager.css';

describe('index.js', function() {
	let table = null;
	let $table = null;
	let gmName = 'test-gridmanager';
	beforeAll(function(){
		// 引入组件, 实例化 Element.prototype.GM
		require('../src/js/index').default;

		table = document.createElement('table');
		table.setAttribute('grid-manager', gmName);
		document.querySelector('body').appendChild(table);
		$table = jTool(table);
	});
	afterAll(function () {
		table = null;
		$table = null;
		gmName = null;
		Element.prototype.GM = Element.prototype.GridManager = null;
		document.body.innerHTML = '';
	});

	// 验证Element.prototype 是否绑定成功
	it('验证Element.prototype 是否绑定成功', function(){
		expect(Element.prototype.GridManager).toBeDefined();
		expect(Element.prototype.GM).toBeDefined();
		expect(Element.prototype.GridManager).toBe(Element.prototype.GM);
	});

});
