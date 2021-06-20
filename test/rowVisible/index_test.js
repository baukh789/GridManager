import jTool from '@jTool';
import { showRow, hideRow } from '../../src/module/rowVisible';
import {TABLE_BODY_KEY, TABLE_HEAD_KEY, TR_CACHE_KEY, ROW_HIDE_KEY} from '@common/constants';

// 获取指定类型的DOM长度
const getTrLen = type => {
    return jTool(`[${TABLE_BODY_KEY}="test"] tr[${ROW_HIDE_KEY}="${type}"]`).length;
};
describe('rowVisible', () => {
    let $tr = null;
    let settings = null;
    beforeEach(() => {
        document.body.innerHTML = `
            <table grid-manager="test">
                <thead ${TABLE_HEAD_KEY}="test">
                    <tr><th th-name="username">username</th><th th-name="createDate">createDate</th><th th-name="lastDate">lastDate</th></tr>
                </thead>
                <tbody ${TABLE_BODY_KEY}="test">
                    <tr ${TR_CACHE_KEY}="0"><td>张三</td><td>2019-11-11</td><td>2019-12-11</td></tr>
                    <tr ${TR_CACHE_KEY}="1"><td>李四</td><td>2019-11-11</td><td>2019-12-12</td></tr>
                    <tr ${TR_CACHE_KEY}="2"><td>王五</td><td>2019-11-12</td><td>2019-12-11</td></tr>
                    <tr ${TR_CACHE_KEY}="3"><td>赵六</td><td>2019-11-13</td><td>2019-12-11</td></tr>
                    <tr gm-summary-row=""><td>统计</td><td>共4人</td><td></td></tr>
                </tbody>
            </table>
        `;
        $tr = jTool(`[${TABLE_BODY_KEY}="test"] tr`).eq(2);
        settings = {
            _: 'test',
            columnMap: {
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
            }
        };
    });

    afterEach(() => {
        document.body.innerHTML = '';
        $tr = null;
        settings = null;
    });

    it('执行前验证', () => {
        expect(getTrLen('out')).toBe(0);
        expect(getTrLen('ing')).toBe(0);
        expect(getTrLen('true')).toBe(0);
    });
    it('执行hideRow后验证', done => {
        hideRow(settings, 2);
        expect(getTrLen('out')).toBe(0);
        expect(getTrLen('ing')).toBe(1);
        expect(getTrLen('true')).toBe(0);

        setTimeout(() => {
            expect(getTrLen('out')).toBe(0);
            expect(getTrLen('ing')).toBe(0);
            expect(getTrLen('true')).toBe(1);
            done();
        }, 500);
    });
    it('执行showRow后验证', done => {
        $tr.attr('ROW_HIDE_KEY', true);
        showRow(settings, 2);
        expect(getTrLen('out')).toBe(1);
        expect(getTrLen('ing')).toBe(0);
        expect(getTrLen('true')).toBe(0);

        setTimeout(() => {
            expect(getTrLen('out')).toBe(0);
            expect(getTrLen('ing')).toBe(0);
            expect(getTrLen('true')).toBe(0);
            done();
        }, 500);
    });

});
