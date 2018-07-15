/**
 * Created by baukh on 17/10/12.
 */

import Sort from '../src/js/Sort';
/**
 * 验证类的属性及方法总量
 */
describe('Sort 验证类的属性及方法总量', function() {
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
		expect(getPropertyCount(Object.getOwnPropertyNames(Object.getPrototypeOf(Sort)))).toBe(6 + 1);
	});
});

describe('Sort.enable', function() {
    it('初始值验证', function() {
        expect(Sort.enable).toBeDefined();
        expect(Sort.enable).toBe(false);
    });
});

describe('Sort.init($table)', function() {
	it('基础验证', function() {
		expect(Sort.init).toBeDefined();
		expect(Sort.init.length).toBe(1);
	});
});

describe('Sort.html', function() {
	it('基础验证', function() {
		let sortHtml = `<div class="sorting-action">
						<i class="sa-icon sa-up iconfont icon-up"></i>
						<i class="sa-icon sa-down iconfont icon-down"></i>
					</div>`;
		expect(Sort.html.replace(/\s/g, '')).toBe(sortHtml.replace(/\s/g, ''));
		sortHtml = null;
	});
});

describe('Sort.__setSort($table, sortJson, callback, refresh)', function() {
	it('基础验证', function() {
		expect(Sort.__setSort).toBeDefined();
		expect(Sort.__setSort.length).toBe(4);
	});
});

describe('Sort.__bindSortingEvent($table)', function() {
	it('基础验证', function() {
		expect(Sort.__bindSortingEvent).toBeDefined();
		expect(Sort.__bindSortingEvent.length).toBe(1);
	});
});

describe('Sort.updateSortStyle($table)', function() {
	it('基础验证', function() {
		expect(Sort.updateSortStyle).toBeDefined();
		expect(Sort.updateSortStyle.length).toBe(1);
	});
});

describe('Sort.destroy($table)', function() {
	it('基础验证', function() {
		expect(Sort.destroy).toBeDefined();
		expect(Sort.destroy.length).toBe(1);
	});
});
