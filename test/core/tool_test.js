import { getParams, transformToPromise, diffTableData } from '../../src/module/core/tool';
import getTableTestData from '../table-test.data.js';
import {TR_CACHE_KEY} from '@common/constants';

const _ = 'test';
describe('core tool', () => {
    describe('getParams', () => {
        let settings = null;
        let params = null;
        beforeEach(() => {
        });
        afterEach(() => {
            settings = null;
            params = null;
        });

        it('基础验证', () => {
            expect(getParams).toBeDefined();
            expect(getParams.length).toBe(1);
        });

        it('执行验证: 未启用分页，未存在排序数据', () => {
            settings = {
                _,
                supportAjaxPage: false,
                query: {
                    customer: 'kouzi'
                },
                sortKey: 'sort_',
                currentPageKey: 'cPage',
                pageSizeKey: 'pSize',
                pageData: {
                    cPage: 3,
                    pSize: 20
                },
                sortData: {},
                mergeSort: false,
                requestHandler: request => request
            };
            params = {
                customer: 'kouzi'
            };
            expect(getParams(settings)).toEqual(params);
        });


        it('执行验证: 仅启用分页，未存在排序数据', () => {
            settings = {
                _,
                supportAjaxPage: true,
                query: {
                    customer: 'kouzi'
                },
                sortKey: 'sort_',
                currentPageKey: 'cPage',
                pageSizeKey: 'pSize',
                pageData: {
                    cPage: 3,
                    pSize: 20
                },
                sortData: {},
                mergeSort: false,
                requestHandler: request => request
            };
            params = {
                customer: 'kouzi',
                cPage: 3,
                pSize: 20
            };
            expect(getParams(settings)).toEqual(params);
        });

        it('执行验证: 未启用分页，存在排序数据(未启用合并排序)', () => {
            settings = {
                _,
                supportAjaxPage: false,
                query: {
                    customer: 'kouzi'
                },
                sortKey: 'sort_',
                currentPageKey: 'cPage',
                pageSizeKey: 'pSize',
                pageData: {
                    cPage: 3,
                    pSize: 20
                },
                sortData: {
                    title: 'ASC',
                    age: 'DESC'
                },
                mergeSort: false,
                requestHandler: request => request
            };
            params = {
                customer: 'kouzi',
                sort_title: 'ASC',
                sort_age: 'DESC'
            };
            expect(getParams(settings)).toEqual(params);
        });

        it('执行验证: 未启用分页，存在排序数据(启用合并排序)', () => {
            settings = {
                _,
                supportAjaxPage: false,
                query: {
                    customer: 'kouzi'
                },
                sortKey: 'sort_',
                currentPageKey: 'cPage',
                pageSizeKey: 'pSize',
                pageData: {
                    cPage: 3,
                    pSize: 20
                },
                sortData: {
                    title: 'ASC',
                    age: 'DESC'
                },
                mergeSort: true,
                requestHandler: request => request
            };
            params = {
                customer: 'kouzi',
                sort_: 'title:ASC,age:DESC'
            };
            expect(getParams(settings)).toEqual(params);
        });

        it('执行验证: 启用分页，存在排序数据', () => {
            settings = {
                _,
                supportAjaxPage: true,
                query: {
                    customer: 'kouzi'
                },
                sortKey: 'sort_',
                currentPageKey: 'cPage',
                pageSizeKey: 'pSize',
                pageData: {
                    cPage: 3,
                    pSize: 20
                },
                sortData: {
                    title: 'ASC',
                    age: 'DESC'
                },
                mergeSort: false,
                requestHandler: request => request
            };
            params = {
                customer: 'kouzi',
                cPage: 3,
                pSize: 20,
                sort_title: 'ASC',
                sort_age: 'DESC'
            };
            expect(getParams(settings)).toEqual(params);
        });

        it('执行验证: 自定义requestHandler', () => {
            settings = {
                _,
                supportAjaxPage: true,
                query: {
                    customer: 'kouzi'
                },
                sortKey: 'sort_',
                currentPageKey: 'cPage',
                pageSizeKey: 'pSize',
                pageData: {
                    cPage: 3,
                    pSize: 20
                },
                sortData: {
                    title: 'ASC',
                    age: 'DESC'
                },
                mergeSort: false,
                requestHandler: request => {
                    request.customer = 'baukh';
                    return request;
                }
            };
            params = {
                customer: 'baukh',
                cPage: 3,
                pSize: 20,
                sort_title: 'ASC',
                sort_age: 'DESC'
            };
            expect(getParams(settings)).toEqual(params);
        });
    });
    describe('transformToPromise', () => {
        let settings = null;
        let promise = null;
        beforeEach(() => {
        });
        afterEach(() => {
            settings = null;
            promise = null;
        });

        it('基础验证', () => {
            expect(transformToPromise).toBeDefined();
            expect(transformToPromise.length).toBe(1);
        });

        it('执行验证: ajaxData === string url', () => {
            settings = {
                supportAjaxPage: true,
                pageData: {
                    cPage: 3,
                    pSize: 20
                },
                sortData: {
                    title: 'ASC',
                    age: 'DESC'
                },
                sortKey: 'sort_',
                ajaxType: 'POST',
                ajaxHeaders: {},
                ajaxXhrFields: {},
                requestHandler: request => {
                    request.cPage = 4;
                    request.sort_title = 'DESC';
                    delete request.sort_age;
                    return request;
                },
                ajaxData: 'http://0.0.0.0:9876/'
            };

            promise = transformToPromise(settings);
            expect(promise instanceof Promise).toBe(true);
            expect(settings.pageData.cPage).toBe(4);
            expect(settings.pageData.pSize).toBe(20);
            expect(settings.sortData.title).toBe('DESC');
            expect(settings.sortData.age).toBe('DESC');
        });

        it('执行验证: ajaxData === promise', () => {
            settings = {
                supportAjaxPage: true,
                pageData: {
                    cPage: 3,
                    pSize: 20
                },
                sortData: {
                    title: 'ASC',
                    age: 'DESC'
                },
                sortKey: 'sort_',
                ajaxType: 'GET',
                ajaxHeaders: {},
                ajaxXhrFields: {},
                requestHandler: request => {
                    request.cPage = 4;
                    request.sort_title = 'DESC';
                    delete request.sort_age;
                    return request;
                },
                ajaxData: function () {
                    return new Promise(resolve => resolve());
                }
            };

            promise = transformToPromise(settings);
            expect(promise instanceof Promise).toBe(true);
            expect(settings.pageData.cPage).toBe(4);
            expect(settings.pageData.pSize).toBe(20);
            expect(settings.sortData.title).toBe('DESC');
            expect(settings.sortData.age).toBe('DESC');
        });

        it('执行验证: ajaxData === 静态数据', () => {
            settings = {
                supportAjaxPage: true,
                pageData: {
                    cPage: 3,
                    pSize: 20
                },
                sortData: {
                    title: 'ASC',
                    age: 'DESC'
                },
                sortKey: 'sort_',
                ajaxType: 'GET',
                ajaxHeaders: {},
                ajaxXhrFields: {},
                requestHandler: request => {
                    request.cPage = 4;
                    request.sort_title = 'DESC';
                    delete request.sort_age;
                    return request;
                },
                ajaxData: getTableTestData()
            };

            promise = transformToPromise(settings);
            expect(promise instanceof Promise).toBe(true);
            expect(settings.pageData.cPage).toBe(4);
            expect(settings.pageData.pSize).toBe(20);
            expect(settings.sortData.title).toBe('DESC');
            expect(settings.sortData.age).toBe('DESC');
        });
    });

    describe('diffTableData', () => {
		let settings = null;
		let oldData = null;
		let newData = null;
		let diffData = null;
		beforeEach(() => {
		});
		afterEach(() => {
			settings = null;
			oldData = null;
			newData = null;
			diffData = null;
		});

		it('基础验证', () => {
			expect(diffTableData).toBeDefined();
			expect(diffTableData.length).toBe(3);
		});

		it('执行验证: 新老数据相同', () => {
			settings = {
				supportTreeData: false,
				treeConfig: {}
			};
			oldData = [{
				id: 1,
				[TR_CACHE_KEY]: '0',
				name: 'baukh'
			}, {
				id: 2,
				[TR_CACHE_KEY]: '1',
				name: 'baukh'
			}];
			newData = [{
				id: 1,
				[TR_CACHE_KEY]: '0',
				name: 'baukh'
			}, {
				id: 2,
				[TR_CACHE_KEY]: '1',
				name: 'baukh'
			}];
			diffData = diffTableData(settings, oldData, newData);
			expect(diffData.diffList.length).toBe(2);
			expect(diffData.diffList[0]).toBeUndefined();
			expect(diffData.diffList[1]).toBeUndefined();
			expect(diffData.diffFirst).toEqual({
				id: 1,
				[TR_CACHE_KEY]: '0',
				name: 'baukh'
			});
			expect(diffData.diffLast).toEqual({
				id: 2,
				[TR_CACHE_KEY]: '1',
				name: 'baukh'
			});
		});

		it('执行验证: 新增一条数据', () => {
			settings = {
				supportTreeData: false,
				treeConfig: {}
			};
			oldData = [{
				id: 1,
				[TR_CACHE_KEY]: '0',
				name: 'baukh'
			}, {
				id: 2,
				[TR_CACHE_KEY]: '1',
				name: 'baukh'
			}];
			newData = [{
				id: 1,
				[TR_CACHE_KEY]: '0',
				name: 'baukh'
			}, {
				id: 2,
				[TR_CACHE_KEY]: '1',
				name: 'baukh'
			}, {
				id: 3,
				[TR_CACHE_KEY]: '2',
				name: 'baukh'
			}];
			diffData = diffTableData(settings, oldData, newData);
			expect(diffData.diffList.length).toBe(3);
			expect(diffData.diffList[0]).toBeUndefined();
			expect(diffData.diffList[1]).toBeUndefined();
			expect(diffData.diffList[2]).toEqual({
				id: 3,
				[TR_CACHE_KEY]: '2',
				name: 'baukh'
			});
			expect(diffData.diffFirst).toEqual({
				id: 1,
				[TR_CACHE_KEY]: '0',
				name: 'baukh'
			});
			expect(diffData.diffLast).toEqual({
				id: 3,
				[TR_CACHE_KEY]: '2',
				name: 'baukh'
			});
		});

		it('执行验证: 减少一条数据', () => {
			settings = {
				supportTreeData: false,
				treeConfig: {}
			};
			oldData = [{
				id: 1,
				[TR_CACHE_KEY]: '0',
				name: 'baukh'
			}, {
				id: 2,
				[TR_CACHE_KEY]: '1',
				name: 'baukh'
			}, {
				id: 3,
				[TR_CACHE_KEY]: '2',
				name: 'baukh'
			}];
			newData = [{
				id: 1,
				[TR_CACHE_KEY]: '0',
				name: 'baukh'
			}, {
				id: 2,
				[TR_CACHE_KEY]: '1',
				name: 'baukh'
			}];
			diffData = diffTableData(settings, oldData, newData);
			expect(diffData.diffList.length).toBe(2);
			expect(diffData.diffList[0]).toBeUndefined();
			expect(diffData.diffList[1]).toBeUndefined();
			expect(diffData.diffFirst).toEqual({
				id: 1,
				[TR_CACHE_KEY]: '0',
				name: 'baukh'
			});
			expect(diffData.diffLast).toEqual({
				id: 2,
				[TR_CACHE_KEY]: '1',
				name: 'baukh'
			});
		});

		it('执行验证: 修改一条数据', () => {
			settings = {
				supportTreeData: false,
				treeConfig: {}
			};
			oldData = [{
				id: 1,
				[TR_CACHE_KEY]: '0',
				name: 'baukh'
			}, {
				id: 2,
				[TR_CACHE_KEY]: '1',
				name: 'baukh'
			}, {
				id: 3,
				[TR_CACHE_KEY]: '2',
				name: 'baukh'
			}];
			newData = [{
				id: 1,
				[TR_CACHE_KEY]: '0',
				name: 'baukh'
			}, {
				id: 2,
				[TR_CACHE_KEY]: '1',
				name: 'cc'
			}, {
				id: 3,
				[TR_CACHE_KEY]: '2',
				name: 'baukh'
			}];
			diffData = diffTableData(settings, oldData, newData);
			expect(diffData.diffList.length).toBe(3);
			expect(diffData.diffList[0]).toBeUndefined();
			expect(diffData.diffList[1]).toEqual({
				id: 2,
				[TR_CACHE_KEY]: '1',
				name: 'cc'
			});
			expect(diffData.diffList[2]).toBeUndefined();
			expect(diffData.diffFirst).toEqual({
				id: 1,
				[TR_CACHE_KEY]: '0',
				name: 'baukh'
			});
			expect(diffData.diffLast).toEqual({
				id: 3,
				[TR_CACHE_KEY]: '2',
				name: 'baukh'
			});
		});

		it('执行验证: 树型数据', () => {
			settings = {
				supportTreeData: true,
				treeConfig: {
					treeKey: 'children'
				}
			};
			oldData = [{
				id: 1,
				[TR_CACHE_KEY]: '0',
				name: 'baukh'
			}, {
				id: 2,
				[TR_CACHE_KEY]: '1',
				name: 'baukh',
				children: [{
					id: 21,
					[TR_CACHE_KEY]: '1-0',
					name: 'baukh'
				}, {
					id: 22,
					[TR_CACHE_KEY]: '1-1',
					name: 'baukh'
				}]
			}, {
				id: 3,
				[TR_CACHE_KEY]: '2',
				name: 'baukh'
			}];
			newData = [{
				id: 1,
				[TR_CACHE_KEY]: '0',
				name: 'baukh'
			}, {
				id: 2,
				[TR_CACHE_KEY]: '1',
				name: 'cc',
				children: [{
					id: 21,
					[TR_CACHE_KEY]: '1-0',
					name: 'baukh'
				}, {
					id: 22,
					[TR_CACHE_KEY]: '1-1',
					name: 'cc'
				}]
			}, {
				id: 3,
				[TR_CACHE_KEY]: '2',
				name: 'baukh',
				children: [{
					id: 31,
					[TR_CACHE_KEY]: '2-0',
					name: 'cc'
				}, {
					id: 32,
					[TR_CACHE_KEY]: '2-1',
					name: 'cc'
				}]
			}];
			diffData = diffTableData(settings, oldData, newData);
			expect(diffData.diffList.length).toBe(3);
			expect(diffData.diffList[0]).toBeUndefined();
			expect(diffData.diffList[1]).toEqual({
				id: 2,
				[TR_CACHE_KEY]: '1',
				name: 'cc',
				children: [
					undefined,
					{
					id: 22,
					[TR_CACHE_KEY]: '1-1',
					name: 'cc'
				}]
			});
			expect(diffData.diffList[2]).toEqual({
				id: 3,
				[TR_CACHE_KEY]: '2',
				name: 'baukh',
				children: [{
					id: 31,
					[TR_CACHE_KEY]: '2-0',
					name: 'cc'
				}, {
					id: 32,
					[TR_CACHE_KEY]: '2-1',
					name: 'cc'
				}]
			});
			expect(diffData.diffFirst).toEqual({
				id: 1,
				[TR_CACHE_KEY]: '0',
				name: 'baukh'
			});
			expect(diffData.diffLast).toEqual({
				id: 32,
				[TR_CACHE_KEY]: '2-1',
				name: 'cc'
			});
		});
	});
});
