import { CLASS_DRAG_ING, CLASS_DREAMLAND, DISABLE_MOVE } from '@module/moveRow/constants';
describe('constants', () => {
    it('CLASS_DRAG_ING', () => {
        expect(CLASS_DRAG_ING).toBe('gm-move-row-ongoing');
    });
    it('CLASS_DREAMLAND', () => {
        expect(CLASS_DREAMLAND).toBe('dreamland-row-div');
    });
    it('DISABLE_MOVE', () => {
        expect(DISABLE_MOVE).toBe('disable-move');
    });
});
