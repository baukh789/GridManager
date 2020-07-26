import { getQuerySelector, joinPaginationNumber, getPageData } from '../../src/module/ajaxPage/tool';
import { TOOLBAR_KEY } from '../../src/common/constants';

describe('ajaxPage tool', () => {
    describe('getQuerySelector', () => {
        it('基础验证', () => {
            expect(getQuerySelector).toBeDefined();
            expect(getQuerySelector.length).toBe(1);
        });

        it('执行验证', () => {
            expect(getQuerySelector('baukh')).toBe(`[${TOOLBAR_KEY}="baukh"]`);
        });
    });

    describe('joinPaginationNumber', () => {
        let pageData = null;
        let pHTML = '';
        beforeEach(() => {
        });

        afterEach(() => {
            pageData = null;
            pHTML = null;
        });

        it('基础验证', () => {
            expect(joinPaginationNumber).toBeDefined();
            expect(joinPaginationNumber.length).toBe(2);
        });

        it('执行验证: 页码少于4', () => {
            pageData = {
                pSize: 20,
                cPage: 1,
                tPage: 3,
                tSize: 54
            };
            pHTML = '<li class="active">1</li><li to-page="2">2</li><li to-page="3">3</li>';
            expect(joinPaginationNumber('cPage', pageData)).toBe(pHTML);
        });

        it('执行验证: 总页少于5', () => {
            pageData = {
                pSize: 20,
                cPage: 1,
                tPage: 5,
                tSize: 94
            };
            pHTML = '<li class="active">1</li><li to-page="2">2</li><li to-page="3">3</li><li to-page="4">4</li><li to-page="5">5</li>';
            expect(joinPaginationNumber('cPage', pageData)).toBe(pHTML);
        });

        it('执行验证: 当前页大于4', () => {
            pageData = {
                pSize: 20,
                cPage: 5,
                tPage: 7,
                tSize: 134
            };
            pHTML = '<li to-page="1">1</li><li class="disabled">...</li><li to-page="3">3</li><li to-page="4">4</li><li class="active">5</li><li to-page="6">6</li><li to-page="7">7</li>';
            expect(joinPaginationNumber('cPage', pageData)).toBe(pHTML);
        });
        it('执行验证: 总页大于5', () => {
            pageData = {
                pSize: 20,
                cPage: 1,
                tPage: 7,
                tSize: 134
            };
            pHTML = '<li class="active">1</li><li to-page="2">2</li><li to-page="3">3</li><li class="disabled">...</li><li to-page="7">7</li>';
            expect(joinPaginationNumber('cPage', pageData)).toBe(pHTML);
        });

        it('执行验证: 错误数据', () => {
            pageData = {};
            pHTML = '';
            expect(joinPaginationNumber('cPage', pageData)).toBe(pHTML);
        });
    });

    describe('getPageData', () => {
        let settings = null;
        beforeEach(() => {
        });

        afterEach(() => {
            settings = null;
        });
        it('基础验证', () => {
            expect(getPageData).toBeDefined();
            expect(getPageData.length).toBe(3);
        });

        it('执行验证: 存在totals', () => {
            settings = {
                pageData: {
                    pSize: 20,
                    cPage: 1
                },
                pageSizeKey: 'pSize',
                pageSize: 20,
                currentPageKey: 'cPage'
            };
            expect(getPageData(settings, 134)).toEqual({
                pSize: 20,
                cPage: 1,
                tPage: 7,
                tSize: 134
            });
        });

        it('执行验证: 存在totals 且 pageData为空', () => {
            settings = {
                pageData: {},
                pageSizeKey: 'pSize',
                pageSize: 20,
                currentPageKey: 'cPage'
            };
            expect(getPageData(settings, 134)).toEqual({
                pSize: 20,
                cPage: 1,
                tPage: 7,
                tSize: 134
            });
        });

        it('执行验证: 存在totals 且 指定的当前页大计算出的总页数', () => {
            settings = {
                pageData: {
                    pSize: 20,
                    cPage: 8
                },
                pageSizeKey: 'pSize',
                pageSize: 20,
                currentPageKey: 'cPage'
            };
            expect(getPageData(settings, 134)).toEqual({
                pSize: 20,
                cPage: 1,
                tPage: 7,
                tSize: 134
            });
        });

        it('执行验证: 末存在totals 且 当前页返回数小于pSize', () => {
            settings = {
                pageData: {
                    pSize: 20,
                    cPage: 5
                },
                pageSizeKey: 'pSize',
                pageSize: 20,
                currentPageKey: 'cPage'
            };
            expect(getPageData(settings, undefined, 15)).toEqual({
                pSize: 20,
                cPage: 5,
                tPage: 5,
                tSize: undefined
            });
        });

        it('执行验证: 末存在totals 且 当前页返回数等于pSize', () => {
            settings = {
                pageData: {
                    pSize: 20,
                    cPage: 5
                },
                pageSizeKey: 'pSize',
                pageSize: 20,
                currentPageKey: 'cPage'
            };
            expect(getPageData(settings, undefined, 20)).toEqual({
                pSize: 20,
                cPage: 5,
                tPage: 6,
                tSize: undefined
            });
        });
    });

});
