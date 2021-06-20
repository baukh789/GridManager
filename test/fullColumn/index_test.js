import fullColumn from '../../src/module/fullColumn';
import { getColumnMap } from '../table-config';

describe('fullColumn', () => {
    describe('addTop', () => {
        let settings = null;
        let trObjectList = null;
        let topTrObject = null;

        beforeEach(() => {
            trObjectList = [];
        });

        afterEach(() => {
            settings = null;
            trObjectList = null;
            topTrObject = null;
        });
        it('基础验证', () => {
            expect(fullColumn.addTop.length).toBe(4);
        });

        it('执行验证: 未存在有效的通栏模板', () => {
            settings = {
                gridManagerName: 'test-fullColumn',
                columnMap: getColumnMap(),
                fullColumn: {}
            };
            fullColumn.addTop(settings, {id: 1}, 1, trObjectList);
            expect(trObjectList).toEqual([]);
        });

        it('执行验证', () => {
            settings = {
                gridManagerName: 'test-fullColumn',
                columnMap: getColumnMap(),
                fullColumn: {
                    topTemplate: (row, index) => {
                        return '<div>我是通栏，哈哈</div>';
                    }
                }
            };

            fullColumn.addTop(settings, {id: 1}, 1, trObjectList);
            expect(trObjectList.length).toBe(1);

            topTrObject = trObjectList[0];
            expect(topTrObject.className.length).toBe(0);
            expect(topTrObject.attribute.length).toBe(2);
            expect(topTrObject.attribute[0]).toBe('full-column="top"');
            expect(topTrObject.attribute[1]).toBe('parent-key=1');
            expect(topTrObject.tdList.length).toBe(1);
            expect(topTrObject.tdList[0]).toBe(`<td colspan="${Object.keys(settings.columnMap).length}"><div class="full-column-div" ><div>我是通栏，哈哈</div></div></td>`);
        });

        it('useFold=true', () => {
            settings = {
                gridManagerName: 'test-fullColumn',
                columnMap: getColumnMap(),
                fullColumn: {
                    useFold: true,
                    topTemplate: (row, index) => {
                        return '<div>我是通栏，哈哈</div>';
                    }
                }
            };

            fullColumn.addTop(settings, {id: 1}, 1, trObjectList);
            expect(trObjectList.length).toBe(1);

            topTrObject = trObjectList[0];
            expect(topTrObject.className.length).toBe(0);
            expect(topTrObject.attribute.length).toBe(3);
            expect(topTrObject.attribute[0]).toBe('full-column="top"');
            expect(topTrObject.attribute[1]).toBe('parent-key=1');
            expect(topTrObject.attribute[2]).toBe('full-column-state="false"');
            expect(topTrObject.tdList.length).toBe(1);
            expect(topTrObject.tdList[0]).toBe(`<td colspan="${Object.keys(settings.columnMap).length}"><div class="full-column-div" ><div>我是通栏，哈哈</div></div></td>`);
        });
    });

    describe('addBottom', () => {
        let settings = null;
        let trObjectList = null;
        let topTrObject = null;
        let intervalTrObject = null;

        beforeEach(() => {
            trObjectList = [];
        });

        afterEach(() => {
            settings = null;
            trObjectList = null;
            topTrObject = null;
            intervalTrObject = null;
        });
        it('基础验证', () => {
            expect(fullColumn.addBottom.length).toBe(4);
        });

        it('执行验证', () => {
            settings = {
                gridManagerName: 'test-fullColumn',
                columnMap: getColumnMap(),
                fullColumn: {}
            };
            fullColumn.addBottom(settings, {id: 1}, 1, trObjectList);
            expect(trObjectList).toEqual([]);
        });

        it('执行验证: 存在底部通栏模板', () => {
            settings = {
                gridManagerName: 'test-fullColumn',
                columnMap: getColumnMap(),
                fullColumn: {
                    bottomTemplate: (row, index) => {
                        return '<div>我是通栏，哈哈</div>';
                    }
                }
            };

            fullColumn.addBottom(settings, {id: 1}, 1, trObjectList);
            expect(trObjectList.length).toBe(2);

            topTrObject = trObjectList[0];
            expect(topTrObject.className.length).toBe(0);
            expect(topTrObject.attribute.length).toBe(2);
            expect(topTrObject.attribute[0]).toBe('full-column="bottom"');
            expect(topTrObject.attribute[1]).toBe('parent-key=1');
            expect(topTrObject.tdList.length).toBe(1);
            expect(topTrObject.tdList[0]).toBe(`<td colspan="${Object.keys(settings.columnMap).length}"><div class="full-column-div" ><div>我是通栏，哈哈</div></div></td>`);

            intervalTrObject = trObjectList[1];
            expect(intervalTrObject.className.length).toBe(0);
            expect(intervalTrObject.attribute.length).toBe(2);
            expect(intervalTrObject.attribute[0]).toBe('full-column-interval="0px"');
            expect(intervalTrObject.attribute[1]).toBe('parent-key=1');
            expect(intervalTrObject.tdList.length).toBe(1);
            expect(intervalTrObject.tdList[0]).toBe(`<td colspan="${Object.keys(settings.columnMap).length}"><div style="height: 0px"></div></td>`);
        });
    });

    describe('getColumn', () => {
        let settings = null;
        let column = null;

        beforeEach(() => {
        });

        afterEach(() => {
            settings = null;
            column = null;
        });
        it('基础验证', () => {
            expect(fullColumn.getColumn.length).toBe(1);
        });

        it('执行验证', () => {
            settings = {
                gridManagerName: 'test-fullColumn',
                columnMap: getColumnMap(),
                fullColumn: {
                    fixed: 'left'
                }
            };
            column = fullColumn.getColumn(settings);
            expect(column.key).toBe('gm_fold');
            expect(column.text).toBe('');
            expect(column.isAutoCreate).toBe(true);
            expect(column.isShow).toBe(true);
            expect(column.disableCustomize).toBe(true);
            expect(column.width).toBe('40px');
            expect(column.fixed).toBe('left');
            expect(column.template()).toBe('<td gm-create gm-fold><i class="gm-icon gm-icon-add" full-column-fold="false"></i></td>');
        });
    });
});
