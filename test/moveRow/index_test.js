import moveRow from '../../src/module/moveRow';
import { DISABLE_MOVE } from '../../src/module/moveRow/constants';

describe('moveRow', () => {
    describe('addSign', () => {
        it('执行验证', () => {
            expect(moveRow.addSign({disableMoveRow: true})).toBe(DISABLE_MOVE);
            expect(moveRow.addSign({disableMoveRow: false})).toBe('');
        });
    });
    describe('createHtml', () => {
        let params;
        let table;
        let tr;
        let html;
        let expectStr;
        beforeEach(() => {
            document.body.innerHTML = `
                <style type="text/css">
                    .tess-move-div, .tess-move-div * {
                        box-sizing: border-box
                    }
                    .tess-move-div {
                        width: 500px;
                        padding: 0;
                    }
                    table {
                        table-layout: fixed;
                        width: 100%;
                        border-spacing: 0;
                        border-collapse: separate;
                    }
                </style>
                <div class="tess-move-div">
                    <table class="testMove">
                        <thead>
                            <tr>
                                <th style="width:100px">1</th>
                                <th style="width:200px">2</th>
                                <th style="width:130px">3</th>
                                <th>4</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>2</td>
                                <td>3</td>
                                <td>4</td>
                            </tr>
                        </tbody>
                    </table>
                </div>`;
            table = document.querySelector('table');
            tr = table.querySelector('tbody tr');
        });
        afterEach(() => {
            params = null;
            table = null;
            tr = null;
            html = null;
            expectStr = null;
        });
        it('执行验证', () => {
            params = {
                table,
                tr
            };
            expectStr = `
                <table class="dreamland-row testMove">
                    <tbody>
                        <tr><td width="100">1</td><td width="200">2</td><td width="130">3</td><td width="70">4</td></tr>
                    </tbody>
                </table>`
                .replace(/\s/g, '');
            html = moveRow.createHtml(params);
            expect(html.replace(/\s/g, '')).toBe(expectStr);
        });
    });
});
