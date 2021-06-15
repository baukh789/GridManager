import order from '../../src/module/order';
import { ORDER_KEY, GM_CREATE } from '../../src/common/constants';
import { Settings } from '../../src/common/Settings';
import TextConfig from '../../src/module/i18n/config';

describe('order', () => {
    let settings = null;
    beforeEach(() => {
        settings = new Settings();
        settings.textConfig = new TextConfig();
    });

    afterEach(() => {
        settings = null;
    });
    describe('getColumn', () => {
        it('执行验证', () => {
            let column = order.getColumn(settings);
            expect(column.key).toBe(ORDER_KEY);
            expect(column.text).toBe('序号');
            expect(column.isAutoCreate).toBe(true);
            expect(column.isShow).toBe(true);
            expect(column.disableCustomize).toBe(true);
            expect(column.width).toBe(50);
            expect(column.fixed).toBe(undefined);
            expect(column.template()).toBe(`<td ${GM_CREATE} gm-order></td>`);
            expect(column.template(1, {}, 1, true)).toBe(`<td ${GM_CREATE} gm-order>1</td>`);
            column = null;

            // 验证不同的语言
            settings.i18n = 'zh-cn';
            expect(order.getColumn(settings).text).toBe('序号');
            settings.i18n = 'zh-tw';
            expect(order.getColumn(settings).text).toBe('序號');
            settings.i18n = 'en-us';
            expect(order.getColumn(settings).text).toBe('order');
        });
    });

});
