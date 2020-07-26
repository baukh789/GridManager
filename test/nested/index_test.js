import jTool from '../../src/jTool';
import nested from '../../src/module/nested';
import tpl from '../table-test.tpl.html';

describe('nested', () => {
    describe('addSign', () => {
        let $div = null;
        beforeEach(() => {
            document.body.innerHTML = tpl;
            $div = jTool('.table-div');
        });
        afterEach(() => {
            document.body.innerHTML = '';
            $div = null;
        });

        it('基础验证', () => {
            expect(nested.addSign).toBeDefined();
            expect(nested.addSign.length).toBe(1);
        });

        it('执行验证', () => {
            expect($div.attr('gm-nested')).toBeUndefined();
            nested.addSign('test');
            expect($div.attr('gm-nested')).toBe('');
        });
    });
    describe('push', () => {
        let columnList = null;
        let columnMap = null;
        beforeEach(() => {
            document.body.innerHTML = tpl;
            columnList = [[]];
            // 正常情况下 columnMap会在initSettings中生成以下的结构
            columnMap = {
                t1: {
                    key: 't1',
                    level: 0,
                    index: 0,
                    pk: undefined
                },
                t2: {
                    key: 't2',
                    level: 0,
                    index: 1,
                    pk: undefined,
                    children: [
                        {
                            key: 'c1',
                            level: 1,
                            index: 0,
                            pk: 't2'
                        },
                        {
                            key: 'c2',
                            level: 1,
                            index: 1,
                            pk: 't2',
                            children: [
                                {
                                    key: 'c21',
                                    level: 2,
                                    index: 0,
                                    pk: 'c2',
                                    children: [
                                        {
                                            key: 'c211',
                                            level: 3,
                                            index: 0,
                                            pk: 'c21'
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                c1: {
                    key: 'c1',
                    level: 1,
                    index: 0,
                    pk: 't2'
                },
                c2: {
                    key: 'c2',
                    level: 1,
                    index: 1,
                    pk: 't2',
                    children: [
                        {
                            key: 'c21',
                            level: 2,
                            index: 0,
                            pk: 'c2',
                            children: [
                                {
                                    key: 'c211',
                                    level: 3,
                                    index: 0,
                                    pk: 'c21'
                                }
                            ]
                        }
                    ]
                },
                c21: {
                    key: 'c21',
                    level: 2,
                    index: 0,
                    pk: 'c2',
                    children: [
                        {
                            key: 'c211',
                            level: 3,
                            index: 0,
                            pk: 'c21'
                        }
                    ]
                },
                c211: {
                    key: 'c211',
                    level: 3,
                    index: 0,
                    pk: 'c21'
                }
            };
        });
        afterEach(() => {
            document.body.innerHTML = '';
            columnList = null;
            columnMap = null;
        });

        it('基础验证', () => {
            expect(nested.push).toBeDefined();
            expect(nested.push.length).toBe(2);
        });

        it('执行验证', () => {
            nested.push(columnMap, columnList);
            expect(columnList.length).toBe(4);
            expect(columnList[0].length).toBe(2);
            expect(columnList[1].length).toBe(2);
            expect(columnList[2].length).toBe(1);
            expect(columnList[2].length).toBe(1);
        });
    });
});
