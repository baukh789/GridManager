import jTool from '../src/common/jTool';
import base from '../src/common/base';
import { trimTpl } from '../src/common/parse';
import {CONSOLE_STYLE, FAKE_TABLE_HEAD_KEY, TABLE_HEAD_KEY, TABLE_KEY} from '../src/common/constants';
import tableTpl from './table-test.tpl.html';

// 清除空格
const tableTestTpl = trimTpl(tableTpl);
describe('base 验证类的属性及方法总量', () => {
    let getPropertyCount = null;
    beforeEach(() => {
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
    afterEach(() =>{
        getPropertyCount = null;
    });
    it('Function count', () => {
        // es6 中 constructor 也会算做为对象的属性, 所以总量上会增加1
        expect(getPropertyCount(Object.getOwnPropertyNames(Object.getPrototypeOf(base)))).toBe(34 + 1);
    });
});

describe('base.SIV_waitContainerAvailable', () => {
    it('基础验证', () => {
        expect(base.SIV_waitContainerAvailable).toBeDefined();
        expect(base.SIV_waitContainerAvailable).toEqual({});
    });
});

describe('base.SIV_waitTableAvailable', () => {
    it('基础验证', () => {
        expect(base.SIV_waitTableAvailable).toBeDefined();
        expect(base.SIV_waitTableAvailable).toEqual({});
    });
});

describe('base.outLog(msg, type)', () => {
    let table = null;
    let arg = null;
    beforeEach(() =>{
        // 存储console, 用于在测方式完成后原还console对象
        console._log = console.log;
        console.log = jasmine.createSpy("log");

        table = document.createElement('table');
        document.body.appendChild(table);
        arg = null;
    });

    afterEach(() =>{
        // 还原console
        console.log = console._log;

        document.body.innerHTML = '';
        table = null;
        arg = null;
    });

    it('基础验证', () =>{
        expect(base.outLog).toBeDefined();
        expect(base.outLog.length).toBe(2);
    });

    it('info', () =>{
        base.outLog('hello GridManager', 'info');
        expect(console.log).toHaveBeenCalledWith('%c GridManager Info %c hello GridManager ', ...CONSOLE_STYLE.INFO);
    });

    it('warn', () =>{
        base.outLog('hello GridManager', 'warn');
        expect(console.log).toHaveBeenCalledWith('%c GridManager Warn %c hello GridManager ', ...CONSOLE_STYLE.WARN);
    });

    it('error', () =>{
        base.outLog('hello GridManager', 'error');
        expect(console.log).toHaveBeenCalledWith('%c GridManager Error %c hello GridManager ', ...CONSOLE_STYLE.ERROR);
    });

    it('log', () =>{
        base.outLog('hello GridManager', 'log');
        expect(console.log).toHaveBeenCalledWith('%c GridManager Log %c hello GridManager ', ...CONSOLE_STYLE.LOG);
    });

    it('undefined', () =>{
        base.outLog('hello GridManager');
        expect(console.log).toHaveBeenCalledWith('%c GridManager Log %c hello GridManager ', ...CONSOLE_STYLE.LOG);
    });
});


describe('base.equal(obj1, obj2)', () => {
    it('基础验证', () => {
        expect(base.equal).toBeDefined();
        expect(base.equal.length).toBe(2);
    });

    it('返回值验证', () => {
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

describe('base.getDataForColumnMap(columnMap, obj)', () => {
    it('基础验证', () => {
        expect(base.getDataForColumnMap).toBeDefined();
        expect(base.getDataForColumnMap.length).toBe(2);
    });

    it('返回值验证', () => {
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


describe('base.getObjectIndexToArray(arr, obj)', () => {
    it('基础验证', () => {
        expect(base.getObjectIndexToArray).toBeDefined();
        expect(base.getObjectIndexToArray.length).toBe(2);
    });

    it('返回值验证', () => {
        let arr = [{a:1, b:2}, {name:'baukh', age:31}, {name:'kouzi', age:28}];
        let obj = {name:'baukh', age:31};
        expect(base.getObjectIndexToArray(arr, obj)).toBe(1);
    });
});

describe('base.showLoading($table, loadingTemplate, cb)', () => {
    let $body = null;
    beforeEach(() => {
        $body = jTool('body');
    });
    afterEach(() =>{
        $body = null;
        document.body.innerHTML = '';
    });
    it('基础验证', () => {
        expect(base.showLoading).toBeDefined();
        expect(base.showLoading.length).toBe(3);
    });

    it('并不存在的dom', () => {
        expect(base.showLoading(jTool('body-void'))).toBe(false);
    });

    it('无回调函数', () => {
        jasmine.clock().install();
        expect(base.showLoading($body)).toBe(true);
        jasmine.clock().tick(500);
        jasmine.clock().uninstall();
    });

    it('当前已经存在loading dom', () => {
        let load = document.createElement('div');
        load.className = 'gm-load-area';
        $body.append(load);
        expect(base.showLoading($body)).toBe(true);
    });

    it('回调函数是否执行', () => {
        jasmine.clock().install();
        let callback = jasmine.createSpy('callback');
        expect(base.showLoading($body, undefined, callback)).toBe(true);
        jasmine.clock().tick(100);
        expect(callback).toHaveBeenCalled();
        jasmine.clock().uninstall();
        callback = null;
    });
});

describe('base.cloneObject(object)', () => {
    it('基础验证', () => {
        expect(base.cloneObject).toBeDefined();
        expect(base.cloneObject.length).toBe(1);
    });

    it('执行结果', () =>{
        let o1 = {name: 'cc', ename: 'baukh'};
        let o2 = o1;
        expect(o2 === o1).toBe(true);
        expect(base.cloneObject(o2).name === o1.name).toBe(true);
        expect(base.cloneObject(o2) === o1).toBe(false);

        o1 = null;
        o2 = null;
    });
});

describe('base.compileFramework(settings, compileList)', () => {
    let settings = null;
    let compileList = null;
    beforeEach(() =>{
        console._log = console.log;
        console.log = jasmine.createSpy("log");
    });

    afterEach(() =>{
        settings = null;
        compileList = null;
        console.log = console._log;
    });

    it('基础验证', () => {
        expect(base.compileFramework).toBeDefined();
        expect(base.compileFramework.length).toBe(2);
    });

    it('vue 单个解析', () => {
        settings = {
            compileVue: jasmine.createSpy('callback')
        };
        compileList = document.createElement('div');
        base.compileFramework(settings, compileList);
        expect(settings.compileVue).toHaveBeenCalled();
    });

    it('vue 数组解析', () => {
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

    it('angular 单个解析', () => {
        settings = {
            compileAngularjs: jasmine.createSpy('callback')
        };
        compileList = document.querySelector('body');
        base.compileFramework(settings, compileList);
        expect(settings.compileAngularjs).toHaveBeenCalled();
    });

    it('angular 数组解析', () => {
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

    it('执行验证', () => {
        settings = {
            compileAngularjs: jasmine.createSpy('callback')
        };
        compileList = document.createElement('div');
        base.compileFramework(settings, compileList).then(res => {
            expect(res).toBeUndefined();
        });
    });

    it('异常验证', () => {
        settings = {
            compileVue: () => {
                throw new Error('返回一个错误');
            }
        };
        base.compileFramework(settings, compileList).catch(err => {
            expect(err).toBe('返回一个错误');
        });
    });
});

describe('base.key', () => {
    it('基础验证', () => {
        expect(base.key).toBeDefined();
        expect(base.key).toBe(TABLE_KEY);
    });
});

describe('base.tableHeadKey', () => {
    it('基础验证', () => {
        expect(base.tableHeadKey).toBeDefined();
        expect(base.tableHeadKey).toBe(TABLE_HEAD_KEY);
    });
});

describe('base.fakeTableHeadKey', () => {
    it('基础验证', () => {
        expect(base.fakeTableHeadKey).toBeDefined();
        expect(base.fakeTableHeadKey).toBe(FAKE_TABLE_HEAD_KEY);
    });
});

describe('base.getKey($table)', () => {
    beforeEach(() =>{
        document.body.innerHTML = tableTestTpl;
    });

    afterEach(() =>{
        document.body.innerHTML = '';
    });
    it('基础验证', () => {
        expect(base.getKey).toBeDefined();
        expect(base.getKey.length).toBe(1);
    });

    it('返回值验证 ', () => {
        expect(base.getKey(jTool('table[grid-manager="test"]'))).toBe('test');
    });

    it('错误情况验证 ', () => {
        expect(base.getKey()).toBe('');
    });
});

describe('base.getTable($dom, isSelectUp)', () => {
    let table = null;
    let $tableWrap = null;
    let $thead = null;
    beforeEach(() =>{
        document.body.innerHTML = tableTestTpl;
    });

    afterEach(() =>{
        document.body.innerHTML = '';
        table = null;
        $tableWrap = null;
        $thead = null;
    });

    it('基础验证', () => {
        expect(base.getTable).toBeDefined();
        expect(base.getTable.length).toBe(2);
    });

    it('base.getTable($dom)', () => {
        $tableWrap = jTool('.table-wrap');
        table = document.querySelector('table[grid-manager="test"]');
        expect(base.getTable($tableWrap).get(0)).toBe(table);
    });

    it('base.getTable($dom, false)', () => {
        $tableWrap = jTool('.table-wrap');
        table = document.querySelector('table[grid-manager="test"]');
        expect(base.getTable($tableWrap).get(0)).toBe(table);
    });

    it('base.getTable($dom, true)', () => {
        $thead = jTool('thead[grid-manager-thead]');
        table = document.querySelector('table[grid-manager="test"]');
        expect(base.getTable($thead, true).get(0)).toBe(table);
    });

    it('base.getTable(gridManagerName)', () => {
        table = document.querySelector('table[grid-manager="test"]');
        expect(base.getTable('test').get(0)).toBe(table);
    });
});

describe('base.getHead($table)', () => {
    let thead = null;
    beforeEach(() =>{
        document.body.innerHTML = tableTestTpl;
    });

    afterEach(() =>{
        document.body.innerHTML = '';
        thead = null;
    });

    it('基础验证', () => {
        expect(base.getHead).toBeDefined();
        expect(base.getHead.length).toBe(1);
    });

    it('返回值验证', () => {
        thead = document.querySelector('table[grid-manager="test"] thead[grid-manager-thead]');
        expect(base.getHead(jTool('table[grid-manager="test"]')).get(0)).toBe(thead);
    });
});

describe('base.getFakeHead($table)', () => {
    let fakeHead = null;
    beforeEach(() =>{
        document.body.innerHTML = tableTestTpl;
    });

    afterEach(() =>{
        document.body.innerHTML = '';
        fakeHead = null;
    });

    it('基础验证', () => {
        expect(base.getFakeHead).toBeDefined();
        expect(base.getFakeHead.length).toBe(1);
    });

    it('返回值验证', () => {
        fakeHead = document.querySelector('table[grid-manager="test"] thead[grid-manager-mock-thead]');
        expect(base.getFakeHead(jTool('table[grid-manager="test"]')).get(0)).toBe(fakeHead);
    });
});

describe('base.getHeadTr($table)', () => {
    let tr = null;
    beforeEach(() =>{
        document.body.innerHTML = tableTestTpl;
    });

    afterEach(() =>{
        document.body.innerHTML = '';
        tr = null;
    });

    it('基础验证', () => {
        expect(base.getHeadTr).toBeDefined();
        expect(base.getHeadTr.length).toBe(1);
    });

    it('返回值验证', () => {
        tr = document.querySelector('table[grid-manager="test"] thead[grid-manager-thead] tr');
        expect(base.getHeadTr(jTool('table[grid-manager="test"]')).get(0)).toBe(tr);
    });
});

describe('base.getFakeHeadTr($table)', () => {
    beforeEach(() =>{
        document.body.innerHTML = tableTestTpl;
    });

    afterEach(() =>{
        document.body.innerHTML = '';
    });

    it('基础验证', () => {
        expect(base.getFakeHeadTr).toBeDefined();
        expect(base.getFakeHeadTr.length).toBe(1);
    });

    it('返回值验证', () => {
        expect(base.getFakeHeadTr(jTool('table[grid-manager="test"]')).find('th').attr('th-name')).toBe('gm_checkbox');
    });
});

describe('base.getTh($table, thName)', () => {
    let $table = null;
    let th = null;
    let $fakeTh = null;
    beforeEach(() =>{
        document.body.innerHTML = tableTestTpl;
        $table = jTool('table[grid-manager="test"]');
        th = document.querySelector('table[grid-manager="test"] thead[grid-manager-thead] tr th[th-name="createDate"]');
        $fakeTh = jTool('table[grid-manager="test"] thead[grid-manager-mock-thead] tr th[th-name="createDate"]');
    });

    afterEach(() =>{
        document.body.innerHTML = '';
        $table = null;
        th = null;
        $fakeTh = null;
    });

    it('基础验证', () => {
        expect(base.getTh).toBeDefined();
        expect(base.getTh.length).toBe(2);
    });

    it('base.getTh($table, thName)', () => {
        expect(base.getTh($table, 'createDate').get(0)).toBe(th);
    });

    it('base.getTh($table, $fakeTh)', () => {
        expect(base.getTh($table, $fakeTh).get(0)).toBe(th);
    });
});

describe('base.getAllTh($table)', () => {
    let $table = null;
    beforeEach(() =>{
        document.body.innerHTML = tableTestTpl;
        $table = jTool('table[grid-manager="test"]');
    });

    afterEach(() =>{
        document.body.innerHTML = '';
        $table = null;
    });

    it('基础验证', () => {
        expect(base.getAllTh).toBeDefined();
        expect(base.getAllTh.length).toBe(1);
    });

    it('base.getAllTh($table)', () => {
        expect(base.getAllTh($table).length).toBe(10);
    });
});

describe('base.getVisibleTh($table, isGmCreate)', () => {
    let $table = null;
    beforeEach(() =>{
        document.body.innerHTML = tableTestTpl;
        $table = jTool('table[grid-manager="test"]');
    });

    afterEach(() =>{
        document.body.innerHTML = '';
        $table = null;
    });

    it('基础验证', () => {
        expect(base.getVisibleTh).toBeDefined();
        expect(base.getVisibleTh.length).toBe(2);
    });

    it('base.getVisibleTh($table)', () => {
        expect(base.getVisibleTh($table).length).toBe(10);
    });

    it('base.getVisibleTh($table, true)', () => {
        expect(base.getVisibleTh($table, true).length).toBe(2);
    });

    it('base.getVisibleTh($table, true)', () => {
        expect(base.getVisibleTh($table, false).length).toBe(8);
    });
});

describe('base.getFakeTh($table, thName)', () => {
    let $table = null;
    let fakeTh = null;
    let $fakeTh = null;
    beforeEach(() =>{
        document.body.innerHTML = tableTestTpl;
        $table = jTool('table[grid-manager="test"]');
        fakeTh = document.querySelector('table[grid-manager="test"] thead[grid-manager-mock-thead] tr th[th-name="createDate"]');
        $fakeTh = jTool('table[grid-manager="test"] thead[grid-manager-mock-thead] tr th[th-name="createDate"]');
    });

    afterEach(() =>{
        document.body.innerHTML = '';
        $table = null;
        fakeTh = null;
        $fakeTh = null;
    });

    it('基础验证', () => {
        expect(base.getFakeTh).toBeDefined();
        expect(base.getFakeTh.length).toBe(2);
    });

    it('base.getTh($table, thName)', () => {
        expect(base.getFakeTh($table, 'createDate').get(0)).toBe(fakeTh);
    });

    it('base.getTh($table, $fakeTh)', () => {
        expect(base.getFakeTh($table, $fakeTh).get(0)).toBe(fakeTh);
    });
});

describe('base.getFakeVisibleTh($table)', () => {
    let $table = null;
    beforeEach(() =>{
        document.body.innerHTML = tableTestTpl;
        $table = jTool('table[grid-manager="test"]');
    });

    afterEach(() =>{
        document.body.innerHTML = '';
        $table = null;
    });

    it('基础验证', () => {
        expect(base.getFakeVisibleTh).toBeDefined();
        expect(base.getFakeVisibleTh.length).toBe(1);
    });

    it('base.getFakeVisibleTh($table)', () => {
        expect(base.getFakeVisibleTh($table).length).toBe(10);
    });
});

describe('base.getThName($th)', () => {
    let $thList = null;
    beforeEach(() =>{
        document.body.innerHTML = tableTestTpl;
        $thList = jTool('table[grid-manager="test"] thead[grid-manager-thead] th');
    });

    afterEach(() =>{
        document.body.innerHTML = '';
        $thList = null;
    });

    it('基础验证', () => {
        expect(base.getThName).toBeDefined();
        expect(base.getThName.length).toBe(1);
    });

    it('base.getThName($table)', () => {
        expect(base.getThName($thList.eq(1))).toBe('gm_order');
        expect(base.getThName($thList.eq(3))).toBe('createDate');
    });
});

describe('base.getEmptyHtml(visibleNum, emptyTemplate)', () => {
    let tpl = null;
    beforeEach(() =>{
    });

    afterEach(() =>{
        document.body.innerHTML = '';
        tpl = '';
    });

    it('基础验证', () => {
        expect(base.getEmptyHtml).toBeDefined();
        expect(base.getEmptyHtml.length).toBe(2);
    });

    it('返回值验证', () => {
        tpl = `<tr emptyTemplate>
					<td colspan="5">
					无内容
					</td>
				</tr>`;
        expect(base.getEmptyHtml(5, '无内容').replace(/\s/, '')).toBe(tpl.replace(/\s/, ''));
    });
});

describe('base.updateEmptyCol($table)', () => {
    let $table = null;
    beforeEach(() =>{
    });

    afterEach(() =>{
        document.body.innerHTML = '';
        $table = null;
    });

    it('基础验证', () => {
        expect(base.updateEmptyCol).toBeDefined();
        expect(base.updateEmptyCol.length).toBe(1);
    });

    it('验证异常情况', () => {
        document.body.innerHTML = `<table>
                                        <thead grid-manager-thead>
                                            <tr>
                                                <th th-visible="visible">1</th><th th-visible="visible">2</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td></td>
                                            </tr>
                                        </tbody>
                                    </table>`;
        $table = jTool('table');
        base.updateEmptyCol($table);
        expect($table.find('td').attr('colspan')).toBeUndefined();
    });

    it('验证正常情况', () => {
        document.body.innerHTML = `<table>
                                        <thead grid-manager-thead>
                                            <tr>
                                                <th th-visible="visible">1</th><th th-visible="visible">2</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr emptyTemplate>
                                                <td></td>
                                            </tr>
                                        </tbody>
                                    </table>`;
        $table = jTool('table');
        base.updateEmptyCol($table);
        expect($table.find('td').attr('colspan')).toBe('2');
    });
});

describe('base.getColTd($dom)', () => {
    let $table = null;
    let $dom = null;
    beforeEach(() =>{
        document.body.innerHTML = tableTestTpl;
        $table = jTool('table[grid-manager="test"]');
    });

    afterEach(() =>{
        document.body.innerHTML = '';
        $table = null;
        $dom = null;
    });

    it('基础验证', () => {
        expect(base.getColTd).toBeDefined();
        expect(base.getColTd.length).toBe(1);
    });

    it('base.getColTd($th)', () => {
        $dom = $table.find('thead[grid-manager-thead] th[th-name="createDate"]');
        expect(base.getColTd($dom).length).toBe(10);
        expect(base.getColTd($dom).eq(2).text()).toBe('2018/5/14');
    });

    it('base.getColTd($td)', () => {
        $dom = $table.find('tbody tr[cache-key="1"] td').eq(3);
        expect(base.getColTd($dom).length).toBe(10);
        expect(base.getColTd($dom).eq(2).text()).toBe('2018/5/14');
    });
});

describe('base.setAreVisible($table, thNameList, isVisible, cb)', () => {
    let $table = null;
    beforeEach(() =>{
        document.body.innerHTML = tableTestTpl;
        $table = jTool('table[grid-manager="test"]');
    });

    afterEach(() =>{
        document.body.innerHTML = '';
        $table = null;
    });

    it('基础验证', () => {
        expect(base.setAreVisible).toBeDefined();
        expect(base.setAreVisible.length).toBe(4);
    });

    it('执行验证', () => {
        expect(base.getTh($table, 'gm_checkbox').attr('th-visible')).toBe('visible');
        expect(base.getTh($table, 'title').attr('th-visible')).toBe('visible');
        expect(base.getTh($table, 'pic').attr('th-visible')).toBe('visible');

        let cb = jasmine.createSpy('callback');
        // 设置gm_checkbox, pic不可见
        base.setAreVisible($table, ['gm_checkbox', 'pic'], false, cb);

        expect(cb).toHaveBeenCalled();
        expect(base.getTh($table, 'gm_checkbox').attr('th-visible')).toBe('none');
        expect(base.getTh($table, 'title').attr('th-visible')).toBe('visible');
        expect(base.getTh($table, 'pic').attr('th-visible')).toBe('none');

        // 设置gm_checkbox, pic可见
        base.setAreVisible($table, ['gm_checkbox', 'pic'], true);
        expect(base.getTh($table, 'gm_checkbox').attr('th-visible')).toBe('visible');
        expect(base.getTh($table, 'title').attr('th-visible')).toBe('visible');
        expect(base.getTh($table, 'pic').attr('th-visible')).toBe('visible');
    });
});

describe('base.updateVisibleLast($table)', () => {
    let $table = null;
    let $lastTh = null;
    beforeEach(() =>{
        document.body.innerHTML = tableTestTpl;
        $table = jTool('table[grid-manager="test"]');
    });

    afterEach(() =>{
        document.body.innerHTML = '';
        $table = null;
        $lastTh = null;
    });

    it('基础验证', () => {
        expect(base.updateVisibleLast).toBeDefined();
        expect(base.updateVisibleLast.length).toBe(1);
    });

    it('base.updateVisibleLast($table)', () => {
        $lastTh = $table.find('thead[grid-manager-thead] th[last-visible="true"]');
        expect(base.getThName($lastTh)).toBe('action');

        base.updateVisibleLast($table);

        // 在未变更列的情况下，执行结果不会变化
        $lastTh = $table.find('thead[grid-manager-thead] th[last-visible="true"]');
        expect(base.getThName($lastTh)).toBe('action');

        // 隐藏最后一列
        base.setAreVisible($table, [base.getThName($lastTh)], false);

        base.updateVisibleLast($table);
        $lastTh = $table.find('thead[grid-manager-thead] th[last-visible="true"]');
        expect(base.getThName($lastTh)).toBe('info');
    });
});
