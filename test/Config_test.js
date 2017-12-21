'use strict';
import Config from '../src/js/Config';
/**
 * 验证类的属性及方法总量
 */
describe('Config 验证类的属性及方法总量', function() {
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
		expect(getPropertyCount(Object.getOwnPropertyNames(Object.getPrototypeOf(Config)))).toBe(2 + 1);
	});
});

describe('Config.html', function() {
	it('基础验证', function(){
		expect(Config.html).toBeDefined();
		var configHtml = `<div class="config-area">
							<span class="config-action">
								<i class="iconfont icon-31xingdongdian"></i>
							</span>
							<ul class="config-list"></ul>
						</div>`;
		expect(Config.html.replace(/\s/g, '')).toBe(configHtml.replace(/\s/g, ''));
	});
});

describe('Config.bindConfigEvent($table)', function() {
	it('基础验证', function () {
		expect(Config.bindConfigEvent).toBeDefined();
		expect(Config.bindConfigEvent.length).toBe(1);
	});
});
