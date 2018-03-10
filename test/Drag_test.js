/**
 * Created by baukh on 17/4/21.
 */
'use strict';
import Drag from '../src/js/Drag';
/**
 * 验证类的属性及方法总量
 */
describe('Drag 验证类的属性及方法总量', function() {
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
		expect(getPropertyCount(Object.getOwnPropertyNames(Object.getPrototypeOf(Drag)))).toBe(4 + 1);
	});
});

describe('Drag.init($table)', function() {
	it('基础验证', function() {
		expect(Drag.init).toBeDefined();
		expect(Drag.init.length).toBe(1);
	});
});

describe('Drag.__bindDragEvent($table)', function() {
	it('基础验证', function() {
		expect(Drag.__bindDragEvent).toBeDefined();
		expect(Drag.__bindDragEvent.length).toBe(1);
	});
});

describe('Drag.updateDrag(_table, prevTh, nextTh, _th, colTd, dreamlandDIV, haveMockThead)', function() {
	it('基础验证', function() {
		expect(Drag.updateDrag).toBeDefined();
		expect(Drag.updateDrag.length).toBe(7);
	});
});

describe('Drag.destroy($table)', function() {
	it('基础验证', function() {
		expect(Drag.destroy).toBeDefined();
		expect(Drag.destroy.length).toBe(1);
	});
});
