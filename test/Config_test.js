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
		expect(getPropertyCount(Object.getOwnPropertyNames(Object.getPrototypeOf(Config)))).toBe(4 + 1);
	});
});

describe('Config.html', function() {
	it('基础验证', function(){
		expect(Config.html).toBeDefined();
		var configHtml = `<div class="config-area">
							<span class="config-action">
								<i class="iconfont icon-close"></i>
							</span>
							<ul class="config-list"></ul>
						</div>`;
		expect(Config.html.replace(/\s/g, '')).toBe(configHtml.replace(/\s/g, ''));
	});
});

describe('Config.init($table)', function() {
	it('基础验证', function () {
		expect(Config.init).toBeDefined();
		expect(Config.init.length).toBe(1);
	});
});

describe('Config.__bindConfigEvent($table)', function() {
	it('基础验证', function () {
		expect(Config.__bindConfigEvent).toBeDefined();
		expect(Config.__bindConfigEvent.length).toBe(1);
	});
});

describe('Config.destroy($table)', function() {
	it('基础验证', function () {
		expect(Config.destroy).toBeDefined();
		expect(Config.destroy.length).toBe(1);
	});
});

