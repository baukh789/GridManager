'use strict';
import Adjust from '../src/js/Adjust';
/**
 * 验证类的属性及方法总量
 */
describe('Adjust 验证类的属性及方法总量', function() {
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
		expect(getPropertyCount(Object.getOwnPropertyNames(Object.getPrototypeOf(Adjust)))).toBe(5 + 1);
	});
});

describe('Adjust.html', function() {
	it('基础验证', function(){
		expect(Adjust.html).toBeDefined();
		expect(Adjust.html).toBe('<span class="adjust-action"></span>');
	});
});

describe('Adjust.bindAdjustEvent($table)', function() {
	it('基础验证', function(){
		expect(Adjust.bindAdjustEvent).toBeDefined();
		expect(Adjust.bindAdjustEvent.length).toBe(1);
	});
});

describe('Adjust.runMoveEvent($table, $th, $nextTh)', function() {
	it('基础验证', function(){
		expect(Adjust.runMoveEvent).toBeDefined();
		expect(Adjust.runMoveEvent.length).toBe(3);
	});
});

describe('Adjust.runStopEvent($table, $th, $td)', function() {
	it('基础验证', function(){
		expect(Adjust.runStopEvent).toBeDefined();
		expect(Adjust.runStopEvent.length).toBe(3);
	});
});
describe('Adjust.resetAdjust($table)', function() {
	it('基础验证', function() {
		expect(Adjust.resetAdjust).toBeDefined();
		expect(Adjust.resetAdjust.length).toBe(1);
	});
});
