/**
 * Created by baukh on 17/12/24.
 */

'use strict';
import Scroll from '../src/js/Scroll';
/**
 * 验证类的属性及方法总量
 */
describe('Scroll 验证类的属性及方法总量', function() {
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
		expect(getPropertyCount(Object.getOwnPropertyNames(Object.getPrototypeOf(Scroll)))).toBe(6 + 1);
	});
});

describe('Scroll.init($table)', function() {
	it('基础验证', function() {
		expect(Scroll.init).toBeDefined();
		expect(Scroll.init.length).toBe(1);
	});
});

describe('Scroll.render($table)', function() {
    it('基础验证', function() {
        expect(Scroll.render).toBeDefined();
        expect(Scroll.render.length).toBe(1);
    });
});

describe('Scroll.update($table)', function() {
    it('基础验证', function() {
        expect(Scroll.update).toBeDefined();
        expect(Scroll.update.length).toBe(1);
    });
});

describe('Scroll.bindResizeToTable($table)', function() {
	it('基础验证', function() {
		expect(Scroll.bindResizeToTable).toBeDefined();
		expect(Scroll.bindResizeToTable.length).toBe(1);
	});
});

describe('Scroll.bindScrollToTableDiv($table)', function() {
	it('基础验证', function() {
		expect(Scroll.bindScrollToTableDiv).toBeDefined();
		expect(Scroll.bindScrollToTableDiv.length).toBe(1);
	});
});

describe('Scroll.destroy($table)', function() {
	it('基础验证', function() {
		expect(Scroll.destroy).toBeDefined();
		expect(Scroll.destroy.length).toBe(1);
	});
});

