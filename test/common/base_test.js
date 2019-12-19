import jTool from '@common/jTool';
import {
    getCloneRowData,
    showLoading,
    hideLoading,
    getWrap,
    getKey,
    getQuerySelector,
    getTable,
    getDiv,
    getThead,
    getFakeThead,
    getTbody,
    getTh,
    getAllTh,
    getVisibleTh,
    getFakeTh,
    getFakeVisibleTh,
    getThName,
    getEmptyHtml,
    getEmpty,
    updateEmptyCol,
    getColTd,
    setAreVisible,
    updateVisibleLast,
    updateThWidth,
    getThTextWidth,
    getTextWidth,
    updateScrollStatus,
    calcLayout,
    clearTargetEvent
} from '@common/base';
import tableTpl from '@test/table-test.tpl.html';
import { getColumnMap } from '@test/table-config';
import { TOOLBAR_KEY, LOADING_CLASS_NAME, ROW_DISABLED_CHECKBOX, TR_CACHE_KEY, TR_LEVEL_KEY } from '@common/constants';

const tableTestTpl = tableTpl;

describe('getCloneRowData(columnMap, obj, cleanKeyList)', () => {
    let columnMap = null;
    let data = null;
    beforeEach(() => {
        columnMap = {
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
        data = {
            username: 'baukh',
            age: 32,
            content: 'this is content',
            info: 'this is info',
            gm_checkbox: true,
            [ROW_DISABLED_CHECKBOX]: true,
            [TR_CACHE_KEY]: 1,
            [TR_LEVEL_KEY]: 1
        };
    });
    afterEach(() => {
        columnMap = null;
        data = null;
    });
    it('基础验证', () => {
        expect(getCloneRowData).toBeDefined();
        expect(getCloneRowData.length).toBe(3);
    });

    it('返回值验证: 未指定cleanKeyList', () => {
        expect(getCloneRowData(columnMap, data)).toEqual({
            username: 'baukh',
            age: 32,
            content: 'this is content',
            info: 'this is info'
        });
    });

    it('返回值验证: 指定cleanKeyList', () => {
        expect(getCloneRowData(columnMap, data, ['age', 'info'])).toEqual({
            username: 'baukh',
            content: 'this is content'
        });
    });
});

describe('showLoading(gridManagerName, loadingTemplate)', () => {
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
        expect(showLoading).toBeDefined();
        expect(showLoading.length).toBe(2);
    });

    it('当前未存在loading dom', () => {
        expect(jTool('.table-wrap').find(`.${LOADING_CLASS_NAME}`).length).toBe(0);
        showLoading(gridManagerName, '<div></div>');
        expect(jTool('.table-wrap').find(`.${LOADING_CLASS_NAME}`).length).toBe(1);
    });

    it('第二次执行(上一次执行未进行销毁)', () => {
        jTool('.table-wrap').append(`<div class="${LOADING_CLASS_NAME}"></div>`);
        expect(jTool('.table-wrap').find(`.${LOADING_CLASS_NAME}`).length).toBe(1);
        showLoading(gridManagerName, '<div></div>');
        expect(jTool('.table-wrap').find(`.${LOADING_CLASS_NAME}`).length).toBe(1);
    });
});

describe('hideLoading(gridManagerName)', () => {
    let gridManagerName = null;
    beforeEach(() => {
        gridManagerName = 'test';
        document.body.innerHTML = tableTestTpl;
        jTool('.table-wrap').append(`<div class="${LOADING_CLASS_NAME}"></div>`);
    });
    afterEach(() => {
        gridManagerName = null;
        document.body.innerHTML = '';
    });
    it('基础验证', () => {
        expect(hideLoading).toBeDefined();
        expect(hideLoading.length).toBe(1);
    });

    it('执行验证', () => {
        jasmine.clock().install();
        expect(jTool('.table-wrap').find(`.${LOADING_CLASS_NAME}`).length).toBe(1);
        hideLoading(gridManagerName);
        jasmine.clock().tick(500);
        expect(jTool('.table-wrap').find(`.${LOADING_CLASS_NAME}`).length).toBe(0);
        jasmine.clock().uninstall();
    });
});

describe('getKey($table)', () => {
    beforeEach(() => {
        document.body.innerHTML = tableTestTpl;
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });
    it('基础验证', () => {
        expect(getKey).toBeDefined();
        expect(getKey.length).toBe(1);
    });

    it('参数为gridManagerName ', () => {
        expect(getKey('test')).toBe('test');
    });

    it('参数为table ', () => {
        expect(getKey(document.querySelector('table[grid-manager="test"]'))).toBe('test');
    });

    it('参数为$table ', () => {
        expect(getKey(jTool('table[grid-manager="test"]'))).toBe('test');
    });

    it('错误情况验证 ', () => {
        expect(getKey()).toBeUndefined();
    });
});

describe('getQuerySelector(gridManagerName)', () => {
    it('基础验证', () => {
        expect(getQuerySelector).toBeDefined();
        expect(getQuerySelector.length).toBe(1);
    });

    it('返回值验证 ', () => {
        expect(getQuerySelector('test')).toBe('[grid-manager="test"]');
        expect(getQuerySelector('test2')).toBe('[grid-manager="test2"]');
    });
});

describe('getTable($dom, isSelectUp)', () => {
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
        expect(getTable).toBeDefined();
        expect(getTable.length).toBe(2);
    });

    it('getTable($dom)', () => {
        expect(getTable($tableWrap).get(0)).toBe(table);
    });

    it('getTable($dom, false)', () => {
        expect(getTable($tableWrap).get(0)).toBe(table);
    });

    it('getTable($dom, true)', () => {
        expect(getTable($thead, true).get(0)).toBe(table);
    });

    it('getTable(gridManagerName)', () => {
        expect(getTable('test').get(0)).toBe(table);
    });
});

describe('getWrap($dom, isSelectUp)', () => {
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
        expect(getWrap).toBeDefined();
        expect(getWrap.length).toBe(2);
    });

    it('getWrap($dom)', () => {
        expect(getWrap($body).get(0)).toBe(tableWrap);
    });

    it('getWrap($dom, false)', () => {
        expect(getWrap($body, false).get(0)).toBe(tableWrap);
    });

    it('getWrap($dom, true)', () => {
        expect(getWrap($table, true).get(0)).toBe(tableWrap);
    });

    it('getWrap(gridManagerName)', () => {
        expect(getWrap('test').get(0)).toBe(tableWrap);
    });
});

describe('getDiv($dom, isSelectUp)', () => {
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
        expect(getDiv).toBeDefined();
        expect(getDiv.length).toBe(2);
    });

    it('getDiv($dom)', () => {
        expect(getDiv($body).get(0)).toBe(tableDiv);
    });

    it('getDiv($dom, false)', () => {
        expect(getDiv($body, false).get(0)).toBe(tableDiv);
    });

    it('getDiv($dom, true)', () => {
        expect(getDiv($table, true).get(0)).toBe(tableDiv);
    });

    it('getDiv(gridManagerName)', () => {
        expect(getDiv('test').get(0)).toBe(tableDiv);
    });
});

describe('getThead(gridManagerName)', () => {
    let thead = null;
    beforeEach(() => {
        document.body.innerHTML = tableTestTpl;
    });

    afterEach(() => {
        document.body.innerHTML = '';
        thead = null;
    });

    it('基础验证', () => {
        expect(getThead).toBeDefined();
        expect(getThead.length).toBe(1);
    });

    it('返回值验证', () => {
        thead = document.querySelector('thead[grid-manager-thead="test"]');
        expect(getThead('test').get(0)).toBe(thead);
    });
});

describe('getFakeThead(gridManagerName)', () => {
    let fakeHead = null;
    beforeEach(() => {
        document.body.innerHTML = tableTestTpl;
    });

    afterEach(() => {
        document.body.innerHTML = '';
        fakeHead = null;
    });

    it('基础验证', () => {
        expect(getFakeThead).toBeDefined();
        expect(getFakeThead.length).toBe(1);
    });

    it('返回值验证', () => {
        fakeHead = document.querySelector('thead[grid-manager-mock-thead="test"]');
        expect(getFakeThead('test').get(0)).toBe(fakeHead);
    });
});

describe('getTbody(gridManagerName)', () => {
    let tbody = null;
    beforeEach(() => {
        document.body.innerHTML = tableTestTpl;
    });

    afterEach(() => {
        document.body.innerHTML = '';
        tbody = null;
    });

    it('基础验证', () => {
        expect(getTbody).toBeDefined();
        expect(getTbody.length).toBe(1);
    });

    it('返回值验证', () => {
        tbody = document.querySelector('table[grid-manager="test"] tbody');
        expect(getTbody('test').get(0)).toBe(tbody);
    });
});

describe('getTh(gridManagerName, thName)', () => {
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
        expect(getTh).toBeDefined();
        expect(getTh.length).toBe(2);
    });

    it('执行验证: thName', () => {
        expect(getTh('test', 'createDate').get(0)).toBe(th);
    });

    it('执行验证: thDOM', () => {
        expect(getTh('test', $fakeTh).get(0)).toBe(th);
    });
});

describe('getAllTh(gridManagerName)', () => {
    beforeEach(() => {
        document.body.innerHTML = tableTestTpl;
    });

    afterEach(() => {
        document.body.innerHTML = '';
    });

    it('基础验证', () => {
        expect(getAllTh).toBeDefined();
        expect(getAllTh.length).toBe(1);
    });

    it('测试返回长度', () => {
        expect(getAllTh('test').length).toBe(10);
    });
});

describe('getVisibleTh(gridManagerName, isGmCreate)', () => {
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
        expect(getVisibleTh).toBeDefined();
        expect(getVisibleTh.length).toBe(2);
    });

    it('getVisibleTh(gridManagerName)', () => {
        expect(getVisibleTh(gridManagerName).length).toBe(10);
    });

    it('getVisibleTh(gridManagerName, true)', () => {
        expect(getVisibleTh(gridManagerName, true).length).toBe(2);
    });

    it('getVisibleTh(gridManagerName, true)', () => {
        expect(getVisibleTh(gridManagerName, false).length).toBe(8);
    });
});

describe('getFakeTh(gridManagerName, thName)', () => {
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
        expect(getFakeTh).toBeDefined();
        expect(getFakeTh.length).toBe(2);
    });

    it('getFakeTh(gridManagerName, thName)', () => {
        expect(getFakeTh(gridManagerName, 'createDate').get(0)).toBe(fakeTh);
    });

    it('getFakeTh(gridManagerName, $fakeTh)', () => {
        expect(getFakeTh(gridManagerName, $fakeTh).get(0)).toBe(fakeTh);
    });
});

describe('getFakeVisibleTh(gridManagerName)', () => {
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
        expect(getFakeVisibleTh).toBeDefined();
        expect(getFakeVisibleTh.length).toBe(1);
    });

    it('返回值验证', () => {
        expect(getFakeVisibleTh(gridManagerName).length).toBe(10);
    });
});

describe('getThName($th)', () => {
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
        expect(getThName).toBeDefined();
        expect(getThName.length).toBe(1);
    });

    it('getThName($table)', () => {
        expect(getThName($thList.eq(1))).toBe('gm_order');
        expect(getThName($thList.eq(3))).toBe('createDate');
    });
});

describe('getEmptyHtml(gridManagerName, visibleNum, emptyTemplate, style)', () => {
    let tpl = null;
    beforeEach(() => {
    });

    afterEach(() => {
        document.body.innerHTML = '';
        tpl = '';
    });

    it('基础验证', () => {
        expect(getEmptyHtml).toBeDefined();
        expect(getEmptyHtml.length).toBe(3);
    });

    it('返回值验证', () => {
        tpl = `<tr empty-template="test-empty" style="height: 100px;">
					<td colspan="5"></td>
				</tr>`;
        expect(getEmptyHtml('test-empty', 5, 'height: 100px;').replace(/\s/g, '')).toBe(tpl.replace(/\s/g, ''));
    });
});


describe('getEmpty(gridManagerName)', () => {
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
        expect(getEmpty).toBeDefined();
        expect(getEmpty.length).toBe(1);
    });

    it('返回值验证', () => {
        tpl = `<tr empty-template="test-empty">
                 <td></td>
               </tr>`;
        expect(getEmpty('test-empty').get(0).outerHTML.replace(/\s/g, '')).toBe(tpl.replace(/\s/g, ''));
    });
});

describe('updateEmptyCol(gridManagerName)', () => {
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
        expect(updateEmptyCol).toBeDefined();
        expect(updateEmptyCol.length).toBe(1);
    });

    it('验证异常情况', () => {
        document.body.innerHTML = `<table grid-manager="test-empty">
                                        <thead grid-manager-thead="test-empty">
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
        $table = jTool('[grid-manager="test-empty"]');
        updateEmptyCol(gridManagerName);
        expect($table.find('td').attr('colspan')).toBeUndefined();
    });

    it('验证正常情况', () => {
        document.body.innerHTML = `<table grid-manager="test-empty">
                                        <thead grid-manager-thead="test-empty">
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
        updateEmptyCol(gridManagerName);
        expect($table.find('td').attr('colspan')).toBe('2');
    });
});

describe('getColTd($dom, $context)', () => {
    let $table = null;
    let $dom = null;
    let $tr = null;
    beforeEach(() => {
        document.body.innerHTML = tableTestTpl;
        $table = jTool('table[grid-manager="test"]');
    });

    afterEach(() => {
        document.body.innerHTML = '';
        $table = null;
        $dom = null;
        $tr = null;
    });

    it('基础验证', () => {
        expect(getColTd).toBeDefined();
        expect(getColTd.length).toBe(2);
    });

    it('getColTd($th)', () => {
        $dom = $table.find('thead[grid-manager-thead] th[th-name="createDate"]');
        expect(getColTd($dom).length).toBe(10);
        expect(getColTd($dom).eq(2).text()).toBe('2018/5/14');
    });

    it('getColTd($th, $tr)', () => {
        $dom = $table.find('thead[grid-manager-thead] th[th-name="createDate"]');
        $tr = $table.find('tbody tr').eq(0);
        expect(getColTd($dom, $tr).length).toBe(1);
        expect(getColTd($dom, $tr).text()).toBe('2018/8/3');
    });

    it('getColTd($td)', () => {
        $dom = $table.find('tbody tr[gm-cache-key="1"] td').eq(3);
        expect(getColTd($dom).length).toBe(10);
        expect(getColTd($dom).eq(2).text()).toBe('2018/5/14');
    });
});

describe('setAreVisible(gridManagerName, thNameList, isVisible, cb)', () => {
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
        expect(setAreVisible).toBeDefined();
        expect(setAreVisible.length).toBe(3);
    });

    it('执行验证', () => {
        expect(getTh('test', 'gm_checkbox').attr('th-visible')).toBe('visible');
        expect(getTh('test', 'title').attr('th-visible')).toBe('visible');
        expect(getTh('test', 'pic').attr('th-visible')).toBe('visible');

        // 设置gm_checkbox, pic不可见
        setAreVisible(gridManagerName, ['gm_checkbox', 'pic'], false);

        expect(getTh('test', 'gm_checkbox').attr('th-visible')).toBe('none');
        expect(getTh('test', 'title').attr('th-visible')).toBe('visible');
        expect(getTh('test', 'pic').attr('th-visible')).toBe('none');

        // 设置gm_checkbox, pic可见
        setAreVisible(gridManagerName, ['gm_checkbox', 'pic'], true);
        expect(getTh('test', 'gm_checkbox').attr('th-visible')).toBe('visible');
        expect(getTh('test', 'title').attr('th-visible')).toBe('visible');
        expect(getTh('test', 'pic').attr('th-visible')).toBe('visible');
    });
});

describe('updateVisibleLast(gridManagerName)', () => {
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
        expect(updateVisibleLast).toBeDefined();
        expect(updateVisibleLast.length).toBe(1);
    });

    it('执行验证', () => {
        $lastTh = $table.find('thead[grid-manager-thead] th[last-visible="true"]');
        expect(getThName($lastTh)).toBe('action');

        updateVisibleLast(gridManagerName);

        // // 在未变更列的情况下，执行结果不会变化
        $lastTh = $table.find('thead[grid-manager-thead] th[last-visible="true"]');
        expect(getThName($lastTh)).toBe('action');

        // 隐藏最后一列
        setAreVisible(gridManagerName, [getThName($lastTh)], false);

        updateVisibleLast(gridManagerName);
        $lastTh = $table.find('thead[grid-manager-thead] th[last-visible="true"]');
        expect(getThName($lastTh)).toBe('info');
    });
});

describe('updateThWidth(settings, isInit)', () => {
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
        expect(updateThWidth).toBeDefined();
        expect(updateThWidth.length).toBe(2);
    });

    it('初始化时的更新', () => {
        updateThWidth(settings, true);
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
        updateThWidth(settings, false);
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
        updateThWidth(settings, false);
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
        updateThWidth(settings, false);
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
        updateThWidth(settings, false);
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
        updateThWidth(settings, false);
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
        updateThWidth(settings, false);
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
        updateThWidth(settings, false);
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
        updateThWidth(settings, false);
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

        let picThTextWidth = getThTextWidth('test', jTool('[grid-manager-thead="test"] th[th-name="pic"]'), settings.columnMap['pic'].isIconFollowText);
        let titleThTextWidth = getThTextWidth('test', jTool('[grid-manager-thead="test"] th[th-name="title"]'), settings.columnMap['title'].isIconFollowText);
        let overage = 1200 - 40 - 50 - 150 - 130 - 100 - picThTextWidth - titleThTextWidth;
        updateThWidth(settings, false);
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


describe('getThTextWidth(gridManagerName, $th, isIconFollowText)', () => {
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
        expect(getThTextWidth).toBeDefined();
        expect(getThTextWidth.length).toBe(3);
    });

    it('执行验证', () => {
        expect(typeof getThTextWidth('test', $th)).toBe('number');
        expect(typeof getThTextWidth('test', $th, true)).toBe('number');
    });
});

describe('getTextWidth(gridManagerName, content, cssObj)', () => {
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
        expect(getTextWidth).toBeDefined();
        expect(getTextWidth.length).toBe(3);
    });

    it('执行验证', () => {
        // expect(getTextWidth('test', '123456')).toBe(40);
        // expect(getTextWidth('test', '123456', {'fontSize': '24px'})).toBe(80);

        // TODO CI 上跑测试无法精准到数值，所以用以下进行替代。 本地测试精准数值是通过的
        expect(typeof getTextWidth('test', '123456')).toBe('number');
        expect(typeof getTextWidth('test', '123456', {'fontSize': '24px'})).toBe('number');
    });
});

describe('updateScrollStatus(gridManagerName)', () => {
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
        expect(updateScrollStatus).toBeDefined();
        expect(updateScrollStatus.length).toBe(1);
    });

    it('执行验证', () => {
        $table.width(1000);
        $tableDiv.width(1100);
        updateScrollStatus('test');
        expect($tableDiv.css('overflow-x')).toBe('hidden');

        $table.width(1100);
        $tableDiv.width(1000);
        updateScrollStatus('test');
        expect($tableDiv.css('overflow-x')).toBe('auto');
    });
});

describe('calcLayout(gridManagerName, width, height, supportAjaxPage)', () => {
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
        theadHeight = getThead('test').height();
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
        expect(calcLayout).toBeDefined();
        expect(calcLayout.length).toBe(4);
    });

    it('有分页的验证', () => {
        calcLayout('test', '1000px', '500px', true);
        expect($wrap.width()).toBe(1000);
        expect($wrap.height()).toBe(500);
        expect($div.height()).toBe(500 - ajaxPageHeight);
        expect($tableHeader.height()).toBe(theadHeight);
    });

    it('无分页的验证', () => {
        calcLayout('test', '1000px', '500px', false);
        expect($wrap.width()).toBe(1000);
        expect($wrap.height()).toBe(500);
        expect($div.height()).toBe(500);
        expect($tableHeader.height()).toBe(theadHeight);
    });
});

describe('clearTargetEvent(eventMap)', () => {
    let eventMap = null;
    beforeEach(() => {
        document.body.innerHTML = tableTestTpl;
    });

    afterEach(() => {
        eventMap = null;
        document.body.innerHTML = '';
    });

    it('基础验证', () => {
        expect(clearTargetEvent).toBeDefined();
        expect(clearTargetEvent.length).toBe(1);
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
        $target.on(eventMap.testeEvent.events, eventMap.testeEvent.selector, () => {
        });
        expect($target.get(0).jToolEvent['click.table-wrap']).toBeDefined();
        clearTargetEvent(eventMap);
        expect($target.get(0).jToolEvent['click.table-wrap']).toBeUndefined();
    });
});
