import jTool from '../src/common/jTool';
import base from '../src/common/base';
import { trimTpl } from '../src/common/parse';
import {CONSOLE_STYLE, FAKE_TABLE_HEAD_KEY, TABLE_HEAD_KEY, TABLE_KEY} from '../src/common/constants';
import tableTpl from './table-test.tpl.html';

// 清除空格
const tableTestTpl = trimTpl(tableTpl);
describe('base 验证类的属性及方法总量', function() {
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
        expect(getPropertyCount(Object.getOwnPropertyNames(Object.getPrototypeOf(base)))).toBe(35 + 1);
    });
});

describe('base.SIV_waitContainerAvailable', function() {
    it('基础验证', function () {
        expect(base.SIV_waitContainerAvailable).toBeDefined();
        expect(base.SIV_waitContainerAvailable).toEqual({});
    });
});

describe('base.SIV_waitTableAvailable', function() {
    it('基础验证', function () {
        expect(base.SIV_waitTableAvailable).toBeDefined();
        expect(base.SIV_waitTableAvailable).toEqual({});
    });
});

describe('base.outLog(msg, type)', function() {
    let table = null;
    let arg = null;
    beforeEach(function(){
        // 存储console, 用于在测方式完成后原还console对象
        console._log = console.log;
        console.log = jasmine.createSpy("log");

        table = document.createElement('table');
        document.body.appendChild(table);
        arg = null;
    });

    afterEach(function(){
        // 还原console
        console.log = console._log;

        document.body.innerHTML = '';
        table = null;
        arg = null;
    });

    it('基础验证', function(){
        expect(base.outLog).toBeDefined();
        expect(base.outLog.length).toBe(2);
    });

    it('info', function(){
        base.outLog('hello GridManager', 'info');
        expect(console.log).toHaveBeenCalledWith('%c GridManager Info %c hello GridManager ', ...CONSOLE_STYLE.INFO);
    });

    it('warn', function(){
        base.outLog('hello GridManager', 'warn');
        expect(console.log).toHaveBeenCalledWith('%c GridManager Warn %c hello GridManager ', ...CONSOLE_STYLE.WARN);
    });

    it('error', function(){
        base.outLog('hello GridManager', 'error');
        expect(console.log).toHaveBeenCalledWith('%c GridManager Error %c hello GridManager ', ...CONSOLE_STYLE.ERROR);
    });

    it('log', function(){
        base.outLog('hello GridManager', 'log');
        expect(console.log).toHaveBeenCalledWith('%c GridManager Log %c hello GridManager ', ...CONSOLE_STYLE.LOG);
    });

    it('undefined', function(){
        base.outLog('hello GridManager');
        expect(console.log).toHaveBeenCalledWith('%c GridManager Log %c hello GridManager ', ...CONSOLE_STYLE.LOG);
    });
});


describe('base.equal(obj1, obj2)', function() {
    it('基础验证', function () {
        expect(base.equal).toBeDefined();
        expect(base.equal.length).toBe(2);
    });

    it('返回值验证', function () {
        let obj1 = {a: 1, b: 2};
        let obj2 = {a: 1, b: 2};
        let obj3 = {a: 11, b: 22};
        expect(base.equal(obj1, obj2)).toBe(true);
        expect(base.equal(obj2, obj3)).toBe(false);
        expect(base.equal(obj1, obj3)).toBe(false);

        obj1 = null;
        obj2 = null;
        obj3 = null;
    });
});

describe('base.getDataForColumnMap(columnMap, obj)', function() {
    it('基础验证', function () {
        expect(base.getDataForColumnMap).toBeDefined();
        expect(base.getDataForColumnMap.length).toBe(2);
    });

    it('返回值验证', function () {
        let columnMap = {
            info: {
                key: "info",
                text: "介绍",
                isShow: true
            },
            username: {
                key: "username",
                text: "作者",
                isShow: true
            },
            gm_checkbox: {
                key: "gm_checkbox",
                isAutoCreate: true,
                text: "",
                isShow: true
            }
        };
        let data = {
            username: 'baukh',
            age: 32,
            content: 'this is content',
            info: 'this is info',
            gm_checkbox: true
        };
        let cloneData = {
            username: 'baukh',
            info: 'this is info'
        };
        expect(base.getDataForColumnMap(columnMap, data)).toEqual(cloneData);

        columnMap = null;
        data = null;
        cloneData = null;
    });
});


describe('base.getObjectIndexToArray(arr, obj)', function() {
    it('基础验证', function () {
        expect(base.getObjectIndexToArray).toBeDefined();
        expect(base.getObjectIndexToArray.length).toBe(2);
    });

    it('返回值验证', function () {
        let arr = [{a:1, b:2}, {name:'baukh', age:31}, {name:'kouzi', age:28}];
        let obj = {name:'baukh', age:31};
        expect(base.getObjectIndexToArray(arr, obj)).toBe(1);
    });
});

describe('base.showLoading($table, loadingTemplate, cb)', function() {
    beforeEach(function(){
    });

    afterEach(function(){
        document.body.innerHTML = '';
    });
    it('基础验证', function () {
        expect(base.showLoading).toBeDefined();
        expect(base.showLoading.length).toBe(3);
    });

    it('并不存在的dom', function () {
        expect(base.showLoading(jTool('body-void'))).toBe(false);
    });

    it('无回调函数', function () {
        jasmine.clock().install();
        expect(base.showLoading(jTool('body'))).toBe(true);
        jasmine.clock().tick(500);
        jasmine.clock().uninstall();
    });

    it('连续两次调用', function () {
        base.showLoading(jTool('body'));
        expect(base.showLoading(jTool('body'))).toBe(true);
    });

    it('回调函数是否执行', function () {
        jasmine.clock().install();
        let callback = jasmine.createSpy('callback');
        expect(base.showLoading(jTool('body'), undefined, callback)).toBe(true);
        jasmine.clock().tick(100);
        expect(callback).toHaveBeenCalled();
        jasmine.clock().uninstall();
        callback = null;
    });
});

describe('base.cloneObject(object)', function() {
    it('基础验证', function () {
        expect(base.cloneObject).toBeDefined();
        expect(base.cloneObject.length).toBe(1);
    });

    it('执行结果', function(){
        let o1 = {name: 'cc', ename: 'baukh'};
        let o2 = o1;
        expect(o2 === o1).toBe(true);
        expect(base.cloneObject(o2).name === o1.name).toBe(true);
        expect(base.cloneObject(o2) === o1).toBe(false);

        o1 = null;
        o2 = null;
    });
});

describe('base.compileFramework(settings, compileList)', function() {
    let settings = null;
    let compileList = null;
    beforeEach(function(){
        console._log = console.log;
        console.log = jasmine.createSpy("log");
    });

    afterEach(function(){
        settings = null;
        compileList = null;
        console.log = console._log;
    });

    it('基础验证', function () {
        expect(base.compileFramework).toBeDefined();
        expect(base.compileFramework.length).toBe(2);
    });

    it('vue 单个解析', function () {
        settings = {
            compileVue: jasmine.createSpy('callback')
        };
        compileList = document.createElement('div');
        base.compileFramework(settings, compileList);
        expect(settings.compileVue).toHaveBeenCalled();
    });

    it('vue 数组解析', function () {
        settings = {
            compileVue: jasmine.createSpy('callback')
        };
        compileList = [];
        compileList.push(document.createElement('div'));
        compileList.push(document.createElement('div'));
        compileList.push(document.createElement('div'));
        base.compileFramework(settings, compileList);
        expect(settings.compileVue).toHaveBeenCalled();
    });

    it('angular 单个解析', function () {
        settings = {
            compileAngularjs: jasmine.createSpy('callback')
        };
        compileList = document.querySelector('body');
        base.compileFramework(settings, compileList);
        expect(settings.compileAngularjs).toHaveBeenCalled();
    });

    it('angular 数组解析', function () {
        settings = {
            compileAngularjs: jasmine.createSpy('callback')
        };
        compileList = [];
        compileList.push(document.createElement('div'));
        compileList.push(document.createElement('div'));
        compileList.push(document.createElement('div'));
        base.compileFramework(settings, compileList);
        expect(settings.compileAngularjs).toHaveBeenCalled();
    });

    it('执行验证', function () {
        settings = {
            compileAngularjs: jasmine.createSpy('callback')
        };
        compileList = document.createElement('div');
        base.compileFramework(settings, compileList).then(res => {
            expect(res).toBeUndefined();
        });
    });

    it('异常验证', function () {
        settings = {
            compileVue: function() {
                throw new Error('返回一个错误');
            }
        };
        base.compileFramework(settings, compileList).catch(err => {
            expect(err).toBe('返回一个错误');
        });
    });
});

describe('base.key', function() {
    it('基础验证', function () {
        expect(base.key).toBeDefined();
        expect(base.key).toBe(TABLE_KEY);
    });
});

describe('base.tableHeadKey', function() {
    it('基础验证', function () {
        expect(base.tableHeadKey).toBeDefined();
        expect(base.tableHeadKey).toBe(TABLE_HEAD_KEY);
    });
});

describe('base.fakeTableHeadKey', function() {
    it('基础验证', function () {
        expect(base.fakeTableHeadKey).toBeDefined();
        expect(base.fakeTableHeadKey).toBe(FAKE_TABLE_HEAD_KEY);
    });
});

describe('base.getKey($table)', function() {
    it('基础验证', function () {
        expect(base.getKey).toBeDefined();
        expect(base.getKey.length).toBe(1);
    });
    it('返回值验证 ', function () {
        document.body.innerHTML = tableTestTpl;
        expect(base.getKey(jTool('table[grid-manager="test"]'))).toBe('test');
        document.body.innerHTML = '';
    });
});

describe('base.getTable($dom, isSelectUp)', function() {
    let table = null;
    let $tableWrap = null;
    let $thead = null;
    beforeEach(function(){
        document.body.innerHTML = tableTestTpl;
    });

    afterEach(function(){
        document.body.innerHTML = '';
        table = null;
        $tableWrap = null;
        $thead = null;
    });

    it('基础验证', function () {
        expect(base.getTable).toBeDefined();
        expect(base.getTable.length).toBe(2);
    });

    it('base.getTable($dom)', function () {
        $tableWrap = jTool('.table-wrap');
        table = document.querySelector('table[grid-manager="test"]');
        expect(base.getTable($tableWrap).get(0)).toBe(table);
    });

    it('base.getTable($dom, false)', function () {
        $tableWrap = jTool('.table-wrap');
        table = document.querySelector('table[grid-manager="test"]');
        expect(base.getTable($tableWrap).get(0)).toBe(table);
    });

    it('base.getTable($dom, true)', function () {
        $thead = jTool('thead[grid-manager-thead]');
        table = document.querySelector('table[grid-manager="test"]');
        expect(base.getTable($thead, true).get(0)).toBe(table);
    });

    it('base.getTable(gridManagerName)', function () {
        table = document.querySelector('table[grid-manager="test"]');
        expect(base.getTable('test').get(0)).toBe(table);
    });
});

describe('base.getHead($table)', function() {
    let thead = null;
    beforeEach(function(){
        document.body.innerHTML = tableTestTpl;
    });

    afterEach(function(){
        document.body.innerHTML = '';
        thead = null;
    });

    it('基础验证', function () {
        expect(base.getHead).toBeDefined();
        expect(base.getHead.length).toBe(1);
    });

    it('返回值验证', function () {
        thead = document.querySelector('table[grid-manager="test"] thead[grid-manager-thead]');
        expect(base.getHead(jTool('table[grid-manager="test"]')).get(0)).toBe(thead);
    });
});

describe('base.getFakeHead($table)', function() {
    let fakeHead = null;
    beforeEach(function(){
        document.body.innerHTML = tableTestTpl;
    });

    afterEach(function(){
        document.body.innerHTML = '';
        fakeHead = null;
    });

    it('基础验证', function () {
        expect(base.getFakeHead).toBeDefined();
        expect(base.getFakeHead.length).toBe(1);
    });

    it('返回值验证', function () {
        fakeHead = document.querySelector('table[grid-manager="test"] thead[grid-manager-mock-thead]');
        expect(base.getFakeHead(jTool('table[grid-manager="test"]')).get(0)).toBe(fakeHead);
    });
});

describe('base.getHeadTr($table)', function() {
    let tr = null;
    beforeEach(function(){
        document.body.innerHTML = tableTestTpl;
    });

    afterEach(function(){
        document.body.innerHTML = '';
        tr = null;
    });

    it('基础验证', function () {
        expect(base.getHeadTr).toBeDefined();
        expect(base.getHeadTr.length).toBe(1);
    });

    it('返回值验证', function () {
        tr = document.querySelector('table[grid-manager="test"] thead[grid-manager-thead] tr');
        expect(base.getHeadTr(jTool('table[grid-manager="test"]')).get(0)).toBe(tr);
    });
});

describe('base.getFakeHeadTr($table)', function() {
    beforeEach(function(){
        document.body.innerHTML = tableTestTpl;
    });

    afterEach(function(){
        document.body.innerHTML = '';
    });

    it('基础验证', function () {
        expect(base.getFakeHeadTr).toBeDefined();
        expect(base.getFakeHeadTr.length).toBe(1);
    });

    it('返回值验证', function () {
        expect(base.getFakeHeadTr(jTool('table[grid-manager="test"]')).find('th').attr('th-name')).toBe('gm_checkbox');
    });
});


describe('base.getTh($table, thName)', function() {
    let $table = null;
    let th = null;
    let $fakeTh = null;
    beforeEach(function(){
        document.body.innerHTML = tableTestTpl;
        $table = jTool('table[grid-manager="test"]');
        th = document.querySelector('table[grid-manager="test"] thead[grid-manager-thead] tr th[th-name="createDate"]');
        $fakeTh = jTool('table[grid-manager="test"] thead[grid-manager-mock-thead] tr th[th-name="createDate"]');
    });

    afterEach(function(){
        document.body.innerHTML = '';
        $table = null;
        th = null;
        $fakeTh = null;
    });

    it('基础验证', function () {
        expect(base.getTh).toBeDefined();
        expect(base.getTh.length).toBe(2);
    });

    it('base.getTh($table, thName)', function () {
        expect(base.getTh($table, 'createDate').get(0)).toBe(th);
    });

    it('base.getTh($table, $fakeTh)', function () {
        expect(base.getTh($table, $fakeTh).get(0)).toBe(th);
    });
});

// TODO 下一个是 base.getAllTh
