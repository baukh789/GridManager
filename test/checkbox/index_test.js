import checkbox from '../../src/module/checkbox';
import { CHECKBOX_KEY, CHECKBOX_DISABLED_KEY } from '../../src/common/constants';

describe('checkbox', () => {
    describe('addSign', () => {
        let DISABLED_SELECTED = null;
        beforeEach(() => {
            DISABLED_SELECTED = 'disabled-selected';
        });
        afterEach(() => {
            DISABLED_SELECTED = null;
        });

        it('基础验证', () => {
            expect(checkbox.addSign).toBeDefined();
            expect(checkbox.addSign.length).toBe(1);
        });
        it('执行验证', () => {
            expect(checkbox.addSign({})).toBe('');
            expect(checkbox.addSign({disableRowCheck: false})).toBe('');
            expect(checkbox.addSign({disableRowCheck: true})).toBe(DISABLED_SELECTED);
        });
    });

    describe('getCheckedTr', () => {
        beforeEach(() => {
            document.body.innerHTML = `
                <table grid-manager="test">
                    <tbody>
                        <tr></tr>
                        <tr checked="true"></tr>
                        <tr></tr>
                        <tr checked="true"></tr>
                        <tr></tr>
                    </tbody>
                </table>
            `;
        });
        afterEach(() => {
            document.body.innerHTML = '';
        });
        it('执行验证', () => {
            expect(checkbox.getCheckedTr('test').length).toBe(2);
        });
    });

    describe('getColumn', () => {
        let htmlStr;
        let column;
        let conf;
        beforeEach(() => {
        });
        afterEach(() => {
            htmlStr = null;
            column = null;
            conf = null;
        });
        it('单选', () => {
            conf = {
                fixed: 'left',
                width: 50,
                useRadio: true
            };
            column = checkbox.getColumn(conf);
            expect(column.key).toBe(CHECKBOX_KEY);
            expect(column.text).toBe('');
            expect(column.isAutoCreate).toBe(true);
            expect(column.isShow).toBe(true);
            expect(column.disableCustomize).toBe(true);
            expect(column.width).toBe(50);
            expect(column.fixed).toBe('left');

            htmlStr = `
            <td gm-create gm-checkbox>
                <label class="gm-radio-wrapper">
                    <span class="gm-radio-checkbox gm-radio gm-radio-checked">
                        <input type="radio" class="gm-radio-checkbox-input gm-radio-input" checked="true"/>
                        <span class="gm-radio-checkbox-inner gm-radio-inner"></span>
                    </span>
                </label>
            </td>
            `.replace(/\s/g, '');
            expect(column.template(true, {[CHECKBOX_DISABLED_KEY]: false}, 0, true).replace(/\s/g, '')).toBe(htmlStr);
        });

        it('多选', () => {
            conf = {
                fixed: 'right',
                width: 40,
                useRadio: false
            };
            column = checkbox.getColumn(conf);
            expect(column.key).toBe(CHECKBOX_KEY);
            expect(column.text).toBe('<label class="gm-checkbox-wrapper"><span class="gm-radio-checkbox gm-checkbox"><input type="checkbox" class="gm-radio-checkbox-input gm-checkbox-input"/><span class="gm-radio-checkbox-inner gm-checkbox-inner"></span></span></label>');
            expect(column.isAutoCreate).toBe(true);
            expect(column.isShow).toBe(true);
            expect(column.disableCustomize).toBe(true);
            expect(column.width).toBe(40);
            expect(column.fixed).toBe('right');
            htmlStr = `
            <td gm-create gm-checkbox>
                <label class="gm-checkbox-wrapper">
                    <span class="gm-radio-checkbox gm-checkbox gm-checkbox-checked">
                        <input type="checkbox" class="gm-radio-checkbox-input gm-checkbox-input" checked="true"/>
                        <span class="gm-radio-checkbox-inner gm-checkbox-inner"></span>
                    </span>
                </label>
            </td>
            `.replace(/\s/g, '');
            expect(column.template(true, {[CHECKBOX_DISABLED_KEY]: false}, 0, true).replace(/\s/g, '')).toBe(htmlStr);
        });
    });

    describe('getCheckboxTpl', () => {
        let params;
        let htmlStr;
        beforeEach(() => {
        });
        afterEach(() => {
            params = null;
            htmlStr = null;
        });
        it('params:{}', () => {
            htmlStr = `
            <label class="gm-checkbox-wrapper">
                <span class="gm-radio-checkbox gm-checkbox">
                    <input type="checkbox" class="gm-radio-checkbox-input gm-checkbox-input"/>
                    <span class="gm-radio-checkbox-inner gm-checkbox-inner"></span>
                </span>
            </label>
            `.replace(/\s/g, '');
            params = {};
            expect(checkbox.getCheckboxTpl(params).replace(/\s/g, '')).toBe(htmlStr);
        });

        it('params:{checked:true,disabled:false,value:undefined,label:undefined}', () => {
            htmlStr = `
            <label class="gm-checkbox-wrapper">
                <span class="gm-radio-checkbox gm-checkbox gm-checkbox-checked">
                    <input type="checkbox" class="gm-radio-checkbox-input gm-checkbox-input" checked="true"/>
                    <span class="gm-radio-checkbox-inner gm-checkbox-inner"></span>
                </span>
            </label>
            `.replace(/\s/g, '');
            params = {
                checked: true,
                disabled: false
            };
            expect(checkbox.getCheckboxTpl(params).replace(/\s/g, '')).toBe(htmlStr);
        });

        it('params:{checked:false,disabled:true,value:4,label:"name"}', () => {
            htmlStr = `
            <label class="gm-checkbox-wrapper disabled-radio-checkbox">
                <span class="gm-radio-checkbox gm-checkbox">
                    <input type="checkbox" class="gm-radio-checkbox-input gm-checkbox-input" value="4"/>
                    <span class="gm-radio-checkbox-inner gm-checkbox-inner"></span>
                </span>
                <span class="gm-radio-checkbox-label">name</span>
            </label>
            `.replace(/\s/g, '');
            params = {
                checked: false,
                disabled: true,
                value: 4,
                label: 'name'
            };
            expect(checkbox.getCheckboxTpl(params).replace(/\s/g, '')).toBe(htmlStr);
        });
    });

    describe('getRadioTpl', () => {
        let params;
        let htmlStr;
        beforeEach(() => {
        });
        afterEach(() => {
            params = null;
            htmlStr = null;
        });
        it('params:{checked:true,disabled:false,value:undefined,label:undefined}', () => {
            htmlStr = `
            <label class="gm-radio-wrapper">
                <span class="gm-radio-checkbox gm-radio gm-radio-checked">
                    <input type="radio" class="gm-radio-checkbox-input gm-radio-input" checked="true"/>
                    <span class="gm-radio-checkbox-inner gm-radio-inner"></span>
                </span>
            </label>
            `.replace(/\s/g, '');
            params = {
                checked: true,
                disabled: false
            };
            expect(checkbox.getRadioTpl(params).replace(/\s/g, '')).toBe(htmlStr);
        });
        it('params:{checked:false,disabled:true,value:4,label:"name"}', () => {
            htmlStr = `
            <label class="gm-radio-wrapper disabled-radio-checkbox">
                <span class="gm-radio-checkbox gm-radio">
                    <input type="radio" class="gm-radio-checkbox-input gm-radio-input" value="4"/>
                    <span class="gm-radio-checkbox-inner gm-radio-inner"></span>
                </span>
                <span class="gm-radio-checkbox-label">name</span>
            </label>
            `.replace(/\s/g, '');
            params = {
                checked: false,
                disabled: true,
                value: 4,
                label: 'name'
            };
            expect(checkbox.getRadioTpl(params).replace(/\s/g, '')).toBe(htmlStr);
        });
    });
});
