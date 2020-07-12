import checkbox from '@module/checkbox';

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
});
