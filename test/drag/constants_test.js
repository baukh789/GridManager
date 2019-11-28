import { CLASS_DRAG_ACTION, CLASS_DRAG_ING, CLASS_DREAMLAND } from '@module/drag/constants';
describe('constants', () => {
    it('CLASS_DRAG_ACTION', () => {
        expect(CLASS_DRAG_ACTION).toBe('gm-drag-action');
    });
    it('CLASS_DRAG_ING', () => {
        expect(CLASS_DRAG_ING).toBe('gm-drag-ongoing');
    });
    it('CLASS_DREAMLAND', () => {
        expect(CLASS_DREAMLAND).toBe('gm-dreamland-div');
    });
});
