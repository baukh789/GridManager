/**
 * Created by baukh on 17/10/12.
 */

import Remind from '../src/js/Remind';
/**
 * 验证类的属性及方法总量
 */
describe('Remind 验证类的属性及方法总量', function() {
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
		expect(getPropertyCount(Object.getOwnPropertyNames(Object.getPrototypeOf(Remind)))).toBe(4 + 1);
	});
});

describe('Remind.createHtml(title, content)', function() {
	it('基础验证', function() {
		let RemindHtml = `<div class="remind-action">
						<i class="ra-icon iconfont icon-help"></i>
						<div class="ra-area">
							<span class="ra-title">title</span>
							<span class="ra-con">content</span>
						</div>
					</div>`;
		expect(Remind.createHtml('title', 'content').replace(/\s/g, '')).toBe(RemindHtml.replace(/\s/g, ''));
		RemindHtml = null;
	});
});

describe('Remind.enable', function() {
    it('初始值验证', function() {
        expect(Remind.enable).toBeDefined();
        expect(Remind.enable).toBe(false);
    });
});

describe('Remind.init($table)', function() {
	it('基础验证', function() {
		expect(Remind.init).toBeDefined();
		expect(Remind.init.length).toBe(1);
	});
});

describe('Remind.__bindRemindEvent($table)', function() {
	it('基础验证', function() {
		expect(Remind.__bindRemindEvent).toBeDefined();
		expect(Remind.__bindRemindEvent.length).toBe(1);
	});
});

describe('Remind.destroy($table)', function() {
	it('基础验证', function() {
		expect(Remind.destroy).toBeDefined();
		expect(Remind.destroy.length).toBe(1);
	});
});
