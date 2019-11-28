import { CLASS_ADJUST_ACTION, CLASS_ADJUST_SELECT } from '@module/adjust/constants';
describe('constants', () => {
    it('CLASS_ADJUST_ACTION', () => {
        expect(CLASS_ADJUST_ACTION).toBe('gm-adjust-action');
    });
    it('CLASS_ADJUST_SELECT', () => {
        expect(CLASS_ADJUST_SELECT).toBe('gm-adjust-selected');
    });
});
