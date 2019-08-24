import { parseTpl } from '@common/parse';

describe('parseTpl', () => {
    it('基础验证', () => {
        let str = '<table class="dreamland-table {{vm.tableClassName}}">{{vm.tbodyHtml}}</table>';
        let trimStr = '<table class="dreamland-table kouzi">like kouzi</table>';
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
