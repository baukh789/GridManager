import { mergeRow, clearMergeRow } from '../../src/module/merge';
import { TABLE_HEAD_KEY, TABLE_BODY_KEY } from '../../src/common/constants';
import jTool from '../../src/jTool';
import { clearCacheDOM } from '../../src/common/domCache';
describe('merge', () => {
    beforeEach(() => {
        clearCacheDOM('test');
    });
    describe('mergeRow(_, columnMap)', () => {
        let columnMap = null;
        beforeEach(() => {
            document.body.innerHTML = `
            <table grid-manager="test">
                <thead ${TABLE_HEAD_KEY}="test">
                    <tr><th th-name="username">username</th><th th-name="createDate">createDate</th><th th-name="lastDate">lastDate</th></tr>
                </thead>
                <tbody ${TABLE_BODY_KEY}="test">
                    <tr><td>张三</td><td>2019-11-11</td><td>2019-12-11</td></tr>
                    <tr><td>李四</td><td>2019-11-11</td><td>2019-12-12</td></tr>
                    <tr><td>王五</td><td>2019-11-12</td><td>2019-12-11</td></tr>
                    <tr><td>赵六</td><td>2019-11-13</td><td>2019-12-11</td></tr>
                    <tr gm-summary-row=""><td>统计</td><td>共4人</td><td></td></tr>
                </tbody>
            </table>
        `;
        });

        afterEach(() => {
            columnMap = null;
            document.body.innerHTML = '';
        });

        it('基础验证', () => {
            expect(mergeRow).toBeDefined();
            expect(mergeRow.length).toBe(2);
        });

        it('执行验证: 未存在merge配置项', () => {
            columnMap = {
                username: {
                    key: 'username',
                    text: '作者'
                },
                createDate: {
                    key: 'createDate',
                    text: '创建时间'
                },
                lastDate: {
                    key: 'lastDate',
                    text: '最后修改时间'
                }
            };
            mergeRow('test', columnMap);
            expect(jTool('td[merge-td]').length).toBe(0);
        });

        it('执行验证: username存在merge配置项', () => {
            columnMap = {
                username: {
                    key: 'username',
                    text: '作者',
                    merge: 'text'
                },
                createDate: {
                    key: 'createDate',
                    text: '创建时间'
                },
                lastDate: {
                    key: 'lastDate',
                    text: '最后修改时间'
                }
            };
            mergeRow('test', columnMap);
            expect(jTool('td[merge-td]').length).toBe(0);
        });

        it('执行验证: createDate存在merge配置项', () => {
            columnMap = {
                username: {
                    key: 'username',
                    text: '作者'
                },
                createDate: {
                    key: 'createDate',
                    text: '创建时间',
                    merge: 'html'
                },
                lastDate: {
                    key: 'lastDate',
                    text: '最后修改时间'
                }
            };
            mergeRow('test', columnMap);
            expect(jTool('td[merge-td]').length).toBe(1);
        });

        it('执行验证: lastDate存在merge配置项', () => {
            columnMap = {
                username: {
                    key: 'username',
                    text: '作者'
                },
                createDate: {
                    key: 'createDate',
                    text: '创建时间'
                },
                lastDate: {
                    key: 'lastDate',
                    text: '最后修改时间',
                    merge: 'html'
                }
            };
            mergeRow('test', columnMap);
            expect(jTool('td[merge-td]').length).toBe(1);
        });
    });


    describe('clearMergeRow(_)', () => {
        beforeEach(() => {
            document.body.innerHTML = `
            <table grid-manager="test">
                <thead ${TABLE_HEAD_KEY}="test">
                    <tr><th th-name="username">username</th><th th-name="createDate">createDate</th><th th-name="lastDate">lastDate</th></tr>
                </thead>
                <tbody>
                    <tr><td>张三</td><td rowspan="2">2019-11-11</td><td>2019-12-11</td></tr>
                    <tr><td>李四</td><td merge-td>2019-11-11</td><td>2019-12-12</td></tr>
                    <tr><td>王五</td><td>2019-11-12</td><td rowspan="2">2019-12-11</td></tr>
                    <tr><td>赵六</td><td>2019-11-13</td><td merge-td>2019-12-11</td></tr>
                </tbody>
            </table>
        `;
        });

        afterEach(() => {
            document.body.innerHTML = '';
        });

        it('基础验证', () => {
            expect(clearMergeRow).toBeDefined();
            expect(clearMergeRow.length).toBe(1);
        });

        it('执行验证', () => {
            expect(jTool('td[merge-td]').length).toBe(2);
            expect(jTool('td[rowspan]').length).toBe(2);
            clearMergeRow('test');
            expect(jTool('td[merge-td]').length).toBe(0);
            expect(jTool('td[rowspan]').length).toBe(0);
        });
    });
});
