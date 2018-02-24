/**
 * Created by baukh on 17/8/16.
 */
'use strict';
import Hover from '../src/js/Hover';
import { jTool } from '../src/js/Base';
/**
 * 验证类的属性及方法总量
 */
describe('Hover 验证类的属性及方法总量', function() {
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
		// 静态函数并不会计算到实例化对象内
		expect(getPropertyCount(Object.getOwnPropertyNames(Object.getPrototypeOf(Hover)))).toBe(3 + 1);
	});
});

/**
 * 实例化方法验证
 */
describe('Hover.onTbodyHover($table)', function() {
	it('基础验证', function() {
		expect(Hover.onTbodyHover).toBeDefined();
		expect(Hover.onTbodyHover.length).toBe(1);
	});
});

describe('Hover.updateHover(td)', function() {
	let table = null;
	let $table = null;
	let $tr = null;
	let $td = null;

	beforeEach(function () {
		table = `<table grid-manager="test-hover">
					<thead>
						<tr><th th-name="one">name</th></tr>
					</thead>
					<tbody>
						<tr><td>td-text</td></tr>
					</tbody>
				</table>`;
		document.body.innerHTML = table;
		$table = jTool('table');
		$tr = jTool('tbody tr', $table);
		$td = jTool('td', $tr);
	});

	afterAll(function () {
		document.body.innerHTML = '';
		table = null;
		$table = null;
		$tr = null;
		$td = null;
	});

	it('基础验证', function() {
		expect(Hover.updateHover).toBeDefined();
		expect(Hover.updateHover.length).toBe(1);
	});

	it('绑定验证', function() {
		expect($tr.attr('row-hover')).toBeUndefined();
		expect($td.attr('col-hover')).toBeUndefined();

		Hover.updateHover($td.get(0));
		expect($tr.attr('row-hover')).toBe('true');
		expect($td.attr('col-hover')).toBe('true');
	});
});

describe('Hover.destroy($table)', function() {
	it('基础验证', function() {
		expect(Hover.destroy).toBeDefined();
		expect(Hover.destroy.length).toBe(1);
	});
});
