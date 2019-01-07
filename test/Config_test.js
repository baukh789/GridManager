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
		expect(getPropertyCount(Object.getOwnPropertyNames(Object.getPrototypeOf(Config)))).toBe(10 + 1);
	});
});

describe('Config.createHtml(settings)', function() {
    let createHtml = null;
    beforeEach(function(){
    });

    afterEach(function(){
        createHtml = null;
    });
    it('基础验证', function () {
        expect(Config.createHtml).toBeDefined();
        expect(Config.createHtml.length).toBe(1);
    });

    it('返回值验证', function () {
		let settings = {
			gridManagerName: 'test',
			configInfo: 'test config info'
		};
        createHtml = `<div class="config-area">
						<span class="config-action">
							<i class="iconfont icon-close"></i>
						</span>
						<div class="config-info">${settings.configInfo}</div>
						<ul class="config-list"></ul>
					</div>`;
		expect(Config.createHtml(settings).replace(/\s/g, '')).toBe(createHtml.replace(/\s/g, ''));
		settings = null;
    });
});

describe('Config.createColumn(thName, content, isShow)', function() {
    let thName = null;
    let content = null;
    let columnHtml = null;
    beforeEach(function(){
    });

    afterEach(function(){
        thName = null;
        content = null;
        columnHtml = null;
    });
    it('基础验证', function () {
        expect(Config.createColumn).toBeDefined();
        expect(Config.createColumn.length).toBe(3);
    });

    it('返回值验证', function () {
        thName = 'test-config';
        content ='测试配置功能，创建列的返回值';
        columnHtml = `<li th-name="test-config">
                    <label class="gm-checkbox-wrapper">
                        <span class="gm-radio-checkbox gm-checkbox">
                            <input type="checkbox" class="gm-radio-checkbox-input gm-checkbox-input">
                            <span class="gm-checkbox-inner"></span>
                        </span>
                        测试配置功能，创建列的返回值
                    </label>
                </li>`;
        expect(Config.createColumn(thName, content).replace(/\s/g, '')).toBe(columnHtml.replace(/\s/g, ''));


        columnHtml = `<li th-name="test-config" class="checked-li">
                    <label class="gm-checkbox-wrapper">
                        <span class="gm-radio-checkbox gm-checkbox gm-checkbox-checked">
                            <input type="checkbox" class="gm-radio-checkbox-input gm-checkbox-input">
                            <span class="gm-checkbox-inner"></span>
                        </span>
                        测试配置功能，创建列的返回值
                    </label>
                </li>`;
        expect(Config.createColumn(thName, content, true).replace(/\s/g, '')).toBe(columnHtml.replace(/\s/g, ''));
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

describe('Config.show($table, settings)', function() {
    it('基础验证', function () {
        expect(Config.show).toBeDefined();
        expect(Config.show.length).toBe(2);
    });
});

describe('Config.hide($table)', function() {
    it('基础验证', function () {
        expect(Config.hide).toBeDefined();
        expect(Config.hide.length).toBe(1);
    });
});

describe('Config.updateConfigList($table, settings)', function() {
    it('基础验证', function () {
        expect(Config.updateConfigList).toBeDefined();
        expect(Config.updateConfigList.length).toBe(2);
    });
});

describe('Config.updateConfigListHeight($table)', function() {
    it('基础验证', function () {
        expect(Config.updateConfigListHeight).toBeDefined();
        expect(Config.updateConfigListHeight.length).toBe(1);
    });
});

describe('Config.destroy($table)', function() {
	it('基础验证', function () {
		expect(Config.destroy).toBeDefined();
		expect(Config.destroy.length).toBe(1);
	});
});

