import { parseTpl, trimTpl } from '@common/parse';

describe('trimTpl', () => {
    it('基础验证', () => {
        let str = `<table class="dreamland-table {{vm.tableClassName}}">
                        <tbody>
                            {{vm.tbodyHtml}}
                        </tbody>
                    </table>`;
        let trimStr = '<table class="dreamland-table {{vm.tableClassName}}"><tbody>{{vm.tbodyHtml}}</tbody></table>';
        expect(trimTpl(str)).toBe(trimStr);
        str = null;
        trimStr = null;
    });
});

describe('parseTpl', () => {
    it('基础验证', () => {
        let str = `<table class="dreamland-table {{vm.tableClassName}}">
                        <tbody>
                            {{vm.tbodyHtml}}
                        </tbody>
                    </table>`;
        let trimStr = '<table class="dreamland-table kouzi"><tbody>like kouzi</tbody></table>';
        let target = {};
        let key = 'testDecorator';
        let descriptor = {
            configurable: true,
            enumerable: false,
            writable: true,
            value: params => {
                return {
                    tableClassName: params.name,
                    tbodyHtml: params.html
                };
            }
        };
        let params = {
            name: 'kouzi',
            html: 'like kouzi'
        };
        parseTpl(str)(target, key, descriptor);
        expect(descriptor.value(params)).toBe(trimStr);
    });
});
