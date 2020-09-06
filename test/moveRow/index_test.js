import moveRow from '../../src/module/moveRow';
import { DISABLE_MOVE } from '../../src/module/moveRow/constants';
import jTool from '@jTool';

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
                                <th style="width:100px;left: 0px;box-shadow: rgba(0, 0, 0, 0.2) 2px 2px 2px 1px;">1</th>
                                <th style="width:200px">2</th>
                                <th style="width:130px">3</th>
                                <th style="right: 0px;box-shadow: rgba(0, 0, 0, 0.2) 2px 2px 2px 1px;">4</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr style="height: 80px">
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
        it('overFlow: false', () => {
            params = {
                table,
                tr,
                overFlow: false,
                $thList: jTool('.testMove th')
            };
            expectStr = `
                <table class="dreamland-row testMove">
                    <tbody>
                        <tr style="height: 80px">
                            <td style="width:100px;left: 0px;right: auto;">1</td>
                            <td style="width:200px;left:auto;right: auto;">2</td>
                            <td style="width:130px;left:auto;right: auto;">3</td>
                            <td style="width:70px;left:auto;right: 0px;">4</td>
                        </tr>
                    </tbody>
                </table>`
                .replace(/\s/g, '');
            html = moveRow.createHtml(params);
            expect(html.replace(/\s/g, '')).toBe(expectStr);
        });
        it('overFlow: true', () => {
            params = {
                table,
                tr,
                overFlow: true,
                $thList: jTool('.testMove th')
            };
            expectStr = `
                <table class="dreamland-row testMove">
                    <tbody>
                        <tr style="height: 80px">
                            <td style="width:100px;left: 0px;right: auto;box-shadow: rgba(0, 0, 0, 0.2) 2px 2px 2px 1px;">1</td>
                            <td style="width:200px;left:auto;right: auto;box-shadow:none;">2</td>
                            <td style="width:130px;left:auto;right: auto;box-shadow:none;">3</td>
                            <td style="width:70px;left:auto;right: 0px;box-shadow: rgba(0, 0, 0, 0.2) 2px 2px 2px 1px;">4</td>
                        </tr>
                    </tbody>
                </table>`
                .replace(/\s/g, '');
            html = moveRow.createHtml(params);
            expect(html.replace(/\s/g, '')).toBe(expectStr);
        });
    });

    describe('getColumn', () => {
        let col = null;
        beforeEach(() => {
        });
        afterEach(() => {
            col = null;
        });
        it('moveRowConfig默认配置', () => {
            col = moveRow.getColumn({});
            expect(col.key).toBe('gm_moverow');
            expect(col.text).toBe('');
            expect(col.isAutoCreate).toBe(true);
            expect(col.isShow).toBe(true);
            expect(col.disableCustomize).toBe(true);
            expect(col.width).toBe('30px');
            expect(col.fixed).toBeUndefined();
            expect(col.template()).toBe('<td gm-create gm-moverow><i class="gm-icon gm-icon-move"></i></td>');
        });
        it('指定fixed', () => {
            col = moveRow.getColumn({fixed: 'left'});
            expect(col.key).toBe('gm_moverow');
            expect(col.text).toBe('');
            expect(col.isAutoCreate).toBe(true);
            expect(col.isShow).toBe(true);
            expect(col.disableCustomize).toBe(true);
            expect(col.width).toBe('30px');
            expect(col.fixed).toBe('left');
            expect(col.template()).toBe('<td gm-create gm-moverow><i class="gm-icon gm-icon-move"></i></td>');
        });
    });
});
