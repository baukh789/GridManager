import jTool from '@common/jTool';
import base from '@common/base';
import { trimTpl } from '@common/parse';
import { CONSOLE_ERROR, CONSOLE_INFO, CONSOLE_WARN, CONSOLE_STYLE } from '@common/constants';
import tableTpl from '@test/table-test.tpl.html';
import { getColumnMap } from '@test/table-config';
import {TOOLBAR_KEY} from '@common/constants';

// 清除空格
const tableTestTpl = trimTpl(tableTpl);
describe('base 验证类的属性及方法总量', () => {
    let getPropertyCount = null;
    beforeEach(() => {
        getPropertyCount = o => {
            let n = 0;
            let count = 0;
            for (n in o) {
                if(o.hasOwnProperty(n)) {
                    count++;
                }
            }
            return count;
        };
    });
    afterEach(() => {
        getPropertyCount = null;
    });
    it('Function count', () => {
        // es6 中 constructor 也会算做为对象的属性, 所以总量上会增加1
        expect(getPropertyCount(Object.getOwnPropertyNames(Object.getPrototypeOf(base)))).toBe(36 + 1);
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

describe('outInfo, outWarn, outError', () => {
    let table = null;
    beforeEach(() => {
        // 存储console, 用于在测方式完成后原还console对象
        console._log = console.log;
        console.log = jasmine.createSpy('log');

        table = document.createElement('table');
        document.body.appendChild(table);
    });

    afterEach(() => {
        // 还原console
        console.log = console._log;

        document.body.innerHTML = '';
        table = null;
    });

    it('基础验证', () => {
        expect(base.outInfo).toBeDefined();
        expect(base.outInfo.length).toBe(1);

        expect(base.outWarn).toBeDefined();
        expect(base.outWarn.length).toBe(1);

        expect(base.outError).toBeDefined();
        expect(base.outError.length).toBe(1);
    });

    it('info', () => {
        base.outInfo('hello GridManager');
        expect(console.log).toHaveBeenCalledWith('%c GridManager Info %c hello GridManager ', ...CONSOLE_STYLE[CONSOLE_INFO]);
    });

    it('warn', () => {
        base.outWarn('hello GridManager');
        expect(console.log).toHaveBeenCalledWith('%c GridManager Warn %c hello GridManager ', ...CONSOLE_STYLE[CONSOLE_WARN]);
    });

    it('error', () => {
        base.outError('hello GridManager');
        expect(console.log).toHaveBeenCalledWith('%c GridManager Error %c hello GridManager ', ...CONSOLE_STYLE[CONSOLE_ERROR]);
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
        expect(base.getCloneRowData).toBeDefined();
        expect(base.getCloneRowData.length).toBe(2);
    });

    it('返回值验证', () => {
        let columnMap = {
            info: {
                key: 'info',
                text: '介绍',
                isShow: true
            },
            username: {
                key: 'username',
                text: '作者',
                isShow: true
            },
            gm_checkbox: {
                key: 'gm_checkbox',
                isAutoCreate: true,
                text: '',
                isShow: true
            }
        };
        let data = {
            username: 'baukh',
            age: 32,
            content: 'this is content',
            info: 'this is info',
            gm_checkbox: true,
            gm_checkbox_disabled: true
        };
        let cloneData = {
            username: 'baukh',
            age: 32,
            content: 'this is content',
            info: 'this is info'
        };
        expect(base.getCloneRowData(columnMap, data)).toEqual(cloneData);

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
        let arr = [{a: 1, b: 2}, {name: 'baukh', age: 31}, {name: 'kouzi', age: 28}];
        let obj = {name: 'baukh', age: 31};
        expect(base.getObjectIndexToArray(arr, obj)).toBe(1);
    });
});

describe('base.showLoading(gridManagerName, loadingTemplate)', () => {
    let gridManagerName = null;
    beforeEach(() => {
        gridManagerName = 'test';
        document.body.innerHTML = tableTestTpl;
    });
    afterEach(() => {
        gridManagerName = null;
        document.body.innerHTML = '';
    });
    it('基础验证', () => {
        expect(base.showLoading).toBeDefined();
        expect(base.showLoading.length).toBe(2);
    });

    it('当前未存在loading dom', () => {
        expect(base.showLoading(gridManagerName)).toBe(true);
    });

    it('第二次执行(上一次执行未进行销毁)', () => {
        jTool('.table-wrap').append('<div class="gm-load-area"></div>');
        expect(base.showLoading(gridManagerName)).toBe(true);
    });
});

describe('base.hideLoading(gridManagerName)', () => {
    let gridManagerName = null;
    beforeEach(() => {
        gridManagerName = 'test';
        document.body.innerHTML = tableTestTpl;
        jTool('.table-wrap').append('<div class="gm-load-area"></div>');
    });
    afterEach(() => {
        gridManagerName = null;
        document.body.innerHTML = '';
    });
    it('基础验证', () => {
        expect(base.hideLoading).toBeDefined();
        expect(base.hideLoading.length).toBe(1);
    });

    it('执行验证', () => {
        jasmine.clock().install();
        expect(base.hideLoading(gridManagerName)).toBe(true);
        expect(document.querySelector('.gm-load-area').nodeName).toBe('DIV');
        jasmine.clock().tick(500);
        expect(document.querySelector('.gm-load-area')).toBeNull();
        jasmine.clock().uninstall();
    });
});

describe('base.cloneObject(object)', () => {
    it('基础验证', () => {
        expect(base.cloneObject).toBeDefined();
        expect(base.cloneObject.length).toBe(1);
    });

    it('执行结果', () => {
        let o1 = {name: 'cc', ename: 'baukh'};
        let o2 = o1;
        expect(o2 === o1).toBe(true);
        expect(base.cloneObject(o2).name === o1.name).toBe(true);
        expect(base.cloneObject(o2) === o1).toBe(false);

        o1 = null;
        o2 = null;
    });
});

describe('base.getKey($table)', () => {
    beforeEach(() => {
        document.body.innerHTML = tableTestTpl;
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
    it('基础验证', () => {
        expect(base.getKey).toBeDefined();
        expect(base.getKey.length).toBe(1);
    });

    it('参数为gridManagerName ', () => {
        expect(base.getKey('test')).toBe('test');
    });

    it('参数为table ', () => {
        expect(base.getKey(document.querySelector('table[grid-manager="test"]'))).toBe('test');
    });

    it('参数为$table ', () => {
        expect(base.getKey(jTool('table[grid-manager="test"]'))).toBe('test');
    });

    it('错误情况验证 ', () => {
        expect(base.getKey()).toBeUndefined();
    });
});

describe('base.getQuerySelector(gridManagerName)', () => {
    it('基础验证', () => {
        expect(base.getQuerySelector).toBeDefined();
        expect(base.getQuerySelector.length).toBe(1);
    });

    it('返回值验证 ', () => {
        expect(base.getQuerySelector('test')).toBe('table[grid-manager="test"]');
        expect(base.getQuerySelector('test2')).toBe('table[grid-manager="test2"]');
    });
});

describe('base.getTable($dom, isSelectUp)', () => {
    let table = null;
    let $tableWrap = null;
    let $thead = null;
    beforeEach(() => {
        document.body.innerHTML = tableTestTpl;
        table = document.querySelector('table[grid-manager="test"]');
        $tableWrap = jTool('.table-wrap');
        $thead = jTool('thead[grid-manager-thead]');
    });

    afterEach(() => {
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
        expect(base.getTable($tableWrap).get(0)).toBe(table);
    });

    it('base.getTable($dom, false)', () => {
        expect(base.getTable($tableWrap).get(0)).toBe(table);
    });

    it('base.getTable($dom, true)', () => {
        expect(base.getTable($thead, true).get(0)).toBe(table);
    });

    it('base.getTable(gridManagerName)', () => {
        expect(base.getTable('test').get(0)).toBe(table);
    });
});

describe('base.getWrap($dom, isSelectUp)', () => {
    let tableWrap = null;
    let $body = null;
    let $table = null;
    beforeEach(() => {
        document.body.innerHTML = tableTestTpl;
        tableWrap = document.querySelector('.table-wrap[grid-manager-wrap="test"]');
        $body = jTool('body');
        $table = jTool('table[grid-manager="test"]');
    });

    afterEach(() => {
        document.body.innerHTML = '';
        tableWrap = null;
        $body = null;
        $table = null;
    });

    it('基础验证', () => {
        expect(base.getWrap).toBeDefined();
        expect(base.getWrap.length).toBe(2);
    });

    it('base.getWrap($dom)', () => {
        expect(base.getWrap($body).get(0)).toBe(tableWrap);
    });

    it('base.getWrap($dom, false)', () => {
        expect(base.getWrap($body, false).get(0)).toBe(tableWrap);
    });

    it('base.getWrap($dom, true)', () => {
        expect(base.getWrap($table, true).get(0)).toBe(tableWrap);
    });

    it('base.getWrap(gridManagerName)', () => {
        expect(base.getWrap('test').get(0)).toBe(tableWrap);
    });
});

describe('base.getDiv($dom, isSelectUp)', () => {
    let tableDiv = null;
    let $body = null;
    let $table = null;
    beforeEach(() => {
        document.body.innerHTML = tableTestTpl;
        tableDiv = document.querySelector('.table-div[grid-manager-div="test"]');
        $body = jTool('body');
        $table = jTool('table[grid-manager="test"]');
    });

    afterEach(() => {
        document.body.innerHTML = '';
        tableDiv = null;
        $body = null;
        $table = null;
    });

    it('基础验证', () => {
        expect(base.getDiv).toBeDefined();
        expect(base.getDiv.length).toBe(2);
    });

    it('base.getDiv($dom)', () => {
        expect(base.getDiv($body).get(0)).toBe(tableDiv);
    });

    it('base.getDiv($dom, false)', () => {
        expect(base.getDiv($body, false).get(0)).toBe(tableDiv);
    });

    it('base.getDiv($dom, true)', () => {
        expect(base.getDiv($table, true).get(0)).toBe(tableDiv);
    });

    it('base.getDiv(gridManagerName)', () => {
        expect(base.getDiv('test').get(0)).toBe(tableDiv);
    });
});

describe('base.getThead(gridManagerName)', () => {
    let thead = null;
    beforeEach(() => {
        document.body.innerHTML = tableTestTpl;
    });

    afterEach(() => {
        document.body.innerHTML = '';
        thead = null;
    });

    it('基础验证', () => {
        expect(base.getThead).toBeDefined();
        expect(base.getThead.length).toBe(1);
    });

    it('返回值验证', () => {
        thead = document.querySelector('thead[grid-manager-thead="test"]');
        expect(base.getThead('test').get(0)).toBe(thead);
    });
});

describe('base.getFakeThead(gridManagerName)', () => {
    let fakeHead = null;
    beforeEach(() => {
        document.body.innerHTML = tableTestTpl;
    });

    afterEach(() => {
        document.body.innerHTML = '';
        fakeHead = null;
    });

    it('基础验证', () => {
        expect(base.getFakeThead).toBeDefined();
        expect(base.getFakeThead.length).toBe(1);
    });

    it('返回值验证', () => {
        fakeHead = document.querySelector('thead[grid-manager-mock-thead="test"]');
        expect(base.getFakeThead('test').get(0)).toBe(fakeHead);
    });
});

describe('base.getTbody(gridManagerName)', () => {
    let tbody = null;
    beforeEach(() => {
        document.body.innerHTML = tableTestTpl;
    });

    afterEach(() => {
        document.body.innerHTML = '';
        tbody = null;
    });

    it('基础验证', () => {
        expect(base.getTbody).toBeDefined();
        expect(base.getTbody.length).toBe(1);
    });

    it('返回值验证', () => {
        tbody = document.querySelector('table[grid-manager="test"] tbody');
        expect(base.getTbody('test').get(0)).toBe(tbody);
    });
});

describe('base.getTh(gridManagerName, thName)', () => {
    let th = null;
    let $fakeTh = null;
    beforeEach(() => {
        document.body.innerHTML = tableTestTpl;
        th = document.querySelector('table[grid-manager="test"] thead[grid-manager-thead] tr th[th-name="createDate"]');
        $fakeTh = jTool('table[grid-manager="test"] thead[grid-manager-mock-thead] tr th[th-name="createDate"]');
    });

    afterEach(() => {
        document.body.innerHTML = '';
        th = null;
        $fakeTh = null;
    });

    it('基础验证', () => {
        expect(base.getTh).toBeDefined();
        expect(base.getTh.length).toBe(2);
    });

    it('执行验证: thName', () => {
        expect(base.getTh('test', 'createDate').get(0)).toBe(th);
    });

    it('执行验证: thDOM', () => {
        expect(base.getTh('test', $fakeTh).get(0)).toBe(th);
    });
});

describe('base.getAllTh(gridManagerName)', () => {
    beforeEach(() => {
        document.body.innerHTML = tableTestTpl;
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('基础验证', () => {
        expect(base.getAllTh).toBeDefined();
        expect(base.getAllTh.length).toBe(1);
    });

    it('测试返回长度', () => {
        expect(base.getAllTh('test').length).toBe(10);
    });
});

describe('base.getVisibleTh(gridManagerName, isGmCreate)', () => {
    let gridManagerName = null;
    beforeEach(() => {
        document.body.innerHTML = tableTestTpl;
        gridManagerName = 'test';
    });

    afterEach(() => {
        document.body.innerHTML = '';
        gridManagerName = null;
    });

    it('基础验证', () => {
        expect(base.getVisibleTh).toBeDefined();
        expect(base.getVisibleTh.length).toBe(2);
    });

    it('base.getVisibleTh(gridManagerName)', () => {
        expect(base.getVisibleTh(gridManagerName).length).toBe(10);
    });

    it('base.getVisibleTh(gridManagerName, true)', () => {
        expect(base.getVisibleTh(gridManagerName, true).length).toBe(2);
    });

    it('base.getVisibleTh(gridManagerName, true)', () => {
        expect(base.getVisibleTh(gridManagerName, false).length).toBe(8);
    });
});

describe('base.getFakeTh(gridManagerName, thName)', () => {
    let gridManagerName = null;
    let fakeTh = null;
    let $fakeTh = null;
    beforeEach(() => {
        document.body.innerHTML = tableTestTpl;
        gridManagerName = 'test';
        fakeTh = document.querySelector('table[grid-manager="test"] thead[grid-manager-mock-thead] tr th[th-name="createDate"]');
        $fakeTh = jTool('table[grid-manager="test"] thead[grid-manager-mock-thead] tr th[th-name="createDate"]');
    });

    afterEach(() => {
        document.body.innerHTML = '';
        gridManagerName = null;
        fakeTh = null;
        $fakeTh = null;
    });

    it('基础验证', () => {
        expect(base.getFakeTh).toBeDefined();
        expect(base.getFakeTh.length).toBe(2);
    });

    it('base.getFakeTh(gridManagerName, thName)', () => {
        expect(base.getFakeTh(gridManagerName, 'createDate').get(0)).toBe(fakeTh);
    });

    it('base.getFakeTh(gridManagerName, $fakeTh)', () => {
        expect(base.getFakeTh(gridManagerName, $fakeTh).get(0)).toBe(fakeTh);
    });
});

describe('base.getFakeVisibleTh(gridManagerName)', () => {
    let gridManagerName = null;
    beforeEach(() => {
        document.body.innerHTML = tableTestTpl;
        gridManagerName = 'test';
    });

    afterEach(() => {
        document.body.innerHTML = '';
        gridManagerName = null;
    });

    it('基础验证', () => {
        expect(base.getFakeVisibleTh).toBeDefined();
        expect(base.getFakeVisibleTh.length).toBe(1);
    });

    it('返回值验证', () => {
        expect(base.getFakeVisibleTh(gridManagerName).length).toBe(10);
    });
});

describe('base.getThName($th)', () => {
    let $thList = null;
    beforeEach(() => {
        document.body.innerHTML = tableTestTpl;
        $thList = jTool('table[grid-manager="test"] thead[grid-manager-thead] th');
    });

    afterEach(() => {
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

describe('base.getEmptyHtml(gridManagerName, visibleNum, emptyTemplate, style)', () => {
    let tpl = null;
    beforeEach(() => {
    });

    afterEach(() => {
        document.body.innerHTML = '';
        tpl = '';
    });

    it('基础验证', () => {
        expect(base.getEmptyHtml).toBeDefined();
        expect(base.getEmptyHtml.length).toBe(4);
    });

    it('返回值验证', () => {
        tpl = `<tr empty-template="test-empty" style="height: 100px;">
					<td colspan="5">
					无内容
					</td>
				</tr>`;
        expect(base.getEmptyHtml('test-empty', 5, '无内容', 'height: 100px;').replace(/\s/g, '')).toBe(tpl.replace(/\s/g, ''));
    });
});


describe('base.getEmpty(gridManagerName)', () => {
    let tpl = null;
    beforeEach(() => {
        document.body.innerHTML = `<table grid-manager="test-empty">
                                        <thead grid-manager-thead>
                                            <tr>
                                                <th th-visible="visible">1</th><th th-visible="visible">2</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr empty-template="test-empty">
                                                <td></td>
                                            </tr>
                                        </tbody>
                                    </table>`;
    });

    afterEach(() => {
        document.body.innerHTML = '';
        tpl = '';
    });

    it('基础验证', () => {
        expect(base.getEmpty).toBeDefined();
        expect(base.getEmpty.length).toBe(1);
    });

    it('返回值验证', () => {
        tpl = `<tr empty-template="test-empty">
                 <td></td>
               </tr>`;
        expect(base.getEmpty('test-empty').get(0).outerHTML.replace(/\s/g, '')).toBe(tpl.replace(/\s/g, ''));
    });
});

describe('base.updateEmptyCol(gridManagerName)', () => {
    let gridManagerName = null;
    let $table = null;
    beforeEach(() => {
        gridManagerName = 'test-empty';
    });

    afterEach(() => {
        document.body.innerHTML = '';
        gridManagerName = null;
        $table = null;
    });

    it('基础验证', () => {
        expect(base.updateEmptyCol).toBeDefined();
        expect(base.updateEmptyCol.length).toBe(1);
    });

    it('验证异常情况', () => {
        document.body.innerHTML = `<table grid-manager="test-empty">
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
        $table = jTool('table[grid-manager="test-empty"]');
        base.updateEmptyCol(gridManagerName);
        expect($table.find('td').attr('colspan')).toBeUndefined();
    });

    it('验证正常情况', () => {
        document.body.innerHTML = `<table grid-manager="test-empty">
                                        <thead grid-manager-thead>
                                            <tr>
                                                <th th-visible="visible">1</th><th th-visible="visible">2</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr empty-template="test-empty">
                                                <td></td>
                                            </tr>
                                        </tbody>
                                    </table>`;
        $table = jTool('table[grid-manager="test-empty"]');
        base.updateEmptyCol(gridManagerName);
        expect($table.find('td').attr('colspan')).toBe('2');
    });
});

describe('base.getColTd($dom)', () => {
    let $table = null;
    let $dom = null;
    beforeEach(() => {
        document.body.innerHTML = tableTestTpl;
        $table = jTool('table[grid-manager="test"]');
    });

    afterEach(() => {
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

describe('base.setAreVisible(gridManagerName, thNameList, isVisible, cb)', () => {
    let gridManagerName = null;
    beforeEach(() => {
        document.body.innerHTML = tableTestTpl;
        gridManagerName = 'test';
    });

    afterEach(() => {
        document.body.innerHTML = '';
        gridManagerName = null;
    });

    it('基础验证', () => {
        expect(base.setAreVisible).toBeDefined();
        expect(base.setAreVisible.length).toBe(3);
    });

    it('执行验证', () => {
        expect(base.getTh('test', 'gm_checkbox').attr('th-visible')).toBe('visible');
        expect(base.getTh('test', 'title').attr('th-visible')).toBe('visible');
        expect(base.getTh('test', 'pic').attr('th-visible')).toBe('visible');

        // 设置gm_checkbox, pic不可见
        base.setAreVisible(gridManagerName, ['gm_checkbox', 'pic'], false);

        expect(base.getTh('test', 'gm_checkbox').attr('th-visible')).toBe('none');
        expect(base.getTh('test', 'title').attr('th-visible')).toBe('visible');
        expect(base.getTh('test', 'pic').attr('th-visible')).toBe('none');

        // 设置gm_checkbox, pic可见
        base.setAreVisible(gridManagerName, ['gm_checkbox', 'pic'], true);
        expect(base.getTh('test', 'gm_checkbox').attr('th-visible')).toBe('visible');
        expect(base.getTh('test', 'title').attr('th-visible')).toBe('visible');
        expect(base.getTh('test', 'pic').attr('th-visible')).toBe('visible');
    });
});

describe('base.updateVisibleLast(gridManagerName)', () => {
    let $table = null;
    let gridManagerName = null;
    let $lastTh = null;
    beforeEach(() => {
        document.body.innerHTML = tableTestTpl;
        gridManagerName = 'test';
        $table = jTool('table[grid-manager="test"]');
    });

    afterEach(() => {
        gridManagerName = null;
        $table = null;
        $lastTh = null;
        document.body.innerHTML = '';
    });

    it('基础验证', () => {
        expect(base.updateVisibleLast).toBeDefined();
        expect(base.updateVisibleLast.length).toBe(1);
    });

    it('执行验证', () => {
        $lastTh = $table.find('thead[grid-manager-thead] th[last-visible="true"]');
        expect(base.getThName($lastTh)).toBe('action');

        base.updateVisibleLast(gridManagerName);

        // // 在未变更列的情况下，执行结果不会变化
        $lastTh = $table.find('thead[grid-manager-thead] th[last-visible="true"]');
        expect(base.getThName($lastTh)).toBe('action');

        // 隐藏最后一列
        base.setAreVisible(gridManagerName, [base.getThName($lastTh)], false);

        base.updateVisibleLast(gridManagerName);
        $lastTh = $table.find('thead[grid-manager-thead] th[last-visible="true"]');
        expect(base.getThName($lastTh)).toBe('info');
    });
});

describe('base.updateThWidth(settings, isInit)', () => {
    let testCon = null;
    let settings = null;
    beforeEach(() => {
        testCon = document.createElement('div');
        testCon.style.width = '1200px';
        testCon.innerHTML = tableTestTpl;
        document.body.appendChild(testCon);
        document.querySelector('.text-dreamland').style.position = 'absolute';
        document.querySelector('.text-dreamland').style.visibility = 'hidden';
        document.querySelector('.text-dreamland').style.zIndex = -10;
        settings = {
            gridManagerName: 'test',
            columnMap: getColumnMap(),
            isIconFollowText: false
        };
    });

    afterEach(() => {
        testCon = null;
        settings = null;
        document.querySelector('.text-dreamland').style.position = 'static';
        document.querySelector('.text-dreamland').style.visibility = 'visible';
        document.querySelector('.text-dreamland').style.zIndex = 1;
        document.body.innerHTML = '';
    });

    it('基础验证', () => {
        expect(base.updateThWidth).toBeDefined();
        expect(base.updateThWidth.length).toBe(2);
    });

    it('初始化时的更新', () => {
        base.updateThWidth(settings, true);
        expect(settings.columnMap['gm_checkbox'].width).toBe('40px');
        expect(settings.columnMap['gm_order'].width).toBe('50px');
        expect(settings.columnMap['pic'].width).toBe('110px');
        expect(settings.columnMap['title'].width).toBe('508px');
        expect(settings.columnMap['type'].width).toBe('150px');
        expect(settings.columnMap['info'].width).toBe('100px');
        expect(settings.columnMap['username'].width).toBe('100px');
        expect(settings.columnMap['createDate'].width).toBe('130px');
        expect(settings.columnMap['lastDate'].width).toBe('130px');
        expect(settings.columnMap['action'].width).toBe('100px');
    });

    it('非初始化时的更新', () => {
        base.updateThWidth(settings, false);
        expect(settings.columnMap['gm_checkbox'].width).toBe('40px');
        expect(settings.columnMap['gm_order'].width).toBe('50px');
        expect(settings.columnMap['pic'].width).toBe('110px');
        expect(settings.columnMap['title'].width).toBe('290px');
        expect(settings.columnMap['type'].width).toBe('150px');
        expect(settings.columnMap['info'].width).toBe('100px');
        expect(settings.columnMap['username'].width).toBe('100px');
        expect(settings.columnMap['createDate'].width).toBe('130px');
        expect(settings.columnMap['lastDate'].width).toBe('130px');
        expect(settings.columnMap['action'].width).toBe('100px');
    });

    it('隐藏一个定制列', () => {
        base.updateThWidth(settings, false);
        expect(settings.columnMap['gm_checkbox'].width).toBe('40px');
        expect(settings.columnMap['gm_order'].width).toBe('50px');
        expect(settings.columnMap['pic'].width).toBe('110px');
        expect(settings.columnMap['title'].width).toBe('290px');
        expect(settings.columnMap['type'].width).toBe('150px');
        expect(settings.columnMap['info'].width).toBe('100px');
        expect(settings.columnMap['username'].width).toBe('100px');
        expect(settings.columnMap['createDate'].width).toBe('130px');
        expect(settings.columnMap['lastDate'].width).toBe('130px');
        expect(settings.columnMap['action'].width).toBe('100px');
    });

    it('隐藏一个拥有宽度的可定制列', () => {
        settings.columnMap['pic'].isShow = false;
        base.updateThWidth(settings, false);
        expect(settings.columnMap['gm_checkbox'].width).toBe('40px');
        expect(settings.columnMap['gm_order'].width).toBe('50px');
        expect(settings.columnMap['title'].width).toBe('400px');
        expect(settings.columnMap['type'].width).toBe('150px');
        expect(settings.columnMap['info'].width).toBe('100px');
        expect(settings.columnMap['username'].width).toBe('100px');
        expect(settings.columnMap['createDate'].width).toBe('130px');
        expect(settings.columnMap['lastDate'].width).toBe('130px');
        expect(settings.columnMap['action'].width).toBe('100px');
    });

    it('仅有一个自动和两个拥有宽度的定制列', () => {
        settings.columnMap['pic'].isShow = false;
        settings.columnMap['type'].isShow = false;
        settings.columnMap['info'].isShow = false;
        settings.columnMap['username'].isShow = false;
        base.updateThWidth(settings, false);
        expect(settings.columnMap['gm_checkbox'].width).toBe('40px');
        expect(settings.columnMap['gm_order'].width).toBe('50px');
        expect(settings.columnMap['title'].width).toBe('750px');
        expect(settings.columnMap['createDate'].width).toBe('130px');
        expect(settings.columnMap['lastDate'].width).toBe('130px');
        expect(settings.columnMap['action'].width).toBe('100px');
    });

    it('仅有两个拥有宽度的定制列', () => {
        settings.columnMap['pic'].isShow = false;
        settings.columnMap['type'].isShow = false;
        settings.columnMap['info'].isShow = false;
        settings.columnMap['username'].isShow = false;
        settings.columnMap['title'].isShow = false;
        base.updateThWidth(settings, false);
        expect(settings.columnMap['gm_checkbox'].width).toBe('40px');
        expect(settings.columnMap['gm_order'].width).toBe('50px');
        expect(settings.columnMap['createDate'].width).toBe('880px');
        expect(settings.columnMap['lastDate'].width).toBe('130px');
        expect(settings.columnMap['action'].width).toBe('100px');
    });

    it('仅有一个拥有宽度的定制列', () => {
        settings.columnMap['pic'].isShow = false;
        settings.columnMap['type'].isShow = false;
        settings.columnMap['info'].isShow = false;
        settings.columnMap['username'].isShow = false;
        settings.columnMap['title'].isShow = false;
        settings.columnMap['createDate'].isShow = false;
        base.updateThWidth(settings, false);
        expect(settings.columnMap['gm_checkbox'].width).toBe('40px');
        expect(settings.columnMap['gm_order'].width).toBe('50px');
        expect(settings.columnMap['lastDate'].width).toBe('1010px');
        expect(settings.columnMap['action'].width).toBe('100px');
    });

    it('打开一个拥有宽度的定制列', () => {
        settings.columnMap['pic'].isShow = false;
        settings.columnMap['type'].isShow = true;
        settings.columnMap['info'].isShow = false;
        settings.columnMap['username'].isShow = false;
        settings.columnMap['title'].isShow = false;
        settings.columnMap['createDate'].isShow = false;
        base.updateThWidth(settings, false);
        expect(settings.columnMap['gm_checkbox'].width).toBe('40px');
        expect(settings.columnMap['gm_order'].width).toBe('50px');
        expect(settings.columnMap['type'].width).toBe('880px');
        expect(settings.columnMap['lastDate'].width).toBe('130px');
        expect(settings.columnMap['action'].width).toBe('100px');
    });

    it('打开一个自适应宽度的定制列', () => {
        settings.columnMap['pic'].isShow = false;
        settings.columnMap['type'].isShow = true;
        settings.columnMap['info'].isShow = false;
        settings.columnMap['username'].isShow = false;
        settings.columnMap['title'].isShow = true;
        settings.columnMap['createDate'].isShow = false;
        base.updateThWidth(settings, false);
        expect(settings.columnMap['gm_checkbox'].width).toBe('40px');
        expect(settings.columnMap['gm_order'].width).toBe('50px');
        expect(settings.columnMap['type'].width).toBe('150px');
        expect(settings.columnMap['title'].width).toBe('730px');
        expect(settings.columnMap['lastDate'].width).toBe('130px');
        expect(settings.columnMap['action'].width).toBe('100px');
    });

    it('再打开一个自适应宽度的定制列', () => {
        settings.columnMap['pic'].isShow = true;
        settings.columnMap['pic'].__width = null;  // 修改 _width， 将该列设置为自动列
        settings.columnMap['type'].isShow = true;
        settings.columnMap['info'].isShow = false;
        settings.columnMap['username'].isShow = false;
        settings.columnMap['title'].isShow = true;
        settings.columnMap['createDate'].isShow = false;

        let picThTextWidth = base.getThTextWidth('test', jTool('[grid-manager-thead="test"] th[th-name="pic"]'), settings.columnMap['pic'].isIconFollowText);
        let titleThTextWidth = base.getThTextWidth('test', jTool('[grid-manager-thead="test"] th[th-name="title"]'), settings.columnMap['title'].isIconFollowText);
        let overage = 1200 - 40 - 50 - 150 - 130 - 100 - picThTextWidth - titleThTextWidth;
        base.updateThWidth(settings, false);
        expect(settings.columnMap['gm_checkbox'].width).toBe('40px');
        expect(settings.columnMap['gm_order'].width).toBe('50px');
        expect(settings.columnMap['pic'].width).toBe(`${overage / 2 + picThTextWidth}px`);
        expect(settings.columnMap['type'].width).toBe('150px');
        expect(settings.columnMap['title'].width).toBe(`${overage / 2 + titleThTextWidth}px`);
        expect(settings.columnMap['lastDate'].width).toBe('130px');
        expect(settings.columnMap['action'].width).toBe('100px');

        picThTextWidth = null;
        titleThTextWidth = null;
        overage = null;
    });
});


describe('base.getThTextWidth(gridManagerName, $th, isIconFollowText)', () => {
    let $th;
    beforeEach(() => {
        document.body.innerHTML = tableTestTpl;

        // TODO 由于没有引样式文件，所以需要通过修改样式属性来处理
        document.querySelector('.text-dreamland').style.position = 'absolute';
        document.querySelector('.text-dreamland').style.visibility = 'hidden';
        document.querySelector('.text-dreamland').style.zIndex = -10;
        $th = jTool('thead[grid-manager-thead="test"] th[th-name="pic"]');
    });

    afterEach(() => {
        $th = null;
        document.querySelector('.text-dreamland').style.position = 'static';
        document.querySelector('.text-dreamland').style.visibility = 'visible';
        document.querySelector('.text-dreamland').style.zIndex = 1;
        document.body.innerHTML = '';
    });

    it('基础验证', () => {
        expect(base.getThTextWidth).toBeDefined();
        expect(base.getThTextWidth.length).toBe(3);
    });

    it('执行验证', () => {
        expect(typeof base.getThTextWidth('test', $th)).toBe('number');
        expect(typeof base.getThTextWidth('test', $th, true)).toBe('number');
    });
});

describe('base.getTextWidth(gridManagerName, content, cssObj)', () => {
    beforeEach(() => {
        document.body.innerHTML = tableTestTpl;
        document.querySelector('.text-dreamland').style.position = 'absolute';
        document.querySelector('.text-dreamland').style.visibility = 'hidden';
        document.querySelector('.text-dreamland').style.zIndex = -10;
    });

    afterEach(() => {
        document.querySelector('.text-dreamland').style.position = 'static';
        document.querySelector('.text-dreamland').style.visibility = 'visible';
        document.querySelector('.text-dreamland').style.zIndex = 1;
        document.body.innerHTML = '';
    });

    it('基础验证', () => {
        expect(base.getTextWidth).toBeDefined();
        expect(base.getTextWidth.length).toBe(3);
    });

    it('执行验证', () => {
        // expect(base.getTextWidth('test', '123456')).toBe(40);
        // expect(base.getTextWidth('test', '123456', {'fontSize': '24px'})).toBe(80);

        // TODO CI 上跑测试无法精准到数值，所以用以下进行替代。 本地测试精准数值是通过的
        expect(typeof base.getTextWidth('test', '123456')).toBe('number');
        expect(typeof base.getTextWidth('test', '123456', {'fontSize': '24px'})).toBe('number');
    });
});

describe('base.updateScrollStatus(gridManagerName)', () => {
    let $table = null;
    let $tableDiv = null;
    beforeEach(() => {
        document.body.innerHTML = tableTestTpl;
        $table = jTool('table');
        $tableDiv = jTool('.table-div');
    });

    afterEach(() => {
        $table = null;
        $tableDiv = null;
        document.body.innerHTML = '';
    });

    it('基础验证', () => {
        expect(base.updateScrollStatus).toBeDefined();
        expect(base.updateScrollStatus.length).toBe(1);
    });

    it('执行验证', () => {
        $table.width(1000);
        $tableDiv.width(1100);
        base.updateScrollStatus('test');
        expect($tableDiv.css('overflow-x')).toBe('hidden');

        $table.width(1100);
        $tableDiv.width(1000);
        base.updateScrollStatus('test');
        expect($tableDiv.css('overflow-x')).toBe('auto');
    });
});

describe('base.calcLayout(gridManagerName, width, height, supportAjaxPage)', () => {
    let $wrap = null;
    let $div = null;
    let theadHeight = null;
    let ajaxPageHeight = null;
    let $tableHeader = null;
    beforeEach(() => {
        document.body.innerHTML = tableTestTpl;
        $wrap = jTool('.table-wrap');
        $div = jTool('.table-div');
        $tableHeader = jTool('.table-header', $wrap);
        theadHeight = base.getThead('test').height();
        ajaxPageHeight = jTool(`[${TOOLBAR_KEY}="test"]`).height();
    });

    afterEach(() => {
        document.body.innerHTML = '';
        $wrap = null;
        $div = null;
        theadHeight = null;
        ajaxPageHeight = null;
        $tableHeader = null;
    });

    it('基础验证', () => {
        expect(base.calcLayout).toBeDefined();
        expect(base.calcLayout.length).toBe(4);
    });

    it('有分页的验证', () => {
        base.calcLayout('test', '1000px', '500px', true);
        expect($wrap.width()).toBe(1000);
        expect($wrap.height()).toBe(500);
        expect($div.height()).toBe(500 - ajaxPageHeight);
        expect($tableHeader.height()).toBe(theadHeight);
    });

    it('无分页的验证', () => {
        base.calcLayout('test', '1000px', '500px', false);
        expect($wrap.width()).toBe(1000);
        expect($wrap.height()).toBe(500);
        expect($div.height()).toBe(500);
        expect($tableHeader.height()).toBe(theadHeight);
    });
});

describe('base.clearBodyEvent(eventMap)', () => {
    let eventMap = null;
    beforeEach(() => {
        document.body.innerHTML = tableTestTpl;
    });

    afterEach(() => {
        eventMap = null;
        document.body.innerHTML = '';
    });

    it('基础验证', () => {
        expect(base.clearBodyEvent).toBeDefined();
        expect(base.clearBodyEvent.length).toBe(1);
    });

    it('执行验证', () => {
        eventMap = {
            testeEvent: {
                events: 'click',
                target: 'body',
                selector: '.table-wrap'
            }
        };
        let $target = jTool(eventMap.testeEvent.target);
        $target.on(eventMap.testeEvent.events, eventMap.testeEvent.selector, () => {});
        expect($target.get(0).jToolEvent['click.table-wrap']).toBeDefined();
        base.clearBodyEvent(eventMap);
        expect($target.get(0).jToolEvent['click.table-wrap']).toBeUndefined();
    });
});
