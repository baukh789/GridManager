'use strict';
import { jTool } from '../src/module/base';
import config from '../src/module/config';
import tableTpl from './table-test.tpl.html';
/**
 * 验证类的属性及方法总量
 */
describe('config 验证类的属性及方法总量', function() {
    let getPropertyCount = null;
    beforeEach(function() {
        getPropertyCount = function(o){
            let n, count = 0;
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
        expect(getPropertyCount(Object.getOwnPropertyNames(Object.getPrototypeOf(config)))).toBe(10 + 1);
    });
});

describe('config.createHtml(settings)', function() {
    let createHtml = null;
    beforeEach(function(){
    });

    afterEach(function(){
        createHtml = null;
    });
    it('基础验证', function () {
        expect(config.createHtml).toBeDefined();
        expect(config.createHtml.length).toBe(1);
    });

    it('返回值验证', function () {
        let settings = {
            configInfo: 'test config info'
        };
        createHtml = `<div class="config-area">
						<span class="config-action">
							<i class="iconfont icon-close"></i>
						</span>
						<div class="config-info">${settings.configInfo}</div>
						<ul class="config-list"></ul>
					</div>`;
        expect(config.createHtml(settings).replace(/\s/g, '')).toBe(createHtml.replace(/\s/g, ''));
        settings = null;
    });
});

describe('config.createColumn(column)', function() {
    let column = null;
    let columnHtml = null;
    let $table = null;
    beforeEach(function(){
        document.body.innerHTML = tableTpl;
        $table = jTool('table[grid-manager="test"]')
    });

    afterEach(function(){
        column = null;
        columnHtml = null;
        $table = null;
        document.body.innerHTML = '';
    });
    it('基础验证', function () {
        expect(config.createColumn).toBeDefined();
        expect(config.createColumn.length).toBe(1);
    });

    it('返回值验证', function () {
        column = {
            key: 'type',
            isShow: false,
            $table
        };
        columnHtml = `<li th-name="type" class="">
                    <label class="gm-checkbox-wrapper">
                        <span class="gm-radio-checkbox gm-checkbox">
                            <input type="checkbox" class="gm-radio-checkbox-input gm-checkbox-input">
                            <span class="gm-checkbox-inner"></span>
                        </span>
                        博文分类
                    </label>
                </li>`;
        expect(config.createColumn(column).replace(/\s/g, '')).toBe(columnHtml.replace(/\s/g, ''));

        column = {
            key: 'pic',
            isShow: true,
            $table
        };
        columnHtml = `<li th-name="pic" class="checked-li">
                    <label class="gm-checkbox-wrapper">
                        <span class="gm-radio-checkbox gm-checkbox gm-checkbox-checked">
                            <input type="checkbox" class="gm-radio-checkbox-input gm-checkbox-input">
                            <span class="gm-checkbox-inner"></span>
                        </span>
                        缩略图
                    </label>
                </li>`;

        expect(config.createColumn(column).replace(/\s/g, '')).toBe(columnHtml.replace(/\s/g, ''));
    });
});

describe('config.init($table)', function() {
    it('基础验证', function () {
        expect(config.init).toBeDefined();
        expect(config.init.length).toBe(1);
    });
});

describe('config.__bindConfigEvent($table)', function() {
    it('基础验证', function () {
        expect(config.__bindConfigEvent).toBeDefined();
        expect(config.__bindConfigEvent.length).toBe(1);
    });
});

describe('config.toggle($table)', function() {
    it('基础验证', function () {
        expect(config.toggle).toBeDefined();
        expect(config.toggle.length).toBe(1);
    });
});

describe('config.show($table, settings)', function() {
    it('基础验证', function () {
        expect(config.show).toBeDefined();
        expect(config.show.length).toBe(2);
    });
});

describe('config.hide($table)', function() {
    it('基础验证', function () {
        expect(config.hide).toBeDefined();
        expect(config.hide.length).toBe(1);
    });
});

describe('config.updateConfigList($table, settings)', function() {
    it('基础验证', function () {
        expect(config.updateConfigList).toBeDefined();
        expect(config.updateConfigList.length).toBe(2);
    });
});

describe('config.updateConfigListHeight($table)', function() {
    it('基础验证', function () {
        expect(config.updateConfigListHeight).toBeDefined();
        expect(config.updateConfigListHeight.length).toBe(1);
    });
});

describe('config.destroy($table)', function() {
    it('基础验证', function () {
        expect(config.destroy).toBeDefined();
        expect(config.destroy.length).toBe(1);
    });
});
