import { installTopFull } from '@module/fullColumn';
import getTableTestData from '@test/table-test.data.js';
import { getColumnData } from '@test/table-config';

describe('fullColumn', () => {
    describe('installTopFull', () => {
        let settgins = null;
        let tbody = null;
        let tableData = null;
        let callback = null;
        let tbodyContent = null;
        beforeEach(() => {
            document.body.innerHTML = '<table><tbody></tbody></table>';
            tbody = document.body.querySelector('tbody');
            tableData = getTableTestData().data;
            callback = jasmine.createSpy('callback');
        });

        afterEach(() => {
            document.body.innerHTML = '';
            tbody = null;
            settgins = null;
            tableData = null;
            callback = null;
            tbodyContent = null;
        });
        it('基础验证', () => {
            expect(installTopFull.length).toBe(5);
        });

        it('执行验证', () => {
            settgins = {
                gridManagerName: 'test-fullColumn',
                columnData: getColumnData(),
                topFullColumn: {
                    template: (row, index) => {
                        return '<div>我是通栏，哈哈</div>';
                    }
                }
            };
            tbodyContent = '';
            expect(tbody.innerHTML).toBe(tbodyContent);
            installTopFull(settgins, tbody, tableData[1], 1, callback);

            expect(callback).toHaveBeenCalledTimes(1);

            tbodyContent = `
                <tr top-full-column-interval="true">
                    <td colspan="${settgins.columnData.length}"><div></div></td>
                </tr>
                <tr top-full-column="true">
                    <td colspan="${settgins.columnData.length}"><div class="full-column-td"><div>我是通栏，哈哈</div></div></td>
                </tr>
            `;
            expect(tbody.innerHTML.replace(/\s/g, '')).toBe(tbodyContent.replace(/\s/g, ''));


            // 返回DOM
            let tdContent = document.createElement('div');
            tdContent.innerText = '我是DOM通栏，哈哈';
            settgins = {
                gridManagerName: 'test-fullColumn',
                columnData: getColumnData(),
                topFullColumn: {
                    template: (row, index) => {
                        return tdContent;
                    }
                }
            };
            installTopFull(settgins, tbody, tableData[2], 2, callback);
            expect(callback).toHaveBeenCalledTimes(2);
            tbodyContent = `
                <tr top-full-column-interval="true">
                    <td colspan="${settgins.columnData.length}"><div></div></td>
                </tr>
                <tr top-full-column="true">
                    <td colspan="${settgins.columnData.length}"><div class="full-column-td"><div>我是通栏，哈哈</div></div></td>
                </tr>
                <tr top-full-column-interval="true">
                    <td colspan="${settgins.columnData.length}"><div></div></td>
                </tr>
                <tr top-full-column="true">
                    <td colspan="${settgins.columnData.length}"><div class="full-column-td"><div>我是DOM通栏，哈哈</div></div></td>
                </tr>
            `;
            expect(tbody.innerHTML.replace(/\s/g, '')).toBe(tbodyContent.replace(/\s/g, ''));
        });

        it('错误验证', () => {
            settgins = {
                gridManagerName: 'test-fullColumn',
                columnData: getColumnData(),
                topFullColumn: {}
            };
            tbodyContent = '';
            expect(tbody.innerHTML).toBe(tbodyContent);
            installTopFull(settgins, tbody, tableData[1], 1, callback);

            expect(tbody.innerHTML).toBe(tbodyContent);
            expect(callback).toHaveBeenCalledTimes(0);
        });
    });
});
