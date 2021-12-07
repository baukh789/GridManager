import { installSummary } from '../../src/module/summary';

describe('summary', () => {
    describe('installSummary', () => {
        let settings = null;
        let columnList = null;
        let tableData = null;
        let trObjectList = null;
        let htmlStr = null;
        beforeEach(() => {
        });
        afterEach(() => {
            settings = null;
            columnList = null;
            tableData = null;
            trObjectList = null;
            htmlStr = null;
        });

        it('默认的汇总行执行函数', () => {
            settings = {
                summaryHandler: data => {
                    return {};
                }
            };
            columnList =  [
                {
                    key: 'title',
                    text: '标题',
                    align: 'left'
                },
                {
                    key: 'age',
                    text: '年龄'
                }
            ];
            tableData = [
                {
                    title: '标题1',
                    age: 20
                },
                {
                    title: '标题2',
                    age: 25
                },
                {
                    title: '标题3',
                    age: 30
                }
            ];
            trObjectList = [];
            installSummary(settings, columnList, tableData, trObjectList);
            expect(trObjectList.length).toBe(0);
        });

        it('参数正常', () => {
            settings = {
                summaryHandler: data => {
                    let ageSum = 0;
                    data.forEach(item => {
                        ageSum += item.age;
                    });
                    return {
                        title: '平均年龄',
                        age: ageSum / data.length
                    };
                }
            };
            columnList =  [
                {
                    key: 'title',
                    text: '标题',
                    align: 'left'
                },
                {
                    key: 'age',
                    text: '年龄'
                }
            ];
            tableData = [
                {
                    title: '标题1',
                    age: 20
                },
                {
                    title: '标题2',
                    age: 25
                },
                {
                    title: '标题3',
                    age: 30
                }
            ];
            trObjectList = [];
            htmlStr = `
                <td align="left" disable-move>平均年龄</td>
                <td disable-move>25</td>
            `.replace(/\s/g, '');
            installSummary(settings, columnList, tableData, trObjectList);
            expect(trObjectList[0].className).toEqual([]);
            expect(trObjectList[0].attribute).toEqual([['gm-summary-row', '']]);
            expect(trObjectList[0].querySelector).toEqual('[gm-summary-row]');
            expect(trObjectList[0].tdList.join('').replace(/\s/g, '')).toBe(htmlStr);
        });

        it('在框架中执行', () => {
            settings = {
                compileVue: new Promise(resolve => {}),
                summaryHandler: data => {
                    let ageSum = 0;
                    data.forEach(item => {
                        ageSum += item.age;
                    });
                    return {
                        title: '平均年龄',
                        age: ageSum / data.length
                    };
                }
            };
            columnList =  [
                {
                    key: 'title',
                    text: '标题',
                    align: 'left'
                },
                {
                    key: 'age',
                    text: '年龄'
                }
            ];
            tableData = [
                {
                    title: '标题1',
                    age: 20
                },
                {
                    title: '标题2',
                    age: 25
                },
                {
                    title: '标题3',
                    age: 30
                }
            ];
            trObjectList = [];
            htmlStr = `
                <td data-compile-node align="left" disable-move>平均年龄</td>
                <td data-compile-node disable-move>25</td>
            `.replace(/\s/g, '');
            installSummary(settings, columnList, tableData, trObjectList);
            expect(trObjectList[0].className).toEqual([]);
            expect(trObjectList[0].attribute).toEqual([['gm-summary-row', '']]);
            expect(trObjectList[0].querySelector).toEqual('[gm-summary-row]');
            expect(trObjectList[0].tdList.join('').replace(/\s/g, '')).toBe(htmlStr);
        });
    });
});
