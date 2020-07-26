import { CLASS_NO_CLICK, CLASS_CONFIG_ING, CLASS_CONFIG } from '../../src/module/config/constants';
describe('constants', () => {
    it('CLASS_NO_CLICK', () => {
        expect(CLASS_NO_CLICK).toBe('no-click');
    });
    it('CLASS_CONFIG_ING', () => {
        expect(CLASS_CONFIG_ING).toBe('gm-config-ing');
    });
    it('CLASS_CONFIG', () => {
        expect(CLASS_CONFIG).toBe('gm-config-area');
    });
});
