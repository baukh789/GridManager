import jTool from '../../src/jTool';
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
    getAllFakeTh,
    getVisibleTh,
    getFakeTh,
    getFakeVisibleTh,
    getThName,
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
    clearTargetEvent,
    getScrollBarWidth,
    setLineHeightValue
} from '../../src/common/base';
import tableTpl from '../table-test.tpl.html';
import {getColumnMap} from '../table-config';
import {
    TOOLBAR_KEY,
    LOADING_CLASS_NAME,
    ROW_DISABLED_CHECKBOX,
    TR_CACHE_KEY,
    TR_LEVEL_KEY,
    CELL_HIDDEN
} from '../../src/common/constants';
import {clearCacheDOM} from '../../src/common/domCache';

const tableTestTpl = tableTpl;

describe('base', () => {
    beforeEach(() => {
        clearCacheDOM('test');
    });

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

    describe('showLoading(_, loadingTemplate)', () => {
        let _ = null;
        beforeEach(() => {
            _ = 'test';
            document.body.innerHTML = tableTestTpl;
        });
        afterEach(() => {
            _ = null;
            document.body.innerHTML = '';
        });
        it('基础验证', () => {
            expect(showLoading).toBeDefined();
            expect(showLoading.length).toBe(2);
        });

        it('当前未存在loading dom', () => {
            expect(jTool('.table-wrap').find(`.${LOADING_CLASS_NAME}`).length).toBe(0);
            showLoading(_, '<div></div>');
            expect(jTool('.table-wrap').find(`.${LOADING_CLASS_NAME}`).length).toBe(1);
        });

        it('第二次执行(上一次执行未进行销毁)', () => {
            jTool('.table-wrap').append(`<div class="${LOADING_CLASS_NAME}"></div>`);
            expect(jTool('.table-wrap').find(`.${LOADING_CLASS_NAME}`).length).toBe(1);
            showLoading(_, '<div></div>');
            expect(jTool('.table-wrap').find(`.${LOADING_CLASS_NAME}`).length).toBe(1);
        });
    });

    describe('hideLoading(_)', () => {
        let _ = null;
        beforeEach(() => {
            _ = 'test';
            document.body.innerHTML = tableTestTpl;
            jTool('.table-wrap').append(`<div class="${LOADING_CLASS_NAME}"></div>`);
        });
        afterEach(() => {
            _ = null;
            document.body.innerHTML = '';
        });
        it('基础验证', () => {
            expect(hideLoading).toBeDefined();
            expect(hideLoading.length).toBe(2);
        });

        it('执行验证', () => {
            jasmine.clock().install();
            expect(jTool('.table-wrap').find(`.${LOADING_CLASS_NAME}`).length).toBe(1);
            hideLoading(_, 500);
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

    });

    describe('getQuerySelector(_)', () => {
        it('基础验证', () => {
            expect(getQuerySelector).toBeDefined();
            expect(getQuerySelector.length).toBe(1);
        });

        it('返回值验证 ', () => {
            expect(getQuerySelector('test')).toBe('[grid-manager="test"]');
            expect(getQuerySelector('test2')).toBe('[grid-manager="test2"]');
        });
    });

    describe('getTable(_)', () => {
        beforeEach(() => {
            document.body.innerHTML = tableTestTpl;
        });

        afterEach(() => {
            document.body.innerHTML = '';
        });

        it('基础验证', () => {
            expect(getTable).toBeDefined();
            expect(getTable.length).toBe(1);
        });

        it('getTable(_)', () => {
            expect(getTable('test').attr('grid-manager')).toBe('test');
        });
    });

    describe('getWrap(_)', () => {
        beforeEach(() => {
            document.body.innerHTML = tableTestTpl;
        });

        afterEach(() => {
            document.body.innerHTML = '';
        });

        it('基础验证', () => {
            expect(getWrap).toBeDefined();
            expect(getWrap.length).toBe(1);
        });

        it('返回值验证', () => {
            expect(getWrap('test').attr('grid-manager-wrap')).toBe('test');
        });
    });

    describe('getDiv(_)', () => {
        beforeEach(() => {
            document.body.innerHTML = tableTestTpl;
        });

        afterEach(() => {
            document.body.innerHTML = '';
        });

        it('基础验证', () => {
            expect(getDiv).toBeDefined();
            expect(getDiv.length).toBe(1);
        });

        it('返回值验证', () => {
            expect(getDiv('test').attr('grid-manager-div')).toBe('test');
        });
    });

    describe('getThead(_)', () => {
        beforeEach(() => {
            document.body.innerHTML = tableTestTpl;
        });

        afterEach(() => {
            document.body.innerHTML = '';
        });

        it('基础验证', () => {
            expect(getThead).toBeDefined();
            expect(getThead.length).toBe(1);
        });

        it('返回值验证', () => {
            expect(getThead('test').attr('grid-manager-thead')).toBe('test');
        });
    });

    describe('getFakeThead(_)', () => {
        beforeEach(() => {
            document.body.innerHTML = tableTestTpl;
        });

        afterEach(() => {
            document.body.innerHTML = '';
        });

        it('基础验证', () => {
            expect(getFakeThead).toBeDefined();
            expect(getFakeThead.length).toBe(1);
        });

        it('返回值验证', () => {
            expect(getFakeThead('test').attr('grid-manager-mock-thead')).toBe('test');
        });
    });

    describe('getTbody(_)', () => {
        beforeEach(() => {
            document.body.innerHTML = tableTestTpl;
        });

        afterEach(() => {
            document.body.innerHTML = '';
        });

        it('基础验证', () => {
            expect(getTbody).toBeDefined();
            expect(getTbody.length).toBe(1);
        });

        it('返回值验证', () => {
            expect(getTbody('test').attr('grid-manager-tbody')).toBe('test');
        });
    });

    describe('getTh(_, thName)', () => {
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

    describe('getAllTh(_)', () => {
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

    describe('getAllFakeTh(_)', () => {
        beforeEach(() => {
            document.body.innerHTML = tableTestTpl;
        });

        afterEach(() => {
            document.body.innerHTML = '';
        });

        it('基础验证', () => {
            expect(getAllFakeTh).toBeDefined();
            expect(getAllFakeTh.length).toBe(1);
        });

        it('测试返回长度', () => {
            expect(getAllFakeTh('test').length).toBe(10);
        });
    });

    describe('getVisibleTh(_)', () => {
        let _ = null;
        beforeEach(() => {
            document.body.innerHTML = tableTestTpl;
            _ = 'test';
        });

        afterEach(() => {
            document.body.innerHTML = '';
            _ = null;
        });

        it('基础验证', () => {
            expect(getVisibleTh).toBeDefined();
            expect(getVisibleTh.length).toBe(1);
        });

        it('getVisibleTh(_)', () => {
            expect(getVisibleTh(_).length).toBe(10);
        });
    });

    describe('getFakeTh(_, thName)', () => {
        let _ = null;
        let fakeTh = null;
        beforeEach(() => {
            document.body.innerHTML = tableTestTpl;
            _ = 'test';
            fakeTh = document.querySelector('table[grid-manager="test"] thead[grid-manager-mock-thead] tr th[th-name="createDate"]');
        });

        afterEach(() => {
            document.body.innerHTML = '';
            _ = null;
            fakeTh = null;
        });

        it('基础验证', () => {
            expect(getFakeTh).toBeDefined();
            expect(getFakeTh.length).toBe(2);
        });

        it('getFakeTh(_, thName)', () => {
            expect(getFakeTh(_, 'createDate').get(0)).toBe(fakeTh);
        });
    });

    describe('getFakeVisibleTh(_, isExcludeGmCreate)', () => {
        let _ = null;
        beforeEach(() => {
            document.body.innerHTML = tableTestTpl;
            _ = 'test';
        });

        afterEach(() => {
            document.body.innerHTML = '';
            _ = null;
        });

        it('基础验证', () => {
            expect(getFakeVisibleTh).toBeDefined();
            expect(getFakeVisibleTh.length).toBe(2);
        });

        it('返回值验证', () => {
            expect(getFakeVisibleTh(_).length).toBe(10);
        });

        it('getFakeVisibleTh(_, true)', () => {
            expect(getFakeVisibleTh(_, true).length).toBe(8);
        });
    });

    describe('getThName($dom)', () => {
        let $dom = null;
        beforeEach(() => {
            document.body.innerHTML = tableTestTpl;
        });

        afterEach(() => {
            document.body.innerHTML = '';
            $dom = null;
        });

        it('基础验证', () => {
            expect(getThName).toBeDefined();
            expect(getThName.length).toBe(1);
        });

        it('getThName($th)', () => {
            $dom = jTool('table[grid-manager="test"] thead[grid-manager-thead] th').eq(1);
            expect(getThName($dom)).toBe('gm_order');
            $dom = jTool('table[grid-manager="test"] thead[grid-manager-thead] th').eq(3);
            expect(getThName($dom)).toBe('createDate');
        });
    });

    describe('getEmpty(_)', () => {
        let tpl = null;
        beforeEach(() => {
            document.body.innerHTML = `<table grid-manager="test-empty">
                                            <thead grid-manager-thead>
                                                <tr>
                                                    <th>1</th><th>2</th>
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

    describe('updateEmptyCol(_)', () => {
        let _ = null;
        let $table = null;
        beforeEach(() => {
            _ = 'test-empty';
        });

        afterEach(() => {
            document.body.innerHTML = '';
            _ = null;
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
                                                    <th>1</th><th>2</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td></td>
                                                </tr>
                                            </tbody>
                                        </table>`;
            $table = jTool('[grid-manager="test-empty"]');
            updateEmptyCol(_);
            expect($table.find('td').attr('colspan')).toBeUndefined();
        });

        it('验证正常情况', () => {
            document.body.innerHTML = `<table grid-manager="test-empty">
                                            <thead grid-manager-thead="test-empty">
                                                <tr>
                                                    <th>1</th><th>2</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr empty-template="test-empty">
                                                    <td></td>
                                                </tr>
                                            </tbody>
                                        </table>`;
            $table = jTool('table[grid-manager="test-empty"]');
            updateEmptyCol(_);
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
            expect(getColTd($dom).eq(2).text().trim()).toBe('2018/5/14');
        });

        it('getColTd($th, $tr)', () => {
            $dom = $table.find('thead[grid-manager-thead] th[th-name="createDate"]');
            $tr = $table.find('tbody tr').eq(0);
            expect(getColTd($dom, $tr).length).toBe(1);
            expect(getColTd($dom, $tr).text().trim()).toBe('2018/8/3');
        });

        it('getColTd($td)', () => {
            $dom = $table.find('tbody tr[gm-cache-key="1"] td').eq(3);
            expect(getColTd($dom).length).toBe(10);
            expect(getColTd($dom).eq(2).text().trim()).toBe('2018/5/14');
        });
    });

    describe('setAreVisible(_, thNameList, isVisible, cb)', () => {
        let _ = null;
        beforeEach(() => {
            document.body.innerHTML = tableTestTpl;
            _ = 'test';
        });

        afterEach(() => {
            document.body.innerHTML = '';
            _ = null;
        });

        it('基础验证', () => {
            expect(setAreVisible).toBeDefined();
            expect(setAreVisible.length).toBe(3);
        });

        it('执行验证', () => {
            expect(getTh('test', 'gm_checkbox').attr(CELL_HIDDEN)).toBeUndefined();
            expect(getTh('test', 'title').attr(CELL_HIDDEN)).toBeUndefined();
            expect(getTh('test', 'pic').attr(CELL_HIDDEN)).toBeUndefined();

            // 设置gm_checkbox, pic不可见
            setAreVisible(_, ['gm_checkbox', 'pic'], false);

            expect(getTh('test', 'gm_checkbox').attr(CELL_HIDDEN)).toBe('');
            expect(getTh('test', 'title').attr(CELL_HIDDEN)).toBeUndefined();
            expect(getTh('test', 'pic').attr(CELL_HIDDEN)).toBe('');

            // 设置gm_checkbox, pic可见
            setAreVisible(_, ['gm_checkbox', 'pic'], true);
            expect(getTh('test', 'gm_checkbox').attr(CELL_HIDDEN)).toBeUndefined();
            expect(getTh('test', 'title').attr(CELL_HIDDEN)).toBeUndefined();
            expect(getTh('test', 'pic').attr(CELL_HIDDEN)).toBeUndefined();


            // 传入非数组
            setAreVisible(_, 'gm_checkbox', false);
            expect(getTh('test', 'gm_checkbox').attr(CELL_HIDDEN)).toBe('');
            setAreVisible(_, 'gm_checkbox', true);
            expect(getTh('test', 'gm_checkbox').attr(CELL_HIDDEN)).toBeUndefined();
        });
    });

    describe('updateVisibleLast(_)', () => {
        let $table = null;
        let _ = null;
        let $lastTh = null;
        beforeEach(() => {
            document.body.innerHTML = tableTestTpl;
            _ = 'test';
            $table = jTool('table[grid-manager="test"]');
        });

        afterEach(() => {
            _ = null;
            $table = null;
            $lastTh = null;
            document.body.innerHTML = '';
        });

        it('基础验证', () => {
            expect(updateVisibleLast).toBeDefined();
            expect(updateVisibleLast.length).toBe(1);
        });

        it('执行验证', () => {
            $lastTh = $table.find('thead[grid-manager-thead] th[last-visible]');
            expect(getThName($lastTh)).toBe('action');

            updateVisibleLast(_);

            // // 在未变更列的情况下，执行结果不会变化
            $lastTh = $table.find('thead[grid-manager-thead] th[last-visible]');
            expect(getThName($lastTh)).toBe('action');

            // 隐藏最后一列
            setAreVisible(_, [getThName($lastTh)], false);

            updateVisibleLast(_);
            $lastTh = $table.find('thead[grid-manager-thead] th[last-visible]');
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
                _: 'test',
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
            expect(settings.columnMap['gm_checkbox'].width).toBe(40);
            expect(settings.columnMap['gm_order'].width).toBe(50);
            expect(settings.columnMap['pic'].width).toBe(110);
            expect(settings.columnMap['title'].width).toBe(508);
            expect(settings.columnMap['type'].width).toBe(150);
            expect(settings.columnMap['info'].width).toBe(100);
            expect(settings.columnMap['username'].width).toBe(100);
            expect(settings.columnMap['createDate'].width).toBe(130);
            expect(settings.columnMap['lastDate'].width).toBe(130);
            expect(settings.columnMap['action'].width).toBe(100);
        });

        it('非初始化时的更新', () => {
            updateThWidth(settings, false);
            expect(settings.columnMap['gm_checkbox'].width).toBe(40);
            expect(settings.columnMap['gm_order'].width).toBe(50);
            expect(settings.columnMap['pic'].width).toBe(110);
            expect(settings.columnMap['title'].width).toBe(290);
            expect(settings.columnMap['type'].width).toBe(150);
            expect(settings.columnMap['info'].width).toBe(100);
            expect(settings.columnMap['username'].width).toBe(100);
            expect(settings.columnMap['createDate'].width).toBe(130);
            expect(settings.columnMap['lastDate'].width).toBe(130);
            expect(settings.columnMap['action'].width).toBe(100);
        });

        it('隐藏一个定制列', () => {
            updateThWidth(settings, false);
            expect(settings.columnMap['gm_checkbox'].width).toBe(40);
            expect(settings.columnMap['gm_order'].width).toBe(50);
            expect(settings.columnMap['pic'].width).toBe(110);
            expect(settings.columnMap['title'].width).toBe(290);
            expect(settings.columnMap['type'].width).toBe(150);
            expect(settings.columnMap['info'].width).toBe(100);
            expect(settings.columnMap['username'].width).toBe(100);
            expect(settings.columnMap['createDate'].width).toBe(130);
            expect(settings.columnMap['lastDate'].width).toBe(130);
            expect(settings.columnMap['action'].width).toBe(100);
        });

        it('隐藏一个拥有宽度的可定制列', () => {
            settings.columnMap['pic'].isShow = false;
            updateThWidth(settings, false);
            expect(settings.columnMap['gm_checkbox'].width).toBe(40);
            expect(settings.columnMap['gm_order'].width).toBe(50);
            expect(settings.columnMap['title'].width).toBe(400);
            expect(settings.columnMap['type'].width).toBe(150);
            expect(settings.columnMap['info'].width).toBe(100);
            expect(settings.columnMap['username'].width).toBe(100);
            expect(settings.columnMap['createDate'].width).toBe(130);
            expect(settings.columnMap['lastDate'].width).toBe(130);
            expect(settings.columnMap['action'].width).toBe(100);
        });

        it('仅有一个自动和两个拥有宽度的定制列', () => {
            settings.columnMap['pic'].isShow = false;
            settings.columnMap['type'].isShow = false;
            settings.columnMap['info'].isShow = false;
            settings.columnMap['username'].isShow = false;
            updateThWidth(settings, false);
            expect(settings.columnMap['gm_checkbox'].width).toBe(40);
            expect(settings.columnMap['gm_order'].width).toBe(50);
            expect(settings.columnMap['title'].width).toBe(750);
            expect(settings.columnMap['createDate'].width).toBe(130);
            expect(settings.columnMap['lastDate'].width).toBe(130);
            expect(settings.columnMap['action'].width).toBe(100);
        });

        it('仅有两个拥有宽度的定制列', () => {
            settings.columnMap['pic'].isShow = false;
            settings.columnMap['type'].isShow = false;
            settings.columnMap['info'].isShow = false;
            settings.columnMap['username'].isShow = false;
            settings.columnMap['title'].isShow = false;
            updateThWidth(settings, false);
            expect(settings.columnMap['gm_checkbox'].width).toBe(40);
            expect(settings.columnMap['gm_order'].width).toBe(50);
            expect(settings.columnMap['createDate'].width).toBe(880);
            expect(settings.columnMap['lastDate'].width).toBe(130);
            expect(settings.columnMap['action'].width).toBe(100);
        });

        it('仅有一个拥有宽度的定制列', () => {
            settings.columnMap['pic'].isShow = false;
            settings.columnMap['type'].isShow = false;
            settings.columnMap['info'].isShow = false;
            settings.columnMap['username'].isShow = false;
            settings.columnMap['title'].isShow = false;
            settings.columnMap['createDate'].isShow = false;
            updateThWidth(settings, false);
            expect(settings.columnMap['gm_checkbox'].width).toBe(40);
            expect(settings.columnMap['gm_order'].width).toBe(50);
            expect(settings.columnMap['lastDate'].width).toBe(1010);
            expect(settings.columnMap['action'].width).toBe(100);
        });

        it('打开一个拥有宽度的定制列', () => {
            settings.columnMap['pic'].isShow = false;
            settings.columnMap['type'].isShow = true;
            settings.columnMap['info'].isShow = false;
            settings.columnMap['username'].isShow = false;
            settings.columnMap['title'].isShow = false;
            settings.columnMap['createDate'].isShow = false;
            updateThWidth(settings, false);
            expect(settings.columnMap['gm_checkbox'].width).toBe(40);
            expect(settings.columnMap['gm_order'].width).toBe(50);
            expect(settings.columnMap['type'].width).toBe(880);
            expect(settings.columnMap['lastDate'].width).toBe(130);
            expect(settings.columnMap['action'].width).toBe(100);
        });

        it('打开一个自适应宽度的定制列', () => {
            settings.columnMap['pic'].isShow = false;
            settings.columnMap['type'].isShow = true;
            settings.columnMap['info'].isShow = false;
            settings.columnMap['username'].isShow = false;
            settings.columnMap['title'].isShow = true;
            settings.columnMap['createDate'].isShow = false;
            updateThWidth(settings, false);
            expect(settings.columnMap['gm_checkbox'].width).toBe(40);
            expect(settings.columnMap['gm_order'].width).toBe(50);
            expect(settings.columnMap['type'].width).toBe(150);
            expect(settings.columnMap['title'].width).toBe(730);
            expect(settings.columnMap['lastDate'].width).toBe(130);
            expect(settings.columnMap['action'].width).toBe(100);
        });

        it('再打开一个自适应宽度的定制列', () => {
            settings.columnMap['pic'].isShow = true;
            settings.columnMap['pic'].__width = null;  // 修改 _width， 将该列设置为自动列
            settings.columnMap['type'].isShow = true;
            settings.columnMap['info'].isShow = false;
            settings.columnMap['username'].isShow = false;
            settings.columnMap['title'].isShow = true;
            settings.columnMap['createDate'].isShow = false;

            let picThTextWidth = getThTextWidth('test', settings.columnMap['pic'], settings.isIconFollowText);
            let titleThTextWidth = getThTextWidth('test', settings.columnMap['title'], settings.isIconFollowText);
            let overage = 1200 - 40 - 50 - 150 - 130 - 100 - picThTextWidth - titleThTextWidth;
            updateThWidth(settings, false);
            expect(settings.columnMap['gm_checkbox'].width).toBe(40);
            expect(settings.columnMap['gm_order'].width).toBe(50);

            // windows 系统不执行以下脚本
            if (navigator.platform !== 'Win32') {
                expect(settings.columnMap['pic'].width).toBe(overage / 2 + picThTextWidth);
                expect(settings.columnMap['title'].width).toBe(overage / 2 + titleThTextWidth);
            }
            expect(settings.columnMap['type'].width).toBe(150);
            expect(settings.columnMap['lastDate'].width).toBe(130);
            expect(settings.columnMap['action'].width).toBe(100);

            picThTextWidth = null;
            titleThTextWidth = null;
            overage = null;
        });
    });


    describe('getThTextWidth(_, col, isIconFollowText, __isNested)', () => {
        let col;
        beforeEach(() => {
            document.body.innerHTML = tableTestTpl;

            // TODO 由于没有引样式文件，所以需要通过修改样式属性来处理
            document.querySelector('.text-dreamland').style.position = 'absolute';
            document.querySelector('.text-dreamland').style.visibility = 'hidden';
            document.querySelector('.text-dreamland').style.zIndex = -10;
            col = {
                key: 'pic'
            };
        });

        afterEach(() => {
            col = null;
            document.querySelector('.text-dreamland').style.position = 'static';
            document.querySelector('.text-dreamland').style.visibility = 'visible';
            document.querySelector('.text-dreamland').style.zIndex = 1;
            document.body.innerHTML = '';
        });

        it('基础验证', () => {
            expect(getThTextWidth).toBeDefined();
            expect(getThTextWidth.length).toBe(4);
        });

        it('执行验证', () => {
            expect(typeof getThTextWidth('test', col)).toBe('number');
            expect(typeof getThTextWidth('test', col, true)).toBe('number');
        });
    });

    describe('getTextWidth(_, content, cssObj)', () => {
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
            expect(typeof getTextWidth('test', '123456', {'fontSize': '24px'})).toBe('number');
        });
    });

    describe('updateScrollStatus(_)', () => {
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
            expect($tableDiv.attr('gm-overflow-x')).toBe('false');

            $table.width(1100);
            $tableDiv.width(1000);
            updateScrollStatus('test');
            expect($tableDiv.attr('gm-overflow-x')).toBe('true');
        });
    });

    describe('calcLayout(settings)', () => {
        let $wrap = null;
        let $div = null;
        let theadHeight = null;
        let ajaxPageHeight = null;
        let $tableHeader = null;
        let settings = null;
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
            settings = null;
        });

        it('基础验证', () => {
            expect(calcLayout).toBeDefined();
            expect(calcLayout.length).toBe(1);
        });

        it('有分页的验证', () => {
            settings = {
                _: 'test',
                width: '1000px',
                height: '500px',
                supportAjaxPage: true
            };
            calcLayout(settings);
            expect($wrap.width()).toBe(1000);
            expect($wrap.height()).toBe(500);
            expect($div.height()).toBe(500 - ajaxPageHeight);
            expect($tableHeader.height()).toBe(theadHeight + 1);
        });

        it('无分页的验证', () => {
            settings = {
                _: 'test',
                width: '1000px',
                height: '500px',
                supportAjaxPage: false
            };
            calcLayout(settings);
            expect($wrap.width()).toBe(1000);
            expect($wrap.height()).toBe(500);
            expect($div.height()).toBe(500);
            expect($tableHeader.height()).toBe(theadHeight + 1);
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

    describe('getScrollBarWidth(_)', () => {
        beforeEach(() => {
            document.body.innerHTML = tableTestTpl;
        });

        afterEach(() => {
            document.body.innerHTML = '';
        });

        it('基础验证', () => {
            expect(getScrollBarWidth).toBeDefined();
            expect(getScrollBarWidth.length).toBe(1);
        });

        it('执行验证', () => {
            expect(typeof getScrollBarWidth('test')).toBe('number'); // 执行环境不一样，值会不同，这里只验证是否为数字返回
        });
    });

    describe('setLineHeightValue(_, height)', () => {
        let div = null;
        beforeEach(() => {
            document.body.innerHTML = tableTestTpl;
            div = jTool('.table-div').get(0);
        });

        afterEach(() => {
            document.body.innerHTML = '';
            div = null;
        });

        it('执行验证', () => {
            // 默认的值为'41px', 但在单元测试中因为未执行渲染所以默认为空字符串
            expect(getComputedStyle(div).getPropertyValue('--gm-line-height')).toBe('');
            setLineHeightValue('test', '100px');
            expect(getComputedStyle(div).getPropertyValue('--gm-line-height')).toBe('100px');
        });
    });
});
