'use strict';
import Config from '../src/js/Config';
import AjaxPage from "../src/js/AjaxPage";
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
		expect(getPropertyCount(Object.getOwnPropertyNames(Object.getPrototypeOf(Config)))).toBe(6 + 1);
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

describe('Config.createColumn(thName, content)', function() {
    let thName = null;
    let content = null;
    let columnHtml = null;
    beforeEach(function(){
    });

    afterEach(function(){
        let thName = null;
        let content = null;
        let columnHtml = null;
    });
    it('基础验证', function () {
        expect(Config.createColumn).toBeDefined();
        expect(Config.createColumn.length).toBe(2);
    });

    it('返回值验证', function () {
        thName = 'test-config';
        content ='测试配置功能，创建列的返回值';
        columnHtml = `<li th-name="test-config">
                    <input type="checkbox"/>
                    <label>
                        <span class="fake-checkbox"></span>
                        测试配置功能，创建列的返回值
                    </label>
                </li>`;
        expect(Config.createColumn(thName, content).replace(/\s/g, '')).toBe(columnHtml.replace(/\s/g, ''));
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

describe('Config.toggle($table)', function() {
	it('基础验证', function () {
		expect(Config.toggle).toBeDefined();
		expect(Config.toggle.length).toBe(1);
	});
});

describe('Config.destroy($table)', function() {
	it('基础验证', function () {
		expect(Config.destroy).toBeDefined();
		expect(Config.destroy.length).toBe(1);
	});
});

